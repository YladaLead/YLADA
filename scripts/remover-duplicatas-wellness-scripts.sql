-- =====================================================
-- REMOVER DUPLICATAS DE SCRIPTS DO WELLNESS SYSTEM
-- Remove scripts duplicados mantendo apenas a versão mais recente
-- =====================================================

BEGIN;

-- =====================================================
-- ESTRATÉGIA: Manter o registro mais recente de cada duplicata
-- Critério: (categoria, subcategoria, nome, versao)
-- =====================================================

-- 1. Verificar duplicatas antes de remover
SELECT 
  'ANTES DA REMOÇÃO' as status,
  COUNT(*) as total_scripts,
  COUNT(DISTINCT (categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, ''))) as scripts_unicos,
  COUNT(*) - COUNT(DISTINCT (categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, ''))) as duplicatas
FROM wellness_scripts
WHERE ativo = true;

-- 2. Criar tabela temporária com IDs a manter (mais recentes)
-- Estratégia: Manter o registro com created_at mais recente
-- Se created_at for igual, manter o que tem mais conteúdo (conteudo mais longo)
CREATE TEMP TABLE scripts_manter AS
SELECT DISTINCT ON (categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, ''))
  id,
  categoria,
  subcategoria,
  nome,
  versao,
  created_at,
  LENGTH(conteudo) as tamanho_conteudo
FROM wellness_scripts
WHERE ativo = true
ORDER BY 
  categoria, 
  COALESCE(subcategoria, ''), 
  nome, 
  COALESCE(versao, ''), 
  created_at DESC,
  LENGTH(conteudo) DESC;

-- 3. Verificar quantos serão removidos (antes de deletar)
SELECT 
  'SCRIPTS A SEREM REMOVIDOS' as acao,
  COUNT(*) as total
FROM wellness_scripts
WHERE ativo = true
  AND id NOT IN (SELECT id FROM scripts_manter)
  AND (categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, '')) IN (
    SELECT categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, '')
    FROM wellness_scripts
    WHERE ativo = true
    GROUP BY categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, '')
    HAVING COUNT(*) > 1
  );

-- 4. Deletar duplicatas (manter apenas os que estão na tabela temporária)
DELETE FROM wellness_scripts
WHERE ativo = true
  AND id NOT IN (SELECT id FROM scripts_manter)
  AND (categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, '')) IN (
    SELECT categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, '')
    FROM wellness_scripts
    WHERE ativo = true
    GROUP BY categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, '')
    HAVING COUNT(*) > 1
  );

-- 5. Verificar duplicatas após remoção
SELECT 
  'APÓS REMOÇÃO' as status,
  COUNT(*) as total_scripts,
  COUNT(DISTINCT (categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, ''))) as scripts_unicos,
  COUNT(*) - COUNT(DISTINCT (categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, ''))) as duplicatas_restantes
FROM wellness_scripts
WHERE ativo = true;

-- 6. Verificar se ainda há duplicatas
SELECT 
  categoria,
  COALESCE(subcategoria, '') as subcategoria,
  nome,
  COALESCE(versao, '') as versao,
  COUNT(*) as duplicatas_restantes
FROM wellness_scripts
WHERE ativo = true
GROUP BY categoria, COALESCE(subcategoria, ''), nome, COALESCE(versao, '')
HAVING COUNT(*) > 1
ORDER BY duplicatas_restantes DESC;

-- 7. Adicionar constraint UNIQUE para prevenir futuras duplicatas
-- NOTA: PostgreSQL não permite COALESCE em constraint UNIQUE diretamente
-- Vamos usar uma abordagem diferente: criar índice único funcional
DO $$ 
BEGIN
  -- Verificar se índice único já existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_wellness_scripts_unique'
  ) THEN
    -- Criar índice único funcional (trata NULL como string vazia)
    CREATE UNIQUE INDEX idx_wellness_scripts_unique 
    ON wellness_scripts (
      categoria, 
      COALESCE(subcategoria, ''), 
      nome, 
      COALESCE(versao, '')
    )
    WHERE ativo = true;
    
    RAISE NOTICE 'Índice UNIQUE criado com sucesso';
  ELSE
    RAISE NOTICE 'Índice UNIQUE já existe';
  END IF;
END $$;

-- 8. Limpar tabela temporária
DROP TABLE IF EXISTS scripts_manter;

COMMIT;

-- =====================================================
-- RESUMO:
-- Este script remove duplicatas mantendo a versão mais recente
-- de cada script baseado em (categoria, subcategoria, nome, versao)
-- =====================================================

