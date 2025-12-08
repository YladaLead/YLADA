# 🔍 ANÁLISE: Problema de Acesso - deise@gmail.com (Área Coach)

## 📋 INFORMAÇÕES DO PROBLEMA

**Email**: `deise@gmail.com`  
**Área**: Coach  
**Problema**: Não consegue fazer login e recuperação de senha não funciona  
**Status**: Usuária tinha acesso regulamentado anteriormente

---

## 🔍 PONTOS DE INVESTIGAÇÃO

### 1. **Verificação de Perfil no Login**

**Arquivo**: `src/components/auth/LoginForm.tsx` (linhas 198-211)

O sistema verifica se o email tem perfil correspondente à área:

```typescript
// LOGIN: Verificar se perfil corresponde à área
if (checkData.exists && checkData.hasProfile && checkData.perfil) {
  if (checkData.perfil !== perfil) {
    // Perfil não corresponde à área atual
    const areaLabel = perfilAreaLabels[checkData.perfil] || checkData.perfil
    setError(`Este email está cadastrado na área ${areaLabel}. Faça login na área correta.`)
    setLoading(false)
    return
  }
}
```

**Possíveis problemas**:
- ❓ O email pode estar cadastrado em outra área (wellness, nutri, nutra)
- ❓ O perfil pode estar NULL ou incorreto na tabela `user_profiles`
- ❓ O email pode não ter perfil criado (existe em `auth.users` mas não em `user_profiles`)

---

### 2. **API de Verificação de Perfil**

**Arquivo**: `src/app/api/auth/check-profile/route.ts`

A API busca o perfil usando:
```typescript
.ilike('email', normalizedEmail)
```

**Possíveis problemas**:
- ❓ O email na tabela `user_profiles` pode estar diferente (maiúsculas, espaços, etc.)
- ❓ O email pode não existir na tabela `user_profiles` (só existe em `auth.users`)
- ❓ Cache pode estar retornando dados antigos (TTL de 5 minutos)

---

### 3. **Recuperação de Senha**

**Arquivo**: `src/app/api/auth/forgot-password/route.ts`

O fluxo de recuperação:
1. Busca usuário em `auth.users` (linha 28-41)
2. Busca perfil em `user_profiles` (linha 53-57)
3. Determina área baseado no perfil (linha 59)
4. Gera link de reset (linha 78-84)
5. Envia email customizado (linha 117-123)

**Possíveis problemas**:
- ❓ Usuário não encontrado em `auth.users`
- ❓ Perfil não encontrado em `user_profiles` (área padrão seria 'wellness')
- ❓ Link de reset gerado incorretamente
- ❓ Email não está sendo enviado (problema com Resend)
- ❓ Link de reset expirando antes de ser usado

---

### 4. **Verificação de Senha Provisória**

**Arquivo**: `src/components/auth/LoginForm.tsx` (linhas 238-262)

O sistema verifica se a senha provisória expirou:

```typescript
if (profileData?.temporary_password_expires_at) {
  const expiresAt = new Date(profileData.temporary_password_expires_at)
  const now = new Date()
  
  if (now > expiresAt) {
    await supabase.auth.signOut()
    setError('Sua senha provisória expirou. Entre em contato com o suporte para gerar uma nova.')
    setLoading(false)
    return
  }
}
```

**Possíveis problemas**:
- ❓ Senha provisória pode ter expirado
- ❓ Campo `temporary_password_expires_at` pode estar bloqueando o acesso

---

## 🔎 CHECKLIST DE DIAGNÓSTICO

Para diagnosticar o problema, verifique no Supabase:

### 1. Verificar se usuário existe em `auth.users`

```sql
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  confirmed_at
FROM auth.users
WHERE LOWER(email) = 'deise@gmail.com';
```

**O que verificar**:
- ✅ Email existe?
- ✅ Email está confirmado? (`email_confirmed_at` não é NULL)
- ✅ Conta foi criada?
- ✅ Último login foi quando?

---

### 2. Verificar perfil em `user_profiles`

```sql
SELECT 
  user_id,
  email,
  perfil,
  nome_completo,
  temporary_password_expires_at,
  is_active,
  created_at
FROM user_profiles
WHERE LOWER(email) = 'deise@gmail.com'
   OR user_id IN (
     SELECT id FROM auth.users WHERE LOWER(email) = 'deise@gmail.com'
   );
```

**O que verificar**:
- ✅ Perfil existe?
- ✅ `perfil` está como `'coach'`?
- ✅ `email` na tabela está correto (pode ter diferença de maiúsculas/espaços)?
- ✅ `temporary_password_expires_at` está NULL ou expirado?
- ✅ `is_active` está `true`?

---

### 3. Verificar assinatura (se aplicável)

```sql
SELECT 
  user_id,
  area,
  status,
  current_period_end,
  created_at
FROM subscriptions
WHERE user_id IN (
  SELECT id FROM auth.users WHERE LOWER(email) = 'deise@gmail.com'
)
ORDER BY created_at DESC;
```

**O que verificar**:
- ✅ Tem assinatura ativa?
- ✅ Área da assinatura está como `'coach'`?
- ✅ Status está `'active'`?

---

### 4. Verificar autorizações por email

```sql
SELECT 
  email,
  area,
  valid_until,
  is_active,
  created_at
FROM email_authorizations
WHERE LOWER(email) = 'deise@gmail.com'
ORDER BY created_at DESC;
```

**O que verificar**:
- ✅ Tem autorização ativa?
- ✅ Área está como `'coach'`?
- ✅ `valid_until` ainda não expirou?
- ✅ `is_active` está `true`?

---

## 🚨 PROBLEMAS MAIS PROVÁVEIS

### **Problema 1: Perfil não corresponde à área**

**Sintoma**: Erro "Este email está cadastrado na área X. Faça login na área correta."

**Causa**: O email está cadastrado em outra área (wellness, nutri, nutra) mas tentando acessar Coach.

**Solução**: 
- Verificar qual área o email está cadastrado
- Ou alterar o perfil para 'coach' na tabela `user_profiles`

---

### **Problema 2: Email não confirmado**

**Sintoma**: Login não funciona, pode dar erro de "verifique seu email"

**Causa**: Email não foi confirmado no Supabase Auth.

**Solução**:
- Confirmar email manualmente no Supabase Dashboard
- Ou reenviar email de confirmação

---

### **Problema 3: Perfil não existe em `user_profiles`**

**Sintoma**: Login pode funcionar parcialmente, mas redirecionamento falha.

**Causa**: Usuário existe em `auth.users` mas não tem registro em `user_profiles`.

**Solução**:
- Criar perfil manualmente na tabela `user_profiles`
- Ou usar trigger automático (se configurado)

---

### **Problema 4: Senha provisória expirada**

**Sintoma**: Erro "Sua senha provisória expirou"

**Causa**: Campo `temporary_password_expires_at` está com data passada.

**Solução**:
- Limpar campo `temporary_password_expires_at` na tabela `user_profiles`
- Ou gerar nova senha provisória

---

### **Problema 5: Recuperação de senha não envia email**

**Sintoma**: Clica em "Esqueci minha senha" mas não recebe email.

**Causas possíveis**:
- Email não existe em `auth.users`
- Perfil não encontrado (área padrão pode estar errada)
- Problema com Resend (API key, configuração)
- Email caiu em spam
- Link de reset expirou antes de ser usado

**Solução**:
- Verificar logs do servidor
- Verificar configuração do Resend
- Verificar se email está sendo enviado (logs)

---

### **Problema 6: Email com diferença de formatação**

**Sintoma**: Sistema não encontra o usuário.

**Causa**: Email pode estar salvo com espaços, maiúsculas diferentes, etc.

**Exemplo**:
- Digitado: `deise@gmail.com`
- Salvo: `Deise@gmail.com` ou `deise @gmail.com`

**Solução**:
- Normalizar email (trim + lowercase) antes de buscar
- Verificar todas as variações possíveis

---

## 📊 QUERIES SQL PARA DIAGNÓSTICO COMPLETO

Execute estas queries no Supabase SQL Editor:

```sql
-- 1. Verificar usuário completo
SELECT 
  u.id as user_id,
  u.email as auth_email,
  u.email_confirmed_at,
  u.created_at as auth_created_at,
  u.last_sign_in_at,
  up.email as profile_email,
  up.perfil,
  up.nome_completo,
  up.temporary_password_expires_at,
  up.is_active,
  s.area as subscription_area,
  s.status as subscription_status,
  ea.area as authorization_area,
  ea.valid_until as authorization_valid_until
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
LEFT JOIN email_authorizations ea ON LOWER(ea.email) = LOWER(u.email) AND ea.is_active = true
WHERE LOWER(TRIM(u.email)) = 'deise@gmail.com'
ORDER BY u.created_at DESC;
```

---

## 🔧 AÇÕES RECOMENDADAS (SEM MEXER NO CÓDIGO)

### 1. **Verificar no Supabase Dashboard**

1. Acesse: Supabase Dashboard → Authentication → Users
2. Busque por: `deise@gmail.com`
3. Verifique:
   - ✅ Email está confirmado?
   - ✅ Último login foi quando?
   - ✅ Status da conta

### 2. **Verificar Tabela `user_profiles`**

1. Acesse: Supabase Dashboard → Table Editor → `user_profiles`
2. Busque por: `deise@gmail.com` ou pelo `user_id`
3. Verifique:
   - ✅ Perfil está como `'coach'`?
   - ✅ Email está correto?
   - ✅ `temporary_password_expires_at` está NULL?
   - ✅ `is_active` está `true`?

### 3. **Testar Recuperação de Senha**

1. Acesse: `/pt/coach/recuperar-senha`
2. Digite: `deise@gmail.com`
3. Verifique:
   - ✅ Mensagem de sucesso aparece?
   - ✅ Email chega na caixa de entrada?
   - ✅ Link de reset funciona?
   - ✅ Verificar pasta de spam

### 4. **Verificar Logs do Servidor**

1. Acesse logs do Vercel ou servidor local
2. Procure por:
   - `🔍 Buscando usuário para reset de senha: deise@gmail.com`
   - `📧 Enviando email customizado de reset de senha`
   - Erros relacionados ao email

---

## 🎯 PRÓXIMOS PASSOS

1. **Execute as queries SQL acima** para diagnosticar
2. **Verifique os logs** do servidor durante tentativa de login/recuperação
3. **Teste manualmente** o fluxo de recuperação de senha
4. **Verifique configuração do Resend** (se emails estão sendo enviados)

---

## 📝 OBSERVAÇÕES IMPORTANTES

- O sistema **sempre retorna sucesso** na recuperação de senha (por segurança), mesmo se o email não existir
- O sistema verifica **perfil antes de permitir login** - se o perfil não for 'coach', bloqueia
- O sistema verifica **senha provisória expirada** e bloqueia login se expirada
- O email pode estar **normalizado diferente** (maiúsculas, espaços)

---

## ✅ CONFIRMAÇÃO

**Não mexi em nada no código** - apenas analisei e documentei os possíveis problemas.

**Próximo passo**: Execute as queries SQL acima no Supabase para diagnosticar o problema específico da usuária.





