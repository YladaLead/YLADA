# 🔧 Solução: Erros 403 e 405

## 🐛 PROBLEMAS IDENTIFICADOS

### **1. Erro 403 na API de Conversas**
- **Causa:** Você não está autenticado como admin ou não tem permissão
- **Solução:** Verificar se é admin no banco

### **2. Erro 405 no Webhook**
- **Causa:** Tentando acessar webhook via navegador (GET)
- **Solução:** Webhook só aceita POST (não pode abrir no navegador)

### **3. Nenhuma Mensagem no Banco**
- **Causa:** Webhook não está recebendo mensagens da Z-API
- **Solução:** Verificar configuração do webhook na Z-API

---

## ✅ SOLUÇÃO 1: Corrigir Erro 403

### **Verificar se você é admin:**

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

**Se `is_admin = false` ou `NULL`:**
```sql
-- Tornar admin
UPDATE user_profiles
SET is_admin = true
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'seu-email@aqui.com'
);
```

**OU verificar `user_metadata`:**
```sql
-- Verificar role no user_metadata
SELECT 
  email,
  raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'seu-email@aqui.com';
```

**Se não tiver `role = 'admin'`:**
```sql
-- Adicionar role admin
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@aqui.com';
```

---

## ✅ SOLUÇÃO 2: Erro 405 no Webhook (Normal)

**O erro 405 é NORMAL!**

- Webhooks só aceitam POST (não GET)
- Não pode abrir no navegador
- Z-API envia POST automaticamente

**Não precisa fazer nada!** O webhook está correto.

---

## ✅ SOLUÇÃO 3: Webhook Não Recebe Mensagens

### **Verificar na Z-API:**

1. Acesse sua instância na Z-API
2. Vá em **Webhooks**
3. Verifique:
   - ✅ URL: `https://www.ylada.com/api/webhooks/z-api`
   - ✅ Status: Ativo/Conectado
   - ✅ Evento: "Ao receber" está habilitado

### **Testar Webhook Manualmente:**

Execute no terminal:

```bash
curl -X POST https://www.ylada.com/api/webhooks/z-api \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste manual do webhook",
    "name": "Teste",
    "instanceId": "3ED484E8415CF126D6009EBD599F8B90"
  }'
```

**Depois verificar no banco:**
```sql
SELECT * FROM whatsapp_messages 
WHERE message LIKE '%Teste manual%'
ORDER BY created_at DESC 
LIMIT 1;
```

**Se aparecer:** Webhook funciona! ✅  
**Se não aparecer:** Verificar logs da Vercel

---

## 📋 CHECKLIST COMPLETO

- [ ] Verificar se é admin no banco (SQL acima)
- [ ] Fazer logout e login novamente
- [ ] Verificar webhook na Z-API (URL correta)
- [ ] Testar webhook manualmente (curl)
- [ ] Verificar logs da Vercel
- [ ] Enviar mensagem de teste novamente

---

## 🎯 PRÓXIMOS PASSOS

1. **Primeiro:** Corrigir permissão de admin (Solução 1)
2. **Segundo:** Verificar webhook na Z-API (Solução 3)
3. **Terceiro:** Testar novamente enviando mensagem

---

**Execute o SQL da Solução 1 primeiro e me diga o resultado!**
