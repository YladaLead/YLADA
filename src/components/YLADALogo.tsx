'use client'

import React from 'react';
import Image from 'next/image';

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
    sm: { width: 120, height: 32 },
    md: { width: 150, height: 40 }, 
    lg: { width: 200, height: 56 },
    xl: { width: 250, height: 64 }
  }
  
  const iconSizeClasses = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 }, 
    lg: { width: 56, height: 56 },
    xl: { width: 64, height: 64 }
  }

  // Logo paths - usando os logos YLADA existentes
  const logoPaths = {
    horizontal: '/logos/ylada-logo-horizontal.png',
    vertical: '/logos/ylada-logo-main.png',
    iconOnly: '/logos/ylada-icon.png',
    minimal: '/logos/ylada-logo-text-only.png',
  }

  // For icon-only variant, don't show text
  if (variant === 'iconOnly') {
    return (
      <Image
        src={logoPaths.iconOnly}
        alt="YLADA"
        width={iconSizeClasses[size].width}
        height={iconSizeClasses[size].height}
        className={className}
        priority
        quality={100}
        unoptimized={false}
      />
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoPaths[variant]}
        alt="YLADA - Your Lead Advanced Data Assistant"
        width={responsive ? 200 : sizeClasses[size].width}
        height={responsive ? 56 : sizeClasses[size].height}
        className={responsive ? 'h-10 md:h-12 lg:h-14 w-auto' : 'w-auto'}
        priority
        quality={100}
        unoptimized={false}
      />
    </div>
  )
}
