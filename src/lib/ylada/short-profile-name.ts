/**
 * BUG do "SEU PERFIL" quebrado (30/06): nos diagnósticos de NEGÓCIO (produtividade/vendas)
 * o `diagnosis.profile_title` chega como uma FRASE longa e cortada (ex.: "A falta de
 * treinamentos e de técnicas de venda eficazes está dificultando a sua"), que o
 * `toShortProfileName` não encurta (não termina em pontuação, ~14 palavras) e o fallback
 * de "fragmento incompleto" não pega. Estes dois helpers puros deixam o `PublicLinkView`
 * detectar a frase longa e cair no rótulo curto do contexto (o `displayTitle`, ex.:
 * "Produtividade em vendas") — igual aos diagnósticos de saúde, que já mostram rótulo curto.
 * @see blueprint-plataforma/Noel_Lab_Matriz_Bugs_30-06.md (BUG 2)
 */

/** Limite acima do qual um "nome de perfil" deixa de ser rótulo e vira frase. */
const MAX_PALAVRAS_ROTULO = 6
const MAX_CHARS_ROTULO = 42

/**
 * O nome de perfil é uma FRASE (não um rótulo curto)? Rótulos reais têm 2-6 palavras
 * ("Perda de peso", "Direito de família", "Cosméticos e beleza"); frases de negócio
 * chegam com 10-14 palavras. Vazio não é frase (deixa os outros gates decidirem).
 */
export function isSentenceLikeProfileName(text: string): boolean {
  const t = (text || '').trim()
  if (!t) return false
  const palavras = t.split(/\s+/).filter(Boolean)
  return palavras.length > MAX_PALAVRAS_ROTULO || t.length > MAX_CHARS_ROTULO
}

/**
 * O contexto (displayTitle) serve como rótulo curto de fallback? Precisa ter conteúdo
 * e NÃO ser ele mesmo uma frase longa (senão trocaríamos uma frase por outra).
 */
export function isUsableShortContext(text: string): boolean {
  const t = (text || '').trim()
  if (t.length < 4) return false
  return !isSentenceLikeProfileName(t)
}
