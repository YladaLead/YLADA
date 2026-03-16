# Gateway de pagamento por país

## Regra atual

| País / Região | Gateway | Moeda |
|---------------|---------|-------|
| **Brasil (BR)** | Mercado Pago | BRL |
| **Internacional** (US, AR, MX, ES, etc.) | Stripe | USD |

- **Brasil:** Mercado Pago (PIX, cartão, boleto).
- **Internacional (inglês, espanhol):** Stripe (cartão).

## Detecção de país

1. **Prioridade:** `countryCode` enviado pelo cliente no body do checkout.
2. **Fallback:** headers de geo (`x-vercel-ip-country`, `cf-ipcountry`, etc.).
3. **Fallback adicional:** quando geo retorna US ou UNKNOWN, usa `Accept-Language`:
   - `pt-BR` ou `pt` (exceto pt-PT) → BR (evita bloquear brasileiros com VPN/proxy).

## Onde está configurado

- **`src/lib/payment-gateway.ts`** – `MERCADO_PAGO_COUNTRIES = ['BR']`; `isMercadoPagoSupported()`.
- **`src/lib/payment-helpers.ts`** – `detectCountryCode()`, `detectPaymentGateway()`.

## Webhooks

- **Mercado Pago:** `/api/webhooks/mercado-pago` (pagamentos BR).
- **Stripe:** `/api/webhooks/stripe-us` (pagamentos internacionais).

## Cancelamento e reembolso

- **Mercado Pago:** cancelamento e reembolso automático via `mercado-pago-helpers.ts` (confirm-cancel).
- **Stripe:** cancelamento via webhook; reembolso manual ou via painel Stripe.
