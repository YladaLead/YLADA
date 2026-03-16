# Configuração: Checkout fora do Brasil com Stripe

**Regra:** Brasil (e América Latina onde o Mercado Pago opera) → **Mercado Pago**. Resto do mundo → **Stripe**.

O código já está preparado: o gateway é escolhido automaticamente pelo **país** (detectado por IP/headers ou enviado pelo front). Só falta configurar o Stripe e as variáveis de ambiente.

---

## Passo a passo

### 1. Conta Stripe (internacional)

- Crie ou use uma conta em [stripe.com](https://stripe.com) (modo **US** ou **Global**).
- Em **Developers → API keys** copie:
  - **Secret key** (sk_live_... ou sk_test_...)
  - **Publishable key** (pk_live_... ou pk_test_...)

### 2. Variáveis de ambiente

No `.env.local` (e no ambiente de produção, ex.: Vercel) adicione:

```bash
# Stripe US / Internacional (fora do Brasil)
STRIPE_SECRET_KEY_US=sk_live_xxxxxxxx
# Ou para teste:
# STRIPE_SECRET_KEY_US_TEST=sk_test_xxxxxxxx

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US=pk_live_xxxxxxxx
# Ou para teste:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US_TEST=pk_test_xxxxxxxx
```

Para **produção** pode usar sufixo `_LIVE` se quiser separar de teste:

```bash
STRIPE_SECRET_KEY_US_LIVE=sk_live_...
STRIPE_WEBHOOK_SECRET_US_LIVE=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US_LIVE=pk_live_...
```

O código usa `STRIPE_SECRET_KEY_US` ou `STRIPE_SECRET_KEY_US_TEST` conforme `NODE_ENV`.

### 3. Produtos e preços no Stripe

No **Stripe Dashboard → Products** crie um produto por área/plano (ou um produto por área com dois preços: mensal e anual). Depois crie **Prices** em **USD**.

Exemplo de nomes sugeridos:

| Área    | Plano  | Sugestão de valor USD | Uso no .env |
|---------|--------|------------------------|-------------|
| wellness| monthly| 15                     | Price ID mensal |
| wellness| annual | 150                    | Price ID anual |
| nutri   | monthly| 25                     | Price ID mensal |
| nutri   | annual | 198                    | Price ID anual |
| coach   | monthly| 25                     | Price ID mensal |
| coach   | annual | 198                    | Price ID anual |
| nutra   | monthly| 25                     | Price ID mensal |
| nutra   | annual | 198                    | Price ID anual |

Copie os **Price IDs** (ex.: `price_1ABC...`) e coloque no `.env`:

```bash
# Stripe Price IDs (USD) – usado para checkout fora do Brasil
STRIPE_PRICE_WELLNESS_MONTHLY_US=price_xxxxxxxx
STRIPE_PRICE_WELLNESS_ANNUAL_US=price_xxxxxxxx
STRIPE_PRICE_NUTRI_MONTHLY_US=price_xxxxxxxx
STRIPE_PRICE_NUTRI_ANNUAL_US=price_xxxxxxxx
STRIPE_PRICE_COACH_MONTHLY_US=price_xxxxxxxx
STRIPE_PRICE_COACH_ANNUAL_US=price_xxxxxxxx
STRIPE_PRICE_NUTRA_MONTHLY_US=price_xxxxxxxx
STRIPE_PRICE_NUTRA_ANNUAL_US=price_xxxxxxxx
```

Se algum não estiver definido, o checkout Stripe vai falhar com erro indicando qual variável falta.

### 4. Webhook Stripe

Para ativar assinatura e acesso após o pagamento:

1. **Stripe Dashboard → Developers → Webhooks → Add endpoint**
2. **URL:** `https://seu-dominio.com/api/webhooks/stripe-us`
3. **Eventos** (mínimo):
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copie o **Signing secret** (whsec_...) e adicione:

```bash
STRIPE_WEBHOOK_SECRET_US=whsec_xxxxxxxx
# Ou em produção:
# STRIPE_WEBHOOK_SECRET_US_LIVE=whsec_xxxxxxxx
```

### 5. Detecção de país

- O **front** pode enviar `countryCode` no body da API de checkout (ex.: `BR`, `US`, `PT`).
- Se não enviar, o backend usa headers (ex.: `x-vercel-ip-country`, `cf-ipcountry`) para detectar o país.
- **BR** (e outros países da lista do Mercado Pago) → checkout com **Mercado Pago**.
- Qualquer outro país → checkout com **Stripe**.

### 6. Páginas de sucesso (opcional)

Após o pagamento, o Stripe redireciona para:

`/{language}/{area}/pagamento-sucesso?session_id=...&gateway=stripe`

Exemplos: `/en/nutri/pagamento-sucesso`, `/es/nutra/pagamento-sucesso`. Se essas rotas não existirem, crie páginas em `src/app/en/...` e `src/app/es/...` para não dar 404. O fluxo de “pagamento concluído” e liberação de acesso é tratado pelo webhook; a página de sucesso é só confirmação para o usuário.

---

## Resumo

| Onde configurar | O quê |
|-----------------|--------|
| **.env** | `STRIPE_SECRET_KEY_US`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US`, `STRIPE_WEBHOOK_SECRET_US` |
| **.env** | `STRIPE_PRICE_{AREA}_{MONTHLY\|ANNUAL}_US` para wellness, nutri, coach, nutra |
| **Stripe Dashboard** | Produtos e preços em USD; webhook para ` /api/webhooks/stripe-us` |
| **Código** | Já ajustado: Brasil/LATAM → Mercado Pago, resto → Stripe |

Depois disso, clientes fora do Brasil (ou com `countryCode` diferente de BR/LATAM) passam automaticamente a usar o checkout Stripe.
