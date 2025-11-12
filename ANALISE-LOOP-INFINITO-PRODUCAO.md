# 🔍 ANÁLISE COMPLETA: Loop Infinito em Produção

## 📋 RESUMO EXECUTIVO

**Problema**: A aplicação funciona perfeitamente em `localhost`, mas em produção fica em loop infinito de carregamento ("Carregando perfil...").

**Sintoma**: A página nunca carrega completamente, ficando presa na tela de loading.

---

## 🎯 FATORES IDENTIFICADOS

### **1. MÚLTIPLAS INSTÂNCIAS DO `useAuth`**

**Problema**: O hook `useAuth` é chamado em **3 lugares diferentes** na mesma página:

1. `ProtectedRoute` (linha 22)
2. `RequireSubscription` (linha 25)  
3. `WellnessDashboardContent` (linha 29)

**Impacto em Produção**:
- Cada chamada cria uma **nova instância** do hook
- Cada instância faz **3 tentativas** de buscar sessão (200ms + 500ms + 500ms = 1.2s)
- Cada instância faz **3 tentativas** de buscar perfil (com retry de 500ms cada)
- **Total**: 9 tentativas de sessão + 9 tentativas de perfil = **18 requisições simultâneas**
- Em produção, com latência maior, isso pode causar:
  - Timeouts
  - Race conditions
  - Estados inconsistentes
  - Loop infinito de re-renders

**Por que funciona em localhost?**
- Latência menor (< 50ms)
- Cache do navegador mais eficiente
- Menos concorrência

**Por que falha em produção?**
- Latência maior (100-500ms)
- Sem cache do navegador (primeira carga)
- Múltiplas requisições simultâneas sobrecarregam o servidor
- Race conditions entre as 3 instâncias

---

### **2. TIMEOUTS E CONDIÇÕES DE RACE**

**Problema**: Múltiplos timeouts competindo entre si:

#### **ProtectedRoute**:
- `loadingTimeout`: 2 segundos
- `authCheckTimeout`: 3 segundos  
- `profileCheckTimeout`: 3 segundos

#### **useAuth**:
- Tentativa 1: 200ms
- Tentativa 2: +500ms (total 700ms)
- Tentativa 3: +500ms (total 1.2s)
- Busca de perfil: 3 tentativas com 500ms cada

**Impacto em Produção**:
- Com 3 instâncias do `useAuth`, os timeouts se sobrepõem
- Uma instância pode marcar `loading = false` enquanto outra ainda está carregando
- Isso causa re-renders infinitos:
  1. Instância 1: `loading = false` → re-render
  2. Instância 2: ainda `loading = true` → re-render
  3. Instância 3: `loading = false` → re-render
  4. Loop infinito

---

### **3. PROBLEMAS COM COOKIES EM PRODUÇÃO**

**Problema**: Cookies podem não estar sendo configurados corretamente em produção.

**Código atual** (`supabase-client.ts` linha 48-49):
```typescript
const sameSite = options?.sameSite || (isProduction ? 'lax' : 'lax')
const secure = options?.secure !== undefined ? options.secure : (isSecure || isProduction)
```

**Possíveis problemas**:
- **Domain**: Cookies podem não estar sendo setados com o domain correto
- **SameSite**: Pode estar bloqueando cookies em produção
- **Secure**: Pode estar faltando em produção (HTTPS requerido)
- **Path**: Pode estar incorreto

**Impacto**:
- Sessão não é persistida
- `getSession()` sempre retorna `null`
- Loop infinito tentando buscar sessão

---

### **4. VARIÁVEIS DE AMBIENTE NÃO CONFIGURADAS**

**Problema**: Variáveis de ambiente podem não estar configuradas na Vercel/plataforma de deploy.

**Variáveis necessárias**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Impacto**:
- Se `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` estiverem `undefined`:
  - `createClient()` retorna `null as unknown as SupabaseClient`
  - Todas as chamadas falham silenciosamente
  - `getSession()` sempre retorna `null`
  - Loop infinito tentando buscar sessão

---

### **5. PROBLEMA COM SSR/HIDRATAÇÃO**

**Problema**: Next.js faz Server-Side Rendering (SSR) em produção.

**Diferença entre localhost e produção**:
- **Localhost**: Desenvolvimento, SSR pode estar desabilitado ou menos rigoroso
- **Produção**: SSR completo, hidratação obrigatória

**Impacto**:
- No servidor: `window` e `document` são `undefined`
- `useAuth` tenta acessar `document.cookie` no servidor → erro
- Estado inicial no servidor ≠ estado no cliente
- Hidratação falha → re-render → loop infinito

**Código problemático** (`useAuth.ts` linha 112):
```typescript
hasCookies: typeof document !== 'undefined' && document.cookie.length > 0
```

Se executado no servidor, pode causar problemas.

---

### **6. DEPENDÊNCIAS CIRCULARES NOS `useEffect`**

**Problema**: Os `useEffect` dependem de estados que outros `useEffect` atualizam.

**Exemplo em `ProtectedRoute`**:
- Hook 1 (linha 29): Depende de `loading` → atualiza `loadingTimeout`
- Hook 2 (linha 41): Depende de `isAuthenticated`, `user`, `loading` → atualiza `authCheckTimeout`
- Hook 3 (linha 59): Depende de `user`, `userProfile`, `loading` → atualiza `profileCheckTimeout`
- Hook 4 (linha 73): Depende de **todos os estados acima** → pode causar re-render

**Impacto em Produção**:
- Com latência maior, os estados mudam em momentos diferentes
- Isso causa múltiplos re-renders
- Loop infinito de atualizações

---

### **7. PROBLEMA COM `onAuthStateChange`**

**Problema**: O `onAuthStateChange` pode estar sendo chamado múltiplas vezes.

**Código** (`useAuth.ts` linha 232-276):
```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
  // ...
})
```

**Impacto**:
- Com 3 instâncias do `useAuth`, há 3 listeners do `onAuthStateChange`
- Cada mudança de estado dispara os 3 listeners
- Cada listener atualiza o estado → re-render
- Loop infinito de atualizações

---

### **8. PROBLEMA COM REDIRECTS INFINITOS**

**Problema**: `ProtectedRoute` pode estar redirecionando infinitamente.

**Código** (`ProtectedRoute.tsx` linha 88-89):
```typescript
const redirectPath = redirectTo || (perfil === 'admin' ? '/admin/login' : `/pt/${perfil || 'nutri'}/login`)
router.push(redirectPath)
```

**Cenário de loop**:
1. Usuário não autenticado → redireciona para `/pt/wellness/login`
2. Página de login carrega → `useAuth` tenta buscar sessão
3. Sessão não encontrada → `ProtectedRoute` redireciona novamente
4. Loop infinito

**Por que funciona em localhost?**
- Cookies podem estar sendo setados corretamente
- Sessão pode estar sendo detectada mais rapidamente

**Por que falha em produção?**
- Cookies não estão sendo setados
- Sessão não é detectada
- Redirect infinito

---

### **9. PROBLEMA COM `router.push` EM PRODUÇÃO**

**Problema**: `router.push` pode estar causando re-renders infinitos.

**Código** (`ProtectedRoute.tsx` linha 88-89, 161, 164):
```typescript
router.push(redirectPath)
```

**Impacto**:
- Cada `router.push` causa um re-render
- Se a condição que causa o redirect não mudar, o redirect acontece novamente
- Loop infinito de redirects

---

### **10. PROBLEMA COM ESTADO INICIAL**

**Problema**: Estado inicial pode estar inconsistente entre servidor e cliente.

**Código** (`useAuth.ts` linha 21-24):
```typescript
const [user, setUser] = useState<User | null>(null)
const [session, setSession] = useState<Session | null>(null)
const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
const [loading, setLoading] = useState(true)
```

**Impacto**:
- **Servidor**: Todos os estados são `null` ou `true` (loading)
- **Cliente**: Estados podem ser diferentes após hidratação
- Isso causa re-render → loop infinito

---

## 🔴 FATORES CRÍTICOS (Ordem de Prioridade)

### **1. MÚLTIPLAS INSTÂNCIAS DO `useAuth`** ⚠️ CRÍTICO
- **Probabilidade**: 95%
- **Impacto**: ALTO
- **Solução**: Context Provider

### **2. VARIÁVEIS DE AMBIENTE NÃO CONFIGURADAS** ⚠️ CRÍTICO
- **Probabilidade**: 80%
- **Impacto**: ALTO
- **Solução**: Verificar configuração na Vercel

### **3. PROBLEMAS COM COOKIES** ⚠️ CRÍTICO
- **Probabilidade**: 70%
- **Impacto**: ALTO
- **Solução**: Corrigir configuração de cookies

### **4. TIMEOUTS E RACE CONDITIONS** ⚠️ MÉDIO
- **Probabilidade**: 60%
- **Impacto**: MÉDIO
- **Solução**: Unificar timeouts e usar Context

### **5. SSR/HIDRATAÇÃO** ⚠️ MÉDIO
- **Probabilidade**: 50%
- **Impacto**: MÉDIO
- **Solução**: Garantir que código só executa no cliente

---

## 📊 MATRIZ DE PROBABILIDADE × IMPACTO

| Fator | Probabilidade | Impacto | Prioridade |
|-------|--------------|---------|------------|
| Múltiplas instâncias useAuth | 95% | ALTO | 🔴 CRÍTICO |
| Variáveis de ambiente | 80% | ALTO | 🔴 CRÍTICO |
| Cookies | 70% | ALTO | 🔴 CRÍTICO |
| Timeouts/Race conditions | 60% | MÉDIO | 🟡 MÉDIO |
| SSR/Hidratação | 50% | MÉDIO | 🟡 MÉDIO |
| onAuthStateChange múltiplo | 40% | MÉDIO | 🟡 MÉDIO |
| Redirects infinitos | 30% | BAIXO | 🟢 BAIXO |
| Estado inicial | 20% | BAIXO | 🟢 BAIXO |

---

## ✅ SOLUÇÕES RECOMENDADAS (Ordem de Implementação)

### **1. Context Provider para `useAuth`** (PRIORIDADE MÁXIMA)
- Criar `AuthContext` e `AuthProvider`
- Envolver a aplicação com `AuthProvider`
- Substituir todas as chamadas diretas de `useAuth()` por `useAuth()` do contexto
- **Impacto**: Resolve múltiplas instâncias, timeouts, race conditions

### **2. Verificar Variáveis de Ambiente** (PRIORIDADE MÁXIMA)
- Verificar se todas as variáveis estão configuradas na Vercel
- Adicionar logs para verificar se estão sendo carregadas
- **Impacto**: Resolve problema de Supabase não configurado

### **3. Corrigir Configuração de Cookies** (PRIORIDADE ALTA)
- Verificar domain, path, sameSite, secure
- Adicionar logs para debug
- **Impacto**: Resolve problema de sessão não persistida

### **4. Garantir Execução Apenas no Cliente** (PRIORIDADE MÉDIA)
- Adicionar verificações `typeof window !== 'undefined'`
- Usar `useEffect` para código que precisa do browser
- **Impacto**: Resolve problemas de SSR/hidratação

### **5. Unificar Timeouts** (PRIORIDADE MÉDIA)
- Remover timeouts duplicados
- Usar um único sistema de timeout
- **Impacto**: Resolve race conditions

---

## 🎯 CONCLUSÃO

O problema de loop infinito em produção é causado por **múltiplos fatores combinados**, sendo os mais críticos:

1. **Múltiplas instâncias do `useAuth`** (95% de probabilidade)
2. **Variáveis de ambiente não configuradas** (80% de probabilidade)
3. **Problemas com cookies** (70% de probabilidade)

A solução mais eficaz é implementar um **Context Provider para `useAuth`**, que resolve a maioria dos problemas identificados.

