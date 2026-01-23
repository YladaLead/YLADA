# 🔍 Análise: Captação de Telefone no Webhook

## 🚨 PROBLEMA IDENTIFICADO

O sistema está captando números incorretos (IDs do WhatsApp ou outros identificadores) ao invés dos números reais de telefone.

---

## 📋 LÓGICA CORRIGIDA

### **Mensagem RECEBIDA (do cliente):**
- ✅ Telefone do cliente está em: `from` ou `phone`
- ❌ NÃO usar: `remoteJid`, `chatId` (são IDs do WhatsApp)

### **Mensagem ENVIADA (por nós):**
- ✅ Telefone do cliente está em: `to` ou `phone`
- ❌ NÃO usar: `from` (é nosso número)

---

## 🔧 CORREÇÕES IMPLEMENTADAS

### **1. Lógica Baseada no Tipo de Mensagem**

```typescript
if (isFromUs) {
  // Mensagem ENVIADA - telefone do cliente está em 'to'
  phone = body.to || body.phone || body.number
} else {
  // Mensagem RECEBIDA - telefone do cliente está em 'from'
  phone = body.from || body.phone || body.sender || body.number
}
```

### **2. Validação Rigorosa**

- ✅ Rejeita números com menos de 10 dígitos
- ✅ Rejeita números com mais de 15 dígitos
- ✅ Extrai número de IDs do WhatsApp (formato `@c.us`)
- ✅ Não usa `remoteJid` ou `chatId` (são IDs, não telefones)

### **3. Logs Detalhados**

Agora mostra:
- Todos os campos do payload relacionados a telefone
- Qual campo foi selecionado
- Se é mensagem recebida ou enviada
- Número original vs número formatado

---

## 🧪 COMO VERIFICAR

### **1. Ver Logs da Vercel**

Após receber uma mensagem, veja os logs:

```
[Z-API Webhook] 📱 TODOS os campos do payload relacionados a telefone: {
  phone: "...",
  from: "...",
  to: "...",
  selected: "..."
}
```

### **2. Verificar Qual Campo Está Sendo Usado**

Procure por:
- `📥 Mensagem RECEBIDA - Buscando telefone do REMETENTE`
- `📤 Mensagem ENVIADA - Buscando telefone do DESTINATÁRIO`

### **3. Verificar Número Final**

Procure por:
- `📱 Número final formatado`

---

## 🔍 CAMPOS QUE Z-API PODE ENVIAR

### **Campos de Telefone:**
- `phone` - Número do telefone
- `from` - Remetente (quem enviou)
- `to` - Destinatário (quem recebe)
- `sender` - Remetente alternativo
- `number` - Número alternativo

### **Campos que NÃO são telefones:**
- `remoteJid` - ID do WhatsApp (formato: `5519997230912@c.us`)
- `chatId` - ID do chat
- `messageId` - ID da mensagem

---

## ✅ PRÓXIMOS PASSOS

1. **Verificar logs** após receber uma mensagem
2. **Identificar qual campo** está sendo usado
3. **Ajustar se necessário** baseado nos logs

---

## 📊 EXEMPLO DE PAYLOAD Z-API

### **Mensagem Recebida:**
```json
{
  "type": "ReceivedCallback",
  "from": "5519997230912@c.us",
  "phone": "5519997230912",
  "text": {
    "message": "Olá"
  }
}
```

**Telefone correto:** `from` (sem o `@c.us`) = `5519997230912`

### **Mensagem Enviada:**
```json
{
  "type": "SentCallback",
  "to": "5519997230912@c.us",
  "phone": "5519997230912",
  "fromMe": true
}
```

**Telefone correto:** `to` (sem o `@c.us`) = `5519997230912`

---

## 🎯 RESULTADO ESPERADO

Agora o sistema:
- ✅ Pega o campo correto baseado no tipo de mensagem
- ✅ Extrai número de IDs do WhatsApp
- ✅ Valida se é telefone válido
- ✅ Rejeita números inválidos
- ✅ Mostra logs detalhados para debug
