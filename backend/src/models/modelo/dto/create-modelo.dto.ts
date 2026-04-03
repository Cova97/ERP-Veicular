import { IsString, IsNotEmpty, IsInt, IsPositive, MaxLength } from 'class-validator';

export class CreateModeloDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del modelo es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  nombre!: string;

  @IsInt({ message: 'El marcaId debe ser un número entero' })
  @IsPositive({ message: 'El marcaId debe ser un número positivo' })
  marcaId!: number;
}