import { IsString, IsNotEmpty, IsInt, IsPositive, MaxLength } from 'class-validator';

export class CreateSubmarcaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la submarca es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  nombre!: string;

  @IsInt({ message: 'El modeloId debe ser un número entero' })
  @IsPositive({ message: 'El modeloId debe ser un número positivo' })
  modeloId!: number;
}