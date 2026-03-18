import { Injectable } from '@nestjs/common';
import { CreateServicioAceiteDto } from './dto/create-servicio-aceite.dto';
import { UpdateServicioAceiteDto } from './dto/update-servicio-aceite.dto';

@Injectable()
export class ServicioAceiteService {
  create(createServicioAceiteDto: CreateServicioAceiteDto) {
    return 'This action adds a new servicioAceite';
  }

  findAll() {
    return `This action returns all servicioAceite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servicioAceite`;
  }

  update(id: number, updateServicioAceiteDto: UpdateServicioAceiteDto) {
    return `This action updates a #${id} servicioAceite`;
  }

  remove(id: number) {
    return `This action removes a #${id} servicioAceite`;
  }
}
