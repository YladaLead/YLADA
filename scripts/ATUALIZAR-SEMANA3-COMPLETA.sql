-- =====================================================
-- ATUALIZAR SEMANA 3 COMPLETA (DIAS 15-21)
-- =====================================================
-- Textos melhorados pelo ChatGPT, no mesmo padrão da Semana 1
-- Sem travessões, sem "tração", linguagem simples e didática

-- =====================================================
-- DIA 15: Montando sua Rotina Mínima YLADA (Parte 1)
-- =====================================================
UPDATE journey_days
SET
  title = 'Montando sua Rotina Mínima YLADA (Parte 1)',
  objective = 'Começar a estruturar uma rotina mínima possível para o seu dia. Isso é importante porque rotina reduz improviso e ansiedade.',
  guidance = 'Hoje você vai parar de improvisar um pouco. Rotina mínima não é agenda cheia, é base. Comece pelo essencial, não pelo ideal. O erro comum aqui é querer encaixar tudo. Simples é sustentável.',
  action_type = 'pilar',
  action_id = NULL,
  action_title = 'Pensar quais são as atividades essenciais do seu dia profissional.',
  checklist_items = '[
    "Quais atividades realmente fazem parte do seu trabalho hoje?",
    "O que você faz no dia a dia que não deveria ser prioridade?"
  ]'::jsonb,
  motivational_phrase = 'Rotina mínima é aquilo que você consegue manter.',
  updated_at = NOW()
WHERE day_number = 15;

-- =====================================================
-- DIA 16: Montando sua Rotina Mínima YLADA (Parte 2)
-- =====================================================
UPDATE journey_days
SET
  title = 'Montando sua Rotina Mínima YLADA (Parte 2)',
  objective = 'Ajustar sua rotina para que ela seja mais leve e realista. Isso é importante porque constância vale mais que intensidade.',
  guidance = 'Hoje você vai simplificar. Nem tudo precisa estar na sua rotina diária. Escolha o que faz sentido para este momento. O erro comum é criar uma rotina perfeita no papel. Construa algo possível na prática.',
  action_type = 'pilar',
  action_id = NULL,
  action_title = 'Revisar mentalmente sua rotina e retirar excessos.',
  checklist_items = '[
    "O que você pode tirar da sua rotina sem prejuízo real?",
    "O que você sente que precisa manter todos os dias?"
  ]'::jsonb,
  motivational_phrase = 'Quando a rotina cabe na sua vida, ela funciona.',
  updated_at = NOW()
WHERE day_number = 16;

-- =====================================================
-- DIA 17: Organização de Conversas e Leads
-- =====================================================
UPDATE journey_days
SET
  title = 'Organização de Conversas e Leads',
  objective = 'Entender a importância de organizar conversas e contatos. Isso é importante para não perder oportunidades e gerar desgaste.',
  guidance = 'Hoje você vai perceber que organização é autocuidado. Não é burocracia, é clareza. Quando tudo fica solto, a mente cansa. O erro comum é confiar apenas na memória. Organizar traz leveza.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Observar como você acompanha hoje suas conversas e contatos.',
  checklist_items = '[
    "Você já perdeu contato com alguém interessado?",
    "O que te ajudaria a acompanhar melhor essas conversas?"
  ]'::jsonb,
  motivational_phrase = 'Organizar não é engessar, é facilitar.',
  updated_at = NOW()
WHERE day_number = 17;

-- =====================================================
-- DIA 18: A Rotina da Nutri-Empresária nos Atendimentos
-- =====================================================
UPDATE journey_days
SET
  title = 'A Rotina da Nutri-Empresária nos Atendimentos',
  objective = 'Criar mais segurança e padrão nos atendimentos. Isso é importante porque consistência transmite profissionalismo.',
  guidance = 'Hoje você vai olhar para seus atendimentos com mais intenção. Ter um padrão não tira sua essência. Pelo contrário, traz segurança. O erro comum é improvisar tudo. Estrutura dá confiança.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Pensar em como você costuma conduzir um atendimento do início ao fim.',
  checklist_items = '[
    "O que costuma variar muito nos seus atendimentos hoje?",
    "O que poderia ser mais organizado para te dar segurança?"
  ]'::jsonb,
  motivational_phrase = 'Quando você se sente segura, o cliente sente também.',
  updated_at = NOW()
WHERE day_number = 18;

-- =====================================================
-- DIA 19: Criando seu Painel Diário de Ações
-- =====================================================
UPDATE journey_days
SET
  title = 'Criando seu Painel Diário de Ações',
  objective = 'Perceber a importância de visualizar suas ações do dia. Isso é importante porque clareza gera foco.',
  guidance = 'Hoje você vai entender que controle não é pressão. É consciência. Ver o que precisa ser feito reduz ansiedade. O erro comum é tentar lembrar de tudo. Visual ajuda a agir.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Imaginar como você organiza hoje suas tarefas do dia.',
  checklist_items = '[
    "Você costuma se sentir perdida no meio do dia?",
    "O que te ajudaria a ter mais clareza das suas ações diárias?"
  ]'::jsonb,
  motivational_phrase = 'Clareza no dia traz tranquilidade na mente.',
  updated_at = NOW()
WHERE day_number = 19;

-- =====================================================
-- DIA 20: Revisão Estratégica da Semana
-- =====================================================
UPDATE journey_days
SET
  title = 'Revisão Estratégica da Semana',
  objective = 'Avaliar sua rotina e perceber o que precisa de ajuste. Isso é importante para evoluir sem se cobrar demais.',
  guidance = 'Hoje é dia de olhar com consciência, não com julgamento. Ajustar faz parte do processo. Nada precisa estar perfeito agora. O erro comum é desistir ao primeiro ajuste. Evolução vem com adaptação.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Refletir sobre como foi sua semana de rotina.',
  checklist_items = '[
    "O que funcionou melhor na sua rotina esta semana?",
    "O que te cansou mais do que deveria?"
  ]'::jsonb,
  motivational_phrase = 'Ajustar é sinal de maturidade, não de erro.',
  updated_at = NOW()
WHERE day_number = 20;

-- =====================================================
-- DIA 21: Ritual de Fechamento da Semana 3
-- =====================================================
UPDATE journey_days
SET
  title = 'Ritual de Fechamento da Semana 3',
  objective = 'Consolidar os aprendizados da semana e fortalecer a constância. Isso é importante para sustentar o crescimento.',
  guidance = 'Hoje você vai reconhecer o que construiu. Rotina não nasce pronta, ela se ajusta. Você está aprendendo a se organizar melhor. O erro comum é achar que ainda está "bagunçado demais". Olhe para a evolução.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Reservar alguns minutos para reconhecer sua constância.',
  checklist_items = '[
    "O que mudou na sua organização desde o início da jornada?",
    "O que você quer manter para a próxima semana?"
  ]'::jsonb,
  motivational_phrase = 'Constância não é rigidez. É compromisso com você.',
  updated_at = NOW()
WHERE day_number = 21;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
SELECT 
  day_number,
  title,
  CASE 
    WHEN objective LIKE '% — %' OR objective ILIKE '%tração%' THEN '⚠️ Tem travessão/tração'
    WHEN guidance LIKE '% — %' OR guidance ILIKE '%tração%' THEN '⚠️ Tem travessão/tração'
    ELSE '✅ OK'
  END as status,
  LEFT(objective, 70) as objective_preview
FROM journey_days
WHERE day_number BETWEEN 15 AND 21
ORDER BY day_number;
