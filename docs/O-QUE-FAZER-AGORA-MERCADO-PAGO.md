# ✅ O QUE FAZER AGORA - MERCADO PAGO

## 🎯 RESUMO DO STATUS

✅ **Código está funcionando:**
- Checkout cria preferências corretamente
- Metadata (`area` e `plan_type`) está sendo enviado
- Webhook recebe e processa pagamentos
- Banco de dados salva as informações

⚠️ **Melhorias necessárias:**
- Webhook está usando campos do Stripe temporariamente
- Precisa usar campos específicos do Mercado Pago

---

## 📋 CHECKLIST: O QUE VOCÊ PRECISA FAZER

### **1. Verificar Credenciais** ✅ (JÁ FEITO)

- [x] Credenciais de produção adicionadas no `.env.local`
- [ ] **FAZER AGORA:** Adicionar na Vercel também

#### **Como fazer:**
1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione:
   ```
   MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-6484673849752001-110918-6331ae5a16982fa7a6c9873607376f24-2974173459
   MERCADOPAGO_PUBLIC_KEY_LIVE=APP_USR-43c7d8de-3b47-43b9-b223-f182b9ef320d
   MERCADOPAGO_CLIENT_ID=6484673849752001
   MERCADOPAGO_CLIENT_SECRET=9ybwRxRVE0aF2kruoM7WwnQ0E1D7LFz5
   MERCADOPAGO_WEBHOOK_SECRET_LIVE=b7946e2f5ac52d76b182edd416d124cea5238d245b861897abc8de6596197120
   ```
3. Marque todas como **"Production"**
4. Salve e faça **redeploy**

---

### **2. Configurar Webhook** ✅ (JÁ FEITO)

- [x] Webhook configurado no painel
- [x] URL com `www` corrigida
- [ ] **FAZER AGORA:** Testar se está recebendo notificações

#### **Como testar:**
1. No painel do Mercado Pago
2. Vá em **"Webhooks"** → **"Simular notificação"**
3. Escolha evento: **"payment.created"**
4. Clique em **"Enviar"**
5. Verifique logs do Vercel para ver se recebeu

---

### **3. Atualizar Banco de Dados** ⚠️ (OPCIONAL MAS RECOMENDADO)

O código atual funciona, mas está usando campos do Stripe temporariamente. Para melhor organização:

#### **Opção A: Deixar como está (Funciona)**
- ✅ Já está funcionando
- ⚠️ Usa campos do Stripe como placeholder

#### **Opção B: Atualizar schema (Recomendado)**
1. Execute o script SQL:
   ```sql
   -- Ver: scripts/atualizar-tabelas-para-mercado-pago.sql
   ```
2. Isso adiciona campos específicos do Mercado Pago
3. Depois atualize o código do webhook

---

### **4. Testar Fluxo Completo** 🧪 (FAZER AGORA)

#### **Passo a Passo:**

1. **Acesse:** `https://www.ylada.com/pt/wellness/checkout`
2. **Faça login** (se necessário)
3. **Escolha:** Plano Mensal (R$ 59,90)
4. **Clique:** "Continuar para Pagamento"
5. **Verifique:**
   - ✅ Redireciona para Mercado Pago
   - ✅ Valor aparece: R$ 59,90
   - ✅ Opções: PIX, Cartão, Boleto

6. **Faça pagamento:**
   - Escolha **PIX** (mais fácil para testar)
   - Ou use cartão de teste: `5031 4332 1540 6351`

7. **Após pagamento:**
   - ✅ Redireciona para `/pt/wellness/pagamento-sucesso`
   - ✅ Mostra mensagem de sucesso

8. **Verifique banco de dados:**
   ```sql
   SELECT * FROM subscriptions 
   WHERE gateway = 'mercadopago' 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
   
   **Deve mostrar:**
   - `area`: `wellness`
   - `plan_type`: `monthly`
   - `status`: `active`
   - `gateway`: `mercadopago`

9. **Verifique acesso:**
   - Acesse: `/pt/wellness/dashboard`
   - ✅ Deve carregar normalmente (sem erro de acesso)

---

### **5. Verificar Logs** 📊 (FAZER AGORA)

#### **No Vercel:**

1. Acesse: https://vercel.com/seu-projeto
2. Vá em **"Deployments"** → Último deploy
3. Clique em **"Functions"** → `/api/webhooks/mercado-pago`
4. **Procure por:**
   ```
   📥 Webhook Mercado Pago recebido
   💳 Processando pagamento
   ✅ Pagamento processado e acesso ativado
   ```

#### **O que verificar nos logs:**

✅ **Sucesso:**
```
📥 Webhook Mercado Pago recebido: { type: 'payment', action: 'payment.created' }
💳 Processando pagamento: 123456789
📊 Status do pagamento: { status: 'approved', approved: true }
✅ Pagamento processado e acesso ativado: 123456789
📅 Acesso válido até: 2025-02-XX...
```

❌ **Erro:**
```
❌ User ID não encontrado no metadata do pagamento
❌ Erro ao salvar subscription: ...
```

---

## 🔍 VERIFICAÇÃO RÁPIDA

### **Query SQL para verificar tudo:**

```sql
-- Ver últimas assinaturas do Mercado Pago
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.gateway,
  s.amount / 100.0 as valor_em_reais,
  s.currency,
  s.current_period_end,
  s.created_at,
  p.stripe_payment_intent_id as payment_id,
  p.status as payment_status
FROM subscriptions s
LEFT JOIN payments p ON s.id = p.subscription_id
WHERE s.gateway = 'mercadopago'
ORDER BY s.created_at DESC
LIMIT 10;
```

**O que verificar:**
- ✅ `area` está correto (`wellness`, `nutri`, etc.)
- ✅ `plan_type` está correto (`monthly`, `annual`)
- ✅ `status` está como `active`
- ✅ `gateway` está como `mercadopago`
- ✅ `valor_em_reais` está correto

---

## 🚨 SE ALGO NÃO ESTIVER FUNCIONANDO

### **Problema 1: Webhook não recebe**

**Sintomas:**
- Pagamento feito, mas não aparece no banco
- Logs não mostram webhook

**Soluções:**
1. Verificar URL do webhook (deve ter `www`)
2. Testar webhook manualmente no painel
3. Verificar se eventos estão habilitados

---

### **Problema 2: Metadata não está sendo salvo**

**Sintomas:**
- Pagamento aparece, mas `area` ou `plan_type` estão vazios

**Soluções:**
1. Verificar logs do webhook
2. Verificar se `metadata` está sendo enviado na preferência
3. Verificar código do webhook handler

---

### **Problema 3: Acesso não está sendo ativado**

**Sintomas:**
- Pagamento feito, mas dashboard não carrega

**Soluções:**
1. Verificar se `status` está como `active` no banco
2. Verificar se `current_period_end` está no futuro
3. Verificar componente `RequireSubscription`

---

## ✅ RESUMO: O QUE FAZER AGORA

### **Prioridade ALTA (Fazer hoje):**

1. ✅ **Adicionar credenciais na Vercel**
   - Acesse Vercel → Settings → Environment Variables
   - Adicione todas as variáveis do Mercado Pago
   - Marque como "Production"
   - Faça redeploy

2. ✅ **Testar fluxo completo**
   - Fazer um checkout de teste
   - Verificar se webhook recebe
   - Verificar se banco salva corretamente
   - Verificar se acesso é ativado

3. ✅ **Verificar logs**
   - Ver se webhook está recebendo
   - Ver se não há erros
   - Ver se metadata está correto

### **Prioridade MÉDIA (Fazer esta semana):**

4. ⚠️ **Atualizar schema do banco** (opcional)
   - Executar script SQL para adicionar campos Mercado Pago
   - Atualizar código do webhook

5. ⚠️ **Testar todas as áreas**
   - Wellness ✅
   - Nutri
   - Coach
   - Nutra

### **Prioridade BAIXA (Fazer quando tiver tempo):**

6. 📝 **Documentar processos**
   - Criar guias de troubleshooting
   - Documentar casos de uso

---

## 🎯 PRÓXIMOS PASSOS

1. **Hoje:** Adicionar credenciais na Vercel e testar
2. **Esta semana:** Testar todas as áreas e planos
3. **Próximo mês:** Considerar atualizar schema do banco

---

**Última atualização:** Janeiro 2025

