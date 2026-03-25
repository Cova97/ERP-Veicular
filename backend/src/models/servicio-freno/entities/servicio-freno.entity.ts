import { StatusServicio } from '@prisma/client';

export class ServicioFreno {
  id!: number;
  vehiculoId!: number;
  status!: StatusServicio;

  kmUltimoServicio!: number;
  intervaloKm!: number;
  proximoKm!: number;

  creadoEn!: Date;
  actualizadoEn!: Date;
}

export class HistorialFreno {
  id!: number;
  servicioId!: number;
  fecha!: Date;
  kmAlServicio!: number;
  tipoServicio?: string;
  taller?: string;
  costo?: number;
  notas?: string;
  creadoEn!: Date;
}