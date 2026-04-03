import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';

@Injectable()
export class ModeloService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createModeloDto: CreateModeloDto) {
    const marca = await this.prisma.marca.findUnique({
      where: { id: createModeloDto.marcaId },
    });

    if (!marca) {
      throw new NotFoundException(
        `Marca con id ${createModeloDto.marcaId} no encontrada`,
      );
    }

    const existe = await this.prisma.modelo.findUnique({
      where: {
        nombre_marcaId: {
          nombre: createModeloDto.nombre,
          marcaId: createModeloDto.marcaId,
        },
      },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe el modelo "${createModeloDto.nombre}" para la marca "${marca.nombre}"`,
      );
    }

    return this.prisma.modelo.create({
      data: createModeloDto,
      include: { marca: true },
    });
  }

  async findAll() {
    return this.prisma.modelo.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        marca: true,
        _count: { select: { submarcas: true } },
      },
    });
  }

  async findByMarca(marcaId: number) {
    const marca = await this.prisma.marca.findUnique({
      where: { id: marcaId },
    });

    if (!marca) {
      throw new NotFoundException(`Marca con id ${marcaId} no encontrada`);
    }

    return this.prisma.modelo.findMany({
      where: { marcaId },
      orderBy: { nombre: 'asc' },
      include: {
        submarcas: true,
        _count: { select: { submarcas: true } },
      },
    });
  }

  async findOne(id: number) {
    const modelo = await this.prisma.modelo.findUnique({
      where: { id },
      include: {
        marca: true,
        submarcas: true,
      },
    });

    if (!modelo) {
      throw new NotFoundException(`Modelo con id ${id} no encontrado`);
    }

    return modelo;
  }

  async update(id: number, updateModeloDto: UpdateModeloDto) {
    const actual = await this.findOne(id);

    if (updateModeloDto.marcaId) {
      const marca = await this.prisma.marca.findUnique({
        where: { id: updateModeloDto.marcaId },
      });

      if (!marca) {
        throw new NotFoundException(
          `Marca con id ${updateModeloDto.marcaId} no encontrada`,
        );
      }
    }

    if (updateModeloDto.nombre || updateModeloDto.marcaId) {
      const nombreFinal = updateModeloDto.nombre ?? actual.nombre;
      const marcaFinal  = updateModeloDto.marcaId ?? actual.marcaId;

      const nombreEnUso = await this.prisma.modelo.findFirst({
        where: {
          nombre: nombreFinal,
          marcaId: marcaFinal,
          NOT: { id },
        },
      });

      if (nombreEnUso) {
        throw new ConflictException(
          `Ya existe el modelo "${nombreFinal}" en esa marca`,
        );
      }
    }

    return this.prisma.modelo.update({
      where: { id },
      data: updateModeloDto,
      include: { marca: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const tieneSubmarcas = await this.prisma.submarca.count({
      where: { modeloId: id },
    });

    if (tieneSubmarcas > 0) {
      throw new ConflictException(
        `No se puede eliminar el modelo porque tiene ${tieneSubmarcas} submarca(s) asociada(s)`,
      );
    }

    return this.prisma.modelo.delete({ where: { id } });
  }
}