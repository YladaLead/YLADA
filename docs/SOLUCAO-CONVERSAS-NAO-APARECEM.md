# 🔧 Solução: Conversas não aparecem

## 🎯 PROBLEMA PRINCIPAL

As conversas só aparecem se:
1. ✅ Alguém enviou mensagem para o número conectado (`5519997230912`)
2. ✅ Webhook recebeu e salvou no banco
3. ✅ Você está logado como admin

---

## ✅ SOLUÇÃO RÁPIDA

### **1. Verificar se há mensagens no banco**

Execute no Supabase SQL Editor:

```sql
SELECT COUNT(*) as total FROM whatsapp_messages;
```

**Se retornar 0:**
- Ninguém enviou mensagem ainda
- OU webhook não está funcionando

**Se retornar > 0:**
- Mensagens existem, mas pode ser problema de autenticação

---

### **2. Enviar mensagem de teste**

1. Pegue um celular com WhatsApp
2. Envie mensagem para: **5519997230912**
3. Aguarde 5-10 segundos
4. Recarregue a página `/admin/whatsapp`

---

### **3. Verificar autenticação**

**No console do navegador (F12):**
- Deve aparecer: `✅ Conversas carregadas: X`
- Se aparecer erro 401: Faça logout e login novamente
- Se aparecer erro 403: Verifique se é admin

**Verificar se é admin no Supabase:**
```sql
SELECT 
  u.email,
  up.is_admin
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = 'seu-email@aqui.com';
```

---

### **4. Verificar webhook**

**Testar webhook manualmente:**

```bash
curl -X POST https://www.ylada.com/api/webhooks/z-api \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste manual",
    "name": "Teste",
    "instanceId": "3ED484E8415CF126D6009EBD599F8B90"
  }'
```

**Depois verificar no banco:**
```sql
SELECT * FROM whatsapp_messages 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## 🐛 PROBLEMAS COMUNS

### **Problema: "0 conversas" mas há mensagens no banco**

**Causa:** Erro de autenticação ou filtro.

**Solução:**
1. Abra o console (F12)
2. Veja se há erros
3. Verifique se está logado como admin
4. Tente limpar filtros (clicar em "Todas")

---

### **Problema: Webhook não recebe mensagens**

**Causa:** URL incorreta ou instância desconectada.

**Solução:**
1. Verificar na Z-API se webhook está salvo
2. Verificar se instância está "connected"
3. Verificar logs da Vercel (Functions → `/api/webhooks/z-api`)

---

### **Problema: Localhost não abre**

**Solução:**
1. Verificar se servidor está rodando: `lsof -ti:3000`
2. Se não estiver, rodar: `npm run dev`
3. Acessar: `http://localhost:3000/admin/whatsapp`

---

## 📋 CHECKLIST COMPLETO

- [ ] Instância cadastrada no banco (status = 'connected')
- [ ] Webhook configurado na Z-API
- [ ] Variável `Z_API_NOTIFICATION_PHONE` configurada
- [ ] Você está logado como admin
- [ ] Alguém enviou mensagem para `5519997230912`
- [ ] Mensagem foi salva no banco (verificar com SQL)
- [ ] API `/api/whatsapp/conversations` retorna dados (verificar console)

---

## 🧪 TESTE PASSO A PASSO

1. **Enviar mensagem de teste:**
   - WhatsApp → `5519997230912` → "Teste"

2. **Aguardar 10 segundos**

3. **Verificar no banco:**
   ```sql
   SELECT * FROM whatsapp_messages ORDER BY created_at DESC LIMIT 1;
   ```

4. **Se apareceu no banco:**
   - Recarregar `/admin/whatsapp`
   - Deve aparecer na interface

5. **Se não apareceu no banco:**
   - Verificar logs da Vercel
   - Verificar webhook na Z-API
   - Testar webhook manualmente (curl acima)

---

**Me envie o resultado de cada passo para eu ajudar a resolver!**
