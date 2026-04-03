import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateVehiculoDto {
  @IsString()
  @IsNotEmpty({ message: 'La placa es obligatoria' })
  @MaxLength(20, { message: 'La placa no puede superar 20 caracteres' })
  numPlaca!: string;

  @IsString()
  @IsNotEmpty({ message: 'El número de serie es obligatorio' })
  @MaxLength(50, { message: 'El número de serie no puede superar 50 caracteres' })
  numSerie!: string;

  @IsInt()
  @IsPositive({ message: 'El submarcaId debe ser un número positivo' })
  submarcaId!: number;

  @IsInt()
  @Min(1900, { message: 'El año no es válido' })
  @Max(new Date().getFullYear() + 1, { message: 'El año no puede ser futuro' })
  anio!: number;

  @IsString()
  @IsNotEmpty({ message: 'El color es obligatorio' })
  @MaxLength(50, { message: 'El color no puede superar 50 caracteres' })
  color!: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'El kilometraje no puede ser negativo' })
  kilometraje?: number;

  @IsOptional()
  @IsInt()
  @IsPositive({ message: 'El propietarioId debe ser un número positivo' })
  propietarioId?: number;
}