import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { StatusServicio } from '@prisma/client';
import { CreateServicioAceiteDto } from './dto/create-servicio-aceite.dto';
import { UpdateServicioAceiteDto } from './dto/update-servicio-aceite.dto';
import { RegistrarServicioAceiteDto } from './dto/registrar-servicio-aceite.dto';

@Injectable()
export class ServicioAceiteService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Helpers ────────────────────────────────────────────────

  /** Calcula la fecha del próximo servicio sumando N meses */
  private calcularProximaFecha(fechaUltima: Date, intervaloMeses: number): Date {
    const proxima = new Date(fechaUltima);
    proxima.setMonth(proxima.getMonth() + intervaloMeses);
    return proxima;
  }

  /**
   * Determina el status comparando km actuales del vehículo y fecha actual
   * contra los umbrales del próximo servicio.
   * - PENDIENTE  → ya venció por fecha O ya superó los km
   * - A_TIEMPO   → está dentro del rango (faltan menos del 10% de km o 2 semanas)
   * - FINALIZADO → recién registrado, al corriente
   */
  private calcularStatus(
    kmActual: number,
    proximoKm: number,
    proximaFecha: Date,
    intervaloKm: number,
  ): StatusServicio {
    const hoy = new Date();

    const kmVencido = kmActual >= proximoKm;
    const fechaVencida = hoy >= proximaFecha;

    if (kmVencido || fechaVencida) return StatusServicio.PENDIENTE;

    // Alerta cuando faltan menos del 10% del intervalo en km o menos de 14 días
    const kmRestantes = proximoKm - kmActual;
    const diasRestantes = Math.ceil(
      (proximaFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
    );

    const cercaPorKm = kmRestantes <= intervaloKm * 0.1;
    const cercaPorFecha = diasRestantes <= 14;

    if (cercaPorKm || cercaPorFecha) return StatusServicio.PENDIENTE;

    return StatusServicio.A_TIEMPO;
  }

  // ── CRUD principal ─────────────────────────────────────────

  async create(dto: CreateServicioAceiteDto) {
    // Verificar que el vehículo exista
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id: dto.vehiculoId },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${dto.vehiculoId} no encontrado`);
    }

    // Solo puede haber un registro de servicio de aceite por vehículo
    const existe = await this.prisma.servicioAceite.findFirst({
      where: { vehiculoId: dto.vehiculoId },
    });
    if (existe) {
      throw new ConflictException(
        `El vehículo ya tiene un servicio de aceite registrado (id: ${existe.id}). Usa el endpoint de registrar servicio para actualizarlo.`,
      );
    }

    const intervaloKm = dto.intervaloKm ?? 5000;
    const intervaloMeses = dto.intervaloMeses ?? 3;
    const fechaUltima = new Date(dto.fechaUltimoServicio);
    const proximoKm = dto.kmUltimoServicio + intervaloKm;
    const proximaFecha = this.calcularProximaFecha(fechaUltima, intervaloMeses);

    const status = this.calcularStatus(
      vehiculo.kilometraje,
      proximoKm,
      proximaFecha,
      intervaloKm,
    );

    return this.prisma.servicioAceite.create({
      data: {
        vehiculoId: dto.vehiculoId,
        fechaUltimoServicio: fechaUltima,
        kmUltimoServicio: dto.kmUltimoServicio,
        intervaloKm,
        intervaloMeses,
        proximoKm,
        proximaFecha,
        status,
      },
      include: { vehiculo: true },
    });
  }

  async findAll() {
    return this.prisma.servicioAceite.findMany({
      include: {
        vehiculo: true,
        _count: { select: { historial: true } },
      },
      orderBy: { proximaFecha: 'asc' },
    });
  }

  async findOne(id: number) {
    const servicio = await this.prisma.servicioAceite.findUnique({
      where: { id },
      include: {
        vehiculo: true,
        historial: { orderBy: { fecha: 'desc' } },
      },
    });

    if (!servicio) {
      throw new NotFoundException(`ServicioAceite con id ${id} no encontrado`);
    }

    return servicio;
  }

  async findByVehiculo(vehiculoId: number) {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id: vehiculoId },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${vehiculoId} no encontrado`);
    }

    return this.prisma.servicioAceite.findFirst({
      where: { vehiculoId },
      include: {
        historial: { orderBy: { fecha: 'desc' } },
      },
    });
  }

  async update(id: number, dto: UpdateServicioAceiteDto) {
    const servicio = await this.findOne(id);

    const intervaloKm = dto.intervaloKm ?? servicio.intervaloKm;
    const intervaloMeses = dto.intervaloMeses ?? servicio.intervaloMeses;
    const fechaUltima = dto.fechaUltimoServicio
      ? new Date(dto.fechaUltimoServicio)
      : servicio.fechaUltimoServicio;
    const kmUltimo = dto.kmUltimoServicio ?? servicio.kmUltimoServicio;

    const proximoKm = kmUltimo + intervaloKm;
    const proximaFecha = this.calcularProximaFecha(fechaUltima, intervaloMeses);

    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id: servicio.vehiculoId },
    });

    const status = this.calcularStatus(
      vehiculo.kilometraje,
      proximoKm,
      proximaFecha,
      intervaloKm,
    );

    return this.prisma.servicioAceite.update({
      where: { id },
      data: {
        ...dto,
        fechaUltimoServicio: fechaUltima,
        proximoKm,
        proximaFecha,
        status,
      },
      include: { vehiculo: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.servicioAceite.delete({ where: { id } });
  }

  // ── Registrar servicio realizado (genera historial) ────────

  /**
   * Registra que se realizó un cambio de aceite:
   * 1. Guarda la entrada en HistorialAceite
   * 2. Actualiza ServicioAceite con los nuevos km/fecha y recalcula próximos
   * 3. Actualiza el kilometraje del vehículo si el nuevo km es mayor
   * 4. Pone status en FINALIZADO
   */
  async registrarServicio(id: number, dto: RegistrarServicioAceiteDto) {
    const servicio = await this.findOne(id);

    if (dto.kmAlServicio < servicio.kmUltimoServicio) {
      throw new BadRequestException(
        `El kilometraje (${dto.kmAlServicio}) no puede ser menor al del último servicio (${servicio.kmUltimoServicio})`,
      );
    }

    const fechaServicio = new Date(dto.fecha);
    const proximoKm = dto.kmAlServicio + servicio.intervaloKm;
    const proximaFecha = this.calcularProximaFecha(fechaServicio, servicio.intervaloMeses);

    // Transacción: historial + actualizar servicio + actualizar km vehículo
    return this.prisma.$transaction(async (tx) => {
      // 1. Guardar en historial
      await tx.historialAceite.create({
        data: {
          servicioId: id,
          fecha: fechaServicio,
          kmAlServicio: dto.kmAlServicio,
          tipoAceite: dto.tipoAceite,
          taller: dto.taller,
          costo: dto.costo,
          notas: dto.notas,
        },
      });

      // 2. Actualizar km del vehículo si es mayor al actual
      const vehiculo = await tx.vehiculo.findUnique({
        where: { id: servicio.vehiculoId },
      });
      if (dto.kmAlServicio > vehiculo.kilometraje) {
        await tx.vehiculo.update({
          where: { id: servicio.vehiculoId },
          data: { kilometraje: dto.kmAlServicio },
        });
      }

      // 3. Actualizar el servicio de aceite
      return tx.servicioAceite.update({
        where: { id },
        data: {
          fechaUltimoServicio: fechaServicio,
          kmUltimoServicio: dto.kmAlServicio,
          proximoKm,
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
    return this.prisma.historialAceite.findMany({
      where: { servicioId: id },
      orderBy: { fecha: 'desc' },
    });
  }
}