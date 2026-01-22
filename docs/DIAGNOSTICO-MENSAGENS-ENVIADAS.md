# 🔍 Diagnóstico: Mensagens Enviadas Não Aparecem

## 🎯 PROBLEMA

Mensagens enviadas pelo WhatsApp Web ou telefone não aparecem na área administrativa.

---

## 🔍 DIAGNÓSTICO COMPLETO

### **1. Mensagens Enviadas pela Interface Admin (`/admin/whatsapp`)**

**Como funciona:**
- Quando você envia pela interface, a API `/api/whatsapp/conversations/[id]/messages` salva diretamente no banco
- **Deve aparecer imediatamente**

**Se não aparecer:**
- Verificar se há erro no console do navegador
- Verificar logs da Vercel para erros na API
- Verificar se a mensagem foi salva no banco (tabela `whatsapp_messages`)

---

### **2. Mensagens Enviadas pelo WhatsApp Web/Telefone**

**Como funciona:**
```
Você envia pelo WhatsApp Web/Telefone
    ↓
Z-API detecta envio
    ↓
Z-API chama webhook "Ao enviar"
    ↓
Sistema recebe webhook
    ↓
Sistema detecta: fromMe = true
    ↓
Sistema salva como sender_type = 'agent'
    ↓
Mensagem aparece na interface
```

**Se não aparecer:**
- **Webhook "Ao enviar" não configurado** (mais comum)
- Z-API não está enviando `fromMe = true`
- Webhook está retornando erro
- Sistema não está detectando corretamente

---

## ✅ SOLUÇÕES

### **Solução 1: Configurar Webhook "Ao Enviar"**

1. Acesse: https://developer.z-api.com.br/
2. Faça login
3. Vá em **"Instâncias Web"**
4. Selecione sua instância (Nutri)
5. Vá na aba **"Webhooks"**
6. No campo **"Ao enviar"**, cole:
   ```
   https://www.ylada.com/api/webhooks/z-api
   ```
7. **IMPORTANTE:** Deixe o toggle **"Notificar as enviadas por mim também"** **HABILITADO** ✅
8. Clique em **"Salvar"**

---

### **Solução 2: Verificar Logs**

Acesse os logs da Vercel e procure por:

**Se mensagem foi recebida:**
```
[Z-API Webhook] 📥 Payload completo recebido
[Z-API Webhook] 🔍 Detecção de mensagem enviada
[Z-API Webhook] 📤 ✅ MENSAGEM ENVIADA POR NÓS
[Z-API Webhook] ✅ Mensagem salva no banco com sucesso
```

**Se não aparecer esses logs:**
- Webhook "Ao enviar" não está configurado
- Z-API não está chamando o webhook

**Se aparecer mas não salvar:**
- Verificar erro específico nos logs
- Verificar se `isFromUs` está sendo detectado como `true`

---

### **Solução 3: Testar Manualmente**

1. Envie uma mensagem pelo telefone
2. Aguarde 10 segundos
3. Verifique logs da Vercel
4. Se não aparecer log, webhook não está configurado
5. Se aparecer log mas `isFromUs = false`, problema na detecção

---

## 🔧 MELHORIAS IMPLEMENTADAS

### **1. Detecção Melhorada de `fromMe`**

Agora detecta:
- `fromMe = true`
- `fromMe = 'true'`
- `fromMe = 1`
- `from_api = true`
- `isFromMe = true`
- `is_from_me = true`
- `eventType = 'sent'`
- `eventType = 'message_sent'`
- `status = 'sent'`
- `isSent = true`
- `from = número da instância`

### **2. Logs Melhorados**

Agora mostra:
- Detecção completa de `isFromUs`
- Todos os campos do payload
- Erros detalhados se não salvar
- Confirmação quando salvar com sucesso

---

## 🧪 TESTE COMPLETO

### **Teste 1: Mensagem pela Interface Admin**

1. Acesse `/admin/whatsapp`
2. Abra uma conversa
3. Envie uma mensagem
4. **Deve aparecer imediatamente** (verde, lado direito)

### **Teste 2: Mensagem pelo WhatsApp Web**

1. Abra WhatsApp Web no navegador
2. Envie uma mensagem para um número de teste
3. Aguarde 10 segundos
4. Acesse `/admin/whatsapp`
5. Abra a conversa
6. **Deve aparecer** como enviada por "Telefone"

### **Teste 3: Mensagem pelo Telefone**

1. Envie uma mensagem pelo seu telefone
2. Aguarde 10 segundos
3. Acesse `/admin/whatsapp`
4. Abra a conversa
5. **Deve aparecer** como enviada por "Telefone"

---

## 📊 VERIFICAR NO BANCO DE DADOS

Execute no Supabase:

```sql
-- Ver últimas mensagens enviadas
SELECT 
  id,
  created_at,
  sender_type,
  sender_name,
  message,
  z_api_message_id
FROM whatsapp_messages
WHERE sender_type = 'agent'
ORDER BY created_at DESC
LIMIT 10;
```

**Se não aparecer mensagens com `sender_type = 'agent'`:**
- Webhook "Ao enviar" não está configurado
- Ou mensagens não estão sendo salvas

---

## ⚠️ CHECKLIST

- [ ] Webhook "Ao enviar" configurado na Z-API
- [ ] Toggle "Notificar as enviadas por mim também" habilitado
- [ ] URL do webhook está correta: `https://www.ylada.com/api/webhooks/z-api`
- [ ] Mensagens pela interface admin aparecem
- [ ] Logs da Vercel mostram webhook sendo chamado
- [ ] Logs mostram `isFromUs = true` para mensagens enviadas
- [ ] Mensagens aparecem no banco de dados

---

## 🚨 SE AINDA NÃO FUNCIONAR

1. **Verificar logs da Vercel** - Procurar por erros específicos
2. **Verificar webhook na Z-API** - Confirmar que está configurado
3. **Testar webhook manualmente** - Usar Postman/Insomnia para simular
4. **Verificar banco de dados** - Ver se mensagens estão sendo salvas
5. **Contatar suporte Z-API** - Se webhook não está sendo chamado

---

## 📝 NOTAS

- Mensagens enviadas pela interface admin **sempre aparecem** (salvas diretamente)
- Mensagens do WhatsApp Web/Telefone **dependem do webhook**
- Sem webhook "Ao enviar", mensagens do telefone **nunca aparecem**
- Com webhook configurado, mensagens aparecem em **5-10 segundos**
