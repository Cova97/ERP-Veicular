'use client'

import { useState } from 'react'
import { Check, Wrench } from 'lucide-react'
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

interface ServicioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehiculoId: number
  vehiculoInfo: string
  tipoServicio: 'aceite' | 'verificacion' | 'tenencia' | 'llantas' | 'frenos' | 'amortiguadores'
  kmActual: number
}

const servicioLabels: Record<string, string> = {
  aceite: 'Cambio de Aceite',
  verificacion: 'Verificación Vehicular',
  tenencia: 'Pago de Tenencia',
  llantas: 'Cambio de Llantas',
  frenos: 'Servicio de Frenos',
  amortiguadores: 'Cambio de Amortiguadores'
}

export function ServicioDialog({
  open,
  onOpenChange,
  vehiculoId,
  vehiculoInfo,
  tipoServicio,
  kmActual
}: ServicioDialogProps) {
  const [nuevoKm, setNuevoKm] = useState(kmActual.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const marcarServicioRealizado = useVehiculoStore((state) => state.marcarServicioRealizado)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    marcarServicioRealizado(
      vehiculoId, 
      tipoServicio, 
      parseInt(nuevoKm) || kmActual
    )
    
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const needsKm = tipoServicio !== 'verificacion' && tipoServicio !== 'tenencia'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Registrar Servicio
          </DialogTitle>
          <DialogDescription>
            Registrar {servicioLabels[tipoServicio]} para {vehiculoInfo}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {needsKm && (
            <div className="grid gap-2">
              <Label htmlFor="km">Kilometraje Actual</Label>
              <Input
                id="km"
                type="number"
                value={nuevoKm}
                onChange={(e) => setNuevoKm(e.target.value)}
                placeholder="Ingresa el kilometraje actual"
              />
              <p className="text-xs text-muted-foreground">
                Kilometraje anterior: {kmActual.toLocaleString()} km
              </p>
            </div>
          )}
          
          {tipoServicio === 'verificacion' && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Se registrará la verificación con la fecha de hoy.
              </p>
            </div>
          )}
          
          {tipoServicio === 'tenencia' && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Se marcará la tenencia como pagada con la fecha de hoy.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              'Guardando...'
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirmar Servicio
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
