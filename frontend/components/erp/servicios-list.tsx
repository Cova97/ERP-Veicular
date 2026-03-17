'use client'

import { useState } from 'react'
import { 
  Droplets, 
  Shield, 
  Receipt, 
  CircleDot, 
  Disc, 
  Gauge,
  ChevronRight,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useVehiculoStore } from '@/lib/store'
import { type StatusServicio, type Vehiculo } from '@/lib/mock-data'
import { StatusBadge } from './status-badge'
import { ServicioDialog } from './servicio-dialog'

type ServiceType = 'aceite' | 'verificacion' | 'tenencia' | 'llantas' | 'frenos' | 'amortiguadores'

interface ServiciosListProps {
  type: ServiceType
  searchTerm: string
  onVehiculoClick: (id: number) => void
}

const serviceConfig = {
  aceite: {
    title: 'Servicios de Aceite',
    description: 'Control de cambios de aceite por vehículo',
    icon: Droplets,
    getService: (v: Vehiculo) => v.serviciosAceite?.[0],
  },
  verificacion: {
    title: 'Verificaciones',
    description: 'Control de verificaciones vehiculares',
    icon: Shield,
    getService: (v: Vehiculo) => v.verificaciones?.[0],
  },
  tenencia: {
    title: 'Tenencias',
    description: 'Control de pagos de tenencia',
    icon: Receipt,
    getService: (v: Vehiculo) => v.tenencias?.[0],
  },
  llantas: {
    title: 'Servicios de Llantas',
    description: 'Control de rotación y cambio de llantas',
    icon: CircleDot,
    getService: (v: Vehiculo) => v.serviciosLlantas?.[0],
  },
  frenos: {
    title: 'Servicios de Frenos',
    description: 'Control de mantenimiento de frenos',
    icon: Disc,
    getService: (v: Vehiculo) => v.serviciosFreno?.[0],
  },
  amortiguadores: {
    title: 'Servicios de Amortiguadores',
    description: 'Control de mantenimiento de amortiguadores',
    icon: Gauge,
    getService: (v: Vehiculo) => v.serviciosAmortiguador?.[0],
  },
}

export function ServiciosList({ type, searchTerm, onVehiculoClick }: ServiciosListProps) {
  const vehiculos = useVehiculoStore((state) => state.vehiculos)
  const config = serviceConfig[type]
  const Icon = config.icon

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null)

  const filteredVehiculos = vehiculos.filter((v) => {
    const term = searchTerm.toLowerCase()
    const marcaNombre = v.submarca?.modelo?.marca?.nombre?.toLowerCase() || ''
    const modeloNombre = v.submarca?.modelo?.nombre?.toLowerCase() || ''
    
    return (
      v.numPlaca.toLowerCase().includes(term) ||
      marcaNombre.includes(term) ||
      modeloNombre.includes(term)
    )
  })

  // Sort by status: PENDIENTE first, then A_TIEMPO, then FINALIZADO
  const sortedVehiculos = [...filteredVehiculos].sort((a, b) => {
    const statusOrder: Record<StatusServicio, number> = {
      PENDIENTE: 0,
      A_TIEMPO: 1,
      FINALIZADO: 2,
    }
    const serviceA = config.getService(a)
    const serviceB = config.getService(b)
    const statusA = serviceA?.status || 'FINALIZADO'
    const statusB = serviceB?.status || 'FINALIZADO'
    return statusOrder[statusA] - statusOrder[statusB]
  })

  const stats = {
    pendientes: sortedVehiculos.filter((v) => config.getService(v)?.status === 'PENDIENTE').length,
    aTiempo: sortedVehiculos.filter((v) => config.getService(v)?.status === 'A_TIEMPO').length,
    finalizados: sortedVehiculos.filter((v) => config.getService(v)?.status === 'FINALIZADO').length,
  }

  const handleMarcarRealizado = (vehiculo: Vehiculo, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedVehiculo(vehiculo)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-balance">{config.title}</h1>
        <p className="text-muted-foreground">{config.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-pending/10 border-pending/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-pending">{stats.pendientes}</p>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card className="bg-warning/10 border-warning/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-warning">{stats.aTiempo}</p>
            <p className="text-xs text-muted-foreground">A Tiempo</p>
          </CardContent>
        </Card>
        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-success">{stats.finalizados}</p>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Icon className="h-4 w-4" />
            Lista de Vehículos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {sortedVehiculos.map((vehiculo) => {
              const service = config.getService(vehiculo)
              const isPending = service?.status !== 'FINALIZADO'
              
              return (
                <div
                  key={vehiculo.id}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => onVehiculoClick(vehiculo.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {vehiculo.submarca?.modelo?.marca?.nombre} {vehiculo.submarca?.modelo?.nombre}
                      </p>
                      <p className="text-sm text-muted-foreground">{vehiculo.numPlaca}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {service ? (
                      <div className="text-right hidden sm:block">
                        {type === 'aceite' && 'proximaFecha' in service && (
                          <p className="text-xs text-muted-foreground">
                            Próximo: {new Date(service.proximaFecha).toLocaleDateString()}
                          </p>
                        )}
                        {type === 'verificacion' && 'proximaFecha' in service && (
                          <p className="text-xs text-muted-foreground">
                            Próximo: {new Date(service.proximaFecha).toLocaleDateString()}
                          </p>
                        )}
                        {type === 'tenencia' && 'fechaLimite' in service && (
                          <p className="text-xs text-muted-foreground">
                            Límite: {new Date(service.fechaLimite).toLocaleDateString()}
                          </p>
                        )}
                        {(type === 'llantas' || type === 'frenos' || type === 'amortiguadores') && 'proximoKm' in service && (
                          <p className="text-xs text-muted-foreground">
                            Próximo: {service.proximoKm.toLocaleString()} km
                          </p>
                        )}
                      </div>
                    ) : null}
                    
                    {isPending && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="hidden sm:flex"
                        onClick={(e) => handleMarcarRealizado(vehiculo, e)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Marcar
                      </Button>
                    )}
                    
                    <StatusBadge status={service?.status || 'FINALIZADO'} />
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {sortedVehiculos.length === 0 && (
        <div className="text-center py-12">
          <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No se encontraron registros</p>
        </div>
      )}

      {selectedVehiculo && (
        <ServicioDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          vehiculoId={selectedVehiculo.id}
          vehiculoInfo={`${selectedVehiculo.submarca?.modelo?.marca?.nombre || ''} ${selectedVehiculo.submarca?.modelo?.nombre || ''} - ${selectedVehiculo.numPlaca}`}
          tipoServicio={type}
          kmActual={selectedVehiculo.kilometraje}
        />
      )}
    </div>
  )
}
