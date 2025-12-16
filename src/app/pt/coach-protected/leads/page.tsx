// Wrapper intermediário para evitar problemas com parênteses no caminho
'use client'

import dynamic from 'next/dynamic'

const LeadsCoach = dynamic(
  () => import('@/app/pt/coach/(protected)/leads/page'),
  { ssr: false }
)

export default LeadsCoach
