-- Humaniza templates do WhatsApp (Nutri) pós-aula
-- Objetivo: reduzir tom mecânico e responder melhor objeções comuns (sem "frases prontas").
-- Afeta templates editáveis em whatsapp_workshop_settings.flow_templates.

INSERT INTO whatsapp_workshop_settings (area, flow_templates)
VALUES (
  'nutri',
  jsonb_build_object(
    'link_after_participou',
    'Oi {{nome}}! 💚

Que bom que você participou da aula.
Pra eu te orientar certinho: qual foi o ponto que mais fez sentido pra você hoje?

🔗 {{link}}

Você prefere começar no *mensal* ou no *anual*?',
    'remarketing_nao_participou',
    'Oi {{nome}}! 💚

Vi que você não conseguiu entrar na aula — acontece.
Quer que eu te encaixe na próxima turma? Qual período costuma ser melhor pra você: manhã, tarde ou noite?'
  )
)
ON CONFLICT (area) DO UPDATE
SET flow_templates =
  jsonb_set(
    jsonb_set(
      COALESCE(whatsapp_workshop_settings.flow_templates, '{}'::jsonb),
      '{link_after_participou}',
      to_jsonb(
        'Oi {{nome}}! 💚

Que bom que você participou da aula.
Pra eu te orientar certinho: qual foi o ponto que mais fez sentido pra você hoje?

🔗 {{link}}

Você prefere começar no *mensal* ou no *anual*?'::text
      ),
      true
    ),
    '{remarketing_nao_participou}',
    to_jsonb(
      'Oi {{nome}}! 💚

Vi que você não conseguiu entrar na aula — acontece.
Quer que eu te encaixe na próxima turma? Qual período costuma ser melhor pra você: manhã, tarde ou noite?'::text
    ),
    true
  );

