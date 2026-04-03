import { StatusServicio } from '@prisma/client';

export class ServicioAceite {
  id!: number;
  vehiculoId!: number;
  status!: StatusServicio;

  fechaUltimoServicio!: Date;
  kmUltimoServicio!: number;

  intervaloKm!: number;
  intervaloMeses!: number;

  proximaFecha!: Date;
  proximoKm!: number;

  creadoEn!: Date;
  actualizadoEn!: Date;
}

export class HistorialAceite {
  id!: number;
  servicioId!: number;
  fecha!: Date;
  kmAlServicio!: number;
  tipoAceite?: string;
  taller?: string;
  costo?: number;
  notas?: string;
  creadoEn!: Date;
}