-- =====================================================
-- YLADA — ETAPA 1 (CONVICÇÃO) · blueprint C → C → P
-- Tabela do autodiagnóstico do PRÓPRIO negócio (Sujeito A = o profissional).
--
-- Uma linha por (user_id, segment) = Etapa 1 concluída para aquele segmento.
-- A presença da linha é o "gate" de convicção (ver src/lib/conviccao/conviccao-gate.ts).
--
-- Consumida por:
--   src/app/api/ylada/conviccao/route.ts   (GET concluido?/diagnostico · POST upsert)
--   src/app/api/ylada/noel/route.ts         (modo_espelho injeta o perfil salvo)
--   src/lib/conviccao/conviccao-gate.ts      (conviccaoConcluida)
--
-- A API escreve via service role (supabaseAdmin), que ignora RLS.
-- As policies abaixo são rede de segurança para acesso direto do usuário.
-- Seguro de rodar mais de uma vez (idempotente).
-- =====================================================

CREATE TABLE IF NOT EXISTS ylada_conviccao_diagnostico (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Segmento/área do diagnóstico (ylada, estetica, med, coach, ...).
  -- Normalizado no route.ts; default 'ylada'.
  segment     TEXT NOT NULL DEFAULT 'ylada',

  -- Respostas cruas: { [perguntaId]: label escolhido }. 8 perguntas.
  respostas   JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Perfil calculado (pontuação invisível 0..2 por pergunta):
  --   'travada' (pct <= 0.40) | 'oscilante' (<= 0.70) | 'construcao' (> 0.70)
  perfil      TEXT NOT NULL CHECK (perfil IN ('travada', 'oscilante', 'construcao')),

  -- Soma dos pesos (0..16 com 8 perguntas) e percentual 0..1 (2 casas).
  score       INTEGER NOT NULL DEFAULT 0,
  pct         NUMERIC(4,2) NOT NULL DEFAULT 0,

  -- Devolutiva empacotada por perfil (titulo, fraseEspelho, oCiclo, oGap,
  -- primeiroAto, noelSeed). O noelSeed alimenta o Noel modo Espelho.
  devolutiva  JSONB,

  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Um diagnóstico por usuário por segmento (chave do upsert onConflict).
  CONSTRAINT ylada_conviccao_diagnostico_user_segment_key UNIQUE (user_id, segment)
);

CREATE INDEX IF NOT EXISTS idx_ylada_conviccao_user
  ON ylada_conviccao_diagnostico (user_id);

-- =====================================================
-- RLS — cada usuário só enxerga/edita o próprio diagnóstico.
-- (A API usa service role e contorna isto; policy é defesa em profundidade.)
-- =====================================================
ALTER TABLE ylada_conviccao_diagnostico ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conviccao_select_own" ON ylada_conviccao_diagnostico;
CREATE POLICY "conviccao_select_own"
  ON ylada_conviccao_diagnostico FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "conviccao_insert_own" ON ylada_conviccao_diagnostico;
CREATE POLICY "conviccao_insert_own"
  ON ylada_conviccao_diagnostico FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "conviccao_update_own" ON ylada_conviccao_diagnostico;
CREATE POLICY "conviccao_update_own"
  ON ylada_conviccao_diagnostico FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- updated_at automático no UPDATE
-- =====================================================
CREATE OR REPLACE FUNCTION set_ylada_conviccao_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ylada_conviccao_updated_at ON ylada_conviccao_diagnostico;
CREATE TRIGGER trg_ylada_conviccao_updated_at
  BEFORE UPDATE ON ylada_conviccao_diagnostico
  FOR EACH ROW
  EXECUTE FUNCTION set_ylada_conviccao_updated_at();

-- =====================================================
-- Conferência (opcional)
-- =====================================================
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'ylada_conviccao_diagnostico'
-- ORDER BY ordinal_position;
