export class Vehiculo {
  id!: number;
  numPlaca!: string;
  numSerie!: string;
  submarcaId!: number;
  anio!: number;
  color!: string;
  kilometraje!: number;
  propietarioId?: number;
  creadoEn!: Date;
  actualizadoEn!: Date;
}