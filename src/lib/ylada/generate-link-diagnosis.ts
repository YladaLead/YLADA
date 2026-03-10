/**
 * Gera conteúdo de diagnóstico por link via IA.
 * Usado quando o profissional edita o link — memoriza para não chamar IA de novo.
 */
import OpenAI from 'openai'

const ARCHETYPE_CODES_RISK = ['leve', 'moderado', 'urgente'] as const
const ARCHETYPE_CODES_BLOCKER = ['bloqueio_pratico', 'bloqueio_emocional'] as const

export type DiagnosisContentArchetype = {
  profile_title: string
  profile_summary: string
  main_blocker: string
  causa_provavel?: string
  preocupacoes?: string
  consequence: string
  growth_potential: string
  specific_actions: string[]
  dica_rapida?: string
  frase_identificacao?: string
  cta_text: string
  whatsapp_prefill: string
}

export type GenerateLinkDiagnosisInput = {
  theme: string
  architecture: 'RISK_DIAGNOSIS' | 'BLOCKER_DIAGNOSIS'
  questions: Array<{ id: string; label: string; options?: string[] }>
}

export type GenerateLinkDiagnosisOutput = {
  archetypes: Record<string, DiagnosisContentArchetype>
}

const PROMPT_RISK = `Você gera conteúdo para diagnósticos de quiz de saúde/nutrição/estética.
O sistema usa 3 NÍVEIS: leve, moderado, urgente.
Placeholders obrigatórios: {THEME} (tema do quiz) e {NAME} (ex: "quem te enviou").

## ESTRUTURA POR NÍVEL

**leve** — Indícios iniciais. Tom educativo, suave, encorajador.
- main_blocker: "Indícios em {THEME} que merecem atenção"
- profile_summary: Conectar as respostas ao tema de forma leve. Ex: "Com base nas suas respostas, há sinais leves que merecem atenção. Vale organizar para evitar que evoluam."

**moderado** — Sinais que se repetem. Tom direcionador, sem alarmar.
- main_blocker: "Sinais em {THEME} que se repetem"
- profile_summary: Mostrar que o padrão identificado é relevante. Ex: "Pelos seus relatos, alguns sinais aparecem com frequência. Organizar agora pode ajudar a evitar que o quadro avance."

**urgente** — Desequilíbrio que pede ação. Tom firme mas acolhedor.
- main_blocker: "Desequilíbrio em {THEME} que pede ação"
- profile_summary: Reconhecer a situação sem culpar. Ex: "As respostas indicam que o quadro merece atenção. Vale buscar o profissional para calibrar o próximo passo."

## CAMPOS (para cada nível)

profile_title: "Seu resultado em {THEME}"
profile_summary: 1-2 frases. Conecte as respostas ao tema.
main_blocker: Frase acima conforme o nível.

**causa_provavel**: Explique o MECANISMO — por que isso acontece. Seja explicativo. Ex: "A causa provável: rotina desorganizada tende a gerar escolhas impulsivas, o que dificulta o progresso em {THEME}." NÃO repita o que está em frase_identificacao.

**preocupacoes**: O que pode piorar se ignorar. Ex: "Deixar de organizar agora pode permitir que pequenas dificuldades se tornem maiores." Específico ao tema.

**consequence**: O que tende a acontecer. DEVE ser DIFERENTE de preocupacoes — nunca a mesma frase. Ex: "Se ignorar esses sinais, tendem a dificultar o bem-estar e o progresso em {THEME}."

**growth_potential**: Providências. Direcionar ao profissional.

**specific_actions**: 2-3 ações práticas e ESPECÍFICAS ao tema. Ex: "Definir um horário fixo para pelo menos uma refeição por dia." NÃO genéricas como "pesquise recursos" ou "converse com amigos". A ÚLTIMA: "Converse com {NAME} pra calibrar o próximo passo."

**dica_rapida**: Ação prática CONCRETA que a pessoa pode fazer. Deve estar relacionada às respostas. Pode incentivar a buscar ajuda. Ex: "Definir um horário fixo para pelo menos uma refeição por dia já pode mudar o ritmo." NÃO genérico como "organize suas metas".

**frase_identificacao**: Frase DIRETA que conecta o diagnóstico à situação. NUNCA use "Se você se identificou com esse resultado" — a pessoa ainda não viu o resultado completo. Use: "Sua rotina e hábitos têm pesado no seu dia a dia." ou "Os sinais que você relatou indicam que vale organizar." Ou OMITA se não fizer sentido.

cta_text: "Clique para entender melhor seu caso"
whatsapp_prefill: "Oi {NAME}, fiz a análise de {THEME} e gostaria de conversar sobre o resultado." NUNCA escreva "Oi aí" — use SEMPRE {NAME}.

## REGRAS ESSENCIAIS

- NUNCA repetir a mesma frase em causa_provavel, preocupacoes e consequence — cada um tem ângulo diferente
- frase_identificacao: NUNCA "Se você se identificou com esse resultado" — use frase direta ou omita
- dica_rapida: prática, concreta, coerente com as respostas
- Linguagem acolhedora, nunca culpabilizante
- Manter {THEME} e {NAME} onde fizer sentido

Retorne JSON: { "leve": {...}, "moderado": {...}, "urgente": {...} }`

const PROMPT_BLOCKER = `Você gera conteúdo para diagnósticos de quiz (bloqueios de rotina/hábitos).
O sistema usa 2 TIPOS: bloqueio_pratico, bloqueio_emocional.
Placeholders: {THEME} (tema) e {NAME} (ex: "quem te enviou").

## ESTRUTURA POR TIPO

**bloqueio_pratico** — Rotina, processo, hábitos, organização.
- main_blocker: "Bloqueio prático em {THEME}" ou variação que conecte ao tema
- profile_summary: Conectar respostas a dificuldades de rotina/organização
- Foco: próximo passo claro, ações concretas, organização

**bloqueio_emocional** — Aspectos emocionais, expectativas, autoconhecimento.
- main_blocker: "Bloqueio emocional em {THEME}" ou variação
- profile_summary: Conectar respostas a padrões emocionais ou expectativas
- Foco: autoconhecimento, calibração de expectativas, direcionar ao profissional

## CAMPOS (mesmos do RISK)

Mesmas regras: causa_provavel (mecanismo), preocupacoes e consequence (diferentes entre si), dica_rapida (prática, concreta), frase_identificacao (NUNCA "Se você se identificou com esse resultado" — use frase direta ou omita).

specific_actions: 2-3 ações práticas e específicas ao tema. NÃO genéricas. O último: "Converse com {NAME} pra calibrar o próximo passo."

## REGRAS

- NUNCA repetir a mesma frase em causa_provavel, preocupacoes e consequence
- frase_identificacao: frase direta ou omita
- dica_rapida: prática, coerente com as respostas

Retorne JSON: { "bloqueio_pratico": {...}, "bloqueio_emocional": {...} }`

export async function generateLinkDiagnosisContent(
  input: GenerateLinkDiagnosisInput,
  openai: OpenAI
): Promise<GenerateLinkDiagnosisOutput> {
  const { theme, architecture, questions } = input
  const questionsText = questions
    .map((q) => `- ${q.label}${q.options?.length ? ` (opções: ${q.options.join(', ')})` : ''}`)
    .join('\n')

  const basePrompt = architecture === 'RISK_DIAGNOSIS' ? PROMPT_RISK : PROMPT_BLOCKER
  const codes = architecture === 'RISK_DIAGNOSIS' ? ARCHETYPE_CODES_RISK : ARCHETYPE_CODES_BLOCKER

  const prompt = `${basePrompt}

---

TEMA DO QUIZ: ${theme}

PERGUNTAS DO QUIZ:
${questionsText}

---

INSTRUÇÃO: Gere conteúdo específico para ESTE tema e ESTAS perguntas. Cada seção (causa_provavel, preocupacoes, consequence) deve trazer informação diferente — não repetir. Dica rápida: ação concreta. Frase identificação: direta, nunca "Se você se identificou com esse resultado".`
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Você retorna apenas JSON válido, sem markdown. Regras: (1) NUNCA use "Se você se identificou com esse resultado" em frase_identificacao — use frase direta ou omita. (2) causa_provavel, preocupacoes e consequence devem ser DIFERENTES — nunca repetir a mesma frase. (3) dica_rapida: ação prática concreta, coerente com as respostas. Use {THEME} e {NAME} nos textos.',
      },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  })
  const text = res.choices[0]?.message?.content
  if (!text) throw new Error('Resposta vazia da IA')
  const parsed = JSON.parse(text) as Record<string, unknown>
  const archetypes: Record<string, DiagnosisContentArchetype> = {}
  for (const code of codes) {
    const raw = parsed[code]
    if (raw && typeof raw === 'object') {
      const r = raw as Record<string, unknown>
      archetypes[code] = {
        profile_title: (r.profile_title as string) ?? 'Seu resultado',
        profile_summary: (r.profile_summary as string) ?? '',
        main_blocker: (r.main_blocker as string) ?? '',
        causa_provavel: r.causa_provavel as string | undefined,
        preocupacoes: r.preocupacoes as string | undefined,
        consequence: (r.consequence as string) ?? '',
        growth_potential: (r.growth_potential as string) ?? '',
        specific_actions: Array.isArray(r.specific_actions) ? r.specific_actions as string[] : [],
        dica_rapida: r.dica_rapida as string | undefined,
        frase_identificacao: r.frase_identificacao as string | undefined,
        cta_text: (r.cta_text as string) ?? 'Clique para entender melhor seu caso',
        whatsapp_prefill:
          (r.whatsapp_prefill as string)?.trim() ||
          `Oi, fiz a análise de ${theme} e gostaria de conversar sobre o resultado.`,
      }
    }
  }
  return { archetypes }
}
