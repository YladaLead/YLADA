-- Atualiza o template "remarketing_nao_participou" (não participou) para um texto mais acolhedor e persuasivo.
-- Importante: não deve incluir datas/horários específicos nem link; a intenção é confirmar interesse.

INSERT INTO whatsapp_workshop_settings (area, flow_templates)
VALUES (
  'nutri',
  jsonb_build_object(
    'remarketing_nao_participou',
    'Olá {{nome}}! 💚

Vi que você não conseguiu entrar na aula. Fica tranquilo(a), isso acontece.

Eu sei como é frustrante ver a agenda oscilando e sentir que você está fazendo tudo “certo”, mas mesmo assim não consegue preencher com constância. A aula foi justamente pra te mostrar um caminho mais claro e prático pra organizar isso.

Você ainda tem interesse em participar?
Se sim, eu te encaixo no próximo horário. Qual período fica melhor pra você: manhã, tarde ou noite?'
  )
)
ON CONFLICT (area) DO UPDATE
SET flow_templates = jsonb_set(
  COALESCE(whatsapp_workshop_settings.flow_templates, '{}'::jsonb),
  '{remarketing_nao_participou}',
  to_jsonb(
    'Olá {{nome}}! 💚

Vi que você não conseguiu entrar na aula. Fica tranquilo(a), isso acontece.

Eu sei como é frustrante ver a agenda oscilando e sentir que você está fazendo tudo “certo”, mas mesmo assim não consegue preencher com constância. A aula foi justamente pra te mostrar um caminho mais claro e prático pra organizar isso.

Você ainda tem interesse em participar?
Se sim, eu te encaixo no próximo horário. Qual período fica melhor pra você: manhã, tarde ou noite?'::text
  ),
  true
);

-- Atualiza o template "remarketing_nao_participou" (não participou) para um texto mais acolhedor e persuasivo.
-- Importante: não deve incluir datas/horários específicos nem link; a intenção é confirmar interesse.

INSERT INTO whatsapp_workshop_settings (area, flow_templates)
VALUES (
  'nutri',
  jsonb_build_object(
    'remarketing_nao_participou',
    'Olá {{nome}}! 💚

Vi que você não conseguiu entrar na aula — fica tranquilo(a), isso acontece.

Eu sei como é frustrante ver a agenda oscilando e sentir que você está fazendo tudo “certo”, mas mesmo assim não consegue preencher com constância. A aula foi justamente pra te mostrar um caminho mais claro e prático pra organizar isso.

Você ainda tem interesse em participar?
Se sim, eu te encaixo no próximo horário. Qual período fica melhor pra você: manhã, tarde ou noite?'
  )
)
ON CONFLICT (area) DO UPDATE
SET flow_templates = jsonb_set(
  COALESCE(whatsapp_workshop_settings.flow_templates, '{}'::jsonb),
  '{remarketing_nao_participou}',
  to_jsonb(
    'Olá {{nome}}! 💚

Vi que você não conseguiu entrar na aula — fica tranquilo(a), isso acontece.

Eu sei como é frustrante ver a agenda oscilando e sentir que você está fazendo tudo “certo”, mas mesmo assim não consegue preencher com constância. A aula foi justamente pra te mostrar um caminho mais claro e prático pra organizar isso.

Você ainda tem interesse em participar?
Se sim, eu te encaixo no próximo horário. Qual período fica melhor pra você: manhã, tarde ou noite?'::text
  ),
  true
);

