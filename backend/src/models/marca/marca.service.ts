import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMarcaDto: CreateMarcaDto) {
    // Verificar que no exista una marca con el mismo nombre
    const existe = await this.prisma.marca.findUnique({
      where: { nombre: createMarcaDto.nombre },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe una marca con el nombre "${createMarcaDto.nombre}"`,
      );
    }

    return this.prisma.marca.create({
      data: createMarcaDto,
    });
  }

  async findAll() {
    return this.prisma.marca.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        // Incluye cuántos modelos tiene cada marca
        _count: { select: { modelos: true } },
      },
    });
  }

  async findOne(id: number) {
    const marca = await this.prisma.marca.findUnique({
      where: { id },
      include: {
        modelos: {
          include: {
            submarcas: true,
          },
        },
      },
    });

    if (!marca) {
      throw new NotFoundException(`Marca con id ${id} no encontrada`);
    }

    return marca;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    await this.findOne(id); // Lanza NotFoundException si no existe

    // Verificar que el nuevo nombre no esté en uso por otra marca
    if (updateMarcaDto.nombre) {
      const nombreEnUso = await this.prisma.marca.findFirst({
        where: {
          nombre: updateMarcaDto.nombre,
          NOT: { id },
        },
      });

      if (nombreEnUso) {
        throw new ConflictException(
          `Ya existe una marca con el nombre "${updateMarcaDto.nombre}"`,
        );
      }
    }

    return this.prisma.marca.update({
      where: { id },
      data: updateMarcaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Lanza NotFoundException si no existe

    // Verificar si tiene modelos relacionados antes de eliminar
    const tieneModelos = await this.prisma.modelo.count({
      where: { marcaId: id },
    });

    if (tieneModelos > 0) {
      throw new ConflictException(
        `No se puede eliminar la marca porque tiene ${tieneModelos} modelo(s) asociado(s)`,
      );
    }

    return this.prisma.marca.delete({ where: { id } });
  }
}