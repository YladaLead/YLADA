-- =====================================================
-- MIGRAÇÃO 159: ATUALIZAR PRODUTOS FECHADOS - VALORES CORRETOS
-- Data: Janeiro 2025
-- Descrição: Atualiza produtos fechados com valores corretos da tabela oficial
-- Fonte: Tabela Nutrição Interna MT - Rodoviário
-- =====================================================

-- =====================================================
-- 1. ADICIONAR CAMPOS DE CUSTO E LUCRO
-- =====================================================
DO $$ 
BEGIN
  -- Custo do supervisor (50% de desconto - valor que o supervisor paga)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_produtos' 
    AND column_name = 'custo_supervisor'
  ) THEN
    ALTER TABLE wellness_produtos 
    ADD COLUMN custo_supervisor NUMERIC(10,2);
  END IF;
  
  -- Lucro (diferença entre preço sugerido e custo do supervisor)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_produtos' 
    AND column_name = 'lucro'
  ) THEN
    ALTER TABLE wellness_produtos 
    ADD COLUMN lucro NUMERIC(10,2);
  END IF;
END $$;

-- Comentários nas colunas
COMMENT ON COLUMN wellness_produtos.custo_supervisor IS 'Custo do produto para supervisor (50% de desconto do preço sugerido)';
COMMENT ON COLUMN wellness_produtos.lucro IS 'Lucro por unidade (preço sugerido - custo supervisor)';

-- =====================================================
-- 2. DESATIVAR PRODUTOS ANTIGOS QUE SERÃO SUBSTITUÍDOS
-- =====================================================
UPDATE wellness_produtos 
SET ativo = false 
WHERE categoria = 'produto_fechado';

-- =====================================================
-- 3. INSERIR PRODUTOS FECHADOS COM VALORES CORRETOS
-- =====================================================

-- =====================================================
-- SHAKE (Substitutos de Refeição)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'Shake - 550g',
  'produto_fechado',
  'shake',
  25.75,
  234.00,
  125.49, -- Custo supervisor (50%)
  108.51, -- Lucro (234.00 - 125.49)
  'Shake Formula 1 - 550g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'Shake - 1976g',
  'produto_fechado',
  'shake',
  96.90,
  763.00,
  404.74, -- Custo supervisor (50%)
  358.26, -- Lucro (763.00 - 404.74)
  'Shake Formula 1 - 1976g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'Shake - 2080g',
  'produto_fechado',
  'shake',
  102.00,
  803.00,
  425.89, -- Custo supervisor (50%)
  377.11, -- Lucro (803.00 - 425.89)
  'Shake Formula 1 - 2080g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'Shake - Sachê',
  'produto_fechado',
  'shake',
  9.55,
  83.00,
  47.00, -- Custo supervisor (50%)
  36.00, -- Lucro (83.00 - 47.00)
  'Shake Formula 1 - Sachê | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FIBER (Fibras)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'Fiber Powder',
  'produto_fechado',
  'fiber',
  24.65,
  231.00,
  125.96, -- Custo supervisor (50%)
  105.04, -- Lucro (231.00 - 125.96)
  'Fiber Powder | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'Fiber Concentrate - 450ml',
  'produto_fechado',
  'fiber',
  20.30,
  196.00,
  98.82, -- Custo supervisor (50%)
  97.18, -- Lucro (196.00 - 98.82)
  'Fiber Concentrate - 450ml | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- NUTRI SOUP (Substitutos de Refeição)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'Nutri Soup - 416g',
  'produto_fechado',
  'nutri_soup',
  25.75,
  234.00,
  125.49, -- Custo supervisor (50%)
  108.51, -- Lucro (234.00 - 125.49)
  'Nutri Soup - 416g | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- CHÁ (Bebidas Herbalife - Herbal Concentrate)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'Herbal Concentrate - 51g',
  'produto_fechado',
  'cha',
  21.45,
  211.00,
  112.37, -- Custo supervisor (50%)
  98.63, -- Lucro (211.00 - 112.37)
  'Herbal Concentrate - 51g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'Herbal Concentrate - 102g',
  'produto_fechado',
  'cha',
  37.60,
  347.00,
  186.16, -- Custo supervisor (50%)
  160.84, -- Lucro (347.00 - 186.16)
  'Herbal Concentrate - 102g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'Herbal Concentrate - 357g',
  'produto_fechado',
  'cha',
  138.05,
  1088.00,
  581.31, -- Custo supervisor (50%)
  506.69, -- Lucro (1088.00 - 581.31)
  'Herbal Concentrate - 357g | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- NRG (Bebidas Herbalife - N-R-G)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'N-R-G - 60g',
  'produto_fechado',
  'nrg',
  15.85,
  151.00,
  81.54, -- Custo supervisor (50%)
  69.46, -- Lucro (151.00 - 81.54)
  'N-R-G Energia - 60g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'N-R-G - 100g',
  'produto_fechado',
  'nrg',
  24.45,
  240.00,
  122.97, -- Custo supervisor (50%)
  117.03, -- Lucro (240.00 - 122.97)
  'N-R-G Energia - 100g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'N-R-G - 330g',
  'produto_fechado',
  'nrg',
  84.80,
  712.00,
  361.90, -- Custo supervisor (50%)
  350.10, -- Lucro (712.00 - 361.90)
  'N-R-G Energia - 330g | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- CR7 (Linha 24 Hours)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  '24 Hours CR7 Drive Barry Mix',
  'produto_fechado',
  'cr7',
  26.75,
  231.00,
  139.47, -- Custo supervisor (50%)
  91.53, -- Lucro (231.00 - 139.47)
  '24 Hours CR7 Drive Barry Mix | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- CREATINA (Linha 24 Hours)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  '24 Hours Creatina - 150g',
  'produto_fechado',
  'creatina',
  18.45,
  172.00,
  99.98, -- Custo supervisor (50%)
  72.02, -- Lucro (172.00 - 99.98)
  '24 Hours Creatina - 150g | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- LIFTOFF (Bebidas Herbalife)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'Liftoff - 75g',
  'produto_fechado',
  'liftoff',
  20.20,
  187.00,
  105.71, -- Custo supervisor (50%)
  81.29, -- Lucro (187.00 - 105.71)
  'Liftoff - 75g | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- BEAUTY BOOSTER (Bebidas Herbalife)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'Beauty Booster | Colágeno - 240g',
  'produto_fechado',
  'beauty_booster',
  27.80,
  287.00,
  156.47, -- Custo supervisor (50%)
  130.53, -- Lucro (287.00 - 156.47)
  'Beauty Booster | Colágeno - 240g | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ONACTIVE (Bebida Nutricional)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'OnActive - 264g',
  'produto_fechado',
  'onactive',
  19.45,
  168.00,
  97.52, -- Custo supervisor (50%)
  70.48, -- Lucro (168.00 - 97.52)
  'OnActive Bebida Nutricional - 264g | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- OUTROS PRODUTOS DA LINHA 24 HOURS
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  '24 Hours Glutamina - 150g',
  'produto_fechado',
  'glutamina',
  9.10,
  76.00,
  45.08, -- Custo supervisor (50%)
  30.92, -- Lucro (76.00 - 45.08)
  '24 Hours Glutamina - 150g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  '24 Hours Tri-Core Protein Blend Chocolate',
  'produto_fechado',
  'protein_blend',
  46.80,
  445.00,
  263.58, -- Custo supervisor (50%)
  181.42, -- Lucro (445.00 - 263.58)
  '24 Hours Tri-Core Protein Blend Chocolate | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  '24 Hours Whey Protein 3W Baunilha - 510g',
  'produto_fechado',
  'whey_protein',
  24.55,
  244.00,
  144.54, -- Custo supervisor (50%)
  99.46, -- Lucro (244.00 - 144.54)
  '24 Hours Whey Protein 3W Baunilha - 510g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  '24 Hours Whey Protein 3W Chocolate - 510g',
  'produto_fechado',
  'whey_protein',
  24.55,
  244.00,
  144.54, -- Custo supervisor (50%)
  99.46, -- Lucro (244.00 - 144.54)
  '24 Hours Whey Protein 3W Chocolate - 510g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  '24 Hours BCAA 5:1:1 - 204g (120 Tabletes)',
  'produto_fechado',
  'bcaa',
  25.85,
  251.00,
  148.61, -- Custo supervisor (50%)
  102.39, -- Lucro (251.00 - 148.61)
  '24 Hours BCAA 5:1:1 - 204g (120 Tabletes) | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PROTEÍNAS
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'Proteína em pó - 240g',
  'produto_fechado',
  'proteina',
  19.30,
  210.00,
  111.50, -- Custo supervisor (50%)
  98.50, -- Lucro (210.00 - 111.50)
  'Proteína em pó - 240g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'Proteína em pó - 480g',
  'produto_fechado',
  'proteina',
  39.25,
  382.00,
  206.18, -- Custo supervisor (50%)
  175.82, -- Lucro (382.00 - 206.18)
  'Proteína em pó - 480g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'Protein Crunch - 150g',
  'produto_fechado',
  'protein_crunch',
  12.30,
  107.00,
  59.31, -- Custo supervisor (50%)
  47.69, -- Lucro (107.00 - 59.31)
  'Protein Crunch - 150g | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- TABLEtes
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'Herbalifeline',
  'produto_fechado',
  'tabletes',
  27.70,
  268.00,
  140.11, -- Custo supervisor (50%)
  127.89, -- Lucro (268.00 - 140.11)
  'Herbalifeline | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'Multivitaminas e Minerais',
  'produto_fechado',
  'tabletes',
  10.75,
  116.00,
  59.09, -- Custo supervisor (50%)
  56.91, -- Lucro (116.00 - 59.09)
  'Multivitaminas e Minerais | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'Shape Control',
  'produto_fechado',
  'tabletes',
  35.35,
  322.00,
  175.92, -- Custo supervisor (50%)
  146.08, -- Lucro (322.00 - 175.92)
  'Shape Control | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- NUTREV
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'NutreV (10un)',
  'produto_fechado',
  'nutrev',
  80.90,
  750.00,
  437.43, -- Custo supervisor (50%)
  312.57, -- Lucro (750.00 - 437.43)
  'NutreV (10un) | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'NutreV',
  'produto_fechado',
  'nutrev',
  7.40,
  75.00,
  53.45, -- Custo supervisor (50%)
  21.55, -- Lucro (75.00 - 53.45)
  'NutreV | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- NUTRIÇÃO COMPLEMENTAR
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'Xtra-Cal',
  'produto_fechado',
  'nutricao_complementar',
  11.00,
  104.00,
  54.13, -- Custo supervisor (50%)
  49.87, -- Lucro (104.00 - 54.13)
  'Xtra-Cal | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- LANCHES SAUDÁVEIS
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, custo_supervisor, lucro, descricao, ativo
) VALUES
(
  'Barras de Proteína - 245g',
  'produto_fechado',
  'lanches',
  10.40,
  105.00,
  71.23, -- Custo supervisor (50%)
  33.77, -- Lucro (105.00 - 71.23)
  'Barras de Proteína - 245g | Preço sugerido de venda. Valores podem variar por região.',
  true
),
(
  'Sopas Instantâneas - 196g',
  'produto_fechado',
  'lanches',
  9.35,
  83.00,
  48.85, -- Custo supervisor (50%)
  34.15, -- Lucro (83.00 - 48.85)
  'Sopas Instantâneas - 196g | Preço sugerido de venda. Valores podem variar por região.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. VERIFICAÇÃO
-- =====================================================
-- Verificar inserção
SELECT 
  categoria,
  tipo,
  COUNT(*) as total,
  SUM(pv) as pv_total,
  SUM(preco) as valor_total_venda,
  SUM(custo_supervisor) as valor_total_custo,
  SUM(lucro) as valor_total_lucro
FROM wellness_produtos
WHERE categoria = 'produto_fechado' AND ativo = true
GROUP BY categoria, tipo
ORDER BY tipo;

-- Verificar alguns produtos com todos os valores
SELECT 
  nome,
  pv,
  preco as preco_venda,
  custo_supervisor,
  lucro,
  ROUND((lucro / preco * 100), 2) as margem_percentual
FROM wellness_produtos
WHERE categoria = 'produto_fechado' AND ativo = true
ORDER BY nome
LIMIT 10;

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================
