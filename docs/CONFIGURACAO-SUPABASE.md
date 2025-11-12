# 🔧 Configuração do Supabase - YLADA

## 📋 Checklist de Configuração

### 1. ✅ Executar Script SQL

Execute o script completo no **Supabase SQL Editor**:
- Arquivo: `scripts/configuracao-supabase-completa.sql`

Este script cria/verifica:
- ✅ Tabela `access_tokens` (tokens temporários)
- ✅ Tabela `templates_nutrition` (templates base)
- ✅ Tabela `user_templates` (com `conversions_count`)
- ✅ Tabela `leads` (leads capturados)
- ✅ RLS (Row Level Security) habilitado
- ✅ Políticas RLS configuradas

---

### 2. 🔐 Configurar URLs de Autenticação

No **Supabase Dashboard** → **Authentication** → **URL Configuration**:

#### **Site URL:**
```
https://www.ylada.com
```

#### **Redirect URLs (adicionar todas):**
```
https://www.ylada.com/auth/callback
https://www.ylada.com/auth/v1/verify
https://www.ylada.com/pt/wellness/dashboard
https://www.ylada.com/pt/wellness/bem-vindo
https://www.ylada.com/pt/nutri/dashboard
https://www.ylada.com/pt/coach/dashboard
https://www.ylada.com/pt/nutra/dashboard
https://www.ylada.com/migrado
```

**⚠️ IMPORTANTE:**
- Remova `localhost:3000` das URLs permitidas em **produção**
- Ou mantenha apenas para desenvolvimento local

---

### 3. 🔑 Variáveis de Ambiente

Certifique-se de ter no **Vercel** (ou `.env.local` para desenvolvimento):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# URLs (IMPORTANTE para produção)
NEXT_PUBLIC_APP_URL_PRODUCTION=https://www.ylada.com
NEXT_PUBLIC_APP_URL=https://www.ylada.com
```

---

### 4. 📊 Verificar Tabelas Existentes

Execute no **Supabase SQL Editor** para verificar:

```sql
-- Verificar se todas as tabelas existem
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN (
    'access_tokens',
    'templates_nutrition', 
    'user_templates',
    'leads',
    'subscriptions',
    'user_profiles'
  )
ORDER BY tablename;
```

---

### 5. 🔍 Verificar Colunas Necessárias

```sql
-- Verificar se user_templates tem conversions_count
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_templates'
  AND column_name IN ('conversions_count', 'views', 'leads_count')
ORDER BY column_name;

-- Verificar se subscriptions tem campos de migração
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscriptions'
  AND column_name IN ('is_migrated', 'requires_manual_renewal', 'plan_type')
ORDER BY column_name;
```

---

### 6. 🛡️ Verificar RLS Policies

```sql
-- Verificar políticas RLS ativas
SELECT 
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN substring(qual, 1, 100)
    ELSE 'Sem USING'
  END as using_clause
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('access_tokens', 'templates_nutrition', 'user_templates', 'leads', 'user_profiles')
ORDER BY tablename, policyname;
```

---

### 7. 📝 Verificar Funções SQL

```sql
-- Verificar função is_admin()
SELECT 
  proname as function_name,
  'Função existe!' as status
FROM pg_proc
WHERE proname = 'is_admin'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
```

---

## ✅ Checklist Final

Antes de considerar tudo configurado, verifique:

- [ ] Script SQL executado com sucesso
- [ ] Todas as tabelas criadas (`access_tokens`, `templates_nutrition`, etc.)
- [ ] Coluna `conversions_count` existe em `user_templates`
- [ ] RLS habilitado nas tabelas necessárias
- [ ] Políticas RLS criadas
- [ ] Site URL configurado como `https://www.ylada.com`
- [ ] Redirect URLs configuradas no Supabase Dashboard
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Função `is_admin()` existe e funciona

---

## 🚨 Problemas Comuns

### Erro: "Table does not exist"
- **Solução:** Execute o script SQL completo novamente

### Erro: "Column does not exist"
- **Solução:** Execute a parte específica do script que cria a coluna

### Redirecionamento para localhost
- **Solução:** 
  1. Verifique Site URL no Supabase Dashboard
  2. Verifique variáveis de ambiente `NEXT_PUBLIC_APP_URL_PRODUCTION`
  3. Remova localhost das Redirect URLs em produção

### Erro de RLS
- **Solução:** Execute o script `corrigir-rls-completo.sql` se necessário

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs do Supabase (Dashboard → Logs)
2. Logs do Vercel (Deployments → Function Logs)
3. Console do navegador (F12 → Console)

