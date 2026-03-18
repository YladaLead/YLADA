/**
 * Nomes canônicos de presidentes: unifica casais/equipes em um único nome
 * para exibição em listagens e filtros (evita duplicatas "marido" / "mulher" / "casal").
 *
 * Cada chave é o nome canônico (ex.: "Sheyla e Antonio Azambuja").
 * O valor é a lista de variantes que existem no banco (nome_completo em presidentes_autorizados / nome_presidente em user_profiles).
 */

const CASAL_PRESIDENTE: Record<string, string[]> = {
  'Sheyla e Antonio Azambuja': [
    'Sheyla Coelho',
    'Antônio Ricardo Azambuja',
    'Sheyla e Antonio Azambuja',
  ],
  'Marcelino e Valdete': [
    'Marcelino Cristovão',
    'Marcelino e Valdete',
    'Valdete Marcelina',
  ],
  'Andre e Deise Faula': [
    'Andenutri',
    'Andre Faula',
    'Andre e Deise Faula',
  ],
  'Fabio e Patricia Fugihara': [
    'fabio fugihara',
    'Patricia Fugihara',
  ],
  'Murilo e Beatriz Hallgreen': [
    'Murilo Hallgreen',
    'Beatriz Hallgreen',
  ],
  'Gladis e Marino': [
    'Gladis e Marino',
    'gladisgordaliza',
  ],
  'Marcio e Ana Pasqua': [
    'Marcio e Ana Pasqua',
  ],
  'Lilian e Alexandre Lazari': [
    'Lilian e Alexandre Lazari',
    'Lilian e Alexandre',
    'mídia EUA',
    'Midia EUA',
  ],
  'Lucimar e Geraldo': [
    'Lucimar e Geraldo',
  ],
}

/** Todas as variantes mapeadas para o nome canônico (normalizado: trim + comparação case-insensitive na busca) */
const VARIANTE_TO_CANONICO = new Map<string, string>()

function buildVariantMap() {
  if (VARIANTE_TO_CANONICO.size > 0) return
  for (const [canonico, variantes] of Object.entries(CASAL_PRESIDENTE)) {
    VARIANTE_TO_CANONICO.set(canonico, canonico)
    for (const v of variantes) {
      const key = v.trim()
      if (!VARIANTE_TO_CANONICO.has(key)) {
        VARIANTE_TO_CANONICO.set(key, canonico)
      }
    }
  }
}

/**
 * Retorna o nome canônico para um nome (ex.: "Sheyla Coelho" -> "Sheyla e Antonio Azambuja").
 * Se o nome não estiver no mapeamento, retorna o próprio nome.
 */
export function getCanonicalName(nome: string | null | undefined): string {
  if (!nome || typeof nome !== 'string') return ''
  buildVariantMap()
  const key = nome.trim()
  const found = VARIANTE_TO_CANONICO.get(key)
  if (found) return found
  // Comparação case-insensitive para variantes já cadastradas
  const keyLower = key.toLowerCase()
  for (const [variant] of VARIANTE_TO_CANONICO) {
    if (variant.toLowerCase() === keyLower) return VARIANTE_TO_CANONICO.get(variant)!
  }
  return key
}

/**
 * Retorna todas as variantes (nomes no banco) que correspondem a esse nome canônico.
 * Usado para filtrar usuários: nome_presidente in getNamesForCanonical(canonical).
 */
/** Retorna todas as variantes (incluindo o próprio canônico) para filtrar usuários por presidente. */
export function getNamesForCanonical(canonical: string | null | undefined): string[] {
  if (!canonical || typeof canonical !== 'string') return []
  const trimmed = canonical.trim()
  const list = CASAL_PRESIDENTE[trimmed]
  if (list && list.length > 0) {
    const uniq = new Set(list)
    uniq.add(trimmed)
    return Array.from(uniq)
  }
  return [trimmed]
}

/**
 * A partir de uma lista de nomes (ex.: nomes vindos de presidentes_autorizados),
 * retorna a lista única de nomes canônicos, ordenada.
 */
export function getUniqueCanonicalList(nomes: string[]): string[] {
  buildVariantMap()
  const set = new Set<string>()
  for (const n of nomes) {
    const c = getCanonicalName(n)
    if (c) set.add(c)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}
