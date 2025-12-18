# 🔍 Diagnóstico: Monica - Erro "Você precisa fazer login para continuar"

## 📋 Problema Reportado

**Usuária:** Monica  
**Problema:** Aparece mensagem "❌ Você precisa fazer login para continuar" ao tentar usar o NOEL  
**Sintoma:** Consegue acessar a página do NOEL, mas ao enviar mensagem recebe erro de autenticação

---

## 🔎 Análise do Problema

### **Cenário Observado:**

1. ✅ **Monica consegue acessar a página** `/pt/wellness/noel`
   - Isso significa que a autenticação de **página** está funcionando
   - `ProtectedRoute` e `RequireSubscription` permitiram acesso

2. ❌ **Monica recebe erro ao enviar mensagem**
   - Erro: "Você precisa fazer login para continuar"
   - Isso significa que a autenticação de **API** está falhando
   - `requireApiAuth()` não está encontrando sessão

---

## 🎯 Possíveis Causas

### **Causa 1: Sessão não está sendo enviada na requisição** 🔴

**Sintoma:**
- Cookies não estão sendo enviados na requisição POST
- Access token não está sendo incluído no header

**Verificação:**
- Abrir DevTools → Network
- Filtrar por `/api/wellness/noel`
- Verificar se cookies estão sendo enviados
- Verificar se header `Authorization: Bearer <token>` está presente

**Localização:**
- `src/hooks/useAuthenticatedFetch.ts` linha 21-24
- `src/lib/api-auth.ts` linha 95

---

### **Causa 2: Sessão expirada entre carregamento e envio** ⚠️

**Sintoma:**
- Sessão estava válida ao carregar a página
- Mas expirou antes de enviar a mensagem

**Verificação:**
- Verificar se Monica ficou muito tempo na página antes de enviar
- Verificar se há timeout de sessão muito curto

---

### **Causa 3: Perfil da Monica não está correto** ⚠️

**Sintoma:**
- Monica pode não ter perfil `'wellness'`
- Ou perfil pode estar `NULL` ou incorreto

**Verificação:**
- Executar script: `scripts/verificar-perfil-monica.sql`
- Verificar se `perfil = 'wellness'`
- Verificar se `is_active = true`

---

### **Causa 4: Cookies bloqueados ou não sincronizados** ⚠️

**Sintoma:**
- Navegador pode estar bloqueando cookies
- Cookies podem não estar sincronizando entre cliente e servidor

**Verificação:**
- Verificar configurações de cookies do navegador
- Verificar se está usando modo anônimo (pode bloquear cookies)
- Verificar se há extensões bloqueando cookies

---

### **Causa 5: Problema específico com email da Monica** ⚠️

**Sintoma:**
- Pode haver múltiplos registros com emails similares
- Pode haver problema de case sensitivity (maiúsculas/minúsculas)

**Verificação:**
- Verificar se há múltiplos registros para emails similares
- Verificar se email está exatamente igual (case-sensitive)

---

## 🔍 Como Diagnosticar

### **Passo 1: Verificar Perfil da Monica**

Execute o script SQL:
```sql
-- Arquivo: scripts/verificar-perfil-monica.sql
```

**Verificar:**
- ✅ Email existe em `auth.users`
- ✅ Email confirmado (`email_confirmed_at IS NOT NULL`)
- ✅ Perfil existe em `user_profiles`
- ✅ Perfil = `'wellness'`
- ✅ Usuário não está banido (`banned_until IS NULL`)

---

### **Passo 2: Verificar no Console do Navegador**

1. Monica deve abrir DevTools (F12)
2. Ir para aba "Console"
3. Tentar enviar mensagem no NOEL
4. Verificar se há erros relacionados a autenticação

**Procurar por:**
- `❌ [NOEL] Autenticação falhou`
- `useAuth: Nenhuma sessão encontrada`
- `useAuth: Auth state changed: SIGNED_OUT`

---

### **Passo 3: Verificar Network Tab**

1. Abrir DevTools → Network
2. Filtrar por `/api/wellness/noel`
3. Clicar na requisição que falhou
4. Verificar:

**Headers:**
- ✅ `Cookie:` deve conter cookies do Supabase
- ✅ `Authorization: Bearer <token>` deve estar presente

**Response:**
- Verificar mensagem de erro retornada
- Verificar se há informações técnicas (em desenvolvimento)

---

### **Passo 4: Verificar Cookies no Navegador**

1. Abrir DevTools → Application → Cookies
2. Verificar se existem cookies do Supabase:
   - `sb-<project>-auth-token`
   - `sb-<project>-auth-token.0`
   - `sb-<project>-auth-token.1`

**Se não existirem:**
- Cookies não estão sendo salvos
- Pode ser problema de configuração do navegador
- Pode ser problema de SameSite/Secure

---

## ✅ Soluções Recomendadas

### **Solução 1: Verificar e Corrigir Perfil da Monica**

**Se perfil estiver incorreto ou ausente:**

```sql
-- Corrigir perfil da Monica para wellness
UPDATE user_profiles
SET perfil = 'wellness'
WHERE email ILIKE '%monica%'
  AND (perfil IS NULL OR perfil != 'wellness');
```

---

### **Solução 2: Limpar Cache e Cookies**

**Instruções para Monica:**
1. Fazer logout
2. Limpar cookies do navegador
3. Fazer login novamente
4. Tentar usar NOEL

---

### **Solução 3: Verificar se Access Token está sendo enviado**

**Se o problema persistir:**
- Verificar se `useAuthenticatedFetch` está obtendo o token
- Verificar se token está sendo incluído no header
- Verificar logs do servidor para ver se token está chegando

---

## 📊 Checklist de Diagnóstico

- [ ] Executar script SQL para verificar perfil da Monica
- [ ] Verificar se email está confirmado no Supabase
- [ ] Verificar se perfil = 'wellness'
- [ ] Verificar se `is_active = true`
- [ ] Verificar cookies no navegador
- [ ] Verificar Network tab para ver requisições
- [ ] Verificar console para erros
- [ ] Testar em outro navegador
- [ ] Testar em modo normal (não anônimo)

---

## 🔗 Arquivos Relacionados

- `src/lib/api-auth.ts` - Função de autenticação de API
- `src/hooks/useAuthenticatedFetch.ts` - Hook de fetch autenticado
- `src/app/api/wellness/noel/route.ts` - Endpoint do NOEL
- `scripts/verificar-perfil-monica.sql` - Script de verificação

---

**Data do Diagnóstico:** 2025-12-16  
**Status:** ⚠️ **Aguardando verificação do perfil da Monica**




