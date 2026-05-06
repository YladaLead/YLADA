-- Calculadora de hidratação (Pro Líderes): alinhar consequência e próximos passos a líquidos/rotina de beber, não pele nem refeição.

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json =
    content_json
    || jsonb_build_object(
      'consequence',
      'Pequeno déficit repetido puxa foco, digestão e energia sem você nomear a causa.'
    )
    || jsonb_build_object(
      'specific_actions',
      jsonb_build_array(
        'Ter sempre água ao alcance no trecho do dia em que mais esquece de beber.',
        'Distribuir líquidos ao longo do dia em vez de compensar só quando a sede apertar.',
        'Converse com quem te enviou o link para calibrar volume ao seu peso, clima e expediente.'
      )
    )
WHERE flow_id = 'calc-hidratacao'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'leve';

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json =
    content_json
    || jsonb_build_object(
      'specific_actions',
      jsonb_build_array(
        'Combinar dias de calor ou treino com mais líquidos antes do corpo pedir com sede forte.',
        'Evitar substituir água só por cafeína ou bebida açucarada nos dias mais pesados.',
        'Converse com quem te enviou o link para ajustar meta e gatilhos (garrafa, pausas) ao seu dia.'
      )
    )
WHERE flow_id = 'calc-hidratacao'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'moderado';

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json =
    content_json
    || jsonb_build_object(
      'specific_actions',
      jsonb_build_array(
        'Priorizar água em momentos-chave (ao acordar, antes e depois de esforço físico).',
        'Tratar hidratação como base do dia: volume e ritmo, não só um copo quando lembrar.',
        'Converse com quem te enviou o link para montar um plano simples que você consiga sustentar.'
      )
    )
WHERE flow_id = 'calc-hidratacao'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'urgente';
