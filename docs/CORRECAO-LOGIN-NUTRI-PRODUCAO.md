# 🔧 Correção: Problema de Login na Área Nutri em Produção

## 📋 Problema Identificado

**Sintoma:** Usuários não conseguem fazer login na área Nutri em produção. O console mostra "Login bem-sucedido!" mas o redirecionamento não funciona ou a página fica travada em "Carregando...".

**Causa Raiz:**
1. `router.replace()` pode não funcionar corretamente em produção após login
2. `ProtectedLayout` usa apenas `getUser()` que pode não detectar sessão recém-criada
3. Race condition entre criação de sessão e verificação no servidor

## ✅ Correções Implementadas

### 1. **LoginForm.tsx - Redirecionamento Mais Confiável**

**Antes:**
```typescript
router.replace(finalRedirectPath)
setLoading(false)
```

**Depois:**
```typescript
// Usar window.location.href para garantir redirecionamento completo em produção
console.log('🚀 Iniciando redirecionamento para:', finalRedirectPath)
setTimeout(() => {
  console.log('🔄 Redirecionando via window.location para:', finalRedirectPath)
  window.location.href = finalRedirectPath
}, 100)
setLoading(false)
```

**Por quê?**
- `window.location.href` força um redirecionamento completo da página
- Mais confiável em produção onde `router.replace()` pode falhar
- Pequeno delay (100ms) garante que a sessão foi salva antes do redirecionamento

### 2. **auth-server.ts - Verificação de Sessão Melhorada**

**Antes:**
```typescript
const { data: { user }, error: userError } = await supabase.auth.getUser()
```

**Depois:**
```typescript
// Tentar getSession() primeiro (mais rápido), depois getUser() se necessário
let user = null
let userError = null

// Tentar getSession() primeiro (mais rápido e funciona melhor após login recente)
const { data: { session } } = await supabase.auth.getSession()
if (session?.user) {
  user = session.user
  console.log(`✅ ProtectedLayout [${area}]: Sessão encontrada via getSession() para user:`, user.email)
} else {
  // Se getSession() não retornar, tentar getUser() (valida com servidor)
  const getUserResult = await supabase.auth.getUser()
  user = getUserResult.data?.user || null
  userError = getUserResult.error || null
  if (user) {
    console.log(`✅ ProtectedLayout [${area}]: Usuário encontrado via getUser() para user:`, user.email)
  } else {
    console.log(`⚠️ ProtectedLayout [${area}]: getSession() e getUser() não retornaram usuário`)
  }
}
```

**Por quê?**
- `getSession()` é mais rápido e funciona melhor para sessões recém-criadas
- `getUser()` valida com o servidor mas pode ser mais lento
- Fallback para `getUser()` garante segurança se `getSession()` falhar
- Logs melhorados para debug

### 3. **LoginForm.tsx - Correção no Cadastro**

Também aplicada a mesma correção no fluxo de cadastro (signup) para consistência.

## 🧪 Como Testar

1. **Acesse a página de login da área Nutri:**
   ```
   https://www.ylada.com/pt/nutri/login
   ```

2. **Faça login com um usuário de teste:**
   - Email: `nutri1@ylada.com` (ou outro usuário de teste)
   - Senha: (senha configurada)

3. **Verifique no console:**
   - Deve aparecer: `✔ Login bem-sucedido!`
   - Deve aparecer: `🚀 Iniciando redirecionamento para: /pt/nutri/onboarding` (ou `/pt/nutri/home`)
   - Deve aparecer: `🔄 Redirecionando via window.location para: ...`

4. **Resultado esperado:**
   - Página deve redirecionar para `/pt/nutri/onboarding` (se sem diagnóstico) ou `/pt/nutri/home` (se com diagnóstico)
   - Não deve ficar travado em "Carregando..."
   - Não deve redirecionar para `/checkout` (a menos que tenha diagnóstico completo e sem assinatura)

## 🔍 Debug Adicional

Se o problema persistir, verificar:

1. **Cookies no navegador:**
   - Abrir DevTools → Application → Cookies
   - Verificar se há cookies `sb-*` do Supabase
   - Verificar se `sb-access-token` e `sb-refresh-token` estão presentes

2. **Logs do servidor:**
   - Verificar logs do Vercel/deploy
   - Procurar por mensagens de `ProtectedLayout [nutri]`

3. **Network tab:**
   - Verificar se há requisições falhando após login
   - Verificar status das requisições para `/api/nutri/*`

## 📝 Arquivos Modificados

- `src/components/auth/LoginForm.tsx` - Redirecionamento melhorado
- `src/lib/auth-server.ts` - Verificação de sessão melhorada

## 🚀 Próximos Passos

1. Fazer commit e deploy das correções
2. Testar em produção com usuários reais
3. Monitorar logs para verificar se o problema foi resolvido

---

**Data:** 17/12/2025
**Status:** ✅ Implementado - Aguardando teste em produção
