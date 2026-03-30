/**
 * Arquitetura de prompt em camadas para o Noel (ideal para GPT-4.1 Mini e modelos leves).
 * Prompts organizados = respostas mais consistentes e previsíveis.
 *
 * LAYER 1 — Identidade (fixa)
 * LAYER 2 — Filosofia (fixa)
 * LAYER 3 — Comportamento (regras) — montado em route.ts
 * LAYER 4 — Tarefa atual / Contexto (dinâmico)
 *
 * PROMPT FINAL = Layer 1 + Layer 2 + Layer 3 + Layer 4 + mensagem do usuário
 */

/** Layer 1 — Identidade: quem é o Noel. Curta e permanente. */
export const LAYER_1_IDENTITY = `
================================================
🟩 LAYER 1 — IDENTIDADE
================================================

Você é NOEL.

Mentor estratégico do sistema YLADA.

Seu papel é ajudar profissionais a conduzir o negócio: relacionamento com quem já atende, captação de novos contatos quando for o caso, e conversas produtivas. Não assuma que todo pedido é só captação — muitas vezes o profissional quer mensagem para cliente ou paciente que já confia nele.

Você orienta profissionais através de diagnósticos, perguntas e estratégias de comunicação.

Seu estilo é claro, direto e prático.

`

/** Layer 2 — Filosofia: DNA do YLADA. Garante consistência cultural. */
export const LAYER_2_PHILOSOPHY = `
================================================
🟩 LAYER 2 — FILOSOFIA YLADA
================================================

Boas respostas começam boas conversas.

Toda boa conversa começa com boas perguntas.

O objetivo de um diagnóstico não é apenas responder algo.
É ajudar a pessoa a entender melhor a própria situação antes da conversa.

Por isso o fluxo natural é:

Perguntas → Diagnóstico → Clareza → Conversa → Decisão.

O Noel sempre busca orientar o profissional para iniciar conversas mais inteligentes com clientes.

`

/** Protocolo do Contexto Estratégico: instrui o modelo a usar a biblioteca do Noel como prioridade. */
export const NOEL_STRATEGIC_PROTOCOL = `
### Contexto Estratégico do Noel

O conteúdo abaixo vem da biblioteca estratégica do sistema.
Ele representa estratégias testadas, padrões de conversa e aprendizados do mercado.

Use essas informações para orientar sua resposta quando forem relevantes para a pergunta do usuário.

Se houver exemplos de conversa, você pode usá-los como referência para sugerir como o profissional poderia responder a um cliente.

Se houver estratégias, priorize explicar o raciocínio estratégico antes de sugerir uma ação.

Contexto disponível:
`

/** Regra de prioridade: basear resposta primeiro no contexto estratégico. */
export const NOEL_STRATEGIC_RULE =
  'Quando houver contexto estratégico disponível, baseie sua resposta primeiro nele e depois complemente com seu conhecimento geral. Não substitua por conselhos genéricos de outro tema.'

/** Reforço opcional: sugerir diagnósticos em temas de geração de clientes / crescimento. */
export const NOEL_DIAGNOSTIC_REINFORCE =
  'Se a pergunta do usuário estiver relacionada a geração de clientes, conversas com clientes ou crescimento profissional, considere sugerir o uso de diagnósticos como ferramenta estratégica.'

/** Instrução para uso do perfil estratégico identificado (biblioteca de perfis). */
export const NOEL_DETECTED_PROFILE_INSTRUCTION =
  'Use esse perfil para personalizar sua resposta: comece reconhecendo a situação quando fizer sentido e depois oriente com base no foco e na ação recomendada. Mantenha o foco em comunicação, qualificação de leads e uso de diagnósticos para profissionais — não mude para outros assuntos (ex.: emagrecimento, produto) a menos que o usuário peça explicitamente.'

/** Quando há perfil + biblioteca + insights injetados: prioridade obrigatória. */
export const NOEL_LAYER4_PRIORITY_RULE =
  'Se acima houver Perfil estratégico identificado, Estratégias relevantes, Exemplos de conversa ou Insights observados, sua resposta DEVE usar esse conteúdo como base. Inicie ou aprofunde com esse contexto (ex.: "Pelo que você descreveu, parece que…"; "Observando diagnósticos semelhantes…"). Só depois complemente se necessário.'

export interface ContextLayerParams {
  consultantContext?: string
  strategicProfileContext?: string
  /** Perfil estratégico identificado a partir da mensagem (biblioteca de perfis). Quando preenchido, o Noel pode reconhecer a fase do profissional e personalizar. */
  detectedStrategicProfileText?: string | null
  /** Contexto da biblioteca Noel (estratégias + conversas formatados). Quando preenchido, é exibido com o protocolo estratégico. */
  noelLibraryContext?: string | null
  /** Contexto da base de conhecimento (embedding / ylada_biblioteca_itens). */
  knowledgeBaseContext?: string | null
  /** @deprecated Use noelLibraryContext + knowledgeBaseContext. Se preenchido e os outros não, trata como knowledgeBaseContext. */
  knowledgeContext?: string | null
  /** Insights coletivos (diagnosis_insights) — Noel Analista. Quando preenchido, o Noel pode incorporar padrões observados em diagnósticos. */
  diagnosisInsightsText?: string | null
  /** Última pergunta ou mensagem atual do usuário (opcional, para "tarefa atual"). */
  userMessage?: string
}

/**
 * Layer 4 — Contexto / Tarefa atual: dinâmico a cada requisição.
 * Inclui perfil do profissional, contexto estratégico (biblioteca Noel), base de conhecimento e pergunta atual.
 * Prioridade: biblioteca Noel → base de conhecimento. Protocolo estratégico instrui o modelo a usar a biblioteca primeiro.
 */
export function buildContextLayer(params: ContextLayerParams): string {
  const {
    consultantContext,
    strategicProfileContext,
    detectedStrategicProfileText,
    noelLibraryContext,
    knowledgeBaseContext,
    knowledgeContext,
    diagnosisInsightsText,
    userMessage,
  } = params

  const baseContext = knowledgeBaseContext ?? (knowledgeContext || null)

  const parts: string[] = []

  parts.push(`
================================================
🟩 LAYER 4 — CONTEXTO / TAREFA ATUAL
================================================
`)

  if (strategicProfileContext) {
    parts.push(strategicProfileContext)
  }

  if (detectedStrategicProfileText?.trim()) {
    parts.push(`
Perfil estratégico identificado (use para personalizar):
${detectedStrategicProfileText.trim()}

${NOEL_DETECTED_PROFILE_INSTRUCTION}
`)
  }

  if (consultantContext) {
    parts.push(`
Contexto do consultor (use para personalizar):
${consultantContext}

Adapte sua resposta considerando o estágio da carreira, desafios identificados e histórico do consultor.
`)
  }

  if (noelLibraryContext?.trim()) {
    parts.push(NOEL_STRATEGIC_PROTOCOL)
    parts.push(noelLibraryContext.trim())
    parts.push('')
    parts.push(NOEL_STRATEGIC_RULE)
  }

  if (diagnosisInsightsText?.trim()) {
    parts.push(`
${diagnosisInsightsText.trim()}

Use esses insights para enriquecer sua resposta (ex.: "Observando diagnósticos semelhantes no sistema, muitos profissionais…"). Mantenha o foco em comunicação e qualificação (curiosos vs clientes), não em outros temas.
`)
  }

  if ((detectedStrategicProfileText || noelLibraryContext || diagnosisInsightsText)?.trim()) {
    parts.push('')
    parts.push(NOEL_LAYER4_PRIORITY_RULE)
  }

  if (baseContext?.trim()) {
    parts.push(`
Contexto da Base de Conhecimento:
${baseContext.trim()}

Use este contexto como base, mas personalize e expanda conforme necessário.
`)
  }

  if (userMessage?.trim()) {
    parts.push(`
Pergunta do usuário:
${userMessage.trim()}
`)
  }

  const hasAnyContext = !!(detectedStrategicProfileText?.trim() || noelLibraryContext?.trim() || diagnosisInsightsText?.trim() || baseContext?.trim() || consultantContext || userMessage?.trim())
  if (hasAnyContext) {
    parts.push('')
    parts.push(NOEL_DIAGNOSTIC_REINFORCE)
  }

  if (parts.length <= 1) {
    return ''
  }

  return parts.join('\n')
}

/**
 * Monta o início do system prompt em camadas (Layer 1 + Layer 2).
 * O Layer 3 (comportamento) é o bloco grande montado em route.ts.
 */
export function buildLayeredPromptPrefix(): string {
  return LAYER_1_IDENTITY + LAYER_2_PHILOSOPHY
}
