import type { Metadata } from 'next'
import { listarVariantes, getVariante, isVariante } from '@/config/ylada-diagnostico-variantes'
import { DIAGNOSTICOS } from '@/config/ylada-diagnosticos'
import DiagnosticoSlugClient from './DiagnosticoSlugClient'

/** Gera todas as rotas estáticas para SEO (6 bases + 48 variantes = 54 páginas) */
export function generateStaticParams() {
  const bases = Object.keys(DIAGNOSTICOS)
  const variantes = listarVariantes()
  const slugs = [
    ...bases,
    ...variantes.map((v) => v.slugCompleto),
  ]
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params?.slug || ''
  if (isVariante(slug)) {
    const v = getVariante(slug)
    if (v) {
      return {
        title: `${v.titulo} | YLADA`,
        description: v.descricao,
      }
    }
  }
  const config = DIAGNOSTICOS[slug]
  if (config) {
    return {
      title: `${config.nome} | YLADA`,
      description: config.descricaoStart,
    }
  }
  return { title: 'Diagnóstico | YLADA' }
}

export default function DiagnosticoSlugPage() {
  return <DiagnosticoSlugClient />
}
