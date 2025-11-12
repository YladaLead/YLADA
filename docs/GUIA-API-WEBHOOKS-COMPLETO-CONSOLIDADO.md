# 🔌 GUIA CONSOLIDADO: API e Webhooks

**Objetivo:** Documentar todas as rotas de API e webhooks do sistema  
**Última atualização:** Hoje  
**Versão:** 1.0.0

---

## 📋 ÍNDICE

1. [Estrutura de APIs](#1-estrutura-de-apis)
2. [APIs de Checkout](#2-apis-de-checkout)
3. [Webhooks de Pagamento](#3-webhooks-de-pagamento)
4. [APIs de Templates](#4-apis-de-templates)
5. [APIs de Autenticação](#5-apis-de-autenticação)
6. [APIs de E-mail](#6-apis-de-e-mail)
7. [APIs de Leads](#7-apis-de-leads)
8. [APIs Administrativas](#8-apis-administrativas)
9. [Testes e Debug](#9-testes-e-debug)

---

## 1. ESTRUTURA DE APIs

### **1.1. Organização**

```
src/app/api/
├── [area]/                    # APIs por área (wellness, nutri, etc.)
│   ├── checkout/              # Checkout de pagamento
│   ├── subscription/         # Verificação de assinatura
│   └── templates/            # Listagem de templates
├── webhooks/                  # Webhooks de pagamento
│   ├── mercado-pago/         # Webhook Mercado Pago
│   └── stripe-us/            # Webhook Stripe US
├── auth/                      # Autenticação
├── email/                     # Envio de e-mails
├── leads/                     # Gestão de leads
└── admin/                     # APIs administrativas
```

### **1.2. Padrões Gerais**

**Autenticação:**
- Usar `requireApiAuth()` para rotas protegidas
- Suporta checkout sem autenticação (apenas e-mail)

**Respostas:**
- Sucesso: `200` com JSON
- Erro: `400/500` com `{ error: string }`

**Logs:**
- Sempre logar início e fim de operações
- Incluir timestamps e IDs de rastreamento

---

## 2. APIS DE CHECKOUT

### **2.1. POST `/api/[area]/checkout`**

**Descrição:** Cria sessão de checkout unificada (Mercado Pago para BR, Stripe para resto)

**Áreas suportadas:**
- `wellness`
- `nutri` (futuro)
- `nutra` (futuro)
- `coach` (futuro)

**Request:**
```json
{
  "planType": "monthly" | "annual",
  "language": "pt" | "en" | "es",
  "paymentMethod": "auto" | "pix",
  "email": "usuario@email.com"  // Obrigatório se não autenticado
}
```

**Response (Sucesso):**
```json
{
  "checkoutUrl": "https://...",
  "sessionId": "xxx",
  "gateway": "mercado_pago" | "stripe"
}
```

**Response (Erro):**
```json
{
  "error": "Mensagem de erro"
}
```

**Exemplo:**
```typescript
// POST /api/wellness/checkout
const response = await fetch('/api/wellness/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    planType: 'monthly',
    language: 'pt',
    paymentMethod: 'auto',
    email: 'usuario@email.com'
  })
})
```

**Detecção de País:**
- Detecta automaticamente país do usuário
- Brasil → Mercado Pago
- Outros → Stripe

**Checkout sem Autenticação:**
- ✅ Aceita apenas e-mail
- ✅ Cria usuário no webhook após pagamento
- ✅ Envia link de acesso por e-mail

---

## 3. WEBHOOKS DE PAGAMENTO

### **3.1. POST `/api/webhooks/mercado-pago`**

**Descrição:** Processa eventos do Mercado Pago

**Headers:**
- `x-signature`: Assinatura do webhook
- `x-request-id`: ID da requisição

**Eventos Processados:**
- `payment` - Pagamento criado/atualizado
- `merchant_order` - Pedido criado/atualizado
- `subscription` / `preapproval` - Assinatura criada/atualizada

**Detecção de Teste/Produção:**
```typescript
const isTest = body.live_mode === false || body.live_mode === 'false'

// Em produção, ignorar webhooks de teste
if (process.env.NODE_ENV === 'production' && isTest) {
  return NextResponse.json({ received: true, message: 'Webhook de teste ignorado' })
}
```

**Fluxo de Processamento:**
1. Validar webhook secret (se configurado)
2. Detectar se é teste ou produção
3. Processar evento baseado no tipo
4. Ativar acesso do usuário
5. Enviar e-mail de confirmação

**Configuração:**
- **URL de Produção:** `https://www.ylada.com/api/webhooks/mercado-pago`
- **URL de Teste:** Deixar vazio (recomendado)
- **Webhook Secret:** `MERCADOPAGO_WEBHOOK_SECRET_LIVE`

**Documentação:** `docs/CONFIGURAR-WEBHOOK-MERCADO-PAGO.md` ⭐

---

### **3.2. POST `/api/webhooks/stripe-us`**

**Descrição:** Processa eventos do Stripe US (internacional)

**Headers:**
- `stripe-signature`: Assinatura do webhook (obrigatório)

**Eventos Processados:**
- `checkout.session.completed` - Checkout concluído
- `customer.subscription.created` - Assinatura criada
- `customer.subscription.updated` - Assinatura atualizada
- `customer.subscription.deleted` - Assinatura cancelada
- `invoice.payment_succeeded` - Pagamento aprovado
- `invoice.payment_failed` - Pagamento falhou

**Validação:**
```typescript
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  config.webhookSecret
)
```

**Configuração:**
- **URL de Produção:** `https://www.ylada.com/api/webhooks/stripe-us`
- **Webhook Secret:** `STRIPE_WEBHOOK_SECRET_US`

**Documentação:** `docs/CONFIGURAR-WEBHOOK-STRIPE-PASSO-A-PASSO.md` ⭐

---

### **3.3. Testar Webhooks**

**Mercado Pago:**
```bash
# Via Terminal (produção)
curl -X POST https://www.ylada.com/api/webhooks/mercado-pago \
  -H "Content-Type: application/json" \
  -H "x-signature: xxx" \
  -d '{"type": "payment", "data": {...}}'
```

**Stripe:**
```bash
# Via Stripe CLI (local)
stripe listen --forward-to localhost:3000/api/webhooks/stripe-us

# Via Terminal (produção)
curl -X POST https://www.ylada.com/api/webhooks/stripe-us \
  -H "Content-Type: application/json" \
  -H "stripe-signature: xxx" \
  -d '{"type": "checkout.session.completed", "data": {...}}'
```

**Documentação:** `docs/TESTAR-WEBHOOK-MANUALMENTE.md` ⭐

---

## 4. APIS DE TEMPLATES

### **4.1. GET `/api/[area]/templates`**

**Descrição:** Lista templates disponíveis para uma área

**Áreas suportadas:**
- `wellness`
- `nutri`

**Query Parameters:**
- `profession`: Filtrar por profissão (opcional)

**Response:**
```json
{
  "templates": [
    {
      "id": "uuid",
      "name": "Nome do Template",
      "description": "Descrição",
      "slug": "template-slug",
      "template_type": "quiz" | "calculator" | "checklist",
      "content": { ... },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Exemplo:**
```typescript
const response = await fetch('/api/wellness/templates?profession=wellness')
const data = await response.json()
```

---

### **4.2. GET `/api/nutri/templates`**

**Descrição:** Lista templates específicos da área Nutri

**Response:** Mesmo formato de `/api/[area]/templates`

---

## 5. APIS DE AUTENTICAÇÃO

### **5.1. POST `/api/auth/access-token`**

**Descrição:** Valida token de acesso enviado por e-mail

**Request:**
```json
{
  "token": "token-gerado"
}
```

**Response (Sucesso):**
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "email": "usuario@email.com"
  }
}
```

**Response (Erro):**
```json
{
  "valid": false,
  "error": "Token inválido ou expirado"
}
```

---

### **5.2. GET `/api/auth/check-profile`**

**Descrição:** Verifica se perfil do usuário está completo

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "hasProfile": true,
  "profile": {
    "id": "uuid",
    "email": "usuario@email.com",
    "perfil": "wellness"
  }
}
```

---

## 6. APIS DE E-MAIL

### **6.1. POST `/api/email/test`**

**Descrição:** Envia e-mail de teste (debug)

**Request:**
```json
{
  "email": "destinatario@email.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "E-mail de teste enviado com sucesso!",
  "emailId": "abc123...",
  "from": "noreply@ylada.com",
  "to": "destinatario@email.com"
}
```

**Exemplo:**
```bash
curl -X POST https://www.ylada.com/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "seu-email@gmail.com"}'
```

---

### **6.2. POST `/api/email/send-access-link`**

**Descrição:** Envia link de acesso por e-mail

**Request:**
```json
{
  "email": "usuario@email.com",
  "area": "wellness"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Link de acesso enviado por e-mail"
}
```

---

## 7. APIS DE LEADS

### **7.1. POST `/api/leads`**

**Descrição:** Cria novo lead

**Request:**
```json
{
  "name": "Nome do Lead",
  "email": "lead@email.com",
  "phone": "+5511999999999",
  "area": "wellness",
  "source": "template-slug"
}
```

**Response:**
```json
{
  "success": true,
  "leadId": "uuid"
}
```

---

## 8. APIS ADMINISTRATIVAS

### **8.1. POST `/api/admin/create-support-user`**

**Descrição:** Cria usuário de suporte (admin)

**Request:**
```json
{
  "email": "suporte@ylada.com",
  "name": "Nome do Suporte"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "uuid"
}
```

---

### **8.2. POST `/api/admin/migrar-templates-nutri`**

**Descrição:** Migra templates de Wellness para Nutri

**Request:**
```json
{
  "templateIds": ["uuid1", "uuid2"]
}
```

**Response:**
```json
{
  "success": true,
  "migrated": 2
}
```

---

## 9. TESTES E DEBUG

### **9.1. Verificar Logs no Vercel**

**Acesse:**
1. Vercel Dashboard → Seu Projeto
2. **Functions** → **Logs**
3. Filtrar por função (ex: `api/webhooks/mercado-pago`)

**Documentação:** `docs/COMO-VERIFICAR-LOGS-WEBHOOK-VERCEL.md` ⭐

---

### **9.2. Debug de Webhooks**

**Mercado Pago:**
```typescript
console.log('📥 Webhook Mercado Pago recebido:', {
  type: body.type,
  action: body.action,
  requestId,
  live_mode: body.live_mode,
  isTest: isTest,
  hasData: !!body.data
})
```

**Stripe:**
```typescript
console.log(`📥 Webhook US recebido: ${event.type}`)
```

**Documentação:** `docs/GUIA-VISUAL-LOGS-WEBHOOK.md` ⭐

---

### **9.3. Testar Localmente**

**Stripe CLI:**
```bash
# Instalar
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escutar webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe-us
```

**Mercado Pago:**
- Usar modo de teste no dashboard
- Configurar URL de teste (ou deixar vazio)

---

## 📚 REFERÊNCIAS

### **Documentos Relacionados:**
- `docs/CONFIGURAR-WEBHOOK-MERCADO-PAGO.md` ⭐
- `docs/CONFIGURAR-WEBHOOK-STRIPE-PASSO-A-PASSO.md` ⭐
- `docs/TESTAR-WEBHOOK-MANUALMENTE.md` ⭐
- `docs/COMO-VERIFICAR-LOGS-WEBHOOK-VERCEL.md` ⭐
- `docs/GUIA-VISUAL-LOGS-WEBHOOK.md` ⭐

### **Arquivos de Código:**
- `src/app/api/[area]/checkout/route.ts` - Checkout unificado
- `src/app/api/webhooks/mercado-pago/route.ts` - Webhook Mercado Pago
- `src/app/api/webhooks/stripe-us/route.ts` - Webhook Stripe US
- `src/lib/payment-gateway.ts` - Factory de gateways
- `src/lib/mercado-pago.ts` - Cliente Mercado Pago
- `src/lib/stripe-helpers.ts` - Helpers Stripe

---

## ✅ CONCLUSÃO

Este guia consolida todas as rotas de API e webhooks do sistema. Use como referência ao:
- Implementar novas APIs
- Configurar webhooks
- Testar integrações
- Debug de problemas

**Lembre-se:**
- ⚠️ Sempre validar autenticação em rotas protegidas
- ⚠️ Sempre validar assinatura em webhooks
- ⚠️ Sempre logar operações importantes
- ⚠️ Sempre tratar erros adequadamente

---

**Última atualização:** Hoje  
**Versão:** 1.0.0  
**Mantido por:** Equipe YLADA

