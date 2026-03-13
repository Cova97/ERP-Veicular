import { Injectable } from '@nestjs/common';
import { CreatePropietarioDto } from './dto/create-propietario.dto';
import { UpdatePropietarioDto } from './dto/update-propietario.dto';

@Injectable()
export class PropietarioService {
  create(createPropietarioDto: CreatePropietarioDto) {
    return 'This action adds a new propietario';
  }

  findAll() {
    return `This action returns all propietario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} propietario`;
  }

  update(id: number, updatePropietarioDto: UpdatePropietarioDto) {
    return `This action updates a #${id} propietario`;
  }

  remove(id: number) {
    return `This action removes a #${id} propietario`;
  }
}
