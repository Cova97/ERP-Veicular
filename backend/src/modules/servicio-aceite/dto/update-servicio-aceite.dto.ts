import { PartialType } from '@nestjs/mapped-types';
import { CreateServicioAceiteDto } from './create-servicio-aceite.dto';

export class UpdateServicioAceiteDto extends PartialType(CreateServicioAceiteDto) {}
