import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicioAceiteService } from './servicio-aceite.service';
import { CreateServicioAceiteDto } from './dto/create-servicio-aceite.dto';
import { UpdateServicioAceiteDto } from './dto/update-servicio-aceite.dto';

@Controller('servicio-aceite')
export class ServicioAceiteController {
  constructor(private readonly servicioAceiteService: ServicioAceiteService) {}

  @Post()
  create(@Body() createServicioAceiteDto: CreateServicioAceiteDto) {
    return this.servicioAceiteService.create(createServicioAceiteDto);
  }

  @Get()
  findAll() {
    return this.servicioAceiteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicioAceiteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicioAceiteDto: UpdateServicioAceiteDto) {
    return this.servicioAceiteService.update(+id, updateServicioAceiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicioAceiteService.remove(+id);
  }
}
