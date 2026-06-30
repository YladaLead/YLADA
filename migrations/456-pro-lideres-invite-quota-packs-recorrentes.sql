-- Pacotes +50 convites Pro Líderes: assinatura mensal por pacote (cada um renova no dia da contratação).

CREATE TABLE IF NOT EXISTS pro_lideres_invite_quota_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  owner_user_id UUID NOT NULL,
  slots SMALLINT NOT NULL DEFAULT 50 CHECK (slots > 0),
  amount_brl NUMERIC(12, 2) NOT NULL DEFAULT 750,
  billing_day SMALLINT NOT NULL CHECK (billing_day >= 1 AND billing_day <= 31),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'past_due', 'canceled')),
  mp_preapproval_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pro_lideres_invite_quota_packs_mp_preapproval
  ON pro_lideres_invite_quota_packs (mp_preapproval_id)
  WHERE mp_preapproval_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pro_lideres_invite_quota_packs_tenant_status
  ON pro_lideres_invite_quota_packs (leader_tenant_id, status);

COMMENT ON TABLE pro_lideres_invite_quota_packs IS
  'Cada linha = pacote recorrente de +50 convites (R$ 750/mês). Inadimplência bloqueia o painel do líder.';

ALTER TABLE pro_lideres_invite_quota_packs ENABLE ROW LEVEL SECURITY;

ALTER TABLE pro_lideres_invite_quota_mp_receipts
  ADD COLUMN IF NOT EXISTS pack_id UUID REFERENCES pro_lideres_invite_quota_packs (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_renewal BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN pro_lideres_invite_quota_mp_receipts.is_renewal IS
  'TRUE quando é renovação mensal do pacote; FALSE na primeira ativação ou PIX de regularização.';

-- Migrar recibos avulsos existentes para pacotes (billing_day = dia do pagamento).
INSERT INTO pro_lideres_invite_quota_packs (
  id,
  leader_tenant_id,
  owner_user_id,
  slots,
  amount_brl,
  billing_day,
  status,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  r.leader_tenant_id,
  r.owner_user_id,
  COALESCE(r.slots_added, 50),
  r.amount_brl,
  LEAST(GREATEST(EXTRACT(DAY FROM r.created_at AT TIME ZONE 'America/Sao_Paulo')::INT, 1), 31),
  CASE
    WHEN r.created_at + INTERVAL '1 month' > NOW() THEN 'active'
    ELSE 'past_due'
  END,
  r.created_at,
  r.created_at + INTERVAL '1 month',
  r.created_at,
  NOW()
FROM pro_lideres_invite_quota_mp_receipts r
WHERE r.pack_id IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM pro_lideres_invite_quota_packs p
    WHERE p.leader_tenant_id = r.leader_tenant_id
      AND p.created_at = r.created_at
  );

UPDATE pro_lideres_invite_quota_mp_receipts r
SET pack_id = p.id
FROM pro_lideres_invite_quota_packs p
WHERE r.pack_id IS NULL
  AND p.leader_tenant_id = r.leader_tenant_id
  AND p.owner_user_id = r.owner_user_id
  AND ABS(EXTRACT(EPOCH FROM (p.created_at - r.created_at))) < 5;
