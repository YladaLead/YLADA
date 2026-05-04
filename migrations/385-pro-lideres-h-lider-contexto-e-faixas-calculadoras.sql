-- Pro Líderes / H-Líder (Herbalife): contexto explícito nos links preset (vendas + recrutamento) + faixas na Calculadora de Água.
-- Idempotente: não duplica se o subtítulo já contiver "Área H-Líder (Herbalife)".

WITH patched AS (
  SELECT
    y.id,
    trim(
      BOTH FROM concat_ws(
        E'\n\n',
        NULLIF(trim(BOTH FROM COALESCE(y.config_json #>> '{page,subtitle}', '')), ''),
        CASE
          WHEN COALESCE(y.config_json #>> '{page,subtitle}', '') ILIKE '%Área H-Líder (Herbalife)%' THEN NULL
          WHEN y.config_json -> 'meta' ->> 'pro_lideres_kind' = 'sales' THEN
            'Área H-Líder (Herbalife): o próximo passo é conversar com o Consultor Independente Herbalife que te enviou este link — hábitos, nutrição e bem-estar.'
          ELSE
            'Área H-Líder (Herbalife): próximo passo é continuar no WhatsApp com quem te enviou este link sobre oportunidade de negócio independente.'
        END
      )
    ) AS new_page_text
  FROM ylada_links y
  WHERE
    y.status = 'active'
    AND y.template_id = 'a0000001-0001-4000-8000-000000000001'::uuid
    AND y.config_json -> 'meta' ->> 'pro_lideres_preset' = 'true'
    AND (
      y.config_json -> 'meta' ->> 'pro_lideres_kind' = 'sales'
      OR y.config_json -> 'meta' ->> 'pro_lideres_kind' = 'recruitment'
    )
)
UPDATE ylada_links AS y
SET
  config_json =
    jsonb_set(
      jsonb_set(y.config_json, '{page,subtitle}', to_jsonb(p.new_page_text), TRUE),
      '{page,when_to_use}',
      to_jsonb(p.new_page_text),
      TRUE
    ),
  updated_at = NOW()
FROM patched p
WHERE y.id = p.id
  AND length(p.new_page_text) > 0;

-- Calculadora de Água (preset vendas): peso em faixas em vez de escala numérica longa.
UPDATE ylada_links
SET
  config_json = jsonb_set(
    config_json,
    '{form,fields}',
    '[
      {"id":"peso","label":"Qual é o seu peso aproximado?","type":"single","options":["Até 55 kg","56–70 kg","71–85 kg","86–100 kg","Acima de 100 kg"]},
      {"id":"atividade","label":"Seu nível de atividade é alto?","type":"single","options":["Sim","Não"]},
      {"id":"clima","label":"Você vive em clima quente na maior parte do tempo?","type":"single","options":["Sim","Não"]},
      {"id":"sede","label":"Sente sede com frequência durante o dia?","type":"single","options":["Sim","Não"]},
      {"id":"rotina","label":"Quer uma meta diária simples de seguir?","type":"single","options":["Sim","Não"]}
    ]'::jsonb,
    TRUE
  ),
  updated_at = NOW()
WHERE
  template_id = 'a0000001-0001-4000-8000-000000000001'::uuid
  AND slug LIKE '%-v-calc-hidratacao'
  AND config_json -> 'meta' ->> 'pro_lideres_fluxo_id' = 'calc-hidratacao';

-- Legado: preset IMC ainda como diagnóstico (se existir): altura/peso em faixas.
UPDATE ylada_links
SET
  config_json = jsonb_set(
    config_json,
    '{form,fields}',
    '[
      {"id":"peso","label":"Qual faixa melhor descreve o seu peso aproximado?","type":"single","options":["Até 59 kg","60–74 kg","75–89 kg","90 kg ou mais"]},
      {"id":"altura","label":"Qual faixa melhor descreve a sua altura?","type":"single","options":["Até 154 cm","155–164 cm","165–174 cm","175 cm ou mais"]},
      {"id":"rotina","label":"Consegue manter rotina semanal de cuidado?","type":"single","options":["Sim","Não"]},
      {"id":"energia","label":"Sua energia atual está abaixo do que gostaria?","type":"single","options":["Sim","Não"]},
      {"id":"objetivo","label":"Quer usar esse indicador para orientar seus próximos passos?","type":"single","options":["Sim","Não"]}
    ]'::jsonb,
    TRUE
  ),
  updated_at = NOW()
WHERE
  template_id = 'a0000001-0001-4000-8000-000000000001'::uuid
  AND slug LIKE '%-v-calc-imc'
  AND config_json -> 'meta' ->> 'pro_lideres_fluxo_id' = 'calc-imc';
