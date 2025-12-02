'use client'

import Link from 'next/link'
import SecondaryButton from '@/components/shared/SecondaryButton'

interface VoltarJornadaButtonProps {
  className?: string
}

export default function VoltarJornadaButton({ className = '' }: VoltarJornadaButtonProps) {
  return (
    <Link 
      href="/pt/nutri/metodo/jornada" 
      className={`${className} transition-all duration-200 ease-out hover:opacity-90`}
    >
      <SecondaryButton className="flex items-center gap-2 transition-all duration-200 ease-out hover:shadow-md">
        <span>←</span>
        <span>Voltar para a Jornada</span>
      </SecondaryButton>
    </Link>
  )
}

