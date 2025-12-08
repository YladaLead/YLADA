-- =====================================================
-- VERIFICAR DUPLICATAS EM wellness_produtos
-- =====================================================

-- 1. CONTAGEM TOTAL
SELECT 
  'TOTAL' as tipo,
  COUNT(*) as total_produtos,
  COUNT(CASE WHEN ativo = true THEN 1 END) as ativos,
  COUNT(CASE WHEN ativo = false THEN 1 END) as inativos
FROM wellness_produtos;

-- 2. CONTAGEM POR CATEGORIA
SELECT 
  categoria,
  COUNT(*) as total,
  COUNT(CASE WHEN ativo = true THEN 1 END) as ativos,
  SUM(pv) as pv_total
FROM wellness_produtos
GROUP BY categoria
ORDER BY categoria;

-- 3. VERIFICAR DUPLICATAS POR NOME (case-insensitive)
SELECT 
  LOWER(TRIM(nome)) as nome_normalizado,
  COUNT(*) as quantidade,
  STRING_AGG(id::text, ', ' ORDER BY created_at) as ids,
  STRING_AGG(nome, ' | ' ORDER BY created_at) as nomes,
  STRING_AGG(categoria, ' | ' ORDER BY created_at) as categorias,
  STRING_AGG(CASE WHEN ativo THEN 'ativo' ELSE 'inativo' END, ' | ' ORDER BY created_at) as status
FROM wellness_produtos
GROUP BY LOWER(TRIM(nome))
HAVING COUNT(*) > 1
ORDER BY quantidade DESC, nome_normalizado;

-- 4. DETALHES COMPLETOS DAS DUPLICATAS
WITH duplicatas AS (
  SELECT 
    LOWER(TRIM(nome)) as nome_normalizado,
    COUNT(*) as quantidade
  FROM wellness_produtos
  GROUP BY LOWER(TRIM(nome))
  HAVING COUNT(*) > 1
),
produtos_manter AS (
  SELECT DISTINCT ON (LOWER(TRIM(nome)))
    id as id_manter,
    LOWER(TRIM(nome)) as nome_normalizado
  FROM wellness_produtos
  WHERE ativo = true
  ORDER BY LOWER(TRIM(nome)), created_at ASC
)
SELECT 
  p.id,
  p.nome,
  p.categoria,
  p.tipo,
  p.pv,
  p.ativo,
  p.created_at,
  d.quantidade as total_duplicatas,
  CASE 
    WHEN p.id = pm.id_manter
    THEN 'MANTER (mais antigo)'
    ELSE 'ELIMINAR'
  END as acao
FROM wellness_produtos p
INNER JOIN duplicatas d ON LOWER(TRIM(p.nome)) = d.nome_normalizado
LEFT JOIN produtos_manter pm ON LOWER(TRIM(p.nome)) = pm.nome_normalizado
ORDER BY LOWER(TRIM(p.nome)), p.created_at;

-- 5. VERIFICAR DUPLICATAS POR (nome, categoria, tipo) - combinação única esperada
SELECT 
  nome,
  categoria,
  tipo,
  COUNT(*) as quantidade,
  STRING_AGG(id::text, ', ' ORDER BY created_at) as ids,
  STRING_AGG(CASE WHEN ativo THEN 'ativo' ELSE 'inativo' END, ' | ' ORDER BY created_at) as status
FROM wellness_produtos
GROUP BY nome, categoria, tipo
HAVING COUNT(*) > 1
ORDER BY quantidade DESC, nome;

-- 6. RESUMO: Quantos produtos únicos vs duplicados
SELECT 
  'PRODUTOS ÚNICOS' as tipo,
  COUNT(DISTINCT LOWER(TRIM(nome))) as quantidade
FROM wellness_produtos
WHERE ativo = true
UNION ALL
SELECT 
  'TOTAL DE PRODUTOS' as tipo,
  COUNT(*) as quantidade
FROM wellness_produtos
WHERE ativo = true;



