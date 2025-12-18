-- =====================================================
-- ATUALIZAR SEMANA 2 COMPLETA (DIAS 8-14)
-- =====================================================
-- Textos melhorados pelo ChatGPT, no mesmo padrão da Semana 1
-- Sem travessões, sem "tração", linguagem simples e didática

-- =====================================================
-- DIA 8: Ativando sua Primeira Ferramenta de Captação
-- =====================================================
UPDATE journey_days
SET
  title = 'Ativando sua Primeira Ferramenta de Captação',
  objective = 'Entender que captação começa com conversa, não com venda. Isso é importante porque ninguém cresce sem abrir portas para novas pessoas.',
  guidance = 'Hoje você vai mudar a forma como enxerga captação. Não é sobre convencer, é sobre convidar. Você não precisa de algo perfeito para começar. O erro comum aqui é esperar "estar pronta". Movimento vem antes da confiança.',
  action_type = 'pilar',
  action_id = NULL,
  action_title = 'Escolher uma forma simples de iniciar conversas (mensagem, story ou indicação).',
  checklist_items = '[
    "O que mais te trava hoje quando pensa em captar pessoas?",
    "Qual forma de convite parece mais confortável para você agora?"
  ]'::jsonb,
  motivational_phrase = 'Captação começa quando você se permite conversar.',
  updated_at = NOW()
WHERE day_number = 8;

-- =====================================================
-- DIA 9: Criando seu Convite da Semana
-- =====================================================
UPDATE journey_days
SET
  title = 'Criando seu Convite da Semana',
  objective = 'Criar uma frase de convite simples e clara para iniciar conversas. Isso é importante porque clareza gera resposta.',
  guidance = 'Hoje você vai criar o seu "convite", que é a frase que você usa para chamar alguém para conversar ou conhecer seu trabalho. Não precisa ser elaborada, precisa ser honesta e fácil de entender. Fale como você falaria com alguém próximo.

**Exemplo prático:** "Quer descobrir como está sua alimentação? Fiz um teste rápido e gratuito pra você."

**Erro comum:** Complicar demais ou usar linguagem técnica. Simples funciona.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Escreva uma frase de convite simples que você se sentiria confortável em usar.',
  checklist_items = '[
    "Como você convidaria alguém para conversar sem se sentir invasiva?",
    "Sua frase soa natural ou forçada?"
  ]'::jsonb,
  motivational_phrase = 'Quando o convite é simples, a conversa flui.',
  updated_at = NOW()
WHERE day_number = 9;

-- =====================================================
-- DIA 10: Distribuição 10-10-10 (Alcance Diário)
-- =====================================================
UPDATE journey_days
SET
  title = 'Distribuição 10-10-10 (Alcance Diário)',
  objective = 'Entender a importância de aparecer todos os dias, mesmo que pouco. Isso é importante porque constância gera visibilidade.',
  guidance = 'Hoje o foco não é quantidade, é presença. Aparecer pouco todos os dias vale mais que aparecer muito uma vez. Não precisa ser perfeito. O erro comum é esperar inspiração. Ação vem antes da motivação.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Refletir sobre como você pode aparecer de forma simples no seu dia.',
  checklist_items = '[
    "O que te impede de aparecer com mais constância hoje?",
    "Qual forma de exposição parece mais leve para você?"
  ]'::jsonb,
  motivational_phrase = 'Constância simples constrói confiança.',
  updated_at = NOW()
WHERE day_number = 10;

-- =====================================================
-- DIA 11: Story de Captação YLADA
-- =====================================================
UPDATE journey_days
SET
  title = 'Story de Captação YLADA',
  objective = 'Perder o medo de aparecer e falar com naturalidade. Isso é importante porque as pessoas se conectam com o real, não com o perfeito.',
  guidance = 'Hoje você vai entender que story não é performance. É presença. Você não precisa ensinar tudo. O erro comum é se comparar com outras profissionais. Seja você.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Observar stories de outras pessoas sem se comparar.',
  checklist_items = '[
    "O que você sente quando pensa em aparecer nos stories?",
    "O que tornaria isso mais leve para você?"
  ]'::jsonb,
  motivational_phrase = 'As pessoas se conectam com quem é de verdade.',
  updated_at = NOW()
WHERE day_number = 11;

-- =====================================================
-- DIA 12: Respondendo Objeções com Segurança
-- =====================================================
UPDATE journey_days
SET
  title = 'Respondendo Objeções com Segurança',
  objective = 'Mudar a forma como você lida com objeções. Isso é importante porque objeção não é rejeição.',
  guidance = 'Hoje você vai olhar para objeções com mais maturidade. Perguntas não são ataques. São sinais de interesse. O erro comum é se defender ou se justificar demais. Respire e escute.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Lembrar de uma objeção que já te deixou insegura.',
  checklist_items = '[
    "Como você costuma reagir quando alguém questiona seu trabalho?",
    "O que poderia mudar para responder com mais tranquilidade?"
  ]'::jsonb,
  motivational_phrase = 'Segurança vem de clareza, não de resposta perfeita.',
  updated_at = NOW()
WHERE day_number = 12;

-- =====================================================
-- DIA 13: Criando sua Lista de Leads Quentes
-- =====================================================
UPDATE journey_days
SET
  title = 'Criando sua Lista de Leads Quentes',
  objective = 'Perceber a importância de organizar quem demonstra interesse. Isso é importante para não perder oportunidades.',
  guidance = 'Hoje você vai entender que organização é cuidado. Não é controle excessivo. Saber quem demonstrou interesse te ajuda a acompanhar melhor. O erro comum é confiar só na memória. Clareza evita desgaste.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Pensar em como você lembra hoje das pessoas interessadas.',
  checklist_items = '[
    "Você costuma perder contato com pessoas interessadas?",
    "O que te ajudaria a organizar isso de forma simples?"
  ]'::jsonb,
  motivational_phrase = 'Organizar é facilitar o caminho.',
  updated_at = NOW()
WHERE day_number = 13;

-- =====================================================
-- DIA 14: Revisão da Semana de Captação
-- =====================================================
UPDATE journey_days
SET
  title = 'Revisão da Semana de Captação',
  objective = 'Reconhecer o movimento que você fez nesta semana. Isso é importante para fortalecer sua confiança.',
  guidance = 'Hoje não é dia de cobrança. É dia de reconhecimento. Mesmo pequenos passos contam. O erro comum é olhar só para o que faltou. Valorize o que mudou.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Reservar alguns minutos para pensar na semana.',
  checklist_items = '[
    "O que você conseguiu fazer que antes parecia difícil?",
    "O que ficou mais claro para você sobre captação?"
  ]'::jsonb,
  motivational_phrase = 'Você está em movimento, e isso muda tudo.',
  updated_at = NOW()
WHERE day_number = 14;

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
WHERE day_number BETWEEN 8 AND 14
ORDER BY day_number;
