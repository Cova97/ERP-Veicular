import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VerificacionService } from './verificacion.service';
import { CreateVerificacionDto } from './dto/create-verificacion.dto';
import { UpdateVerificacionDto } from './dto/update-verificacion.dto';

@Controller('verificacion')
export class VerificacionController {
  constructor(private readonly verificacionService: VerificacionService) {}

  @Post()
  create(@Body() createVerificacionDto: CreateVerificacionDto) {
    return this.verificacionService.create(createVerificacionDto);
  }

  @Get()
  findAll() {
    return this.verificacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.verificacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVerificacionDto: UpdateVerificacionDto) {
    return this.verificacionService.update(+id, updateVerificacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.verificacionService.remove(+id);
  }
}
