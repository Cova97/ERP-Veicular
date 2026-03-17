'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  Car, 
  Droplets, 
  Shield, 
  Receipt, 
  CircleDot, 
  Disc, 
  Gauge,
  User,
  Calendar,
  Hash,
  CheckCircle,
  Pencil
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useVehiculoStore } from '@/lib/store'
import { StatusBadge } from './status-badge'
import { ServicioDialog } from './servicio-dialog'
import { VehiculoDialog } from './vehiculo-dialog'

interface VehiculoDetailProps {
  vehiculoId: number
  onBack: () => void
}

export function VehiculoDetail({ vehiculoId, onBack }: VehiculoDetailProps) {
  const vehiculos = useVehiculoStore((state) => state.vehiculos)
  const vehiculo = vehiculos.find((v) => v.id === vehiculoId)
  
  const [servicioDialogOpen, setServicioDialogOpen] = useState(false)
  const [servicioTipo, setServicioTipo] = useState<'aceite' | 'verificacion' | 'tenencia' | 'llantas' | 'frenos' | 'amortiguadores'>('aceite')
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  if (!vehiculo) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vehículo no encontrado</p>
        <Button variant="ghost" className="mt-4" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>
    )
  }

  const servicioAceite = vehiculo.serviciosAceite?.[0]
  const verificacion = vehiculo.verificaciones?.[0]
  const tenencia = vehiculo.tenencias?.[0]
  const servicioLlantas = vehiculo.serviciosLlantas?.[0]
  const servicioFreno = vehiculo.serviciosFreno?.[0]
  const servicioAmortiguador = vehiculo.serviciosAmortiguador?.[0]

  const vehiculoInfo = `${vehiculo.submarca?.modelo?.marca?.nombre || ''} ${vehiculo.submarca?.modelo?.nombre || ''} - ${vehiculo.numPlaca}`

  const openServicioDialog = (tipo: typeof servicioTipo) => {
    setServicioTipo(tipo)
    setServicioDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-balance">
              {vehiculo.submarca?.modelo?.marca?.nombre} {vehiculo.submarca?.modelo?.nombre}
            </h1>
            <p className="text-muted-foreground">{vehiculo.numPlaca}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Vehicle Info Card */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="h-32 w-32 rounded-xl bg-secondary flex items-center justify-center shrink-0 mx-auto md:mx-0">
              <Car className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="flex-1 grid gap-4 grid-cols-2 md:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Placa
                </p>
                <p className="font-medium">{vehiculo.numPlaca}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" /> No. Serie
                </p>
                <p className="font-medium text-sm">{vehiculo.numSerie}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Año
                </p>
                <p className="font-medium">{vehiculo.anio}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Color</p>
                <p className="font-medium">{vehiculo.color}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Gauge className="h-3 w-3" /> Kilometraje
                </p>
                <p className="font-medium">{vehiculo.kilometraje.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Submarca</p>
                <p className="font-medium">{vehiculo.submarca?.nombre}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Propietario
                </p>
                <p className="font-medium">
                  {vehiculo.propietario 
                    ? `${vehiculo.propietario.nombre} ${vehiculo.propietario.apellido}` 
                    : 'Sin asignar'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Tabs */}
      <Tabs defaultValue="aceite" className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-secondary p-1">
          <TabsTrigger value="aceite" className="flex-1 gap-1 data-[state=active]:bg-background text-xs sm:text-sm">
            <Droplets className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Aceite</span>
          </TabsTrigger>
          <TabsTrigger value="verificacion" className="flex-1 gap-1 data-[state=active]:bg-background text-xs sm:text-sm">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Verificación</span>
          </TabsTrigger>
          <TabsTrigger value="tenencia" className="flex-1 gap-1 data-[state=active]:bg-background text-xs sm:text-sm">
            <Receipt className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Tenencia</span>
          </TabsTrigger>
          <TabsTrigger value="llantas" className="flex-1 gap-1 data-[state=active]:bg-background text-xs sm:text-sm">
            <CircleDot className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Llantas</span>
          </TabsTrigger>
          <TabsTrigger value="frenos" className="flex-1 gap-1 data-[state=active]:bg-background text-xs sm:text-sm">
            <Disc className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Frenos</span>
          </TabsTrigger>
          <TabsTrigger value="amortiguadores" className="flex-1 gap-1 data-[state=active]:bg-background text-xs sm:text-sm">
            <Gauge className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Amort.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="aceite" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Servicio de Aceite
                </span>
                <div className="flex items-center gap-2">
                  {servicioAceite && <StatusBadge status={servicioAceite.status} />}
                  {servicioAceite?.status !== 'FINALIZADO' && (
                    <Button size="sm" onClick={() => openServicioDialog('aceite')}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar Realizado
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {servicioAceite ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Último Servicio</p>
                      <p className="font-medium">{servicioAceite.fechaUltimoServicio.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">KM al Último Servicio</p>
                      <p className="font-medium">{servicioAceite.kmUltimoServicio.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Próximo Servicio</p>
                      <p className="font-medium">{servicioAceite.proximaFecha.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Próximo KM</p>
                      <p className="font-medium">{servicioAceite.proximoKm.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="sm:col-span-2 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Intervalo</p>
                    <p className="font-medium">
                      Cada {servicioAceite.intervaloKm.toLocaleString()} km o {servicioAceite.intervaloMeses} meses
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay registros de servicio de aceite</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verificacion" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Verificación Vehicular
                </span>
                <div className="flex items-center gap-2">
                  {verificacion && <StatusBadge status={verificacion.status} />}
                  {verificacion?.status !== 'FINALIZADO' && (
                    <Button size="sm" onClick={() => openServicioDialog('verificacion')}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar Realizado
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verificacion ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Última Verificación</p>
                      <p className="font-medium">{verificacion.fechaUltima.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Holograma</p>
                      <p className="font-medium">{verificacion.holograma || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Próxima Verificación</p>
                      <p className="font-medium">{verificacion.proximaFecha.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Centro</p>
                      <p className="font-medium">{verificacion.centro || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay registros de verificación</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenencia" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Tenencia
                </span>
                <div className="flex items-center gap-2">
                  {tenencia && <StatusBadge status={tenencia.status} />}
                  {tenencia?.status !== 'FINALIZADO' && (
                    <Button size="sm" onClick={() => openServicioDialog('tenencia')}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar Pagado
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tenencia ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Año Fiscal</p>
                      <p className="font-medium">{tenencia.anioFiscal}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Monto</p>
                      <p className="font-medium">${tenencia.monto?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha Límite</p>
                      <p className="font-medium">{tenencia.fechaLimite.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Folio</p>
                      <p className="font-medium">{tenencia.folio || 'Pendiente'}</p>
                    </div>
                  </div>
                  <div className="sm:col-span-2 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Estado de Pago</p>
                    <p className="font-medium">
                      {tenencia.pagado 
                        ? `Pagado el ${tenencia.fechaPago?.toLocaleDateString()}` 
                        : 'Pendiente de pago'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay registros de tenencia</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llantas" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4" />
                  Servicio de Llantas
                </span>
                <div className="flex items-center gap-2">
                  {servicioLlantas && <StatusBadge status={servicioLlantas.status} />}
                  {servicioLlantas?.status !== 'FINALIZADO' && (
                    <Button size="sm" onClick={() => openServicioDialog('llantas')}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar Realizado
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {servicioLlantas ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">KM Último Servicio</p>
                      <p className="font-medium">{servicioLlantas.kmUltimoServicio.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Intervalo</p>
                      <p className="font-medium">{servicioLlantas.intervaloKm.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Próximo Servicio</p>
                      <p className="font-medium">{servicioLlantas.proximoKm.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay registros de servicio de llantas</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frenos" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Disc className="h-4 w-4" />
                  Servicio de Frenos
                </span>
                <div className="flex items-center gap-2">
                  {servicioFreno && <StatusBadge status={servicioFreno.status} />}
                  {servicioFreno?.status !== 'FINALIZADO' && (
                    <Button size="sm" onClick={() => openServicioDialog('frenos')}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar Realizado
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {servicioFreno ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">KM Último Servicio</p>
                      <p className="font-medium">{servicioFreno.kmUltimoServicio.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Intervalo</p>
                      <p className="font-medium">{servicioFreno.intervaloKm.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Próximo Servicio</p>
                      <p className="font-medium">{servicioFreno.proximoKm.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay registros de servicio de frenos</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amortiguadores" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Servicio de Amortiguadores
                </span>
                <div className="flex items-center gap-2">
                  {servicioAmortiguador && <StatusBadge status={servicioAmortiguador.status} />}
                  {servicioAmortiguador?.status !== 'FINALIZADO' && (
                    <Button size="sm" onClick={() => openServicioDialog('amortiguadores')}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar Realizado
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {servicioAmortiguador ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">KM Último Servicio</p>
                      <p className="font-medium">{servicioAmortiguador.kmUltimoServicio.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Intervalo</p>
                      <p className="font-medium">{servicioAmortiguador.intervaloKm.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Próximo Servicio</p>
                      <p className="font-medium">{servicioAmortiguador.proximoKm.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay registros de servicio de amortiguadores</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ServicioDialog
        open={servicioDialogOpen}
        onOpenChange={setServicioDialogOpen}
        vehiculoId={vehiculoId}
        vehiculoInfo={vehiculoInfo}
        tipoServicio={servicioTipo}
        kmActual={vehiculo.kilometraje}
      />
      
      <VehiculoDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        vehiculo={vehiculo}
        mode="edit"
      />
    </div>
  )
}
