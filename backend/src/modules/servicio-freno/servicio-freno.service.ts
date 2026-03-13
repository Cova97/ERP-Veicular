import { Injectable } from '@nestjs/common';
import { CreateServicioFrenoDto } from './dto/create-servicio-freno.dto';
import { UpdateServicioFrenoDto } from './dto/update-servicio-freno.dto';

@Injectable()
export class ServicioFrenoService {
  create(createServicioFrenoDto: CreateServicioFrenoDto) {
    return 'This action adds a new servicioFreno';
  }

  findAll() {
    return `This action returns all servicioFreno`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servicioFreno`;
  }

  update(id: number, updateServicioFrenoDto: UpdateServicioFrenoDto) {
    return `This action updates a #${id} servicioFreno`;
  }

  remove(id: number) {
    return `This action removes a #${id} servicioFreno`;
  }
}
