# 🔍 Diagnóstico: Conversas não aparecem

## ✅ CHECKLIST DE VERIFICAÇÃO

### **1. Verificar se há mensagens no banco**

Execute no Supabase SQL Editor:

```sql
-- Verificar se há conversas
SELECT COUNT(*) as total_conversas 
FROM whatsapp_conversations;

-- Verificar se há mensagens
SELECT COUNT(*) as total_mensagens 
FROM whatsapp_messages;

-- Ver últimas conversas
SELECT 
  id,
  phone,
  name,
  area,
  status,
  total_messages,
  unread_count,
  last_message_at,
  created_at
FROM whatsapp_conversations
ORDER BY last_message_at DESC NULLS LAST
LIMIT 10;

-- Ver últimas mensagens
SELECT 
  id,
  conversation_id,
  sender_type,
  sender_name,
  message,
  created_at
FROM whatsapp_messages
ORDER BY created_at DESC
LIMIT 10;
```

---

### **2. Verificar se webhook está recebendo mensagens**

**Opção A: Verificar logs da Vercel**
1. Acesse: https://vercel.com/dashboard
2. Vá em **Deployments** → Último deploy
3. Clique em **Functions** → `/api/webhooks/z-api`
4. Procure por: `[Z-API Webhook] Mensagem recebida`

**Opção B: Testar webhook manualmente**

Envie uma requisição POST para testar:

```bash
curl -X POST https://www.ylada.com/api/webhooks/z-api \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste de mensagem",
    "name": "Teste",
    "instanceId": "3ED484E8415CF126D6009EBD599F8B90"
  }'
```

---

### **3. Verificar autenticação na API**

A API `/api/whatsapp/conversations` requer:
- ✅ Usuário autenticado
- ✅ Usuário com `role = 'admin'` OU `is_admin = true` no perfil

**Verificar se você é admin:**

Execute no Supabase:

```sql
SELECT 
  u.email,
  up.is_admin,
  up.perfil
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = 'seu-email@aqui.com';
```

---

### **4. Verificar se instância está cadastrada**

```sql
SELECT 
  name,
  instance_id,
  area,
  status,
  phone_number
FROM z_api_instances
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
```

Deve retornar a instância "Ylada Nutri" com status "connected".

---

### **5. Testar API diretamente**

**No navegador (com autenticação):**
1. Abra: `https://www.ylada.com/api/whatsapp/conversations`
2. Deve retornar JSON com conversas ou erro de autenticação

**Via curl (precisa token):**
```bash
# Primeiro, obtenha o token de autenticação
# Depois use:
curl -X GET https://www.ylada.com/api/whatsapp/conversations \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Cookie: SEUS_COOKIES_AQUI"
```

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### **Problema 1: Nenhuma conversa no banco**

**Causa:** Webhook não está recebendo mensagens ou não está salvando.

**Solução:**
1. Verificar se webhook está configurado na Z-API
2. Enviar mensagem de teste
3. Verificar logs do webhook
4. Verificar se há erros no banco

---

### **Problema 2: API retorna erro 401 (Não autenticado)**

**Causa:** Sessão expirada ou não está logado como admin.

**Solução:**
1. Fazer logout e login novamente
2. Verificar se é admin no banco
3. Limpar cookies e tentar novamente

---

### **Problema 3: API retorna erro 403 (Acesso negado)**

**Causa:** Usuário não é admin.

**Solução:**
1. Verificar `is_admin = true` no `user_profiles`
2. Ou verificar `role = 'admin'` no `user_metadata`

---

### **Problema 4: Webhook não está sendo chamado**

**Causa:** URL do webhook incorreta ou Z-API não está enviando.

**Solução:**
1. Verificar URL na Z-API: `https://www.ylada.com/api/webhooks/z-api`
2. Testar webhook manualmente (curl acima)
3. Verificar se instância está "connected" na Z-API

---

## 🧪 TESTE COMPLETO

### **Passo 1: Enviar mensagem de teste**
Envie do seu WhatsApp para: `5519997230912`

### **Passo 2: Verificar se chegou no banco**
Execute:
```sql
SELECT * FROM whatsapp_messages 
ORDER BY created_at DESC 
LIMIT 1;
```

### **Passo 3: Verificar se aparece na API**
Acesse: `https://www.ylada.com/api/whatsapp/conversations`
(Precisa estar logado como admin)

### **Passo 4: Verificar interface**
Acesse: `https://www.ylada.com/admin/whatsapp`

---

## 📞 PRÓXIMOS PASSOS

Se ainda não funcionar:

1. **Verificar logs da Vercel** (Functions → `/api/webhooks/z-api`)
2. **Verificar console do navegador** (F12 → Console)
3. **Verificar Network tab** (F12 → Network → `/api/whatsapp/conversations`)
4. **Enviar mensagem de teste** e verificar se chega no banco

---

**Me envie os resultados das verificações acima para eu ajudar a resolver!**
