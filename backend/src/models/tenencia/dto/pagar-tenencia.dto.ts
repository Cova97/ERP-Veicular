import {
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

export class PagarTenenciaDto {
  @IsDateString({}, { message: 'La fecha de pago no es válida' })
  @IsNotEmpty({ message: 'La fecha de pago es obligatoria' })
  fechaPago!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El monto no puede ser negativo' })
  monto!: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  folio?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
