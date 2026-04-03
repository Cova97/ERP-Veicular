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
import { ServicioAmortiguadorService } from './servicio-amortiguador.service';
import { CreateServicioAmortiguadorDto } from './dto/create-servicio-amortiguador.dto';
import { UpdateServicioAmortiguadorDto } from './dto/update-servicio-amortiguador.dto';
import { RegistrarServicioAmortiguadorDto } from './dto/registrar-servicio-amortiguador.dto';

@Controller('servicio-amortiguador')
export class ServicioAmortiguadorController {
  constructor(private readonly servicioAmortiguadorService: ServicioAmortiguadorService) {}

  // POST /servicio-amortiguador  — alta inicial
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createServicioAmortiguadorDto: CreateServicioAmortiguadorDto) {
    return this.servicioAmortiguadorService.create(createServicioAmortiguadorDto);
  }

  // GET /servicio-amortiguador  — todos ordenados por proximoKm asc
  @Get()
  findAll() {
    return this.servicioAmortiguadorService.findAll();
  }

  // GET /servicio-amortiguador/vehiculo/:vehiculoId
  @Get('vehiculo/:vehiculoId')
  findByVehiculo(@Param('vehiculoId', ParseIntPipe) vehiculoId: number) {
    return this.servicioAmortiguadorService.findByVehiculo(vehiculoId);
  }

  // GET /servicio-amortiguador/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicioAmortiguadorService.findOne(id);
  }

  // PATCH /servicio-amortiguador/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServicioAmortiguadorDto: UpdateServicioAmortiguadorDto,
  ) {
    return this.servicioAmortiguadorService.update(id, updateServicioAmortiguadorDto);
  }

  // POST /servicio-amortiguador/:id/registrar — marcar servicio como realizado
  @Post(':id/registrar')
  @HttpCode(HttpStatus.OK)
  registrarServicio(
    @Param('id', ParseIntPipe) id: number,
    @Body() registrarServicioAmortiguadorDto: RegistrarServicioAmortiguadorDto,
  ) {
    return this.servicioAmortiguadorService.registrarServicio(id, registrarServicioAmortiguadorDto);
  }

  // GET /servicio-amortiguador/:id/historial
  @Get(':id/historial')
  findHistorial(@Param('id', ParseIntPipe) id: number) {
    return this.servicioAmortiguadorService.findHistorial(id);
  }

  // DELETE /servicio-amortiguador/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicioAmortiguadorService.remove(id);
  }
}