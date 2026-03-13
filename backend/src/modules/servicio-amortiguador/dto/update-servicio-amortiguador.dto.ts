import { PartialType } from '@nestjs/mapped-types';
import { CreateServicioAmortiguadorDto } from './create-servicio-amortiguador.dto';

export class UpdateServicioAmortiguadorDto extends PartialType(CreateServicioAmortiguadorDto) {}
