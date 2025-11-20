-- =====================================================
-- CRIAR TABELA PROGRAMS (se não existir)
-- =====================================================
-- Execute este script no Supabase SQL Editor
-- para garantir que a tabela programs existe
-- =====================================================

-- Tabela de programas/planos (planos alimentares, protocolos)
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados do programa
  name VARCHAR(255) NOT NULL,
  description TEXT,
  program_type VARCHAR(100) DEFAULT 'plano_alimentar', -- 'plano_alimentar', 'protocolo', 'treinamento', 'desafio', 'outro'
  
  -- Período
  start_date DATE NOT NULL,
  end_date DATE, -- NULL = sem data de término
  duration_days INTEGER, -- Duração em dias
  
  -- Status
  status VARCHAR(50) DEFAULT 'ativo', -- 'rascunho', 'ativo', 'pausado', 'concluido', 'cancelado'
  
  -- Conteúdo do programa (JSONB para flexibilidade)
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Acompanhamento
  adherence_percentage DECIMAL(5,2), -- Percentual de adesão
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_programs_client_id ON programs(client_id);
CREATE INDEX IF NOT EXISTS idx_programs_user_id ON programs(user_id);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_start_date ON programs(start_date);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

SELECT 
  '✅ Tabela programs criada/verificada' as status,
  COUNT(*) as total_programs
FROM programs;

