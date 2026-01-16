# 🔍 Como Verificar Logs de Notificação

## 📋 O QUE PROCURAR NOS LOGS

Quando uma mensagem chega via webhook, você deve ver estes logs na Vercel:

### **Logs Esperados (em ordem):**

1. `[Z-API Webhook] 📥 Payload completo recebido:`
2. `[Z-API Webhook] 🔍 Dados normalizados:`
3. `[Z-API Webhook] ✅ Mensagem salva no banco`
4. `[Z-API Webhook] 🔔 Verificando notificação:` ← **IMPORTANTE**
5. `[Z-API Webhook] 📱 Enviando notificação para: 5519981868000` ← **IMPORTANTE**
6. `[Z-API Webhook] ✅ Notificação enviada com sucesso` ← **SUCESSO**
7. `[Z-API Webhook] ✅ Processamento completo`

---

## 🔍 COMO VERIFICAR

### **Passo 1: Acessar Logs da Vercel**

1. Acesse: https://vercel.com → Seu projeto
2. Clique em **"Logs"**
3. Filtre por: `[Z-API Webhook]` ou `🔔`

### **Passo 2: Enviar Mensagem de Teste**

1. Envie uma mensagem de um aparelho externo para: `5519997230912`
2. Aguarde 5-10 segundos
3. Volte aos logs da Vercel

### **Passo 3: Procurar Logs Específicos**

Procure por estas mensagens nos logs:

**Se aparecer:**
```
[Z-API Webhook] 🔔 Verificando notificação: { notificationPhone: 'NÃO CONFIGURADO' }
```
→ **Problema:** Variável não está configurada na Vercel

**Se aparecer:**
```
[Z-API Webhook] 🔔 Verificando notificação: { notificationPhone: '5519981868000' }
[Z-API Webhook] 📱 Enviando notificação para: 5519981868000
[Z-API Webhook] ❌ Erro ao enviar notificação: ...
```
→ **Problema:** Erro ao enviar (verificar erro específico)

**Se aparecer:**
```
[Z-API Webhook] ✅ Notificação enviada com sucesso para: 5519981868000
```
→ **Sucesso:** Notificação foi enviada (verificar se chegou no WhatsApp)

**Se NÃO aparecer nenhum log de notificação:**
→ **Problema:** Função `notifyAdmins` não está sendo chamada

---

## 🧪 TESTE MANUAL

Execute no terminal para testar se a notificação funciona:

```bash
curl -X POST https://api.z-api.io/instances/3ED484E8415CF126D6009EBD599F8B90/token/6633B5CACF7FC081FCAC3611/send-text \
  -H "Content-Type: application/json" \
  -H "Client-Token: F25db4f38d3bd46bb8810946b9497020aS" \
  -d '{
    "phone": "5519981868000",
    "message": "Teste de notificação - se você receber esta mensagem, a Z-API consegue enviar para este número"
  }'
```

**Se receber a mensagem no WhatsApp:**
- ✅ Z-API consegue enviar para esse número
- ✅ Problema está no código (verificar logs)

**Se não receber:**
- ❌ Problema pode ser com o número ou instância
- ❌ Verificar se número está bloqueado
- ❌ Verificar se instância tem permissão

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Enviar mensagem de aparelho externo para `5519997230912`
- [ ] Verificar logs da Vercel (filtro: `[Z-API Webhook]`)
- [ ] Procurar por `🔔 Verificando notificação`
- [ ] Verificar se mostra `notificationPhone: '5519981868000'` ou `'NÃO CONFIGURADO'`
- [ ] Procurar por `📱 Enviando notificação`
- [ ] Verificar se aparece `✅ Notificação enviada` ou `❌ Erro`
- [ ] Testar manualmente via cURL
- [ ] Verificar se mensagem chega no WhatsApp

---

**Envie uma mensagem de teste e me mostre os logs que aparecem com `🔔` ou `📱`!**
