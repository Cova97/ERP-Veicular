import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateSubmarcaDto } from './dto/create-submarca.dto';
import { UpdateSubmarcaDto } from './dto/update-submarca.dto';

@Injectable()
export class SubmarcaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubmarcaDto) {
    const modelo = await this.prisma.modelo.findUnique({
      where: { id: dto.modeloId },
      include: { marca: true },
    });
    if (!modelo) {
      throw new NotFoundException(`Modelo con id ${dto.modeloId} no encontrado`);
    }

    const existe = await this.prisma.submarca.findUnique({
      where: {
        nombre_modeloId: {
          nombre: dto.nombre,
          modeloId: dto.modeloId,
        },
      },
    });
    if (existe) {
      throw new ConflictException(
        `Ya existe la submarca "${dto.nombre}" para el modelo "${modelo.nombre}" de ${modelo.marca.nombre}`,
      );
    }

    return this.prisma.submarca.create({
      data: dto,
      include: {
        modelo: { include: { marca: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.submarca.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        modelo: { include: { marca: true } },
        _count: { select: { vehiculos: true } },
      },
    });
  }

  async findByModelo(modeloId: number) {
    const modelo = await this.prisma.modelo.findUnique({
      where: { id: modeloId },
      include: { marca: true },
    });
    if (!modelo) {
      throw new NotFoundException(`Modelo con id ${modeloId} no encontrado`);
    }

    return this.prisma.submarca.findMany({
      where: { modeloId },
      orderBy: { nombre: 'asc' },
      include: {
        _count: { select: { vehiculos: true } },
      },
    });
  }

  async findOne(id: number) {
    const submarca = await this.prisma.submarca.findUnique({
      where: { id },
      include: {
        modelo: { include: { marca: true } },
        vehiculos: true,
      },
    });

    if (!submarca) {
      throw new NotFoundException(`Submarca con id ${id} no encontrada`);
    }

    return submarca;
  }

  async update(id: number, dto: UpdateSubmarcaDto) {
    const actual = await this.findOne(id);

    if (dto.modeloId) {
      const modelo = await this.prisma.modelo.findUnique({
        where: { id: dto.modeloId },
      });
      if (!modelo) {
        throw new NotFoundException(`Modelo con id ${dto.modeloId} no encontrado`);
      }
    }

    if (dto.nombre || dto.modeloId) {
      const nombreFinal = dto.nombre    ?? actual.nombre;
      const modeloFinal = dto.modeloId  ?? actual.modeloId;

      const nombreEnUso = await this.prisma.submarca.findFirst({
        where: {
          nombre: nombreFinal,
          modeloId: modeloFinal,
          NOT: { id },
        },
      });
      if (nombreEnUso) {
        throw new ConflictException(
          `Ya existe la submarca "${nombreFinal}" en ese modelo`,
        );
      }
    }

    return this.prisma.submarca.update({
      where: { id },
      data: dto,
      include: {
        modelo: { include: { marca: true } },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const tieneVehiculos = await this.prisma.vehiculo.count({
      where: { submarcaId: id },
    });
    if (tieneVehiculos > 0) {
      throw new ConflictException(
        `No se puede eliminar la submarca porque tiene ${tieneVehiculos} vehículo(s) asociado(s)`,
      );
    }

    return this.prisma.submarca.delete({ where: { id } });
  }
}