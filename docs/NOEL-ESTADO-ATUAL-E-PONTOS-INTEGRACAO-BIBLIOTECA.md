# Estado atual do sistema Noel e pontos de integração da biblioteca

Documento para alinhar com o ChatGPT (ou qualquer assistente) o que já existe e onde conectar a biblioteca. Evita retrabalho e deixa claro o Passo A (seed) e o Passo B (integrar no código).

**Mapa completo da arquitetura:** ver **`docs/NOEL-MAPA-COMPLETO-BIBLIOTECA.md`** (visão das 5 bibliotecas, fluxo do Noel e escala sugerida).

---

## 1. Fluxo atual do Noel (resumido)

```
POST /api/wellness/noel
  → requireApiAuth
  → classifyIntention(message) → module (mentor | suporte | tecnico)
  → classifyIntentForContext(message) → intent (estrategia | script | diagnostico | ferramenta | emocional | suporte)
  → analyzeQuery(message, module)
  → (opcional) processAutoLearning(message, module)
  → searchKnowledgeBase(message, module)  ← hoje a ÚNICA fonte de “conhecimento” estruturado
  → knowledgeResult.items + bestMatch + similarityScore
  → Decisão:
       - similarity >= 0.80 → resposta exata da base (knowledge_base)
       - 0.60–0.80 → fullContext = base + perfil → generateAIResponse (hybrid)
       - < 0.60 mas tem items → knowledgeContext = selectKnowledgeContext(items, intent) → generateAIResponse (hybrid)
       - < 0.60 sem items → fullContext = só HOM + perfil → generateAIResponse (ia_generated)
```

Ou seja: hoje o **knowledgeContext** que vai para o prompt vem **só** de:

- `searchKnowledgeBase` (embedding na base `ylada_biblioteca_itens` / conhecimento indexado)
- eventualmente 1 item do auto-learning

**Nenhum código lê** `noel_strategy_library` nem `noel_conversation_library`. As tabelas existem e estão vazias.

---

## 2. Onde o conhecimento entra no prompt

- Função: `buildSystemPrompt(module, knowledgeContext, consultantContext, strategicProfileContext, message)` (em `route.ts`).
- Dentro dela é chamado `buildContextLayer({ consultantContext, strategicProfileContext, knowledgeContext, userMessage })` (em `prompt-layers.ts`).
- O Layer 4 do prompt inclui um bloco **“Contexto da Base de Conhecimento”** quando `knowledgeContext` não é nulo.

Conclusão: para a biblioteca ser usada, precisamos **montar um `knowledgeContext` que inclua** (ou combine):

1. O que já vem de `searchKnowledgeBase` (mantido).
2. **Novo:** conteúdo de `noel_strategy_library` e `noel_conversation_library` conforme a intenção/cenário.

Ou seja: **Passo B** = buscar nessas duas tabelas e **concatenar** (ou priorizar) com o `knowledgeContext` atual antes de chamar `buildSystemPrompt` / `buildContextLayer`.

**Ajustes recomendados (busca e prioridade):**

- **Busca:** Não usar só `topic` fixo (ex.: `WHERE topic = 'gerar_clientes'`). Preferir busca por **similaridade textual** com a pergunta do usuário, ex.: `topic ILIKE '%termo%' OR problem ILIKE '%termo%' OR strategy ILIKE '%termo%'` (ou no futuro embedding). Assim o Noel encontra estratégias mesmo quando o termo não é exato.
- **Limite de contexto:** Nunca mandar tudo para o prompt. Usar no máximo **3 estratégias** e **2 conversas** por resposta. Mantém o prompt leve.
- **Ordem de prioridade do conhecimento:** 1) Biblioteca Noel (strategy_library + conversation_library); 2) knowledge_base (embedding); 3) IA pura. A biblioteca Noel representa o pensamento do sistema e deve ser consultada primeiro.

---

## 3. Tabelas envolvidas (formato exato para seed e integração)

### 3.1 `noel_strategy_library` (migration 263)

| Coluna        | Tipo    | Obrigatório |
|---------------|---------|-------------|
| id            | UUID    | PK, default gen_random_uuid() |
| topic         | TEXT    | SIM         |
| problem       | TEXT    | não         |
| strategy      | TEXT    | SIM         |
| example       | TEXT    | não         |
| next_action   | TEXT    | não         |
| created_at    | TIMESTAMPTZ | default now() |

- Índice: `idx_noel_strategy_library_topic` em `topic`.
- Uso na integração: buscar por **similaridade textual** com a mensagem (ex.: `topic ILIKE '%termo%' OR problem ILIKE '%termo%' OR strategy ILIKE '%termo%'`; no futuro embedding). Limitar a **3 linhas** por resposta.

### 3.2 `noel_conversation_library` (migration 263)

| Coluna        | Tipo    | Obrigatório |
|---------------|---------|-------------|
| id            | UUID    | PK, default gen_random_uuid() |
| scenario      | TEXT    | SIM         |
| user_question| TEXT    | SIM         |
| good_answer  | TEXT    | SIM         |
| why_it_works  | TEXT    | não         |
| created_at    | TIMESTAMPTZ | default now() |

- Índice: `idx_noel_conversation_library_scenario` em `scenario`.
- Uso na integração: buscar por `scenario` ou por similaridade com a pergunta do usuário. Limitar a **2 linhas** por resposta.

### 3.3 `diagnosis_insights` (migration 260)

| Coluna             | Tipo    | Obrigatório |
|--------------------|---------|-------------|
| id                 | UUID    | PK, default gen_random_uuid() |
| diagnostic_id      | UUID    | SIM         |
| answers_count      | INTEGER | SIM, default 0 |
| most_common_answer | TEXT    | não         |
| conversion_rate    | NUMERIC(5,4) | não  |
| insight_text       | TEXT    | não         |
| created_at         | TIMESTAMPTZ | default now() |
| updated_at         | TIMESTAMPTZ | default now() |

- **Observação:** No código atual, diagnósticos vivem em **config** (`ylada-diagnosticos.ts`) com **slug** (ex.: `comunicacao`). Não há tabela de diagnósticos com UUID no banco. Para o **primeiro pacote** (10 insights):
  - Ou se usa um **UUID fixo** “geral” (ex.: um único registro representando “insights gerais”) e os 10 insights podem ser 10 linhas com esse mesmo `diagnostic_id`, **ou**
  - Cria-se uma tabela mínima `diagnosis_profiles` (slug + id UUID) depois e aí os insights referenciam esse id. Para só “popular e usar texto”, um UUID fixo basta.
- Uso no Noel Analista: quando houver resultado de diagnóstico na sessão, buscar `diagnosis_insights` por `diagnostic_id` e injetar `insight_text` no contexto (isso pode ser fase seguinte).

---

## 4. Onde conectar no código (Passo B — sugestão objetiva)

- **Arquivo:** `src/app/api/wellness/noel/route.ts`.
- **Momento:** depois de ter `intentForContext` (e opcionalmente `module`), e **antes** de montar o `fullContext` / `knowledgeContext` que é passado para `generateAIResponse`.

**Pseudocódigo:**

1. Após `const intentForContext = classifyIntentForContext(message).intent` (e onde já se tem `knowledgeResult`).
2. Chamar uma função nova, por exemplo `getNoelLibraryContext(message, intentForContext)`:
   - Buscar em `noel_strategy_library` por **similaridade textual** com a mensagem (ILIKE em `topic`/`problem`/`strategy` ou futuramente embedding). **Limite 3** estratégias.
   - Buscar em `noel_conversation_library` por `scenario` ou similaridade com a pergunta. **Limite 2** conversas.
   - Retornar um único texto formatado, ex.:
     - “Estratégias relevantes:\n” + strategies.map(s => s.strategy).join("\n")
     - “Exemplos de conversa:\n” + conversations.map(c => `${c.user_question} → ${c.good_answer}`).join("\n")
3. No trecho onde hoje se monta `knowledgeContext` (ex.: linha ~2749–2760):
   - **Prioridade:** primeiro incluir o retorno de `getNoelLibraryContext` (biblioteca Noel); depois, se houver, o conteúdo de `knowledgeResult.items` (knowledge_base). Concatenar os dois quando ambos existirem; assim a biblioteca Noel tem prioridade sobre o embedding.
4. O resultado final continua sendo passado para `buildSystemPrompt` → `buildContextLayer` como `knowledgeContext`.

Assim, o Context Orchestrator (ou a rota) passa a “consultar a biblioteca” antes de responder, sem mudar a assinatura de `buildContextLayer` nem a estrutura do prompt.

---

## 5. Context Orchestrator (existente, ainda não usado na rota)

- **Arquivo:** `src/lib/noel-wellness/context-orchestrator.ts`.
- Já existe `buildNoelContext(userId, userMessage, options)` com opção `getKnowledge?(message, intent, module)`.
- Se implementarmos `getKnowledge` para fazer exatamente as queries acima (strategy_library + conversation_library) e a rota passar a usar `buildNoelContext` e usar o `knowledgeContext` retornado por ele (combinado com o da base), a integração fica centralizada no orchestrator. Caso contrário, pode-se fazer a busca das duas tabelas direto na rota e montar o texto; o efeito é o mesmo.

---

## 6. Resumo para o ChatGPT (ou para você)

| Item | Estado |
|------|--------|
| Tabelas `noel_strategy_library`, `noel_conversation_library` | Existem (migration 263), vazias. Formato acima. |
| Tabela `diagnosis_insights` | Existe (migration 260). Para seed inicial: pode usar um UUID fixo ou “geral”; foco em preencher `insight_text`. |
| Origem atual do conhecimento no Noel | Só `searchKnowledgeBase` (embedding) + auto-learning. Nenhuma leitura nas tabelas da biblioteca. |
| Onde injetar a biblioteca | Montar um bloco de contexto a partir de `noel_strategy_library` + `noel_conversation_library` e **concatenar** ao `knowledgeContext` antes de `buildSystemPrompt` / `buildContextLayer` (ou via `getKnowledge` no context orchestrator). |
| Diagnósticos (config) | Perfis em `src/config/ylada-diagnosticos.ts`. Campos sugeridos para enriquecer: `leitura_da_situacao`, `convite_para_conversa`, `indicadores`. Não é obrigatório para o primeiro pacote da biblioteca. |

Com isso, o “primeiro pacote” (20 estratégias + 20 conversas + 10 insights) pode ser gerado no formato exato das tabelas e inserido via seed; em seguida, a integração (Passo B) usa exatamente os pontos descritos aqui.

---

## 7. Ajustes incorporados (feedback Cláudio)

| Ajuste | Descrição |
|--------|-----------|
| **Busca por similaridade** | Não buscar só por `topic` fixo; usar ILIKE em topic/problem/strategy (ou embedding no futuro) para achar estratégias mesmo quando o termo não é exato. |
| **Limite de contexto** | Máximo 3 estratégias e 2 conversas por resposta; mantém o prompt leve. |
| **Prioridade** | 1) Biblioteca Noel → 2) knowledge_base (embedding) → 3) IA pura. A biblioteca representa o pensamento do sistema. |

**Observação sobre diagnosis_insights:** Para o seed inicial, usar um **UUID fixo** em `diagnostic_id` (ex.: `00000000-0000-0000-0000-000000000001`), pois no código os diagnósticos são identificados por slug em config; não há tabela de diagnósticos com UUID no banco. Depois pode-se criar `diagnosis_profiles` se quiser mapear slug → UUID.

---

## 8. Implementação (Passo B — concluída)

- **Função de contexto da biblioteca:** `src/lib/noel-wellness/noel-library-context.ts`
  - `getNoelLibraryContext(message)`: busca por similaridade (ILIKE) em `noel_strategy_library` (máx. 3) e `noel_conversation_library` (máx. 2), formata como "Estratégias relevantes" + "Exemplos de conversa".
- **Layer 4 (prompt):** `src/lib/noel-wellness/prompt-layers.ts`
  - Bloco **Contexto Estratégico do Noel** com protocolo (instruções de uso da biblioteca), regra de prioridade e reforço sobre diagnósticos. Parâmetros `noelLibraryContext` e `knowledgeBaseContext` (prioridade: biblioteca → base).
- **Rota:** `src/app/api/wellness/noel/route.ts`
  - No fallback híbrido: chama `getNoelLibraryContext(message)` e passa `noelLibraryContext` + `knowledgeBaseContext` para `generateAIResponse` / `buildSystemPrompt`.

---

## 9. Biblioteca de Perfis Estratégicos de Profissionais

Objetivo: o Noel reconhece em que fase o profissional está antes de orientar (interpretar diagnósticos, orientar estratégia, personalizar respostas).

- **Config:** `src/config/noel-strategic-profiles.ts`
  - 10 perfis: agenda_vazia, muitos_curiosos, dificuldade_conversa, sem_posicionamento, dependente_indicacao, seguidores_passivos, explica_demais, em_crescimento, baixa_conversao, sem_estrategia.
  - Cada perfil: profile_code, profile_title, description, main_blocker, strategic_focus, recommended_action.
  - `PROFILE_KEYWORDS`: palavras-chave por perfil para matching.
- **Matcher:** `src/lib/noel-wellness/strategic-profile-matcher.ts`
  - `getStrategicProfileForMessage(message)`: retorna o perfil que melhor corresponde à mensagem (por palavras-chave).
  - `formatStrategicProfileForPrompt(profile)`: formata o perfil para o Layer 4.
- **Layer 4:** bloco "Perfil estratégico identificado" quando `detectedStrategicProfileText` está preenchido; instrução para o Noel usar esse perfil para personalizar (reconhecer a situação e orientar com foco e ação recomendada).
- **Rota:** no fallback, chama `getStrategicProfileForMessage(message)` e `formatStrategicProfileForPrompt(profile)` e passa `detectedStrategicProfileText` para `generateAIResponse` / `buildSystemPrompt`.

Fluxo: pergunta → Noel identifica perfil provável → carrega perfil → usa estratégias + conversas → orientação personalizada.

**Próxima evolução:** biblioteca de perfis por profissão (ex.: perfil_nutricionista_iniciante, perfil_esteticista_em_crescimento) para o Noel parecer especialista por área.
