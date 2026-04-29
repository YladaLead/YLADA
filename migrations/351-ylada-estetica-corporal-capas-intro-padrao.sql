-- Capas dos 10 quizzes Pro Estética corporal (b1000142–151): gancho no introTitle,
-- valor + fecho na presencial no introSubtitle, duração só no introMicro ("Cerca de 2 min · 5 perguntas").
-- Idempotente; alinha instâncias já criadas com a revisão da migration 348.

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Pernas pesadas ou inchadas: será que a drenagem combina comigo?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas para organizar o que contar na avaliação; na presencial a profissional indica se faz sentido no seu caso e em que ritmo.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000142-0142-4000-8000-000000000142';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Contorno e massagem firme: faz sentido na sua rotina?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas para alinhar expectativa antes de fechar pacote; na consulta vocês definem pressão, frequência e combinações seguras.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000143-0143-4000-8000-000000000143';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
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

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Calor na pele com objetivo: será que a radiofrequência corporal cabe em mim?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas para mapear foco e sensibilidade antes da avaliação; na presencial a profissional fecha protocolo e sessões.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000145-0145-4000-8000-000000000145';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Ultrassom corporal: será que é o próximo passo para a sua zona?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas para separar curiosidade de prioridade; na consulta vocês veem se encaixa com seu objetivo e pele.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000146-0146-4000-8000-000000000146';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Cavitação e contorno: vale a pena levar isso na consulta?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas sobre zona, pele e expectativa; na presencial a profissional indica se lipocavitação entra no seu plano.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000147-0147-4000-8000-000000000147';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Celulite e sucção: será que a endermologia é o caminho para mim?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas para levar sensações e rotina à avaliação; na consulta vocês alinham frequência e combinações.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000148-0148-4000-8000-000000000148';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Textura ou firmeza: o que te incomoda mais ao espelho?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas para priorizar o assunto na consulta — sem promessa de resultado; na presencial define-se ordem de protocolo.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000149-0149-4000-8000-000000000149';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Gordura localizada: por onde começar sem promessa milagrosa?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas sobre zona, hábitos e expectativa; na avaliação fechas tecnologia, massagem e ritmo com a profissional.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000150-0150-4000-8000-000000000150';

UPDATE ylada_link_templates
SET
  schema_json =
    schema_json - 'introTitle' - 'introSubtitle' - 'introMicro'
    || jsonb_build_object(
      'introTitle',
      to_jsonb('Detox corporal: o que isso pode significar para o seu corpo?'::text),
      'introSubtitle',
      to_jsonb(
        'Cinco perguntas sobre hábitos e sensação antes da consulta; na presencial vocês separam o que é rotina, o que é protocolo e o que é promessa realista.'::text
      ),
      'introMicro',
      to_jsonb('Cerca de 2 min · 5 perguntas'::text)
    ),
  updated_at = NOW()
WHERE id = 'b1000151-0151-4000-8000-000000000151';

UPDATE ylada_biblioteca_itens
SET description = 'Inchaço, rotina e expectativa — organiza ideias antes da consulta.', updated_at = NOW()
WHERE template_id = 'b1000142-0142-4000-8000-000000000142';

UPDATE ylada_biblioteca_itens
SET description = 'Contorno, pressão e frequência — perfil para conversar com a esteticista.', updated_at = NOW()
WHERE template_id = 'b1000143-0143-4000-8000-000000000143';

UPDATE ylada_biblioteca_itens
SET description = 'Frio local, expectativa e combinação com massagem — organiza ideias antes da consulta.', updated_at = NOW()
WHERE template_id = 'b1000144-0144-4000-8000-000000000144';

UPDATE ylada_biblioteca_itens
SET description = 'Calor, pele e ritmo — roteiro objetivo para a avaliação.', updated_at = NOW()
WHERE template_id = 'b1000145-0145-4000-8000-000000000145';

UPDATE ylada_biblioteca_itens
SET description = 'Zona e objetivo — o que levar antes de fechar protocolo.', updated_at = NOW()
WHERE template_id = 'b1000146-0146-4000-8000-000000000146';

UPDATE ylada_biblioteca_itens
SET description = 'Localizado e expectativa — clareza antes da consulta.', updated_at = NOW()
WHERE template_id = 'b1000147-0147-4000-8000-000000000147';

UPDATE ylada_biblioteca_itens
SET description = 'Celulite, sucção e hábitos — o que mencionar na avaliação.', updated_at = NOW()
WHERE template_id = 'b1000148-0148-4000-8000-000000000148';

UPDATE ylada_biblioteca_itens
SET description = 'Textura vs firmeza — prioridade para a consulta.', updated_at = NOW()
WHERE template_id = 'b1000149-0149-4000-8000-000000000149';

UPDATE ylada_biblioteca_itens
SET
  description = 'Zona, hábitos e tecnologia — organiza ideias antes de fechar pacote ou procedimento.',
  updated_at = NOW()
WHERE template_id = 'b1000150-0150-4000-8000-000000000150';

UPDATE ylada_biblioteca_itens
SET
  description = 'Rotina e sensação — abre conversa sobre drenagem e bem-estar sem milagre.',
  updated_at = NOW()
WHERE template_id = 'b1000151-0151-4000-8000-000000000151';
