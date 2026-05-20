'use client'

import React from 'react'
import Image from 'next/image'
import { logos } from '@/lib/logos-config'

interface YLADALogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  /** horizontal = lockup completo | iconOnly/quadrado = ícone quadrado */
  variant?: 'horizontal' | 'vertical' | 'iconOnly' | 'minimal' | 'quadrado'
  /** dark = versão para fundo escuro (navy) */
  dark?: boolean
  responsive?: boolean
}

// Proporção 3.82:1 — [círculos mark] + [YLADA], sem tagline
const tamanhos = {
  sm: { h: 32, w: 122 },
  md: { h: 40, w: 153 },
  lg: { h: 52, w: 199 },
  xl: { h: 64, w: 245 }
}

const tamanhosQuadrado = {
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72
}

export function YLADALogo({
  size = 'md',
  className = '',
  variant = 'horizontal',
  dark = false,
  responsive = false
}: YLADALogoProps) {

  const logoPaths: Record<string, string> = {
    horizontal: dark ? logos.escuro : logos.claro,
    vertical:   dark ? logos.escuro : logos.claro,
    minimal:    dark ? logos.escuro : logos.claro,
    iconOnly:   logos.icon,
    quadrado:   logos.quadrado
  }

  // Variante quadrada / ícone
  if (variant === 'iconOnly' || variant === 'quadrado') {
    const tamanho = tamanhosQuadrado[size]
    return (
      <div className="inline-block">
        <Image
          src={logoPaths[variant]}
          alt="YLADA"
          width={tamanho}
          height={tamanho}
          className={`${className} object-contain`}
          quality={100}
          priority
        />
      </div>
    )
  }

  // Variante horizontal
  const { w, h } = tamanhos[size]
  return (
    <div className="inline-block">
      <Image
        src={logoPaths[variant]}
        alt="YLADA"
        width={w}
        height={h}
        className={`${responsive ? 'h-9 sm:h-11 lg:h-14 w-auto' : ''} ${className} object-contain`}
        quality={100}
        priority
      />
    </div>
  )
}

export default YLADALogo
