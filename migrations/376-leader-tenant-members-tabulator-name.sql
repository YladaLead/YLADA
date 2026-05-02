-- Pro Líderes: nome do tabulador escolhido no convite (lista pré-definida na app).

ALTER TABLE leader_tenant_members
  ADD COLUMN IF NOT EXISTS pro_lideres_tabulator_name TEXT;

COMMENT ON COLUMN leader_tenant_members.pro_lideres_tabulator_name IS
  'Nome do tabulador escolhido no convite (valor da lista configurada no frontend).';
