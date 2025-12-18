-- =====================================================
-- CORRIGIR SEMANA 1 COMPLETA - DIAS 1 A 7
-- =====================================================
-- Remover menções a "Pilar" e "GSAL" dos textos visíveis
-- Garantir conteúdo único, coerente e sem termos técnicos confusos

-- =====================================================
-- DIA 1: Introdução à Filosofia YLADA
-- =====================================================
UPDATE journey_days
SET
  title = 'Introdução à Filosofia YLADA',
  objective = 'Conhecer os fundamentos do Método YLADA e entender por que pensar como Nutri-Empresária muda seus resultados. Isso é importante porque toda transformação começa pela forma como você enxerga sua profissão.',
  guidance = 'Hoje você vai entrar em contato com a base de tudo. A Filosofia YLADA não é sobre fazer mais, é sobre pensar diferente. Leia com calma e sem cobrança. O erro mais comum aqui é tentar aplicar tudo de uma vez. Hoje, o foco é apenas abrir espaço para novas ideias.',
  action_type = 'pilar',
  action_id = NULL,
  action_title = 'Ler a introdução da Filosofia YLADA com atenção ao que mais chama sua atenção.',
  checklist_items = '[
    "O que mais fez sentido para você na Filosofia YLADA?",
    "Que forma antiga de pensar sobre sua profissão pode estar te limitando hoje?"
  ]'::jsonb,
  motivational_phrase = 'Você não precisa mudar tudo agora. Você só precisa começar a enxergar diferente.',
  updated_at = NOW()
WHERE day_number = 1;

-- =====================================================
-- DIA 2: Identidade & Postura de Nutri-Empresária
-- =====================================================
UPDATE journey_days
SET
  title = 'Identidade & Postura de Nutri-Empresária',
  objective = 'Refletir sobre quem você é hoje como profissional e quem deseja se tornar como Nutri-Empresária. Isso é importante porque sua identidade define suas escolhas e resultados.',
  guidance = 'Hoje você vai olhar para si com mais consciência. Identidade não é sobre fingir ser algo, é sobre assumir uma direção. Observe como você se apresenta e como fala do seu trabalho. O erro comum aqui é tentar copiar outras profissionais. Construa uma identidade que seja verdadeira para você.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Refletir sobre sua identidade profissional e observar sua postura ao longo do dia.',
  checklist_items = '[
    "Como você se enxerga hoje como profissional?",
    "Quais 3 características você quer desenvolver como Nutri-Empresária?",
    "Se pudesse se definir em uma frase, qual seria?"
  ]'::jsonb,
  motivational_phrase = 'Quando sua identidade muda, seus resultados acompanham.',
  updated_at = NOW()
WHERE day_number = 2;

-- =====================================================
-- DIA 3: Criar sua Rotina Mínima YLADA
-- =====================================================
UPDATE journey_days
SET
  title = 'Criar sua Rotina Mínima YLADA',
  objective = 'Entender a importância de uma rotina mínima simples e possível. Isso é importante porque rotina reduz ansiedade e traz clareza.',
  guidance = 'Hoje você vai perceber que rotina não é rigidez. É estrutura para te dar liberdade. Comece pequeno e realista. O erro mais comum é criar uma rotina impossível de manter. Aqui, menos é mais.',
  action_type = 'pilar',
  action_id = NULL,
  action_title = 'Observar seu dia e anotar mentalmente quais horários você realmente tem disponíveis.',
  checklist_items = '[
    "Quais horários do seu dia são realmente possíveis para trabalhar?",
    "O que costuma atrapalhar sua organização hoje?"
  ]'::jsonb,
  motivational_phrase = 'Uma rotina simples e possível vale mais que um plano perfeito.',
  updated_at = NOW()
WHERE day_number = 3;

-- =====================================================
-- DIA 4: Definir Metas e Objetivos Claros
-- =====================================================
UPDATE journey_days
SET
  title = 'Definir Metas e Objetivos Claros',
  objective = 'Refletir sobre o que você deseja melhorar nos próximos 30 dias. Isso é importante porque metas dão direção ao seu esforço diário.',
  guidance = 'Hoje você vai pensar com mais intenção. Metas não são pressão, são orientação. Não tente resolver tudo agora. O erro comum é criar metas vagas ou irreais. Seja honesta com sua realidade atual.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Parar alguns minutos para pensar no que você mais quer melhorar neste momento.',
  checklist_items = '[
    "Qual é a principal área da sua vida profissional que precisa de atenção hoje?",
    "Se você tivesse que escolher uma prioridade para os próximos 30 dias, qual seria?"
  ]'::jsonb,
  motivational_phrase = 'Quem tem direção caminha com mais segurança.',
  updated_at = NOW()
WHERE day_number = 4;

-- =====================================================
-- DIA 5: Organizar seu Ambiente de Trabalho
-- =====================================================
UPDATE journey_days
SET
  title = 'Organizar seu Ambiente de Trabalho',
  objective = 'Perceber como seu ambiente influencia sua produtividade e clareza mental. Isso é importante porque o ambiente impacta diretamente seu foco.',
  guidance = 'Hoje você vai olhar ao redor com mais atenção. Ambiente bagunçado gera mente confusa. Não tente organizar tudo. O erro comum é começar grande demais. Escolha algo simples.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Escolher um pequeno ponto do seu ambiente para observar ou organizar.',
  checklist_items = '[
    "O que no seu ambiente mais te distrai hoje?",
    "Como você se sente quando seu espaço está mais organizado?"
  ]'::jsonb,
  motivational_phrase = 'Quando o ambiente melhora, o trabalho flui melhor.',
  updated_at = NOW()
WHERE day_number = 5;

-- =====================================================
-- DIA 6: Postura Profissional e Comunicação
-- =====================================================
UPDATE journey_days
SET
  title = 'Postura Profissional e Comunicação',
  objective = 'Tomar consciência da forma como você se comunica profissionalmente. Isso é importante porque clareza gera confiança.',
  guidance = 'Hoje você vai observar sua comunicação. Não é sobre falar bonito, é sobre falar com clareza. Perceba como você se posiciona em conversas. O erro comum é se justificar demais ou se diminuir. Comunicação segura é simples.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Observar uma conversa profissional do seu dia com mais atenção.',
  checklist_items = '[
    "Em quais situações você sente insegurança ao se comunicar?",
    "O que poderia mudar para se expressar com mais firmeza?"
  ]'::jsonb,
  motivational_phrase = 'Confiança começa na forma como você se expressa.',
  updated_at = NOW()
WHERE day_number = 6;

-- =====================================================
-- DIA 7: Revisão Semanal e Ajustes
-- =====================================================
UPDATE journey_days
SET
  title = 'Revisão Semanal e Ajustes',
  objective = 'Reconhecer o que mudou em você ao longo da primeira semana. Isso é importante para consolidar aprendizados sem autocrítica.',
  guidance = 'Hoje é dia de olhar para trás com gentileza. Não foque no que faltou, foque no que mudou. Consciência vem antes da evolução. O erro comum é se cobrar demais. Reconheça seu progresso.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Reservar alguns minutos para refletir sobre a semana.',
  checklist_items = '[
    "Qual foi o principal aprendizado desta semana?",
    "O que já mudou na forma como você se enxerga como profissional?"
  ]'::jsonb,
  motivational_phrase = 'Você iniciou uma nova forma de pensar. E isso já é transformação.',
  updated_at = NOW()
WHERE day_number = 7;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
-- Verificar que não há menções a "Pilar" ou "GSAL" nos textos visíveis
SELECT 
  day_number,
  title,
  CASE 
    WHEN objective ILIKE '%pilar%' OR objective ILIKE '%gsal%' THEN '⚠️ Tem Pilar/GSAL'
    WHEN guidance ILIKE '%pilar%' OR guidance ILIKE '%gsal%' THEN '⚠️ Tem Pilar/GSAL'
    WHEN action_title ILIKE '%pilar%' OR action_title ILIKE '%gsal%' THEN '⚠️ Tem Pilar/GSAL'
    WHEN motivational_phrase ILIKE '%pilar%' OR motivational_phrase ILIKE '%gsal%' THEN '⚠️ Tem Pilar/GSAL'
    ELSE '✅ Limpo'
  END as verificacao_textos,
  LEFT(objective, 60) as objective_preview,
  jsonb_array_length(checklist_items) as num_reflexoes
FROM journey_days
WHERE day_number BETWEEN 1 AND 7
ORDER BY day_number;

-- Verificar estrutura dos dias
SELECT 
  day_number,
  title,
  action_type,
  CASE 
    WHEN action_type = 'pilar' THEN 'Mostra conteúdo relacionado'
    WHEN action_type = 'exercicio' THEN 'Apenas reflexão'
    ELSE action_type
  END as tipo_conteudo
FROM journey_days
WHERE day_number BETWEEN 1 AND 7
ORDER BY day_number;

