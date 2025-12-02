'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

interface PrimaryButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  fullWidth?: boolean
}

export default function PrimaryButton({
  children,
  href,
  onClick,
  className = '',
  disabled = false,
  fullWidth = false
}: PrimaryButtonProps) {
  const baseClasses = 'bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-center'
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

