# Noel como motor central — Brief para Cláudio (Epic)

Objetivo: **reajustar o Noel (ex-LYA) para ser o motor único de todas as áreas**, começando pela validação no Nutri, com modelo **4.1-mini**, sem perder a qualidade estratégica.

---

## 1. Onde o Noel/LYA está hoje no código

| Área   | API principal              | System prompt / libs                                      | Modelo atual   |
|--------|----------------------------|-----------------------------------------------------------|----------------|
| **Nutri**  | `POST /api/nutri/lya/route.ts` | Prompt longo inline em `route.ts`; `src/lib/nutri/lya-prompts.ts` (fases, baseMessages); `analise/route.ts` e `analise-v2/route.ts` com prompt LYA completo (identidade + lógica + formato fixo) | gpt-4o-mini    |
| **Wellness** | `POST /api/wellness/noel/route.ts` | `src/lib/noel-wellness/system-prompt-lousa7.ts` (LOUSA7 + segurança); `buildSystemPrompt()` com módulo + knowledge + consultant + perfil | (verificar)    |
| **YLADA/Matriz** | `POST /api/ylada/noel/route.ts` | `SEGMENT_CONTEXT` por segmento; injeta `ylada_noel_profile` + `user_strategy_snapshot` | (verificar)    |
| **Vendas (Noel Vendedor)** | `api/wellness/noel/sales-support/route.ts` | `src/lib/noel-vendedor/system-prompt.ts` (buildNoelVendedorSystemPrompt) | —              |

**Problemas atuais (especialmente para 4.1-mini):**

- Prompts muito longos e declarativos.
- Identidade, lógica condicional (IF/ELSE) e regras de formatação no mesmo bloco.
- Redundâncias e repetição de regras (“nunca oriente tudo” em vários lugares).
- Variáveis de contexto às vezes em texto livre em vez de bloco estruturado.
- Vários system prompts espalhados (lya/route, lya/analise, lya/analise-v2, wellness/noel, noel-wellness, ylada/noel).

---

## 2. Visão alvo: Noel como motor central

- **Uma identidade:** Noel = treinador de execução do Sistema de Conversas Ativas (não “chat genérico”).
- **Por área:** mesmo Noel, contexto diferente (Nutri: diagnóstico, jornada, desafio 7 dias, meta semanal; Wellness: consultor, links, fluxos; depois: Coach, médicos, etc.).
- **Backend prepara a decisão:** prioridade, “próximo passo sugerido” e métricas (ex.: 0/5 conversas) vêm do backend quando possível; o modelo formata e humaniza, não decide sozinho entre muitas regras.
- **Primeira mensagem acionável:** em vez de “Como posso ajudar?”, menu fixo tipo: “1) Ativar conversa  2) Ajustar link  3) Responder leads  4) Fechar consulta” (Nutri); equivalente por área.
- **Formato de resposta obrigatório:** curto e rígido (ex.: Foco prioritário → Ação (1–3 itens) → Onde aplicar → Métrica de sucesso), para 4.1-mini obedecer melhor.

---

## 3. O que pedir ao Cláudio (auditoria e reestruturação)

Enviar algo neste espírito (pode colar e adaptar):

---

**Assunto: Auditoria e reestruturação do Noel/LYA para 4.1-mini e motor central**

Estamos migrando a mentora interna (Noel, ex-LYA) para **GPT-4.1-mini** e unificando ela como **motor central** de todas as áreas (Nutri primeiro, depois Wellness, Coach, etc.).

Hoje existem **múltiplos system prompts** (Nutri: `api/nutri/lya/route.ts`, `analise/route.ts`, `analise-v2/route.ts`, `lib/nutri/lya-prompts.ts`; Wellness: `lib/noel-wellness/system-prompt-lousa7.ts`, `api/wellness/noel/route.ts`; YLADA: `api/ylada/noel/route.ts`).

Preciso de uma **auditoria estrutural** com os seguintes entregáveis:

1. **Mapeamento**
   - Listar todos os arquivos/rotas que montam system prompt para Noel/LYA.
   - Identificar redundâncias, conflitos e regras duplicadas entre eles.

2. **Separação clara**
   - **Identidade fixa:** quem é o Noel, missão em 1 frase, tom de voz (treinador de execução, direto, sem blablá). Sem IF/ELSE aqui.
   - **Lógica condicional:** regras do tipo “SE jornada não iniciada → Dia 1” devem sair do prompt e virar **instrução dinâmica** ou **contexto estruturado** enviado pelo backend (ex.: “Prioridade atual: Conduzir Dia 1”).
   - **Formatação:** estrutura obrigatória da resposta (ex.: 4 blocos fixos). Instrução explícita: “Se a resposta não seguir exatamente essa estrutura, está incorreta.”

3. **Otimização para 4.1-mini**
   - Reduzir texto: bullets curtos, sem repetição.
   - Uma “regra central” inequívoca (ex.: “Sempre 1 próximo passo.”).
   - Variáveis enviadas como **bloco estruturado**:
     ```
     === CONTEXTO ===
     Diagnóstico: {json}
     Perfil: {json}
     Sistema (jornada, meta semanal, desafio 7 dias): {json}
     Memória/RAG: {texto}
     Tarefa: {texto}
     === FIM ===
     ```
   - Avaliar se parte da decisão (ex.: “qual próximo passo”) deve ser calculada no backend e só o texto final gerado pelo modelo.

4. **Integração com Desafio 7 dias e meta semanal**
   - O Noel deve **receber** meta semanal e progresso (ex.: 0/5 conversas) no contexto.
   - Primeira mensagem ou sugestões devem puxar para “ativar conversa hoje” e para a meta (ex.: “Você está 0/5. Vamos ativar a primeira?”).
   - Não inventar números; usar só os que o backend enviar.

5. **Risco e validação**
   - Apontar risco de quebra de formato e de respostas longas demais.
   - Propor 5–10 cenários de teste (ex.: usuário sem jornada, com 3/5 conversas, pedindo script) e critério de sucesso: formato sempre respeitado, 1 próximo passo claro.

6. **Recomendação**
   - Responder: “Você recomendaria mover parte da lógica condicional para o backend em vez de deixar no prompt? Se sim, quais decisões?”

Critérios de sucesso: **clareza**, **estabilidade de resposta**, **menor ambiguidade**, **menor custo de token**, **maior previsibilidade**. Foco em **arquitetura de decisão**, não só em “melhorar o texto”.

---

## 4. Ordem sugerida de execução

1. **Nutri:** unificar em uma base “Noel Nutri” (identidade + formato fixo), contexto estruturado com diagnóstico, perfil, jornada, **meta semanal e desafio 7 dias**, e primeira mensagem com menu 1–4. Validar com 4.1-mini.
2. **Wellness:** alinhar ao mesmo padrão (identidade compartilhada, contexto Wellness), reaproveitando o que fizer sentido do LOUSA7 sem carregar todo o peso no prompt.
3. **YLADA/Matriz:** `api/ylada/noel` já usa segmento + perfil + snapshot; evoluir para receber o mesmo tipo de “instrução dinâmica” e formato fixo, para ser o mesmo motor com outro contexto.

---

## 5. Sobre abrir outro chat

Sim. **Vale a pena abrir um chat dedicado** para:

- Implementar a nova arquitetura (separar identidade, criar bloco de contexto estruturado, trocar para 4.1-mini onde fizer sentido).
- Alterar a primeira mensagem do Noel no Nutri (menu 1–4) e conectar com meta semanal / desafio 7 dias.
- Ajustar Wellness e YLADA na mesma linha.

Use este doc como **brief de contexto** nesse chat e referencie os arquivos acima para o assistente navegar no código.

---

## 6. Decisão estratégica: 7 dias vs depois (produto)

**Pergunta decisiva:** O Nutri é um sistema simples que escala ou um método profundo tipo curso completo?

**Decisão recomendada:** Sistema simples que escala, com sprint inicial.

| Conceito | Definição |
|----------|-----------|
| **7 dias** | **Fase de ativação** — tirar do zero, primeiras conversas, provar que o sistema funciona. Não é fase permanente nem “jornada 30 dias em miniatura”. |
| **Depois dos 7 dias** | **Modo crescimento contínuo** — rotina semanal: definir meta → ativar → qualificar → fechar → ajustar. Sem “jornada 30 dias” pesada como eixo do Noel. |
| **Jornada 30 dias** | Pode existir como **trilha de formação opcional** (conteúdo, dias 1–30). O Noel **não** deve ter como prioridade máxima “Dia 1 da Jornada”; a prioridade é **meta semanal + próximo passo de conversas**. |

**Como provocar permanência:** métrica visível (ex.: X/5 conversas esta semana), meta semanal, sensação de progresso — não mais conteúdo nem trilha obrigatória.

**Risco se não definir:** Noel fica dividido entre Jornada, Desafio, Pilar, GSAL, Rotina e confunde tanto o modelo quanto a usuária.

---

## 7. Por onde começar (com o que já temos)

**Já existe no código:**

- **Meta semanal:** `user_profiles.meta_conversas_semana`; API `GET /api/nutri/painel/stats` retorna `metaSemanal`, `conversasEsteMes`, `leadsHoje`. Painel: `ConversasAtivasBlock`.
- **Jornada 30 dias:** `journey_progress`, `journey_days`; LYA usa em `route.ts`, `analise`, `analise-v2` (dia atual, disciplina 1–3). Não confundir com “Desafio 7 dias”.
- **Desafio 7 dias no código:** hoje é ferramenta/oferta (scripts, diagnósticos, slugs) para a *paciente*; no produto Nutri ainda não existe “fase de ativação 7 dias” como estado (ex.: “dia 2 do desafio de ativação”).

**O que falta pouco:**

- **Conversas nesta semana:** a API de stats não retorna “conversas esta semana” (só `conversasEsteMes`, `leadsHoje`). Para o Noel dizer “Você está 0/5”, o backend precisa expor algo como `conversasEstaSemana` (mesma lógica de `link_events` por semana).
- **Primeira mensagem do Noel:** hoje não é menu 1–4; é conversa livre. Trocar para menu acionável (1–4) + contexto com meta e progresso.

**Ordem sugerida (sem montar coisa que não vai ser usada):**

1. **Definir em 1 frase no produto:** “7 dias = ativação; depois = rotina semanal.” Documentar e alinhar com o brief do Noel.
2. **Noel Nutri — contexto estruturado:** na chamada ao Noel, injetar bloco com `meta_semanal`, `conversas_esta_semana` (adicionar em `GET /api/nutri/painel/stats` ou em contexto dedicado). Backend calcula; Noel só formata e humaniza.
3. **Primeira mensagem:** menu fixo 1–4 (Ativar conversa / Ajustar link / Responder leads / Fechar consulta) e, quando houver número, puxar para a meta (ex.: “Você está 0/5. Vamos ativar a primeira?”).
4. **Identidade + formato:** separar identidade (quem é o Noel, 1 frase) da lógica; lógica condicional como instrução dinâmica do backend; formato de resposta fixo (4 blocos). Migrar para 4.1-mini onde fizer sentido.
5. **Jornada 30 dias:** não remover do produto; desacoplar do *eixo* do Noel. Noel prioriza Sistema de Conversas Ativas (meta semanal, próximo passo); jornada pode ser “trilha disponível” sem IF/ELSE pesado no prompt.
6. **“Modo Crescimento” após 7 dias:** não implementar trilha nova agora. Apenas deixar claro no prompt/contexto: “Após a fase de ativação, o foco é rotina semanal (meta, ativar, qualificar, fechar).” Se no futuro existir “dia 1 a 7 da ativação” como estado, o backend envia; o Noel só reage ao contexto.

Assim o Noel é montado já alinhado à decisão (sistema simples, 7 dias = ativação, depois = rotina) e evita duplicar lógica ou construir modos que ainda não estão definidos.

---

## 8. Nova conta vs adaptar o prompt atual (ferramenta de prompts)

**Recomendação: criar um novo prompt “Noel Oficial” (nova versão/app), não sobrescrever o atual.**

- **Por quê:** o LYA que está aí hoje é o que está em produção. Se você alterar direto, perde referência e pode quebrar o comportamento atual. Com um “Noel Oficial” separado você:
  - testa o novo formato (identidade curta + contexto estruturado + formato fixo) sem afetar o chat real;
  - compara lado a lado (LYA atual vs Noel Oficial);
  - quando validar, troca a app/código para usar o Noel Oficial e, se quiser, desativa o antigo.
- **Na ferramenta (tipo ChatGPT Apps / Prompt builder):** criar novo app ou nova versão chamada “Noel Oficial — Nutri” com as variáveis `diagnostico`, `perfil`, `sistema`, `rag`, `task`. O prompt que você colou pode ser a base, mas já na versão “enxuta” (identidade + formato fixo; lógica vindo em `sistema`/`task`).

---

## 9. Passo a passo para implantação

### Fase A — Na ferramenta de prompts (onde você está hoje)

| # | Ação | Detalhe |
|---|------|--------|
| A1 | Criar novo prompt/app “Noel Oficial — Nutri” | Não editar o “LYA — Prompt Mestre” atual. Duplicar ou criar do zero. |
| A2 | Reduzir o system prompt a 3 blocos | (1) **Identidade** — 2–3 frases: quem é Noel, missão, tom. (2) **Formato fixo** — os 4 itens (Foco → Ação → Onde aplicar → Métrica). (3) **Variáveis** — explicar que receberá `{{diagnostico}}`, `{{perfil}}`, `{{sistema}}`, `{{rag}}`, `{{task}}` e deve usar só isso. |
| A3 | Tirar a lógica IF/ELSE do prompt | Em vez de “SE jornada não iniciada → Dia 1” no texto, o backend vai mandar em `sistema` ou `task` algo como: `prioridade_atual: "Conduzir Dia 1 da Jornada"` ou `proximo_passo: "Iniciar Dia 1"`. O modelo só formata e humaniza. |
| A4 | Definir primeira mensagem (menu) | No fluxo da app, se for possível definir “mensagem inicial”, usar: “1) Ativar conversa  2) Ajustar link  3) Responder leads  4) Fechar consulta”. Se não der na ferramenta, fica para o código (Fase B). |
| A5 | Testar com 4.1-mini | Trocar modelo para 4.1-mini e testar com valores fixos em `diagnostico`, `perfil`, `sistema`, `rag`, `task`. Validar: resposta sempre no formato de 4 blocos; 1 próximo passo claro. |
| A6 | Cenários de teste | Ex.: (1) jornada não iniciada, (2) 0/5 conversas, (3) 3/5 conversas, (4) pedindo script, (5) perfil iniciante vs avançada. Critério: formato respeitado, sem inventar números. |

### Fase B — No código (ylada-app)

| # | Ação | Onde / o quê |
|---|------|----------------|
| B1 | Expor “conversas esta semana” | Em `GET /api/nutri/painel/stats`: calcular e retornar `conversasEstaSemana` (ex.: contagem de `link_events` com `event_type` whatsapp_click/lead_capture na semana atual). Usar para “X/meta” no Noel. |
| B2 | Montar bloco de contexto estruturado para o Noel | Na rota que chama o Noel (ex.: `POST /api/nutri/lya/route.ts` ou uma nova `POST /api/nutri/noel/route.ts`): buscar diagnóstico, perfil, jornada (opcional), **meta semanal + conversas esta semana**; montar um único bloco tipo `=== CONTEXTO === ... === FIM ===` com JSON/texto e passar como `sistema` (ou variável equivalente). |
| B3 | Calcular “prioridade” / “próximo passo” no backend | Em vez de o modelo decidir entre muitas regras, o backend define 1 campo, ex.: `prioridade_atual` ou `proximo_passo_sugerido` (ex.: “Conduzir Dia 1” ou “Ativar primeira conversa — você está 0/5”). Injetar em `sistema` ou `task`. |
| B4 | Integrar com o “Noel Oficial” da ferramenta | Se a ferramenta expõe API (OpenAI Assistants, Custom GPT, etc.): no código, chamar esse assistant/prompt com as variáveis preenchidas. Se o prompt ficar só no código: criar `src/lib/noel-nutri/system-prompt.ts` (identidade + formato fixo) e montar a mensagem com o bloco de contexto; usar modelo 4.1-mini. |
| B5 | Primeira mensagem no chat (menu 1–4) | No front (ex.: `NutriChatWidget` ou componente que abre o Noel): se não há histórico, mostrar a mensagem inicial com menu 1–4 e, quando houver `metaSemanal` e `conversasEstaSemana`, incluir frase tipo “Você está X/Y. Vamos ativar a primeira?”. |
| B6 | Trocar chamada LYA por Noel (quando validado) | Após testes: fazer a rota principal do chat Nutri usar o novo fluxo (Noel Oficial + contexto estruturado). Manter a rota/assistant antigo desativado ou em fallback por um tempo. |

### Ordem sugerida de execução

1. **A1 → A2 → A3** (criar Noel Oficial na ferramenta e deixar prompt enxuto).
2. **A4 → A5 → A6** (definir primeira mensagem, testar modelo e cenários).
3. **B1** (conversas esta semana na API).
4. **B2 + B3** (montar contexto e prioridade no backend).
5. **B4** (integrar código com Noel Oficial).
6. **B5** (menu 1–4 no front).
7. **B6** (trocar produção para Noel quando estável).

Assim você não quebra o LYA atual, valida o Noel Oficial na ferramenta e depois implanta no app em etapas claras.

---

## 10. Ajustes pós-teste (regra disciplinadora + captação)

**Decisão de produto:** Noel = **sistema disciplinador** (opção A). Quando atrás da meta, prioridade é sempre captação; ordem importa (captação gera receita, agenda organiza).

### Regras implementadas em `src/lib/noel-nutri/build-context.ts`

| Regra | Comportamento |
|-------|----------------|
| **Disciplinador** | Se `conversas_esta_semana < meta_semanal` → prioridade = captação (ativar primeira / mais N conversas), **exceto** quando intenção = conversão e há leads pendentes (mantém script de fechamento). Assim “O que fazer hoje?” com 0/5 vira “Ativar primeira conversa”, não “Organizar agenda”. |
| **Quiz antes de Calculadora** | `links_ativos` é ordenado por tipo: quiz → calculadora → ferramenta → agenda → jornada. Para captação/emagrecimento o modelo tende a sugerir Quiz primeiro. |

Implementação: `calcularPrioridade()` aplica a checagem “atrás da meta” antes do switch por intenção; `prioridadeCaptacao(estado)` centraliza o texto. Ordenação dos links após montar o array com `ordemTipo`.

### 10.1 Ajustes pré–soft launch (4 itens — obrigatório antes de vender)

| # | Ajuste | Regra / implementação |
|---|--------|------------------------|
| 1 | **Base URL (nunca localhost em prod)** | `getBaseUrl()`: `NEXT_PUBLIC_SITE_URL` → `NEXT_PUBLIC_APP_URL` → se `NODE_ENV === 'production'` usa `https://www.ylada.com`, senão `http://localhost:3000`. Em prod nunca entregar URL com localhost. |
| 2 | **Exceção lookup de link** | Se a pergunta for explícita de "qual é meu link X?" (`isLookupDeLink(message)`), não aplicar disciplinador: prioridade = "Entregar o link solicitado; sugerir enviar para 1 pessoa". Contexto envia `lookup_de_link: true`. Resposta direta com o link, mantendo os 4 blocos. |
| 3 | **Ranking por objetivo (tags)** | Cada item em `links_ativos` pode ter `tags: string[]` (emagrecimento, água, hidratação, proteína, etc.). Backend deriva tags do `template_slug` e do título do quiz. Se intenção captação e a pergunta contém palavra-chave (emagrecimento, água, etc.), ordenar links com tag correspondente primeiro; depois por tipo (quiz → calculadora). Assim "link para emagrecimento" → quiz; "link água" → calculadora de água. |
| 4 | **Contrato de output (4 blocos sempre)** | Mesmo para pergunta simples de link ("qual meu link do quiz?"), o Noel responde nos 4 blocos: FOCO = Enviar o link certo; AÇÃO = Enviar [Nome](URL) para 1 pessoa; ONDE = [Nome](URL); MÉTRICA = 1 resposta em 24–72h. No prompt: "Quando lookup_de_link for true, use os 4 blocos de forma curta; nunca saia do formato." |
