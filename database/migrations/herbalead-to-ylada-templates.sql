-- =====================================================
-- HERBALEAD → YLADA TEMPLATES MIGRATION
-- Templates universais para Nutri, Coach e Wellness
-- =====================================================

-- Este script cria templates de calculadoras que podem ser usados por
-- nutricionistas, coaches e consultores de bem-estar

-- =====================================================
-- 1. TEMPLATE: Calculadora IMC
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Calculadora IMC',
  'calculadora',
  'pt',
  'multi', -- Disponível para todos os profissionais
  'avaliacao',
  'capturar-leads',
  'Calcule seu Índice de Massa Corporal',
  'Descubra seu IMC e receba orientações personalizadas para alcançar seu peso ideal com saúde e bem-estar.',
  '{
    "fields": [
      {"name": "age", "label": "Idade", "type": "number", "required": true, "min": 1, "max": 120},
      {"name": "gender", "label": "Gênero", "type": "select", "required": true, "options": ["Masculino", "Feminino"]},
      {"name": "weight", "label": "Peso (kg)", "type": "number", "required": true, "min": 1, "max": 300, "step": 0.1},
      {"name": "height", "label": "Altura (cm)", "type": "number", "required": true, "min": 100, "max": 250}
    ],
    "formula": "weight / (height/100)^2",
    "results": {
      "categories": [
        {"range": [0, 18.5], "label": "Abaixo do peso", "color": "blue", "recommendations": ["Consultar especialista para ganho de peso saudável", "Focar em alimentos nutritivos e calóricos", "Considerar exercícios de força"]},
        {"range": [18.5, 25], "label": "Peso normal", "color": "green", "recommendations": ["Manter hábitos saudáveis", "Fazer atividades físicas regulares", "Alimentação balanceada"]},
        {"range": [25, 30], "label": "Sobrepeso", "color": "orange", "recommendations": ["Consultar especialista", "Reduzir calorias gradualmente", "Aumentar atividade física"]},
        {"range": [30, 35], "label": "Obesidade Grau I", "color": "red", "recommendations": ["Consultar especialista urgentemente", "Plano alimentar supervisionado", "Atividade física acompanhada"]},
        {"range": [35, 100], "label": "Obesidade Grau II/III", "color": "red", "recommendations": ["Consultar médico especialista", "Acompanhamento multidisciplinar", "Plano de redução de peso supervisionado"]}
      ]
    }
  }',
  'Ver meu resultado personalizado',
  'Olá! Calculei meu IMC através do YLADA e gostaria de saber mais sobre como posso alcançar meu objetivo de forma saudável. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. TEMPLATE: Calculadora de Proteína
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Calculadora de Proteína',
  'calculadora',
  'pt',
  'multi',
  'avaliacao',
  'capturar-leads',
  'Calcule suas necessidades proteicas diárias',
  'Descubra quantas gramas de proteína você precisa por dia para atingir seus objetivos de saúde e bem-estar.',
  '{
    "fields": [
      {"name": "age", "label": "Idade", "type": "number", "required": true, "min": 1, "max": 120},
      {"name": "gender", "label": "Gênero", "type": "select", "required": true, "options": ["Masculino", "Feminino"]},
      {"name": "weight", "label": "Peso (kg)", "type": "number", "required": true, "min": 1, "max": 300, "step": 0.1},
      {"name": "height", "label": "Altura (cm)", "type": "number", "required": true, "min": 100, "max": 250},
      {"name": "activity", "label": "Nível de atividade", "type": "select", "required": true, "options": ["Sedentário", "Leve", "Moderado", "Intenso", "Muito intenso"]},
      {"name": "goal", "label": "Objetivo", "type": "select", "required": true, "options": ["Manter peso", "Perder peso", "Ganhar massa"]}
    ],
    "formula": "weight * proteinPerKg (variável baseado em atividade: sedentário=0.8, leve=1.0, moderado=1.2, intenso=1.6, muito=2.0; ajustado por objetivo)",
    "results": {
      "categories": [
        {"range": [0, 1.0], "label": "Abaixo do recomendado", "recommendations": ["Aumentar ingestão proteica gradualmente", "Incluir fontes de proteína em todas as refeições", "Considerar suplementação se necessário"]},
        {"range": [1.0, 1.8], "label": "Adequado", "recommendations": ["Manter consumo proteico atual", "Diversificar fontes de proteína", "Distribuir ao longo do dia"]},
        {"range": [1.8, 3.0], "label": "Alto", "recommendations": ["Excelente para ganho de massa", "Monitorar função renal", "Manter boa hidratação"]}
      ],
      "proteinSources": ["Carnes magras", "Peixe e frutos do mar", "Ovos", "Leguminosas", "Laticínios", "Suplementos proteicos"]
    }
  }',
  'Ver minha quantidade ideal de proteína',
  'Olá! Calculei minhas necessidades proteicas diárias através do YLADA. Gostaria de saber mais sobre como posso alcançar essa quantidade. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. TEMPLATE: Calculadora de Hidratação
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Calculadora de Hidratação',
  'calculadora',
  'pt',
  'multi',
  'avaliacao',
  'capturar-leads',
  'Calcule sua necessidade diária de água',
  'Descubra quanta água você precisa beber por dia para manter seu corpo hidratado e funcionando perfeitamente.',
  '{
    "fields": [
      {"name": "age", "label": "Idade", "type": "number", "required": true, "min": 1, "max": 120},
      {"name": "gender", "label": "Gênero", "type": "select", "required": true, "options": ["Masculino", "Feminino"]},
      {"name": "weight", "label": "Peso (kg)", "type": "number", "required": true, "min": 1, "max": 300, "step": 0.1},
      {"name": "activity", "label": "Nível de atividade", "type": "select", "required": true, "options": ["Sedentário", "Leve", "Moderado", "Intenso", "Muito intenso"]},
      {"name": "climate", "label": "Clima", "type": "select", "required": true, "options": ["Temperado", "Quente", "Muito quente"]}
    ],
    "formula": "baseWater + activityAdjustment + climateAdjustment (base: 35ml/kg)",
    "results": {
      "categories": [
        {"range": [0, 1.5], "label": "Abaixo do recomendado", "recommendations": ["Aumentar ingestão hídrica gradualmente", "Carregar garrafa de água", "Beber água ao acordar"]},
        {"range": [1.5, 3.0], "label": "Adequado", "recommendations": ["Manter hidratação regular", "Monitorar cor da urina", "Distribuir ao longo do dia"]},
        {"range": [3.0, 5.0], "label": "Excelente", "recommendations": ["Ótimo nível de hidratação", "Considerar eletrólitos em exercícios intensos", "Manter consistência"]}
      ],
      "tips": ["Beba água ao acordar", "Carregue uma garrafa", "Monitore cor da urina", "Aumente em dias quentes"]
    }
  }',
  'Ver minha necessidade ideal de água',
  'Olá! Calculei minha necessidade diária de hidratação através do YLADA. Gostaria de saber mais sobre estratégias práticas para me hidratar melhor. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. TEMPLATE: Composição Corporal
-- =====================================================
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active
) VALUES (
  'Composição Corporal',
  'calculadora',
  'pt',
  'multi',
  'avaliacao',
  'capturar-leads',
  'Avalie sua composição corporal',
  'Entenda sua massa muscular, gordura corporal e hidratação para alcançar seus objetivos com precisão.',
  '{
    "fields": [
      {"name": "age", "label": "Idade", "type": "number", "required": true, "min": 1, "max": 120},
      {"name": "gender", "label": "Gênero", "type": "select", "required": true, "options": ["Masculino", "Feminino"]},
      {"name": "weight", "label": "Peso (kg)", "type": "number", "required": true, "min": 1, "max": 300, "step": 0.1},
      {"name": "height", "label": "Altura (cm)", "type": "number", "required": true, "min": 100, "max": 250},
      {"name": "waist", "label": "Cintura (cm)", "type": "number", "required": false, "min": 50, "max": 200}
    ],
    "calculations": [
      {"name": "BMI", "formula": "weight / (height/100)^2"},
      {"name": "BF_estimate", "formula": "gender === Masculino ? ((waist * 0.314) - height * 0.109) : ((waist * 0.314) - height * 0.119)"},
      {"name": "LBM", "formula": "weight * (1 - BF_estimate/100)"},
      {"name": "FM", "formula": "weight * BF_estimate/100"}
    ],
    "results": {
      "evaluation": {
        "mass_muscular": {"ideal": "40-50% (homens), 30-40% (mulheres)", "interpretacao": "Indica força e saúde metabólica"},
        "gordura_corporal": {"ideal": "10-20% (homens), 18-28% (mulheres)", "interpretacao": "Essencial para funções hormonais"},
        "hidratacao": {"ideal": "50-65%", "interpretacao": "Vital para todas as funções corporais"}
      }
    }
  }',
  'Ver minha composição corporal',
  'Olá! Avaliei minha composição corporal através do YLADA e gostaria de saber mais sobre como otimizar minha massa muscular e percentual de gordura. Pode me ajudar?'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
SELECT 
    'Templates de calculadoras inseridos:' as info,
    name,
    type,
    profession,
    is_active
FROM templates_nutrition
WHERE type = 'calculadora'
ORDER BY name;

