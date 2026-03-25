import {
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

export class RegistrarVerificacionDto {
  @IsDateString({}, { message: 'La fecha no es válida' })
  @IsNotEmpty({ message: 'La fecha de la verificación es obligatoria' })
  fecha!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  holograma?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  centro?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costo?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}
