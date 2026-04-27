'use client'

import LinksHubContent from '@/components/ylada/LinksHubContent'

export default function ProEsteticaCorporalBibliotecaLinksPage() {
  return (
    <div className="space-y-3">
      <LinksHubContent
        areaCodigo="estetica"
        areaLabel="Estética corporal"
        noAreaShell
        bibliotecaEsteticaCorporalScope
      />
    </div>
  )
}
