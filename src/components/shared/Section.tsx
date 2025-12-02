'use client'

import { ReactNode } from 'react'

interface SectionProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export default function Section({ title, subtitle, children, className = '' }: SectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600 text-sm sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

