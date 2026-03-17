'use client'

import { useState } from 'react'
import { Car, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useVehiculoStore } from '@/lib/store'
import { StatusBadge } from './status-badge'
import { VehiculoDialog } from './vehiculo-dialog'

interface VehiculosListProps {
  searchTerm: string
  onVehiculoClick: (id: number) => void
}

export function VehiculosList({ searchTerm, onVehiculoClick }: VehiculosListProps) {
  const vehiculos = useVehiculoStore((state) => state.vehiculos)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredVehiculos = vehiculos.filter((v) => {
    const term = searchTerm.toLowerCase()
    const marcaNombre = v.submarca?.modelo?.marca?.nombre?.toLowerCase() || ''
    const modeloNombre = v.submarca?.modelo?.nombre?.toLowerCase() || ''
    const propietarioNombre = v.propietario ? `${v.propietario.nombre} ${v.propietario.apellido}`.toLowerCase() : ''
    
    return (
      v.numPlaca.toLowerCase().includes(term) ||
      v.numSerie.toLowerCase().includes(term) ||
      marcaNombre.includes(term) ||
      modeloNombre.includes(term) ||
      propietarioNombre.includes(term) ||
      v.color.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-balance">Vehículos</h1>
          <p className="text-muted-foreground">Gestiona tu flota de vehículos</p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Vehículo</span>
        </Button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVehiculos.map((vehiculo) => {
          const pendientes = [
            vehiculo.serviciosAceite?.some((s) => s.status === 'PENDIENTE'),
            vehiculo.verificaciones?.some((s) => s.status === 'PENDIENTE'),
            vehiculo.tenencias?.some((s) => s.status === 'PENDIENTE'),
            vehiculo.serviciosLlantas?.some((s) => s.status === 'PENDIENTE'),
            vehiculo.serviciosAmortiguador?.some((s) => s.status === 'PENDIENTE'),
            vehiculo.serviciosFreno?.some((s) => s.status === 'PENDIENTE'),
          ].filter(Boolean).length

          const globalStatus = pendientes > 0 ? 'PENDIENTE' : 'FINALIZADO'

          return (
            <Card 
              key={vehiculo.id} 
              className="bg-card border-border cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => onVehiculoClick(vehiculo.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {vehiculo.submarca?.modelo?.marca?.nombre} {vehiculo.submarca?.modelo?.nombre}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{vehiculo.submarca?.nombre}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Placa</p>
                    <p className="font-medium">{vehiculo.numPlaca}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Año</p>
                    <p className="font-medium">{vehiculo.anio}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Kilometraje</p>
                    <p className="font-medium">{vehiculo.kilometraje.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Color</p>
                    <p className="font-medium">{vehiculo.color}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    {vehiculo.propietario ? (
                      <span>{vehiculo.propietario.nombre} {vehiculo.propietario.apellido}</span>
                    ) : (
                      <span>Sin asignar</span>
                    )}
                  </div>
                  <StatusBadge status={globalStatus} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredVehiculos.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No se encontraron vehículos</p>
          <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar primer vehículo
          </Button>
        </div>
      )}

      <VehiculoDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode="create"
      />
    </div>
  )
}
