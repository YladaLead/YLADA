-- Pro Estética Corporal — alinhar camadas após 425 (copy dos pacotes).
-- 1) `ylada_biblioteca_itens.meta.diagnosis_vertical = corporal` para fallback em APIs (ex.: generate).
-- 2) Links ativos ainda sem vertical (idempotente com 423).
-- 3) Remove memorização por link (`ylada_link_diagnosis_content`) destes templates — passa a valer
--    pacote + template; personalizações geradas por IA nesta tabela são perdidas (ver comentário na 254).
-- 4) Suaviza frases “venda” / jargão em `ylada_link_templates.schema_json` (lista fechada corporal).
-- 5) Invalida `ylada_diagnosis_cache` dos links afetados.
--
-- Lista de `template_id` alinhada a `TEMPLATE_IDS_BIBLIOTECA_ESTETICA_CORPORAL_PERMITIDOS`
-- em src/config/pro-estetica-corporal-biblioteca.ts.

-- ---------------------------------------------------------------------------
-- 0) Constante: templates do painel corporal
-- ---------------------------------------------------------------------------
-- (repetido nos blocos para clareza em ferramentas que não suportam DO neste ficheiro)

-- ---------------------------------------------------------------------------
-- 1) Biblioteca: meta.diagnosis_vertical
-- ---------------------------------------------------------------------------
UPDATE ylada_biblioteca_itens b
SET
  meta = COALESCE(b.meta, '{}'::jsonb) || jsonb_build_object('diagnosis_vertical', 'corporal'),
  updated_at = NOW()
WHERE b.template_id = ANY (
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
)
  AND COALESCE(b.meta ->> 'diagnosis_vertical', '') IS DISTINCT FROM 'corporal';

-- ---------------------------------------------------------------------------
-- 2) Links ativos: diagnosis_vertical em falta (não sobrescreve capilar / outro)
-- ---------------------------------------------------------------------------
UPDATE ylada_links y
SET
  config_json = jsonb_set(
    COALESCE(y.config_json, '{}'::jsonb),
    '{meta}',
    COALESCE(y.config_json -> 'meta', '{}'::jsonb)
      || jsonb_build_object('diagnosis_vertical', 'corporal'),
    true
  ),
  updated_at = NOW()
WHERE y.status = 'active'
  AND (y.config_json -> 'meta' ->> 'pro_lideres_preset') IS DISTINCT FROM 'true'
  AND NULLIF(trim(y.config_json -> 'meta' ->> 'diagnosis_vertical'), '') IS NULL
  AND y.template_id = ANY (
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
  );

-- ---------------------------------------------------------------------------
-- 3) Memorização IA por link (prioridade máxima na API) — limpar para estes fluxos
-- ---------------------------------------------------------------------------
DELETE FROM ylada_link_diagnosis_content ldc
USING ylada_links y
WHERE ldc.link_id = y.id
  AND y.template_id = ANY (
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
  );

-- ---------------------------------------------------------------------------
-- 4) Templates: linguagem mais leiga no JSON (ordem: frases longas primeiro)
-- ---------------------------------------------------------------------------
UPDATE ylada_link_templates t
SET
  schema_json = (
    replace(
        replace(
          replace(
            replace(
              replace(
                replace(
                  replace(
                    replace(
                      replace(
                        replace(
                          replace(
                            replace(
                              replace(
                                replace(
                                  replace(
                                    replace(
                                      replace(
                                        replace(
                                          t.schema_json::text,
                                          'não fechar pacote longo',
                                          'não comprometer com pacote longo'
                                        ),
                                        'Evite fechar pacote fechado online',
                                        'Evite comprometer com um pacote longo só online'
                                      ),
                                      'antes de fechar pacote grande',
                                      'antes de investir num plano longo'
                                    ),
                                    'Cinco perguntas para alinhar expectativa antes de fechar pacote',
                                    'Cinco perguntas para alinhar expectativa antes de decidir próximos passos'
                                  ),
                                  'Orientação antes de fechar pacote',
                                  'Orientação antes de decidir com calma'
                                ),
                                'antes de fechar pacote',
                                'antes de decidir próximos passos'
                              ),
                              'fechar pacote ou procedimento',
                              'escolher tratamento ou procedimento'
                            ),
                            'antes de fechar protocolo',
                            'antes de definir o protocolo'
                          ),
                          'fechar pacote',
                          'decidir próximos passos'
                        ),
                        'Drenagem e protocolo corporal entram melhor',
                        'Drenagem e cuidados na clínica costumam funcionar melhor'
                      ),
                      'retome o protocolo corporal com a profissional',
                      'retome o plano de cuidados com a profissional'
                    ),
                    'movimento leve ao protocolo',
                    'movimento leve ao que combinarem na clínica'
                  ),
                  'Seu protocolo corporal precisa de quantas',
                  'Sua rotina de cuidados no corpo precisa de quantas'
                ),
                'Seu protocolo corporal está certo',
                'Sua combinação de cuidados está certa'
              ),
              'Descubra o protocolo corporal',
              'Descubra o tipo de cuidado no corpo'
            ),
            'O que mais segura você de começar um protocolo corporal',
            'O que mais segura você de começar cuidados regulares no corpo'
          ),
          'O que está entre você e o protocolo corporal que você quer',
          'O que está entre você e os cuidados no corpo que você quer'
        ),
        'Organizar protocolo',
        'Organizar em fases'
      )
  )::jsonb,
  updated_at = NOW()
WHERE t.id = ANY (
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
);

-- ---------------------------------------------------------------------------
-- 5) Cache visitante
-- ---------------------------------------------------------------------------
DELETE FROM ylada_diagnosis_cache c
USING ylada_links y
WHERE c.link_id = y.id
  AND y.status = 'active'
  AND (y.config_json -> 'meta' ->> 'pro_lideres_preset') IS DISTINCT FROM 'true'
  AND y.template_id = ANY (
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
  );
