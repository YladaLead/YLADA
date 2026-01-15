# 🧪 Testar Webhook Manualmente

## 🎯 OBJETIVO

Testar se o webhook está funcionando enviando uma requisição manual.

---

## 📋 TESTE 1: Via cURL (Terminal)

Execute no terminal:

```bash
curl -X POST https://www.ylada.com/api/webhooks/z-api \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste manual do webhook",
    "name": "Teste Manual",
    "instanceId": "3ED484E8415CF126D6009EBD599F8B90",
    "timestamp": "2026-01-15T22:30:00Z"
  }'
```

**Resultado esperado:**
```json
{"received": true, "conversationId": "..."}
```

---

## 📋 TESTE 2: Via Postman/Insomnia

1. **Método:** POST
2. **URL:** `https://www.ylada.com/api/webhooks/z-api`
3. **Headers:**
   ```
   Content-Type: application/json
   ```
4. **Body (JSON):**
   ```json
   {
     "phone": "5511999999999",
     "message": "Teste manual do webhook",
     "name": "Teste Manual",
     "instanceId": "3ED484E8415CF126D6009EBD599F8B90",
     "timestamp": "2026-01-15T22:30:00Z"
   }
   ```

---

## 📋 TESTE 3: Verificar se Salvou no Banco

Após enviar o teste acima, execute no Supabase:

```sql
SELECT * FROM whatsapp_messages 
WHERE message LIKE '%Teste manual%'
ORDER BY created_at DESC 
LIMIT 1;
```

**Se aparecer:** Webhook está funcionando! ✅  
**Se não aparecer:** Webhook não está salvando (verificar logs)

---

## 🔍 VERIFICAR LOGS DA VERCEL

1. Acesse: https://vercel.com/dashboard
2. Vá em **Deployments** → Último deploy
3. Clique em **Functions** → `/api/webhooks/z-api`
4. Procure por:
   - `[Z-API Webhook] Mensagem recebida`
   - `[Z-API Webhook] Erro:`
   - Qualquer erro em vermelho

---

## 🐛 PROBLEMAS COMUNS

### **Erro 404: Not Found**
- Webhook não está configurado corretamente
- Verificar URL na Z-API

### **Erro 500: Internal Server Error**
- Verificar logs da Vercel
- Verificar se migration foi executada
- Verificar variáveis de ambiente

### **Mensagem não aparece no banco**
- Verificar logs da Vercel
- Verificar se instância está cadastrada
- Verificar se há erros no código

---

## ✅ CHECKLIST

- [ ] Webhook testado manualmente (curl/Postman)
- [ ] Mensagem apareceu no banco (verificar com SQL)
- [ ] Logs da Vercel verificados
- [ ] Instância cadastrada no banco
- [ ] Migration executada

---

**Execute o teste manual e me diga o resultado!**
