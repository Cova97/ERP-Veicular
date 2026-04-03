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
import { ServicioLlantasService } from './servicio-llantas.service';
import { CreateServicioLlantaDto } from './dto/create-servicio-llanta.dto';
import { UpdateServicioLlantaDto } from './dto/update-servicio-llanta.dto';
import { RegistrarServicioLlantaDto } from './dto/registrar-servicio-llanta.dto';

@Controller('servicio-llantas')
export class ServicioLlantasController {
  constructor(private readonly servicioLlantasService: ServicioLlantasService) {}

  // POST /servicio-llantas  — alta inicial
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createServicioLlantaDto: CreateServicioLlantaDto) {
    return this.servicioLlantasService.create(createServicioLlantaDto);
  }

  // GET /servicio-llantas  — todos ordenados por proximoKm asc
  @Get()
  findAll() {
    return this.servicioLlantasService.findAll();
  }

  // GET /servicio-llantas/vehiculo/:vehiculoId
  @Get('vehiculo/:vehiculoId')
  findByVehiculo(@Param('vehiculoId', ParseIntPipe) vehiculoId: number) {
    return this.servicioLlantasService.findByVehiculo(vehiculoId);
  }

  // GET /servicio-llantas/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicioLlantasService.findOne(id);
  }

  // PATCH /servicio-llantas/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServicioLlantaDto: UpdateServicioLlantaDto,
  ) {
    return this.servicioLlantasService.update(id, updateServicioLlantaDto);
  }

  // POST /servicio-llantas/:id/registrar — marcar servicio como realizado
  @Post(':id/registrar')
  @HttpCode(HttpStatus.OK)
  registrarServicio(
    @Param('id', ParseIntPipe) id: number,
    @Body() registrarServicioLlantaDto: RegistrarServicioLlantaDto,
  ) {
    return this.servicioLlantasService.registrarServicio(id, registrarServicioLlantaDto);
  }

  // GET /servicio-llantas/:id/historial
  @Get(':id/historial')
  findHistorial(@Param('id', ParseIntPipe) id: number) {
    return this.servicioLlantasService.findHistorial(id);
  }

  // DELETE /servicio-llantas/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicioLlantasService.remove(id);
  }
}