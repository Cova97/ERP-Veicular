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
import { VerificacionService } from './verificacion.service';
import { CreateVerificacionDto } from './dto/create-verificacion.dto';
import { UpdateVerificacionDto } from './dto/update-verificacion.dto';
import { RegistrarVerificacionDto } from './dto/registrar-verificacion.dto';

@Controller('verificacion')
export class VerificacionController {
  constructor(private readonly verificacionService: VerificacionService) {}

  // POST /verificacion  — alta inicial
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVerificacionDto: CreateVerificacionDto) {
    return this.verificacionService.create(createVerificacionDto);
  }

  // GET /verificacion  — todas ordenadas por proximaFecha asc
  @Get()
  findAll() {
    return this.verificacionService.findAll();
  }

  // GET /verificacion/proximas  — las que vencen en los próximos 30 días
  @Get('proximas')
  findProximasAVencer() {
    return this.verificacionService.findProximasAVencer();
  }

  // GET /verificacion/vehiculo/:vehiculoId
  @Get('vehiculo/:vehiculoId')
  findByVehiculo(@Param('vehiculoId', ParseIntPipe) vehiculoId: number) {
    return this.verificacionService.findByVehiculo(vehiculoId);
  }

  // GET /verificacion/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.verificacionService.findOne(id);
  }

  // PATCH /verificacion/:id  — editar intervalo o corregir datos
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVerificacionDto: UpdateVerificacionDto,
  ) {
    return this.verificacionService.update(id, updateVerificacionDto);
  }

  // POST /verificacion/:id/registrar  — marcar verificacion como realizada
  @Post(':id/registrar')
  @HttpCode(HttpStatus.OK)
  registrarVerificacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() registrarVerificacionDto: RegistrarVerificacionDto,
  ) {
    return this.verificacionService.registrarVerificacion(id, registrarVerificacionDto);
  }

  // GET /verificacion/:id/historial
  @Get(':id/historial')
  findHistorial(@Param('id', ParseIntPipe) id: number) {
    return this.verificacionService.findHistorial(id);
  }

  // DELETE /verificacion/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.verificacionService.remove(id);
  }
}