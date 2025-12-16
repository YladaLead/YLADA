// Wrapper intermediário para evitar problemas com parênteses no caminho
// Usa dynamic import para contornar limitação do Next.js
'use client'

import dynamic from 'next/dynamic'

// Dynamic import com caminho absoluto usando alias
const NovoFormularioCoach = dynamic(
  () => import('@/app/pt/coach/(protected)/formularios/novo/page'),
  { ssr: false }
)

export default NovoFormularioCoach
