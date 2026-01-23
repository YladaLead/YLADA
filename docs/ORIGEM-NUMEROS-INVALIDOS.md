# 🔍 Origem dos Números Inválidos

## 🎯 DE ONDE ESTÃO VINDO?

Os números inválidos (como `55201035138232363`, `55212046914298015`) estão vindo do **payload da Z-API** quando ela envia webhooks.

---

## 📋 CAMPOS QUE Z-API ENVIA

### **Campos que podem conter telefone OU ID:**

1. **`body.phone`** - Pode ser:
   - ✅ Telefone real: `5519997230912`
   - ❌ ID do WhatsApp: `55201035138232363@c.us` ou `55201035138232363`

2. **`body.from`** - Pode ser:
   - ✅ Telefone real: `5519997230912`
   - ❌ ID do WhatsApp: `55201035138232363@c.us` ou `55201035138232363`

3. **`body.to`** - Pode ser:
   - ✅ Telefone real: `5519997230912`
   - ❌ ID do WhatsApp: `55201035138232363@c.us` ou `55201035138232363`

### **Campos que são SEMPRE IDs (não usar):**

- ❌ `body.remoteJid` - Sempre é ID: `55201035138232363@c.us`
- ❌ `body.chatId` - Sempre é ID do chat
- ❌ `body.messageId` - Sempre é ID da mensagem

---

## 🔍 POR QUE ACONTECEU?

### **Antes da Validação (Números já salvos):**

1. **Z-API enviava webhook com:**
   ```json
   {
     "phone": "55201035138232363",  // ID do WhatsApp, não telefone!
     "from": "55201035138232363@c.us",
     "text": { "message": "Olá" }
   }
   ```

2. **Código antigo pegava:**
   ```typescript
   phone = body.phone || body.from || body.remoteJid
   // Resultado: "55201035138232363" (17 dígitos - ID, não telefone!)
   ```

3. **Salvava no banco:**
   ```sql
   INSERT INTO whatsapp_conversations (phone, ...) 
   VALUES ('55201035138232363', ...)  -- ❌ ID salvo como telefone!
   ```

4. **Resultado:** Números inválidos no banco de dados

---

## ✅ O QUE FOI CORRIGIDO

### **1. Validação Rigorosa (Agora):**

```typescript
// Extrair phone
phone = body.from || body.phone || body.sender || body.number

// Se contém @, extrair número
if (phone.includes('@')) {
  phone = phone.split('@')[0]  // Remove @c.us
}

// VALIDAÇÃO: Rejeitar se muito longo
if (cleanPhone.length > 15) {
  return error  // ❌ Não salva!
}
```

### **2. Logs Detalhados:**

Agora mostra:
```
[Z-API Webhook] 📱 TODOS os campos do payload relacionados a telefone: {
  phone: "55201035138232363",  // ← ID do WhatsApp
  from: "55201035138232363@c.us",  // ← ID do WhatsApp
  selected: "55201035138232363"  // ← Será rejeitado (>15 dígitos)
}
```

### **3. Rejeição Antes de Salvar:**

Se o número for inválido (>15 dígitos), o webhook retorna erro 400 e **NÃO salva** a conversa.

---

## 🔍 COMO IDENTIFICAR A ORIGEM

### **Verificar Logs da Vercel:**

1. Acesse logs da Vercel
2. Procure por: `[Z-API Webhook] 📥 Payload completo recebido`
3. Veja qual campo está sendo usado:
   - `phone: "..."` - Qual valor?
   - `from: "..."` - Qual valor?
   - `to: "..."` - Qual valor?

### **Exemplo de Payload Problemático:**

```json
{
  "type": "ReceivedCallback",
  "phone": "55201035138232363",  // ← ID do WhatsApp (17 dígitos)
  "from": "55201035138232363@c.us",  // ← ID do WhatsApp
  "text": {
    "message": "Olá"
  }
}
```

**Problema:** `phone` contém ID do WhatsApp, não telefone real!

---

## 🎯 POR QUE Z-API ENVIA ISSO?

### **Possíveis Causas:**

1. **Z-API pode enviar IDs internos** quando:
   - Contato não está na agenda do WhatsApp
   - Mensagem vem de grupo
   - Contato está bloqueado
   - Instância não está totalmente conectada

2. **Formato do Payload varia:**
   - Às vezes envia telefone: `"phone": "5519997230912"`
   - Às vezes envia ID: `"phone": "55201035138232363"`

3. **Depende do tipo de evento:**
   - "Ao receber" pode ter formato diferente de "Ao enviar"
   - Status de mensagem pode ter formato diferente

---

## ✅ SOLUÇÃO ATUAL

### **1. Validação Prevenção:**
- ✅ Rejeita números > 15 dígitos ANTES de salvar
- ✅ Não salva mais números inválidos

### **2. Correção de Dados Existentes:**
- ✅ Endpoint para identificar números inválidos
- ✅ Endpoint para corrigir ou arquivar números inválidos

### **3. Logs Detalhados:**
- ✅ Mostra todos os campos do payload
- ✅ Mostra qual campo foi selecionado
- ✅ Mostra se foi rejeitado e por quê

---

## 📊 RESUMO

**Origem dos números inválidos:**
1. ✅ Z-API envia IDs do WhatsApp no campo `phone`/`from`/`to`
2. ✅ Código antigo salvava sem validar
3. ✅ Números inválidos ficaram no banco

**Solução:**
1. ✅ Validação agora rejeita números inválidos
2. ✅ Endpoints para identificar e corrigir números existentes
3. ✅ Logs detalhados para debug

---

**Os números inválidos vêm do payload da Z-API quando ela envia IDs do WhatsApp ao invés de telefones reais!** ✅
