# 📧 SISTEMA DE E-MAIL E PLANO ANUAL

## 1️⃣ SISTEMA DE ENVIO DE E-MAIL

### **Opções Recomendadas:**

#### **Opção A: Resend (Recomendado para Next.js)** ✅

**Por quê:**
- ✅ Moderno e fácil de usar
- ✅ Ótima integração com Next.js
- ✅ API simples
- ✅ Plano gratuito generoso (3.000 e-mails/mês)
- ✅ Templates React suportados

**Como funciona:**
1. Criar conta em: https://resend.com
2. Obter API Key
3. Instalar: `npm install resend`
4. Configurar variável: `RESEND_API_KEY`
5. Usar no código para enviar e-mails

**Custo:**
- Grátis: 3.000 e-mails/mês
- Pago: $20/mês para 50.000 e-mails

---

#### **Opção B: SendGrid**

**Por quê:**
- ✅ Muito popular e confiável
- ✅ Boa documentação
- ✅ Plano gratuito (100 e-mails/dia)

**Como funciona:**
1. Criar conta em: https://sendgrid.com
2. Obter API Key
3. Instalar: `npm install @sendgrid/mail`
4. Configurar variável: `SENDGRID_API_KEY`
5. Usar no código para enviar e-mails

**Custo:**
- Grátis: 100 e-mails/dia
- Pago: $19.95/mês para 50.000 e-mails

---

#### **Opção C: Supabase (Se já usa Supabase)**

**Por quê:**
- ✅ Já está usando Supabase
- ✅ Integração nativa
- ✅ Pode usar Edge Functions

**Como funciona:**
1. Configurar SMTP no Supabase
2. Usar Edge Functions para enviar e-mails
3. Ou usar Supabase Auth (envio automático)

**Custo:**
- Depende do plano do Supabase

---

### **Recomendação: Resend** ✅

**Motivos:**
- Mais fácil de implementar
- Melhor para Next.js
- API moderna
- Plano gratuito suficiente para começar

---

## 2️⃣ PLANO ANUAL É ASSINATURA?

### **Resposta: NÃO** ❌

**O plano anual NÃO é uma assinatura recorrente.**

### **Como Funciona:**

#### **Plano Mensal:**
- ✅ **É assinatura recorrente**
- Usa `Preapproval` (Mercado Pago)
- Cobrança automática todo mês
- Renovação automática
- Cliente precisa cancelar se quiser parar

#### **Plano Anual:**
- ❌ **NÃO é assinatura recorrente**
- Usa `Preference` (pagamento único)
- Cliente paga uma vez
- Acesso por 12 meses
- **NÃO renova automaticamente**
- Cliente precisa pagar novamente após 12 meses

### **Diferença no Código:**

```typescript
// Plano Mensal (Assinatura Recorrente)
if (request.planType === 'monthly') {
  if (request.paymentMethod === 'pix') {
    // PIX manual (pagamento único)
    createPreference(...)
  } else {
    // Cartão automático (assinatura recorrente)
    createRecurringSubscription(...) // ← ASSINATURA
  }
}

// Plano Anual (Pagamento Único)
else {
  // Sempre pagamento único
  createPreference(...) // ← PAGAMENTO ÚNICO
}
```

### **Resumo:**

| Plano | Tipo | Renovação | Cobrança |
|-------|------|-----------|----------|
| **Mensal (Cartão)** | ✅ Assinatura | Automática | Todo mês |
| **Mensal (PIX)** | ❌ Pagamento único | Manual | Cliente paga quando quiser |
| **Anual** | ❌ Pagamento único | Manual | Cliente paga novamente após 12 meses |

---

## 📋 IMPLEMENTAÇÃO DO E-MAIL

### **O que precisa fazer:**

1. **Escolher serviço** (Recomendado: Resend)
2. **Criar conta** e obter API Key
3. **Adicionar variável** no `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
4. **Instalar pacote**:
   ```bash
   npm install resend
   ```
5. **Atualizar** `src/lib/subscription-reminders.ts`:
   - Implementar envio real de e-mail
   - Criar template com QR Code PIX
6. **Criar job/cron**:
   - Verificar assinaturas vencendo diariamente
   - Enviar e-mails de aviso

---

## 🎯 CONCLUSÃO

**Sistema de E-mail:**
- Recomendado: **Resend**
- Fácil de implementar
- Plano gratuito suficiente

**Plano Anual:**
- ❌ **NÃO é assinatura**
- É pagamento único
- Acesso por 12 meses
- Não renova automaticamente

---

**Última atualização:** Janeiro 2025

