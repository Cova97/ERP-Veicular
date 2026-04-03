'use client'

import { useEffect, useState } from 'react'
import { Car, Bell, Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAlertas } from '@/lib/api'

interface HeaderProps {
  onMenuClick: () => void
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function Header({ onMenuClick, searchTerm, onSearchChange }: HeaderProps) {
  const [alertasPendientes, setAlertasPendientes] = useState(0)

  useEffect(() => {
    getAlertas().then(({ verificaciones, tenencias }) => {
      setAlertasPendientes(verificaciones.length + tenencias.length)
    }).catch(() => setAlertasPendientes(0))
  }, [])

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-foreground" />
          <span className="text-lg font-semibold">VehiControl</span>
        </div>
      </div>

      <div className="hidden flex-1 max-w-md mx-4 md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por placa, marca, propietario..."
            className="w-full pl-9 bg-secondary border-0"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {alertasPendientes > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pending text-[10px] font-medium text-pending-foreground">
              {alertasPendientes}
            </span>
          )}
        </Button>
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-sm font-medium">AD</span>
        </div>
      </div>
    </header>
  )
}