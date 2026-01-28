# PT — Novo chat: fluxo da automação WhatsApp (estado atual)

<!--
CONTEXTO PARA O ASSISTENTE (carregar este PT direto):
Este arquivo é o ponto de partida (PT) do fluxo da automação WhatsApp.
Ao ser referenciado (@docs/PT-NOVO-CHAT-FLUXO-AUTOMACAO-WHATSAPP.md), use todo o conteúdo abaixo como contexto inicial:
- estado atual do enriquecimento (Supabase, admin, webhook Z-API, Carol, workshop);
- fluxos em uma frase;
- arquivos principais do fluxo;
- tópicos a revisar.
Objetivo: revisar o fluxo completo a partir de agora (cadastro → lista admin → Carol).
-->

**Objetivo do próximo chat:** Revisar como fica todo o fluxo, a partir de agora, com a automação nova (nomes/telefones do Supabase, lista admin, Carol, workshop, etc.).

---

## 1. O que está implementado (commit recente)

- **Enriquecimento de conversas** com nome e telefone do Supabase:
  - Fontes: `workshop_inscricoes`, `contact_submissions`, `leads`, `nutri_leads`
  - Match por: telefone (sufixo) e email (context)
  - Arquivos: `src/lib/whatsapp-conversation-enrichment.ts`, `src/lib/phone-br.ts`

- **Lista do admin WhatsApp** (`/admin/whatsapp`):
  - Linha 1: nome (prioridade: cadastro → nome WhatsApp → context.display_name → telefone formatado)
  - Linha 2: telefone formatado do cadastro quando existir, senão número da conversa
  - API: `GET /api/whatsapp/conversations` enriquece cada conversa com `display_name` e `display_phone`
  - Agrupamento por telefone BR (12→13 dígitos), preferindo conversa com nome

- **PATCH da conversa** (`/api/whatsapp/conversations/[id]`):
  - Ao editar nome: busca no cadastro por nome e preenche `display_phone` na conversa

- **Webhook Z-API** (`/api/webhooks/z-api`):
  - Cria/busca conversa com telefone normalizado (normalizePhoneBr)
  - Chama `syncConversationFromCadastro` na primeira conexão (grava name, customer_name, context.display_name, context.display_phone quando acha no cadastro)
  - Não grava número como nome (filtro Ylada / só dígitos)

- **Outros pontos que tocam no fluxo:**
  - Form automation (`whatsapp-form-automation.ts`): ao atualizar conversa existente, grava name, customer_name, display_name, display_phone quando tem leadName
  - Carol v2 disparos: após obter/criar conversa chama `syncConversationFromCadastro`
  - **Carol ao responder:** quando a pessoa envia qualquer mensagem, a Carol carrega as **últimas mensagens desta conversa** (até 30) para manter contexto e responder em continuidade — usa as últimas 10 para a seção "ONDE PARAMOS" e envia as últimas 20 para o modelo (whatsapp-carol-ai.ts).
  - Mensagens: `GET /api/whatsapp/conversations/[id]/messages` busca mensagens de todas as conversas com o mesmo telefone (unificação)

---

## 2. Fluxos em uma frase

| Momento | O que acontece |
|--------|----------------|
| Pessoa se cadastra (workshop / formulário / lead) | Nome e telefone vão para Supabase (workshop_inscricoes, contact_submissions, leads, nutri_leads) |
| Primeira mensagem no WhatsApp (cliente ou nós) | Webhook cria/atualiza conversa, chama syncConversationFromCadastro → se achar no cadastro, grava name + display_name + display_phone na conversa |
| Admin abre a lista | API monta mapas do Supabase, para cada conversa chama findInscricao(phone, context) → retorna display_name e display_phone quando há match |
| Admin edita nome de uma conversa | PATCH busca no cadastro por nome (findInscricaoByName) e preenche display_phone na conversa |

---

## 3. Arquivos principais para revisar o fluxo

- `src/lib/whatsapp-conversation-enrichment.ts` — buildInscricoesMaps, findInscricao, findInscricaoByName, syncConversationFromCadastro
- `src/lib/phone-br.ts` — normalizePhoneBr
- `src/app/api/webhooks/z-api/route.ts` — entrada de mensagens, getOrCreateConversation, syncConversationFromCadastro
- `src/app/api/whatsapp/conversations/route.ts` — lista de conversas, enriquecimento, agrupamento
- `src/app/api/whatsapp/conversations/[id]/route.ts` — PATCH (nome, context, busca por nome → display_phone)
- `src/app/admin/whatsapp/page.tsx` — UI lista (getDisplayName, getDisplayPhone), agrupamento no front
- `src/lib/whatsapp-form-automation.ts` — envio pós-cadastro, atualização de conversa existente
- `docs/ADMIN-WHATSAPP-NOMES-E-TELEFONES-RECOMENDACAO.md` — recomendação de uso

---

## 4. O que revisar no novo chat

- Fluxo completo: desde o cadastro (workshop/formulário/lead) até a lista no admin e o que a Carol usa
- Ordem e prioridades: quando vem nome/telefone do cadastro vs nome/telefone da conversa
- Casos em que ainda aparece só número (match falha) e o que fazer (cadastro antes, editar nome)
- Se quiser: desenho do fluxo (texto ou diagrama) “a partir de agora” para documentar e alinhar

---

## 5. Avaliação da opinião (GPT) — o que tem fundamento na nossa arquitetura

*(Análise feita com o código em mãos; o GPT não tinha detalhe da arquitetura.)*

| Ponto | Na nossa base hoje | Tem fundamento? | Útil para o projeto? |
|-------|--------------------|------------------|----------------------|
| **Estado da conversa (stage/funnel)** | Já existe **`context.stage`** (send-template: ASK_INTEREST_*, FOLLOWUP_DECIDING, LAST_CHANCE). Carol usa em `stageObjetivo` em `whatsapp-carol-ai.ts`. Não existe coluna `conversation.stage` nem funnel explícito (novo → lead_identificado → workshop_inscrito → assistiu → cliente). | Parcial. A ideia de "conversa não sabe onde está" é exagerada para o fluxo atual (tags + stage + adminSituacao já dão contexto). Para **escalar** e evitar Carol repetir, um **estágio explícito** (coluna ou context.stage padronizado) ajuda. | **Sim.** Evoluir para estágios claros (ex.: novo, lead_identificado, workshop_inscrito, assistiu_aula, cliente) é o próximo passo natural; hoje está meio "implícito" em tags + stage de template. |
| **Lock de identidade** | Vários pontos escrevem em `name`, `context.display_name`, `context.display_phone`: webhook (sync), form automation, PATCH. Nenhum verifica "veio do cadastro/admin" antes de sobrescrever. | **Sim.** Risco real de regressão (ex.: form automation sobrescrever nome que o admin corrigiu). | **Sim.** Regra explícita: não sobrescrever `display_name`/`display_phone` (e opcionalmente `name`) se origem = cadastro ou edição admin. Pode ser flag no context (ex. `identity_locked` ou `display_name_source`) e checagem em `syncConversationFromCadastro` e form automation. |
| **Carol só consumir** | Webhook já chama `syncConversationFromCadastro` na primeira conexão. **Carol v2 disparos** também chama `syncConversationFromCadastro` ao obter/criar conversa (`carol-v2/disparos.ts`). | **Sim.** Carol hoje "participa" do enriquecimento. A regra "IA não é responsável por identidade, só usa" é boa. | **Sim.** Remover a chamada a `syncConversationFromCadastro` dos disparos da Carol e garantir que todo caminho que leva à Carol (webhook, cron, disparo manual) já tenha rodado sync antes. Assim Carol só **consome** nome/telefone/estágio. |
| **Casos "só número"** | Já documentado: match falha, cadastro antes / edição manual. | Alinhado. | Nada a mudar; manter como "comportamento esperado". |
| **Logs de origem do nome/telefone** | Não existe. | Opcional. | Útil para debug e suporte; não bloqueante. |

**Resumo:** A opinião tem fundamento mesmo sem ver o código. O que mais vale a pena implementar primeiro: **(1) lock de identidade** (evita regressão com pouco código), **(2) Carol só consumir** (remover sync dos disparos + garantir sync antes), **(3) estágios explícitos** (coluna ou context.stage padronizado) para o funil.

---

## 6. Por que no caso da Marisa o contexto se perdeu (“bom dia” em conversa existente)

A Carol **sempre** carrega as últimas mensagens **desta conversa** (até 30) antes de responder. No caso da Marisa (conversa que já existia, ela disse “bom dia” e o contexto se perdeu), as causas prováveis foram:

| Causa | O que acontecia | Correção |
|-------|-----------------|----------|
| **1. “Bom dia” não era tratado como reengajamento** | O código só reconhecia “oi”, “olá”, “boa tarde”, “boa noite”, “tudo bem” etc. **“Bom dia”** (com **bom**) não entrava no padrão (só havia **boa** + tarde/noite/dia). Então a Carol **não** recebia a instrução de “recepcione e retome o fio”. | Inclusão de **`bom\s+dia`** no regex de reengajamento em `whatsapp-carol-ai.ts`. |
| **2. Reengajamento só ativava em “reabertura”** | Mesmo quando a mensagem batia com o padrão, a instrução de recepcionar só era dada se a **última mensagem nossa** parecesse reabertura (ex.: “Boa tarde”) **ou** se já houvesse ≥ 4 mensagens. Se a Marisa mandou “bom dia” no início do dia (sem nossa última msg ser reabertura), a Carol **não** recebia a instrução. | Reengajamento **sempre** que a pessoa cumprimentar **e** existir histórico (`lastN.length > 0`), sem exigir reabertura. |
| **3. Possível fragmentação de conversa** | A Carol usa o histórico da **conversa** em que a mensagem caiu (`conversation_id` do webhook). Se o mesmo telefone tiver **duas conversas** (ex.: um formato de número na form automation e outro no webhook), o “bom dia” pode ter ido para a conversa **nova** ou **vazia**. Nessa conversa o histórico seria vazio → a Carol trataria como primeira mensagem ou genérico. | Garantir um único `conversation_id` por telefone (normalizePhoneBr em todo lugar; webhook usa getOrCreateConversation com phone normalizado). Se ainda houver duplicatas, conferir no admin se a Marisa aparece em mais de uma conversa e unificar/ajustar origem. |

**Resumo:** As causas 1 e 2 foram corrigidas no código. Se no caso da Marisa o histórico realmente existia na mesma conversa em que o “bom dia” entrou, a partir da correção a Carol deve recepcionar e retomar o fio. Se o problema foi causa 3 (mensagem em outra conversa sem histórico), vale checar no banco se há mais de uma linha em `whatsapp_conversations` para o telefone dela.

---

**No novo chat:** referencie este arquivo com `@docs/PT-NOVO-CHAT-FLUXO-AUTOMACAO-WHATSAPP.md` para o assistente carregar o PT como contexto. Exemplo de prompt:  
“Quero rever todo o fluxo da automação WhatsApp a partir do estado atual. Como fica o fluxo completo a partir de agora?”
