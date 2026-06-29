/**
 * O "desafio" da porta única (tela 2): as opções TRAVADAS na régua + lógica pura
 * de normalização. Cada opção "infiltra" o perfil (liberal / campo / líder).
 * Sem I/O — testável em `desafio.casos.ts`.
 * @see blueprint-plataforma/Porta_Unica_Entrada_Regua.md §3
 */

export type DesafioKey = 'atrair' | 'vender' | 'equipe' | 'outro'

export type DesafioOpcao = {
  key: DesafioKey
  /** Texto exato da régua. Cada um lê um papel sem perguntar "qual sua área". */
  label: string
}

export const DESAFIO_OPCOES: readonly DesafioOpcao[] = [
  { key: 'atrair', label: 'Atrair mais gente que precisa de você' },
  { key: 'vender', label: 'Vender mais, produtos ou serviços' },
  { key: 'equipe', label: 'Fazer minha equipe ser mais produtiva' },
  { key: 'outro', label: 'Outro, me conta' },
]

/** Limite do texto livre do "Outro" (o Noel lê isto depois; não precisa de mais). */
export const DESAFIO_TEXTO_MAX = 280

export type DesafioResposta = {
  key: DesafioKey
  /** Só preenchido no 'outro'; nas demais é null. */
  texto: string | null
}

const KEYS: readonly string[] = DESAFIO_OPCOES.map((o) => o.key)

export function isDesafioKey(value: unknown): value is DesafioKey {
  return typeof value === 'string' && KEYS.includes(value)
}

/** Normaliza a resposta: texto só vale pro 'outro' e entra aparado/limitado. */
export function montarResposta(key: DesafioKey, textoLivre: string): DesafioResposta {
  if (key !== 'outro') return { key, texto: null }
  const texto = textoLivre.trim().slice(0, DESAFIO_TEXTO_MAX)
  return { key, texto: texto.length > 0 ? texto : null }
}

/** Pronta pra avançar? O 'outro' exige texto; as demais bastam o clique. */
export function respostaCompleta(key: DesafioKey | null, textoLivre: string): boolean {
  if (!key) return false
  if (key === 'outro') return textoLivre.trim().length > 0
  return true
}
