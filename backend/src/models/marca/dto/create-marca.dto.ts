import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMarcaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la marca es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  nombre!: string;
}