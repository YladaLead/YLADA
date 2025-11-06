# 📋 ESTRUTURA COMPLETA DO SISTEMA YLADA

## 🎯 VISÃO GERAL

O YLADA é uma plataforma multi-área para profissionais de nutrição e bem-estar, com sistema de templates reutilizáveis.

---

## 📁 ESTRUTURA DE PASTAS

```
src/
├── app/
│   ├── pt/                          # Roteamento em Português
│   │   ├── nutri/                   # ÁREA NUTRICIONISTA
│   │   │   ├── dashboard/
│   │   │   ├── ferramentas/
│   │   │   │   ├── templates/       # 38 templates validados
│   │   │   │   └── nova/
│   │   │   ├── leads/
│   │   │   ├── configuracoes/
│   │   │   └── ...
│   │   │
│   │   ├── wellness/                # ÁREA WELLNESS (Herbalife)
│   │   │   ├── dashboard/
│   │   │   ├── ferramentas/
│   │   │   │   ├── [id]/editar/
│   │   │   │   └── nova/
│   │   │   ├── templates/           # Página de templates + preview
│   │   │   │   ├── page.tsx         # ← ARQUIVO PRINCIPAL (1946 linhas)
│   │   │   │   ├── checklist-alimentar/
│   │   │   │   ├── imc/
│   │   │   │   └── ... (30+ páginas funcionais)
│   │   │   ├── portals/
│   │   │   ├── configuracao/
│   │   │   └── ...
│   │   │
│   │   ├── coach/                   # ÁREA NUTRI COACH (básica)
│   │   └── nutra/                   # ÁREA NUTRA (básica)
│   │
│   └── api/                         # API Routes
│       ├── wellness/
│       │   ├── templates/           # GET templates do banco
│       │   │   └── route.ts         # ← API que retorna templates
│       │   ├── dashboard/
│       │   └── ferramentas/
│       └── nutri/                   # (futuro)
│
├── components/
│   ├── nutri/
│   │   └── NutriNavBar.tsx          # NavBar específica Nutri
│   ├── wellness/
│   │   ├── WellnessNavBar.tsx        # NavBar específica Wellness
│   │   ├── WellnessCTAButton.tsx
│   │   └── WellnessHeader.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── ProtectedRoute.tsx
│
└── lib/
    ├── diagnosticos-nutri.ts        # ← TODOS OS DIAGNÓSTICOS (38 templates)
    └── supabase.ts
```

---

## 🗄️ BANCO DE DADOS

### Tabela Principal: `templates_nutrition`

```sql
templates_nutrition
├── id (UUID)                        # ID único
├── name (VARCHAR)                   # Nome do template
├── type (VARCHAR)                   # 'calculadora' | 'quiz' | 'planilha'
├── profession (VARCHAR)              # 'nutri' | 'wellness' | 'coach'
├── language (VARCHAR)               # 'pt' | 'en' | 'es'
├── description (TEXT)               # Descrição
├── content (JSONB)                  # Conteúdo específico
├── is_active (BOOLEAN)              # Ativo/Inativo
└── ...
```

**Exemplo de registro:**
```json
{
  "id": "uuid-123",
  "name": "Checklist Alimentar",
  "type": "planilha",
  "profession": "wellness",
  "language": "pt",
  "description": "Avalie seus hábitos alimentares...",
  "is_active": true
}
```

---

## 🔄 FLUXO DE DADOS

### 1. **CARREGAMENTO DE TEMPLATES**

```
Frontend (page.tsx)
    ↓
useEffect() → fetch('/api/wellness/templates')
    ↓
API Route (route.ts)
    ↓
Supabase → SELECT * FROM templates_nutrition 
           WHERE profession='wellness' 
           AND language='pt' 
           AND is_active=true
    ↓
Retorna Array de Templates
    ↓
Frontend mapeia para interface Template[]
```

### 2. **PREVIEW DO TEMPLATE**

```
Usuário clica em "Demo"
    ↓
setTemplatePreviewAberto(template.id)
    ↓
Modal abre com preview
    ↓
Estado específico por template:
    - etapaPreview (genérico: 0-4)
    - etapaPreviewChecklistAlimentar (específico: 0-6)
    ↓
Renderiza conteúdo baseado no estado
```

---

## 🎨 ESTRUTURA DO CHECKLIST ALIMENTAR

### **Estados e Navegação**

```typescript
// Estado específico do Checklist Alimentar
const [etapaPreviewChecklistAlimentar, setEtapaPreviewChecklistAlimentar] = useState(0)

// Etapas:
// 0 = Landing (Início)
// 1-5 = Perguntas (5 perguntas)
// 6 = Resultados (3 diagnósticos completos)
```

### **Fluxo de Renderização**

```
1. Detecção:
   - template.id === 'checklist-alimentar' OU
   - template.name.toLowerCase().includes('checklist alimentar')

2. Renderização Condicional:
   ┌─────────────────────────────────────┐
   │ etapaPreviewChecklistAlimentar === 0 │ → Landing Page
   ├─────────────────────────────────────┤
   │ etapaPreviewChecklistAlimentar >= 1  │ → Perguntas (1-5)
   │           && <= 5                    │
   ├─────────────────────────────────────┤
   │ etapaPreviewChecklistAlimentar === 6 │ → Resultados (3 diagnósticos)
   └─────────────────────────────────────┘

3. Navegação:
   - Botão "Anterior" → setEtapaPreviewChecklistAlimentar(etapa - 1)
   - Botões numerados → setEtapaPreviewChecklistAlimentar(etapa)
   - Botão "Próxima" → setEtapaPreviewChecklistAlimentar(etapa + 1)
```

### **Diagnósticos (Fonte: `diagnosticos-nutri.ts`)**

```typescript
checklistAlimentarDiagnosticos.nutri = {
  alimentacaoDeficiente: {
    diagnostico: "📋 DIAGNÓSTICO: ...",
    causaRaiz: "🔍 CAUSA RAIZ: ...",
    acaoImediata: "⚡ AÇÃO IMEDIATA: ...",
    plano7Dias: "📅 PLANO 7 DIAS: ...",
    suplementacao: "💊 SUPLEMENTAÇÃO: ...",
    alimentacao: "🍎 ALIMENTAÇÃO: ...",
    proximoPasso: "🎯 PRÓXIMO PASSO: ..."
  },
  alimentacaoModerada: { ... },
  alimentacaoEquilibrada: { ... }
}
```

---

## 🔍 PROBLEMA IDENTIFICADO

### **Conflito de Navegação**

**Situação Atual:**
1. ✅ Checklist Alimentar tem sua própria navegação (7 etapas: 0-6)
2. ❌ Navegação genérica também renderiza (5 etapas: 0-4)
3. ❌ Conflito entre `etapaPreview` (genérico) e `etapaPreviewChecklistAlimentar` (específico)

**Solução Aplicada:**
- Navegação genérica NÃO aparece quando for Checklist Alimentar
- Checklist Alimentar usa APENAS sua navegação específica

---

## 📊 ESTRUTURA DE TIPOS

### **Interface Template (Frontend)**

```typescript
interface Template {
  id: string                    // Slug gerado do nome
  name: string                  // Nome do template
  description: string           // Descrição
  icon: any                     // Ícone Lucide
  type: 'calculadora' | 'quiz' | 'planilha'
  category: string              // Categoria (Calculadora, Quiz, Planilha)
  link: string                  // Link para página funcional
  color: string                 // Cor do card
}
```

### **Template no Banco**

```typescript
{
  id: UUID,
  name: string,
  type: 'calculadora' | 'quiz' | 'planilha',
  profession: 'nutri' | 'wellness' | 'coach',
  language: 'pt' | 'en' | 'es',
  description: string,
  content: JSONB,
  is_active: boolean
}
```

---

## 🎯 ÁREAS DO SISTEMA

### **1. ÁREA NUTRI** (`/pt/nutri/`)
- **Status:** 🟡 Em desenvolvimento
- **Templates:** 38 templates validados
- **NavBar:** `NutriNavBar.tsx`
- **Cores:** Azul (`blue-600`)

### **2. ÁREA WELLNESS** (`/pt/wellness/`)
- **Status:** ✅ Funcional
- **Templates:** Carregados do banco (`profession='wellness'`)
- **NavBar:** `WellnessNavBar.tsx`
- **Cores:** Verde/Teal (`teal-600`, `green-600`)
- **Página Templates:** `/pt/wellness/templates/page.tsx` (1946 linhas)

### **3. ÁREA COACH** (`/pt/coach/`)
- **Status:** 🟡 Básica
- **Funcionalidades:** Dashboard básico

### **4. ÁREA NUTRA** (`/pt/nutra/`)
- **Status:** 🟡 Básica
- **Funcionalidades:** Dashboard básico

---

## 🔄 FLUXO COMPLETO DO CHECKLIST ALIMENTAR

```
1. Página carrega
   ↓
2. useEffect() busca templates via API
   ↓
3. API retorna templates do banco (profession='wellness')
   ↓
4. Frontend mapeia para Template[]
   ↓
5. Usuário clica em "Demo" do Checklist Alimentar
   ↓
6. setTemplatePreviewAberto('checklist-alimentar')
   ↓
7. Modal abre
   ↓
8. Detecção: isAlimentar = true
   ↓
9. Renderiza conteúdo baseado em etapaPreviewChecklistAlimentar:
   - Se 0 → Landing
   - Se 1-5 → Pergunta correspondente
   - Se 6 → Resultados (3 diagnósticos)
   ↓
10. Navegação específica controla etapaPreviewChecklistAlimentar
   ↓
11. Navegação genérica NÃO aparece (condição: if (isAlimentar) return null)
```

---

## 📝 ESTRUTURA DE ARQUIVOS RELEVANTES

### **Frontend - Preview**
- `src/app/pt/wellness/templates/page.tsx` (1946 linhas)
  - Linha 29: Estado `etapaPreviewChecklistAlimentar`
  - Linha 1457-1688: Renderização do Checklist Alimentar
  - Linha 1576-1637: Resultados (Etapa 6)

### **Backend - API**
- `src/app/api/wellness/templates/route.ts`
  - GET: Busca templates do banco
  - Filtra: `profession='wellness'` + `language='pt'` + `is_active=true`
  - Retorna: Array formatado

### **Diagnósticos**
- `src/lib/diagnosticos-nutri.ts`
  - `checklistAlimentarDiagnosticos.nutri` (3 resultados completos)

---

## ⚠️ PONTOS DE ATENÇÃO

1. **Duplicação de Detecção:**
   - Detecção do Checklist Alimentar acontece em 2 lugares diferentes
   - Poderia ser uma função compartilhada

2. **Estados Múltiplos:**
   - `etapaPreview` (genérico)
   - `etapaPreviewChecklistAlimentar` (específico)
   - Cada template especial precisaria de seu próprio estado

3. **Navegação Genérica:**
   - Calcula `totalEtapas` baseado em `isAlimentar`
   - Mas não renderiza quando for Checklist Alimentar
   - Pode confundir na manutenção

4. **Tamanho do Arquivo:**
   - `page.tsx` tem 1946 linhas
   - Muitas lógicas condicionais aninhadas
   - Difícil manutenção e debug

---

## 🎯 RECOMENDAÇÕES PARA ORGANIZAÇÃO

1. **Separar lógica de preview por template:**
   ```
   src/components/wellness-previews/
   ├── ChecklistAlimentarPreview.tsx
   ├── ChecklistDetoxPreview.tsx
   ├── CalculadoraIMCPreview.tsx
   └── ...
   ```

2. **Função de detecção compartilhada:**
   ```typescript
   // src/lib/template-detection.ts
   export function isChecklistAlimentar(template: Template): boolean {
     // Lógica única e reutilizável
   }
   ```

3. **Estado de preview unificado:**
   ```typescript
   const [previewState, setPreviewState] = useState<{
     templateId: string | null
     etapa: number
   }>({ templateId: null, etapa: 0 })
   ```

---

## 📌 RESUMO EXECUTIVO

**Sistema:** Multi-área (Nutri, Wellness, Coach, Nutra)
**Templates:** Banco de dados (`templates_nutrition`)
**Preview:** Modal dinâmico com estados específicos
**Checklist Alimentar:** 7 etapas (0=landing, 1-5=perguntas, 6=resultados)
**Problema:** Conflito entre navegação genérica e específica
**Solução:** Navegação genérica desabilitada para Checklist Alimentar

