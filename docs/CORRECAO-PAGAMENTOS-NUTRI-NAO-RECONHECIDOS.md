# Correção: pagamentos Nutri (e outros) não reconhecidos automaticamente

## O que aconteceu

Vários pagamentos aprovados no Mercado Pago (incluindo Nutri e Wellness) não foram reconhecidos pelo sistema. O webhook recebe do MP apenas o **ID do pagamento**; para obter `external_reference`, e-mail do pagador e valor, o sistema chama a **API do Mercado Pago** (`payment.get(id)`).

### Causa provável

1. **Token errado (produção vs teste)**  
   O webhook usa `body.live_mode` para decidir se usa token de teste ou de produção. Se o MP enviar o evento com `live_mode` incorreto ou se no servidor estiver configurado só um dos tokens, a chamada `payment.get()` falha. Sem os dados completos, o sistema não consegue identificar o usuário (falta `external_reference`/e-mail) e não cria/atualiza a assinatura.

2. **Webhook não disparado ou URL inacessível**  
   Se a URL do webhook no painel do MP estiver errada ou o servidor estiver fora do ar, o evento nunca chega.

## Correção aplicada no código

- **Webhook** (`src/app/api/webhooks/mercado-pago/route.ts`):  
  Ao buscar o pagamento na API do MP, em caso de falha é feita uma **segunda tentativa com o outro ambiente** (teste ↔ produção). Assim, mesmo que o `live_mode` venha errado ou só um token esteja configurado, o sistema tenta os dois e tende a reconhecer o pagamento.

## O que fazer quando um pagamento aprovado não refletir no painel

### 1. Sync via API (recomendado)

Com usuário **admin** logado:

```http
POST /api/admin/mercado-pago/sync-payment
Content-Type: application/json

{ "payment_id": "<ID_DA_TRANSACAO_NO_MP>" }
```

Exemplo para a Jessica (pagamento 19/fev, ID 146940219158):

```json
{ "payment_id": "146940219158" }
```

O sync busca o pagamento no MP, associa ao usuário (por e-mail/referência), cria ou atualiza a assinatura e registra o pagamento. É a forma oficial e evita duplicar lógica em SQL.

### 2. Correção manual em SQL (se o sync não resolver)

Se o sync retornar erro ou não encontrar o usuário, use o script de correção:

- **Jessica Santos Souza (Nutri, 19/fev):**  
  `scripts/corrigir-assinatura-nutri-jessica-souza.sql`

O script:

- Localiza o usuário pelo e-mail `jessica.souza17@yahoo.com`
- Renova a assinatura ativa em Nutri (estende o vencimento em 1 mês)
- Registra o pagamento com ID MP `146940219158` (R$ 97,00)

Execute no banco (Supabase SQL Editor ou `psql`). No final do arquivo há uma query de verificação.

### 3. Verificar configuração do Mercado Pago

- No **Vercel** (ou onde o app estiver): conferir se existem **MERCADOPAGO_ACCESS_TOKEN** e **MERCADOPAGO_ACCESS_TOKEN_LIVE** (e, se usar testes, **MERCADOPAGO_ACCESS_TOKEN_TEST**).
- No **painel do MP**: conferir a URL do webhook e se está apontando para produção (e se o servidor está acessível).

## Resumo

| Situação | Ação |
|----------|------|
| Pagamento aprovado não aparece no painel | 1) Chamar `POST /api/admin/mercado-pago/sync-payment` com `payment_id`. 2) Se falhar, rodar o SQL de correção específico. |
| Evitar novos “não reconhecidos” | Código atualizado com retry de token no webhook; manter tokens de teste e produção configurados e URL do webhook correta. |

Referência do sync: `src/app/api/admin/mercado-pago/sync-payment/route.ts`.  
Referência do webhook: `src/app/api/webhooks/mercado-pago/route.ts`.
