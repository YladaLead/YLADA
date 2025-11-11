# 📸 Guia Visual: Como Verificar Logs do Webhook

## 🎯 OBJETIVO

Encontrar os logs do webhook `/api/webhooks/mercado-pago` no Vercel para ver se está sendo chamado.

---

## 🚀 MÉTODO 1: Via Aba "Logs" (MAIS FÁCIL)

### Passo a Passo:

1. **Acesse o Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecione o projeto **YLADA**

2. **Clique na aba "Logs"** (no topo, ao lado de "Deployments")

3. **Filtre pela rota:**
   - No campo de busca/filtro, digite: `/api/webhooks/mercado-pago`
   - Ou use o filtro "Route" e selecione a rota

4. **Veja os logs:**
   - Procure por logs que começam com `📥` ou `💳` ou `📧`
   - Se não aparecer nada, significa que o webhook não está sendo chamado

---

## 🔍 MÉTODO 2: Via "Deployments" (Alternativa)

### Passo a Passo:

1. **Acesse o Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecione o projeto **YLADA**

2. **Clique em "Deployments"** (no topo)

3. **Clique no último deploy** (o mais recente)

4. **Clique na aba "Functions"** (dentro do deploy)

5. **Procure por:**
   - `/api/webhooks/mercado-pago`
   - Clique na função para ver os logs

---

## 📊 MÉTODO 3: Via "Functions" (Mais Técnico)

### Passo a Passo:

1. **Acesse o Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecione o projeto **YLADA**

2. **Clique em "Settings"** (no topo)

3. **No menu lateral esquerdo, clique em "Functions"**

4. **⚠️ ATENÇÃO:** Esta página mostra **configurações** das functions, não os logs!

5. **Para ver logs, use o MÉTODO 1 ou 2 acima**

---

## 🎯 O QUE PROCURAR NOS LOGS

### ✅ **Se o webhook está funcionando, você verá:**

```
📥 Webhook Mercado Pago recebido: { type: 'payment', ... }
💳 Processando pagamento: 123456789
📧 VERIFICAÇÃO DE ENVIO DE E-MAIL
```

### ❌ **Se houver erro, você verá:**

```
❌ ❌ ❌ ERRO AO ENVIAR E-MAIL DE BOAS-VINDAS ❌ ❌ ❌
❌ RESEND_API_KEY NÃO CONFIGURADA!
```

### ⚠️ **Se não aparecer NADA:**

- O webhook **NÃO está sendo chamado** pelo Mercado Pago
- Precisa verificar configuração do webhook no Mercado Pago Dashboard

---

## 🔧 VERIFICAR CONFIGURAÇÃO DO WEBHOOK NO MERCADO PAGO

### Passo a Passo:

1. **Acesse:** https://www.mercadopago.com.br/developers/panel
   - Ou: https://www.mercadopago.com.br → Developers → Painel

2. **Vá em "Webhooks" ou "Notificações"**

3. **Verifique:**
   - ✅ URL configurada: `https://www.ylada.com/api/webhooks/mercado-pago`
   - ✅ Webhook está **ATIVO**
   - ✅ Eventos selecionados: **Pagamentos**, **Planos e assinaturas**, etc.

4. **Veja o histórico:**
   - Há tentativas de notificação?
   - Status: Sucesso ou Falha?
   - Quando foi a última tentativa?

---

## 📝 CHECKLIST RÁPIDO

- [ ] Tentei o **MÉTODO 1** (aba "Logs")
- [ ] Filtrei por `/api/webhooks/mercado-pago`
- [ ] Vi logs com emojis 📧 ou ❌
- [ ] Se não vi nada, verifiquei configuração no Mercado Pago Dashboard

---

## 🆘 SE NÃO CONSEGUIR ENCONTRAR

**Me envie:**
1. Screenshot da aba "Logs" do Vercel (mesmo que vazia)
2. Screenshot da configuração do webhook no Mercado Pago Dashboard
3. Data/hora do último pagamento que você fez

**Com essas informações, consigo ajudar melhor!**

---

**Última atualização:** 11/11/2025

