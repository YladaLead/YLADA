# 🚀 GUIA DE MIGRAÇÃO - Protected Routes para (protected)

**Padrão:** Migração Wellness concluída ✅  
**Objetivo:** Migrar Nutri e Coach para estrutura `(protected)` com validação server-side

---

## 📋 RESUMO DO PADRÃO WELLNESS

### ✅ O que foi feito:
1. Criada estrutura `(protected)/` dentro de `/pt/wellness/`
2. Criado `layout.tsx` com validação server-side
3. Removidos `ProtectedRoute` e `RequireSubscription` de todas as páginas
4. Páginas simplificadas (apenas conteúdo)
5. Validação única no layout server-side

### 📁 Estrutura Wellness (referência):
```
src/app/pt/wellness/
├── (protected)/
│   ├── layout.tsx              # Validação server-side
│   ├── home/page.tsx
│   ├── dashboard-novo/page.tsx
│   ├── perfil/page.tsx
│   ├── clientes/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── novo/page.tsx
│   ├── evolucao/page.tsx
│   ├── biblioteca/
│   │   ├── page.tsx
│   │   └── [subpáginas]/
│   └── conta/
│       ├── page.tsx
│       └── [subpáginas]/
└── [outras páginas públicas]
```

---

## 🎯 ÁREA NUTRI - PÁGINAS PARA MIGRAR

### 📊 Status Atual:
- **Total de páginas:** ~89 páginas
- **Com ProtectedRoute/RequireSubscription:** ~30 páginas
- **Prioridade:** Migrar páginas principais primeiro

### 🔴 PRIORIDADE ALTA (Migrar Primeiro):

#### 1. **Páginas Principais**
- ✅ `home/page.tsx` → `(protected)/home/page.tsx`
- ✅ `dashboard/page.tsx` → `(protected)/dashboard/page.tsx`
- ✅ `clientes/page.tsx` → `(protected)/clientes/page.tsx`
- ✅ `clientes/[id]/page.tsx` → `(protected)/clientes/[id]/page.tsx`
- ✅ `clientes/novo/page.tsx` → `(protected)/clientes/novo/page.tsx`
- ✅ `clientes/kanban/page.tsx` → `(protected)/clientes/kanban/page.tsx`

#### 2. **Gestão e Ferramentas**
- ✅ `leads/page.tsx` → `(protected)/leads/page.tsx`
- ✅ `quizzes/page.tsx` → `(protected)/quizzes/page.tsx`
- ✅ `formularios/page.tsx` → `(protected)/formularios/page.tsx`
- ✅ `formularios/novo/page.tsx` → `(protected)/formularios/novo/page.tsx`
- ✅ `formularios/[id]/page.tsx` → `(protected)/formularios/[id]/page.tsx`
- ✅ `formularios/[id]/enviar/page.tsx` → `(protected)/formularios/[id]/enviar/page.tsx`
- ✅ `formularios/[id]/respostas/page.tsx` → `(protected)/formularios/[id]/respostas/page.tsx`

#### 3. **Acompanhamento**
- ✅ `agenda/page.tsx` → `(protected)/agenda/page.tsx`
- ✅ `acompanhamento/page.tsx` → `(protected)/acompanhamento/page.tsx`
- ✅ `relatorios-gestao/page.tsx` → `(protected)/relatorios-gestao/page.tsx`

#### 4. **Formação**
- ✅ `cursos/page.tsx` → `(protected)/cursos/page.tsx`
- ✅ `cursos/[trilhaId]/page.tsx` → `(protected)/cursos/[trilhaId]/page.tsx`
- ✅ `cursos/[trilhaId]/[moduloId]/page.tsx` → `(protected)/cursos/[trilhaId]/[moduloId]/page.tsx`

#### 5. **Configurações**
- ✅ `configuracao/page.tsx` → `(protected)/configuracao/page.tsx`
- ✅ `anotacoes/page.tsx` → `(protected)/anotacoes/page.tsx`

#### 6. **Método YLADA** (com layout próprio)
- ✅ `metodo/page.tsx` → `(protected)/metodo/page.tsx`
- ✅ `metodo/jornada/page.tsx` → `(protected)/metodo/jornada/page.tsx`
- ✅ `metodo/pilares/page.tsx` → `(protected)/metodo/pilares/page.tsx`
- ✅ `metodo/manual/page.tsx` → `(protected)/metodo/manual/page.tsx`
- ✅ `metodo/gsal/page.tsx` → `(protected)/metodo/gsal/page.tsx`
- ✅ `diagnostico/page.tsx` → `(protected)/diagnostico/page.tsx`

#### 7. **Portals** (se necessário)
- ✅ `portals/novo/page.tsx` → `(protected)/portals/novo/page.tsx`
- ✅ `portals/[id]/editar/page.tsx` → `(protected)/portals/[id]/editar/page.tsx`

---

## 🎯 ÁREA COACH - PÁGINAS PARA MIGRAR

### 📊 Status Atual:
- **Total de páginas:** ~44 páginas
- **Com ProtectedRoute/RequireSubscription:** ~20 páginas
- **Prioridade:** Migrar páginas principais primeiro

### 🔴 PRIORIDADE ALTA (Migrar Primeiro):

#### 1. **Páginas Principais**
- ✅ `home/page.tsx` → `(protected)/home/page.tsx`
- ✅ `dashboard/page.tsx` → `(protected)/dashboard/page.tsx`
- ✅ `clientes/page.tsx` → `(protected)/clientes/page.tsx`
- ✅ `clientes/[id]/page.tsx` → `(protected)/clientes/[id]/page.tsx`
- ✅ `clientes/novo/page.tsx` → `(protected)/clientes/novo/page.tsx`
- ✅ `clientes/kanban/page.tsx` → `(protected)/clientes/kanban/page.tsx`

#### 2. **Gestão e Ferramentas**
- ✅ `leads/page.tsx` → `(protected)/leads/page.tsx`
- ✅ `quizzes/page.tsx` → `(protected)/quizzes/page.tsx`
- ✅ `formularios/page.tsx` → `(protected)/formularios/page.tsx`
- ✅ `formularios/novo/page.tsx` → `(protected)/formularios/novo/page.tsx`
- ✅ `formularios/[id]/page.tsx` → `(protected)/formularios/[id]/page.tsx`
- ✅ `formularios/[id]/enviar/page.tsx` → `(protected)/formularios/[id]/enviar/page.tsx`
- ✅ `formularios/[id]/respostas/page.tsx` → `(protected)/formularios/[id]/respostas/page.tsx`

#### 3. **Acompanhamento**
- ✅ `agenda/page.tsx` → `(protected)/agenda/page.tsx`
- ✅ `acompanhamento/page.tsx` → `(protected)/acompanhamento/page.tsx`
- ✅ `relatorios-gestao/page.tsx` → `(protected)/relatorios-gestao/page.tsx`

#### 4. **Formação**
- ✅ `cursos/page.tsx` → `(protected)/cursos/page.tsx`

#### 5. **Configurações**
- ✅ `configuracao/page.tsx` → `(protected)/configuracao/page.tsx`

#### 6. **Portals** (se necessário)
- ✅ `portals/novo/page.tsx` → `(protected)/portals/novo/page.tsx`
- ✅ `portals/[id]/editar/page.tsx` → `(protected)/portals/[id]/editar/page.tsx`

---

## 🔧 PASSO A PASSO DA MIGRAÇÃO

### **Passo 1: Criar Estrutura (protected)**

```bash
# Para Nutri
mkdir -p src/app/pt/nutri/\(protected\)

# Para Coach
mkdir -p src/app/pt/coach/\(protected\)
```

### **Passo 2: Criar Layout Server-Side**

**Nutri:** `src/app/pt/nutri/(protected)/layout.tsx`
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

**Coach:** `src/app/pt/coach/(protected)/layout.tsx`
```typescript
import { ReactNode } from 'react'
import { validateProtectedAccess } from '@/lib/auth-server'

interface ProtectedLayoutProps {
  children: ReactNode
}

/**
 * Layout protegido para área Coach
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

### **Passo 3: Migrar Página Individual**

**ANTES:**
```typescript
'use client'

import ProtectedRoute from '../../../../components/auth/ProtectedRoute'
import RequireSubscription from '../../../../components/auth/RequireSubscription'

export default function NutriHome() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <RequireSubscription area="nutri">
        <NutriHomeContent />
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function NutriHomeContent() {
  // ... conteúdo da página
}
```

**DEPOIS:**
```typescript
'use client'

// Remover imports de ProtectedRoute e RequireSubscription
// Manter apenas o conteúdo

export default function NutriHome() {
  // Conteúdo direto (sem wrappers)
  return <NutriHomeContent />
}

function NutriHomeContent() {
  // ... mesmo conteúdo da página
}
```

### **Passo 4: Mover Arquivo**

```bash
# Exemplo: migrar home
mv src/app/pt/nutri/home/page.tsx src/app/pt/nutri/\(protected\)/home/page.tsx

# Criar diretório se necessário
mkdir -p src/app/pt/nutri/\(protected\)/home
```

### **Passo 5: Atualizar Rotas**

- URLs mudam de `/pt/nutri/home` para `/pt/nutri/home` (mesma URL!)
- Next.js trata `(protected)` como grupo de rotas (não aparece na URL)
- Links internos continuam funcionando normalmente

### **Passo 6: Verificar RequireDiagnostico**

**⚠️ ATENÇÃO:** Algumas páginas Nutri usam `RequireDiagnostico`:
- `home/page.tsx`
- Outras páginas que precisam de diagnóstico completo

**Solução:** Manter `RequireDiagnostico` se necessário, mas remover `ProtectedRoute` e `RequireSubscription`:

```typescript
'use client'

import RequireDiagnostico from '@/components/auth/RequireDiagnostico'

export default function NutriHome() {
  return (
    <RequireDiagnostico area="nutri">
      <NutriHomeContent />
    </RequireDiagnostico>
  )
}
```

**OU** migrar validação de diagnóstico para server-side também (se possível).

---

## ✅ CHECKLIST DE MIGRAÇÃO

Para cada página migrada:

- [ ] Criada estrutura `(protected)/[pasta]/page.tsx`
- [ ] Removido `ProtectedRoute` wrapper
- [ ] Removido `RequireSubscription` wrapper (se existia)
- [ ] Removidos imports não utilizados
- [ ] Código simplificado (apenas conteúdo)
- [ ] Testado acesso sem autenticação (deve redirecionar)
- [ ] Testado acesso com perfil errado (deve redirecionar)
- [ ] Testado acesso sem assinatura (deve redirecionar)
- [ ] Testado acesso válido (deve funcionar)
- [ ] Testado refresh (F5) - deve manter sessão
- [ ] Verificado lint (sem erros)

---

## 🎯 ESTRATÉGIA DE TRABALHO PARALELO

### ✅ Vantagens:
- Trabalho mais rápido
- Menos espera entre migrações
- Testes independentes

### ⚠️ Cuidados:

1. **Não migrar a mesma página em dois chats**
   - Use este guia para dividir páginas
   - Exemplo: Chat 1 migra `home`, Chat 2 migra `clientes`

2. **Commits separados por área**
   - Commits claros: `feat: migra home nutri para (protected)`
   - Evitar conflitos no mesmo arquivo

3. **Testar após cada migração**
   - Não esperar migrar tudo para testar
   - Testar página por página

4. **Comunicar progresso**
   - Atualizar este documento com status
   - Marcar páginas migradas com ✅

---

## 📝 TEMPLATE DE MIGRAÇÃO (Copiar e Colar)

```typescript
// src/app/pt/[area]/(protected)/[página]/page.tsx

'use client'

// Remover: import ProtectedRoute
// Remover: import RequireSubscription
// Manter: outros imports necessários

export default function [NomeComponente]() {
  // Conteúdo direto, sem wrappers
  return <[NomeComponente]Content />
}

function [NomeComponente]Content() {
  // ... conteúdo original da página
}
```

---

## 🧪 TESTES PÓS-MIGRAÇÃO

### Teste 1: Acesso Não Autenticado
```
1. Abrir aba anônima
2. Acessar /pt/nutri/home
3. ✅ Deve redirecionar para /pt/nutri/login
```

### Teste 2: Perfil Errado
```
1. Login como wellness
2. Acessar /pt/nutri/home
3. ✅ Deve redirecionar para área correta
```

### Teste 3: Sem Assinatura
```
1. Login como nutri sem assinatura
2. Acessar /pt/nutri/home
3. ✅ Deve redirecionar para checkout
```

### Teste 4: Acesso Válido
```
1. Login como nutri com assinatura
2. Acessar /pt/nutri/home
3. ✅ Deve carregar página normalmente
```

### Teste 5: Refresh (F5)
```
1. Login válido
2. Acessar página migrada
3. Pressionar F5
4. ✅ Deve manter sessão e não redirecionar
```

---

## 📚 REFERÊNCIAS

- **Wellness migrado:** `src/app/pt/wellness/(protected)/`
- **Layout exemplo:** `src/app/pt/wellness/(protected)/layout.tsx`
- **Documentação completa:** `docs/MIGRACAO-WELLNESS-COMPLETA.md`

---

**Última atualização:** Janeiro 2025  
**Status:** Guia criado para migração paralela Nutri + Coach
