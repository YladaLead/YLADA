# 🏗️ Guia de Arquitetura - Futuras Implementações YLADA Premium

Este guia garante que todas as futuras implementações sigam os padrões estabelecidos e mantenham a arquitetura limpa e escalável.

---

## 📐 Princípios Fundamentais

### **1. Componentização Primeiro**
- ✅ Sempre verificar se componente core existe antes de criar novo
- ✅ Reutilizar componentes shared sempre que possível
- ✅ Criar componentes específicos apenas quando necessário

### **2. Consistência Visual**
- ✅ Usar `PageLayout` e `Section` para estrutura
- ✅ Usar `PrimaryButton` e `SecondaryButton` para ações
- ✅ Usar `Card` para agrupar conteúdo
- ✅ Seguir paleta de cores YLADA (azul/índigo/roxo)

### **3. TypeScript Obrigatório**
- ✅ Todas as props devem ter interfaces
- ✅ Tipos explícitos, evitar `any`
- ✅ Interfaces em arquivos `types/` quando compartilhadas

### **4. Performance Consciente**
- ✅ Lazy loading para componentes pesados
- ✅ Memoização quando necessário
- ✅ Cache quando apropriado
- ✅ Debounce em buscas/filtros

---

## 🎯 Padrões por Tipo de Implementação

### **Novos Pilares**

#### Checklist Obrigatório:
- [ ] Adicionar ao `jornada-pilares-mapping.ts`
- [ ] Adicionar conteúdo em `pilaresConfig` (`types/pilares.ts`)
- [ ] Usar `VoltarJornadaButton` no topo
- [ ] Usar `JornadaDaysChips` para mostrar dias relacionados
- [ ] Usar `PilarSecao` para renderizar seções
- [ ] Usar `PilarAnotacao` para campos de anotação
- [ ] Seguir estrutura de página de Pilar existente

#### Template:
```tsx
'use client'

import { useParams, useSearchParams } from 'next/navigation'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import VoltarJornadaButton from '@/components/jornada/VoltarJornadaButton'
import JornadaDaysChips from '@/components/jornada/JornadaDaysChips'
import PilarSecao from '@/components/formacao/PilarSecao'
import { pilaresConfig } from '@/types/pilares'
import { getJornadaDaysForPilar } from '@/utils/jornada-pilares-mapping'

export default function PilarPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const pilarId = params.id as string
  const jornadaDay = searchParams.get('fromDay')
  const pilar = pilaresConfig.find(p => p.id === pilarId)
  const jornadaDays = getJornadaDaysForPilar(parseInt(pilarId))

  if (!pilar) {
    // Error state
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VoltarJornadaButton />
        
        {jornadaDay && (
          <div className="mb-4 bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-700 mb-2">
              Este conteúdo faz parte do <strong>Dia {jornadaDay}</strong> da Jornada.
            </p>
            <Link href={`/pt/nutri/metodo/jornada/dia/${jornadaDay}`}>
              ← Voltar para Dia {jornadaDay}
            </Link>
          </div>
        )}

        {jornadaDays.length > 0 && (
          <JornadaDaysChips days={jornadaDays} pilarId={parseInt(pilarId)} />
        )}

        {/* Conteúdo do Pilar usando PilarSecao */}
        {pilar.secoes.map((secao, index) => (
          <PilarSecao key={index} secao={secao} pilarId={pilarId} />
        ))}
      </div>
    </div>
  )
}
```

---

### **Novos Dias da Jornada**

#### Checklist Obrigatório:
- [ ] Adicionar ao `journey_days` no Supabase
- [ ] Atualizar `jornada-pilares-mapping.ts` se necessário
- [ ] Usar `DayCard` no grid de dias
- [ ] Usar `BlockedDayModal` para dias bloqueados
- [ ] Usar `AcaoPraticaCard` para ação prática
- [ ] Usar `ChecklistItem` para checklist
- [ ] Usar `ReflexaoDia` para anotações
- [ ] Verificar bloqueio com `useJornadaProgress`

#### Template:
```tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'
import { canAccessDay } from '@/utils/jornada-access'
import BlockedDayModal from '@/components/jornada/BlockedDayModal'
import AcaoPraticaCard from '@/components/formacao/AcaoPraticaCard'
import ChecklistItem from '@/components/formacao/ChecklistItem'
import ReflexaoDia from '@/components/formacao/ReflexaoDia'

export default function JornadaDiaPage() {
  const params = useParams()
  const router = useRouter()
  const { progress } = useJornadaProgress()
  const dayNumber = parseInt(params.numero as string)
  const [showBlockedModal, setShowBlockedModal] = useState(false)

  // Verificar acesso
  useEffect(() => {
    if (!canAccessDay(dayNumber, progress)) {
      setShowBlockedModal(true)
    }
  }, [dayNumber, progress])

  if (showBlockedModal) {
    return (
      <BlockedDayModal
        isOpen={true}
        onClose={() => router.push('/pt/nutri/metodo/jornada')}
        blockedDay={dayNumber}
        currentDay={progress?.current_day || 1}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Conteúdo do dia */}
        <AcaoPraticaCard dayNumber={dayNumber} ... />
        {/* Checklist, Reflexão, etc. */}
      </div>
    </div>
  )
}
```

---

### **Novas Ferramentas**

#### Checklist Obrigatório:
- [ ] Usar estrutura de card existente
- [ ] Adicionar botão "Abrir no GSAL" se aplicável (fluxos/quizzes)
- [ ] Seguir padrão de filtros existente
- [ ] Usar componentes shared para ações

#### Template:
```tsx
// No card da ferramenta
<div className="flex items-center space-x-2">
  {/* Botão Abrir no GSAL - apenas para fluxos e quizzes */}
  {(ferramenta.tipo === 'fluxos' || ferramenta.tipo === 'quizzes') && (
    <Link
      href={`/pt/nutri/gsal?attachTool=${ferramenta.id}`}
      className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
    >
      <span>📊</span>
      <span>Abrir no GSAL</span>
    </Link>
  )}
  {/* Outros botões */}
</div>
```

---

### **Integrações com Gestão Avançada**

#### Checklist Obrigatório:
- [ ] Usar `PageLayout` e `Section`
- [ ] Usar `KPICard` para métricas
- [ ] Usar `ProgressBar` para progresso
- [ ] Usar `PrimaryButton` e `SecondaryButton`
- [ ] Seguir estrutura do GSAL existente

#### Template:
```tsx
'use client'

import PageLayout from '@/components/shared/PageLayout'
import Section from '@/components/shared/Section'
import Card from '@/components/shared/Card'
import KPICard from '@/components/shared/KPICard'
import ProgressBar from '@/components/shared/ProgressBar'
import PrimaryButton from '@/components/shared/PrimaryButton'

export default function NovaFuncionalidadePage() {
  return (
    <PageLayout>
      <Section title="Título" subtitle="Subtítulo">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <KPICard icon="👥" value={100} label="Total" />
          <KPICard icon="✅" value={75} label="Concluídos" />
          <KPICard icon="📊" value="85%" label="Taxa" />
        </div>

        {/* Progresso */}
        <Card className="mb-6">
          <ProgressBar progress={75} showPercentage />
        </Card>

        {/* Ações */}
        <PrimaryButton onClick={handleAction}>
          Ação Principal
        </PrimaryButton>
      </Section>
    </PageLayout>
  )
}
```

---

## 🔍 Validação Antes de Commit

### **Checklist de Qualidade**

Antes de fazer commit, verificar:

- [ ] Componente está documentado em `CORE-COMPONENTS-YLADA-PREMIUM.md`?
- [ ] Usa componentes core quando disponíveis?
- [ ] Segue padrões de nomenclatura?
- [ ] Tem TypeScript com interfaces claras?
- [ ] É responsivo (mobile-first)?
- [ ] Tem tratamento de erros?
- [ ] Tem loading states?
- [ ] Não duplica lógica existente?
- [ ] Performance adequada (sem re-renders desnecessários)?
- [ ] Acessibilidade básica (aria-labels, etc.)?

---

## 📚 Referências Rápidas

### **Componentes Core**
- Ver: `docs/CORE-COMPONENTS-YLADA-PREMIUM.md`

### **Otimizações**
- Ver: `docs/OTIMIZACOES-INTEGRACOES-YLADA-PREMIUM.md`

### **Arquitetura Técnica**
- Ver: `docs/ARQUITETURA-TECNICA-YLADA-PREMIUM.md`

---

## 🚨 Anti-Padrões (NÃO FAZER)

### ❌ **NÃO Criar Componentes Duplicados**
```tsx
// ❌ ERRADO - Criar novo componente similar
const MeuModal = () => { /* ... */ }

// ✅ CORRETO - Usar BaseModal ou componente existente
import BaseModal from '@/components/shared/BaseModal'
```

### ❌ **NÃO Ignorar Componentes Core**
```tsx
// ❌ ERRADO - Criar botão customizado
<button className="bg-blue-600...">Salvar</button>

// ✅ CORRETO - Usar PrimaryButton
<PrimaryButton onClick={handleSave}>Salvar</PrimaryButton>
```

### ❌ **NÃO Fazer Fetch Direto Sem Hook**
```tsx
// ❌ ERRADO - Fetch direto no componente
useEffect(() => {
  fetch('/api/...').then(...)
}, [])

// ✅ CORRETO - Usar hook customizado ou criar um
const { data, loading } = useCustomData()
```

### ❌ **NÃO Ignorar Bloqueios da Jornada**
```tsx
// ❌ ERRADO - Permitir acesso direto
<Link href={`/jornada/dia/${dayNumber}`}>

// ✅ CORRETO - Verificar bloqueio
const { canAccessDay } = useJornadaProgress()
if (canAccessDay(dayNumber)) {
  // Permitir acesso
}
```

---

## 🎓 Exemplos de Boas Práticas

### **Exemplo 1: Novo Pilar**
✅ Segue todos os padrões, usa componentes core, documentado

### **Exemplo 2: Novo Dia**
✅ Verifica bloqueio, usa modais, componentes padronizados

### **Exemplo 3: Nova Ferramenta**
✅ Integra com GSAL, usa botões padronizados, segue estrutura

---

**Última atualização:** 2025-01-XX
**Versão:** 1.0.0

