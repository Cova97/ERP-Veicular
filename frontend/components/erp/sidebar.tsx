'use client'

import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Droplets, 
  Shield, 
  Receipt, 
  CircleDot, 
  Disc, 
  Gauge,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ViewType = 
  | 'dashboard' 
  | 'vehiculos' 
  | 'propietarios' 
  | 'aceite' 
  | 'verificacion' 
  | 'tenencia' 
  | 'llantas' 
  | 'frenos' 
  | 'amortiguadores'

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vehiculos' as ViewType, label: 'Vehículos', icon: Car },
  { id: 'propietarios' as ViewType, label: 'Propietarios', icon: Users },
]

const serviciosItems = [
  { id: 'aceite' as ViewType, label: 'Cambio de Aceite', icon: Droplets },
  { id: 'verificacion' as ViewType, label: 'Verificación', icon: Shield },
  { id: 'tenencia' as ViewType, label: 'Tenencia', icon: Receipt },
  { id: 'llantas' as ViewType, label: 'Llantas', icon: CircleDot },
  { id: 'frenos' as ViewType, label: 'Frenos', icon: Disc },
  { id: 'amortiguadores' as ViewType, label: 'Amortiguadores', icon: Gauge },
]

export function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-sidebar transition-transform duration-200 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between lg:hidden mb-4">
            <span className="font-semibold">Menú</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                  currentView === item.id && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
                onClick={() => {
                  onViewChange(item.id)
                  onClose()
                }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="mt-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Servicios
            </p>
            <nav className="space-y-1">
              {serviciosItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                    currentView === item.id && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  onClick={() => {
                    onViewChange(item.id)
                    onClose()
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  )
}
