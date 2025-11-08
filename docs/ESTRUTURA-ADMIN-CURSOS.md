# 📚 Estrutura Admin - Cursos por Área

## 🎯 Proposta de Organização

### **Opção 1: Estrutura por Área (RECOMENDADO)** ✅

```
/admin/
├── wellness/
│   └── cursos/
│       ├── page.tsx              # Lista cursos wellness
│       ├── novo/
│       │   └── page.tsx          # Criar curso wellness
│       └── [id]/
│           ├── page.tsx          # Editar curso wellness
│           └── modulos/
│               └── [moduloId]/
│                   └── page.tsx   # Gerenciar materiais
│
├── nutri/
│   └── cursos/
│       └── [mesma estrutura]
│
├── coach/
│   └── cursos/
│       └── [mesma estrutura]
│
└── nutra/
    └── cursos/
        └── [mesma estrutura]
```

**Vantagens:**
- ✅ Isolamento total por área
- ✅ Facilita permissões futuras (ex: admin de wellness só vê cursos wellness)
- ✅ Organização clara
- ✅ Segue padrão já existente no projeto

**Desvantagens:**
- ⚠️ Código duplicado (mas pode ser compartilhado via componentes)

---

### **Opção 2: Estrutura Centralizada com Filtro**

```
/admin/
└── cursos/
    ├── page.tsx                  # Lista todos os cursos (com filtro por área)
    ├── novo/
    │   └── page.tsx              # Criar curso (selecionar área)
    └── [id]/
        └── page.tsx              # Editar curso
```

**Vantagens:**
- ✅ Código único
- ✅ Visão geral de todos os cursos
- ✅ Mais fácil para super admins

**Desvantagens:**
- ⚠️ Menos organizado
- ⚠️ Mistura áreas diferentes

---

## 🗄️ Estrutura de Banco de Dados

### **Opção A: Tabelas Separadas por Área** (Atual)

```sql
-- Tabelas Wellness (já criadas)
wellness_cursos
wellness_curso_modulos
wellness_curso_materiais
wellness_curso_progresso

-- Tabelas Nutri (futuro)
nutri_cursos
nutri_curso_modulos
nutri_curso_materiais
nutri_curso_progresso

-- etc...
```

**Vantagens:**
- ✅ Isolamento total
- ✅ Fácil de gerenciar
- ✅ Performance (índices específicos)

**Desvantagens:**
- ⚠️ Código duplicado
- ⚠️ Múltiplas tabelas

---

### **Opção B: Tabela Genérica com Campo `area`** (Recomendado para futuro)

```sql
-- Tabela única para todas as áreas
cursos (
  id,
  area VARCHAR(50), -- 'wellness', 'nutri', 'coach', 'nutra'
  titulo,
  descricao,
  categoria,
  ...
)

curso_modulos (
  id,
  curso_id,
  ...
)

curso_materiais (
  id,
  modulo_id,
  ...
)

curso_progresso (
  id,
  curso_id,
  user_id,
  ...
)
```

**Vantagens:**
- ✅ Código único
- ✅ Fácil de expandir
- ✅ Queries unificadas

**Desvantagens:**
- ⚠️ Precisa migrar dados existentes
- ⚠️ Mais complexo no início

---

## 💡 Recomendação

### **Para AGORA (Wellness):**
Manter estrutura atual:
- `/admin/wellness/cursos` ✅
- Tabelas `wellness_*` ✅

### **Para FUTURO (outras áreas):**
1. **Curto prazo:** Criar tabelas separadas (`nutri_cursos`, etc)
2. **Longo prazo:** Migrar para tabela genérica `cursos` com campo `area`

### **Estrutura Admin Recomendada:**

```
/admin/
├── dashboard/                    # Dashboard geral
├── usuarios/                    # Gerenciar usuários
├── receitas/                    # Assinaturas
│
├── wellness/                    # Área Wellness
│   ├── cursos/
│   ├── ferramentas/             # (futuro)
│   └── usuarios/                # (futuro)
│
├── nutri/                       # Área Nutri
│   ├── cursos/
│   └── ...
│
├── coach/                       # Área Coach
│   └── cursos/
│
└── nutra/                       # Área Nutra
    └── cursos/
```

---

## 🔄 Componentes Compartilhados

Criar componentes reutilizáveis para evitar duplicação:

```
src/components/admin/
└── cursos/
    ├── CursoForm.tsx            # Formulário genérico
    ├── ModuloForm.tsx           # Formulário de módulo
    ├── MaterialForm.tsx         # Formulário de material
    ├── MaterialUpload.tsx       # Upload de arquivos
    └── CursoList.tsx            # Lista de cursos
```

Cada área usa os mesmos componentes, mas com contexto diferente (wellness, nutri, etc).

---

## 📝 Próximos Passos

1. ✅ Manter `/admin/wellness/cursos` (já criado)
2. ⏳ Criar componentes compartilhados
3. ⏳ Quando criar outras áreas, usar mesma estrutura
4. ⏳ Futuro: considerar migração para tabela genérica

