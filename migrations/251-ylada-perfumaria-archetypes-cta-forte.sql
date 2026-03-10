-- =====================================================
-- Archetypes PERFUMARIA — reforço CTA e diagnóstico.
-- Objetivo: diagnóstico verdadeiro + transparente → pessoa clica no botão e chama quem enviou.
-- Mínimo 4-5 perguntas nos quizzes (já implementado).
-- =====================================================

UPDATE ylada_diagnosis_archetypes
SET content_json = content_json
  || '{"profile_summary": "Você transmite leveza, cuidado e presença suave. Pelas suas respostas, fragrâncias florais ou frescas tendem a combinar muito com sua energia. Esse é um perfil que merece indicações personalizadas."}'::jsonb
  || '{"growth_potential": "Quem te enviou esse quiz pode te mostrar fragrâncias perfeitas pro seu perfil. Vale clicar no botão pra receber as sugestões."}'::jsonb
  || '{"frase_identificacao": "Se você se identificou com esse resultado, provavelmente quer descobrir quais perfumes combinam com você. O próximo passo é clicar no botão e receber as indicações."}'::jsonb
WHERE archetype_code = 'elegancia_natural' AND segment_code = 'perfumaria';

UPDATE ylada_diagnosis_archetypes
SET content_json = content_json
  || '{"profile_summary": "Você tende a se destacar naturalmente. Pelas suas respostas, perfumes com notas orientais ou amadeiradas combinam com essa presença. Esse perfil merece indicações que reflitam sua energia."}'::jsonb
  || '{"growth_potential": "Quem te enviou esse quiz pode te mostrar fragrâncias perfeitas pro seu perfil. Vale clicar no botão pra receber as sugestões."}'::jsonb
  || '{"frase_identificacao": "Se você se identificou com esse resultado, provavelmente quer descobrir quais perfumes combinam com você. O próximo passo é clicar no botão e receber as indicações."}'::jsonb
WHERE archetype_code = 'presença_magnetica' AND segment_code = 'perfumaria';

UPDATE ylada_diagnosis_archetypes
SET content_json = content_json
  || '{"profile_summary": "Você transmite delicadeza e romantismo. Pelas suas respostas, florais suaves e frescos tendem a combinar muito com sua energia. Esse perfil merece indicações que reflitam quem você é."}'::jsonb
  || '{"growth_potential": "Quem te enviou esse quiz pode te mostrar fragrâncias perfeitas pro seu perfil. Vale clicar no botão pra receber as sugestões."}'::jsonb
  || '{"frase_identificacao": "Se você se identificou com esse resultado, provavelmente quer descobrir quais perfumes combinam com você. O próximo passo é clicar no botão e receber as indicações."}'::jsonb
WHERE archetype_code = 'leveza_floral' AND segment_code = 'perfumaria';

UPDATE ylada_diagnosis_archetypes
SET content_json = content_json
  || '{"profile_summary": "Você transmite elegância atemporal. Pelas suas respostas, fragrâncias clássicas e sofisticadas combinam com seu estilo. Esse perfil merece indicações que reflitam sua presença."}'::jsonb
  || '{"growth_potential": "Quem te enviou esse quiz pode te mostrar fragrâncias perfeitas pro seu perfil. Vale clicar no botão pra receber as sugestões."}'::jsonb
  || '{"frase_identificacao": "Se você se identificou com esse resultado, provavelmente quer descobrir quais perfumes combinam com você. O próximo passo é clicar no botão e receber as indicações."}'::jsonb
WHERE archetype_code = 'sofisticacao_classica' AND segment_code = 'perfumaria';

UPDATE ylada_diagnosis_archetypes
SET content_json = content_json
  || '{"profile_summary": "Você transmite vitalidade e dinamismo. Pelas suas respostas, perfumes cítricos e frescos tendem a estimular essa energia. Esse perfil merece indicações que reflitam sua vibração."}'::jsonb
  || '{"growth_potential": "Quem te enviou esse quiz pode te mostrar fragrâncias perfeitas pro seu perfil. Vale clicar no botão pra receber as sugestões."}'::jsonb
  || '{"frase_identificacao": "Se você se identificou com esse resultado, provavelmente quer descobrir quais perfumes combinam com você. O próximo passo é clicar no botão e receber as indicações."}'::jsonb
WHERE archetype_code = 'energia_vibrante' AND segment_code = 'perfumaria';

UPDATE ylada_diagnosis_archetypes
SET content_json = content_json
  || '{"profile_summary": "Você transmite charme e sensibilidade. Pelas suas respostas, fragrâncias orientais suaves ou florais sensuais combinam com você. Esse perfil merece indicações personalizadas."}'::jsonb
  || '{"growth_potential": "Quem te enviou esse quiz pode te mostrar fragrâncias perfeitas pro seu perfil. Vale clicar no botão pra receber as sugestões."}'::jsonb
  || '{"frase_identificacao": "Se você se identificou com esse resultado, provavelmente quer descobrir quais perfumes combinam com você. O próximo passo é clicar no botão e receber as indicações."}'::jsonb
WHERE archetype_code = 'seducao_sutil' AND segment_code = 'perfumaria';

UPDATE ylada_diagnosis_archetypes
SET content_json = content_json
  || '{"profile_summary": "Pelas suas respostas, perfumes mais intensos e envolventes combinam com seu estilo. Presença marcante para ocasiões especiais. Esse perfil merece indicações que reflitam sua intensidade."}'::jsonb
  || '{"growth_potential": "Quem te enviou esse quiz pode te mostrar fragrâncias perfeitas pro seu perfil. Vale clicar no botão pra receber as sugestões."}'::jsonb
  || '{"frase_identificacao": "Se você se identificou com esse resultado, provavelmente quer descobrir quais perfumes combinam com você. O próximo passo é clicar no botão e receber as indicações."}'::jsonb
WHERE archetype_code = 'intensidade_noturna' AND segment_code = 'perfumaria';

UPDATE ylada_diagnosis_archetypes
SET content_json = content_json
  || '{"profile_summary": "Você transmite leveza e elegância discreta. Pelas suas respostas, fragrâncias suaves e íntimas combinam com sua presença. Esse perfil merece indicações que reflitam seu charme."}'::jsonb
  || '{"growth_potential": "Quem te enviou esse quiz pode te mostrar fragrâncias perfeitas pro seu perfil. Vale clicar no botão pra receber as sugestões."}'::jsonb
  || '{"frase_identificacao": "Se você se identificou com esse resultado, provavelmente quer descobrir quais perfumes combinam com você. O próximo passo é clicar no botão e receber as indicações."}'::jsonb
WHERE archetype_code = 'charme_discreto' AND segment_code = 'perfumaria';

-- CTA mais direto (mantém whatsapp_prefill por perfil)
UPDATE ylada_diagnosis_archetypes
SET content_json = content_json || '{"cta_text": "Quero receber sugestões de perfumes"}'::jsonb
WHERE segment_code = 'perfumaria';
