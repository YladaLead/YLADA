-- Ajuste de copy PT-BR: intro criolipólise (título sem duração; micro em linguagem natural; subtítulo acolhedor).

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json
    - 'introTitle'
    - 'introSubtitle'
    - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Frio na zona certa: será que faz sentido para mim?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas para organizar o que levar à avaliação; na presencial você confere com a profissional o que é indicado para o seu caso.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000144-0144-4000-8000-000000000144';

UPDATE ylada_biblioteca_itens
SET
  description = 'Frio local, expectativa e combinação com massagem — organiza ideias antes da consulta.',
  updated_at = NOW()
WHERE template_id = 'b1000144-0144-4000-8000-000000000144';
