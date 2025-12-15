-- =====================================================
-- MIGRAÇÃO 158: ATUALIZAR BEBIDAS FUNCIONAIS - CUSTOS E VALORES COMPLETOS
-- Data: Janeiro 2025
-- Descrição: Adiciona estrutura de custos, materiais e atualiza valores das bebidas funcionais
-- =====================================================

-- =====================================================
-- 1. TABELA: wellness_materiais_producao
-- Materiais usados na produção (garrafas, etiquetas)
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_materiais_producao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL UNIQUE,
  tipo VARCHAR(50) NOT NULL, -- 'garrafa_500ml', 'garrafa_1l', 'etiqueta'
  custo_unitario NUMERIC(10,2) NOT NULL,
  descricao TEXT,
  observacao TEXT, -- "Valores podem variar por região"
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_wellness_materiais_tipo ON wellness_materiais_producao(tipo);
CREATE INDEX IF NOT EXISTS idx_wellness_materiais_ativo ON wellness_materiais_producao(ativo);

-- Inserir materiais iniciais
INSERT INTO wellness_materiais_producao (nome, tipo, custo_unitario, descricao, observacao) VALUES
('Garrafa 500ml', 'garrafa_500ml', 0.90, 'Garrafa plástica de 500ml para bebidas funcionais', 'Valores podem ter pequenas variações dependendo da região do Brasil'),
('Garrafa 1 Litro', 'garrafa_1l', 1.80, 'Garrafa plástica de 1 litro para bebidas funcionais', 'Valores podem ter pequenas variações dependendo da região do Brasil'),
('Etiqueta', 'etiqueta', 0.36, 'Etiqueta por garrafa', 'Valores podem ter pequenas variações dependendo da região do Brasil')
ON CONFLICT (nome) DO UPDATE SET
  custo_unitario = EXCLUDED.custo_unitario,
  updated_at = NOW();

-- =====================================================
-- 2. TABELA: wellness_produtos_base
-- Produtos base (insumos) usados para fazer as bebidas
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_produtos_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL UNIQUE,
  codigo_produto VARCHAR(100), -- Código do produto Herbalife (ex: NRG, Herbal Concentrate)
  embalagem VARCHAR(255), -- Ex: "100g", "102g", "450ml", "810g", "Caixa 15 saches"
  custo_total NUMERIC(10,2) NOT NULL,
  quantidade_porcoes INTEGER NOT NULL, -- Quantas porções/doses rende
  custo_por_porcao NUMERIC(10,2) NOT NULL, -- Custo calculado por porção
  pv_total NUMERIC(10,2) NOT NULL, -- PV total da embalagem
  pv_por_porcao NUMERIC(10,2) NOT NULL, -- PV por porção/dose
  unidade_medida VARCHAR(50), -- 'g', 'ml', 'dose', 'sache'
  descricao TEXT,
  observacao TEXT, -- "Valores podem variar por região"
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_wellness_produtos_base_codigo ON wellness_produtos_base(codigo_produto);
CREATE INDEX IF NOT EXISTS idx_wellness_produtos_base_ativo ON wellness_produtos_base(ativo);

-- Inserir produtos base
INSERT INTO wellness_produtos_base (nome, codigo_produto, embalagem, custo_total, quantidade_porcoes, custo_por_porcao, pv_total, pv_por_porcao, unidade_medida, descricao, observacao) VALUES
('NRG Energia', 'NRG', '100g', 123.00, 120, 1.02, 24.45, 0.20, 'g', 'NRG Energia - Produto base para bebida Energia', 'Valores podem ter pequenas variações dependendo da região do Brasil'),
('Herbal Concentrate', 'Herbal Concentrate', '102g', 186.00, 120, 1.55, 37.60, 0.31, 'g', 'Herbal Concentrate - Produto base para bebida Acelera', 'Valores podem ter pequenas variações dependendo da região do Brasil'),
('Fiber Concentrate', 'Fiber Concentrate', '450ml', 99.00, 45, 2.20, 20.30, 2.03, 'ml', 'Fiber Concentrate - 45 doses de 10ml cada', 'Valores podem ter pequenas variações dependendo da região do Brasil'),
('CR7 Drive', 'CR7', '810g', 140.00, 60, 2.33, 26.75, 0.446, 'g', 'CR7 Drive - 60 doses', 'Valores podem ter pequenas variações dependendo da região do Brasil'),
('Liftof', 'Liftof', 'Caixa 15 saches', 105.71, 15, 7.05, 303.00, 20.20, 'sache', 'Liftof - Caixa com 15 saches', 'Valores podem ter pequenas variações dependendo da região do Brasil')
ON CONFLICT (nome) DO UPDATE SET
  custo_total = EXCLUDED.custo_total,
  quantidade_porcoes = EXCLUDED.quantidade_porcoes,
  custo_por_porcao = EXCLUDED.custo_por_porcao,
  pv_total = EXCLUDED.pv_total,
  pv_por_porcao = EXCLUDED.pv_por_porcao,
  updated_at = NOW();

-- =====================================================
-- 3. ADICIONAR CAMPOS EM wellness_produtos
-- Campos para custos, composição e informações de produção
-- =====================================================
DO $$ 
BEGIN
  -- Custo de produção (produto + materiais)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_produtos' 
    AND column_name = 'custo_producao'
  ) THEN
    ALTER TABLE wellness_produtos 
    ADD COLUMN custo_producao NUMERIC(10,2);
  END IF;
  
  -- Preço unitário (para bebidas individuais)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_produtos' 
    AND column_name = 'preco_unitario'
  ) THEN
    ALTER TABLE wellness_produtos 
    ADD COLUMN preco_unitario NUMERIC(10,2);
  END IF;
  
  -- Composição (JSON com produtos base e quantidades)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_produtos' 
    AND column_name = 'composicao'
  ) THEN
    ALTER TABLE wellness_produtos 
    ADD COLUMN composicao JSONB;
  END IF;
  
  -- Tipo de garrafa usada
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_produtos' 
    AND column_name = 'tipo_garrafa'
  ) THEN
    ALTER TABLE wellness_produtos 
    ADD COLUMN tipo_garrafa VARCHAR(50); -- '500ml', '1l'
  END IF;
  
  -- Observação sobre preços
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_produtos' 
    AND column_name = 'observacao_preco'
  ) THEN
    ALTER TABLE wellness_produtos 
    ADD COLUMN observacao_preco TEXT;
  END IF;
END $$;

-- =====================================================
-- 4. ATUALIZAR PRODUTOS EXISTENTES E ADICIONAR NOVOS
-- =====================================================

-- Desativar produtos antigos que serão substituídos
UPDATE wellness_produtos 
SET ativo = false 
WHERE categoria = 'bebida_funcional' 
  AND tipo IN ('energia', 'acelera', 'turbo', 'hype');

-- =====================================================
-- ENERGIA (500ml)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, preco_unitario, custo_producao, 
  tipo_garrafa, composicao, descricao, observacao_preco, ativo
) VALUES
(
  'Energia - Unitário',
  'bebida_funcional',
  'energia',
  0.20,
  39.90, -- Kit 5 dias
  10.00, -- Preço unitário
  2.28, -- Custo: 1.02 (NRG) + 0.90 (garrafa) + 0.36 (etiqueta)
  '500ml',
  '{"produtos_base": [{"nome": "NRG Energia", "quantidade": 1}], "materiais": [{"nome": "Garrafa 500ml", "quantidade": 1}, {"nome": "Etiqueta", "quantidade": 1}]}'::jsonb,
  'Bebida funcional Energia - 1 dose de NRG em garrafa de 500ml',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
),
(
  'Energia - Kit 5 dias',
  'bebida_funcional',
  'energia',
  1.00, -- 5 × 0.20
  39.90,
  7.98, -- 39.90 / 5
  2.28,
  '500ml',
  '{"produtos_base": [{"nome": "NRG Energia", "quantidade": 5}], "materiais": [{"nome": "Garrafa 500ml", "quantidade": 5}, {"nome": "Etiqueta", "quantidade": 5}]}'::jsonb,
  'Kit de 5 dias da bebida Energia',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
),
(
  'Energia - Kit 10 dias',
  'bebida_funcional',
  'energia',
  2.00, -- 10 × 0.20
  79.90,
  7.99, -- 79.90 / 10
  2.28,
  '500ml',
  '{"produtos_base": [{"nome": "NRG Energia", "quantidade": 10}], "materiais": [{"nome": "Garrafa 500ml", "quantidade": 10}, {"nome": "Etiqueta", "quantidade": 10}]}'::jsonb,
  'Kit de 10 dias da bebida Energia',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
),
(
  'Energia - Kit 30 dias',
  'bebida_funcional',
  'energia',
  6.00, -- 30 × 0.20
  239.90,
  7.99, -- 239.90 / 30
  2.28,
  '500ml',
  '{"produtos_base": [{"nome": "NRG Energia", "quantidade": 30}], "materiais": [{"nome": "Garrafa 500ml", "quantidade": 30}, {"nome": "Etiqueta", "quantidade": 30}]}'::jsonb,
  'Kit de 30 dias da bebida Energia',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ACELERA (500ml)
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, preco_unitario, custo_producao, 
  tipo_garrafa, composicao, descricao, observacao_preco, ativo
) VALUES
(
  'Acelera - Unitário',
  'bebida_funcional',
  'acelera',
  0.31,
  39.90, -- Kit 5 dias
  10.00, -- Preço unitário
  2.81, -- Custo: 1.55 (Herbal) + 0.90 (garrafa) + 0.36 (etiqueta)
  '500ml',
  '{"produtos_base": [{"nome": "Herbal Concentrate", "quantidade": 1}], "materiais": [{"nome": "Garrafa 500ml", "quantidade": 1}, {"nome": "Etiqueta", "quantidade": 1}]}'::jsonb,
  'Bebida funcional Acelera - 1 dose de Herbal Concentrate em garrafa de 500ml',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
),
(
  'Acelera - Kit 5 dias',
  'bebida_funcional',
  'acelera',
  1.55, -- 5 × 0.31
  39.90,
  7.98, -- 39.90 / 5
  2.81,
  '500ml',
  '{"produtos_base": [{"nome": "Herbal Concentrate", "quantidade": 5}], "materiais": [{"nome": "Garrafa 500ml", "quantidade": 5}, {"nome": "Etiqueta", "quantidade": 5}]}'::jsonb,
  'Kit de 5 dias da bebida Acelera',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
),
(
  'Acelera - Kit 10 dias',
  'bebida_funcional',
  'acelera',
  3.10, -- 10 × 0.31
  79.90,
  7.99, -- 79.90 / 10
  2.81,
  '500ml',
  '{"produtos_base": [{"nome": "Herbal Concentrate", "quantidade": 10}], "materiais": [{"nome": "Garrafa 500ml", "quantidade": 10}, {"nome": "Etiqueta", "quantidade": 10}]}'::jsonb,
  'Kit de 10 dias da bebida Acelera',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
),
(
  'Acelera - Kit 30 dias',
  'bebida_funcional',
  'acelera',
  9.30, -- 30 × 0.31
  239.90,
  7.99, -- 239.90 / 30
  2.81,
  '500ml',
  '{"produtos_base": [{"nome": "Herbal Concentrate", "quantidade": 30}], "materiais": [{"nome": "Garrafa 500ml", "quantidade": 30}, {"nome": "Etiqueta", "quantidade": 30}]}'::jsonb,
  'Kit de 30 dias da bebida Acelera',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- LITRÃO DETOX (1L) - NOVO PRODUTO
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, preco_unitario, custo_producao, 
  tipo_garrafa, composicao, descricao, observacao_preco, ativo
) VALUES
(
  'Litrão Detox - Unitário',
  'bebida_funcional',
  'litrao_detox',
  0.51, -- 0.20 (NRG) + 0.31 (Herbal)
  15.00,
  15.00,
  4.73, -- 1.02 (NRG) + 1.55 (Herbal) + 1.80 (garrafa) + 0.36 (etiqueta)
  '1l',
  '{"produtos_base": [{"nome": "NRG Energia", "quantidade": 1}, {"nome": "Herbal Concentrate", "quantidade": 1}], "materiais": [{"nome": "Garrafa 1 Litro", "quantidade": 1}, {"nome": "Etiqueta", "quantidade": 1}]}'::jsonb,
  'Litrão Detox - 1 dose de NRG + 1 dose de Herbal Concentrate em garrafa de 1 litro',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
),
(
  'Litrão Detox - Kit 5 dias',
  'bebida_funcional',
  'litrao_detox',
  2.55, -- 5 × 0.51
  65.00,
  13.00, -- 65.00 / 5
  4.73,
  '1l',
  '{"produtos_base": [{"nome": "NRG Energia", "quantidade": 5}, {"nome": "Herbal Concentrate", "quantidade": 5}], "materiais": [{"nome": "Garrafa 1 Litro", "quantidade": 5}, {"nome": "Etiqueta", "quantidade": 5}]}'::jsonb,
  'Kit de 5 dias do Litrão Detox',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- TURBO DETOX (1L) - NOVO PRODUTO
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, preco_unitario, custo_producao, 
  tipo_garrafa, composicao, descricao, observacao_preco, ativo
) VALUES
(
  'Turbo Detox - Unitário',
  'bebida_funcional',
  'turbo_detox',
  4.57, -- 0.20 (NRG) + 0.31 (Herbal) + 4.06 (2 doses Fiber de 2.03 cada)
  28.00,
  28.00,
  9.13, -- 1.02 (NRG) + 1.55 (Herbal) + 4.40 (2×2.20 Fiber) + 1.80 (garrafa) + 0.36 (etiqueta)
  '1l',
  '{"produtos_base": [{"nome": "NRG Energia", "quantidade": 1}, {"nome": "Herbal Concentrate", "quantidade": 1}, {"nome": "Fiber Concentrate", "quantidade": 2, "unidade": "dose_10ml"}], "materiais": [{"nome": "Garrafa 1 Litro", "quantidade": 1}, {"nome": "Etiqueta", "quantidade": 1}]}'::jsonb,
  'Turbo Detox - 1 dose NRG + 1 dose Herbal + 2 doses Fiber Concentrate (10ml cada) em garrafa de 1 litro',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
),
(
  'Turbo Detox - Kit 5 dias',
  'bebida_funcional',
  'turbo_detox',
  22.85, -- 5 × 4.57
  125.00,
  25.00, -- 125.00 / 5
  9.13,
  '1l',
  '{"produtos_base": [{"nome": "NRG Energia", "quantidade": 5}, {"nome": "Herbal Concentrate", "quantidade": 5}, {"nome": "Fiber Concentrate", "quantidade": 10, "unidade": "dose_10ml"}], "materiais": [{"nome": "Garrafa 1 Litro", "quantidade": 5}, {"nome": "Etiqueta", "quantidade": 5}]}'::jsonb,
  'Kit de 5 dias do Turbo Detox',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- HYPE DRINK (1L) - ATUALIZADO
-- =====================================================
INSERT INTO wellness_produtos (
  nome, categoria, tipo, pv, preco, preco_unitario, custo_producao, 
  tipo_garrafa, composicao, descricao, observacao_preco, ativo
) VALUES
(
  'Hype Drink - Unitário',
  'bebida_funcional',
  'hype',
  21.156, -- 0.20 (NRG) + 0.31 (Herbal) + 0.446 (CR7) + 20.20 (Liftof)
  28.00,
  28.00,
  14.11, -- 1.02 (NRG) + 1.55 (Herbal) + 2.33 (CR7) + 7.05 (Liftof) + 1.80 (garrafa) + 0.36 (etiqueta)
  '1l',
  '{"produtos_base": [{"nome": "NRG Energia", "quantidade": 1}, {"nome": "Herbal Concentrate", "quantidade": 1}, {"nome": "CR7 Drive", "quantidade": 1}, {"nome": "Liftof", "quantidade": 1, "unidade": "sache"}], "materiais": [{"nome": "Garrafa 1 Litro", "quantidade": 1}, {"nome": "Etiqueta", "quantidade": 1}]}'::jsonb,
  'Hype Drink - 1 dose NRG + 1 dose Herbal + 1 dose CR7 Drive + 1 sache Liftof em garrafa de 1 litro',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
),
(
  'Hype Drink - Kit 5 dias',
  'bebida_funcional',
  'hype',
  105.78, -- 5 × 21.156
  125.00,
  25.00, -- 125.00 / 5
  14.11,
  '1l',
  '{"produtos_base": [{"nome": "NRG Energia", "quantidade": 5}, {"nome": "Herbal Concentrate", "quantidade": 5}, {"nome": "CR7 Drive", "quantidade": 5}, {"nome": "Liftof", "quantidade": 5, "unidade": "sache"}], "materiais": [{"nome": "Garrafa 1 Litro", "quantidade": 5}, {"nome": "Etiqueta", "quantidade": 5}]}'::jsonb,
  'Kit de 5 dias do Hype Drink',
  'Os preços são sugestões e podem variar por região. Valores de garrafas, etiquetas e produtos podem ter pequenas variações dependendo da região do Brasil.',
  true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. TRIGGERS E FUNÇÕES
-- =====================================================

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_wellness_materiais_updated_at ON wellness_materiais_producao;
CREATE TRIGGER update_wellness_materiais_updated_at
  BEFORE UPDATE ON wellness_materiais_producao
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_updated_at();

DROP TRIGGER IF EXISTS update_wellness_produtos_base_updated_at ON wellness_produtos_base;
CREATE TRIGGER update_wellness_produtos_base_updated_at
  BEFORE UPDATE ON wellness_produtos_base
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_updated_at();

-- =====================================================
-- 6. RLS (Row Level Security)
-- =====================================================
ALTER TABLE wellness_materiais_producao ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_produtos_base ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Materiais são públicos para todos os wellness users
DROP POLICY IF EXISTS "Wellness users can view materiais" ON wellness_materiais_producao;
CREATE POLICY "Wellness users can view materiais"
  ON wellness_materiais_producao FOR SELECT
  USING (true);

-- Políticas RLS: Produtos base são públicos para todos os wellness users
DROP POLICY IF EXISTS "Wellness users can view produtos base" ON wellness_produtos_base;
CREATE POLICY "Wellness users can view produtos base"
  ON wellness_produtos_base FOR SELECT
  USING (true);

-- =====================================================
-- 7. COMENTÁRIOS NAS TABELAS
-- =====================================================
COMMENT ON TABLE wellness_materiais_producao IS 'Materiais usados na produção de bebidas funcionais (garrafas, etiquetas)';
COMMENT ON TABLE wellness_produtos_base IS 'Produtos base (insumos) usados para fazer as bebidas funcionais';
COMMENT ON COLUMN wellness_produtos.custo_producao IS 'Custo total de produção (produtos base + materiais)';
COMMENT ON COLUMN wellness_produtos.preco_unitario IS 'Preço de venda unitário da bebida';
COMMENT ON COLUMN wellness_produtos.composicao IS 'JSON com a composição da bebida (produtos base e materiais)';
COMMENT ON COLUMN wellness_produtos.tipo_garrafa IS 'Tipo de garrafa usada: 500ml ou 1l';
COMMENT ON COLUMN wellness_produtos.observacao_preco IS 'Observação sobre variação de preços por região';

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================
