-- =====================================================
-- ATUALIZAR DESAFIO 7 DIAS COM PERGUNTAS ESTRATÉGICAS
-- Foco: Provocar interesse em participar do desafio com profissional especializado
-- =====================================================

UPDATE templates_nutrition
SET content = '{
  "template_type": "challenge",
  "items": [
    {
      "id": 1,
      "question": "Você precisa de resultados rápidos e visíveis?",
      "description": "Identifique seu nível de urgência",
      "options": ["Sim, preciso ver resultados logo", "Quero resultados mas posso esperar", "Prefiro resultados consistentes e duradouros", "Resultados rápidos me motivam mais", "Preciso ver progresso logo para manter motivação"]
    },
    {
      "id": 2,
      "question": "Quanto tempo você tem disponível para focar no seu bem-estar?",
      "description": "Avalie sua disponibilidade",
      "options": ["Muito pouco tempo, preciso de algo rápido", "Tenho alguns minutos por dia", "Tenho tempo moderado para dedicar", "Tenho bastante tempo disponível", "Posso dedicar o tempo necessário"]
    },
    {
      "id": 3,
      "question": "O que você mais espera conseguir em 7 dias?",
      "description": "Defina suas expectativas",
      "options": ["Ver resultados visíveis rápidos", "Criar hábitos básicos", "Sentir mais energia e disposição", "Começar uma transformação", "Ganhar motivação e confiança"]
    },
    {
      "id": 4,
      "question": "Você prefere um desafio intenso ou progressivo?",
      "description": "Entenda seu estilo",
      "options": ["Intenso, quero desafio completo", "Progressivo, prefiro começar devagar", "Moderado, algo equilibrado", "Depende do suporte que tiver", "Quero o que der mais resultados"]
    },
    {
      "id": 5,
      "question": "O que mais te motivaria a completar um desafio de 7 dias?",
      "description": "Identifique seus motivadores",
      "options": ["Ver resultados rápidos", "Ter acompanhamento diário", "Ter um plano claro e estruturado", "Sentir que estou progredindo", "Saber que tem suporte profissional"]
    },
    {
      "id": 6,
      "question": "Você já tentou mudanças rápidas antes?",
      "description": "Avalie sua experiência",
      "options": ["Nunca tentei", "Tentei mas não consegui manter", "Tentei e funcionou parcialmente", "Tentei mas faltou suporte", "Sempre faço mas quero algo melhor"]
    },
    {
      "id": 7,
      "question": "Você está pronto para começar uma transformação hoje?",
      "description": "Avalie seu nível de prontidão",
      "options": ["Sim, estou muito pronto para começar", "Sim, mas preciso de um plano claro", "Talvez, preciso ver o que envolve", "Preciso pensar melhor", "Não tenho certeza ainda"]
    }
  ],
  "scoring": {
    "ranges": [
      {
        "min": 0,
        "max": 14,
        "result": "Pronto para Resultados Rápidos",
        "description": "Você está pronto para começar sua transformação em 7 dias",
        "motivation": "Sua urgência e motivação mostram que você está pronto para resultados rápidos. O Desafio 7 Dias foi criado especialmente para pessoas como você que querem ver transformações reais em pouco tempo."
      },
      {
        "min": 15,
        "max": 21,
        "result": "Alta Motivação para Transformação Rápida",
        "description": "Você tem alta motivação e está pronto para o desafio de 7 dias",
        "motivation": "Sua motivação é evidente! O Desafio 7 Dias vai te dar a estrutura e o suporte que você precisa para transformar seus objetivos em realidade em apenas uma semana."
      },
      {
        "min": 22,
        "max": 28,
        "result": "Perfeito para Desafio Estruturado de 7 Dias",
        "description": "Um desafio estruturado de 7 dias é ideal para você",
        "motivation": "Você tem tudo para ter sucesso! O Desafio 7 Dias oferece o acompanhamento personalizado que você precisa para alcançar seus objetivos rapidamente."
      }
    ]
  }
}'::jsonb,
updated_at = NOW()
WHERE name = 'Desafio 7 Dias' 
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
WHERE name = 'Desafio 7 Dias'
  AND type = 'planilha'
  AND language = 'pt'
  AND profession = 'wellness';













