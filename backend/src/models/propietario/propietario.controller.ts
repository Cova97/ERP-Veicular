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
import { PropietarioService } from './propietario.service';
import { CreatePropietarioDto } from './dto/create-propietario.dto';
import { UpdatePropietarioDto } from './dto/update-propietario.dto';

@Controller('propietario')
export class PropietarioController {
  constructor(private readonly propietarioService: PropietarioService) {}

  // POST /propietario
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPropietarioDto: CreatePropietarioDto) {
    return this.propietarioService.create(createPropietarioDto);
  }

  // GET /propietario
  @Get()
  findAll() {
    return this.propietarioService.findAll();
  }

  // GET /propietario/:id  — incluye vehículos con marca/modelo/submarca
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propietarioService.findOne(id);
  }

  // PATCH /propietario/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePropietarioDto: UpdatePropietarioDto,
  ) {
    return this.propietarioService.update(id, updatePropietarioDto);
  }

  // DELETE /propietario/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.propietarioService.remove(id);
  }
}