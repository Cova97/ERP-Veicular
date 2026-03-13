import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicioFrenoService } from './servicio-freno.service';
import { CreateServicioFrenoDto } from './dto/create-servicio-freno.dto';
import { UpdateServicioFrenoDto } from './dto/update-servicio-freno.dto';

@Controller('servicio-freno')
export class ServicioFrenoController {
  constructor(private readonly servicioFrenoService: ServicioFrenoService) {}

  @Post()
  create(@Body() createServicioFrenoDto: CreateServicioFrenoDto) {
    return this.servicioFrenoService.create(createServicioFrenoDto);
  }

  @Get()
  findAll() {
    return this.servicioFrenoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicioFrenoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicioFrenoDto: UpdateServicioFrenoDto) {
    return this.servicioFrenoService.update(+id, updateServicioFrenoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicioFrenoService.remove(+id);
  }
}
