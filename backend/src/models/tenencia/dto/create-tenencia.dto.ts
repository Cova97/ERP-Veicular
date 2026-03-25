import {
  IsInt,
  IsPositive,
  IsNotEmpty,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class CreateTenenciaDto {
  @IsInt()
  @IsPositive({ message: 'El vehiculoId debe ser un número positivo' })
  vehiculoId!: number;

  @IsInt()
  @Min(2000, { message: 'El año fiscal debe ser mayor a 2000' })
  @Max(2100, { message: 'El año fiscal no es válido' })
  anioFiscal!: number;

  @IsDateString({}, { message: 'La fecha límite no es válida' })
  @IsNotEmpty({ message: 'La fecha límite de pago es obligatoria' })
  fechaLimite!: string;
}