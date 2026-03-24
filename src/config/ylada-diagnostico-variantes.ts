/**
 * Biblioteca de variantes de diagnósticos para SEO.
 * Cada combinação diagnóstico + profissão = 1 página indexável.
 * Todas levam ao mesmo motor de diagnóstico.
 */

import { DIAGNOSTICOS } from './ylada-diagnosticos'

export interface ProfissaoVariante {
  slug: string
  label: string
  /** Para uso em frases: "agenda de {plural}" */
  plural: string
}

export const PROFISSOES: ProfissaoVariante[] = [
  { slug: 'nutricionista', label: 'Nutricionistas', plural: 'nutricionistas' },
  { slug: 'psicologo', label: 'Psicólogos', plural: 'psicólogos' },
  { slug: 'dentista', label: 'Dentistas', plural: 'dentistas' },
  { slug: 'estetica', label: 'Estética', plural: 'estética' },
  { slug: 'medico', label: 'Médicos', plural: 'médicos' },
  { slug: 'coach', label: 'Coaches', plural: 'coaches' },
  { slug: 'consultor', label: 'Consultores', plural: 'consultores' },
  { slug: 'perfumaria', label: 'Perfumaria', plural: 'perfumaria' },
]

const BASE_SLUGS = Object.keys(DIAGNOSTICOS) as string[]

/** Títulos customizados por profissão (quando diferente do genérico) */
const TITULOS_ESPECIAIS: Record<string, Record<string, string>> = {
  perfumaria: {
    comunicacao: 'Seu marketing de perfumes atrai curiosos ou clientes prontos para comprar?',
    conteudo: 'Seu conteúdo sobre perfumes atrai clientes ou apenas curiosidade?',
    autoridade: 'Seu posicionamento transmite autoridade no universo da perfumaria?',
    agenda: 'O que pode estar travando suas vendas de perfumes?',
    indicacoes: 'Seu negócio de perfumes depende demais de indicações?',
    investimento: 'Seu investimento em perfumaria está trazendo retorno?',
  },
}

/** Gera título para variante. Se não houver especial, usa template. */
function getTituloVariante(baseSlug: string, profissao: ProfissaoVariante): string {
  const especial = TITULOS_ESPECIAIS[profissao.slug]?.[baseSlug]
  if (especial) return especial

  const templates: Record<string, string> = {
    comunicacao: `Comunicação profissional para ${profissao.plural}`,
    agenda: `Por que a agenda de ${profissao.plural} não enche como poderia?`,
    autoridade: `Seu posicionamento transmite autoridade?`,
    indicacoes: `Seu negócio depende demais de indicações?`,
    conteudo: `Seu conteúdo atrai clientes ou apenas engajamento?`,
    investimento: `Seu investimento profissional está trazendo retorno?`,
  }
  return templates[baseSlug] || DIAGNOSTICOS[baseSlug]?.nome || ''
}

/** Descrição curta para a landing */
function getDescricaoVariante(baseSlug: string): string {
  const config = DIAGNOSTICOS[baseSlug]
  return config?.descricaoStart || 'Descubra em menos de 1 minuto o que pode estar travando o crescimento do seu negócio.'
}

/** Bullets de explicação (genéricos por diagnóstico) */
const BULLETS_POR_DIAGNOSTICO: Record<string, string[]> = {
  comunicacao: ['clareza de posicionamento', 'percepção de valor', 'comunicação com clientes', 'qualidade das conversas'],
  agenda: ['clareza de posicionamento', 'percepção de valor', 'comunicação com clientes', 'geração de oportunidades'],
  autoridade: ['clareza de posicionamento', 'demonstração de expertise', 'percepção de valor'],
  indicacoes: ['controle sobre o fluxo', 'diversificação de fontes', 'sistema de captação'],
  conteudo: ['conexão conteúdo–decisão', 'clareza do trabalho', 'qualidade dos contatos'],
  investimento: ['posicionamento claro', 'retorno dos investimentos', 'transformação em clientes'],
}

export interface VarianteDiagnostico {
  slugCompleto: string
  baseSlug: string
  profissao: ProfissaoVariante
  titulo: string
  descricao: string
  bullets: string[]
}

/** Lista todas as variantes (6 diagnósticos × 8 profissões = 48 páginas) */
export function listarVariantes(): VarianteDiagnostico[] {
  const variantes: VarianteDiagnostico[] = []
  for (const baseSlug of BASE_SLUGS) {
    for (const profissao of PROFISSOES) {
      variantes.push({
        slugCompleto: `${baseSlug}-${profissao.slug}`,
        baseSlug,
        profissao,
        titulo: getTituloVariante(baseSlug, profissao),
        descricao: getDescricaoVariante(baseSlug),
        bullets: BULLETS_POR_DIAGNOSTICO[baseSlug] || ['posicionamento', 'comunicação', 'percepção de valor'],
      })
    }
  }
  return variantes
}

/** Parseia slug para extrair base e profissão. Retorna null se inválido. */
export function parsearSlugVariante(slug: string): { baseSlug: string; profissao: ProfissaoVariante } | null {
  const idx = slug.lastIndexOf('-')
  if (idx <= 0) return null
  const baseSlug = slug.slice(0, idx)
  const profissaoSlug = slug.slice(idx + 1)
  if (!BASE_SLUGS.includes(baseSlug)) return null
  const profissao = PROFISSOES.find((p) => p.slug === profissaoSlug)
  if (!profissao) return null
  return { baseSlug, profissao }
}

/** Verifica se o slug é uma variante (base-profissao) */
export function isVariante(slug: string): boolean {
  return parsearSlugVariante(slug) !== null
}

/** Obtém dados da variante pelo slug completo */
export function getVariante(slugCompleto: string): VarianteDiagnostico | null {
  const parsed = parsearSlugVariante(slugCompleto)
  if (!parsed) return null
  return {
    slugCompleto,
    baseSlug: parsed.baseSlug,
    profissao: parsed.profissao,
    titulo: getTituloVariante(parsed.baseSlug, parsed.profissao),
    descricao: getDescricaoVariante(parsed.baseSlug),
    bullets: BULLETS_POR_DIAGNOSTICO[parsed.baseSlug] || ['posicionamento', 'comunicação', 'percepção de valor'],
  }
}
