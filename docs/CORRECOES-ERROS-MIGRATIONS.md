# 🔧 Correções Aplicadas nas Migrations

## Erros Corrigidos

### 1. ❌ `wellness_materiais_acesso` não existe

**Erro:**
```
ERROR: 42P01: relation "wellness_materiais_acesso" does not exist
```

**Correção:**
- ✅ Removida linha `ALTER TABLE IF EXISTS wellness_materiais_acesso ENABLE ROW LEVEL SECURITY;`
- ✅ Removida toda a seção de políticas RLS para `wellness_materiais_acesso` (seção 10)
- ✅ Adicionado comentário indicando que a tabela não existe

**Arquivo:** `migrations/030-habilitar-rls-tabelas-wellness.sql`

---

### 2. ❌ Coluna `ativo` não existe em `curso_materiais_areas`

**Erro:**
```
ERROR: 42703: column "ativo" does not exist
CONTEXT: SQL statement "CREATE POLICY "Authenticated users can view active curso materiais" 
ON curso_materiais_areas FOR SELECT 
USING (auth.role() = 'authenticated' AND (ativo IS NULL OR ativo = true))"
```

**Correção:**
- ✅ Adicionada verificação condicional para verificar se a coluna `ativo` existe
- ✅ Se a coluna existir: usa filtro `(ativo IS NULL OR ativo = true)`
- ✅ Se a coluna não existir: permite acesso a todos os registros para usuários autenticados

**Arquivo:** `migrations/031-habilitar-rls-outras-tabelas-publicas.sql`

**Código:**
```sql
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'curso_materiais_areas') THEN
    -- Verificar se a coluna 'ativo' existe antes de usar
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'curso_materiais_areas' AND column_name = 'ativo'
    ) THEN
      -- Política com filtro de ativo
      CREATE POLICY "Authenticated users can view active curso materiais"
        ON curso_materiais_areas FOR SELECT
        USING (auth.role() = 'authenticated' AND (ativo IS NULL OR ativo = true));
    ELSE
      -- Política sem filtro de ativo
      CREATE POLICY "Authenticated users can view curso materiais"
        ON curso_materiais_areas FOR SELECT
        USING (auth.role() = 'authenticated');
    END IF;
  END IF;
END $$;
```

---

## ✅ Status

- ✅ **Migration 030** - Corrigida
- ✅ **Migration 031** - Corrigida
- ✅ **Migration 032** - Sem erros

---

### 3. ❌ `wellness_cartilhas` não existe

**Erro:**
```
ERROR: 42P01: relation "wellness_cartilhas" does not exist
```

**Correção:**
- ✅ Removida linha `ALTER TABLE IF EXISTS wellness_cartilhas ENABLE ROW LEVEL SECURITY;`
- ✅ Removida toda a seção de políticas RLS para `wellness_cartilhas` (seção 13)
- ✅ Adicionado comentário indicando que a tabela não existe

**Arquivo:** `migrations/030-habilitar-rls-tabelas-wellness.sql`

---

### 4. ❌ `is_admin_user()` não existe na migration 031

**Erro:**
```
ERROR: 42883: function is_admin_user() does not exist
HINT: No function matches the given name and argument types.
CONTEXT: SQL statement "CREATE POLICY "Admins can manage curso materiais" 
ON curso_materiais_areas FOR ALL USING (is_admin_user())"
```

**Correção:**
- ✅ Adicionadas as funções helper (`is_admin_user()` e `is_wellness_user()`) no início da migration 031
- ✅ Isso garante que as funções existam mesmo se a migration 030 não tiver sido executada ainda
- ✅ As funções são criadas com `CREATE OR REPLACE`, então são idempotentes

**Arquivo:** `migrations/031-habilitar-rls-outras-tabelas-publicas.sql`

**Código adicionado:**
```sql
-- ============================================
-- 0. FUNÇÕES HELPER PARA POLÍTICAS RLS
-- ============================================
-- Garantir que as funções helper existam antes de criar políticas
-- (Caso a migration 030 não tenha sido executada ainda)

-- Função para verificar se usuário é wellness
CREATE OR REPLACE FUNCTION is_wellness_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND perfil = 'wellness'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND (is_admin = TRUE OR perfil = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## ✅ Status

- ✅ **Migration 030** - Corrigida (removidas referências a tabelas inexistentes)
- ✅ **Migration 031** - Corrigida (adicionadas funções helper + coluna ativo condicional)
- ✅ **Migration 032** - Sem erros

---

### 5. ❌ `wellness_apresentacoes` não existe

**Erro:**
```
ERROR: 42P01: relation "wellness_apresentacoes" does not exist
```

**Correção:**
- ✅ Removida linha `ALTER TABLE IF EXISTS wellness_apresentacoes ENABLE ROW LEVEL SECURITY;`
- ✅ Removida toda a seção de políticas RLS para `wellness_apresentacoes` (seção 14)
- ✅ Adicionado comentário indicando que a tabela não existe

**Arquivo:** `migrations/030-habilitar-rls-tabelas-wellness.sql`

---

### 6. ❌ Coluna `ativo` não existe em múltiplas tabelas

**Erro:**
```
ERROR: 42703: column "ativo" does not exist
CONTEXT: SQL statement "CREATE POLICY "Authenticated users can view active trails" 
ON courses_trails FOR SELECT USING (auth.role() = 'authenticated' AND (ativo IS NULL OR ativo = true))"
```

**Correção:**
- ✅ Adicionada verificação condicional para verificar se a coluna `ativo` existe antes de usá-la em **todas** as tabelas que a referenciam:
  - `courses_trails`
  - `trails_modules`
  - `trails_lessons`
  - `library_files`
  - `microcourses`
  - `tutorials`
  - `wellness_planos_dias`
- ✅ Se a coluna existir: usa filtro `(ativo IS NULL OR ativo = true)`
- ✅ Se a coluna não existir: permite acesso a todos os registros para usuários autenticados

**Arquivo:** `migrations/031-habilitar-rls-outras-tabelas-publicas.sql`

**Padrão aplicado:**
```sql
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nome_tabela') THEN
    -- Verificar se a coluna 'ativo' existe
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'nome_tabela' AND column_name = 'ativo'
    ) THEN
      -- Política com filtro de ativo
      CREATE POLICY "Authenticated users can view active ..."
        ON nome_tabela FOR SELECT
        USING (auth.role() = 'authenticated' AND (ativo IS NULL OR ativo = true));
    ELSE
      -- Política sem filtro de ativo
      CREATE POLICY "Authenticated users can view ..."
        ON nome_tabela FOR SELECT
        USING (auth.role() = 'authenticated');
    END IF;
  END IF;
END $$;
```

---

## ✅ Status Final

- ✅ **Migration 030** - Corrigida (removidas referências a tabelas inexistentes: `wellness_materiais_acesso`, `wellness_cartilhas`, `wellness_apresentacoes`)
- ✅ **Migration 031** - Corrigida (adicionadas funções helper + verificação condicional para coluna `ativo` em todas as tabelas)
- ✅ **Migration 032** - Sem erros

**Próximo passo:** Executar as migrations novamente no Supabase SQL Editor.
