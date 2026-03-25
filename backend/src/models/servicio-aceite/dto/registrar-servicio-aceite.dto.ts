import {
  IsInt,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

export class RegistrarServicioAceiteDto {
  @IsDateString({}, { message: 'La fecha no es válida' })
  @IsNotEmpty({ message: 'La fecha del servicio es obligatoria' })
  fecha!: string;

  @IsInt()
  @Min(0, { message: 'El kilometraje no puede ser negativo' })
  kmAlServicio!: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipoAceite?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  taller?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costo?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}
