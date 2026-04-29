import type { Metadata } from 'next'
import ProEsteticaCorporalLinksAnaliseClient from '@/components/pro-estetica-corporal/ProEsteticaCorporalLinksAnaliseClient'

export const metadata: Metadata = {
  title: 'Análise dos links',
  description: 'Ordenar os teus links por cliques, diagnósticos concluídos ou WhatsApp.',
}

export default function ProEsteticaCorporalLinksAnalisePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ProEsteticaCorporalLinksAnaliseClient />
    </div>
  )
}
