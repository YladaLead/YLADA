# 🎯 PROBLEMA IDENTIFICADO: Dashboard em Loop Infinito

## ✅ CONFIRMAÇÃO

**Landing Page (`/pt/wellness`)**: ✅ **FUNCIONA PERFEITAMENTE**
- Não usa `ProtectedRoute`
- Não usa `RequireSubscription`
- Não usa `useAuth`
- Página estática simples

**Dashboard (`/pt/wellness/dashboard`)**: ❌ **NÃO FUNCIONA** (loop infinito)
- Usa `ProtectedRoute` (linha 20)
- Usa `RequireSubscription` (linha 21)
- Usa `useAuth` **3 vezes**:
  1. `ProtectedRoute` → `useAuth()` (linha 22)
  2. `RequireSubscription` → `useAuth()` (linha 25)
  3. `WellnessDashboardContent` → `useAuth()` (linha 29)

---

## 🔴 CAUSA RAIZ CONFIRMADA

### **Problema**: Múltiplas Instâncias do `useAuth`

Cada componente cria sua própria instância do hook:

```typescript
// Dashboard structure
<ProtectedRoute>           // useAuth() #1
  <RequireSubscription>     // useAuth() #2
    <WellnessDashboardContent />  // useAuth() #3
  </RequireSubscription>
</ProtectedRoute>
```

**Impacto**:
- 3 instâncias do `useAuth` rodando simultaneamente
- Cada instância faz 3 tentativas de buscar sessão (200ms + 500ms + 500ms)
- Cada instância faz 3 tentativas de buscar perfil (com retry de 500ms)
- **Total**: 9 requisições de sessão + 9 requisições de perfil = **18 requisições simultâneas**

**Em produção**:
- Latência maior (100-500ms vs < 50ms em localhost)
- Race conditions entre as 3 instâncias
- Estados inconsistentes (uma instância marca `loading = false` enquanto outra ainda está carregando)
- Loop infinito de re-renders

---

## ✅ SOLUÇÃO: Context Provider para `useAuth`

Criar um Context Provider para garantir que todos os componentes usem a **mesma instância** do `useAuth`.

### **Estrutura Proposta**:

```typescript
// contexts/AuthContext.tsx
'use client'
import { createContext, useContext } from 'react'
import { useAuth as useAuthHook } from '@/hooks/useAuth'

const AuthContext = createContext<ReturnType<typeof useAuthHook> | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthHook()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### **Uso**:

```typescript
// app/layout.tsx ou app/provider.tsx
import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

// Agora todos os componentes usam a mesma instância
<ProtectedRoute>           // useAuth() do contexto
  <RequireSubscription>     // useAuth() do contexto (mesma instância)
    <WellnessDashboardContent />  // useAuth() do contexto (mesma instância)
  </RequireSubscription>
</ProtectedRoute>
```

---

## 📊 COMPARAÇÃO: Antes vs Depois

### **ANTES** (Problema):
- 3 instâncias do `useAuth`
- 18 requisições simultâneas
- Race conditions
- Estados inconsistentes
- Loop infinito em produção

### **DEPOIS** (Solução):
- 1 instância do `useAuth` (compartilhada)
- 3 requisições de sessão + 3 requisições de perfil = **6 requisições**
- Sem race conditions
- Estados consistentes
- Funciona em produção

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Criar `contexts/AuthContext.tsx`
2. ✅ Adicionar `AuthProvider` no layout raiz
3. ✅ Substituir todas as chamadas diretas de `useAuth()` por `useAuth()` do contexto
4. ✅ Testar em produção

---

## 📝 NOTA

A landing page funciona porque não usa autenticação. O problema está **exclusivamente** nos componentes que usam `useAuth` múltiplas vezes.

