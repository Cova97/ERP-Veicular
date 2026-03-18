import { Injectable } from '@nestjs/common';
import { CreateSubmarcaDto } from './dto/create-submarca.dto';
import { UpdateSubmarcaDto } from './dto/update-submarca.dto';

@Injectable()
export class SubmarcaService {
  create(createSubmarcaDto: CreateSubmarcaDto) {
    return 'This action adds a new submarca';
  }

  findAll() {
    return `This action returns all submarca`;
  }

  findOne(id: number) {
    return `This action returns a #${id} submarca`;
  }

  update(id: number, updateSubmarcaDto: UpdateSubmarcaDto) {
    return `This action updates a #${id} submarca`;
  }

  remove(id: number) {
    return `This action removes a #${id} submarca`;
  }
}
