# 🔧 Configurar Webhook "Ao Enviar" para Mensagens do Telefone

## 🎯 PROBLEMA

Quando você envia mensagem **diretamente pelo telefone**, ela não aparece na área administrativa porque a Z-API não está notificando o sistema.

## ✅ SOLUÇÃO

Configure o webhook **"Ao enviar"** na Z-API para que o sistema seja notificado quando você enviar pelo telefone.

---

## 📋 PASSO A PASSO

### **1. Acessar Z-API**

1. Acesse: https://developer.z-api.com.br/
2. Faça login
3. Vá em **"Instâncias Web"**
4. Selecione sua instância (Nutri)

### **2. Configurar Webhook "Ao Enviar"**

1. Vá na aba **"Webhooks"**
2. No campo **"Ao enviar"**, cole:
   ```
   https://www.ylada.com/api/webhooks/z-api
   ```
3. **IMPORTANTE:** Deixe o toggle **"Notificar as enviadas por mim também"** **HABILITADO** ✅
4. Clique em **"Salvar"**

### **3. Verificar Configuração**

Você deve ter configurado:
- ✅ **"Ao receber"** → `https://www.ylada.com/api/webhooks/z-api`
- ✅ **"Ao enviar"** → `https://www.ylada.com/api/webhooks/z-api`
- ✅ **"Notificar as enviadas por mim também"** → HABILITADO ✅

---

## 🧪 TESTAR

### **Teste:**

1. Envie uma mensagem **pelo seu telefone** para um número de teste
2. Aguarde 5-10 segundos
3. Acesse `/admin/whatsapp`
4. Abra a conversa
5. **A mensagem deve aparecer** como enviada por "Telefone"

### **Verificar Logs:**

Se não aparecer, verifique os logs da Vercel procurando por:
- `[Z-API Webhook] 📤 Mensagem enviada por nós mesmos`
- `[Z-API Webhook] ✅ Mensagem salva no banco`

---

## 🔍 COMO FUNCIONA

```
Você envia pelo telefone
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
Mensagem aparece na interface como "Telefone"
```

---

## ⚠️ IMPORTANTE

- **Sem o webhook "Ao enviar" configurado:** Mensagens do telefone NÃO aparecem
- **Com o webhook "Ao enviar" configurado:** Mensagens do telefone aparecem automaticamente

**Configure o webhook "Ao enviar" para resolver o problema!** ✅
