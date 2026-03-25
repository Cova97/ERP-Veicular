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
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { ActualizarKilometrajeDto } from './dto/actualizar-kilometraje.dto';

@Controller('vehiculo')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  // POST /vehiculo
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculoService.create(createVehiculoDto);
  }

  // GET /vehiculo  — listado con status de todos los servicios
  @Get()
  findAll() {
    return this.vehiculoService.findAll();
  }

  // GET /vehiculo/placa/:numPlaca  — buscar por placa
  @Get('placa/:numPlaca')
  findByPlaca(@Param('numPlaca') numPlaca: string) {
    return this.vehiculoService.findByPlaca(numPlaca);
  }

  // GET /vehiculo/:id  — detalle completo con todos los servicios
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculoService.findOne(id);
  }

  // PATCH /vehiculo/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculoService.update(id, updateVehiculoDto);
  }

  // PATCH /vehiculo/:id/kilometraje  — actualizar solo el odómetro
  @Patch(':id/kilometraje')
  actualizarKilometraje(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarKilometrajeDto: ActualizarKilometrajeDto,
  ) {
    return this.vehiculoService.actualizarKilometraje(id, actualizarKilometrajeDto);
  }

  // DELETE /vehiculo/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculoService.remove(id);
  }
}