import { PartialType } from '@nestjs/mapped-types';
import { CreateServicioLlantaDto } from './create-servicio-llanta.dto';

export class UpdateServicioLlantaDto extends PartialType(CreateServicioLlantaDto) {}