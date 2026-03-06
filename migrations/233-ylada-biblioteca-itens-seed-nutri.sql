-- =====================================================
-- Seed da biblioteca YLADA com itens baseados em Nutri.
-- Conteúdo: textos e nomes da área Nutri; diagnóstico adapta por perfil (motor YLADA).
-- Nomenclatura: quiz_{tema}, calculadora_{tema}
-- @see src/config/ylada-quiz-temas.ts
-- @see src/config/ylada-pilares-temas.ts
-- =====================================================

-- Requer migration 232 (ylada_biblioteca_itens)
INSERT INTO ylada_biblioteca_itens (
  tipo,
  segment_codes,
  tema,
  pilar,
  titulo,
  description,
  source_type,
  source_id,
  flow_id,
  architecture,
  meta,
  sort_order,
  active
) VALUES
  -- Bloco 1: Energia
  (
    'quiz',
    ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness', 'aesthetics'],
    'energia',
    'energia',
    'Diagnóstico de Energia',
    'Quiz para avaliar disposição e vitalidade. O diagnóstico se adapta ao perfil do profissional.',
    'custom',
    NULL,
    'diagnostico_risco',
    'RISK_DIAGNOSIS',
    '{"nomenclatura": "quiz_energia"}'::jsonb,
    10,
    true
  ),
  (
    'quiz',
    ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'],
    'vitalidade_geral',
    'energia',
    'Diagnóstico de Vitalidade',
    'Quiz para avaliar bem-estar geral. O diagnóstico se adapta ao perfil do profissional.',
    'custom',
    NULL,
    'diagnostico_risco',
    'RISK_DIAGNOSIS',
    '{"nomenclatura": "quiz_vitalidade"}'::jsonb,
    11,
    true
  ),
  -- Bloco 2: Metabolismo
  (
    'quiz',
    ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'],
    'metabolismo',
    'metabolismo',
    'Diagnóstico de Metabolismo',
    'Quiz para avaliar perfil metabólico. O diagnóstico se adapta ao perfil do profissional.',
    'custom',
    NULL,
    'diagnostico_risco',
    'RISK_DIAGNOSIS',
    '{"nomenclatura": "quiz_metabolismo"}'::jsonb,
    20,
    true
  ),
  (
    'quiz',
    ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'aesthetics'],
    'inchaço_retencao',
    'metabolismo',
    'Diagnóstico de Inchaço e Retenção',
    'Quiz para avaliar retenção de líquidos. O diagnóstico se adapta ao perfil do profissional.',
    'custom',
    NULL,
    'diagnostico_risco',
    'RISK_DIAGNOSIS',
    '{"nomenclatura": "quiz_inchaco"}'::jsonb,
    21,
    true
  ),
  (
    'quiz',
    ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'],
    'peso_gordura',
    'metabolismo',
    'Diagnóstico de Peso e Emagrecimento',
    'Quiz para avaliar prontidão para emagrecimento saudável. O diagnóstico se adapta ao perfil do profissional.',
    'custom',
    NULL,
    'diagnostico_risco',
    'RISK_DIAGNOSIS',
    '{"nomenclatura": "quiz_peso"}'::jsonb,
    22,
    true
  ),
  -- Bloco 3: Digestão
  (
    'quiz',
    ARRAY['nutrition', 'nutrition_vendedor', 'medicine'],
    'intestino',
    'digestao',
    'Diagnóstico de Intestino',
    'Quiz para avaliar saúde intestinal e digestão. O diagnóstico se adapta ao perfil do profissional.',
    'custom',
    NULL,
    'diagnostico_risco',
    'RISK_DIAGNOSIS',
    '{"nomenclatura": "quiz_intestino"}'::jsonb,
    30,
    true
  ),
  -- Bloco 4: Mente
  (
    'quiz',
    ARRAY['nutrition', 'medicine', 'psychology', 'fitness'],
    'estresse',
    'mente',
    'Diagnóstico de Estresse',
    'Quiz para avaliar nível de estresse e equilíbrio emocional. O diagnóstico se adapta ao perfil do profissional.',
    'custom',
    NULL,
    'diagnostico_risco',
    'RISK_DIAGNOSIS',
    '{"nomenclatura": "quiz_estresse"}'::jsonb,
    40,
    true
  ),
  (
    'quiz',
    ARRAY['nutrition', 'medicine', 'psychology', 'fitness'],
    'foco_concentracao',
    'mente',
    'Diagnóstico de Foco e Concentração',
    'Quiz para avaliar clareza mental e produtividade. O diagnóstico se adapta ao perfil do profissional.',
    'custom',
    NULL,
    'diagnostico_risco',
    'RISK_DIAGNOSIS',
    '{"nomenclatura": "quiz_foco"}'::jsonb,
    41,
    true
  ),
  -- Bloco 5: Hábitos
  (
    'quiz',
    ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'],
    'sono',
    'habitos',
    'Diagnóstico de Sono',
    'Quiz para avaliar qualidade do sono. O diagnóstico se adapta ao perfil do profissional.',
    'custom',
    NULL,
    'diagnostico_risco',
    'RISK_DIAGNOSIS',
    '{"nomenclatura": "quiz_sono"}'::jsonb,
    50,
    true
  ),
  (
    'quiz',
    ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'],
    'alimentacao',
    'habitos',
    'Diagnóstico de Alimentação',
    'Quiz para avaliar hábitos alimentares. O diagnóstico se adapta ao perfil do profissional.',
    'custom',
    NULL,
    'diagnostico_risco',
    'RISK_DIAGNOSIS',
    '{"nomenclatura": "quiz_alimentacao"}'::jsonb,
    51,
    true
  ),
  (
    'quiz',
    ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'],
    'rotina_saudavel',
    'habitos',
    'Diagnóstico de Rotina Saudável',
    'Quiz para avaliar organização e hábitos diários. O diagnóstico se adapta ao perfil do profissional.',
    'custom',
    NULL,
    'diagnostico_risco',
    'RISK_DIAGNOSIS',
    '{"nomenclatura": "quiz_rotina"}'::jsonb,
    52,
    true
  );
