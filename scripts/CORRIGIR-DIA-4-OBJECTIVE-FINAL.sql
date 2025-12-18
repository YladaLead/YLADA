-- =====================================================
-- CORRIGIR OBJECTIVE DO DIA 4 - VERSÃO FINAL
-- =====================================================

-- Primeiro, ver o texto EXATO que está no banco
SELECT 
  day_number,
  title,
  objective as texto_atual,
  LENGTH(objective) as tamanho,
  POSITION('tração' IN LOWER(objective)) as posicao_tracao
FROM journey_days
WHERE day_number = 4;

-- Mostrar contexto ao redor de "tração" se existir
SELECT 
  day_number,
  title,
  SUBSTRING(objective FROM GREATEST(1, POSITION('tração' IN LOWER(objective)) - 20) 
           FOR 60) as contexto_tracao
FROM journey_days
WHERE day_number = 4
  AND objective ILIKE '%tração%'
  AND objective NOT ILIKE '%atração%';

-- Corrigir TODAS as possíveis variações de "tração" no objective
UPDATE journey_days
SET
  objective = TRIM(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(objective, '\s+tração\s+e\s+', ' e ', 'gi'),
              '\s+tração\s*,', ',', 'gi'
            ),
            '\s+tração\s+', ' ', 'gi'
          ),
          '^tração\s+', '', 'gi'
        ),
        '\s+tração$', '', 'gi'
      ),
      'tração', '', 'gi'
    )
  ),
  updated_at = NOW()
WHERE 
  day_number = 4
  AND objective ILIKE '%tração%'
  AND objective NOT ILIKE '%atração%';

-- Verificar se foi corrigido
SELECT 
  day_number,
  title,
  objective as texto_corrigido,
  CASE 
    WHEN objective ILIKE '%tração%' AND objective NOT ILIKE '%atração%' THEN '⚠️ Ainda tem "tração"'
    ELSE '✅ Corrigido'
  END as status
FROM journey_days
WHERE day_number = 4;

