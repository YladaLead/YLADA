/** Nome exibido no WhatsApp ou salvo no cadastro — separar pessoa vs nome de clínica */

const BUSINESS_HINTS = [
  'estética',
  'estetica',
  'clínica',
  'clinica',
  'clinic',
  'spa',
  'depilação',
  'depilacao',
  'corporal',
  'facial',
  'drenagem',
  'studio',
  'salão',
  'salao',
  'beauty',
  'ltda',
  'mei',
  'nutri',
  'instagram',
  ' @',
  '|',
  '·',
  'procedimento',
  'biomédica',
  'biomedica',
  'massoterap',
  'fisioterap',
  'esteticista',
  'estetic',
  'micropigment',
  'harmoniza',
  'sobrancelha',
  'cílios',
  'cilios',
  'podolog',
  'pilates',
  'beleza',
  'cosmétic',
  'cosmetic',
  'agendamento',
  'espaço',
  'espaco',
  'ateliê',
  'atelie',
  'boutique',
  'saúde',
  'saude',
  'bem-estar',
  'avançada',
  'avancada',
  'emagrec',
  'depil',
  'dra.',
  'dr.',
]

// Nomes da própria marca/assistentes — a lead cumprimenta "Oi Ylada/Carol",
// e isso JAMAIS é o nome dela. Também pega saudações capturadas por engano.
const REJECTED_LEAD_NAMES = new Set([
  'ylada',
  'carol',
  'noel',
  'oi',
  'oie',
  'oiê',
  'ola',
  'olá',
  'bom',
  'boa',
  'visitante',
])

/** "Ylada"/"Carol"/saudação não são nome de pessoa — nunca usar como nome da lead. */
export function isRejectedAsLeadName(name: string | null | undefined): boolean {
  if (!name?.trim()) return true
  const first = name.trim().split(/\s+/)[0].toLowerCase().replace(/[.,!?]+$/, '')
  return REJECTED_LEAD_NAMES.has(first)
}

export function firstNameFromDisplayName(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return ''
  return trimmed.split(/\s+/)[0] || trimmed
}

export function isLikelyBusinessDisplayName(name: string): boolean {
  const n = name.trim()
  if (!n) return true
  if (n.length > 42) return true
  const lower = n.toLowerCase()
  if (BUSINESS_HINTS.some((h) => lower.includes(h))) return true
  // Muitas palavras capitalizadas = nome fantasia
  const words = n.split(/\s+/).filter(Boolean)
  if (words.length >= 5) return true
  return false
}

/** Primeiro nome utilizável para a Carol chamar a lead */
// Títulos não são primeiro nome (evita a Carol chamar a pessoa de "Dr"/"Dra")
const NAME_TITLES = new Set(['dr', 'dra', 'sr', 'sra', 'dre'])

export function usableFirstName(name: string | null | undefined): string | null {
  if (!name?.trim()) return null
  if (isRejectedAsLeadName(name)) return null
  if (isLikelyBusinessDisplayName(name)) return null
  const first = firstNameFromDisplayName(name)
  // Nome real raramente passa de ~14 letras; token longo = handle/razão social grudada
  // (ex.: "Vilmarosamassoterapeuta"), nunca um primeiro nome.
  if (first.length < 2 || first.length > 14) return null
  if (/^\d+$/.test(first)) return null
  if (NAME_TITLES.has(first.toLowerCase().replace(/\.$/, ''))) return null
  return first
}

export function pickLeadNameForCarol(opts: {
  storedNome?: string | null
  profileName?: string | null
}): { firstName: string | null; source: 'stored' | 'profile' | null; raw: string | null } {
  const fromStored = usableFirstName(opts.storedNome)
  if (fromStored) {
    return { firstName: fromStored, source: 'stored', raw: opts.storedNome!.trim() }
  }
  const fromProfile = usableFirstName(opts.profileName)
  if (fromProfile) {
    return { firstName: fromProfile, source: 'profile', raw: opts.profileName!.trim() }
  }
  return { firstName: null, source: null, raw: null }
}

export function buildLeadNameContextNote(opts: {
  storedNome?: string | null
  profileName?: string | null
}): string {
  const picked = pickLeadNameForCarol(opts)
  if (picked.firstName) {
    return `\nNOME DA PESSOA: use o primeiro nome "${picked.firstName}" com naturalidade (em ~1 a cada 2 mensagens, nunca em todas). Não use nome completo nem sobrenome.\n`
  }
  const hasBusinessHint =
    isLikelyBusinessDisplayName(opts.storedNome ?? '') ||
    isLikelyBusinessDisplayName(opts.profileName ?? '')
  if (hasBusinessHint) {
    return `\nNOME: o perfil/cadastro parece nome de clínica — ainda não sabemos o nome da dona. Pergunte uma vez, de forma leve: "Antes de continuar... com quem eu tô falando?" (só o primeiro nome). Depois use o nome nas próximas mensagens.\n`
  }
  return `\nNOME: ainda não sabemos o nome da pessoa. Na 2ª ou 3ª mensagem sua (após entender a dor), pergunte de forma leve: "Antes de continuar... com quem eu tô falando?" Depois use o primeiro nome com naturalidade.\n`
}
