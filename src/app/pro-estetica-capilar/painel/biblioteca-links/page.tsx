'use client'

/**
 * Paridade com Coach: mesmo hub que `/pt/estetica/links` — `LinksHubContent` (Biblioteca + Seus links).
 * Escopo capilar via `bibliotecaEsteticaCapilarScope` em `BibliotecaPageContent`.
 */
import LinksHubContent from '@/components/ylada/LinksHubContent'

export default function ProEsteticaCapilarBibliotecaLinksPage() {
  return (
    <div className="space-y-3">
      <LinksHubContent
        areaCodigo="estetica"
        areaLabel="Estética capilar"
        noAreaShell
        bibliotecaEsteticaCapilarScope
      />
    </div>
  )
}
