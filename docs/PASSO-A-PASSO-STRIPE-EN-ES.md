# Passo a passo: Stripe para vendas EN/ES (fora do Brasil)

Objetivo: **PT → Mercado Pago** | **EN/ES → Stripe**

---

## Resumo do que existe vs. falta

| Categoria | Existe | Falta |
|-----------|--------|-------|
| Código Stripe | ✅ | Ajustar lógica de gateway |
| Código Mercado Pago | ✅ | Manter como está |
| Gateway por idioma | ❌ | Implementar em payment-gateway e payment-helpers |
| Páginas EN/ES (preços, checkout, sucesso) | ❌ | Criar ou generalizar rotas |
| Links por locale | ❌ | Ajustar AreaLandingPage e PublicLinkView |
| Config Stripe US | Parcial | Conferir env e Price IDs |

---

## Fase 1 – Lógica de gateway por idioma

### 1.1 `src/lib/payment-helpers.ts`

**Problema:** `detectPaymentGateway()` sempre retorna `'mercadopago'`.

**Solução:** Criar função que escolhe gateway por `language`:

```ts
/**
 * Escolhe gateway baseado no idioma do usuário.
 * pt → Mercado Pago (Brasil e América Latina)
 * en | es → Stripe (internacional)
 */
export function getPaymentGatewayByLanguage(language?: 'pt' | 'en' | 'es'): PaymentGateway {
  if (language === 'en' || language === 'es') {
    return 'stripe'
  }
  return 'mercadopago'
}
```

Manter `detectPaymentGateway(request)` para compatibilidade, mas o `createCheckout` passará a usar `language` em vez de depender dela.

---

### 1.2 `src/lib/payment-gateway.ts`

**Mudanças necessárias:**

1. **Remover bloqueio de países fora da América Latina** quando `language` for `en` ou `es`:

```ts
// ANTES (linhas 396-416): Bloqueava todos os países fora de MERCADO_PAGO_COUNTRIES
if (!isMercadoPagoSupported(countryCode)) {
  await notifyUnsupportedCountryPayment(...)
  throw new Error(`Pagamentos disponíveis apenas para países da América Latina...`)
}

// DEPOIS: Só bloquear se for PT (Mercado Pago)
const language = request.language || 'pt'
const useStripe = language === 'en' || language === 'es'

if (!useStripe && !isMercadoPagoSupported(countryCode)) {
  await notifyUnsupportedCountryPayment(...)
  throw new Error(`Pagamentos disponíveis apenas para países da América Latina...`)
}
```

2. **Escolher gateway por `language`** em vez de `detectPaymentGateway(request)`:

```ts
// ANTES
let gateway: PaymentGateway
if (httpRequest) {
  gateway = detectPaymentGateway(httpRequest)
} else {
  gateway = 'mercadopago'
}

// DEPOIS
const gateway = useStripe ? 'stripe' : 'mercadopago'
```

3. **Garantir que `language` seja repassado** em todas as chamadas de `createCheckout` (já está no `CheckoutRequest`).

---

## Fase 2 – Páginas EN/ES

### 2.1 Estratégia de rotas

**Opção A – Rotas explícitas (recomendada):** Criar `/en/precos`, `/es/precos`, `/en/nutri/checkout`, etc.

**Opção B – Rota dinâmica:** Criar `/[locale]/precos/page.tsx` e `/[locale]/[area]/checkout/page.tsx`.

Recomendação: **Opção A** para manter consistência com a estrutura atual (`/pt/...`, `/en/...`, `/es/...`).

---

### 2.2 Páginas a criar

| Página | Ação |
|--------|------|
| `/en/precos` | Criar `src/app/en/precos/page.tsx` (reutilizar conteúdo de `pt/precos` com locale) |
| `/es/precos` | Criar `src/app/es/precos/page.tsx` (idem) |
| `/en/nutri/checkout` | Criar `src/app/en/nutri/checkout/page.tsx` |
| `/es/nutri/checkout` | Criar `src/app/es/nutri/checkout/page.tsx` |
| `/en/nutra/checkout` | Criar `src/app/es/nutra/checkout/page.tsx` |
| `/es/nutra/checkout` | Criar `src/app/es/nutra/checkout/page.tsx` |
| `/en/wellness/checkout` | Criar `src/app/en/wellness/checkout/page.tsx` |
| `/es/wellness/checkout` | Criar `src/app/es/wellness/checkout/page.tsx` |
| `/en/nutri/pagamento-sucesso` | Criar `src/app/en/nutri/pagamento-sucesso/page.tsx` |
| `/es/nutri/pagamento-sucesso` | Criar `src/app/es/nutri/pagamento-sucesso/page.tsx` |
| `/en/wellness/pagamento-sucesso` | Criar `src/app/en/wellness/pagamento-sucesso/page.tsx` |
| `/es/wellness/pagamento-sucesso` | Criar `src/app/es/wellness/pagamento-sucesso/page.tsx` |

**Coach:** Se `coach-bem-estar` mapeia para `wellness`, os checkouts EN/ES podem apontar para `/en/wellness/checkout` e `/es/wellness/checkout`.

---

### 2.3 Implementação prática

**Preços:** Extrair o conteúdo de `pt/precos/page.tsx` para um componente `PrecosPageContent` que receba `locale: 'pt' | 'en' | 'es'`. As páginas `/pt/precos`, `/en/precos` e `/es/precos` importam esse componente passando o locale.

**Checkout:** As páginas de checkout precisam:
- Passar `language` na chamada à API (ex.: `language: 'en'` ou `language: 'es'`)
- O front-end já chama `/api/[area]/checkout`; o body deve incluir `language` conforme o locale da URL

**Pagamento sucesso:** Copiar a lógica de `pt/nutri/pagamento-sucesso` e `pt/wellness/pagamento-sucesso`, adaptando textos para EN/ES quando necessário. O Stripe já redireciona para `/${language}/${area}/pagamento-sucesso`.

---

## Fase 3 – Links e CTAs

### 3.1 `AreaLandingPage` (`src/components/ylada/AreaLandingPage.tsx`)

**Problema:** `AREA_TO_CHECKOUT` está hardcoded com `/pt/...`:

```ts
const AREA_TO_CHECKOUT: Record<AreaLandingArea, string> = {
  nutri: '/pt/nutri/checkout',
  nutra: '/pt/nutra/checkout',
  'coach-bem-estar': '/pt/wellness/checkout',
  // ...
}
```

**Solução:** Usar `locale` para montar o path:

```ts
// Função helper
function getCheckoutPath(area: AreaLandingArea, locale: Language): string {
  const base: Record<AreaLandingArea, string> = {
    nutri: '/nutri/checkout',
    nutra: '/nutra/checkout',
    'coach-bem-estar': '/wellness/checkout',
    // ... demais áreas usam nutri
  }
  const segment = base[area] ?? '/nutri/checkout'
  return `/${locale}${segment}`
}

// Uso
const checkoutBase = getCheckoutPath(area, locale)
```

**Footer – link Planos:** Já existe `locale === 'pt' ? '/pt/precos' : \`${appBasePath}/precos\``. Ajustar para `/${locale}/precos` quando as páginas EN/ES existirem.

---

### 3.2 `PublicLinkView` (`src/components/ylada/PublicLinkView.tsx`)

**Problema:** Na tela de limite (freemium), os links "Ver planos" e "Criar meu diagnóstico" apontam para `/pt/precos` (linhas 463-469).

**Solução:** Usar `locale` para montar a URL:

```tsx
<a href={`/${locale}/precos`} ...>
  {verPlanos}
</a>
<a href={`/${locale}/precos`} ...>
  {criarMeu}
</a>
```

---

### 3.3 Outros arquivos com links hardcoded

| Arquivo | Link | Ação |
|---------|------|------|
| `NoelChat.tsx` | `upgrade_url || '/pt/precos'` | Receber locale do contexto ou usar path dinâmico |
| `InstitutionalPageContent.tsx` | `getLocalizedPath('/pt/precos', locale)` | Verificar se já usa locale corretamente |
| `PainelPageContent.tsx` | `href="/pt/precos"` | Painel é sempre PT; manter |
| `pt/resultado/page.tsx` | `/pt/precos` | Página PT; manter |
| `pt/links/page.tsx` | `/pt/precos` | Página PT; manter |

---

## Fase 4 – auth-server (rotas públicas)

**Arquivo:** `src/lib/auth-server.ts`

**Problema:** As rotas públicas estão fixas em `/pt/...`:

```ts
const NUTRI_PUBLIC_PREFIXES = [
  '/pt/nutri/login',
  '/pt/nutri/checkout',
  '/pt/nutri/pagamento-sucesso',
  // ...
]
```

**Solução:** Incluir equivalentes EN/ES ou usar regex:

```ts
// Opção: adicionar prefixos para en e es
'/en/nutri/checkout',
'/en/nutri/pagamento-sucesso',
'/es/nutri/checkout',
'/es/nutri/pagamento-sucesso',
// ou regex: /^\/(pt|en|es)\/nutri\/(checkout|pagamento-sucesso)/
```

O mesmo vale para `WELLNESS_PUBLIC_PREFIXES`, `COACH_PUBLIC_PREFIXES` e `NUTRI_PUBLIC_PREFIXES`.

---

## Fase 5 – Configuração Stripe US

### 5.1 Variáveis de ambiente

Adicionar ao `.env.local` (e produção):

```
STRIPE_SECRET_KEY_US=sk_live_...
STRIPE_WEBHOOK_SECRET_US=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US=pk_live_...

# Price IDs por área (US)
STRIPE_PRICE_WELLNESS_MONTHLY_US=price_...
STRIPE_PRICE_WELLNESS_ANNUAL_US=price_...
STRIPE_PRICE_NUTRI_MONTHLY_US=price_...
STRIPE_PRICE_NUTRI_ANNUAL_US=price_...
STRIPE_PRICE_COACH_MONTHLY_US=price_...
STRIPE_PRICE_COACH_ANNUAL_US=price_...
STRIPE_PRICE_NUTRA_MONTHLY_US=price_...
STRIPE_PRICE_NUTRA_ANNUAL_US=price_...
```

### 5.2 Webhook Stripe

1. No Stripe Dashboard (conta US): Developers → Webhooks
2. Endpoint: `https://seu-dominio.com/api/webhooks/stripe-us`
3. Eventos: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
4. Copiar o Signing Secret para `STRIPE_WEBHOOK_SECRET_US`

### 5.3 Produtos e Prices no Stripe

Criar produtos e preços em USD para cada área (wellness, nutri, coach, nutra) – mensal e anual – e preencher os Price IDs nas variáveis acima.

---

## Fase 6 – Cancelamento e reembolso

- **confirm-cancel:** Já diferencia MP vs Stripe por `stripe_subscription_id`.
- **Reembolso Stripe:** Verificar se está implementado em `src/lib/refund-notifications.ts` e nas rotas de cancelamento. Se houver TODO para MP, adicionar lógica equivalente para Stripe.

---

## Ordem sugerida de implementação

1. **Fase 1** – payment-helpers + payment-gateway (desbloqueia Stripe por idioma)
2. **Fase 5** – Config Stripe (env, webhook, produtos)
3. **Fase 2** – Páginas EN/ES (preços, checkout, sucesso)
4. **Fase 3** – Links (AreaLandingPage, PublicLinkView)
5. **Fase 4** – auth-server (rotas públicas)
6. **Fase 6** – Revisar cancelamento/reembolso Stripe

---

## Checklist final

- [ ] `getPaymentGatewayByLanguage()` em payment-helpers
- [ ] payment-gateway: gateway por language, sem bloqueio para en/es
- [ ] Variáveis Stripe US no .env
- [ ] Webhook Stripe US configurado
- [ ] Price IDs Stripe US criados
- [ ] `/en/precos` e `/es/precos`
- [ ] `/en/nutri/checkout`, `/es/nutri/checkout`
- [ ] `/en/nutra/checkout`, `/es/nutra/checkout`
- [ ] `/en/wellness/checkout`, `/es/wellness/checkout`
- [ ] Páginas pagamento-sucesso EN/ES
- [ ] AreaLandingPage: checkoutBase por locale
- [ ] PublicLinkView: links para `/${locale}/precos`
- [ ] auth-server: rotas públicas EN/ES
- [ ] Teste fluxo completo: EN landing → checkout → Stripe → sucesso
