-- Atualiza o template "link_after_participou" (pós-participou) para um texto mais direto (venda).
-- Usado quando o admin marca "Participou".

INSERT INTO whatsapp_workshop_settings (area, flow_templates)
VALUES (
  'nutri',
  jsonb_build_object(
    'link_after_participou',
    'Parabéns por ter participado da aula, {{nome}}! 💚

Eu tenho certeza que você tem potencial, só faltava a estrutura certa pra você executar de verdade e mudar sua história de uma vez por todas.

Você já pode começar hoje no plano *mensal* ou no *anual* e ajustar sua agenda imediatamente pra iniciar a captação de clientes.

🔗 {{link}}

Qual você prefere, *mensal* ou *anual*?'
  )
)
ON CONFLICT (area) DO UPDATE
SET flow_templates = jsonb_set(
  COALESCE(whatsapp_workshop_settings.flow_templates, '{}'::jsonb),
  '{link_after_participou}',
  to_jsonb(
    'Parabéns por ter participado da aula, {{nome}}! 💚

Eu tenho certeza que você tem potencial, só faltava a estrutura certa pra você executar de verdade e mudar sua história de uma vez por todas.

Você já pode começar hoje no plano *mensal* ou no *anual* e ajustar sua agenda imediatamente pra iniciar a captação de clientes.

🔗 {{link}}

Qual você prefere, *mensal* ou *anual*?'::text
  ),
  true
);

