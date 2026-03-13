# Arquitetura ideal do Noel no YLADA

**Objetivo:** Documentar a arquitetura interna do Noel (Router + 4 modos + Suporte), otimizada para modelos como GPT-4.1 Mini: **tirar inteligência do prompt e colocar no sistema** — tarefas simples, respostas consistentes. O usuário **sempre vê apenas "Noel"**.

**Data:** 12/03/2025

**Relacionado:** Prompt em 4 camadas e arquitetura completa em `docs/YLADA-ARQUITETURA-COMPLETA.md`. Memória e Knowledge Layer em `docs/YLADA-ARQUITETURA-COMPLETA.md` e migrations 261–263.

---

## 1. Visão geral (5 módulos + Suporte)

O Noel opera em **5 módulos internos**. O primeiro é o **Router** (decisor rápido); em seguida vêm Mentor, Criador, Executor e Analista. O profissional nunca vê os nomes dos módulos — vê uma única resposta do **Noel**.

```
NOEL (o que o usuário vê)
│
├── Router
├── Context Orchestrator   (seleciona qual contexto enviar; enxuto por intenção)
├── Prompt Layers (1–4)
├── Mentor | Criador | Executor | Analista
├── Memory Layer | Knowledge Layer
└── Response Pipeline
      └── Guardrails Validator  (valida template, tamanho, próxima ação → resposta final ou fallback)
```

*(Em canal de ajuda: Router detecta "suporte" → Noel Suporte responde → se problema complexo, escala para humano.)*

**Context Orchestration:** O orchestrator (`context-orchestrator.ts`) classifica a intenção refinada (estrategia, ferramenta, script, diagnostico, emocional, suporte) e escolhe quanto conhecimento incluir (`selectKnowledgeContext`). Assim o modelo recebe só o contexto relevante.  
**Guardrails:** `noel-guardrails.ts` valida a resposta (tamanho, “Próxima ação”, não genérica); se falhar, usa resposta de fallback.

---

## 2. Router (decisor rápido)

O **Router** é o primeiro passo interno: classifica o tipo da pergunta **antes** de qualquer resposta. Pode ser feito com prompt curto ou regras simples; o modelo não escreve resposta nessa etapa, só define o tipo.

| Exemplo de pergunta              | Tipo classificado |
|----------------------------------|-------------------|
| "Como gerar mais clientes?"      | estratégia        |
| "Como criar diagnóstico?"        | ferramenta        |
| "Me dá o link do quiz de energia"| script/link       |
| "Não consigo acessar minha conta"| suporte           |
| "Estou desanimado"               | emocional         |

Tipos usados no treino: **estratégia** | **ferramenta** | **script/link** | **emocional** | **suporte**. Em seguida, o modo apropriado (Mentor, Criador, Executor, Analista ou Suporte) é acionado.

---

## 3. Os 4 modos após o Router (já refletidos no treino)

### 1️⃣ Noel Mentor (cérebro estratégico)

- **Função:** Conversar com o profissional, orientar estratégia, posicionamento, conversas com clientes.
- **Faz:** Entender situação, sugerir diagnósticos, sugerir perguntas, explicar o método YLADA.
- **Filosofia:** diagnóstico → conversa → cliente.
- **Exemplo de fala:** "Talvez o problema não seja atrair mais pessoas, mas como suas conversas começam."

### 2️⃣ Noel Criador (arquiteto de diagnósticos)

- **Função:** Gerar perguntas, estrutura de diagnóstico, lógica de quiz, resultado, CTA.
- **Não conversa direto com o usuário:** é acionado mentalmente quando o Noel precisa *criar* conteúdo (ex.: "Quero um diagnóstico para atrair clientes de estética").
- **Usa:** biblioteca, templates, IA.

### 3️⃣ Noel Executor (operador do sistema)

- **Função:** Conectar com o sistema — buscar links, materiais, scripts, chamar funções.
- **Faz:** getFluxoInfo, getQuizInfo, getLinkInfo, getMaterialInfo, recomendarLinkWellness, etc.
- **Entrega:** links, scripts, ferramentas reais (nunca inventa).

### 4️⃣ Noel Analista (dados e padrões)

- **Função:** Orientar com base em dados reais (respostas de diagnósticos, leads, conversões).
- **Exemplos de fala:**
  - "Das últimas 120 respostas, 68% disseram que têm dificuldade em iniciar conversas."
  - "Seu diagnóstico está atraindo muitos curiosos e poucos interessados."
  - "Pessoas que respondem opção 3 convertem 3x mais."
- **Impacto:** IA deixa de ser só conselhos genéricos e vira inteligência do negócio (inteligência coletiva dos diagnósticos respondidos).

**Fluxo completo (após Router):**  
Usuário fala → **Router** classifica → **Mentor** interpreta → **Criador** gera diagnóstico (se necessário) → **Executor** busca links (se necessário) → **Analista** gera insights (se houver dados) → **Uma resposta final** para o usuário.

---

## 4. Por que essa arquitetura funciona bem com GPT-4.1 Mini

Modelos rápidos e baratos como GPT-4.1 Mini precisam de **tarefas simples e sistema previsível**. Evite:

- Prompts gigantes que obrigam o modelo a "pensar demais"
- Respostas sem estrutura, que variam muito de formato

Com Router + modos + **templates de resposta**:

- Cada passo tem uma responsabilidade clara
- As respostas seguem um formato (Diagnóstico rápido / Ajuste sugerido / Próxima ação), mantendo clareza e consistência
- O Noel deixa de parecer "chatbot" e passa a parecer **copiloto estratégico do profissional**

**Template de resposta** (já no prompt): usar quando fizer sentido a estrutura: *Diagnóstico rápido: {análise}. Ajuste sugerido: {orientação}. Próxima ação: {ação}.*

---

## 5. Ordem de implementação recomendada

1. **Mentor** — já reforçado com filosofia de conversa e princípio de "resposta boa".
2. **Criador** — quando houver geração de diagnósticos/quizzes pela IA; hoje parte já existe via biblioteca/templates.
3. **Executor** — já existe (funções, links, scripts no prompt).
4. **Analista** — exige dados (respostas de diagnósticos, eventos, leads); quando a API/banco expuser métricas e padrões, o prompt pode pedir ao Noel para usar esse modo.
5. **Suporte** — contexto separado (chat de ajuda): dúvidas técnicas, configuração, erros; com regra de escalonamento para humano (bug, pagamento, login, etc.).

---

## 6. Noel Suporte (chat de ajuda)

- **Contexto:** Chat de ajuda / suporte, **não** o Noel estratégico do app.
- **Noel Estratégico (app):** diagnósticos, estratégia, marketing, clientes, método YLADA.
- **Noel Suporte (ajuda):** dúvidas técnicas, funcionamento do sistema, configuração, erros.

**Fluxo ideal:**

1. Usuário pergunta no chat de ajuda.
2. **Router** detecta tipo = **suporte**.
3. Noel Suporte tenta resolver (ex.: "Como criar um diagnóstico?", "Onde vejo respostas?", "Como compartilhar link?").
4. Se detectar: bug, erro de pagamento, problema de login, problema técnico complexo → **escalar para humano**.

**Exemplo de resposta de suporte (não escalar):**  
Usuário: "Como criar diagnóstico?"  
Noel: "Você pode criar um diagnóstico em três passos: 1) Escolher o tema 2) Criar perguntas simples 3) Definir o resultado. Se quiser, posso sugerir um diagnóstico para sua área."

**Exemplo de escalonamento:**  
"Parece que isso precisa de suporte humano. Vou encaminhar para nossa equipe."

**Implementação sugerida:**  
- Prompt específico para o canal "ajuda" (Noel Suporte), com instruções de quando escalar.  
- Mesma identidade "Noel" para o usuário; apenas o system prompt do canal de ajuda muda.

---

## 7. Tabela diagnosis_insights (alimentar Noel Analista)

Para o **Noel Analista** gerar insights reais (inteligência coletiva dos diagnósticos), recomenda-se uma tabela que agregue respostas e conversões por diagnóstico.

**Schema sugerido:**

| Campo                | Tipo    | Descrição |
|----------------------|---------|-----------|
| diagnostic_id        | UUID    | ID do diagnóstico/quiz |
| answers_count        | INTEGER | Total de respostas |
| most_common_answer   | TEXT/JSONB | Resposta ou opção mais frequente |
| conversion_rate      | NUMERIC | Taxa de conversão (ex.: lead → cliente) |
| insight_text         | TEXT    | Texto de insight gerado (ex.: "68% disseram que não sabem iniciar conversas") |
| updated_at           | TIMESTAMP | Última atualização |

Essa tabela pode ser preenchida por job (agregação periódica) ou em tempo real ao processar respostas. O contexto do Noel recebe então um bloco tipo: "Para este diagnóstico: N respostas, insight principal: {insight_text}". Assim o Noel Analista consegue falar com base em dados reais.

---

## 8. O que já está no código (após as alterações de 12/03/2025)

- **Lousa 7 (`system-prompt-lousa7.ts`):**
  - Filosofia de conversa ("Boas respostas começam boas conversas"; diagnóstico → conversa → cliente).
  - **ROUTER** como primeiro passo: classificar tipo (estratégia | ferramenta | script/link | emocional | suporte).
  - **MODOS INTERNOS DO NOEL**: Router + Mentor, Criador, Executor, Analista (e Suporte em canal de ajuda).
- **Route Noel (`route.ts`):**
  - Princípio de resposta boa (clareza, próximo passo, conversa produtiva, ação + conversa + resultado).
  - **Template de resposta**: Diagnóstico rápido / Ajuste sugerido / Próxima ação (para respostas consistentes).
  - Estilo de conversa (mentor estratégico, curto, claro, acionável).
  - Diagnóstico como início de conversa (o que a pessoa percebe, que conversa gera, quando usar).
  - Perguntas do Noel (perguntas curtas para contexto).
  - Exemplo de resposta boa ("Como gerar mais clientes?").

---

## 9. Próximos passos sugeridos

- **Analista:** Implementar tabela **diagnosis_insights** (ou equivalente), job de agregação e injeção do bloco de insights no contexto do Noel. Reforçar no prompt: "Quando tiver dados de diagnósticos/leads, use o modo Analista."
- **Suporte:** Criar variante de system prompt para o chat de ajuda (Noel Suporte) e regras de escalonamento (palavras‑chave ou intenção → encaminhar para humano).
- **Criador:** Se houver geração dinâmica de diagnósticos pela IA, deixar explícito no fluxo quando "chamar" o modo Criador (estrutura de perguntas, resultado, CTA).

---

## 10. Resumo

| Módulo    | Responsabilidade           | Visível ao usuário |
|-----------|----------------------------|---------------------|
| Router    | Classificar tipo da pergunta | Não                 |
| Mentor    | Estratégia, conversa, método | Não (vê "Noel")    |
| Criador   | Diagnósticos, perguntas, CTA | Não                 |
| Executor  | Links, funções, materiais  | Não                 |
| Analista  | Dados, padrões, insights    | Não                 |
| Suporte   | Ajuda técnica, escalar     | Não (outro contexto)|

O usuário sempre vê apenas **Noel**. A separação em Router + modos é **arquitetura interna** para o modelo raciocinar melhor e para respostas mais consistentes (especialmente com modelos como GPT-4.1 Mini).

**Resultado desejado:** O Noel deixa de ser um chatbot e vira **copiloto estratégico do profissional** — com inteligência coletiva dos diagnósticos quando o Analista estiver alimentado por dados reais.
