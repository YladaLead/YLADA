'use client'

import { ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import RequireFeature from '@/components/auth/RequireFeature'
import ConditionalSidebar from '@/components/nutri/ConditionalSidebar'
import ConditionalWidget from '@/components/nutri/ConditionalWidget'

/**
 * Layout do Método YLADA
 * 
 * Nota: ProtectedRoute foi removido - autenticação é feita pelo layout (protected)
 * RequireFeature mantido para validação de features específicas
 * 
 * 🚨 CORREÇÃO: Pilares e exercícios acessados via jornada (fromDay) não requerem assinatura
 * Isso permite que usuários completem a jornada mesmo sem assinatura ativa
 */
export default function MetodoLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Jornada 30 Dias deve ser acessível para todos (parte do onboarding)
  const isJornada = pathname?.includes('/metodo/jornada')
  
  // 🚨 CORREÇÃO: Se veio da jornada (tem parâmetro fromDay), permitir acesso sem assinatura
  // Isso permite que usuários completem ações práticas da jornada mesmo sem assinatura
  const fromDay = searchParams?.get('fromDay')
  const veioDaJornada = !!fromDay
  
  // Pilares e exercícios acessados via jornada devem ser livres
  const isPilarOuExercicioDaJornada = veioDaJornada && (
    pathname?.includes('/metodo/pilares') || 
    pathname?.includes('/metodo/exercicios')
  )
  
  return (
    <>
      {isJornada || isPilarOuExercicioDaJornada ? (
        // Jornada ou conteúdo da jornada: acesso livre (sem RequireFeature)
        <>
          <ConditionalSidebar />
          <div className="flex-1">
            {children}
          </div>
          <ConditionalWidget />
        </>
      ) : (
        // Outras páginas do Método: requerem feature "cursos" ou "completo"
        <RequireFeature area="nutri" feature={['cursos', 'completo']}>
          <ConditionalSidebar />
          <div className="flex-1">
            {children}
          </div>
          <ConditionalWidget />
        </RequireFeature>
      )}
    </>
  )
}

