# 🚨 Instruções: Criar Usuário Renan

O usuário **Renan Lieiria** (`renan.mdlr@gmail.com`) **não existe** no Supabase Auth.

## ✅ Solução Rápida

### Opção 1: Criar no Supabase Dashboard (RECOMENDADO - 2 minutos)

1. **Acesse o Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Vá em: **Authentication** > **Users**

2. **Clique em "Add User"** (botão no canto superior direito)

3. **Preencha os dados:**
   - **Email**: `renan.mdlr@gmail.com`
   - **Password**: `123456`
   - **Auto Confirm User**: ✅ **MARCAR ESTA OPÇÃO** (importante!)

4. **Clique em "Create User"**

5. **Após criar, execute este script SQL:**
   ```sql
   -- Execute o arquivo: CRIAR-RENAN-COMPLETO.sql
   ```
   Ou execute apenas esta parte:
   ```sql
   UPDATE user_profiles up
   SET 
     is_support = true,
     is_admin = false,
     nome_completo = 'Renan Lieiria',
     updated_at = NOW()
   FROM auth.users au
   WHERE up.user_id = au.id
     AND au.email = 'renan.mdlr@gmail.com';
   ```

---

### Opção 2: Usar API Route (se servidor estiver rodando)

Se o servidor Next.js estiver rodando (`npm run dev`), você pode criar o usuário via API:

**No terminal ou Postman:**

```bash
curl -X POST http://localhost:3000/api/admin/create-support-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "renan.mdlr@gmail.com",
    "password": "123456",
    "nome_completo": "Renan Lieiria"
  }'
```

Ou use este comando direto:

```bash
curl -X POST http://localhost:3000/api/admin/create-support-user -H "Content-Type: application/json" -d '{"email":"renan.mdlr@gmail.com","password":"123456","nome_completo":"Renan Lieiria"}'
```

---

## ✅ Verificar se funcionou

Após criar o usuário e executar o script, execute esta query:

```sql
SELECT 
  up.email,
  up.nome_completo,
  up.is_support,
  up.is_admin,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
INNER JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'renan.mdlr@gmail.com';
```

Você deve ver:
- `is_support = true` ✅
- `is_admin = false` ✅
- `email_confirmado = true` ✅

---

## 📋 Checklist

- [ ] Usuário criado no Supabase Dashboard
- [ ] Script SQL executado para criar/atualizar perfil
- [ ] `is_support = true` confirmado
- [ ] Renan aparece na lista de usuários de suporte

---

**Última atualização**: 2024-01-XX

