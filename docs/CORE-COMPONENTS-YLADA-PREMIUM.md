# 🧩 Core Components - YLADA Premium

Este documento lista todos os componentes core do YLADA Premium, suas responsabilidades, uso e padrões de implementação.

---

## 📋 Índice

1. [Componentes de Layout](#componentes-de-layout)
2. [Componentes de Navegação](#componentes-de-navegação)
3. [Componentes da Jornada](#componentes-da-jornada)
4. [Componentes do GSAL](#componentes-do-gsal)
5. [Componentes de Formação](#componentes-de-formação)
6. [Hooks Customizados](#hooks-customizados)
7. [Utilitários](#utilitários)
8. [Padrões de Uso](#padrões-de-uso)

---

## 🎨 Componentes de Layout

### `PageLayout`
**Localização:** `src/components/shared/PageLayout.tsx`

**Responsabilidade:** Wrapper principal para todas as páginas do YLADA Premium, garantindo consistência visual e responsividade.

**Props:**
```typescript
interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}
```

**Uso:**
```tsx
<PageLayout>
  <Section title="Título" subtitle="Subtítulo">
    {/* Conteúdo */}
  </Section>
</PageLayout>
```

**Quando usar:**
- ✅ Todas as páginas internas do YLADA Premium
- ✅ Páginas que precisam de layout consistente
- ❌ Não usar em modais ou componentes inline

---

### `Section`
**Localização:** `src/components/shared/Section.tsx`

**Responsabilidade:** Container para seções de conteúdo com título e subtítulo padronizados.

**Props:**
```typescript
interface SectionProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}
```

**Uso:**
```tsx
<Section title="Gestão GSAL" subtitle="Gerar, Servir, Acompanhar, Lucrar">
  {/* Conteúdo da seção */}
</Section>
```

**Quando usar:**
- ✅ Para dividir conteúdo em seções lógicas
- ✅ Quando precisa de título/subtítulo consistente
- ❌ Não usar para containers genéricos sem título

---

### `Card`
**Localização:** `src/components/shared/Card.tsx`

**Responsabilidade:** Card genérico reutilizável com padding, bordas e sombras padronizadas.

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}
```

**Uso:**
```tsx
<Card>
  <h3>Título do Card</h3>
  <p>Conteúdo...</p>
</Card>
```

**Quando usar:**
- ✅ Para agrupar conteúdo relacionado
- ✅ Cards de informação, estatísticas, etc.
- ❌ Não usar para modais ou overlays

---

## 🔘 Componentes de Botões

### `PrimaryButton`
**Localização:** `src/components/shared/PrimaryButton.tsx`

**Responsabilidade:** Botão primário padronizado (CTA principal).

**Props:**
```typescript
interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  disabled?: boolean
  fullWidth?: boolean
  className?: string
}
```

**Uso:**
```tsx
<PrimaryButton onClick={handleAction}>
  Salvar Alterações
</PrimaryButton>

<PrimaryButton href="/pt/nutri/metodo/jornada">
  Iniciar Jornada
</PrimaryButton>
```

**Quando usar:**
- ✅ Ações principais (salvar, confirmar, iniciar)
- ✅ CTAs importantes
- ❌ Não usar para ações secundárias ou destrutivas

---

### `SecondaryButton`
**Localização:** `src/components/shared/SecondaryButton.tsx`

**Responsabilidade:** Botão secundário padronizado (ações alternativas).

**Props:**
```typescript
interface SecondaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  disabled?: boolean
  fullWidth?: boolean
  className?: string
}
```

**Uso:**
```tsx
<SecondaryButton onClick={handleCancel}>
  Cancelar
</SecondaryButton>
```

**Quando usar:**
- ✅ Ações secundárias (cancelar, voltar)
- ✅ Navegação alternativa
- ❌ Não usar para ações primárias

---

## 📊 Componentes de Dados

### `KPICard`
**Localização:** `src/components/shared/KPICard.tsx`

**Responsabilidade:** Card para exibir indicadores-chave (KPIs) com ícone, valor e label.

**Props:**
```typescript
interface KPICardProps {
  icon: string | React.ReactNode
  value: string | number
  label: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}
```

**Uso:**
```tsx
<KPICard
  icon="👥"
  value={stats.clientesAtivos}
  label="Clientes Ativos"
  trend="up"
/>
```

**Quando usar:**
- ✅ Dashboard e painéis de métricas
- ✅ Estatísticas resumidas
- ❌ Não usar para dados complexos ou tabelas

---

### `ProgressBar`
**Localização:** `src/components/shared/ProgressBar.tsx`

**Responsabilidade:** Barra de progresso padronizada com porcentagem.

**Props:**
```typescript
interface ProgressBarProps {
  progress: number // 0-100
  label?: string
  showPercentage?: boolean
  color?: 'blue' | 'green' | 'purple' | 'orange'
  className?: string
}
```

**Uso:**
```tsx
<ProgressBar
  progress={75}
  label="Progresso da Jornada"
  showPercentage
/>
```

**Quando usar:**
- ✅ Progresso de jornadas, trilhas, cursos
- ✅ Completude de tarefas
- ❌ Não usar para indicadores de status (use badges)

---

## 🧭 Componentes de Navegação

### `VoltarJornadaButton`
**Localização:** `src/components/jornada/VoltarJornadaButton.tsx`

**Responsabilidade:** Botão padronizado para voltar à Jornada de 30 Dias.

**Props:**
```typescript
interface VoltarJornadaButtonProps {
  className?: string
}
```

**Uso:**
```tsx
<VoltarJornadaButton />
```

**Quando usar:**
- ✅ No topo de páginas de Pilares
- ✅ Em páginas relacionadas à Jornada
- ❌ Não usar em páginas não relacionadas à Jornada

---

## 📅 Componentes da Jornada

### `DayCard`
**Localização:** `src/components/jornada/DayCard.tsx`

**Responsabilidade:** Card individual para cada dia da Jornada com status visual (concluído, atual, bloqueado).

**Props:**
```typescript
interface DayCardProps {
  day: {
    day_number: number
    title: string
    is_completed: boolean
    is_locked?: boolean
  }
  progress: JornadaProgress | null
  currentDay: number | null
  onDayClick?: (dayNumber: number) => void
}
```

**Uso:**
```tsx
<DayCard
  day={{
    day_number: 1,
    title: "Filosofia YLADA",
    is_completed: false,
    is_locked: false
  }}
  progress={progress}
  currentDay={stats?.current_day}
/>
```

**Quando usar:**
- ✅ Grid de dias na página principal da Jornada
- ✅ Lista de dias por semana
- ❌ Não usar para outros tipos de cards

---

### `BlockedDayModal`
**Localização:** `src/components/jornada/BlockedDayModal.tsx`

**Responsabilidade:** Modal explicativo quando usuário tenta acessar dia bloqueado.

**Props:**
```typescript
interface BlockedDayModalProps {
  isOpen: boolean
  onClose: () => void
  blockedDay: number
  currentDay: number | null
}
```

**Uso:**
```tsx
<BlockedDayModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  blockedDay={dayNumber}
  currentDay={progress?.current_day || 1}
/>
```

**Quando usar:**
- ✅ Quando usuário tenta acessar dia bloqueado
- ✅ Em chips de dias bloqueados
- ❌ Não usar para outros tipos de bloqueios

---

### `JornadaDaysChips`
**Localização:** `src/components/jornada/JornadaDaysChips.tsx`

**Responsabilidade:** Exibe chips dos dias da Jornada relacionados a um Pilar.

**Props:**
```typescript
interface JornadaDaysChipsProps {
  days: number[]
  pilarId: number
}
```

**Uso:**
```tsx
<JornadaDaysChips
  days={[1, 2, 3, 4, 5, 6]}
  pilarId={1}
/>
```

**Quando usar:**
- ✅ No topo de páginas de Pilares
- ✅ Para mostrar conexão Pilar ↔ Jornada
- ❌ Não usar para outros tipos de listas

---

## 🏢 Componentes do GSAL

### `AttachToolModal`
**Localização:** `src/components/gsal/AttachToolModal.tsx`

**Responsabilidade:** Modal para anexar ferramentas a clientes no GSAL.

**Props:**
```typescript
interface AttachToolModalProps {
  isOpen: boolean
  onClose: () => void
  toolId: string
  toolName?: string
}
```

**Uso:**
```tsx
<AttachToolModal
  isOpen={!!attachToolId}
  onClose={() => setAttachToolId(null)}
  toolId={attachToolId}
  toolName="Quiz de Emagrecimento"
/>
```

**Quando usar:**
- ✅ Quando usuário clica em "Abrir no GSAL" em uma ferramenta
- ✅ Para anexar ferramentas a clientes
- ❌ Não usar para outros tipos de anexos

---

### `RotinaMinimaChecklist`
**Localização:** `src/components/nutri/RotinaMinimaChecklist.tsx`

**Responsabilidade:** Checklist diário da Rotina Mínima YLADA.

**Props:**
```typescript
// Sem props - usa localStorage internamente
```

**Uso:**
```tsx
<RotinaMinimaChecklist />
```

**Quando usar:**
- ✅ No topo da página GSAL
- ✅ Em painéis de rotina diária
- ❌ Não usar para outros tipos de checklists

---

## 📚 Componentes de Formação

### `AcaoPraticaCard`
**Localização:** `src/components/formacao/AcaoPraticaCard.tsx`

**Responsabilidade:** Card destacado para ação prática do dia na Jornada.

**Props:**
```typescript
interface AcaoPraticaCardProps {
  title: string
  description?: string
  actionType: 'pilar' | 'exercicio' | 'ferramenta'
  actionLink: string
  actionId?: string
  dayNumber?: number // Para navegação bidirecional
}
```

**Uso:**
```tsx
<AcaoPraticaCard
  title="Acessar Pilar 1"
  actionType="pilar"
  actionLink="/pt/nutri/metodo/pilares/1"
  dayNumber={1}
/>
```

**Quando usar:**
- ✅ Na página de cada dia da Jornada
- ✅ Para destacar ação prática principal
- ❌ Não usar para ações secundárias

---

### `PilarSecao`
**Localização:** `src/components/formacao/PilarSecao.tsx`

**Responsabilidade:** Renderiza uma seção dentro de um Pilar com conteúdo formatado.

**Props:**
```typescript
interface PilarSecaoProps {
  secao: PilarSecao
  pilarId: string
}
```

**Uso:**
```tsx
<PilarSecao
  secao={pilar.secoes[0]}
  pilarId={pilar.id}
/>
```

**Quando usar:**
- ✅ Para renderizar seções de Pilares
- ✅ Quando precisa de formatação consistente
- ❌ Não usar para conteúdo simples sem formatação

---

### `PilarAnotacao`
**Localização:** `src/components/formacao/PilarAnotacao.tsx`

**Responsabilidade:** Campo de anotação específico para seções de Pilares.

**Props:**
```typescript
interface PilarAnotacaoProps {
  pilarId: string
  secaoId: string
  initialContent?: string
}
```

**Uso:**
```tsx
<PilarAnotacao
  pilarId="1"
  secaoId="campo-anotacao"
/>
```

**Quando usar:**
- ✅ Em seções de Pilares que têm campo de anotação
- ✅ Para anotações específicas por seção
- ❌ Não usar para anotações gerais (use ReflexaoDia)

---

## 🎣 Hooks Customizados

### `useJornadaProgress`
**Localização:** `src/hooks/useJornadaProgress.ts`

**Responsabilidade:** Hook para gerenciar progresso da Jornada e verificar bloqueios.

**Retorno:**
```typescript
{
  progress: JornadaProgress | null
  loading: boolean
  error: string | null
  canAccessDay: (day: number) => boolean
  isDayLocked: (day: number) => boolean
  getNextAvailableDay: () => number
  refreshProgress: () => Promise<void>
}
```

**Uso:**
```tsx
const { progress, canAccessDay, refreshProgress } = useJornadaProgress()

if (canAccessDay(dayNumber)) {
  // Permitir acesso
}
```

**Quando usar:**
- ✅ Em páginas relacionadas à Jornada
- ✅ Para verificar bloqueios de dias
- ✅ Para atualizar progresso após ações
- ❌ Não usar para outros tipos de progresso

---

## 🛠️ Utilitários

### `jornada-access.ts`
**Localização:** `src/utils/jornada-access.ts`

**Funções:**
- `canAccessDay(targetDay, progress)` - Verifica se pode acessar um dia
- `isDayLocked(targetDay, progress)` - Verifica se dia está bloqueado
- `getNextAvailableDay(progress)` - Retorna próximo dia disponível

**Uso:**
```tsx
import { canAccessDay } from '@/utils/jornada-access'

if (canAccessDay(dayNumber, progress)) {
  // Permitir acesso
}
```

---

### `jornada-pilares-mapping.ts`
**Localização:** `src/utils/jornada-pilares-mapping.ts`

**Funções:**
- `getJornadaDaysForPilar(pilarId)` - Retorna dias relacionados a um Pilar
- `getPilarForJornadaDay(dayNumber)` - Retorna Pilar relacionado a um dia

**Uso:**
```tsx
import { getJornadaDaysForPilar } from '@/utils/jornada-pilares-mapping'

const days = getJornadaDaysForPilar(1) // [1, 2, 3, 4, 5, 6]
```

---

## 📐 Padrões de Uso

### Estrutura de Página Padrão

```tsx
'use client'

import PageLayout from '@/components/shared/PageLayout'
import Section from '@/components/shared/Section'
import Card from '@/components/shared/Card'
import PrimaryButton from '@/components/shared/PrimaryButton'

export default function MinhaPage() {
  return (
    <PageLayout>
      <Section title="Título" subtitle="Subtítulo">
        <Card>
          {/* Conteúdo */}
        </Card>
        
        <PrimaryButton onClick={handleAction}>
          Ação Principal
        </PrimaryButton>
      </Section>
    </PageLayout>
  )
}
```

### Estrutura de Página de Pilar

```tsx
'use client'

import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import VoltarJornadaButton from '@/components/jornada/VoltarJornadaButton'
import JornadaDaysChips from '@/components/jornada/JornadaDaysChips'
import { getJornadaDaysForPilar } from '@/utils/jornada-pilares-mapping'

export default function PilarPage() {
  const jornadaDays = getJornadaDaysForPilar(pilarId)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VoltarJornadaButton />
        <JornadaDaysChips days={jornadaDays} pilarId={pilarId} />
        {/* Conteúdo do Pilar */}
      </div>
    </div>
  )
}
```

### Estrutura de Página de Dia da Jornada

```tsx
'use client'

import { useJornadaProgress } from '@/hooks/useJornadaProgress'
import { canAccessDay } from '@/utils/jornada-access'
import BlockedDayModal from '@/components/jornada/BlockedDayModal'
import AcaoPraticaCard from '@/components/formacao/AcaoPraticaCard'

export default function JornadaDiaPage() {
  const { progress } = useJornadaProgress()
  
  if (!canAccessDay(dayNumber, progress)) {
    return <BlockedDayModal ... />
  }
  
  return (
    <div>
      <AcaoPraticaCard dayNumber={dayNumber} ... />
      {/* Conteúdo do dia */}
    </div>
  )
}
```

---

## ✅ Checklist para Novos Componentes

Ao criar novos componentes, verifique:

- [ ] Está documentado neste arquivo?
- [ ] Segue os padrões de nomenclatura?
- [ ] Usa TypeScript com interfaces claras?
- [ ] Tem props bem definidas?
- [ ] É reutilizável?
- [ ] Está em local apropriado (`shared`, `jornada`, `gsal`, etc.)?
- [ ] Tem tratamento de erros?
- [ ] É responsivo?
- [ ] Tem acessibilidade básica (aria-labels, etc.)?

---

## 🔄 Atualizações Futuras

Este documento deve ser atualizado sempre que:
- Novo componente core é criado
- Componente existente recebe mudanças significativas
- Novos padrões são estabelecidos
- Novos hooks ou utilitários são adicionados

---

**Última atualização:** 2025-01-XX
**Versão:** 1.0.0

