// Wrapper intermediário para evitar problemas com parênteses no caminho
// Usa dynamic import para contornar limitação do Next.js
'use client'

import dynamic from 'next/dynamic'

// Dynamic import - caminho relativo de um nível acima
const NovoFormularioCoach = dynamic(
  () => import('../../../coach/(protected)/formularios/novo/page'),
  { ssr: false }
)

export default NovoFormularioCoach
