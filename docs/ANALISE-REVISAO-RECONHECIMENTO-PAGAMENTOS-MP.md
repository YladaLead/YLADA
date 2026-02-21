# Análise geral: por que os pagamentos deixaram de ser reconhecidos automaticamente

**Objetivo:** Revisão do fluxo de reconhecimento de pagamentos do Mercado Pago (Nutri, Wellness, etc.) para identificar possíveis causas de falha **sem alterar código**.  
**Contexto:** A partir do pagamento do Marcelino/Cristóvão (Wellness, Plano Anual), os últimos ~5–10 pagamentos não foram reconhecidos e tiveram de ser corrigidos manualmente.

---

## 1. Fluxo completo (resumo)

| Etapa | Onde | O que acontece |
|-------|------|----------------|
| 1. Cliente inicia checkout | Front (Nutri/Wellness) → `createCheckout()` | `userId` = UUID logado ou `temp_${email}`. |
| 2. Criação da preferência | `payment-gateway.ts` → `createPreference()` | `external_reference` = `area_planType_userId` (ex.: `nutri_monthly_temp_jessica.souza17@yahoo.com`). `metadata` = `user_id`, `area`, `plan_type`. Token usado: **LIVE** em produção (`isTest = NODE_ENV !== 'production'`). |
| 3. Cliente paga no MP | Mercado Pago | Pagamento aprovado; MP cria recurso **Payment**. |
| 4. Notificação | MP → `POST /api/webhooks/mercado-pago` | Payload: `type: "payment"`, `data: { id: "..." }`, `live_mode: true/false`. **Só vem o ID;** não vem `external_reference` nem `metadata` no body. |
| 5. Busca do pagamento | Webhook → `payment.get(id)` na API do MP | Para obter `external_reference`, `metadata`, `payer`, `status`. Token: **isTest = (live_mode === false)**. |
| 6. Identificação do usuário | `handlePaymentEvent` | `userId` = `metadata.user_id` OU extraído de `external_reference` (partes após `area_planType_`) OU `temp_${payer.email}`. Sem `userId` → **return sem criar assinatura**. |
| 7. Criação/atualização | Webhook | Cria/atualiza `subscriptions` e insere em `payments`. |

Ou seja: o reconhecimento **depende** de o webhook conseguir chamar `payment.get(id)` e de a resposta trazer **external_reference** (e/ou metadata) para achar o usuário.

---

## 2. Pontos onde o fluxo pode falhar (diagnóstico)

### 2.1 Webhook não chega ou não é processado

- **URL do webhook** no painel do MP (produção) errada ou inacessível.
- **Servidor** (ex.: Vercel) fora do ar ou timeout ao responder.
- **Resposta 5xx** antes de processar (ex.: erro ao parsear body) → MP pode parar de reenviar depois de várias falhas.

**O que verificar:** Logs do Vercel (ou do servidor) no horário dos pagamentos. Ver se há requisições `POST /api/webhooks/mercado-pago` e qual status/resposta foi devolvido.

---

### 2.2 `payment.get(id)` falha (causa mais provável para “todos falhando”)

O webhook recebe só `data.id`. Todos os dados úteis (`external_reference`, `metadata`, `payer`) vêm da **resposta** de `payment.get(id)`.

Se essa chamada falhar:

- O código usa apenas `data` do webhook, que **não tem** `external_reference` nem `metadata`.
- Não há como obter `userId` de forma confiável → o handler faz **return** sem criar/atualizar assinatura.

**Por que `payment.get()` pode falhar:**

1. **Token errado (teste vs produção)**  
   - Webhook usa `isTest = (body.live_mode === false)`.  
   - Pagamento em **produção** → `live_mode: true` → `isTest = false` → usa `MERCADOPAGO_ACCESS_TOKEN_LIVE`.  
   - Se no servidor (ex.: Vercel) só existir `MERCADOPAGO_ACCESS_TOKEN` (ou TEST), a chamada com LIVE pode falhar (401/404).  
   - **Já existe retry** no código: se a primeira tentativa falhar, tenta com o outro token (teste/produção). Isso mitiga uso errado de token.

2. **Token LIVE ausente em produção**  
   - Se `MERCADOPAGO_ACCESS_TOKEN_LIVE` não estiver definido no ambiente de produção, as duas tentativas (LIVE e TEST) podem falhar → nenhum dado completo do pagamento → nenhum reconhecimento.

3. **Erro de API / rede**  
   - Timeout, rate limit ou mudança na API do MP podem fazer `payment.get()` falhar de forma intermitente ou permanente.

**O que verificar:**

- Variáveis de ambiente em **produção**: existência de `MERCADOPAGO_ACCESS_TOKEN_LIVE` (e, se aplicável, `MERCADOPAGO_ACCESS_TOKEN_TEST`).
- Nos logs do webhook: mensagens do tipo “Falha ao buscar pagamento” ou “Não foi possível obter dados aprovados do pagamento”. Isso indica falha na busca do pagamento.

---

### 2.3 Resposta do `payment.get(id)` sem `external_reference` (e sem metadata)

A API do MP documenta que o recurso **Payment** pode ter `external_reference`. A **Preference** que criamos envia:

- `external_reference`: `area_planType_userId`
- `metadata`: `user_id`, `area`, `plan_type`, etc.

Não está garantido na documentação que o **Payment** gerado a partir dessa Preference receba automaticamente o mesmo `metadata`. Em exemplos da API, o Payment às vezes vem com `metadata: {}`.  
Se o Payment não tiver nem `external_reference` nem `metadata` preenchidos, o nosso código não consegue obter `userId` e o pagamento não é reconhecido.

**O que verificar:** Para um pagamento que não foi reconhecido (ex.: ID 146940219158), chamar manualmente a API do MP:

```bash
GET https://api.mercadopago.com/v1/payments/146940219158
Authorization: Bearer <MERCADOPAGO_ACCESS_TOKEN_LIVE>
```

Conferir na resposta se existem:

- `external_reference` (ex.: `nutri_monthly_temp_jessica.souza17@yahoo.com`)
- `metadata` (ex.: `user_id`, `area`, `plan_type`)

Se ambos estiverem vazios/ausentes, o problema é do lado MP (Preference → Payment não copiando esses campos) ou do tipo de checkout utilizado.

---

### 2.4 Formato do evento (type / action)

O código usa `eventType = body.type || body.action` e faz `switch (eventType)` em `'payment'`, `'merchant_order'`, `'subscription'`/`'preapproval'`.  
Para pagamentos únicos (Preference), o MP envia `type: "payment"`. Se em algum momento o MP mudar para outro `type` ou `action` para o mesmo evento, o handler poderia não entrar no case `'payment'`.  
Até onde a documentação e o código indicam, isso não mudou; mas vale conferir nos logs o `body.type` e `body.action` das notificações recebidas.

---

### 2.5 Incoerência teste vs produção na criação do checkout

- **Checkout (Preference):** em `payment-gateway.ts`, `isTest = process.env.NODE_ENV !== 'production'`.  
  Em produção (ex.: Vercel) → `isTest = false` → Preference criada com token **LIVE**.  
- **Webhook:** `isTest = body.live_mode === false` → pagamento real → `live_mode: true` → `isTest = false` → token **LIVE**.  

Ou seja, **não há incoerência** entre “criar link de pagamento” e “processar notificação” em produção; ambos usam LIVE quando o pagamento é real.

---

## 3. Resumo das hipóteses mais plausíveis

| Hipótese | O que verificar | Ação sugerida |
|----------|-----------------|---------------|
| **1. `payment.get()` falha por token** | Logs do webhook (“Falha ao buscar pagamento”, “isTest=…”). Env em produção: `MERCADOPAGO_ACCESS_TOKEN_LIVE` definido? | Garantir LIVE (e TEST se necessário) no ambiente de produção. O retry com dois tokens já ajuda. |
| **2. Webhook não recebido** | Logs do servidor no horário dos pagamentos; URL do webhook no painel MP. | Corrigir URL / rede / disponibilidade do endpoint. |
| **3. Payment sem external_reference/metadata** | GET manual em um pagamento não reconhecido (ex.: 146940219158) com token LIVE. | Se a resposta não trouxer referência/metadata, abrir com o MP ou revisar tipo de integração (Checkout Pro vs outro). |
| **4. Erro antes de processar** | Logs de exceção no início do POST do webhook (parse, etc.). | Corrigir bug ou condição que gera 5xx antes do `handlePaymentEvent`. |

---

## 4. Onde olhar no código (sem alterar)

- **Webhook:** `src/app/api/webhooks/mercado-pago/route.ts`  
  - Entrada do POST, `body.type`, `body.action`, `body.data`, `body.live_mode`.  
  - Chamada a `payment.get(id)` e uso de `paymentDataFull` (incluindo retry com dois tokens).  
  - Extração de `userId` (metadata, `external_reference`, fallback com e-mail).  
  - Qualquer `return` sem criar assinatura (ex.: “User ID não encontrado”, “Pagamento não aprovado”).

- **Criação do link de pagamento:**  
  - `src/lib/payment-gateway.ts`: `isTest`, chamada a `createPreference(preferenceRequest, isTest)`.  
  - `src/lib/mercado-pago.ts`: `buildExternalReference()`, `external_reference` e `metadata` na Preference.

- **Sync manual (admin):**  
  - `src/app/api/admin/mercado-pago/sync-payment/route.ts`: usa o mesmo `handlePaymentEvent` com dados já buscados; confirma que o fluxo de reconhecimento é o mesmo quando há dados completos.

---

## 5. Próximos passos recomendados (diagnóstico)

1. **Verificar env em produção**  
   - `MERCADOPAGO_ACCESS_TOKEN_LIVE` (e, se for o caso, `MERCADOPAGO_ACCESS_TOKEN_TEST`) presentes e corretos.

2. **Ver logs do webhook** no período em que os pagamentos falharam (ex.: desde o Marcelino/Cristóvão):  
   - Requisições recebidas (sim/não).  
   - Mensagens “Falha ao buscar pagamento” ou “Não foi possível obter dados aprovados”.  
   - “User ID não encontrado” / “external_reference” / “metadata” nos logs de debug.

3. **Testar um pagamento real não reconhecido**  
   - Chamar `GET /v1/payments/{id}` com token LIVE para um desses IDs e inspecionar `external_reference` e `metadata`.

4. **Confirmar no painel do MP**  
   - URL do webhook para produção.  
   - Eventos de “Payments” (ou equivalente) habilitados para essa URL.

5. **Usar o sync manual como contorno**  
   - Para novos casos em que o webhook não reconhecer, seguir usando `POST /api/admin/mercado-pago/sync-payment` com o `payment_id` do MP (e, se necessário, o script SQL de correção já documentado).

---

## 6. Referências no repositório

- Webhook: `src/app/api/webhooks/mercado-pago/route.ts`  
- Criação de Preference e external_reference: `src/lib/mercado-pago.ts`  
- Checkout (isTest, createPreference): `src/lib/payment-gateway.ts`  
- Sync manual: `src/app/api/admin/mercado-pago/sync-payment/route.ts`  
- Correção Jessica (Nutri): `scripts/corrigir-assinatura-nutri-jessica-souza.sql`  
- Doc de correção geral: `docs/CORRECAO-PAGAMENTOS-NUTRI-NAO-RECONHECIDOS.md`  
- Marcelino/Cristóvão (Wellness): `scripts/corrigir-assinatura-marcelino-cristovao-wellness.sql`

Nenhuma alteração de código foi feita nesta análise; apenas revisão e documentação para orientar o diagnóstico.
