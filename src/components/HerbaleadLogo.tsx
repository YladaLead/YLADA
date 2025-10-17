'use client'

import React from 'react';
import Image from 'next/image';

interface HerbaleadLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  variant?: 'horizontal' | 'vertical' | 'iconOnly' | 'minimal'
  responsive?: boolean
}

export default function HerbaleadLogo({ 
  size = 'md', 
  className = '',
  variant = 'horizontal',
  responsive = false
}: HerbaleadLogoProps) {
  
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

  // Logo paths
  const logoPaths = {
    horizontal: '/logos/herbalead/herbalead-logo-horizontal.png',
    vertical: '/logos/herbalead/herbalead-logo-vertical.png',
    iconOnly: '/logos/herbalead/herbalead-icon-only.png',
    minimal: '/logos/herbalead/herbalead-logo-minimal.png',
  }

  // For icon-only variant, don't show text
  if (variant === 'iconOnly') {
    return (
      <Image
        src={logoPaths.iconOnly}
        alt="HerbaLead"
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
        alt="HerbaLead - Your Lead Accelerator"
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