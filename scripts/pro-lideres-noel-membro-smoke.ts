/**
 * Bateria automática do Noel membro (mesmo prompt da API, sem login).
 *
 * Uso:
 *   npx tsx scripts/pro-lideres-noel-membro-smoke.ts
 *   npx tsx scripts/pro-lideres-noel-membro-smoke.ts --full   # resposta completa
 *   npx tsx scripts/pro-lideres-noel-membro-smoke.ts --only=3 # só pergunta índice 3
 */
import { config as loadEnv } from 'dotenv'
import OpenAI from 'openai'
import { buildProLideresMemberNoelSystemPrompt } from '../src/lib/pro-lideres-member-noel-prompt'
import {
  PRO_LIDERES_NOEL_MEMBER_MODEL,
  buildProLideresMemberNoelObjectionExcerpt,
  fetchProLideresMemberNoelObjection,
} from '../src/lib/pro-lideres-member-noel-context'
import {
  buildProLideresMemberNoelCatalogHint,
  matchProLideresMemberNoelCatalog,
} from '../src/lib/pro-lideres-member-noel-catalog-match'
import { classifyProLideresMemberNoelMessage } from '../src/lib/pro-lideres-member-noel-router'
import {
  isGenericReadyMessage,
  normalizeProLideresMemberNoelResponse,
  userExplicitlyWantsReadyMessage,
} from '../src/lib/pro-lideres-member-noel-response'

loadEnv({ path: '.env.local' })
loadEnv()

import { PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS } from '../src/lib/pro-lideres-member-noel-lab-battery'

const QUESTIONS = PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS.map((q) => q.text)

const FAKE_CATALOG = `- **Calculadora de água** — https://www.ylada.com/c/demo-agua
- **Quiz hábitos e bem-estar** — https://www.ylada.com/q/demo-habitos
- **Conheça a oportunidade** — https://www.ylada.com/q/demo-oportunidade`

function memberSections(text: string) {
  return {
    naPratica: /\*\*Na prática\*\*/i.test(text) || /###\s*Na prática/i.test(text),
    rigido: /###\s*Situação/i.test(text) && /###\s*Princípio/i.test(text),
    fechamento: /\*\*(Amanhã|Próximo passo)\*\*/i.test(text) || /###\s*(Amanhã|Próximo passo)/i.test(text),
    mensagemPronta: /\*\*Mensagem pronta\*\*/i.test(text) || /###\s*Mensagem pronta/i.test(text),
    link: /\*\*Link para enviar\*\*/i.test(text) || /###\s*Link para enviar/i.test(text),
    debugMeta: /^(perfil|link|noelProfileId)\s*:/im.test(text),
    wellness: /\bwellness\b/i.test(text),
  }
}

function expectPass(q: string, text: string): { pass: boolean; note: string } {
  const route = classifyProLideresMemberNoelMessage(q)

  if (/quiz novo|cria um quiz/i.test(q)) {
    return {
      pass: /meus links|não crio|não cri|líder|ylada/i.test(text),
      note: 'deve recusar criar link',
    }
  }
  if (/5 posts|equipe toda/i.test(q)) {
    return { pass: /scripts/i.test(text), note: 'deve mandar aos Scripts' }
  }

  const sec = memberSections(text)
  const msgBlocks = text.match(/\*\*Mensagem pronta\*\*[\s\S]*?(?=\n\n\*\*|$)/gi) ?? []

  if (sec.wellness) {
    return { pass: false, note: 'não usar marca Wellness' }
  }
  if (sec.debugMeta) {
    return { pass: false, note: 'sem metadados perfil/link na resposta' }
  }
  if (sec.rigido) {
    return { pass: false, note: 'evitar formato Situação/Princípio' }
  }
  if (msgBlocks.length > 1) {
    return { pass: false, note: 'mensagem pronta duplicada' }
  }
  if (
    !route.includeMensagemPronta &&
    !userExplicitlyWantsReadyMessage(q) &&
    sec.mensagemPronta
  ) {
    return { pass: false, note: 'mensagem pronta indevida para este modo' }
  }
  if (msgBlocks.some((b) => isGenericReadyMessage(b))) {
    return { pass: false, note: 'fallback genérico de mensagem' }
  }
  if (!sec.naPratica && text.split(/\n\n+/).filter(Boolean).length < 2) {
    return { pass: false, note: 'falta abertura conversa ou Na prática' }
  }
  if (!sec.fechamento) {
    return { pass: false, note: 'falta fechamento (Próximo passo)' }
  }
  if (route.includeMensagemPronta && !sec.mensagemPronta && !sec.legenda) {
    return { pass: false, note: 'esperava Mensagem pronta' }
  }
  if (route.includeLink && !sec.link) {
    return { pass: false, note: 'esperava Link para enviar' }
  }
  if (!route.includeLink && /veja \*\*meus links\*\*/i.test(text) && !/qual link/i.test(q)) {
    return { pass: false, note: 'link genérico indevido' }
  }
  return { pass: true, note: 'ok' }
}

async function main() {
  const full = process.argv.includes('--full')
  const onlyArg = process.argv.find((a) => a.startsWith('--only='))
  const onlyIdx = onlyArg ? parseInt(onlyArg.split('=')[1] ?? '', 10) : null

  if (!process.env.OPENAI_API_KEY) {
    console.error('Sem OPENAI_API_KEY em .env.local')
    process.exit(1)
  }

  console.log('Modelo:', PRO_LIDERES_NOEL_MEMBER_MODEL)
  console.log('---')

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  let ok = 0
  const indices =
    onlyIdx !== null && !Number.isNaN(onlyIdx)
      ? [onlyIdx]
      : QUESTIONS.map((_, i) => i)

  const baseParams = {
    operationLabel: 'Simulação — Equipe Herbalife',
    verticalCode: 'h-lider',
    replyLanguage: 'Português (Brasil)',
    catalogExcerpt: FAKE_CATALOG,
    tabulatorName: 'Grupo Norte',
    focusNotes: 'Foco do líder: reativação de lista + convites leves + uso de links de hábito antes de falar de produto.',
    dailyTasksExcerpt:
      'Checklist de hoje:\n- **Falar com 10 pessoas** (5 pts) — anotar nomes e 1 contato cada.\n- **Postar 1 story** (3 pts) — rotina real, sem promessa.',
    objectionExcerpt: null as string | null,
    catalogHint: null as string | null,
  }

  for (const i of indices) {
    const q = QUESTIONS[i]
    if (!q) {
      console.error('Índice inválido:', i)
      continue
    }

    let objectionExcerpt: string | null = null
    try {
      const obj = await fetchProLideresMemberNoelObjection(q)
      objectionExcerpt = buildProLideresMemberNoelObjectionExcerpt(obj)
    } catch {
      /* ignore */
    }

    const route = classifyProLideresMemberNoelMessage(q, {
      hasObjectionBase: Boolean(objectionExcerpt),
    })
    const catalogHint = buildProLideresMemberNoelCatalogHint(
      matchProLideresMemberNoelCatalog(q, FAKE_CATALOG)
    )

    console.log(`\n[${i + 1}/${QUESTIONS.length}] modo=${route.mode}`)
    console.log('P:', q)

    const systemPrompt = buildProLideresMemberNoelSystemPrompt({
      ...baseParams,
      route,
      objectionExcerpt,
      catalogHint,
    })

    const completion = await openai.chat.completions.create({
      model: PRO_LIDERES_NOEL_MEMBER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: q },
      ],
      temperature: 0.4,
      max_tokens: 1200,
    })

    const raw = completion.choices[0]?.message?.content?.trim() ?? ''
    const text = normalizeProLideresMemberNoelResponse(raw, route, q)
    const { pass, note } = expectPass(q, text)

    console.log(pass ? '✓' : '✗', note, memberSections(text))
    if (pass) ok++

    console.log(full ? text : `${text.slice(0, 500)}${text.length > 500 ? '\n…' : ''}`)
  }

  const total = indices.length
  console.log(`\n=== ${ok}/${total} checks automáticos ===`)
  process.exit(ok === total ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
