/**
 * BUG 5 (30/06): o diagnóstico de perfil comportamental (arquitetura PROFILE_TYPE) mostrava o
 * CÓDIGO cru do arquétipo ("analitico") como rótulo pro leitor — sem acento e em minúscula.
 * Este mapa converte o código (usado na LÓGICA, não mexer) num RÓTULO de exibição acentuado.
 * Só apresentação: o `profile_type` cru segue igual pros lookups (ex.: === 'analitico').
 * @see blueprint-plataforma/Noel_Lab_Matriz_Bugs_30-06.md (BUG 5)
 */

const PROFILE_TYPE_LABELS: Readonly<Record<string, string>> = {
  consistente: 'Consistente',
  analitico: 'Analítico',
  ansioso: 'Ansioso',
  '8ou80': '8 ou 80',
  improvisador: 'Improvisador',
}

/** Primeira letra maiúscula (fallback pra códigos fora do mapa). */
function capitalizar(texto: string): string {
  const t = texto.trim()
  if (!t) return t
  return t.charAt(0).toUpperCase() + t.slice(1)
}

/** Rótulo de exibição acentuado do arquétipo; desconhecido cai num capitalize seguro. */
export function displayProfileType(code: string | undefined | null): string {
  const c = (code ?? '').trim()
  if (!c) return ''
  return PROFILE_TYPE_LABELS[c] ?? capitalizar(c)
}
