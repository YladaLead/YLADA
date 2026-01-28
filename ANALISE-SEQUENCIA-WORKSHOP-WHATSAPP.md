# Análise: sequência equivocada no fluxo Workshop + WhatsApp

**Caso:** Edilene Monte – inscrição no workshop, primeira interação no WhatsApp e respostas "Ok" gerando mensagens duplicadas e nome errado.

**Pedido:** Revisão assertiva do fluxo; identificar causas em todas as áreas; **não alterar código** nesta etapa.

---

## 1. O que aconteceu (linha do tempo)

1. **Mensagem 1 (Form Automation):**  
   "Olá **edilenenutri10@gmail.com**, seja bem-vindo! 👋 ... Teremos aula na próxima terça-feira, 27/01/2026. **Opção 1: terça 18:00, Opção 2: quarta 12:00**. Qual você prefere? 💚"

2. **Mensagem 2 (Cliente):**  
   "Acabei de me inscrever na aula prática da YLADA NUTRI e gostaria de agendar"

3. **Mensagem 3 (Carol):**  
   "Oi **Ylada Nutri**, tudo bem? 😊 Seja muito bem-vinda! ... **Opção 1: Terça 15:00, Opção 2: Quarta 09:00**. Qual você prefere? 😊"

4. **Mensagem 4 (Cliente):** "1"

5. **Mensagem 5 (Sistema):** "Perfeito! Você vai adorar essa aula!" + link (Terça 15:00).

6. **Mensagem 6 (Cliente):** "Ok"

7. **Mensagem 7 (Carol):** De novo boas-vindas + opções ("Oi Ylada Nutri..." + só Opção 1).

8. **Mensagem 8 (Cliente):** "Ok"

9. **Mensagem 9 (Carol):** Repetição de novo da mesma boas-vindas + opções.

---

## 2. Problemas identificados

### 2.1 Nome errado na mensagem do formulário ("edilenenutri10@gmail.com")

- **Onde:** `sendWorkshopInviteToFormLead(phone, leadName, ...)` em `whatsapp-form-automation.ts`. O texto usa `leadName` na saudação.
- **Origem do valor:** Quem chama a automação passa `leadName`:
  - Inscrição workshop: `/api/nutri/workshop/inscricao` → `sanitizedData.nome` (body `nome`).
- **Conclusão:** O valor que chega como "nome" na inscrição é o e-mail. Isso pode ser:
  - Formulário da landing (workshop/workshop-agenda-instavel) enviando o campo errado como `nome`, ou
  - Usuária tendo preenchido o e-mail no campo "Nome", ou
  - Outro ponto de entrada (ex.: formulário público) mapeando para "name" o campo que na verdade é e-mail.
- **Arquivos a revisar:**  
  - Quem chama a inscrição: `src/app/pt/nutri/workshop/page.tsx`, `src/app/pt/nutri/workshop-agenda-instavel/page.tsx` (payload: `nome`, `email`, `telefone`).  
  - Rota: `src/app/api/nutri/workshop/inscricao/route.ts` (uso de `sanitizedData.nome` ao chamar `sendWorkshopInviteToFormLead`).

---

### 2.2 Nome errado na resposta da Carol ("Oi Ylada Nutri")

- **Onde:** Resposta da Carol na primeira mensagem da usuária no WhatsApp.
- **Cadeia do nome em `processIncomingMessageWithCarol`:**
  - `leadName = registrationName || (context as any)?.lead_name || conversation.name`
  - `registrationName = getRegistrationName(phone, area)` (workshop_inscricoes / contact_submissions).
  - `conversation` vem de `.select('context, name')` em `whatsapp_conversations`; **não** usa `customer_name`.
- **Hipóteses:**
  1. **Conversas duplicadas por telefone:**  
     Form cria conversa com um formato de telefone (ex.: `8591234567`). Webhook usa o número no formato do payload (ex.: `558591234567`). Se a busca em `getOrCreateConversation` for exatamente `eq('phone', phone)`, não acha a conversa do form e cria outra. Na conversa nova:
     - `name` é o do payload da Z-API (ex.: "Ylada Nutri" ou nome do canal);
     - Não há `veio_aula_pratica` / `recebeu_link_workshop` (contexto da conversa do form);
     - `getRegistrationName` pode estar sendo chamado já nessa conversa “nova”, mas o match por telefone pode falhar se o form salvou com outro formato em `workshop_inscricoes.telefone`.
  2. **Form não preenche `name`, só `customer_name`:**  
     Em `whatsapp-form-automation.ts`, ao **criar** conversa usa `customer_name: leadName`. Não define `name`. Se a tabela tiver `name` e `customer_name`, a Carol só lê `conversation.name`. O webhook em `getOrCreateConversation` faz `if (!existing.name && name) updateData.name = name` quando acha conversa existente. Então o primeiro valor que entra em `name` pode ser o do payload da Z-API ("Ylada Nutri"), e a Carol usa esse se `getRegistrationName` falhar ou ainda não tiver corrigido a conversa.
  3. **Enriquecimento no webhook:**  
     O enriquecimento chama `getRegistrationName` e grava em `name` e `context.lead_name`. Se a conversa considerada for a “errada” (segunda conversa) ou se o telefone não bater no cadastro, o nome do workshop não é aplicado e continua valendo `conversation.name` ("Ylada Nutri").
- **Arquivos a revisar:**
  - `src/lib/whatsapp-carol-ai.ts`: trecho que faz `conversation = conv` e monta `leadName`; uso de `conversation.name` vs `customer_name`.
  - `src/app/api/webhooks/z-api/route.ts`: `getOrCreateConversation` (critério de busca por `phone`); enriquecimento (momento em que atualiza `name`/`context.lead_name` e qual conversa é atualizada).
  - `src/lib/whatsapp-form-automation.ts`: criação/atualização de conversa (uso de `name` vs `customer_name`); formato de `phone` ao buscar/criar conversa.
  - `src/lib/whatsapp-carol-ai.ts` em `getRegistrationName`: formato de telefone na busca (`workshop_inscricoes.telefone` vs `phone` recebido no webhook).

---

### 2.3 Carol repetindo a “primeira mensagem” (boas-vindas + opções) depois do form

- **Onde:** Decisão de tratar como “primeira mensagem” e mandar o bloco completo (oi, boas-vindas, opções) em `whatsapp-carol-ai.ts`.
- **Lógica atual:**  
  `isFirstMessage = (customerMessages.length === 1)`. Ou seja: “primeira mensagem” = primeira mensagem **do cliente** no histórico daquela conversa. Não considera que o **form** já enviou um bloco equivalente.
- **Efeito:** Quando a cliente manda “Acabei de me inscrever...”, ainda é a primeira mensagem do cliente na conversa; a Carol dispara de novo o mesmo tipo de conteúdo (boas-vindas + opções), gerando duplicidade.
- **Arquivos / trechos a revisar:**
  - `src/lib/whatsapp-carol-ai.ts`: onde se calcula `isFirstMessage` e onde esse valor é usado em `generateCarolResponse` (bloco “primeira mensagem” com opções).
  - Regra desejada (sugestão): não usar o fluxo “primeira mensagem com opções” quando **já existir** no histórico da conversa alguma mensagem do bot que seja claramente a boas-vindas do workshop (por exemplo que contenha “Opções de Aula” / “Qual você prefere”) ou quando a conversa já tiver tags como `veio_aula_pratica` / `recebeu_link_workshop` **e** já tiver pelo menos uma mensagem do bot.

---

### 2.4 Horários diferentes nas opções (form 18h/12h x Carol 15h/09h)

- **Form:** Busca em `whatsapp-form-automation.ts` as 2 próximas sessões ativas (`whatsapp_workshop_sessions`), ordenadas por `starts_at`.
- **Carol:** Em `processIncomingMessageWithCarol`, `workshopSessions` vêm de:
  - `context.workshop_session_id` (uma sessão só), ou
  - busca das 2 próximas sessões ativas na área.
- Se a Carol estiver atuando em **outra conversa** (por causa de duplicidade de telefone), ou em outro momento, ela usa outra lista de sessões e pode mostrar 15h/09h enquanto o form mostrou 18h/12h.
- **Arquivos a revisar:**  
  - `src/lib/whatsapp-form-automation.ts`: query de sessões.  
  - `src/lib/whatsapp-carol-ai.ts`: fonte de `workshopSessions` (contexto vs nova query) e critério de “qual conversa” está sendo usada.

---

### 2.5 Carol repetindo a mesma resposta para “Ok”

- **Onde:** Respostas às mensagens 6 e 8 (“Ok”).
- **Comportamento:** A Carol reenvia o bloco “Oi Ylada Nutri... + opções” como se fosse início de conversa.
- **Causa provável:**  
  O critério que manda “mostrar opções de novo” (ou disparar o bloco de “primeira mensagem”) está sendo acionado também para mensagens curtas/neutras como “Ok”. Por exemplo: uso de `isFirstMessage`, ou lógica que interpreta “Ok” como pedido de horários.
- **Arquivos a revisar:**
  - `src/lib/whatsapp-carol-ai.ts`: em `generateCarolResponse`, quando `shouldSendOptions` ou o bloco de “primeira mensagem” é ativado; se há condição sobre o **conteúdo** da mensagem (ex.: não tratar “Ok”, “Certo”, etc. como pedido de opções).
  - Regra desejada: para mensagens como “Ok”, “Certo”, “Beleza”, etc., **não** reenviar boas-vindas nem lista de opções; no máximo uma linha curta de confirmação, se fizer sentido.

---

## 3. Resumo das causas por área

| Problema                         | Área / origem plausível                                                                 | O que verificar |
|----------------------------------|------------------------------------------------------------------------------------------|------------------|
| Nome = e-mail na mensagem do form | Quem envia `nome` para a inscrição (front + body)                                       | Payload do form (workshop / workshop-agenda-instavel); uso de `sanitizedData.nome` na inscrição e na chamada a `sendWorkshopInviteToFormLead`. |
| “Oi Ylada Nutri” na Carol        | Nome da conversa vs nome do cadastro; possível conversa duplicada                       | Normalização de telefone (form vs webhook); uso de `name` vs `customer_name`; enriquecimento no webhook e momento em que a Carol lê a conversa; `getRegistrationName` e formato de `phone`/`telefone`. |
| Duplicidade form + Carol         | “Primeira mensagem” baseada só em “primeira msg do cliente”                             | Condição que define “primeira mensagem com opções” (incluir “já existe boas-vindas do workshop” ou tags + msg do bot). |
| Opções 18h/12h x 15h/09h        | Duas conversas ou duas fontes de sessões em momentos diferentes                          | Unicidade da conversa por telefone; consistência da query de sessões entre form e Carol. |
| Carol repetindo em “Ok”          | Tratamento de mensagens curtas como se fossem pedido de horários / primeira interação   | Regras em `generateCarolResponse` (e onde monta o contexto) que decidem “mostrar opções de novo” ou “fluxo de primeira mensagem”. |

---

## 4. Ordem sugerida para correções (quando for implementar)

1. **Unificar e normalizar telefone** em form, webhook e Carol, para evitar duas conversas para a mesma pessoa.
2. **Garantir uso do nome do cadastro** na Carol: priorizar `getRegistrationName` e/ou `context.lead_name`; alinhar `name` e `customer_name` na criação/atualização da conversa (form e webhook).
3. **Impedir “primeira mensagem com opções” da Carol** quando o form já tiver enviado o bloco de boas-vindas + opções (ex.: tags + já existir mensagem do bot com “Opções” / “Qual você prefere”).
4. **Não reenviar boas-vindas/opções** para mensagens neutras como “Ok”; condicionar o reenvio de opções a perguntas explícitas sobre horários/dias/agendamento.
5. **Validar origem do “nome” na inscrição** (form/outros meios) para que `nome` nunca seja preenchido com e-mail; se for caso de outro formulário, revisar mapeamento de campos antes de chamar a automação.

---

## 5. Arquivos envolvidos (referência rápida)

- `src/app/api/nutri/workshop/inscricao/route.ts` – corpo da inscrição, `sanitizedData.nome`, chamada a `sendWorkshopInviteToFormLead`.
- `src/app/pt/nutri/workshop/page.tsx` e `src/app/pt/nutri/workshop-agenda-instavel/page.tsx` – payload do form (nome/email/telefone).
- `src/lib/whatsapp-form-automation.ts` – texto da mensagem, uso de `leadName`; criação/atualização de conversa (`phone`, `customer_name`/`name`); verificação de duplicidade.
- `src/app/api/webhooks/z-api/route.ts` – `getOrCreateConversation` (busca por `phone`); enriquecimento com `getRegistrationName` e atualização de `name`/`context.lead_name`.
- `src/lib/whatsapp-carol-ai.ts` – `processIncomingMessageWithCarol` (leitura da conversa, `leadName`, `isFirstMessage`); `generateCarolResponse` (quando envia opções / “primeira mensagem”); `getRegistrationName` (formato de telefone e colunas usadas nas tabelas de cadastro).

Esta análise cobre todas as áreas envolvidas na sequência equivocada e serve de base para os ajustes futuros, sem alteração de código nesta etapa.
