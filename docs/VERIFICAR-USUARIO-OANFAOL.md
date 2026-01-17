# 🔍 Verificar Usuário: oanfaol@gmail.com

## 📋 Problema

O sistema está retornando "Usuário não encontrado" ao tentar recuperar a senha para `oanfaol@gmail.com`, mas o usuário pode ter existido antes.

## 🔧 Como Verificar

### Opção 1: Script SQL (Recomendado - Mais Completo)

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo do arquivo: `scripts/verificar-usuario-oanfaol-completo.sql`
4. Execute a query

**O que o script verifica:**
- ✅ Se o email existe em `auth.users`
- ✅ Se existe em `user_profiles`
- ✅ Se tem assinaturas ativas
- ✅ Se o usuário foi deletado (soft delete)
- ✅ Emails similares (pode ter typo)
- ✅ Histórico completo do usuário

### Opção 2: Script Node.js (Programático)

Execute no terminal:

```bash
node scripts/verificar-usuario-oanfaol.js
```

**O que o script verifica:**
- ✅ Busca usando `listUsers()` (método atual do código)
- ✅ Busca usando `getUserByEmail()` (método recomendado)
- ✅ Verifica em `user_profiles`
- ✅ Verifica assinaturas
- ✅ Busca emails similares
- ✅ Diagnóstico automático

## 🔍 O Que Procurar

### Se o usuário NÃO for encontrado:

**Possíveis causas:**
1. ❌ Usuário nunca foi criado
2. ❌ Usuário foi deletado (soft delete) - verificar campo `deleted_at`
3. ❌ Email está diferente (typo, maiúsculas, espaços)
4. ❌ `listUsers()` tem limite de paginação e não retornou todos os usuários

**Solução:**
- Verificar se o email está correto
- Verificar se o usuário foi deletado
- Usar `getUserByEmail()` em vez de `listUsers()`

### Se o usuário FOR encontrado mas deletado:

**Causa:**
- Usuário foi deletado (soft delete) mas ainda existe no banco

**Solução:**
- Restaurar o usuário (remover `deleted_at`)
- Ou criar novo usuário com o mesmo email

### Se o usuário existir mas não tiver perfil:

**Causa:**
- Usuário existe em `auth.users` mas não em `user_profiles`

**Solução:**
- Criar perfil para o usuário
- Verificar se houve problema na migração

## 📊 Queries SQL Rápidas

### Verificar se existe:
```sql
SELECT * FROM auth.users 
WHERE LOWER(TRIM(email)) = LOWER(TRIM('oanfaol@gmail.com'));
```

### Verificar se foi deletado:
```sql
SELECT * FROM auth.users 
WHERE LOWER(TRIM(email)) = LOWER(TRIM('oanfaol@gmail.com'))
  AND deleted_at IS NOT NULL;
```

### Verificar perfil:
```sql
SELECT * FROM user_profiles 
WHERE LOWER(TRIM(email)) = LOWER(TRIM('oanfaol@gmail.com'));
```

### Verificar assinaturas:
```sql
SELECT s.*, au.email 
FROM subscriptions s
JOIN auth.users au ON au.id = s.user_id
WHERE LOWER(TRIM(au.email)) = LOWER(TRIM('oanfaol@gmail.com'));
```

## 🚨 Problema Identificado no Código

O código atual usa `listUsers()` que pode ter problemas:

```typescript
// ❌ MÉTODO ATUAL (problemático)
const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
const user = authUsers?.users?.find(u => 
  u.email?.toLowerCase() === email.toLowerCase()
)
```

**Problemas:**
- Pode ter limite de paginação
- Mais lento (retorna todos os usuários)
- Pode não encontrar usuários se houver muitos

**Solução recomendada:**
```typescript
// ✅ MÉTODO RECOMENDADO
const { data: userData, error } = await supabaseAdmin.auth.admin.getUserByEmail(
  email.toLowerCase().trim()
)
const user = userData?.user
```

## 📝 Próximos Passos

1. ✅ Executar o script SQL ou Node.js
2. ✅ Verificar os resultados
3. ✅ Se o usuário não existir, verificar se foi deletado
4. ✅ Se existir mas estiver deletado, restaurar
5. ✅ Se o problema for o método de busca, atualizar o código para usar `getUserByEmail()`

## 🔗 Arquivos Relacionados

- `src/app/api/auth/forgot-password/route.ts` - Código atual de recuperação de senha
- `scripts/verificar-usuario-oanfaol-completo.sql` - Script SQL completo
- `scripts/verificar-usuario-oanfaol.js` - Script Node.js
