import { Injectable } from '@nestjs/common';
import { CreateServicioLlantaDto } from './dto/create-servicio-llanta.dto';
import { UpdateServicioLlantaDto } from './dto/update-servicio-llanta.dto';

@Injectable()
export class ServicioLlantasService {
  create(createServicioLlantaDto: CreateServicioLlantaDto) {
    return 'This action adds a new servicioLlanta';
  }

  findAll() {
    return `This action returns all servicioLlantas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servicioLlanta`;
  }

  update(id: number, updateServicioLlantaDto: UpdateServicioLlantaDto) {
    return `This action updates a #${id} servicioLlanta`;
  }

  remove(id: number) {
    return `This action removes a #${id} servicioLlanta`;
  }
}
