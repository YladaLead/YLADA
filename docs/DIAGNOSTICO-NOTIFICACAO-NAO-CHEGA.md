# 🔍 Diagnóstico: Notificação Não Chega no 19981868000

## 🐛 PROBLEMA

Notificação não está chegando no telefone `19981868000` mesmo enviando mensagem de aparelho externo.

---

## ✅ VERIFICAÇÕES

### **1. Verificar Variável de Ambiente**

**Na Vercel:**
1. Acesse: https://vercel.com → Seu projeto → Settings → Environment Variables
2. Verifique se existe:
   ```
   Z_API_NOTIFICATION_PHONE=5519981868000
   ```
3. **IMPORTANTE:** Deve estar no formato internacional: `5519981868000` (não `19981868000`)

**No .env.local:**
```env
Z_API_NOTIFICATION_PHONE=5519981868000
```

---

### **2. Verificar Logs da Vercel**

Após enviar mensagem, verifique os logs da Vercel:

**Procure por:**
- `[Z-API Webhook] 📱 Enviando notificação para:`
- `[Z-API Webhook] ✅ Notificação enviada com sucesso`
- `[Z-API Webhook] ❌ Erro ao enviar notificação:`
- `[Z-API Webhook] ℹ️ Z_API_NOTIFICATION_PHONE não configurado`

**Se aparecer "não configurado":**
- Variável não está na Vercel
- Adicionar e fazer redeploy

**Se aparecer erro:**
- Verificar erro específico nos logs
- Pode ser problema com formato do número ou instância

---

### **3. Verificar Formato do Número**

O número deve estar no formato internacional:
- ✅ Correto: `5519981868000` (55 + DDD + número)
- ❌ Incorreto: `19981868000` (sem código do país)
- ❌ Incorreto: `551981868000` (DDD errado)

**Formato esperado:**
- `55` = código do país (Brasil)
- `19` = DDD
- `981868000` = número

**Total:** `5519981868000` (13 dígitos)

---

### **4. Testar Manualmente**

Execute no terminal:

```bash
curl -X POST https://api.z-api.io/instances/3ED484E8415CF126D6009EBD599F8B90/token/6633B5CACF7FC081FCAC3611/send-text \
  -H "Content-Type: application/json" \
  -H "Client-Token: F25db4f38d3bd46bb8810946b9497020aS" \
  -d '{
    "phone": "5519981868000",
    "message": "Teste de notificação manual"
  }'
```

**Se funcionar:** Número está correto ✅  
**Se não funcionar:** Verificar se número está correto ou se há restrição

---

### **5. Verificar se Instância Consegue Enviar**

A instância Z-API precisa conseguir enviar para esse número:
- Verificar se número está bloqueado
- Verificar se instância tem permissão para enviar
- Verificar se número está na mesma conta WhatsApp

---

## 🔧 SOLUÇÕES

### **Solução 1: Verificar Variável na Vercel**

1. Acesse Vercel → Settings → Environment Variables
2. Verifique `Z_API_NOTIFICATION_PHONE`
3. Deve ser: `5519981868000`
4. Se não estiver, adicionar e fazer redeploy

### **Solução 2: Verificar Logs**

Após enviar mensagem, verificar logs da Vercel:
- Se aparecer "não configurado" → Adicionar variável
- Se aparecer erro → Verificar erro específico
- Se não aparecer nada → Código não está executando

### **Solução 3: Testar Número Diferente**

Se possível, testar com outro número para verificar se o problema é específico do `19981868000`.

---

## 📋 CHECKLIST

- [ ] Verificar `Z_API_NOTIFICATION_PHONE` na Vercel (`5519981868000`)
- [ ] Verificar formato do número (13 dígitos com 55)
- [ ] Verificar logs da Vercel após enviar mensagem
- [ ] Testar manualmente via cURL
- [ ] Verificar se instância consegue enviar para esse número
- [ ] Verificar se número está bloqueado ou com restrição

---

**Verifique os logs da Vercel primeiro para ver o que está acontecendo!**
