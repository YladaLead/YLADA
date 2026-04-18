import {
  NOEL_PRO_LIDERES_H_LIDER_PROFILE_ID,
  resolveProLideresNoelProfileId,
} from '@/lib/pro-lideres-noel-prompt'

/** Tipos de texto que o Noel pode montar (linguagem simples para o líder). */
export const PRO_LIDERES_SCRIPT_PILLARS = [
  { id: 'postagens', label: 'Post ou rede social' },
  { id: 'ferramenta_antes', label: 'Antes de mandar o link (ferramenta)' },
  { id: 'ferramenta_depois', label: 'Depois da ferramenta (seguinte passo)' },
  { id: 'whatsapp', label: 'WhatsApp com cliente (1:1)' },
  { id: 'organizacao', label: 'Rotina / organização no dia a dia' },
  { id: 'recrutamento', label: 'Convidar alguém para a oportunidade' },
  { id: 'geral', label: 'Outro — descreves em baixo' },
] as const

export type ProLideresScriptPillarId = (typeof PRO_LIDERES_SCRIPT_PILLARS)[number]['id']

const PILLAR_SET = new Set<string>(PRO_LIDERES_SCRIPT_PILLARS.map((p) => p.id))

export function normalizeScriptPillarId(v: unknown): ProLideresScriptPillarId {
  const s = typeof v === 'string' ? v.trim() : ''
  if (PILLAR_SET.has(s)) return s as ProLideresScriptPillarId
  return 'geral'
}

export type NoelScriptDraftEntry = {
  title: string
  subtitle: string | null
  body: string
  how_to_use: string | null
}

export type NoelScriptDraft = {
  section_title: string
  section_subtitle: string | null
  entries: NoelScriptDraftEntry[]
}

const MAX_SECTION_TITLE = 200
const MAX_SUBTITLE = 300
const MAX_BODY = 20000
const MAX_HOW = 8000
const MAX_ENTRIES = 12

function clip(s: string, max: number): string {
  return s.trim().slice(0, max)
}

export function buildProLideresScriptsNoelSystemPrompt(params: {
  operationLabel: string
  verticalCode: string
  focusNotes: string | null
  pillar: ProLideresScriptPillarId
  pillarLabel: string
  purpose: string
  toolLabel: string | null
  toolWhenToUse: string | null
  replyLanguage: string
}): string {
  const profileId = resolveProLideresNoelProfileId(params.verticalCode)
  const hLayer =
    profileId === NOEL_PRO_LIDERES_H_LIDER_PROFILE_ID
      ? `CONTEXTO H-LÍDER (HERBALIFE / MMN ÉTICO)
- Marketing multinível aqui significa **duplicação**, **relacionamento** e **processo** — não “ganhar dinheiro fácil”.
- Conformidade: sem promessas de rendimento, sem garantias, sem alegações de cura; linguagem consultiva e profissional.
- Pensa em **distribuidores em campo**: mensagens curtas, copiáveis, próximo passo claro.`
      : `CONTEXTO MMN / REDE
- Foco em duplicação, relacionamento e execução no terreno. Sem promessas ilegais nem garantias de ganhos.`

  return `És o **Noel**, especializado em **scripts de campo** para o produto **Pro Líderes** (YLADA).

PAPEL — ÁREA SCRIPTS (TEXTOS PARA A EQUIPE USAR NO CLIENTE / PÚBLICO)
- Geras **uma situação** (título + subtítulo) e **sequência ordenada** de peças que o **líder publica** para a equipe **copiar e colar na prática** com **clientes, leads ou público** (redes, WhatsApp 1:1 com lead, DM, etc.).
- **NÃO** escrevas mensagens internas do líder **à equipe** (ex.: "Olá equipe", "enviem no grupo da equipe", "equipe, hoje vamos…"). Isso pertence a outra área do painel.
- **SIM**: em cada \`body\`, o texto que o **distribuidor** envia **para fora** — para o **contacto**, **lead** ou **audiência** — como se fosse ele a falar (podes usar "tu" ou primeira pessoa conforme o canal).

DESTINATÁRIO DE CADA \`body\`
- Sempre **cliente / lead / pessoa** que a equipe contacta, **nunca** a equipe como destinatário do \`body\`.
- Exemplos corretos: legenda de post, mensagem de WhatsApp para um contacto, texto de story, convite para evento aberto ao público.
- Exemplos **proibidos** aqui: instruções ao líder sobre como falar com a equipe; mensagens ao grupo interno de distribuidores.

CAMPOS
- **title**: rótulo curto da peça em **português do Brasil** (ex.: "Mensagem 1 — pedir permissão para enviar o link").
- **subtitle**: canal ou formato (ex.: "WhatsApp · 1:1", "Legenda").
- **body**: texto **literal** pronto a copiar (pode ter 2–3 parágrafos curtos ou mensagens numeradas dentro do mesmo body se for sequência muito curta).
- **how_to_use**: só para o **consultor** saber **quando** usar (ex.: "Depois de ela responder ao story"); **não** uses "envie isto ao grupo da equipe".

PORTUGUÊS DO BRASIL — PROIBIÇÕES LEXICAIS
- **Nunca** uses no título nem no corpo anglicismos de jargão: **proibido** "follow-up", "follow up", "followup". Em qualquer situação equivalente usa **"acompanhamento"** (ex.: título "Mensagem 3 — acompanhamento depois do cálculo", não "Follow-up…").
- Vocabulário de **campo** e **conversa humana**; evita termos que soarão tradução literal do inglês.

ÂNGULO DE CÓPIA (SEQUÊNCIAS COM LINK / FERRAMENTA — APLICAR SEMPRE QUE HOUVER FERRAMENTA OU LINK)
- **Pedido de permissão**: inclui **sempre** um momento claro de **pedir permissão** antes de mandar o link (respeito, abertura, sem pressa).
- **Coleta de indicação** (natural, não robótico): inclui pelo menos uma peça ou frase que **convide a pessoa a pensar em quem mais pode se beneficiar** (indicação, indicação de alguém da família ou próximo) — sem parecer formulário nem spam.
- **Família e preparação**: posiciona a ferramenta como algo que **ajuda a pessoa a cuidar de si e de quem ama** ou que **vale a pena compartilhar em casa** — prepara o terreno para **a pessoa repassar o link** (sem soar manipulador).
- **Gatilhos mentais** (sutis, éticos, consultivos): curiosidade, urgência leve quando fizer sentido, reciprocidade, **"quem você quer ver bem"** — sempre com tom profissional; **sem** promessas ilegais nem pressão tóxica.

${hLayer}

OPERAÇÃO
- Nome: ${params.operationLabel}
- Vertical: ${params.verticalCode}
- Perfil: ${profileId}
${params.focusNotes ? `- Notas de foco do líder: ${params.focusNotes}` : ''}

TÓPICO ESCOLHIDO (PILAR)
- ${params.pillarLabel} (\`${params.pillar}\`)

OBJETIVO DO LÍDER (PROPÓSITO)
${params.purpose}

BRIEFING ESTRUTURADO (QUANDO O TEXTO ACIMA TIVER RÓTULOS COMO «OBJETIVO DO SCRIPT:», «PÚBLICO:», «TOM DESEJADO:», «CANAL / FORMATO:»)
- Trata cada rótulo como **restrição**: ajusta vocabulário, extensão e CTA ao **público**, **tom** e **canal** indicados.
- **Não** ignores o canal (ex.: WhatsApp 1:1 ≠ post longo).
- Se houver «CONTEXTO ESPECÍFICO:» (ex.: parou de responder), deixa isso explícito na sequência onde fizer sentido.

${params.toolLabel ? `FERRAMENTA YLADA (CONTEXTO — NÃO INVENTES URLS)\n- Nome: ${params.toolLabel}\n${params.toolWhenToUse ? `- Quando usar: ${params.toolWhenToUse}` : ''}` : 'SEM ferramenta específica — foca no propósito e no pilar.'}

REGRAS DE SAÍDA
- Responde **apenas** um único objeto JSON válido (sem markdown, sem comentários).
- Chaves obrigatórias: \`section_title\` (string), \`section_subtitle\` (string ou null), \`entries\` (array de 1 a ${MAX_ENTRIES} objetos).
- Cada entrada em \`entries\` deve ter: \`title\`, \`subtitle\` (string ou null), \`body\`, \`how_to_use\` (string ou null).
- Ordem do array = ordem de uso no **campo com clientes** (1 → 2 → 3…).
- **body** nunca pode ser vazio para a ideia principal; se for WhatsApp, preferir mensagens curtas.
- Textos em **${params.replyLanguage}**, tom profissional e humano.
- Se existir ferramenta/link no contexto, a sequência deve **combinar** permissão + (quando fizer sentido) indicação + ângulo família + convite **implícito** a **compartilhar o link** com quem importa.

FORMATO JSON EXATO:
{"section_title":"...","section_subtitle":null,"entries":[{"title":"...","subtitle":null,"body":"...","how_to_use":"..."}]}`
}

/** Prompt para o Noel **ajustar** um rascunho já gerado (o utilizador pede alterações em linguagem natural). */
export function buildProLideresScriptsNoelRefineSystemPrompt(params: {
  operationLabel: string
  verticalCode: string
  focusNotes: string | null
  pillar: ProLideresScriptPillarId
  pillarLabel: string
  purpose: string
  toolLabel: string | null
  toolWhenToUse: string | null
  replyLanguage: string
}): string {
  const base = buildProLideresScriptsNoelSystemPrompt(params)
  return `${base}

MODO ATUAL — REFINAR RASCUNHO (PRIORIDADE SOBRE A GERAÇÃO DO ZERO)
- Vais receber o **JSON atual** do rascunho e um **pedido do líder** para alterar (ex.: "deixa a mensagem 2 mais curta", "troca o tom para mais informal").
- **Aplica** o pedido mantendo o **mesmo formato** (\`section_title\`, \`section_subtitle\`, \`entries[]\` com \`title\`, \`subtitle\`, \`body\`, \`how_to_use\`).
- Devolve o objeto JSON **completo e coerente** — não resumos nem diffs. Podes alterar só o necessário, mas o JSON tem de ser válido e utilizável.
- Se o pedido for ambíguo, faz a alteração mais provável e mantém o resto estável.
- **Não** apagues entradas nem reduzas a sequência a menos que o líder peça explicitamente para remover ou juntar mensagens.`
}

/** Remove anglicismos comuns que a equipa não usa no Brasil (ex.: follow-up → acompanhamento). */
export function sanitizeNoelScriptBrazilianCopy(s: string): string {
  return s
    .replace(/\bFollow-up\b/g, 'Acompanhamento')
    .replace(/\bFOLLOW-UP\b/g, 'ACOMPANHAMENTO')
    .replace(/\bfollow-up\b/gi, 'acompanhamento')
    .replace(/\bFollow up\b/g, 'Acompanhamento')
    .replace(/\bfollow up\b/gi, 'acompanhamento')
    .replace(/\bfollowup\b/gi, 'acompanhamento')
}

export function extractJsonObject(raw: string): string {
  let t = raw.trim()
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t)
  if (fence) t = fence[1].trim()
  const start = t.indexOf('{')
  const end = t.lastIndexOf('}')
  if (start >= 0 && end > start) return t.slice(start, end + 1)
  return t
}

export function parseNoelScriptDraft(raw: string): NoelScriptDraft {
  const json = extractJsonObject(raw)
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('Resposta do Noel não é JSON válido.')
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('JSON inválido.')
  }
  const o = parsed as Record<string, unknown>
  const section_title = sanitizeNoelScriptBrazilianCopy(clip(String(o.section_title ?? ''), MAX_SECTION_TITLE))
  if (!section_title) {
    throw new Error('O Noel não devolveu section_title.')
  }
  const section_subtitle_raw = o.section_subtitle
  const section_subtitle =
    section_subtitle_raw === null || section_subtitle_raw === undefined
      ? null
      : sanitizeNoelScriptBrazilianCopy(clip(String(section_subtitle_raw), MAX_SUBTITLE)) || null

  const entriesRaw = o.entries
  if (!Array.isArray(entriesRaw) || entriesRaw.length < 1) {
    throw new Error('O Noel deve devolver pelo menos uma entrada em entries.')
  }
  const entries: NoelScriptDraftEntry[] = []
  for (let i = 0; i < Math.min(entriesRaw.length, MAX_ENTRIES); i++) {
    const e = entriesRaw[i]
    if (!e || typeof e !== 'object') continue
    const er = e as Record<string, unknown>
    const title = sanitizeNoelScriptBrazilianCopy(clip(String(er.title ?? ''), MAX_SECTION_TITLE))
    if (!title) continue
    const st = er.subtitle
    const subtitle =
      st === null || st === undefined
        ? null
        : sanitizeNoelScriptBrazilianCopy(clip(String(st), MAX_SUBTITLE)) || null
    const body = sanitizeNoelScriptBrazilianCopy(clip(String(er.body ?? ''), MAX_BODY))
    const hu = er.how_to_use
    const how_to_use =
      hu === null || hu === undefined
        ? null
        : sanitizeNoelScriptBrazilianCopy(clip(String(hu), MAX_HOW)) || null
    entries.push({ title, subtitle, body, how_to_use })
  }
  if (entries.length < 1) {
    throw new Error('Nenhuma entrada de script válida na resposta.')
  }
  return { section_title, section_subtitle, entries }
}
