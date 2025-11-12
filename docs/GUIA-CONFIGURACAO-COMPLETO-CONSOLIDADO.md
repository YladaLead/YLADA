# ⚙️ GUIA CONSOLIDADO: Configuração Completa do Sistema

**Objetivo:** Documentar todas as configurações necessárias para o sistema funcionar  
**Última atualização:** Hoje  
**Versão:** 1.0.0

---

## 📋 ÍNDICE

1. [Variáveis de Ambiente](#1-variáveis-de-ambiente)
2. [Supabase](#2-supabase)
3. [Mercado Pago](#3-mercado-pago)
4. [Resend (E-mail)](#4-resend-e-mail)
5. [Stripe (Internacional)](#5-stripe-internacional)
6. [OpenAI](#6-openai)
7. [Vercel (Deploy)](#7-vercel-deploy)
8. [Checklist Completo](#8-checklist-completo)

---

## 1. VARIÁVEIS DE AMBIENTE

### **1.1. Estrutura Geral**

**Arquivo:** `.env.local` (desenvolvimento local)  
**Localização:** Raiz do projeto (mesmo nível do `package.json`)

### **1.2. Regras Importantes**

- ✅ **`.env.local`** = Desenvolvimento (usa chaves de TESTE)
- ✅ **Vercel** = Produção (usa chaves de PRODUÇÃO)
- ✅ Variáveis que começam com `NEXT_PUBLIC_` = Acessíveis no cliente
- ✅ Variáveis sem `NEXT_PUBLIC_` = Apenas no servidor
- ⚠️ **NUNCA** commite credenciais no Git
- ⚠️ Após alterar variáveis no Vercel, **faça novo deploy**

---

## 2. SUPABASE

### **2.1. Variáveis Necessárias**

```env
# Supabase - Obrigatórias
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **2.2. Como Obter**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### **2.3. Onde Configurar**

**Desenvolvimento:**
- Arquivo `.env.local`

**Produção:**
- Vercel → Settings → Environment Variables
- Adicionar as 3 variáveis acima
- Ambiente: **Production**

### **2.4. Verificação**

```bash
# Testar conexão
curl https://xxxxx.supabase.co/rest/v1/ \
  -H "apikey: YOUR_ANON_KEY"
```

---

## 3. MERCADO PAGO

### **3.1. Variáveis Necessárias**

```env
# Mercado Pago - TESTE (Desenvolvimento)
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=xxxxxxxxxxxxx

# Mercado Pago - PRODUÇÃO (Produção)
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET_LIVE=xxxxxxxxxxxxx
```

### **3.2. Como Obter**

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Suas integrações"**
3. Clique na sua aplicação
4. **Credenciais de teste:**
   - Copie **Access Token** (TEST-...)
   - Copie **Public Key** (TEST-...)
5. **Credenciais de produção:**
   - Aba **"Produção"**
   - Copie **Access Token** (APP_USR-...)
   - Copie **Public Key** (APP_USR-...)

### **3.3. Webhook Secret**

1. No painel do Mercado Pago, vá em **"Webhooks"**
2. Configure URL: `https://ylada.com/api/webhooks/mercado-pago`
3. Copie o **Webhook Secret** gerado

### **3.4. Onde Configurar**

**Desenvolvimento:**
- `.env.local` → Use credenciais de **TESTE**

**Produção:**
- Vercel → Settings → Environment Variables
- Use credenciais de **PRODUÇÃO**
- Ambiente: **Production**

### **3.5. Verificação**

- ✅ Checkout funciona
- ✅ PIX aparece como opção
- ✅ Boleto aparece como opção
- ✅ Cartão de crédito funciona
- ✅ Webhook recebe notificações

**Documentação:** `docs/CONFIGURACAO-MERCADO-PAGO-COMPLETA.md` ⭐

---

## 4. RESEND (E-MAIL)

### **4.1. Variáveis Necessárias**

```env
# Resend - E-mail
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@ylada.com
RESEND_FROM_NAME=YLADA
```

### **4.2. Como Obter**

1. Acesse: https://resend.com/api-keys
2. Faça login na sua conta
3. Clique em **"Create API Key"**
4. Nome: `YLADA Production`
5. Permissão: **Sending access**
6. Domain: **All Domains**
7. **Copie a API Key** (começa com `re_`)

### **4.3. Verificar Domínio**

1. Acesse: https://resend.com/domains
2. Verifique se `ylada.com` está verificado
3. Se não estiver, adicione e configure DNS

### **4.4. Onde Configurar**

**Desenvolvimento:**
- `.env.local` → Adicionar as 3 variáveis

**Produção:**
- Vercel → Settings → Environment Variables
- Adicionar as 3 variáveis
- Ambiente: **Production**
- ⚠️ **Fazer novo deploy** após adicionar

### **4.5. Testar**

```bash
# Via Terminal
curl -X POST https://www.ylada.com/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "seu-email@gmail.com"}'
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "E-mail de teste enviado com sucesso!",
  "emailId": "abc123...",
  "from": "noreply@ylada.com",
  "to": "seu-email@gmail.com"
}
```

**Documentação:** `docs/TROUBLESHOOTING-EMAIL-NAO-ENVIADO.md`

---

## 5. STRIPE (INTERNACIONAL)

### **5.1. Variáveis Necessárias**

```env
# Stripe - Internacional (USD)
STRIPE_WEBHOOK_SECRET_US=whsec_xxxxxxxxxxxxx
STRIPE_SECRET_KEY_US=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US=pk_live_xxxxxxxxxxxxx

# Preços Wellness (USD)
STRIPE_PRICE_WELLNESS_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_WELLNESS_ANNUAL_US=price_xxxxxxxxxxxxx

# Preços Nutra (USD)
STRIPE_PRICE_NUTRA_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRA_ANNUAL_US=price_xxxxxxxxxxxxx
```

### **5.2. Como Obter**

1. Acesse: https://dashboard.stripe.com
2. Vá em **Developers** → **API keys**
3. Copie:
   - **Secret key** → `STRIPE_SECRET_KEY_US`
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US`
4. **Webhook Secret:**
   - **Developers** → **Webhooks**
   - Configure URL: `https://ylada.com/api/webhooks/stripe-us`
   - Copie **Signing secret** → `STRIPE_WEBHOOK_SECRET_US`

### **5.3. Criar Preços (Prices)**

1. **Dashboard** → **Products**
2. Criar produto (ex: "Wellness Monthly")
3. Criar **Price** (ex: $25/mês)
4. Copiar **Price ID** → `STRIPE_PRICE_WELLNESS_MONTHLY_US`

### **5.4. Onde Configurar**

**Desenvolvimento:**
- `.env.local` → Use chaves de **TESTE** (`sk_test_...`)

**Produção:**
- Vercel → Settings → Environment Variables
- Use chaves de **PRODUÇÃO** (`sk_live_...`)
- Ambiente: **Production**

---

## 6. OPENAI

### **6.1. Variáveis Necessárias**

```env
# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
OPENAI_ASSISTANT_CHAT_ID=asst_xxxxxxxxxxxxx
OPENAI_ASSISTANT_CREATOR_ID=asst_xxxxxxxxxxxxx
OPENAI_ASSISTANT_EXPERT_ID=asst_xxxxxxxxxxxxx
```

### **6.2. Como Obter**

1. Acesse: https://platform.openai.com/api-keys
2. Clique em **"Create new secret key"**
3. Copie a API Key → `OPENAI_API_KEY`
4. **Assistants:**
   - Acesse: https://platform.openai.com/assistants
   - Copie os IDs dos assistants criados

### **6.3. Onde Configurar**

**Desenvolvimento:**
- `.env.local`

**Produção:**
- Vercel → Settings → Environment Variables
- Ambiente: **Production**

---

## 7. VERCEL (DEPLOY)

### **7.1. Configuração de Variáveis**

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. **Settings** → **Environment Variables**
4. Adicionar todas as variáveis necessárias
5. Selecionar ambiente:
   - ✅ **Production** (produção)
   - ✅ **Preview** (preview deployments)
   - ✅ **Development** (development)

### **7.2. Importante**

- ⚠️ Após adicionar/alterar variáveis, **faça novo deploy**
- ⚠️ Variáveis só são aplicadas em novos deploys
- ⚠️ Use credenciais de **PRODUÇÃO** no Vercel
- ⚠️ Variáveis com `NEXT_PUBLIC_` são expostas no cliente

### **7.3. Redeploy**

**Opção 1: Manual**
1. Vercel → **Deployments**
2. Último deploy → **3 pontinhos** → **Redeploy**

**Opção 2: Via Git**
```bash
git commit --allow-empty -m "Redeploy após atualizar variáveis"
git push origin main
```

---

## 8. CHECKLIST COMPLETO

### **8.1. Desenvolvimento Local (`.env.local`)**

#### **Supabase:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada

#### **Mercado Pago (TESTE):**
- [ ] `MERCADOPAGO_ACCESS_TOKEN` (TEST-...)
- [ ] `MERCADOPAGO_PUBLIC_KEY` (TEST-...)
- [ ] `MERCADOPAGO_WEBHOOK_SECRET`

#### **Resend:**
- [ ] `RESEND_API_KEY` (re_...)
- [ ] `RESEND_FROM_EMAIL` = `noreply@ylada.com`
- [ ] `RESEND_FROM_NAME` = `YLADA`

#### **URLs:**
- [ ] `NEXT_PUBLIC_APP_URL` = `http://localhost:3000`
- [ ] `NEXT_PUBLIC_APP_URL_PRODUCTION` = `https://ylada.com`

#### **OpenAI (Opcional):**
- [ ] `OPENAI_API_KEY`
- [ ] `OPENAI_ASSISTANT_CHAT_ID`
- [ ] `OPENAI_ASSISTANT_CREATOR_ID`
- [ ] `OPENAI_ASSISTANT_EXPERT_ID`

---

### **8.2. Produção (Vercel)**

#### **Supabase:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` (PRODUÇÃO)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (PRODUÇÃO)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (PRODUÇÃO)

#### **Mercado Pago (PRODUÇÃO):**
- [ ] `MERCADOPAGO_ACCESS_TOKEN_LIVE` (APP_USR-...)
- [ ] `MERCADOPAGO_PUBLIC_KEY_LIVE` (APP_USR-...)
- [ ] `MERCADOPAGO_WEBHOOK_SECRET_LIVE`

#### **Resend:**
- [ ] `RESEND_API_KEY` (PRODUÇÃO)
- [ ] `RESEND_FROM_EMAIL` = `noreply@ylada.com`
- [ ] `RESEND_FROM_NAME` = `YLADA`

#### **URLs:**
- [ ] `NEXT_PUBLIC_APP_URL_PRODUCTION` = `https://ylada.com`

#### **Stripe (Opcional - Internacional):**
- [ ] `STRIPE_SECRET_KEY_US` (sk_live_...)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US` (pk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET_US` (whsec_...)
- [ ] `STRIPE_PRICE_WELLNESS_MONTHLY_US`
- [ ] `STRIPE_PRICE_WELLNESS_ANNUAL_US`

#### **OpenAI (Opcional):**
- [ ] `OPENAI_API_KEY`
- [ ] `OPENAI_ASSISTANT_CHAT_ID`
- [ ] `OPENAI_ASSISTANT_CREATOR_ID`
- [ ] `OPENAI_ASSISTANT_EXPERT_ID`

---

## 📝 TEMPLATE COMPLETO DO `.env.local`

```env
# =====================================================
# SUPABASE
# =====================================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# =====================================================
# URLs
# =====================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL_PRODUCTION=https://ylada.com

# =====================================================
# MERCADO PAGO - TESTE (Desenvolvimento)
# =====================================================
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=xxxxxxxxxxxxx

# =====================================================
# MERCADO PAGO - PRODUÇÃO (Produção)
# =====================================================
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET_LIVE=xxxxxxxxxxxxx

# =====================================================
# RESEND (E-mail)
# =====================================================
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@ylada.com
RESEND_FROM_NAME=YLADA

# =====================================================
# STRIPE (Internacional - Opcional)
# =====================================================
STRIPE_WEBHOOK_SECRET_US=whsec_xxxxxxxxxxxxx
STRIPE_SECRET_KEY_US=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US=pk_test_xxxxxxxxxxxxx

STRIPE_PRICE_WELLNESS_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_WELLNESS_ANNUAL_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRA_MONTHLY_US=price_xxxxxxxxxxxxx
STRIPE_PRICE_NUTRA_ANNUAL_US=price_xxxxxxxxxxxxx

# =====================================================
# OPENAI (Opcional)
# =====================================================
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
OPENAI_ASSISTANT_CHAT_ID=asst_xxxxxxxxxxxxx
OPENAI_ASSISTANT_CREATOR_ID=asst_xxxxxxxxxxxxx
OPENAI_ASSISTANT_EXPERT_ID=asst_xxxxxxxxxxxxx
```

---

## 🔒 SEGURANÇA

### **Boas Práticas:**

1. ✅ **NUNCA** commite credenciais no Git
2. ✅ **SEMPRE** use variáveis de ambiente
3. ✅ **SEMPRE** use placeholders (`xxxxxxxxxxxxx`) em documentação
4. ✅ **SEMPRE** adicione `.env.local` ao `.gitignore`
5. ✅ **SEMPRE** revise commits antes de fazer push
6. ✅ **SEMPRE** use chaves de TESTE localmente
7. ✅ **SEMPRE** use chaves de PRODUÇÃO apenas no Vercel

### **Se Credencial for Exposta:**

1. **Revogar imediatamente** no painel do serviço
2. **Gerar nova credencial**
3. **Atualizar em todos os lugares:**
   - `.env.local`
   - Vercel
   - Qualquer outro lugar
4. **Fazer novo deploy**

**Documentação:** `docs/SEGURANCA-REVOGAR-RESEND-API-KEY.md`

---

## 🔍 VERIFICAÇÃO E TESTES

### **1. Verificar Variáveis no Código**

```typescript
// Verificar se variável está definida
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL não configurada')
}
```

### **2. Testar Conexões**

**Supabase:**
```bash
curl https://xxxxx.supabase.co/rest/v1/ \
  -H "apikey: YOUR_ANON_KEY"
```

**Resend:**
```bash
curl -X POST https://www.ylada.com/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "seu-email@gmail.com"}'
```

**Mercado Pago:**
- Criar checkout de teste
- Verificar se redireciona corretamente

---

## 📚 REFERÊNCIAS

### **Documentos Relacionados:**
- `env.local.example` ⭐ **TEMPLATE COMPLETO**
- `docs/CONFIGURACAO-MERCADO-PAGO-COMPLETA.md` ⭐
- `docs/COMO-CONFIGURAR-VARIAVEIS-AMBIENTE.md`
- `docs/ESTRUTURA-ENV-LOCAL-COMPLETA.md`
- `docs/ATUALIZAR-RESEND-API-KEY-VERCEL.md`
- `docs/SEGURANCA-REVOGAR-RESEND-API-KEY.md`

### **Links Úteis:**
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Mercado Pago Dashboard:** https://www.mercadopago.com.br/developers/panel
- **Resend Dashboard:** https://resend.com/api-keys
- **Stripe Dashboard:** https://dashboard.stripe.com
- **OpenAI Dashboard:** https://platform.openai.com
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## ✅ CONCLUSÃO

Este guia consolida todas as configurações necessárias. Use como referência ao:
- Configurar ambiente de desenvolvimento
- Configurar ambiente de produção
- Duplicar para novas áreas
- Resolver problemas de configuração

**Lembre-se:**
- ⚠️ Após alterar variáveis no Vercel, **faça novo deploy**
- ⚠️ Use chaves de **TESTE** localmente
- ⚠️ Use chaves de **PRODUÇÃO** apenas no Vercel
- ⚠️ **NUNCA** commite credenciais no Git

---

**Última atualização:** Hoje  
**Versão:** 1.0.0  
**Mantido por:** Equipe YLADA

