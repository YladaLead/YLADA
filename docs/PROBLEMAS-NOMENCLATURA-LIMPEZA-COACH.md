# 🔍 PROBLEMAS DE NOMENCLATURA E LIMPEZA - ÁREA COACH

**Data:** 2025-01-21  
**Objetivo:** Detalhar todos os problemas encontrados com exemplos concretos

---

## 🔴 PROBLEMAS DE NOMENCLATURA

### 1. **Funções Exportadas com Nome "Nutri"**

**Problema:** Funções principais ainda têm nomes da área Nutri, causando confusão no código.

#### Arquivos Afetados (13 funções):

| Arquivo | Função Atual | Deveria Ser |
|---------|--------------|-------------|
| `home/page.tsx` | `NutriHome()` | `CoachHome()` |
| `page.tsx` | `NutriLandingPage()` | `CoachLandingPage()` |
| `configuracao/page.tsx` | `NutriConfiguracaoPage()` | `CoachConfiguracaoPage()` |
| `relatorios/page.tsx` | `NutriRelatorios()` | `CoachRelatorios()` |
| `configuracoes/page.tsx` | `NutriConfiguracoes()` | `CoachConfiguracoes()` |
| `agenda/page.tsx` | `NutriAgenda()` | `CoachAgenda()` |
| `relatorios-gestao/page.tsx` | `RelatoriosGestaoNutri()` | `RelatoriosGestaoCoach()` |
| `clientes/page.tsx` | `ClientesNutri()` | `ClientesCoach()` |
| `leads/page.tsx` | `NutriLeads()` | `CoachLeads()` |
| `cursos/page.tsx` | `NutriCursos()` | `CoachCursos()` |
| `acompanhamento/page.tsx` | `NutriAcompanhamento()` | `CoachAcompanhamento()` |
| `formularios/[id]/page.tsx` | `EditarFormularioNutri()` | `EditarFormularioCoach()` |
| `formularios/novo/page.tsx` | `NovoFormularioNutri()` | `NovoFormularioCoach()` |

**Exemplo Concreto:**
```typescript
// ❌ ERRADO (atual)
export default function NutriHome() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <NutriHomeContent />
    </ProtectedRoute>
  )
}

// ✅ CORRETO (deveria ser)
export default function CoachHome() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <CoachHomeContent />
    </ProtectedRoute>
  )
}
```

---

### 2. **Funções Internas com Nome "Nutri"**

**Problema:** Funções de conteúdo também têm nomes da área Nutri.

#### Arquivos Afetados (10 funções):

| Arquivo | Função Atual | Deveria Ser |
|---------|--------------|-------------|
| `home/page.tsx` | `NutriHomeContent()` | `CoachHomeContent()` |
| `configuracao/page.tsx` | `NutriConfiguracaoContent()` | `CoachConfiguracaoContent()` |
| `agenda/page.tsx` | `NutriAgendaContent()` | `CoachAgendaContent()` |
| `relatorios-gestao/page.tsx` | `RelatoriosGestaoNutriContent()` | `RelatoriosGestaoCoachContent()` |
| `clientes/page.tsx` | `ClientesNutriContent()` | `ClientesCoachContent()` |
| `leads/page.tsx` | `NutriLeadsContent()` | `CoachLeadsContent()` |
| `cursos/page.tsx` | `NutriCursosContent()` | `CoachCursosContent()` |
| `acompanhamento/page.tsx` | `NutriAcompanhamentoContent()` | `CoachAcompanhamentoContent()` |
| `formularios/[id]/page.tsx` | `EditarFormularioNutriContent()` | `EditarFormularioCoachContent()` |
| `formularios/novo/page.tsx` | `NovoFormularioNutriContent()` | `NovoFormularioNutriContent()` |

**Exemplo Concreto:**
```typescript
// ❌ ERRADO (atual)
function NutriHomeContent() {
  const { user, userProfile, loading } = useAuth()
  // ... código ...
}

// ✅ CORRETO (deveria ser)
function CoachHomeContent() {
  const { user, userProfile, loading } = useAuth()
  // ... código ...
}
```

---

### 3. **Parâmetros de API Incorretos**

**Problema:** Chamadas de API usando `profession=nutri` em vez de `profession=coach`.

#### Arquivos Afetados (2 arquivos):

**1. `ferramentas/page.tsx` (linha 46):**
```typescript
// ❌ ERRADO (atual)
const response = await fetch(
  `/api/coach/ferramentas?profession=nutri`,
  {
    credentials: 'include'
  }
)

// ✅ CORRETO (deveria ser)
const response = await fetch(
  `/api/coach/ferramentas?profession=coach`,
  {
    credentials: 'include'
  }
)
```

**2. `ferramentas/[id]/editar/page.tsx` (linha 200):**
```typescript
// ❌ ERRADO (atual)
const response = await fetch(
  `/api/coach/ferramentas?id=${toolId}&profession=nutri`,
  {
    credentials: 'include'
  }
)

// ✅ CORRETO (deveria ser)
const response = await fetch(
  `/api/coach/ferramentas?id=${toolId}&profession=coach`,
  {
    credentials: 'include'
  }
)
```

**Impacto:** Pode retornar dados incorretos ou causar erros, pois a API pode filtrar por `profession=nutri` quando deveria filtrar por `profession=coach`.

---

### 4. **Mensagens de Log com "Nutri"**

**Problema:** Mensagens de console.log/error ainda mencionam "Nutri" em vez de "Coach".

#### Arquivo Afetado: `configuracao/page.tsx`

**Linha 116:**
```typescript
// ❌ ERRADO (atual)
console.log('🔄 carregarPerfil: Iniciando carregamento do perfil Nutri...')

// ✅ CORRETO (deveria ser)
console.log('🔄 carregarPerfil: Iniciando carregamento do perfil Coach...')
```

**Linha 164:**
```typescript
// ❌ ERRADO (atual)
console.error('❌ carregarPerfil: Erro ao carregar perfil Nutri:', error)

// ✅ CORRETO (deveria ser)
console.error('❌ carregarPerfil: Erro ao carregar perfil Coach:', error)
```

**Linha 249:**
```typescript
// ❌ ERRADO (atual)
console.error('❌ Erro ao salvar perfil Nutri:', { ... })

// ✅ CORRETO (deveria ser)
console.error('❌ Erro ao salvar perfil Coach:', { ... })
```

**Linha 257:**
```typescript
// ❌ ERRADO (atual)
console.log('✅ Perfil Nutri salvo com sucesso:', responseData)

// ✅ CORRETO (deveria ser)
console.log('✅ Perfil Coach salvo com sucesso:', responseData)
```

**Linha 269:**
```typescript
// ❌ ERRADO (atual)
console.error('❌ Erro técnico ao salvar perfil Nutri:', error)

// ✅ CORRETO (deveria ser)
console.error('❌ Erro técnico ao salvar perfil Coach:', error)
```

---

### 5. **Texto em Placeholder Não Adaptado**

**Problema:** Texto de exemplo ainda menciona "nutricionista".

#### Arquivo Afetado: `quiz-personalizado/page.tsx` (linha 623)

```typescript
// ❌ ERRADO (atual)
placeholder="Ex: Descubra seu perfil nutricional e receba recomendações personalizadas para uma vida mais saudável."

// ✅ CORRETO (deveria ser)
placeholder="Ex: Descubra seu perfil de bem-estar e receba recomendações personalizadas para uma vida mais saudável."
```

---

## 🧹 NECESSIDADES DE LIMPEZA

### 1. **Rotas Duplicadas**

**Problema:** Existe uma rota duplicada que pode causar confusão.

#### Rota Duplicada:
- ✅ `src/app/pt/coach/portal/[slug]/page.tsx` (rota correta)
- ❌ `src/app/pt/coach/portal/portal/[slug]/page.tsx` (duplicada - remover)

**Ação:** Deletar o arquivo `portal/portal/[slug]/page.tsx`

---

### 2. **Pastas Vazias de Cursos**

**Problema:** Estrutura de pastas criada mas sem conteúdo, pode confundir desenvolvedores.

#### Pastas Frontend Vazias:
- `src/app/pt/coach/cursos/biblioteca/` (vazia)
- `src/app/pt/coach/cursos/meus-cursos/` (vazia)
- `src/app/pt/coach/cursos/microcursos/` (vazia)
- `src/app/pt/coach/cursos/tutoriais/` (vazia)

#### Pastas API Vazias:
- `src/app/api/coach/cursos/biblioteca/` (vazia)
- `src/app/api/coach/cursos/microcursos/` (vazia)
- `src/app/api/coach/cursos/tutoriais/` (vazia)

**Ação:** 
- **Opção 1:** Remover pastas se não serão utilizadas
- **Opção 2:** Criar páginas placeholder se serão implementadas no futuro
- **Opção 3:** Documentar plano de implementação

---

### 3. **Console.logs Excessivos**

**Problema:** 128 console.log/warn/error encontrados em 29 arquivos, impactando performance em produção.

#### Estatísticas:
- **Total de logs:** 128
- **Arquivos afetados:** 29
- **Média por arquivo:** ~4.4 logs

#### Arquivos com Mais Logs:
1. `configuracao/page.tsx` - ~13 logs
2. `ferramentas/nova/page.tsx` - ~18 logs
3. `ferramentas/[id]/editar/page.tsx` - ~8 logs
4. `clientes/[id]/page.tsx` - ~17 logs
5. `agenda/page.tsx` - ~12 logs

**Exemplos de Logs Desnecessários:**
```typescript
// ❌ Logs de debug que podem ser removidos
console.log('🔄 carregarPerfil: Iniciando...')
console.log('📡 Resposta recebida:', data)
console.log('✅ Dados carregados com sucesso')

// ✅ Manter apenas logs de erro críticos
console.error('❌ Erro crítico ao carregar dados:', error)
```

**Ação:**
1. Remover logs de debug desnecessários
2. Manter apenas logs de erro críticos
3. Considerar usar variável de ambiente para ativar/desativar logs em desenvolvimento

**Exemplo de Implementação:**
```typescript
// Criar utilitário
const isDev = process.env.NODE_ENV === 'development'

// Usar condicionalmente
if (isDev) {
  console.log('🔄 Debug info:', data)
}
```

---

### 4. **Imports Não Utilizados (Verificar)**

**Problema:** Possíveis imports não utilizados que aumentam o bundle size.

**Ação:** Executar análise com ferramentas como:
- `eslint-plugin-unused-imports`
- `ts-prune` (TypeScript)
- Análise manual

**Exemplo:**
```typescript
// ❌ Possível import não utilizado
import { useState, useEffect, useMemo, useCallback } from 'react'
// Se useMemo e useCallback não são usados, remover

// ✅ Apenas imports utilizados
import { useState, useEffect } from 'react'
```

---

### 5. **Código Duplicado (Verificar)**

**Problema:** Possível duplicação de lógica entre Nutri e Coach.

**Ação:** Identificar lógica comum e criar componentes/composables compartilhados.

**Exemplo:**
```typescript
// ❌ Código duplicado em Nutri e Coach
function NutriHomeContent() {
  const carregarDados = async () => {
    // ... lógica idêntica ...
  }
}

function CoachHomeContent() {
  const carregarDados = async () => {
    // ... mesma lógica duplicada ...
  }
}

// ✅ Criar hook compartilhado
function useDashboardData(area: 'nutri' | 'coach') {
  const carregarDados = async () => {
    // ... lógica compartilhada ...
  }
  return { carregarDados }
}
```

---

## 📊 RESUMO POR PRIORIDADE

### 🔴 **PRIORIDADE CRÍTICA** (Corrigir Primeiro)

1. **Renomear 13 funções exportadas** (`Nutri*` → `Coach*`)
2. **Renomear 10 funções internas** (`Nutri*Content` → `Coach*Content`)
3. **Corrigir 2 parâmetros de API** (`profession=nutri` → `profession=coach`)

**Tempo estimado:** ~30 minutos  
**Impacto:** Alto - pode causar confusão e bugs

---

### ⚠️ **PRIORIDADE MÉDIA** (Corrigir Depois)

4. **Atualizar 5 mensagens de log** ("Nutri" → "Coach")
5. **Remover 1 rota duplicada** (`portal/portal/[slug]`)
6. **Adaptar 1 placeholder** (texto de quiz-personalizado)

**Tempo estimado:** ~20 minutos  
**Impacto:** Médio - melhora clareza e consistência

---

### 🟢 **PRIORIDADE BAIXA** (Otimização)

7. **Limpar 128 console.logs** (remover logs de debug)
8. **Remover ou documentar 7 pastas vazias** (cursos)
9. **Verificar imports não utilizados** (análise)
10. **Identificar código duplicado** (refatoração)

**Tempo estimado:** ~2-3 horas  
**Impacto:** Baixo - melhora performance e manutenibilidade

---

## ✅ CHECKLIST DE CORREÇÃO

### Nomenclatura (Crítico)
- [ ] `home/page.tsx` - Renomear `NutriHome` → `CoachHome`
- [ ] `home/page.tsx` - Renomear `NutriHomeContent` → `CoachHomeContent`
- [ ] `page.tsx` - Renomear `NutriLandingPage` → `CoachLandingPage`
- [ ] `configuracao/page.tsx` - Renomear `NutriConfiguracaoPage` → `CoachConfiguracaoPage`
- [ ] `configuracao/page.tsx` - Renomear `NutriConfiguracaoContent` → `CoachConfiguracaoContent`
- [ ] `relatorios/page.tsx` - Renomear `NutriRelatorios` → `CoachRelatorios`
- [ ] `configuracoes/page.tsx` - Renomear `NutriConfiguracoes` → `CoachConfiguracoes`
- [ ] `agenda/page.tsx` - Renomear `NutriAgenda` → `CoachAgenda`
- [ ] `agenda/page.tsx` - Renomear `NutriAgendaContent` → `CoachAgendaContent`
- [ ] `relatorios-gestao/page.tsx` - Renomear `RelatoriosGestaoNutri` → `RelatoriosGestaoCoach`
- [ ] `relatorios-gestao/page.tsx` - Renomear `RelatoriosGestaoNutriContent` → `RelatoriosGestaoCoachContent`
- [ ] `clientes/page.tsx` - Renomear `ClientesNutri` → `ClientesCoach`
- [ ] `clientes/page.tsx` - Renomear `ClientesNutriContent` → `ClientesCoachContent`
- [ ] `leads/page.tsx` - Renomear `NutriLeads` → `CoachLeads`
- [ ] `leads/page.tsx` - Renomear `NutriLeadsContent` → `CoachLeadsContent`
- [ ] `cursos/page.tsx` - Renomear `NutriCursos` → `CoachCursos`
- [ ] `cursos/page.tsx` - Renomear `NutriCursosContent` → `CoachCursosContent`
- [ ] `acompanhamento/page.tsx` - Renomear `NutriAcompanhamento` → `CoachAcompanhamento`
- [ ] `acompanhamento/page.tsx` - Renomear `NutriAcompanhamentoContent` → `CoachAcompanhamentoContent`
- [ ] `formularios/[id]/page.tsx` - Renomear `EditarFormularioNutri` → `EditarFormularioCoach`
- [ ] `formularios/[id]/page.tsx` - Renomear `EditarFormularioNutriContent` → `EditarFormularioCoachContent`
- [ ] `formularios/novo/page.tsx` - Renomear `NovoFormularioNutri` → `NovoFormularioCoach`
- [ ] `formularios/novo/page.tsx` - Renomear `NovoFormularioNutriContent` → `NovoFormularioCoachContent`

### Parâmetros de API (Crítico)
- [ ] `ferramentas/page.tsx` (linha 46) - Corrigir `profession=nutri` → `profession=coach`
- [ ] `ferramentas/[id]/editar/page.tsx` (linha 200) - Corrigir `profession=nutri` → `profession=coach`

### Logs e Textos (Médio)
- [ ] `configuracao/page.tsx` - Atualizar 5 mensagens de log ("Nutri" → "Coach")
- [ ] `quiz-personalizado/page.tsx` - Adaptar placeholder

### Limpeza (Baixo)
- [ ] Remover `portal/portal/[slug]/page.tsx` (rota duplicada)
- [ ] Remover ou documentar pastas vazias de cursos (7 pastas)
- [ ] Limpar console.logs desnecessários (128 logs em 29 arquivos)
- [ ] Verificar imports não utilizados
- [ ] Identificar código duplicado

---

## 🎯 CONCLUSÃO

**Total de Problemas:** 25 itens
- **Críticos:** 5 (nomenclatura e parâmetros)
- **Médios:** 3 (logs e textos)
- **Baixos:** 17 (limpeza e otimização)

**Tempo Total Estimado:**
- **Crítico:** 30 minutos
- **Médio:** 20 minutos
- **Baixo:** 2-3 horas
- **Total:** ~3-4 horas

**Recomendação:** Começar pelos itens críticos, depois médios, e deixar limpeza para quando houver tempo.

---

**Documento gerado em:** 2025-01-21

