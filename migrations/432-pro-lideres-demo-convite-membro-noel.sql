-- Convite fixo para testar fluxo de membro (incl. Noel membro) na conta demo@prolider.com.
-- Idempotente: só aplica se existir tenant desse líder. Tabulador "Demonstração" para o formulário de convite.
-- URL: /pro-lideres/convite/ylada_pl_demo_membro_noel_v1
-- Login após cadastro: pldemo.noel.membro@ylada.app (senha definida no convite)

INSERT INTO leader_tenant_tabulators (leader_tenant_id, label, sort_order)
SELECT lt.id, 'Demonstração', 0
FROM leader_tenants lt
JOIN auth.users u ON u.id = lt.owner_user_id AND lower(trim(u.email)) = 'demo@prolider.com'
WHERE NOT EXISTS (
  SELECT 1
  FROM leader_tenant_tabulators t
  WHERE t.leader_tenant_id = lt.id AND lower(trim(t.label)) = 'demonstração'
);

DELETE FROM leader_tenant_invites WHERE token = 'ylada_pl_demo_membro_noel_v1';

INSERT INTO leader_tenant_invites (
  leader_tenant_id,
  token,
  invited_email,
  created_by_user_id,
  expires_at,
  status
)
SELECT
  lt.id,
  'ylada_pl_demo_membro_noel_v1',
  'pldemo.noel.membro@ylada.app',
  lt.owner_user_id,
  now() + interval '10 years',
  'pending'::leader_tenant_invite_status
FROM leader_tenants lt
JOIN auth.users u ON u.id = lt.owner_user_id AND lower(trim(u.email)) = 'demo@prolider.com'
LIMIT 1;
