import { Injectable } from '@nestjs/common';
import { CreateServicioAmortiguadorDto } from './dto/create-servicio-amortiguador.dto';
import { UpdateServicioAmortiguadorDto } from './dto/update-servicio-amortiguador.dto';

@Injectable()
export class ServicioAmortiguadorService {
  create(createServicioAmortiguadorDto: CreateServicioAmortiguadorDto) {
    return 'This action adds a new servicioAmortiguador';
  }

  findAll() {
    return `This action returns all servicioAmortiguador`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servicioAmortiguador`;
  }

  update(id: number, updateServicioAmortiguadorDto: UpdateServicioAmortiguadorDto) {
    return `This action updates a #${id} servicioAmortiguador`;
  }

  remove(id: number) {
    return `This action removes a #${id} servicioAmortiguador`;
  }
}
