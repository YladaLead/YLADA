-- Pré-diagnóstico: permitir link público sem ficha pré-criada (estetica_consult_client_id NULL).
-- Ao enviar o formulário, a API cria ylada_estetica_consult_clients e associa a resposta.

ALTER TABLE ylada_estetica_consultancy_share_links
  ALTER COLUMN estetica_consult_client_id DROP NOT NULL;

COMMENT ON COLUMN ylada_estetica_consultancy_share_links.estetica_consult_client_id IS
  'Clínica destino; NULL = link de entrada pública (pré-diagnóstico), cria ficha no primeiro envio.';

CREATE UNIQUE INDEX IF NOT EXISTS idx_ylada_estetica_one_open_pre_link_per_material
  ON ylada_estetica_consultancy_share_links (material_id)
  WHERE estetica_consult_client_id IS NULL;
