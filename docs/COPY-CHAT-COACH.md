# 🏋️ MIGRAÇÃO COACH - CHAT INSTRUÇÕES

## 📋 CONTEXTO

Migração Wellness concluída ✅ - Agora migrar área **Coach** para estrutura `(protected)` com validação server-side.

**Padrão:** Remover `ProtectedRoute` e `RequireSubscription`, usar layout server-side.

---

## 🎯 OBJETIVO

Migrar ~20 páginas Coach de:
- `src/app/pt/coach/[página]/page.tsx` 
- Para: `src/app/pt/coach/(protected)/[página]/page.tsx`

**Resultado:** Validação server-side única, sem race conditions, código mais simples.

---

## ✅ PASSO 1: CRIAR LAYOUT

Criar arquivo: `src/app/pt/coach/(protected)/layout.tsx`

```typescript
import { ReactNode } from 'react'
import { validateProtectedAccess } from '@/lib/auth-server'

interface ProtectedLayoutProps {
  children: ReactNode
}

/**
 * Layout protegido para área Coach
 * 
 * Valida no server-side:
 * - Sessão válida
 * - Perfil correto (coach) ou admin/suporte
 * - Assinatura ativa (admin/suporte pode bypassar)
 * 
 * Se qualquer validação falhar → redirect server-side
 * Se tudo OK → renderiza children
 */
export default async function ProtectedCoachLayout({ children }: ProtectedLayoutProps) {
  await validateProtectedAccess('coach', {
    requireSubscription: true,
    allowAdmin: true,
    allowSupport: true,
  })

  return <>{children}</>
}
```

---

## 📝 PASSO 2: MIGRAR PÁGINAS (PRIORIDADE ALTA)

### 🔴 Começar por estas (em ordem):

1. **home** → `(protected)/home/page.tsx`
2. **dashboard** → `(protected)/dashboard/page.tsx`
3. **clientes** → `(protected)/clientes/page.tsx`
4. **clientes/[id]** → `(protected)/clientes/[id]/page.tsx`
5. **clientes/novo** → `(protected)/clientes/novo/page.tsx`
6. **clientes/kanban** → `(protected)/clientes/kanban/page.tsx`
7. **leads** → `(protected)/leads/page.tsx`
8. **quizzes** → `(protected)/quizzes/page.tsx`
9. **formularios** → `(protected)/formularios/page.tsx`
10. **formularios/novo** → `(protected)/formularios/novo/page.tsx`
11. **formularios/[id]** → `(protected)/formularios/[id]/page.tsx`
12. **formularios/[id]/enviar** → `(protected)/formularios/[id]/enviar/page.tsx`
13. **formularios/[id]/respostas** → `(protected)/formularios/[id]/respostas/page.tsx`
14. **agenda** → `(protected)/agenda/page.tsx`
15. **acompanhamento** → `(protected)/acompanhamento/page.tsx`
16. **relatorios-gestao** → `(protected)/relatorios-gestao/page.tsx`
17. **cursos** → `(protected)/cursos/page.tsx`
18. **configuracao** → `(protected)/configuracao/page.tsx`
19. **portals/novo** → `(protected)/portals/novo/page.tsx`
20. **portals/[id]/editar** → `(protected)/portals/[id]/editar/page.tsx`

---

## 🔧 TEMPLATE DE MIGRAÇÃO

### ANTES (exemplo):
```typescript
'use client'

import ProtectedRoute from '../../../../components/auth/ProtectedRoute'
import RequireSubscription from '../../../../components/auth/RequireSubscription'
import CoachSidebar from "@/components/coach/CoachSidebar"

export default function CoachHome() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <RequireSubscription area="coach">
        <CoachHomeContent />
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function CoachHomeContent() {
  // ... conteúdo
}
```

### DEPOIS:
```typescript
'use client'

// REMOVIDO: ProtectedRoute e RequireSubscription
// Layout server-side cuida da validação
import CoachSidebar from "@/components/coach/CoachSidebar"

export default function CoachHome() {
  // Conteúdo direto, sem wrappers
  return <CoachHomeContent />
}

function CoachHomeContent() {
  // ... mesmo conteúdo
}
```

---

## ⚠️ ATENÇÃO: Coach não usa RequireDiagnostico

Diferente de Nutri, Coach **não precisa** de `RequireDiagnostico`.

**Regra:** 
- Remover `ProtectedRoute` ✅
- Remover `RequireSubscription` ✅
- Apenas conteúdo direto ✅

---

## ✅ CHECKLIST POR PÁGINA

Para cada página migrada:

- [ ] Criar diretório `(protected)/[pasta]/`
- [ ] Mover `page.tsx` para novo local
- [ ] Remover import `ProtectedRoute`
- [ ] Remover import `RequireSubscription`
- [ ] Remover wrappers `<ProtectedRoute>` e `<RequireSubscription>`
- [ ] Remover imports não utilizados
- [ ] Testar: acesso sem login → redireciona
- [ ] Testar: perfil errado → redireciona
- [ ] Testar: sem assinatura → redireciona
- [ ] Testar: acesso válido → funciona
- [ ] Testar: refresh (F5) → mantém sessão
- [ ] Verificar lint (sem erros)

---

## 🧪 TESTES RÁPIDOS

```bash
# 1. Acesso não autenticado
# Abrir /pt/coach/home em aba anônima
# ✅ Deve redirecionar para /pt/coach/login

# 2. Perfil errado
# Login como wellness, acessar /pt/coach/home
# ✅ Deve redirecionar

# 3. Sem assinatura
# Login coach sem assinatura, acessar /pt/coach/home
# ✅ Deve redirecionar para checkout

# 4. Acesso válido
# Login coach com assinatura, acessar /pt/coach/home
# ✅ Deve carregar normalmente

# 5. Refresh
# Pressionar F5 na página migrada
# ✅ Deve manter sessão
```

---

## 📚 REFERÊNCIAS

- **Wellness migrado:** `src/app/pt/wellness/(protected)/`
- **Layout exemplo:** `src/app/pt/wellness/(protected)/layout.tsx`
- **Página exemplo:** `src/app/pt/wellness/(protected)/home/page.tsx`
- **Guia completo:** `docs/GUIA-MIGRACAO-PROTECTED-ROUTES.md`

---

## 🚀 COMEÇAR AGORA

1. Criar layout `(protected)/layout.tsx` ✅
2. Migrar primeira página: `home` ✅
3. Testar ✅
4. Continuar com próximas páginas ✅

**Migrar uma página por vez, testar, depois continuar!**


















