-- Pro Líderes recrutamento: unificar texto do botão principal (cta_text) em todos os outcomes RISK_DIAGNOSIS
-- do catálogo de recrutamento (diagnosis_vertical NULL), para PT-BR alinhado ao link público.
-- Idempotente: pode rodar várias vezes.

UPDATE public.ylada_flow_diagnosis_outcomes
SET
  content_json = jsonb_set(
    COALESCE(content_json, '{}'::jsonb),
    '{cta_text}',
    to_jsonb('Quero conhecer novas oportunidades'::text),
    true
  ),
  updated_at = NOW()
WHERE
  architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'quiz-recrut-ganhos-prosperidade',
    'quiz-recrut-potencial-crescimento',
    'quiz-recrut-proposito-equilibrio',
    'renda-extra-imediata',
    'maes-trabalhar-casa',
    'perderam-emprego-transicao',
    'transformar-consumo-renda',
    'jovens-empreendedores',
    'ja-consome-bem-estar',
    'trabalhar-apenas-links',
    'ja-usa-energia-acelera',
    'cansadas-trabalho-atual',
    'ja-tentaram-outros-negocios',
    'querem-trabalhar-digital',
    'ja-empreendem',
    'querem-emagrecer-renda',
    'boas-venda-comercial'
  );
