'use client'

import Image from 'next/image'
import { logos, getLogoOficial, getLogoPorCor } from '@/lib/logos-config'

interface LogoProps {
  cor?: 'verde' | 'laranja' | 'vermelho' | 'roxo' | 'azul-claro' | 'azul'
  formato?: 'horizontal' | 'quadrado'
  tamanho?: 'pequeno' | 'medio' | 'grande' | number
  tipoArquivo?: 'png' | 'jpg'
  className?: string
  alt?: string
}

const tamanhosHorizontal = {
  pequeno: { width: 200, height: 60 },
  medio: { width: 300, height: 90 },
  grande: { width: 400, height: 120 }
}

const tamanhosQuadrado = {
  pequeno: { width: 64, height: 64 },
  medio: { width: 128, height: 128 },
  grande: { width: 256, height: 256 }
}

export default function Logo({ 
  cor = 'azul-claro', // ⭐ Azul como padrão (cor oficial)
  formato = 'horizontal', // ⭐ Horizontal como padrão
  tamanho = 'medio',
  tipoArquivo = 'png',
  className = '',
  alt = 'YLADA Logo'
}: LogoProps) {
  // Determinar dimensões
  let width: number
  let height: number
  
  if (typeof tamanho === 'number') {
    width = tamanho
    height = formato === 'horizontal' ? tamanho / 3.33 : tamanho // Proporção horizontal ~3.33:1
  } else if (formato === 'horizontal') {
    const dims = tamanhosHorizontal[tamanho]
    width = dims.width
    height = dims.height
  } else {
    const dims = tamanhosQuadrado[tamanho]
    width = dims.width
    height = dims.height
  }

  // Obter caminho do logo
  let src: string
  
  if (cor === 'azul-claro' || cor === 'azul') {
    // ⭐ Usar logo oficial
    src = getLogoOficial(formato)
  } else {
    src = getLogoPorCor(cor, formato)
  }

  // Converter .png para .jpg se necessário
  if (tipoArquivo === 'jpg') {
    src = src.replace('.png', '.jpg')
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}

// Versão simplificada - logo oficial horizontal
export function LogoYLADA({ 
  tamanho = 'medio', 
  formato = 'horizontal',
  className 
}: { 
  tamanho?: 'pequeno' | 'medio' | 'grande'
  formato?: 'horizontal' | 'quadrado'
  className?: string 
}) {
  return <Logo cor="azul-claro" formato={formato} tamanho={tamanho} className={className} />
}

// Versão quadrada para favicon/ícones
export function LogoQuadrado({ 
  tamanho = 'medio',
  className 
}: { 
  tamanho?: 'pequeno' | 'medio' | 'grande'
  className?: string 
}) {
  return <Logo formato="quadrado" tamanho={tamanho} className={className} />
}
