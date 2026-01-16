# ✅ Erro 405 no Webhook é NORMAL!

## 🎯 EXPLICAÇÃO

A mensagem que você viu:
```
{"error":"Método não permitido","message":"Este endpoint só aceita requisições POST..."}
```

**É NORMAL e ESPERADA!** ✅

### Por quê?

- **Navegador (você):** Faz requisição **GET** → ❌ Erro 405
- **Z-API (automático):** Faz requisição **POST** → ✅ Funciona!

**Webhooks só funcionam com POST**, não GET. Quando você abre no navegador, ele tenta GET e dá erro. Isso é correto!

---

## ✅ O QUE VERIFICAR AGORA

### 1. Você executou o SQL para tornar admin?

Execute no Supabase:

```sql
-- Verificar se é admin
SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as role,
  up.is_admin,
  CASE 
    WHEN u.raw_user_meta_data->>'role' = 'admin' OR up.is_admin = true 
    THEN '✅ É ADMIN'
    ELSE '❌ NÃO É ADMIN - Execute o script 180-tornar-faulaandre-admin.sql'
  END as status
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = 'faulaandre@gmail.com';
```

**Se mostrar "❌ NÃO É ADMIN":**
- Execute o script `migrations/180-tornar-faulaandre-admin.sql` completo
- Faça logout e login novamente

---

### 2. Webhook está configurado na Z-API?

1. Acesse https://developer.z-api.com.br/
2. Vá na sua instância
3. Clique em **"Webhooks"**
4. Verifique:
   - ✅ URL: `https://www.ylada.com/api/webhooks/z-api`
   - ✅ Status: **Ativo/Conectado**
   - ✅ Evento "Ao receber" está **habilitado**

**Se não estiver configurado:**
- Configure o webhook com a URL acima
- Salve e teste enviando uma mensagem

---

### 3. Mensagens estão chegando no banco?

Execute no Supabase:

```sql
-- Verificar últimas mensagens
SELECT 
  id,
  message,
  sender_phone,
  created_at,
  area
FROM whatsapp_messages
ORDER BY created_at DESC
LIMIT 10;

-- Verificar conversas
SELECT 
  id,
  sender_phone,
  last_message_at,
  total_messages,
  area
FROM whatsapp_conversations
ORDER BY last_message_at DESC
LIMIT 10;
```

**Se não aparecer nada:**
- Webhook não está recebendo mensagens da Z-API
- Verificar logs da Vercel
- Verificar configuração do webhook na Z-API

---

## 🎯 CHECKLIST

- [ ] Executei o SQL para tornar admin (`180-tornar-faulaandre-admin.sql`)
- [ ] Fiz logout e login novamente
- [ ] Webhook está configurado na Z-API com URL correta
- [ ] Evento "Ao receber" está habilitado
- [ ] Enviei uma mensagem de teste
- [ ] Verifiquei se mensagem apareceu no banco (SQL acima)

---

## 📝 RESUMO

1. **Erro 405 no webhook = NORMAL** ✅ (ignorar)
2. **Erro 403 no /admin/whatsapp = Precisa ser admin** (executar SQL)
3. **Mensagens não aparecem = Webhook não configurado ou não recebendo** (verificar Z-API)

**Foque em:**
1. Tornar-se admin (SQL)
2. Configurar webhook na Z-API
3. Testar enviando mensagem
