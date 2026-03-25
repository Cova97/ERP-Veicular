// ============================================================
//  seed.ts — Carga la data inicial al ERP de Control Vehicular
//  Ejecutar con: npx ts-node prisma/seed.ts
//  O con el script de package.json: npm run seed
// ============================================================

import { PrismaClient, StatusServicio } from '@prisma/client';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  marcasData,
  modelosData,
  submarcasData,
  propietariosData,
  vehiculosData,
} from './data/seed-data';

import { config } from "dotenv";

config();

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// ── Helpers ──────────────────────────────────────────────────

function calcularProximaFecha(fechaUltima: Date, intervaloMeses: number): Date {
  const proxima = new Date(fechaUltima);
  proxima.setMonth(proxima.getMonth() + intervaloMeses);
  return proxima;
}

function calcularStatusPorFecha(proximaFecha: Date): StatusServicio {
  const hoy = new Date();
  if (hoy >= proximaFecha) return StatusServicio.PENDIENTE;
  const dias = Math.ceil((proximaFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  return dias <= 14 ? StatusServicio.PENDIENTE : StatusServicio.A_TIEMPO;
}

function calcularStatusPorKm(
  kmActual: number,
  proximoKm: number,
  intervaloKm: number,
): StatusServicio {
  if (kmActual >= proximoKm) return StatusServicio.PENDIENTE;
  const restantes = proximoKm - kmActual;
  return restantes <= intervaloKm * 0.1 ? StatusServicio.PENDIENTE : StatusServicio.A_TIEMPO;
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Iniciando seed...\n');

  // ── 1. Limpiar tablas en orden (hijos antes que padres) ────
  console.log('🧹 Limpiando base de datos...');
  await prisma.historialAceite.deleteMany();
  await prisma.historialVerificacion.deleteMany();
  await prisma.historialTenencia.deleteMany();
  await prisma.historialLlantas.deleteMany();
  await prisma.historialAmortiguador.deleteMany();
  await prisma.historialFreno.deleteMany();
  await prisma.servicioAceite.deleteMany();
  await prisma.verificacion.deleteMany();
  await prisma.tenencia.deleteMany();
  await prisma.servicioLlantas.deleteMany();
  await prisma.servicioAmortiguador.deleteMany();
  await prisma.servicioFreno.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.submarca.deleteMany();
  await prisma.modelo.deleteMany();
  await prisma.marca.deleteMany();
  await prisma.propietario.deleteMany();
  console.log('✅ Base de datos limpia\n');

  // ── 2. Marcas ───────────────────────────────────────────────
  console.log('🏷️  Insertando marcas...');
  const marcasCreadas = await Promise.all(
    marcasData.map((m) => prisma.marca.create({ data: m })),
  );
  const marcaMap = new Map(marcasCreadas.map((m) => [m.nombre, m.id]));
  console.log(`   ✅ ${marcasCreadas.length} marcas insertadas`);

  // ── 3. Modelos ──────────────────────────────────────────────
  console.log('🚗 Insertando modelos...');
  const modelosCreados = await Promise.all(
    modelosData.map((m) =>
      prisma.modelo.create({
        data: { nombre: m.nombre, marcaId: marcaMap.get(m.marcaNombre)! },
      }),
    ),
  );
  // Map compuesto: "Toyota|Corolla" → id
  const modeloMap = new Map(
    modelosData.map((m, i) => [`${m.marcaNombre}|${m.nombre}`, modelosCreados[i].id]),
  );
  console.log(`   ✅ ${modelosCreados.length} modelos insertados`);

  // ── 4. Submarcas ────────────────────────────────────────────
  console.log('🔖 Insertando submarcas...');
  const submarcasCreadas = await Promise.all(
    submarcasData.map((s) =>
      prisma.submarca.create({
        data: {
          nombre:   s.nombre,
          modeloId: modeloMap.get(`${s.marcaNombre}|${s.modeloNombre}`)!,
        },
      }),
    ),
  );
  // Map compuesto: "Toyota|Corolla|LE" → id
  const submarcaMap = new Map(
    submarcasData.map((s, i) => [
      `${s.marcaNombre}|${s.modeloNombre}|${s.nombre}`,
      submarcasCreadas[i].id,
    ]),
  );
  console.log(`   ✅ ${submarcasCreadas.length} submarcas insertadas`);

  // ── 5. Propietarios ─────────────────────────────────────────
  console.log('👤 Insertando propietarios...');
  const propietariosCreados = await Promise.all(
    propietariosData.map((p) => prisma.propietario.create({ data: p })),
  );
  const propietarioMap = new Map(
    propietariosCreados.map((p) => [p.email, p.id]),
  );
  console.log(`   ✅ ${propietariosCreados.length} propietarios insertados`);

  // ── 6. Vehículos y sus servicios ────────────────────────────
  console.log('🚙 Insertando vehículos y servicios...');

  for (const v of vehiculosData) {
    const submarcaId = submarcaMap.get(
      `${v.submarca.marcaNombre}|${v.submarca.modeloNombre}|${v.submarca.submarcaNombre}`,
    )!;
    const propietarioId = propietarioMap.get(v.propietarioEmail);

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
    });

    // ── Servicio de Aceite
    const saFechaUltima  = new Date(v.servicioAceite.fechaUltimoServicio);
    const saProximoKm    = v.servicioAceite.kmUltimoServicio + v.servicioAceite.intervaloKm;
    const saProximaFecha = calcularProximaFecha(saFechaUltima, v.servicioAceite.intervaloMeses);
    const saStatus       = calcularStatusPorFecha(saProximaFecha);

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
    });

    // ── Verificación
    const vfFechaUltima  = new Date(v.verificacion.fechaUltima);
    const vfProximaFecha = calcularProximaFecha(vfFechaUltima, v.verificacion.intervaloMeses);
    const vfStatus       = calcularStatusPorFecha(vfProximaFecha);

    await prisma.verificacion.create({
      data: {
        vehiculoId:     vehiculo.id,
        fechaUltima:    vfFechaUltima,
        holograma:      v.verificacion.holograma,
        centro:         v.verificacion.centro,
        intervaloMeses: v.verificacion.intervaloMeses,
        proximaFecha:   vfProximaFecha,
        status:         vfStatus,
      },
    });

    // ── Tenencia
    const tnStatus = calcularStatusPorFecha(new Date(v.tenencia.fechaLimite));

    await prisma.tenencia.create({
      data: {
        vehiculoId:  vehiculo.id,
        anioFiscal:  v.tenencia.anioFiscal,
        fechaLimite: new Date(v.tenencia.fechaLimite),
        pagado:      false,
        status:      tnStatus,
      },
    });

    // ── Servicio de Llantas
    const llProximoKm = v.servicioLlantas.kmUltimoServicio + v.servicioLlantas.intervaloKm;
    const llStatus    = calcularStatusPorKm(v.kilometraje, llProximoKm, v.servicioLlantas.intervaloKm);

    await prisma.servicioLlantas.create({
      data: {
        vehiculoId:       vehiculo.id,
        kmUltimoServicio: v.servicioLlantas.kmUltimoServicio,
        intervaloKm:      v.servicioLlantas.intervaloKm,
        proximoKm:        llProximoKm,
        status:           llStatus,
      },
    });

    // ── Servicio de Amortiguador
    const amProximoKm = v.servicioAmortiguador.kmUltimoServicio + v.servicioAmortiguador.intervaloKm;
    const amStatus    = calcularStatusPorKm(v.kilometraje, amProximoKm, v.servicioAmortiguador.intervaloKm);

    await prisma.servicioAmortiguador.create({
      data: {
        vehiculoId:       vehiculo.id,
        kmUltimoServicio: v.servicioAmortiguador.kmUltimoServicio,
        intervaloKm:      v.servicioAmortiguador.intervaloKm,
        proximoKm:        amProximoKm,
        status:           amStatus,
      },
    });

    // ── Servicio de Freno
    const frProximoKm = v.servicioFreno.kmUltimoServicio + v.servicioFreno.intervaloKm;
    const frStatus    = calcularStatusPorKm(v.kilometraje, frProximoKm, v.servicioFreno.intervaloKm);

    await prisma.servicioFreno.create({
      data: {
        vehiculoId:       vehiculo.id,
        kmUltimoServicio: v.servicioFreno.kmUltimoServicio,
        intervaloKm:      v.servicioFreno.intervaloKm,
        proximoKm:        frProximoKm,
        status:           frStatus,
      },
    });

    console.log(`   🚙 ${v.numPlaca} — ${v.submarca.marcaNombre} ${v.submarca.modeloNombre} ${v.anio} ✅`);
  }

  // ── Resumen final ───────────────────────────────────────────
  console.log('\n📊 Resumen del seed:');
  console.log(`   Marcas:        ${await prisma.marca.count()}`);
  console.log(`   Modelos:       ${await prisma.modelo.count()}`);
  console.log(`   Submarcas:     ${await prisma.submarca.count()}`);
  console.log(`   Propietarios:  ${await prisma.propietario.count()}`);
  console.log(`   Vehículos:     ${await prisma.vehiculo.count()}`);
  console.log(`   Svc. Aceite:   ${await prisma.servicioAceite.count()}`);
  console.log(`   Verificación:  ${await prisma.verificacion.count()}`);
  console.log(`   Tenencias:     ${await prisma.tenencia.count()}`);
  console.log(`   Svc. Llantas:  ${await prisma.servicioLlantas.count()}`);
  console.log(`   Svc. Amort.:   ${await prisma.servicioAmortiguador.count()}`);
  console.log(`   Svc. Frenos:   ${await prisma.servicioFreno.count()}`);
  console.log('\n✅ Seed completado con éxito!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });