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
  aceite:          'Cambio de Aceite',
  verificacion:    'Verificación Vehicular',
  tenencia:        'Pago de Tenencia',
  llantas:         'Cambio de Llantas',
  frenos:          'Servicio de Frenos',
  amortiguadores:  'Cambio de Amortiguadores',
}

export function ServicioDialog({
  open,
  onOpenChange,
  vehiculoId,
  vehiculoInfo,
  tipoServicio,
  kmActual,
}: ServicioDialogProps) {
  const marcarServicioRealizado = useVehiculoStore((state) => state.marcarServicioRealizado)

  const [nuevoKm, setNuevoKm]   = useState(kmActual.toString())
  const [taller, setTaller]     = useState('')
  const [costo, setCosto]       = useState('')
  const [notas, setNotas]       = useState('')
  const [monto, setMonto]       = useState('')      // solo tenencia
  const [folio, setFolio]       = useState('')      // solo tenencia
  const [holograma, setHolograma] = useState('')    // solo verificacion
  const [centro, setCentro]     = useState('')      // solo verificacion
  const [tipoServicioExtra, setTipoServicioExtra] = useState('') // llantas/frenos/amort
  const [tipoAceite, setTipoAceite] = useState('')  // solo aceite
  const [isSubmitting, setIsSubmitting] = useState(false)

  const needsKm = tipoServicio !== 'verificacion' && tipoServicio !== 'tenencia'

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await marcarServicioRealizado(
        vehiculoId,
        tipoServicio,
        parseInt(nuevoKm) || kmActual,
        {
          taller:       taller || undefined,
          costo:        costo ? parseFloat(costo) : undefined,
          notas:        notas || undefined,
          monto:        monto ? parseFloat(monto) : undefined,
          folio:        folio || undefined,
          holograma:    holograma || undefined,
          centro:       centro || undefined,
          tipoServicio: tipoServicioExtra || undefined,
          tipoAceite:   tipoAceite || undefined,
        },
      )
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

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

          {tipoServicio === 'aceite' && (
            <div className="grid gap-2">
              <Label htmlFor="tipoAceite">Tipo de Aceite</Label>
              <Input
                id="tipoAceite"
                value={tipoAceite}
                onChange={(e) => setTipoAceite(e.target.value)}
                placeholder="5W-30 Sintético"
              />
            </div>
          )}

          {tipoServicio === 'verificacion' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="holograma">Holograma</Label>
                <Input
                  id="holograma"
                  value={holograma}
                  onChange={(e) => setHolograma(e.target.value)}
                  placeholder="A-1234567"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="centro">Centro de Verificación</Label>
                <Input
                  id="centro"
                  value={centro}
                  onChange={(e) => setCentro(e.target.value)}
                  placeholder="Verificentro Norte"
                />
              </div>
            </>
          )}

          {tipoServicio === 'tenencia' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="monto">Monto Pagado *</Label>
                <Input
                  id="monto"
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="2800"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="folio">Folio de Pago</Label>
                <Input
                  id="folio"
                  value={folio}
                  onChange={(e) => setFolio(e.target.value)}
                  placeholder="TEN-2025-001"
                />
              </div>
            </>
          )}

          {(tipoServicio === 'llantas' || tipoServicio === 'frenos' || tipoServicio === 'amortiguadores') && (
            <div className="grid gap-2">
              <Label htmlFor="tipoServicioExtra">Tipo de Servicio</Label>
              <Input
                id="tipoServicioExtra"
                value={tipoServicioExtra}
                onChange={(e) => setTipoServicioExtra(e.target.value)}
                placeholder={
                  tipoServicio === 'llantas' ? 'Rotación, Cambio completo...' :
                  tipoServicio === 'frenos'  ? 'Pastillas, Discos...' :
                  'Cambio delantero, Cambio trasero...'
                }
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="taller">Taller</Label>
            <Input
              id="taller"
              value={taller}
              onChange={(e) => setTaller(e.target.value)}
              placeholder="Nombre del taller"
            />
          </div>

          {tipoServicio !== 'tenencia' && (
            <div className="grid gap-2">
              <Label htmlFor="costo">Costo</Label>
              <Input
                id="costo"
                type="number"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                placeholder="0.00"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="notas">Notas</Label>
            <Input
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observaciones opcionales"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (tipoServicio === 'tenencia' && !monto)}
          >
            {isSubmitting ? 'Guardando...' : (
              <><Check className="h-4 w-4 mr-2" />Confirmar Servicio</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}