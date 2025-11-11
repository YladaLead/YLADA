# 🧪 Como Testar o Webhook em Produção

## ⚠️ IMPORTANTE

**Sim, faça o teste em modo de produção!** O problema está acontecendo em produção e precisamos ver os logs reais.

---

## 📋 ANTES DE TESTAR

### 1. Aguardar Deploy

1. Após fazer `git push`, aguarde o deploy no Vercel
2. Verifique se o deploy foi concluído com sucesso
3. Aguarde 1-2 minutos para garantir que o código está ativo

---

## 🧪 COMO FAZER O TESTE

### 1. Fazer um Pagamento de Teste

1. Acesse: https://www.ylada.com/pt/wellness/checkout
2. Escolha um plano (mensal ou anual)
3. Preencha o e-mail (ou use o e-mail logado)
4. Clique em "Continuar para Pagamento"
5. Complete o pagamento no Mercado Pago

---

### 2. Aguardar Webhook (1-2 minutos)

- O Mercado Pago geralmente chama o webhook em 1-2 minutos após o pagamento
- Aguarde antes de verificar os logs

---

### 3. Verificar Logs no Vercel

1. Acesse: https://vercel.com/dashboard
2. Seu projeto → **Logs**
3. Filtre por: `/api/webhooks/mercado-pago`
4. Procure pela invocação mais recente (deve ser de agora)

---

## 🔍 O QUE PROCURAR NOS LOGS

### ✅ **Logs que DEVEM aparecer:**

```
📥 Webhook Mercado Pago recebido: { type: 'payment', ... }
💳 Processando pagamento: [payment_id]
🔍 Tentando extrair user_id: { ... }
📋 Partes do external_reference: [ ... ]
✅ User ID encontrado/criado: temp_portalmagra@gmail.com
🆕 Criando usuário automaticamente após pagamento: portalmagra@gmail.com
✅ Usuário criado automaticamente: [user_id]
✅ Subscription criada: [subscription_id]
📧 E-MAIL DE BOAS-VINDAS ENVIADO COM SUCESSO!
```

---

### ❌ **Logs de erro (se aparecerem):**

```
❌ User ID não encontrado no metadata do pagamento
📋 Dados disponíveis para debug: { ... }
```

**Se aparecer esse erro, me envie os dados completos do debug!**

---

## 📝 O QUE ME ENVIAR

Após o teste, me envie:

1. ✅ **Screenshot ou texto dos logs** do webhook (especialmente a parte com `🔍 Tentando extrair user_id:`)
2. ✅ **Data/hora** do pagamento
3. ✅ **E-mail** usado no pagamento
4. ✅ **Payment ID** do Mercado Pago (se tiver)

---

## ⚠️ IMPORTANTE

- **Não faça muitos pagamentos de teste** - cada um custa dinheiro real
- **Faça apenas 1 pagamento de teste** para ver os logs
- **Aguarde os logs aparecerem** antes de fazer outro teste

---

**Última atualização:** 11/11/2025

