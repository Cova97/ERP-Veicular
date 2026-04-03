'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/erp/header'
import { Sidebar, type ViewType } from '@/components/erp/sidebar'
import { Dashboard } from '@/components/erp/dashboard'
import { VehiculosList } from '@/components/erp/vehiculos-list'
import { VehiculoDetail } from '@/components/erp/vehiculo-detail'
import { PropietariosList } from '@/components/erp/propietarios-list'
import { ServiciosList } from '@/components/erp/servicios-list'
import { useVehiculoStore } from '@/lib/store'

export default function Home() {
  const loadAll = useVehiculoStore((state) => state.loadAll)
  const loading = useVehiculoStore((state) => state.loading)
  const error   = useVehiculoStore((state) => state.error)

  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVehiculo, setSelectedVehiculo] = useState<number | null>(null)

  // Carga inicial de todos los datos
  useEffect(() => {
    loadAll()
  }, [loadAll])

  const handleVehiculoClick  = (id: number) => setSelectedVehiculo(id)
  const handleBackFromDetail = () => setSelectedVehiculo(null)
  const handleViewChange     = (view: ViewType) => {
    setCurrentView(view)
    setSelectedVehiculo(null)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-24">
          <p className="text-muted-foreground text-sm">Cargando datos...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-destructive text-sm">Error al conectar con el servidor</p>
          <p className="text-muted-foreground text-xs">{error}</p>
          <button
            className="text-sm underline text-muted-foreground"
            onClick={() => loadAll()}
          >
            Reintentar
          </button>
        </div>
      )
    }

    if (selectedVehiculo !== null) {
      return (
        <VehiculoDetail
          vehiculoId={selectedVehiculo}
          onBack={handleBackFromDetail}
        />
      )
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onVehiculoClick={handleVehiculoClick} />
      case 'vehiculos':
        return <VehiculosList searchTerm={searchTerm} onVehiculoClick={handleVehiculoClick} />
      case 'propietarios':
        return <PropietariosList searchTerm={searchTerm} />
      case 'aceite':
        return <ServiciosList type="aceite" searchTerm={searchTerm} onVehiculoClick={handleVehiculoClick} />
      case 'verificacion':
        return <ServiciosList type="verificacion" searchTerm={searchTerm} onVehiculoClick={handleVehiculoClick} />
      case 'tenencia':
        return <ServiciosList type="tenencia" searchTerm={searchTerm} onVehiculoClick={handleVehiculoClick} />
      case 'llantas':
        return <ServiciosList type="llantas" searchTerm={searchTerm} onVehiculoClick={handleVehiculoClick} />
      case 'frenos':
        return <ServiciosList type="frenos" searchTerm={searchTerm} onVehiculoClick={handleVehiculoClick} />
      case 'amortiguadores':
        return <ServiciosList type="amortiguadores" searchTerm={searchTerm} onVehiculoClick={handleVehiculoClick} />
      default:
        return <Dashboard onVehiculoClick={handleVehiculoClick} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="lg:pl-64 pt-4 px-4 lg:px-6 pb-8">
        {renderContent()}
      </main>
    </div>
  )
}