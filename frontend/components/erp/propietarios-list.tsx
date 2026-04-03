'use client'

import { useState } from 'react'
import { Users, Plus, Mail, Phone, Car, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useVehiculoStore } from '@/lib/store'
import { PropietarioDialog } from './propietario-dialog'
import type { Propietario } from '@/lib/types'

interface PropietariosListProps {
  searchTerm: string
}

export function PropietariosList({ searchTerm }: PropietariosListProps) {
  const propietarios = useVehiculoStore((state) => state.propietarios)
  const vehiculos = useVehiculoStore((state) => state.vehiculos)
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPropietario, setEditingPropietario] = useState<Propietario | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  const filteredPropietarios = propietarios.filter((p) => {
    const term = searchTerm.toLowerCase()
    const nombreCompleto = `${p.nombre} ${p.apellido}`.toLowerCase()
    return (
      nombreCompleto.includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.telefono?.toLowerCase().includes(term)
    )
  })

  const getVehiculosPorPropietario = (propietarioId: number) => {
    return vehiculos.filter((v) => v.propietarioId === propietarioId)
  }

  const handleCreate = () => {
    setEditingPropietario(null)
    setDialogMode('create')
    setDialogOpen(true)
  }

  const handleEdit = (propietario: Propietario, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingPropietario(propietario)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-balance">Propietarios</h1>
          <p className="text-muted-foreground">Gestiona los propietarios de vehículos</p>
        </div>
        <Button className="gap-2" onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Propietario</span>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPropietarios.map((propietario) => {
          const vehiculosPropietario = getVehiculosPorPropietario(propietario.id)

          return (
            <Card 
              key={propietario.id} 
              className="bg-card border-border hover:border-muted-foreground/50 transition-colors"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium">
                        {propietario.nombre.charAt(0)}{propietario.apellido.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {propietario.nombre} {propietario.apellido}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {vehiculosPropietario.length} vehículo{vehiculosPropietario.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => handleEdit(propietario, e)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {propietario.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{propietario.email}</span>
                  </div>
                )}
                {propietario.telefono && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{propietario.telefono}</span>
                  </div>
                )}

                {vehiculosPropietario.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Vehículos asignados</p>
                    <div className="space-y-2">
                      {vehiculosPropietario.map((v) => (
                        <div 
                          key={v.id} 
                          className="flex items-center gap-2 p-2 rounded bg-secondary text-sm"
                        >
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{v.numPlaca}</span>
                          <span className="text-muted-foreground text-xs">
                            {v.submarca?.modelo?.marca?.nombre} {v.submarca?.modelo?.nombre}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredPropietarios.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No se encontraron propietarios</p>
          <Button variant="outline" className="mt-4" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar primer propietario
          </Button>
        </div>
      )}

      <PropietarioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        propietario={editingPropietario}
        mode={dialogMode}
      />
    </div>
  )
}
