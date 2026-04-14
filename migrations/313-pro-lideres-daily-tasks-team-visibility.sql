-- Pro Líderes: líder pode ocultar «Tarefas diárias» à equipe (menu + APIs + rota).

ALTER TABLE leader_tenants
  ADD COLUMN IF NOT EXISTS daily_tasks_visible_to_team BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN leader_tenants.daily_tasks_visible_to_team IS
  'Se false, membros não veem menu nem /painel/tarefas; o líder continua a ver e a editar.';
