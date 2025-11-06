# 🎯 ESTRUTURA: FORNECIMENTO DE TEMPLATES, LINKS E QUIZZES

## 📊 VISÃO GERAL

**O que fornecemos para as 4 áreas:**
1. ✅ **Templates** - Base de ferramentas disponíveis
2. ✅ **Criação de Link** - Criar links personalizados a partir de templates
3. ✅ **Criação de Quiz** - Criar quizzes do zero (personalizados)
4. ✅ **Personalização** - Cores, textos, CTAs por área

**Princípio:**
- ✅ Mesmo padrão de estrutura em todas as áreas
- ✅ Funcionamento completamente independente
- ✅ Cada área cria seus próprios links/quizzes
- ✅ Personalização isolada por área

---

## 🗄️ ESTRUTURA NO BANCO DE DADOS

### **1. Templates Base (`templates_nutrition`)**

```sql
templates_nutrition
├── id (UUID)
├── name (VARCHAR)              # "Checklist Alimentar"
├── type (VARCHAR)              # 'calculadora' | 'quiz' | 'planilha'
├── profession (VARCHAR)        # 'nutri' | 'wellness' | 'coach' | 'nutra'
├── language (VARCHAR)         # 'pt' | 'en' | 'es'
├── description (TEXT)
├── content (JSONB)             # Estrutura do template
├── is_active (BOOLEAN)        # Disponível para a área?
└── ...
```

**Exemplo:**
```sql
-- Template disponível para Wellness
INSERT INTO templates_nutrition (name, type, profession, language, is_active)
VALUES ('Checklist Alimentar', 'planilha', 'wellness', 'pt', true);

-- Mesmo template disponível para Nutri
INSERT INTO templates_nutrition (name, type, profession, language, is_active)
VALUES ('Checklist Alimentar', 'planilha', 'nutri', 'pt', true);
```

**Função:** Templates base que cada área pode usar para criar links

---

### **2. Links Criados (`user_templates`)**

```sql
user_templates
├── id (UUID)
├── user_id (UUID)             # Usuário que criou
├── template_id (UUID)         # Template base usado (FK)
├── slug (VARCHAR)             # URL personalizada: "calculadora-imc"
├── title (VARCHAR)            # Título personalizado
├── description (TEXT)         # Descrição personalizada
├── custom_colors (JSONB)      # Cores personalizadas
├── cta_type (VARCHAR)         # 'whatsapp' | 'url_externa'
├── whatsapp_number (VARCHAR)  # WhatsApp personalizado
├── external_url (VARCHAR)     # URL externa personalizada
├── cta_button_text (VARCHAR) # Texto do botão personalizado
├── custom_whatsapp_message (TEXT) # Mensagem WhatsApp personalizada
├── profession (VARCHAR)        # 'nutri' | 'wellness' | 'coach' | 'nutra'
├── views (INTEGER)            # Visualizações
├── leads_count (INTEGER)      # Leads capturados
└── ...
```

**Função:** Links personalizados criados pelos usuários de cada área

**Exemplo:**
```sql
-- Link criado por usuário Wellness
INSERT INTO user_templates (
  user_id,
  template_id,
  slug,
  title,
  profession,
  custom_colors,
  cta_type
) VALUES (
  'user-uuid-1',
  'template-uuid-checklist-alimentar',
  'minha-avaliacao-alimentar',
  'Avaliação Alimentar Personalizada',
  'wellness',  -- ← Área Wellness
  '{"principal": "#10B981", "secundaria": "#059669"}',
  'whatsapp'
);
```

---

### **3. Quizzes Personalizados (`quizzes`)**

```sql
quizzes
├── id (UUID)
├── user_id (UUID)             # Usuário que criou
├── profession (VARCHAR)        # 'nutri' | 'wellness' | 'coach' | 'nutra'
├── slug (VARCHAR)              # URL: "quiz-minha-avaliacao"
├── titulo (VARCHAR)
├── descricao (TEXT)
├── emoji (VARCHAR)
├── cores (JSONB)              # Cores personalizadas
├── configuracoes (JSONB)      # Tempo limite, progresso, etc
├── perguntas (JSONB)          # Array de perguntas
├── entrega (JSONB)            # Tipo de entrega, CTA, etc
├── views (INTEGER)
├── leads_count (INTEGER)
└── ...
```

**Função:** Quizzes criados do zero pelos usuários (não baseados em templates)

---

## 📁 ESTRUTURA DE ARQUIVOS

```
src/
├── app/
│   ├── [lang]/
│   │   └── [profession]/
│   │       ├── nutri/
│   │       │   ├── ferramentas/
│   │       │   │   ├── page.tsx              # Lista de links criados
│   │       │   │   ├── nova/
│   │       │   │   │   └── page.tsx           # Criar link a partir de template
│   │       │   │   └── [id]/editar/
│   │       │   │       └── page.tsx           # Editar link criado
│   │       │   ├── templates/
│   │       │   │   └── page.tsx               # Ver templates disponíveis
│   │       │   └── quiz-personalizado/
│   │       │       └── page.tsx               # Criar quiz do zero
│   │       │
│   │       ├── wellness/
│   │       │   ├── ferramentas/
│   │       │   │   ├── page.tsx              # Lista de links criados
│   │       │   │   ├── nova/
│   │       │   │   │   └── page.tsx           # Criar link a partir de template
│   │       │   │   └── [id]/editar/
│   │       │   │       └── page.tsx           # Editar link criado
│   │       │   ├── templates/
│   │       │   │   └── page.tsx               # Ver templates disponíveis
│   │       │   └── quiz-personalizado/
│   │       │       └── page.tsx               # Criar quiz do zero
│   │       │
│   │       ├── coach/
│   │       │   └── [mesma estrutura]
│   │       │
│   │       └── nutra/
│   │           └── [mesma estrutura]
│   │
│   └── api/
│       └── [profession]/
│           ├── nutri/
│           │   ├── templates/
│           │   │   └── route.ts              # GET templates disponíveis
│           │   ├── ferramentas/
│           │   │   └── route.ts                # CRUD links criados
│           │   └── quizzes/
│           │       └── route.ts                # CRUD quizzes personalizados
│           │
│           ├── wellness/
│           │   ├── templates/
│           │   │   └── route.ts                # GET templates disponíveis
│           │   ├── ferramentas/
│           │   │   └── route.ts                # CRUD links criados
│           │   └── quizzes/
│           │       └── route.ts                # CRUD quizzes personalizados
│           │
│           ├── coach/
│           │   └── [mesma estrutura]
│           │
│           └── nutra/
│               └── [mesma estrutura]
│
└── components/
    └── [profession]/
        ├── nutri/
        │   ├── NutriNavBar.tsx
        │   ├── NutriLinkCreator.tsx            # Componente criar link
        │   ├── NutriQuizCreator.tsx            # Componente criar quiz
        │   └── NutriTemplatePreview.tsx       # Preview templates
        │
        ├── wellness/
        │   ├── WellnessNavBar.tsx
        │   ├── WellnessLinkCreator.tsx        # Componente criar link
        │   ├── WellnessQuizCreator.tsx         # Componente criar quiz
        │   └── WellnessTemplatePreview.tsx   # Preview templates
        │
        ├── coach/
        │   └── [mesma estrutura]
        │
        └── nutra/
            └── [mesma estrutura]
```

---

## 🔄 FLUXO COMPLETO

### **FLUXO 1: Fornecer Templates**

```
1. Admin cria template base no banco:
   INSERT INTO templates_nutrition (name, type, profession, ...)
   VALUES ('Checklist Alimentar', 'planilha', 'wellness', ...)

2. API retorna templates para área:
   GET /api/wellness/templates
   → SELECT * WHERE profession='wellness' AND is_active=true

3. Frontend mostra templates disponíveis:
   /pt/wellness/templates/page.tsx
   → Lista todos os templates Wellness

4. Usuário vê preview:
   → Clica em "Demo" → Vê preview do template
   → Usa diagnósticos Wellness
```

---

### **FLUXO 2: Criar Link a partir de Template**

```
1. Usuário seleciona template:
   /pt/wellness/ferramentas/nova
   → Escolhe "Checklist Alimentar"

2. Usuário personaliza:
   - URL personalizada: "minha-avaliacao"
   - Emoji: 🍽️
   - Cores: Verde (#10B981)
   - CTA: WhatsApp ou URL externa
   - Mensagem WhatsApp personalizada

3. Sistema cria link:
   POST /api/wellness/ferramentas
   {
     template_slug: "checklist-alimentar",
     slug: "minha-avaliacao",
     profession: "wellness",  ← Área Wellness
     custom_colors: {...},
     cta_type: "whatsapp",
     ...
   }

4. Banco salva:
   INSERT INTO user_templates (
     user_id,
     template_id,
     slug,
     profession,  ← 'wellness'
     ...
   )

5. Link gerado:
   ylada.app/wellness/usuario/minha-avaliacao
   → Funciona independente de outras áreas
```

---

### **FLUXO 3: Criar Quiz Personalizado**

```
1. Usuário acessa criação de quiz:
   /pt/wellness/quiz-personalizado

2. Usuário cria do zero:
   - Título: "Meu Quiz Personalizado"
   - Descrições
   - Perguntas (múltipla escolha, dissertativa, etc)
   - Cores personalizadas
   - Configurações (tempo, progresso, etc)
   - Entrega (página, WhatsApp, URL)

3. Sistema salva quiz:
   POST /api/wellness/quizzes
   {
     titulo: "Meu Quiz Personalizado",
     profession: "wellness",  ← Área Wellness
     perguntas: [...],
     cores: {...},
     ...
   }

4. Banco salva:
   INSERT INTO quizzes (
     user_id,
     profession,  ← 'wellness'
     slug,
     ...
   )

5. Quiz gerado:
   ylada.app/wellness/usuario/quiz-minha-avaliacao
   → Funciona independente de outras áreas
```

---

## 🎨 PERSONALIZAÇÃO POR ÁREA

### **1. Cores (Configuração)**

```typescript
// src/lib/config/professions.ts
export const professionColors = {
  nutri: {
    primary: '#3B82F6',      // Azul
    secondary: '#2563EB',
    gradient: 'from-blue-50 to-blue-100'
  },
  wellness: {
    primary: '#10B981',        // Verde/Teal
    secondary: '#059669',
    gradient: 'from-teal-50 to-blue-50'
  },
  coach: {
    primary: '#8B5CF6',        // Roxo
    secondary: '#7C3AED',
    gradient: 'from-purple-50 to-pink-50'
  },
  nutra: {
    primary: '#F59E0B',        // Laranja
    secondary: '#D97706',
    gradient: 'from-orange-50 to-amber-50'
  }
}
```

### **2. Diagnósticos (Separados)**

```typescript
// src/lib/diagnostics/wellness/checklist-alimentar.ts
export const checklistAlimentarDiagnosticos = {
  alimentacaoDeficiente: {
    diagnostico: "...",  // Versão Wellness
    // ...
  }
}

// src/lib/diagnostics/nutri/checklist-alimentar.ts
export const checklistAlimentarDiagnosticos = {
  alimentacaoDeficiente: {
    diagnostico: "...",  // Versão Nutri
    // ...
  }
}
```

### **3. Componentes (Independentes)**

```typescript
// src/components/wellness/WellnessLinkCreator.tsx
export function WellnessLinkCreator() {
  const colors = professionColors.wellness
  
  return (
    <div className={`bg-${colors.gradient} ...`}>
      {/* Lógica específica Wellness */}
    </div>
  )
}

// src/components/nutri/NutriLinkCreator.tsx
export function NutriLinkCreator() {
  const colors = professionColors.nutri
  
  return (
    <div className={`bg-${colors.gradient} ...`}>
      {/* Lógica específica Nutri */}
    </div>
  )
}
```

---

## 📊 MATRIZ DE ISOLAMENTO

| Operação | Wellness | Nutri | Coach | Nutra |
|----------|----------|-------|-------|-------|
| **Ver Templates** | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |
| **Criar Link** | ✅ Links Wellness | ✅ Links Nutri | ✅ Links Coach | ✅ Links Nutra |
| **Criar Quiz** | ✅ Quizzes Wellness | ✅ Quizzes Nutri | ✅ Quizzes Coach | ✅ Quizzes Nutra |
| **Editar Link** | ✅ Só links Wellness | ✅ Só links Nutri | ✅ Só links Coach | ✅ Só links Nutra |
| **Personalizar Cores** | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |
| **Diagnósticos** | ✅ Versão Wellness | ✅ Versão Nutri | ✅ Versão Coach | ✅ Versão Nutra |

**Resultado:** ✅ **ZERO interferência entre áreas**

---

## 🔧 IMPLEMENTAÇÃO DAS APIs

### **1. API de Templates (Listar Disponíveis)**

```typescript
// src/app/api/[profession]/templates/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { profession: string } }
) {
  const { profession } = params
  
  // Buscar templates disponíveis para a área
  const { data } = await supabase
    .from('templates_nutrition')
    .select('*')
    .eq('profession', profession)  // ← Filtro por área
    .eq('language', 'pt')
    .eq('is_active', true)
    
  return NextResponse.json({ templates: data })
}
```

**Uso:**
- `GET /api/wellness/templates` → Templates Wellness
- `GET /api/nutri/templates` → Templates Nutri
- `GET /api/coach/templates` → Templates Coach
- `GET /api/nutra/templates` → Templates Nutra

---

### **2. API de Links (CRUD)**

```typescript
// src/app/api/[profession]/ferramentas/route.ts

// GET - Listar links criados pelo usuário
export async function GET(
  request: NextRequest,
  { params }: { params: { profession: string } }
) {
  const { profession } = params
  const user = await requireAuth(request)
  
  // Buscar links do usuário na área específica
  const { data } = await supabase
    .from('user_templates')
    .select('*')
    .eq('user_id', user.id)
    .eq('profession', profession)  // ← Filtro por área
    .order('created_at', { ascending: false })
    
  return NextResponse.json({ ferramentas: data })
}

// POST - Criar novo link
export async function POST(
  request: NextRequest,
  { params }: { params: { profession: string } }
) {
  const { profession } = params
  const user = await requireAuth(request)
  const body = await request.json()
  
  // Criar link com profession específico
  const { data } = await supabase
    .from('user_templates')
    .insert({
      user_id: user.id,
      template_id: body.template_id,
      slug: body.slug,
      profession: profession,  // ← Área específica
      custom_colors: body.custom_colors,
      cta_type: body.cta_type,
      // ...
    })
    .select()
    .single()
    
  return NextResponse.json({ ferramenta: data })
}
```

---

### **3. API de Quizzes (CRUD)**

```typescript
// src/app/api/[profession]/quizzes/route.ts

// POST - Criar quiz personalizado
export async function POST(
  request: NextRequest,
  { params }: { params: { profession: string } }
) {
  const { profession } = params
  const user = await requireAuth(request)
  const body = await request.json()
  
  // Criar quiz com profession específico
  const { data } = await supabase
    .from('quizzes')
    .insert({
      user_id: user.id,
      profession: profession,  // ← Área específica
      slug: body.slug,
      titulo: body.titulo,
      perguntas: body.perguntas,
      cores: body.cores,
      // ...
    })
    .select()
    .single()
    
  return NextResponse.json({ quiz: data })
}
```

---

## 📝 EXEMPLO COMPLETO: Checklist Alimentar

### **1. Template Base (Fornecido)**

```sql
-- Template disponível para Wellness
INSERT INTO templates_nutrition (
  name, type, profession, language, is_active
) VALUES (
  'Checklist Alimentar', 'planilha', 'wellness', 'pt', true
);
```

### **2. Usuário Cria Link**

```
1. Usuário Wellness acessa: /pt/wellness/ferramentas/nova
2. Seleciona template: "Checklist Alimentar"
3. Personaliza:
   - URL: "minha-avaliacao-alimentar"
   - Emoji: 🍽️
   - Cores: Verde (#10B981)
   - CTA: WhatsApp
   - Mensagem: "Olá! Completei minha avaliação..."
4. Salva:
   POST /api/wellness/ferramentas
   {
     template_slug: "checklist-alimentar",
     slug: "minha-avaliacao-alimentar",
     profession: "wellness",
     ...
   }
5. Link criado:
   ylada.app/wellness/usuario/minha-avaliacao-alimentar
```

### **3. Usuário Nutri Cria Link (Mesmo Template)**

```
1. Usuário Nutri acessa: /pt/nutri/ferramentas/nova
2. Seleciona template: "Checklist Alimentar"
3. Personaliza:
   - URL: "avaliacao-nutricional"
   - Emoji: 🥗
   - Cores: Azul (#3B82F6)  ← Diferente de Wellness
   - CTA: URL externa
   - Mensagem: "Veja seu resultado completo..."
4. Salva:
   POST /api/nutri/ferramentas
   {
     template_slug: "checklist-alimentar",
     slug: "avaliacao-nutricional",
     profession: "nutri",  ← Área diferente
     ...
   }
5. Link criado:
   ylada.app/nutri/usuario/avaliacao-nutricional
```

**Resultado:**
- ✅ Mesmo template base
- ✅ Links diferentes e independentes
- ✅ Cores diferentes
- ✅ CTAs diferentes
- ✅ Zero interferência

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Estrutura Base**
- [ ] Criar `src/app/[lang]/[profession]/` (rotas dinâmicas)
- [ ] Criar `src/app/api/[profession]/` (APIs dinâmicas)
- [ ] Criar componentes por área (NavBar, LinkCreator, QuizCreator)

### **Fase 2: Templates**
- [ ] API `/api/[profession]/templates/route.ts`
- [ ] Frontend `/pt/[profession]/templates/page.tsx`
- [ ] Preview com diagnósticos específicos por área

### **Fase 3: Criação de Links**
- [ ] API `/api/[profession]/ferramentas/route.ts`
- [ ] Frontend `/pt/[profession]/ferramentas/nova/page.tsx`
- [ ] Componente `[Profession]LinkCreator.tsx`
- [ ] Personalização (cores, CTAs, mensagens)

### **Fase 4: Criação de Quizzes**
- [ ] API `/api/[profession]/quizzes/route.ts`
- [ ] Frontend `/pt/[profession]/quiz-personalizado/page.tsx`
- [ ] Componente `[Profession]QuizCreator.tsx`
- [ ] Personalização completa

### **Fase 5: Gestão de Links**
- [ ] Listar links criados (`/ferramentas/page.tsx`)
- [ ] Editar link (`/ferramentas/[id]/editar/page.tsx`)
- [ ] Excluir link

---

## 🎯 RESUMO EXECUTIVO

**O que fornecemos:**
1. ✅ **Templates** - Base de ferramentas (filtrados por `profession`)
2. ✅ **Criação de Link** - Criar links personalizados a partir de templates
3. ✅ **Criação de Quiz** - Criar quizzes do zero (personalizados)
4. ✅ **Personalização** - Cores, textos, CTAs isolados por área

**Estrutura:**
- ✅ Mesma estrutura em todas as áreas
- ✅ APIs filtradas por `profession`
- ✅ Componentes independentes por área
- ✅ Diagnósticos separados por área

**Isolamento:**
- ✅ Links criados em Wellness = Só aparecem em Wellness
- ✅ Quizzes criados em Nutri = Só aparecem em Nutri
- ✅ Personalização em Coach = Zero impacto em outras áreas

**Pronto para implementação!** 🚀

