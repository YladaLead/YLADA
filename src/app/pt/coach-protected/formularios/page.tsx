// Wrapper intermediário para evitar problemas com parênteses no caminho
'use client'

import dynamic from 'next/dynamic'

const FormulariosCoach = dynamic(
  () => import('../../coach/(protected)/formularios/page'),
  { ssr: false }
)

export default FormulariosCoach
