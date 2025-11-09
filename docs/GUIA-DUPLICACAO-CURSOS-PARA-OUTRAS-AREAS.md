# 📚 Guia: Duplicar Sistema de Cursos para Outras Áreas

## 📋 Visão Geral

Este documento explica como duplicar o sistema de cursos implementado para a área **Wellness** para outras áreas do sistema (Nutri, Coach, Nutra, etc.).

A estrutura atual usa: **Módulo → Tópico → Material (Curso)**

---

## 🗄️ Estrutura de Banco de Dados

### Padrão de Nomenclatura

Para cada área, criar tabelas seguindo o padrão: `{area}_curso_*`

**Exemplo para área "nutri":**
- `nutri_curso_modulos` (biblioteca de módulos)
- `nutri_modulo_topicos` (tópicos dentro de módulos)
- `nutri_curso_materiais` (materiais dentro de tópicos)
- `nutri_curso_progresso` (progresso dos usuários)

### Script SQL de Migração

Criar arquivo: `scripts/migrations/create-{area}-cursos-tables.sql`

**Template base:**

```sql
-- ============================================
-- TABELAS DE CURSOS: {AREA}
-- Descrição: Estrutura completa para cursos da área {AREA}
-- ============================================

-- 1. Tabela de Módulos (Biblioteca)
CREATE TABLE IF NOT EXISTS {area}_curso_modulos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curso_id UUID REFERENCES {area}_cursos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Tópicos (dentro de módulos)
CREATE TABLE IF NOT EXISTS {area}_modulo_topicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modulo_id UUID NOT NULL REFERENCES {area}_curso_modulos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Materiais/Cursos (dentro de tópicos)
CREATE TABLE IF NOT EXISTS {area}_curso_materiais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topico_id UUID NOT NULL REFERENCES {area}_modulo_topicos(id) ON DELETE CASCADE,
  modulo_id UUID REFERENCES {area}_curso_modulos(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('pdf', 'video')),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  duracao INTEGER,
  ordem INTEGER NOT NULL DEFAULT 0,
  gratuito BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Progresso
CREATE TABLE IF NOT EXISTS {area}_curso_progresso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES {area}_curso_materiais(id) ON DELETE CASCADE,
  concluido BOOLEAN DEFAULT false,
  tempo_assistido INTEGER DEFAULT 0,
  ultimo_acesso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, material_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_{area}_modulos_curso ON {area}_curso_modulos(curso_id);
CREATE INDEX IF NOT EXISTS idx_{area}_modulos_ordem ON {area}_curso_modulos(ordem);
CREATE INDEX IF NOT EXISTS idx_{area}_topicos_modulo ON {area}_modulo_topicos(modulo_id);
CREATE INDEX IF NOT EXISTS idx_{area}_topicos_ordem ON {area}_modulo_topicos(modulo_id, ordem);
CREATE INDEX IF NOT EXISTS idx_{area}_materiais_topico ON {area}_curso_materiais(topico_id);
CREATE INDEX IF NOT EXISTS idx_{area}_materiais_ordem ON {area}_curso_materiais(topico_id, ordem);
CREATE INDEX IF NOT EXISTS idx_{area}_progresso_user ON {area}_curso_progresso(user_id);
CREATE INDEX IF NOT EXISTS idx_{area}_progresso_material ON {area}_curso_progresso(material_id);

-- RLS Policies
ALTER TABLE {area}_curso_modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE {area}_modulo_topicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE {area}_curso_materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE {area}_curso_progresso ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura (todos autenticados)
CREATE POLICY "Usuários autenticados podem ver módulos {area}"
ON {area}_curso_modulos FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver tópicos {area}"
ON {area}_modulo_topicos FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver materiais {area}"
ON {area}_curso_materiais FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem ver seu próprio progresso {area}"
ON {area}_curso_progresso FOR SELECT
USING (auth.uid() = user_id);

-- Políticas de escrita (apenas admins)
CREATE POLICY "Apenas admins podem criar módulos {area}"
ON {area}_curso_modulos FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- (Repetir para UPDATE e DELETE em todas as tabelas)
-- (Repetir para tópicos, materiais)
-- (Progresso: usuários podem criar/atualizar seu próprio progresso)
```

### Storage Buckets

Criar buckets no Supabase Storage:

```sql
-- Bucket para PDFs e Imagens
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  '{area}-cursos-pdfs',
  '{area}-cursos-pdfs',
  false,
  52428800, -- 50MB
  ARRAY['application/pdf', 'application/x-pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf', 'application/x-pdf', 'image/jpeg', 'image/jpg', 'image/png'];

-- Bucket para Vídeos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  '{area}-cursos-videos',
  '{area}-cursos-videos',
  false,
  104857600, -- 100MB
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];

-- Bucket para Thumbnails (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  '{area}-cursos-thumbnails',
  '{area}-cursos-thumbnails',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
```

---

## 📁 Estrutura de Pastas

### 1. Types TypeScript

**Arquivo:** `src/types/{area}-cursos.ts`

Copiar de `src/types/wellness-cursos.ts` e substituir:
- `Wellness` → `{Area}` (ex: `Nutri`, `Coach`)
- `wellness` → `{area}` (ex: `nutri`, `coach`)

### 2. Lib Functions

**Arquivo:** `src/lib/{area}-cursos.ts` e `src/lib/{area}-modulos.ts`

Copiar de `src/lib/wellness-cursos.ts` e `src/lib/wellness-modulos.ts` e substituir:
- Nomes de tabelas: `wellness_*` → `{area}_*`
- Nomes de funções: `getCursosAtivos` → manter genérico ou adicionar prefixo

### 3. API Routes

**Estrutura:**
```
src/app/api/{area}/
├── modulos/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       ├── topicos/
│       │   ├── route.ts
│       │   └── [topicoId]/
│       │       ├── route.ts
│       │       └── cursos/
│       │           ├── route.ts
│       │           └── [cursoId]/
│       │               └── route.ts
│       └── materiais/ (opcional, para compatibilidade)
│
└── storage/
    └── signed-url/
        └── route.ts (compartilhado, não precisa duplicar)
```

**Substituições necessárias:**
- Nomes de tabelas: `wellness_*` → `{area}_*`
- Buckets: `wellness-cursos-*` → `{area}-cursos-*`
- Tipos: `WellnessCurso*` → `{Area}Curso*`

### 4. Admin Pages

**Estrutura:**
```
src/app/admin/{area}/
└── cursos/
    └── page.tsx (página unificada de gerenciamento)
```

**Substituições:**
- Importar tipos: `@/types/{area}-cursos`
- Importar libs: `@/lib/{area}-modulos`
- Rotas API: `/api/{area}/modulos/*`
- Buckets: `{area}-cursos-*`

### 5. User Pages

**Estrutura:**
```
src/app/pt/{area}/
└── cursos/
    ├── page.tsx (lista de módulos)
    └── modulos/
        └── [id]/
            └── page.tsx (player do módulo)
```

**Substituições:**
- Importar tipos: `@/types/{area}-cursos`
- Importar libs: `@/lib/{area}-modulos`
- Rotas API: `/api/{area}/modulos/*`
- NavBar: `{Area}NavBar` (se existir)

---

## 🔄 Checklist de Duplicação

### Passo 1: Banco de Dados
- [ ] Criar script SQL de migração (`create-{area}-cursos-tables.sql`)
- [ ] Substituir `{area}` por nome da área (ex: `nutri`, `coach`)
- [ ] Executar migração no Supabase
- [ ] Criar buckets de storage
- [ ] Configurar políticas RLS
- [ ] Testar permissões

### Passo 2: Types TypeScript
- [ ] Copiar `src/types/wellness-cursos.ts` → `src/types/{area}-cursos.ts`
- [ ] Substituir `Wellness` por `{Area}` em todos os tipos
- [ ] Substituir `wellness` por `{area}` em nomes de tabelas
- [ ] Verificar imports

### Passo 3: Lib Functions
- [ ] Copiar `src/lib/wellness-cursos.ts` → `src/lib/{area}-cursos.ts`
- [ ] Copiar `src/lib/wellness-modulos.ts` → `src/lib/{area}-modulos.ts`
- [ ] Substituir nomes de tabelas
- [ ] Substituir nomes de buckets
- [ ] Atualizar tipos importados

### Passo 4: API Routes
- [ ] Copiar estrutura de `src/app/api/wellness/modulos/` → `src/app/api/{area}/modulos/`
- [ ] Substituir nomes de tabelas em todas as rotas
- [ ] Substituir nomes de buckets
- [ ] Atualizar tipos importados
- [ ] Testar endpoints

### Passo 5: Admin Pages
- [ ] Copiar `src/app/admin/cursos/page.tsx` → `src/app/admin/{area}/cursos/page.tsx`
- [ ] Atualizar imports (tipos, libs)
- [ ] Atualizar rotas API
- [ ] Atualizar buckets
- [ ] Testar funcionalidades

### Passo 6: User Pages
- [ ] Copiar `src/app/pt/wellness/cursos/` → `src/app/pt/{area}/cursos/`
- [ ] Atualizar imports
- [ ] Atualizar rotas API
- [ ] Atualizar NavBar (se necessário)
- [ ] Testar visualização

### Passo 7: Componentes (se necessário)
- [ ] Verificar se componentes são genéricos ou precisam duplicar
- [ ] `SortableList` é genérico, pode reutilizar
- [ ] `CursoForm` pode precisar ajustes se houver diferenças por área

### Passo 8: Testes
- [ ] Criar módulo de teste
- [ ] Criar tópico de teste
- [ ] Criar material (PDF) de teste
- [ ] Criar material (vídeo) de teste
- [ ] Testar upload de arquivos
- [ ] Testar visualização na área do usuário
- [ ] Testar URLs assinadas
- [ ] Testar progresso

---

## 📝 Exemplo: Duplicando para Área "Nutri"

### 1. SQL Migration

```sql
-- Arquivo: scripts/migrations/create-nutri-cursos-tables.sql

-- Substituir {area} por nutri em todo o template
CREATE TABLE IF NOT EXISTS nutri_curso_modulos (...);
CREATE TABLE IF NOT EXISTS nutri_modulo_topicos (...);
CREATE TABLE IF NOT EXISTS nutri_curso_materiais (...);
CREATE TABLE IF NOT EXISTS nutri_curso_progresso (...);
```

### 2. Types

```typescript
// Arquivo: src/types/nutri-cursos.ts

export interface NutriCursoModulo {
  id: string
  curso_id: string | null
  titulo: string
  descricao: string | null
  ordem: number
  // ...
}
```

### 3. API Route

```typescript
// Arquivo: src/app/api/nutri/modulos/route.ts

const { data, error } = await supabaseAdmin
  .from('nutri_curso_modulos')  // ← Tabela nutri
  .select('*')
  .is('curso_id', null)
```

### 4. Admin Page

```typescript
// Arquivo: src/app/admin/nutri/cursos/page.tsx

import type { NutriCursoModulo, NutriModuloTopico, NutriCursoMaterial } from '@/types/nutri-cursos'
import { createClient } from '@/lib/supabase-client'

// Usar rotas: /api/nutri/modulos/*
// Usar buckets: nutri-cursos-pdfs, nutri-cursos-videos
```

### 5. User Page

```typescript
// Arquivo: src/app/pt/nutri/cursos/page.tsx

import type { NutriCursoModulo } from '@/types/nutri-cursos'
// Usar rotas: /api/nutri/modulos/*
```

---

## 🎯 Padrões Importantes

### Nomenclatura Consistente

| Item | Padrão | Exemplo Wellness | Exemplo Nutri |
|------|--------|------------------|---------------|
| Tabela módulos | `{area}_curso_modulos` | `wellness_curso_modulos` | `nutri_curso_modulos` |
| Tabela tópicos | `{area}_modulo_topicos` | `wellness_modulo_topicos` | `nutri_modulo_topicos` |
| Tabela materiais | `{area}_curso_materiais` | `wellness_curso_materiais` | `nutri_curso_materiais` |
| Tabela progresso | `{area}_curso_progresso` | `wellness_curso_progresso` | `nutri_curso_progresso` |
| Bucket PDFs | `{area}-cursos-pdfs` | `wellness-cursos-pdfs` | `nutri-cursos-pdfs` |
| Bucket vídeos | `{area}-cursos-videos` | `wellness-cursos-videos` | `nutri-cursos-videos` |
| Bucket thumbnails | `{area}-cursos-thumbnails` | `wellness-cursos-thumbnails` | `nutri-cursos-thumbnails` |
| Tipo TypeScript | `{Area}CursoModulo` | `WellnessCursoModulo` | `NutriCursoModulo` |
| Rota API | `/api/{area}/modulos` | `/api/wellness/modulos` | `/api/nutri/modulos` |
| Rota admin | `/admin/{area}/cursos` | `/admin/wellness/cursos` | `/admin/nutri/cursos` |
| Rota user | `/pt/{area}/cursos` | `/pt/wellness/cursos` | `/pt/nutri/cursos` |

### Componentes Compartilhados

Estes componentes **NÃO precisam ser duplicados**:
- `SortableList.tsx` - Genérico, funciona para qualquer área
- `src/app/api/wellness/storage/signed-url/route.ts` - Pode ser genérico ou duplicar se necessário

### Componentes Específicos

Estes componentes **precisam ser duplicados ou adaptados**:
- Types (`{area}-cursos.ts`)
- Lib functions (`{area}-cursos.ts`, `{area}-modulos.ts`)
- API routes (`/api/{area}/modulos/*`)
- Admin pages (`/admin/{area}/cursos/*`)
- User pages (`/pt/{area}/cursos/*`)

---

## 🚀 Script de Ajuda (Opcional)

Criar script Node.js para automatizar substituições:

```javascript
// scripts/duplicate-cursos-area.js

const area = process.argv[2] // Ex: 'nutri'
const Area = area.charAt(0).toUpperCase() + area.slice(1) // Ex: 'Nutri'

// Substituições
const replacements = {
  'wellness': area,
  'Wellness': Area,
  'WELLNESS': area.toUpperCase(),
  'wellness-cursos-': `${area}-cursos-`,
  'wellness_curso_': `${area}_curso_`,
  'wellness_modulo_': `${area}_modulo_`,
  // ... mais substituições
}

// Função para processar arquivos
// ...
```

---

## 📌 Notas Finais

1. **Isolamento**: Cada área é completamente isolada (tabelas, buckets, rotas)
2. **Reutilização**: Componentes genéricos podem ser compartilhados
3. **Consistência**: Manter padrão de nomenclatura em todas as áreas
4. **Testes**: Sempre testar após duplicar uma área
5. **Documentação**: Atualizar este guia se houver mudanças na estrutura

---

**Status:** ✅ Guia criado - Pronto para duplicação


