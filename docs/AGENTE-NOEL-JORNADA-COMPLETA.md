# Agente Noel — Jornada completa (especificação)

**Objetivo:** Especificar o agente que testa **todas** as etapas e capacidades do Noel: criar link (quiz e calculadora), proporcionar edição (pela conversa e pela UI), orientar pessoas e direcionar quando alguém não acha algo (biblioteca, calculadora, links). O agente percorre a jornada real do usuário com o Noel e valida cada capacidade.

**Referências:** `docs/AGENTE-NOEL-ESPECIFICACAO.md`, `docs/COBERTURA-AGENTE-TESTE-INTERNO-DUDA.md` (seção 2), `docs/NOEL-RESPOSTAS-TESTE-INTERNO.md`.

---

## 1. Escopo do que o Noel proporciona (o que o agente cobre)

| Capacidade | O que é | O que o agente valida |
|------------|---------|------------------------|
| **Criar link (quiz)** | Usuário pede diagnóstico/quiz; Noel chama interpret + generate; devolve quiz (perguntas) + link clicável + lastLinkContext. | Resposta contém perguntas + link; botões "Editar perguntas" e "Abrir link" e "Ver meus links" aparecem quando aplicável. |
| **Criar link (calculadora)** | Usuário pede calculadora; interpret pode devolver flow_id calculadora_projecao; generate cria link tipo calculator. | Resposta menciona "calculadora" e entrega link; ou Noel orienta onde achar/criar. |
| **Edição pela conversa** | Usuário pede ajuste ("troca a pergunta 2", "muda o foco"); API detecta isIntencaoAjustarLink, chama interpret (ajuste) + generate; devolve novo lastLinkContext. | Resposta traz link/perguntas atualizados; lastLinkContext atualizado. |
| **Edição pela UI** | Após criar link, o front exibe "Editar perguntas" → leva a `/{área}/links/editar/{link_id}`. | Clicar no botão abre a página de edição do link; URL contém link_id. |
| **Orientação** | Próximo passo, organizar semana, estratégia por área, script WhatsApp, método de condução (20/80, primeira mensagem, contato frio). | Resposta com ação clara, alinhada à área; script completo quando pedido. |
| **Direcionar quando não acha** | "Onde está a biblioteca?", "Não acho onde criar diagnóstico", "Cadê a calculadora?" | Noel indica menu/página (Biblioteca, Links) ou "crie aqui no chat comigo" / "pedindo aqui com o tema". |
| **Link do último / links ativos** | Lista [LINKS ATIVOS] injetada no contexto; primeiro = mais recente. | Ao pedir "link do último diagnóstico", resposta tem link real. Se lista vazia, Noel orienta criar em "Links" ou pedir aqui. |

---

## 2. Pré-requisitos do agente

- **Conta:** Uma conta de teste com **perfil completo** (ex.: `node scripts/criar-contas-teste-interno.js` rodado; `teste-estetica@teste.ylada.com` = estética).
- **Área:** Definir área (ex.: estética) para validar personalização e paths (`/pt/estetica/...`).
- **Ambiente:** App rodando (ex.: localhost); agente consegue abrir home, enviar mensagens ao Noel e (se fizer UI) clicar em botões.

---

## 3. Jornada em etapas (ordem sugerida)

O agente executa na ordem abaixo. Cada etapa tem **entrada** (o que fazer), **resultado esperado** e **critério de falha**.

### Etapa 0 — Acesso ao Noel

| Entrada | Resultado esperado | Falha se |
|---------|--------------------|----------|
| Abrir home da área (ex.: /pt/estetica/home). | Página carrega; existe campo de chat (textarea/input) e botão de enviar. | Campo não existe ou não envia. |
| Enviar uma mensagem qualquer (ex.: "Oi"). | Resposta do Noel aparece no corpo da página (não loading infinito). | Timeout; resposta não aparece. |

### Etapa 1 — Perfil incompleto (opcional)

| Entrada | Resultado esperado | Falha se |
|---------|--------------------|----------|
| Usar conta **sem** perfil completo; enviar "Qual meu próximo passo?". | Resposta única tipo "Complete seu perfil empresarial (nome, telefone e tipo de atuação)..." e CTA "Completar perfil empresarial". | Resposta personalizada com links/estratégia. |

### Etapa 2 — Orientação geral (perfil completo)

| Entrada | Resultado esperado | Falha se |
|---------|--------------------|----------|
| "Qual meu próximo passo?" | Ação clara em 24h; se houver links ativos, pelo menos um link real na resposta. | Mesma resposta de "complete o perfil"; nenhuma ação concreta. |
| "Como organizar minha semana para atrair mais leads?" | Resposta curta (3–5 tópicos); "próxima ação em 24h" presente. | Só "complete o perfil"; resposta vazia. |
| "Sou da área de estética. O que você me recomenda para começar?" | Conteúdo específico (pele, autocuidado, captação); sugestão de link/diagnóstico quando fizer sentido. | Resposta genérica sem menção à área. |

### Etapa 3 — Link do último diagnóstico / links ativos

| Entrada | Resultado esperado | Falha se |
|---------|--------------------|----------|
| "Me dá o link do último diagnóstico que criei para eu compartilhar." | Se houver links: nome + URL clicável + frase de uso. Se não houver: orientação para criar em "Links" ou pedir aqui com o tema. | "Não tenho acesso"; "copie da plataforma"; resposta igual à de perfil incompleto. |

### Etapa 4 — Noel criando link (quiz)

| Entrada | Resultado esperado | Falha se |
|---------|--------------------|----------|
| "Quero criar um diagnóstico para atrair clientes de estética" (ou sugestão da área). | Resposta com: (1) texto tipo "Preparei um diagnóstico com N perguntas"; (2) perguntas (ex.: 1. ... A) B) C) D)); (3) link clicável; (4) oferta de ajuste. | Sem link; sem perguntas; só "complete o perfil". |
| Verificar UI após a resposta. | Botões visíveis: "Editar perguntas", "Abrir link", "Ver meus links" (quando lastLinkContext preenchido e resposta contém conteúdo de quiz). | Botões não aparecem quando a resposta trouxe link gerado. |

### Etapa 5 — Noel criando link (calculadora)

| Entrada | Resultado esperado | Falha se |
|---------|--------------------|----------|
| "Quero uma calculadora para mostrar projeção de resultados" (ou tema que leve a calculadora_projecao). | Resposta que mencione "calculadora" e traga link, ou oriente onde achar/criar calculadora. | Resposta ignora pedido; só quiz; erro. |

### Etapa 6 — Edição pela conversa

| Entrada | Resultado esperado | Falha se |
|---------|--------------------|----------|
| Após ter criado um link (etapa 4), enviar: "Ajusta a pergunta 2 para falar de skincare" ou "Muda o foco para manchas". | Resposta com link/perguntas atualizados (novo lastLinkContext); confirmação do que mudou. | Resposta sem link atualizado; erro; "não posso editar". |

### Etapa 7 — Edição pela UI (botão Editar perguntas)

| Entrada | Resultado esperado | Falha se |
|---------|--------------------|----------|
| Clicar no botão "Editar perguntas" (ex.: após etapa 4). | Navega para `/{área}/links/editar/{link_id}`; página de edição do link carrega. | 404; página em branco; link_id ausente na URL. |

### Etapa 8 — Direcionamento: "não estou achando"

| Entrada | Resultado esperado | Falha se |
|---------|--------------------|----------|
| "Onde está a biblioteca?" ou "Não acho onde ver os diagnósticos." | Noel indica menu "Biblioteca" ou caminho tipo /pt/{área}/biblioteca ou "Links" conforme o que a pessoa procura. | Resposta que não menciona onde ir; "não sei". |
| "Cadê a calculadora?" ou "Onde tem calculadora?" | Noel orienta (ex.: criar aqui no chat, ou Biblioteca, ou página de Links/calculadoras). | Ignora; não direciona. |
| "Onde crio um novo diagnóstico?" | Indicação: "Links" / "Biblioteca" / ou "pode pedir aqui com o tema". | Sem indicação clara. |

### Etapa 9 — Script e link para uso (WhatsApp / post)

| Entrada | Resultado esperado | Falha se |
|---------|--------------------|----------|
| "Preciso de um script para enviar no WhatsApp. Pode me dar um?" | Script completo na resposta (não "quer que eu te envie?"). | Só oferta sem script; "complete o perfil" como única resposta. |
| "Pode gerar um link para eu usar no post ou no Instagram?" | Link completo + sugestão de uso (e, se o sistema gerar, lastLinkContext com link). | Sem link; só promessa. |

### Etapa 10 — Ver meus links / Biblioteca

| Entrada | Resultado esperado | Falha se |
|---------|--------------------|----------|
| Clicar em "Ver meus links" (após criar link). | Navega para `/{área}/links`; listagem ou mensagem coerente. | 404; página quebrada. |
| "Qual o melhor diagnóstico para começar a conversar?" (com links ativos). | Lista 1–2 links com nome + URL e quando usar. Sem links: sugere criar ou pedir tema. | Não usa lista quando existe; não sugere criar quando lista vazia. |

---

## 4. Checklist de mensagens (o que o agente envia, em ordem)

O agente pode usar esta sequência de mensagens, uma por etapa (ajustar conforme pular etapa 1):

1. (Opcional) "Qual meu próximo passo?" — com perfil incompleto.
2. "Qual meu próximo passo?"
3. "Como organizar minha semana para atrair mais leads?"
4. "Sou da área de estética. O que você me recomenda para começar?"
5. "Me dá o link do último diagnóstico que criei para eu compartilhar."
6. "Quero criar um diagnóstico para atrair clientes de estética."
7. (Verificar UI: Editar / Abrir link / Ver meus links.)
8. "Quero uma calculadora para mostrar projeção de resultados."
9. "Ajusta a pergunta 2 para falar de skincare." (ou similar, após passo 6.)
10. (Clicar "Editar perguntas" e validar URL.)
11. "Onde está a biblioteca?"
12. "Cadê a calculadora?"
13. "Preciso de um script para enviar no WhatsApp. Pode me dar um?"
14. "Pode gerar um link para eu usar no post ou no Instagram?"
15. (Clicar "Ver meus links".)
16. "Qual o melhor diagnóstico para começar a conversar com cliente?"

---

## 5. Critérios de falha consolidados

O agente marca **falha** quando:

- Todas as respostas iguais (ex.: só "complete o perfil") com perfil completo.
- Pedido explícito de link/script e resposta sem link nem script (ou "quer que eu te envie?", "copie da plataforma", "não tenho acesso").
- Pedido de "link do último diagnóstico" sem usar a lista de links ativos (quando existir).
- Pedido de criar quiz/calculadora sem resultado (sem link, sem perguntas, sem direcionamento).
- Após criar link, botões "Editar perguntas" / "Abrir link" / "Ver meus links" não aparecem quando a resposta contém quiz + link.
- "Editar perguntas" não leva a `/{área}/links/editar/{link_id}`.
- Perguntas "onde está a biblioteca?", "cadê a calculadora?", "onde crio diagnóstico?" sem indicação clara de onde ir.
- Pedido de ajuste na conversa ("ajusta a pergunta 2") sem link/perguntas atualizados.
- Timeout ou erro de rede sem retry configurado.
- Área específica (ex.: estética) e resposta sem nenhum contexto da área.

---

## 6. Saída do agente (relatório)

O agente deve produzir um relatório com:

- **Cabeçalho:** data, conta usada, área, ambiente (ex.: localhost).
- **Por etapa:** número da etapa, nome, entrada enviada (ou ação de UI), resultado (resumo da resposta ou página), **status** (ok / falha / atenção), observação em uma linha.
- **Resumo:** total de etapas, quantas ok/falha/atenção; conclusão "Noel (jornada completa) comportando conforme especificação: sim/não".
- **Detalhes opcionais:** trecho da resposta onde apareceu link; trecho onde deveria ter direcionamento e não teve; URL da página de edição.

Exemplo de linha de etapa:

`Etapa 4 | Noel criando link (quiz) | "Quero criar um diagnóstico para atrair clientes de estética" | ok | Resposta trouxe 4 perguntas + link + botões Editar/Abrir/Ver meus links.`

---

## 7. O que o agente precisa ter (implementação)

Para implementar o agente que percorre esta jornada:

1. **Autenticação:** Login com conta de teste (perfil completo) e manutenção de sessão/cookies para as requisições ao Noel e às páginas da área.
2. **Chamadas à API do Noel:** POST `/api/ylada/noel` com `message`, `conversationHistory`, `area`, e (quando aplicável) `lastLinkContext`; interpretar `response` e `lastLinkContext` da resposta.
3. **Orquestração de conversa:** Manter histórico (conversationHistory) entre mensagens; passar lastLinkContext retornado na mensagem seguinte quando a API devolver.
4. **UI (se o agente fizer E2E):** Abrir home, preencher campo de chat, enviar, ler resposta; detectar presença de link/botões na resposta; clicar em "Editar perguntas" e "Ver meus links" e validar URL/página.
5. **Regras de sucesso/falha:** Aplicar os critérios da seção 5 por etapa; marcar status ok/falha/atenção.
6. **Relatório:** Gerar o formato da seção 6 (arquivo markdown ou JSON).

Referência de agente existente: `scripts/agents/ylada-interno.ts` (pode ser estendido ou usado como base para este fluxo focado no Noel).

---

## 8. Resumo em uma frase

O agente **percorre todas as etapas do Noel** (acesso, orientação, link do último, criar quiz, criar calculadora, editar na conversa, editar na UI, direcionar à biblioteca/calculadora/links, script, ver meus links) **com perfil completo**, **valida resposta e UI em cada passo** e **gera relatório** com status por etapa e conclusão sobre se o Noel está proporcionando tudo o que foi especificado aqui e nos docs referenciados.
