# Passo a passo — Desligar automação Carol (sem deixar rastro)

Automação fica **totalmente desligada**. Você opera manualmente até o novo sistema estar pronto.

---

## 1. Chave central (já feita)

- **Arquivo:** `src/config/whatsapp-automation.ts`
- **Função:** `isCarolAutomationDisabled()` — retorna `true` quando `CAROL_AUTOMATION_DISABLED` não é `'false'`.
- **Comportamento:** por padrão a automação fica **desligada**. Para religar no futuro: `CAROL_AUTOMATION_DISABLED=false` no `.env` (ou remova a lógica quando o novo sistema existir).

---

## 2. Webhook Z-API — Carol e automações

- **Arquivo:** `src/app/api/webhooks/z-api/route.ts`
- **O que fica desligado:**
  - Cancelamento de mensagens agendadas (step 4) — não mexe no scheduler.
  - Carol (`processIncomingMessageWithCarol`) — não responde.
  - `processAutomations` — não dispara regras antigas.
- **O que continua:** salvar mensagem, criar/atualizar conversa, notificar admin (se estiver usando).

---

## 3. Inscrição workshop e formulários — primeira mensagem automática

- **Arquivos:**
  - `src/app/api/nutri/workshop/inscricao/route.ts`
  - `src/app/api/public/formularios/[formId]/respostas/route.ts`
- **O que fica desligado:** chamada a `sendWorkshopInviteToFormLead` (mensagem automática após cadastro).
- **O que continua:** inscrição/cadastro no banco, envio de email etc.

---

## 4. Workshop participants — Participou / Não participou

- **Arquivo:** `src/app/api/admin/whatsapp/workshop/participants/route.ts` (POST)
- **O que fica desligado:** disparo de `sendRegistrationLinkAfterClass` e `sendRemarketingToNonParticipant`.
- **O que continua:** atualização de tags no banco (participou_aula / nao_participou_aula). Só não envia WhatsApp.

---

## 5. Worker (não usamos mais Cron)

- **Automação oficial:** worker on-demand. **Cron não é usado.**
- **Arquivos que importam:**
  - `src/app/api/admin/whatsapp/automation/process-all/route.ts` — processar tudo (boas-vindas, fila, pré-aula, participou/não participou)
  - `src/app/api/admin/whatsapp/automation/process/route.ts` — processar só a fila de mensagens agendadas
- **Comportamento:** com kill-switch ligado, ambas respondem `200 { disabled: true, message: 'Automação temporariamente desligada' }` e não executam nada.
- **Legado (compatibilidade):**  
  `GET /api/cron/whatsapp-carol?tipo=...` e `GET /api/cron/whatsapp-carol/pre-class` existem só para chamada manual/compat; não rodam em Cron. Também respeitam o kill-switch e retornam `disabled: true`.

---

## 6. Rotas Carol / disparos manuais

- **Arquivos:**
  - `src/app/api/admin/whatsapp/carol/simulate-message/route.ts`
  - `src/app/api/admin/whatsapp/carol/reprocess-last/route.ts`
  - `src/app/api/admin/whatsapp/carol/test/route.ts`
  - `src/app/api/admin/whatsapp/carol/chat/route.ts` (envio de mensagem como Carol)
  - `src/app/api/admin/whatsapp/carol/disparos/route.ts`
  - `src/app/api/admin/whatsapp/carol/processar-especificos/route.ts`
  - `src/app/api/admin/whatsapp/automation/reprocessar-participou/route.ts`
  - `src/app/api/admin/whatsapp/automation/reprocessar-nao-participou/route.ts`
  - `src/app/api/whatsapp/carol/send-registration-link/route.ts`
  - `src/app/api/whatsapp/conversations/[id]/route.ts` (PATCH: ao adicionar tag `participou_aula`, não envia link)
  - `src/app/api/webhooks/mercado-pago/route.ts` (bloco que chama `redirectToSupportAfterPayment`)
- **Comportamento:** se `isCarolAutomationDisabled()` for `true`, as rotas de Carol/disparo respondem `503 { disabled: true }` e não executam envio; conversation PATCH e webhook mercado-pago só não disparam o envio via WhatsApp.

---

## 7. Variável de ambiente

- **Opcional:** em `.env.local` pode colocar `CAROL_AUTOMATION_DISABLED=true` para deixar explícito.
- **Padrão:** se não existir, o código trata como desligado (automação não roda).

---

## 8. O que não mudou

- Z-API recebe e salva mensagens.
- Supabase (conversas, mensagens, inscrições) segue igual.
- Admin pode ler conversas, participantes, marcar participou/não participou (só não disparam WhatsApp).
- Tudo que não é “Carol” ou “disparo automático” segue como está.

---

## 9. Quando for religar

1. Terminar o novo sistema (Carol enxuta + disparos + worker).
2. Trocar as chamadas para o novo código e, onde fizer sentido, passar a usar `isCarolAutomationDisabled() === false` ou remover o kill-switch.
3. Definir `CAROL_AUTOMATION_DISABLED=false` só quando o novo fluxo estiver estável.
