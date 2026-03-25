import { StatusServicio } from '@prisma/client';

export class ServicioAmortiguador {
  id!: number;
  vehiculoId!: number;
  status!: StatusServicio;

  kmUltimoServicio!: number;
  intervaloKm!: number;
  proximoKm!: number;

  creadoEn!: Date;
  actualizadoEn!: Date;
}

export class HistorialAmortiguador {
  id!: number;
  servicioId!: number;
  fecha!: Date;
  kmAlServicio!: number;
  tipoServicio?: string;
  marca?: string;
  taller?: string;
  costo?: number;
  notas?: string;
  creadoEn!: Date;
}