# Cancelamento e reembolso – como está e como deve ser

## Resumo

- **Sempre que alguém cancela:** o sistema deve **notificar o Mercado Pago** (cancelar o Preapproval) para não haver cobranças futuras.
- **Se cancelar dentro dos 7 dias e pedir reembolso:** o sistema deve **fazer o estorno direto no Mercado Pago**, além de cancelar a assinatura.

---

## Como estava funcionando (antes do ajuste)

| Etapa | Comportamento | Problema |
|-------|----------------|----------|
| Usuário cancela no app | Sistema tenta cancelar no MP usando o ID salvo na assinatura. | O ID salvo é muitas vezes do **pagamento** (`mp_123456`), mas a API de cancelamento do MP exige o **Preapproval ID**. O cancelamento no MP falhava e a assinatura continuava ativa lá. |
| Dentro dos 7 dias + pede reembolso | Sistema só **notificava o admin** (e-mail/WhatsApp). | O reembolso era **manual**; não havia estorno automático no MP. |

**Consequência:** Cliente cancelava e pedia reembolso, mas o MP não era cancelado e podia cobrar de novo; o reembolso dependia de alguém fazer no painel.

---

## Como deve ser (após o ajuste)

| Etapa | Comportamento |
|-------|----------------|
| Usuário cancela no app | 1. **Sempre** tentar cancelar no Mercado Pago (usar Preapproval ID quando existir; normalizar o ID salvo quando for `mp_sub_xxx` ou `mp_xxx`). 2. Cancelar no banco. |
| Dentro dos 7 dias + pede reembolso | 1. Cancelar no MP (como acima). 2. Buscar o **último pagamento** da assinatura no banco. 3. Chamar a **API de reembolso do MP** (`POST /v1/payments/{id}/refunds`) para esse pagamento. 4. Opcional: continuar notificando o admin (para auditoria). |

---

## O que foi implementado no código

1. **`src/lib/mercado-pago-helpers.ts`**
   - **`refundMercadoPagoPayment(paymentId, amountCents?, idempotencyKey)`** – chama `POST /v1/payments/{id}/refunds` no MP (reembolso total ou parcial).
   - **`getMercadoPagoPreapprovalIdForCancel(stripeSubscriptionId)`** – normalização do ID para cancelamento: `mp_sub_123` → `123`, `mp_123` → `123`.

2. **Rotas unificadas por área: `[area]` (wellness, nutri, coach, nutra)**
   - **`POST /api/[area]/subscription/cancel-attempt`** – registra tentativa de cancelamento e retorna oferta de retenção (qualquer área).
   - **`POST /api/[area]/subscription/confirm-cancel`** – cancela no banco e no Mercado Pago; reembolso automático se dentro dos 7 dias.
   - Detecção de gateway: se `stripe_subscription_id` começa com `mp_` ou `mp_sub_`, trata como Mercado Pago.
   - Sempre tenta cancelar no MP com o ID normalizado (preapproval).
   - Se `requestRefund && dentroGarantia`: busca o último pagamento da assinatura e chama `refundMercadoPagoPayment`; notifica o admin (e-mail/WhatsApp) para auditoria.
   - Perfil do usuário para notificação: por área (nutri_profiles, wellness_profiles, user_profiles para coach/nutra).

3. **Rotas específicas (nutri e wellness)**
   - As rotas `/api/nutri/subscription/...` e `/api/wellness/subscription/...` continuam existindo; o fluxo novo e unificado é via **`/api/[area]/subscription/...`**. Qualquer área (incluindo **nutra**) deve usar as rotas por área, ex.: `/api/nutra/subscription/cancel-attempt` e `/api/nutra/subscription/confirm-cancel`.

---

## Limitação conhecida

- Assinaturas criadas pelo **webhook de pagamento** guardam `stripe_subscription_id = mp_<payment_id>`. A API de cancelamento do MP usa **Preapproval ID**, não payment ID. Nesses casos o cancelamento no MP pode ainda falhar até que o sistema passe a guardar ou obter o Preapproval ID (ex.: ao receber evento de assinatura do MP ou ao buscar o pagamento e ler o `preapproval_id` na resposta). O cancelamento no **banco** sempre é feito; o cliente pode precisar cancelar também pelo painel do MP se aparecer nova cobrança.

---

## Referências

- Cancelar Preapproval: `PUT https://api.mercadopago.com/preapproval/{preapproval_id}` com `{ "status": "cancelled" }`.
- Reembolso: `POST https://api.mercadopago.com/v1/payments/{id}/refunds` com header `X-Idempotency-Key`. Body vazio = reembolso total.
