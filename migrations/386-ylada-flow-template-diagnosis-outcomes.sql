-- Pacotes de diagnóstico por modelo de quiz (template_id) ou catálogo (flow_id) + arquétipo.
-- Prioridade na API: ylada_link_diagnosis_content → esta tabela → ylada_diagnosis_archetypes → motor em código.
-- diagnosis_vertical NULL = aplica a qualquer vertical; valor = só para links com meta.diagnosis_vertical igual.

CREATE TABLE IF NOT EXISTS public.ylada_flow_diagnosis_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  template_id uuid REFERENCES public.ylada_link_templates(id) ON DELETE CASCADE,
  flow_id text,
  diagnosis_vertical text,
  architecture text NOT NULL,
  archetype_code text NOT NULL,
  content_json jsonb NOT NULL,
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT ylada_flow_diagnosis_outcomes_scope_chk CHECK (
    (template_id IS NOT NULL AND (flow_id IS NULL OR btrim(flow_id) = ''))
    OR (template_id IS NULL AND flow_id IS NOT NULL AND btrim(flow_id) <> '')
  )
);

CREATE OR REPLACE FUNCTION public.ylada_flow_diagnosis_outcomes_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_ylada_flow_diagnosis_outcomes_updated_at ON public.ylada_flow_diagnosis_outcomes;
CREATE TRIGGER tr_ylada_flow_diagnosis_outcomes_updated_at
  BEFORE UPDATE ON public.ylada_flow_diagnosis_outcomes
  FOR EACH ROW EXECUTE FUNCTION public.ylada_flow_diagnosis_outcomes_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_ylada_flow_diag_outcomes_tmpl
  ON public.ylada_flow_diagnosis_outcomes (template_id, architecture, archetype_code)
  WHERE template_id IS NOT NULL AND active = true;

CREATE INDEX IF NOT EXISTS idx_ylada_flow_diag_outcomes_flow
  ON public.ylada_flow_diagnosis_outcomes (flow_id, architecture, archetype_code)
  WHERE flow_id IS NOT NULL AND btrim(flow_id) <> '' AND active = true;

CREATE UNIQUE INDEX IF NOT EXISTS uq_ylada_flow_diag_outcomes_tmpl
  ON public.ylada_flow_diagnosis_outcomes (template_id, architecture, archetype_code, COALESCE(diagnosis_vertical, ''))
  WHERE template_id IS NOT NULL AND active = true;

CREATE UNIQUE INDEX IF NOT EXISTS uq_ylada_flow_diag_outcomes_flow
  ON public.ylada_flow_diagnosis_outcomes (flow_id, architecture, archetype_code, COALESCE(diagnosis_vertical, ''))
  WHERE flow_id IS NOT NULL AND btrim(flow_id) <> '' AND active = true;

COMMENT ON TABLE public.ylada_flow_diagnosis_outcomes IS
  'Diagnóstico pré-escrito por template de biblioteca (template_id) ou flow_id do catálogo, arquétipo (leve|moderado|urgente|bloqueio_pratico|bloqueio_emocional) e opcionalmente diagnosis_vertical.';

ALTER TABLE public.ylada_flow_diagnosis_outcomes ENABLE ROW LEVEL SECURITY;

-- archetype_code: leve | moderado | urgente | bloqueio_pratico | bloqueio_emocional
-- architecture: RISK_DIAGNOSIS | BLOCKER_DIAGNOSIS
-- diagnosis_vertical: capilar | corporal | pro_lideres | NULL (vale para qualquer vertical)
--
-- Exemplo de linha (ajuste template_id ao seu banco):
-- INSERT INTO public.ylada_flow_diagnosis_outcomes
--   (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
-- VALUES (
--   'b1000103-0103-4000-8000-000000000103'::uuid,
--   'RISK_DIAGNOSIS',
--   'leve',
--   'capilar',
--   '{"profile_title":"...","profile_summary":"...","main_blocker":"...","consequence":"...","growth_potential":"...","cta_text":"...","whatsapp_prefill":"..."}'::jsonb
-- );
