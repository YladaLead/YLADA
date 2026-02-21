'use client'

import RequireFeature from '@/components/auth/RequireFeature'

/**
 * Layout das páginas de Ferramentas Nutri.
 * Exige assinatura com feature "ferramentas" ou "completo".
 * Assim, usuários inativos ou que nunca assinaram não conseguem usar as ferramentas.
 */
export default function FerramentasNutriLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireFeature area="nutri" feature={['ferramentas', 'completo']}>
      {children}
    </RequireFeature>
  )
}
