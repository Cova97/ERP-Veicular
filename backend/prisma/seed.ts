// ============================================================
//  seed.ts — Carga data inicial al ERP de Control Vehicular
//  Ejecutar: npx ts-node prisma/seed.ts
//  O con:    npm run seed
// ============================================================

import { PrismaClient, StatusServicio } from '@prisma/client';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  marcasData,
  modelosData,
  submarcasData,
  propietariosData,
  vehiculosData,
} from './data/seed-data'

import { config } from "dotenv";

config();

const adapter = new PrismaMariaDb(process.env.DATABASE_URL_BACK!);
const prisma = new PrismaClient({ adapter });

// ── Helpers ──────────────────────────────────────────────────

function calcularProximaFecha(fechaUltima: Date, intervaloMeses: number): Date {
  const proxima = new Date(fechaUltima)
  proxima.setMonth(proxima.getMonth() + intervaloMeses)
  return proxima
}

function calcularStatusPorFecha(proximaFecha: Date): StatusServicio {
  const hoy = new Date()
  if (hoy >= proximaFecha) return StatusServicio.PENDIENTE
  const dias = Math.ceil((proximaFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
  return dias <= 14 ? StatusServicio.PENDIENTE : StatusServicio.A_TIEMPO
}

function calcularStatusPorKm(kmActual: number, proximoKm: number, intervaloKm: number): StatusServicio {
  if (kmActual >= proximoKm) return StatusServicio.PENDIENTE
  const restantes = proximoKm - kmActual
  return restantes <= intervaloKm * 0.1 ? StatusServicio.PENDIENTE : StatusServicio.A_TIEMPO
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Iniciando seed...\n')

  // ── 1. Limpiar tablas ──────────────────────────────────────
  console.log('🧹 Limpiando base de datos...')
  await prisma.historialAceite.deleteMany()
  await prisma.historialVerificacion.deleteMany()
  await prisma.historialTenencia.deleteMany()
  await prisma.historialLlantas.deleteMany()
  await prisma.historialAmortiguador.deleteMany()
  await prisma.historialFreno.deleteMany()
  await prisma.servicioAceite.deleteMany()
  await prisma.verificacion.deleteMany()
  await prisma.tenencia.deleteMany()
  await prisma.servicioLlantas.deleteMany()
  await prisma.servicioAmortiguador.deleteMany()
  await prisma.servicioFreno.deleteMany()
  await prisma.vehiculo.deleteMany()
  await prisma.submarca.deleteMany()
  await prisma.modelo.deleteMany()
  await prisma.marca.deleteMany()
  await prisma.propietario.deleteMany()
  console.log('✅ Base de datos limpia\n')

  // ── 2. Marcas ──────────────────────────────────────────────
  console.log('🏷️  Insertando marcas...')
  const marcasCreadas = await Promise.all(
    marcasData.map((m) => prisma.marca.create({ data: m })),
  )
  const marcaMap = new Map(marcasCreadas.map((m) => [m.nombre, m.id]))
  console.log(`   ✅ ${marcasCreadas.length} marca(s)`)

  // ── 3. Modelos ─────────────────────────────────────────────
  console.log('🚗 Insertando modelos...')
  const modelosCreados = await Promise.all(
    modelosData.map((m) =>
      prisma.modelo.create({
        data: { nombre: m.nombre, marcaId: marcaMap.get(m.marcaNombre)! },
      }),
    ),
  )
  const modeloMap = new Map(
    modelosData.map((m, i) => [`${m.marcaNombre}|${m.nombre}`, modelosCreados[i].id]),
  )
  console.log(`   ✅ ${modelosCreados.length} modelo(s)`)

  // ── 4. Submarcas ───────────────────────────────────────────
  console.log('🔖 Insertando submarcas...')
  const submarcasCreadas = await Promise.all(
    submarcasData.map((s) =>
      prisma.submarca.create({
        data: {
          nombre:   s.nombre,
          modeloId: modeloMap.get(`${s.marcaNombre}|${s.modeloNombre}`)!,
        },
      }),
    ),
  )
  const submarcaMap = new Map(
    submarcasData.map((s, i) => [
      `${s.marcaNombre}|${s.modeloNombre}|${s.nombre}`,
      submarcasCreadas[i].id,
    ]),
  )
  console.log(`   ✅ ${submarcasCreadas.length} submarca(s)`)

  // ── 5. Propietarios ────────────────────────────────────────
  const propietarioMap = new Map<string, number>()
  if (propietariosData.length > 0) {
    console.log('👤 Insertando propietarios...')
    const creados = await Promise.all(
      propietariosData.map((p: any) => prisma.propietario.create({ data: p })),
    )
    creados.forEach((p: any) => propietarioMap.set(p.email, p.id))
    console.log(`   ✅ ${creados.length} propietario(s)`)
  }

  // ── 6. Vehículos y servicios ───────────────────────────────
  console.log('🚙 Insertando vehículos y servicios...')

  for (const v of vehiculosData) {
    const submarcaId   = submarcaMap.get(`${v.submarca.marcaNombre}|${v.submarca.modeloNombre}|${v.submarca.submarcaNombre}`)!
    const propietarioId = v.propietarioEmail ? propietarioMap.get(v.propietarioEmail) : undefined

    // Crear vehículo
    const vehiculo = await prisma.vehiculo.create({
      data: {
        numPlaca:     v.numPlaca,
        numSerie:     v.numSerie,
        submarcaId,
        anio:         v.anio,
        color:        v.color,
        kilometraje:  v.kilometraje,
        propietarioId,
      },
    })

    // ── Servicio de Aceite
    const saFechaUltima  = new Date(v.servicioAceite.fechaUltimoServicio)
    const saProximoKm    = v.servicioAceite.kmUltimoServicio + v.servicioAceite.intervaloKm
    const saProximaFecha = calcularProximaFecha(saFechaUltima, v.servicioAceite.intervaloMeses)
    const saStatus       = calcularStatusPorKm(v.kilometraje, saProximoKm, v.servicioAceite.intervaloKm)

    await prisma.servicioAceite.create({
      data: {
        vehiculoId:          vehiculo.id,
        fechaUltimoServicio: saFechaUltima,
        kmUltimoServicio:    v.servicioAceite.kmUltimoServicio,
        intervaloKm:         v.servicioAceite.intervaloKm,
        intervaloMeses:      v.servicioAceite.intervaloMeses,
        proximoKm:           saProximoKm,
        proximaFecha:        saProximaFecha,
        status:              saStatus,
      },
    })

    // ── Verificación (proximaFecha fija por el usuario)
    const vfFechaUltima  = new Date(v.verificacion.fechaUltima)
    const vfProximaFecha = new Date(v.verificacion.proximaFecha)
    const vfStatus       = calcularStatusPorFecha(vfProximaFecha)

    await prisma.verificacion.create({
      data: {
        vehiculoId:     vehiculo.id,
        fechaUltima:    vfFechaUltima,
        holograma:      v.verificacion.holograma || null,
        centro:         v.verificacion.centro    || null,
        intervaloMeses: v.verificacion.intervaloMeses,
        proximaFecha:   vfProximaFecha,
        status:         vfStatus,
      },
    })

    // ── Tenencia (ya pagada, próxima en 2027)
    const tnFechaLimite = new Date(v.tenencia.fechaLimite)
    // La tenencia 2026 ya está pagada → FINALIZADO
    // Creamos también la tenencia 2027 pendiente
    await prisma.tenencia.create({
      data: {
        vehiculoId:  vehiculo.id,
        anioFiscal:  v.tenencia.anioFiscal,
        pagado:      v.tenencia.pagado,
        fechaPago:   v.tenencia.fechaPago ? new Date(v.tenencia.fechaPago) : null,
        monto:       v.tenencia.monto,
        folio:       v.tenencia.folio,
        fechaLimite: new Date(v.tenencia.fechaPago!), // límite del año pagado
        status:      StatusServicio.FINALIZADO,
      },
    })

    // Tenencia 2027 pendiente
    await prisma.tenencia.create({
      data: {
        vehiculoId:  vehiculo.id,
        anioFiscal:  2027,
        pagado:      false,
        fechaLimite: tnFechaLimite,
        status:      calcularStatusPorFecha(tnFechaLimite),
      },
    })

    // ── Llantas nuevas
    const llProximoKm = v.servicioLlantas.kmUltimoServicio + v.servicioLlantas.intervaloKm
    await prisma.servicioLlantas.create({
      data: {
        vehiculoId:       vehiculo.id,
        kmUltimoServicio: v.servicioLlantas.kmUltimoServicio,
        intervaloKm:      v.servicioLlantas.intervaloKm,
        proximoKm:        llProximoKm,
        status:           calcularStatusPorKm(v.kilometraje, llProximoKm, v.servicioLlantas.intervaloKm),
      },
    })

    // ── Amortiguadores
    const amProximoKm = v.servicioAmortiguador.kmUltimoServicio + v.servicioAmortiguador.intervaloKm
    await prisma.servicioAmortiguador.create({
      data: {
        vehiculoId:       vehiculo.id,
        kmUltimoServicio: v.servicioAmortiguador.kmUltimoServicio,
        intervaloKm:      v.servicioAmortiguador.intervaloKm,
        proximoKm:        amProximoKm,
        status:           calcularStatusPorKm(v.kilometraje, amProximoKm, v.servicioAmortiguador.intervaloKm),
      },
    })

    // ── Frenos
    const frProximoKm = v.servicioFreno.kmUltimoServicio + v.servicioFreno.intervaloKm
    await prisma.servicioFreno.create({
      data: {
        vehiculoId:       vehiculo.id,
        kmUltimoServicio: v.servicioFreno.kmUltimoServicio,
        intervaloKm:      v.servicioFreno.intervaloKm,
        proximoKm:        frProximoKm,
        status:           calcularStatusPorKm(v.kilometraje, frProximoKm, v.servicioFreno.intervaloKm),
      },
    })

    console.log(`   🚙 ${v.numPlaca} — Toyota Corolla Cross ${v.anio} ✅`)
  }

  // ── Resumen ────────────────────────────────────────────────
  console.log('\n📊 Resumen del seed:')
  console.log(`   Marcas:        ${await prisma.marca.count()}`)
  console.log(`   Modelos:       ${await prisma.modelo.count()}`)
  console.log(`   Submarcas:     ${await prisma.submarca.count()}`)
  console.log(`   Vehículos:     ${await prisma.vehiculo.count()}`)
  console.log(`   Svc. Aceite:   ${await prisma.servicioAceite.count()}`)
  console.log(`   Verificación:  ${await prisma.verificacion.count()}`)
  console.log(`   Tenencias:     ${await prisma.tenencia.count()}`)
  console.log(`   Svc. Llantas:  ${await prisma.servicioLlantas.count()}`)
  console.log(`   Svc. Amort.:   ${await prisma.servicioAmortiguador.count()}`)
  console.log(`   Svc. Frenos:   ${await prisma.servicioFreno.count()}`)
  console.log('\n✅ Seed completado con éxito!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })