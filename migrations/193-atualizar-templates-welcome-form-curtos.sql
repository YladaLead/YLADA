-- Encurta os templates do fluxo inicial (formulário / primeira abordagem).
-- Afeta:
-- - welcome_form_greeting: saudação (antes do lead chamar no WhatsApp)
-- - welcome_form_body: texto + opções (sem parágrafos longos)

INSERT INTO whatsapp_workshop_settings (area, flow_templates)
VALUES (
  'nutri',
  jsonb_build_object(
    'welcome_form_greeting',
    'Oi {{nome}}! 😊

Seja muito bem-vinda!

Eu sou a Carol, da equipe Ylada Nutri.',
    'welcome_form_body',
    'A próxima aula é prática e vai te ajudar a ter mais constância pra preencher sua agenda.

As próximas aulas acontecerão nos seguintes dias e horários:

[OPÇÕES inseridas automaticamente]

Responde 1 ou 2 😊'
  )
)
ON CONFLICT (area) DO UPDATE
SET flow_templates =
  jsonb_set(
    jsonb_set(
      COALESCE(whatsapp_workshop_settings.flow_templates, '{}'::jsonb),
      '{welcome_form_greeting}',
      to_jsonb(
        'Oi {{nome}}! 😊

Seja muito bem-vinda!

Eu sou a Carol, da equipe Ylada Nutri.'::text
      ),
      true
    ),
    '{welcome_form_body}',
    to_jsonb(
      'A próxima aula é prática e vai te ajudar a ter mais constância pra preencher sua agenda.

As próximas aulas acontecerão nos seguintes dias e horários:

[OPÇÕES inseridas automaticamente]

Responde 1 ou 2 😊'::text
    ),
    true
  );

