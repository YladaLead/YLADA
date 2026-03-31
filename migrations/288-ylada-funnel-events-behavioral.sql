-- Funil público: landing ylada.com/pt → segmentos → cadastro → conta criada.
-- Eventos anônimos (user_id NULL) + user_created após signup com sessão.

ALTER TABLE ylada_behavioral_events DROP CONSTRAINT IF EXISTS ylada_behavioral_events_event_type_check;

ALTER TABLE ylada_behavioral_events ADD CONSTRAINT ylada_behavioral_events_event_type_check CHECK (
  event_type IN (
    'user_created',
    'diagnosis_created',
    'diagnosis_answered',
    'noel_analysis_used',
    'diagnosis_shared',
    'lead_contact_clicked',
    'upgrade_to_pro',
    'funnel_landing_pt_view',
    'funnel_landing_cta_segmentos',
    'funnel_segmentos_view',
    'funnel_cadastro_view',
    'funnel_cadastro_area_selected'
  )
);

COMMENT ON TABLE ylada_behavioral_events IS
  'Eventos comportamentais: operação (diagnóstico, Noel, WhatsApp) + funil marketing (landing PT → cadastro → user_created).';
