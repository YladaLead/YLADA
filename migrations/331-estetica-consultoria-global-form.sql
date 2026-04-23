-- Formulário global de consultoria (ex.: diagnóstico corporal): material sem client_id + template_key único.
-- Links e respostas continuam por clínica (estetica_consult_client_id).

ALTER TABLE ylada_estetica_consultancy_materials
  ADD COLUMN IF NOT EXISTS template_key TEXT;

ALTER TABLE ylada_estetica_consultancy_materials
  ALTER COLUMN client_id DROP NOT NULL;

ALTER TABLE ylada_estetica_consultancy_materials
  DROP CONSTRAINT IF EXISTS ylada_estetica_consultancy_materials_client_template_chk;

ALTER TABLE ylada_estetica_consultancy_materials
  ADD CONSTRAINT ylada_estetica_consultancy_materials_client_template_chk CHECK (
    (client_id IS NOT NULL AND template_key IS NULL)
    OR (client_id IS NULL AND template_key IS NOT NULL)
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_ylada_estetica_material_template_key_unique
  ON ylada_estetica_consultancy_materials (template_key)
  WHERE template_key IS NOT NULL;

COMMENT ON COLUMN ylada_estetica_consultancy_materials.template_key IS
  'Chave do modelo global (ex.: diagnostico_corporal_v1). Só preenchido quando client_id é NULL.';
COMMENT ON TABLE ylada_estetica_consultancy_materials IS
  'Materiais por clínica (client_id) OU modelos globais YLADA (template_key, client_id NULL).';
