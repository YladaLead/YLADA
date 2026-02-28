# Análise do prompt — Camada de decisão (perfil → arquitetura) + temas sensíveis

**Objetivo:** Verificar se o prompt do Sérgio está alinhado ao código atual e se a implementação é viável.

---

## 1. O que o prompt acerta

### Problema descrito
- **Captação comercial** (médico quer captar pacientes) foi misturada com **avaliação clínica** (“baixo risco em tizerpatide”).
- Isso gera: confusão estratégica, experiência incoerente e **risco regulatório** (parecer laudo/triagem médica automatizada).

### Causa técnica (confirmada no código)
- **`getStrategies`** (`src/lib/ylada/strategies.ts`): para `area === 'saude'` e `objetivo === 'captar'` retorna sempre:
  - qualidade = `diagnostico_risco` (RISK_DIAGNOSIS)
  - volume = `diagnostico_bloqueio` (BLOCKER_DIAGNOSIS)
- **Não há uso do tema** na decisão. “Tizerpatide” entra só como texto em `interpretacao.tema` e vira `theme_raw` no config.
- O usuário escolhe “Raio-X de Saúde” → flow_id = diagnostico_risco → arquitetura RISK_DIAGNOSIS.
- No diagnóstico, **`diagnosis-engine.ts`** usa `theme = meta.theme?.raw ?? 'seu objetivo'` e preenche o slot `{THEME}` nos templates.
- **`diagnosis-templates.ts`** (RISK): título = `"Seu padrão indica {LEVEL} risco em {THEME}"` → sai “Seu padrão indica baixo risco em tizerpatide”.

Ou seja: o fluxo está **tecnicamente certo** (motor + tema), mas **conceitualmente errado** para tema sensível (medicamento). O prompt descreve isso de forma correta.

---

## 2. Onde encaixar a camada de decisão

| Onde | Hoje | O que o prompt pede |
|------|------|----------------------|
| Escolha das 2 estratégias (cards) | `getStrategies(objetivo, area, tema?, tipo_publico)` ignora tema | Usar `classifyTheme(tema)`; se tema sensível + captar → **não** retornar diagnostico_risco como qualidade; retornar BLOCKER ou ENGAGEMENT. |
| Título do link / página | `flow.display_name + " — " + themeRaw` | Se safetyMode: título com **tema genérico** (ex.: “Mapa de Interesse — emagrecimento assistido”), não nome do medicamento. |
| Texto do resultado (diagnóstico) | `slots.THEME = theme_raw` (literal) | Se safetyMode: `THEME` = rótulo genérico; nunca “risco em [medicamento]”; adicionar disclaimer. |
| Persistência | `config_json.meta` tem flow_id, architecture, theme_raw | Incluir `safety_mode?: boolean` e opcionalmente `theme_display` (tema seguro para exibição). |

Nada disso exige redesenhar “por profissão”: a decisão continua por **objetivo + área + tema** (e, se quiser, perfil), com regras explícitas para tema sensível.

---

## 3. Viabilidade técnica

### A) `classifyTheme(theme_raw: string)`
- **Viável.** Novo módulo (ex.: `src/lib/ylada/theme-classification.ts`).
- Lista de keywords (pt/en) para medicamentos/substâncias + termos (“injeção”, “caneta”, “prescrição”, etc.).
- Retorno: `{ isSensitiveMedical, isHealthGeneric, keywords }` (e o que mais fizer sentido).

### B) Decisão de arquitetura (equivalente ao `chooseArchitecture` do prompt)
- **Opção 1 (mínima):** Alterar **`getStrategies`** para receber `tema` e usar `classifyTheme(tema)`. Se `objetivo === 'captar'` e `isSensitiveMedical` → trocar qualidade de `diagnostico_risco` para `diagnostico_bloqueio` (ou para um novo fluxo ENGAGEMENT quando existir).
- **Opção 2 (mais explícita):** Novo `chooseArchitecture({ profile, objective, theme_raw })` que retorna `{ architecture, uiLabel, copyHint, safetyMode }`; a UI e o generate usam isso em vez de “só” flow_id escolhido pelo usuário (ou em conjunto com ele).

Ambas são viáveis. A Opção 1 resolve o caso “tizerpatide” sem nova arquitetura.

### C) Nova arquitetura ENGAGEMENT_DIAGNOSIS
- **Viável**, mas é mais trabalho: novos tipos, entrada no catálogo, no motor (calc + templates), na API de diagnóstico e no front.
- Para **MVP**, dá para evitar: usar apenas **BLOCKER_DIAGNOSIS** quando tema sensível + captar, com **safetyMode** (tema genérico + disclaimer). BLOCKER já fala de “bloqueio”, não de “risco em medicamento”.

### D) Título e textos com safetyMode
- **Generate** (`/api/ylada/links/generate`): se a decisão indicar safetyMode (ou se classifyTheme(theme_raw) for sensível e flow for RISK), definir `pageTitle` com tema genérico (ex.: “Mapa de Interesse — emagrecimento assistido”) e gravar `meta.safety_mode = true` e opcionalmente `meta.theme_display`.
- **Diagnosis API** (`/api/ylada/links/[slug]/diagnosis`): ao montar o input do motor, se `meta.safety_mode` ou tema classificado como sensível, passar **theme para exibição** = genérico (não o theme_raw com nome do medicamento).
- **diagnosis-engine**: receber `theme_display` opcional; se existir, usar para preencher `THEME` nos templates; quando safetyMode, concatenar disclaimer curto no `profile_summary` (ou em campo dedicado no contrato de resposta).

Nenhuma dessas mudanças quebra o fluxo atual nem as migrations/métricas; só condiciona título, texto e disclaimer ao tema sensível.

---

## 4. Critérios de aceite do prompt (checagem)

| Critério | Como atender |
|----------|----------------|
| “captar pacientes para tizerpatide” **não** pode gerar “baixo risco em tizerpatide” | getStrategies não oferecer Raio-X de Saúde (RISK) quando tema for sensível **ou** generate/diagnosis usar tema genérico + safetyMode quando flow for RISK e tema sensível. Preferível **não oferecer** RISK nesse caso. |
| Deve escolher ENGAGEMENT ou BLOCKER com safetyMode | Para MVP: oferecer BLOCKER como qualidade quando tema sensível + captar; ao gerar link com BLOCKER e tema sensível, setar safetyMode e tema_display genérico. |
| Título genérico (ex.: “emagrecimento assistido”) | generate usa tema genérico no pageTitle quando safetyMode; diagnosis usa theme_display nos slots. |
| Disclaimer curto | Incluir no resultado do diagnóstico (ex.: no profile_summary ou campo `disclaimer`) quando safetyMode. |
| “captar pessoas para melhorar energia e hábitos” pode oferecer Raio-X de Saúde e Estratégia | classifyTheme retorna não sensível → getStrategies continua retornando diagnostico_risco + diagnostico_bloqueio. |
| Não quebrar fluxo/migrations/metrics | Só novas funções + condicionais; meta ganha campos opcionais (safety_mode, theme_display). |

Todos os critérios são atendíveis com o código atual.

---

## 5. Conclusão

- O prompt **está correto** em relação ao código: identifica a mistura captação vs avaliação clínica e o risco de “risco em [medicamento]”.
- A **camada de decisão** (classificar tema + decidir arquitetura/segurança) encaixa-se de forma clara:
  - em **getStrategies** (ou em um `chooseArchitecture` que a UI chame),
  - no **generate** (título + meta),
  - na **API de diagnosis** (input do motor com theme_display/safetyMode),
  - e no **diagnosis-engine** (slots THEME + disclaimer).
- **Recomendação:** Implementar em dois passos:
  1. **MVP:** `classifyTheme` + ajuste em `getStrategies` (tema sensível + captar → não oferecer diagnostico_risco; oferecer BLOCKER em qualidade ou volume) + safetyMode no generate/diagnosis (tema genérico + disclaimer). Sem nova arquitetura.
  2. **Depois:** Se quiser fluxo dedicado “Mapa de Interesse” com perguntas/copy específicos, aí sim introduzir ENGAGEMENT_DIAGNOSIS e mapear no catálogo.

Assim o sistema deixa de gerar “baixo risco em tizerpatide” e passa a se comportar como “motor de atração estratégica”, não como “gerador de laudo automático”, mantendo a decisão baseada em perfil/objetivo/tema, sem redesenho manual por profissão.
