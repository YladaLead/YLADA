'use client'

import React from 'react';

interface YLADALogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  variant?: 'horizontal' | 'vertical' | 'iconOnly' | 'minimal'
  responsive?: boolean
}

export default function YLADALogo({ 
  size = 'md', 
  className = '',
  variant = 'horizontal',
  responsive = false
}: YLADALogoProps) {
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10', 
    lg: 'h-12',
    xl: 'h-16'
  }
  
  const iconSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  // Logo paths - usando os logos YLADA existentes
  const logoPaths = {
    horizontal: '/logos/ylada-logo-horizontal-vazado.png',
    vertical: '/logos/ylada-logo-main.png',
    iconOnly: '/logos/ylada-icon.png',
    minimal: '/logos/ylada-logo-text-only.png',
  }

  // For icon-only variant, don't show text
  if (variant === 'iconOnly') {
    return (
      <img
        src={logoPaths.iconOnly}
        alt="YLADA"
        className={`${iconSizeClasses[size]} ${className}`}
      />
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoPaths[variant]}
        alt="YLADA - Your Lead Advanced Data Assistant"
        className={`${responsive ? 'h-10 md:h-12 lg:h-14 w-auto' : sizeClasses[size]} w-auto`}
      />
    </div>
  )
}
