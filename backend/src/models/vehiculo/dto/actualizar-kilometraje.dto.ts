import { IsInt, Min } from 'class-validator';

export class ActualizarKilometrajeDto {
  @IsInt()
  @Min(0, { message: 'El kilometraje no puede ser negativo' })
  kilometraje!: number;
}
