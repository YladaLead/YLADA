# 🚀 PRÓXIMOS PASSOS - MIGRAÇÃO AUTENTICAÇÃO

**Status Atual:** ✅ Wellness completo e testado  
**Data:** Dezembro 2024

---

## ✅ O QUE JÁ FOI FEITO

### 1. Wellness (Completo) ✅
- ✅ Helper server-side criado (`auth-server.ts`)
- ✅ Layout protegido criado (`(protected)/layout.tsx`)
- ✅ Página home migrada (`(protected)/home/page.tsx`)
- ✅ AutoRedirect simplificado (apenas UX)
- ✅ ProtectedRoute simplificado (apenas UI)
- ✅ Testes passaram

### 2. Componentes Simplificados ✅
- ✅ AutoRedirect: apenas redireciona de /login para /home (UX)
- ✅ ProtectedRoute: apenas verifica perfil para UI (não segurança)
- ⚠️ RequireSubscription: ainda usado em páginas não migradas (manter por enquanto)

---

## 🎯 PRÓXIMOS PASSOS

### FASE 1: Replicar para Outras Áreas

#### 1. Nutri
```bash
# Criar estrutura
mkdir -p src/app/pt/nutri/\(protected\)/home
mkdir -p src/app/pt/nutri/\(protected\)/layout.tsx

# Copiar layout de wellness e adaptar
# Mover páginas protegidas
```

**Páginas para migrar:**
- [ ] `/pt/nutri/home` → `(protected)/home/`
- [ ] `/pt/nutri/dashboard` → `(protected)/dashboard/`
- [ ] `/pt/nutri/perfil` → `(protected)/perfil/`
- [ ] Outras páginas protegidas

#### 2. Coach
```bash
# Criar estrutura
mkdir -p src/app/pt/coach/\(protected\)/home
mkdir -p src/app/pt/coach/\(protected\)/layout.tsx
```

**Páginas para migrar:**
- [ ] `/pt/coach/home` → `(protected)/home/`
- [ ] Outras páginas protegidas

#### 3. Nutra
```bash
# Criar estrutura
mkdir -p src/app/pt/nutra/\(protected\)/home
mkdir -p src/app/pt/nutra/\(protected\)/layout.tsx
```

**Páginas para migrar:**
- [ ] `/pt/nutra/home` → `(protected)/home/`
- [ ] Outras páginas protegidas

---

### FASE 2: Mover Mais Páginas Wellness

**Páginas protegidas que ainda não foram migradas:**

- [ ] `/pt/wellness/dashboard` → `(protected)/dashboard/`
- [ ] `/pt/wellness/perfil` → `(protected)/perfil/`
- [ ] `/pt/wellness/clientes` → `(protected)/clientes/`
- [ ] `/pt/wellness/biblioteca` → `(protected)/biblioteca/`
- [ ] `/pt/wellness/fluxos` → `(protected)/fluxos/`
- [ ] `/pt/wellness/ferramentas` → `(protected)/ferramentas/`
- [ ] `/pt/wellness/evolucao` → `(protected)/evolucao/`
- [ ] `/pt/wellness/conta` → `(protected)/conta/`
- [ ] Outras páginas protegidas

**Como migrar:**
1. Mover pasta para `(protected)/`
2. Remover `ProtectedRoute` e `RequireSubscription` wrappers
3. Testar acesso

---

### FASE 3: Limpeza Final

**Depois que todas as áreas estiverem migradas:**

- [ ] Remover `ProtectedRoute` completamente (se não usado)
- [ ] Simplificar `RequireSubscription` (apenas UI, não segurança)
- [ ] Remover código antigo não usado
- [ ] Atualizar documentação

---

## 📋 TEMPLATE PARA CRIAR NOVA ÁREA

### 1. Criar Layout Protegido

```typescript
// src/app/pt/[AREA]/(protected)/layout.tsx
import { ReactNode } from 'react'
import { validateProtectedAccess } from '@/lib/auth-server'

export default async function Protected[AREA]Layout({ children }: { children: ReactNode }) {
  await validateProtectedAccess('[area]', {
    requireSubscription: true,
    allowAdmin: true,
    allowSupport: true,
  })

  return <>{children}</>
}
```

### 2. Mover Página

```bash
# Mover página
mv src/app/pt/[AREA]/home src/app/pt/[AREA]/\(protected\)/home

# Remover wrappers de ProtectedRoute e RequireSubscription
# Manter apenas conteúdo
```

### 3. Testar

- [ ] Acesso sem login → redireciona
- [ ] Login válido → mostra conteúdo
- [ ] Perfil incorreto → redireciona
- [ ] Sem assinatura → redireciona para checkout

---

## 🎯 ORDEM RECOMENDADA

1. **Migrar mais páginas Wellness** (praticar)
2. **Replicar para Nutri** (área similar)
3. **Replicar para Coach** (área diferente)
4. **Replicar para Nutra** (área diferente)
5. **Limpeza final**

---

## ⚠️ ATENÇÃO

- **Não deletar páginas antigas** até confirmar que nova estrutura funciona
- **Testar cada migração** antes de continuar
- **Manter backups** das páginas antigas
- **Documentar problemas** encontrados

---

**Última atualização:** Dezembro 2024

