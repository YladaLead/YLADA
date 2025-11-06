# 🔐 RESOLVER ACESSO DA RENATA

## 📋 Informações dos Logins

- **Wellness**: `renatateste@gmail.com`
- **Nutri**: `renataborges.mpm@gmail.com`

---

## 🔍 DIAGNÓSTICO DO PROBLEMA

O problema pode ter várias causas. Vamos verificar passo a passo:

### **Possíveis Causas:**

1. ❌ Usuários não existem no Supabase Auth
2. ❌ Email não confirmado no Supabase
3. ❌ Perfil não configurado na tabela `user_profiles`
4. ❌ Perfil incorreto (ex: perfil 'nutri' tentando acessar 'wellness')
5. ❌ Senha incorreta
6. ❌ Usuário inativo (`is_active = false`)

---

## ✅ SOLUÇÃO PASSO A PASSO

### **PASSO 1: Verificar se os usuários existem**

1. Acesse o **Supabase Dashboard**
2. Vá em **Authentication > Users**
3. Procure pelos emails:
   - `renatateste@gmail.com`
   - `renataborges.mpm@gmail.com`

**Se os usuários NÃO existem:**
- Clique em **"Add User"** ou **"Invite User"**
- Crie os usuários com os emails acima
- Defina senhas temporárias (a Renata pode alterar depois)
- **Confirme os emails** (clique em "Confirm Email" ou envie email de confirmação)

---

### **PASSO 2: Executar o Script SQL**

1. No Supabase Dashboard, vá em **SQL Editor**
2. Abra o arquivo `VERIFICAR-ACESSO-RENATA.sql`
3. Execute o script completo

**O que o script faz:**
- ✅ Verifica se os perfis existem
- ✅ Cria/atualiza o perfil `wellness` para `renatateste@gmail.com`
- ✅ Cria/atualiza o perfil `nutri` para `renataborges.mpm@gmail.com`
- ✅ Ativa os usuários (`is_active = true`)
- ✅ Verifica se tudo foi aplicado corretamente

---

### **PASSO 3: Verificar Resultados**

Após executar o script, verifique os resultados das queries:

#### **Para Wellness:**
```sql
SELECT 
  up.email,
  up.perfil,
  up.is_active,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'renatateste@gmail.com';
```

**Resultado esperado:**
- `perfil` = `wellness`
- `is_active` = `true`
- `email_confirmado` = `true`

#### **Para Nutri:**
```sql
SELECT 
  up.email,
  up.perfil,
  up.is_active,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'renataborges.mpm@gmail.com';
```

**Resultado esperado:**
- `perfil` = `nutri`
- `is_active` = `true`
- `email_confirmado` = `true`

---

### **PASSO 4: Confirmar Email (se necessário)**

Se o email não estiver confirmado:

1. Vá em **Authentication > Users**
2. Clique no usuário
3. Clique em **"Confirm Email"** (ou envie o email de confirmação)
4. Aguarde a confirmação

---

### **PASSO 5: Testar o Login**

1. **Para Wellness:**
   - Acesse: `/pt/wellness/login`
   - Email: `renatateste@gmail.com`
   - Senha: (senha definida no Supabase)

2. **Para Nutri:**
   - Acesse: `/pt/nutri/login`
   - Email: `renataborges.mpm@gmail.com`
   - Senha: (senha definida no Supabase)

---

## 🔧 CORREÇÕES MANUAIS (se necessário)

### **Se o perfil estiver incorreto:**

Execute no SQL Editor:

```sql
-- Corrigir perfil Wellness
UPDATE user_profiles up
SET perfil = 'wellness',
    is_active = true,
    updated_at = NOW()
FROM auth.users au
WHERE up.user_id = au.id
  AND au.email = 'renatateste@gmail.com';

-- Corrigir perfil Nutri
UPDATE user_profiles up
SET perfil = 'nutri',
    is_active = true,
    updated_at = NOW()
FROM auth.users au
WHERE up.user_id = au.id
  AND au.email = 'renataborges.mpm@gmail.com';
```

### **Se o usuário estiver inativo:**

```sql
-- Ativar usuário Wellness
UPDATE user_profiles up
SET is_active = true,
    updated_at = NOW()
FROM auth.users au
WHERE up.user_id = au.id
  AND au.email = 'renatateste@gmail.com';

-- Ativar usuário Nutri
UPDATE user_profiles up
SET is_active = true,
    updated_at = NOW()
FROM auth.users au
WHERE up.user_id = au.id
  AND au.email = 'renataborges.mpm@gmail.com';
```

---

## 📝 CHECKLIST FINAL

- [ ] Usuários criados no Supabase Auth
- [ ] Emails confirmados
- [ ] Perfis criados/atualizados na tabela `user_profiles`
- [ ] Perfil `wellness` para `renatateste@gmail.com`
- [ ] Perfil `nutri` para `renataborges.mpm@gmail.com`
- [ ] `is_active = true` para ambos
- [ ] Login testado em `/pt/wellness/login`
- [ ] Login testado em `/pt/nutri/login`

---

## 🆘 SE AINDA NÃO FUNCIONAR

1. **Verificar console do navegador** (F12) para erros
2. **Verificar logs do Supabase** em Authentication > Logs
3. **Verificar se a senha está correta** (pode resetar se necessário)
4. **Verificar se o usuário está realmente logado** no Supabase Auth

### **Resetar Senha (se necessário):**

No Supabase Dashboard:
1. Vá em **Authentication > Users**
2. Clique no usuário
3. Clique em **"Send Password Reset Email"**
4. Ou defina uma nova senha manualmente

---

## 📞 INFORMAÇÕES PARA A RENATA

Após resolver o problema, informe à Renata:

1. **URLs de login:**
   - Wellness: `https://seu-dominio.com/pt/wellness/login`
   - Nutri: `https://seu-dominio.com/pt/nutri/login`

2. **Credenciais:**
   - Wellness: `renatateste@gmail.com` + senha
   - Nutri: `renataborges.mpm@gmail.com` + senha

3. **Se precisar resetar senha:**
   - Use o link "Esqueci minha senha" na página de login
   - Ou peça para resetar pelo Supabase Dashboard

---

**Última atualização**: 2024-12-19

