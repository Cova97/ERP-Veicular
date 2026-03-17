'use client'

import { useState, useEffect } from 'react'
import { User, Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useVehiculoStore } from '@/lib/store'
import type { Propietario } from '@/lib/mock-data'

interface PropietarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  propietario?: Propietario | null
  mode: 'create' | 'edit'
}

export function PropietarioDialog({
  open,
  onOpenChange,
  propietario,
  mode
}: PropietarioDialogProps) {
  const addPropietario = useVehiculoStore((state) => state.addPropietario)
  const updatePropietario = useVehiculoStore((state) => state.updatePropietario)
  const deletePropietario = useVehiculoStore((state) => state.deletePropietario)
  const vehiculos = useVehiculoStore((state) => state.vehiculos)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: ''
  })

  useEffect(() => {
    if (propietario && mode === 'edit') {
      setFormData({
        nombre: propietario.nombre,
        apellido: propietario.apellido,
        telefono: propietario.telefono || '',
        email: propietario.email || ''
      })
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        telefono: '',
        email: ''
      })
    }
  }, [propietario, mode, open])

  const vehiculosAsignados = propietario 
    ? vehiculos.filter(v => v.propietarioId === propietario.id)
    : []

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const data = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono || undefined,
      email: formData.email || undefined
    }
    
    if (mode === 'create') {
      addPropietario(data)
    } else if (propietario) {
      updatePropietario(propietario.id, data)
    }
    
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const handleDelete = async () => {
    if (!propietario) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    deletePropietario(propietario.id)
    setIsSubmitting(false)
    setShowDeleteConfirm(false)
    onOpenChange(false)
  }

  const isValid = formData.nombre && formData.apellido

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'create' ? <Plus className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
            {mode === 'create' ? 'Nuevo Propietario' : 'Editar Propietario'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Ingresa los datos del nuevo propietario' 
              : `Editando: ${propietario?.nombre} ${propietario?.apellido}`}
          </DialogDescription>
        </DialogHeader>
        
        {showDeleteConfirm ? (
          <div className="py-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="font-medium">Eliminar propietario</p>
              <p className="text-sm text-muted-foreground">
                Esta acción no se puede deshacer. 
                {vehiculosAsignados.length > 0 && (
                  <span className="block mt-1 text-warning">
                    Tiene {vehiculosAsignados.length} vehículo(s) asignado(s) que quedarán sin propietario.
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                {isSubmitting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Juan"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
                    placeholder="Pérez García"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                  placeholder="+52 55 1234 5678"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              {mode === 'edit' && vehiculosAsignados.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">
                    Vehículos asignados ({vehiculosAsignados.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {vehiculosAsignados.map(v => (
                      <span 
                        key={v.id} 
                        className="text-xs px-2 py-1 bg-secondary rounded"
                      >
                        {v.numPlaca}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {mode === 'edit' && (
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="sm:mr-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !isValid}>
                {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear Propietario' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
