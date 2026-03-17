'use client'

import { Badge } from '@/components/ui/badge'
import type { StatusServicio } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: StatusServicio
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    PENDIENTE: {
      label: 'Pendiente',
      className: 'bg-pending/20 text-pending border-0',
    },
    A_TIEMPO: {
      label: 'A Tiempo',
      className: 'bg-warning/20 text-warning border-0',
    },
    FINALIZADO: {
      label: 'Finalizado',
      className: 'bg-success/20 text-success border-0',
    },
  }

  const { label, className: statusClassName } = config[status]

  return (
    <Badge variant="secondary" className={cn(statusClassName, className)}>
      {label}
    </Badge>
  )
}
