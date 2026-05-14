-- Pré-diagnóstico Pro Líderes: opções «Ferramentas» — Desafio 15 dias (acompanhamento) + Reset Seis (6 dias, bebidas funcionais).

UPDATE pro_lideres_consultancy_materials AS m
SET
  content = jsonb_set(
    m.content,
    '{fields}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN elem->>'id' = 'ferramentas' THEN
            jsonb_set(
              elem,
              '{options}',
              '["Espaço vida saudável","Desafio 15 dias (programa com acompanhamento)","Desafios de perda de peso","Reset Seis — 6 dias com bebidas funcionais","Bebidas funcionais","Avaliações do bem-estar","Outros"]'::jsonb
            )
          ELSE elem
        END
        ORDER BY ord
      )
      FROM jsonb_array_elements(m.content->'fields') WITH ORDINALITY AS t(elem, ord)
    )
  ),
  updated_at = NOW()
WHERE m.id = 'f8a3c2d1-4e5b-6a7c-8d9e-0f1a2b3c4d5e'::uuid
  AND m.content ? 'fields'
  AND NOT (m.content::text LIKE '%Desafio 15 dias (programa com acompanhamento)%');
