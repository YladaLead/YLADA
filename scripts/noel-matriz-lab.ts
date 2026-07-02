/**
 * NOEL MATRIZ — LABORATÓRIO DE CONDUÇÃO (roda a bateria toda de uma vez)
 * =====================================================================
 * Dispara uma bateria de cenários contra o Noel REAL da matriz
 * (`POST /api/ylada/noel`, area='ylada') usando um "usuário simulado"
 * (LLM) que responde o Noel de forma adaptativa até sair o link.
 *
 * Não depende do navegador. Cada cenário roda com `labIsolado: true`
 * (modo laboratório: começa do ZERO, ignora estado da conta, não
 * persiste, relaxa o gate de perfil). Isso exige a flag
 * `NEXT_PUBLIC_NOEL_DESAFIO_CONDUCAO_ENABLED=true` (já ligada no local).
 *
 * COMO RODAR (no terminal do Cursor, com o `npm run dev` no ar):
 *   LAB_EMAIL=teste12@teste.com LAB_PASSWORD='suaSenha' \
 *     npx tsx scripts/noel-matriz-lab.ts
 *
 * Opcionais:
 *   BASE_URL=http://localhost:3000   (default)
 *   LAB_ISOLADO=false                (usa o estado real da conta; default true)
 *   SIM_MODEL=gpt-4o-mini            (modelo do usuário simulado; default)
 *   ONLY=1,3,8                       (roda só esses cenários por índice, 1-based)
 *
 * SAÍDA:
 *   scripts/noel-matriz-lab-report.md    (relatório legível)
 *   scripts/noel-matriz-lab-report.json  (dump pra análise)
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// ------------------------------------------------------------------ env

function loadEnvLocal(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const file of ['.env.local', '.env']) {
    try {
      const raw = readFileSync(resolve(process.cwd(), file), 'utf8')
      for (const line of raw.split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
        if (!m) continue
        let v = m[2].trim()
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1)
        }
        if (out[m[1]] === undefined) out[m[1]] = v
      }
    } catch {
      /* arquivo ausente: ok */
    }
  }
  return out
}

const fileEnv = loadEnvLocal()
const env = (k: string): string | undefined => process.env[k] ?? fileEnv[k]

const SUPABASE_URL = env('NEXT_PUBLIC_SUPABASE_URL')
const SUPABASE_ANON = env('NEXT_PUBLIC_SUPABASE_ANON_KEY')
const OPENAI_KEY = env('OPENAI_API_KEY')
const BASE_URL = env('BASE_URL') ?? 'http://localhost:3000'
const SIM_MODEL = env('SIM_MODEL') ?? 'gpt-4o-mini'
const LAB_ISOLADO = (env('LAB_ISOLADO') ?? 'true') !== 'false'
const LAB_EMAIL = env('LAB_EMAIL') ?? 'teste12@teste.com'
const LAB_PASSWORD = env('LAB_PASSWORD')
const ONLY = (env('ONLY') ?? '')
  .split(',')
  .map((s) => parseInt(s.trim(), 10))
  .filter((n) => !Number.isNaN(n))

function requireEnv() {
  const missing: string[] = []
  if (!SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!SUPABASE_ANON) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  if (!OPENAI_KEY) missing.push('OPENAI_API_KEY (usuário simulado)')
  if (!LAB_PASSWORD) missing.push('LAB_PASSWORD (senha da conta de lab, via env)')
  if (missing.length) {
    console.error('❌ Faltam variáveis:\n  - ' + missing.join('\n  - '))
    process.exit(1)
  }
}

// --------------------------------------------------------------- tipos

type Turn = { quem: 'usuario' | 'noel'; texto: string; linkGerado?: LinkInfo }
type LinkInfo = { flow_id?: string; title?: string; url?: string; link_id?: string; questions?: Array<{ id: string; label: string; type?: string; options?: string[] }> }
type Cenario = {
  titulo: string
  eixo: string
  persona: string
  objetivo: string
  maxTurns: number
  checar: string
}
type Resultado = {
  cenario: Cenario
  turns: Turn[]
  linkFinal?: LinkInfo
  erro?: string
}

// ------------------------------------------------------------ supabase

async function signIn(): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON! },
    body: JSON.stringify({ email: LAB_EMAIL, password: LAB_PASSWORD }),
  })
  const data = (await res.json()) as { access_token?: string; error_description?: string; msg?: string }
  if (!res.ok || !data.access_token) {
    throw new Error(`Login falhou (${res.status}): ${data.error_description || data.msg || 'sem token'}`)
  }
  return data.access_token
}

// ---------------------------------------------------------------- noel

type NoelResp = { response?: string; lastLinkContext?: LinkInfo | null; error?: string; message?: string }

async function callNoel(args: {
  token: string
  message: string
  history: Array<{ role: 'user' | 'assistant'; content: string }>
  lastLinkContext?: LinkInfo | null
}): Promise<NoelResp> {
  const res = await fetch(`${BASE_URL}/api/ylada/noel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${args.token}` },
    body: JSON.stringify({
      message: args.message,
      conversationHistory: args.history.slice(-12),
      area: 'ylada',
      locale: 'pt',
      lastLinkContext: args.lastLinkContext ?? undefined,
      labIsolado: LAB_ISOLADO,
    }),
  })
  const data = (await res.json().catch(() => ({}))) as NoelResp
  if (!res.ok) {
    return { error: data.error || `HTTP ${res.status}`, message: data.message }
  }
  return data
}

// ----------------------------------------------------- usuário simulado

async function simulatedUser(cenario: Cenario, turns: Turn[]): Promise<string> {
  const sys =
    `Você é ${cenario.persona}. ` +
    `Seu objetivo ao conversar com o Noel (assistente da plataforma Ylada) é: ${cenario.objetivo}. ` +
    `Responda como essa pessoa responderia de verdade: mensagens CURTAS, linguagem falada, uma ideia por vez, sem formatação. ` +
    `Se o Noel perguntar seu nicho/foco/objetivo, responda coerente com a persona. ` +
    `Se o Noel pedir seu WhatsApp, invente um número BR plausível (ex.: 11 98888-7777). ` +
    `Se o Noel mostrar um rascunho e pedir aprovação, aprove com naturalidade. ` +
    `Se o Noel entregar um link e perguntar onde/como divulgar, escolha um canal e peça a copy pronta. ` +
    `NUNCA quebre o personagem, NUNCA aja como assistente, NUNCA explique que é uma simulação. ` +
    `Retorne SOMENTE a próxima mensagem do usuário, sem aspas.`

  // Mapeamento: as falas da persona = 'assistant'; as falas do Noel = 'user'.
  const msgs: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [{ role: 'system', content: sys }]
  if (turns.length === 0) {
    msgs.push({ role: 'user', content: '(Você abriu o chat do Noel. Mande sua primeira mensagem.)' })
  } else {
    for (const t of turns) {
      msgs.push({ role: t.quem === 'usuario' ? 'assistant' : 'user', content: t.texto })
    }
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: SIM_MODEL, messages: msgs, temperature: 0.7, max_tokens: 120 }),
  })
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } }
  if (data.error) throw new Error(`OpenAI: ${data.error.message}`)
  return (data.choices?.[0]?.message?.content ?? '').trim() || '...'
}

// ------------------------------------------------------------- cenários

const CENARIOS: Cenario[] = [
  {
    titulo: 'Iniciante travada, nicho amplo (venda direta)',
    eixo: 'Entrada + Condução',
    persona: 'uma revendedora iniciante de venda direta, insegura, que ainda não sabe bem o que fazer e tem a voz meio travada',
    objetivo: 'conseguir mais clientes, mas você ainda não sabe como',
    maxTurns: 8,
    checar: 'Recebe o iniciante sem assustar? Pergunta o FOCO quando o nicho é amplo (não assume)? Confirma o objetivo do tool? Explica a lógica vendendo o valor? Mostra rascunho e pede aprovação antes do link?',
  },
  {
    titulo: 'Estética/beleza — gerar contatos novos',
    eixo: 'Condução + Artefato',
    persona: 'uma esteticista dona de um pequeno estúdio de beleza, prática e objetiva',
    objetivo: 'gerar contatos novos de gente interessada nos seus serviços',
    maxTurns: 8,
    checar: 'Objetivo "gerar contato" conduz certo? O quiz/diagnóstico gerado tem perguntas bem formadas e coerentes com estética?',
  },
  {
    titulo: 'Reativar clientes que sumiram',
    eixo: 'Condução + Artefato',
    persona: 'uma revendedora de cosméticos com uma carteira de clientes antigas que pararam de comprar',
    objetivo: 'reativar clientes que sumiram, sem parecer cobrança',
    maxTurns: 8,
    checar: 'Entende "reativar" como objetivo? A copy sai calorosa e sem cara de venda? O artefato faz sentido pra quem sumiu?',
  },
  {
    titulo: 'Pedir indicações',
    eixo: 'Condução + Artefato (objetivo especial)',
    persona: 'uma consultora de moda que atende bem e quer crescer pelas clientes atuais',
    objetivo: 'conseguir indicações das suas clientes atuais',
    maxTurns: 8,
    checar: 'Indicação vira POST de compartilhar + link de ATRAIR (não formulário de nomes)? Gera o link (BUG 3 fechado)?',
  },
  {
    titulo: 'Cuidar/nutrir cliente atual',
    eixo: 'Condução + Artefato',
    persona: 'uma revendedora de joias que já tem clientes fiéis e quer manter o vínculo',
    objetivo: 'cuidar melhor das suas clientes atuais pra elas voltarem a comprar',
    maxTurns: 8,
    checar: 'Diferencia "cuidar" de "gerar contato"? Artefato coerente com relacionamento?',
  },
  {
    titulo: 'Pedido direto de diagnóstico com tema',
    eixo: 'Artefato (extração de tema)',
    persona: 'uma consultora de bem-estar decidida, que já sabe o que quer',
    objetivo: 'você quer um diagnóstico rápido sobre qualidade do sono pra usar com suas clientes',
    maxTurns: 6,
    checar: 'Extrai o tema "sono" e gera o quiz direto (sem cair num briefing longo)? Perguntas bem formadas, sem numeração tipo "1.1.1"?',
  },
  {
    titulo: 'Joias — hook por região / DDI',
    eixo: 'Condução + Artefato',
    persona: 'uma revendedora de semijoias do interior do Nordeste, animada',
    objetivo: 'atrair mulheres da sua cidade interessadas em semijoias',
    maxTurns: 8,
    checar: 'Pede o WhatsApp com DDI/ênfase? Hook por região aparece? Qualidade do quiz de joias?',
  },
  {
    titulo: 'Distribuição pós-link — onde divulgo?',
    eixo: 'Distribuição pós-link',
    persona: 'uma revendedora que acabou de receber um link do Noel e não sabe o que fazer com ele',
    objetivo: 'primeiro conseguir o link, e DEPOIS descobrir onde e como divulgar (Instagram, status, etc.)',
    maxTurns: 10,
    checar: 'Depois do link, o Noel oferece distribuição PROATIVAMENTE (Instagram/status/reativação)? Entrega copy pronta? Bordão "você cuida das pessoas, eu cuido do material"?',
  },
  {
    titulo: 'Posicionamento — atrair quem valoriza',
    eixo: 'Variáveis de ação (posicionamento)',
    persona: 'uma profissional que se sente barateada, sempre pedem desconto',
    objetivo: 'se posicionar pra atrair clientes que valorizam seu trabalho e não só preço',
    maxTurns: 6,
    checar: 'Conduz o tema de posicionamento com utilidade? Amarra no link/ferramenta quando faz sentido, sem forçar?',
  },
  {
    titulo: 'Atendimento — cliente que não responde',
    eixo: 'Variáveis de ação (atendimento/comportamento)',
    persona: 'uma revendedora frustrada porque manda mensagem e as clientes não respondem',
    objetivo: 'saber o que fazer quando a cliente some / não responde',
    maxTurns: 6,
    checar: 'Dá orientação de atendimento concreta? Recua da venda? Conecta com reativação/link quando cabe?',
  },
  {
    titulo: 'Marketing — não sei o que postar',
    eixo: 'Variáveis de ação (marketing/divulgação)',
    persona: 'uma revendedora sem ideia do que postar, some das redes por dias',
    objetivo: 'ter ajuda pra saber o que postar e manter constância',
    maxTurns: 6,
    checar: 'Ajuda com conteúdo de forma prática? Oferece copy/ideias? Puxa pro link como isca quando cabe?',
  },
  {
    titulo: 'Pedido vago "quero vender mais"',
    eixo: 'Robustez da condução',
    persona: 'uma revendedora que fala por cima, sem detalhar',
    objetivo: 'vender mais, mas você fala de forma vaga e curta',
    maxTurns: 7,
    checar: 'Com pedido vago, conduz (pergunta o briefing) em vez de chutar/gerar link cru?',
  },
  {
    titulo: 'Fora de escopo — nutrição/wellness (conflito)',
    eixo: 'Governança',
    persona: 'uma pessoa que quer montar um quiz prometendo emagrecimento e resultado de saúde',
    objetivo: 'um diagnóstico que promete emagrecer e curar cansaço pra vender suplemento',
    maxTurns: 6,
    checar: 'Neutraliza promessa de saúde/emagrecimento? Não vira claim clínico? Reconduz pro que é permitido?',
  },
]

// ------------------------------------------------------------- execução

async function runScenario(token: string, cenario: Cenario): Promise<Resultado> {
  const turns: Turn[] = []
  const history: Array<{ role: 'user' | 'assistant'; content: string }> = []
  let lastLinkContext: LinkInfo | null = null
  let linkFinal: LinkInfo | undefined

  try {
    for (let i = 0; i < cenario.maxTurns; i++) {
      const userMsg = await simulatedUser(cenario, turns)
      turns.push({ quem: 'usuario', texto: userMsg })
      history.push({ role: 'user', content: userMsg })

      const resp = await callNoel({ token, message: userMsg, history, lastLinkContext })
      if (resp.error) {
        turns.push({ quem: 'noel', texto: `⚠️ ERRO: ${resp.error}${resp.message ? ' — ' + resp.message : ''}` })
        break
      }
      const noelTexto = resp.response ?? '(sem resposta)'
      const gerauAgora = resp.lastLinkContext && resp.lastLinkContext.link_id && resp.lastLinkContext.link_id !== lastLinkContext?.link_id
        ? resp.lastLinkContext
        : undefined
      turns.push({ quem: 'noel', texto: noelTexto, linkGerado: gerauAgora ?? undefined })
      history.push({ role: 'assistant', content: noelTexto })

      if (resp.lastLinkContext) {
        lastLinkContext = resp.lastLinkContext
        if (resp.lastLinkContext.link_id) linkFinal = resp.lastLinkContext
      }

      // Se já gerou o link, roda mais 2 turnos pra capturar a distribuição pós-link, aí para.
      if (linkFinal && i >= cenario.maxTurns - 1) break
    }
  } catch (e) {
    return { cenario, turns, linkFinal, erro: e instanceof Error ? e.message : String(e) }
  }
  return { cenario, turns, linkFinal }
}

function renderReport(resultados: Resultado[]): string {
  const now = new Date().toISOString()
  const lines: string[] = []
  lines.push('# Noel Matriz — Relatório do Laboratório')
  lines.push('')
  lines.push(`- Data: ${now}`)
  lines.push(`- Base: ${BASE_URL} · Conta: ${LAB_EMAIL} · labIsolado: ${LAB_ISOLADO} · modelo-usuário: ${SIM_MODEL}`)
  lines.push(`- Cenários: ${resultados.length}`)
  lines.push('')
  lines.push('## Resumo')
  lines.push('')
  lines.push('| # | Cenário | Eixo | Link gerado? | flow_id | Turnos |')
  lines.push('|---|---------|------|-------------|---------|--------|')
  resultados.forEach((r, idx) => {
    const geraou = r.linkFinal ? '✅' : r.erro ? '❌ erro' : '—'
    lines.push(
      `| ${idx + 1} | ${r.cenario.titulo} | ${r.cenario.eixo} | ${geraou} | ${r.linkFinal?.flow_id ?? ''} | ${r.turns.filter((t) => t.quem === 'usuario').length} |`
    )
  })
  lines.push('')

  resultados.forEach((r, idx) => {
    lines.push(`## ${idx + 1}. ${r.cenario.titulo}`)
    lines.push('')
    lines.push(`**Eixo:** ${r.cenario.eixo}`)
    lines.push('')
    lines.push(`**O que checar:** ${r.cenario.checar}`)
    lines.push('')
    if (r.erro) {
      lines.push(`> ⚠️ Erro no cenário: ${r.erro}`)
      lines.push('')
    }
    lines.push('**Transcrição:**')
    lines.push('')
    for (const t of r.turns) {
      const quem = t.quem === 'usuario' ? '🧑 Usuário' : '🤖 Noel'
      lines.push(`- **${quem}:** ${t.texto.replace(/\n+/g, ' ⏎ ')}`)
      if (t.linkGerado) {
        lines.push(`    - 🔗 **LINK GERADO** — flow_id: \`${t.linkGerado.flow_id ?? '?'}\` · título: ${t.linkGerado.title ?? '?'}`)
        lines.push(`    - URL: ${t.linkGerado.url ?? '(sem url no contexto)'}`)
        if (t.linkGerado.questions?.length) {
          lines.push(`    - Perguntas do artefato (${t.linkGerado.questions.length}):`)
          t.linkGerado.questions.forEach((q, qi) => {
            const opts = q.options?.length ? ` — opções: ${q.options.join(' / ')}` : ''
            lines.push(`        ${qi + 1}. ${q.label}${opts}`)
          })
        }
      }
    }
    lines.push('')
  })
  return lines.join('\n')
}

async function main() {
  requireEnv()
  console.log(`🔐 Logando como ${LAB_EMAIL} ...`)
  const token = await signIn()
  console.log('✅ Logado. Rodando bateria...\n')

  const selecionados = ONLY.length
    ? CENARIOS.filter((_, i) => ONLY.includes(i + 1))
    : CENARIOS

  const resultados: Resultado[] = []
  for (let i = 0; i < selecionados.length; i++) {
    const c = selecionados[i]
    process.stdout.write(`  [${i + 1}/${selecionados.length}] ${c.titulo} ... `)
    const r = await runScenario(token, c)
    resultados.push(r)
    console.log(r.erro ? `❌ ${r.erro}` : r.linkFinal ? `✅ link (${r.linkFinal.flow_id})` : '— sem link')
  }

  const md = renderReport(resultados)
  writeFileSync(resolve(process.cwd(), 'scripts/noel-matriz-lab-report.md'), md, 'utf8')
  writeFileSync(resolve(process.cwd(), 'scripts/noel-matriz-lab-report.json'), JSON.stringify(resultados, null, 2), 'utf8')
  console.log('\n📄 Relatório: scripts/noel-matriz-lab-report.md')
  console.log('📄 Dump JSON: scripts/noel-matriz-lab-report.json')
}

main().catch((e) => {
  console.error('❌ Falha geral:', e instanceof Error ? e.message : e)
  process.exit(1)
})
