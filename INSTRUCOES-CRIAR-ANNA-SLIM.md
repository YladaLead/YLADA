# 📋 Instruções: Criar Usuário de Suporte - Anna Slim

## 👤 Dados do Usuário

- **Email:** `portalmagra@gmail.com`
- **Nome:** Anna Slim
- **Senha:** `123456`
- **Área:** Coach
- **Função:** Suporte (acesso a todas as áreas)
- **Admin:** Não

---

## ✅ OPÇÃO 1: Via Supabase Dashboard (RECOMENDADO - Mais Fácil)

### Passo 1: Criar Usuário no Supabase Auth

1. Acesse o **Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Vá em: **Authentication** > **Users**

2. Clique em **"Add User"** (botão no canto superior direito)

3. Preencha os dados:
   - **Email**: `portalmagra@gmail.com`
   - **Password**: `123456`
   - **Auto Confirm User**: ✅ **MARCAR ESTA OPÇÃO** (importante!)

4. Clique em **"Create User"**

### Passo 2: Executar Script SQL

Após criar o usuário, execute o arquivo `criar-anna-slim-suporte.sql` no **Supabase SQL Editor**.

Este script irá:
- ✅ Criar o perfil com `is_support = true`
- ✅ Configurar acesso a todas as áreas
- ✅ Definir área base como Coach

---

## ✅ OPÇÃO 2: Via API Route (Se Servidor Estiver Rodando)

Se o servidor Next.js estiver rodando (`npm run dev`), você pode criar o usuário via API:

### No terminal:

```bash
curl -X POST http://localhost:3000/api/admin/create-support-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "portalmagra@gmail.com",
    "password": "123456",
    "nome_completo": "Anna Slim"
  }'
```

**OU** comando direto:

```bash
curl -X POST http://localhost:3000/api/admin/create-support-user -H "Content-Type: application/json" -d '{"email":"portalmagra@gmail.com","password":"123456","nome_completo":"Anna Slim"}'
```

**NOTA:** A API cria com `perfil: 'wellness'` por padrão. Após criar, você precisará atualizar manualmente para `'coach'` via SQL:

```sql
UPDATE user_profiles
SET perfil = 'coach'
WHERE email = 'portalmagra@gmail.com';
```

---

## ✅ OPÇÃO 3: Via Script Node.js

Execute o script:

```bash
node scripts/criar-anna-slim-suporte.js
```

Este script:
- ✅ Cria o usuário no Supabase Auth
- ✅ Cria o perfil com `is_support = true`
- ✅ Define área como Coach
- ✅ Configura tudo automaticamente

---

## ✅ Verificar se Funcionou

Após criar o usuário e executar o script SQL, execute esta query:

```sql
SELECT 
  up.email,
  up.nome_completo,
  up.perfil,
  up.is_support,
  up.is_admin,
  au.email_confirmed_at IS NOT NULL as email_confirmado
FROM user_profiles up
INNER JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'portalmagra@gmail.com';
```

Você deve ver:
- `is_support = true` ✅
- `is_admin = false` ✅
- `perfil = 'coach'` ✅
- `email_confirmado = true` ✅

---

## 🔗 Links de Acesso

Após criar, a Anna Slim poderá acessar:

- **Coach:** https://www.ylada.com/pt/coach/login
- **Nutri:** https://www.ylada.com/pt/nutri/login
- **Wellness:** https://www.ylada.com/pt/wellness/login

**Credenciais:**
- Email: `portalmagra@gmail.com`
- Senha: `123456`

---

## ⚠️ IMPORTANTE

- A senha `123456` deve ser alterada após o primeiro login por segurança
- Com `is_support = true`, a Anna terá acesso a **todas as áreas** (Coach, Nutri, Wellness)
- O `perfil = 'coach'` define apenas a área padrão, mas não limita o acesso

---

## 📋 Checklist

- [ ] Usuário criado no Supabase Dashboard (Opção 1) OU via API/Script
- [ ] Script SQL executado para criar/atualizar perfil
- [ ] `is_support = true` confirmado
- [ ] `perfil = 'coach'` confirmado
- [ ] Anna consegue fazer login em todas as áreas

---

**Última atualização:** 2025-01-XX


