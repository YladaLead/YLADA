# 🔍 Como Verificar Logs do Webhook no Vercel

## 🎯 OBJETIVO

Verificar se o webhook do Mercado Pago está sendo chamado e processando pagamentos corretamente.

---

## 📍 ONDE VERIFICAR

### **Opção 1: Via Functions (Recomendado)**

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **YLADA**
3. No menu lateral, clique em **Functions**
4. Procure por: `/api/webhooks/mercado-pago`
5. Clique na função
6. Veja os logs de invocações recentes

**O que procurar:**
- `📥 Webhook Mercado Pago recebido:`
- `💳 Processando pagamento:`
- `📧 VERIFICAÇÃO DE ENVIO DE E-MAIL`
- `❌ ❌ ❌ ERRO AO ENVIAR E-MAIL`

---

### **Opção 2: Via Deployments**

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **YLADA**
3. Clique em **Deployments**
4. Clique no último deploy
5. Clique na aba **Functions**
6. Procure por: `/api/webhooks/mercado-pago`
7. Clique na função para ver os logs

---

### **Opção 3: Via Logs Gerais (Menos Específico)**

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **YLADA**
3. Clique em **Logs**
4. No filtro **Route**, digite: `/api/webhooks/mercado-pago`
5. Veja os logs filtrados

**⚠️ ATENÇÃO:** Os logs gerais podem não mostrar todos os detalhes. Prefira usar **Functions**.

---

## 🔍 O QUE PROCURAR NOS LOGS

### ✅ **Logs de Sucesso:**

```
📥 Webhook Mercado Pago recebido: { type: 'payment', ... }
💳 Processando pagamento: 123456789
📧 VERIFICAÇÃO DE ENVIO DE E-MAIL
📧 ✅ TODAS AS CONDIÇÕES ATENDIDAS - INICIANDO ENVIO
📧 ✅ ✅ ✅ E-MAIL DE BOAS-VINDAS ENVIADO COM SUCESSO! ✅ ✅ ✅
```

### ❌ **Logs de Erro:**

```
❌ ❌ ❌ ERRO AO ENVIAR E-MAIL DE BOAS-VINDAS ❌ ❌ ❌
❌ RESEND_API_KEY NÃO CONFIGURADA!
❌ E-mail do pagador não disponível
```

### ⚠️ **Logs de Aviso:**

```
⚠️ E-mail de boas-vindas já foi enviado anteriormente
⚠️ Subscription não encontrada
⚠️ E-mail do pagador não disponível
```

---

## 📊 INTERPRETAÇÃO DOS LOGS

### **Cenário 1: Nenhum Log Aparece**

**Significado:**
- O webhook **NÃO está sendo chamado** pelo Mercado Pago
- Ou o webhook está sendo chamado mas não está chegando no Vercel

**Ações:**
1. Verificar configuração do webhook no Mercado Pago Dashboard
2. Verificar se a URL está correta: `https://www.ylada.com/api/webhooks/mercado-pago`
3. Verificar se o webhook está ativo no Mercado Pago

---

### **Cenário 2: Logs Aparecem Mas Sem E-mail**

**Significado:**
- O webhook está sendo chamado
- Mas o e-mail não está sendo enviado

**O que verificar nos logs:**
- `📧 VERIFICAÇÃO DE ENVIO DE E-MAIL` aparece?
- `📧 ✅ TODAS AS CONDIÇÕES ATENDIDAS` aparece?
- `❌ ❌ ❌ ERRO AO ENVIAR E-MAIL` aparece?

**Ações:**
- Se aparecer erro, verificar a mensagem de erro
- Se não aparecer `TODAS AS CONDIÇÕES ATENDIDAS`, verificar:
  - `hasSubscription`: Deve ser `true`
  - `welcomeEmailSent`: Deve ser `false`
  - `hasPayerEmail`: Deve ser `true`
  - `payerEmail`: Deve ter um e-mail válido

---

### **Cenário 3: Logs Aparecem e E-mail é Enviado**

**Significado:**
- Tudo está funcionando! ✅

**O que verificar:**
- Confirmar no Resend Dashboard que o e-mail foi enviado
- Verificar se o e-mail chegou na caixa de entrada (ou spam)

---

## 🎯 CHECKLIST

- [ ] Acessei **Functions** no Vercel
- [ ] Encontrei a função `/api/webhooks/mercado-pago`
- [ ] Verifiquei logs de invocações recentes
- [ ] Procurei por logs com emojis 📧
- [ ] Identifiquei se há erros ou sucessos
- [ ] Anotei os logs relevantes para análise

---

## 📝 EXEMPLO DE LOGS ESPERADOS

```
📥 Webhook Mercado Pago recebido: {
  type: 'payment',
  action: 'payment.created',
  live_mode: true,
  isTest: false
}

💳 Processando pagamento: 123456789
📋 Dados completos do pagamento: { ... }

📧 ========================================
📧 VERIFICAÇÃO DE ENVIO DE E-MAIL
📧 ========================================
📧 Condições para enviar e-mail: {
  hasSubscription: true,
  welcomeEmailSent: false,
  hasPayerEmail: true,
  payerEmail: 'usuario@email.com'
}

📧 ✅ TODAS AS CONDIÇÕES ATENDIDAS - INICIANDO ENVIO
📧 Base URL configurada: https://www.ylada.com
📧 ✅ Token de acesso criado: abc123...
📧 RESEND_API_KEY configurada: re_6Jt7HMA...
📧 ✅ sendWelcomeEmail executado sem erros
📧 ✅ E-mail marcado como enviado no banco
📧 ✅ ✅ ✅ E-MAIL DE BOAS-VINDAS ENVIADO COM SUCESSO! ✅ ✅ ✅
```

---

**Última atualização:** 11/11/2025

