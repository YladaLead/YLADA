# 🔧 Correção dos PDFs das Aulas

## ❌ Problema Identificado

Os PDFs das aulas foram vinculados incorretamente a PDFs de **ferramentas** (calculadoras, quizzes) em vez dos PDFs corretos das aulas.

### URLs Erradas Encontradas:
- `pdf-aula-1-fundamentos-wellness` → `calculadora-de-hidratacao.pdf` ❌
- `pdf-aula-2-3-pilares` → `calculadora-imc.pdf` ❌
- `pdf-aula-3-funcionamento-pratico` → `composicao-corporal.pdf` ❌
- `pdf-aula-4-por-que-converte` → `quiz-de-bem-estar-diario.pdf` ❌
- `pdf-aula-5-ferramentas` → `quiz-perfil-de-bem-estar.pdf` ❌

## ✅ Solução Implementada

### Migration 173: Limpar URLs Erradas
- Remove URLs erradas do `wellness_materiais`
- Remove vínculos errados das aulas
- Deixa NULL para que você possa adicionar os PDFs corretos depois

### Migration 172: Corrigir Vínculos
- Limpa URLs erradas antes de tentar vincular
- Busca PDFs corretos (se existirem)
- Vincula corretamente às aulas

## 📋 Próximos Passos

### 1. Execute as Migrations (nesta ordem)

```sql
-- Primeiro: Limpar URLs erradas
-- migrations/173-limpar-urls-erradas-pdfs-aulas.sql

-- Depois: Corrigir vínculos (se tiver PDFs corretos)
-- migrations/172-corrigir-vinculos-pdfs-aulas.sql
```

### 2. Adicionar PDFs Corretos das Aulas

**Opção A: Se você tem os PDFs das aulas**

1. **Fazer upload no Supabase Storage:**
   - Bucket: `wellness-cursos-pdfs`
   - Pasta: `pdf/`
   - Nomes sugeridos:
     - `aula-1-fundamentos-wellness.pdf`
     - `aula-2-3-pilares.pdf`
     - `aula-3-funcionamento-pratico.pdf`
     - `aula-4-por-que-converte.pdf`
     - `aula-5-ferramentas.pdf`

2. **Atualizar URLs no `wellness_materiais`:**
   ```sql
   UPDATE wellness_materiais
   SET url = 'https://fubynpjagxxqbyfjsile.supabase.co/storage/v1/object/public/wellness-cursos-pdfs/pdf/aula-1-fundamentos-wellness.pdf'
   WHERE codigo = 'pdf-aula-1-fundamentos-wellness';
   
   UPDATE wellness_materiais
   SET url = 'https://fubynpjagxxqbyfjsile.supabase.co/storage/v1/object/public/wellness-cursos-pdfs/pdf/aula-2-3-pilares.pdf'
   WHERE codigo = 'pdf-aula-2-3-pilares';
   
   UPDATE wellness_materiais
   SET url = 'https://fubynpjagxxqbyfjsile.supabase.co/storage/v1/object/public/wellness-cursos-pdfs/pdf/aula-3-funcionamento-pratico.pdf'
   WHERE codigo = 'pdf-aula-3-funcionamento-pratico';
   
   UPDATE wellness_materiais
   SET url = 'https://fubynpjagxxqbyfjsile.supabase.co/storage/v1/object/public/wellness-cursos-pdfs/pdf/aula-4-por-que-converte.pdf'
   WHERE codigo = 'pdf-aula-4-por-que-converte';
   
   UPDATE wellness_materiais
   SET url = 'https://fubynpjagxxqbyfjsile.supabase.co/storage/v1/object/public/wellness-cursos-pdfs/pdf/aula-5-ferramentas.pdf'
   WHERE codigo = 'pdf-aula-5-ferramentas';
   ```

3. **Re-executar migration 172 para vincular:**
   ```sql
   -- migrations/172-corrigir-vinculos-pdfs-aulas.sql
   ```

**Opção B: Se você NÃO tem os PDFs das aulas**

1. Execute a migration 173 para limpar tudo
2. As aulas ficarão sem PDF por enquanto
3. Quando tiver os PDFs, siga a Opção A

## 🔍 Verificação

Após executar as migrations, verifique:

```sql
-- Verificar wellness_materiais
SELECT 
  codigo,
  titulo,
  CASE 
    WHEN url IS NULL THEN '⚠️ Sem URL'
    WHEN url LIKE '%calculadora%' OR url LIKE '%quiz%' THEN '❌ URL errada'
    ELSE '✅ URL válida'
  END as status,
  url
FROM wellness_materiais
WHERE codigo LIKE 'pdf-aula-%'
ORDER BY codigo;

-- Verificar aulas
SELECT 
  a.titulo,
  a.ordem,
  CASE 
    WHEN a.material_url IS NULL THEN '⚠️ Sem PDF'
    ELSE '✅ PDF vinculado'
  END as status,
  a.material_url
FROM wellness_aulas a
INNER JOIN wellness_modulos m ON m.id = a.modulo_id
INNER JOIN wellness_trilhas t ON t.id = m.trilha_id
WHERE t.slug = 'distribuidor-iniciante'
  AND m.ordem = 1
ORDER BY a.ordem;
```

## 📝 Notas

- Os PDFs de ferramentas (calculadoras, quizzes) devem ficar apenas em **Cartilhas**
- Os PDFs das aulas devem estar vinculados às **Aulas** na trilha
- Se os PDFs das aulas não existirem, as aulas funcionarão normalmente, apenas sem o material complementar





