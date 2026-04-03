import { PartialType } from '@nestjs/mapped-types';
import { CreateSubmarcaDto } from './create-submarca.dto';

export class UpdateSubmarcaDto extends PartialType(CreateSubmarcaDto) {}