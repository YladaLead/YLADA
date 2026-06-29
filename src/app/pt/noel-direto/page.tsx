import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isNoelDiretoEnabled } from '@/lib/porta-unica/porta-unica-flag'
import NoelDiretoComecar from '@/components/porta-unica/NoelDiretoComecar'

/**
 * Destino pós-cadastro do Noel direto (Fase 2). Atrás da flag
 * NEXT_PUBLIC_ONBOARDING_NOEL_DIRETO_ENABLED: com OFF dá notFound() (inerte, byte-idêntico).
 * Lê o `ylada_desafio` capturado pela porta e cai direto no Noel servindo.
 * (Rota nova; `/pt/comecar` é uma rota viva diferente, não tocar.)
 * @see blueprint-plataforma/Noel_Completo_Metodo_e_Conducao.md §9.3 (Fase 2, r88)
 */
export const metadata: Metadata = { title: 'YLADA' }

export default function NoelDiretoPage() {
  if (!isNoelDiretoEnabled()) notFound()
  return <NoelDiretoComecar />
}
