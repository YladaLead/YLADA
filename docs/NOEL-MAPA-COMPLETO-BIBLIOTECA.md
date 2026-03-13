# Mapa Completo da Biblioteca do Noel (Arquitetura Viva)

Referência única da arquitetura das bibliotecas do Noel. Evita bagunça quando houver dezenas de diagnósticos, dezenas de perfis e centenas de estratégias/conversas.

---

## Visão geral: 5 bibliotecas que alimentam o Noel

```
DIAGNÓSTICOS (config)     → perfis do resultado do quiz
        ↓
PERFIS ESTRATÉGICOS      → quem é o profissional (situação estratégica)
        ↓
ESTRATÉGIAS (tabela)     → o que fazer
        ↓
CONVERSAS (tabela)       → como falar
        ↓
INTELIGÊNCIA COLETIVA (tabela)  → o que o mercado mostra
```

Todas alimentam o **knowledgeContext** (e blocos do Layer 4) antes do `buildSystemPrompt` → resposta do Noel.

---

## 1️⃣ Biblioteca de Diagnósticos (já existe)

| Item | Onde | Uso |
|------|------|-----|
| **Origem** | `src/config/ylada-diagnosticos.ts` | Config por slug (ex.: comunicacao, agenda) |
| **Por diagnóstico** | perfis, insight, caminho, porQueAcontece | Resultado do quiz → tela de resultado; pode enriquecer com leitura_da_situacao, convite_para_conversa, indicadores |
| **Papel** | Porta de entrada para o Noel | Perfis do diagnóstico (ex.: curiosos, em_desenvolvimento, clientes) podem mapear para **perfil estratégico** |

**Exemplo:** diagnóstico `comunicacao` → perfis: curiosos, em_desenvolvimento, clientes. O perfil “curiosos” traduz para o perfil estratégico `muitos_curiosos`.

---

## 2️⃣ Biblioteca de Perfis Estratégicos (implementada)

| Item | Onde | Uso |
|------|------|-----|
| **Origem** | `src/config/noel-strategic-profiles.ts` | 10 perfis em config (sem tabela por enquanto) |
| **Matcher** | `src/lib/noel-wellness/strategic-profile-matcher.ts` | `getStrategicProfileForMessage(message)` → perfil que melhor corresponde |
| **Por perfil** | profile_code, profile_title, description, main_blocker, strategic_focus, recommended_action | Layer 4: bloco “Perfil estratégico identificado” |
| **Papel** | **Quem é o profissional** antes de orientar | Traduz diagnóstico/sintoma em situação estratégica (ex.: curiosos → muitos_curiosos; poucos contatos → agenda_vazia) |

**Exemplo:** perfil_estrategico `agenda_vazia` → poucos contatos → precisa gerar conversas → estratégia: diagnósticos como porta de entrada.

**Escala sugerida:** ~20 perfis principais (hoje 10).

---

## 3️⃣ Biblioteca Estratégica do Noel (tabela + integrada)

| Item | Onde | Uso |
|------|------|-----|
| **Origem** | Tabela `noel_strategy_library` (migration 263) | topic, problem, strategy, example, next_action |
| **Busca** | `src/lib/noel-wellness/noel-library-context.ts` → `getNoelLibraryContext(message)` | ILIKE na mensagem (topic/problem/strategy); limite 3 por resposta |
| **Papel** | **O que fazer** | Estratégias práticas (ex.: “usar diagnósticos como porta de entrada”) |

**Exemplo:** topic `gerar_clientes` → strategy: usar diagnósticos curtos para iniciar conversas; example: "descubra o que pode estar travando seus resultados".

**Escala sugerida:** ~50 estratégias (hoje 20 no seed 265).

---

## 4️⃣ Biblioteca de Conversas (tabela + integrada)

| Item | Onde | Uso |
|------|------|-----|
| **Origem** | Tabela `noel_conversation_library` (migration 263) | scenario, user_question, good_answer, why_it_works |
| **Busca** | Mesmo `getNoelLibraryContext(message)` | ILIKE (scenario/user_question/good_answer); limite 2 por resposta |
| **Papel** | **Como falar** | Respostas para situações reais (ex.: cliente pergunta preço → “antes de falar de valores…”) |

**Exemplo:** scenario `cliente pergunta preço` → good_answer: "antes de falar de valores posso entender melhor sua situação?"

**Escala sugerida:** ~100 cenários (hoje 20 no seed 265). Essa camada já cobre **situações de mercado** (cliente pede desconto, compara, some, etc.).

---

## 5️⃣ Biblioteca de Inteligência Coletiva (tabela)

| Item | Onde | Uso |
|------|------|-----|
| **Origem** | Tabela `diagnosis_insights` (migration 260) | diagnostic_id, answers_count, most_common_answer, conversion_rate, insight_text |
| **Uso atual** | Seed 265 (10 insights com UUID fixo) | Noel Analista: frases tipo “X% dos profissionais…” |
| **Papel** | **O que o mercado mostra** | Padrões de comportamento; aumenta autoridade |

**Exemplo:** insight_text: "muitos profissionais conseguem gerar interesse inicial mas têm dificuldade em transformar conversas em clientes".

**Integração atual (Noel Analista):** tabela consultada por `getDiagnosisInsightsContext(diagnosticId)` em `src/lib/noel-wellness/diagnosis-insights-context.ts`. Quando `intent === 'diagnostico'` ou a mensagem menciona diagnóstico (ex.: "meu diagnóstico deu curiosos"), os insights são buscados (até 3, ordenados por conversion_rate) e injetados no Layer 4 como "Insights observados em diagnósticos semelhantes". O request pode enviar `diagnosticId` (UUID); se não enviar, usa-se `FALLBACK_DIAGNOSTIC_ID_INSIGHTS` (seed 265).

---

## Fluxo completo do Noel (após integração)

Ordem: **perfil primeiro**, depois biblioteca (estratégias filtradas por perfil quando há match).

```
mensagem do profissional
    ↓
classifyIntention(message)  →  module (mentor | suporte | tecnico)
classifyIntentForContext(message)  →  intent (estrategia | script | diagnostico | …)
    ↓
identificar perfil(is) estratégico(s)  →  getStrategicProfilesForMessage(message)  →  top 2 perfis, com pesos por palavra-chave
    ↓
buscar estratégias + conversas  →  getNoelLibraryContext(message, profileCodes)  →  estratégias preferidas por topic do perfil; noelLibraryContext (3 estratégias + 2 conversas)
    ↓
(opcional) buscar insights coletivos  →  quando intent = diagnostico ou mensagem menciona diagnóstico: getDiagnosisInsightsContext(diagnosticId)  →  diagnosisInsightsText (até 3 insights)
    ↓
buscar base de conhecimento  →  searchKnowledgeBase(message)  →  knowledgeBaseContext
    ↓
montar Layer 4  →  buildContextLayer({
  strategicProfileContext,      // perfil do consultor (DB)
  detectedStrategicProfileText, // perfil da biblioteca (config)
  noelLibraryContext,           // estratégias + conversas
  diagnosisInsightsText,        // insights coletivos (quando contexto de diagnóstico)
  knowledgeBaseContext          // embedding / ylada_biblioteca_itens
})
    ↓
buildSystemPrompt  →  resposta Noel
```

---

## Exemplo real

**Pergunta:** “Como gerar mais clientes?”

| Passo | Resultado |
|-------|-----------|
| intent | estrategia |
| perfil provável | agenda_vazia (se a mensagem tiver palavras-chave) |
| estratégias | topic gerar_clientes, iniciar_conversa, etc. (até 3) |
| conversas | cenários relevantes (até 2) |
| contexto | Layer 4 com perfil + estratégias + exemplos de conversa |

**Resposta (estilo):** “Uma das estratégias mais eficientes para gerar clientes é usar diagnósticos curtos para iniciar conversas…”

---

## O que isso cria no YLADA

Um sistema que combina:

- **IA** (modelo)
- **biblioteca estratégica** (o que fazer)
- **biblioteca de conversas** (como falar)
- **perfis estratégicos** (quem é o profissional)
- **inteligência coletiva** (o que o mercado mostra)

O Noel passa a ter **perfil + estratégia + linguagem**.

---

## Organização e escala (evitar bagunça)

| Biblioteca | Escala sugerida | Estado atual |
|------------|-----------------|--------------|
| Diagnósticos | ~200 diagnósticos | Config (slugs); perfis por diagnóstico |
| Perfis estratégicos | ~20 perfis principais | 10 perfis em config |
| Estratégias | ~50 estratégias | 20 (seed 265) |
| Conversas | ~100 cenários | 20 (seed 265) |
| Insights | por diagnóstico | 10 iniciais (UUID fixo) |

---

## Próximas evoluções

1. **Biblioteca de Situações de Mercado**  
   Já coberta pela **Biblioteca de Conversas** (scenarios: cliente pede desconto, compara, some, etc.). Ampliar com mais cenários e, se quiser, tags (ex.: objeção_preço, objeção_tempo).

2. **Perfis por profissão**  
   Ex.: perfil_nutricionista_iniciante, perfil_esteticista_em_crescimento. Adicionar campo opcional (ex.: segment ou profession) nos perfis estratégicos e filtrar no matcher.

3. **Diagnóstico → Perfil estratégico**  
   Mapeamento explícito: resultado do quiz (perfil do diagnóstico, ex.: curiosos) → perfil estratégico (muitos_curiosos). Hoje o matcher usa só a mensagem; pode-se enriquecer com o último resultado de diagnóstico do usuário.

4. **Uso de diagnosis_insights no fluxo**  
   Quando houver diagnóstico na sessão, buscar insights por diagnostic_id e injetar no Layer 4 (Noel Analista).

---

## Ajustes feitos (feedback ChatGPT)

| Ajuste | Implementação |
|--------|----------------|
| **Ordem: perfil antes da biblioteca** | Na rota: primeiro `getStrategicProfilesForMessage(message)` (top 2), depois `getNoelLibraryContext(message, profileCodes)`. Estratégias passam a ser filtradas por `PROFILE_STRATEGY_TOPICS` quando há perfil detectado. |
| **Pesos por palavra-chave** | `PROFILE_KEYWORDS_WEIGHTED` em config: cada keyword tem `weight` (ex.: "agenda vazia" 3, "poucos clientes" 2). Matcher soma pesos. |
| **Top 2 perfis** | `getStrategicProfilesForMessage` retorna até 2 perfis; `formatStrategicProfileForPrompt` aceita array e formata [Perfil 1] / [Perfil 2] no prompt. |
| **Biblioteca Noel integrada** | `getNoelLibraryContext` é chamada na rota (fallback híbrido); consulta `noel_strategy_library` e `noel_conversation_library` e injeta no Layer 4. Já estava integrado antes deste ajuste. |
| **diagnosis_insights** | Integrado: `getDiagnosisInsightsContext(diagnosticId)`; Layer 4 recebe `diagnosisInsightsText` quando intent = diagnostico ou mensagem menciona diagnóstico. |

---

## Referências técnicas

| O quê | Onde |
|-------|------|
| Estado atual + pontos de integração | `docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md` |
| Seed Pacote 1 (20+20+10) | `migrations/265-noel-library-seed-pacote1.sql` |
| Config diagnósticos | `src/config/ylada-diagnosticos.ts` |
| Config perfis estratégicos | `src/config/noel-strategic-profiles.ts` |
| Contexto da biblioteca (estratégias + conversas) | `src/lib/noel-wellness/noel-library-context.ts` |
| Contexto de insights coletivos (Noel Analista) | `src/lib/noel-wellness/diagnosis-insights-context.ts` |
| Matcher de perfil estratégico | `src/lib/noel-wellness/strategic-profile-matcher.ts` (top 2 perfis, pesos por palavra-chave; perfil → topics em config) |
| Layer 4 (prompt) | `src/lib/noel-wellness/prompt-layers.ts` |
| Rota Noel (fallback) | `src/app/api/wellness/noel/route.ts` |
