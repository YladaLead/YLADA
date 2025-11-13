# 🚨 RESETAR SENHA ADMIN - EMERGÊNCIA

## ⚠️ Problema

A senha do admin `faulaandre@gmail.com` foi removida ou está incorreta, impedindo o acesso à área administrativa.

---

## ✅ SOLUÇÃO RÁPIDA: Via Supabase Dashboard

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Faça login na sua conta Supabase (não precisa ser o mesmo email)

2. **Selecione seu Projeto**
   - Escolha o projeto YLADA

3. **Vá para Authentication**
   - No menu lateral esquerdo, clique em **"Authentication"**
   - Depois clique em **"Users"**

4. **Encontre o Usuário**
   - Na barra de busca, digite: `faulaandre@gmail.com`
   - Ou role a lista até encontrar

5. **Clique no Usuário**
   - Clique no email `faulaandre@gmail.com` para abrir os detalhes

6. **Resetar Senha - OPÇÃO 1 (Recomendado)**
   - No painel de detalhes do usuário, procure por **"Send Password Reset Email"**
   - Clique no botão
   - Um email será enviado para `faulaandre@gmail.com`
   - **VANTAGEM:** Você define a nova senha via link no email

7. **Resetar Senha - OPÇÃO 2 (Direto)**
   - No painel de detalhes, procure por **"Reset Password"** ou **"Change Password"**
   - Digite a nova senha diretamente
   - Confirme a senha
   - Clique em **"Save"** ou **"Update"**
   - **VANTAGEM:** Senha é definida imediatamente, sem precisar do email

8. **Fazer Login**
   - Acesse: `https://www.ylada.com/admin/login`
   - Email: `faulaandre@gmail.com`
   - Senha: A nova senha que você definiu

---

## 🔍 Verificar se Funcionou

Após resetar, execute este SQL no Supabase SQL Editor:

```sql
-- Verificar se usuário existe e tem senha
SELECT 
  email,
  encrypted_password IS NOT NULL as tem_senha,
  email_confirmed_at IS NOT NULL as email_confirmado,
  last_sign_in_at
FROM auth.users
WHERE email = 'faulaandre@gmail.com';
```

Se `tem_senha = true`, a senha foi resetada com sucesso!

---

## 🆘 Se Não Conseguir Acessar o Supabase Dashboard

### Alternativa: Criar Novo Admin Temporário

Se você não conseguir acessar o Supabase Dashboard, podemos criar um novo usuário admin temporário:

1. **Criar novo usuário via Supabase Dashboard**
   - Authentication > Users > "Add User"
   - Email: `admin-temporario@ylada.com` (ou outro email seu)
   - Senha: Defina uma senha
   - Marque "Auto Confirm User"

2. **Tornar Admin via SQL**
   ```sql
   -- Obter ID do novo usuário
   SELECT id FROM auth.users WHERE email = 'admin-temporario@ylada.com';
   
   -- Criar perfil admin (use o ID retornado acima)
   INSERT INTO user_profiles (
     user_id,
     email,
     nome_completo,
     perfil,
     is_admin,
     is_support
   )
   VALUES (
     'ID_DO_USUARIO_ACIMA',
     'admin-temporario@ylada.com',
     'Admin Temporário',
     'wellness',
     true,
     false
   )
   ON CONFLICT (user_id) 
   DO UPDATE SET
     is_admin = true,
     updated_at = NOW();
   ```

3. **Fazer login com o novo admin**
   - Acesse: `https://www.ylada.com/admin/login`
   - Use o email e senha do novo admin

4. **Resetar senha do faulaandre via API**
   - Agora que você está logado como admin, pode usar a API:
   - POST `/api/admin/reset-password`
   - Body: `{ "email": "faulaandre@gmail.com", "newPassword": "NovaSenha123!" }`

---

## 📝 Checklist

- [ ] Acessei o Supabase Dashboard
- [ ] Encontrei o usuário `faulaandre@gmail.com`
- [ ] Resetei a senha (via email ou direto)
- [ ] Tentei fazer login com a nova senha
- [ ] Se não funcionou, criei admin temporário

---

## 🔗 Links Úteis

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Login Admin:** https://www.ylada.com/admin/login
- **Verificar Usuário:** Execute `verificar-usuario-faulaandre.sql`

---

## ⚠️ IMPORTANTE

- A senha deve ter **mínimo 6 caracteres**
- Use uma senha forte (letras, números, símbolos)
- Anote a senha em local seguro
- Após resetar, faça login imediatamente para confirmar

