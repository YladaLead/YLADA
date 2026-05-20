-- =====================================================
-- ATUALIZAR CHECKLISTS COM PERGUNTAS COMPLETAS E ESCALA DE FREQUÊNCIA
-- Foco: Despertar interesse para procurar distribuidor Herbalife
-- =====================================================

-- 1. CHECKLIST ALIMENTAR
UPDATE templates_nutrition
SET content = '{
  "template_type": "checklist",
  "items": [
    {
      "id": 1,
      "question": "Você consome pelo menos 5 porções de frutas e vegetais por dia?",
      "description": "Recomendação mínima para obter nutrientes essenciais",
      "options": ["Nunca ou quase nunca", "Às vezes (1-2 dias/semana)", "Regularmente (3-4 dias/semana)", "Frequentemente (5-6 dias/semana)", "Sempre (todos os dias)"]
    },
    {
      "id": 2,
      "question": "Você ingere proteína em todas as refeições principais?",
      "description": "Proteína é essencial para saciedade e manutenção muscular",
      "options": ["Nunca", "Raramente (1 refeição/dia)", "Às vezes (2 refeições/dia)", "Frequentemente (3 refeições/dia)", "Sempre (todas as refeições)"]
    },
    {
      "id": 3,
      "question": "Você bebe pelo menos 2 litros de água por dia?",
      "description": "Hidratação adequada é fundamental para todas as funções corporais",
      "options": ["Menos de 1L", "1-1.5L por dia", "1.5-2L por dia", "2-3L por dia", "Mais de 3L por dia"]
    },
    {
      "id": 4,
      "question": "Você evita alimentos ultraprocessados na maioria das refeições?",
      "description": "Alimentos processados têm baixo valor nutricional",
      "options": ["Nunca evito", "Raramente evito", "Às vezes evito", "Frequentemente evito", "Sempre evito"]
    },
    {
      "id": 5,
      "question": "Você consome fibras diariamente (cereais integrais, legumes, vegetais)?",
      "description": "Fibras auxiliam digestão e controle glicêmico",
      "options": ["Nunca ou raramente", "1-2 vezes por semana", "3-4 vezes por semana", "Quase todos os dias", "Todos os dias"]
    },
    {
      "id": 6,
      "question": "Você faz refeições regulares (a cada 3-4 horas)?",
      "description": "Regularidade ajuda a manter metabolismo ativo",
      "options": ["Não, refeições irregulares", "Raramente", "Às vezes", "Frequentemente", "Sim, sempre regulares"]
    },
    {
      "id": 7,
      "question": "Você inclui gorduras saudáveis na alimentação (azeite, abacate, oleaginosas)?",
      "description": "Gorduras saudáveis são essenciais para absorção de vitaminas",
      "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
    },
    {
      "id": 8,
      "question": "Você limita o consumo de açúcar e doces?",
      "description": "Excesso de açúcar impacta energia e saúde metabólica",
      "options": ["Não, consumo muito açúcar", "Raramente limito", "Às vezes limito", "Frequentemente limito", "Sim, consumo muito pouco"]
    },
    {
      "id": 9,
      "question": "Você planeja suas refeições com antecedência?",
      "description": "Planejamento facilita escolhas mais saudáveis",
      "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre planejo"]
    },
    {
      "id": 10,
      "question": "Você mastiga bem os alimentos antes de engolir?",
      "description": "Mastigação adequada melhora digestão e saciedade",
      "options": ["Não, engulo rápido", "Raramente mastigo bem", "Às vezes mastigo bem", "Frequentemente mastigo bem", "Sim, sempre mastigo bem"]
    },
    {
      "id": 11,
      "question": "Você consome alimentos ricos em ferro regularmente?",
      "description": "Ferro é essencial para energia e saúde sanguínea",
      "options": ["Nunca ou raramente", "1-2 vezes por semana", "3-4 vezes por semana", "Quase todos os dias", "Todos os dias"]
    },
    {
      "id": 12,
      "question": "Você se sente satisfeito após as refeições principais?",
      "description": "Saciedade adequada evita excessos e petiscos desnecessários",
      "options": ["Nunca, sempre com fome", "Raramente", "Às vezes", "Frequentemente", "Sempre satisfeito"]
    }
  ],
  "scoring": {
    "ranges": [
      {
        "min": 0,
        "max": 24,
        "result": "Alimentação Deficiente",
        "description": "Sua alimentação precisa de correção para melhorar saúde"
      },
      {
        "min": 25,
        "max": 40,
        "result": "Alimentação Moderada",
        "description": "Sua alimentação está moderada, mas pode ser otimizada"
      },
      {
        "min": 41,
        "max": 60,
        "result": "Alimentação Equilibrada",
        "description": "Sua alimentação está equilibrada, mantenha o padrão"
      }
    ]
  }
}'::jsonb,
updated_at = NOW()
WHERE name = 'Checklist Alimentar' 
  AND type = 'planilha' 
  AND language = 'pt' 
  AND profession = 'wellness';

-- 2. CHECKLIST DETOX
UPDATE templates_nutrition
SET content = '{
  "template_type": "checklist",
  "items": [
    {
      "id": 1,
      "question": "Você se sente cansado mesmo após dormir bem?",
      "description": "Cansaço persistente pode indicar sobrecarga tóxica",
      "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
    },
    {
      "id": 2,
      "question": "Você tem dificuldade para perder peso mesmo com dieta?",
      "description": "Metabolismo pode estar comprometido por toxinas",
      "options": ["Não tenho dificuldade", "Raramente", "Às vezes", "Frequentemente", "Sempre tenho dificuldade"]
    },
    {
      "id": 3,
      "question": "Você sente inchaço ou retenção de líquidos frequente?",
      "description": "Inchaço pode ser sinal de sistema de eliminação sobrecarregado",
      "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
    },
    {
      "id": 4,
      "question": "Você tem problemas digestivos frequentes (constipação, gases)?",
      "description": "Digestão comprometida pode indicar toxinas no trato digestivo",
      "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
    },
    {
      "id": 5,
      "question": "Você consome muitos alimentos processados ou fast food?",
      "description": "Alimentos processados têm aditivos e conservantes que sobrecarregam o organismo",
      "options": ["Nunca ou raramente", "1-2 vezes por semana", "3-4 vezes por semana", "Quase todos os dias", "Todos os dias"]
    },
    {
      "id": 6,
      "question": "Você vive em área urbana ou tem alta exposição a poluição?",
      "description": "Poluição ambiental aumenta carga tóxica no organismo",
      "options": ["Não, área rural/natureza", "Baixa exposição", "Exposição moderada", "Alta exposição", "Muito alta exposição"]
    },
    {
      "id": 7,
      "question": "Você tem dores de cabeça ou enxaquecas frequentes?",
      "description": "Dores de cabeça podem estar relacionadas a toxinas no sistema",
      "options": ["Nunca", "Raramente (1x/mês)", "Às vezes (2-3x/mês)", "Frequentemente (1x/semana)", "Muito frequente (várias vezes/semana)"]
    },
    {
      "id": 8,
      "question": "Você tem dificuldade para manter foco e clareza mental?",
      "description": "Neblina mental pode ser resultado de sobrecarga tóxica",
      "options": ["Não, foco excelente", "Raramente", "Às vezes", "Frequentemente", "Sempre, mente nebulosa"]
    },
    {
      "id": 9,
      "question": "Você tem problemas de pele (acne, erupções, ressecamento)?",
      "description": "Pele é um órgão de eliminação - problemas podem indicar sobrecarga",
      "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
    },
    {
      "id": 10,
      "question": "Você consome pouco de alimentos antioxidantes (vegetais verdes, frutas)?",
      "description": "Antioxidantes ajudam a neutralizar toxinas no organismo",
      "options": ["Consumo muito pouco", "Consumo pouco", "Consumo moderado", "Consumo bastante", "Consumo muito"]
    }
  ],
  "scoring": {
    "ranges": [
      {
        "min": 0,
        "max": 15,
        "result": "Baixa Toxicidade",
        "description": "Baixa carga tóxica mantendo boa saúde"
      },
      {
        "min": 16,
        "max": 30,
        "result": "Toxicidade Moderada",
        "description": "Sinais de acúmulo tóxico moderado que precisam de intervenção"
      },
      {
        "min": 31,
        "max": 50,
        "result": "Alta Toxicidade",
        "description": "Alta carga tóxica que precisa de intervenção urgente"
      }
    ]
  }
}'::jsonb,
updated_at = NOW()
WHERE name = 'Checklist Detox' 
  AND type = 'planilha' 
  AND language = 'pt' 
  AND profession = 'wellness';

-- Verificar atualizações
SELECT 
  name,
  type,
  content->>'template_type' as tipo_template,
  jsonb_array_length(content->'items') as total_itens,
  content->'items'->0->'options' as exemplo_opcoes
FROM templates_nutrition
WHERE name IN ('Checklist Alimentar', 'Checklist Detox')
  AND type = 'planilha'
  AND language = 'pt'
  AND profession = 'wellness';
