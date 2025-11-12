# 🚀 PLANO DE OTIMIZAÇÃO - PASSO A PASSO

## 📋 VISÃO GERAL

**Objetivo**: Reduzir tempo de carregamento de 2-10s para <500ms

**Estratégia**: Implementar em 4 fases, testando após cada uma

---

## 🎯 FASE 1: QUICK WINS (Impacto Imediato - 1-2 horas)

### **PASSO 1.1: Implementar Cache em SessionStorage**

**Arquivo**: `src/lib/auth-cache.ts` (criar novo)

```typescript
'use client'

const ADMIN_CHECK_CACHE_KEY = 'ylada_admin_check'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export function getCachedAdminCheck(): boolean | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cached = sessionStorage.getItem(ADMIN_CHECK_CACHE_KEY)
    if (!cached) return null
    
    const { isAdmin, timestamp } = JSON.parse(cached)
    const now = Date.now()
    
    // Cache expirado?
    if (now - timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(ADMIN_CHECK_CACHE_KEY)
      return null
    }
    
    return isAdmin
  } catch {
    return null
  }
}

export function setCachedAdminCheck(isAdmin: boolean) {
  if (typeof window === 'undefined') return
  
  try {
    sessionStorage.setItem(ADMIN_CHECK_CACHE_KEY, JSON.stringify({
      isAdmin,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.error('Erro ao salvar cache:', error)
  }
}

export function clearCachedAdminCheck() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(ADMIN_CHECK_CACHE_KEY)
}
```

**Ação**: Criar arquivo acima

---

### **PASSO 1.2: Reduzir Timeout de 10s para 3s**

**Arquivo**: `src/app/admin/page.tsx`

**Mudança**:
```typescript
// LINHA 196 - ANTES:
safetyTimeoutRef.current = setTimeout(() => {
  // ...
}, 10000) // 10 segundos

// DEPOIS:
safetyTimeoutRef.current = setTimeout(() => {
  // ...
}, 3000) // 3 segundos
```

**Ação**: Alterar linha 196 de `10000` para `3000`

---

### **PASSO 1.3: Usar Cache no AdminProtectedRoute**

**Arquivo**: `src/components/auth/AdminProtectedRoute.tsx`

**Mudanças**:

1. **Importar cache** (no topo):
```typescript
import { getCachedAdminCheck, setCachedAdminCheck } from '@/lib/auth-cache'
```

2. **Verificar cache primeiro** (dentro do `checkAdmin`, antes da query):
```typescript
const checkAdmin = async () => {
  try {
    // ✅ NOVO: Verificar cache primeiro
    const cachedAdmin = getCachedAdminCheck()
    if (cachedAdmin !== null) {
      console.log('✅ AdminProtectedRoute: Usando cache')
      setIsAdmin(cachedAdmin)
      setLoading(false)
      return
    }
    
    console.log('🔐 AdminProtectedRoute: INICIANDO verificação...')
    
    // ... resto do código existente ...
    
    // ✅ NOVO: Salvar no cache após verificar
    if (profile?.is_admin) {
      setCachedAdminCheck(true)
      setIsAdmin(true)
      setLoading(false)
    } else {
      setCachedAdminCheck(false)
      // ... redirecionar ...
    }
  } catch (error) {
    // ...
  }
}
```

**Ação**: Adicionar verificação de cache no início e salvar no final

---

### **PASSO 1.4: Limpar Cache ao Fazer Logout**

**Arquivo**: `src/app/admin/page.tsx`

**Mudança** (no botão de logout, linha ~358):
```typescript
// ANTES:
onClick={async () => {
  await supabase.auth.signOut()
  window.location.href = '/admin/login'
}}

// DEPOIS:
onClick={async () => {
  const { clearCachedAdminCheck } = await import('@/lib/auth-cache')
  clearCachedAdminCheck()
  await supabase.auth.signOut()
  window.location.href = '/admin/login'
}}
```

**Ação**: Adicionar limpeza de cache no logout

---

### **TESTE FASE 1**
1. Limpar cache do navegador
2. Acessar `/admin`
3. Medir tempo de carregamento
4. Recarregar página (deve usar cache)
5. **Resultado esperado**: Primeira carga <2s, recargas <500ms

---

## 🔧 FASE 2: REMOVER DUPLICAÇÃO (30-60 minutos)

### **PASSO 2.1: Remover Verificação do AdminDashboard**

**Arquivo**: `src/app/admin/page.tsx`

**Mudança**: Remover todo o `useEffect` de verificação (linhas 47-224)

**Substituir por**:
```typescript
export default function AdminDashboard() {
  // Remover todos os estados e useEffects de autenticação
  // AdminProtectedRoute já faz isso
  
  return <AdminDashboardContent />
}
```

**Ação**: Simplificar componente, deixar AdminProtectedRoute fazer toda verificação

---

### **PASSO 2.2: Otimizar AdminProtectedRoute com Promise.all**

**Arquivo**: `src/components/auth/AdminProtectedRoute.tsx`

**Mudança** (dentro do `checkAdmin`):
```typescript
// ANTES (sequencial):
const { data: { session } } = await supabase.auth.getSession()
if (!session) return

const profilePromise = supabase
  .from('user_profiles')
  .select('is_admin')
  .eq('user_id', session.user.id)
  .single()

// DEPOIS (paralelo):
const [sessionResult, cachedAdmin] = await Promise.all([
  supabase.auth.getSession(),
  Promise.resolve(getCachedAdminCheck()) // Cache já verificado antes
])

const { data: { session } } = sessionResult
if (!session) return

// Se tem cache válido, usar
if (cachedAdmin !== null) {
  setIsAdmin(cachedAdmin)
  setLoading(false)
  return
}

// Senão, buscar do banco
const { data: profile } = await supabase
  .from('user_profiles')
  .select('is_admin')
  .eq('user_id', session.user.id)
  .single()
```

**Ação**: Fazer chamadas em paralelo quando possível

---

### **TESTE FASE 2**
1. Verificar que não há duplicação de chamadas no console
2. Medir tempo de carregamento
3. **Resultado esperado**: Redução de 30-50% no tempo

---

## 🗄️ FASE 3: OTIMIZAR BANCO DE DADOS (15-30 minutos)

### **PASSO 3.1: Criar Índices no Supabase**

**SQL para executar no Supabase**:

```sql
-- Índice simples em user_id (se não existir)
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id 
ON user_profiles(user_id);

-- Índice composto para verificação de admin (otimizado)
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin_check 
ON user_profiles(user_id, is_admin) 
WHERE is_admin = true;

-- Verificar índices existentes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'user_profiles';
```

**Ação**: Executar SQL no Supabase SQL Editor

---

### **PASSO 3.2: Otimizar Query no AdminProtectedRoute**

**Arquivo**: `src/components/auth/AdminProtectedRoute.tsx`

**Mudança**:
```typescript
// ANTES:
const { data: profile } = await supabase
  .from('user_profiles')
  .select('is_admin')
  .eq('user_id', session.user.id)
  .single()

// DEPOIS (mais rápido se não for admin):
const { data: profile } = await supabase
  .from('user_profiles')
  .select('is_admin')
  .eq('user_id', session.user.id)
  .eq('is_admin', true) // Filtro adicional
  .maybeSingle() // Não erro se não encontrar
```

**Ação**: Adicionar filtro `.eq('is_admin', true)` e usar `maybeSingle()`

---

### **TESTE FASE 3**
1. Executar query manualmente no Supabase
2. Verificar tempo de execução (<10ms)
3. Testar carregamento da página
4. **Resultado esperado**: Query 60-80% mais rápida

---

## ⚡ FASE 4: OTIMIZAÇÕES AVANÇADAS (Opcional - 1-2 horas)

### **PASSO 4.1: Adicionar Cache HTTP na API**

**Arquivo**: `src/app/api/admin/check/route.ts`

**Mudança** (no return):
```typescript
return NextResponse.json({
  isAdmin,
  userId: user.id,
  email: user.email
}, {
  headers: {
    'Cache-Control': 'private, max-age=300', // 5 minutos
    'CDN-Cache-Control': 'private, max-age=0' // Não cachear no CDN
  }
})
```

**Ação**: Adicionar headers de cache

---

### **PASSO 4.2: Lazy Load de Componentes Pesados**

**Arquivo**: `src/app/admin/page.tsx`

**Mudança**:
```typescript
// No topo do arquivo:
import dynamic from 'next/dynamic'

// Substituir import:
// import AdminDashboardContent from './AdminDashboardContent'

// Por:
const AdminDashboardContent = dynamic(
  () => import('./AdminDashboardContent'),
  {
    loading: () => (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    ),
    ssr: false // Se não precisar de SSR
  }
)
```

**Ação**: Usar dynamic import para AdminDashboardContent

---

### **PASSO 4.3: Adicionar React.memo**

**Arquivo**: `src/app/admin/page.tsx` (função AdminDashboardContent)

**Mudança**:
```typescript
// No final do arquivo, exportar com memo:
export default React.memo(AdminDashboardContent)
```

**Ação**: Envolver componente com React.memo

---

## 📊 CHECKLIST DE IMPLEMENTAÇÃO

### **FASE 1: Quick Wins**
- [ ] Criar `src/lib/auth-cache.ts`
- [ ] Reduzir timeout de 10s para 3s
- [ ] Adicionar cache no AdminProtectedRoute
- [ ] Limpar cache no logout
- [ ] Testar e medir resultados

### **FASE 2: Remover Duplicação**
- [ ] Remover verificação do AdminDashboard
- [ ] Otimizar AdminProtectedRoute com Promise.all
- [ ] Testar e medir resultados

### **FASE 3: Otimizar Banco**
- [ ] Criar índices no Supabase
- [ ] Otimizar query com filtro adicional
- [ ] Testar e medir resultados

### **FASE 4: Otimizações Avançadas** (Opcional)
- [ ] Adicionar cache HTTP na API
- [ ] Implementar lazy loading
- [ ] Adicionar React.memo
- [ ] Testar e medir resultados

---

## 🎯 ORDEM DE EXECUÇÃO RECOMENDADA

1. **Hoje**: Fase 1 (Quick Wins) - Maior impacto, menor esforço
2. **Amanhã**: Fase 2 (Remover Duplicação) - Fácil, bom impacto
3. **Esta semana**: Fase 3 (Otimizar Banco) - Rápido, impacto médio
4. **Próxima semana**: Fase 4 (Avançadas) - Se ainda precisar melhorar

---

## 📈 MÉTRICAS DE SUCESSO

### **Antes das Otimizações:**
- Tempo de carregamento: 2-10 segundos
- Chamadas ao banco: 2-4 por página
- Experiência: Lenta, timeout visível

### **Após Fase 1:**
- Tempo de carregamento: 1-3 segundos (primeira carga)
- Tempo de recarga: <500ms (com cache)
- Chamadas ao banco: 1 por página (primeira carga)

### **Após Fase 2:**
- Tempo de carregamento: 0.5-2 segundos
- Chamadas ao banco: 1 por página

### **Após Fase 3:**
- Tempo de carregamento: 0.3-1 segundo
- Query ao banco: <10ms

### **Após Fase 4:**
- Tempo de carregamento: <500ms
- Experiência: Instantânea

---

## 🚨 IMPORTANTE

1. **Testar após cada fase** - Não implementar tudo de uma vez
2. **Medir resultados** - Usar DevTools Performance tab
3. **Fazer commit após cada fase** - Facilita rollback se necessário
4. **Comunicar mudanças** - Avisar equipe sobre melhorias

---

## 🔍 COMO MEDIR RESULTADOS

### **Chrome DevTools:**
1. Abrir DevTools (F12)
2. Aba "Network"
3. Recarregar página
4. Ver tempo total de carregamento
5. Ver número de requisições

### **Console Logs:**
- Verificar logs de "AdminProtectedRoute"
- Contar quantas vezes "verificação" aparece
- Deve aparecer apenas 1 vez (não 2-3)

### **Performance API:**
```javascript
// No console do navegador:
performance.getEntriesByType('navigation')[0].loadEventEnd - 
performance.getEntriesByType('navigation')[0].fetchStart
```

---

## ✅ PRÓXIMOS PASSOS

1. **Começar pela Fase 1** (maior impacto)
2. **Testar bem** antes de passar para próxima fase
3. **Documentar resultados** de cada fase
4. **Compartilhar melhorias** com a equipe

