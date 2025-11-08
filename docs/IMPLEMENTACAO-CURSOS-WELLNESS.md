# 📚 Implementação: Área de Cursos Wellness

> **📌 Nota:** Este documento descreve a implementação específica para a área Wellness. Para duplicar este sistema para outras áreas (Nutri, Coach, Nutra), consulte o guia: [`GUIA-DUPLICACAO-CURSOS-PARA-OUTRAS-AREAS.md`](./GUIA-DUPLICACAO-CURSOS-PARA-OUTRAS-AREAS.md)

## 📋 Visão Geral

Sistema completo de cursos wellness com hierarquia de **Módulo → Tópico → Material (Curso)**, incluindo área administrativa para gerenciamento e área do usuário para consumo.

**Estrutura hierárquica:**
- **Módulo** (biblioteca independente)
  - **Tópico** (dentro do módulo)
    - **Material/Curso** (PDF, vídeo ou imagem dentro do tópico)

---

## 🗄️ Estrutura de Banco de Dados (Supabase)

### 1. Tabela: `wellness_cursos`

```sql
CREATE TABLE wellness_cursos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(50) NOT NULL, -- 'tutorial' ou 'filosofia'
  thumbnail_url TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wellness_cursos_ordem ON wellness_cursos(ordem);
CREATE INDEX idx_wellness_cursos_ativo ON wellness_cursos(ativo);
CREATE INDEX idx_wellness_cursos_slug ON wellness_cursos(slug);
```

### 2. Tabela: `wellness_curso_modulos`

```sql
CREATE TABLE wellness_curso_modulos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curso_id UUID NOT NULL REFERENCES wellness_cursos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wellness_curso_modulos_curso ON wellness_curso_modulos(curso_id);
CREATE INDEX idx_wellness_curso_modulos_ordem ON wellness_curso_modulos(curso_id, ordem);
```

### 3. Tabela: `wellness_curso_materiais`

```sql
CREATE TABLE wellness_curso_materiais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modulo_id UUID NOT NULL REFERENCES wellness_curso_modulos(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('pdf', 'video')),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL, -- URL do arquivo no Supabase Storage
  duracao INTEGER, -- Duração em segundos (para vídeos)
  ordem INTEGER NOT NULL DEFAULT 0,
  gratuito BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wellness_curso_materiais_modulo ON wellness_curso_materiais(modulo_id);
CREATE INDEX idx_wellness_curso_materiais_ordem ON wellness_curso_materiais(modulo_id, ordem);
CREATE INDEX idx_wellness_curso_materiais_tipo ON wellness_curso_materiais(tipo);
```

### 4. Tabela: `wellness_curso_progresso`

```sql
CREATE TABLE wellness_curso_progresso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES wellness_cursos(id) ON DELETE CASCADE,
  modulo_id UUID REFERENCES wellness_curso_modulos(id) ON DELETE CASCADE,
  material_id UUID REFERENCES wellness_curso_materiais(id) ON DELETE CASCADE,
  concluido BOOLEAN DEFAULT false,
  tempo_assistido INTEGER DEFAULT 0, -- Tempo em segundos
  ultimo_acesso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, material_id)
);

CREATE INDEX idx_wellness_curso_progresso_user ON wellness_curso_progresso(user_id);
CREATE INDEX idx_wellness_curso_progresso_curso ON wellness_curso_progresso(curso_id);
CREATE INDEX idx_wellness_curso_progresso_material ON wellness_curso_progresso(material_id);
CREATE INDEX idx_wellness_curso_progresso_user_curso ON wellness_curso_progresso(user_id, curso_id);
```

### 5. Supabase Storage Buckets

Criar buckets no Supabase Storage:
- `wellness-cursos-pdfs` - Para arquivos PDF
- `wellness-cursos-videos` - Para arquivos de vídeo
- `wellness-cursos-thumbnails` - Para imagens de capa dos cursos

**Políticas RLS:**
- Upload: Apenas usuários autenticados com role admin
- Download: Usuários autenticados podem baixar arquivos dos cursos

---

## 📁 Estrutura de Pastas do Projeto

```
src/
├── app/
│   ├── admin/
│   │   └── wellness/
│   │       └── cursos/
│   │           ├── page.tsx (Lista de cursos)
│   │           ├── novo/
│   │           │   └── page.tsx (Criar novo curso)
│   │           └── [id]/
│   │               ├── page.tsx (Editar curso)
│   │               └── modulos/
│   │                   └── [moduloId]/
│   │                       └── page.tsx (Gerenciar materiais)
│   │
│   └── pt/
│       └── wellness/
│           └── cursos/
│               ├── page.tsx (Lista de cursos para usuário)
│               └── [slug]/
│                   └── page.tsx (Player do curso)
│
├── components/
│   ├── wellness-cursos/
│   │   ├── CursoCard.tsx (Card de curso na lista)
│   │   ├── VideoPlayer.tsx (Player de vídeo)
│   │   ├── PDFViewer.tsx (Visualizador de PDF)
│   │   ├── MaterialList.tsx (Lista de módulos/materiais)
│   │   ├── ProgressBar.tsx (Barra de progresso)
│   │   └── ModuleAccordion.tsx (Acordeão de módulos)
│   │
│   └── admin/
│       └── wellness-cursos/
│           ├── CursoForm.tsx (Formulário de curso)
│           ├── ModuloForm.tsx (Formulário de módulo)
│           ├── MaterialForm.tsx (Formulário de material)
│           ├── MaterialUpload.tsx (Upload de arquivos)
│           └── CursoList.tsx (Lista administrativa)
│
├── lib/
│   ├── wellness-cursos.ts (Lógica de negócio)
│   ├── storage.ts (Upload/download de arquivos)
│   └── supabase-admin.ts (Cliente Supabase admin)
│
└── types/
    └── wellness-cursos.ts (Tipos TypeScript)
```

---

## 🎯 Fases de Implementação

### **FASE 1: Setup Inicial** ✅

- [ ] Criar tabelas no Supabase
- [ ] Criar buckets de storage
- [ ] Configurar políticas RLS
- [ ] Criar tipos TypeScript
- [ ] Criar estrutura de pastas

### **FASE 2: API Routes** ✅

- [ ] `/api/wellness/cursos` - CRUD de cursos
- [ ] `/api/wellness/cursos/[id]/modulos` - CRUD de módulos
- [ ] `/api/wellness/cursos/[id]/modulos/[moduloId]/materiais` - CRUD de materiais
- [ ] `/api/wellness/cursos/[id]/progresso` - Gerenciar progresso
- [ ] `/api/wellness/cursos/upload` - Upload de arquivos

### **FASE 3: Área Administrativa** ✅

- [ ] Lista de cursos (CRUD)
- [ ] Formulário de criação/edição de curso
- [ ] Gerenciamento de módulos (drag & drop para reordenar)
- [ ] Gerenciamento de materiais por módulo
- [ ] Upload de PDFs e vídeos
- [ ] Preview de materiais

### **FASE 4: Área do Usuário** ✅

- [ ] Lista de cursos (grid com thumbnails)
- [ ] Filtros por categoria
- [ ] Página do curso com player
- [ ] Sidebar com lista de módulos/materiais
- [ ] Player de vídeo
- [ ] Visualizador de PDF
- [ ] Barra de progresso
- [ ] Navegação entre materiais

### **FASE 5: Funcionalidades Avançadas** ✅

- [ ] Salvar progresso automaticamente
- [ ] Continuar de onde parou
- [ ] Certificados de conclusão
- [ ] Estatísticas de visualização
- [ ] Busca de cursos

---

## 📝 Detalhamento das Funcionalidades

### **1. Upload de Arquivos**

**Componente: `MaterialUpload.tsx`**
- Drag & drop ou botão de seleção
- Validação de tipo (PDF ou vídeo)
- Validação de tamanho (máx 100MB para vídeos, 10MB para PDFs)
- Preview antes do upload
- Barra de progresso
- Upload para Supabase Storage
- Retornar URL do arquivo

**Bibliotecas sugeridas:**
- `react-dropzone` para drag & drop
- `@supabase/supabase-js` para upload

### **2. Player de Vídeo**

**Componente: `VideoPlayer.tsx`**
- Usar `react-player` ou `video.js`
- Controles: play/pause, volume, velocidade, fullscreen
- Salvar progresso automaticamente a cada 10 segundos
- Marcar como concluído ao atingir 90% do vídeo
- Mostrar tempo restante

### **3. Visualizador de PDF**

**Componente: `PDFViewer.tsx`**
- Usar `react-pdf` ou iframe
- Controles: zoom, navegação de páginas
- Marcar como concluído ao visualizar 80% das páginas
- Opção de download (se permitido)

### **4. Lista de Módulos/Materiais**

**Componente: `MaterialList.tsx`**
- Acordeão expansível por módulo
- Indicador de progresso por módulo
- Badge "Concluído" quando todos materiais estão feitos
- Highlight do material atual
- Navegação clicável para cada material

### **5. Barra de Progresso**

**Componente: `ProgressBar.tsx`**
- Calcular: (materiais concluídos / total de materiais) * 100
- Mostrar porcentagem
- Mostrar "X de Y materiais concluídos"
- Animações suaves

---

## 🔐 Segurança e Permissões

### **RLS Policies (Row Level Security)**

**wellness_cursos:**
- SELECT: Todos usuários autenticados podem ver cursos ativos
- INSERT/UPDATE/DELETE: Apenas admins

**wellness_curso_modulos:**
- SELECT: Todos usuários autenticados
- INSERT/UPDATE/DELETE: Apenas admins

**wellness_curso_materiais:**
- SELECT: Todos usuários autenticados
- INSERT/UPDATE/DELETE: Apenas admins

**wellness_curso_progresso:**
- SELECT: Usuário pode ver apenas seu próprio progresso
- INSERT/UPDATE: Usuário pode criar/atualizar apenas seu próprio progresso
- DELETE: Apenas admins

### **Storage Policies**

- Upload: Apenas admins
- Download: Usuários autenticados podem baixar arquivos dos cursos

---

## 🎨 Design e UX

### **Área Administrativa:**
- Layout limpo e organizado
- Drag & drop para reordenar módulos e materiais
- Preview de vídeos e PDFs antes de publicar
- Validações claras de formulários
- Mensagens de sucesso/erro

### **Área do Usuário:**
- Design moderno e intuitivo
- Player centralizado e responsivo
- Sidebar colapsável em mobile
- Animações suaves
- Feedback visual de progresso
- Navegação clara entre materiais

---

## 📊 Queries Úteis

### **Listar cursos com progresso do usuário:**
```sql
SELECT 
  c.*,
  COUNT(DISTINCT m.id) as total_materiais,
  COUNT(DISTINCT CASE WHEN p.concluido THEN p.material_id END) as materiais_concluidos
FROM wellness_cursos c
LEFT JOIN wellness_curso_modulos mod ON mod.curso_id = c.id
LEFT JOIN wellness_curso_materiais m ON m.modulo_id = mod.id
LEFT JOIN wellness_curso_progresso p ON p.material_id = m.id AND p.user_id = $1
WHERE c.ativo = true
GROUP BY c.id
ORDER BY c.ordem;
```

### **Calcular progresso de um curso:**
```sql
SELECT 
  COUNT(DISTINCT m.id) as total,
  COUNT(DISTINCT CASE WHEN p.concluido THEN m.id END) as concluidos
FROM wellness_cursos c
JOIN wellness_curso_modulos mod ON mod.curso_id = c.id
JOIN wellness_curso_materiais m ON m.modulo_id = mod.id
LEFT JOIN wellness_curso_progresso p ON p.material_id = m.id AND p.user_id = $1
WHERE c.id = $2;
```

---

## 🚀 Próximos Passos

1. **Criar SQL de migração** com todas as tabelas
2. **Implementar tipos TypeScript**
3. **Criar API routes básicas**
4. **Implementar área administrativa**
5. **Implementar área do usuário**
6. **Testes e ajustes**

---

## 📌 Notas Importantes

- Vídeos grandes podem precisar de compressão antes do upload
- Considerar usar CDN para vídeos (opcional)
- Implementar cache para listas de cursos
- Adicionar analytics de visualização
- Considerar sistema de comentários/avaliações no futuro

---

**Status:** 📝 Documento criado - Aguardando início da implementação

