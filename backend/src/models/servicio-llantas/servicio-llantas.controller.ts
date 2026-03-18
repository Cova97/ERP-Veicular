import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicioLlantasService } from './servicio-llantas.service';
import { CreateServicioLlantaDto } from './dto/create-servicio-llanta.dto';
import { UpdateServicioLlantaDto } from './dto/update-servicio-llanta.dto';

@Controller('servicio-llantas')
export class ServicioLlantasController {
  constructor(private readonly servicioLlantasService: ServicioLlantasService) {}

  @Post()
  create(@Body() createServicioLlantaDto: CreateServicioLlantaDto) {
    return this.servicioLlantasService.create(createServicioLlantaDto);
  }

  @Get()
  findAll() {
    return this.servicioLlantasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicioLlantasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicioLlantaDto: UpdateServicioLlantaDto) {
    return this.servicioLlantasService.update(+id, updateServicioLlantaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicioLlantasService.remove(+id);
  }
}
