# Arquitetura completa do YLADA

**Objetivo:** Documentar a visão integrada do sistema (6 camadas de produto, prompt em camadas, memória, knowledge layer) e o roteiro de implementação em fases. Alinhado a Supabase + Next.js + modelos leves (ex.: GPT-4.1 Mini).

**Data:** 12/03/2025

---

## 1. Visão geral: 6 camadas do YLADA

O YLADA não é só um app com IA; é um sistema com **6 motores conectados**.

```
YLADA
│
├── 1. Camada de Entrada
├── 2. Camada de Diagnóstico
├── 3. Camada de Conversa
├── 4. Camada de Inteligência Noel
├── 5. Camada de Dados e Memória
└── 6. Camada de Crescimento
```

| Camada | Função | Responde a |
|--------|--------|------------|
| **1. Entrada** | Páginas, links inteligentes, quizzes, diagnósticos, CTA (WhatsApp/conversa) | Como a pessoa entra no YLADA? |
| **2. Diagnóstico** | Biblioteca de diagnósticos, perguntas, lógica de resultado, CTA, segmentação, templates | O que acontece quando a pessoa responde? |
| **3. Conversa** | Diagnóstico vira conversa preparada, contexto para o profissional, qualificação do lead, relacionamento, decisão | Como o resultado vira oportunidade? |
| **4. Inteligência Noel** | Router, Mentor, Criador, Executor, Analista, Suporte | Como a IA ajuda o usuário a agir melhor? |
| **5. Dados e Memória** | Perfil do profissional, histórico de conversa, respostas dos diagnósticos, insights agregados | O que o sistema sabe sobre o profissional e os leads? |
| **6. Crescimento** | Analytics, conversão por diagnóstico, padrões, learning loop | Como o YLADA fica mais inteligente com o tempo? |

**Fluxo integrado:**  
Página/Link → Diagnóstico → Resultado → Conversa → Noel orienta → Dados salvos → Insights gerados → Sistema melhora.

---

## 2. Prompt do Noel em 4 camadas

Para modelos leves (ex.: GPT-4.1 Mini), o system prompt é montado em **4 camadas** no backend. Isso deixa o sistema mais estável, barato e previsível.

| Camada | Conteúdo | Tipo |
|--------|----------|------|
| **Layer 1 — Identidade** | Quem é o Noel; mentor estratégico YLADA; estilo claro e prático | Fixa |
| **Layer 2 — Filosofia** | Boas respostas começam boas conversas; Perguntas → Diagnóstico → Clareza → Conversa → Decisão | Fixa |
| **Layer 3 — Comportamento** | Router, modos, regras MLM, scripts, funções, templates de resposta | Fixa (regras) |
| **Layer 4 — Contexto / Tarefa** | Perfil do consultor, base de conhecimento, pergunta atual do usuário | Dinâmica |

**Montagem no backend:**

```ts
PROMPT_FINAL =
  buildIdentityLayer()      // Layer 1
  + buildPhilosophyLayer()   // Layer 2
  + behaviorLayer           // Layer 3 (Lousa 7 + Security + NOEL WELL)
  + buildContextLayer(...)  // Layer 4
// + mensagem do usuário (enviada como mensagem, não no system)
```

**Onde está no código:**  
- Layer 1 e 2: `src/lib/noel-wellness/prompt-layers.ts` (LAYER_1_IDENTITY, LAYER_2_PHILOSOPHY, buildContextLayer).  
- Layer 3: `src/app/api/wellness/noel/route.ts` (buildSystemPrompt monta Lousa 7 + Security + NOEL WELL).  
- Layer 4: buildContextLayer(consultantContext, strategicProfileContext, knowledgeContext, userMessage).

---

## 3. Memória do Noel (Supabase)

A memória faz o Noel parecer um mentor que **conhece** o profissional. Três tipos:

| Tipo | Tabela (sugerida) | Uso |
|------|-------------------|-----|
| **Memória de perfil** | `user_profile_memory` | Profissão, público, objetivo, nível, últimos temas — injetado no Layer 4 |
| **Memória de conversa** | `conversation_memory` ou histórico já existente | Últimas 5–10 mensagens para contexto curto |
| **Memória de insights** | `diagnosis_insights` | Respostas agregadas por diagnóstico; alimenta Noel Analista |

**Fluxo:**  
Usuário manda mensagem → buscar perfil → buscar histórico curto → buscar insights relevantes → montar Layer 4 → enviar para o modelo.

**Recomendação para GPT-4.1 Mini:** não enviar muita memória: perfil resumido, últimas 5 mensagens, 1 insight relevante. Mantém resposta rápida e custo baixo.

**Campos sugeridos — user_profile_memory:**  
user_id, profession, target_audience, main_goal, experience_level, preferred_strategy, created_diagnosis, last_topic, updated_at.

**Campos sugeridos — conversation_memory:**  
id, user_id, message_role, message_content, created_at.

---

## 4. Knowledge Layer

Base estruturada que o Noel **consulta** antes de responder. O conhecimento fica no sistema, não só no modelo.

| Bloco | Tabela (sugerida) | Uso |
|-------|-------------------|-----|
| **Biblioteca de diagnósticos** | `diagnosis_library` | segment, title, goal, questions, result_logic, cta, tags — quando Noel Criador precisa criar/adaptar diagnóstico |
| **Biblioteca de estratégias** | `strategy_library` | topic, problem, strategy, example, next_action — alimenta Noel Mentor |
| **Biblioteca de conversas** | `conversation_library` | scenario, user_question, good_answer, why_it_works — respostas boas que geram conversas boas |
| **Biblioteca de insights** | `market_insights` ou `diagnosis_insights` | segment, pattern, frequency, insight, recommended_action — alimenta Noel Analista |

**Fluxo:** Usuário pergunta → Router classifica → Sistema consulta Knowledge Layer → Seleciona informação relevante → Injeta no contexto (Layer 4) → Modelo gera resposta.

---

## 5. Estrutura ideal de banco (resumo)

Tabelas principais sugeridas para suportar produto + Noel + memória + conhecimento:

- users, user_profiles  
- **user_profile_memory** (memória de perfil para Noel)  
- **conversation_memory** (histórico curto por usuário)  
- diagnosis_library, diagnosis_sessions, diagnosis_answers, diagnosis_results  
- **diagnosis_insights** (já existe migration 260)  
- **strategy_library**, **conversation_library**, **market_insights** (knowledge layer)  
- support_topics (para Noel Suporte)

Podem ser adotadas em fases; MVP pode começar com menos tabelas.

---

## 6. MVP em 3 fases

| Fase | Foco | Entregas |
|------|------|----------|
| **Fase 1 — Base** | Funcionalidade mínima | Páginas, diagnósticos, Noel Mentor + Executor, biblioteca de diagnósticos, respostas salvas |
| **Fase 2 — Inteligência contextual** | Memória e roteamento | Memória do profissional, histórico recente, Noel Criador, roteamento melhor (Router + modos) |
| **Fase 3 — Inteligência do negócio** | Dados e aprendizado | Noel Analista, insights agregados (diagnosis_insights), suporte com escalonamento humano, learning loop do sistema |

---

## 7. Papel do Noel no sistema

O Noel não é o produto inteiro; é o **orquestrador inteligente** do produto.

- **Produto:** YLADA (entrada, diagnóstico, conversa, dados, crescimento).  
- **Noel:** ajuda o usuário a navegar, criar, entender, agir e melhorar.

Frase que resume a arquitetura:  
*Uma plataforma que transforma perguntas em clareza, clareza em conversa e conversa em resultado.*

---

## 8. O que já está no código (12/03/2025)

- **Prompt em camadas:** Layer 1 e 2 em `prompt-layers.ts`; Layer 3 em `route.ts`; Layer 4 montada com buildContextLayer (perfil, conhecimento, pergunta atual).
- **Noel:** Router, Mentor, Criador, Executor, Analista (e Suporte em doc); filosofia YLADA; templates de resposta.
- **diagnosis_insights:** migration 260 criada para Noel Analista.
- **Contexto:** consultantContext, strategicProfileContext, knowledgeContext já usados no Layer 4.

**Context Orchestration e Response Pipeline (implementados):**  
- **Context Orchestrator** (`src/lib/noel-wellness/context-orchestrator.ts`): classifica intenção refinada (estrategia | ferramenta | script | diagnostico | emocional | suporte), `buildNoelContext(userId, message, options)` para montar contexto enxuto, `selectKnowledgeContext(items, intent)` para limitar quanto conhecimento enviar por intenção. Integrado ao fallback do Noel (uso de `selectKnowledgeContext` e `intentForContext`).  
- **Guardrails** (`src/lib/noel-wellness/noel-guardrails.ts`): `validateNoelResponse(response)` verifica tamanho, presença de “Próxima ação” e evita respostas genéricas; em caso de falha usa `NOEL_FALLBACK_RESPONSE`. Validação aplicada em `generateAIResponse` e antes de retornar no fallback (resposta da base).  
- Fluxo: **Pergunta → Router → (Context Orchestrator seleciona contexto) → LLM → Guardrails Validator → Resposta final.**

**Migrations criadas (opcionais):**  
- `260-diagnosis-insights-noel-analista.sql` — insights agregados por diagnóstico (Noel Analista).  
- `261-noel-user-profile-memory.sql` — memória de perfil (profissão, público, objetivo, last_topic).  
- `262-noel-conversation-memory.sql` — últimas mensagens por usuário (contexto curto).  
- `263-noel-knowledge-layer-tables.sql` — noel_strategy_library, noel_conversation_library, noel_market_insights.

**Diagnóstico Vivo e tela de resultado para conversão:**  
Para que o diagnóstico pareça "inteligente" e não "quiz", usar a estrutura de **Diagnóstico Vivo** (leitura da situação, insight, caminho, convite) e a **tela em 5 blocos**: Resultado + Indicadores → Interpretação do Noel → Insight principal → Próximo passo → CTA (Conversar com o profissional). Sequência antes do resultado: "Analisando respostas…" / "Identificando padrões…" / "Gerando diagnóstico…". Ver **`docs/DIAGNOSTICO-VIVO-E-TELA-RESULTADO.md`**.

**Próximos passos sugeridos:**  
- Rodar as migrations e passar a persistir/ler noel_user_profile_memory e noel_conversation_memory; injetar no Layer 4.  
- Popular noel_strategy_library, noel_conversation_library e noel_market_insights.  
- Alimentar diagnosis_insights com job ou processo em tempo real.  
- Definir variante de prompt e fluxo para Noel Suporte (chat de ajuda).  
- Implementar tela de resultado em 5 blocos (Diagnóstico Vivo) nos fluxos de diagnóstico/quiz (PublicLinkView, resultado, wellness quiz).
