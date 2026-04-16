-- Pro Líderes: pausar acesso da equipe (sem apagar dados); revogar = remover linha de membro.
-- Membros pausados não acedem a dados do tenant via RLS; ao retomar, voltam com o mesmo user_id.

ALTER TABLE leader_tenant_members
  ADD COLUMN IF NOT EXISTS team_access_state TEXT NOT NULL DEFAULT 'active';

ALTER TABLE leader_tenant_members
  DROP CONSTRAINT IF EXISTS leader_tenant_members_team_access_state_check;

ALTER TABLE leader_tenant_members
  ADD CONSTRAINT leader_tenant_members_team_access_state_check
  CHECK (team_access_state IN ('active', 'paused'));

ALTER TABLE leader_tenant_members
  DROP CONSTRAINT IF EXISTS leader_tenant_members_leader_always_active;

ALTER TABLE leader_tenant_members
  ADD CONSTRAINT leader_tenant_members_leader_always_active
  CHECK (role <> 'leader' OR team_access_state = 'active');

COMMENT ON COLUMN leader_tenant_members.team_access_state IS
  'active = equipe com acesso ao espaço; paused = líder suspendeu temporariamente (dados do tenant mantêm-se).';

-- --- leader_tenant_members: SELECT (própria linha sempre; pares só se o viewer está active) ---
DROP POLICY IF EXISTS leader_tenant_members_select_tenant ON leader_tenant_members;

CREATE POLICY leader_tenant_members_select_tenant ON leader_tenant_members
  FOR SELECT TO authenticated
  USING (
    leader_tenant_members.user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_members.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM leader_tenant_members m2
      WHERE m2.leader_tenant_id = leader_tenant_members.leader_tenant_id
        AND m2.user_id = auth.uid()
        AND m2.team_access_state = 'active'
    )
  );

-- Dono pode atualizar estado de acesso só de membros (não do papel líder na tabela).
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
    AND team_access_state IN ('active', 'paused')
  );

-- --- leader_tenants: membro só lê tenant se membership active ---
DROP POLICY IF EXISTS leader_tenants_select_member ON leader_tenants;

CREATE POLICY leader_tenants_select_member ON leader_tenants
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT leader_tenant_id FROM leader_tenant_members
      WHERE user_id = auth.uid()
        AND team_access_state = 'active'
    )
  );

-- --- leader_tenant_flow_entries (versão 320) ---
DROP POLICY IF EXISTS leader_tenant_flow_entries_select ON leader_tenant_flow_entries;

CREATE POLICY leader_tenant_flow_entries_select ON leader_tenant_flow_entries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_flow_entries.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR (
      EXISTS (
        SELECT 1 FROM leader_tenant_members m
        WHERE m.leader_tenant_id = leader_tenant_flow_entries.leader_tenant_id
          AND m.user_id = auth.uid()
          AND m.team_access_state = 'active'
      )
      AND leader_tenant_flow_entries.visible_to_team IS TRUE
    )
  );

-- --- leader_tenant_catalog_ylada_visibility ---
DROP POLICY IF EXISTS leader_tenant_catalog_ylada_visibility_select ON leader_tenant_catalog_ylada_visibility;

CREATE POLICY leader_tenant_catalog_ylada_visibility_select ON leader_tenant_catalog_ylada_visibility
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_catalog_ylada_visibility.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM leader_tenant_members m
      WHERE m.leader_tenant_id = leader_tenant_catalog_ylada_visibility.leader_tenant_id
        AND m.user_id = auth.uid()
        AND m.team_access_state = 'active'
    )
  );

-- --- leader_tenant_pl_script_sections + entries (316) ---
DROP POLICY IF EXISTS leader_tenant_pl_script_sections_select ON leader_tenant_pl_script_sections;

CREATE POLICY leader_tenant_pl_script_sections_select ON leader_tenant_pl_script_sections
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_pl_script_sections.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR (
      EXISTS (
        SELECT 1 FROM leader_tenant_members m
        WHERE m.leader_tenant_id = leader_tenant_pl_script_sections.leader_tenant_id
          AND m.user_id = auth.uid()
          AND m.team_access_state = 'active'
      )
      AND leader_tenant_pl_script_sections.visible_to_team IS TRUE
    )
  );

DROP POLICY IF EXISTS leader_tenant_pl_script_entries_select ON leader_tenant_pl_script_entries;

CREATE POLICY leader_tenant_pl_script_entries_select ON leader_tenant_pl_script_entries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenant_pl_script_sections s
      JOIN leader_tenants lt ON lt.id = s.leader_tenant_id
      WHERE s.id = leader_tenant_pl_script_entries.section_id
        AND lt.owner_user_id = auth.uid()
    )
    OR (
      EXISTS (
        SELECT 1 FROM leader_tenant_pl_script_sections s
        JOIN leader_tenant_members m ON m.leader_tenant_id = s.leader_tenant_id
        WHERE s.id = leader_tenant_pl_script_entries.section_id
          AND m.user_id = auth.uid()
          AND m.team_access_state = 'active'
      )
      AND EXISTS (
        SELECT 1 FROM leader_tenant_pl_script_sections s
        WHERE s.id = leader_tenant_pl_script_entries.section_id
          AND s.visible_to_team IS TRUE
      )
    )
  );

-- --- pro_lideres_daily_tasks + completions + weekday_reminders ---
DROP POLICY IF EXISTS pro_lideres_daily_tasks_select_tenant ON pro_lideres_daily_tasks;

CREATE POLICY pro_lideres_daily_tasks_select_tenant ON pro_lideres_daily_tasks
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_daily_tasks.leader_tenant_id
        AND (lt.owner_user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM leader_tenant_members m
          WHERE m.leader_tenant_id = lt.id AND m.user_id = auth.uid()
            AND m.team_access_state = 'active'
        ))
    )
  );

DROP POLICY IF EXISTS pro_lideres_daily_compl_select_tenant ON pro_lideres_daily_task_completions;

CREATE POLICY pro_lideres_daily_compl_select_tenant ON pro_lideres_daily_task_completions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_daily_task_completions.leader_tenant_id
        AND (lt.owner_user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM leader_tenant_members m
          WHERE m.leader_tenant_id = lt.id AND m.user_id = auth.uid()
            AND m.team_access_state = 'active'
        ))
    )
  );

DROP POLICY IF EXISTS pro_lideres_daily_compl_insert_self ON pro_lideres_daily_task_completions;

CREATE POLICY pro_lideres_daily_compl_insert_self ON pro_lideres_daily_task_completions
  FOR INSERT TO authenticated
  WITH CHECK (
    member_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_daily_task_completions.leader_tenant_id
        AND (
          lt.owner_user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM leader_tenant_members m
            WHERE m.leader_tenant_id = lt.id AND m.user_id = auth.uid()
              AND m.team_access_state = 'active'
          )
        )
    )
  );

DROP POLICY IF EXISTS pro_lideres_daily_compl_delete_self ON pro_lideres_daily_task_completions;

CREATE POLICY pro_lideres_daily_compl_delete_self ON pro_lideres_daily_task_completions
  FOR DELETE TO authenticated
  USING (
    member_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_daily_task_completions.leader_tenant_id
        AND (
          lt.owner_user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM leader_tenant_members m
            WHERE m.leader_tenant_id = lt.id AND m.user_id = auth.uid()
              AND m.team_access_state = 'active'
          )
        )
    )
  );

DROP POLICY IF EXISTS pro_lideres_weekday_reminders_select ON pro_lideres_weekday_reminders;

CREATE POLICY pro_lideres_weekday_reminders_select ON pro_lideres_weekday_reminders
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_weekday_reminders.leader_tenant_id
        AND (
          lt.owner_user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM leader_tenant_members m
            WHERE m.leader_tenant_id = lt.id AND m.user_id = auth.uid()
              AND m.team_access_state = 'active'
          )
        )
    )
  );

-- --- Pro Estética Corporal: scripts no mesmo tenant ---
DROP POLICY IF EXISTS leader_tenant_estetica_scripts_select ON leader_tenant_estetica_scripts;

CREATE POLICY leader_tenant_estetica_scripts_select ON leader_tenant_estetica_scripts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_estetica_scripts.leader_tenant_id
        AND lt.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM leader_tenant_members m
      WHERE m.leader_tenant_id = leader_tenant_estetica_scripts.leader_tenant_id
        AND m.user_id = auth.uid()
        AND m.team_access_state = 'active'
    )
  );
