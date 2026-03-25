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

export class RegistrarServicioAmortiguadorDto {
  @IsDateString({}, { message: 'La fecha no es válida' })
  @IsNotEmpty({ message: 'La fecha del servicio es obligatoria' })
  fecha!: string;

  @IsInt()
  @Min(0, { message: 'El kilometraje no puede ser negativo' })
  kmAlServicio!: number;

  // Ej: "Revisión", "Cambio delantero", "Cambio trasero", "Cambio completo"
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipoServicio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  marca?: string;

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
