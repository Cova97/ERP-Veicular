import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TenenciaService } from './tenencia.service';
import { CreateTenenciaDto } from './dto/create-tenencia.dto';
import { UpdateTenenciaDto } from './dto/update-tenencia.dto';

@Controller('tenencia')
export class TenenciaController {
  constructor(private readonly tenenciaService: TenenciaService) {}

  @Post()
  create(@Body() createTenenciaDto: CreateTenenciaDto) {
    return this.tenenciaService.create(createTenenciaDto);
  }

  @Get()
  findAll() {
    return this.tenenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenenciaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenenciaDto: UpdateTenenciaDto) {
    return this.tenenciaService.update(+id, updateTenenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenenciaService.remove(+id);
  }
}
