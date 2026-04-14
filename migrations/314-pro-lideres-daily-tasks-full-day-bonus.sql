-- Pro Líderes: pontos extra quando o membro marca todas as tarefas aplicáveis num dia civil.

ALTER TABLE leader_tenants
  ADD COLUMN IF NOT EXISTS daily_tasks_full_day_bonus_points INT NOT NULL DEFAULT 10;

ALTER TABLE leader_tenants
  DROP CONSTRAINT IF EXISTS leader_tenants_daily_tasks_full_day_bonus_points_chk;

ALTER TABLE leader_tenants
  ADD CONSTRAINT leader_tenants_daily_tasks_full_day_bonus_points_chk
  CHECK (daily_tasks_full_day_bonus_points >= 0 AND daily_tasks_full_day_bonus_points <= 100000);

COMMENT ON COLUMN leader_tenants.daily_tasks_full_day_bonus_points IS
  'Pontos extra somados uma vez por dia civil quando o membro conclui todas as tarefas que aplicam àquele dia da semana.';
