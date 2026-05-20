-- =====================================================
-- ATUALIZAR DESAFIO 21 DIAS COM PERGUNTAS ESTRATÉGICAS
-- Foco: Provocar interesse em participar do desafio com profissional especializado
-- =====================================================

UPDATE templates_nutrition
SET content = '{
  "template_type": "challenge",
  "items": [
    {
      "id": 1,
      "question": "Qual é seu principal objetivo nos próximos 21 dias?",
      "description": "Identifique o que mais motiva você",
      "options": ["Emagrecer e perder gordura", "Ganhar mais energia e disposição", "Melhorar saúde e bem-estar geral", "Criar hábitos saudáveis duradouros", "Transformação completa de vida"]
    },
    {
      "id": 2,
      "question": "O que te impede de alcançar seus objetivos hoje?",
      "description": "Entenda os principais obstáculos",
      "options": ["Falta de tempo e organização", "Falta de conhecimento sobre nutrição", "Falta de motivação e disciplina", "Não tenho um plano estruturado", "Já tentei antes e não consegui"]
    },
    {
      "id": 3,
      "question": "Você já tentou fazer mudanças sozinho antes?",
      "description": "Identifique seu nível de experiência",
      "options": ["Nunca tentei de forma séria", "Tentei algumas vezes sem sucesso", "Tentei e consegui parcialmente", "Tentei mas desisti rápido", "Sempre faço sozinho mas quero algo melhor"]
    },
    {
      "id": 4,
      "question": "Quanto tempo por dia você pode dedicar ao seu bem-estar?",
      "description": "Ajuste o desafio à sua rotina",
      "options": ["Menos de 15 minutos", "15-30 minutos", "30-60 minutos", "1-2 horas", "Mais de 2 horas"]
    },
    {
      "id": 5,
      "question": "O que seria mais importante para você ter sucesso?",
      "description": "Identifique suas necessidades",
      "options": ["Um plano claro e estruturado", "Acompanhamento e suporte", "Produtos que facilitem o processo", "Educação sobre nutrição", "Uma comunidade que me motive"]
    },
    {
      "id": 6,
      "question": "Como você se sente sobre sua saúde atual?",
      "description": "Avalie seu estado atual",
      "options": ["Muito insatisfeito, preciso mudar", "Insatisfeito, mas não sei por onde começar", "Mais ou menos, pode melhorar", "Satisfeito, mas quero otimizar", "Muito satisfeito, quero manter"]
    },
    {
      "id": 7,
      "question": "Você está disposto a investir em sua transformação?",
      "description": "Entenda seu nível de comprometimento",
      "options": ["Sim, estou muito comprometido", "Sim, mas preciso ver resultados primeiro", "Talvez, depende do investimento", "Não tenho certeza ainda", "Prefiro algo gratuito"]
    }
  ],
  "scoring": {
    "ranges": [
      {
        "min": 0,
        "max": 14,
        "result": "Pronto para Transformação",
        "description": "Você está pronto para começar sua jornada de 21 dias",
        "motivation": "Sua determinação mostra que você está pronto para uma transformação completa. O Desafio 21 Dias foi criado especialmente para pessoas como você que querem resultados reais."
      },
      {
        "min": 15,
        "max": 21,
        "result": "Alta Motivação para Mudança",
        "description": "Você tem alta motivação e está pronto para o desafio",
        "motivation": "Sua motivação é evidente! O Desafio 21 Dias vai te dar a estrutura e o suporte que você precisa para transformar seus objetivos em realidade."
      },
      {
        "min": 22,
        "max": 28,
        "result": "Perfeito para Desafio Estruturado",
        "description": "Um desafio estruturado é ideal para você",
        "motivation": "Você tem tudo para ter sucesso! O Desafio 21 Dias oferece o acompanhamento personalizado que você precisa para alcançar seus objetivos."
      }
    ]
  }
}'::jsonb,
updated_at = NOW()
WHERE name = 'Desafio 21 Dias' 
  AND type = 'planilha' 
  AND language = 'pt' 
  AND profession = 'wellness';

-- Verificar atualização
SELECT 
  name,
  type,
  content->>'template_type' as tipo_template,
  jsonb_array_length(content->'items') as total_perguntas
FROM templates_nutrition
WHERE name = 'Desafio 21 Dias'
  AND type = 'planilha'
  AND language = 'pt'
  AND profession = 'wellness';

