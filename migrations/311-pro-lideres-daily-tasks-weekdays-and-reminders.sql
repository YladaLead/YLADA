-- Pro Líderes: tarefas por dia da semana (sem data civil na definição) + conclusões por dia + lembretes por dia.
-- Idempotente: corre em bases com o schema antigo (task_date) ou já migrado.

-- --- pro_lideres_daily_tasks: task_date → execution_weekdays (0=dom … 6=sáb, como JS Date.getDay) ---
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pro_lideres_daily_tasks' AND column_name = 'task_date'
  ) THEN
    ALTER TABLE pro_lideres_daily_tasks ADD COLUMN IF NOT EXISTS execution_weekdays INTEGER[];

    UPDATE pro_lideres_daily_tasks
    SET execution_weekdays = ARRAY[EXTRACT(DOW FROM task_date)::integer]
    WHERE execution_weekdays IS NULL;

    UPDATE pro_lideres_daily_tasks
    SET execution_weekdays = ARRAY[1,2,3,4,5,6,0]
    WHERE execution_weekdays IS NULL OR cardinality(execution_weekdays) IS NULL OR cardinality(execution_weekdays) < 1;

    ALTER TABLE pro_lideres_daily_tasks ALTER COLUMN execution_weekdays SET NOT NULL;
    ALTER TABLE pro_lideres_daily_tasks DROP COLUMN task_date;

    DROP INDEX IF EXISTS idx_pl_daily_tasks_tenant_date;
    CREATE INDEX IF NOT EXISTS idx_pl_daily_tasks_tenant ON pro_lideres_daily_tasks (leader_tenant_id);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pro_lideres_daily_tasks' AND column_name = 'execution_weekdays'
  ) THEN
    ALTER TABLE pro_lideres_daily_tasks DROP CONSTRAINT IF EXISTS pro_lideres_daily_tasks_execution_weekdays_chk;
    ALTER TABLE pro_lideres_daily_tasks ADD CONSTRAINT pro_lideres_daily_tasks_execution_weekdays_chk
      CHECK (
        cardinality(execution_weekdays) >= 1
        AND execution_weekdays <@ ARRAY[0,1,2,3,4,5,6]::integer[]
      );
  END IF;
END $$;

-- --- pro_lideres_daily_task_completions: uma conclusão por (tarefa, membro, dia civil) ---
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pro_lideres_daily_task_completions'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pro_lideres_daily_task_completions' AND column_name = 'completed_on'
  ) THEN
    ALTER TABLE pro_lideres_daily_task_completions ADD COLUMN completed_on DATE;

    UPDATE pro_lideres_daily_task_completions
    SET completed_on = (completed_at AT TIME ZONE 'UTC')::date
    WHERE completed_on IS NULL;

    ALTER TABLE pro_lideres_daily_task_completions ALTER COLUMN completed_on SET NOT NULL;

    ALTER TABLE pro_lideres_daily_task_completions DROP CONSTRAINT IF EXISTS pro_lideres_daily_task_completions_unique;
    ALTER TABLE pro_lideres_daily_task_completions
      ADD CONSTRAINT pro_lideres_daily_task_completions_unique UNIQUE (task_id, member_user_id, completed_on);

    CREATE INDEX IF NOT EXISTS idx_pl_daily_compl_completed_on
      ON pro_lideres_daily_task_completions (leader_tenant_id, completed_on DESC);
  END IF;
END $$;

-- --- Lembretes / orientações por dia da semana (não são tarefas de construção) ---
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

ALTER TABLE pro_lideres_weekday_reminders ENABLE ROW LEVEL SECURITY;

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

COMMENT ON TABLE pro_lideres_weekday_reminders IS
  'Pro Líderes: orientação/lembrete por dia da semana (0=dom … 6=sáb); separado das tarefas de construção.';

-- --- Conclusões: líder (dono) também pode marcar como a equipa ---
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

COMMENT ON TABLE pro_lideres_daily_tasks IS
  'Tarefas de construção do negócio: executam nos dias da semana indicados; sem data civil na definição.';
COMMENT ON TABLE pro_lideres_daily_task_completions IS
  'Conclusão num dia civil; pontos = pro_lideres_daily_tasks.points por conclusão.';
