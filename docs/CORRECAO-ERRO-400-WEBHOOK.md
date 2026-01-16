# 🔧 Correção: Erro 400 no Webhook Z-API

## 🐛 PROBLEMA IDENTIFICADO

O webhook estava retornando **erro 400** porque o formato do payload da Z-API é diferente do esperado.

### **Formato Esperado (Incorreto):**
```json
{
  "phone": "5511999999999",
  "message": "Texto da mensagem"
}
```

### **Formato Real da Z-API:**
```json
{
  "phone": "5511999999999",
  "text": {
    "message": "Texto da mensagem"
  },
  "instance": "3ED484E8415CF126D6009EBD599F8B90",
  "messageId": "...",
  "type": "ReceivedCallback",
  "momment": 1234567890
}
```

---

## ✅ CORREÇÃO APLICADA

O webhook agora aceita **múltiplos formatos**:

1. **Formato Z-API oficial:** `text.message`
2. **Formato direto:** `message`
3. **Formato alternativo:** `text` (string)
4. **Formato alternativo:** `body`

Também normaliza:
- `instance` → `instanceId`
- `momment` (milissegundos) → `timestamp` (ISO string)
- `name`, `senderName`, `contactName` → `name`

---

## 🧪 TESTAR

Após o deploy, envie uma mensagem real para `5519997230912` e verifique:

1. **Logs da Vercel:**
   - Deve aparecer: `📥 Payload completo recebido:`
   - Deve aparecer: `🔍 Dados normalizados:`
   - Deve aparecer: `✅ Mensagem salva no banco`

2. **Banco de Dados:**
   ```sql
   SELECT * FROM whatsapp_messages 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```

3. **Interface Admin:**
   - Acesse `/admin/whatsapp`
   - Conversa deve aparecer automaticamente

---

## 📋 CHECKLIST

- [x] Webhook aceita formato Z-API (`text.message`)
- [x] Webhook aceita formato direto (`message`)
- [x] Normalização de campos (`instance` → `instanceId`)
- [x] Conversão de timestamp (`momment` → ISO)
- [x] Logs detalhados para debug
- [ ] Testar com mensagem real
- [ ] Verificar se salva no banco
- [ ] Verificar se aparece na interface

---

**O código foi corrigido e está pronto para deploy!**
