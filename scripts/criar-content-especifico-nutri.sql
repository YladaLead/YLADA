-- ============================================
-- CRIAR CONTENT ESPECÍFICO PARA TEMPLATES NUTRI
-- Content personalizado para área Nutri (não copia de Wellness)
-- ============================================

-- ⚠️ IMPORTANTE:
-- 1. Este script cria content específico para cada template Nutri
-- 2. Content é baseado no tipo de template (quiz, calculadora, planilha)
-- 3. Estrutura adequada para manutenção futura
-- 4. Cada template tem seu próprio content JSONB

-- ============================================
-- 1. ATUALIZAR CONTENT DAS CALCULADORAS (4)
-- ============================================

-- Calculadora de IMC
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "calculator",
    "fields": [
      {
        "id": "peso",
        "label": "Peso (kg)",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 500
      },
      {
        "id": "altura",
        "label": "Altura (cm)",
        "type": "number",
        "required": true,
        "min": 50,
        "max": 250
      }
    ],
    "formula": "peso / ((altura / 100) * (altura / 100))",
    "result_label": "Seu IMC é",
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'calculadora-imc';

-- Calculadora de Proteína
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "calculator",
    "fields": [
      {
        "id": "peso",
        "label": "Peso (kg)",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 500
      },
      {
        "id": "atividade",
        "label": "Nível de atividade física",
        "type": "select",
        "required": true,
        "options": [
          {"value": "sedentario", "label": "Sedentário"},
          {"value": "leve", "label": "Leve (1-3x/semana)"},
          {"value": "moderado", "label": "Moderado (3-5x/semana)"},
          {"value": "intenso", "label": "Intenso (6-7x/semana)"}
        ]
      },
      {
        "id": "objetivo",
        "label": "Objetivo",
        "type": "select",
        "required": true,
        "options": [
          {"value": "manter", "label": "Manter peso"},
          {"value": "emagrecer", "label": "Emagrecer"},
          {"value": "ganhar", "label": "Ganhar massa"}
        ]
      }
    ],
    "formula": "peso * atividade_multiplier * objetivo_multiplier",
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'calculadora-proteina';

-- Calculadora de Água
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "calculator",
    "fields": [
      {
        "id": "peso",
        "label": "Peso (kg)",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 500
      },
      {
        "id": "atividade",
        "label": "Nível de atividade física",
        "type": "select",
        "required": true,
        "options": [
          {"value": "leve", "label": "Leve"},
          {"value": "moderado", "label": "Moderado"},
          {"value": "intenso", "label": "Intenso"}
        ]
      },
      {
        "id": "clima",
        "label": "Clima",
        "type": "select",
        "required": true,
        "options": [
          {"value": "temperado", "label": "Temperado"},
          {"value": "quente", "label": "Quente"},
          {"value": "muito_quente", "label": "Muito quente"}
        ]
      }
    ],
    "formula": "peso * 35 + atividade_extra + clima_extra",
    "result_label": "Sua necessidade diária de água é",
    "unit": "ml",
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'calculadora-agua';

-- Calculadora de Calorias
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "calculator",
    "fields": [
      {
        "id": "idade",
        "label": "Idade",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 120
      },
      {
        "id": "genero",
        "label": "Gênero",
        "type": "select",
        "required": true,
        "options": [
          {"value": "masculino", "label": "Masculino"},
          {"value": "feminino", "label": "Feminino"}
        ]
      },
      {
        "id": "peso",
        "label": "Peso (kg)",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 500
      },
      {
        "id": "altura",
        "label": "Altura (cm)",
        "type": "number",
        "required": true,
        "min": 50,
        "max": 250
      },
      {
        "id": "atividade",
        "label": "Nível de atividade",
        "type": "select",
        "required": true,
        "options": [
          {"value": "sedentario", "label": "Sedentário"},
          {"value": "leve", "label": "Leve"},
          {"value": "moderado", "label": "Moderado"},
          {"value": "intenso", "label": "Intenso"}
        ]
      }
    ],
    "formula": "tmb * atividade_multiplier",
    "result_label": "Seu gasto calórico diário é",
    "unit": "kcal",
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'calculadora-calorias';

-- ============================================
-- 2. ATUALIZAR CONTENT DOS QUIZZES (24)
-- ============================================

-- Quiz Interativo
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Qual é seu principal objetivo nutricional?",
        "type": "multiple_choice",
        "options": [
          {"id": "emagrecer", "label": "Emagrecer"},
          {"id": "ganhar_massa", "label": "Ganhar massa muscular"},
          {"id": "manter", "label": "Manter peso"},
          {"id": "saude", "label": "Melhorar saúde geral"}
        ]
      },
      {
        "id": 2,
        "question": "Com que frequência você pratica atividade física?",
        "type": "multiple_choice",
        "options": [
          {"id": "nunca", "label": "Nunca"},
          {"id": "1_2x", "label": "1-2x por semana"},
          {"id": "3_4x", "label": "3-4x por semana"},
          {"id": "5_mais", "label": "5x ou mais por semana"}
        ]
      },
      {
        "id": 3,
        "question": "Como você descreveria sua alimentação atual?",
        "type": "multiple_choice",
        "options": [
          {"id": "balanceada", "label": "Balanceada"},
          {"id": "irregular", "label": "Irregular"},
          {"id": "restritiva", "label": "Muito restritiva"},
          {"id": "excessiva", "label": "Excessiva"}
        ]
      },
      {
        "id": 4,
        "question": "Você tem alguma restrição alimentar?",
        "type": "multiple_choice",
        "options": [
          {"id": "nenhuma", "label": "Nenhuma"},
          {"id": "vegetariano", "label": "Vegetariano"},
          {"id": "vegano", "label": "Vegano"},
          {"id": "intolerancia", "label": "Intolerâncias alimentares"}
        ]
      },
      {
        "id": 5,
        "question": "Quanto tempo você tem disponível para preparar refeições?",
        "type": "multiple_choice",
        "options": [
          {"id": "muito_tempo", "label": "Muito tempo"},
          {"id": "tempo_moderado", "label": "Tempo moderado"},
          {"id": "pouco_tempo", "label": "Pouco tempo"},
          {"id": "quase_nenhum", "label": "Quase nenhum"}
        ]
      },
      {
        "id": 6,
        "question": "O que mais te motiva a melhorar sua alimentação?",
        "type": "multiple_choice",
        "options": [
          {"id": "saude", "label": "Saúde"},
          {"id": "estetica", "label": "Estética"},
          {"id": "energia", "label": "Mais energia"},
          {"id": "performance", "label": "Performance esportiva"}
        ]
      }
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-interativo';

-- Quiz de Bem-Estar
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Como você avalia seu nível de energia ao longo do dia?",
        "type": "multiple_choice",
        "options": [
          {"id": "alta", "label": "Alta energia"},
          {"id": "moderada", "label": "Energia moderada"},
          {"id": "baixa", "label": "Baixa energia"},
          {"id": "variavel", "label": "Varia muito"}
        ]
      },
      {
        "id": 2,
        "question": "Como está a qualidade do seu sono?",
        "type": "multiple_choice",
        "options": [
          {"id": "otima", "label": "Ótima"},
          {"id": "boa", "label": "Boa"},
          {"id": "regular", "label": "Regular"},
          {"id": "ruim", "label": "Ruim"}
        ]
      },
      {
        "id": 3,
        "question": "Com que frequência você se sente estressado?",
        "type": "multiple_choice",
        "options": [
          {"id": "raramente", "label": "Raramente"},
          {"id": "as_vezes", "label": "Às vezes"},
          {"id": "frequentemente", "label": "Frequentemente"},
          {"id": "sempre", "label": "Sempre"}
        ]
      },
      {
        "id": 4,
        "question": "Como você se sente após as refeições?",
        "type": "multiple_choice",
        "options": [
          {"id": "satisfeito", "label": "Satisfeito e energizado"},
          {"id": "pesado", "label": "Pesado e sonolento"},
          {"id": "com_fome", "label": "Ainda com fome"},
          {"id": "incomodo", "label": "Com desconforto"}
        ]
      },
      {
        "id": 5,
        "question": "Você pratica alguma atividade física regularmente?",
        "type": "multiple_choice",
        "options": [
          {"id": "sim_diario", "label": "Sim, quase diariamente"},
          {"id": "sim_semanal", "label": "Sim, algumas vezes por semana"},
          {"id": "raramente", "label": "Raramente"},
          {"id": "nunca", "label": "Nunca"}
        ]
      },
      {
        "id": 6,
        "question": "Como você avalia seu bem-estar geral?",
        "type": "multiple_choice",
        "options": [
          {"id": "excelente", "label": "Excelente"},
          {"id": "bom", "label": "Bom"},
          {"id": "regular", "label": "Regular"},
          {"id": "ruim", "label": "Ruim"}
        ]
      }
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-bem-estar';

-- Quiz de Perfil Nutricional
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Quantas refeições você faz por dia?",
        "type": "multiple_choice",
        "options": [
          {"id": "1_2", "label": "1-2 refeições"},
          {"id": "3", "label": "3 refeições"},
          {"id": "4_5", "label": "4-5 refeições"},
          {"id": "6_mais", "label": "6 ou mais refeições"}
        ]
      },
      {
        "id": 2,
        "question": "Qual é sua principal fonte de proteína?",
        "type": "multiple_choice",
        "options": [
          {"id": "carne", "label": "Carnes"},
          {"id": "peixe", "label": "Peixes"},
          {"id": "ovos", "label": "Ovos"},
          {"id": "vegetal", "label": "Fontes vegetais"}
        ]
      },
      {
        "id": 3,
        "question": "Quantos litros de água você bebe por dia?",
        "type": "multiple_choice",
        "options": [
          {"id": "menos_1", "label": "Menos de 1 litro"},
          {"id": "1_2", "label": "1-2 litros"},
          {"id": "2_3", "label": "2-3 litros"},
          {"id": "mais_3", "label": "Mais de 3 litros"}
        ]
      },
      {
        "id": 4,
        "question": "Com que frequência você consome frutas e vegetais?",
        "type": "multiple_choice",
        "options": [
          {"id": "diario", "label": "Diariamente"},
          {"id": "quase_diario", "label": "Quase diariamente"},
          {"id": "algumas_vezes", "label": "Algumas vezes por semana"},
          {"id": "raramente", "label": "Raramente"}
        ]
      },
      {
        "id": 5,
        "question": "Você consome alimentos processados?",
        "type": "multiple_choice",
        "options": [
          {"id": "nunca", "label": "Nunca"},
          {"id": "raramente", "label": "Raramente"},
          {"id": "frequentemente", "label": "Frequentemente"},
          {"id": "diariamente", "label": "Diariamente"}
        ]
      },
      {
        "id": 6,
        "question": "Como você se sente em relação à sua alimentação?",
        "type": "multiple_choice",
        "options": [
          {"id": "satisfeito", "label": "Satisfeito"},
          {"id": "confuso", "label": "Confuso"},
          {"id": "insatisfeito", "label": "Insatisfeito"},
          {"id": "preocupado", "label": "Preocupado"}
        ]
      },
      {
        "id": 7,
        "question": "Você já fez acompanhamento nutricional antes?",
        "type": "multiple_choice",
        "options": [
          {"id": "nunca", "label": "Nunca"},
          {"id": "uma_vez", "label": "Uma vez"},
          {"id": "algumas_vezes", "label": "Algumas vezes"},
          {"id": "regularmente", "label": "Regularmente"}
        ]
      }
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-perfil-nutricional';

-- Quiz Detox
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Você sente necessidade de fazer uma desintoxicação?",
        "type": "multiple_choice",
        "options": [
          {"id": "sim_muito", "label": "Sim, muito"},
          {"id": "sim_um_pouco", "label": "Sim, um pouco"},
          {"id": "talvez", "label": "Talvez"},
          {"id": "nao", "label": "Não"}
        ]
      },
      {
        "id": 2,
        "question": "Com que frequência você consome alimentos processados?",
        "type": "multiple_choice",
        "options": [
          {"id": "diariamente", "label": "Diariamente"},
          {"id": "algumas_vezes", "label": "Algumas vezes por semana"},
          {"id": "raramente", "label": "Raramente"},
          {"id": "nunca", "label": "Nunca"}
        ]
      },
      {
        "id": 3,
        "question": "Você consome álcool regularmente?",
        "type": "multiple_choice",
        "options": [
          {"id": "diariamente", "label": "Diariamente"},
          {"id": "semanalmente", "label": "Semanalmente"},
          {"id": "raramente", "label": "Raramente"},
          {"id": "nunca", "label": "Nunca"}
        ]
      },
      {
        "id": 4,
        "question": "Como você se sente após as refeições?",
        "type": "multiple_choice",
        "options": [
          {"id": "leve", "label": "Leve e energizado"},
          {"id": "pesado", "label": "Pesado e cansado"},
          {"id": "incomodo", "label": "Com desconforto"},
          {"id": "normal", "label": "Normal"}
        ]
      },
      {
        "id": 5,
        "question": "Você tem problemas digestivos frequentes?",
        "type": "multiple_choice",
        "options": [
          {"id": "frequentemente", "label": "Frequentemente"},
          {"id": "as_vezes", "label": "Às vezes"},
          {"id": "raramente", "label": "Raramente"},
          {"id": "nunca", "label": "Nunca"}
        ]
      }
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-detox';

-- Quiz Energético
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "quiz",
    "questions": [
      {
        "id": 1,
        "question": "Como você avalia seu nível de energia ao longo do dia?",
        "type": "multiple_choice",
        "options": [
          {"id": "alta", "label": "Alta energia constante"},
          {"id": "moderada", "label": "Energia moderada"},
          {"id": "baixa", "label": "Baixa energia"},
          {"id": "variavel", "label": "Varia muito"}
        ]
      },
      {
        "id": 2,
        "question": "Você sente cansaço após as refeições?",
        "type": "multiple_choice",
        "options": [
          {"id": "sempre", "label": "Sempre"},
          {"id": "frequentemente", "label": "Frequentemente"},
          {"id": "as_vezes", "label": "Às vezes"},
          {"id": "nunca", "label": "Nunca"}
        ]
      },
      {
        "id": 3,
        "question": "Como está a qualidade do seu sono?",
        "type": "multiple_choice",
        "options": [
          {"id": "otima", "label": "Ótima"},
          {"id": "boa", "label": "Boa"},
          {"id": "regular", "label": "Regular"},
          {"id": "ruim", "label": "Ruim"}
        ]
      },
      {
        "id": 4,
        "question": "Você pratica atividade física regularmente?",
        "type": "multiple_choice",
        "options": [
          {"id": "diariamente", "label": "Diariamente"},
          {"id": "semanalmente", "label": "Algumas vezes por semana"},
          {"id": "raramente", "label": "Raramente"},
          {"id": "nunca", "label": "Nunca"}
        ]
      },
      {
        "id": 5,
        "question": "Você consome cafeína para ter energia?",
        "type": "multiple_choice",
        "options": [
          {"id": "muito", "label": "Muito (várias vezes ao dia)"},
          {"id": "moderado", "label": "Moderado (1-2x ao dia)"},
          {"id": "pouco", "label": "Pouco"},
          {"id": "nunca", "label": "Nunca"}
        ]
      },
      {
        "id": 6,
        "question": "Você sente que sua alimentação te dá energia?",
        "type": "multiple_choice",
        "options": [
          {"id": "sempre", "label": "Sempre"},
          {"id": "frequentemente", "label": "Frequentemente"},
          {"id": "as_vezes", "label": "Às vezes"},
          {"id": "nunca", "label": "Nunca"}
        ]
      }
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'quiz-energetico';

-- ============================================
-- 3. ATUALIZAR CONTENT DAS PLANILHAS (7)
-- ============================================

-- Checklist Detox
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "planilha",
    "items": [
      {"id": 1, "item": "Consumo de água adequado (2-3L/dia)"},
      {"id": 2, "item": "Redução de alimentos processados"},
      {"id": 3, "item": "Aumento de frutas e vegetais"},
      {"id": 4, "item": "Redução de açúcar refinado"},
      {"id": 5, "item": "Redução de álcool"},
      {"id": 6, "item": "Aumento de fibras"},
      {"id": 7, "item": "Consumo de chás detox"},
      {"id": 8, "item": "Atividade física regular"},
      {"id": 9, "item": "Sono adequado (7-9h)"},
      {"id": 10, "item": "Redução de estresse"}
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'checklist-detox';

-- Checklist Alimentar
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "planilha",
    "items": [
      {"id": 1, "item": "Faz 3 refeições principais por dia"},
      {"id": 2, "item": "Inclui proteína em todas as refeições"},
      {"id": 3, "item": "Consome frutas diariamente"},
      {"id": 4, "item": "Consome vegetais diariamente"},
      {"id": 5, "item": "Bebe água regularmente"},
      {"id": 6, "item": "Evita alimentos ultraprocessados"},
      {"id": 7, "item": "Mastiga devagar"},
      {"id": 8, "item": "Não pula refeições"},
      {"id": 9, "item": "Planeja refeições com antecedência"},
      {"id": 10, "item": "Lê rótulos dos alimentos"},
      {"id": 11, "item": "Variedade de alimentos"},
      {"id": 12, "item": "Horários regulares de refeição"}
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'checklist-alimentar';

-- Mini E-book Educativo
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "planilha",
    "sections": [
      {"id": 1, "title": "Introdução à Nutrição", "content": "Conceitos básicos de nutrição"},
      {"id": 2, "title": "Macronutrientes", "content": "Proteínas, carboidratos e gorduras"},
      {"id": 3, "title": "Micronutrientes", "content": "Vitaminas e minerais essenciais"},
      {"id": 4, "title": "Hidratação", "content": "Importância da água"},
      {"id": 5, "title": "Planejamento Alimentar", "content": "Como planejar suas refeições"}
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'mini-ebook';

-- Guia Nutracêutico
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "planilha",
    "sections": [
      {"id": 1, "title": "O que são Nutracêuticos", "content": "Definição e benefícios"},
      {"id": 2, "title": "Tipos de Nutracêuticos", "content": "Vitaminas, minerais, probióticos"},
      {"id": 3, "title": "Quando Usar", "content": "Indicações e contraindicações"},
      {"id": 4, "title": "Como Escolher", "content": "Critérios de qualidade"},
      {"id": 5, "title": "Dosagem e Segurança", "content": "Orientações importantes"}
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'guia-nutraceutico';

-- Guia Proteico
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "planilha",
    "sections": [
      {"id": 1, "title": "Importância das Proteínas", "content": "Funções no organismo"},
      {"id": 2, "title": "Fontes de Proteína", "content": "Animal e vegetal"},
      {"id": 3, "title": "Necessidades Diárias", "content": "Quanto você precisa"},
      {"id": 4, "title": "Distribuição ao Longo do Dia", "content": "Como distribuir"},
      {"id": 5, "title": "Receitas Proteicas", "content": "Ideias práticas"}
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'guia-proteico';

-- Tabela Comparativa
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "planilha",
    "sections": [
      {"id": 1, "title": "Comparação de Alimentos", "content": "Valor nutricional"},
      {"id": 2, "title": "Fontes de Proteína", "content": "Comparação proteica"},
      {"id": 3, "title": "Fontes de Carboidratos", "content": "Comparação de carboidratos"},
      {"id": 4, "title": "Fontes de Gorduras", "content": "Comparação de gorduras"},
      {"id": 5, "title": "Densidade Nutricional", "content": "Alimentos mais nutritivos"}
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'tabela-comparativa';

-- Tabela de Substituições
UPDATE templates_nutrition
SET 
  content = '{
    "template_type": "planilha",
    "sections": [
      {"id": 1, "title": "Substituições de Carboidratos", "content": "Alternativas saudáveis"},
      {"id": 2, "title": "Substituições de Proteínas", "content": "Diferentes fontes"},
      {"id": 3, "title": "Substituições de Gorduras", "content": "Gorduras saudáveis"},
      {"id": 4, "title": "Substituições de Açúcar", "content": "Alternativas naturais"},
      {"id": 5, "title": "Substituições de Sal", "content": "Temperos e ervas"}
    ],
    "profession": "nutri"
  }'::jsonb,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug = 'tabela-substituicoes';

-- ============================================
-- 4. ATUALIZAR CONTENT DOS DIAGNÓSTICOS (19)
-- ============================================
-- Content básico estruturado para diagnósticos
-- Perguntas genéricas que podem ser expandidas depois
-- Estrutura JSONB completa para facilitar manutenção

-- Template base para diagnósticos (10 perguntas com estrutura completa)
-- Cada diagnóstico terá a mesma estrutura, mas pode ser personalizado depois
UPDATE templates_nutrition
SET 
  content = jsonb_build_object(
    'template_type', 'quiz',
    'questions', jsonb_build_array(
      jsonb_build_object('id', 1, 'question', 'Pergunta 1', 'type', 'multiple_choice', 'options', jsonb_build_array(
        jsonb_build_object('id', 'op1', 'label', 'Opção 1'),
        jsonb_build_object('id', 'op2', 'label', 'Opção 2'),
        jsonb_build_object('id', 'op3', 'label', 'Opção 3'),
        jsonb_build_object('id', 'op4', 'label', 'Opção 4')
      )),
      jsonb_build_object('id', 2, 'question', 'Pergunta 2', 'type', 'multiple_choice', 'options', jsonb_build_array(
        jsonb_build_object('id', 'op1', 'label', 'Opção 1'),
        jsonb_build_object('id', 'op2', 'label', 'Opção 2'),
        jsonb_build_object('id', 'op3', 'label', 'Opção 3'),
        jsonb_build_object('id', 'op4', 'label', 'Opção 4')
      )),
      jsonb_build_object('id', 3, 'question', 'Pergunta 3', 'type', 'multiple_choice', 'options', jsonb_build_array(
        jsonb_build_object('id', 'op1', 'label', 'Opção 1'),
        jsonb_build_object('id', 'op2', 'label', 'Opção 2'),
        jsonb_build_object('id', 'op3', 'label', 'Opção 3'),
        jsonb_build_object('id', 'op4', 'label', 'Opção 4')
      )),
      jsonb_build_object('id', 4, 'question', 'Pergunta 4', 'type', 'multiple_choice', 'options', jsonb_build_array(
        jsonb_build_object('id', 'op1', 'label', 'Opção 1'),
        jsonb_build_object('id', 'op2', 'label', 'Opção 2'),
        jsonb_build_object('id', 'op3', 'label', 'Opção 3'),
        jsonb_build_object('id', 'op4', 'label', 'Opção 4')
      )),
      jsonb_build_object('id', 5, 'question', 'Pergunta 5', 'type', 'multiple_choice', 'options', jsonb_build_array(
        jsonb_build_object('id', 'op1', 'label', 'Opção 1'),
        jsonb_build_object('id', 'op2', 'label', 'Opção 2'),
        jsonb_build_object('id', 'op3', 'label', 'Opção 3'),
        jsonb_build_object('id', 'op4', 'label', 'Opção 4')
      )),
      jsonb_build_object('id', 6, 'question', 'Pergunta 6', 'type', 'multiple_choice', 'options', jsonb_build_array(
        jsonb_build_object('id', 'op1', 'label', 'Opção 1'),
        jsonb_build_object('id', 'op2', 'label', 'Opção 2'),
        jsonb_build_object('id', 'op3', 'label', 'Opção 3'),
        jsonb_build_object('id', 'op4', 'label', 'Opção 4')
      )),
      jsonb_build_object('id', 7, 'question', 'Pergunta 7', 'type', 'multiple_choice', 'options', jsonb_build_array(
        jsonb_build_object('id', 'op1', 'label', 'Opção 1'),
        jsonb_build_object('id', 'op2', 'label', 'Opção 2'),
        jsonb_build_object('id', 'op3', 'label', 'Opção 3'),
        jsonb_build_object('id', 'op4', 'label', 'Opção 4')
      )),
      jsonb_build_object('id', 8, 'question', 'Pergunta 8', 'type', 'multiple_choice', 'options', jsonb_build_array(
        jsonb_build_object('id', 'op1', 'label', 'Opção 1'),
        jsonb_build_object('id', 'op2', 'label', 'Opção 2'),
        jsonb_build_object('id', 'op3', 'label', 'Opção 3'),
        jsonb_build_object('id', 'op4', 'label', 'Opção 4')
      )),
      jsonb_build_object('id', 9, 'question', 'Pergunta 9', 'type', 'multiple_choice', 'options', jsonb_build_array(
        jsonb_build_object('id', 'op1', 'label', 'Opção 1'),
        jsonb_build_object('id', 'op2', 'label', 'Opção 2'),
        jsonb_build_object('id', 'op3', 'label', 'Opção 3'),
        jsonb_build_object('id', 'op4', 'label', 'Opção 4')
      )),
      jsonb_build_object('id', 10, 'question', 'Pergunta 10', 'type', 'multiple_choice', 'options', jsonb_build_array(
        jsonb_build_object('id', 'op1', 'label', 'Opção 1'),
        jsonb_build_object('id', 'op2', 'label', 'Opção 2'),
        jsonb_build_object('id', 'op3', 'label', 'Opção 3'),
        jsonb_build_object('id', 'op4', 'label', 'Opção 4')
      ))
    ),
    'profession', 'nutri'
  ),
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND type = 'quiz'
  AND slug IN (
    'template-diagnostico-parasitose',
    'diagnostico-eletritos',
    'diagnostico-perfil-metabolico',
    'diagnostico-sintomas-intestinais',
    'avaliacao-sono-energia',
    'teste-retencao-liquidos',
    'avaliacao-fome-emocional',
    'diagnostico-tipo-metabolismo',
    'disciplinado-emocional',
    'nutrido-alimentado',
    'perfil-intestino',
    'avaliacao-sensibilidades',
    'avaliacao-sindrome-metabolica',
    'descoberta-perfil-bem-estar',
    'quiz-tipo-fome',
    'quiz-pedindo-detox',
    'avaliacao-rotina-alimentar',
    'pronto-emagrecer',
    'autoconhecimento-corporal'
  );

-- ============================================
-- 5. VERIFICAR RESULTADO
-- ============================================
SELECT 
  name,
  type,
  slug,
  CASE 
    WHEN content::text LIKE '%"profession": "nutri"%' THEN '✅ Content Nutri específico'
    WHEN content::text LIKE '%template_type%' THEN '✅ Content criado'
    ELSE '⚠️ Content vazio'
  END as status_content
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
ORDER BY type, name;

-- ============================================
-- 6. CONTAR QUANTOS FORAM ATUALIZADOS
-- ============================================
SELECT 
  COUNT(*) as total_templates,
  COUNT(CASE WHEN content::text LIKE '%"profession": "nutri"%' THEN 1 END) as com_content_nutri,
  COUNT(CASE WHEN content::text LIKE '%template_type%' THEN 1 END) as com_content_geral,
  COUNT(CASE WHEN content IS NULL OR content::text = '{}' THEN 1 END) as sem_content
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt';

