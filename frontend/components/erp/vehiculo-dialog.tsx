'use client'

import { useState, useEffect } from 'react'
import { Car, Plus, Pencil, Trash2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useVehiculoStore, useMarcas, useModelos, useSubmarcas } from '@/lib/store'
import type { Vehiculo } from '@/lib/types'

interface VehiculoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehiculo?: Vehiculo | null
  mode: 'create' | 'edit'
}

export function VehiculoDialog({ open, onOpenChange, vehiculo, mode }: VehiculoDialogProps) {
  const propietarios    = useVehiculoStore((state) => state.propietarios)
  const addVehiculo     = useVehiculoStore((state) => state.addVehiculo)
  const updateVehiculo  = useVehiculoStore((state) => state.updateVehiculo)
  const deleteVehiculo  = useVehiculoStore((state) => state.deleteVehiculo)
  const loadCatalogos   = useVehiculoStore((state) => state.loadCatalogos)

  const marcas    = useMarcas()
  const modelos   = useModelos()
  const submarcas = useSubmarcas()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [formData, setFormData] = useState({
    numPlaca: '',
    numSerie: '',
    marcaId: '',
    modeloId: '',
    submarcaId: '',
    anio: new Date().getFullYear().toString(),
    color: '',
    kilometraje: '0',
    propietarioId: '',
  })

  // Cargar catálogos si aún no están en el store
  useEffect(() => {
    if (open && marcas.length === 0) loadCatalogos()
  }, [open, marcas.length, loadCatalogos])

  useEffect(() => {
    if (vehiculo && mode === 'edit') {
      const modelo = vehiculo.submarca?.modelo
      const marca  = modelo?.marca
      setFormData({
        numPlaca:      vehiculo.numPlaca,
        numSerie:      vehiculo.numSerie,
        marcaId:       marca?.id.toString() || '',
        modeloId:      modelo?.id.toString() || '',
        submarcaId:    vehiculo.submarcaId.toString(),
        anio:          vehiculo.anio.toString(),
        color:         vehiculo.color,
        kilometraje:   vehiculo.kilometraje.toString(),
        propietarioId: vehiculo.propietarioId?.toString() || '',
      })
    } else {
      setFormData({
        numPlaca: '', numSerie: '', marcaId: '', modeloId: '',
        submarcaId: '', anio: new Date().getFullYear().toString(),
        color: '', kilometraje: '0', propietarioId: '',
      })
    }
  }, [vehiculo, mode, open])

  const filteredModelos   = modelos.filter((m) => m.marcaId === parseInt(formData.marcaId))
  const filteredSubmarcas = submarcas.filter((s) => s.modeloId === parseInt(formData.modeloId))

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const dto = {
        numPlaca:      formData.numPlaca,
        numSerie:      formData.numSerie,
        submarcaId:    parseInt(formData.submarcaId),
        anio:          parseInt(formData.anio),
        color:         formData.color,
        kilometraje:   parseInt(formData.kilometraje),
        propietarioId: formData.propietarioId ? parseInt(formData.propietarioId) : undefined,
      }
      if (mode === 'create') {
        await addVehiculo(dto)
      } else if (vehiculo) {
        await updateVehiculo(vehiculo.id, dto)
      }
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!vehiculo) return
    setIsSubmitting(true)
    try {
      await deleteVehiculo(vehiculo.id)
      setShowDeleteConfirm(false)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = formData.numPlaca && formData.numSerie && formData.submarcaId && formData.color

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'create' ? <Plus className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
            {mode === 'create' ? 'Nuevo Vehículo' : 'Editar Vehículo'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Ingresa los datos del nuevo vehículo'
              : `Editando: ${vehiculo?.numPlaca}`}
          </DialogDescription>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="py-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="font-medium">Eliminar vehículo</p>
              <p className="text-sm text-muted-foreground">
                Esta acción no se puede deshacer. Se eliminará el vehículo {vehiculo?.numPlaca}.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
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
                  <Label htmlFor="numPlaca">Número de Placa *</Label>
                  <Input
                    id="numPlaca"
                    value={formData.numPlaca}
                    onChange={(e) => setFormData((p) => ({ ...p, numPlaca: e.target.value.toUpperCase() }))}
                    placeholder="ABC-123-A"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="numSerie">Número de Serie *</Label>
                  <Input
                    id="numSerie"
                    value={formData.numSerie}
                    onChange={(e) => setFormData((p) => ({ ...p, numSerie: e.target.value.toUpperCase() }))}
                    placeholder="1HGBH41JXMN109186"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Marca</Label>
                <Select
                  value={formData.marcaId || undefined}
                  onValueChange={(v) => setFormData((p) => ({ ...p, marcaId: v, modeloId: '', submarcaId: '' }))}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona una marca" /></SelectTrigger>
                  <SelectContent>
                    {marcas.map((m) => (
                      <SelectItem key={m.id} value={m.id.toString()}>{m.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Modelo</Label>
                  <Select
                    value={formData.modeloId || undefined}
                    onValueChange={(v) => setFormData((p) => ({ ...p, modeloId: v, submarcaId: '' }))}
                    disabled={!formData.marcaId}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecciona modelo" /></SelectTrigger>
                    <SelectContent>
                      {filteredModelos.map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>{m.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Submarca *</Label>
                  <Select
                    value={formData.submarcaId || undefined}
                    onValueChange={(v) => setFormData((p) => ({ ...p, submarcaId: v }))}
                    disabled={!formData.modeloId}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecciona submarca" /></SelectTrigger>
                    <SelectContent>
                      {filteredSubmarcas.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="anio">Año</Label>
                  <Input
                    id="anio" type="number" min="1990" max={new Date().getFullYear() + 1}
                    value={formData.anio}
                    onChange={(e) => setFormData((p) => ({ ...p, anio: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color" value={formData.color} placeholder="Blanco"
                    onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="km">Kilometraje</Label>
                  <Input
                    id="km" type="number" min="0" value={formData.kilometraje}
                    onChange={(e) => setFormData((p) => ({ ...p, kilometraje: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Propietario</Label>
                <Select
                  value={formData.propietarioId || 'none'}
                  onValueChange={(v) => setFormData((p) => ({ ...p, propietarioId: v === 'none' ? '' : v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {propietarios.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.nombre} {p.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {mode === 'edit' && (
                <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="sm:mr-auto">
                  <Trash2 className="h-4 w-4 mr-2" />Eliminar
                </Button>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !isValid}>
                {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear Vehículo' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}