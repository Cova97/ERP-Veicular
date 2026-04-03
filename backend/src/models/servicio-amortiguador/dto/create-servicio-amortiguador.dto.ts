import { IsInt, IsPositive, IsOptional, Min } from 'class-validator';

export class CreateServicioAmortiguadorDto {
  @IsInt()
  @IsPositive({ message: 'El vehiculoId debe ser un número positivo' })
  vehiculoId!: number;

  @IsInt()
  @Min(0, { message: 'El kilometraje no puede ser negativo' })
  kmUltimoServicio!: number;

  // Opcional — default 80,000 km según schema
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'El intervalo de km debe ser al menos 1' })
  intervaloKm?: number;
}