-- =====================================================
-- Trilha Empresarial YLADA — Modelo Need/Playbook/Step
-- Fundamentos + Necessidades; progresso com status e confidence; reflexões; user_strategy_snapshot.
-- @see docs/TRILHA-EMPRESARIAL-ESTRUTURA-NECESSIDADES-PLAYBOOKS.md
-- @see docs/PASSO-A-PASSO-TRILHA-E-PERFIL.md (etapa 1.2)
-- =====================================================

-- Tipo para status do progresso (Noel usa para detectar travas)
DO $$ BEGIN
  CREATE TYPE trilha_progress_status AS ENUM ('not_started', 'in_progress', 'stuck', 'done');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 1) Conteúdo: Necessidades (Fundamentos F1–F5 + Necessidades N1–N7)
CREATE TABLE IF NOT EXISTS trilha_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('fundamento', 'necessidade')),
  title VARCHAR(255) NOT NULL,
  description_short TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trilha_needs_type ON trilha_needs(type);
CREATE INDEX IF NOT EXISTS idx_trilha_needs_order ON trilha_needs(order_index);

COMMENT ON TABLE trilha_needs IS 'Fundamentos (F1–F5) e Necessidades (N1–N7) da Trilha Empresarial; um need agrupa steps (playbook).';

-- 2) Conteúdo: Steps (etapas de cada need; o "playbook" é a sequência ordenada de steps por need)
CREATE TABLE IF NOT EXISTS trilha_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES trilha_needs(id) ON DELETE CASCADE,
  code VARCHAR(30) NOT NULL,
  title VARCHAR(255) NOT NULL,
  objective TEXT NOT NULL,
  guidance TEXT NOT NULL,
  checklist_items JSONB DEFAULT '[]'::jsonb,
  motivational_phrase TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(need_id, code)
);

CREATE INDEX IF NOT EXISTS idx_trilha_steps_need ON trilha_steps(need_id);
CREATE INDEX IF NOT EXISTS idx_trilha_steps_order ON trilha_steps(need_id, order_index);

COMMENT ON TABLE trilha_steps IS 'Steps (etapas) de cada need; ordenados por order_index formam o playbook.';

-- 3) Progresso do usuário por step (status + confidence para o Noel)
CREATE TABLE IF NOT EXISTS trilha_user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES trilha_steps(id) ON DELETE CASCADE,
  status trilha_progress_status NOT NULL DEFAULT 'not_started',
  confidence INTEGER CHECK (confidence >= 1 AND confidence <= 5),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, step_id)
);

CREATE INDEX IF NOT EXISTS idx_trilha_user_progress_user ON trilha_user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_trilha_user_progress_step ON trilha_user_progress(step_id);
CREATE INDEX IF NOT EXISTS idx_trilha_user_progress_status ON trilha_user_progress(user_id, status);

COMMENT ON TABLE trilha_user_progress IS 'Progresso por usuário e step: status (not_started|in_progress|stuck|done) e confidence 1–5.';

-- 4) Reflexões por usuário e step (3 perguntas + situação em 5 linhas)
CREATE TABLE IF NOT EXISTS trilha_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES trilha_steps(id) ON DELETE CASCADE,
  answer_perceived TEXT,
  answer_stuck TEXT,
  answer_next TEXT,
  situation_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, step_id)
);

CREATE INDEX IF NOT EXISTS idx_trilha_reflections_user ON trilha_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_trilha_reflections_step ON trilha_reflections(step_id);

COMMENT ON TABLE trilha_reflections IS 'Respostas de reflexão por step: o que percebeu, o que trava, próximo passo, 5 linhas situação. Injetado no Noel.';

-- 5) Resumo Estratégico Atual (artefato para o Noel; gerado ao salvar reflexão)
CREATE TABLE IF NOT EXISTS user_strategy_snapshot (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_text TEXT,
  snapshot_json JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE user_strategy_snapshot IS 'Resumo estratégico (quem é, dor atual, etapa, o que travou, próximo passo). Backend ou Noel preenche ao salvar reflexão; Noel injeta no system prompt.';

-- Triggers updated_at (reutilizar função se existir ou criar genérica)
CREATE OR REPLACE FUNCTION update_trilha_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_trilha_needs_updated_at ON trilha_needs;
CREATE TRIGGER update_trilha_needs_updated_at
  BEFORE UPDATE ON trilha_needs FOR EACH ROW EXECUTE FUNCTION update_trilha_updated_at();

DROP TRIGGER IF EXISTS update_trilha_steps_updated_at ON trilha_steps;
CREATE TRIGGER update_trilha_steps_updated_at
  BEFORE UPDATE ON trilha_steps FOR EACH ROW EXECUTE FUNCTION update_trilha_updated_at();

DROP TRIGGER IF EXISTS update_trilha_user_progress_updated_at ON trilha_user_progress;
CREATE TRIGGER update_trilha_user_progress_updated_at
  BEFORE UPDATE ON trilha_user_progress FOR EACH ROW EXECUTE FUNCTION update_trilha_updated_at();

DROP TRIGGER IF EXISTS update_trilha_reflections_updated_at ON trilha_reflections;
CREATE TRIGGER update_trilha_reflections_updated_at
  BEFORE UPDATE ON trilha_reflections FOR EACH ROW EXECUTE FUNCTION update_trilha_updated_at();

DROP TRIGGER IF EXISTS update_user_strategy_snapshot_updated_at ON user_strategy_snapshot;
CREATE TRIGGER update_user_strategy_snapshot_updated_at
  BEFORE UPDATE ON user_strategy_snapshot FOR EACH ROW EXECUTE FUNCTION update_trilha_updated_at();

-- RLS (leitura de conteúdo público para autenticados; progresso/reflexões/snapshot só do próprio user)
ALTER TABLE trilha_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trilha_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE trilha_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE trilha_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_strategy_snapshot ENABLE ROW LEVEL SECURITY;

-- Conteúdo: qualquer autenticado pode ler
CREATE POLICY trilha_needs_select ON trilha_needs FOR SELECT TO authenticated USING (true);
CREATE POLICY trilha_steps_select ON trilha_steps FOR SELECT TO authenticated USING (true);

-- Progresso e reflexões: só o próprio usuário
CREATE POLICY trilha_user_progress_select ON trilha_user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY trilha_user_progress_insert ON trilha_user_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY trilha_user_progress_update ON trilha_user_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY trilha_reflections_select ON trilha_reflections FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY trilha_reflections_insert ON trilha_reflections FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY trilha_reflections_update ON trilha_reflections FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY user_strategy_snapshot_select ON user_strategy_snapshot FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY user_strategy_snapshot_insert ON user_strategy_snapshot FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_strategy_snapshot_update ON user_strategy_snapshot FOR UPDATE TO authenticated USING (auth.uid() = user_id);
