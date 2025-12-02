'use client'

import { ReactNode } from 'react'

interface KPICardProps {
  icon: string
  value: string | number
  label: string
  description?: string
  className?: string
  onClick?: () => void
}

export default function KPICard({
  icon,
  value,
  label,
  description,
  className = '',
  onClick
}: KPICardProps) {
  return (
    <div
      className={`bg-white rounded-lg p-4 border border-gray-200 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  )
}

