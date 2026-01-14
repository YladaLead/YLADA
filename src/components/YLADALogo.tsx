'use client'

import React from 'react'
import Image from 'next/image'
import { logos, getLogoOficial } from '@/lib/logos-config'

interface YLADALogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  variant?: 'horizontal' | 'vertical' | 'iconOnly' | 'minimal' | 'quadrado'
  responsive?: boolean
}

const tamanhos = {
  sm: { h: 40, w: 133 },    // Horizontal pequeno (melhor qualidade - aumentado)
  md: { h: 48, w: 160 },    // Horizontal médio (melhor qualidade - aumentado)
  lg: { h: 60, w: 200 },    // Horizontal grande (melhor qualidade - aumentado)
  xl: { h: 72, w: 240 }     // Horizontal extra grande (melhor qualidade - aumentado)
}

const tamanhosQuadrado = {
  sm: 17,  // 36% do original
  md: 23,  // 36% do original
  lg: 29,  // 36% do original
  xl: 35   // 36% do original
}

export default function YLADALogo({ 
  size = 'md', 
  className = '',
  variant = 'horizontal',
  responsive = false
}: YLADALogoProps) {
  
  // Determinar caminhos dos logos oficiais
  const logoPaths: Record<string, string> = {
    horizontal: logos.principal,   // ⭐ Logo oficial horizontal (azul 30)
    vertical: logos.principal,     // Por enquanto usa horizontal também
    iconOnly: logos.icon,          // ⭐ Logo oficial quadrado (azul 31)
    minimal: logos.principal,      // Por enquanto usa horizontal
    quadrado: logos.quadrado       // ⭐ Logo oficial quadrado (azul 31)
  }

  // Para variantes de ícone/quadrado
  if (variant === 'iconOnly' || variant === 'quadrado') {
    const tamanho = tamanhosQuadrado[size]
    return (
      <div className="inline-block bg-transparent">
        <Image
          src={logoPaths[variant]}
          alt="YLADA"
          width={tamanho}
          height={tamanho}
          className={`${className} object-contain`}
          style={{ backgroundColor: 'transparent' }}
          quality={100}
          priority
        />
      </div>
    )
  }

  // Para variantes horizontais
  const dimensoes = tamanhos[size]
  // Sempre fornecer width e height (obrigatório no Next.js Image)
  // O CSS controlará o tamanho quando responsive=true
  const width = dimensoes.w
  const height = dimensoes.h
  
  return (
    <div className="inline-block bg-transparent">
      <Image
        src={logoPaths[variant]}
        alt="YLADA - Your Leading Advanced Data Assistant"
        width={width}
        height={height}
        className={`${responsive ? 'h-10 sm:h-14 lg:h-20 w-auto' : ''} ${className} object-contain`}
        style={{ backgroundColor: 'transparent' }}
        quality={100}
        priority
        unoptimized={false}
      />
    </div>
  )
}
