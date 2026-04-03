import { StatusServicio } from '@prisma/client';

export class ServicioLlantas {
  id!: number;
  vehiculoId!: number;
  status!: StatusServicio;

  kmUltimoServicio!: number;
  intervaloKm!: number;
  proximoKm!: number;

  creadoEn!: Date;
  actualizadoEn!: Date;
}

export class HistorialLlantas {
  id!: number;
  servicioId!: number;
  fecha!: Date;
  kmAlServicio!: number;
  tipoServicio?: string;
  marcaLlanta?: string;
  taller?: string;
  costo?: number;
  notas?: string;
  creadoEn!: Date;
}