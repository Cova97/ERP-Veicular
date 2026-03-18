import { PartialType } from '@nestjs/mapped-types';
import { CreateTenenciaDto } from './create-tenencia.dto';

export class UpdateTenenciaDto extends PartialType(CreateTenenciaDto) {}
