-- Pro Líderes: contador de quantidade por tarefa (ex.: "falei com X pessoas").
-- O contador é independente dos pontos da tarefa: o membro digita o número real
-- e, se a tarefa tem meta (count_goal) e o número bate/passa a meta, a conclusão
-- (ponto) é gerada automaticamente. Abaixo da meta, o número fica gravado mas sem ponto.

-- 1) Configuração do contador na própria tarefa (ligado pelo líder por tarefa).
ALTER TABLE pro_lideres_daily_tasks
  ADD COLUMN IF NOT EXISTS count_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS count_goal INT,
  ADD COLUMN IF NOT EXISTS count_label TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pro_lideres_daily_tasks_count_goal_range'
  ) THEN
    ALTER TABLE pro_lideres_daily_tasks
      ADD CONSTRAINT pro_lideres_daily_tasks_count_goal_range
      CHECK (count_goal IS NULL OR (count_goal >= 1 AND count_goal <= 100000));
  END IF;
END $$;

-- 2) Quantidade registrada por membro, por tarefa, por dia civil.
CREATE TABLE IF NOT EXISTS pro_lideres_daily_task_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES pro_lideres_daily_tasks (id) ON DELETE CASCADE,
  member_user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  counted_on DATE NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT pro_lideres_daily_task_counts_unique UNIQUE (task_id, member_user_id, counted_on),
  CONSTRAINT pro_lideres_daily_task_counts_qty_range CHECK (quantity >= 0 AND quantity <= 100000)
);

CREATE INDEX IF NOT EXISTS idx_pl_daily_counts_tenant_member ON pro_lideres_daily_task_counts (leader_tenant_id, member_user_id);
CREATE INDEX IF NOT EXISTS idx_pl_daily_counts_counted_on ON pro_lideres_daily_task_counts (leader_tenant_id, counted_on DESC);
CREATE INDEX IF NOT EXISTS idx_pl_daily_counts_task ON pro_lideres_daily_task_counts (task_id);

-- updated_at automático (reaproveita a função criada na migration 310).
DROP TRIGGER IF EXISTS tr_pro_lideres_daily_task_counts_updated_at ON pro_lideres_daily_task_counts;
CREATE TRIGGER tr_pro_lideres_daily_task_counts_updated_at
  BEFORE UPDATE ON pro_lideres_daily_task_counts
  FOR EACH ROW
  EXECUTE FUNCTION pro_lideres_daily_tasks_set_updated_at();

ALTER TABLE pro_lideres_daily_task_counts ENABLE ROW LEVEL SECURITY;

-- SELECT: dono do tenant (líder) OU qualquer membro do tenant.
DROP POLICY IF EXISTS pro_lideres_daily_counts_select_tenant ON pro_lideres_daily_task_counts;
CREATE POLICY pro_lideres_daily_counts_select_tenant ON pro_lideres_daily_task_counts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_daily_task_counts.leader_tenant_id
        AND (lt.owner_user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM leader_tenant_members m
          WHERE m.leader_tenant_id = lt.id AND m.user_id = auth.uid()
        ))
    )
  );

-- INSERT/UPDATE/DELETE: só o próprio membro, dentro de um tenant a que pertence.
DROP POLICY IF EXISTS pro_lideres_daily_counts_insert_self ON pro_lideres_daily_task_counts;
CREATE POLICY pro_lideres_daily_counts_insert_self ON pro_lideres_daily_task_counts
  FOR INSERT TO authenticated
  WITH CHECK (
    member_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM leader_tenants lt
      WHERE lt.id = pro_lideres_daily_task_counts.leader_tenant_id
        AND (
          lt.owner_user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM leader_tenant_members m
            WHERE m.leader_tenant_id = lt.id AND m.user_id = auth.uid()
          )
        )
    )
  );

DROP POLICY IF EXISTS pro_lideres_daily_counts_update_self ON pro_lideres_daily_task_counts;
CREATE POLICY pro_lideres_daily_counts_update_self ON pro_lideres_daily_task_counts
  FOR UPDATE TO authenticated
  USING (member_user_id = auth.uid())
  WITH CHECK (member_user_id = auth.uid());

DROP POLICY IF EXISTS pro_lideres_daily_counts_delete_self ON pro_lideres_daily_task_counts;
CREATE POLICY pro_lideres_daily_counts_delete_self ON pro_lideres_daily_task_counts
  FOR DELETE TO authenticated
  USING (member_user_id = auth.uid());

COMMENT ON TABLE pro_lideres_daily_task_counts IS
  'Quantidade registrada por membro/tarefa/dia (ex.: nº de pessoas com quem falou). Independente dos pontos; a conclusão é gerada quando quantity >= pro_lideres_daily_tasks.count_goal.';
COMMENT ON COLUMN pro_lideres_daily_tasks.count_enabled IS 'Quando true, o membro registra uma quantidade nesta tarefa.';
COMMENT ON COLUMN pro_lideres_daily_tasks.count_goal IS 'Meta de quantidade (ex.: 10). Ao bater/passar, a conclusão (ponto) é gerada automaticamente.';
COMMENT ON COLUMN pro_lideres_daily_tasks.count_label IS 'Rótulo da unidade exibido ao lado do número (ex.: "pessoas"). Opcional.';
