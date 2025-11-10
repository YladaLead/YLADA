# 📚 Guia Completo: Checkout Sem Autenticação

## 🎯 Objetivo

Este guia documenta **todo o processo** de implementação do checkout sem autenticação (coletar apenas e-mail, criar conta após pagamento). Use este guia para replicar o sistema nas outras áreas (nutri, coach, nutra).

---

## 📋 ÍNDICE

1. [Visão Geral do Sistema](#visão-geral)
2. [Arquitetura e Fluxo](#arquitetura-e-fluxo)
3. [Configuração Inicial](#configuração-inicial)
4. [Implementação Técnica](#implementação-técnica)
5. [Replicar para Outras Áreas](#replicar-para-outras-áreas)
6. [Testes e Validação](#testes-e-validação)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 VISÃO GERAL

### O que foi implementado:

✅ **Checkout sem autenticação obrigatória**
- Usuário pode pagar apenas com e-mail (sem criar conta antes)
- Conta é criada automaticamente após pagamento bem-sucedido
- E-mail de boas-vindas enviado automaticamente com link de acesso

✅ **Sistema de tokens de acesso**
- Tokens temporários para links de acesso por e-mail
- Válidos por 30 dias
- Usados apenas uma vez

✅ **Webhook inteligente**
- Detecta quando usuário não existe
- Cria conta automaticamente após pagamento
- Cria perfil do usuário
- Envia e-mail de boas-vindas

### Benefícios:

- 📈 **Mais conversão**: Estudos indicam 20-30% mais vendas
- 🚀 **Menos fricção**: Cliente não precisa criar conta antes de pagar
- ⚡ **Automático**: Tudo acontece após o pagamento
- 🔒 **Seguro**: Tokens temporários e únicos

---

## 🏗️ ARQUITETURA E FLUXO

### Fluxo Completo:

```
1. Cliente acessa /pt/wellness/checkout
   ↓
2. Seleciona plano (mensal ou anual)
   ↓
3. Preenche e-mail (se não estiver logado)
   ↓
4. Clica em "Continuar para Pagamento"
   ↓
5. Sistema cria checkout no Mercado Pago/Stripe
   - Usa e-mail fornecido
   - userId temporário: "temp_{email}"
   ↓
6. Cliente é redirecionado para gateway de pagamento
   ↓
7. Cliente preenche dados do cartão e paga
   ↓
8. Gateway envia webhook para /api/webhooks/mercado-pago
   ↓
9. Webhook detecta userId começando com "temp_"
   ↓
10. Webhook cria usuário automaticamente:
    - Cria conta no Supabase Auth
    - Cria perfil na tabela user_profiles
    - Gera token de acesso
    - Envia e-mail de boas-vindas
   ↓
11. Cliente recebe e-mail com link de acesso
   ↓
12. Cliente clica no link e acessa dashboard
```

---

## ⚙️ CONFIGURAÇÃO INICIAL

### 1. Scripts SQL no Supabase

**Arquivo:** `scripts/CHECKOUT-SEM-AUTENTICACAO.sql`

**O que faz:**
- Cria tabela `access_tokens` (para links de acesso)
- Adiciona campos `welcome_email_sent` na tabela `subscriptions`

**Como executar:**
1. Acesse Supabase Dashboard → SQL Editor
2. Copie e cole o conteúdo do arquivo
3. Execute (Run)
4. Verifique se não houve erros

**Verificar se funcionou:**
```sql
-- Verificar tabela access_tokens
SELECT * FROM access_tokens LIMIT 1;

-- Verificar campos na subscriptions
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
AND column_name IN ('welcome_email_sent', 'welcome_email_sent_at');
```

### 2. Variáveis de Ambiente

**No `.env.local` (desenvolvimento):**
```env
# Resend (E-mail)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@ylada.com
RESEND_FROM_NAME=YLADA

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL_PRODUCTION=https://www.ylada.com

# Mercado Pago (PRODUÇÃO)
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-xxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET_LIVE=xxxxxxxxxxxxx
```

**No Vercel (produção):**
1. Settings → Environment Variables
2. Adicionar todas as variáveis acima
3. Fazer novo deploy após adicionar

### 3. Webhook do Mercado Pago

**URL:** `https://www.ylada.com/api/webhooks/mercado-pago`

**Configurar:**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **Webhooks**
3. Adicione a URL acima
4. Eventos: `payment`, `merchant_order`, `subscription`, `preapproval`
5. Copie o **Webhook Secret** e adicione em `MERCADOPAGO_WEBHOOK_SECRET_LIVE`

---

## 💻 IMPLEMENTAÇÃO TÉCNICA

### 1. API de Checkout (`/api/[area]/checkout/route.ts`)

**O que faz:**
- Aceita checkout sem autenticação (apenas e-mail)
- Se autenticado, usa dados do usuário
- Se não autenticado, usa e-mail fornecido
- Cria userId temporário se necessário

**Código chave:**
```typescript
// Tentar autenticação opcional
const authResult = await requireApiAuth(request, ['wellness', 'admin'])
if (authResult instanceof NextResponse) {
  // Não autenticado - usar e-mail fornecido
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
  }
  userEmail = email
  userId = null // Será criado no webhook
} else {
  // Autenticado - usar dados do usuário
  const { user } = authResult
  userId = user.id
  userEmail = user.email || email
}

// Criar checkout com userId temporário se necessário
const checkout = await createCheckout({
  area: 'wellness',
  planType,
  userId: userId || `temp_${userEmail}`, // ID temporário
  userEmail,
  // ...
})
```

### 2. Página de Checkout (`/pt/[area]/checkout/page.tsx`)

**O que faz:**
- Mostra campo de e-mail se não estiver logado
- Permite checkout sem login
- Envia e-mail na requisição

**Código chave:**
```typescript
// Campo de e-mail (se não estiver logado)
{!user && (
  <div className="mb-6">
    <label htmlFor="email">E-mail</label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="seu@email.com"
      required
    />
    <p className="text-xs text-gray-500 mt-2">
      Seu e-mail será usado para criar sua conta automaticamente após o pagamento.
    </p>
  </div>
)}

// Enviar e-mail na requisição
const response = await fetch('/api/wellness/checkout', {
  method: 'POST',
  body: JSON.stringify({ 
    planType,
    email: user?.email || email, // E-mail obrigatório
  }),
})
```

### 3. Webhook (`/api/webhooks/mercado-pago/route.ts`)

**O que faz:**
- Detecta userId começando com "temp_"
- Cria usuário automaticamente
- Cria perfil
- Envia e-mail de boas-vindas

**Código chave:**
```typescript
// Se userId começar com "temp_", criar usuário automaticamente
if (userId && userId.startsWith('temp_')) {
  const payerEmail = data.payer?.email || data.payer_email
  
  // Verificar se usuário já existe
  const existingUser = await supabaseAdmin.auth.admin.listUsers()
  const user = existingUser?.users?.find(u => u.email === payerEmail)
  
  if (!user) {
    // Criar novo usuário
    const randomPassword = Math.random().toString(36).slice(-12) + 'A1!'
    const { data: newUser } = await supabaseAdmin.auth.admin.createUser({
      email: payerEmail,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        perfil: area
      }
    })
    
    userId = newUser.user.id
    
    // Criar perfil se trigger não funcionou
    await supabaseAdmin.from('user_profiles').insert({
      user_id: userId,
      email: payerEmail,
      perfil: area
    })
    
    // Enviar e-mail de boas-vindas
    const accessToken = await createAccessToken(userId, 30)
    await sendWelcomeEmail({
      email: payerEmail,
      area: area,
      planType: planType,
      accessToken,
      baseUrl: process.env.NEXT_PUBLIC_APP_URL_PRODUCTION
    })
  }
}
```

---

## 🔄 REPLICAR PARA OUTRAS ÁREAS

### Checklist Completo:

#### 1. Criar Página de Checkout

**Arquivo:** `src/app/pt/[area]/checkout/page.tsx`

**Passos:**
1. Copiar `src/app/pt/wellness/checkout/page.tsx`
2. Substituir todas as ocorrências:
   - `wellness` → `nutri` (ou `coach`, `nutra`)
   - `WellnessCheckoutPage` → `NutriCheckoutPage`
   - `/api/wellness/checkout` → `/api/nutri/checkout`
   - `/pt/wellness/login` → `/pt/nutri/login`
   - `/pt/wellness/pagamento-sucesso` → `/pt/nutri/pagamento-sucesso`

**Exemplo de substituições:**
```typescript
// Antes (wellness)
const response = await fetch('/api/wellness/checkout', {
  body: JSON.stringify({ planType, email })
})

// Depois (nutri)
const response = await fetch('/api/nutri/checkout', {
  body: JSON.stringify({ planType, email })
})
```

#### 2. Criar Página de Pagamento Sucesso

**Arquivo:** `src/app/pt/[area]/pagamento-sucesso/page.tsx`

**Passos:**
1. Copiar `src/app/pt/wellness/pagamento-sucesso/page.tsx`
2. Substituir links para a área específica
3. Ajustar rotas de redirecionamento

#### 3. Verificar API de Checkout

**Arquivo:** `src/app/api/[area]/checkout/route.ts`

**Status:** ✅ Já existe e funciona para todas as áreas!

A API é genérica e detecta automaticamente a área pela URL:
- `/api/wellness/checkout` → `area: 'wellness'`
- `/api/nutri/checkout` → `area: 'nutri'`
- `/api/coach/checkout` → `area: 'coach'`
- `/api/nutra/checkout` → `area: 'nutra'`

**Não precisa criar APIs específicas!**

#### 4. Verificar Preços

**Arquivo:** `src/lib/payment-gateway.ts`

**Verificar se os preços estão configurados:**
```typescript
const prices: Record<string, Record<string, number>> = {
  wellness: {
    monthly: 59.90,
    annual: 574.80,
  },
  nutri: {
    monthly: 97.00,  // ✅ Configurado
    annual: 1164.00, // ✅ Configurado
  },
  coach: {
    monthly: 97.00,  // ✅ Configurado
    annual: 1164.00, // ✅ Configurado
  },
  nutra: {
    monthly: 97.00,  // ✅ Configurado
    annual: 1164.00, // ✅ Configurado
  },
}
```

#### 5. Verificar Webhook

**Arquivo:** `src/app/api/webhooks/mercado-pago/route.ts`

**Status:** ✅ Já funciona para todas as áreas!

O webhook detecta automaticamente a área do metadata:
```typescript
const area = metadata.area || 'wellness' // Detecta automaticamente
```

**Não precisa criar webhooks específicos!**

#### 6. Criar Páginas de E-mail (Opcional)

**Arquivos:**
- `src/app/pt/[area]/recuperar-acesso/page.tsx`
- `src/app/pt/[area]/acesso/page.tsx`

**Status:** Sistema de e-mail já funciona para todas as áreas!

As páginas são opcionais - o e-mail funciona mesmo sem elas. Mas é recomendado criar para melhor UX.

**Ver guia completo:** `docs/SISTEMA-EMAIL-POR-AREA.md`

---

## 🧪 TESTES E VALIDAÇÃO

### Teste Completo do Fluxo:

1. **Acessar checkout:**
   - URL: `/pt/[area]/checkout`
   - Verificar se campo de e-mail aparece (se não logado)
   - Selecionar plano

2. **Fazer checkout:**
   - Preencher e-mail (se necessário)
   - Clicar em "Continuar para Pagamento"
   - Verificar redirecionamento para Mercado Pago

3. **Fazer pagamento:**
   - Preencher dados do cartão
   - Verificar parcelamento (se plano anual)
   - Completar pagamento

4. **Verificar webhook:**
   - Verificar logs no Vercel
   - Verificar se usuário foi criado no Supabase
   - Verificar se perfil foi criado

5. **Verificar e-mail:**
   - Verificar caixa de entrada
   - Verificar se e-mail de boas-vindas foi enviado
   - Clicar no link de acesso
   - Verificar se acessa dashboard

6. **Verificar no banco:**
   ```sql
   -- Verificar usuário criado
   SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 1;
   
   -- Verificar perfil criado
   SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 1;
   
   -- Verificar subscription criada
   SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 1;
   
   -- Verificar token de acesso criado
   SELECT * FROM access_tokens ORDER BY created_at DESC LIMIT 1;
   ```

---

## 🔧 TROUBLESHOOTING

### ❌ E-mail não foi enviado

**Possíveis causas:**
- `RESEND_API_KEY` não configurada ou inválida
- Domínio não verificado (usar `onboarding@resend.dev` temporariamente)
- Verificar logs do Resend: https://resend.com/emails

**Solução:**
1. Verificar variáveis de ambiente
2. Verificar logs do Resend
3. Testar envio manual de e-mail

### ❌ Usuário não foi criado automaticamente

**Possíveis causas:**
- Webhook não está recebendo eventos
- `MERCADOPAGO_WEBHOOK_SECRET_LIVE` incorreto
- Erro no código do webhook

**Solução:**
1. Verificar logs no Vercel: Functions → Logs
2. Verificar configuração do webhook no Mercado Pago
3. Verificar se webhook está sendo chamado

### ❌ Parcelamento não aparece

**Possíveis causas:**
- Valor muito baixo para parcelamento
- Cartão não permite parcelamento
- Configuração no painel do Mercado Pago

**Solução:**
1. Verificar configuração no painel do Mercado Pago
2. Testar com outro cartão
3. Verificar valor mínimo para parcelamento

### ❌ Erro ao criar subscription

**Possíveis causas:**
- Tabela `subscriptions` não existe ou schema incorreto
- Erro no webhook

**Solução:**
1. Verificar logs do webhook
2. Verificar schema da tabela `subscriptions`
3. Verificar se campos obrigatórios estão presentes

---

## 📊 RESUMO

### ✅ O que NÃO precisa fazer (já está pronto):

- ❌ Criar APIs específicas (já são genéricas)
- ❌ Configurar Mercado Pago/Stripe (já está configurado)
- ❌ Configurar webhooks (já está configurado)
- ❌ Configurar preços (já está configurado)
- ❌ Configurar sistema de e-mail (já funciona para todas as áreas)

### ✅ O que PRECISA fazer:

- ✅ Criar página de checkout (`/pt/[area]/checkout/page.tsx`)
- ✅ Criar página de pagamento-sucesso (`/pt/[area]/pagamento-sucesso/page.tsx`)
- ✅ Criar páginas de e-mail (opcional, mas recomendado)
- ✅ Testar fluxo completo

### ⏱️ Tempo Estimado:

- **Checkout:** ~15 minutos por área
- **Pagamento Sucesso:** ~10 minutos por área
- **E-mail (opcional):** ~20 minutos por área
- **Testes:** ~15 minutos por área

**Total:** ~1h por área (ou ~30min se pular páginas de e-mail)

---

## 📚 DOCUMENTAÇÃO RELACIONADA

- `docs/CHECKLIST-ANTES-DE-TESTAR-PAGAMENTO.md` - Checklist antes de testar
- `docs/SISTEMA-EMAIL-POR-AREA.md` - Sistema de e-mails por área
- `docs/IMPLEMENTAR-CHECKOUT-OUTRAS-AREAS.md` - Guia rápido de implementação
- `scripts/CHECKOUT-SEM-AUTENTICACAO.sql` - Scripts SQL necessários

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Executar scripts SQL no Supabase
2. ✅ Configurar variáveis de ambiente
3. ✅ Criar páginas de checkout para outras áreas
4. ✅ Testar fluxo completo
5. ✅ Monitorar logs e métricas

---

**Última atualização:** Janeiro 2025  
**Status:** Sistema completo e funcional para wellness | Pronto para replicar em outras áreas

