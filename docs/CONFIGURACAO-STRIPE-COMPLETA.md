# 🔐 GUIA COMPLETO: CONFIGURAÇÃO STRIPE - YLADA (TODAS AS ÁREAS)

## 📋 ÍNDICE

1. [Pré-requisitos](#1-pré-requisitos)
2. [Configuração no Stripe Dashboard](#2-configuração-no-stripe-dashboard)
3. [Coletar Informações](#3-coletar-informações)
4. [Configurar Variáveis de Ambiente](#4-configurar-variáveis-de-ambiente)
5. [Configurar Webhooks](#5-configurar-webhooks)
6. [Testar Configuração](#6-testar-configuração)
7. [Checklist Final](#7-checklist-final)

## 🎯 IMPORTANTE

**Este guia configura Stripe para TODAS as áreas:**
- ✅ Wellness
- ✅ Nutri
- ✅ Coach
- ✅ Nutra

**A estrutura já está pronta para todas as áreas!** Você só precisa:
1. Criar produtos no Stripe para cada área
2. Configurar variáveis de ambiente com os Price IDs
3. Os webhooks já processam todas as áreas automaticamente

## 💰 PREÇOS POR PAÍS

**O sistema suporta preços diferentes por país!**

### Estratégia de Preços:

1. **Preços Padrão (BR e US):**
   - Conta BR: Preços para países da América Latina
   - Conta US: Preços para resto do mundo

2. **Preços Específicos por País:**
   - Se um país precisa de preço diferente (ex: Colômbia), você pode criar:
     - Produto específico no Stripe para aquele país
     - Variável de ambiente: `STRIPE_PRICE_WELLNESS_MONTHLY_CO` (exemplo para Colômbia)
   - O sistema detecta automaticamente e usa o preço específico

### Exemplo:
- **Brasil:** Wellness Mensal = R$ 60
- **Colômbia:** Wellness Mensal = USD 15 (preço específico, não conversão)
- **Outros países BR:** Wellness Mensal = USD 20 (preço padrão da conta BR)

---

## 1. PRÉ-REQUISITOS

- ✅ Conta Stripe BR criada e verificada
- ✅ Conta Stripe US criada e verificada
- ✅ Acesso ao Dashboard do Stripe (ambas as contas)
- ✅ Acesso ao Vercel (para configurar variáveis de ambiente)
- ✅ Acesso ao Supabase (para executar SQL do schema)

---

## 2. CONFIGURAÇÃO NO STRIPE DASHBOARD

### 🔴 PASSO 2.1: Criar Produtos na Conta Stripe BR

**Acesse:** https://dashboard.stripe.com → **Trocar para conta BR** (selecione no canto superior direito)

#### Criar Produtos para TODAS as Áreas

**Para cada área (Wellness, Nutri, Coach, Nutra), criar 2 produtos:**

##### Exemplo: Wellness Mensal BR

1. **Acesse:** Products → **+ Add product**
2. **Nome:** `YLADA Wellness - Plano Mensal`
3. **Descrição:** `Assinatura mensal da área Wellness - YLADA`
4. **Preço:** 
   - Valor: `60.00` (ou o valor que você definir)
   - Moeda: `USD` (ou `BRL` se preferir)
   - Tipo: `Recurring` → `Monthly`
5. **Metadata** (clique em "Add metadata"):
   - Key: `area` → Value: `wellness`
   - Key: `plan_type` → Value: `monthly`
6. **Clique:** "Save product"
7. **✅ IMPORTANTE:** Copie o **Price ID** (começa com `price_...`)

##### Repetir para:

- ✅ **Wellness Anual BR** (valor: `570.00`, tipo: `Yearly`)
- ✅ **Nutri Mensal BR** (valor: `79.00`, tipo: `Monthly`)
- ✅ **Nutri Anual BR** (valor: `790.00`, tipo: `Yearly`)
- ✅ **Coach Mensal BR** (valor: `99.00`, tipo: `Monthly`)
- ✅ **Coach Anual BR** (valor: `990.00`, tipo: `Yearly`)
- ✅ **Nutra Mensal BR** (valor: `69.00`, tipo: `Monthly`)
- ✅ **Nutra Anual BR** (valor: `690.00`, tipo: `Yearly`)

**⚠️ IMPORTANTE:** Ajuste os valores conforme seus preços reais!

**📝 CRIAR PLANILHA:** Anote todos os 8 Price IDs da conta BR em uma planilha Excel/Google Sheets

---

### 🔴 PASSO 2.2: Criar Produtos na Conta Stripe US

**Acesse:** https://dashboard.stripe.com → **Trocar para conta US**

**Repetir TODOS os 8 produtos** (Wellness, Nutri, Coach, Nutra - Mensal e Anual) na conta US.

**✅ Copiar todos os 8 Price IDs da conta US**

**📝 ADICIONAR NA PLANILHA:** Anote os Price IDs da conta US também

**Total:** 16 produtos (8 BR + 8 US)

---

### 🔴 PASSO 2.3: Configurar Multi-Currency (Opcional mas Recomendado)

**Para cada produto criado:**

1. Abrir produto no Stripe Dashboard
2. Clicar em "Add another currency"
3. Adicionar moedas:
   - **BRL** (Real Brasileiro)
   - **EUR** (Euro)
   - **MXN** (Peso Mexicano)
   - **ARS** (Peso Argentino)
4. Stripe converte automaticamente usando taxa de câmbio atual

**✅ Verificar que todos os produtos têm Multi-Currency habilitado**

---

## 3. COLETAR INFORMAÇÕES

### 📋 Checklist de Informações para Coletar:

#### Conta Stripe BR:

1. **API Keys:**
   - [ ] Acesse: Developers → API Keys
   - [ ] **Secret Key (Test):** `sk_test_...` → Copiar
   - [ ] **Publishable Key (Test):** `pk_test_...` → Copiar
   - [ ] **Secret Key (Live):** `sk_live_...` → Copiar (quando ativar produção)
   - [ ] **Publishable Key (Live):** `pk_live_...` → Copiar (quando ativar produção)

2. **Webhook Secret:**
   - [ ] Acesse: Developers → Webhooks
   - [ ] Clique em "Add endpoint" (ou use existente)
   - [ ] URL: `https://ylada.app/api/webhooks/stripe-br`
   - [ ] Eventos: Selecionar todos os eventos listados abaixo
   - [ ] **Webhook Signing Secret:** `whsec_...` → Copiar

3. **Price IDs (8 produtos BR):**
   - [ ] Wellness Mensal BR: `price_...`
   - [ ] Wellness Anual BR: `price_...`
   - [ ] Nutri Mensal BR: `price_...`
   - [ ] Nutri Anual BR: `price_...`
   - [ ] Coach Mensal BR: `price_...`
   - [ ] Coach Anual BR: `price_...`
   - [ ] Nutra Mensal BR: `price_...`
   - [ ] Nutra Anual BR: `price_...`

#### Conta Stripe US:

1. **API Keys:**
   - [ ] **Secret Key (Test):** `sk_test_...` → Copiar
   - [ ] **Publishable Key (Test):** `pk_test_...` → Copiar
   - [ ] **Secret Key (Live):** `sk_live_...` → Copiar
   - [ ] **Publishable Key (Live):** `pk_live_...` → Copiar

2. **Webhook Secret:**
   - [ ] URL: `https://ylada.app/api/webhooks/stripe-us`
   - [ ] **Webhook Signing Secret:** `whsec_...` → Copiar

3. **Price IDs (8 produtos US):**
   - [ ] Wellness Mensal US: `price_...`
   - [ ] Wellness Anual US: `price_...`
   - [ ] Nutri Mensal US: `price_...`
   - [ ] Nutri Anual US: `price_...`
   - [ ] Coach Mensal US: `price_...`
   - [ ] Coach Anual US: `price_...`
   - [ ] Nutra Mensal US: `price_...`
   - [ ] Nutra Anual US: `price_...`

**📝 TOTAL:** 24 informações para coletar (8 API Keys + 2 Webhook Secrets + 16 Price IDs)

### 🔴 PASSO 3.1: Criar Preços Específicos por País (Opcional)

**Se você quiser preços diferentes para países específicos:**

**Exemplo: Colômbia com preço diferente**

1. **Criar produto no Stripe:**
   - Nome: `YLADA Wellness - Plano Mensal (Colômbia)`
   - Preço: Valor específico para Colômbia (ex: USD 15)
   - Metadata:
     - Key: `area` → Value: `wellness`
     - Key: `plan_type` → Value: `monthly`
     - Key: `country` → Value: `CO`

2. **Copiar Price ID:** `price_...`

3. **Adicionar variável de ambiente:**
   ```env
   STRIPE_PRICE_WELLNESS_MONTHLY_CO=price_xxxxxxxxxxxxx
   ```

4. **Repetir para outros países que precisarem de preços específicos**

**⚠️ IMPORTANTE:** 
- Use o código ISO do país (ex: `CO` para Colômbia, `MX` para México)
- O sistema detecta automaticamente e usa o preço específico se configurado
- Se não configurar preço específico, usa o preço padrão da conta (BR ou US)

---

## 4. CONFIGURAR VARIÁVEIS DE AMBIENTE

### 🔴 PASSO 4.1: Configurar no Vercel (Produção)

1. **Acesse:** https://vercel.com → Seu Projeto → Settings → Environment Variables

2. **Adicionar todas as variáveis abaixo:**

```env
# =====================================================
# STRIPE - CONTA BRASIL
# =====================================================
STRIPE_SECRET_KEY_BR=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET_BR=whsec_xxxxxxxxxxxxx

# Price IDs Wellness BR
STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_WELLNESS_ANNUAL_BR=price_xxxxxxxxxxxxx

# Price IDs Nutri BR
STRIPE_PRICE_NUTRI_MONTHLY_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRI_ANNUAL_BR=price_xxxxxxxxxxxxx

# Price IDs Coach BR
STRIPE_PRICE_COACH_MONTHLY_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_COACH_ANNUAL_BR=price_xxxxxxxxxxxxx

# Price IDs Nutra BR
STRIPE_PRICE_NUTRA_MONTHLY_BR=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRA_ANNUAL_BR=price_xxxxxxxxxxxxx

# =====================================================
# STRIPE - CONTA EUA
# =====================================================
STRIPE_SECRET_KEY_US=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET_US=whsec_xxxxxxxxxxxxx

# Price IDs Wellness US
STRIPE_PRICE_WELLNESS_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_WELLNESS_ANNUAL_US=price_xxxxxxxxxxxxx

# Price IDs Nutri US
STRIPE_PRICE_NUTRI_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRI_ANNUAL_US=price_xxxxxxxxxxxxx

# Price IDs Coach US
STRIPE_PRICE_COACH_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_COACH_ANNUAL_US=price_xxxxxxxxxxxxx

# Price IDs Nutra US
STRIPE_PRICE_NUTRA_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRA_ANNUAL_US=price_xxxxxxxxxxxxx
```

3. **⚠️ IMPORTANTE:**
   - Substituir `xxxxxxxxxxxxx` pelos valores reais coletados
   - Para **produção**, trocar `sk_test_` por `sk_live_` e `pk_test_` por `pk_live_`
   - Selecionar **Environment:** Production, Preview, Development (todos)

4. **Clique:** "Save"

---

### 🔴 PASSO 4.2: Configurar no .env.local (Desenvolvimento Local)

1. **Criar/Editar arquivo:** `.env.local` na raiz do projeto

2. **Adicionar as mesmas variáveis** (usando chaves de TEST):

```env
# Stripe BR
STRIPE_SECRET_KEY_BR=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR=pk_test_...
STRIPE_WEBHOOK_SECRET_BR=whsec_...

STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_...
STRIPE_PRICE_WELLNESS_ANNUAL_BR=price_...
STRIPE_PRICE_NUTRI_MONTHLY_BR=price_...
STRIPE_PRICE_NUTRI_ANNUAL_BR=price_...
STRIPE_PRICE_COACH_MONTHLY_BR=price_...
STRIPE_PRICE_COACH_ANNUAL_BR=price_...
STRIPE_PRICE_NUTRA_MONTHLY_BR=price_...
STRIPE_PRICE_NUTRA_ANNUAL_BR=price_...

# Stripe US
STRIPE_SECRET_KEY_US=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US=pk_test_...
STRIPE_WEBHOOK_SECRET_US=whsec_...

STRIPE_PRICE_WELLNESS_MONTHLY_US=price_...
STRIPE_PRICE_WELLNESS_ANNUAL_US=price_...
STRIPE_PRICE_NUTRI_MONTHLY_US=price_...
STRIPE_PRICE_NUTRI_ANNUAL_US=price_...
STRIPE_PRICE_COACH_MONTHLY_US=price_...
STRIPE_PRICE_COACH_ANNUAL_US=price_...
STRIPE_PRICE_NUTRA_MONTHLY_US=price_...
STRIPE_PRICE_NUTRA_ANNUAL_US=price_...
```

3. **⚠️ IMPORTANTE:** 
   - NUNCA commitar `.env.local` no Git
   - Verificar que está no `.gitignore`

---

## 5. CONFIGURAR WEBHOOKS

### 🔴 PASSO 5.1: Webhook Conta Stripe BR

1. **Acesse:** Stripe Dashboard → Conta BR → Developers → Webhooks

2. **Clicar:** "Add endpoint" (ou editar existente)

3. **URL do endpoint:**
   ```
   https://ylada.app/api/webhooks/stripe-br
   ```
   - Para testes locais: usar Stripe CLI (ver seção de testes)

4. **Eventos para escutar** (selecionar todos):
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

5. **Clique:** "Add endpoint"

6. **✅ Copiar Webhook Signing Secret:**
   - Após criar, clique no endpoint
   - Copie o "Signing secret" (começa com `whsec_...`)

---

### 🔴 PASSO 5.2: Webhook Conta Stripe US

1. **Repetir processo acima** na conta US

2. **URL do endpoint:**
   ```
   https://ylada.app/api/webhooks/stripe-us
   ```

3. **Mesmos eventos**

4. **✅ Copiar Webhook Signing Secret**

---

### 🔴 PASSO 5.3: Testar Webhooks Localmente (Opcional)

**Para testar webhooks em desenvolvimento local:**

1. **Instalar Stripe CLI:**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login no Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks BR:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe-br --events checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.payment_succeeded,invoice.payment_failed
   ```

4. **Copiar o webhook secret** mostrado no terminal (começa com `whsec_...`)

5. **Usar esse secret no `.env.local`** temporariamente para testes

---

## 6. TESTAR CONFIGURAÇÃO

### 🔴 PASSO 6.1: Verificar Variáveis de Ambiente

1. **Acesse:** Vercel → Seu Projeto → Settings → Environment Variables
2. **Verificar** que todas as 12 variáveis estão configuradas
3. **Verificar** que estão selecionadas para Production, Preview e Development

---

### 🔴 PASSO 6.2: Testar Checkout

1. **Acesse:** https://ylada.app/pt/wellness/checkout
2. **Fazer login** (se necessário)
3. **Selecionar plano** (mensal ou anual)
4. **Clicar:** "Continuar para Pagamento"
5. **Usar cartão de teste:**
   - Número: `4242 4242 4242 4242`
   - Data: qualquer data futura (ex: `12/34`)
   - CVC: qualquer 3 dígitos (ex: `123`)
   - CEP: qualquer (ex: `12345`)
6. **Completar pagamento**
7. **Verificar** redirecionamento para página de sucesso

---

### 🔴 PASSO 6.3: Verificar Webhook

1. **Acesse:** Stripe Dashboard → Developers → Webhooks
2. **Clicar no endpoint** criado
3. **Verificar** que eventos estão sendo recebidos
4. **Verificar logs** no Vercel para confirmar processamento

---

### 🔴 PASSO 6.4: Verificar Banco de Dados

1. **Acesse:** Supabase Dashboard → Table Editor → `subscriptions`
2. **Verificar** que assinatura foi criada após pagamento de teste
3. **Verificar** campos:
   - `user_id` correto
   - `area` = 'wellness'
   - `plan_type` = 'monthly' ou 'annual'
   - `stripe_account` = 'br' ou 'us'
   - `status` = 'active'
   - `stripe_subscription_id` preenchido

---

## 7. CHECKLIST FINAL

### Antes de Ir para Produção:

- [ ] Todos os produtos criados no Stripe BR
- [ ] Todos os produtos criados no Stripe US
- [ ] Todos os Price IDs coletados e anotados
- [ ] Todas as variáveis de ambiente configuradas no Vercel
- [ ] Webhooks configurados em ambas as contas
- [ ] Webhook secrets copiados e configurados
- [ ] Teste de checkout realizado com sucesso
- [ ] Webhook processando eventos corretamente
- [ ] Assinatura sendo salva no banco de dados
- [ ] Dashboard bloqueando acesso sem assinatura
- [ ] Dashboard liberando acesso com assinatura ativa
- [ ] Admin/suporte conseguindo bypassar verificação

### Variáveis de Ambiente Verificadas:

**Conta BR (10 variáveis):**
- [ ] `STRIPE_SECRET_KEY_BR`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR`
- [ ] `STRIPE_WEBHOOK_SECRET_BR`
- [ ] `STRIPE_PRICE_WELLNESS_MONTHLY_BR`
- [ ] `STRIPE_PRICE_WELLNESS_ANNUAL_BR`
- [ ] `STRIPE_PRICE_NUTRI_MONTHLY_BR`
- [ ] `STRIPE_PRICE_NUTRI_ANNUAL_BR`
- [ ] `STRIPE_PRICE_COACH_MONTHLY_BR`
- [ ] `STRIPE_PRICE_COACH_ANNUAL_BR`
- [ ] `STRIPE_PRICE_NUTRA_MONTHLY_BR`
- [ ] `STRIPE_PRICE_NUTRA_ANNUAL_BR`

**Conta US (10 variáveis):**
- [ ] `STRIPE_SECRET_KEY_US`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US`
- [ ] `STRIPE_WEBHOOK_SECRET_US`
- [ ] `STRIPE_PRICE_WELLNESS_MONTHLY_US`
- [ ] `STRIPE_PRICE_WELLNESS_ANNUAL_US`
- [ ] `STRIPE_PRICE_NUTRI_MONTHLY_US`
- [ ] `STRIPE_PRICE_NUTRI_ANNUAL_US`
- [ ] `STRIPE_PRICE_COACH_MONTHLY_US`
- [ ] `STRIPE_PRICE_COACH_ANNUAL_US`
- [ ] `STRIPE_PRICE_NUTRA_MONTHLY_US`
- [ ] `STRIPE_PRICE_NUTRA_ANNUAL_US`

**Total: 22 variáveis de ambiente**

---

## 🚨 TROUBLESHOOTING

### Problema: Webhook não está recebendo eventos

**Solução:**
1. Verificar URL do webhook no Stripe Dashboard
2. Verificar que está usando `https://` (não `http://`)
3. Verificar logs no Vercel para erros
4. Testar webhook manualmente via Stripe CLI

### Problema: Assinatura não está sendo salva no banco

**Solução:**
1. Verificar logs do webhook no Vercel
2. Verificar que `user_id` está sendo passado no metadata do checkout
3. Verificar que tabela `subscriptions` existe no banco
4. Executar `schema-subscriptions.sql` novamente se necessário

### Problema: Checkout não está funcionando

**Solução:**
1. Verificar variáveis de ambiente no Vercel
2. Verificar que Price IDs estão corretos
3. Verificar console do navegador para erros
4. Verificar logs da API `/api/wellness/checkout` no Vercel

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verificar logs no Vercel (Functions → Logs)
2. Verificar logs no Stripe Dashboard (Developers → Logs)
3. Verificar logs no Supabase (Logs → API Logs)

---

## ✅ CONCLUSÃO

Após completar todos os passos acima, o sistema de pagamento estará totalmente funcional e pronto para receber pagamentos reais!

**Próximos passos após configuração:**
1. Testar fluxo completo com cartão de teste
2. Ativar modo Live no Stripe quando estiver pronto
3. Trocar variáveis de ambiente para chaves Live
4. Monitorar primeiros pagamentos reais

