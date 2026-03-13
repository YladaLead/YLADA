-- Diagnóstico da conversa: persiste bloqueio + estratégia + exemplo quando o Noel responde.
-- Parte do sistema de 3 diagnósticos: profissional, cliente, conversa.
-- Ver: docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md

CREATE TABLE IF NOT EXISTS ylada_noel_conversation_diagnosis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  segment TEXT NOT NULL DEFAULT 'ylada',
  -- Mensagem do profissional (truncada para contexto)
  user_message TEXT NOT NULL,
  -- Diagnóstico estruturado
  bloqueio TEXT,
  estrategia TEXT,
  exemplo TEXT,
  -- Resposta do Noel (truncada)
  assistant_response TEXT,
  -- Códigos detectados (para filtros/analytics)
  situation_codes TEXT[],
  professional_profile_codes TEXT[],
  objective_codes TEXT[],
  funnel_stage_codes TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ylada_conv_diag_user ON ylada_noel_conversation_diagnosis(user_id);
CREATE INDEX IF NOT EXISTS idx_ylada_conv_diag_segment ON ylada_noel_conversation_diagnosis(segment);
CREATE INDEX IF NOT EXISTS idx_ylada_conv_diag_created ON ylada_noel_conversation_diagnosis(created_at DESC);

COMMENT ON TABLE ylada_noel_conversation_diagnosis IS 'Histórico do diagnóstico da conversa: bloqueio, estratégia e exemplo quando o Noel orienta o profissional sobre comunicação.';

-- RLS
ALTER TABLE ylada_noel_conversation_diagnosis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ylada_conv_diag_select ON ylada_noel_conversation_diagnosis;
CREATE POLICY ylada_conv_diag_select ON ylada_noel_conversation_diagnosis
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS ylada_conv_diag_insert ON ylada_noel_conversation_diagnosis;
CREATE POLICY ylada_conv_diag_insert ON ylada_noel_conversation_diagnosis
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
