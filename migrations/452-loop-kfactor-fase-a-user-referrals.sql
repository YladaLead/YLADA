-- Loop viral / k-factor — Fase A (Spec_Loop_KFactor §5.4).
-- Torna a indicação CONTÁVEL: código curto por usuário + tabela de indicações.
-- Adição pura: nenhuma tabela existente é alterada. Escrita só via service role
-- (supabaseAdmin bypassa RLS); RLS abaixo só libera LEITURA ao próprio indicador.
-- Idempotente: pode rodar mais de uma vez.

-- 1) Código de indicação curto e estável por usuário (não expõe UUID interno na URL).
CREATE TABLE IF NOT EXISTS referral_codes (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  code       text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Indicações: 1 linha por usuário indicado (referred_user_id único).
--    signed_up_at = cadastro atribuído (cedo); activated_at = criou o 1º link (k honesto).
CREATE TABLE IF NOT EXISTS user_referrals (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id  uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code     text,
  source            text,                          -- 'diagnostico' | 'conteudo'
  origin_slug       text,                          -- link de origem, quando houver
  signed_up_at      timestamptz,
  activated_at      timestamptz,                   -- null até criar o 1º link
  created_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_referrals_no_self CHECK (referrer_user_id <> referred_user_id)
);

CREATE INDEX IF NOT EXISTS user_referrals_referrer_idx ON user_referrals (referrer_user_id);
CREATE INDEX IF NOT EXISTS user_referrals_activated_idx ON user_referrals (activated_at);
CREATE INDEX IF NOT EXISTS user_referrals_created_idx   ON user_referrals (created_at);

-- 3) RLS: leitura restrita ao indicador (referrer). Escrita só via service role.
ALTER TABLE referral_codes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS referral_codes_select_own ON referral_codes;
CREATE POLICY referral_codes_select_own ON referral_codes
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS user_referrals_select_referrer ON user_referrals;
CREATE POLICY user_referrals_select_referrer ON user_referrals
  FOR SELECT TO authenticated
  USING (referrer_user_id = auth.uid());

-- 4) Estende o CHECK de ylada_behavioral_events com os 3 eventos do loop (§5.4).
--    Reaplica a lista da migration 290 + referral_* (DROP/ADD = não acumula constraints).
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
    'funnel_cadastro_area_selected',
    'funnel_hub_segmento_clicado',
    'funnel_entrada_nicho',
    'freemium_limit_hit',
    'freemium_paywall_view',
    'freemium_upgrade_cta_click',
    'referral_landing_view',
    'referral_signup',
    'referral_activated'
  )
);
