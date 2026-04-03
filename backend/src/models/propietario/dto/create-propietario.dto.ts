import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
} from 'class-validator';

export class CreatePropietarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(150, { message: 'El nombre no puede superar 150 caracteres' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(150, { message: 'El apellido no puede superar 150 caracteres' })
  apellido!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'El teléfono no puede superar 20 caracteres' })
  telefono?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @MaxLength(200, { message: 'El email no puede superar 200 caracteres' })
  email?: string;
}