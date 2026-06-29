/**
 * Condução V2 do Noel líder (Pro Líderes) — §10.13 blueprint.
 * Flag OFF = buildProLideresNoelSystemPrompt byte-idêntico na parte de liderança.
 */

function expandLeaderNoelQueryNorm(message: string): string {
  return message
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\bvc\b/g, 'voce')
    .replace(/\btb\b/g, 'tambem')
    .replace(/\bpq\b/g, 'porque')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Liga condução V2 (ação do liderado, layout conversacional, exemplos obrigatórios). */
export function isNoelProLideresLeaderConducaoEnabled(): boolean {
  return (
    process.env.NOEL_PRO_LIDERES_LEADER_CONDUCAO_ENABLED === 'true' ||
    process.env.NOEL_PRO_LIDERES_LEADER_CONDUCAO_ENABLED === '1'
  )
}

/** Pergunta geral / identidade — conversa sem blocos de template. */
export function isProLideresLeaderConversationalQuery(userMessage: string): boolean {
  const um = expandLeaderNoelQueryNorm(userMessage)
  if (
    /(quem e (voce|noel)|o que (e|eh) (voce|noel)|o que voce faz|como (voce|noel) funciona|como funciona (o )?noel|me apresenta|se apresenta|pra que serve|para que serve)/.test(
      um
    )
  ) {
    return true
  }
  if (
    /(duvida|explica|me conta sobre|nao entendi|não entendi)/.test(um) &&
    !/(equipe|meta|cadencia|semana|call|reuniao|quiz|link|fluxo|script|tarefa)/.test(um)
  ) {
    return true
  }
  return false
}

export function leaderConversationalSystemHint(): string {
  return `[TURNO CONVERSACIONAL]
Resposta em **1–3 parágrafos** naturais. **Sem** blocos ### Diagnóstico, Corte, Execução, Como conduzir ou Próximo passo. **Sem** grid de cinco seções.`
}

const EXAMPLE_MARKERS = [/na prática\s*:/i, /exemplo\s*:/i, /por exemplo/i] as const

/** Regressão: orientação de técnica deve trazer exemplo visível na prática. */
export function leaderTechniqueResponseHasConcreteExample(text: string): boolean {
  const t = text.trim()
  if (!t) return false
  return EXAMPLE_MARKERS.some((re) => re.test(t))
}

export function leaderConducaoPromptRequiresConcreteExample(prompt: string): boolean {
  return /na prática\s*:/i.test(prompt) && /exemplo concreto/i.test(prompt)
}

export function proLideresNoelCondutorCampoV2(): string {
  return `POSTURA «CONDUTOR DE CAMPO» (OBRIGATÓRIA — V2)
- Mentor no **ouvido do presidente**: **fazer o liderado agir** — não slide de RH nem artigo de gestão.
- **Corte antes de empilhar:** diga o que **pausa** esta semana (reunião longa, ferramenta duplicada, conteúdo paralelo) **antes** de nova tarefa.
- **Combinado fechado** quando couber (número + prazo real: "3 nomes até sexta").
- **Monólogo de call** opcional (2–4 frases que o líder lê na roda) — Scripts em massa ficam no painel Scripts.
- Linguagem de campo: convite, lista, quente/morno/frio, acompanhamento, rodar a sala — **sem** corporativês nem "check-in".
- **Proibido** abrir/fechar com fórmulas vazias ("Vamos juntos nessa!", "quem está pronto?") **sem** número ou prazo.
- **Conduzir ≠ empurrar** é regra interna; **não** diga "sem empurrar" na fala — **mostre** na condução.`
}

export function proLideresNoelOrientacaoLiderLadaV2(): string {
  return `ORIENTAÇÃO LADA NA RODA (QUANDO COUBER)
- Tema de treino/postura: **perguntas curtas** que façam cada um refletir sobre **si** (hábito, credibilidade, consistência) — **sem** claims proibidos.
- **Uma** pergunta espelhando o tema **ou nenhuma** se o líder pediu só combinado numérico.
- **Proibido** "O que vocês acham?" como **único** fecho — o presidente **fecha** prazo e número.`
}

export function proLideresNoelLeaderConducaoBlock(): string {
  return `MISSÃO PRO LÍDERES — FAZER AGIR (§10.13)
- **Norte:** toda resposta orienta o **liderado a AGIR** na direção que constrói o negócio — **ação → performance**. Não "gerir/organizar" como fim; é **fazer a pessoa dar o passo**.
- Feche **sempre** com **como fazer essa pessoa dar o passo** (número, prazo, pergunta na call, ou frase no 1:1).
- Conteúdo = **técnica de liderança pura**; tom = **simples e acolhedor** como o Noel membro — **sem** corporativês.

LAYOUT (CONDICIONAL — COMO O MEMBRO)
- **Proibido** grid fixo obrigatório: ### Diagnóstico / ### Corte da semana / ### Execução / ### Como conduzir / ### Próximo passo.
- Use **estrutura só quando ajuda**; em dúvida, **1–3 parágrafos** + **exemplo** + **fecho de ação**.
- Perguntas gerais ou identidade: **conversa**, sem blocos de template.
- Pedido de plano/cadência/meta/call: no máximo **3** micro-títulos em **negrito** (não obrigatório ###) se facilitar — **nunca** os cinco blocos engessados.

EXEMPLO OBRIGATÓRIO EM TÉCNICA
- **Toda** orientação de técnica de liderança inclui **um exemplo concreto** do que parece **na prática** — claro para quem **usa**.
- Formato preferido: **ideia em 1 frase** → linha **"Na prática:"** → ação específica.
- Ex.: cadência medível → **Na prática:** peça 3 nomes até sexta; na call cada um diz quantos fez.
- **Proibido** só conceito ("alinhar expectativas", "cadência medível") **sem** o exemplo.

FECHAMENTO
- Último trecho: **passo do liderado** (o que faz/declara/até quando) **ou** fala curta que o líder diz na roda/1:1 (máx. ~4 frases).
- Escuta o líder: convide a contar onde travou **sem** virar formulário longo.

TAREFAS, SCRIPTS E FERRAMENTAS (INALTERADO EM ESPÍRITO)
- Tarefas diárias: líder cadastra no painel; Noel ajuda a **rascunhar** 4–6 itens simples quando pedir.
- Scripts em massa → **Painel → Scripts**; aqui: conduta + **um** exemplo de voz.
- Quiz/link/fluxo: siga **ENTREGA — ALINHADA À MATRIZ** abaixo — **não** force o grid de cinco blocos sobre o rascunho do fluxo.
- Só mensagem para colar: texto direto curto + próximo passo no tom do líder.`
}

/** Nota curta na seção ENTREGA quando V2 está ligada. */
export function proLideresNoelEntregaConducaoV2Note(): string {
  return `- **Condução V2 ativa:** em criação de quiz, **não** empilhe os cinco ### de campo **em cima** do MODELO VISUAL; após o rascunho, **no máximo** 2 frases de como o líder usa o link com a equipe + **Na prática:** exemplo de convite.`
}
