/**
 * Casos: persona única do Noel (flag + prefixo + idempotência).
 * Rodar: npx tsx src/lib/ylada-flow/noel/persona.casos.ts
 */
import {
  NOEL_PERSONA_UNIQUE_MARKER,
  applyNoelPersonaToSystemPrompt,
  buildNoelPersonaSystemPrefix,
  isNoelPersonaUnicaEnabled,
} from './persona'

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

const saved = process.env.NOEL_PERSONA_UNICA_ENABLED

function withEnv(value: string | undefined, fn: () => void): void {
  if (value === undefined) {
    delete process.env.NOEL_PERSONA_UNICA_ENABLED
  } else {
    process.env.NOEL_PERSONA_UNICA_ENABLED = value
  }
  try {
    fn()
  } finally {
    if (saved === undefined) {
      delete process.env.NOEL_PERSONA_UNICA_ENABLED
    } else {
      process.env.NOEL_PERSONA_UNICA_ENABLED = saved
    }
  }
}

withEnv(undefined, () => {
  assert(!isNoelPersonaUnicaEnabled(), 'flag OFF quando env ausente')
  const base = 'prompt legado da rota'
  assert(applyNoelPersonaToSystemPrompt(base) === base, 'apply inerte com flag OFF')
})

withEnv('false', () => {
  assert(!isNoelPersonaUnicaEnabled(), 'flag OFF com "false"')
})

withEnv('true', () => {
  assert(isNoelPersonaUnicaEnabled(), 'flag ON com "true"')
  const base = 'contexto específico da rota'
  const out = applyNoelPersonaToSystemPrompt(base)
  assert(out.startsWith(NOEL_PERSONA_UNIQUE_MARKER), 'prefixo contém marcador')
  assert(out.endsWith(base), 'corpo da rota preservado após prefixo')
  assert(out.includes('Inteligência de Convicção'), 'filosofia no prefixo')
  assert(out.includes('GUIA DE VOZ'), 'voz no prefixo')
  assert(applyNoelPersonaToSystemPrompt(out) === out, 'apply idempotente')
})

withEnv('1', () => {
  assert(isNoelPersonaUnicaEnabled(), 'flag ON com "1"')
})

{
  const prefix = buildNoelPersonaSystemPrefix()
  assert(prefix.includes('C → C → P'), 'framework C→C→P no prefixo')
  assert(prefix.includes('mentor de IA do Ylada'), 'identidade Noel mentor Ylada')
  assert(prefix.includes('construído sobre a Inteligência de Convicção'), 'resposta padrão de identidade')
  assert(prefix.includes('Só nomeie o Andre Faula em 3ª pessoa'), 'guardrail Andre só sob pergunta')
  assert(!prefix.includes('do Andre.'), 'identidade padrão sem nome do Andre')
  assert(prefix.includes('Autoridade pela Inteligência de Convicção'), 'voz autoridade pela convicção')
}

console.log('\nTodos os casos da persona única do Noel passaram.')
