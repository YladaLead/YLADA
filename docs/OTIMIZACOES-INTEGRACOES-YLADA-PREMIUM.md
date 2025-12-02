# ⚡ Otimizações de Integrações - YLADA Premium

Este documento lista otimizações identificadas e recomendações para manter o código limpo e escalável.

---

## 🔍 Análise de Componentes Core

### ✅ **Pontos Fortes Identificados**

1. **Componentização Adequada**
   - Componentes bem separados por responsabilidade
   - Reutilização adequada de componentes shared
   - Props bem definidas com TypeScript

2. **Hooks Customizados**
   - `useJornadaProgress` centraliza lógica de progresso
   - Evita duplicação de código
   - Facilita manutenção

3. **Utilitários Centralizados**
   - `jornada-access.ts` - Lógica de bloqueio centralizada
   - `jornada-pilares-mapping.ts` - Mapeamento estático
   - Fácil de manter e expandir

---

## 🚨 Otimizações Recomendadas

### **1. Modal Base Component (PRIORIDADE MÉDIA)**

**Problema Identificado:**
- `BlockedDayModal` e `AttachToolModal` têm estrutura similar
- Código duplicado para backdrop, animações, estrutura base

**Solução:**
Criar componente base `BaseModal`:

```typescript
// src/components/shared/BaseModal.tsx
interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}
```

**Benefícios:**
- ✅ Reduz duplicação de código
- ✅ Consistência visual entre modais
- ✅ Facilita manutenção de animações
- ✅ Padroniza comportamento (fechar ao clicar backdrop, ESC, etc.)

**Impacto:** Baixo risco, alto benefício

---

### **2. Cache de Progresso da Jornada (PRIORIDADE BAIXA)**

**Problema Identificado:**
- `useJornadaProgress` faz fetch toda vez que componente monta
- Múltiplos componentes podem fazer fetch simultâneo
- Dados raramente mudam durante uma sessão

**Solução:**
Adicionar cache em `sessionStorage`:

```typescript
// Em useJornadaProgress.ts
const CACHE_KEY = 'ylada_jornada_progress'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Verificar cache antes de fetch
const cached = sessionStorage.getItem(CACHE_KEY)
if (cached) {
  const { data, timestamp } = JSON.parse(cached)
  if (Date.now() - timestamp < CACHE_DURATION) {
    setProgress(data)
    setLoading(false)
    return
  }
}
```

**Benefícios:**
- ✅ Reduz chamadas de API
- ✅ Melhora performance em navegação entre páginas
- ✅ Mantém dados atualizados (cache de 5min)

**Impacto:** Baixo risco, médio benefício

---

### **3. Lazy Loading de Modais (PRIORIDADE BAIXA)**

**Problema Identificado:**
- `AttachToolModal` carrega lista de clientes mesmo quando modal não está aberto
- `BlockedDayModal` é renderizado mesmo quando não necessário

**Solução:**
Usar `dynamic import` do Next.js:

```typescript
// Em vez de import direto
const AttachToolModal = dynamic(() => import('@/components/gsal/AttachToolModal'), {
  ssr: false,
  loading: () => <div>Carregando...</div>
})
```

**Benefícios:**
- ✅ Reduz bundle inicial
- ✅ Carrega apenas quando necessário
- ✅ Melhora tempo de carregamento inicial

**Impacto:** Baixo risco, médio benefício

---

### **4. Debounce em Busca de Clientes (PRIORIDADE BAIXA)**

**Problema Identificado:**
- `AttachToolModal` carrega todos os clientes de uma vez
- Se houver muitos clientes, pode ser lento

**Solução:**
Adicionar busca com debounce e paginação:

```typescript
// Adicionar busca no modal
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 300)

// Filtrar clientes localmente ou buscar na API
const filteredClients = clients.filter(client =>
  client.name.toLowerCase().includes(debouncedSearch.toLowerCase())
)
```

**Benefícios:**
- ✅ Melhor UX com muitos clientes
- ✅ Busca mais rápida
- ✅ Reduz carga no servidor

**Impacto:** Baixo risco, médio benefício (só necessário se houver muitos clientes)

---

### **5. Memoização de Cálculos (PRIORIDADE BAIXA)**

**Problema Identificado:**
- `JornadaDaysChips` recalcula `canAccessDay` para cada chip
- `DayCard` recalcula status para cada dia

**Solução:**
Usar `useMemo` para cálculos pesados:

```typescript
// Em JornadaDaysChips
const daysStatus = useMemo(() => {
  return days.map(day => ({
    day,
    canAccess: canAccessDay(day, progress),
    isLocked: isDayLocked(day, progress)
  }))
}, [days, progress])
```

**Benefícios:**
- ✅ Reduz recálculos desnecessários
- ✅ Melhora performance em listas grandes
- ✅ Evita re-renders

**Impacto:** Baixo risco, baixo benefício (só necessário se houver muitos dias)

---

## 📋 Checklist de Otimizações por Prioridade

### **PRIORIDADE ALTA** (Fazer Agora)
- [ ] Nenhuma identificada - código está bem estruturado

### **PRIORIDADE MÉDIA** (Fazer em Próxima Sprint)
- [ ] Criar `BaseModal` component
- [ ] Adicionar cache de progresso da Jornada

### **PRIORIDADE BAIXA** (Fazer Quando Necessário)
- [ ] Lazy loading de modais
- [ ] Debounce em busca de clientes (se necessário)
- [ ] Memoização de cálculos (se necessário)

---

## 🎯 Recomendações para Futuras Implementações

### **1. Novos Pilares**

Ao criar novos Pilares, seguir este padrão:

```tsx
// 1. Adicionar ao mapeamento
// src/utils/jornada-pilares-mapping.ts
export const jornadaPilaresMapping: Record<number, number[]> = {
  // ... existentes
  6: [31, 32, 33] // Novo Pilar 6
}

// 2. Adicionar conteúdo em pilaresConfig
// src/types/pilares.ts
export const pilaresConfig = [
  // ... existentes
  {
    id: '6',
    numero: 6,
    nome: 'Novo Pilar',
    // ...
  }
]

// 3. Usar componentes core
import VoltarJornadaButton from '@/components/jornada/VoltarJornadaButton'
import JornadaDaysChips from '@/components/jornada/JornadaDaysChips'
```

### **2. Novos Dias da Jornada**

Ao adicionar novos dias:

```tsx
// 1. Atualizar mapeamento se necessário
// src/utils/jornada-pilares-mapping.ts

// 2. Usar componentes existentes
import DayCard from '@/components/jornada/DayCard'
import BlockedDayModal from '@/components/jornada/BlockedDayModal'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'
```

### **3. Novas Ferramentas**

Ao criar novas ferramentas:

```tsx
// 1. Usar estrutura de card existente
// 2. Adicionar botão "Abrir no GSAL" se aplicável
{(ferramenta.tipo === 'fluxos' || ferramenta.tipo === 'quizzes') && (
  <Link href={`/pt/nutri/gsal?attachTool=${ferramenta.id}`}>
    📊 Abrir no GSAL
  </Link>
)}
```

### **4. Integrações com Gestão Avançada**

Ao criar novas integrações:

```tsx
// 1. Usar PageLayout e Section
import PageLayout from '@/components/shared/PageLayout'
import Section from '@/components/shared/Section'

// 2. Usar componentes de dados
import KPICard from '@/components/shared/KPICard'
import ProgressBar from '@/components/shared/ProgressBar'

// 3. Usar botões padronizados
import PrimaryButton from '@/components/shared/PrimaryButton'
import SecondaryButton from '@/components/shared/SecondaryButton'
```

---

## 🔒 Garantias de Arquitetura

### **Regras Obrigatórias**

1. **Sempre usar componentes core** quando disponíveis
2. **Não criar componentes duplicados** - verificar `docs/CORE-COMPONENTS-YLADA-PREMIUM.md` primeiro
3. **Seguir padrões de nomenclatura** - `PascalCase` para componentes, `camelCase` para funções
4. **Documentar novos componentes** - adicionar em `CORE-COMPONENTS-YLADA-PREMIUM.md`
5. **Usar TypeScript** - todas as props devem ter interfaces
6. **Manter responsabilidades separadas** - um componente, uma responsabilidade

### **Estrutura de Pastas**

```
src/
├── components/
│   ├── shared/          # Componentes genéricos reutilizáveis
│   ├── jornada/        # Componentes específicos da Jornada
│   ├── gsal/           # Componentes específicos do GSAL
│   ├── formacao/       # Componentes de formação
│   └── nutri/          # Componentes específicos Nutri
├── hooks/              # Hooks customizados
├── utils/               # Funções utilitárias
└── types/               # TypeScript types/interfaces
```

---

## 📊 Métricas de Qualidade

### **Indicadores de Código Limpo**

- ✅ **Duplicação**: < 5% de código duplicado
- ✅ **Componentização**: > 80% de componentes reutilizáveis
- ✅ **TypeScript**: 100% de cobertura de tipos
- ✅ **Documentação**: Todos os componentes core documentados

### **Indicadores de Performance**

- ✅ **First Contentful Paint**: < 1.5s
- ✅ **Time to Interactive**: < 3s
- ✅ **Bundle Size**: < 500KB (gzipped)
- ✅ **API Calls**: < 5 por página inicial

---

## 🚀 Próximos Passos

1. **Implementar BaseModal** (quando houver 3+ modais similares)
2. **Adicionar cache de progresso** (se houver queixas de lentidão)
3. **Monitorar performance** (usar Lighthouse/Web Vitals)
4. **Revisar periodicamente** este documento (a cada 3 meses)

---

**Última atualização:** 2025-01-XX
**Versão:** 1.0.0

