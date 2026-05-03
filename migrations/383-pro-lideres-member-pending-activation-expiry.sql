-- Pro Líderes: membro novo em pending_activation até o líder ativar; data opcional de fim de acesso.

ALTER TABLE leader_tenant_members
  ADD COLUMN IF NOT EXISTS team_access_expires_at TIMESTAMPTZ;

COMMENT ON COLUMN leader_tenant_members.team_access_expires_at IS
  'Opcional: após esta data o membro deixa de aceder ao painel (gate na app). Renovação pelo líder.';

ALTER TABLE leader_tenant_members
  DROP CONSTRAINT IF EXISTS leader_tenant_members_team_access_state_check;

ALTER TABLE leader_tenant_members
  ADD CONSTRAINT leader_tenant_members_team_access_state_check
  CHECK (team_access_state IN ('active', 'paused', 'pending_activation'));

ALTER TABLE leader_tenant_members
  DROP CONSTRAINT IF EXISTS leader_tenant_members_leader_always_active;

ALTER TABLE leader_tenant_members
  ADD CONSTRAINT leader_tenant_members_leader_always_active
  CHECK (role <> 'leader' OR team_access_state = 'active');

COMMENT ON COLUMN leader_tenant_members.team_access_state IS
  'active = acesso ao espaço; paused = líder suspendeu; pending_activation = convite aceite, líder ainda não ativou o acesso.';

DROP POLICY IF EXISTS leader_tenant_members_update_access_by_owner ON leader_tenant_members;

CREATE POLICY leader_tenant_members_update_access_by_owner ON leader_tenant_members
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_members.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    AND role = 'member'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_members.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    AND role = 'member'
    AND team_access_state IN ('active', 'paused', 'pending_activation')
  );

-- Membro pending_activation precisa de ler o tenant (nome + links de pagamento) sem acesso ao catálogo.
DROP POLICY IF EXISTS leader_tenants_select_member ON leader_tenants;

CREATE POLICY leader_tenants_select_member ON leader_tenants
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT leader_tenant_id FROM leader_tenant_members
      WHERE user_id = auth.uid()
        AND team_access_state IN ('active', 'pending_activation')
    )
  );
