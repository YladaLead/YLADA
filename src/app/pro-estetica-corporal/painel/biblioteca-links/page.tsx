'use client'

/**
 * Paridade com Coach: mesmo hub que `/pt/estetica/links` — `LinksHubContent` (Biblioteca + Seus links).
 * Escopo corporal via `bibliotecaEsteticaCorporalScope` em `BibliotecaPageContent`.
 */
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
