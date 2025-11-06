# 🏗️ ESTRUTURA DETALHADA: ÁREAS INDEPENDENTES

## 🎯 PRINCÍPIO FUNDAMENTAL

**Cada área (profession) é COMPLETAMENTE INDEPENDENTE:**
- ✅ Mesmas ferramentas disponíveis
- ✅ Diagnósticos separados por área
- ✅ Cores e personalizações por área
- ✅ Adicionar/remover ferramenta em uma área NÃO afeta outras
- ✅ Editar diagnóstico em uma área NÃO afeta outras

---

## 📊 ORGANIZAÇÃO NO BANCO DE DADOS

### **Tabela: `templates_nutrition`**

```sql
templates_nutrition
├── id (UUID)                    # ID único do template
├── name (VARCHAR)                # Nome: "Checklist Alimentar"
├── type (VARCHAR)                # 'calculadora' | 'quiz' | 'planilha'
├── profession (VARCHAR)          # 'nutri' | 'wellness' | 'coach' | 'nutra'
├── language (VARCHAR)            # 'pt' | 'en' | 'es'
├── description (TEXT)            # Descrição
├── content (JSONB)              # Conteúdo específico
├── is_active (BOOLEAN)          # Ativo/Inativo
└── ...
```

### **ESTRATÉGIA: Registros Separados por Área**

**Exemplo: Checklist Alimentar**

```
Registro 1:
  id: "uuid-1"
  name: "Checklist Alimentar"
  profession: "nutri"
  language: "pt"
  is_active: true

Registro 2:
  id: "uuid-2"
  name: "Checklist Alimentar"
  profession: "wellness"
  language: "pt"
  is_active: true

Registro 3:
  id: "uuid-3"
  name: "Checklist Alimentar"
  profession: "coach"
  language: "pt"
  is_active: false  ← Desativado em Coach

Registro 4:
  id: "uuid-4"
  name: "Checklist Alimentar"
  profession: "nutra"
  language: "pt"
  is_active: true
```

**Vantagem:**
- ✅ Desativar em uma área = `UPDATE WHERE profession='coach' SET is_active=false`
- ✅ Não afeta outras áreas
- ✅ Cada área pode ter versões diferentes do mesmo template

---

## 📁 ESTRUTURA COMPLETA DE ARQUIVOS

```
src/
├── app/
│   ├── [lang]/                              # Idioma dinâmico
│   │   └── [profession]/                    # Profissão dinâmica
│   │       ├── nutri/
│   │       │   ├── dashboard/
│   │       │   │   └── page.tsx
│   │       │   ├── ferramentas/
│   │       │   │   ├── page.tsx              # Lista de ferramentas
│   │       │   │   ├── nova/
│   │       │   │   │   └── page.tsx
│   │       │   │   └── templates/
│   │       │   │       └── page.tsx           # Preview templates Nutri
│   │       │   ├── leads/
│   │       │   ├── configuracoes/
│   │       │   └── ...
│   │       │
│   │       ├── wellness/
│   │       │   ├── dashboard/
│   │       │   ├── ferramentas/
│   │       │   │   ├── page.tsx
│   │       │   │   ├── nova/
│   │       │   │   └── templates/
│   │       │   │       └── page.tsx           # Preview templates Wellness
│   │       │   └── ...
│   │       │
│   │       ├── coach/
│   │       │   └── [mesma estrutura]
│   │       │
│   │       └── nutra/
│   │           └── [mesma estrutura]
│   │
│   └── api/
│       └── [profession]/                     # API por profissão
│           ├── nutri/
│           │   ├── templates/
│           │   │   └── route.ts              # GET profession='nutri'
│           │   ├── ferramentas/
│           │   │   └── route.ts
│           │   └── dashboard/
│           │       └── route.ts
│           │
│           ├── wellness/
│           │   ├── templates/
│           │   │   └── route.ts              # GET profession='wellness'
│           │   ├── ferramentas/
│           │   └── dashboard/
│           │
│           ├── coach/
│           │   └── [mesma estrutura]
│           │
│           └── nutra/
│               └── [mesma estrutura]
│
├── components/
│   └── [profession]/                         # Componentes por área
│       ├── nutri/
│       │   ├── NutriNavBar.tsx
│       │   ├── NutriTemplatePreview.tsx      # Preview específico Nutri
│       │   ├── NutriDashboardCard.tsx
│       │   └── NutriCTAButton.tsx
│       │
│       ├── wellness/
│       │   ├── WellnessNavBar.tsx
│       │   ├── WellnessTemplatePreview.tsx   # Preview específico Wellness
│       │   ├── WellnessDashboardCard.tsx
│       │   └── WellnessCTAButton.tsx
│       │
│       ├── coach/
│       │   └── [componentes específicos]
│       │
│       └── nutra/
│           └── [componentes específicos]
│
└── lib/
    └── diagnostics/
        └── [profession]/                     # Diagnósticos por área
            ├── nutri/
            │   ├── checklist-alimentar.ts     # Versão Nutri
            │   ├── checklist-detox.ts
            │   ├── calculadora-imc.ts
            │   ├── calculadora-agua.ts
            │   ├── calculadora-proteina.ts
            │   ├── calculadora-calorias.ts
            │   └── ... (todos os templates)
            │
            ├── wellness/
            │   ├── checklist-alimentar.ts    # Versão Wellness (cores teal)
            │   ├── checklist-detox.ts
            │   ├── calculadora-imc.ts
            │   └── ... (todos os templates)
            │
            ├── coach/
            │   └── ... (todos os templates)
            │
            └── nutra/
                └── ... (todos os templates)
```

---

## 🔄 FLUXO DE DADOS POR ÁREA

### **1. Carregamento de Templates (Wellness)**

```
Frontend: /pt/wellness/templates/page.tsx
    ↓
useEffect() → fetch('/api/wellness/templates')
    ↓
API: /api/wellness/templates/route.ts
    ↓
SELECT * FROM templates_nutrition 
WHERE profession = 'wellness' 
AND language = 'pt' 
AND is_active = true
    ↓
Retorna apenas templates Wellness
    ↓
Frontend renderiza com diagnósticos Wellness
```

### **2. Carregamento de Templates (Nutri)**

```
Frontend: /pt/nutri/ferramentas/templates/page.tsx
    ↓
useEffect() → fetch('/api/nutri/templates')
    ↓
API: /api/nutri/templates/route.ts
    ↓
SELECT * FROM templates_nutrition 
WHERE profession = 'nutri' 
AND language = 'pt' 
AND is_active = true
    ↓
Retorna apenas templates Nutri
    ↓
Frontend renderiza com diagnósticos Nutri
```

---

## 📝 EXEMPLO PRÁTICO: Checklist Alimentar

### **No Banco de Dados:**

```sql
-- Versão Nutri
INSERT INTO templates_nutrition (name, type, profession, language, is_active)
VALUES ('Checklist Alimentar', 'planilha', 'nutri', 'pt', true);

-- Versão Wellness
INSERT INTO templates_nutrition (name, type, profession, language, is_active)
VALUES ('Checklist Alimentar', 'planilha', 'wellness', 'pt', true);

-- Versão Coach (desativada)
INSERT INTO templates_nutrition (name, type, profession, language, is_active)
VALUES ('Checklist Alimentar', 'planilha', 'coach', 'pt', false);
```

### **Nos Diagnósticos:**

```typescript
// src/lib/diagnostics/nutri/checklist-alimentar.ts
export const checklistAlimentarDiagnosticos = {
  alimentacaoDeficiente: {
    diagnostico: "📋 DIAGNÓSTICO: Sua alimentação precisa de correção...",
    causaRaiz: "🔍 CAUSA RAIZ: Hábitos alimentares inadequados...",
    // ... (versão Nutri)
  },
  alimentacaoModerada: { ... },
  alimentacaoEquilibrada: { ... }
}

// src/lib/diagnostics/wellness/checklist-alimentar.ts
export const checklistAlimentarDiagnosticos = {
  alimentacaoDeficiente: {
    diagnostico: "📋 DIAGNÓSTICO: Sua alimentação precisa de correção...",
    causaRaiz: "🔍 CAUSA RAIZ: Hábitos alimentares inadequados...",
    // ... (versão Wellness - pode ter textos diferentes)
  },
  alimentacaoModerada: { ... },
  alimentacaoEquilibrada: { ... }
}
```

### **No Preview (Wellness):**

```typescript
// src/app/pt/wellness/templates/page.tsx
import { checklistAlimentarDiagnosticos } from '@/lib/diagnostics/wellness/checklist-alimentar'

// Usa diagnósticos Wellness
<p>{checklistAlimentarDiagnosticos.alimentacaoDeficiente.diagnostico}</p>
```

### **No Preview (Nutri):**

```typescript
// src/app/pt/nutri/ferramentas/templates/page.tsx
import { checklistAlimentarDiagnosticos } from '@/lib/diagnostics/nutri/checklist-alimentar'

// Usa diagnósticos Nutri
<p>{checklistAlimentarDiagnosticos.alimentacaoDeficiente.diagnostico}</p>
```

---

## 🎨 PERSONALIZAÇÃO POR ÁREA

### **Cores:**

```typescript
// src/lib/config/professions.ts
export const professionConfig = {
  nutri: {
    primaryColor: 'blue',
    secondaryColor: 'blue-600',
    accentColor: 'blue-400',
    gradient: 'from-blue-50 to-blue-100'
  },
  wellness: {
    primaryColor: 'teal',
    secondaryColor: 'teal-600',
    accentColor: 'teal-400',
    gradient: 'from-teal-50 to-blue-50'
  },
  coach: {
    primaryColor: 'purple',
    secondaryColor: 'purple-600',
    accentColor: 'purple-400',
    gradient: 'from-purple-50 to-pink-50'
  },
  nutra: {
    primaryColor: 'orange',
    secondaryColor: 'orange-600',
    accentColor: 'orange-400',
    gradient: 'from-orange-50 to-amber-50'
  }
}
```

### **Uso nos Componentes:**

```typescript
// src/components/wellness/WellnessTemplatePreview.tsx
import { professionConfig } from '@/lib/config/professions'

const config = professionConfig.wellness

<div className={`bg-${config.gradient} ...`}>
  <button className={`bg-${config.secondaryColor} ...`}>
    Próxima →
  </button>
</div>
```

---

## ✅ OPERAÇÕES POR ÁREA (ISOLADAS)

### **1. Adicionar Ferramenta em Wellness**

```sql
-- Adiciona apenas para Wellness
INSERT INTO templates_nutrition (
  name, 
  type, 
  profession, 
  language, 
  is_active
) VALUES (
  'Nova Ferramenta',
  'quiz',
  'wellness',  -- ← Apenas Wellness
  'pt',
  true
);
```

**Resultado:**
- ✅ Aparece em Wellness
- ❌ Não aparece em Nutri, Coach, Nutra
- ✅ Não afeta outras áreas

---

### **2. Remover Ferramenta de Coach**

```sql
-- Remove apenas de Coach
UPDATE templates_nutrition
SET is_active = false
WHERE name = 'Checklist Alimentar'
AND profession = 'coach'  -- ← Apenas Coach
AND language = 'pt';
```

**Resultado:**
- ❌ Não aparece mais em Coach
- ✅ Continua em Nutri, Wellness, Nutra
- ✅ Não afeta outras áreas

---

### **3. Editar Diagnóstico em Wellness**

```typescript
// src/lib/diagnostics/wellness/checklist-alimentar.ts
export const checklistAlimentarDiagnosticos = {
  alimentacaoDeficiente: {
    diagnostico: "📋 DIAGNÓSTICO: NOVO TEXTO WELLNESS",  // ← Editado
    // ...
  }
}
```

**Resultado:**
- ✅ Mudança apenas em Wellness
- ✅ Nutri, Coach, Nutra mantêm textos originais
- ✅ Não afeta outras áreas

---

### **4. Adicionar Nova Ferramenta em Todas as Áreas**

```sql
-- Adiciona em todas as áreas
INSERT INTO templates_nutrition (name, type, profession, language, is_active)
VALUES 
  ('Nova Ferramenta', 'calculadora', 'nutri', 'pt', true),
  ('Nova Ferramenta', 'calculadora', 'wellness', 'pt', true),
  ('Nova Ferramenta', 'calculadora', 'coach', 'pt', true),
  ('Nova Ferramenta', 'calculadora', 'nutra', 'pt', true);
```

**Depois, criar diagnósticos:**
```typescript
// src/lib/diagnostics/nutri/nova-ferramenta.ts
// src/lib/diagnostics/wellness/nova-ferramenta.ts
// src/lib/diagnostics/coach/nova-ferramenta.ts
// src/lib/diagnostics/nutra/nova-ferramenta.ts
```

---

## 🔍 DETALHAMENTO DE COMPONENTES

### **Preview por Área:**

```typescript
// src/components/wellness/WellnessTemplatePreview.tsx
import { checklistAlimentarDiagnosticos } from '@/lib/diagnostics/wellness/checklist-alimentar'
import { professionConfig } from '@/lib/config/professions'

export function WellnessTemplatePreview({ template, etapa }: Props) {
  const config = professionConfig.wellness
  
  // Usa diagnósticos Wellness
  // Usa cores Wellness
  // Lógica específica Wellness
}

// src/components/nutri/NutriTemplatePreview.tsx
import { checklistAlimentarDiagnosticos } from '@/lib/diagnostics/nutri/checklist-alimentar'
import { professionConfig } from '@/lib/config/professions'

export function NutriTemplatePreview({ template, etapa }: Props) {
  const config = professionConfig.nutri
  
  // Usa diagnósticos Nutri
  // Usa cores Nutri
  // Lógica específica Nutri
}
```

---

## 📊 MATRIZ DE ISOLAMENTO

| Operação | Wellness | Nutri | Coach | Nutra |
|----------|----------|-------|-------|-------|
| Adicionar ferramenta | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |
| Remover ferramenta | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |
| Editar diagnóstico | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |
| Mudar cores | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |
| Desativar template | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |

**Resultado:** ✅ **ZERO interferência entre áreas**

---

## 🎯 VANTAGENS DESTA ESTRUTURA

### **1. Isolamento Total**
- ✅ Mudança em Wellness = Zero impacto em outras áreas
- ✅ Teste em uma área não afeta produção em outras
- ✅ Rollback em uma área não afeta outras

### **2. Personalização Independente**
- ✅ Cores diferentes por área
- ✅ Textos adaptados por profissão
- ✅ Diagnósticos específicos por área
- ✅ Fluxos personalizados por área

### **3. Escalabilidade**
- ✅ Adicionar área = Copiar estrutura + Personalizar
- ✅ Adicionar ferramenta = Adicionar em todas as áreas (mas versões independentes)
- ✅ Adicionar idioma = Roteamento automático [lang]/

### **4. Manutenção Simples**
- ✅ Mudança em Wellness = Editar apenas arquivos Wellness
- ✅ Não precisa testar em outras áreas
- ✅ Fácil identificar onde está cada coisa

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Reorganizar Diagnósticos**
- [ ] Criar `src/lib/diagnostics/nutri/`
- [ ] Criar `src/lib/diagnostics/wellness/`
- [ ] Criar `src/lib/diagnostics/coach/`
- [ ] Criar `src/lib/diagnostics/nutra/`
- [ ] Dividir `diagnosticos-nutri.ts` em arquivos por template
- [ ] Copiar diagnósticos para cada área
- [ ] Personalizar textos por área (se necessário)

### **Fase 2: Separar Componentes**
- [ ] Criar `src/components/wellness/WellnessTemplatePreview.tsx`
- [ ] Criar `src/components/nutri/NutriTemplatePreview.tsx`
- [ ] Extrair lógica de preview de `page.tsx`
- [ ] Usar diagnósticos específicos por área

### **Fase 3: Unificar APIs**
- [ ] Criar `src/app/api/[profession]/templates/route.ts`
- [ ] Filtrar por `profession` dinâmico
- [ ] Migrar `/api/wellness/templates` para nova estrutura
- [ ] Atualizar chamadas no frontend

### **Fase 4: Configurar Banco**
- [ ] Garantir que templates têm `profession` correto
- [ ] Criar registros duplicados por área (se necessário)
- [ ] Testar filtros por área

---

## ✅ CONCLUSÃO

**Estrutura Proposta:**
- ✅ 4 áreas completamente independentes
- ✅ Mesmas ferramentas, versões separadas
- ✅ Diagnósticos separados por área
- ✅ Componentes independentes por área
- ✅ APIs filtradas por profissão
- ✅ Banco com registros separados por área

**Isolamento:**
- ✅ Adicionar/remover em uma área = Zero impacto em outras
- ✅ Editar diagnóstico em uma área = Zero impacto em outras
- ✅ Mudar cores em uma área = Zero impacto em outras

**Pronto para implementação!** 🚀

