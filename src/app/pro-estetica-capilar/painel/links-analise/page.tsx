import type { Metadata } from 'next'
import ProEsteticaCapilarLinksAnaliseClient from '@/components/pro-estetica-capilar/ProEsteticaCapilarLinksAnaliseClient'

export const metadata: Metadata = {
  title: 'Análise dos links',
  description: 'Ordenar os seus links por cliques, diagnósticos concluídos ou WhatsApp.',
}

export default function ProEsteticaCapilarLinksAnalisePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ProEsteticaCapilarLinksAnaliseClient />
    </div>
  )
}
