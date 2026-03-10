-- =====================================================
-- Archetypes de diagnóstico PERFUMARIA — 8 perfis de fragrância.
-- Usados quando architecture=PERFUME_PROFILE e segment_code=perfumaria.
-- @see docs/LINKS-INTELIGENTES-ARQUETIPOS-IA.md
-- =====================================================

INSERT INTO ylada_diagnosis_archetypes (archetype_code, segment_code, content_json)
VALUES
  (
    'elegancia_natural',
    'perfumaria',
    '{
      "profile_title": "Seu perfil: Elegância Natural",
      "profile_summary": "Você transmite leveza, cuidado e presença suave. Fragrâncias florais ou frescas tendem a combinar muito com sua energia.",
      "main_blocker": "Seu perfil: Elegância Natural",
      "causa_provavel": "Fragrâncias que combinam com seu perfil tendem a fixar melhor e transmitir sua energia.",
      "consequence": "Quando o perfume combina com seu perfil, a presença fica mais autêntica.",
      "growth_potential": "Vale conversar com quem entende pra indicar fragrâncias que combinem com você.",
      "specific_actions": [
        "Explorar famílias florais e frescas.",
        "Testar fragrâncias em pele antes de decidir.",
        "Converse com {NAME} pra receber sugestões personalizadas."
      ],
      "cta_text": "Quero ver sugestões de fragrâncias",
      "whatsapp_prefill": "Oi {NAME}, descobri meu perfil: Elegância Natural. Quero receber sugestões de perfumes que combinem comigo."
    }'::jsonb
  ),
  (
    'presença_magnetica',
    'perfumaria',
    '{
      "profile_title": "Seu perfil: Presença Magnética",
      "profile_summary": "Você tende a se destacar naturalmente. Perfumes com notas orientais ou amadeiradas combinam com essa presença.",
      "main_blocker": "Seu perfil: Presença Magnética",
      "causa_provavel": "Fragrâncias que combinam com seu perfil tendem a fixar melhor e transmitir sua energia.",
      "consequence": "Quando o perfume combina com seu perfil, a presença fica mais autêntica.",
      "growth_potential": "Vale conversar com quem entende pra indicar fragrâncias que combinem com você.",
      "specific_actions": [
        "Explorar famílias orientais e amadeiradas.",
        "Considerar fragrâncias com maior projeção.",
        "Converse com {NAME} pra receber sugestões personalizadas."
      ],
      "cta_text": "Quero ver sugestões de fragrâncias",
      "whatsapp_prefill": "Oi {NAME}, descobri meu perfil: Presença Magnética. Quero receber sugestões de perfumes que combinem comigo."
    }'::jsonb
  ),
  (
    'leveza_floral',
    'perfumaria',
    '{
      "profile_title": "Seu perfil: Leveza Floral",
      "profile_summary": "Você transmite delicadeza e romantismo. Florais suaves e frescos tendem a combinar muito com sua energia.",
      "main_blocker": "Seu perfil: Leveza Floral",
      "causa_provavel": "Fragrâncias que combinam com seu perfil tendem a fixar melhor e transmitir sua energia.",
      "consequence": "Quando o perfume combina com seu perfil, a presença fica mais autêntica.",
      "growth_potential": "Vale conversar com quem entende pra indicar fragrâncias que combinem com você.",
      "specific_actions": [
        "Explorar florais e florais frescos.",
        "Testar intensidades suaves.",
        "Converse com {NAME} pra receber sugestões personalizadas."
      ],
      "cta_text": "Quero ver sugestões de fragrâncias",
      "whatsapp_prefill": "Oi {NAME}, descobri meu perfil: Leveza Floral. Quero receber sugestões de perfumes que combinem comigo."
    }'::jsonb
  ),
  (
    'sofisticacao_classica',
    'perfumaria',
    '{
      "profile_title": "Seu perfil: Sofisticação Clássica",
      "profile_summary": "Você transmite elegância atemporal. Fragrâncias clássicas e sofisticadas combinam com seu estilo.",
      "main_blocker": "Seu perfil: Sofisticação Clássica",
      "causa_provavel": "Fragrâncias que combinam com seu perfil tendem a fixar melhor e transmitir sua energia.",
      "consequence": "Quando o perfume combina com seu perfil, a presença fica mais autêntica.",
      "growth_potential": "Vale conversar com quem entende pra indicar fragrâncias que combinem com você.",
      "specific_actions": [
        "Explorar fragrâncias clássicas e atemporais.",
        "Considerar amadeirados e chypres.",
        "Converse com {NAME} pra receber sugestões personalizadas."
      ],
      "cta_text": "Quero ver sugestões de fragrâncias",
      "whatsapp_prefill": "Oi {NAME}, descobri meu perfil: Sofisticação Clássica. Quero receber sugestões de perfumes que combinem comigo."
    }'::jsonb
  ),
  (
    'energia_vibrante',
    'perfumaria',
    '{
      "profile_title": "Seu perfil: Energia Vibrante",
      "profile_summary": "Você transmite vitalidade e dinamismo. Perfumes cítricos e frescos tendem a estimular essa energia.",
      "main_blocker": "Seu perfil: Energia Vibrante",
      "causa_provavel": "Fragrâncias que combinam com seu perfil tendem a fixar melhor e transmitir sua energia.",
      "consequence": "Quando o perfume combina com seu perfil, a presença fica mais autêntica.",
      "growth_potential": "Vale conversar com quem entende pra indicar fragrâncias que combinem com você.",
      "specific_actions": [
        "Explorar cítricos e frescos.",
        "Considerar fragrâncias com notas de energia.",
        "Converse com {NAME} pra receber sugestões personalizadas."
      ],
      "cta_text": "Quero ver sugestões de fragrâncias",
      "whatsapp_prefill": "Oi {NAME}, descobri meu perfil: Energia Vibrante. Quero receber sugestões de perfumes que combinem comigo."
    }'::jsonb
  ),
  (
    'seducao_sutil',
    'perfumaria',
    '{
      "profile_title": "Seu perfil: Sedução Sutil",
      "profile_summary": "Você transmite charme e sensibilidade. Fragrâncias orientais suaves ou florais sensuais combinam com você.",
      "main_blocker": "Seu perfil: Sedução Sutil",
      "causa_provavel": "Fragrâncias que combinam com seu perfil tendem a fixar melhor e transmitir sua energia.",
      "consequence": "Quando o perfume combina com seu perfil, a presença fica mais autêntica.",
      "growth_potential": "Vale conversar com quem entende pra indicar fragrâncias que combinem com você.",
      "specific_actions": [
        "Explorar orientais suaves e florais sensuais.",
        "Testar em diferentes ocasiões.",
        "Converse com {NAME} pra receber sugestões personalizadas."
      ],
      "cta_text": "Quero ver sugestões de fragrâncias",
      "whatsapp_prefill": "Oi {NAME}, descobri meu perfil: Sedução Sutil. Quero receber sugestões de perfumes que combinem comigo."
    }'::jsonb
  ),
  (
    'intensidade_noturna',
    'perfumaria',
    '{
      "profile_title": "Seu perfil: Intensidade Noturna",
      "profile_summary": "Perfumes mais intensos e envolventes combinam com seu estilo. Presença marcante para ocasiões especiais.",
      "main_blocker": "Seu perfil: Intensidade Noturna",
      "causa_provavel": "Fragrâncias que combinam com seu perfil tendem a fixar melhor e transmitir sua energia.",
      "consequence": "Quando o perfume combina com seu perfil, a presença fica mais autêntica.",
      "growth_potential": "Vale conversar com quem entende pra indicar fragrâncias que combinem com você.",
      "specific_actions": [
        "Explorar fragrâncias intensas e orientais.",
        "Considerar eau de parfum para maior duração.",
        "Converse com {NAME} pra receber sugestões personalizadas."
      ],
      "cta_text": "Quero ver sugestões de fragrâncias",
      "whatsapp_prefill": "Oi {NAME}, descobri meu perfil: Intensidade Noturna. Quero receber sugestões de perfumes que combinem comigo."
    }'::jsonb
  ),
  (
    'charme_discreto',
    'perfumaria',
    '{
      "profile_title": "Seu perfil: Charme Discreto",
      "profile_summary": "Você transmite leveza e elegância discreta. Fragrâncias suaves e íntimas combinam com sua presença.",
      "main_blocker": "Seu perfil: Charme Discreto",
      "causa_provavel": "Fragrâncias que combinam com seu perfil tendem a fixar melhor e transmitir sua energia.",
      "consequence": "Quando o perfume combina com seu perfil, a presença fica mais autêntica.",
      "growth_potential": "Vale conversar com quem entende pra indicar fragrâncias que combinem com você.",
      "specific_actions": [
        "Explorar fragrâncias leves e íntimas.",
        "Considerar florais suaves.",
        "Converse com {NAME} pra receber sugestões personalizadas."
      ],
      "cta_text": "Quero ver sugestões de fragrâncias",
      "whatsapp_prefill": "Oi {NAME}, descobri meu perfil: Charme Discreto. Quero receber sugestões de perfumes que combinem comigo."
    }'::jsonb
  )
ON CONFLICT (archetype_code, segment_code) DO UPDATE SET
  content_json = EXCLUDED.content_json;
