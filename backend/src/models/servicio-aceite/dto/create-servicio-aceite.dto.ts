import {
  IsInt,
  IsPositive,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateServicioAceiteDto {
  @IsInt()
  @IsPositive({ message: 'El vehiculoId debe ser un número positivo' })
  vehiculoId!: number;

  @IsDateString({}, { message: 'La fecha del último servicio no es válida' })
  @IsNotEmpty({ message: 'La fecha del último servicio es obligatoria' })
  fechaUltimoServicio!: string;

  @IsInt()
  @Min(0, { message: 'El kilometraje no puede ser negativo' })
  kmUltimoServicio!: number;

  // Opcionales — si no se envían se usan los defaults del schema (5000 km / 3 meses)
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'El intervalo de km debe ser al menos 1' })
  intervaloKm?: number;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'El intervalo de meses debe ser al menos 1' })
  intervaloMeses?: number;
}