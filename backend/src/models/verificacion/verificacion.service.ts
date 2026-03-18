import { Injectable } from '@nestjs/common';
import { CreateVerificacionDto } from './dto/create-verificacion.dto';
import { UpdateVerificacionDto } from './dto/update-verificacion.dto';

@Injectable()
export class VerificacionService {
  create(createVerificacionDto: CreateVerificacionDto) {
    return 'This action adds a new verificacion';
  }

  findAll() {
    return `This action returns all verificacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} verificacion`;
  }

  update(id: number, updateVerificacionDto: UpdateVerificacionDto) {
    return `This action updates a #${id} verificacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} verificacion`;
  }
}
