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
import { TenenciaService } from './tenencia.service';
import { CreateTenenciaDto } from './dto/create-tenencia.dto';
import { UpdateTenenciaDto } from './dto/update-tenencia.dto';
import { PagarTenenciaDto } from './dto/pagar-tenencia.dto';

@Controller('tenencia')
export class TenenciaController {
  constructor(private readonly tenenciaService: TenenciaService) {}

  // POST /tenencia  — dar de alta tenencia de un año
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTenenciaDto: CreateTenenciaDto) {
    return this.tenenciaService.create(createTenenciaDto);
  }

  // GET /tenencia  — todas ordenadas: no pagadas primero, luego por fechaLimite
  @Get()
  findAll() {
    return this.tenenciaService.findAll();
  }

  // GET /tenencia/pendientes  — solo las no pagadas (para alertas)
  @Get('pendientes')
  findPendientes() {
    return this.tenenciaService.findPendientes();
  }

  // GET /tenencia/vehiculo/:vehiculoId  — historial de tenencias del vehículo
  @Get('vehiculo/:vehiculoId')
  findByVehiculo(@Param('vehiculoId', ParseIntPipe) vehiculoId: number) {
    return this.tenenciaService.findByVehiculo(vehiculoId);
  }

  // GET /tenencia/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tenenciaService.findOne(id);
  }

  // PATCH /tenencia/:id  — editar fecha límite o año fiscal
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTenenciaDto: UpdateTenenciaDto,
  ) {
    return this.tenenciaService.update(id, updateTenenciaDto);
  }

  // POST /tenencia/:id/pagar  — registrar pago
  @Post(':id/pagar')
  @HttpCode(HttpStatus.OK)
  pagarTenencia(
    @Param('id', ParseIntPipe) id: number,
    @Body() pagarTenenciaDto: PagarTenenciaDto,
  ) {
    return this.tenenciaService.pagarTenencia(id, pagarTenenciaDto);
  }

  // GET /tenencia/:id/historial
  @Get(':id/historial')
  findHistorial(@Param('id', ParseIntPipe) id: number) {
    return this.tenenciaService.findHistorial(id);
  }

  // DELETE /tenencia/:id  — solo si no está pagada
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tenenciaService.remove(id);
  }
}