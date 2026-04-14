-- Pro Líderes: tarefas de construção (dias da semana) + conclusões por dia civil + lembretes por dia.
-- weekday: 0=domingo … 6=sábado (igual a Date.getDay() em JS).

CREATE TABLE IF NOT EXISTS pro_lideres_daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  points INT NOT NULL DEFAULT 1,
  execution_weekdays INTEGER[] NOT NULL DEFAULT '{1,2,3,4,5,6,0}',
  sort_order INT NOT NULL DEFAULT 0,
  created_by_user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT pro_lideres_daily_tasks_title_nonempty CHECK (length(trim(title)) > 0),
  CONSTRAINT pro_lideres_daily_tasks_points_range CHECK (points >= 0 AND points <= 100000),
  CONSTRAINT pro_lideres_daily_tasks_execution_weekdays_chk CHECK (
    cardinality(execution_weekdays) >= 1
    AND execution_weekdays <@ ARRAY[0,1,2,3,4,5,6]::integer[]
  )
);

CREATE INDEX IF NOT EXISTS idx_pl_daily_tasks_tenant ON pro_lideres_daily_tasks (leader_tenant_id);

CREATE TABLE IF NOT EXISTS pro_lideres_daily_task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES pro_lideres_daily_tasks (id) ON DELETE CASCADE,
  member_user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  completed_on DATE NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT pro_lideres_daily_task_completions_unique UNIQUE (task_id, member_user_id, completed_on)
);

CREATE INDEX IF NOT EXISTS idx_pl_daily_compl_tenant_member ON pro_lideres_daily_task_completions (leader_tenant_id, member_user_id);
CREATE INDEX IF NOT EXISTS idx_pl_daily_compl_completed_on ON pro_lideres_daily_task_completions (leader_tenant_id, completed_on DESC);
CREATE INDEX IF NOT EXISTS idx_pl_daily_compl_task ON pro_lideres_daily_task_completions (task_id);

CREATE TABLE IF NOT EXISTS pro_lideres_weekday_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  weekday SMALLINT NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  body TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (leader_tenant_id, weekday)
);

CREATE INDEX IF NOT EXISTS idx_pl_weekday_reminders_tenant ON pro_lideres_weekday_reminders (leader_tenant_id);

CREATE OR REPLACE FUNCTION pro_lideres_daily_tasks_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_pro_lideres_daily_tasks_updated_at ON pro_lideres_daily_tasks;
CREATE TRIGGER tr_pro_lideres_daily_tasks_updated_at
  BEFORE UPDATE ON pro_lideres_daily_tasks
  FOR EACH ROW
  EXECUTE FUNCTION pro_lideres_daily_tasks_set_updated_at();

CREATE OR REPLACE FUNCTION pro_lideres_weekday_reminders_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_pro_lideres_weekday_reminders_updated_at ON pro_lideres_weekday_reminders;
CREATE TRIGGER tr_pro_lideres_weekday_reminders_updated_at
  BEFORE UPDATE ON pro_lideres_weekday_reminders
  FOR EACH ROW
  EXECUTE FUNCTION pro_lideres_weekday_reminders_set_updated_at();

ALTER TABLE pro_lideres_daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_lideres_daily_task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_lideres_weekday_reminders ENABLE ROW LEVEL SECURITY;

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
        ))
    )
  );

DROP POLICY IF EXISTS pro_lideres_daily_tasks_insert_owner ON pro_lideres_daily_tasks;
CREATE POLICY pro_lideres_daily_tasks_insert_owner ON pro_lideres_daily_tasks
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_id AND lt.owner_user_id = auth.uid()
    )
    AND created_by_user_id = auth.uid()
  );

DROP POLICY IF EXISTS pro_lideres_daily_tasks_update_owner ON pro_lideres_daily_tasks;
CREATE POLICY pro_lideres_daily_tasks_update_owner ON pro_lideres_daily_tasks
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_daily_tasks.leader_tenant_id AND lt.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS pro_lideres_daily_tasks_delete_owner ON pro_lideres_daily_tasks;
CREATE POLICY pro_lideres_daily_tasks_delete_owner ON pro_lideres_daily_tasks
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_daily_tasks.leader_tenant_id AND lt.owner_user_id = auth.uid()
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
          )
        )
    )
  );

DROP POLICY IF EXISTS pro_lideres_weekday_reminders_upsert_owner ON pro_lideres_weekday_reminders;
CREATE POLICY pro_lideres_weekday_reminders_upsert_owner ON pro_lideres_weekday_reminders
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = leader_tenant_id AND lt.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS pro_lideres_weekday_reminders_update_owner ON pro_lideres_weekday_reminders;
CREATE POLICY pro_lideres_weekday_reminders_update_owner ON pro_lideres_weekday_reminders
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_weekday_reminders.leader_tenant_id AND lt.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS pro_lideres_weekday_reminders_delete_owner ON pro_lideres_weekday_reminders;
CREATE POLICY pro_lideres_weekday_reminders_delete_owner ON pro_lideres_weekday_reminders
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_weekday_reminders.leader_tenant_id AND lt.owner_user_id = auth.uid()
    )
  );

COMMENT ON TABLE pro_lideres_daily_tasks IS
  'Tarefas de construção do negócio: executam nos dias da semana indicados; sem data civil na definição.';
COMMENT ON TABLE pro_lideres_daily_task_completions IS
  'Conclusão num dia civil; pontos = pro_lideres_daily_tasks.points por conclusão.';
COMMENT ON TABLE pro_lideres_weekday_reminders IS
  'Orientação/lembrete por dia da semana; separado das tarefas de construção.';
