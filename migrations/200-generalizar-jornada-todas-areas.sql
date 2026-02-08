-- =====================================================
-- Trilha Empresarial: generalizar textos para todas as áreas
-- Objetivo: Uma única jornada (journey_days) para Nutri, Med, Psi, Odonto, Nutra, Coach.
-- Substitui termos "Nutri-Empresária" e "prática nutricional" por linguagem neutra.
-- =====================================================

-- 1) Aplicar substituições em todas as linhas onde houver os termos
UPDATE journey_days SET title = replace(title, 'Nutri-Empresária', 'profissional') WHERE title LIKE '%Nutri-Empresária%';
UPDATE journey_days SET objective = replace(objective, 'Nutri-Empresária', 'profissional') WHERE objective LIKE '%Nutri-Empresária%';
UPDATE journey_days SET objective = replace(objective, 'prática nutricional', 'sua prática') WHERE objective LIKE '%prática nutricional%';
UPDATE journey_days SET guidance = replace(guidance, 'Nutri-Empresária', 'profissional') WHERE guidance LIKE '%Nutri-Empresária%';
UPDATE journey_days SET guidance = replace(guidance, 'prática nutricional', 'sua prática') WHERE guidance LIKE '%prática nutricional%';
UPDATE journey_days SET guidance = replace(guidance, 'nutricionistas', 'profissionais') WHERE guidance LIKE '%nutricionistas%';
UPDATE journey_days SET action_title = replace(action_title, 'Nutri-Empresária', 'profissional') WHERE action_title LIKE '%Nutri-Empresária%';
UPDATE journey_days SET motivational_phrase = replace(motivational_phrase, 'Nutri-Empresária', 'profissional') WHERE motivational_phrase LIKE '%Nutri-Empresária%';
UPDATE journey_days SET motivational_phrase = replace(motivational_phrase, 'Nutri que ', 'Profissional que ') WHERE motivational_phrase LIKE '%Nutri que %';

-- 3) Checklist (JSONB): substituir "Nutri-Empresária" por "profissional" dentro dos itens
UPDATE journey_days
SET checklist_items = (
  SELECT jsonb_agg(replace(elem, 'Nutri-Empresária', 'profissional'))
  FROM jsonb_array_elements_text(checklist_items) AS elem
)
WHERE checklist_items::text LIKE '%Nutri-Empresária%';

-- 4) Dia 1: texto específico da introdução
UPDATE journey_days SET
  objective = replace(objective, 'prática nutricional', 'sua prática'),
  guidance = replace(replace(guidance, 'Nutri-Empresária', 'profissional'), 'prática nutricional', 'sua prática')
WHERE day_number = 1;

-- 5) Dia 18 e similares com "Rotina de Nutri-Empresária"
UPDATE journey_days SET title = replace(title, 'Nutri-Empresária', 'profissional'), action_title = replace(action_title, 'Nutri-Empresária', 'profissional') WHERE title LIKE '%Nutri-Empresária%' OR action_title LIKE '%Nutri-Empresária%';

-- 6) Referências à "Nutri" no contexto de crescimento (ex.: "crescimento da Nutri")
UPDATE journey_days SET guidance = replace(guidance, 'da Nutri.', 'do profissional.') WHERE guidance LIKE '%da Nutri.%';
