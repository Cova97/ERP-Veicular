import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePropietarioDto } from './dto/create-propietario.dto';
import { UpdatePropietarioDto } from './dto/update-propietario.dto';

@Injectable()
export class PropietarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPropietarioDto: CreatePropietarioDto) {
    // Verificar email único si se proporcionó
    if (createPropietarioDto.email) {
      const emailEnUso = await this.prisma.propietario.findUnique({
        where: { email: createPropietarioDto.email },
      });

      if (emailEnUso) {
        throw new ConflictException(
          `Ya existe un propietario con el email "${createPropietarioDto.email}"`,
        );
      }
    }

    return this.prisma.propietario.create({
      data: createPropietarioDto,
    });
  }

  async findAll() {
    return this.prisma.propietario.findMany({
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
      include: {
        // Cuántos vehículos tiene asignados
        _count: { select: { vehiculos: true } },
      },
    });
  }

  async findOne(id: number) {
    const propietario = await this.prisma.propietario.findUnique({
      where: { id },
      include: {
        vehiculos: {
          include: {
            submarca: {
              include: {
                modelo: {
                  include: { marca: true },
                },
              },
            },
          },
        },
      },
    });

    if (!propietario) {
      throw new NotFoundException(`Propietario con id ${id} no encontrado`);
    }

    return propietario;
  }

  async update(id: number, updatePropietarioDto: UpdatePropietarioDto) {
    await this.findOne(id); // Lanza NotFoundException si no existe

    // Verificar que el nuevo email no esté en uso por otro propietario
    if (updatePropietarioDto.email) {
      const emailEnUso = await this.prisma.propietario.findFirst({
        where: {
          email: updatePropietarioDto.email,
          NOT: { id },
        },
      });

      if (emailEnUso) {
        throw new ConflictException(
          `Ya existe un propietario con el email "${updatePropietarioDto.email}"`,
        );
      }
    }

    return this.prisma.propietario.update({
      where: { id },
      data: updatePropietarioDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Lanza NotFoundException si no existe

    // Bloquear si tiene vehículos asignados
    const tieneVehiculos = await this.prisma.vehiculo.count({
      where: { propietarioId: id },
    });

    if (tieneVehiculos > 0) {
      throw new ConflictException(
        `No se puede eliminar el propietario porque tiene ${tieneVehiculos} vehículo(s) asignado(s)`,
      );
    }

    return this.prisma.propietario.delete({ where: { id } });
  }
}