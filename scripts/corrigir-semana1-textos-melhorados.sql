-- =====================================================
-- CORRIGIR SEMANA 1 COMPLETA - DIAS 1 A 7
-- =====================================================
-- Textos melhorados: versão híbrida (original + ChatGPT)
-- Removido termos em inglês, ajustado Dia 1 para evitar confusão
-- Textos mais claros, práticos e didáticos

-- =====================================================
-- DIA 1: Introdução à Filosofia YLADA
-- =====================================================
UPDATE journey_days
SET
  title = 'Introdução à Filosofia YLADA',
  objective = 'Entender o que muda, na prática, quando você passa a enxergar sua profissão como um negócio e como isso impacta sua renda, sua organização e sua tranquilidade no dia a dia.',
  guidance = 'Hoje você não precisa fazer nada além de entender uma nova forma de pensar. A Filosofia YLADA mostra que resultados melhores não vêm de trabalhar mais horas, mas de trabalhar com mais clareza e estrutura. Exemplo prático: duas nutricionistas atendem o mesmo número de pacientes. Uma vive cansada e instável financeiramente; a outra é organizada, previsível e cresce com segurança. A diferença não é esforço — é mentalidade. Erro comum: tentar aplicar tudo de uma vez ou achar que precisa mudar toda a rotina hoje. Hoje é só compreensão, não execução.',
  action_type = 'pilar',
  action_id = NULL,
  action_title = 'Refletir sobre o que você acabou de ler da Filosofia YLADA e anotar uma frase ou ideia que fez você pensar diferente sobre sua profissão.',
  checklist_items = '[
    "Qual ideia da Filosofia YLADA mais chamou minha atenção hoje?",
    "O que faço hoje como nutricionista que me gera cansaço, mas pouco resultado?"
  ]'::jsonb,
  motivational_phrase = 'Clareza vem antes da mudança, e hoje você começou a construir essa clareza.',
  updated_at = NOW()
WHERE day_number = 1;

-- =====================================================
-- DIA 2: Identidade & Postura de Nutri-Empresária
-- =====================================================
UPDATE journey_days
SET
  title = 'Identidade & Postura de Nutri-Empresária',
  objective = 'Reconhecer como você se posiciona hoje como profissional e decidir, conscientemente, como quer ser vista como Nutri-Empresária.',
  guidance = 'Identidade não é sobre parecer outra pessoa, é sobre assumir uma postura mais clara e segura. Exemplo prático: observe como você se apresenta quando alguém pergunta "o que você faz?". Você fala com segurança ou com dúvida? Simplifica ou se justifica demais? Erro comum: tentar copiar a postura de outras nutricionistas da internet. O foco aqui é alinhar sua comunicação com quem você realmente é, só que de forma mais profissional.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Escrever em uma frase simples: "Hoje eu me vejo como uma nutricionista que __________."',
  checklist_items = '[
    "Hoje, eu me apresento com segurança quando falo do meu trabalho?",
    "Quais 3 qualidades profissionais eu quero fortalecer nos próximos meses?",
    "O que eu faço hoje que não combina mais com a profissional que quero ser?"
  ]'::jsonb,
  motivational_phrase = 'Quando você muda a forma como se enxerga, o mercado responde diferente.',
  updated_at = NOW()
WHERE day_number = 2;

-- =====================================================
-- DIA 3: Criar sua Rotina Mínima YLADA
-- =====================================================
UPDATE journey_days
SET
  title = 'Criar sua Rotina Mínima YLADA',
  objective = 'Identificar horários reais do seu dia para criar uma rotina mínima que seja possível de manter, sem sobrecarga.',
  guidance = 'Rotina mínima não é agenda cheia. É o mínimo necessário para não viver apagando incêndios. Exemplo prático: talvez você só tenha 20 minutos por dia livres, e está tudo bem. Esses 20 minutos bem usados valem mais do que planos irreais. Erro comum: montar uma rotina perfeita que dura três dias. Aqui, o foco é o que você consegue repetir toda semana.',
  action_type = 'pilar',
  action_id = NULL,
  action_title = 'Anotar no papel ou no celular: quais horários realmente sobram no seu dia hoje (manhã, tarde ou noite).',
  checklist_items = '[
    "Em quais momentos do dia eu realmente consigo me concentrar?",
    "O que costuma atrapalhar minha organização diária?"
  ]'::jsonb,
  motivational_phrase = 'Constância pequena gera resultados grandes ao longo do tempo.',
  updated_at = NOW()
WHERE day_number = 3;

-- =====================================================
-- DIA 4: Definir Metas e Objetivos Claros
-- =====================================================
UPDATE journey_days
SET
  title = 'Definir Metas e Objetivos Claros',
  objective = 'Escolher uma prioridade profissional clara para os próximos 30 dias, evitando dispersão e frustração.',
  guidance = 'Meta não é cobrança, é direção. Exemplo prático: ao invés de "quero melhorar tudo", escolha algo específico como "organizar meus atendimentos" ou "atrair mais pacientes". Erro comum: definir muitas metas ao mesmo tempo e não avançar em nenhuma. Uma prioridade clara já muda sua forma de agir no dia a dia.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Escrever uma única frase: "Nos próximos 30 dias, minha principal prioridade profissional é __________."',
  checklist_items = '[
    "Qual área da minha carreira mais precisa de atenção agora?",
    "O que, se melhorasse, já facilitaria muito meu dia a dia?"
  ]'::jsonb,
  motivational_phrase = 'Quem sabe para onde vai, economiza energia no caminho.',
  updated_at = NOW()
WHERE day_number = 4;

-- =====================================================
-- DIA 5: Organizar seu Ambiente de Trabalho
-- =====================================================
UPDATE journey_days
SET
  title = 'Organizar seu Ambiente de Trabalho',
  objective = 'Perceber como pequenos ajustes no seu ambiente podem melhorar foco, clareza e produtividade.',
  guidance = 'Ambiente influencia mais do que parece. Exemplo prático: uma mesa com papéis acumulados ou um celular cheio de notificações aumenta a sensação de confusão. Um ajuste simples já traz alívio mental. Erro comum: tentar organizar tudo de uma vez e desistir. Hoje é só um ponto pequeno.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Escolher um único espaço (mesa, celular ou computador) e organizar apenas esse ponto.',
  checklist_items = '[
    "O que mais me distrai no meu ambiente hoje?",
    "Como me sinto quando meu espaço está mais organizado?"
  ]'::jsonb,
  motivational_phrase = 'Quando o ambiente fica mais leve, o trabalho flui melhor.',
  updated_at = NOW()
WHERE day_number = 5;

-- =====================================================
-- DIA 6: Postura Profissional e Comunicação
-- =====================================================
UPDATE journey_days
SET
  title = 'Postura Profissional e Comunicação',
  objective = 'Tomar consciência da forma como você se comunica e identificar ajustes simples para transmitir mais segurança.',
  guidance = 'Comunicação profissional não é falar difícil, é falar com clareza. Exemplo prático: perceba se você se justifica demais ao falar de preços, agenda ou decisões. Comunicação segura é direta e respeitosa. Erro comum: se diminuir para evitar conflito. Clareza evita ruídos e gera confiança.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Observar uma conversa profissional do dia e anotar mentalmente onde você poderia ter sido mais clara ou firme.',
  checklist_items = '[
    "Em quais situações eu fico insegura ao me comunicar?",
    "O que eu poderia simplificar na forma como explico meu trabalho?"
  ]'::jsonb,
  motivational_phrase = 'Postura segura começa com comunicação clara.',
  updated_at = NOW()
WHERE day_number = 6;

-- =====================================================
-- DIA 7: Revisão Semanal e Ajustes
-- =====================================================
UPDATE journey_days
SET
  title = 'Revisão Semanal e Ajustes',
  objective = 'Reconhecer mudanças internas da primeira semana e identificar aprendizados sem autocrítica.',
  guidance = 'Evolução começa com consciência. Exemplo prático: talvez você não tenha feito tudo perfeitamente, mas já está pensando diferente, e isso é avanço real. Erro comum: focar apenas no que não foi feito. Hoje o foco é perceber o que já mudou.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Reservar 5 minutos para responder às perguntas da revisão com calma.',
  checklist_items = '[
    "Qual foi o maior aprendizado desta semana?",
    "O que já mudou na forma como eu penso minha profissão?"
  ]'::jsonb,
  motivational_phrase = 'Você não começou uma tarefa. Você iniciou uma nova fase profissional.',
  updated_at = NOW()
WHERE day_number = 7;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
-- Verificar que não há menções a "Pilar" ou "GSAL" nos textos visíveis
-- E verificar que não há "tração" incorretamente (deve ser travessão — ou vírgula)
SELECT 
  day_number,
  title,
  CASE 
    WHEN objective ILIKE '%pilar%' OR objective ILIKE '%gsal%' THEN '⚠️ Tem Pilar/GSAL'
    WHEN guidance ILIKE '%pilar%' OR guidance ILIKE '%gsal%' THEN '⚠️ Tem Pilar/GSAL'
    WHEN action_title ILIKE '%pilar%' OR action_title ILIKE '%gsal%' THEN '⚠️ Tem Pilar/GSAL'
    WHEN motivational_phrase ILIKE '%pilar%' OR motivational_phrase ILIKE '%gsal%' THEN '⚠️ Tem Pilar/GSAL'
    WHEN objective ILIKE '%negócio tração%' OR objective ILIKE '%tração e%' THEN '⚠️ Tem "tração" incorreto'
    WHEN guidance ILIKE '%negócio tração%' OR guidance ILIKE '%tração e%' THEN '⚠️ Tem "tração" incorreto'
    WHEN action_title ILIKE '%negócio tração%' OR action_title ILIKE '%tração e%' THEN '⚠️ Tem "tração" incorreto'
    WHEN motivational_phrase ILIKE '%negócio tração%' OR motivational_phrase ILIKE '%tração e%' THEN '⚠️ Tem "tração" incorreto'
    ELSE '✅ Limpo'
  END as verificacao_textos,
  LEFT(objective, 70) as objective_preview,
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
