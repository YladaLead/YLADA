/**
 * Coerência do rascunho de fluxo por objetivo — Noel líder (§6.1, r84, r87).
 */

/** Bloco §6.1 + r87: colher indicações = viral/compartilhar, não lista de nomes. */
export function proLideresNoelFluxoIndicacoesViralBlock(): string {
  return `**COLHER INDICAÇÕES — UMA LÓGICA SÓ (§6.1 — PREVALECE)**
- **Default:** fluxo **viral / compartilhar** — gancho que toca **cuidado com quem ama** + conteúdo que a pessoa **quer passar adiante** + **CTA de compartilhar o link** (ou "mandar pra quem importa").
- A indicação vem de **quem clica no link compartilhado** (loop) — **não** de pedir lista de nomes/telefones.
- **Proibido** misturar: gancho "compartilhe com quem você ama" **com** perguntas "quem indicar? nome/telefone" — escolha **uma** lógica.
- **Proibido** formulário de coleta de indicação (nome, telefone, e-mail de terceiros) no fluxo de indicações — isso é jeito antigo/invasivo.
- **Perguntas (se houver):** no máximo **2–3** MCQs de **reflexão** (ex.: "você conhece alguém que também se importa com isso?" com opções descritivas) — **não** precisa de 4–5 perguntas neste objetivo.
- **Mensagem final:** convite a **compartilhar o link** com quem ama + tom de missão (ajudar quem importa), **não** pedir WhatsApp do consultor como único fecho — pode ter handoff opcional **depois** do compartilhamento, sem coletar dados de terceiros.`
}

/** r84 — coleta de dados pessoais: default OFF. */
export function proLideresNoelColetaDadosR84Block(): string {
  return `**COLETA DE DADOS (r84 — DEFAULT OFF)**
- **Proibido** pedir nome, telefone, e-mail ou mensagem como **pergunta de quiz** no fluxo padrão — o handoff WhatsApp já identifica quem **engajou**.
- **Coleta ativa** (campos de preencher) só se o líder pedir **explicitamente** pesquisa/lead-gen com opt-in — aí use **campo aberto** (texto livre), **nunca** opções A/B/C/D.
- **Proibido** MCQ (A/B/C/D) para campos que são **preenchimento**: nome, telefone, WhatsApp, e-mail, mensagem, "descreva", "escreva".
- Se precisar de consentimento: uma linha clara de **opt-in** antes do campo — ex.: "Posso guardar seu nome pra confirmar?" + campo livre (não MCQ).`
}

/** Regras gerais de coerência por objetivo no Construtor. */
export function proLideresNoelFluxoCoerenciaPorObjetivoBlock(): string {
  return `**COERÊNCIA POR OBJETIVO (CONSTRUTOR)**
- Cada objetivo tem **uma** lógica de fluxo — **proibido** misturar mecanismos (viral × formulário × qualificação longa).
- **Trazer gente nova:** diagnóstico que revela dor + CTA conversa (4–5 MCQs ok).
- **Cuidar de cliente / Reativar:** conteúdo útil + percepção do momento + CTA leve (3–5 MCQs ok).
${proLideresNoelFluxoIndicacoesViralBlock()}
${proLideresNoelColetaDadosR84Block()}`
}

const OPEN_FIELD_MCQ_RE =
  /(?:qual|informe|digite|escreva|me (?:diga|passa)|seu|da pessoa).{0,40}(?:nome|telefone|whatsapp|e-?mail|celular)/i

/** MCQ para campo que deveria ser texto livre (r87). */
export function leaderFluxoDraftUsesMcqForOpenField(text: string): boolean {
  const t = text.trim()
  if (!t) return false
  const chunks = t.split(/\n---\n|(?=\n(?:\*\*Perguntas\*\*|### Pergunta))/i)
  for (const chunk of chunks) {
    if (!OPEN_FIELD_MCQ_RE.test(chunk)) continue
    if (/\n\s*A\)/.test(chunk) || /\n\s*A\)/.test(chunk.replace(/\*\*/g, ''))) return true
  }
  if (OPEN_FIELD_MCQ_RE.test(t) && /\nA\)/.test(t)) return true
  if (/(?:nome|telefone).{0,30}\?/i.test(t) && /\n\s*A\)/.test(t) && /(?:nome|telefone)/i.test(t)) return true
  return false
}

const VIRAL_HOOK_RE =
  /compartilh(e|a).{0,30}quem|passar (?:pra|para) quem|mandar (?:pra|para) quem|quem você ama/i

const NAME_LIST_FORM_RE =
  /(?:liste|lista de).{0,20}nom|nome e telefone|telefone de quem|(?:me )?diga.{0,25}(?:nome|telefone).{0,25}indic|quem (?:você )?(?:gostaria de )?indicar|dados de quem indic/i

/** Gancho viral + formulário de nomes na mesma resposta (r87). */
export function leaderFluxoDraftHasIndicacoesLogicMix(text: string): boolean {
  const t = text.trim()
  if (!t) return false
  return VIRAL_HOOK_RE.test(t) && NAME_LIST_FORM_RE.test(t)
}

const SHARE_CTA_RE =
  /compartilh(e|a).{0,40}(?:link|isso)|passar (?:o )?link|enviar (?:pra|para) quem|mandar (?:pra|para) quem/i

/** Rascunho de indicações alinhado ao modelo viral §6.1. */
export function leaderIndicacoesFluxoDraftIsCoherentViral(text: string): boolean {
  const t = text.trim()
  if (!t) return false
  if (leaderFluxoDraftHasIndicacoesLogicMix(t)) return false
  if (leaderFluxoDraftUsesMcqForOpenField(t)) return false
  if (NAME_LIST_FORM_RE.test(t)) return false
  return SHARE_CTA_RE.test(t)
}

export function leaderConducaoPromptRequiresIndicacoesViral(prompt: string): boolean {
  return (
    /COLHER INDICAÇÕES.*UMA LÓGICA SÓ/i.test(prompt) &&
    /compartilhar o link/i.test(prompt) &&
    /formulário de coleta de indicação|lista de nomes/i.test(prompt)
  )
}

export function leaderConducaoPromptRequiresR84OptIn(prompt: string): boolean {
  return (
    /COLETA DE DADOS.*r84/i.test(prompt) &&
    /default off/i.test(prompt) &&
    /proibido.*mcq|nunca.*a\/b\/c\/d/i.test(prompt)
  )
}

export function leaderConducaoPromptRequiresFluxoCoerencia(prompt: string): boolean {
  return /coerência por objetivo|coerencia por objetivo/i.test(prompt)
}
