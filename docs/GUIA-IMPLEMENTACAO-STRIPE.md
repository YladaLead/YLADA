# 🚀 GUIA COMPLETO: IMPLEMENTAÇÃO STRIPE - YLADA

## 📋 ÍNDICE

1. [Configuração no Stripe Dashboard](#1-configuração-no-stripe-dashboard)
2. [Informações Necessárias](#2-informações-necessárias)
3. [Schema do Banco de Dados](#3-schema-do-banco-de-dados)
4. [Variáveis de Ambiente](#4-variáveis-de-ambiente)
5. [Implementação Técnica](#5-implementação-técnica)
6. [Webhooks](#6-webhooks)
7. [Testes](#7-testes)
8. [Checklist Final](#8-checklist-final)

---

## 1. CONFIGURAÇÃO NO STRIPE DASHBOARD

### 🔴 PASSO 1.1: Criar Produtos na Conta Stripe Brasil

**Acesse:** https://dashboard.stripe.com → Conta Brasil

#### Criar 8 Produtos:

1. **Wellness Mensal**
   - Nome: `YLADA Wellness - Plano Mensal`
   - Descrição: `Assinatura mensal da área Wellness - YLADA`
   - Preço: `$60.00 USD`
   - Tipo: `Recurring` → `Monthly`
   - **Metadata:**
     - `area`: `wellness`
     - `plan_type`: `monthly`
   - **✅ Copiar Price ID:** `price_xxxxxxxxxxxxx` (ex: `price_1ABC123...`)

2. **Wellness Anual**
   - Nome: `YLADA Wellness - Plano Anual`
   - Descrição: `Assinatura anual da área Wellness - YLADA`
   - Preço: `$570.00 USD`
   - Tipo: `Recurring` → `Yearly`
   - **Metadata:**
     - `area`: `wellness`
     - `plan_type`: `annual`
   - **✅ Copiar Price ID:** `price_xxxxxxxxxxxxx`

3. **Nutri Mensal**
   - Nome: `YLADA Nutri - Plano Mensal`
   - Preço: `$79.00 USD`
   - Tipo: `Recurring` → `Monthly`
   - **Metadata:**
     - `area`: `nutri`
     - `plan_type`: `monthly`
   - **✅ Copiar Price ID:** `price_xxxxxxxxxxxxx`

4. **Nutri Anual**
   - Nome: `YLADA Nutri - Plano Anual`
   - Preço: `$790.00 USD`
   - Tipo: `Recurring` → `Yearly`
   - **Metadata:**
     - `area`: `nutri`
     - `plan_type`: `annual`
   - **✅ Copiar Price ID:** `price_xxxxxxxxxxxxx`

5. **Coach Mensal**
   - Nome: `YLADA Coach - Plano Mensal`
   - Preço: `$99.00 USD`
   - Tipo: `Recurring` → `Monthly`
   - **Metadata:**
     - `area`: `coach`
     - `plan_type`: `monthly`
   - **✅ Copiar Price ID:** `price_xxxxxxxxxxxxx`

6. **Coach Anual**
   - Nome: `YLADA Coach - Plano Anual`
   - Preço: `$990.00 USD`
   - Tipo: `Recurring` → `Yearly`
   - **Metadata:**
     - `area`: `coach`
     - `plan_type`: `annual`
   - **✅ Copiar Price ID:** `price_xxxxxxxxxxxxx`

7. **Nutra Mensal**
   - Nome: `YLADA Nutra - Plano Mensal`
   - Preço: `$69.00 USD`
   - Tipo: `Recurring` → `Monthly`
   - **Metadata:**
     - `area`: `nutra`
     - `plan_type`: `monthly`
   - **✅ Copiar Price ID:** `price_xxxxxxxxxxxxx`

8. **Nutra Anual**
   - Nome: `YLADA Nutra - Plano Anual`
   - Preço: `$690.00 USD`
   - Tipo: `Recurring` → `Yearly`
   - **Metadata:**
     - `area`: `nutra`
     - `plan_type`: `annual`
   - **✅ Copiar Price ID:** `price_xxxxxxxxxxxxx`

**📝 Criar planilha Excel/Google Sheets com todos os Price IDs da conta BR**

---

### 🔴 PASSO 1.2: Criar Produtos na Conta Stripe EUA

**Acesse:** https://dashboard.stripe.com → Conta EUA

**Repetir os mesmos 8 produtos** com os mesmos valores e metadata.

**✅ Copiar todos os Price IDs da conta US**

**📝 Adicionar na planilha os Price IDs da conta US**

---

### 🔴 PASSO 1.3: Configurar Multi-Currency

**Para cada produto criado:**

1. Abrir produto no Stripe Dashboard
2. Clicar em "Add another currency"
3. Adicionar moedas:
   - **BRL** (Real Brasileiro)
   - **EUR** (Euro)
   - **MXN** (Peso Mexicano)
   - **ARS** (Peso Argentino)
   - Outras moedas conforme necessário

4. Stripe vai converter automaticamente usando taxa de câmbio atual

**✅ Verificar que todos os produtos têm Multi-Currency habilitado**

---

### 🔴 PASSO 1.4: Configurar Webhooks

#### Webhook Conta Brasil:

1. **Acesse:** Stripe Dashboard → Conta BR → Developers → Webhooks
2. **Clicar:** "Add endpoint"
3. **URL:** `https://ylada.app/api/webhooks/stripe-br`
   - (Usar URL de produção quando deployar)
   - Para testes: usar Stripe CLI (ver seção de testes)
4. **Eventos para escutar:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. **✅ Copiar Webhook Signing Secret:** `whsec_xxxxxxxxxxxxx`

#### Webhook Conta EUA:

1. **Repetir processo** na conta US
2. **URL:** `https://ylada.app/api/webhooks/stripe-us`
3. **Mesmos eventos**
4. **✅ Copiar Webhook Signing Secret:** `whsec_xxxxxxxxxxxxx`

---

### 🔴 PASSO 1.5: Configurar Stripe Connect (Afiliados)

1. **Acesse:** Stripe Dashboard → Settings → Connect
2. **Habilitar:** Stripe Connect
3. **Escolher:** "Express accounts"
4. **Configurar:** 
   - Branding (logo, cores)
   - Terms of Service
   - Privacy Policy
5. **✅ Copiar Connect Client ID:** `ca_xxxxxxxxxxxxx`

**Repetir para ambas as contas (BR e US)**

---

### 🔴 PASSO 1.6: Coletar API Keys

#### Conta Stripe Brasil:

1. **Acesse:** Developers → API Keys
2. **Copiar:**
   - ✅ **Secret Key:** `sk_live_xxxxxxxxxxxxx` (produção)
   - ✅ **Publishable Key:** `pk_live_xxxxxxxxxxxxx` (produção)
   - ✅ **Test Secret Key:** `sk_test_xxxxxxxxxxxxx` (testes)
   - ✅ **Test Publishable Key:** `pk_test_xxxxxxxxxxxxx` (testes)

#### Conta Stripe EUA:

1. **Repetir processo** na conta US
2. **Copiar todas as chaves**

---

## 2. INFORMAÇÕES NECESSÁRIAS

### 📋 Checklist de Informações para Coletar:

#### Conta Stripe Brasil:
- [ ] Secret Key (Live): `sk_live_...`
- [ ] Publishable Key (Live): `pk_live_...`
- [ ] Secret Key (Test): `sk_test_...`
- [ ] Publishable Key (Test): `pk_test_...`
- [ ] Webhook Secret BR: `whsec_...`
- [ ] Connect Client ID BR: `ca_...`
- [ ] Price IDs Wellness Mensal BR: `price_...`
- [ ] Price IDs Wellness Anual BR: `price_...`
- [ ] Price IDs Nutri Mensal BR: `price_...`
- [ ] Price IDs Nutri Anual BR: `price_...`
- [ ] Price IDs Coach Mensal BR: `price_...`
- [ ] Price IDs Coach Anual BR: `price_...`
- [ ] Price IDs Nutra Mensal BR: `price_...`
- [ ] Price IDs Nutra Anual BR: `price_...`

#### Conta Stripe EUA:
- [ ] Secret Key (Live): `sk_live_...`
- [ ] Publishable Key (Live): `pk_live_...`
- [ ] Secret Key (Test): `sk_test_...`
- [ ] Publishable Key (Test): `pk_test_...`
- [ ] Webhook Secret US: `whsec_...`
- [ ] Connect Client ID US: `ca_...`
- [ ] Price IDs Wellness Mensal US: `price_...`
- [ ] Price IDs Wellness Anual US: `price_...`
- [ ] Price IDs Nutri Mensal US: `price_...`
- [ ] Price IDs Nutri Anual US: `price_...`
- [ ] Price IDs Coach Mensal US: `price_...`
- [ ] Price IDs Coach Anual US: `price_...`
- [ ] Price IDs Nutra Mensal US: `price_...`
- [ ] Price IDs Nutra Anual US: `price_...`

**Total: 32 informações para coletar**

---

## 3. SCHEMA DO BANCO DE DADOS

### 📄 Arquivo: `schema-subscriptions.sql`

```sql
-- =====================================================
-- YLADA - SCHEMA PARA ASSINATURAS E PAGAMENTOS
-- Suporta Stripe com múltiplas contas e áreas
-- =====================================================

-- =====================================================
-- TABELA: subscriptions
-- Armazena assinaturas dos usuários
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identificação da área e plano
  area VARCHAR(50) NOT NULL CHECK (area IN ('wellness', 'nutri', 'coach', 'nutra')),
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('monthly', 'annual')),
  
  -- Informações Stripe
  stripe_account VARCHAR(10) NOT NULL CHECK (stripe_account IN ('br', 'us')),
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_price_id VARCHAR(255) NOT NULL,
  
  -- Informações financeiras
  amount INTEGER NOT NULL, -- Valor em centavos
  currency VARCHAR(3) DEFAULT 'usd',
  
  -- Status e datas
  status VARCHAR(50) NOT NULL DEFAULT 'active', 
    -- 'active', 'canceled', 'past_due', 'unpaid', 'trialing', 'incomplete'
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  
  -- Afiliado (se aplicável)
  affiliate_id UUID REFERENCES affiliates(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: payments
-- Histórico de pagamentos
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informações Stripe
  stripe_account VARCHAR(10) NOT NULL CHECK (stripe_account IN ('br', 'us')),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_invoice_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  
  -- Informações financeiras
  amount INTEGER NOT NULL, -- Valor em centavos
  currency VARCHAR(3) DEFAULT 'usd',
  amount_refunded INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(50) NOT NULL,
    -- 'succeeded', 'pending', 'failed', 'refunded', 'partially_refunded'
  
  -- Informações adicionais
  receipt_url TEXT,
  payment_method VARCHAR(50), -- 'card', 'bank_transfer', etc
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: affiliates
-- Sistema de afiliados (Stripe Connect)
-- =====================================================
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Informações Stripe Connect
  stripe_connect_account_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_connect_account_status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'active', 'suspended', 'disabled'
  
  -- Informações do afiliado
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 20.00, -- % de comissão
  
  -- Status e estatísticas
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'inactive'
  total_earnings DECIMAL(10,2) DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  total_revenue_generated DECIMAL(10,2) DEFAULT 0,
  
  -- Informações pessoais (opcional)
  name VARCHAR(255),
  email VARCHAR(255),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: affiliate_conversions
-- Rastreamento de conversões de afiliados
-- =====================================================
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informações da conversão
  referral_code VARCHAR(50) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  
  -- Informações Stripe
  stripe_transfer_id VARCHAR(255), -- ID da transferência Stripe
  stripe_account VARCHAR(10) NOT NULL CHECK (stripe_account IN ('br', 'us')),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
    -- 'pending', 'paid', 'cancelled', 'refunded'
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_area ON subscriptions(area);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_stripe_connect_account_id ON affiliates(stripe_connect_account_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_affiliate_id ON affiliate_conversions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_referral_code ON affiliate_conversions(referral_code);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at
  BEFORE UPDATE ON affiliates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_conversions_updated_at
  BEFORE UPDATE ON affiliate_conversions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;

-- Políticas para subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para payments
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para affiliates
DROP POLICY IF EXISTS "Users can view own affiliate account" ON affiliates;
CREATE POLICY "Users can view own affiliate account" ON affiliates
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para affiliate_conversions (afiliado vê suas próprias conversões)
DROP POLICY IF EXISTS "Affiliates can view own conversions" ON affiliate_conversions;
CREATE POLICY "Affiliates can view own conversions" ON affiliate_conversions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM affiliates 
      WHERE affiliates.id = affiliate_conversions.affiliate_id 
      AND affiliates.user_id = auth.uid()
    )
  );
```

---

## 4. VARIÁVEIS DE AMBIENTE

### 📄 Arquivo: `.env.local` (desenvolvimento)

```env
# =====================================================
# STRIPE - CONTA BRASIL
# =====================================================
STRIPE_SECRET_KEY_BR=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY_BR=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET_BR=whsec_xxxxxxxxxxxxx
STRIPE_CONNECT_CLIENT_ID_BR=ca_xxxxxxxxxxxxx

# =====================================================
# STRIPE - CONTA EUA
# =====================================================
STRIPE_SECRET_KEY_US=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY_US=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET_US=whsec_xxxxxxxxxxxxx
STRIPE_CONNECT_CLIENT_ID_US=ca_xxxxxxxxxxxxx

# =====================================================
# STRIPE - PRICE IDs (CONTA BR)
# =====================================================
STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_WELLNESS_ANNUAL_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRI_MONTHLY_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRI_ANNUAL_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_COACH_MONTHLY_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_COACH_ANNUAL_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRA_MONTHLY_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRA_ANNUAL_BR=price_xxxxxxxxxxxxx

# =====================================================
# STRIPE - PRICE IDs (CONTA US)
# =====================================================
STRIPE_PRICE_WELLNESS_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_WELLNESS_ANNUAL_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRI_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRI_ANNUAL_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_COACH_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_COACH_ANNUAL_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRA_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRA_ANNUAL_US=price_xxxxxxxxxxxxx

# =====================================================
# APP
# =====================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL_PRODUCTION=https://ylada.app
```

### 📄 Configurar no Vercel (produção):

1. Acesse: Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. Adicione todas as variáveis acima
3. **Importante:** Trocar `sk_test_` por `sk_live_` e `pk_test_` por `pk_live_` em produção

---

## 5. IMPLEMENTAÇÃO TÉCNICA

### 📂 Estrutura de Arquivos:

```
src/
├── lib/
│   ├── stripe/
│   │   ├── config.ts          # Configuração Stripe
│   │   ├── get-stripe-account.ts  # Detectar conta BR/US
│   │   └── get-price-id.ts    # Buscar Price ID correto
│   └── stripe-client.ts       # Cliente Stripe inicializado
│
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts       # Criar sessão de checkout
│   │   ├── webhooks/
│   │   │   ├── stripe-br/
│   │   │   │   └── route.ts   # Webhook conta BR
│   │   │   └── stripe-us/
│   │   │       └── route.ts   # Webhook conta US
│   │   ├── affiliates/
│   │   │   ├── connect/
│   │   │   │   └── route.ts   # Onboarding afiliado
│   │   │   └── route.ts        # CRUD afiliados
│   │   └── subscriptions/
│   │       └── route.ts       # Gerenciar assinaturas
│   │
│   └── pt/
│       └── [area]/
│           └── checkout/
│               └── page.tsx   # Página de checkout
```

### 📄 Próximos arquivos a criar:

1. `src/lib/stripe/config.ts` - Configuração centralizada
2. `src/lib/stripe/get-stripe-account.ts` - Detectar conta
3. `src/lib/stripe/get-price-id.ts` - Buscar Price ID
4. `src/lib/stripe-client.ts` - Cliente Stripe
5. `src/app/api/checkout/route.ts` - API de checkout
6. `src/app/api/webhooks/stripe-br/route.ts` - Webhook BR
7. `src/app/api/webhooks/stripe-us/route.ts` - Webhook US
8. `src/app/pt/[area]/checkout/page.tsx` - Página checkout
9. `src/app/api/affiliates/connect/route.ts` - Connect afiliados

---

## 6. WEBHOOKS

### 🔴 Configuração de Webhooks:

#### Para Testes Locais (Stripe CLI):

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login no Stripe
stripe login

# Escutar webhooks BR localmente
stripe listen --forward-to localhost:3000/api/webhooks/stripe-br --account BR_ACCOUNT_ID

# Escutar webhooks US localmente
stripe listen --forward-to localhost:3000/api/webhooks/stripe-us --account US_ACCOUNT_ID

# O Stripe CLI vai retornar um webhook secret temporário
# Usar esse secret para testes locais
```

#### Para Produção:

1. Configurar URLs no Stripe Dashboard:
   - BR: `https://ylada.app/api/webhooks/stripe-br`
   - US: `https://ylada.app/api/webhooks/stripe-us`
2. Copiar Webhook Signing Secrets
3. Adicionar nas variáveis de ambiente

---

## 7. TESTES

### ✅ Checklist de Testes:

#### Testes de Checkout:
- [ ] Checkout Wellness Mensal (BR)
- [ ] Checkout Wellness Anual (BR)
- [ ] Checkout Wellness Mensal (US)
- [ ] Checkout Wellness Anual (US)
- [ ] Repetir para Nutri, Coach, Nutra
- [ ] Testar detecção de país automática
- [ ] Testar conversão de moeda
- [ ] Testar com link de afiliado

#### Testes de Webhooks:
- [ ] Webhook BR: checkout.session.completed
- [ ] Webhook BR: customer.subscription.created
- [ ] Webhook BR: customer.subscription.updated
- [ ] Webhook BR: invoice.payment_succeeded
- [ ] Repetir para conta US
- [ ] Testar assinatura criada no banco
- [ ] Testar acesso liberado após pagamento

#### Testes de Afiliados:
- [ ] Onboarding de afiliado (Connect)
- [ ] Link de referência funcionando
- [ ] Comissão calculada corretamente
- [ ] Transferência automática para afiliado

#### Testes de Bloqueio:
- [ ] Usuário sem assinatura não acessa dashboard
- [ ] Assinatura expirada bloqueia acesso
- [ ] Assinatura cancelada bloqueia acesso

---

## 8. CHECKLIST FINAL

### 📋 Antes de Começar:

- [ ] Criar todos os produtos no Stripe (BR e US)
- [ ] Copiar todos os Price IDs
- [ ] Configurar Multi-Currency
- [ ] Configurar Webhooks
- [ ] Copiar todas as API Keys
- [ ] Configurar Stripe Connect
- [ ] Criar planilha com todas as informações

### 📋 Durante Implementação:

- [ ] Criar schema no banco de dados
- [ ] Configurar variáveis de ambiente
- [ ] Criar arquivos de configuração Stripe
- [ ] Implementar API de checkout
- [ ] Implementar webhooks
- [ ] Criar página de checkout
- [ ] Implementar sistema de afiliados
- [ ] Implementar bloqueio de acesso

### 📋 Antes de Lançar:

- [ ] Testar todos os fluxos
- [ ] Configurar webhooks em produção
- [ ] Trocar chaves de teste por produção
- [ ] Testar pagamento real
- [ ] Verificar logs de webhooks
- [ ] Validar dados no banco
- [ ] Documentar processo para suporte

---

## 📞 PRÓXIMOS PASSOS IMEDIATOS

1. **Coletar todas as informações do Stripe** (usar checklist acima)
2. **Criar schema no banco de dados** (executar SQL)
3. **Configurar variáveis de ambiente**
4. **Começar implementação técnica**

---

**Documento criado em:** `docs/GUIA-IMPLEMENTACAO-STRIPE.md`

**Última atualização:** {{ data atual }}



