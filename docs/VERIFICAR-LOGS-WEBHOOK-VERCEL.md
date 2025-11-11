# 🔍 Como Verificar Logs do Webhook no Vercel

## 📋 PASSO A PASSO

### 1. Acessar Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto **ylada-app** (ou o nome do seu projeto)

---

### 2. Encontrar os Logs do Webhook

#### **Opção A: Via Functions (Recomendado)**

1. Clique em **"Deployments"** no menu lateral
2. Clique no **último deploy** (o mais recente)
3. Na página do deploy, clique em **"Functions"**
4. Procure por: `/api/webhooks/mercado-pago`
5. Clique nele

**Você verá:**
- Lista de invocações recentes
- Status de cada invocação (200, 500, etc.)
- Tempo de execução
- Logs de cada invocação

---

#### **Opção B: Via Logs Gerais**

1. Clique em **"Logs"** no menu lateral
2. Filtre por: `webhook` ou `mercado-pago`
3. Veja os logs em tempo real

---

### 3. O Que Procurar nos Logs

#### ✅ **Logs de Sucesso (O que DEVE aparecer):**

```
📥 Webhook Mercado Pago recebido: { type: 'payment', action: 'payment.created', ... }
💳 Processando pagamento: 132767236607
📊 Status do pagamento: { approved: true, ... }
🆕 Criando usuário automaticamente após pagamento: portalmagra@gmail.com
✅ Usuário criado automaticamente: [user_id]
✅ Perfil criado manualmente
📧 VERIFICAÇÃO DE ENVIO DE E-MAIL
📧 ✅ TODAS AS CONDIÇÕES ATENDIDAS - INICIANDO ENVIO
📧 ✅ ✅ ✅ E-MAIL DE BOAS-VINDAS ENVIADO COM SUCESSO! ✅ ✅ ✅
✅ Subscription criada: [subscription_id]
```

---

#### ❌ **Logs de Erro (O que pode estar aparecendo):**

```
❌ User ID não encontrado no metadata do pagamento
❌ Erro ao criar usuário automaticamente: [erro]
❌ Erro ao salvar subscription: [erro]
❌ Erro ao enviar e-mail de boas-vindas: [erro]
❌ Resend não está configurado. Verifique RESEND_API_KEY.
```

---

### 4. Verificar Dados do Webhook

Procure por logs que mostram os dados recebidos:

```
📋 Dados completos do pagamento: {
  id: '132767236607',
  status: 'approved',
  metadata: { ... },
  external_reference: 'wellness_monthly_temp_portalmagra@gmail.com',
  payer: { email: 'portalmagra@gmail.com', ... }
}
```

**O que verificar:**
- ✅ `metadata.user_id` existe? (deve ser `temp_portalmagra@gmail.com`)
- ✅ `external_reference` está correto?
- ✅ `payer.email` está correto?

---

### 5. Verificar Se o Webhook Foi Chamado

**No Mercado Pago Dashboard:**
- Você viu que o webhook retornou **200 (Sucesso)**
- Isso significa que o webhook foi chamado e retornou sucesso

**Mas isso NÃO significa que:**
- O usuário foi criado
- A subscription foi criada
- O e-mail foi enviado

**O webhook pode retornar 200 mesmo se houver erros internos!**

---

## 🎯 CHECKLIST DE VERIFICAÇÃO

- [ ] Acessei o Vercel Dashboard
- [ ] Encontrei a função `/api/webhooks/mercado-pago`
- [ ] Vi os logs da invocação mais recente
- [ ] Verifiquei se há logs de erro
- [ ] Verifiquei se há logs de criação de usuário
- [ ] Verifiquei se há logs de criação de subscription
- [ ] Verifiquei se há logs de envio de e-mail
- [ ] Anotei os erros encontrados (se houver)

---

## 📝 O QUE ME ENVIAR

**Screenshots ou texto dos logs que mostram:**

1. ✅ **Logs do webhook** (primeiras linhas mostrando dados recebidos)
2. ✅ **Logs de criação de usuário** (se aparecer)
3. ✅ **Logs de criação de subscription** (se aparecer)
4. ✅ **Logs de envio de e-mail** (se aparecer)
5. ✅ **Logs de erro** (se houver algum)

**Exemplo de como copiar os logs:**
- Clique na invocação
- Copie todo o texto dos logs
- Ou tire screenshot

---

## 🔍 INTERPRETAÇÃO DOS LOGS

### **Cenário 1: Webhook não foi chamado**
- ❌ Nenhum log no Vercel
- **Causa:** Webhook não configurado ou URL incorreta
- **Solução:** Verificar configuração do webhook no Mercado Pago

---

### **Cenário 2: Webhook foi chamado, mas erro ao processar**
- ✅ Logs mostram: `📥 Webhook Mercado Pago recebido`
- ❌ Logs mostram: `❌ Erro ao...`
- **Causa:** Erro no processamento (criação de usuário, subscription, etc.)
- **Solução:** Verificar o erro específico nos logs

---

### **Cenário 3: Webhook processou, mas e-mail não enviado**
- ✅ Logs mostram: `✅ Usuário criado`
- ✅ Logs mostram: `✅ Subscription criada`
- ❌ Logs mostram: `❌ Erro ao enviar e-mail`
- **Causa:** Problema com Resend (API key, configuração, etc.)
- **Solução:** Verificar configuração do Resend

---

### **Cenário 4: Tudo processou, mas subscription não criada**
- ✅ Logs mostram: `✅ Usuário criado`
- ❌ Logs mostram: `❌ Erro ao salvar subscription`
- **Causa:** Erro ao salvar no banco de dados
- **Solução:** Verificar erro específico e schema do banco

---

**Última atualização:** 11/11/2025

