# 📋 TEMPLATE COMPLETO DO .env.local

## 🎯 COMO USAR

1. **Copie** todo o conteúdo abaixo
2. **Cole** no arquivo `.env.local` na raiz do projeto
3. **Substitua** todos os `xxxxxxxxxxxxx` pelos seus valores reais
4. **Salve** o arquivo
5. **Reinicie** o servidor (`npm run dev`)

---

## 📝 TEMPLATE COMPLETO

```env
# =====================================================
# TEMPLATE COMPLETO - .env.local
# =====================================================
# 
# INSTRUÇÕES:
# 1. Copie este conteúdo para .env.local
# 2. Substitua todos os valores placeholder pelos seus valores reais
# 3. NÃO commite o .env.local no Git (já está no .gitignore)
# =====================================================

# =====================================================
# SUPABASE
# =====================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# =====================================================
# NEXT.JS - URLs
# =====================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL_PRODUCTION=https://your-production-domain.com

# =====================================================
# OPENAI
# =====================================================
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_ASSISTANT_CHAT_ID=asst_your_chat_assistant_id_here
OPENAI_ASSISTANT_CREATOR_ID=asst_your_creator_assistant_id_here
OPENAI_ASSISTANT_EXPERT_ID=asst_your_expert_assistant_id_here

# =====================================================
# STRIPE BRASIL - TESTE (para desenvolvimento local)
# =====================================================

# Webhook Secret - TESTE
STRIPE_WEBHOOK_SECRET_BR=whsec_xxxxxxxxxxxxx

# API Keys - TESTE
STRIPE_SECRET_KEY_BR=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR=pk_test_xxxxxxxxxxxxx

# Stripe Connect (Opcional)
# STRIPE_CONNECT_CLIENT_ID_BR=ca_xxxxxxxxxxxxx

# =====================================================
# STRIPE BRASIL - PRODUÇÃO (opcional no .env.local)
# =====================================================
# Você pode deixar essas variáveis aqui para referência,
# mas o ideal é configurá-las apenas no Vercel

# Webhook Secret - PRODUÇÃO
# STRIPE_WEBHOOK_SECRET_BR_LIVE=whsec_xxxxxxxxxxxxx

# API Keys - PRODUÇÃO
# STRIPE_SECRET_KEY_BR_LIVE=sk_live_xxxxxxxxxxxxx
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR_LIVE=pk_live_xxxxxxxxxxxxx

# =====================================================
# STRIPE BRASIL - PRICE IDs (WELLNESS)
# =====================================================

# Plano Mensal (Assinatura Recorrente)
STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_1SQmi9RN0Ga5apy8bklmiOuL

# Plano Anual Parcelado (One-time - permite parcelar em até 12x)
STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR=price_1SQo0RRN0Ga5apy89od4tBV7

# Plano Anual Normal (Fallback - se não tiver one-time configurado)
# STRIPE_PRICE_WELLNESS_ANNUAL_BR=price_xxxxxxxxxxxxx

# =====================================================
# STRIPE BRASIL - PRICE IDs (NUTRI, COACH, NUTRA)
# =====================================================
# Adicione quando criar os produtos

# Nutri - Mensal
# STRIPE_PRICE_NUTRI_MONTHLY_BR=price_xxxxxxxxxxxxx

# Nutri - Anual Parcelado
# STRIPE_PRICE_NUTRI_ANNUAL_ONETIME_BR=price_xxxxxxxxxxxxx

# Coach - Mensal
# STRIPE_PRICE_COACH_MONTHLY_BR=price_xxxxxxxxxxxxx

# Coach - Anual Parcelado
# STRIPE_PRICE_COACH_ANNUAL_ONETIME_BR=price_xxxxxxxxxxxxx

# Nutra - Mensal
# STRIPE_PRICE_NUTRA_MONTHLY_BR=price_xxxxxxxxxxxxx

# Nutra - Anual Parcelado
# STRIPE_PRICE_NUTRA_ANNUAL_ONETIME_BR=price_xxxxxxxxxxxxx

# =====================================================
# STRIPE EUA - TESTE (para desenvolvimento local)
# =====================================================

# Webhook Secret - TESTE
# STRIPE_WEBHOOK_SECRET_US=whsec_xxxxxxxxxxxxx

# API Keys - TESTE
# STRIPE_SECRET_KEY_US=sk_test_xxxxxxxxxxxxx
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US=pk_test_xxxxxxxxxxxxx

# Stripe Connect (Opcional)
# STRIPE_CONNECT_CLIENT_ID_US=ca_xxxxxxxxxxxxx

# =====================================================
# STRIPE EUA - PRODUÇÃO (opcional no .env.local)
# =====================================================

# Webhook Secret - PRODUÇÃO
# STRIPE_WEBHOOK_SECRET_US_LIVE=whsec_xxxxxxxxxxxxx

# API Keys - PRODUÇÃO
# STRIPE_SECRET_KEY_US_LIVE=sk_live_xxxxxxxxxxxxx
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US_LIVE=pk_live_xxxxxxxxxxxxx

# =====================================================
# STRIPE EUA - PRICE IDs (NUTRI, COACH, NUTRA)
# =====================================================
# Adicione quando criar os produtos para outros países

# Nutri - Mensal (EUA)
# STRIPE_PRICE_NUTRI_MONTHLY_US=price_xxxxxxxxxxxxx

# Nutri - Anual (EUA)
# STRIPE_PRICE_NUTRI_ANNUAL_US=price_xxxxxxxxxxxxx

# Coach - Mensal (EUA)
# STRIPE_PRICE_COACH_MONTHLY_US=price_xxxxxxxxxxxxx

# Coach - Anual (EUA)
# STRIPE_PRICE_COACH_ANNUAL_US=price_xxxxxxxxxxxxx

# Nutra - Mensal (EUA)
# STRIPE_PRICE_NUTRA_MONTHLY_US=price_xxxxxxxxxxxxx

# Nutra - Anual (EUA)
# STRIPE_PRICE_NUTRA_ANNUAL_US=price_xxxxxxxxxxxxx

# =====================================================
# OUTRAS VARIÁVEIS (se necessário)
# =====================================================

# Google Analytics (Opcional)
# NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-Y

# Database URL (se usar diretamente)
# DATABASE_URL=postgresql://user:password@host:port/database

# =====================================================
# NOTAS
# =====================================================
# 
# 1. Variáveis com prefixo NEXT_PUBLIC_ são expostas ao frontend
# 2. Variáveis sem prefixo são apenas para o servidor (mais seguras)
# 3. No Vercel, configure apenas as variáveis de PRODUÇÃO
# 4. Localmente, o código usa automaticamente as chaves de TESTE
# 5. Price IDs do Wellness já estão preenchidos com os valores reais
# 
# =====================================================
```

---

## ✅ CHECKLIST

### Variáveis Obrigatórias (já preenchidas):
- [x] `STRIPE_PRICE_WELLNESS_MONTHLY_BR` = `price_1SQmi9RN0Ga5apy8bklmiOuL`
- [x] `STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR` = `price_1SQo0RRN0Ga5apy89od4tBV7`

### Variáveis que você precisa preencher:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET_BR` (chave de teste)
- [ ] `STRIPE_SECRET_KEY_BR` (chave de teste)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR` (chave de teste)
- [ ] `OPENAI_API_KEY` (se usar OpenAI)
- [ ] `OPENAI_ASSISTANT_*` (se usar assistentes)

---

## 📍 ONDE ENCONTRAR AS CHAVES

### Supabase:
- Dashboard → Settings → API → Project URL e Keys

### Stripe:
- Dashboard → Developers → API Keys → Test mode keys
- Dashboard → Developers → Webhooks → Seu webhook → Signing secret

### OpenAI:
- Dashboard → API Keys → Create new secret key

---

## ⚠️ IMPORTANTE

1. **NÃO commite** o `.env.local` no Git (já está no `.gitignore`)
2. **Use chaves de TESTE** no `.env.local` para desenvolvimento
3. **Use chaves de PRODUÇÃO** apenas no Vercel
4. **Price IDs** já estão preenchidos com os valores que você forneceu

---

**Última atualização:** {{ data atual }}

