-- =====================================================
-- ADICIONAR CAMPOS ESTRATÉGICOS AO PERFIL NOEL
-- Migração 024: Implementar perfil estratégico completo
-- Baseado na proposta oficial do perfil do distribuidor
-- =====================================================

BEGIN;

-- =====================================================
-- 1. TIPO DE TRABALHO
-- Como o distribuidor pretende trabalhar
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'tipo_trabalho'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD COLUMN tipo_trabalho TEXT CHECK (tipo_trabalho IN (
      'bebidas_funcionais',
      'produtos_fechados',
      'cliente_que_indica'
    ));
    
    COMMENT ON COLUMN wellness_noel_profile.tipo_trabalho IS 
      'Como pretende trabalhar: bebidas funcionais, produtos fechados ou cliente que indica';
  END IF;
END $$;

-- =====================================================
-- 2. FOCO DE TRABALHO
-- Renda extra, carreira ou ambos
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'foco_trabalho'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD COLUMN foco_trabalho TEXT CHECK (foco_trabalho IN (
      'renda_extra',
      'plano_carreira',
      'ambos'
    ));
    
    COMMENT ON COLUMN wellness_noel_profile.foco_trabalho IS 
      'Foco de trabalho: renda extra, plano de carreira Herbalife ou ambos';
  END IF;
END $$;

-- =====================================================
-- 3. GANHOS PRIORITÁRIOS
-- Vendas, equipe ou ambos
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'ganhos_prioritarios'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD COLUMN ganhos_prioritarios TEXT CHECK (ganhos_prioritarios IN (
      'vendas',
      'equipe',
      'ambos'
    ));
    
    COMMENT ON COLUMN wellness_noel_profile.ganhos_prioritarios IS 
      'Ganhos prioritários: vendas, comissões de equipe (royalties) ou ambos';
  END IF;
END $$;

-- =====================================================
-- 4. NÍVEL ATUAL NA HERBALIFE
-- Hierarquia oficial Herbalife
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'nivel_herbalife'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD COLUMN nivel_herbalife TEXT CHECK (nivel_herbalife IN (
      'novo_distribuidor',
      'supervisor',
      'equipe_mundial',
      'equipe_expansao_global',
      'equipe_milionarios',
      'equipe_presidentes'
    ));
    
    COMMENT ON COLUMN wellness_noel_profile.nivel_herbalife IS 
      'Nível atual na Herbalife: Novo Distribuidor, Supervisor, Equipe Mundial, GET, Milionários ou Presidentes';
  END IF;
END $$;

-- =====================================================
-- 5. CARGA HORÁRIA DIÁRIA
-- Tempo disponível por dia
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'carga_horaria_diaria'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD COLUMN carga_horaria_diaria TEXT CHECK (carga_horaria_diaria IN (
      '1_hora',
      '1_a_2_horas',
      '2_a_4_horas',
      'mais_4_horas'
    ));
    
    COMMENT ON COLUMN wellness_noel_profile.carga_horaria_diaria IS 
      'Carga horária de dedicação diária: 1h, 1-2h, 2-4h ou mais de 4h';
  END IF;
END $$;

-- =====================================================
-- 6. DIAS POR SEMANA
-- Quantos dias por semana pode trabalhar
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'dias_por_semana'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD COLUMN dias_por_semana TEXT CHECK (dias_por_semana IN (
      '1_a_2_dias',
      '3_a_4_dias',
      '5_a_6_dias',
      'todos_dias'
    ));
    
    COMMENT ON COLUMN wellness_noel_profile.dias_por_semana IS 
      'Quantos dias por semana consegue trabalhar: 1-2, 3-4, 5-6 ou todos os dias';
  END IF;
END $$;

-- =====================================================
-- 7. META PARA 3 MESES
-- Plano tático imediato
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'meta_3_meses'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD COLUMN meta_3_meses TEXT;
    
    COMMENT ON COLUMN wellness_noel_profile.meta_3_meses IS 
      'Meta para os próximos 3 meses (plano tático imediato)';
  END IF;
END $$;

-- =====================================================
-- 8. META PARA 1 ANO
-- Plano estratégico (ligado ao Plano Presidente)
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'meta_1_ano'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD COLUMN meta_1_ano TEXT;
    
    COMMENT ON COLUMN wellness_noel_profile.meta_1_ano IS 
      'Meta para 1 ano (plano estratégico - ligado ao Plano Presidente)';
  END IF;
END $$;

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_noel_profile_tipo_trabalho 
  ON wellness_noel_profile(tipo_trabalho);

CREATE INDEX IF NOT EXISTS idx_noel_profile_nivel_herbalife 
  ON wellness_noel_profile(nivel_herbalife);

CREATE INDEX IF NOT EXISTS idx_noel_profile_foco_trabalho 
  ON wellness_noel_profile(foco_trabalho);

CREATE INDEX IF NOT EXISTS idx_noel_profile_carga_horaria 
  ON wellness_noel_profile(carga_horaria_diaria);

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================
COMMENT ON TABLE wellness_noel_profile IS 
  'Perfil completo do distribuidor para personalização estratégica do NOEL - Versão 2.0';

COMMIT;

-- =====================================================
-- 9. OBSERVAÇÕES ADICIONAIS
-- Campo livre para informações extras importantes
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_noel_profile' 
    AND column_name = 'observacoes_adicionais'
  ) THEN
    ALTER TABLE wellness_noel_profile 
    ADD COLUMN observacoes_adicionais TEXT;
    
    COMMENT ON COLUMN wellness_noel_profile.observacoes_adicionais IS 
      'Observações adicionais e informações importantes que o NOEL deve saber (máx 500 caracteres)';
  END IF;
END $$;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- Execute esta query para verificar se todos os campos foram criados:
-- 
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'wellness_noel_profile'
-- ORDER BY ordinal_position;
