import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { StatusServicio } from '@prisma/client';
import { CreateServicioLlantaDto } from './dto/create-servicio-llanta.dto';
import { UpdateServicioLlantaDto } from './dto/update-servicio-llanta.dto';
import { RegistrarServicioLlantaDto } from './dto/registrar-servicio-llanta.dto';

@Injectable()
export class ServicioLlantasService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Helper ─────────────────────────────────────────────────

  /**
   * Determina el status comparando km actuales del vehículo contra proximoKm.
   * - PENDIENTE → ya superó los km o está dentro del 10% del intervalo
   * - A_TIEMPO  → al corriente con margen suficiente
   */
  private calcularStatus(
    kmActual: number,
    proximoKm: number,
    intervaloKm: number,
  ): StatusServicio {
    if (kmActual >= proximoKm) return StatusServicio.PENDIENTE;

    const kmRestantes = proximoKm - kmActual;
    const cercaPorKm = kmRestantes <= intervaloKm * 0.1;

    return cercaPorKm ? StatusServicio.PENDIENTE : StatusServicio.A_TIEMPO;
  }

  // ── CRUD principal ─────────────────────────────────────────

  async create(dto: CreateServicioLlantaDto) {
    const vehiculo = await this.prisma.vehiculo.findUniqueOrThrow({
      where: { id: dto.vehiculoId },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${dto.vehiculoId} no encontrado`);
    }

    const existe = await this.prisma.servicioLlantas.findFirst({
      where: { vehiculoId: dto.vehiculoId },
    });
    if (existe) {
      throw new ConflictException(
        `El vehículo ya tiene un servicio de llantas registrado (id: ${existe.id}). Usa el endpoint de registrar servicio para actualizarlo.`,
      );
    }

    const intervaloKm = dto.intervaloKm ?? 40000;
    const proximoKm = dto.kmUltimoServicio + intervaloKm;
    const status = this.calcularStatus(vehiculo.kilometraje, proximoKm, intervaloKm);

    return this.prisma.servicioLlantas.create({
      data: {
        vehiculoId: dto.vehiculoId,
        kmUltimoServicio: dto.kmUltimoServicio,
        intervaloKm,
        proximoKm,
        status,
      },
      include: { vehiculo: true },
    });
  }

  async findAll() {
    return this.prisma.servicioLlantas.findMany({
      include: {
        vehiculo: true,
        _count: { select: { historial: true } },
      },
      orderBy: { proximoKm: 'asc' },
    });
  }

  async findOne(id: number) {
    const servicio = await this.prisma.servicioLlantas.findUnique({
      where: { id },
      include: {
        vehiculo: true,
        historial: { orderBy: { fecha: 'desc' } },
      },
    });

    if (!servicio) {
      throw new NotFoundException(`ServicioLlantas con id ${id} no encontrado`);
    }

    return servicio;
  }

  async findByVehiculo(vehiculoId: number) {
    const vehiculo = await this.prisma.vehiculo.findUniqueOrThrow({
      where: { id: vehiculoId },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${vehiculoId} no encontrado`);
    }

    return this.prisma.servicioLlantas.findFirst({
      where: { vehiculoId },
      include: {
        historial: { orderBy: { fecha: 'desc' } },
      },
    });
  }

  async update(id: number, dto: UpdateServicioLlantaDto) {
    const servicio = await this.findOne(id);

    const intervaloKm = dto.intervaloKm ?? servicio.intervaloKm;
    const kmUltimo = dto.kmUltimoServicio ?? servicio.kmUltimoServicio;
    const proximoKm = kmUltimo + intervaloKm;

    const vehiculo = await this.prisma.vehiculo.findUniqueOrThrow({
      where: { id: servicio.vehiculoId },
    });
    const status = this.calcularStatus(vehiculo.kilometraje, proximoKm, intervaloKm);

    return this.prisma.servicioLlantas.update({
      where: { id },
      data: { ...dto, proximoKm, status },
      include: { vehiculo: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.servicioLlantas.delete({ where: { id } });
  }

  // ── Registrar servicio realizado ───────────────────────────

  async registrarServicio(id: number, dto: RegistrarServicioLlantaDto) {
    const servicio = await this.findOne(id);

    if (dto.kmAlServicio < servicio.kmUltimoServicio) {
      throw new BadRequestException(
        `El kilometraje (${dto.kmAlServicio}) no puede ser menor al del último servicio (${servicio.kmUltimoServicio})`,
      );
    }

    const proximoKm = dto.kmAlServicio + servicio.intervaloKm;

    return this.prisma.$transaction(async (tx) => {
      // 1. Guardar en historial
      await tx.historialLlantas.create({
        data: {
          servicioId: id,
          fecha: new Date(dto.fecha),
          kmAlServicio: dto.kmAlServicio,
          tipoServicio: dto.tipoServicio,
          marcaLlanta: dto.marcaLlanta,
          taller: dto.taller,
          costo: dto.costo,
          notas: dto.notas,
        },
      });

      // 2. Actualizar km del vehículo si es mayor al actual
      const vehiculo = await tx.vehiculo.findUniqueOrThrow({
        where: { id: servicio.vehiculoId },
      });
      if (dto.kmAlServicio > vehiculo.kilometraje) {
        await tx.vehiculo.update({
          where: { id: servicio.vehiculoId },
          data: { kilometraje: dto.kmAlServicio },
        });
      }

      // 3. Actualizar el servicio
      return tx.servicioLlantas.update({
        where: { id },
        data: {
          kmUltimoServicio: dto.kmAlServicio,
          proximoKm,
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
    return this.prisma.historialLlantas.findMany({
      where: { servicioId: id },
      orderBy: { fecha: 'desc' },
    });
  }
}