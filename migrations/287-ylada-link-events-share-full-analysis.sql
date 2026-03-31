-- Amplia tipos de evento em ylada_link_events (compartilhar resultado, expandir análise completa, result_view).
-- Antes: apenas view, start, complete, cta_click — a API já envia result_view/share_click em alguns fluxos.

ALTER TABLE ylada_link_events DROP CONSTRAINT IF EXISTS ylada_link_events_event_type_check;

ALTER TABLE ylada_link_events ADD CONSTRAINT ylada_link_events_event_type_check CHECK (
  event_type IN (
    'view',
    'start',
    'complete',
    'cta_click',
    'result_view',
    'share_click',
    'full_analysis_expand'
  )
);

COMMENT ON TABLE ylada_link_events IS
  'Eventos por link: view, start, complete, result_view, cta_click (WhatsApp), share_click (compartilhar), full_analysis_expand (abrir análise completa).';
