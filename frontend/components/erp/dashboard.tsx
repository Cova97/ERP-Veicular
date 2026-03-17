'use client'

import { Car, Users, AlertTriangle, CheckCircle, Clock, Gauge } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useVehiculoStore } from '@/lib/store'

interface DashboardProps {
  onVehiculoClick: (id: number) => void
}

export function Dashboard({ onVehiculoClick }: DashboardProps) {
  const vehiculos = useVehiculoStore((state) => state.vehiculos)
  const propietarios = useVehiculoStore((state) => state.propietarios)

  // Calculate statistics
  const stats = {
    totalVehiculos: vehiculos.length,
    totalPropietarios: propietarios.length,
    serviciosPendientes: 0,
    serviciosATiempo: 0,
    serviciosFinalizados: 0,
    kmTotal: 0
  }

  vehiculos.forEach(v => {
    stats.kmTotal += v.kilometraje

    const services = [
      ...(v.serviciosAceite || []),
      ...(v.verificaciones || []),
      ...(v.tenencias || []),
      ...(v.serviciosLlantas || []),
      ...(v.serviciosFreno || []),
      ...(v.serviciosAmortiguador || [])
    ]

    services.forEach(s => {
      if (s.status === 'PENDIENTE') stats.serviciosPendientes++
      else if (s.status === 'A_TIEMPO') stats.serviciosATiempo++
      else if (s.status === 'FINALIZADO') stats.serviciosFinalizados++
    })
  })

  // Get alerts
  const alertas: { vehiculoId: number; placa: string; mensaje: string; tipo: string }[] = []
  vehiculos.forEach(v => {
    v.serviciosAceite?.forEach(s => {
      if (s.status === 'PENDIENTE') {
        alertas.push({ vehiculoId: v.id, placa: v.numPlaca, mensaje: 'Cambio de aceite pendiente', tipo: 'Aceite' })
      }
    })
    v.verificaciones?.forEach(s => {
      if (s.status === 'PENDIENTE') {
        alertas.push({ vehiculoId: v.id, placa: v.numPlaca, mensaje: 'Verificación vencida', tipo: 'Verificación' })
      }
    })
    v.tenencias?.forEach(s => {
      if (s.status === 'PENDIENTE') {
        alertas.push({ vehiculoId: v.id, placa: v.numPlaca, mensaje: 'Tenencia pendiente de pago', tipo: 'Tenencia' })
      }
    })
    v.serviciosLlantas?.forEach(s => {
      if (s.status === 'PENDIENTE') {
        alertas.push({ vehiculoId: v.id, placa: v.numPlaca, mensaje: 'Cambio de llantas requerido', tipo: 'Llantas' })
      }
    })
    v.serviciosFreno?.forEach(s => {
      if (s.status === 'PENDIENTE') {
        alertas.push({ vehiculoId: v.id, placa: v.numPlaca, mensaje: 'Servicio de frenos pendiente', tipo: 'Frenos' })
      }
    })
    v.serviciosAmortiguador?.forEach(s => {
      if (s.status === 'PENDIENTE') {
        alertas.push({ vehiculoId: v.id, placa: v.numPlaca, mensaje: 'Revisión de amortiguadores', tipo: 'Amort.' })
      }
    })
  })

  const statCards = [
    {
      title: 'Total Vehículos',
      value: stats.totalVehiculos,
      icon: Car,
      color: 'text-foreground',
    },
    {
      title: 'Propietarios',
      value: stats.totalPropietarios,
      icon: Users,
      color: 'text-foreground',
    },
    {
      title: 'Servicios Pendientes',
      value: stats.serviciosPendientes,
      icon: AlertTriangle,
      color: 'text-pending',
    },
    {
      title: 'Al Día',
      value: stats.serviciosATiempo,
      icon: Clock,
      color: 'text-warning',
    },
    {
      title: 'Finalizados',
      value: stats.serviciosFinalizados,
      icon: CheckCircle,
      color: 'text-success',
    },
    {
      title: 'KM Totales',
      value: stats.kmTotal.toLocaleString(),
      icon: Gauge,
      color: 'text-foreground',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-balance">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la flota vehicular</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="mt-3">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alertas */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-pending" />
              Alertas Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertas.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay alertas pendientes</p>
            ) : (
              alertas.slice(0, 5).map((alerta, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onVehiculoClick(alerta.vehiculoId)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{alerta.mensaje}</p>
                    <p className="text-xs text-muted-foreground">{alerta.placa}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="ml-2 bg-pending/20 text-pending border-0 shrink-0"
                  >
                    {alerta.tipo}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Vehículos Recientes */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehículos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {vehiculos.slice(0, 5).map((vehiculo) => {
              const pendientes = [
                vehiculo.serviciosAceite?.some((s) => s.status === 'PENDIENTE'),
                vehiculo.verificaciones?.some((s) => s.status === 'PENDIENTE'),
                vehiculo.tenencias?.some((s) => s.status === 'PENDIENTE'),
                vehiculo.serviciosLlantas?.some((s) => s.status === 'PENDIENTE'),
                vehiculo.serviciosAmortiguador?.some((s) => s.status === 'PENDIENTE'),
                vehiculo.serviciosFreno?.some((s) => s.status === 'PENDIENTE'),
              ].filter(Boolean).length

              return (
                <div
                  key={vehiculo.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onVehiculoClick(vehiculo.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {vehiculo.submarca?.modelo?.marca?.nombre} {vehiculo.submarca?.modelo?.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">{vehiculo.numPlaca}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{vehiculo.kilometraje.toLocaleString()} km</p>
                    {pendientes > 0 ? (
                      <Badge variant="secondary" className="bg-pending/20 text-pending border-0 text-xs">
                        {pendientes} pendiente{pendientes > 1 ? 's' : ''}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-success/20 text-success border-0 text-xs">
                        Al día
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
