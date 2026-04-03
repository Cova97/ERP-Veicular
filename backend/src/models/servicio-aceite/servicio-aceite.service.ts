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

  private calcularProximaFecha(fechaUltima: Date, intervaloMeses: number): Date {
    const proxima = new Date(fechaUltima);
    proxima.setMonth(proxima.getMonth() + intervaloMeses);
    return proxima;
  }

  private calcularStatus(
    kmActual: number,
    proximoKm: number,
    proximaFecha: Date,
    intervaloKm: number,
  ): StatusServicio {
    const hoy = new Date();
    if (kmActual >= proximoKm || hoy >= proximaFecha) return StatusServicio.PENDIENTE;
    const kmRestantes  = proximoKm - kmActual;
    const diasRestantes = Math.ceil(
      (proximaFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (kmRestantes <= intervaloKm * 0.1 || diasRestantes <= 14) return StatusServicio.PENDIENTE;
    return StatusServicio.A_TIEMPO;
  }

  async create(dto: CreateServicioAceiteDto) {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id: dto.vehiculoId },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${dto.vehiculoId} no encontrado`);
    }

    const existe = await this.prisma.servicioAceite.findFirst({
      where: { vehiculoId: dto.vehiculoId },
    });
    if (existe) {
      throw new ConflictException(
        `El vehículo ya tiene un servicio de aceite registrado (id: ${existe.id}).`,
      );
    }

    const intervaloKm    = dto.intervaloKm    ?? 5000;
    const intervaloMeses = dto.intervaloMeses ?? 3;
    const fechaUltima    = new Date(dto.fechaUltimoServicio);
    const proximoKm      = dto.kmUltimoServicio + intervaloKm;
    const proximaFecha   = this.calcularProximaFecha(fechaUltima, intervaloMeses);
    const status         = this.calcularStatus(vehiculo.kilometraje, proximoKm, proximaFecha, intervaloKm);

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
    const vehiculo = await this.prisma.vehiculo.findUnique({ where: { id: vehiculoId } });
    if (!vehiculo) throw new NotFoundException(`Vehículo con id ${vehiculoId} no encontrado`);
    return this.prisma.servicioAceite.findFirst({
      where: { vehiculoId },
      include: { historial: { orderBy: { fecha: 'desc' } } },
    });
  }

  async update(id: number, dto: UpdateServicioAceiteDto) {
    const servicio = await this.findOne(id);
    const intervaloKm    = dto.intervaloKm    ?? servicio.intervaloKm;
    const intervaloMeses = dto.intervaloMeses ?? servicio.intervaloMeses;
    const fechaUltima    = dto.fechaUltimoServicio ? new Date(dto.fechaUltimoServicio) : servicio.fechaUltimoServicio;
    const kmUltimo       = dto.kmUltimoServicio    ?? servicio.kmUltimoServicio;
    const proximoKm      = kmUltimo + intervaloKm;
    const proximaFecha   = this.calcularProximaFecha(fechaUltima, intervaloMeses);

    const vehiculo = await this.prisma.vehiculo.findUniqueOrThrow({ where: { id: servicio.vehiculoId } });
    const status   = this.calcularStatus(vehiculo.kilometraje, proximoKm, proximaFecha, intervaloKm);

    return this.prisma.servicioAceite.update({
      where: { id },
      data: { ...dto, fechaUltimoServicio: fechaUltima, proximoKm, proximaFecha, status },
      include: { vehiculo: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.servicioAceite.delete({ where: { id } });
  }

  async registrarServicio(id: number, dto: RegistrarServicioAceiteDto) {
    const servicio = await this.findOne(id);

    if (dto.kmAlServicio < servicio.kmUltimoServicio) {
      throw new BadRequestException(
        `El kilometraje (${dto.kmAlServicio}) no puede ser menor al del último servicio (${servicio.kmUltimoServicio})`,
      );
    }

    const fechaServicio = new Date(dto.fecha);
    const proximoKm     = dto.kmAlServicio + servicio.intervaloKm;
    const proximaFecha  = this.calcularProximaFecha(fechaServicio, servicio.intervaloMeses);

    return this.prisma.$transaction(async (tx) => {
      await tx.historialAceite.create({
        data: {
          servicioId:  id,
          fecha:       fechaServicio,
          kmAlServicio: dto.kmAlServicio,
          tipoAceite:  dto.tipoAceite,
          taller:      dto.taller,
          costo:       dto.costo,
          notas:       dto.notas,
        },
      });

      const vehiculo = await tx.vehiculo.findUniqueOrThrow({ where: { id: servicio.vehiculoId } });
      if (dto.kmAlServicio > vehiculo.kilometraje) {
        await tx.vehiculo.update({
          where: { id: servicio.vehiculoId },
          data:  { kilometraje: dto.kmAlServicio },
        });
      }

      return tx.servicioAceite.update({
        where: { id },
        data: {
          fechaUltimoServicio: fechaServicio,
          kmUltimoServicio:    dto.kmAlServicio,
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

  async findHistorial(id: number) {
    await this.findOne(id);
    return this.prisma.historialAceite.findMany({
      where: { servicioId: id },
      orderBy: { fecha: 'desc' },
    });
  }
}