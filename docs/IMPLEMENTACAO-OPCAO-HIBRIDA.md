# ✅ IMPLEMENTAÇÃO: OPÇÃO HÍBRIDA (CARTÃO + PIX)

## 🎯 O QUE FOI IMPLEMENTADO

### **1. Opção Híbrida no Checkout**

**Para plano mensal, o cliente agora pode escolher:**

1. **💳 Assinatura Automática (Padrão)**
   - Cobrança automática todo mês no cartão
   - Usa Preapproval (Mercado Pago)
   - Cliente não precisa fazer nada
   - Mais conveniente

2. **💰 Pagar via PIX**
   - Recebe aviso 7 dias antes de vencer
   - Paga manualmente via PIX
   - Usa Preference (pagamento único)
   - Mais controle

**Para plano anual:**
- Sempre usa pagamento único (permite PIX, Boleto e Cartão)
- Não há opção de escolha (já permite PIX)

---

## 🔧 COMO FUNCIONA

### **Fluxo Assinatura Automática (Cartão):**

```
1. Cliente escolhe "Plano Mensal"
2. Seleciona "Assinatura Automática"
3. Clica em "Continuar para Pagamento"
4. Sistema cria Preapproval (Mercado Pago)
5. Cliente autoriza cobrança recorrente (cartão)
6. Mercado Pago cobra automaticamente todo mês
7. Cliente recebe aviso quando próximo de vencer (banner no dashboard)
```

### **Fluxo PIX Manual:**

```
1. Cliente escolhe "Plano Mensal"
2. Seleciona "Pagar via PIX"
3. Clica em "Continuar para Pagamento"
4. Sistema cria Preference (Mercado Pago)
5. Cliente paga via PIX
6. Acesso ativado por 30 dias
7. 7 dias antes de vencer: sistema envia e-mail de aviso
8. Cliente paga novamente via PIX
9. Repete o ciclo
```

---

## 📋 ARQUIVOS MODIFICADOS

### **1. Frontend (Checkout):**
- `src/app/pt/wellness/checkout/page.tsx`
  - Adicionado estado `paymentMethod` ('auto' | 'pix')
  - Adicionado componente de seleção de método (apenas para mensal)
  - Envia `paymentMethod` na requisição

### **2. Backend (API):**
- `src/app/api/wellness/checkout/route.ts`
  - Aceita `paymentMethod` no body
  - Passa para `createCheckout`

- `src/app/api/[area]/checkout/route.ts`
  - Aceita `paymentMethod` no body
  - Passa para `createCheckout`

### **3. Gateway (Lógica de Pagamento):**
- `src/lib/payment-gateway.ts`
  - Adicionado `paymentMethod` em `CheckoutRequest`
  - Se `planType === 'monthly'` e `paymentMethod === 'pix'`:
    - Usa `createPreference` (pagamento único PIX)
  - Se `planType === 'monthly'` e `paymentMethod === 'auto'` (ou não especificado):
    - Usa `createRecurringSubscription` (assinatura recorrente)

### **4. Webhook (Processamento):**
- `src/app/api/webhooks/mercado-pago/route.ts`
  - Detecta se é PIX (`payment_method_id === 'account_money' || 'pix'`)
  - Se for PIX mensal, marca `reminder_sent = false` (precisa enviar aviso)
  - Se for cartão automático, `reminder_sent = null` (não precisa aviso)

### **5. Sistema de Avisos:**
- `src/lib/subscription-reminders.ts` (NOVO)
  - Função `getExpiringSubscriptions()`: busca assinaturas vencendo em 7 dias
  - Função `sendRenewalReminder()`: envia e-mail de aviso (placeholder)
  - Função `markReminderSent()`: marca aviso como enviado

### **6. Banco de Dados:**
- `scripts/adicionar-reminder-sent-subscriptions.sql` (NOVO)
  - Adiciona campo `reminder_sent` na tabela `subscriptions`
  - Cria índice para buscar assinaturas que precisam de aviso

---

## ✅ SISTEMA DE BLOQUEIO (JÁ EXISTENTE)

### **Como Funciona:**

1. **Componente `RequireSubscription`:**
   - Verifica se usuário tem assinatura ativa
   - Verifica `status = 'active'` e `current_period_end > agora`
   - Se não tiver, mostra página de upgrade

2. **API `/api/[area]/subscription/check`:**
   - Verifica assinatura ativa no banco
   - Retorna `hasActiveSubscription: true/false`

3. **Banner de Aviso:**
   - Mostra quando faltam 7 dias ou menos
   - Link para renovar assinatura

### **Resposta à Pergunta:**

**"O sistema já está programado pra bloquear quando o pagamento não houver?"**

✅ **SIM!** O sistema já bloqueia:

- Se `status !== 'active'` → bloqueia
- Se `current_period_end < agora` → bloqueia
- Se não tiver assinatura → mostra página de upgrade

**Quem escolhe cartão automático:**
- ✅ Recebe cobrança automática
- ✅ Recebe aviso quando próximo de vencer (banner no dashboard)
- ✅ Se cartão falhar, Mercado Pago tenta novamente
- ✅ Se falhar definitivamente, status muda para `past_due` → bloqueia

**Quem escolhe PIX manual:**
- ✅ Recebe aviso 7 dias antes (e-mail + banner)
- ✅ Se não pagar até `current_period_end` → bloqueia
- ✅ Precisa pagar manualmente para renovar

---

## 🚀 PRÓXIMOS PASSOS

### **1. Executar SQL:**
```bash
# Adicionar campo reminder_sent
psql -h [HOST] -U [USER] -d [DATABASE] -f scripts/adicionar-reminder-sent-subscriptions.sql
```

### **2. Implementar Envio de E-mail:**
- Atualizar `src/lib/subscription-reminders.ts`
- Integrar com serviço de e-mail (Resend, SendGrid, etc.)
- Criar template de e-mail com QR Code PIX

### **3. Criar Job/Cron:**
- Verificar assinaturas vencendo diariamente
- Enviar e-mails de aviso
- Pode usar Vercel Cron ou serviço externo

### **4. Testar:**
- Testar assinatura automática (cartão)
- Testar PIX manual
- Verificar bloqueio quando vence
- Verificar avisos

---

## 📝 NOTAS

- **Assinatura automática** é o padrão (mais conveniente)
- **PIX manual** é opcional (mais controle)
- Sistema de bloqueio já funciona
- Sistema de avisos precisa implementar envio de e-mail

---

**Última atualização:** Janeiro 2025

