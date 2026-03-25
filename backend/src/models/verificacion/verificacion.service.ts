import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { StatusServicio } from '@prisma/client';
import { CreateVerificacionDto } from './dto/create-verificacion.dto';
import { UpdateVerificacionDto } from './dto/update-verificacion.dto';
import { RegistrarVerificacionDto } from './dto/registrar-verificacion.dto';

@Injectable()
export class VerificacionService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Helpers ────────────────────────────────────────────────

  /** Calcula la fecha del próximo servicio sumando N meses */
  private calcularProximaFecha(fechaUltima: Date, intervaloMeses: number): Date {
    const proxima = new Date(fechaUltima);
    proxima.setMonth(proxima.getMonth() + intervaloMeses);
    return proxima;
  }

  /**
   * Determina el status en base a la proximaFecha.
   * - PENDIENTE → ya venció o faltan ≤14 días
   * - A_TIEMPO  → hay margen suficiente
   */
  private calcularStatus(proximaFecha: Date): StatusServicio {
    const hoy = new Date();

    if (hoy >= proximaFecha) return StatusServicio.PENDIENTE;

    const diasRestantes = Math.ceil(
      (proximaFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
    );

    return diasRestantes <= 14 ? StatusServicio.PENDIENTE : StatusServicio.A_TIEMPO;
  }

  // ── CRUD principal ─────────────────────────────────────────

  async create(dto: CreateVerificacionDto) {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id: dto.vehiculoId },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${dto.vehiculoId} no encontrado`);
    }

    // Solo puede haber una verificacion activa por vehículo
    const existe = await this.prisma.verificacion.findFirst({
      where: { vehiculoId: dto.vehiculoId },
    });
    if (existe) {
      throw new ConflictException(
        `El vehículo ya tiene una verificación registrada (id: ${existe.id}). Usa el endpoint de registrar para actualizarla.`,
      );
    }

    const intervaloMeses = dto.intervaloMeses ?? 12;
    const fechaUltima = new Date(dto.fechaUltima);
    const proximaFecha = this.calcularProximaFecha(fechaUltima, intervaloMeses);
    const status = this.calcularStatus(proximaFecha);

    return this.prisma.verificacion.create({
      data: {
        vehiculoId: dto.vehiculoId,
        fechaUltima,
        holograma: dto.holograma,
        centro: dto.centro,
        intervaloMeses,
        proximaFecha,
        status,
      },
      include: { vehiculo: true },
    });
  }

  async findAll() {
    return this.prisma.verificacion.findMany({
      include: {
        vehiculo: true,
        _count: { select: { historial: true } },
      },
      orderBy: { proximaFecha: 'asc' },
    });
  }

  async findOne(id: number) {
    const verificacion = await this.prisma.verificacion.findUnique({
      where: { id },
      include: {
        vehiculo: true,
        historial: { orderBy: { fecha: 'desc' } },
      },
    });

    if (!verificacion) {
      throw new NotFoundException(`Verificación con id ${id} no encontrada`);
    }

    return verificacion;
  }

  async findByVehiculo(vehiculoId: number) {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id: vehiculoId },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${vehiculoId} no encontrado`);
    }

    return this.prisma.verificacion.findFirst({
      where: { vehiculoId },
      include: {
        historial: { orderBy: { fecha: 'desc' } },
      },
    });
  }

  // Verificaciones próximas a vencer (útil para dashboard)
  async findProximasAVencer() {
    const en30dias = new Date();
    en30dias.setDate(en30dias.getDate() + 30);

    return this.prisma.verificacion.findMany({
      where: {
        proximaFecha: { lte: en30dias },
        status: { not: StatusServicio.FINALIZADO },
      },
      include: { vehiculo: true },
      orderBy: { proximaFecha: 'asc' },
    });
  }

  async update(id: number, dto: UpdateVerificacionDto) {
    const verificacion = await this.findOne(id);

    const intervaloMeses = dto.intervaloMeses ?? verificacion.intervaloMeses;
    const fechaUltima = dto.fechaUltima
      ? new Date(dto.fechaUltima)
      : verificacion.fechaUltima;

    const proximaFecha = this.calcularProximaFecha(fechaUltima, intervaloMeses);
    const status = this.calcularStatus(proximaFecha);

    return this.prisma.verificacion.update({
      where: { id },
      data: { ...dto, fechaUltima, proximaFecha, intervaloMeses, status },
      include: { vehiculo: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.verificacion.delete({ where: { id } });
  }

  // ── Registrar verificacion realizada ───────────────────────

  /**
   * Registra que se realizó una verificación:
   * 1. Guarda la entrada en HistorialVerificacion
   * 2. Actualiza fechaUltima, recalcula proximaFecha
   * 3. Pone status en FINALIZADO
   */
  async registrarVerificacion(id: number, dto: RegistrarVerificacionDto) {
    const verificacion = await this.findOne(id);

    const fechaVerificacion = new Date(dto.fecha);
    const proximaFecha = this.calcularProximaFecha(
      fechaVerificacion,
      verificacion.intervaloMeses,
    );

    return this.prisma.$transaction(async (tx) => {
      // 1. Guardar en historial
      await tx.historialVerificacion.create({
        data: {
          verificacionId: id,
          fecha: fechaVerificacion,
          holograma: dto.holograma,
          centro: dto.centro,
          costo: dto.costo,
          notas: dto.notas,
        },
      });

      // 2. Actualizar la verificacion
      return tx.verificacion.update({
        where: { id },
        data: {
          fechaUltima: fechaVerificacion,
          holograma: dto.holograma ?? verificacion.holograma,
          centro: dto.centro ?? verificacion.centro,
          proximaFecha,
          status: StatusServicio.FINALIZADO,
        },
        include: {
          vehiculo: true,
          historial: { orderBy: { fecha: 'desc' }, take: 5 },
        },
      });
    });
  }

  // ── Historial ──────────────────────────────────────────────

  async findHistorial(id: number) {
    await this.findOne(id);
    return this.prisma.historialVerificacion.findMany({
      where: { verificacionId: id },
      orderBy: { fecha: 'desc' },
    });
  }
}