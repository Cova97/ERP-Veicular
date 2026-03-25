import { StatusServicio } from '@prisma/client';

export class Tenencia {
  id!: number;
  vehiculoId!: number;
  status!: StatusServicio;

  anioFiscal!: number;
  fechaPago?: Date;
  monto?: number;
  folio?: string;
  pagado!: boolean;
  fechaLimite!: Date;

  creadoEn!: Date;
  actualizadoEn!: Date;
}

export class HistorialTenencia {
  id!: number;
  tenenciaId!: number;
  anioFiscal!: number;
  fechaPago!: Date;
  monto!: number;
  folio?: string;
  notas?: string;
  creadoEn!: Date;
}