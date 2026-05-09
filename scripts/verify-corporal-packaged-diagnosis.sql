-- Sanidade: pacotes `ylada_flow_diagnosis_outcomes` para Pro Estética Corporal.
-- Ficheiro SQL puro — não executar `src/config/*.ts` na consola SQL (isso dá erro em `import`).
-- Esperado por template (diagnosis_vertical = corporal, active = true):
--   • Calculadoras (405): PROJECTION_CALCULATOR × (leve, moderado, urgente)
--   • Demais da lista: RISK_DIAGNOSIS × (leve, moderado, urgente)
--
-- Uso: psql "$DATABASE_URL" -f scripts/verify-corporal-packaged-diagnosis.sql
-- Resultado esperado: 0 linhas na query final (sem lacunas).

WITH corporal_calc AS (
  SELECT unnest(
    ARRAY[
      'b1000025-0025-4000-8000-000000000025'::uuid,
      'b1000026-0026-4000-8000-000000000026'::uuid,
      'b1000027-0027-4000-8000-000000000027'::uuid,
      'b1000028-0028-4000-8000-000000000028'::uuid,
      'b1000031-0031-4000-8000-000000000031'::uuid,
      'b1000123-0123-4000-8000-000000000123'::uuid
    ]
  ) AS template_id
),
corporal_risk AS (
  SELECT unnest(
    ARRAY[
      'b1000026-0026-4000-8000-000000000026'::uuid,
      'b1000025-0025-4000-8000-000000000025'::uuid,
      'b1000028-0028-4000-8000-000000000028'::uuid,
      'b1000027-0027-4000-8000-000000000027'::uuid,
      'b1000031-0031-4000-8000-000000000031'::uuid,
      'b1000044-0044-4000-8000-000000000044'::uuid,
      'b1000038-0038-4000-8000-000000000038'::uuid,
      'b1000048-0048-4000-8000-000000000048'::uuid,
      'b1000046-0046-4000-8000-000000000046'::uuid,
      'b1000050-0050-4000-8000-000000000050'::uuid,
      'b1000119-0119-4000-8000-000000000119'::uuid,
      'b1000120-0120-4000-8000-000000000120'::uuid,
      'b1000121-0121-4000-8000-000000000121'::uuid,
      'b1000122-0122-4000-8000-000000000122'::uuid,
      'b1000123-0123-4000-8000-000000000123'::uuid,
      'b1000124-0124-4000-8000-000000000124'::uuid,
      'b1000125-0125-4000-8000-000000000125'::uuid,
      'b1000126-0126-4000-8000-000000000126'::uuid,
      'b1000127-0127-4000-8000-000000000127'::uuid,
      'b1000142-0142-4000-8000-000000000142'::uuid,
      'b1000143-0143-4000-8000-000000000143'::uuid,
      'b1000144-0144-4000-8000-000000000144'::uuid,
      'b1000145-0145-4000-8000-000000000145'::uuid,
      'b1000146-0146-4000-8000-000000000146'::uuid,
      'b1000147-0147-4000-8000-000000000147'::uuid,
      'b1000148-0148-4000-8000-000000000148'::uuid,
      'b1000149-0149-4000-8000-000000000149'::uuid,
      'b1000150-0150-4000-8000-000000000150'::uuid,
      'b1000151-0151-4000-8000-000000000151'::uuid,
      'b1000192-0192-4000-8000-000000000192'::uuid,
      'b1000193-0193-4000-8000-000000000193'::uuid,
      'b1000194-0194-4000-8000-000000000194'::uuid,
      'b1000195-0195-4000-8000-000000000195'::uuid
    ]
  ) AS template_id
  EXCEPT
  SELECT template_id FROM corporal_calc
),
expected AS (
  SELECT
    c.template_id,
    'PROJECTION_CALCULATOR'::text AS architecture,
    a.archetype_code
  FROM corporal_calc c
  CROSS JOIN (
    VALUES
      ('leve'),
      ('moderado'),
      ('urgente')
  ) AS a (archetype_code)
  UNION ALL
  SELECT
    r.template_id,
    'RISK_DIAGNOSIS'::text,
    a.archetype_code
  FROM corporal_risk r
  CROSS JOIN (
    VALUES
      ('leve'),
      ('moderado'),
      ('urgente')
  ) AS a (archetype_code)
)
SELECT
  e.template_id,
  e.architecture,
  e.archetype_code,
  'missing outcome row'::text AS issue
FROM expected e
WHERE NOT EXISTS (
  SELECT 1
  FROM ylada_flow_diagnosis_outcomes o
  WHERE o.template_id = e.template_id
    AND o.architecture = e.architecture
    AND o.archetype_code = e.archetype_code
    AND o.diagnosis_vertical = 'corporal'
    AND o.active = true
)
ORDER BY e.architecture, e.template_id, e.archetype_code;
