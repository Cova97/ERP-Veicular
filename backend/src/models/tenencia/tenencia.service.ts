import { Injectable } from '@nestjs/common';
import { CreateTenenciaDto } from './dto/create-tenencia.dto';
import { UpdateTenenciaDto } from './dto/update-tenencia.dto';

@Injectable()
export class TenenciaService {
  create(createTenenciaDto: CreateTenenciaDto) {
    return 'This action adds a new tenencia';
  }

  findAll() {
    return `This action returns all tenencia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenencia`;
  }

  update(id: number, updateTenenciaDto: UpdateTenenciaDto) {
    return `This action updates a #${id} tenencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenencia`;
  }
}
