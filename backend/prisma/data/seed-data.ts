// ============================================================
//  seed-data.ts — Data inicial ERP Control Vehicular
//  Vehículo: Toyota Corolla Cross 2022 — TPF993B
// ============================================================

export const marcasData = [
  { nombre: 'Toyota' },
]

export const modelosData = [
  { nombre: 'Corolla Cross', marcaNombre: 'Toyota' },
]

export const submarcasData = [
  { nombre: '5 Puertas', modeloNombre: 'Corolla Cross', marcaNombre: 'Toyota' },
]

export const propietariosData: never[] = []

export const vehiculosData = [
  {
    numPlaca:    'TPF993B',
    numSerie:    '7MUBAAAG0NV020489',
    submarca:    {
      marcaNombre:    'Toyota',
      modeloNombre:   'Corolla Cross',
      submarcaNombre: '5 Puertas',
    },
    anio:        2022,
    color:       'Azul',
    kilometraje: 43000,
    propietarioEmail: null,

    // Aceite: próximo a 45,000 km → último servicio estimado a 40,000
    servicioAceite: {
      fechaUltimoServicio: '2025-09-01',
      kmUltimoServicio:    40000,
      intervaloKm:         5000,
      intervaloMeses:      3,
    },

    // Verificación: realizada 22 oct 2025, próxima 30 abr 2026
    verificacion: {
      fechaUltima:    '2025-10-22',
      proximaFecha:   '2026-04-30',
      holograma:      '',
      centro:         '',
      intervaloMeses: 6, // semestral — de oct 2025 a abr 2026
    },

    // Tenencia: pagada en febrero 2026, próxima febrero 2027
    tenencia: {
      anioFiscal:  2026,
      pagado:      true,
      fechaPago:   '2026-02-01',
      monto:       null,
      folio:       null,
      fechaLimite: '2027-02-28', // próxima tenencia
    },

    // Llantas nuevas al km actual (43,000)
    servicioLlantas: {
      kmUltimoServicio: 43000,
      intervaloKm:      40000, // próximo a 83,000 km
    },

    // Amortiguadores — sin servicio previo registrado
    servicioAmortiguador: {
      kmUltimoServicio: 0,
      intervaloKm:      80000,
    },

    // Frenos — sin servicio previo registrado
    servicioFreno: {
      kmUltimoServicio: 0,
      intervaloKm:      30000,
    },
  },
]