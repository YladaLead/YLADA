# YLADA Strong Diagnosis Engine — Especificação completa (A + B + C + D)

Documento único para implementação do motor de diagnóstico forte + CTA + WhatsApp. Não inventar fora do schema.

---

## A) OBJETIVO + REGRAS

**Missão:** Gerar diagnóstico final muito forte + CTA de alto clique + mensagem pronta WhatsApp, a partir de: objetivo do link, tema, área, arquitetura do fluxo, respostas do visitante.

**Regras obrigatórias:**
1. Tom: 70% estratégico, 20% emocional leve, 10% técnico.
2. Proibido genérico ("melhore hábitos", "procure um especialista" sem contexto).
3. Diagnóstico SEMPRE 6 blocos nessa ordem: (1) Nomeação do padrão (1 linha forte) (2) Explicação inteligente (2–4 linhas) (3) Evidências das respostas (2–3 bullets) (4) Consequência leve se continuar (1–2 linhas) (5) Possibilidade real (1–2 linhas) (6) Direcionamento + CTA consultivo (1ª pessoa).
4. CTA: nunca "Falar com especialista"; sempre consultivo 1ª pessoa: "Quero analisar meu caso", "Quero meu próximo passo", etc.
5. Gerar mensagem WhatsApp (prefill) em 1ª pessoa citando resultado (nível/bloqueio/perfil/score/projeção).

---

## B) CONTRATO TÉCNICO — INPUT / OUTPUT

**Função:** `generateDiagnosis(input) -> output`

**INPUT:**
```ts
{
  meta: {
    objective: "captar"|"educar"|"reter"|"propagar"|"indicar",
    theme: { raw: string },
    area_profissional: "saude"|"profissional_liberal"|"vendas"|"wellness"|"geral",
    architecture: "RISK_DIAGNOSIS"|"BLOCKER_DIAGNOSIS"|"PROJECTION_CALCULATOR"|"PROFILE_TYPE"|"READINESS_CHECKLIST"
  },
  professional: { name?: string, whatsapp?: string },
  visitor_answers: Record<string, unknown>
}
```

**OUTPUT:**
```ts
{
  diagnosis: {
    title: string,
    explanation: string,
    evidence_bullets: string[],
    consequence: string,
    possibility: string,
    next_step: string,
    level?: "baixo"|"medio"|"alto",
    score?: number,
    profile_type?: string,
    blocker_type?: string,
    projection?: { min?: number, max?: number, unit?: string }
  },
  cta: {
    helper_text: string,
    button_text: string,
    whatsapp_prefill: string
  }
}
```

---

## C) TEMPLATES POR ARQUITETURA

Slots: `{THEME}`, `{LEVEL}`, `{BLOCKER}`, `{PROFILE}`, `{SCORE}`, `{NAME}`, `{DAYS}`, etc.

### RISK_DIAGNOSIS
- TITLE: "Seu padrão indica {LEVEL} risco em {THEME}" / "Sinais apontam {LEVEL} risco ligado a {THEME}"
- EXPLANATION: "Isso costuma acontecer quando sinais importantes se acumulam e ninguém ajusta a estratégia certa no que realmente influencia {THEME}."
- CONSEQUENCE: "Se isso continuar, é comum o problema ficar estável (ou piorar) mesmo com esforço isolado."
- POSSIBILITY: "A boa notícia: com ajustes direcionados e um plano coerente, dá para destravar progresso com segurança."
- CTA_HELPER: "Quer que eu olhe seu caso e te diga o primeiro passo?"
- CTA_BUTTON: "Quero analisar meu caso" / "Quero meu próximo passo"
- WHATSAPP_PREFILL: "Oi {NAME}, fiz o diagnóstico de {THEME} e apareceu risco {LEVEL}. Quero entender o que mais está pesando no meu caso e qual o primeiro passo."

### BLOCKER_DIAGNOSIS
- TITLE: "Seu principal bloqueio em {THEME} é: {BLOCKER}" / "O que mais te trava em {THEME} hoje é: {BLOCKER}"
- EXPLANATION: "Isso não é falta de vontade. É um padrão de rotina/decisão que cria atrito e quebra constância."
- CONSEQUENCE: "Se esse bloqueio continuar, você tende a repetir o ciclo: tentativa forte → quebra → frustração."
- POSSIBILITY: "A boa notícia: dá para ajustar com um passo simples e bem direcionado."
- CTA_HELPER: "Quer que eu te diga como ajustar esse bloqueio no seu contexto?"
- CTA_BUTTON: "Quero destravar isso" / "Quero ajustar meu bloqueio"
- WHATSAPP_PREFILL: "Oi {NAME}, meu diagnóstico em {THEME} apontou bloqueio {BLOCKER}. Quero uma orientação prática para ajustar isso no meu caso."

### PROJECTION_CALCULATOR
- TITLE: "Sua projeção realista para {THEME}" / "Cenário provável de {THEME} com base no que você informou"
- EXPLANATION: "Projeção funciona quando a meta respeita seu ponto de partida e a constância possível na sua rotina."
- CONSEQUENCE: "Se a meta estiver acima do realista, o mais comum é desistir cedo — por plano mal calibrado."
- POSSIBILITY: "A boa notícia: calibrando alvo e caminho, você aumenta muito a chance de consistência."
- CTA_HELPER: "Quer que eu monte seu próximo passo com base nessa projeção?"
- CTA_BUTTON: "Quero calibrar minha meta" / "Quero um plano com base nisso"
- WHATSAPP_PREFILL: "Oi {NAME}, vi minha projeção para {THEME}. Quero calibrar minha meta e entender o próximo passo mais realista."

### PROFILE_TYPE
- TITLE: "Seu perfil em {THEME} é: {PROFILE}" / "Seu estilo dominante em {THEME} é: {PROFILE}"
- EXPLANATION: "Seu resultado mostra forças e armadilhas típicas. O segredo é usar a força certa sem cair na armadilha do seu perfil."
- CONSEQUENCE: "Se você insistir num caminho que não combina com seu perfil, o resultado tende a ser inconsistente."
- POSSIBILITY: "A boa notícia: quando a estratégia combina com seu perfil, tudo fica mais leve e previsível."
- CTA_HELPER: "Quer que eu te diga o caminho ideal para o seu perfil?"
- CTA_BUTTON: "Quero o caminho do meu perfil" / "Quero aplicar isso agora"
- WHATSAPP_PREFILL: "Oi {NAME}, meu perfil em {THEME} deu {PROFILE}. Quero o caminho ideal para eu aplicar isso na prática."

### READINESS_CHECKLIST
- TITLE: "Seu nível de prontidão para {THEME}: {SCORE}/100" / "Checklist de prontidão para {THEME}: {SCORE}/100"
- EXPLANATION: "Prontidão não é motivação. É estrutura. Quando alguns pontos falham, o resultado fica instável mesmo com esforço."
- CONSEQUENCE: "Se você ignorar os pontos críticos, você corrige efeito e não a causa."
- POSSIBILITY: "A boa notícia: ajustando poucos pontos-chave, você melhora muito o resultado."
- CTA_HELPER: "Quer que eu revise seus pontos críticos e te diga por onde começar?"
- CTA_BUTTON: "Quero revisar meus pontos" / "Quero meu plano de ajuste"
- WHATSAPP_PREFILL: "Oi {NAME}, meu checklist de {THEME} deu {SCORE}/100 e surgiram pontos críticos. Você pode me orientar por onde começar?"

---

## D) REGRAS DE CÁLCULO (MVP)

**D0) Convenções:** visitor_answers é objeto livre; usar chaves canônicas quando existirem, fallback/defaults senão. Aceitar sinônimos (sintomas/symptoms, historico/history).

**D1) RISK_DIAGNOSIS → level**
- Entradas: symptoms (array), history_flags (array ou objeto), impact_level ("baixo"|"medio"|"alto" ou 0–10), attempts_count, age (opcional).
- risk_points: symptoms +1/item cap 6; history +2/item cap 6; impact baixo=0 medio=2 alto=4 (ou 0–3=0, 4–6=2, 7–10=4); attempts 0–1=0, 2–3=1, ≥4=2; age <30=0, 30–44=1, 45+=2.
- Total: 0–5→baixo, 6–10→medio, 11+→alto.
- Evidências: 2–3 bullets a partir do que existir (sinais, histórico, impacto, tentativas).

**D2) BLOCKER_DIAGNOSIS → blocker_type**
- Tipos: rotina, emocional, processo, habitos, expectativa.
- Entradas: barriers (array com palavras-chave), routine_consistency, emotional_triggers, process_clarity, habits_quality, goal_realism.
- Pontos por categoria (keywords em barriers + chaves diretas); blocker_type = categoria com maior pontuação; empate: rotina > processo > habitos > emocional > expectativa.
- Evidências: 2–3 bullets.

**D3) PROFILE_TYPE → profile_type**
- Perfis: consistente, 8ou80, ansioso, analitico, improvisador.
- Entradas: consistency, planning_style, emotion_level, decision_speed, follow_through (0–10 ou strings).
- Pontuar cada perfil por regras; escolher maior; empate: consistente > analitico > ansioso > 8ou80 > improvisador.
- Evidências: 2–3 bullets.

**D4) READINESS_CHECKLIST → score + gaps**
- checklist: array de {id, label, value}; value true/false ou "sim"/"nao" ou 1/0.
- score = (itens_true / total) * 100; top_gaps = até 3 itens com value false.
- Evidências: "Você marcou X/Y como sim"; "Pontos críticos: gap1, gap2, gap3".

**D5) PROJECTION_CALCULATOR → projection**
- Entradas: current_value, target_value, days (default 30), consistency_level.
- delta = target - current; consistency_factor (baixa=0.35, media=0.60, alta=0.85 ou 0–10→0.35/0.60/0.85); projection_reached = current + delta * factor; range min/max; warning se meta agressiva (dias curtos + delta grande ou consistência baixa + delta grande).
- Evidências: consistência, diferença, prazo.

**D6) Montagem final:** Preencher title, explanation, evidence_bullets, consequence, possibility com templates; next_step coerente (risco alto→avaliação; bloqueio rotina→rotina mínima; perfil analítico→plano com métrica; score baixo→top 3 gaps; calculadora warning→recalibrar). CTA: helper_text, button_text (um do template), whatsapp_prefill com NAME/THEME e resultado.
