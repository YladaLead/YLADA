-- Funil admin (Kanban): estágio manual por link de onboarding Pro Líderes (alinhado aos estágios da consultoria estética).

ALTER TABLE pro_lideres_leader_onboarding_links
  ADD COLUMN IF NOT EXISTS admin_funnel_stage TEXT;

UPDATE pro_lideres_leader_onboarding_links
SET admin_funnel_stage = CASE
  WHEN status = 'completed' THEN 'pendente_pagamento'
  ELSE 'entrada'
END
WHERE admin_funnel_stage IS NULL OR trim(admin_funnel_stage) = '';

ALTER TABLE pro_lideres_leader_onboarding_links
  ALTER COLUMN admin_funnel_stage SET DEFAULT 'entrada',
  ALTER COLUMN admin_funnel_stage SET NOT NULL;

ALTER TABLE pro_lideres_leader_onboarding_links
  DROP CONSTRAINT IF EXISTS pro_lideres_leader_onboarding_admin_funnel_stage_check;

ALTER TABLE pro_lideres_leader_onboarding_links
  ADD CONSTRAINT pro_lideres_leader_onboarding_admin_funnel_stage_check
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

COMMENT ON COLUMN pro_lideres_leader_onboarding_links.admin_funnel_stage IS
  'Coluna do funil admin (mesmos valores que ylada_estetica_consult_clients.funnel_stage).';
