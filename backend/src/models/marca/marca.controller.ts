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
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Controller('marca')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  // POST /marca
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcaService.create(createMarcaDto);
  }

  // GET /marca
  @Get()
  findAll() {
    return this.marcaService.findAll();
  }

  // GET /marca/:id  — incluye modelos y submarcas
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.marcaService.findOne(id);
  }

  // PATCH /marca/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMarcaDto: UpdateMarcaDto,
  ) {
    return this.marcaService.update(id, updateMarcaDto);
  }

  // DELETE /marca/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.marcaService.remove(id);
  }
}