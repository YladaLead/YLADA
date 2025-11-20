# 📚 Estrutura de Construção - Área de Cursos (Filosofia ILADA)

## 🎯 OBJETIVO

Criar a estrutura completa para a área de Cursos/Filosofia ILADA, permitindo que os materiais sejam adicionados posteriormente sem necessidade de alterações estruturais.

---

## 📁 ESTRUTURA DE PASTAS E ARQUIVOS

### 1. Frontend - Páginas

```
src/app/pt/nutri/cursos/
├── page.tsx                          # Página principal (lista de trilhas, microcursos, biblioteca)
├── [trilhaId]/
│   ├── page.tsx                      # Detalhes da trilha (módulos, progresso)
│   └── [moduloId]/
│       ├── page.tsx                  # Detalhes do módulo (aulas, materiais)
│       └── [aulaId]/
│           └── page.tsx              # Player de aula (vídeo, conteúdo, exercícios)
├── microcursos/
│   ├── page.tsx                      # Lista de microcursos
│   └── [microcursoId]/
│       └── page.tsx                  # Player do microcurso
├── biblioteca/
│   ├── page.tsx                      # Biblioteca de recursos
│   └── [categoria]/
│       └── page.tsx                  # Recursos por categoria
├── tutoriais/
│   ├── page.tsx                      # Tutoriais das ferramentas
│   └── [tutorialId]/
│       └── page.tsx                  # Player do tutorial
└── meus-cursos/
    └── page.tsx                      # Dashboard pessoal (progresso, favoritos, continuar)
```

### 2. Frontend - Componentes

```
src/components/nutri/cursos/
├── TrilhaCard.tsx                    # Card de trilha (com progresso)
├── MicrocursoCard.tsx                # Card de microcurso (carrossel)
├── BibliotecaItem.tsx                # Item da biblioteca (PDF, template, etc)
├── TutorialCard.tsx                  # Card de tutorial
├── PlayerAula.tsx                    # Player de vídeo/aula
├── ProgressoBar.tsx                  # Barra de progresso reutilizável
├── CertificadoCard.tsx               # Card de certificado
├── FavoritosList.tsx                 # Lista de favoritos
├── ContinuarAgora.tsx                # Seção "Continuar de onde parei"
└── DashboardProgresso.tsx            # Dashboard de progresso geral
```

### 3. APIs

```
src/app/api/nutri/cursos/
├── route.ts                          # GET: Listar trilhas, microcursos, biblioteca
├── [trilhaId]/
│   ├── route.ts                      # GET: Detalhes da trilha
│   ├── progresso/
│   │   └── route.ts                  # GET/POST: Progresso da trilha
│   └── certificado/
│       └── route.ts                  # GET: Gerar certificado
├── microcursos/
│   ├── route.ts                      # GET: Listar microcursos
│   └── [microcursoId]/
│       └── route.ts                  # GET: Detalhes do microcurso
├── biblioteca/
│   ├── route.ts                      # GET: Listar recursos da biblioteca
│   └── [categoria]/
│       └── route.ts                  # GET: Recursos por categoria
├── tutoriais/
│   ├── route.ts                      # GET: Listar tutoriais
│   └── [tutorialId]/
│       └── route.ts                  # GET: Detalhes do tutorial
├── favoritos/
│   ├── route.ts                      # GET/POST: Listar/adicionar favoritos
│   └── [itemId]/
│       └── route.ts                  # DELETE: Remover favorito
└── progresso/
    └── route.ts                      # GET: Progresso geral do usuário
```

### 4. Schema do Banco de Dados

```sql
-- Tabela principal de trilhas/cursos
CREATE TABLE cursos_trilhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  banner_url TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
  ordem INTEGER DEFAULT 0,
  estimated_hours DECIMAL(5,2),
  level VARCHAR(50), -- iniciante, intermediario, avancado
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Módulos dentro de uma trilha
CREATE TABLE cursos_modulos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trilha_id UUID REFERENCES cursos_trilhas(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  ordem INTEGER NOT NULL,
  estimated_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aulas dentro de um módulo
CREATE TABLE cursos_aulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id UUID REFERENCES cursos_modulos(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL, -- video, texto, quiz, exercicio
  content_url TEXT, -- URL do vídeo, PDF, etc
  content_text TEXT, -- Conteúdo em texto (markdown)
  duration_minutes INTEGER,
  ordem INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false, -- Aula gratuita de preview
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Microcursos (cursos rápidos)
CREATE TABLE cursos_microcursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Biblioteca de recursos
CREATE TABLE cursos_biblioteca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_type VARCHAR(50) NOT NULL, -- pdf, template, script, planilha, etc
  file_url TEXT NOT NULL,
  category VARCHAR(100) NOT NULL, -- scripts, templates, pdfs, planilhas, etc
  thumbnail_url TEXT,
  download_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutoriais das ferramentas
CREATE TABLE cursos_tutoriais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  tool_name VARCHAR(100), -- Nome da ferramenta (ex: "Quiz", "Links Personalizados")
  tool_slug VARCHAR(100), -- Slug da ferramenta para link direto
  video_url TEXT,
  duration_minutes INTEGER,
  level VARCHAR(50), -- basico, intermediario, avancado
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progresso do usuário
CREATE TABLE cursos_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL, -- trilha, microcurso, tutorial
  item_id UUID NOT NULL,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  last_position INTEGER DEFAULT 0, -- Para vídeos: segundo onde parou
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- Favoritos
CREATE TABLE cursos_favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL, -- trilha, microcurso, tutorial, biblioteca
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- Certificados
CREATE TABLE cursos_certificados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trilha_id UUID REFERENCES cursos_trilhas(id) ON DELETE CASCADE,
  certificate_url TEXT, -- URL do PDF do certificado
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, trilha_id)
);

-- Materiais complementares (anexos, downloads)
CREATE TABLE cursos_materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aula_id UUID REFERENCES cursos_aulas(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_cursos_trilhas_user_id ON cursos_trilhas(user_id);
CREATE INDEX idx_cursos_trilhas_status ON cursos_trilhas(status);
CREATE INDEX idx_cursos_modulos_trilha_id ON cursos_modulos(trilha_id);
CREATE INDEX idx_cursos_aulas_modulo_id ON cursos_aulas(modulo_id);
CREATE INDEX idx_cursos_progresso_user_id ON cursos_progresso(user_id);
CREATE INDEX idx_cursos_progresso_item ON cursos_progresso(item_type, item_id);
CREATE INDEX idx_cursos_favoritos_user_id ON cursos_favoritos(user_id);
CREATE INDEX idx_cursos_biblioteca_category ON cursos_biblioteca(category);
CREATE INDEX idx_cursos_biblioteca_status ON cursos_biblioteca(status);

-- RLS Policies
ALTER TABLE cursos_trilhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_microcursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_biblioteca ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_tutoriais ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_certificados ENABLE ROW LEVEL SECURITY;

-- Policies: Usuários podem ver apenas cursos publicados ou seus próprios
CREATE POLICY "Users can view published courses"
  ON cursos_trilhas FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

CREATE POLICY "Users can view published microcursos"
  ON cursos_microcursos FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

CREATE POLICY "Users can view published biblioteca"
  ON cursos_biblioteca FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

CREATE POLICY "Users can view published tutoriais"
  ON cursos_tutoriais FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

-- Policies: Usuários podem gerenciar apenas seu próprio progresso
CREATE POLICY "Users can manage own progress"
  ON cursos_progresso FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own favorites"
  ON cursos_favoritos FOR ALL
  USING (user_id = auth.uid());
```

---

## 🎨 COMPONENTES BASE

### 1. TrilhaCard.tsx
```typescript
interface TrilhaCardProps {
  trilha: {
    id: string
    title: string
    description: string
    thumbnail_url?: string
    estimated_hours: number
    progress_percentage: number
    level: string
  }
  onContinue?: () => void
}
```

### 2. PlayerAula.tsx
```typescript
interface PlayerAulaProps {
  aula: {
    id: string
    title: string
    content_type: 'video' | 'texto' | 'quiz'
    content_url?: string
    content_text?: string
    duration_minutes: number
  }
  onComplete?: () => void
  onProgress?: (progress: number) => void
}
```

### 3. ProgressoBar.tsx
```typescript
interface ProgressoBarProps {
  percentage: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}
```

---

## 📊 ESTRUTURA DE DADOS (TYPES)

```typescript
// src/types/cursos.ts

export interface Trilha {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  thumbnail_url?: string
  banner_url?: string
  status: 'draft' | 'published' | 'archived'
  ordem: number
  estimated_hours: number
  level: 'iniciante' | 'intermediario' | 'avancado'
  is_premium: boolean
  progress_percentage?: number
  modulos_count?: number
  aulas_count?: number
  created_at: string
  updated_at: string
}

export interface Modulo {
  id: string
  trilha_id: string
  title: string
  description: string
  ordem: number
  estimated_minutes: number
  aulas_count?: number
  progress_percentage?: number
}

export interface Aula {
  id: string
  modulo_id: string
  title: string
  description: string
  content_type: 'video' | 'texto' | 'quiz' | 'exercicio'
  content_url?: string
  content_text?: string
  duration_minutes: number
  ordem: number
  is_preview: boolean
  completed?: boolean
  last_position?: number
}

export interface Microcurso {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url?: string
  video_url: string
  duration_minutes: number
  category: string
  is_featured: boolean
  progress_percentage?: number
}

export interface BibliotecaItem {
  id: string
  title: string
  description: string
  file_type: 'pdf' | 'template' | 'script' | 'planilha' | 'mensagem'
  file_url: string
  category: string
  thumbnail_url?: string
  download_count: number
}

export interface Tutorial {
  id: string
  title: string
  slug: string
  description: string
  tool_name: string
  tool_slug: string
  video_url: string
  duration_minutes: number
  level: 'basico' | 'intermediario' | 'avancado'
}

export interface ProgressoGeral {
  trilhas_completas: number
  trilhas_em_andamento: number
  microcursos_assistidos: number
  horas_estudadas: number
  certificados_obtidos: number
}
```

---

## 🚀 PLANO DE IMPLEMENTAÇÃO (FASES)

### FASE 1: Estrutura Base (Semana 1-2)
1. ✅ Criar schema do banco de dados
2. ✅ Criar estrutura de pastas
3. ✅ Criar tipos TypeScript
4. ✅ Criar APIs básicas (GET apenas)
5. ✅ Criar página principal `/cursos`

### FASE 2: Componentes Base (Semana 3-4)
1. ✅ Criar componentes de cards (TrilhaCard, MicrocursoCard, etc)
2. ✅ Criar PlayerAula básico
3. ✅ Criar ProgressoBar
4. ✅ Integrar com APIs

### FASE 3: Funcionalidades Core (Semana 5-6)
1. ✅ Sistema de progresso (salvar posição, marcar como completo)
2. ✅ Sistema de favoritos
3. ✅ "Continuar de onde parei"
4. ✅ Dashboard de progresso

### FASE 4: Conteúdo e Refinamento (Semana 7+)
1. ✅ Adicionar conteúdo inicial (2 trilhas + microcursos)
2. ✅ Sistema de certificados
3. ✅ Busca e filtros
4. ✅ Melhorias de UX

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Backend
- [ ] Criar migration com todas as tabelas
- [ ] Criar RLS policies
- [ ] Criar APIs GET para listagem
- [ ] Criar APIs GET para detalhes
- [ ] Criar APIs POST para progresso
- [ ] Criar APIs para favoritos
- [ ] Criar API para certificados

### Frontend - Páginas
- [ ] `/cursos` - Página principal
- [ ] `/cursos/[trilhaId]` - Detalhes da trilha
- [ ] `/cursos/[trilhaId]/[moduloId]` - Detalhes do módulo
- [ ] `/cursos/[trilhaId]/[moduloId]/[aulaId]` - Player de aula
- [ ] `/cursos/microcursos` - Lista de microcursos
- [ ] `/cursos/microcursos/[id]` - Player de microcurso
- [ ] `/cursos/biblioteca` - Biblioteca
- [ ] `/cursos/tutoriais` - Tutoriais
- [ ] `/cursos/meus-cursos` - Dashboard pessoal

### Frontend - Componentes
- [ ] TrilhaCard
- [ ] MicrocursoCard
- [ ] BibliotecaItem
- [ ] TutorialCard
- [ ] PlayerAula
- [ ] ProgressoBar
- [ ] CertificadoCard
- [ ] FavoritosList
- [ ] ContinuarAgora
- [ ] DashboardProgresso

### Integração
- [ ] Integrar com sidebar (menu Cursos)
- [ ] Adicionar notificações de progresso
- [ ] Integrar com sistema de autenticação
- [ ] Adicionar analytics/tracking

---

## 🎯 PRÓXIMOS PASSOS

1. **Criar migration SQL** - Estrutura completa do banco
2. **Criar estrutura de pastas** - Frontend e APIs
3. **Criar tipos TypeScript** - Interfaces e tipos
4. **Criar APIs básicas** - GET endpoints
5. **Criar página principal** - Layout e estrutura visual
6. **Criar componentes base** - Cards e elementos reutilizáveis

---

**Status:** Estrutura pronta para implementação
**Próxima ação:** Criar migration SQL e estrutura de pastas

