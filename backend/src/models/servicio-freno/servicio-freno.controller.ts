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
import { ServicioFrenoService } from './servicio-freno.service';
import { CreateServicioFrenoDto } from './dto/create-servicio-freno.dto';
import { UpdateServicioFrenoDto } from './dto/update-servicio-freno.dto';
import { RegistrarServicioFrenoDto } from './dto/registrar-servicio-freno.dto';

@Controller('servicio-freno')
export class ServicioFrenoController {
  constructor(private readonly servicioFrenoService: ServicioFrenoService) {}

  // POST /servicio-freno  — alta inicial
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createServicioFrenoDto: CreateServicioFrenoDto) {
    return this.servicioFrenoService.create(createServicioFrenoDto);
  }

  // GET /servicio-freno  — todos ordenados por proximoKm asc
  @Get()
  findAll() {
    return this.servicioFrenoService.findAll();
  }

  // GET /servicio-freno/vehiculo/:vehiculoId
  @Get('vehiculo/:vehiculoId')
  findByVehiculo(@Param('vehiculoId', ParseIntPipe) vehiculoId: number) {
    return this.servicioFrenoService.findByVehiculo(vehiculoId);
  }

  // GET /servicio-freno/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicioFrenoService.findOne(id);
  }

  // PATCH /servicio-freno/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServicioFrenoDto: UpdateServicioFrenoDto,
  ) {
    return this.servicioFrenoService.update(id, updateServicioFrenoDto);
  }

  // POST /servicio-freno/:id/registrar — marcar servicio como realizado
  @Post(':id/registrar')
  @HttpCode(HttpStatus.OK)
  registrarServicio(
    @Param('id', ParseIntPipe) id: number,
    @Body() registrarServicioFrenoDto: RegistrarServicioFrenoDto,
  ) {
    return this.servicioFrenoService.registrarServicio(id, registrarServicioFrenoDto);
  }

  // GET /servicio-freno/:id/historial
  @Get(':id/historial')
  findHistorial(@Param('id', ParseIntPipe) id: number) {
    return this.servicioFrenoService.findHistorial(id);
  }

  // DELETE /servicio-freno/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicioFrenoService.remove(id);
  }
}