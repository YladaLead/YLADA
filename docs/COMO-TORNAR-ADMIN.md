# 👤 Como Tornar Usuário Admin

## 🎯 PROBLEMA

Erro 403 ao acessar `/admin/whatsapp` significa que você não está configurado como administrador.

---

## ✅ SOLUÇÃO: Tornar-se Admin

Execute no Supabase SQL Editor (substitua o email):

### **Opção 1: Via user_profiles (Recomendado)**

```sql
-- Verificar seu email primeiro
SELECT 
  u.id,
  u.email,
  up.is_admin
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = 'seu-email@aqui.com';

-- Tornar admin
UPDATE user_profiles
SET is_admin = true
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'seu-email@aqui.com'
);

-- Se não tiver perfil, criar
INSERT INTO user_profiles (user_id, is_admin, perfil)
SELECT id, true, 'admin'
FROM auth.users
WHERE email = 'seu-email@aqui.com'
ON CONFLICT (user_id) 
DO UPDATE SET is_admin = true;
```

### **Opção 2: Via user_metadata**

```sql
-- Verificar role atual
SELECT 
  email,
  raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'seu-email@aqui.com';

-- Adicionar role admin
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@aqui.com';
```

### **Opção 3: Fazer Ambos (Mais Seguro)**

```sql
-- 1. Adicionar role no user_metadata
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@aqui.com';

-- 2. Garantir is_admin no perfil
INSERT INTO user_profiles (user_id, is_admin, perfil)
SELECT id, true, 'admin'
FROM auth.users
WHERE email = 'seu-email@aqui.com'
ON CONFLICT (user_id) 
DO UPDATE SET is_admin = true;
```

---

## ✅ VERIFICAR SE FUNCIONOU

Execute:

```sql
SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as role,
  up.is_admin,
  up.perfil
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = 'seu-email@aqui.com';
```

**Deve mostrar:**
- `role = "admin"` ✅
- `is_admin = true` ✅

---

## 🔄 DEPOIS DE TORNAR ADMIN

1. **Fazer logout** da aplicação
2. **Fazer login** novamente
3. **Acessar** `/admin/whatsapp`
4. **Deve funcionar** agora! ✅

---

**Substitua `seu-email@aqui.com` pelo seu email e execute!**
