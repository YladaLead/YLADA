-- Atualiza o template "link_after_participou" (pós-participou) para um texto mais persuasivo.
-- Usado quando o admin marca "Participou".

INSERT INTO whatsapp_workshop_settings (area, flow_templates)
VALUES (
  'nutri',
  jsonb_build_object(
    'link_after_participou',
    'Olá {{nome}}! 💚

Parabéns por ter participado da aula — espero que tenha esclarecido os pontos que você precisava para realmente dar sua virada e começar a preencher sua agenda com mais segurança e estratégia.

Agora me conta: o que mais fez sentido pra você hoje?
Você está disposto(a) a mudar sua situação e começar agora?

Se sim, me diz: você prefere começar pelo plano *mensal* (pra validar com calma) ou já quer ir direto no *anual* (pra acelerar seus resultados)?

🔗 {{link}}

O que você acha? 😊'
  )
)
ON CONFLICT (area) DO UPDATE
SET flow_templates = jsonb_set(
  COALESCE(whatsapp_workshop_settings.flow_templates, '{}'::jsonb),
  '{link_after_participou}',
  to_jsonb(
    'Olá {{nome}}! 💚

Parabéns por ter participado da aula — espero que tenha esclarecido os pontos que você precisava para realmente dar sua virada e começar a preencher sua agenda com mais segurança e estratégia.

Agora me conta: o que mais fez sentido pra você hoje?
Você está disposto(a) a mudar sua situação e começar agora?

Se sim, me diz: você prefere começar pelo plano *mensal* (pra validar com calma) ou já quer ir direto no *anual* (pra acelerar seus resultados)?

🔗 {{link}}

O que você acha? 😊'::text
  ),
  true
);

-- Atualiza o template "link_after_participou" (pós-participou) para um texto mais persuasivo.
-- Isso afeta o envio automático quando o admin marca "Participou" e o sistema usa flow_templates.

INSERT INTO whatsapp_workshop_settings (area, flow_templates)
VALUES (
  'nutri',
  jsonb_build_object(
    'link_after_participou',
    'Olá {{nome}}! 💚

Parabéns por ter participado da aula — espero que tenha esclarecido os pontos que você precisava para realmente dar sua virada e começar a preencher sua agenda com mais segurança e estratégia.

Agora me conta: o que mais fez sentido pra você hoje?
Você está disposto(a) a mudar sua situação e começar agora?

Se sim, me diz: você prefere começar pelo plano *mensal* (pra validar com calma) ou já quer ir direto no *anual* (pra acelerar seus resultados)?

🔗 {{link}}

O que você acha? 😊'
  )
)
ON CONFLICT (area) DO UPDATE
SET flow_templates = jsonb_set(
  COALESCE(whatsapp_workshop_settings.flow_templates, '{}'::jsonb),
  '{link_after_participou}',
  to_jsonb(
    'Olá {{nome}}! 💚

Parabéns por ter participado da aula — espero que tenha esclarecido os pontos que você precisava para realmente dar sua virada e começar a preencher sua agenda com mais segurança e estratégia.

Agora me conta: o que mais fez sentido pra você hoje?
Você está disposto(a) a mudar sua situação e começar agora?

Se sim, me diz: você prefere começar pelo plano *mensal* (pra validar com calma) ou já quer ir direto no *anual* (pra acelerar seus resultados)?

🔗 {{link}}

O que você acha? 😊'::text
  ),
  true
);

