import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubmarcaService } from './submarca.service';
import { CreateSubmarcaDto } from './dto/create-submarca.dto';
import { UpdateSubmarcaDto } from './dto/update-submarca.dto';

@Controller('submarca')
export class SubmarcaController {
  constructor(private readonly submarcaService: SubmarcaService) {}

  @Post()
  create(@Body() createSubmarcaDto: CreateSubmarcaDto) {
    return this.submarcaService.create(createSubmarcaDto);
  }

  @Get()
  findAll() {
    return this.submarcaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submarcaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubmarcaDto: UpdateSubmarcaDto) {
    return this.submarcaService.update(+id, updateSubmarcaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submarcaService.remove(+id);
  }
}
