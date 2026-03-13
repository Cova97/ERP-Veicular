import { PartialType } from '@nestjs/mapped-types';
import { CreateServicioFrenoDto } from './create-servicio-freno.dto';

export class UpdateServicioFrenoDto extends PartialType(CreateServicioFrenoDto) {}
