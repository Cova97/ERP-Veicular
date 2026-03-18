import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicioAmortiguadorService } from './servicio-amortiguador.service';
import { CreateServicioAmortiguadorDto } from './dto/create-servicio-amortiguador.dto';
import { UpdateServicioAmortiguadorDto } from './dto/update-servicio-amortiguador.dto';

@Controller('servicio-amortiguador')
export class ServicioAmortiguadorController {
  constructor(private readonly servicioAmortiguadorService: ServicioAmortiguadorService) {}

  @Post()
  create(@Body() createServicioAmortiguadorDto: CreateServicioAmortiguadorDto) {
    return this.servicioAmortiguadorService.create(createServicioAmortiguadorDto);
  }

  @Get()
  findAll() {
    return this.servicioAmortiguadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicioAmortiguadorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicioAmortiguadorDto: UpdateServicioAmortiguadorDto) {
    return this.servicioAmortiguadorService.update(+id, updateServicioAmortiguadorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicioAmortiguadorService.remove(+id);
  }
}
