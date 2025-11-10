# 🔄 CONFIGURAR PLANO ANUAL COMO ASSINATURA RECORRENTE

## ✅ O QUE FOI FEITO NO CÓDIGO

O código já foi atualizado para que o **plano anual seja sempre assinatura recorrente**.

### **Mudanças:**
- ✅ `payment-gateway.ts`: Plano anual agora usa `createRecurringSubscription`
- ✅ `mercado-pago-subscriptions.ts`: Suporta frequência de 12 meses
- ✅ `webhook`: Calcula corretamente data de expiração (12 meses)

---

## 📋 O QUE VOCÊ PRECISA FAZER NO MERCADO PAGO

### **NADA!** ✅

**Por quê?**
- O código já cria a assinatura recorrente automaticamente via API
- Não precisa configurar nada no painel do Mercado Pago
- A frequência (12 meses) é definida no código

---

## 🔍 VERIFICAÇÃO

### **Como verificar se está funcionando:**

1. **Testar checkout:**
   - Acesse: `/pt/wellness/checkout`
   - Escolha: Plano Anual
   - Clique: "Continuar para Pagamento"
   - Deve redirecionar para Mercado Pago

2. **Verificar no Mercado Pago:**
   - Após criar checkout, verifique no painel:
   - Vá em: "Suas integrações" → "YLADA" → "Planos e assinaturas"
   - Deve aparecer uma assinatura com frequência de 12 meses

3. **Verificar no banco:**
   ```sql
   SELECT 
     id,
     user_id,
     area,
     plan_type,
     status,
     current_period_end,
     gateway
   FROM subscriptions 
   WHERE plan_type = 'annual'
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
   - `current_period_end` deve ser 12 meses no futuro
   - `status` deve ser `active`

---

## ⚠️ IMPORTANTE

### **Plano Anual Agora:**
- ✅ **Sempre assinatura recorrente**
- ✅ Renova automaticamente a cada 12 meses
- ✅ **APENAS cartão de crédito** (PIX não funciona com assinaturas)
- ✅ Cliente precisa cancelar se quiser parar

### **Avisos Necessários:**
- ⚠️ Avisar cliente que renova automaticamente
- ⚠️ Avisar 30 dias antes da renovação
- ⚠️ Permitir cancelamento fácil

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Código já está pronto** (nada a fazer)
2. ⏳ **Testar checkout** do plano anual
3. ⏳ **Verificar webhook** recebe notificações
4. ⏳ **Implementar avisos** de renovação (30 dias antes)

---

**Última atualização:** Janeiro 2025

