-- =====================================================
-- ADICIONAR QUIZZES DE NEGÓCIO AO WELLNESS
-- Ganhos e Prosperidade, Potencial e Crescimento, Propósito e Equilíbrio
-- =====================================================

-- Primeiro, garantir que a coluna profession existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'templates_nutrition' 
    AND column_name = 'profession'
  ) THEN
    ALTER TABLE templates_nutrition 
    ADD COLUMN profession VARCHAR(100) DEFAULT 'nutri';
  END IF;
END $$;

-- Verificar se já existem antes de inserir
DO $$
BEGIN
  -- 1. Quiz Ganhos e Prosperidade
  IF NOT EXISTS (
    SELECT 1 FROM templates_nutrition 
    WHERE LOWER(name) LIKE '%ganhos%' 
    AND LOWER(name) LIKE '%prosperidade%'
    AND profession = 'wellness'
    AND language = 'pt'
  ) THEN
    INSERT INTO templates_nutrition (
      name, type, language, profession, specialization, objective,
      title, description, content, cta_text, whatsapp_message, is_active
    ) VALUES (
      'Quiz: Ganhos e Prosperidade',
      'quiz',
      'pt',
      'wellness',
      'desenvolvimento',
      'capturar-leads',
      'Avalie se o estilo de vida permite ganhar mais',
      'Avalie se o estilo de vida permite ganhar mais — e descubra estratégias para aumentar prosperidade e resultados financeiros.',
      '{"questions": [{"id": 1, "question": "Você sente que seu estilo de vida está limitando seus ganhos?", "options": ["Não, estou satisfeito com meus ganhos", "Às vezes, sinto que poderia ganhar mais", "Sim, sinto que estou sendo limitado"]}]}',
      'Descobrir estratégias',
      'Olá! Fiz o quiz de ganhos e prosperidade e gostaria de saber mais sobre os resultados.'
    );
    RAISE NOTICE '✅ Quiz Ganhos e Prosperidade inserido';
  ELSE
    RAISE NOTICE '⚠️ Quiz Ganhos e Prosperidade já existe';
  END IF;

  -- 2. Quiz Potencial e Crescimento
  IF NOT EXISTS (
    SELECT 1 FROM templates_nutrition 
    WHERE LOWER(name) LIKE '%potencial%' 
    AND LOWER(name) LIKE '%crescimento%'
    AND profession = 'wellness'
    AND language = 'pt'
  ) THEN
    INSERT INTO templates_nutrition (
      name, type, language, profession, specialization, objective,
      title, description, content, cta_text, whatsapp_message, is_active
    ) VALUES (
      'Quiz: Potencial e Crescimento',
      'quiz',
      'pt',
      'wellness',
      'desenvolvimento',
      'capturar-leads',
      'Descubra se o potencial está sendo bem aproveitado',
      'Descubra se o potencial está sendo bem aproveitado — e receba orientações para maximizar crescimento e desenvolvimento.',
      '{"questions": [{"id": 1, "question": "Você sente que está aproveitando todo seu potencial?", "options": ["Sim, estou no meu máximo", "Às vezes, mas sinto que posso mais", "Não, sinto que estou abaixo do meu potencial"]}]}',
      'Descobrir potencial',
      'Olá! Fiz o quiz de potencial e crescimento e gostaria de saber mais sobre os resultados.'
    );
    RAISE NOTICE '✅ Quiz Potencial e Crescimento inserido';
  ELSE
    RAISE NOTICE '⚠️ Quiz Potencial e Crescimento já existe';
  END IF;

  -- 3. Quiz Propósito e Equilíbrio
  IF NOT EXISTS (
    SELECT 1 FROM templates_nutrition 
    WHERE LOWER(name) LIKE '%propósito%' 
    AND LOWER(name) LIKE '%equilíbrio%'
    AND profession = 'wellness'
    AND language = 'pt'
  ) THEN
    INSERT INTO templates_nutrition (
      name, type, language, profession, specialization, objective,
      title, description, content, cta_text, whatsapp_message, is_active
    ) VALUES (
      'Quiz: Propósito e Equilíbrio',
      'quiz',
      'pt',
      'wellness',
      'desenvolvimento',
      'capturar-leads',
      'Descubra se o dia a dia está alinhado com seus sonhos',
      'Descubra se o dia a dia está alinhado com seus sonhos — e receba orientações para encontrar propósito e equilíbrio na vida.',
      '{"questions": [{"id": 1, "question": "Você sente que seu dia a dia está alinhado com seus sonhos?", "options": ["Sim, totalmente alinhado", "Às vezes, mas nem sempre", "Não, sinto que estou distante"]}]}',
      'Descobrir propósito',
      'Olá! Fiz o quiz de propósito e equilíbrio e gostaria de saber mais sobre os resultados.'
    );
    RAISE NOTICE '✅ Quiz Propósito e Equilíbrio inserido';
  ELSE
    RAISE NOTICE '⚠️ Quiz Propósito e Equilíbrio já existe';
  END IF;

END $$;

-- Verificar os templates inseridos
SELECT name, type, profession, language, is_active 
FROM templates_nutrition 
WHERE profession = 'wellness' 
AND language = 'pt'
AND (
  LOWER(name) LIKE '%ganhos%' OR
  LOWER(name) LIKE '%potencial%' OR
  LOWER(name) LIKE '%propósito%' OR
  LOWER(name) LIKE '%proposito%'
)
ORDER BY name;

