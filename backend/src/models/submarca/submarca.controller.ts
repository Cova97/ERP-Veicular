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
import { SubmarcaService } from './submarca.service';
import { CreateSubmarcaDto } from './dto/create-submarca.dto';
import { UpdateSubmarcaDto } from './dto/update-submarca.dto';

@Controller('submarca')
export class SubmarcaController {
  constructor(private readonly submarcaService: SubmarcaService) {}

  // POST /submarca
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSubmarcaDto: CreateSubmarcaDto) {
    return this.submarcaService.create(createSubmarcaDto);
  }

  // GET /submarca
  @Get()
  findAll() {
    return this.submarcaService.findAll();
  }

  // GET /submarca/modelo/:modeloId  — todas las submarcas de un modelo
  @Get('modelo/:modeloId')
  findByModelo(@Param('modeloId', ParseIntPipe) modeloId: number) {
    return this.submarcaService.findByModelo(modeloId);
  }

  // GET /submarca/:id  — incluye modelo, marca y vehículos
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.submarcaService.findOne(id);
  }

  // PATCH /submarca/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubmarcaDto: UpdateSubmarcaDto,
  ) {
    return this.submarcaService.update(id, updateSubmarcaDto);
  }

  // DELETE /submarca/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.submarcaService.remove(id);
  }
}