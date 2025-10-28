-- =====================================================
-- HERBALEAD → YLADA: TODOS OS 13 TEMPLATES
-- Templates completos para Nutri, Coach e Wellness
-- =====================================================

-- =====================================================
-- CALCULADORAS (9)
-- =====================================================

-- 1. IMC ✅
-- 2. Proteína ✅
-- 3. Hidratação ✅
-- 4. Composição Corporal ✅
-- 5. Bem-Estar Diário (daily-wellness)
-- 6. Alimentação Saudável (healthy-eating)
-- 7. Planejador de Refeições (meal-planner)
-- 8. Avaliação Nutricional (nutrition-assessment)
-- 9. Perfil de Bem-Estar (wellness-profile)

-- =====================================================
-- QUIZZES (4)
-- =====================================================

-- 10. Ganhos e Prosperidade ✅
-- 11. Potencial e Crescimento ✅
-- 12. Propósito e Equilíbrio ✅
-- 13. Diagnóstico de Parasitas ✅

-- NOTA: Os templates 1-4 e 10-13 já foram criados nos arquivos anteriores
-- Este arquivo adiciona os templates restantes: 5-9

-- =====================================================
-- 5. TEMPLATE: Bem-Estar Diário (Tabela/Acompanhamento)
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Tabela: Bem-Estar Diário',
  'planilha',
  'pt',
  'multi',
  'acompanhamento',
  'capturar-leads',
  'Acompanhe suas métricas de bem-estar diárias',
  'Tabela para acompanhar métricas diárias de bem-estar: peso, hidratação, sono, energia e humor.',
  '{
    "fields": [
      {"name": "date", "label": "Data", "type": "date", "required": true},
      {"name": "weight", "label": "Peso (kg)", "type": "number", "required": false, "step": 0.1},
      {"name": "water", "label": "Água (litros)", "type": "number", "required": false, "step": 0.1},
      {"name": "sleep", "label": "Horas de sono", "type": "number", "required": false, "min": 4, "max": 12},
      {"name": "energy", "label": "Nível de energia", "type": "select", "options": ["Baixo", "Médio", "Alto", "Muito alto"]},
      {"name": "mood", "label": "Humor", "type": "select", "options": ["😢", "😐", "🙂", "😊", "🤩"]}
    ],
    "columns": ["Data", "Peso", "Água", "Sono", "Energia", "Humor", "Observações"],
    "tips": [
      "Registre diariamente ao acordar",
      "Observe padrões ao longo do tempo",
      "Correlacione com alimentação e exercícios",
      "Ajuste hábitos baseado em resultados"
    ]
  }',
  'Baixar minha tabela',
  'Olá! Acompanho meu bem-estar diário através do YLADA e gostaria de saber mais sobre como posso otimizar minhas métricas. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. TEMPLATE: Alimentação Saudável (Quiz Nutricional)
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Alimentação Saudável',
  'quiz',
  'pt',
  'multi',
  'nutricao',
  'capturar-leads',
  'Avalie seus hábitos alimentares e receba orientações',
  'Descubra como seus hábitos alimentares estão impactando sua saúde e bem-estar.',
  '{
    "questions": [
      {
        "id": 1,
        "question": "Quantas refeições você faz por dia?",
        "type": "multipla",
        "options": ["1-2 refeições", "3 refeições", "4-5 refeições", "6 ou mais"]
      },
      {
        "id": 2,
        "question": "Você consome frutas e verduras diariamente?",
        "type": "multipla",
        "options": ["Raramente", "Às vezes", "Frequentemente", "Simpre"]
      },
      {
        "id": 3,
        "question": "Como você distribui proteínas ao longo do dia?",
        "type": "multipla",
        "options": ["Concentrado em uma refeição", "2 refeições", "3 refeições", "Todas as refeições"]
      },
      {
        "id": 4,
        "question": "Você bebe água suficiente durante o dia?",
        "type": "multipla",
        "options": ["Não, bebo muito pouco", "Às vezes", "Regularmente", "Sempre"]
      },
      {
        "id": 5,
        "question": "Como você descreve sua alimentação?",
        "type": "multipla",
        "options": ["Pouco nutritiva", "Moderada", "Boa", "Excelente"]
      }
    ],
    "scoring": {
      "ranges": [
        {"min": 0, "max": 5, "result": "Hábitos a Melhorar", "recommendations": ["Aumentar frequência de refeições", "Incluir mais frutas e verduras", "Buscar orientação nutricional"]},
        {"min": 6, "max": 10, "result": "Hábitos Moderados", "recommendations": ["Otimizar horários das refeições", "Melhorar distribuição de macronutrientes", "Manter constância"]},
        {"min": 11, "max": 15, "result": "Hábitos Saudáveis", "recommendations": ["Manter rotina atual", "Aprimorar com pequenos ajustes", "Ser exemplo para outros"]}
      ]
    }
  }',
  'Ver meu resultado nutricional',
  'Olá! Completei o Quiz de Alimentação Saudável através do YLADA e gostaria de saber mais sobre como melhorar meus hábitos. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. TEMPLATE: Planejador de Refeições
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Planejador de Refeições',
  'calculadora',
  'pt',
  'multi',
  'nutricao',
  'vender-suplementos',
  'Crie seu plano alimentar personalizado',
  'Receba um plano alimentar completo com cardápio semanal baseado nas suas necessidades e preferências.',
  '{
    "fields": [
      {"name": "age", "label": "Idade", "type": "number", "required": true},
      {"name": "gender", "label": "Gênero", "type": "select", "options": ["Masculino", "Feminino"], "required": true},
      {"name": "weight", "label": "Peso atual (kg)", "type": "number", "required": true, "step": 0.1},
      {"name": "height", "label": "Altura (cm)", "type": "number", "required": true},
      {"name": "activity", "label": "Nível de atividade", "type": "select", "options": ["Sedentário", "Leve", "Moderado", "Ativo", "Muito ativo"], "required": true},
      {"name": "goal", "label": "Objetivo", "type": "select", "options": ["Manter peso", "Perder peso", "Ganhar massa"], "required": true},
      {"name": "preferences", "label": "Preferências alimentares", "type": "multiselect", "options": ["Carnes", "Frango", "Peixe", "Vegetariano", "Vegano"], "required": true},
      {"name": "meals", "label": "Refeições por dia", "type": "select", "options": ["3 refeições", "4 refeições", "5 refeições", "6 refeições"], "required": true}
    ],
    "output": {
      "mealPlan": "Sugestão de cardápio semanal",
      "macros": "Distribuição de macronutrientes",
      "recipes": "Receitas recomendadas",
      "shoppingList": "Lista de compras"
    },
    "supplements": [
      {"name": "Proteína em Pó", "recommendation": "Após treino ou como lanche"},
      {"name": "Multivitamínico", "recommendation": "Pela manhã com café da manhã"},
      {"name": "Omega 3", "recommendation": "Durante uma refeição principal"}
    ]
  }',
  'Receber meu plano alimentar',
  'Olá! Solicitei meu plano alimentar personalizado através do YLADA e gostaria de saber mais sobre como implementá-lo. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. TEMPLATE: Avaliação Nutricional
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Avaliação Nutricional Completa',
  'quiz',
  'pt',
  'multi',
  'nutricao',
  'capturar-leads',
  'Questionário completo de hábitos alimentares',
  'Avaliação detalhada dos seus hábitos alimentares, deficiências nutricionais e necessidades específicas.',
  '{
    "questions": [
      {"id": 1, "question": "Como você se sente após as refeições?", "type": "multipla", "options": ["Pesado e lento", "Razoável", "Bem", "Energizado"]},
      {"id": 2, "question": "Você sente fome entre as refeições?", "type": "multipla", "options": ["Sempre", "Frequentemente", "Às vezes", "Raramente"]},
      {"id": 3, "question": "Você consome alimentos industrializados com frequência?", "type": "multipla", "options": ["Diariamente", "Frequentemente", "Às vezes", "Raramente"]},
      {"id": 4, "question": "Como é sua relação com doces e açúcar?", "type": "multipla", "options": ["Dependente", "Alto consumo", "Moderado", "Controlado"]},
      {"id": 5, "question": "Você tem algum sintoma digestivo?", "type": "multipla", "options": ["Frequentemente", "Às vezes", "Raramente", "Não"]},
      {"id": 6, "question": "Quanto você consome de água por dia?", "type": "multipla", "options": ["Menos de 1L", "1-2L", "2-3L", "Mais de 3L"]},
      {"id": 7, "question": "Você usa suplementos?", "type": "multipla", "options": ["Não", "Às vezes", "Regularmente", "Sim, diariamente"]}
    ],
    "scoring": {
      "nutritional_deficiencies": {
        "protein": "Avaliar consumo proteico",
        "vitamins": "Verificar ingestão de micronutrientes",
        "hydration": "Melhorar hidratação"
      },
      "recommendations": {
        "diet": "Ajustes na alimentação",
        "supplements": "Suplementação estratégica",
        "timing": "Otimização de horários",
        "consultation": "Consulta com especialista"
      }
    }
  }',
  'Ver minha avaliação nutricional',
  'Olá! Completei minha Avaliação Nutricional através do YLADA e gostaria de saber mais sobre os resultados. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. TEMPLATE: Perfil de Bem-Estar
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Quiz: Perfil de Bem-Estar',
  'quiz',
  'pt',
  'multi',
  'bem-estar',
  'capturar-leads',
  'Descubra seu perfil completo de bem-estar',
  'Avaliação abrangente de bem-estar: física, mental, emocional e social para identificar áreas de melhoria.',
  '{
    "questions": [
      {
        "section": "Saúde Física",
        "questions": [
          {"id": 1, "question": "Como você avalia seu nível de energia diário?", "type": "multipla", "options": ["Baixo", "Médio", "Alto", "Muito alto"]},
          {"id": 2, "question": "Com que frequência você pratica atividades físicas?", "type": "multipla", "options": ["Nunca", "1x por semana", "2-3x por semana", "4x ou mais"]},
          {"id": 3, "question": "Como está sua qualidade de sono?", "type": "multipla", "options": ["Ruim", "Regular", "Boa", "Excelente"]}
        ]
      },
      {
        "section": "Saúde Mental",
        "questions": [
          {"id": 4, "question": "Você consegue lidar bem com o estresse?", "type": "multipla", "options": ["Não", "Às vezes", "Geralmente", "Sim"]},
          {"id": 5, "question": "Você sente ansiedade com frequência?", "type": "multipla", "options": ["Sempre", "Frequentemente", "Às vezes", "Raramente"]},
          {"id": 6, "question": "Você consegue relaxar e descansar?", "type": "multipla", "options": ["Não consigo", "Raramente", "Às vezes", "Sim"]
        ]
      },
      {
        "section": "Bem-Estar Emocional",
        "questions": [
          {"id": 7, "question": "Como está sua autoestima?", "type": "multipla", "options": ["Baixa", "Moderada", "Boa", "Excelente"]},
          {"id": 8, "question": "Você se sente realizado com sua vida?", "type": "multipla", "options": ["Não", "Parcialmente", "Sim", "Muito"]}
        ]
      }
    ],
    "scoring": {
      "profiles": [
        {"name": "Bem-Estar Equilibrado", "score_range": [40, 50], "description": "Excelente equilíbrio em todas as áreas"},
        {"name": "Bem-Estar Moderado", "score_range": [30, 39], "description": "Áreas para otimização identificadas"},
        {"name": "Bem-Estar em Desenvolvimento", "score_range": [20, 29], "description": "Priorizar saúde e bem-estar"}
      ],
      "focus_areas": ["Saúde Física", "Saúde Mental", "Bem-Estar Emocional", "Relacionamentos", "Propósito"]
    }
  }',
  'Ver meu perfil de bem-estar',
  'Olá! Completei o Quiz de Perfil de Bem-Estar através do YLADA e gostaria de conversar sobre estratégias de melhoria. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICAÇÃO FINAL - TODOS OS 13 TEMPLATES
-- =====================================================
SELECT 
    'Templates criados:' as info,
    COUNT(*) as total,
    type,
    profession
FROM templates_nutrition
WHERE name IN (
  'Calculadora IMC',
  'Calculadora de Proteína',
  'Calculadora de Hidratação',
  'Composição Corporal',
  'Tabela: Bem-Estar Diário',
  'Quiz: Alimentação Saudável',
  'Planejador de Refeições',
  'Avaliação Nutricional Completa',
  'Quiz: Perfil de Bem-Estar',
  'Quiz: Ganhos e Prosperidade',
  'Quiz: Potencial e Crescimento',
  'Quiz: Propósito e Equilíbrio',
  'Quiz: Diagnóstico de Parasitas'
)
GROUP BY type, profession
ORDER BY type, profession;

