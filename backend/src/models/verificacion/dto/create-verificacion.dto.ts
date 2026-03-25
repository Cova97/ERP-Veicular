import {
  IsInt,
  IsPositive,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsString,
  IsIn,
  MaxLength,
} from 'class-validator';

export class CreateVerificacionDto {
  @IsInt()
  @IsPositive({ message: 'El vehiculoId debe ser un número positivo' })
  vehiculoId!: number;

  @IsDateString({}, { message: 'La fecha de la última verificación no es válida' })
  @IsNotEmpty({ message: 'La fecha de la última verificación es obligatoria' })
  fechaUltima!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'El holograma no puede superar 20 caracteres' })
  holograma?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'El centro no puede superar 200 caracteres' })
  centro?: string;

  // 12 = anual (default), 6 = semestral
  @IsOptional()
  @IsInt()
  @IsIn([6, 12], { message: 'El intervalo debe ser 6 (semestral) o 12 (anual)' })
  intervaloMeses?: number;
}