-- ============================================
-- CRIAR TEMPLATE BASE "avaliacao-emagrecimento-consciente" PARA WELLNESS
-- Quiz ético para pessoas usando/considerando inibidores de apetite (caneta/comprimido).
-- ============================================

-- 1) Inserir template caso não exista
INSERT INTO templates_nutrition (
  name,
  type,
  language,
  objective,
  title,
  description,
  profession,
  is_active,
  slug,
  content,
  created_at,
  updated_at
)
SELECT
  'Avaliação de Emagrecimento Consciente',
  'quiz',
  'pt',
  'Avaliar sinais e orientar suporte nutricional com segurança',
  'Avaliação de Emagrecimento Consciente',
  'Um quiz rápido para identificar riscos e orientar emagrecimento com segurança (com suporte nutricional).',
  'wellness',
  true,
  'avaliacao-emagrecimento-consciente',
  '{}'::jsonb,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1
  FROM templates_nutrition
  WHERE slug = 'avaliacao-emagrecimento-consciente'
    AND profession = 'wellness'
    AND language = 'pt'
);

-- 2) Garantir content completo (atualiza mesmo se já existia)
UPDATE templates_nutrition
SET
  name = 'Avaliação de Emagrecimento Consciente',
  type = 'quiz',
  objective = 'Avaliar sinais e orientar suporte nutricional com segurança',
  title = 'Avaliação de Emagrecimento Consciente',
  description = 'Um quiz rápido para identificar riscos e orientar emagrecimento com segurança (com suporte nutricional).',
  is_active = true,
  content = '{
    "template_type": "quiz",
    "profession": "wellness",
    "cta_config": {
      "mensagem": "Se você quiser, eu te ajudo a montar um plano de apoio (alimentação + suplementação) com segurança.",
      "botao": "Quero entender o que meu corpo precisa",
      "tipo": "whatsapp"
    },
    "questions": [
      {
        "id": 1,
        "question": "Qual dessas situações descreve melhor você hoje?",
        "type": "multiple_choice",
        "options": [
          {"id": "caneta", "label": "Uso medicação injetável (ex.: caneta)"},
          {"id": "inibidor", "label": "Uso comprimidos/remédios para reduzir apetite"},
          {"id": "parei", "label": "Já usei e parei"},
          {"id": "nao-usei", "label": "Nunca usei, mas penso em usar"}
        ]
      },
      {
        "id": 2,
        "question": "Há quanto tempo você está nessa fase?",
        "type": "multiple_choice",
        "options": [
          {"id": "lt_1m", "label": "Menos de 1 mês"},
          {"id": "1a3m", "label": "Entre 1 e 3 meses"},
          {"id": "gt_3m", "label": "Mais de 3 meses"},
          {"id": "nao-comecei", "label": "Ainda não comecei"}
        ]
      },
      {
        "id": 3,
        "question": "Seu emagrecimento recente foi:",
        "type": "multiple_choice",
        "options": [
          {"id": "muito-rapido", "label": "Muito rápido"},
          {"id": "gradual", "label": "Gradual"},
          {"id": "oscilante", "label": "Oscilante"},
          {"id": "ainda-nao", "label": "Ainda não emagreci"}
        ]
      },
      {
        "id": 4,
        "question": "Hoje, sua alimentação diária está mais próxima de:",
        "type": "multiple_choice",
        "options": [
          {"id": "normal-menos", "label": "Como normalmente, só menos quantidade"},
          {"id": "pula-refeicao", "label": "Pulo refeições por falta de fome"},
          {"id": "pouco-sem-rotina", "label": "Como pouco e sem rotina"},
          {"id": "nao-sei", "label": "Não sei dizer"}
        ]
      },
      {
        "id": 5,
        "question": "Você percebeu algum desses sinais? (pode marcar mais de um)",
        "type": "multi_select",
        "options": [
          {"id": "cansaco", "label": "Cansaço / fraqueza"},
          {"id": "queda-cabelo", "label": "Queda de cabelo"},
          {"id": "intestino-preso", "label": "Intestino preso"},
          {"id": "ansiedade", "label": "Ansiedade / irritação"},
          {"id": "perda-forca", "label": "Perda de força ou músculo"},
          {"id": "nausea", "label": "Náuseas / refluxo frequentes"},
          {"id": "tontura", "label": "Tontura"},
          {"id": "nenhum", "label": "Nenhum desses"}
        ]
      },
      {
        "id": 6,
        "question": "Sua energia hoje é:",
        "type": "multiple_choice",
        "options": [
          {"id": "melhor", "label": "Melhor que antes"},
          {"id": "igual", "label": "Igual"},
          {"id": "pior", "label": "Pior"},
          {"id": "oscila", "label": "Oscila muito"}
        ]
      },
      {
        "id": 7,
        "question": "Mesmo comendo menos, você sente que seu corpo está bem nutrido?",
        "type": "multiple_choice",
        "options": [
          {"id": "sim", "label": "Sim"},
          {"id": "nao", "label": "Não"},
          {"id": "nao-sei", "label": "Não sei dizer"}
        ]
      },
      {
        "id": 8,
        "question": "Você sabia que emagrecer rápido sem suporte nutricional pode afetar músculo, intestino e metabolismo?",
        "type": "multiple_choice",
        "options": [
          {"id": "sim", "label": "Sim"},
          {"id": "nao", "label": "Não"},
          {"id": "nunca-pensei", "label": "Nunca pensei nisso"}
        ]
      },
      {
        "id": 9,
        "question": "O que você mais busca agora?",
        "type": "multiple_choice",
        "options": [
          {"id": "seguranca", "label": "Emagrecer com segurança"},
          {"id": "evitar-rebote", "label": "Evitar efeito rebote"},
          {"id": "entender", "label": "Entender se estou fazendo certo"},
          {"id": "orientacao", "label": "Ter orientação personalizada"}
        ]
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE slug = 'avaliacao-emagrecimento-consciente'
  AND profession = 'wellness'
  AND language = 'pt';

-- 3) Verificação rápida
SELECT
  id,
  name,
  slug,
  type,
  profession,
  language,
  is_active,
  jsonb_array_length(content->'questions') AS total_perguntas
FROM templates_nutrition
WHERE slug = 'avaliacao-emagrecimento-consciente'
  AND profession = 'wellness'
  AND language = 'pt';

