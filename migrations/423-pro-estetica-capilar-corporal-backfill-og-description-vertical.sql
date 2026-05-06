-- Pro Estética capilar / corporal: preencher `config_json.page.og_description` (preview WhatsApp)
-- e `meta.diagnosis_vertical` quando ainda em falta, para links ativos cujo `template_id`
-- pertence às bibliotecas fechadas dos painéis Pro (listas alinhadas ao código TS).
-- Não altera links `pro_lideres_preset`.
--
-- Ordem recomendada em produção:
--   1) Executar esta migração (423).
--   2) Fazer deploy da app com: OG/descrição em `/l/[slug]`, `POST /api/ylada/links/generate` (og_description)
--      e `TEMPLATE_VERSION` 28 em `/api/ylada/links/[slug]/diagnosis` só para vertical capilar|corporal.
--   3) Executar migrations/424-pro-estetica-diagnosis-cache-template-version-28.sql (limpa cache legado
--      v27 desses links após o código já estar em produção). A 424 é idempotente; podes repetir após deploy.
--
-- 1) Invalida cache de diagnóstico para links abrangidos (antes do backfill do config).

DELETE FROM ylada_diagnosis_cache c
USING ylada_links y
WHERE c.link_id = y.id
  AND y.status = 'active'
  AND (y.config_json -> 'meta' ->> 'pro_lideres_preset') IS DISTINCT FROM 'true'
  AND (
    NULLIF(trim(y.config_json -> 'meta' ->> 'diagnosis_vertical'), '') IN ('capilar', 'corporal')
    OR y.template_id = ANY (
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
        'b1000191-0191-4000-8000-000000000191'::uuid,
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
        'b1000151-0151-4000-8000-000000000151'::uuid
      ]
    )
  );

-- 2) Backfill `config_json`
WITH capilar_template AS (
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
corporal_template AS (
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
      'b1000151-0151-4000-8000-000000000151'::uuid
    ]
  ) AS template_id
),
bib_one AS (
  SELECT DISTINCT ON (template_id)
    template_id,
    description,
    dor_principal,
    objetivo_principal
  FROM ylada_biblioteca_itens
  WHERE active = true
    AND template_id IS NOT NULL
  ORDER BY template_id, sort_order NULLS LAST, titulo
),
patch AS (
  SELECT
    y.id,
    COALESCE(
      NULLIF(trim(y.config_json -> 'meta' ->> 'diagnosis_vertical'), ''),
      CASE
        WHEN y.template_id IN (SELECT template_id FROM capilar_template) THEN 'capilar'
        WHEN y.template_id IN (SELECT template_id FROM corporal_template) THEN 'corporal'
      END
    ) AS v_final,
    trim(regexp_replace(COALESCE(b.description, ''), '\s+', ' ', 'g')) AS d_norm,
    trim(COALESCE(b.dor_principal, '')) AS dor_norm,
    trim(COALESCE(b.objetivo_principal, '')) AS obj_norm,
    COALESCE(NULLIF(trim(y.title), ''), NULLIF(trim(y.config_json ->> 'title'), ''), 'Link') AS title_use,
    (NULLIF(trim(y.config_json -> 'meta' ->> 'diagnosis_vertical'), '') IS NULL
      AND y.template_id IS NOT NULL
      AND (
        y.template_id IN (SELECT template_id FROM capilar_template)
        OR y.template_id IN (SELECT template_id FROM corporal_template)
      )) AS need_vertical,
    (NULLIF(trim(y.config_json -> 'page' ->> 'og_description'), '') IS NULL) AS need_og
  FROM ylada_links y
  LEFT JOIN bib_one b ON b.template_id = y.template_id
  WHERE y.status = 'active'
    AND (y.config_json -> 'meta' ->> 'pro_lideres_preset') IS DISTINCT FROM 'true'
    AND (
      NULLIF(trim(y.config_json -> 'meta' ->> 'diagnosis_vertical'), '') IN ('capilar', 'corporal')
      OR y.template_id IN (SELECT template_id FROM capilar_template)
      OR y.template_id IN (SELECT template_id FROM corporal_template)
    )
),
patch2 AS (
  SELECT
    p.*,
    CASE
      WHEN length(p.d_norm) >= 40 AND length(p.d_norm) <= 220 THEN p.d_norm
      WHEN length(p.d_norm) > 220 THEN left(p.d_norm, 197) || E'…'
      WHEN length(p.dor_norm) >= 12 AND p.v_final = 'capilar' THEN
        'Couro cabeludo, fios e rotina: em poucos minutos você organiza o relato com clareza. Foco aqui: '
        || left(p.dor_norm, 90)
        || CASE WHEN length(p.dor_norm) > 90 THEN E'…' ELSE '' END
      WHEN length(p.dor_norm) >= 12 AND p.v_final = 'corporal' THEN
        'Corpo, hábitos e expectativa: em poucos minutos você vê um primeiro recorte do seu contexto. Foco aqui: '
        || left(p.dor_norm, 90)
        || CASE WHEN length(p.dor_norm) > 90 THEN E'…' ELSE '' END
      WHEN length(p.obj_norm) >= 12 THEN
        'Quer '
        || left(p.obj_norm, 70)
        || CASE WHEN length(p.obj_norm) > 70 THEN E'…' ELSE '' END
        || '? Responda em poucos minutos e receba um primeiro direcionamento só seu.'
      WHEN p.v_final = 'capilar' THEN
        'Responda em poucos minutos e veja um primeiro recorte sobre «'
        || left(p.title_use, 53)
        || CASE WHEN length(p.title_use) > 53 THEN E'…' ELSE '' END
        || '» — couro cabeludo, fios e rotina, sem complicar.'
      ELSE
        'Responda em poucos minutos e veja um primeiro recorte sobre «'
        || left(p.title_use, 53)
        || CASE WHEN length(p.title_use) > 53 THEN E'…' ELSE '' END
        || '» — corpo, hábitos e próximo passo com calma.'
    END AS og_text
  FROM patch p
  WHERE p.v_final IS NOT NULL
    AND (p.need_vertical OR p.need_og)
)
UPDATE ylada_links y
SET config_json = jsonb_set(
  jsonb_set(
    COALESCE(y.config_json, '{}'::jsonb),
    '{meta}',
    COALESCE(y.config_json -> 'meta', '{}'::jsonb)
      || CASE
           WHEN p.need_vertical THEN jsonb_build_object('diagnosis_vertical', p.v_final)
           ELSE '{}'::jsonb
         END,
    true
  ),
  '{page}',
  COALESCE(y.config_json -> 'page', '{}'::jsonb)
    || CASE
         WHEN p.need_og THEN jsonb_build_object('og_description', p.og_text)
         ELSE '{}'::jsonb
       END,
  true
)
FROM patch2 p
WHERE y.id = p.id
  AND (p.need_vertical OR p.need_og);
