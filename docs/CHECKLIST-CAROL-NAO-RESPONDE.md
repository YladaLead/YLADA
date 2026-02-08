# Checklist: Carol não responde / 1ª mensagem não envia

Use este checklist para verificar por que a Carol não está respondendo ou quando “Enviar 1ª mensagem” no admin não funciona.

---

## 1. Status global da Carol

- [ ] No admin WhatsApp, a faixa no topo está **verde** (“Carol: **ligada**”)?
- [ ] Se estiver **amarela** (“Carol: desligada”), clique em **Ligar Carol**.
- [ ] Se não mudar, verifique no Supabase: tabela `app_settings`, chave `carol_automation_disabled` → valor deve ser `false` (ou a chave não existir; nesse caso rode a migração `scripts/migrations/create-app-settings-carol.sql`).

---

## 2. Webhook Z-API recebendo mensagens

- [ ] No painel da Z-API, o webhook “Ao receber” está apontando para:  
  `https://www.ylada.com/api/webhooks/z-api` (ou sua URL de produção)?
- [ ] A instância está **conectada** (status online)?
- [ ] Em **Vercel → Logs** (ou Deployments → View Function Logs), ao enviar uma mensagem de teste, aparece algo como `[Z-API Webhook] 📥 Payload completo recebido`?
- Se **não** aparecer: a Z-API não está chamando a sua API; confira URL do webhook e conectividade.

---

## 3. Carol sendo chamada no webhook

Nos logs da Vercel (após uma mensagem recebida), procure:

- [ ] `[Z-API Webhook] 🤖 Decisão Carol:` com `shouldProcessCarol: true`?
- Se `shouldProcessCarol: false`, veja o log: pode ser “modo manual” (tag `atendimento_manual`), “número de notificação”, “já processou” ou “última mensagem da Carol mais recente”.
- [ ] `[Z-API Webhook] 🤖 Iniciando processamento com Carol...`?
- [ ] `[Z-API Webhook] ✅ Carol respondeu automaticamente` ou `[Z-API Webhook] ❌ Carol não conseguiu responder`?
- Se **❌ Carol não conseguiu responder**: no mesmo log deve aparecer `error:` e `hasOpenAIKey`. Confira `OPENAI_API_KEY` nas variáveis de ambiente da Vercel.

---

## 4. Histórico de mensagens (contexto da Carol)

- [ ] A correção do histórico está em produção? A Carol deve usar mensagens com status `sent` / `delivered` / `read` (não só `active`). Commit: “fix(carol): histórico de mensagens e webhook”.
- Se o deploy estiver antigo, faça um novo deploy após esse commit.

---

## 5. Modo manual por conversa

- [ ] Na conversa que não responde, **não** deve ter a tag **“Manual (pausar Carol)”** / `atendimento_manual`.
- [ ] Se tiver, no menu ⋮ da conversa use **“Ativar Carol”** (ou remova a tag manual) para a Carol voltar a responder nessa conversa.

---

## 6. “Enviar 1ª mensagem” / “O que a Carol faça?” no admin

- [ ] Ao clicar em **“Enviar boas-vindas (1ª mensagem)”**, a conversa precisa ter **pelo menos uma mensagem do cliente** (ex.: “Acabei de me inscrever...”). Caso contrário a API retorna “Nenhuma mensagem do cliente para reprocessar”. A Carol usa essa última mensagem para montar a resposta (boas-vindas + opções de horário).
- [ ] Se aparecer **“list is not defined”**: é um bug do front; o botão deve voltar de “Enviando...” após o tratamento de erro. Se continuar travado, abra o console (F12) e veja o stack trace.
- [ ] Se aparecer **503** ou “Automação temporariamente desligada”: Carol está desligada globalmente (item 1).
- [ ] Se aparecer **500** ou “Carol não conseguiu responder”: veja os logs da Vercel na hora do clique; o motivo (OpenAI, Z-API, etc.) aparece lá.

---

## 7. Resumo rápido

| Onde verificar | O que conferir |
|----------------|----------------|
| Admin WhatsApp (faixa topo) | Carol: **ligada** (verde) |
| Supabase `app_settings` | `carol_automation_disabled` = false |
| Z-API | Webhook URL correta, instância conectada |
| Vercel Logs | Webhook recebe payload; Decisão Carol; Carol respondeu ou erro |
| Vercel Env | `OPENAI_API_KEY` definida |
| Conversa | Sem tag “Manual (pausar Carol)” se quiser Carol ativa |
| Deploy | Código com correção do histórico e do webhook em produção |

---

*Última atualização: fev/2026*
