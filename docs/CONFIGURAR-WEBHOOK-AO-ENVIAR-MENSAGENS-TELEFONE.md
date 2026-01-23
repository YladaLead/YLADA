# 🔧 Configurar Webhook "Ao Enviar" para Mensagens do Telefone/WhatsApp Web

## 🎯 PROBLEMA IDENTIFICADO

**Quando você envia mensagem:**
- ✅ **Pelo Admin WhatsApp** → Mensagem aparece imediatamente
- ❌ **Pelo telefone/WhatsApp Web** → Mensagem **NÃO aparece** no Admin WhatsApp

**Causa:** O webhook "Ao enviar" não está configurado na Z-API, então quando você envia pelo telefone, a Z-API não notifica o sistema.

---

## ✅ SOLUÇÃO: Configurar Webhook "Ao Enviar"

### **Passo a Passo:**

1. **Acesse o painel Z-API:**
   - URL: https://developer.z-api.com.br/
   - Faça login

2. **Vá para sua instância:**
   - Clique em **"Instâncias Web"**
   - Selecione a instância do WhatsApp Nutri

3. **Configure o webhook:**
   - Vá na aba **"Webhooks"**
   - No campo **"Ao enviar"**, cole:
     ```
     https://www.ylada.com/api/webhooks/z-api
     ```
   - **IMPORTANTE:** Deixe o toggle **"Notificar as enviadas por mim também"** **HABILITADO** ✅
   - Clique em **"Salvar"**

4. **Verifique a configuração:**
   - ✅ **"Ao receber"** → `https://www.ylada.com/api/webhooks/z-api`
   - ✅ **"Ao enviar"** → `https://www.ylada.com/api/webhooks/z-api`
   - ✅ **"Notificar as enviadas por mim também"** → HABILITADO ✅

---

## 🧪 TESTAR

### **Teste Completo:**

1. **Envie uma mensagem pelo telefone:**
   - Abra WhatsApp no seu celular
   - Envie uma mensagem para um número de teste
   - Aguarde 5-10 segundos

2. **Verifique no Admin WhatsApp:**
   - Acesse: `/admin/whatsapp`
   - Abra a conversa
   - **A mensagem deve aparecer** como enviada por "Telefone"

3. **Se não aparecer, verifique os logs:**
   - Acesse logs da Vercel
   - Procure por: `[Z-API Webhook] 📥 Payload completo recebido`
   - Procure por: `[Z-API Webhook] 🔍 Detecção de mensagem enviada`
   - Procure por: `isFromUs: true`

---

## 🔍 COMO FUNCIONA

```
Você envia pelo telefone/WhatsApp Web
    ↓
Z-API detecta que mensagem foi enviada
    ↓
Z-API chama webhook "Ao enviar"
    ↓
Sistema recebe webhook em /api/webhooks/z-api
    ↓
Sistema detecta: isFromUs = true
    ↓
Sistema salva mensagem com sender_type = 'agent'
    ↓
Mensagem aparece no Admin WhatsApp como "Telefone"
```

---

## 📊 LOGS PARA DEBUG

### **Quando Webhook é Chamado:**

```
[Z-API Webhook] 📥 Payload completo recebido: {...}
[Z-API Webhook] 🎯 Tipo de evento: sent
[Z-API Webhook] 🔍 Detecção de mensagem enviada: {
  isFromUs: true,
  fromMe: true,
  eventType: 'sent',
  ...
}
[Z-API Webhook] ✅ Mensagem salva no banco com sucesso
```

### **Se Webhook NÃO Estiver Configurado:**

**Você NÃO verá nenhum log** quando enviar pelo telefone.

**Solução:** Configure o webhook "Ao enviar" na Z-API.

---

## ⚠️ IMPORTANTE

### **Sem o Webhook "Ao Enviar":**
- ❌ Mensagens do telefone **NÃO aparecem** no Admin WhatsApp
- ❌ Mensagens do WhatsApp Web **NÃO aparecem** no Admin WhatsApp
- ✅ Mensagens enviadas pela interface Admin **aparecem** (porque são salvas diretamente)

### **Com o Webhook "Ao Enviar" Configurado:**
- ✅ Mensagens do telefone **aparecem** automaticamente
- ✅ Mensagens do WhatsApp Web **aparecem** automaticamente
- ✅ Mensagens enviadas pela interface Admin **continuam aparecendo**

---

## 🎯 CHECKLIST

- [ ] Acessar painel Z-API
- [ ] Ir em "Instâncias Web" → Sua instância
- [ ] Ir em "Webhooks"
- [ ] Configurar "Ao enviar" → `https://www.ylada.com/api/webhooks/z-api`
- [ ] Habilitar "Notificar as enviadas por mim também"
- [ ] Salvar configuração
- [ ] Testar enviando mensagem pelo telefone
- [ ] Verificar se mensagem aparece no Admin WhatsApp

---

## 📞 SUPORTE

Se após configurar o webhook as mensagens ainda não aparecerem:

1. **Verifique os logs da Vercel:**
   - Procure por `[Z-API Webhook]` nos logs
   - Verifique se `isFromUs: true` está aparecendo

2. **Verifique a configuração na Z-API:**
   - Confirme que o webhook está salvo
   - Confirme que "Notificar as enviadas por mim também" está habilitado

3. **Teste novamente:**
   - Envie uma mensagem pelo telefone
   - Aguarde 10 segundos
   - Verifique se aparece nos logs

---

**Configure o webhook "Ao enviar" para resolver o problema!** ✅
