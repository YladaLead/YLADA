import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Perfil',
  description:
    'Dados da clínica, contacto e tom das mensagens para o Noel — Pro Estética Corporal.',
}

export default function ProEsteticaCorporalPerfilLayout({ children }: { children: ReactNode }) {
  return children
}
