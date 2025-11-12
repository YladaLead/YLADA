# 📊 Como Ver Dados de um Usuário no Supabase

## 🔍 Onde Encontrar os Dados

### 1. **Authentication > Users** (Dados de Login)
- Acesse: Supabase Dashboard → Authentication → Users
- Procure pelo email do usuário
- Você verá:
  - ✅ ID do usuário
  - ✅ Email
  - ✅ Data de criação
  - ✅ Último login
  - ✅ Status de confirmação de email

### 2. **Table Editor > user_profiles** (Perfil Completo)
- Acesse: Supabase Dashboard → Table Editor → `user_profiles`
- Filtre por:
  - `email = 'naytenutri@gmail.com'` OU
  - `user_id = '[ID do auth.users]'`
- Você verá:
  - ✅ Nome completo
  - ✅ WhatsApp
  - ✅ Área (perfil)
  - ✅ Se é admin
  - ✅ Slug do usuário
  - ✅ Bio

### 3. **Table Editor > subscriptions** (Assinatura)
- Acesse: Supabase Dashboard → Table Editor → `subscriptions`
- Filtre por:
  - `user_id = '[ID do auth.users]'`
- Você verá:
  - ✅ Tipo de plano (monthly/annual/free)
  - ✅ Status (active/canceled/expired)
  - ✅ Data de vencimento
  - ✅ Se é migrado
  - ✅ De onde foi migrado

## 🔧 Usando SQL Editor (Mais Rápido)

1. Acesse: Supabase Dashboard → SQL Editor
2. Cole o script `verificar-nayara.sql`
3. Execute e veja todos os dados de uma vez

## 📝 Exemplo: Verificar Nayara

```sql
-- Ver todos os dados da Nayara
SELECT 
  au.email,
  au.created_at as data_cadastro,
  au.last_sign_in_at as ultimo_login,
  up.nome_completo,
  up.whatsapp,
  up.perfil as area,
  s.plan_type as tipo_plano,
  s.status as status_assinatura,
  s.current_period_end as vencimento
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN subscriptions s ON au.id = s.user_id
WHERE au.email = 'naytenutri@gmail.com';
```

## 🎯 Dados Importantes para Verificar

### ✅ Cadastro Completo?
- `user_profiles.nome_completo` está preenchido?
- `user_profiles.whatsapp` está preenchido?

### ✅ Assinatura Ativa?
- `subscriptions.status = 'active'`
- `subscriptions.current_period_end` > hoje

### ✅ Senha Definida?
- No Supabase, você não pode ver a senha (por segurança)
- Mas pode verificar se o usuário consegue fazer login
- Ou usar a API `/api/admin/usuarios/verificar-senha`

## 🚨 Problemas Comuns

### "Usuário não encontrado"
- Verifique se o email está correto
- Verifique se está na tabela `auth.users`

### "Perfil não encontrado"
- O usuário pode ter criado conta mas não completou o perfil
- Verifique `user_profiles` com o `user_id` do `auth.users`

### "Assinatura não encontrada"
- O usuário pode não ter assinatura ainda
- Verifique se foi criada na importação

