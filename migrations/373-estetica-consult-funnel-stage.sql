-- Funil operacional (Kanban admin): estágio manual por ficha — não substitui pré/diagnóstico na Jornada.

ALTER TABLE ylada_estetica_consult_clients
  ADD COLUMN IF NOT EXISTS funnel_stage TEXT;

UPDATE ylada_estetica_consult_clients
SET funnel_stage = 'entrada'
WHERE funnel_stage IS NULL OR trim(funnel_stage) = '';

ALTER TABLE ylada_estetica_consult_clients
  ALTER COLUMN funnel_stage SET DEFAULT 'entrada',
  ALTER COLUMN funnel_stage SET NOT NULL;

ALTER TABLE ylada_estetica_consult_clients
  DROP CONSTRAINT IF EXISTS ylada_estetica_consult_clients_funnel_stage_check;

ALTER TABLE ylada_estetica_consult_clients
  ADD CONSTRAINT ylada_estetica_consult_clients_funnel_stage_check
  CHECK (
    funnel_stage IN (
      'entrada',
      'reuniao_agendada',
      'reuniao_feita',
      'pendente_pagamento',
      'pendente_cliente',
      'em_andamento'
    )
  );

COMMENT ON COLUMN ylada_estetica_consult_clients.funnel_stage IS
  'Estágio manual do funil (admin Kanban): contacto → reunião → pagamento / cliente / execução.';
