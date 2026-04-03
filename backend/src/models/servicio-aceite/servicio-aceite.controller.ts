import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServicioAceiteService } from './servicio-aceite.service';
import { CreateServicioAceiteDto } from './dto/create-servicio-aceite.dto';
import { UpdateServicioAceiteDto } from './dto/update-servicio-aceite.dto';
import { RegistrarServicioAceiteDto } from './dto/registrar-servicio-aceite.dto';

@Controller('servicio-aceite')
export class ServicioAceiteController {
  constructor(private readonly servicioAceiteService: ServicioAceiteService) {}

  // POST /servicio-aceite  — alta inicial del servicio en un vehículo
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createServicioAceiteDto: CreateServicioAceiteDto) {
    return this.servicioAceiteService.create(createServicioAceiteDto);
  }

  // GET /servicio-aceite  — todos (ordenados por proximaFecha asc)
  @Get()
  findAll() {
    return this.servicioAceiteService.findAll();
  }

  // GET /servicio-aceite/vehiculo/:vehiculoId  — servicio del vehículo con historial
  @Get('vehiculo/:vehiculoId')
  findByVehiculo(@Param('vehiculoId', ParseIntPipe) vehiculoId: number) {
    return this.servicioAceiteService.findByVehiculo(vehiculoId);
  }

  // GET /servicio-aceite/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicioAceiteService.findOne(id);
  }

  // PATCH /servicio-aceite/:id  — editar intervalos o corregir datos
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServicioAceiteDto: UpdateServicioAceiteDto,
  ) {
    return this.servicioAceiteService.update(id, updateServicioAceiteDto);
  }

  // POST /servicio-aceite/:id/registrar  — marcar servicio como realizado
  @Post(':id/registrar')
  @HttpCode(HttpStatus.OK)
  registrarServicio(
    @Param('id', ParseIntPipe) id: number,
    @Body() registrarServicioAceiteDto: RegistrarServicioAceiteDto,
  ) {
    return this.servicioAceiteService.registrarServicio(id, registrarServicioAceiteDto);
  }

  // GET /servicio-aceite/:id/historial  — historial completo de cambios
  @Get(':id/historial')
  findHistorial(@Param('id', ParseIntPipe) id: number) {
    return this.servicioAceiteService.findHistorial(id);
  }

  // DELETE /servicio-aceite/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicioAceiteService.remove(id);
  }
}