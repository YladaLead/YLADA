# 🔑 RESETAR SENHA - nutri3@ylada.com

## ⚠️ Problema

A senha da conta `nutri3@ylada.com` está incorreta ou foi alterada.

---

## ✅ SOLUÇÃO RÁPIDA: Via Supabase Dashboard

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Faça login na sua conta Supabase

2. **Selecione seu Projeto**
   - Escolha o projeto YLADA

3. **Vá para Authentication**
   - No menu lateral esquerdo, clique em **"Authentication"**
   - Depois clique em **"Users"**

4. **Encontre o Usuário**
   - Na barra de busca, digite: `nutri3@ylada.com`
   - Ou role a lista até encontrar

5. **Clique no Usuário**
   - Clique no email `nutri3@ylada.com` para abrir os detalhes

6. **Resetar Senha - OPÇÃO 1 (Recomendado)**
   - No painel de detalhes do usuário, procure por **"Send Password Reset Email"**
   - Clique no botão
   - Um email será enviado para `nutri3@ylada.com`
   - **VANTAGEM:** Você define a nova senha via link no email

7. **Resetar Senha - OPÇÃO 2 (Direto)**
   - No painel de detalhes, procure por **"Reset Password"** ou **"Change Password"**
   - Digite a nova senha: `senha123`
   - Confirme a senha: `senha123`
   - Clique em **"Save"** ou **"Update"**
   - **VANTAGEM:** Senha é definida imediatamente, sem precisar do email

8. **Fazer Login**
   - Acesse: `https://www.ylada.com/pt/nutri/login` (ou seu domínio)
   - Email: `nutri3@ylada.com`
   - Senha: `senha123`

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
WHERE email = 'nutri3@ylada.com';
```

Se `tem_senha = true`, a senha foi resetada com sucesso!

---

## 📝 Credenciais Corretas

- **Email:** `nutri3@ylada.com`
- **Senha:** `senha123`
- **Nome:** Nutricionista Teste 3
- **Perfil:** nutri
- **Status:** Usuário completo (com diagnóstico + assinatura)

---

## 🆘 Se o Usuário Não Existir

Se o usuário `nutri3@ylada.com` não existir no Supabase:

1. **Criar usuário no Supabase Dashboard**
   - Authentication > Users > "Add User"
   - Email: `nutri3@ylada.com`
   - Password: `senha123`
   - **Marque "Auto Confirm User"** ✅
   - Clique em "Create User"

2. **Criar perfil via SQL**
   - Execute o script: `scripts/03-criar-todos-usuarios-teste.sql`
   - Ou execute apenas a parte do nutri3

3. **Criar diagnóstico e assinatura**
   - Execute: `scripts/04-configurar-diagnosticos-teste.sql`
   - Execute: `scripts/05-configurar-assinatura-nutri3.sql`

---

## 🔗 Links Úteis

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Login Nutri:** https://www.ylada.com/pt/nutri/login
- **Documentação completa:** `docs/PERFIS-TESTE-NUTRI-RESUMO.md`

---

## ⚠️ IMPORTANTE

- A senha padrão é: `senha123`
- Use essa senha para testes
- Em produção, sempre use senhas fortes
- Após resetar, faça login imediatamente para confirmar










