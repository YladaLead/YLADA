# 🔍 DIAGNÓSTICO: Templates não encontrados na área Coach

## 📋 **PROBLEMA IDENTIFICADO**

Vários templates não estão sendo localizados ao tentar criar ferramentas na área Coach, especificamente:
- `calc-hidratacao` (Calculadora de Hidratação)
- `calc-proteina` (Calculadora de Proteína)
- E possivelmente outros templates

**Erro exibido:**
```
Template "calc-hidratacao" não encontrado. Por favor, selecione outro template.
```

---

## 🔎 **ANÁLISE DO FLUXO**

### **1. Como os templates são carregados**

**Frontend (`/pt/coach/c/ferramentas/nova`):**
- Faz requisição para `/api/coach/templates`
- Recebe lista de templates disponíveis
- Exibe templates para seleção

**API (`/api/coach/templates`):**
- Busca na tabela `coach_templates_nutrition`
- Filtros aplicados:
  - `is_active = true`
  - `profession = 'coach'` (ou tenta buscar sem esse filtro se coluna não existir)
  - `language = 'pt'`
- Retorna templates formatados com `id`, `nome`, `slug`, `categoria`, etc.

### **2. Como os templates são validados ao criar ferramenta**

**API (`/api/coach/ferramentas` - POST):**
- Chama `validateTemplateBeforeCreate(template_slug, template_id, 'coach', 'pt')`
- Busca na tabela `coach_templates_nutrition`
- Tenta encontrar template por:
  1. **Prioridade 1:** Busca pelo `slug` exato do banco
  2. **Prioridade 2:** Busca pelo `slug` gerado do `name` (normalizado)

**Helper (`src/lib/template-helpers.ts`):**
- `findTemplateBySlug()` busca na tabela `coach_templates_nutrition`
- Filtros: `is_active = true`, `language = 'pt'`
- Retorna `null` se não encontrar

---

## 🐛 **CAUSAS PROVÁVEIS**

### **Causa 1: Templates não existem na tabela `coach_templates_nutrition`**

**Possíveis motivos:**
1. Templates nunca foram copiados de `templates_nutrition` para `coach_templates_nutrition`
2. Scripts de migração não foram executados
3. Templates foram deletados acidentalmente

**Como verificar:**
```sql
-- Verificar se templates existem em coach_templates_nutrition
SELECT 
  id,
  name,
  slug,
  type,
  is_active,
  profession,
  language
FROM coach_templates_nutrition
WHERE (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR slug = 'calc-hidratacao')
   OR (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%' OR slug = 'calc-proteina')
ORDER BY name;
```

### **Causa 2: Templates existem mas com `slug` diferente**

**Possíveis motivos:**
1. Slug no banco é `calculadora-hidratacao` mas código busca `calc-hidratacao`
2. Slug no banco é `calculadora-proteina` mas código busca `calc-proteina`
3. Slug está `NULL` no banco

**Como verificar:**
```sql
-- Verificar slugs dos templates
SELECT 
  name,
  slug,
  CASE 
    WHEN slug IS NULL THEN '❌ Slug NULL'
    WHEN slug != 'calc-hidratacao' AND LOWER(name) LIKE '%hidratação%' THEN '⚠️ Slug diferente: ' || slug
    WHEN slug != 'calc-proteina' AND LOWER(name) LIKE '%proteína%' THEN '⚠️ Slug diferente: ' || slug
    ELSE '✅ Slug correto'
  END as status_slug
FROM coach_templates_nutrition
WHERE (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%')
   OR (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%')
ORDER BY name;
```

### **Causa 3: Templates estão inativos (`is_active = false`)**

**Possíveis motivos:**
1. Templates foram desativados manualmente
2. Script de migração copiou templates inativos

**Como verificar:**
```sql
-- Verificar status dos templates
SELECT 
  name,
  slug,
  is_active,
  CASE 
    WHEN is_active = false THEN '❌ INATIVO'
    ELSE '✅ ATIVO'
  END as status
FROM coach_templates_nutrition
WHERE (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR slug = 'calc-hidratacao')
   OR (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%' OR slug = 'calc-proteina')
ORDER BY name;
```

### **Causa 4: Templates não existem na tabela origem (`templates_nutrition`)**

**Possíveis motivos:**
1. Templates nunca foram inseridos em `templates_nutrition`
2. Templates foram deletados
3. Templates estão com `profession` diferente (ex: `'wellness'` ao invés de `'nutri'`)

**Como verificar:**
```sql
-- Verificar se templates existem na tabela origem
SELECT 
  name,
  slug,
  profession,
  is_active,
  language,
  CASE 
    WHEN profession != 'nutri' AND profession IS NOT NULL AND profession != '' THEN '⚠️ Profession diferente: ' || profession
    WHEN is_active = false THEN '❌ INATIVO'
    WHEN slug IS NULL THEN '⚠️ Slug NULL'
    ELSE '✅ OK'
  END as status
FROM templates_nutrition
WHERE (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR slug = 'calc-hidratacao')
   OR (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%' OR slug = 'calc-proteina')
ORDER BY name, profession;
```

### **Causa 5: Discrepância entre slug esperado e slug no banco**

**Mapeamento esperado (código):**
- `calc-hidratacao` → Componente React existe em `src/app/pt/wellness/templates/hidratacao/page.tsx`
- `calc-proteina` → Componente React existe em `src/app/pt/wellness/templates/proteina/page.tsx`
- Mapeamento em `src/lib/template-slug-map.ts`:
  - `'calculadora-de-hidratacao': 'calc-hidratacao'`
  - `'calculadora-hidratacao': 'calc-hidratacao'`
  - `'hidratacao': 'calc-hidratacao'`
  - `'calc-hidratacao': 'calc-hidratacao'`
  - `'calculadora-proteina': 'calc-proteina'`
  - `'calc-proteina': 'calc-proteina'`

**Problema:** Se o banco tem `slug = 'calculadora-hidratacao'` mas o código busca `'calc-hidratacao'`, não vai encontrar.

---

## 🔧 **SOLUÇÕES PROPOSTAS**

### **Solução 1: Verificar e corrigir slugs na tabela `coach_templates_nutrition`**

```sql
-- Atualizar slugs para os valores esperados pelo código
UPDATE coach_templates_nutrition
SET slug = 'calc-hidratacao'
WHERE (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%')
  AND (slug IS NULL OR slug != 'calc-hidratacao');

UPDATE coach_templates_nutrition
SET slug = 'calc-proteina'
WHERE (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%')
  AND (slug IS NULL OR slug != 'calc-proteina');
```

### **Solução 2: Garantir que templates existem na tabela origem e copiar para Coach**

```sql
-- 1. Verificar se existem em templates_nutrition
SELECT name, slug, profession, is_active
FROM templates_nutrition
WHERE (LOWER(name) LIKE '%hidratação%' OR slug = 'calc-hidratacao')
   OR (LOWER(name) LIKE '%proteína%' OR slug = 'calc-proteina');

-- 2. Se não existirem, inserir em templates_nutrition primeiro
-- (usar scripts existentes como referência)

-- 3. Depois executar script de sincronização
-- migrations/sincronizar-templates-coach-com-nutri.sql
```

### **Solução 3: Executar script de sincronização completo**

```sql
-- Executar script que copia todos os templates ativos do Nutri para Coach
-- migrations/sincronizar-templates-coach-com-nutri.sql
```

### **Solução 4: Criar templates diretamente em `coach_templates_nutrition`**

Se os templates não existem em nenhuma tabela, criar diretamente:

```sql
-- Inserir Calculadora de Hidratação
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content
)
SELECT 
  'Calculadora de Hidratação',
  'calculadora',
  'pt',
  'coach',
  true,
  'calc-hidratacao',
  'Calculadora de Hidratação',
  'Calcule sua necessidade diária de água',
  '{"template_type": "calculator"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition 
  WHERE slug = 'calc-hidratacao' OR (LOWER(name) LIKE '%hidratação%' AND type = 'calculadora')
);

-- Inserir Calculadora de Proteína
INSERT INTO coach_templates_nutrition (
  name, type, language, profession, is_active, slug,
  title, description, content
)
SELECT 
  'Calculadora de Proteína',
  'calculadora',
  'pt',
  'coach',
  true,
  'calc-proteina',
  'Calculadora de Proteína',
  'Calcule sua necessidade diária de proteína',
  '{"template_type": "calculator"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM coach_templates_nutrition 
  WHERE slug = 'calc-proteina' OR (LOWER(name) LIKE '%proteína%' AND type = 'calculadora')
);
```

---

## 📊 **CHECKLIST DE VERIFICAÇÃO**

Execute estas queries para diagnosticar:

### **1. Verificar templates em `coach_templates_nutrition`:**
```sql
SELECT 
  name,
  slug,
  type,
  is_active,
  profession,
  language,
  CASE 
    WHEN slug IS NULL THEN '❌ Slug NULL'
    WHEN is_active = false THEN '❌ Inativo'
    WHEN profession != 'coach' THEN '⚠️ Profession diferente'
    ELSE '✅ OK'
  END as status
FROM coach_templates_nutrition
WHERE (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR slug = 'calc-hidratacao')
   OR (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%' OR slug = 'calc-proteina')
ORDER BY name;
```

### **2. Verificar templates em `templates_nutrition` (origem):**
```sql
SELECT 
  name,
  slug,
  profession,
  is_active,
  language
FROM templates_nutrition
WHERE (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%' OR slug = 'calc-hidratacao')
   OR (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%' OR slug = 'calc-proteina')
ORDER BY name, profession;
```

### **3. Contar total de templates ativos:**
```sql
SELECT 
  'coach_templates_nutrition' as tabela,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos
FROM coach_templates_nutrition
UNION ALL
SELECT 
  'templates_nutrition (nutri)' as tabela,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos
FROM templates_nutrition
WHERE (profession = 'nutri' OR profession IS NULL OR profession = '')
  AND language = 'pt';
```

### **4. Listar todos os templates disponíveis na API:**
```sql
-- Simular o que a API retorna
SELECT 
  id,
  name,
  slug,
  type,
  is_active,
  profession,
  language
FROM coach_templates_nutrition
WHERE is_active = true
  AND language = 'pt'
  AND (profession = 'coach' OR profession IS NULL)
ORDER BY type, name;
```

---

## 🎯 **AÇÃO RECOMENDADA**

1. **Executar queries de diagnóstico** acima para identificar a causa exata
2. **Verificar se templates existem** em `templates_nutrition` com os filtros corretos
3. **Executar script de sincronização** (`migrations/sincronizar-templates-coach-com-nutri.sql`)
4. **Corrigir slugs** se necessário (usar Solução 1)
5. **Ativar templates** se estiverem inativos
6. **Testar criação de ferramenta** novamente

---

## 📝 **NOTAS IMPORTANTES**

- A tabela `coach_templates_nutrition` é **independente** de `templates_nutrition`
- Templates precisam ser **copiados** de `templates_nutrition` para `coach_templates_nutrition`
- O `slug` deve corresponder **exatamente** ao que o código espera
- Templates devem estar com `is_active = true` para aparecer na lista
- A API filtra por `profession = 'coach'` e `language = 'pt'`

---

## 🔗 **ARQUIVOS RELACIONADOS**

- `src/app/api/coach/templates/route.ts` - API que lista templates
- `src/app/api/coach/ferramentas/route.ts` - API que cria ferramentas
- `src/lib/template-helpers.ts` - Helpers de validação
- `src/lib/template-slug-map.ts` - Mapeamento de slugs
- `migrations/sincronizar-templates-coach-com-nutri.sql` - Script de sincronização
- `migrations/copiar-templates-para-coach.sql` - Script de cópia

