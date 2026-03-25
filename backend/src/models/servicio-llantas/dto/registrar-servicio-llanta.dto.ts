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

export class RegistrarServicioLlantaDto {
  @IsDateString({}, { message: 'La fecha no es válida' })
  @IsNotEmpty({ message: 'La fecha del servicio es obligatoria' })
  fecha!: string;

  @IsInt()
  @Min(0, { message: 'El kilometraje no puede ser negativo' })
  kmAlServicio!: number;

  // Ej: "Rotación", "Cambio completo", "Balanceo", "Alineación"
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipoServicio?: string;

  // Marca de las llantas nuevas (solo aplica en cambio)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  marcaLlanta?: string;

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
