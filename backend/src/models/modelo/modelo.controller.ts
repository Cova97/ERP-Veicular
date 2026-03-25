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
import { ModeloService } from './modelo.service';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';

@Controller('modelo')
export class ModeloController {
  constructor(private readonly modeloService: ModeloService) {}

  // POST /modelo
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createModeloDto: CreateModeloDto) {
    return this.modeloService.create(createModeloDto);
  }

  // GET /modelo
  @Get()
  findAll() {
    return this.modeloService.findAll();
  }

  // GET /modelo/marca/:marcaId  — todos los modelos de una marca
  @Get('marca/:marcaId')
  findByMarca(@Param('marcaId', ParseIntPipe) marcaId: number) {
    return this.modeloService.findByMarca(marcaId);
  }

  // GET /modelo/:id  — incluye marca y submarcas
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modeloService.findOne(id);
  }

  // PATCH /modelo/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModeloDto: UpdateModeloDto,
  ) {
    return this.modeloService.update(id, updateModeloDto);
  }

  // DELETE /modelo/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.modeloService.remove(id);
  }
}