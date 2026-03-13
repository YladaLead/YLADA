-- Memória de perfil do profissional para o Noel (Layer 4 / Memory Layer)
-- Permite personalizar respostas: profissão, público, objetivo, nível, último tema
-- Ver: docs/YLADA-ARQUITETURA-COMPLETA.md, docs/NOEL-ARQUITETURA-IDEAL-YLADA.md

CREATE TABLE IF NOT EXISTS noel_user_profile_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profession TEXT,
  target_audience TEXT,
  main_goal TEXT,
  experience_level TEXT,
  preferred_strategy TEXT,
  created_diagnosis TEXT,
  last_topic TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_noel_profile_memory_user_id ON noel_user_profile_memory(user_id);

COMMENT ON TABLE noel_user_profile_memory IS 'Memória de perfil do profissional para o Noel (contexto injetado no Layer 4).';
COMMENT ON COLUMN noel_user_profile_memory.profession IS 'Profissão/área do usuário (ex.: nutricionista, esteticista).';
COMMENT ON COLUMN noel_user_profile_memory.target_audience IS 'Público-alvo principal.';
COMMENT ON COLUMN noel_user_profile_memory.main_goal IS 'Objetivo principal (ex.: atrair pacientes, gerar clientes).';
COMMENT ON COLUMN noel_user_profile_memory.last_topic IS 'Último tema abordado na conversa com o Noel.';
