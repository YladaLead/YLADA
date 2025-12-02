'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

interface SecondaryButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  fullWidth?: boolean
}

export default function SecondaryButton({
  children,
  href,
  onClick,
  className = '',
  disabled = false,
  fullWidth = false
}: SecondaryButtonProps) {
  const baseClasses = 'bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-center'
  const widthClasses = fullWidth ? 'w-full' : 'inline-block'

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${widthClasses} ${className}`}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${widthClasses} ${className}`}
    >
      {children}
    </button>
  )
}

