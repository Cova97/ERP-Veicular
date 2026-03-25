import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { ActualizarKilometrajeDto } from './dto/actualizar-kilometraje.dto';

@Injectable()
export class VehiculoService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Include completo reutilizable ──────────────────────────

  private get includeCompleto() {
    return {
      submarca: {
        include: {
          modelo: { include: { marca: true } },
        },
      },
      propietario: true,
      serviciosAceite: {
        include: { historial: { orderBy: { fecha: 'desc' }, take: 1 } },
      },
      verificaciones: {
        include: { historial: { orderBy: { fecha: 'desc' }, take: 1 } },
      },
      tenencias: {
        orderBy: { anioFiscal: 'desc' as const },
        take: 1,
      },
      serviciosLlantas: {
        include: { historial: { orderBy: { fecha: 'desc' }, take: 1 } },
      },
      serviciosAmortiguador: {
        include: { historial: { orderBy: { fecha: 'desc' }, take: 1 } },
      },
      serviciosFreno: {
        include: { historial: { orderBy: { fecha: 'desc' }, take: 1 } },
      },
    };
  }

  // ── CRUD principal ─────────────────────────────────────────

  async create(dto: CreateVehiculoDto) {
    // Verificar submarca
    const submarca = await this.prisma.submarca.findUnique({
      where: { id: dto.submarcaId },
      include: { modelo: { include: { marca: true } } },
    });
    if (!submarca) {
      throw new NotFoundException(`Submarca con id ${dto.submarcaId} no encontrada`);
    }

    // Verificar propietario si se envía
    if (dto.propietarioId) {
      const propietario = await this.prisma.propietario.findUnique({
        where: { id: dto.propietarioId },
      });
      if (!propietario) {
        throw new NotFoundException(`Propietario con id ${dto.propietarioId} no encontrado`);
      }
    }

    // Placa única
    const placaExiste = await this.prisma.vehiculo.findUnique({
      where: { numPlaca: dto.numPlaca },
    });
    if (placaExiste) {
      throw new ConflictException(`Ya existe un vehículo con la placa "${dto.numPlaca}"`);
    }

    // Serie única
    const serieExiste = await this.prisma.vehiculo.findUnique({
      where: { numSerie: dto.numSerie },
    });
    if (serieExiste) {
      throw new ConflictException(`Ya existe un vehículo con el número de serie "${dto.numSerie}"`);
    }

    return this.prisma.vehiculo.create({
      data: {
        ...dto,
        kilometraje: dto.kilometraje ?? 0,
      },
      include: {
        submarca: { include: { modelo: { include: { marca: true } } } },
        propietario: true,
      },
    });
  }

  async findAll() {
    return this.prisma.vehiculo.findMany({
      orderBy: { creadoEn: 'desc' },
      include: {
        submarca: {
          include: { modelo: { include: { marca: true } } },
        },
        propietario: true,
        // Solo el status de cada servicio para listado rápido
        serviciosAceite: { select: { status: true, proximaFecha: true, proximoKm: true } },
        verificaciones: { select: { status: true, proximaFecha: true } },
        tenencias: {
          where: { pagado: false },
          select: { status: true, anioFiscal: true, fechaLimite: true },
          take: 1,
        },
        serviciosLlantas: { select: { status: true, proximoKm: true } },
        serviciosAmortiguador: { select: { status: true, proximoKm: true } },
        serviciosFreno: { select: { status: true, proximoKm: true } },
      },
    });
  }

  async findOne(id: number) {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id },
      include: this.includeCompleto,
    });

    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${id} no encontrado`);
    }

    return vehiculo;
  }

  // Buscar por placa
  async findByPlaca(numPlaca: string) {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { numPlaca },
      include: this.includeCompleto,
    });

    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con placa "${numPlaca}" no encontrado`);
    }

    return vehiculo;
  }

  async update(id: number, dto: UpdateVehiculoDto) {
    await this.findOne(id); // Lanza NotFoundException si no existe

    // Verificar placa única si cambia
    if (dto.numPlaca) {
      const placaEnUso = await this.prisma.vehiculo.findFirst({
        where: { numPlaca: dto.numPlaca, NOT: { id } },
      });
      if (placaEnUso) {
        throw new ConflictException(`Ya existe un vehículo con la placa "${dto.numPlaca}"`);
      }
    }

    // Verificar serie única si cambia
    if (dto.numSerie) {
      const serieEnUso = await this.prisma.vehiculo.findFirst({
        where: { numSerie: dto.numSerie, NOT: { id } },
      });
      if (serieEnUso) {
        throw new ConflictException(`Ya existe un vehículo con el número de serie "${dto.numSerie}"`);
      }
    }

    // Verificar submarca si cambia
    if (dto.submarcaId) {
      const submarca = await this.prisma.submarca.findUnique({
        where: { id: dto.submarcaId },
      });
      if (!submarca) {
        throw new NotFoundException(`Submarca con id ${dto.submarcaId} no encontrada`);
      }
    }

    // Verificar propietario si cambia
    if (dto.propietarioId) {
      const propietario = await this.prisma.propietario.findUnique({
        where: { id: dto.propietarioId },
      });
      if (!propietario) {
        throw new NotFoundException(`Propietario con id ${dto.propietarioId} no encontrado`);
      }
    }

    return this.prisma.vehiculo.update({
      where: { id },
      data: dto,
      include: {
        submarca: { include: { modelo: { include: { marca: true } } } },
        propietario: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Lanza NotFoundException si no existe
    return this.prisma.vehiculo.delete({ where: { id } });
  }

  // ── Actualizar kilometraje ─────────────────────────────────

  /**
   * Endpoint dedicado para actualizar el odómetro del vehículo.
   * No permite reducir el km actual (odómetro solo sube).
   */
  async actualizarKilometraje(id: number, dto: ActualizarKilometrajeDto) {
    const vehiculo = await this.findOne(id);

    if (dto.kilometraje < vehiculo.kilometraje) {
      throw new BadRequestException(
        `El nuevo kilometraje (${dto.kilometraje}) no puede ser menor al actual (${vehiculo.kilometraje})`,
      );
    }

    return this.prisma.vehiculo.update({
      where: { id },
      data: { kilometraje: dto.kilometraje },
      include: {
        submarca: { include: { modelo: { include: { marca: true } } } },
        propietario: true,
        serviciosAceite: { select: { status: true, proximoKm: true, proximaFecha: true } },
        verificaciones: { select: { status: true, proximaFecha: true } },
        tenencias: { where: { pagado: false }, select: { status: true, anioFiscal: true, fechaLimite: true }, take: 1 },
        serviciosLlantas: { select: { status: true, proximoKm: true } },
        serviciosAmortiguador: { select: { status: true, proximoKm: true } },
        serviciosFreno: { select: { status: true, proximoKm: true } },
      },
    });
  }
}