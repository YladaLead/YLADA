# 🥗 MIGRAÇÃO NUTRI - CHAT INSTRUÇÕES

## 📋 CONTEXTO

Migração Wellness concluída ✅ - Agora migrar área **Nutri** para estrutura `(protected)` com validação server-side.

**Padrão:** Remover `ProtectedRoute` e `RequireSubscription`, usar layout server-side.

---

## 🎯 OBJETIVO

Migrar ~30 páginas Nutri de:
- `src/app/pt/nutri/[página]/page.tsx` 
- Para: `src/app/pt/nutri/(protected)/[página]/page.tsx`

**Resultado:** Validação server-side única, sem race conditions, código mais simples.

---

## ✅ PASSO 1: CRIAR LAYOUT

Criar arquivo: `src/app/pt/nutri/(protected)/layout.tsx`

```typescript
import { ReactNode } from 'react'
import { validateProtectedAccess } from '@/lib/auth-server'

interface ProtectedLayoutProps {
  children: ReactNode
}

/**
 * Layout protegido para área Nutri
 * 
 * Valida no server-side:
 * - Sessão válida
 * - Perfil correto (nutri) ou admin/suporte
 * - Assinatura ativa (admin/suporte pode bypassar)
 * 
 * Se qualquer validação falhar → redirect server-side
 * Se tudo OK → renderiza children
 */
export default async function ProtectedNutriLayout({ children }: ProtectedLayoutProps) {
  await validateProtectedAccess('nutri', {
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
18. **cursos/[trilhaId]** → `(protected)/cursos/[trilhaId]/page.tsx`
19. **cursos/[trilhaId]/[moduloId]** → `(protected)/cursos/[trilhaId]/[moduloId]/page.tsx`
20. **configuracao** → `(protected)/configuracao/page.tsx`
21. **anotacoes** → `(protected)/anotacoes/page.tsx`
22. **metodo** → `(protected)/metodo/page.tsx`
23. **metodo/jornada** → `(protected)/metodo/jornada/page.tsx`
24. **metodo/pilares** → `(protected)/metodo/pilares/page.tsx`
25. **metodo/manual** → `(protected)/metodo/manual/page.tsx`
26. **metodo/gsal** → `(protected)/metodo/gsal/page.tsx`
27. **diagnostico** → `(protected)/diagnostico/page.tsx`
28. **portals/novo** → `(protected)/portals/novo/page.tsx`
29. **portals/[id]/editar** → `(protected)/portals/[id]/editar/page.tsx`

---

## 🔧 TEMPLATE DE MIGRAÇÃO

### ANTES (exemplo):
```typescript
'use client'

import ProtectedRoute from '../../../../components/auth/ProtectedRoute'
import RequireSubscription from '../../../../components/auth/RequireSubscription'
import RequireDiagnostico from '@/components/auth/RequireDiagnostico'

export default function NutriHome() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <RequireSubscription area="nutri">
        <RequireDiagnostico area="nutri">
          <NutriHomeContent />
        </RequireDiagnostico>
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function NutriHomeContent() {
  // ... conteúdo
}
```

### DEPOIS:
```typescript
'use client'

// REMOVIDO: ProtectedRoute e RequireSubscription
// MANTER: RequireDiagnostico se necessário (apenas para algumas páginas)
import RequireDiagnostico from '@/components/auth/RequireDiagnostico'

export default function NutriHome() {
  // Se precisa de diagnóstico completo, manter wrapper
  return (
    <RequireDiagnostico area="nutri">
      <NutriHomeContent />
    </RequireDiagnostico>
  )
  
  // OU se não precisa de diagnóstico, apenas:
  // return <NutriHomeContent />
}

function NutriHomeContent() {
  // ... mesmo conteúdo
}
```

---

## ⚠️ ATENÇÃO: RequireDiagnostico

Algumas páginas Nutri usam `RequireDiagnostico`:
- `home/page.tsx` ✅ manter
- Verificar outras páginas que precisam

**Regra:** 
- Remover `ProtectedRoute` e `RequireSubscription` ✅
- Manter `RequireDiagnostico` se a página precisar ✅

---

## ✅ CHECKLIST POR PÁGINA

Para cada página migrada:

- [ ] Criar diretório `(protected)/[pasta]/`
- [ ] Mover `page.tsx` para novo local
- [ ] Remover import `ProtectedRoute`
- [ ] Remover import `RequireSubscription`
- [ ] Remover wrappers `<ProtectedRoute>` e `<RequireSubscription>`
- [ ] Manter `RequireDiagnostico` se necessário
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
# Abrir /pt/nutri/home em aba anônima
# ✅ Deve redirecionar para /pt/nutri/login

# 2. Perfil errado
# Login como wellness, acessar /pt/nutri/home
# ✅ Deve redirecionar

# 3. Sem assinatura
# Login nutri sem assinatura, acessar /pt/nutri/home
# ✅ Deve redirecionar para checkout

# 4. Acesso válido
# Login nutri com assinatura, acessar /pt/nutri/home
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




