-- Funil admin: estágio por resposta de formulário da consultoria Pro Líderes (ex.: pré-diagnóstico estratégico).

ALTER TABLE pro_lideres_consultancy_form_responses
  ADD COLUMN IF NOT EXISTS admin_funnel_stage TEXT;

-- Pré-diagnóstico estratégico (material global) → coluna «Pré-reunião feita · ficou de pagar» no funil.
UPDATE pro_lideres_consultancy_form_responses
SET admin_funnel_stage = 'pendente_pagamento'
WHERE admin_funnel_stage IS NULL OR trim(admin_funnel_stage) = ''
  AND material_id = 'f8a3c2d1-4e5b-6a7c-8d9e-0f1a2b3c4d5e'::uuid;

UPDATE pro_lideres_consultancy_form_responses
SET admin_funnel_stage = 'entrada'
WHERE admin_funnel_stage IS NULL OR trim(admin_funnel_stage) = '';

ALTER TABLE pro_lideres_consultancy_form_responses
  ALTER COLUMN admin_funnel_stage SET DEFAULT 'entrada',
  ALTER COLUMN admin_funnel_stage SET NOT NULL;

ALTER TABLE pro_lideres_consultancy_form_responses
  DROP CONSTRAINT IF EXISTS pro_lideres_consultancy_resp_admin_funnel_stage_check;

ALTER TABLE pro_lideres_consultancy_form_responses
  ADD CONSTRAINT pro_lideres_consultancy_resp_admin_funnel_stage_check
  CHECK (
    admin_funnel_stage IN (
      'entrada',
      'reuniao_agendada',
      'reuniao_feita',
      'pendente_pagamento',
      'pendente_cliente',
      'em_andamento'
    )
  );

COMMENT ON COLUMN pro_lideres_consultancy_form_responses.admin_funnel_stage IS
  'Estágio manual no funil admin (Kanban vista Pro líder), por resposta de formulário.';
