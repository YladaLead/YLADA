# 🧪 Como Testar o Webhook Manualmente

## 🎯 OBJETIVO

Testar se o webhook está acessível e funcionando antes de verificar os logs.

---

## 🚀 TESTE 1: Verificar se o Webhook Está Acessível

### Passo a Passo:

1. **Abra o navegador**

2. **Acesse:**
   ```
   https://www.ylada.com/api/webhooks/mercado-pago/test
   ```

3. **O que deve aparecer:**
   ```json
   {
     "success": true,
     "message": "Webhook está acessível!",
     "url": "...",
     "timestamp": "...",
     "environment": "production"
   }
   ```

4. **Se aparecer isso:**
   - ✅ O webhook está acessível
   - ✅ A rota está funcionando
   - ✅ Pode verificar os logs agora

5. **Se der erro 404:**
   - ❌ A rota não existe
   - ❌ Precisa fazer deploy

---

## 📤 TESTE 2: Simular um Webhook do Mercado Pago

### Passo a Passo:

1. **Abra o navegador** (ou use Postman/Insomnia)

2. **Faça uma requisição POST para:**
   ```
   https://www.ylada.com/api/webhooks/mercado-pago/test
   ```

3. **Com este corpo (JSON):**
   ```json
   {
     "type": "payment",
     "action": "payment.created",
     "data": {
       "id": "123456789",
       "status": "approved",
       "payer": {
         "email": "teste@email.com"
       }
     }
   }
   ```

4. **O que deve aparecer:**
   ```json
   {
     "success": true,
     "message": "Webhook de teste recebido com sucesso!",
     "receivedData": { ... },
     "timestamp": "..."
   }
   ```

5. **Depois, verifique os logs:**
   - Vercel Dashboard → Logs
   - Procure por: `🧪 TESTE DE WEBHOOK`
   - Se aparecer, significa que os logs estão funcionando!

---

## 🔍 TESTE 3: Verificar se o Webhook Real Está Sendo Chamado

### Passo a Passo:

1. **Acesse o Mercado Pago Dashboard:**
   - https://www.mercadopago.com.br/developers/panel

2. **Vá em "Webhooks" ou "Notificações"**

3. **Verifique o histórico:**
   - Há tentativas de notificação?
   - Status: Sucesso (200) ou Falha (500, 404, etc.)?
   - Quando foi a última tentativa?

4. **Se houver tentativas com falha:**
   - Veja o erro retornado
   - Pode ser 404 (rota não encontrada)
   - Pode ser 500 (erro interno)
   - Pode ser timeout

5. **Se não houver tentativas:**
   - O webhook pode não estar configurado
   - Ou os eventos não estão sendo disparados

---

## 📊 INTERPRETAÇÃO DOS RESULTADOS

### ✅ **Cenário 1: Teste 1 Funciona, Teste 2 Funciona**

**Significado:**
- ✅ Webhook está acessível
- ✅ Rota está funcionando
- ✅ Logs estão funcionando

**Próximo passo:**
- Verificar se o Mercado Pago está chamando o webhook
- Verificar logs do webhook real no Vercel

---

### ❌ **Cenário 2: Teste 1 Funciona, Teste 2 Não Funciona**

**Significado:**
- ✅ Webhook está acessível
- ❌ Processamento do webhook tem erro

**Próximo passo:**
- Verificar logs do erro
- Verificar código do webhook

---

### ❌ **Cenário 3: Teste 1 Não Funciona**

**Significado:**
- ❌ Webhook não está acessível
- ❌ Rota não existe ou não está deployada

**Próximo passo:**
- Verificar se o código está no repositório
- Fazer deploy da aplicação

---

## 🎯 CHECKLIST

- [ ] Testei se o webhook está acessível (`/api/webhooks/mercado-pago/test`)
- [ ] Testei simular um webhook (POST com dados de teste)
- [ ] Verifiquei logs no Vercel após o teste
- [ ] Verifiquei histórico de webhooks no Mercado Pago Dashboard

---

**Última atualização:** 11/11/2025

