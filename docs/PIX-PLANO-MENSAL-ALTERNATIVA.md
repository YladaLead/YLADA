# 💡 ALTERNATIVA: PIX NO PLANO MENSAL COM AVISOS

## ❓ PERGUNTA

**"Não poderia também trabalhar com PIX no mensal e a pessoa é avisada alguns dias antes de vencer?"**

---

## ⚠️ LIMITAÇÃO DO MERCADO PAGO

### **Assinaturas Recorrentes (Preapproval):**
- ❌ **NÃO suporta PIX**
- ❌ **NÃO suporta Boleto**
- ✅ **APENAS cartão de crédito**

**Por quê?**
- PIX e Boleto são pagamentos únicos
- Não podem ser automatizados
- Cliente precisa fazer manualmente todo mês

---

## ✅ SOLUÇÃO ALTERNATIVA: PIX MANUAL COM AVISOS

### **Como Funcionaria:**

1. **Cliente assina plano mensal**
2. **Sistema cria "assinatura" no banco** (mas não no Mercado Pago)
3. **Acesso ativado por 30 dias**
4. **7 dias antes de vencer:**
   - Sistema envia e-mail de aviso
   - Mostra QR Code PIX para renovação
   - Cliente paga manualmente
5. **Após pagamento:**
   - Sistema renova acesso por mais 30 dias
   - Repete o ciclo

---

## 🔧 IMPLEMENTAÇÃO

### **Opção 1: Híbrida (Recomendada)**

**Oferecer duas opções:**

1. **Assinatura Automática (Cartão):**
   - Cobrança automática todo mês
   - Cliente não precisa fazer nada
   - Usa Preapproval do Mercado Pago

2. **PIX Manual (Com Avisos):**
   - Cliente recebe aviso 7 dias antes
   - Paga via PIX manualmente
   - Sistema renova acesso após pagamento

**Na página de checkout:**
```
┌─────────────────────────────┐
│ Plano Mensal - R$ 59,90      │
├─────────────────────────────┤
│ 💳 Assinatura Automática     │
│    (Cartão - Cobrança auto)  │
│                              │
│ 💰 Pagamento Manual (PIX)    │
│    (Recebe aviso 7 dias antes)│
└─────────────────────────────┘
```

---

### **Opção 2: Apenas PIX Manual**

**Remover assinatura recorrente e usar apenas PIX:**

1. Cliente escolhe plano mensal
2. Sistema cria pagamento único via PIX
3. Cliente paga
4. Acesso ativado por 30 dias
5. 7 dias antes de vencer: sistema envia aviso
6. Cliente paga novamente via PIX
7. Repete

**Vantagens:**
- ✅ Funciona com PIX
- ✅ Cliente controla quando paga
- ✅ Mais flexível

**Desvantagens:**
- ❌ Cliente precisa lembrar de pagar
- ❌ Mais chance de não renovar
- ❌ Mais trabalho manual

---

## 📋 IMPLEMENTAÇÃO TÉCNICA

### **Sistema de Avisos:**

```typescript
// src/lib/subscription-reminders.ts

export async function checkExpiringSubscriptions() {
  // Buscar assinaturas que vencem em 7 dias
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

  const { data: expiring } = await supabaseAdmin
    .from('subscriptions')
    .select('*, user_profiles(email)')
    .eq('status', 'active')
    .eq('plan_type', 'monthly')
    .lte('current_period_end', sevenDaysFromNow.toISOString())
    .is('reminder_sent', false)

  // Enviar e-mail de aviso com QR Code PIX
  for (const subscription of expiring) {
    await sendRenewalReminder(subscription)
  }
}
```

### **Criar Checkout PIX para Renovação:**

```typescript
// Quando cliente clica em "Renovar via PIX"
const preference = await createPreference({
  area: subscription.area,
  planType: 'monthly',
  userId: subscription.user_id,
  userEmail: user.email,
  amount: 59.90,
  description: 'Renovação YLADA Wellness - Mensal',
  // ... URLs
})
```

---

## 🎯 RECOMENDAÇÃO

### **Opção Híbrida (Melhor dos dois mundos):**

**Na página de checkout, oferecer:**

1. **"Assinatura Automática"** (Padrão)
   - Usa Preapproval (cartão)
   - Cobrança automática
   - Mais conveniente

2. **"Prefiro pagar via PIX"** (Alternativa)
   - Usa Preference (PIX)
   - Cliente recebe aviso 7 dias antes
   - Mais controle

**Vantagens:**
- ✅ Oferece flexibilidade
- ✅ Cliente escolhe o que prefere
- ✅ Mantém conveniência da assinatura automática
- ✅ Permite PIX para quem prefere

---

## 🔧 COMO IMPLEMENTAR A OPÇÃO HÍBRIDA

### **1. Atualizar Página de Checkout:**

Adicionar opção para escolher método:

```typescript
// src/app/pt/wellness/checkout/page.tsx

const [paymentMethod, setPaymentMethod] = useState<'auto' | 'pix'>('auto')

// No checkout:
if (planType === 'monthly' && paymentMethod === 'pix') {
  // Usar Preference (PIX) em vez de Preapproval
  // Criar sistema de avisos
} else if (planType === 'monthly') {
  // Usar Preapproval (assinatura automática)
}
```

### **2. Criar Sistema de Avisos:**

- Job diário que verifica assinaturas vencendo
- Envia e-mail 7 dias antes
- Mostra QR Code PIX para renovação

### **3. Criar Página de Renovação:**

- `/pt/wellness/renovar`
- Mostra QR Code PIX
- Cliente paga
- Sistema renova acesso

---

## ⚠️ CONSIDERAÇÕES

### **Desvantagens do PIX Manual:**
- Cliente pode esquecer de pagar
- Mais chance de cancelamento
- Requer sistema de avisos
- Mais trabalho manual

### **Vantagens da Assinatura Automática:**
- Cliente não precisa fazer nada
- Maior retenção
- Menos trabalho manual
- Mais conveniente

---

## 💡 RECOMENDAÇÃO FINAL

**Para começar:**
1. ✅ Use **assinatura automática** (Preapproval) como padrão
2. ✅ Ofereça **PIX manual** como alternativa
3. ✅ Implemente sistema de avisos para PIX

**Depois:**
- Analise qual método os clientes preferem
- Ajuste conforme necessário

---

**Última atualização:** Janeiro 2025

