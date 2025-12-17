# 🔍 Diagnóstico Monica - Resultados do SQL

## 📊 Resultado da Query 6: Perfil NOEL

```json
{
  "email": "mmg.monica@hotmail.com",
  "tem_perfil_noel": "✅ Tem perfil NOEL",
  "onboarding_completo": true,
  "objetivo_principal": null,
  "tempo_disponivel": null,
  "experiencia_vendas": null,
  "perfil_noel_criado_em": "2025-12-10 15:19:18.956943+00"
}
```

### ✅ O que está OK:
- Monica tem perfil NOEL criado
- Onboarding está marcado como completo (`onboarding_completo: true`)
- Perfil foi criado em 10/12/2025

### ⚠️ Problemas identificados:
- Campos principais estão NULL:
  - `objetivo_principal`: null
  - `tempo_disponivel`: null
  - `experiencia_vendas`: null

**Isso indica que:**
- O onboarding foi marcado como completo sem preencher os dados obrigatórios
- Ou os dados foram perdidos/removidos após o onboarding
- Ou há um bug na lógica de salvamento do onboarding

---

## 🔍 Próximos Passos - Verificar Outras Queries

Para identificar a causa do erro "Você precisa fazer login para continuar", precisamos verificar:

### **Query 1: auth.users**
- ✅ Email existe?
- ✅ Email confirmado? (`email_confirmed_at IS NOT NULL`)
- ✅ Usuário não está banido? (`banned_until IS NULL`)
- ✅ Último login (`last_sign_in_at`)

### **Query 2 e 3: user_profiles**
- ✅ Perfil existe?
- ✅ `perfil = 'wellness'`? (OBRIGATÓRIO para acessar NOEL)
- ✅ `is_admin` ou `is_support`? (pode ter acesso mesmo sem perfil wellness)

### **Query 4: subscriptions**
- ✅ Tem assinatura wellness ativa?
- ⚠️ **IMPORTANTE**: A API `/api/wellness/noel` verifica autenticação, mas pode não verificar assinatura diretamente
- Verificar se há verificação de assinatura no código

### **Query 5: noel_rate_limits**
- ✅ Está bloqueada por rate limit?
- ✅ `is_blocked = true` e `blocked_until > NOW()`?

---

## 🎯 Possíveis Causas do Erro de Login

### **Causa 1: Perfil não é 'wellness'** ⚠️ MAIS PROVÁVEL
```typescript
// src/app/api/wellness/noel/route.ts linha 904
const authResult = await requireApiAuth(request, ['wellness', 'admin'])
```
- Se `user_profiles.perfil != 'wellness'` E não é admin → **ERRO 401**

### **Causa 2: Email não confirmado**
```typescript
// src/lib/api-auth.ts
// Verifica se session.user existe e está válido
```
- Se `email_confirmed_at IS NULL` → pode causar problemas de autenticação

### **Causa 3: Problema com cookies/token**
- Cookies não estão sendo enviados corretamente
- Access token no header Authorization não está sendo enviado
- Sessão expirada

### **Causa 4: Bloqueio de rate limit**
- Se `is_blocked = true` e `blocked_until > NOW()` → pode estar bloqueada

---

## 🔧 Como Resolver

### **Passo 1: Verificar todas as queries**
Execute todas as 6 queries do script e me envie os resultados completos.

### **Passo 2: Verificar perfil**
Se `perfil != 'wellness'`, corrigir:
```sql
UPDATE user_profiles
SET perfil = 'wellness'
WHERE email = 'mmg.monica@hotmail.com';
```

### **Passo 3: Verificar email confirmado**
Se `email_confirmed_at IS NULL`, pode ser necessário:
- Reenviar email de confirmação
- Ou confirmar manualmente no Supabase

### **Passo 4: Limpar bloqueios de rate limit**
Se houver bloqueio ativo:
```sql
UPDATE noel_rate_limits
SET is_blocked = false,
    blocked_until = NULL
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'mmg.monica@hotmail.com');
```

### **Passo 5: Verificar no navegador**
- Abrir DevTools → Console
- Verificar se há erros de autenticação
- Verificar se cookies estão sendo enviados
- Verificar se access token está no header Authorization

---

## 📝 Checklist de Diagnóstico

- [ ] Query 1: auth.users - Email confirmado?
- [ ] Query 2: user_profiles - Perfil existe?
- [ ] Query 3: user_profiles - Perfil = 'wellness'?
- [ ] Query 4: subscriptions - Assinatura ativa?
- [ ] Query 5: noel_rate_limits - Está bloqueada?
- [ ] Query 6: wellness_noel_profile - ✅ Já verificado

---

## 🚨 Ação Imediata

**Execute as queries 1, 2, 3, 4 e 5 e me envie os resultados!**

Isso vai nos permitir identificar exatamente qual é o problema que está causando o erro "Você precisa fazer login para continuar".


