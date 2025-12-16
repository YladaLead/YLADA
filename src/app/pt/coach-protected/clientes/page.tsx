// Wrapper intermediário para evitar problemas com parênteses no caminho
'use client'

import dynamic from 'next/dynamic'

const ClientesCoach = dynamic(
  () => import('@/app/pt/coach/(protected)/clientes/page'),
  { ssr: false }
)

export default ClientesCoach
