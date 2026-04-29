-- Intros dos 5 quizzes Pro Estética Capilar (b1000103–107): gancho no introTitle,
-- valor + avaliação presencial no introSubtitle, duração só no introMicro ("Cerca de 2 min · 5 perguntas").
-- Idempotente; alinha com o padrão da migration 351 (corporal).
-- @see src/config/pro-estetica-capilar-biblioteca.ts (TEMPLATE_IDS_BIBLIOTECA_ESTETICA_CAPILAR_PERMITIDOS)

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Queda ou fase atípica dos fios: vale organizar antes da consulta?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas para mapear hábitos e percepção em casa; na avaliação presencial a profissional orienta o que faz sentido no seu caso, sem promessa de cura.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000103-0103-4000-8000-000000000103';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Tipo de fio e porosidade: será que seus produtos estão alinhados com o que o cabelo pede?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas para alinhar textura e rotina; no atendimento vocês fecham o plano de cuidado com expectativa realista.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000104-0104-4000-8000-000000000104';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Coceira, caspa ou oleosidade: o couro cabeludo pede uma conversa antes de qualquer promessa?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas para clarear o que você sente no dia a dia; na presencial a profissional indica próximos passos seguros e adequados ao seu contexto.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000105-0105-4000-8000-000000000105';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Ressecamento ou porosidade: será que sua hidratação em casa está no caminho certo?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas sobre rotina e sensação dos fios; na consulta vocês ajustam cronograma e produtos com critério técnico.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000106-0106-4000-8000-000000000106';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Coloração e saúde dos fios: como alinhar expectativa antes de fechar continuidade?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas sobre frequência de tintura e danos percebidos; na presencial a profissional propõe continuidade segura e manutenção entre sessões.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000107-0107-4000-8000-000000000107';

-- Texto de apoio na vitrine da biblioteca (cards), alinhado ao gancho + tom consultivo.
UPDATE ylada_biblioteca_itens
SET
  description = 'Cinco perguntas rápidas para organizar o que levar na avaliação; na presencial você recebe orientação sem promessa de cura.'
WHERE template_id = 'b1000103-0103-4000-8000-000000000103';

UPDATE ylada_biblioteca_itens
SET
  description = 'Cinco perguntas para alinhar textura e rotina; no atendimento vocês fecham o plano de cuidado com expectativa realista.'
WHERE template_id = 'b1000104-0104-4000-8000-000000000104';

UPDATE ylada_biblioteca_itens
SET
  description = 'Cinco perguntas para clarear o que você sente no couro cabeludo; na avaliação presencial a profissional indica próximos passos seguros.'
WHERE template_id = 'b1000105-0105-4000-8000-000000000105';

UPDATE ylada_biblioteca_itens
SET
  description = 'Cinco perguntas sobre hidratação em casa; na consulta vocês ajustam cronograma e produtos com critério técnico.'
WHERE template_id = 'b1000106-0106-4000-8000-000000000106';

UPDATE ylada_biblioteca_itens
SET
  description = 'Cinco perguntas sobre coloração e danos percebidos; na presencial a profissional propõe continuidade segura.'
WHERE template_id = 'b1000107-0107-4000-8000-000000000107';
