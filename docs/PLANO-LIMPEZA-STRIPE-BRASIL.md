# 🧹 PLANO DE LIMPEZA: REMOVER STRIPE BRASIL

## ⚠️ OBJETIVO

Remover todas as configurações e referências ao Stripe Brasil, já que:
- ✅ Brasil usará **Mercado Pago**
- ✅ Stripe será apenas para **internacional** (não-BR)

---

## 📋 ESTRATÉGIA: LIMPEZA GRADUAL E SEGURA

### FASE 1: Atualizar Lógica (Não quebra nada)
- Modificar detecção de país para usar Mercado Pago no BR
- Manter código Stripe BR comentado (para referência)

### FASE 2: Remover Variáveis de Ambiente
- Remover do `.env.local`
- Remover da Vercel (depois de testar)

### FASE 3: Limpar Documentação
- Mover docs obsoletos para pasta `docs/archive/`
- Atualizar docs principais

### FASE 4: Remover Código (Depois de testar Mercado Pago)
- Comentar/remover webhook stripe-br
- Limpar referências no código

---

## 🔧 FASE 1: ATUALIZAR LÓGICA DE DETECÇÃO

### 1.1. Modificar `detectCountry()` para usar Mercado Pago

**Arquivo**: `src/lib/stripe-helpers.ts`

```typescript
// ANTES: Retornava 'br' para Brasil
// DEPOIS: Retornar 'us' para Brasil (já que BR usará Mercado Pago)

export function detectCountry(request: Request): StripeAccount {
  const countryCode = request.headers.get('x-vercel-ip-country') || 
                      request.headers.get('cf-ipcountry') || ''
  
  // ⚠️ BRASIL AGORA USA MERCADO PAGO (não Stripe)
  // Se for BR, retornar 'us' como fallback (mas não será usado)
  // A lógica de checkout decidirá usar Mercado Pago
  
  if (countryCode && BR_ACCOUNT_COUNTRIES.includes(countryCode.toUpperCase())) {
    // Brasil e América Latina → Mercado Pago (não Stripe)
    // Retornar 'us' como fallback, mas checkout usará Mercado Pago
    return 'us' // Não será usado para BR, mas mantém compatibilidade
  }
  
  return 'us'
}
```

**OU MELHOR**: Criar função separada para detectar gateway:

```typescript
export type PaymentGateway = 'mercadopago' | 'stripe'

export function detectPaymentGateway(request: Request): PaymentGateway {
  const countryCode = request.headers.get('x-vercel-ip-country') || 
                      request.headers.get('cf-ipcountry') || ''
  
  // Brasil → Mercado Pago
  if (countryCode === 'BR') {
    return 'mercadopago'
  }
  
  // Resto do mundo → Stripe
  return 'stripe'
}
```

---

## 🗑️ FASE 2: REMOVER VARIÁVEIS DE AMBIENTE

### 2.1. Variáveis a Remover do `.env.local`

```env
# ❌ REMOVER ESTAS:
STRIPE_SECRET_KEY_BR=sk_test_...
STRIPE_SECRET_KEY_BR_TEST=sk_test_...
STRIPE_SECRET_KEY_BR_LIVE=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR_TEST=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR_LIVE=pk_live_...
STRIPE_WEBHOOK_SECRET_BR=whsec_...
STRIPE_WEBHOOK_SECRET_BR_TEST=whsec_...
STRIPE_WEBHOOK_SECRET_BR_LIVE=whsec_...
STRIPE_CONNECT_CLIENT_ID_BR=ca_...
STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_...
STRIPE_PRICE_WELLNESS_ANNUAL_BR=price_...
STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR=price_...
```

### 2.2. Variáveis a Manter (Stripe US - Internacional)

```env
# ✅ MANTER ESTAS:
STRIPE_SECRET_KEY_US=sk_test_...
STRIPE_SECRET_KEY_US_TEST=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US_TEST=pk_test_...
STRIPE_WEBHOOK_SECRET_US=whsec_...
STRIPE_PRICE_WELLNESS_MONTHLY_US=price_...
STRIPE_PRICE_WELLNESS_ANNUAL_US=price_...
```

### 2.3. Remover da Vercel

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Remova todas as variáveis que contêm `_BR`:
   - `STRIPE_SECRET_KEY_BR`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR`
   - `STRIPE_WEBHOOK_SECRET_BR`
   - `STRIPE_PRICE_WELLNESS_MONTHLY_BR`
   - `STRIPE_PRICE_WELLNESS_ANNUAL_BR`
   - etc.

---

## 📁 FASE 3: LIMPAR DOCUMENTAÇÃO

### 3.1. Documentos a Mover para `docs/archive/`

```bash
# Criar pasta de arquivo
mkdir -p docs/archive/stripe-br

# Mover docs obsoletos
mv docs/CONFIGURAR-PRODUTOS-STRIPE-BRASIL.md docs/archive/stripe-br/
mv docs/ESTRATEGIA-MULTI-PAIS.md docs/archive/stripe-br/
mv docs/HABILITAR-PIX-PARCELAMENTO-BRASIL.md docs/archive/stripe-br/
mv docs/VERIFICACAO-PARCELAMENTO-STRIPE.md docs/archive/stripe-br/
mv docs/CONFIGURAR-PLANO-ANUAL-PARCELADO.md docs/archive/stripe-br/
mv docs/IMPLEMENTACAO-PARCELAMENTO-ANUAL.md docs/archive/stripe-br/
mv TESTE-WEBHOOK-STRIPE.md docs/archive/stripe-br/
```

### 3.2. Atualizar Documentos Principais

**Arquivo**: `docs/ESTRATEGIA-MULTI-PAIS.md` → Atualizar ou arquivar

**Arquivo**: `README.md` → Remover referências ao Stripe BR

---

## 🗂️ FASE 4: LIMPAR CÓDIGO

### 4.1. Arquivos a Comentar/Remover

#### Webhook Stripe BR
**Arquivo**: `src/app/api/webhooks/stripe-br/route.ts`

```typescript
// ⚠️ DEPRECADO: Brasil agora usa Mercado Pago
// Este webhook não será mais usado para novos pagamentos BR
// Mantido apenas para processar pagamentos antigos pendentes

// TODO: Remover após confirmar que não há pagamentos pendentes
```

**Ação**: Comentar o arquivo ou adicionar log de deprecação

#### Checkout Route
**Arquivo**: `src/app/api/wellness/checkout/route.ts`

Atualizar para usar Mercado Pago quando `countryCode === 'BR'`

#### Stripe Helpers
**Arquivo**: `src/lib/stripe-helpers.ts`

- Comentar função `getStripeConfig('br')`
- Atualizar `detectCountry()` ou criar `detectPaymentGateway()`

### 4.2. Scripts

**Arquivo**: `scripts/create-stripe-products.js`

- Remover lógica de criação de produtos BR
- Manter apenas US

---

## ✅ CHECKLIST DE LIMPEZA

### Variáveis de Ambiente
- [ ] Remover `STRIPE_SECRET_KEY_BR*` do `.env.local`
- [ ] Remover `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR*` do `.env.local`
- [ ] Remover `STRIPE_WEBHOOK_SECRET_BR*` do `.env.local`
- [ ] Remover `STRIPE_PRICE_WELLNESS_*_BR` do `.env.local`
- [ ] Remover todas as variáveis `_BR` da Vercel

### Código
- [ ] Atualizar `detectCountry()` ou criar `detectPaymentGateway()`
- [ ] Atualizar checkout para usar Mercado Pago no BR
- [ ] Comentar webhook `stripe-br` (com aviso de deprecação)
- [ ] Atualizar `stripe-helpers.ts` para remover referências BR
- [ ] Atualizar scripts de criação de produtos

### Documentação
- [ ] Mover docs obsoletos para `docs/archive/stripe-br/`
- [ ] Atualizar `README.md`
- [ ] Criar doc explicando migração para Mercado Pago

### Testes
- [ ] Testar checkout BR (deve usar Mercado Pago)
- [ ] Testar checkout internacional (deve usar Stripe)
- [ ] Verificar que não há erros no console
- [ ] Confirmar que webhook Stripe US ainda funciona

---

## 🚨 ATENÇÃO: NÃO REMOVER AINDA

### Manter Temporariamente (para segurança):

1. **Webhook Stripe BR** (`/api/webhooks/stripe-br`)
   - Pode haver pagamentos pendentes
   - Manter por 30 dias após migração
   - Adicionar log de deprecação

2. **Histórico de Pagamentos**
   - Não remover registros do banco
   - Manter `stripe_account: 'br'` nos registros antigos

3. **Código de Fallback**
   - Manter lógica de detecção comentada
   - Pode ser útil para rollback

---

## 📝 COMANDOS PARA EXECUTAR

### 1. Criar pasta de arquivo
```bash
mkdir -p docs/archive/stripe-br
```

### 2. Mover documentação
```bash
# Mover docs obsoletos (se existirem)
mv docs/CONFIGURAR-PRODUTOS-STRIPE-BRASIL.md docs/archive/stripe-br/ 2>/dev/null || true
mv docs/ESTRATEGIA-MULTI-PAIS.md docs/archive/stripe-br/ 2>/dev/null || true
```

### 3. Limpar .env.local
```bash
# Criar backup primeiro
cp .env.local .env.local.backup

# Remover linhas com _BR (manualmente ou com sed)
# sed -i '' '/_BR/d' .env.local
```

---

## 🎯 RESULTADO FINAL

Após limpeza:
- ✅ Brasil → Mercado Pago
- ✅ Internacional → Stripe US
- ✅ Código limpo e organizado
- ✅ Sem variáveis desnecessárias
- ✅ Documentação atualizada

---

## 📞 PRÓXIMOS PASSOS

1. **Agora**: Remover variáveis do `.env.local`
2. **Depois**: Atualizar código para usar Mercado Pago
3. **Depois**: Remover variáveis da Vercel
4. **Por último**: Limpar código e documentação

**Quer que eu comece a limpeza agora?**

