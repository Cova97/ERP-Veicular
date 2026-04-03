import { StatusServicio } from '@prisma/client';

export class Verificacion {
  id!: number;
  vehiculoId!: number;
  status!: StatusServicio;

  fechaUltima!: Date;
  holograma?: string;
  centro?: string;

  proximaFecha!: Date;
  intervaloMeses!: number;

  creadoEn!: Date;
  actualizadoEn!: Date;
}

export class HistorialVerificacion {
  id!: number;
  verificacionId!: number;
  fecha!: Date;
  holograma?: string;
  centro?: string;
  costo?: number;
  notas?: string;
  creadoEn!: Date;
}