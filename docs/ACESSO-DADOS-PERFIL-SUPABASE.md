# 📊 Acesso aos Dados de Perfil no Supabase

## 📋 Tabela Principal

**Tabela:** `user_profiles`

Esta é a tabela que armazena todas as informações do perfil dos usuários, incluindo as alterações feitas na área Wellness.

## 🔍 Colunas da Tabela

### Informações Básicas
- `id` - ID único do perfil (UUID)
- `user_id` - ID do usuário (referência a `auth.users`)
- `perfil` - Área do usuário: `'nutri'`, `'wellness'`, `'coach'`, `'nutra'`
- `nome_completo` - Nome completo do usuário
- `email` - Email do usuário
- `created_at` - Data de criação
- `updated_at` - Data da última atualização

### Informações Específicas Wellness
- `bio` - Biografia/Bio do usuário
- `whatsapp` - Número de WhatsApp/Telefone
- `country_code` - Código do país (ex: 'BR', 'US')
- `user_slug` - Slug único para URLs personalizadas (ex: 'andre')

### Informações de Permissões
- `is_admin` - Se o usuário é administrador
- `is_support` - Se o usuário é suporte

### Outras Colunas (podem estar vazias para Wellness)
- `crn` - CRN (para nutricionistas)
- `especialidade_nutri` - Especialidade nutricional
- `nivel_herbalife` - Nível Herbalife
- `cidade` - Cidade
- `estado` - Estado
- `certificacoes` - Certificações
- `area_coaching` - Área de coaching
- `idioma_preferido` - Idioma preferido
- `timezone` - Timezone
- `is_active` - Se está ativo
- `last_login` - Último login

## 🔐 Como Acessar no Supabase

### 1. Executar o Script SQL

Primeiro, execute o script `schema-admin-access-user-profiles.sql` no Supabase SQL Editor para dar permissão de acesso aos admins.

### 2. Acessar via Supabase Dashboard

1. Acesse o **Supabase Dashboard**
2. Vá em **Table Editor**
3. Selecione a tabela **`user_profiles`**
4. Como admin, você poderá ver todos os perfis

### 3. Queries Úteis

#### Ver todos os perfis Wellness
```sql
SELECT 
  id,
  user_id,
  perfil,
  nome_completo,
  email,
  whatsapp,
  bio,
  user_slug,
  country_code,
  created_at,
  updated_at
FROM user_profiles
WHERE perfil = 'wellness'
ORDER BY created_at DESC;
```

#### Ver perfis por área
```sql
SELECT 
  perfil, 
  COUNT(*) as total 
FROM user_profiles 
GROUP BY perfil;
```

#### Ver todos os perfis com informações completas
```sql
SELECT * 
FROM user_profiles 
ORDER BY created_at DESC;
```

#### Buscar perfil específico por email
```sql
SELECT * 
FROM user_profiles 
WHERE email = 'faulaandre@gmail.com';
```

#### Buscar perfil específico por user_slug
```sql
SELECT * 
FROM user_profiles 
WHERE user_slug = 'andre';
```

#### Ver perfis criados/atualizados recentemente
```sql
SELECT 
  nome_completo,
  email,
  perfil,
  user_slug,
  updated_at,
  created_at
FROM user_profiles
WHERE updated_at >= NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;
```

## 🔒 Permissões (RLS)

Após executar o script `schema-admin-access-user-profiles.sql`:

- **Usuários normais**: Podem ver e editar apenas seu próprio perfil
- **Admins**: Podem ver e editar todos os perfis
- **Suporte**: Podem ver e editar todos os perfis (se `is_support = true`)

## 📝 Notas Importantes

1. **Email duplicado**: O email também está armazenado em `auth.users`. O email em `user_profiles` pode ser usado como backup ou para consultas mais rápidas.

2. **user_slug**: Deve ser único. Se tentar criar um slug que já existe, o sistema retornará erro.

3. **Perfil não pode ser alterado**: Uma vez criado, o `perfil` não pode ser alterado (exceto para admins e suporte).

4. **Dados sensíveis**: O campo `whatsapp` contém números de telefone. Trate com cuidado em relação à LGPD/GDPR.

## 🛠️ Troubleshooting

### Não consigo ver os perfis no Supabase Dashboard

1. Verifique se você está logado como admin no Supabase
2. Execute o script `schema-admin-access-user-profiles.sql`
3. Verifique se a política RLS foi criada corretamente:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
   ```

### Erro ao executar queries

Se você receber erro de permissão, verifique:
1. Se você está logado como admin no Supabase Dashboard
2. Se as políticas RLS foram criadas corretamente
3. Se sua conta tem `is_admin = true` na tabela `user_profiles`

