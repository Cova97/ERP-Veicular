import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { StatusServicio } from '@prisma/client';
import { CreateTenenciaDto } from './dto/create-tenencia.dto';
import { UpdateTenenciaDto } from './dto/update-tenencia.dto';
import { PagarTenenciaDto } from './dto/pagar-tenencia.dto';

@Injectable()
export class TenenciaService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Helper ─────────────────────────────────────────────────

  /**
   * Determina el status en base a la fecha límite de pago y si ya fue pagada.
   * - FINALIZADO → ya está pagada
   * - PENDIENTE  → fecha límite vencida sin pago o faltan ≤30 días
   * - A_TIEMPO   → aún hay margen suficiente
   */
  private calcularStatus(pagado: boolean, fechaLimite: Date): StatusServicio {
    if (pagado) return StatusServicio.FINALIZADO;

    const hoy = new Date();
    if (hoy >= fechaLimite) return StatusServicio.PENDIENTE;

    const diasRestantes = Math.ceil(
      (fechaLimite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
    );

    return diasRestantes <= 30 ? StatusServicio.PENDIENTE : StatusServicio.A_TIEMPO;
  }

  // ── CRUD principal ─────────────────────────────────────────

  async create(dto: CreateTenenciaDto) {
    // Verificar que el vehículo exista
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id: dto.vehiculoId },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${dto.vehiculoId} no encontrado`);
    }

    // @@unique([vehiculoId, anioFiscal]) — solo una tenencia por año por vehículo
    const existe = await this.prisma.tenencia.findUnique({
      where: {
        vehiculoId_anioFiscal: {
          vehiculoId: dto.vehiculoId,
          anioFiscal: dto.anioFiscal,
        },
      },
    });
    if (existe) {
      throw new ConflictException(
        `Ya existe una tenencia para el año ${dto.anioFiscal} en este vehículo`,
      );
    }

    const fechaLimite = new Date(dto.fechaLimite);
    const status = this.calcularStatus(false, fechaLimite);

    return this.prisma.tenencia.create({
      data: {
        vehiculoId: dto.vehiculoId,
        anioFiscal: dto.anioFiscal,
        fechaLimite,
        pagado: false,
        status,
      },
      include: { vehiculo: true },
    });
  }

  async findAll() {
    return this.prisma.tenencia.findMany({
      include: {
        vehiculo: true,
        _count: { select: { historial: true } },
      },
      orderBy: [{ pagado: 'asc' }, { fechaLimite: 'asc' }],
    });
  }

  // Todas las tenencias de un vehículo
  async findByVehiculo(vehiculoId: number) {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id: vehiculoId },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${vehiculoId} no encontrado`);
    }

    return this.prisma.tenencia.findMany({
      where: { vehiculoId },
      orderBy: { anioFiscal: 'desc' },
      include: {
        historial: { orderBy: { fechaPago: 'desc' } },
      },
    });
  }

  // Tenencias pendientes de pago (útil para dashboard de alertas)
  async findPendientes() {
    return this.prisma.tenencia.findMany({
      where: { pagado: false },
      include: { vehiculo: true },
      orderBy: { fechaLimite: 'asc' },
    });
  }

  async findOne(id: number) {
    const tenencia = await this.prisma.tenencia.findUnique({
      where: { id },
      include: {
        vehiculo: true,
        historial: { orderBy: { fechaPago: 'desc' } },
      },
    });

    if (!tenencia) {
      throw new NotFoundException(`Tenencia con id ${id} no encontrada`);
    }

    return tenencia;
  }

  async update(id: number, dto: UpdateTenenciaDto) {
    const tenencia = await this.findOne(id);

    // No permitir cambiar el año fiscal si ya está pagada
    if (tenencia.pagado && dto.anioFiscal) {
      throw new BadRequestException(
        'No se puede modificar el año fiscal de una tenencia ya pagada',
      );
    }

    // Si cambia el anioFiscal, verificar que no exista ya para ese año
    if (dto.anioFiscal && dto.anioFiscal !== tenencia.anioFiscal) {
      const existe = await this.prisma.tenencia.findUnique({
        where: {
          vehiculoId_anioFiscal: {
            vehiculoId: tenencia.vehiculoId,
            anioFiscal: dto.anioFiscal,
          },
        },
      });
      if (existe) {
        throw new ConflictException(
          `Ya existe una tenencia para el año ${dto.anioFiscal} en este vehículo`,
        );
      }
    }

    const fechaLimite = dto.fechaLimite
      ? new Date(dto.fechaLimite)
      : tenencia.fechaLimite;

    const status = this.calcularStatus(tenencia.pagado, fechaLimite);

    return this.prisma.tenencia.update({
      where: { id },
      data: { ...dto, fechaLimite, status },
      include: { vehiculo: true },
    });
  }

  async remove(id: number) {
    const tenencia = await this.findOne(id);

    if (tenencia.pagado) {
      throw new ConflictException(
        'No se puede eliminar una tenencia que ya fue pagada',
      );
    }

    return this.prisma.tenencia.delete({ where: { id } });
  }

  // ── Registrar pago ─────────────────────────────────────────

  /**
   * Registra el pago de la tenencia:
   * 1. Guarda la entrada en HistorialTenencia
   * 2. Marca la tenencia como pagada y status FINALIZADO
   */
  async pagarTenencia(id: number, dto: PagarTenenciaDto) {
    const tenencia = await this.findOne(id);

    if (tenencia.pagado) {
      throw new ConflictException(
        `La tenencia del año ${tenencia.anioFiscal} ya fue pagada`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Guardar en historial
      await tx.historialTenencia.create({
        data: {
          tenenciaId: id,
          anioFiscal: tenencia.anioFiscal,
          fechaPago: new Date(dto.fechaPago),
          monto: dto.monto,
          folio: dto.folio,
          notas: dto.notas,
        },
      });

      // 2. Marcar como pagada
      return tx.tenencia.update({
        where: { id },
        data: {
          pagado: true,
          fechaPago: new Date(dto.fechaPago),
          monto: dto.monto,
          folio: dto.folio,
          status: StatusServicio.FINALIZADO,
        },
        include: {
          vehiculo: true,
          historial: { orderBy: { fechaPago: 'desc' } },
        },
      });
    });
  }

  // ── Historial ──────────────────────────────────────────────

  async findHistorial(id: number) {
    await this.findOne(id);
    return this.prisma.historialTenencia.findMany({
      where: { tenenciaId: id },
      orderBy: { fechaPago: 'desc' },
    });
  }
}