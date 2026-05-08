-- Sanidade: pacotes `ylada_flow_diagnosis_outcomes` para Pro Estética Capilar.
-- Ficheiro SQL puro — não executar `src/config/*.ts` na consola SQL (isso dá erro em `import`).
-- Esperado por template (diagnosis_vertical = capilar, active = true):
--   • RISK_DIAGNOSIS × (leve, moderado, urgente) — sem calculadoras PROJECTION nesta lista.
--
-- Uso: psql "$DATABASE_URL" -f scripts/verify-capilar-packaged-diagnosis.sql
-- Resultado esperado: 0 linhas na query final (sem lacunas).

WITH capilar_risk AS (
  SELECT unnest(
    ARRAY[
      'b1000103-0103-4000-8000-000000000103'::uuid,
      'b1000104-0104-4000-8000-000000000104'::uuid,
      'b1000105-0105-4000-8000-000000000105'::uuid,
      'b1000106-0106-4000-8000-000000000106'::uuid,
      'b1000107-0107-4000-8000-000000000107'::uuid,
      'b1000152-0152-4000-8000-000000000152'::uuid,
      'b1000153-0153-4000-8000-000000000153'::uuid,
      'b1000154-0154-4000-8000-000000000154'::uuid,
      'b1000155-0155-4000-8000-000000000155'::uuid,
      'b1000156-0156-4000-8000-000000000156'::uuid,
      'b1000157-0157-4000-8000-000000000157'::uuid,
      'b1000158-0158-4000-8000-000000000158'::uuid,
      'b1000159-0159-4000-8000-000000000159'::uuid,
      'b1000160-0160-4000-8000-000000000160'::uuid,
      'b1000161-0161-4000-8000-000000000161'::uuid,
      'b1000162-0162-4000-8000-000000000162'::uuid,
      'b1000163-0163-4000-8000-000000000163'::uuid,
      'b1000164-0164-4000-8000-000000000164'::uuid,
      'b1000165-0165-4000-8000-000000000165'::uuid,
      'b1000166-0166-4000-8000-000000000166'::uuid,
      'b1000167-0167-4000-8000-000000000167'::uuid,
      'b1000168-0168-4000-8000-000000000168'::uuid,
      'b1000169-0169-4000-8000-000000000169'::uuid,
      'b1000170-0170-4000-8000-000000000170'::uuid,
      'b1000171-0171-4000-8000-000000000171'::uuid,
      'b1000172-0172-4000-8000-000000000172'::uuid,
      'b1000173-0173-4000-8000-000000000173'::uuid,
      'b1000174-0174-4000-8000-000000000174'::uuid,
      'b1000175-0175-4000-8000-000000000175'::uuid,
      'b1000176-0176-4000-8000-000000000176'::uuid,
      'b1000177-0177-4000-8000-000000000177'::uuid,
      'b1000178-0178-4000-8000-000000000178'::uuid,
      'b1000179-0179-4000-8000-000000000179'::uuid,
      'b1000180-0180-4000-8000-000000000180'::uuid,
      'b1000181-0181-4000-8000-000000000181'::uuid,
      'b1000182-0182-4000-8000-000000000182'::uuid,
      'b1000183-0183-4000-8000-000000000183'::uuid,
      'b1000184-0184-4000-8000-000000000184'::uuid,
      'b1000185-0185-4000-8000-000000000185'::uuid,
      'b1000186-0186-4000-8000-000000000186'::uuid,
      'b1000187-0187-4000-8000-000000000187'::uuid,
      'b1000188-0188-4000-8000-000000000188'::uuid,
      'b1000189-0189-4000-8000-000000000189'::uuid,
      'b1000190-0190-4000-8000-000000000190'::uuid,
      'b1000191-0191-4000-8000-000000000191'::uuid
    ]
  ) AS template_id
),
expected AS (
  SELECT
    r.template_id,
    'RISK_DIAGNOSIS'::text AS architecture,
    a.archetype_code
  FROM capilar_risk r
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
    AND o.diagnosis_vertical = 'capilar'
    AND o.active = true
)
ORDER BY e.architecture, e.template_id, e.archetype_code;
