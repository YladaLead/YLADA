/**
 * Guarda a resposta do desafio no localStorage pra o Noel ler DEPOIS do cadastro
 * (a devolutiva que reage é a lane do método; aqui só capturamos). Tolerante a falha:
 * a captura nunca pode travar a navegação pro cadastro.
 * @see blueprint-plataforma/Porta_Unica_Entrada_Regua.md §3
 */
'use client'

import { isDesafioKey, type DesafioResposta } from './desafio'

const DESAFIO_KEY = 'ylada_desafio'

export function persistDesafio(resposta: DesafioResposta): void {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(DESAFIO_KEY, JSON.stringify(resposta))
  } catch {
    /* silencioso: a captura é best-effort, não bloqueia o fluxo */
  }
}

/**
 * Consome (apaga) o desafio depois que o Noel já o usou pra abrir e enquadrar a
 * primeira troca (toque "b"). Evita que ele fique pra sempre e re-dispare a abertura
 * em quem volta / limpa o chat. Best-effort: nunca lança.
 */
export function consumirDesafio(): void {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(DESAFIO_KEY)
  } catch {
    /* silencioso */
  }
}

export function readDesafio(): DesafioResposta | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(DESAFIO_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<DesafioResposta>
    if (!isDesafioKey(parsed.key)) return null
    return { key: parsed.key, texto: typeof parsed.texto === 'string' ? parsed.texto : null }
  } catch {
    return null
  }
}
