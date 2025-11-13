# 🔐 Solução: Problema de Acesso à Área Administrativa

## 📋 Problema

Não consegue acessar a área administrativa com sua senha.

---

## 🔍 Diagnóstico

### 1. Verificar Status Admin no Supabase

Execute este SQL no **Supabase SQL Editor**:

```sql
-- Verificar se você é admin
SELECT 
  au.email,
  up.nome_completo,
  up.is_admin,
  up.is_support,
  CASE 
    WHEN up.is_admin = true THEN '✅ É ADMIN'
    WHEN up.is_admin = false THEN '❌ NÃO É ADMIN'
    WHEN up.is_admin IS NULL THEN '⚠️ is_admin é NULL'
    ELSE '❓ Status desconhecido'
  END as status_admin
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email = 'faulaandre@gmail.com';
```

**Se `is_admin = false` ou `NULL`:** Execute o script `corrigir-admin-faulaandre.sql`

---

## ✅ Soluções

### **Solução 1: Corrigir Status Admin**

Se você não está marcado como admin:

1. Execute no **Supabase SQL Editor**:

```sql
-- Corrigir status admin
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'faulaandre@gmail.com';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;
  
  INSERT INTO user_profiles (
    user_id,
    email,
    nome_completo,
    perfil,
    is_admin,
    is_support,
    updated_at
  )
  VALUES (
    v_user_id,
    'faulaandre@gmail.com',
    'ANDRE FAULA',
    'wellness',
    true,  -- ✅ É ADMIN
    false,
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    is_admin = true,  -- ✅ GARANTIR QUE É ADMIN
    updated_at = NOW();
END $$;
```

2. Verifique se funcionou:

```sql
SELECT email, is_admin FROM user_profiles WHERE email = 'faulaandre@gmail.com';
```

3. Tente fazer login novamente em `/admin/login`

---

### **Solução 2: Resetar Senha**

Se a senha está incorreta:

#### **Opção A: Via Supabase Dashboard (RECOMENDADO)**

1. Acesse: https://supabase.com/dashboard
2. Vá em: **Authentication** > **Users**
3. Procure por: `faulaandre@gmail.com`
4. Clique em: **"..."** > **"Reset Password"**
5. Um email será enviado para resetar a senha
6. Siga as instruções do email

#### **Opção B: Via SQL (EMERGÊNCIA)**

⚠️ **ATENÇÃO:** Esta opção requer a extensão `pgcrypto` e não é recomendada.

```sql
-- Verificar se extensão existe
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Resetar senha (substitua 'NovaSenha123!' pela senha desejada)
UPDATE auth.users
SET encrypted_password = crypt('NovaSenha123!', gen_salt('bf'))
WHERE email = 'faulaandre@gmail.com';
```

---

### **Solução 3: Verificar Email**

Certifique-se de que está usando o email correto:

- ✅ Email correto: `faulaandre@gmail.com`
- ❌ Email incorreto: `faulaandre@gmail.cc` (erro comum)

---

## 🐛 Troubleshooting

### Problema: "Invalid login credentials"

**Possíveis causas:**
1. Senha incorreta
2. Email incorreto
3. Conta não confirmada

**Solução:**
1. Verifique se o email está correto
2. Use "Esqueci minha senha" no login
3. Verifique se o email foi confirmado no Supabase

---

### Problema: "Você não tem permissão de administrador"

**Causa:** `is_admin = false` ou `NULL` no `user_profiles`

**Solução:**
Execute o script `corrigir-admin-faulaandre.sql`

---

### Problema: Login funciona mas redireciona para `/admin/login`

**Causa:** Cache do navegador ou verificação de admin falhando

**Solução:**
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Tente em modo anônimo/incógnito
3. Verifique o console do navegador (F12) para erros
4. Verifique se `is_admin = true` no banco

---

## 📝 Checklist de Verificação

Execute este checklist:

- [ ] Email está correto: `faulaandre@gmail.com`
- [ ] Senha está correta (ou foi resetada)
- [ ] `is_admin = true` no `user_profiles`
- [ ] Usuário existe em `auth.users`
- [ ] Cache do navegador foi limpo
- [ ] Tentou em modo anônimo/incógnito

---

## 🔗 Arquivos Relacionados

- **Verificar Admin:** `verificar-admin-faulaandre.sql`
- **Corrigir Admin:** `corrigir-admin-faulaandre.sql`
- **Resetar Senha:** `resetar-senha-admin-faulaandre.sql`
- **Login Admin:** `src/app/admin/login/page.tsx`
- **Verificação Admin:** `src/app/api/admin/check/route.ts`

---

## 💡 Dica

Se nada funcionar, você pode criar um novo usuário admin temporário:

```sql
-- Criar novo admin temporário (substitua o email)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
  'admin-temporario@example.com',
  crypt('SenhaTemporaria123!', gen_salt('bf')),
  NOW()
)
RETURNING id;

-- Depois criar perfil admin (use o ID retornado acima)
INSERT INTO user_profiles (user_id, email, nome_completo, perfil, is_admin)
VALUES (
  'ID_RETORNADO_ACIMA',
  'admin-temporario@example.com',
  'Admin Temporário',
  'wellness',
  true
);
```

---

## 📞 Próximos Passos

1. Execute `verificar-admin-faulaandre.sql` para diagnosticar
2. Se `is_admin = false`, execute `corrigir-admin-faulaandre.sql`
3. Se senha está incorreta, reset via Supabase Dashboard
4. Tente fazer login novamente

