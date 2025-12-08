-- =====================================================
-- VERIFICAÇÃO DOS SEEDS DO WELLNESS SYSTEM
-- =====================================================

-- 1. Verificar scripts inseridos
SELECT 
  'Scripts' as tipo,
  COUNT(*) as total,
  COUNT(CASE WHEN ativo = true THEN 1 END) as ativos,
  COUNT(CASE WHEN ativo = false THEN 1 END) as inativos
FROM wellness_scripts;

-- 2. Verificar scripts por categoria
SELECT 
  categoria,
  COUNT(*) as total,
  COUNT(CASE WHEN ativo = true THEN 1 END) as ativos
FROM wellness_scripts
GROUP BY categoria
ORDER BY categoria;

-- 3. Verificar objeções inseridas
SELECT 
  'Objeções' as tipo,
  COUNT(*) as total,
  COUNT(CASE WHEN ativo = true THEN 1 END) as ativos,
  COUNT(CASE WHEN ativo = false THEN 1 END) as inativos
FROM wellness_objecoes;

-- 4. Verificar objeções por categoria
SELECT 
  categoria,
  COUNT(*) as total,
  COUNT(CASE WHEN ativo = true THEN 1 END) as ativos
FROM wellness_objecoes
GROUP BY categoria
ORDER BY categoria;

-- 5. Verificar alguns scripts específicos
SELECT 
  categoria,
  subcategoria,
  nome,
  versao,
  ativo
FROM wellness_scripts
WHERE categoria IN ('vendas', 'tipo_pessoa', 'objetivo', 'etapa')
ORDER BY categoria, ordem
LIMIT 20;

-- 6. Verificar algumas objeções específicas
SELECT 
  categoria,
  codigo,
  objeção,
  ativo
FROM wellness_objecoes
WHERE categoria IN ('clientes', 'recrutamento')
ORDER BY categoria, ordem
LIMIT 10;

-- 7. Verificar se há scripts duplicados (por categoria + nome + versao)
SELECT 
  categoria,
  subcategoria,
  nome,
  versao,
  COUNT(*) as duplicatas
FROM wellness_scripts
WHERE ativo = true
GROUP BY categoria, subcategoria, nome, versao
HAVING COUNT(*) > 1
ORDER BY duplicatas DESC, categoria, nome;

-- 8. Verificar se há objeções duplicadas (por categoria + codigo)
SELECT 
  categoria,
  codigo,
  COUNT(*) as duplicatas
FROM wellness_objecoes
WHERE ativo = true
GROUP BY categoria, codigo
HAVING COUNT(*) > 1
ORDER BY duplicatas DESC, categoria, codigo;

-- 9. Estatísticas finais
SELECT 
  'SCRIPTS' as tipo,
  COUNT(*) as total,
  COUNT(DISTINCT (categoria, subcategoria, nome, versao)) as unicos,
  COUNT(*) - COUNT(DISTINCT (categoria, subcategoria, nome, versao)) as duplicatas
FROM wellness_scripts
WHERE ativo = true

UNION ALL

SELECT 
  'OBJEÇÕES' as tipo,
  COUNT(*) as total,
  COUNT(DISTINCT (categoria, codigo)) as unicos,
  COUNT(*) - COUNT(DISTINCT (categoria, codigo)) as duplicatas
FROM wellness_objecoes
WHERE ativo = true;

