import OpenAI from 'openai'

let client: OpenAI | null = null

/**
 * Cliente OpenAI lazy: não instancia no import (evita falha no `next build` sem OPENAI_API_KEY).
 * Só chame após validar `process.env.OPENAI_API_KEY` ou dentro de handlers que tratam ausência da chave.
 */
export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error(
      'Missing credentials. Please pass an `apiKey`, or set the `OPENAI_API_KEY` environment variable.'
    )
  }
  if (!client) {
    client = new OpenAI({ apiKey })
  }
  return client
}
