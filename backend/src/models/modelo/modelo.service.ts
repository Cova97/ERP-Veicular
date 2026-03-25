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
    // Verificar que la marca padre exista
    const marca = await this.prisma.marca.findUnique({
      where: { id: createModeloDto.marcaId },
    });

    if (!marca) {
      throw new NotFoundException(
        `Marca con id ${createModeloDto.marcaId} no encontrada`,
      );
    }

    // Verificar que no exista el mismo nombre dentro de la misma marca
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

  // Obtener todos los modelos de una marca específica
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
    await this.findOne(id); // Lanza NotFoundException si no existe

    // Si cambia la marca, verificar que la nueva exista
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

    // Verificar que el nuevo nombre no esté en uso en la misma marca
    if (updateModeloDto.nombre || updateModeloDto.marcaId) {
      const actual = await this.prisma.modelo.findUnique({ where: { id } });
      const nombreFinal = updateModeloDto.nombre ?? actual.nombre;
      const marcaFinal = updateModeloDto.marcaId ?? actual.marcaId;

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
    await this.findOne(id); // Lanza NotFoundException si no existe

    // Bloquear si tiene submarcas asociadas
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