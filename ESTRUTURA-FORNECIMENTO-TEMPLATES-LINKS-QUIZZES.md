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

---

## 🔗 SHORT CODES E QR CODES

### **1. Visão Geral**

O sistema permite criar **URLs encurtadas** para facilitar compartilhamento via WhatsApp, SMS ou impresso. Cada link, quiz ou portal pode ter um código curto único que redireciona para a URL completa.

**Exemplo:**
- URL completa: `ylada.app/pt/wellness/usuario/minha-avaliacao`
- URL encurtada: `ylada.app/p/abc123` ← Redireciona para a URL completa

**Funcionalidades:**
- ✅ Geração automática de código aleatório (6 caracteres)
- ✅ Personalização de código (3-10 caracteres)
- ✅ Validação de disponibilidade em tempo real
- ✅ QR Code automático para cada URL encurtada
- ✅ Funciona para Links, Quizzes e Portais

---

### **2. Estrutura no Banco de Dados**

#### **2.1. Tabelas com Short Code**

```sql
-- user_templates (Links/Ferramentas)
user_templates
├── short_code VARCHAR(10) UNIQUE  # Código curto único

-- quizzes (Quizzes Personalizados)
quizzes
├── short_code VARCHAR(20) UNIQUE  # Código curto único

-- wellness_portals (Portais)
wellness_portals
├── short_code VARCHAR(20) UNIQUE  # Código curto único
```

**Índices para Performance:**
```sql
CREATE INDEX idx_user_templates_short_code ON user_templates(short_code);
CREATE INDEX idx_quizzes_short_code ON quizzes(short_code);
CREATE INDEX idx_wellness_portals_short_code ON wellness_portals(short_code);
```

#### **2.2. Função de Geração Automática**

```sql
-- Função para gerar código único aleatório (6 caracteres)
CREATE OR REPLACE FUNCTION generate_unique_short_code()
RETURNS VARCHAR(10) AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  code VARCHAR(10);
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Gerar código aleatório de 6 caracteres
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Verificar se já existe em TODAS as tabelas
    SELECT EXISTS(
      SELECT 1 FROM user_templates WHERE short_code = code
      UNION
      SELECT 1 FROM quizzes WHERE short_code = code
      UNION
      SELECT 1 FROM wellness_portals WHERE short_code = code
    ) INTO exists_check;
    
    -- Se não existe, retornar
    IF NOT exists_check THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

### **3. Validação de Short Codes**

#### **3.1. Regras de Validação**

**Formato:**
- ✅ 3 a 10 caracteres
- ✅ Apenas letras (a-z, A-Z), números (0-9) e hífens (-)
- ✅ Case-insensitive (convertido para lowercase)
- ✅ Único em TODAS as tabelas (user_templates, quizzes, wellness_portals)

**Exemplos Válidos:**
- `abc123` ✅
- `meu-link` ✅
- `quiz-01` ✅
- `portal2024` ✅

**Exemplos Inválidos:**
- `ab` ❌ (menos de 3 caracteres)
- `meu_link` ❌ (underscore não permitido)
- `link com espaço` ❌ (espaços não permitidos)
- `link@especial` ❌ (caracteres especiais não permitidos)

#### **3.2. API de Verificação**

**Endpoint:** `GET /api/wellness/check-short-code`

**Parâmetros:**
- `code` (obrigatório): Código a verificar
- `type` (opcional): `'tool'`, `'quiz'`, `'portal'` ou `null` (verifica todos)
- `excludeId` (opcional): ID do item atual (para edição)

**Exemplo de Uso:**
```typescript
// Verificar disponibilidade em tempo real
const response = await fetch(
  `/api/wellness/check-short-code?code=${encodeURIComponent(customCode)}&type=tool`
)
const data = await response.json()
// { available: true, message: 'Código disponível' }
// ou
// { available: false, message: 'Este código já está em uso' }
```

**Implementação:**
```typescript
// src/app/api/wellness/check-short-code/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type') // 'tool', 'quiz', 'portal'
  const excludeId = searchParams.get('excludeId')

  // Validar formato
  if (!/^[a-zA-Z0-9-]{3,10}$/.test(code)) {
    return NextResponse.json({
      available: false,
      error: 'Código deve ter entre 3 e 10 caracteres...'
    })
  }

  // Verificar em todas as tabelas (ou apenas na especificada)
  const checks = []
  if (!type || type === 'tool') {
    checks.push(supabaseAdmin.from('user_templates').select('id').eq('short_code', code))
  }
  if (!type || type === 'quiz') {
    checks.push(supabaseAdmin.from('quizzes').select('id').eq('short_code', code))
  }
  if (!type || type === 'portal') {
    checks.push(supabaseAdmin.from('wellness_portals').select('id').eq('short_code', code))
  }

  const results = await Promise.all(checks)
  const found = results.some(r => r.data && r.data.length > 0)

  return NextResponse.json({
    available: !found,
    message: found ? 'Este código já está em uso' : 'Código disponível'
  })
}
```

---

### **4. Redirecionamento de Short Codes**

#### **4.1. Rota de Redirecionamento**

**Endpoint:** `GET /p/[code]`

**Funcionamento:**
1. Recebe código curto (ex: `abc123`)
2. Busca em todas as tabelas: `user_templates`, `quizzes`, `wellness_portals`
3. Encontra o item correspondente
4. Busca `user_slug` do usuário
5. Constrói URL completa e redireciona (302)

**Implementação:**
```typescript
// src/app/p/[code]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const normalizedCode = code.toLowerCase().trim()

  // Buscar em todas as tabelas em paralelo
  const [toolResult, quizResult, portalResult] = await Promise.all([
    supabaseAdmin.from('user_templates')
      .select('id, slug, status, user_id, profession')
      .ilike('short_code', normalizedCode)
      .eq('status', 'active')
      .maybeSingle(),
    supabaseAdmin.from('quizzes')
      .select('id, slug, status, user_id')
      .ilike('short_code', normalizedCode)
      .eq('status', 'active')
      .maybeSingle(),
    supabaseAdmin.from('wellness_portals')
      .select('id, slug, status, user_id')
      .ilike('short_code', normalizedCode)
      .eq('status', 'active')
      .maybeSingle(),
  ])

  // Construir URL baseado no tipo encontrado
  let redirectUrl = ''
  if (toolResult.data) {
    const { user_slug } = await getUserSlug(toolResult.data.user_id)
    if (toolResult.data.profession === 'wellness' && user_slug) {
      redirectUrl = `/pt/wellness/${user_slug}/${toolResult.data.slug}`
    } else {
      redirectUrl = `/pt/wellness/ferramenta/${toolResult.data.id}`
    }
  } else if (quizResult.data) {
    const { user_slug } = await getUserSlug(quizResult.data.user_id)
    redirectUrl = user_slug 
      ? `/pt/wellness/${user_slug}/quiz/${quizResult.data.slug}`
      : `/pt/wellness/quiz/${quizResult.data.slug}`
  } else if (portalResult.data) {
    const { user_slug } = await getUserSlug(portalResult.data.user_id)
    redirectUrl = user_slug
      ? `/pt/wellness/${user_slug}/portal/${portalResult.data.slug}`
      : `/pt/wellness/portal/${portalResult.data.slug}`
  }

  return NextResponse.redirect(new URL(redirectUrl, request.url), 302)
}
```

**Exemplo de Redirecionamento:**
```
Usuário acessa: ylada.app/p/abc123
↓
Sistema encontra: short_code='abc123' em user_templates
↓
Busca user_slug: 'dr-joao'
↓
Redireciona para: ylada.app/pt/wellness/dr-joao/minha-avaliacao
```

---

### **5. QR Codes**

#### **5.1. Geração de QR Code**

**Componente:** `src/components/QRCode.tsx`

**Funcionalidade:**
- Gera QR Code automaticamente a partir de uma URL
- Usa API pública: `https://api.qrserver.com/v1/create-qr-code/`
- Exibe URL abaixo do QR Code
- Tratamento de erros

**Uso:**
```typescript
import QRCode from '@/components/QRCode'

<QRCode 
  url={`${window.location.origin}/p/${shortCode}`}
  size={120}
/>
```

**Implementação:**
```typescript
// src/components/QRCode.tsx
export default function QRCode({ url, size = 200 }: QRCodeProps) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`
  
  return (
    <div>
      <img src={qrCodeUrl} alt="QR Code" />
      <p className="text-xs text-gray-500">{url}</p>
    </div>
  )
}
```

**Exibição:**
- ✅ Aparece na listagem de links/quizzes/portais
- ✅ Mostra URL encurtada abaixo do QR Code
- ✅ Tamanho configurável (padrão: 120px)

---

### **6. Implementação em Links (Ferramentas)**

#### **6.1. Criação de Link com Short Code**

**Fluxo:**
1. Usuário marca checkbox "Gerar URL Encurtada"
2. Opcionalmente marca "Personalizar Código"
3. Se personalizar, digita código (3-10 caracteres)
4. Sistema valida em tempo real via `/api/wellness/check-short-code`
5. Ao salvar, envia `generate_short_url: true` e opcionalmente `custom_short_code`

**API Request:**
```typescript
POST /api/wellness/ferramentas
{
  template_slug: "checklist-alimentar",
  slug: "minha-avaliacao",
  generate_short_url: true,
  custom_short_code: "minha-avaliacao", // Opcional
  // ... outros campos
}
```

**API Response:**
```typescript
{
  ferramenta: {
    id: "...",
    slug: "minha-avaliacao",
    short_code: "minha-avaliacao", // ou código aleatório
    // ...
  }
}
```

#### **6.2. Edição de Link com Short Code**

**Fluxo:**
1. Se já tem short_code, exibe URL encurtada atual
2. Botão "Remover" para remover short_code
3. Se não tem, opção de gerar novo
4. Validação em tempo real ao personalizar

**API Request (Remover):**
```typescript
PUT /api/wellness/ferramentas?id=...
{
  remove_short_code: true
}
```

**API Request (Adicionar/Editar):**
```typescript
PUT /api/wellness/ferramentas?id=...
{
  generate_short_url: true,
  custom_short_code: "novo-codigo" // Opcional
}
```

---

### **7. Implementação em Quizzes**

#### **7.1. Criação de Quiz com Short Code**

**Fluxo:**
1. Usuário cria quiz em `/pt/wellness/quiz-personalizado`
2. Marca "Gerar URL Encurtada"
3. Opcionalmente personaliza código
4. Validação em tempo real
5. Salva com short_code

**API Request:**
```typescript
POST /api/quiz
{
  titulo: "Meu Quiz",
  slug: "meu-quiz",
  generate_short_url: true,
  custom_short_code: "quiz-01", // Opcional
  // ... outros campos
}
```

**Validação no Backend:**
```typescript
// src/lib/quiz-db.ts
if (quizData.generate_short_url) {
  if (quizData.custom_short_code) {
    // Validar formato
    if (!/^[a-z0-9-]{3,10}$/.test(customCode)) {
      throw new Error('Código inválido')
    }
    
    // Verificar disponibilidade em TODAS as tabelas
    const [existingInQuizzes, existingInPortals, existingInTemplates] = await Promise.all([
      supabaseAdmin.from('quizzes').select('id').eq('short_code', customCode).limit(1),
      supabaseAdmin.from('wellness_portals').select('id').eq('short_code', customCode).limit(1),
      supabaseAdmin.from('user_templates').select('id').eq('short_code', customCode).limit(1),
    ])
    
    if (existingInQuizzes.data?.length || existingInPortals.data?.length || existingInTemplates.data?.length) {
      throw new Error('Código já está em uso')
    }
    
    shortCode = customCode
  } else {
    // Gerar código aleatório
    const { data } = await supabaseAdmin.rpc('generate_unique_short_code')
    shortCode = data
  }
}
```

#### **7.2. Exibição na Listagem**

**Página:** `/pt/wellness/quizzes/page.tsx`

**Exibe:**
- URL encurtada: `ylada.app/p/[short_code]`
- Botão "Copiar" para copiar URL
- QR Code gerado automaticamente

---

### **8. Implementação em Portais**

#### **8.1. Criação de Portal com Short Code**

**Fluxo:**
1. Usuário cria portal em `/pt/wellness/portals/novo`
2. Seção "URL Encurtada" aparece **ANTES** da seleção de ferramentas
3. Marca "Gerar URL Encurtada"
4. Opcionalmente personaliza código
5. Validação em tempo real
6. Salva com short_code

**API Request:**
```typescript
POST /api/wellness/portals
{
  name: "Portal Completo",
  slug: "portal-completo",
  generate_short_url: true,
  custom_short_code: "portal-01", // Opcional
  // ... outros campos
}
```

**Validação:**
- Mesma lógica de validação cruzada (verifica em todas as tabelas)
- Código único em todo o sistema

#### **8.2. Exibição na Listagem**

**Página:** `/pt/wellness/portals/page.tsx`

**Exibe:**
- URL encurtada: `ylada.app/p/[short_code]`
- Botão "Copiar"
- QR Code gerado automaticamente

---

### **9. Middleware para Short URLs**

**Arquivo:** `src/middleware.ts`

**Importante:** Short URLs (`/p/[code]`) devem ser **excluídas** do redirecionamento automático de idioma.

```typescript
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Excluir /p/ do redirecionamento automático
  if (
    pathname.startsWith('/p/') || // ← IMPORTANTE: Links curtos
    pathname.startsWith('/api/') ||
    // ... outras exclusões
  ) {
    return NextResponse.next()
  }
  
  // ... resto do middleware
}
```

**Motivo:** Evitar que `/p/abc123` vire `/pt/p/abc123` (que não existe)

---

## 🌐 PORTAIS DE BEM-ESTAR

### **1. Visão Geral**

**Portais** são coleções de ferramentas (links e quizzes) organizadas em uma única página, permitindo que usuários acessem múltiplas ferramentas em sequência ou através de um menu.

**Funcionalidades:**
- ✅ Agrupar múltiplas ferramentas em um único link
- ✅ Navegação sequencial ou por menu
- ✅ URLs personalizadas com `user_slug`
- ✅ Short codes e QR codes
- ✅ Estatísticas consolidadas

---

### **2. Estrutura no Banco de Dados**

#### **2.1. Tabela `wellness_portals`**

```sql
wellness_portals
├── id (UUID)                    # ID único
├── user_id (UUID)               # Usuário criador
├── name (VARCHAR)               # Nome do portal
├── slug (VARCHAR)                # URL: "portal-completo"
├── description (TEXT)            # Descrição
├── navigation_type (VARCHAR)     # 'menu' | 'sequential'
├── status (VARCHAR)               # 'active' | 'inactive' | 'draft'
├── short_code (VARCHAR(20))      # Código curto (único)
├── views (INTEGER)               # Visualizações
├── leads_count (INTEGER)         # Leads capturados
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

#### **2.2. Tabela `portal_tools` (Relacionamento)**

```sql
portal_tools
├── id (UUID)
├── portal_id (UUID)              # FK para wellness_portals
├── tool_id (UUID)                # FK para user_templates (ferramenta)
├── position (INTEGER)             # Ordem no portal
├── is_required (BOOLEAN)         # Obrigatório completar?
├── display_name (VARCHAR)       # Nome personalizado no portal
├── redirect_to_tool_id (UUID)    # Redirecionar para outra ferramenta?
└── created_at (TIMESTAMP)
```

**Relacionamento:**
- Um portal pode ter múltiplas ferramentas
- Cada ferramenta tem uma posição (ordem)
- Ferramentas podem ser obrigatórias ou opcionais

---

### **3. URLs de Portais**

#### **3.1. Estrutura de URLs**

**Com `user_slug`:**
```
ylada.app/pt/wellness/[user_slug]/portal/[slug]
Exemplo: ylada.app/pt/wellness/dr-joao/portal/avaliacao-completa
```

**Sem `user_slug`:**
```
ylada.app/pt/wellness/portal/[slug]
Exemplo: ylada.app/pt/wellness/portal/avaliacao-completa
```

**Com Short Code:**
```
ylada.app/p/[short_code]
Exemplo: ylada.app/p/portal-01
→ Redireciona para URL completa
```

#### **3.2. Validação de Slug**

**Regras:**
- ✅ Único por usuário
- ✅ Apenas letras, números e hífens
- ✅ Case-insensitive
- ✅ Normalização automática (acentos removidos)

**API de Validação:**
```typescript
GET /api/wellness/portals?slug=[slug]
// Retorna se slug está disponível para o usuário
```

---

### **4. Criação de Portal**

#### **4.1. Fluxo Completo**

**Página:** `/pt/wellness/portals/novo/page.tsx`

**Passos:**
1. **Informações Básicas:**
   - Nome do portal
   - Slug (URL personalizada)
   - Descrição
   - Tipo de navegação (Menu ou Sequencial)

2. **URL Encurtada** (ANTES da seleção de ferramentas):
   - Checkbox "Gerar URL Encurtada"
   - Opção de personalizar código
   - Validação em tempo real

3. **Seleção de Ferramentas:**
   - Lista de ferramentas criadas pelo usuário
   - Checkboxes para selecionar
   - Ordem das ferramentas (baseada na ordem de seleção)
   - Preview da ordem

4. **Salvar:**
   - Valida slug
   - Valida short_code (se fornecido)
   - Cria portal
   - Cria relacionamentos em `portal_tools`

**API Request:**
```typescript
POST /api/wellness/portals
{
  name: "Portal de Avaliação Completa",
  slug: "avaliacao-completa",
  description: "Avaliação completa de bem-estar",
  navigation_type: "sequential", // ou "menu"
  tool_ids: ["tool-id-1", "tool-id-2", "tool-id-3"], // IDs das ferramentas
  generate_short_url: true,
  custom_short_code: "portal-01" // Opcional
}
```

**API Response:**
```typescript
{
  success: true,
  data: {
    portal: {
      id: "...",
      name: "Portal de Avaliação Completa",
      slug: "avaliacao-completa",
      short_code: "portal-01",
      // ...
    }
  }
}
```

---

### **5. Edição de Portal**

#### **5.1. Fluxo de Edição**

**Página:** `/pt/wellness/portals/[id]/editar/page.tsx`

**Funcionalidades:**
- Editar informações básicas
- Adicionar/remover ferramentas
- Reordenar ferramentas
- Gerenciar short_code:
  - Ver short_code atual
  - Remover short_code
  - Adicionar novo short_code
  - Personalizar código

**API Request (Atualizar):**
```typescript
PUT /api/wellness/portals?id=...
{
  name: "Novo Nome",
  slug: "novo-slug",
  tool_ids: ["tool-1", "tool-2"], // Nova lista
  remove_short_code: false, // ou true para remover
  generate_short_url: true, // Se quiser adicionar/atualizar
  custom_short_code: "novo-codigo" // Opcional
}
```

---

### **6. Navegação em Portais**

#### **6.1. Tipo: Menu**

**Comportamento:**
- Usuário vê lista de todas as ferramentas
- Pode escolher qual completar primeiro
- Pode pular ferramentas (se não obrigatórias)
- Pode voltar e refazer ferramentas

**Interface:**
```
┌─────────────────────────────┐
│ Portal de Avaliação         │
├─────────────────────────────┤
│ 📋 Checklist Alimentar       │
│ 🧮 Calculadora IMC           │
│ 🎯 Quiz Personalizado        │
└─────────────────────────────┘
```

#### **6.2. Tipo: Sequencial**

**Comportamento:**
- Ferramentas aparecem em ordem fixa
- Primeira ferramenta sempre liberada
- Próximas liberadas após completar anteriores
- Não pode pular (se obrigatórias)

**Interface:**
```
┌─────────────────────────────┐
│ Portal de Avaliação          │
├─────────────────────────────┤
│ ✅ 1. Checklist Alimentar    │ ← Completo
│ 🔒 2. Calculadora IMC        │ ← Bloqueado
│ 🔒 3. Quiz Personalizado     │ ← Bloqueado
└─────────────────────────────┘
```

---

### **7. API de Portais**

#### **7.1. Listar Portais**

```typescript
GET /api/wellness/portals
// Retorna todos os portais do usuário autenticado

GET /api/wellness/portals?id=[id]
// Retorna portal específico
```

**Response:**
```typescript
{
  success: true,
  data: {
    portals: [
      {
        id: "...",
        name: "Portal Completo",
        slug: "portal-completo",
        short_code: "portal-01",
        navigation_type: "sequential",
        portal_tools: [
          {
            id: "...",
            position: 1,
            tool_id: "...",
            user_templates: {
              id: "...",
              title: "Checklist Alimentar",
              slug: "checklist-alimentar"
            }
          }
        ],
        views: 100,
        leads_count: 50
      }
    ],
    total: 1
  }
}
```

#### **7.2. Criar Portal**

```typescript
POST /api/wellness/portals
{
  name: string
  slug: string
  description?: string
  navigation_type: 'menu' | 'sequential'
  tool_ids: string[] // IDs das ferramentas
  generate_short_url?: boolean
  custom_short_code?: string
}
```

#### **7.3. Atualizar Portal**

```typescript
PUT /api/wellness/portals?id=[id]
{
  name?: string
  slug?: string
  description?: string
  navigation_type?: 'menu' | 'sequential'
  tool_ids?: string[] // Nova lista (substitui a anterior)
  remove_short_code?: boolean
  generate_short_url?: boolean
  custom_short_code?: string
}
```

#### **7.4. Deletar Portal**

```typescript
DELETE /api/wellness/portals?id=[id]
```

---

## 📝 FORMATO DE URLs

### **1. Estrutura Geral**

**Padrão:**
```
ylada.app/[lang]/[area]/[user_slug?]/[tipo]/[slug]
```

**Componentes:**
- `[lang]`: Idioma (`pt`, `en`, `es`)
- `[area]`: Área (`wellness`, `nutri`, `nutra`, `coach`)
- `[user_slug]`: Slug do usuário (opcional, se configurado)
- `[tipo]`: Tipo de recurso (`ferramenta`, `quiz`, `portal`)
- `[slug]`: Slug do recurso

---

### **2. URLs de Links (Ferramentas)**

#### **2.1. Com `user_slug`**

```
ylada.app/pt/wellness/[user_slug]/[slug]
Exemplo: ylada.app/pt/wellness/dr-joao/calculadora-imc
```

**Vantagens:**
- ✅ URL mais curta e profissional
- ✅ Personalizada com nome do profissional
- ✅ Melhor para SEO

#### **2.2. Sem `user_slug`**

```
ylada.app/pt/wellness/ferramenta/[id]
Exemplo: ylada.app/pt/wellness/ferramenta/abc123-def456-ghi789
```

**Quando usar:**
- Usuário não configurou `user_slug`
- Fallback automático

#### **2.3. Com Short Code**

```
ylada.app/p/[short_code]
Exemplo: ylada.app/p/abc123
→ Redireciona para URL completa
```

---

### **3. URLs de Quizzes**

#### **3.1. Com `user_slug`**

```
ylada.app/pt/wellness/[user_slug]/quiz/[slug]
Exemplo: ylada.app/pt/wellness/dr-joao/quiz/avaliacao-inicial
```

#### **3.2. Sem `user_slug`**

```
ylada.app/pt/wellness/quiz/[slug]
Exemplo: ylada.app/pt/wellness/quiz/avaliacao-inicial
```

#### **3.3. Com Short Code**

```
ylada.app/p/[short_code]
Exemplo: ylada.app/p/quiz-01
→ Redireciona para URL completa
```

---

### **4. URLs de Portais**

#### **4.1. Com `user_slug`**

```
ylada.app/pt/wellness/[user_slug]/portal/[slug]
Exemplo: ylada.app/pt/wellness/dr-joao/portal/avaliacao-completa
```

#### **4.2. Sem `user_slug`**

```
ylada.app/pt/wellness/portal/[slug]
Exemplo: ylada.app/pt/wellness/portal/avaliacao-completa
```

#### **4.3. Com Short Code**

```
ylada.app/p/[short_code]
Exemplo: ylada.app/p/portal-01
→ Redireciona para URL completa
```

---

### **5. Validação e Normalização de Slugs**

#### **5.1. Regras de Slug**

**Formato:**
- ✅ Apenas letras minúsculas, números e hífens
- ✅ Sem espaços ou caracteres especiais
- ✅ Sem acentos (normalizados)
- ✅ Sem hífens duplicados
- ✅ Sem hífens no início ou fim

**Exemplos:**
- `calculadora-imc` ✅
- `quiz-avaliacao-inicial` ✅
- `portal-completo-2024` ✅
- `Calculadora IMC` → `calculadora-imc` (normalizado)
- `Quiz de Avaliação` → `quiz-de-avaliacao` (normalizado)

#### **5.2. Função de Normalização**

```typescript
function gerarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .replace(/[^a-z0-9]+/g, '-') // Substitui não-alfanuméricos por hífen
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens do início/fim
}
```

#### **5.3. Validação de Unicidade**

**Links:**
- Slug deve ser único **por usuário**
- Mesmo slug pode existir para usuários diferentes

**Quizzes:**
- Slug deve ser único **por usuário**
- Mesmo slug pode existir para usuários diferentes

**Portais:**
- Slug deve ser único **por usuário**
- Mesmo slug pode existir para usuários diferentes

**Short Codes:**
- Código deve ser único **em todo o sistema**
- Verifica em `user_templates`, `quizzes` e `wellness_portals`

---

### **6. User Slug**

#### **6.1. O que é `user_slug`?**

**Definição:**
- Slug personalizado do usuário (ex: `dr-joao`, `nutri-maria`)
- Configurado em `/pt/wellness/configuracao`
- Usado para criar URLs mais profissionais

**Exemplo:**
- Sem `user_slug`: `ylada.app/pt/wellness/ferramenta/abc123`
- Com `user_slug`: `ylada.app/pt/wellness/dr-joao/calculadora-imc`

#### **6.2. Validação de `user_slug`**

**Regras:**
- ✅ Único em todo o sistema
- ✅ 3-30 caracteres
- ✅ Apenas letras, números e hífens
- ✅ Case-insensitive

**API de Verificação:**
```typescript
GET /api/wellness/profile?check_slug=[slug]
// Retorna se slug está disponível
```

#### **6.3. Uso em URLs**

**Lógica de Construção:**
```typescript
// Se user_slug existe e profession é wellness
if (user_slug && profession === 'wellness') {
  url = `/pt/wellness/${user_slug}/${slug}`
} else {
  url = `/pt/wellness/ferramenta/${id}`
}
```

---

## 📋 PASSO A PASSO COMPLETO

### **1. Criar Link com Short Code**

#### **Passo 1: Acessar Criação**
```
/pt/wellness/ferramentas/nova
```

#### **Passo 2: Selecionar Template**
- Escolher template da lista
- Ver preview (opcional)

#### **Passo 3: Personalizar**
- **URL (slug):** `minha-avaliacao`
- **Título:** "Minha Avaliação Personalizada"
- **Emoji:** 🍽️
- **Cores:** Verde (#10B981)
- **CTA:** WhatsApp ou URL externa

#### **Passo 4: Gerar URL Encurtada**
- ✅ Marcar checkbox "Gerar URL Encurtada"
- Opcionalmente marcar "Personalizar Código"
- Se personalizar, digitar código (ex: `minha-avaliacao`)
- Sistema valida em tempo real
- Ver mensagem: "✅ Código disponível!" ou "❌ Este código já está em uso"

#### **Passo 5: Salvar**
- Clicar em "Criar Link"
- Sistema cria link com short_code
- Redireciona para listagem

#### **Passo 6: Verificar**
- Acessar `/pt/wellness/ferramentas`
- Ver link criado com:
  - URL completa: `ylada.app/pt/wellness/usuario/minha-avaliacao`
  - URL encurtada: `ylada.app/p/minha-avaliacao`
  - QR Code gerado automaticamente
  - Botão "Copiar" para copiar URL encurtada

---

### **2. Criar Quiz com Short Code**

#### **Passo 1: Acessar Criação**
```
/pt/wellness/quiz-personalizado
```

#### **Passo 2: Informações Básicas**
- **Título:** "Avaliação Inicial"
- **Descrição:** "Avalie seu bem-estar"
- **Emoji:** 🎯
- **Slug:** `avaliacao-inicial`

#### **Passo 3: Configurar Perguntas**
- Adicionar perguntas (múltipla escolha ou dissertativa)
- Definir ordem
- Marcar obrigatórias

#### **Passo 4: Configurar Entrega**
- Tipo: Página, WhatsApp ou URL
- Personalizar CTA
- Configurar coleta de dados

#### **Passo 5: Gerar URL Encurtada**
- ✅ Marcar "Gerar URL Encurtada"
- Opcionalmente personalizar código
- Validar em tempo real

#### **Passo 6: Salvar**
- Clicar em "Salvar Quiz"
- Sistema cria quiz com short_code

#### **Passo 7: Verificar**
- Acessar `/pt/wellness/quizzes`
- Ver quiz com URL encurtada e QR Code

---

### **3. Criar Portal com Short Code**

#### **Passo 1: Acessar Criação**
```
/pt/wellness/portals/novo
```

#### **Passo 2: Informações Básicas**
- **Nome:** "Portal de Avaliação Completa"
- **Slug:** `avaliacao-completa`
- **Descrição:** "Avaliação completa de bem-estar"
- **Tipo de Navegação:** Menu ou Sequencial

#### **Passo 3: URL Encurtada** (ANTES de selecionar ferramentas)
- ✅ Marcar "Gerar URL Encurtada"
- Opcionalmente personalizar código
- Validar em tempo real

#### **Passo 4: Selecionar Ferramentas**
- Ver lista de ferramentas criadas
- Marcar checkboxes das ferramentas desejadas
- Ordem baseada na ordem de seleção
- Ver preview da ordem

#### **Passo 5: Salvar**
- Clicar em "Criar Portal"
- Sistema cria portal e relacionamentos

#### **Passo 6: Verificar**
- Acessar `/pt/wellness/portals`
- Ver portal com URL encurtada e QR Code

---

### **4. Editar Link e Gerenciar Short Code**

#### **Passo 1: Acessar Edição**
```
/pt/wellness/ferramentas/[id]/editar
```

#### **Passo 2: Ver Short Code Atual** (se existir)
- Exibe URL encurtada atual
- Botão "Remover" para remover short_code

#### **Passo 3: Adicionar/Editar Short Code**
- Se não tem, opção de gerar novo
- Se tem, opção de remover e criar novo
- Personalizar código (opcional)
- Validar em tempo real

#### **Passo 4: Salvar**
- Clicar em "Salvar Alterações"
- Sistema atualiza short_code

---

### **5. Testar Short Code**

#### **Passo 1: Copiar URL Encurtada**
- Acessar listagem de links/quizzes/portais
- Copiar URL encurtada (ex: `ylada.app/p/abc123`)

#### **Passo 2: Testar Redirecionamento**
- Abrir nova aba anônima
- Colar URL encurtada
- Verificar redirecionamento para URL completa

#### **Passo 3: Testar QR Code**
- Escanear QR Code com celular
- Verificar redirecionamento

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO PARA OUTRAS ÁREAS

### **Fase 1: Short Codes e QR Codes**

#### **Backend:**
- [ ] Executar SQL: `schema-short-url-qrcode.sql` (se não executado)
- [ ] Executar SQL: `schema-short-code-quizzes-portals.sql` (se não executado)
- [ ] Criar API `/api/[area]/check-short-code/route.ts`
- [ ] Atualizar API `/api/[area]/ferramentas/route.ts` (POST e PUT) para suportar short codes
- [ ] Atualizar API `/api/[area]/quizzes/route.ts` (POST e PUT) para suportar short codes
- [ ] Atualizar API `/api/[area]/portals/route.ts` (POST e PUT) para suportar short codes
- [ ] Verificar rota `/p/[code]/route.ts` (já funciona para todas as áreas)

#### **Frontend:**
- [ ] Adicionar componente `QRCode.tsx` (já existe, reutilizar)
- [ ] Atualizar `/pt/[area]/ferramentas/nova/page.tsx` com UI de short code
- [ ] Atualizar `/pt/[area]/ferramentas/[id]/editar/page.tsx` com UI de short code
- [ ] Atualizar `/pt/[area]/ferramentas/page.tsx` para exibir short code e QR code
- [ ] Atualizar `/pt/[area]/quiz-personalizado/page.tsx` com UI de short code
- [ ] Atualizar `/pt/[area]/quizzes/page.tsx` para exibir short code e QR code
- [ ] Atualizar `/pt/[area]/portals/novo/page.tsx` com UI de short code (ANTES da seleção de ferramentas)
- [ ] Atualizar `/pt/[area]/portals/[id]/editar/page.tsx` com UI de short code
- [ ] Atualizar `/pt/[area]/portals/page.tsx` para exibir short code e QR code

#### **Middleware:**
- [ ] Verificar que `/p/` está excluído do redirecionamento automático de idioma

---

### **Fase 2: Portais**

#### **Backend:**
- [ ] Executar SQL: `schema-wellness-portals.sql` (adaptar para outras áreas se necessário)
- [ ] Criar API `/api/[area]/portals/route.ts` (GET, POST, PUT, DELETE)
- [ ] Implementar validação de slug único por usuário
- [ ] Implementar relacionamento com ferramentas via `portal_tools`

#### **Frontend:**
- [ ] Criar `/pt/[area]/portals/page.tsx` (listagem)
- [ ] Criar `/pt/[area]/portals/novo/page.tsx` (criação)
- [ ] Criar `/pt/[area]/portals/[id]/editar/page.tsx` (edição)
- [ ] Criar página de visualização do portal (para usuários finais)
- [ ] Implementar navegação sequencial
- [ ] Implementar navegação por menu

---

### **Fase 3: Formatação de URLs**

#### **Backend:**
- [ ] Verificar função de normalização de slug
- [ ] Implementar validação de `user_slug` único
- [ ] Atualizar lógica de construção de URLs para usar `user_slug` quando disponível

#### **Frontend:**
- [ ] Criar página `/pt/[area]/configuracao/page.tsx` (se não existir)
- [ ] Adicionar campo para configurar `user_slug`
- [ ] Implementar validação em tempo real de `user_slug`
- [ ] Atualizar todas as URLs para usar `user_slug` quando disponível

---

## 🎯 RESUMO EXECUTIVO

### **Short Codes e QR Codes:**
- ✅ URLs encurtadas (`/p/[code]`) para links, quizzes e portais
- ✅ Geração automática ou personalizada
- ✅ Validação cruzada em todas as tabelas
- ✅ QR Codes gerados automaticamente
- ✅ Redirecionamento inteligente baseado em `user_slug`

### **Portais:**
- ✅ Agrupamento de múltiplas ferramentas
- ✅ Navegação sequencial ou por menu
- ✅ URLs personalizadas
- ✅ Short codes e QR codes
- ✅ Estatísticas consolidadas

### **Formatação de URLs:**
- ✅ URLs com `user_slug` (mais profissionais)
- ✅ Fallback para URLs com ID (se `user_slug` não configurado)
- ✅ Short codes como alternativa
- ✅ Normalização automática de slugs

### **Pronto para Duplicação:**
- ✅ Documentação completa
- ✅ Checklist de implementação
- ✅ Exemplos de código
- ✅ Fluxos passo a passo

**Pronto para implementação nas outras áreas!** 🚀

