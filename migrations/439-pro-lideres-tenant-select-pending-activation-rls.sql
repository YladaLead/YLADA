-- Garante que membro em pending_activation lê leader_tenants (links de pagamento na /membro/ativacao).
-- Idempotente: reaplica a policy da migration 383.

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
