// =====================================================
// UTILITÁRIOS PARA NORMALIZAÇÃO DE SLUGS
// Função centralizada para garantir consistência
// =====================================================

/**
 * Normaliza um slug removendo acentos, convertendo para minúsculas,
 * substituindo espaços e caracteres especiais por hífens,
 * e removendo hífens duplicados e das extremidades.
 * 
 * Exemplos:
 * - "Diagnóstico de Parasitose" → "diagnostico-de-parasitose"
 * - "Meu Portal---Teste" → "meu-portal-teste"
 * - "Portal   Teste" → "portal-teste"
 */
export function normalizeSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return text
    .toLowerCase()
    .normalize('NFD') // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
    .replace(/[^a-z0-9]+/g, '-') // Substitui tudo que não é letra/número por hífen
    .replace(/-+/g, '-') // Remove múltiplos hífens seguidos
    .replace(/^-+|-+$/g, '') // Remove hífens do início e fim
}

/**
 * Valida se um slug está no formato correto
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false
  }

  // Deve conter apenas letras minúsculas, números e hífens
  // Não pode começar ou terminar com hífen
  // Deve ter pelo menos 1 caractere
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length > 0
}

