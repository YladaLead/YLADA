-- Notas de acompanhamento ao vivo (consultoria estética): evolução, recomendações; base futura para IA.

CREATE TABLE IF NOT EXISTS ylada_estetica_consult_coaching_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  client_id UUID NOT NULL REFERENCES ylada_estetica_consult_clients (id) ON DELETE CASCADE,
  note_kind TEXT NOT NULL DEFAULT 'acompanhamento'
    CHECK (note_kind IN ('observacao', 'recomendacao', 'evolucao', 'acompanhamento')),
  body TEXT NOT NULL,
  created_by_user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  CONSTRAINT ylada_estetica_consult_coaching_notes_body_nonempty CHECK (length(trim(body)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_ylada_estetica_coaching_notes_client
  ON ylada_estetica_consult_coaching_notes (client_id, created_at DESC);

ALTER TABLE ylada_estetica_consult_coaching_notes ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE ylada_estetica_consult_coaching_notes IS
  'Notas da consultora por cliente estética (acompanhamento, recomendações, evolução).';
