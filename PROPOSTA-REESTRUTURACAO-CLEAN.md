# 🏗️ PROPOSTA DE REESTRUTURAÇÃO - YLADA

## 📊 ANÁLISE DA ESTRUTURA ATUAL

### ❌ **PROBLEMAS IDENTIFICADOS**

1. **Duplicação de Código:**
   - Diagnósticos em `diagnosticos-nutri.ts` mas usados em Wellness
   - Componentes NavBar duplicados por área
   - Lógica de preview duplicada em cada página

2. **Estrutura Confusa:**
   - `/pt/` misturado com áreas
   - APIs em `/api/wellness/` mas não há padrão para outras áreas
   - Componentes em pastas separadas mas compartilham lógica

3. **Escalabilidade:**
   - Adicionar novo idioma = duplicar toda estrutura `/pt/`
   - Adicionar nova área = criar APIs, componentes, páginas separadas
   - Difícil manter consistência entre áreas

4. **Manutenção:**
   - Mudança em um template = editar múltiplos arquivos
   - Diagnósticos compartilhados mas nome sugere "nutri"
   - Lógica de preview espalhada (1946 linhas em um arquivo)

---

## ✅ **PROPOSTA: ESTRUTURA BASEADA EM PROFISSÕES**

### **Filosofia:**
- **Profissão (Profession)** = Primeira camada lógica
- **Idioma (Language)** = Roteamento de URL apenas
- **Templates** = Compartilhados, diferenciados por `profession` no banco
- **Diagnósticos** = Compartilhados, adaptados por `profession` no código

---

## 📁 **NOVA ESTRUTURA PROPOSTA**

```
src/
├── app/
│   ├── [lang]/                          # Idioma como roteamento dinâmico
│   │   ├── pt/                          # Português
│   │   ├── en/                          # Inglês
│   │   ├── es/                          # Espanhol
│   │   │
│   │   └── [profession]/                # Profissão como roteamento dinâmico
│   │       ├── nutri/                   # Nutricionista
│   │       │   ├── dashboard/
│   │       │   ├── ferramentas/
│   │       │   │   ├── templates/       # Preview de templates
│   │       │   │   └── nova/
│   │       │   ├── leads/
│   │       │   └── ...
│   │       │
│   │       ├── wellness/                 # Distribuidor Wellness
│   │       │   ├── dashboard/
│   │       │   ├── ferramentas/
│   │       │   │   ├── templates/       # Preview de templates
│   │       │   │   └── nova/
│   │       │   └── ...
│   │       │
│   │       ├── coach/                    # Nutri Coach
│   │       └── nutra/                     # Nutra
│   │
│   └── api/
│       └── [profession]/                 # API organizada por profissão
│           ├── nutri/
│           │   ├── templates/
│           │   │   └── route.ts         # GET templates (profession='nutri')
│           │   ├── dashboard/
│           │   └── ferramentas/
│           │
│           ├── wellness/
│           │   ├── templates/
│           │   │   └── route.ts         # GET templates (profession='wellness')
│           │   ├── dashboard/
│           │   └── ferramentas/
│           │
│           └── shared/                   # APIs compartilhadas
│               ├── templates/
│               │   └── route.ts         # GET templates (multi-profession)
│               └── leads/
│
├── components/
│   ├── shared/                          # Componentes compartilhados
│   │   ├── nav/
│   │   │   ├── NavBar.tsx               # Componente base
│   │   │   └── NavBarProvider.tsx       # Provider com configuração por área
│   │   ├── templates/
│   │   │   ├── TemplatePreview.tsx      # Preview genérico
│   │   │   ├── ChecklistPreview.tsx      # Preview específico Checklists
│   │   │   ├── CalculadoraPreview.tsx   # Preview específico Calculadoras
│   │   │   └── QuizPreview.tsx          # Preview específico Quizzes
│   │   └── CTAButton.tsx                # CTA genérico
│   │
│   └── [profession]/                    # Componentes específicos por área
│       ├── nutri/
│       │   └── NutriDashboardCard.tsx   # Componentes específicos Nutri
│       └── wellness/
│           └── WellnessPortalCard.tsx    # Componentes específicos Wellness
│
└── lib/
    ├── diagnostics/                     # Diagnósticos organizados
    │   ├── index.ts                    # Export centralizado
    │   ├── checklist-alimentar.ts      # Diagnósticos do Checklist Alimentar
    │   ├── checklist-detox.ts          # Diagnósticos do Checklist Detox
    │   ├── calculadora-imc.ts          # Diagnósticos Calculadora IMC
    │   ├── calculadora-agua.ts         # Diagnósticos Calculadora Água
    │   └── ...                         # Um arquivo por template
    │
    ├── templates/                      # Lógica de templates
    │   ├── detection.ts                # Funções de detecção de templates
    │   ├── preview/                    # Lógica de preview
    │   │   ├── ChecklistPreview.tsx     # Componente de preview Checklists
    │   │   ├── CalculadoraPreview.tsx  # Componente de preview Calculadoras
    │   │   └── QuizPreview.tsx          # Componente de preview Quizzes
    │   └── types.ts                    # Tipos compartilhados
    │
    └── config/                         # Configurações por área
        ├── professions.ts              # Configuração de cores, rotas, etc
        └── i18n.ts                     # Internacionalização (já existe)
```

---

## 🎯 **MUDANÇAS PRINCIPAIS**

### **1. Diagnósticos Reorganizados**

**ANTES:**
```
src/lib/diagnosticos-nutri.ts  (1323 linhas, tudo em um arquivo)
```

**DEPOIS:**
```
src/lib/diagnostics/
├── index.ts                    # Export centralizado
│   export { checklistAlimentarDiagnosticos } from './checklist-alimentar'
│   export { checklistDetoxDiagnosticos } from './checklist-detox'
│   ...
│
├── checklist-alimentar.ts      # Apenas Checklist Alimentar
│   export const checklistAlimentarDiagnosticos: DiagnosticosPorFerramenta = {
│     nutri: { ... },
│     wellness: { ... },        # ← Adicionar versão Wellness
│     coach: { ... },           # ← Adicionar versão Coach
│     nutra: { ... }            # ← Adicionar versão Nutra
│   }
│
├── checklist-detox.ts
├── calculadora-imc.ts
└── ...
```

**Vantagem:** 
- Um arquivo por template = fácil manutenção
- Cada template tem versões para todas as profissões
- Fácil adicionar novas profissões

---

### **2. APIs Unificadas**

**ANTES:**
```
/api/wellness/templates/route.ts      # Específico Wellness
```

**DEPOIS:**
```
/api/[profession]/templates/route.ts  # Dinâmico por profissão

// Exemplo de uso:
GET /api/nutri/templates      → profession='nutri'
GET /api/wellness/templates   → profession='wellness'
GET /api/coach/templates      → profession='coach'
```

**Implementação:**
```typescript
// src/app/api/[profession]/templates/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { profession: string } }
) {
  const { profession } = params
  
  const templates = await supabase
    .from('templates_nutrition')
    .select('*')
    .eq('profession', profession)  // ← Dinâmico
    .eq('language', lang)
    .eq('is_active', true)
    
  return NextResponse.json({ templates })
}
```

---

### **3. Componentes de Preview Modulares**

**ANTES:**
```
/src/app/pt/wellness/templates/page.tsx (1946 linhas)
  - Toda lógica de preview inline
  - Condicionais aninhadas
  - Difícil manutenção
```

**DEPOIS:**
```
/src/lib/templates/preview/
├── ChecklistPreview.tsx
│   export function ChecklistPreview({ 
│     template, 
│     etapa, 
│     onEtapaChange 
│   }: PreviewProps) {
│     // Lógica específica de Checklists
│     // Suporta Checklist Alimentar, Detox, etc
│   }
│
├── CalculadoraPreview.tsx
│   export function CalculadoraPreview({ ... }) {
│     // Lógica específica de Calculadoras
│   }
│
└── QuizPreview.tsx
    export function QuizPreview({ ... }) {
      // Lógica específica de Quizzes
    }

// Uso na página:
import { ChecklistPreview } from '@/lib/templates/preview/ChecklistPreview'

{template.type === 'planilha' && isChecklist && (
  <ChecklistPreview 
    template={template}
    etapa={etapaPreview}
    onEtapaChange={setEtapaPreview}
    profession="wellness"
  />
)}
```

**Vantagem:**
- Página de templates: ~300 linhas (vs 1946)
- Lógica isolada e testável
- Reutilizável entre áreas

---

### **4. NavBar Unificada**

**ANTES:**
```
/components/nutri/NutriNavBar.tsx
/components/wellness/WellnessNavBar.tsx
/components/coach/CoachNavBar.tsx (a criar)
/components/nutra/NutraNavBar.tsx (a criar)
```

**DEPOIS:**
```
/components/shared/nav/NavBar.tsx

// Configuração por profissão
const professionConfig = {
  nutri: {
    color: 'blue',
    logoColor: 'blue-400',
    routes: { dashboard: '/pt/nutri/dashboard' }
  },
  wellness: {
    color: 'green',
    logoColor: 'green-400',
    routes: { dashboard: '/pt/wellness/dashboard' }
  },
  coach: { ... },
  nutra: { ... }
}

// Uso:
<NavBar profession="wellness" />
```

---

### **5. Funções de Detecção Compartilhadas**

**ANTES:**
```typescript
// Duplicado em múltiplos lugares
const isAlimentar = idCheck.includes('checklist-alimentar') || ...
```

**DEPOIS:**
```typescript
// src/lib/templates/detection.ts
export function isChecklistAlimentar(template: Template): boolean {
  const id = (template.id || '').toLowerCase().replace(/\s+/g, '-')
  const name = (template.name || '').toLowerCase()
  return id.includes('checklist-alimentar') || 
         name.includes('checklist alimentar')
}

export function isChecklistDetox(template: Template): boolean { ... }
export function isCalculadoraIMC(template: Template): boolean { ... }
```

**Uso:**
```typescript
import { isChecklistAlimentar } from '@/lib/templates/detection'

if (isChecklistAlimentar(template)) {
  // Renderizar Checklist Alimentar
}
```

---

## 🔄 **ESTRATÉGIA DE MIGRAÇÃO**

### **Fase 1: Reorganizar Diagnósticos**
1. Criar `src/lib/diagnostics/`
2. Dividir `diagnosticos-nutri.ts` em arquivos menores
3. Adicionar versões `wellness`, `coach`, `nutra` para cada template
4. Manter compatibilidade com import antigo

### **Fase 2: Modularizar Preview**
1. Extrair lógica de preview para componentes
2. Criar `ChecklistPreview.tsx`, `CalculadoraPreview.tsx`, etc
3. Refatorar `page.tsx` para usar componentes
4. Testar em Wellness primeiro

### **Fase 3: Unificar APIs**
1. Criar `src/app/api/[profession]/templates/route.ts`
2. Migrar `/api/wellness/templates` para nova estrutura
3. Atualizar chamadas no frontend
4. Deprecar rotas antigas

### **Fase 4: Unificar Componentes**
1. Criar `NavBar.tsx` unificado
2. Migrar `NutriNavBar` e `WellnessNavBar`
3. Testar em todas as áreas
4. Remover componentes antigos

---

## 📊 **COMPARAÇÃO: ANTES vs DEPOIS**

### **ANTES (Atual)**
```
❌ Diagnósticos: 1 arquivo (1323 linhas)
❌ Preview: 1 arquivo (1946 linhas)
❌ APIs: Separadas por área
❌ NavBars: 2+ componentes duplicados
❌ Detecção: Lógica duplicada em 5+ lugares
❌ Adicionar profissão: Criar tudo do zero
❌ Adicionar idioma: Duplicar estrutura /pt/
```

### **DEPOIS (Proposta)**
```
✅ Diagnósticos: 1 arquivo por template (~50-100 linhas cada)
✅ Preview: Componentes modulares (~200 linhas cada)
✅ APIs: Dinâmicas por profissão (1 arquivo)
✅ NavBar: 1 componente configurável
✅ Detecção: Funções compartilhadas
✅ Adicionar profissão: Adicionar config + versões de diagnóstico
✅ Adicionar idioma: Roteamento automático [lang]/
```

---

## 🎯 **BENEFÍCIOS**

1. **Manutenibilidade:**
   - Mudança em um template = editar 1 arquivo pequeno
   - Lógica isolada e testável
   - Fácil encontrar código

2. **Escalabilidade:**
   - Adicionar profissão = config + versões de diagnóstico
   - Adicionar idioma = roteamento automático
   - Adicionar template = novo arquivo de diagnóstico

3. **Consistência:**
   - Mesma estrutura em todas as áreas
   - Mesmos padrões de código
   - Menos bugs por duplicação

4. **Performance:**
   - Componentes menores = bundle menor
   - Code splitting por template
   - Lazy loading de previews

---

## 📝 **EXEMPLO PRÁTICO: Checklist Alimentar**

### **ANTES:**
```typescript
// page.tsx (1946 linhas)
// Linha 1457: Detecção do Checklist Alimentar
// Linha 1469: Renderização das perguntas
// Linha 1576: Renderização dos resultados
// Tudo inline, difícil de manter
```

### **DEPOIS:**
```typescript
// src/lib/templates/preview/ChecklistPreview.tsx
export function ChecklistPreview({ template, etapa, profession }: Props) {
  const diagnosticos = checklistAlimentarDiagnosticos[profession]
  
  if (etapa === 0) return <ChecklistLanding template={template} />
  if (etapa >= 1 && etapa <= 5) return <ChecklistQuestion etapa={etapa} />
  if (etapa === 6) return <ChecklistResults diagnosticos={diagnosticos} />
}

// src/app/pt/[profession]/templates/page.tsx
import { ChecklistPreview } from '@/lib/templates/preview/ChecklistPreview'

{isChecklistAlimentar(template) && (
  <ChecklistPreview 
    template={template}
    etapa={etapaPreview}
    profession="wellness"
  />
)}
```

---

## 🚀 **PRÓXIMOS PASSOS RECOMENDADOS**

1. **Aprovar estrutura proposta**
2. **Criar branch de refatoração**
3. **Migrar diagnóstico por diagnóstico** (começar com Checklist Alimentar)
4. **Extrair previews** (começar com Checklists)
5. **Testar em Wellness** antes de aplicar em outras áreas
6. **Documentar padrões** para futuras adições

---

## ⚠️ **CONSIDERAÇÕES**

- **Breaking Changes:** Algumas rotas podem mudar
- **Tempo:** Refatoração gradual (1-2 semanas)
- **Risco:** Médio (testar bem antes de aplicar)
- **Benefício:** Alto (muito mais fácil manter)

---

## ✅ **CONCLUSÃO**

A estrutura atual funciona, mas está difícil de manter e escalar. A proposta:
- ✅ Mantém funcionalidade atual
- ✅ Melhora organização
- ✅ Facilita manutenção
- ✅ Prepara para crescimento
- ✅ Reduz duplicação

**Recomendação:** Aprovar e fazer migração gradual, área por área, começando por Wellness (mais maduro).

