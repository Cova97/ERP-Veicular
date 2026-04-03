// ============================================================
//  seed-data.ts — Data inicial para el ERP de Control Vehicular
// ============================================================

export const marcasData = [
  { nombre: 'Toyota' },
  { nombre: 'Nissan' },
  { nombre: 'Chevrolet' },
  { nombre: 'Volkswagen' },
  { nombre: 'Honda' },
  { nombre: 'Ford' },
];

export const modelosData = [
  // Toyota
  { nombre: 'Corolla',  marcaNombre: 'Toyota' },
  { nombre: 'Hilux',    marcaNombre: 'Toyota' },
  { nombre: 'RAV4',     marcaNombre: 'Toyota' },
  // Nissan
  { nombre: 'Sentra',   marcaNombre: 'Nissan' },
  { nombre: 'NP300',    marcaNombre: 'Nissan' },
  { nombre: 'X-Trail',  marcaNombre: 'Nissan' },
  // Chevrolet
  { nombre: 'Aveo',     marcaNombre: 'Chevrolet' },
  { nombre: 'Trax',     marcaNombre: 'Chevrolet' },
  { nombre: 'Silverado',marcaNombre: 'Chevrolet' },
  // Volkswagen
  { nombre: 'Jetta',    marcaNombre: 'Volkswagen' },
  { nombre: 'Tiguan',   marcaNombre: 'Volkswagen' },
  // Honda
  { nombre: 'Civic',    marcaNombre: 'Honda' },
  { nombre: 'CR-V',     marcaNombre: 'Honda' },
  // Ford
  { nombre: 'F-150',    marcaNombre: 'Ford' },
  { nombre: 'Escape',   marcaNombre: 'Ford' },
];

export const submarcasData = [
  // Toyota Corolla
  { nombre: 'Base',        modeloNombre: 'Corolla',   marcaNombre: 'Toyota' },
  { nombre: 'LE',          modeloNombre: 'Corolla',   marcaNombre: 'Toyota' },
  { nombre: 'XLE',         modeloNombre: 'Corolla',   marcaNombre: 'Toyota' },
  // Toyota Hilux
  { nombre: 'Cabina Simple', modeloNombre: 'Hilux',   marcaNombre: 'Toyota' },
  { nombre: 'Doble Cabina',  modeloNombre: 'Hilux',   marcaNombre: 'Toyota' },
  // Toyota RAV4
  { nombre: 'LE',          modeloNombre: 'RAV4',      marcaNombre: 'Toyota' },
  { nombre: 'XLE',         modeloNombre: 'RAV4',      marcaNombre: 'Toyota' },
  // Nissan Sentra
  { nombre: 'Sense',       modeloNombre: 'Sentra',    marcaNombre: 'Nissan' },
  { nombre: 'Advance',     modeloNombre: 'Sentra',    marcaNombre: 'Nissan' },
  { nombre: 'Exclusive',   modeloNombre: 'Sentra',    marcaNombre: 'Nissan' },
  // Nissan NP300
  { nombre: 'Estacas',     modeloNombre: 'NP300',     marcaNombre: 'Nissan' },
  { nombre: 'Doble Cabina',modeloNombre: 'NP300',     marcaNombre: 'Nissan' },
  // Nissan X-Trail
  { nombre: 'Sense',       modeloNombre: 'X-Trail',   marcaNombre: 'Nissan' },
  { nombre: 'Advance',     modeloNombre: 'X-Trail',   marcaNombre: 'Nissan' },
  // Chevrolet Aveo
  { nombre: 'LS',          modeloNombre: 'Aveo',      marcaNombre: 'Chevrolet' },
  { nombre: 'LT',          modeloNombre: 'Aveo',      marcaNombre: 'Chevrolet' },
  // Chevrolet Trax
  { nombre: 'LS',          modeloNombre: 'Trax',      marcaNombre: 'Chevrolet' },
  { nombre: 'LT',          modeloNombre: 'Trax',      marcaNombre: 'Chevrolet' },
  // Chevrolet Silverado
  { nombre: 'Work Truck',  modeloNombre: 'Silverado', marcaNombre: 'Chevrolet' },
  { nombre: 'LT',          modeloNombre: 'Silverado', marcaNombre: 'Chevrolet' },
  // Volkswagen Jetta
  { nombre: 'Trendline',   modeloNombre: 'Jetta',     marcaNombre: 'Volkswagen' },
  { nombre: 'Comfortline', modeloNombre: 'Jetta',     marcaNombre: 'Volkswagen' },
  { nombre: 'Highline',    modeloNombre: 'Jetta',     marcaNombre: 'Volkswagen' },
  // Volkswagen Tiguan
  { nombre: 'Trendline',   modeloNombre: 'Tiguan',    marcaNombre: 'Volkswagen' },
  { nombre: 'Comfortline', modeloNombre: 'Tiguan',    marcaNombre: 'Volkswagen' },
  // Honda Civic
  { nombre: 'Univi',       modeloNombre: 'Civic',     marcaNombre: 'Honda' },
  { nombre: 'Sport',       modeloNombre: 'Civic',     marcaNombre: 'Honda' },
  { nombre: 'Touring',     modeloNombre: 'Civic',     marcaNombre: 'Honda' },
  // Honda CR-V
  { nombre: 'i-Style',     modeloNombre: 'CR-V',      marcaNombre: 'Honda' },
  { nombre: 'Turbo Plus',  modeloNombre: 'CR-V',      marcaNombre: 'Honda' },
  // Ford F-150
  { nombre: 'XL',          modeloNombre: 'F-150',     marcaNombre: 'Ford' },
  { nombre: 'XLT',         modeloNombre: 'F-150',     marcaNombre: 'Ford' },
  { nombre: 'Lariat',      modeloNombre: 'F-150',     marcaNombre: 'Ford' },
  // Ford Escape
  { nombre: 'S',           modeloNombre: 'Escape',    marcaNombre: 'Ford' },
  { nombre: 'SE',          modeloNombre: 'Escape',    marcaNombre: 'Ford' },
];

export const propietariosData = [
  { nombre: 'Carlos',    apellido: 'Ramírez Torres',   telefono: '2221234567', email: 'carlos.ramirez@email.com' },
  { nombre: 'María',     apellido: 'López Hernández',  telefono: '2229876543', email: 'maria.lopez@email.com' },
  { nombre: 'Roberto',   apellido: 'Martínez Soto',    telefono: '2224561234', email: 'roberto.martinez@email.com' },
  { nombre: 'Ana',       apellido: 'García Pérez',     telefono: '2227894561', email: 'ana.garcia@email.com' },
  { nombre: 'Luis',      apellido: 'Hernández Ruiz',   telefono: '2223456789', email: 'luis.hernandez@email.com' },
];

// Vehículos con todos sus servicios precargados
export const vehiculosData = [
  {
    numPlaca:    'PBL-12-34',
    numSerie:    '3VWFE21C04M000001',
    submarca:    { modeloNombre: 'Jetta', marcaNombre: 'Volkswagen', submarcaNombre: 'Comfortline' },
    anio:        2020,
    color:       'Blanco',
    kilometraje: 52000,
    propietarioEmail: 'carlos.ramirez@email.com',
    servicioAceite: {
      fechaUltimoServicio: '2024-11-15',
      kmUltimoServicio:    50000,
      intervaloKm:         5000,
      intervaloMeses:      3,
    },
    verificacion: {
      fechaUltima:     '2024-07-01',
      holograma:       'A-1234567',
      centro:          'Verificentro Norte Puebla',
      intervaloMeses:  12,
    },
    tenencia: {
      anioFiscal:  2025,
      fechaLimite: '2025-03-31',
    },
    servicioLlantas: {
      kmUltimoServicio: 40000,
      intervaloKm:      40000,
    },
    servicioAmortiguador: {
      kmUltimoServicio: 0,
      intervaloKm:      80000,
    },
    servicioFreno: {
      kmUltimoServicio: 30000,
      intervaloKm:      30000,
    },
  },
  {
    numPlaca:    'PBL-56-78',
    numSerie:    '1N4AL3AP8FC000002',
    submarca:    { modeloNombre: 'Sentra', marcaNombre: 'Nissan', submarcaNombre: 'Advance' },
    anio:        2021,
    color:       'Gris',
    kilometraje: 38000,
    propietarioEmail: 'maria.lopez@email.com',
    servicioAceite: {
      fechaUltimoServicio: '2024-12-01',
      kmUltimoServicio:    36000,
      intervaloKm:         5000,
      intervaloMeses:      3,
    },
    verificacion: {
      fechaUltima:     '2024-09-15',
      holograma:       'B-7654321',
      centro:          'Verificentro Sur Puebla',
      intervaloMeses:  12,
    },
    tenencia: {
      anioFiscal:  2025,
      fechaLimite: '2025-03-31',
    },
    servicioLlantas: {
      kmUltimoServicio: 0,
      intervaloKm:      40000,
    },
    servicioAmortiguador: {
      kmUltimoServicio: 0,
      intervaloKm:      80000,
    },
    servicioFreno: {
      kmUltimoServicio: 20000,
      intervaloKm:      30000,
    },
  },
  {
    numPlaca:    'PBL-90-12',
    numSerie:    '2T1BURHE0JC000003',
    submarca:    { modeloNombre: 'Corolla', marcaNombre: 'Toyota', submarcaNombre: 'LE' },
    anio:        2022,
    color:       'Negro',
    kilometraje: 27000,
    propietarioEmail: 'roberto.martinez@email.com',
    servicioAceite: {
      fechaUltimoServicio: '2025-01-10',
      kmUltimoServicio:    25000,
      intervaloKm:         5000,
      intervaloMeses:      3,
    },
    verificacion: {
      fechaUltima:     '2025-01-01',
      holograma:       'C-1122334',
      centro:          'Verificentro Oriente Puebla',
      intervaloMeses:  12,
    },
    tenencia: {
      anioFiscal:  2025,
      fechaLimite: '2025-03-31',
    },
    servicioLlantas: {
      kmUltimoServicio: 0,
      intervaloKm:      40000,
    },
    servicioAmortiguador: {
      kmUltimoServicio: 0,
      intervaloKm:      80000,
    },
    servicioFreno: {
      kmUltimoServicio: 0,
      intervaloKm:      30000,
    },
  },
  {
    numPlaca:    'PBL-34-56',
    numSerie:    '3GNKBERS8ES000004',
    submarca:    { modeloNombre: 'Trax', marcaNombre: 'Chevrolet', submarcaNombre: 'LT' },
    anio:        2019,
    color:       'Azul',
    kilometraje: 78000,
    propietarioEmail: 'ana.garcia@email.com',
    servicioAceite: {
      fechaUltimoServicio: '2024-09-01',
      kmUltimoServicio:    75000,
      intervaloKm:         5000,
      intervaloMeses:      3,
    },
    verificacion: {
      fechaUltima:     '2024-04-01',
      holograma:       'D-4455667',
      centro:          'Verificentro Norte Puebla',
      intervaloMeses:  12,
    },
    tenencia: {
      anioFiscal:  2025,
      fechaLimite: '2025-03-31',
    },
    servicioLlantas: {
      kmUltimoServicio: 40000,
      intervaloKm:      40000,
    },
    servicioAmortiguador: {
      kmUltimoServicio: 0,
      intervaloKm:      80000,
    },
    servicioFreno: {
      kmUltimoServicio: 60000,
      intervaloKm:      30000,
    },
  },
  {
    numPlaca:    'PBL-78-90',
    numSerie:    '1HGBH41JXMN000005',
    submarca:    { modeloNombre: 'Civic', marcaNombre: 'Honda', submarcaNombre: 'Sport' },
    anio:        2023,
    color:       'Rojo',
    kilometraje: 15000,
    propietarioEmail: 'luis.hernandez@email.com',
    servicioAceite: {
      fechaUltimoServicio: '2025-02-01',
      kmUltimoServicio:    10000,
      intervaloKm:         5000,
      intervaloMeses:      3,
    },
    verificacion: {
      fechaUltima:     '2025-02-15',
      holograma:       'E-9988776',
      centro:          'Verificentro Sur Puebla',
      intervaloMeses:  12,
    },
    tenencia: {
      anioFiscal:  2025,
      fechaLimite: '2025-03-31',
    },
    servicioLlantas: {
      kmUltimoServicio: 0,
      intervaloKm:      40000,
    },
    servicioAmortiguador: {
      kmUltimoServicio: 0,
      intervaloKm:      80000,
    },
    servicioFreno: {
      kmUltimoServicio: 0,
      intervaloKm:      30000,
    },
  },
];