-- =====================================================
-- WELLNESS SYSTEM - CLIENTES, PV E EVOLUÇÃO
-- Migração 002: Tabelas para gestão de clientes, compras e PV
-- =====================================================

-- 1. TABELA: wellness_produtos
-- Produtos disponíveis com seus respectivos PVs
CREATE TABLE IF NOT EXISTS wellness_produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(50) NOT NULL, -- 'bebida_funcional', 'produto_fechado', 'kit'
  tipo VARCHAR(50) NOT NULL, -- 'energia', 'acelera', 'turbo', 'hype', 'shake', 'fiber', 'cha', 'nrg', 'cr7', 'creatina'
  pv NUMERIC(10,2) NOT NULL, -- Pontos de Volume
  preco NUMERIC(10,2),
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para wellness_produtos
CREATE INDEX IF NOT EXISTS idx_wellness_produtos_categoria ON wellness_produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_wellness_produtos_tipo ON wellness_produtos(tipo);
CREATE INDEX IF NOT EXISTS idx_wellness_produtos_ativo ON wellness_produtos(ativo);

-- 2. TABELA: wellness_client_purchases
-- Histórico de compras dos clientes
CREATE TABLE IF NOT EXISTS wellness_client_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES wellness_client_profiles(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES wellness_produtos(id),
  quantidade INTEGER DEFAULT 1,
  pv_total NUMERIC(10,2) NOT NULL, -- PV gerado nesta compra (produto.pv * quantidade)
  data_compra DATE NOT NULL,
  previsao_recompra DATE, -- data_compra + 30 dias (ou outro período baseado no produto)
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para wellness_client_purchases
CREATE INDEX IF NOT EXISTS idx_wellness_purchases_client ON wellness_client_purchases(client_id);
CREATE INDEX IF NOT EXISTS idx_wellness_purchases_produto ON wellness_client_purchases(produto_id);
CREATE INDEX IF NOT EXISTS idx_wellness_purchases_data ON wellness_client_purchases(data_compra DESC);
CREATE INDEX IF NOT EXISTS idx_wellness_purchases_recompra ON wellness_client_purchases(previsao_recompra);

-- 3. ADICIONAR CAMPOS EM wellness_client_profiles
-- Campos para rastrear produto atual, última compra e PV
DO $$ 
BEGIN
  -- Adicionar produto_atual_id se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_client_profiles' 
    AND column_name = 'produto_atual_id'
  ) THEN
    ALTER TABLE wellness_client_profiles 
    ADD COLUMN produto_atual_id UUID REFERENCES wellness_produtos(id);
  END IF;
  
  -- Adicionar ultima_compra_id se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_client_profiles' 
    AND column_name = 'ultima_compra_id'
  ) THEN
    ALTER TABLE wellness_client_profiles 
    ADD COLUMN ultima_compra_id UUID REFERENCES wellness_client_purchases(id);
  END IF;
  
  -- Adicionar pv_total_cliente se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_client_profiles' 
    AND column_name = 'pv_total_cliente'
  ) THEN
    ALTER TABLE wellness_client_profiles 
    ADD COLUMN pv_total_cliente NUMERIC(10,2) DEFAULT 0;
  END IF;
  
  -- Adicionar pv_mensal se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_client_profiles' 
    AND column_name = 'pv_mensal'
  ) THEN
    ALTER TABLE wellness_client_profiles 
    ADD COLUMN pv_mensal NUMERIC(10,2) DEFAULT 0;
  END IF;
END $$;

-- 4. TABELA: wellness_consultant_pv_monthly
-- Registro mensal de PV do consultor
CREATE TABLE IF NOT EXISTS wellness_consultant_pv_monthly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mes_ano VARCHAR(7) NOT NULL, -- '2025-01'
  pv_total NUMERIC(10,2) DEFAULT 0,
  pv_kits NUMERIC(10,2) DEFAULT 0, -- PV de kits/bebidas funcionais
  pv_produtos_fechados NUMERIC(10,2) DEFAULT 0, -- PV de produtos fechados
  meta_pv NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(consultant_id, mes_ano)
);

-- Índices para wellness_consultant_pv_monthly
CREATE INDEX IF NOT EXISTS idx_wellness_pv_monthly_consultant ON wellness_consultant_pv_monthly(consultant_id);
CREATE INDEX IF NOT EXISTS idx_wellness_pv_monthly_mes ON wellness_consultant_pv_monthly(mes_ano DESC);

-- 5. TRIGGER: Atualizar updated_at
-- Remover triggers existentes se houver
DROP TRIGGER IF EXISTS update_wellness_produtos_updated_at ON wellness_produtos;
DROP TRIGGER IF EXISTS update_wellness_purchases_updated_at ON wellness_client_purchases;
DROP TRIGGER IF EXISTS update_wellness_pv_monthly_updated_at ON wellness_consultant_pv_monthly;

-- Criar triggers
CREATE TRIGGER update_wellness_produtos_updated_at
  BEFORE UPDATE ON wellness_produtos
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_updated_at();

CREATE TRIGGER update_wellness_purchases_updated_at
  BEFORE UPDATE ON wellness_client_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_updated_at();

CREATE TRIGGER update_wellness_pv_monthly_updated_at
  BEFORE UPDATE ON wellness_consultant_pv_monthly
  FOR EACH ROW
  EXECUTE FUNCTION update_wellness_updated_at();

-- 6. FUNÇÃO: Calcular PV total do cliente
CREATE OR REPLACE FUNCTION calcular_pv_total_cliente(client_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_pv NUMERIC;
BEGIN
  SELECT COALESCE(SUM(pv_total), 0)
  INTO total_pv
  FROM wellness_client_purchases
  WHERE client_id = client_uuid;
  
  RETURN total_pv;
END;
$$ LANGUAGE plpgsql;

-- 7. FUNÇÃO: Calcular PV mensal do cliente
CREATE OR REPLACE FUNCTION calcular_pv_mensal_cliente(client_uuid UUID, mes_ano_param VARCHAR)
RETURNS NUMERIC AS $$
DECLARE
  total_pv NUMERIC;
BEGIN
  SELECT COALESCE(SUM(pv_total), 0)
  INTO total_pv
  FROM wellness_client_purchases
  WHERE client_id = client_uuid
    AND TO_CHAR(data_compra, 'YYYY-MM') = mes_ano_param;
  
  RETURN total_pv;
END;
$$ LANGUAGE plpgsql;

-- 8. FUNÇÃO: Calcular PV mensal do consultor
CREATE OR REPLACE FUNCTION calcular_pv_mensal_consultor(consultant_uuid UUID, mes_ano_param VARCHAR)
RETURNS NUMERIC AS $$
DECLARE
  total_pv NUMERIC;
BEGIN
  SELECT COALESCE(SUM(p.pv_total), 0)
  INTO total_pv
  FROM wellness_client_purchases p
  INNER JOIN wellness_client_profiles c ON c.id = p.client_id
  WHERE c.consultant_id = consultant_uuid
    AND TO_CHAR(p.data_compra, 'YYYY-MM') = mes_ano_param;
  
  RETURN total_pv;
END;
$$ LANGUAGE plpgsql;

-- 9. RLS (Row Level Security)
ALTER TABLE wellness_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_client_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_consultant_pv_monthly ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Produtos são públicos para todos os wellness users
DROP POLICY IF EXISTS "Wellness users can view produtos" ON wellness_produtos;
CREATE POLICY "Wellness users can view produtos"
  ON wellness_produtos FOR SELECT
  USING (true);

-- Políticas RLS: Consultores podem ver suas próprias compras
DROP POLICY IF EXISTS "Consultants can view their client purchases" ON wellness_client_purchases;
CREATE POLICY "Consultants can view their client purchases"
  ON wellness_client_purchases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wellness_client_profiles c
      WHERE c.id = wellness_client_purchases.client_id
        AND c.consultant_id = auth.uid()
    )
  );

-- Políticas RLS: Consultores podem criar compras para seus clientes
DROP POLICY IF EXISTS "Consultants can create purchases for their clients" ON wellness_client_purchases;
CREATE POLICY "Consultants can create purchases for their clients"
  ON wellness_client_purchases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM wellness_client_profiles c
      WHERE c.id = wellness_client_purchases.client_id
        AND c.consultant_id = auth.uid()
    )
  );

-- Políticas RLS: Consultores podem ver seu próprio PV mensal
DROP POLICY IF EXISTS "Consultants can view their own monthly PV" ON wellness_consultant_pv_monthly;
CREATE POLICY "Consultants can view their own monthly PV"
  ON wellness_consultant_pv_monthly FOR SELECT
  USING (consultant_id = auth.uid());

-- Políticas RLS: Consultores podem criar/atualizar seu próprio PV mensal
DROP POLICY IF EXISTS "Consultants can manage their own monthly PV" ON wellness_consultant_pv_monthly;
CREATE POLICY "Consultants can manage their own monthly PV"
  ON wellness_consultant_pv_monthly FOR ALL
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

