-- =====================================================
-- CORREÇÃO DE TERMOS TÉCNICOS - DIAS 8-30
-- =====================================================
-- Substituir linguagem de marketing por linguagem simples
-- CTA → Convite
-- Leads → Pessoas Interessadas
-- GSAL → Explicar claramente

-- =====================================================
-- DIA 9: Criando seu Convite da Semana (já corrigido no arquivo)
-- =====================================================
UPDATE journey_days
SET
  title = 'Criando seu Convite da Semana',
  objective = 'Criar uma frase de convite simples e clara para iniciar conversas. Isso é importante porque clareza gera resposta.',
  guidance = 'Hoje você vai criar o seu "convite", que é a frase que você usa para chamar alguém para conversar ou conhecer seu trabalho. Não precisa ser elaborada, precisa ser honesta e fácil de entender. Fale como você falaria com alguém próximo.

**Exemplo prático:** "Quer descobrir como está sua alimentação? Fiz um teste rápido e gratuito pra você."

**Erro comum:** Complicar demais ou usar linguagem técnica. Simples funciona.',
  action_title = 'Escreva uma frase de convite simples que você se sentiria confortável em usar.',
  updated_at = NOW()
WHERE day_number = 9;

-- =====================================================
-- DIA 10: Alcance Diário Simples (explicar o 10-10-10)
-- =====================================================
UPDATE journey_days
SET
  title = 'Alcance Diário Simples',
  objective = 'Entender a importância de aparecer todos os dias, mesmo que pouco. Isso é importante porque constância gera visibilidade.',
  guidance = 'Hoje o foco não é quantidade, é presença. Aparecer pouco todos os dias vale mais que aparecer muito uma vez.

**O Método 10-10-10:**
• **10** pessoas por WhatsApp
• **10** pessoas por Instagram
• **10** pessoas por outros meios

Não precisa ser perfeito, nem todo dia. O objetivo é criar o hábito de aparecer.

**Exemplo prático:** Responder stories de conhecidos, mandar mensagem para alguém que não fala há tempo, postar um story simples.

**Erro comum:** Esperar inspiração ou o "momento certo". Ação vem antes da motivação.',
  action_title = 'Escolha uma forma simples de aparecer para alguém hoje.',
  updated_at = NOW()
WHERE day_number = 10;

-- =====================================================
-- DIA 13: Lista de Pessoas Interessadas (substituir "Leads Quentes")
-- =====================================================
UPDATE journey_days
SET
  title = 'Organizando suas Pessoas Interessadas',
  objective = 'Perceber a importância de organizar quem demonstra interesse no seu trabalho. Isso é importante para não perder oportunidades.',
  guidance = 'Hoje você vai entender que organização é cuidado. "Pessoas interessadas" são aquelas que já demonstraram curiosidade pelo seu trabalho: perguntaram algo, responderam um story, pediram informação. Saber quem são essas pessoas te ajuda a acompanhar melhor.

**Exemplo prático:** Anotar em uma lista simples (papel ou celular) o nome de quem demonstrou interesse essa semana.

**Erro comum:** Confiar só na memória. Clareza evita desgaste e perda de oportunidades.',
  action_title = 'Liste 3 pessoas que demonstraram interesse no seu trabalho recentemente.',
  checklist_items = '[
    "Você costuma perder contato com pessoas que demonstraram interesse?",
    "O que te ajudaria a lembrar dessas pessoas de forma simples?"
  ]'::jsonb,
  motivational_phrase = 'Organizar é cuidar das oportunidades que aparecem.',
  updated_at = NOW()
WHERE day_number = 13;

-- =====================================================
-- DIA 17: Organização de Conversas (substituir "Leads")
-- =====================================================
UPDATE journey_days
SET
  title = 'Organizando suas Conversas e Contatos',
  objective = 'Entender a importância de organizar conversas e pessoas interessadas. Isso é importante para não perder oportunidades e evitar desgaste mental.',
  guidance = 'Hoje você vai perceber que organização é autocuidado. Quando tudo fica solto na cabeça, a mente cansa. Ter um lugar simples para anotar com quem você conversou e o que foi combinado traz leveza.

**Exemplo prático:** Um caderno, uma planilha simples ou as próprias notas do celular. O importante é ter um lugar só pra isso.

**Erro comum:** Confiar apenas na memória ou deixar tudo espalhado em vários lugares.',
  action_title = 'Escolha um lugar simples para organizar suas conversas a partir de hoje.',
  checklist_items = '[
    "Você já perdeu contato com alguém interessado por falta de organização?",
    "O que te ajudaria a acompanhar melhor essas conversas?"
  ]'::jsonb,
  updated_at = NOW()
WHERE day_number = 17;

-- =====================================================
-- DIA 22: Introdução à Gestão de Clientes (explicar GSAL)
-- =====================================================
UPDATE journey_days
SET
  title = 'Introdução à Gestão de Clientes',
  objective = 'Entender como funciona o ciclo de crescimento profissional. Isso é importante porque crescimento precisa de lógica, não de improviso.',
  guidance = 'Hoje você vai conhecer o ciclo de gestão de clientes, que chamamos de GSAL. São 4 etapas simples:

• **Gerar** = criar oportunidades (aparecer, convidar)
• **Servir** = entregar valor (ajudar, orientar)
• **Acompanhar** = manter contato (cuidar de quem demonstrou interesse)
• **Lucrar** = organizar agenda e crescer de forma sustentável

Não é fórmula mágica. É uma forma organizada de pensar.

**Erro comum:** Querer aplicar tudo de uma vez. Hoje, apenas entenda o ciclo.',
  action_title = 'Leia as 4 etapas e pense em qual você já faz naturalmente.',
  checklist_items = '[
    "Qual dessas etapas você já faz bem hoje?",
    "Qual etapa parece mais difícil pra você?"
  ]'::jsonb,
  motivational_phrase = 'Crescer fica mais leve quando existe um caminho claro.',
  updated_at = NOW()
WHERE day_number = 22;

-- =====================================================
-- DIA 23: Gerar Oportunidades (simplificar)
-- =====================================================
UPDATE journey_days
SET
  title = 'Gerando Oportunidades',
  objective = 'Entender a importância de criar oportunidades de forma constante. Isso é importante porque crescimento começa pelo movimento.',
  guidance = 'Hoje vamos focar na primeira etapa: Gerar. Gerar não é vender, é aparecer. É abrir portas. Pequenos movimentos geram grandes oportunidades ao longo do tempo.

**Exemplo prático:** Postar um story, mandar mensagem para alguém, compartilhar uma dica. Tudo isso é "gerar".

**Erro comum:** Só agir quando precisa ou quando está desesperada por clientes. Constância vem antes da urgência.',
  action_title = 'Faça uma ação simples de "gerar" hoje (story, mensagem, dica).',
  checklist_items = '[
    "O que você faz hoje que gera novas oportunidades?",
    "O que poderia ser feito com mais constância?"
  ]'::jsonb,
  updated_at = NOW()
WHERE day_number = 23;

-- =====================================================
-- DIA 24: Servir com Intenção (simplificar)
-- =====================================================
UPDATE journey_days
SET
  title = 'Servindo com Intenção',
  objective = 'Compreender que servir é a base da conexão profissional. Isso é importante porque confiança vem da entrega, não da promessa.',
  guidance = 'Hoje vamos focar na segunda etapa: Servir. Servir não é se doar demais. É entregar valor com intenção. Quando você ajuda de verdade, a conexão acontece naturalmente.

**Exemplo prático:** Responder uma dúvida no direct, dar uma dica útil, explicar algo sem cobrar.

**Erro comum:** Tentar agradar todo mundo ou dar demais sem limite. Foque em servir com clareza e propósito.',
  action_title = 'Ajude alguém hoje sem esperar nada em troca.',
  checklist_items = '[
    "Como você demonstra valor no seu trabalho hoje?",
    "O que poderia ser feito com mais intenção e menos esforço?"
  ]'::jsonb,
  updated_at = NOW()
WHERE day_number = 24;

-- =====================================================
-- DIA 25: Acompanhar com Cuidado (simplificar)
-- =====================================================
UPDATE journey_days
SET
  title = 'Acompanhando com Cuidado',
  objective = 'Entender a importância de manter contato com quem demonstrou interesse. Isso é importante porque interesse sem acompanhamento se perde.',
  guidance = 'Hoje vamos focar na terceira etapa: Acompanhar. Acompanhar não é cobrar, é cuidar. É mostrar que você lembra da pessoa.

**Exemplo prático:** Mandar uma mensagem perguntando como a pessoa está, enviar um conteúdo relevante, retomar uma conversa que parou.

**Erro comum:** Sumir e esperar a pessoa voltar, ou insistir demais a ponto de incomodar. Equilíbrio constrói confiança.',
  action_title = 'Retome contato com alguém que demonstrou interesse mas você não falou mais.',
  checklist_items = '[
    "Você costuma acompanhar ou espera o outro voltar?",
    "O que poderia tornar esse acompanhamento mais natural?"
  ]'::jsonb,
  updated_at = NOW()
WHERE day_number = 25;

-- =====================================================
-- DIA 26: Lucrar com Equilíbrio (simplificar)
-- =====================================================
UPDATE journey_days
SET
  title = 'Crescendo com Equilíbrio',
  objective = 'Entender que crescimento sustentável vem de organização. Isso é importante porque crescer sem estrutura gera desgaste.',
  guidance = 'Hoje vamos focar na quarta etapa: Lucrar. Lucrar não é explorar, é sustentar seu trabalho. Uma agenda organizada protege seu tempo e sua energia.

**Exemplo prático:** Definir quantos atendimentos por semana você consegue fazer bem, ter horários fixos, saber dizer não.

**Erro comum:** Aceitar tudo que aparece e acabar sobrecarregada. Clareza nos limites gera equilíbrio.',
  action_title = 'Pense: quantos atendimentos por semana você consegue fazer bem?',
  checklist_items = '[
    "Sua agenda hoje te ajuda ou te sobrecarrega?",
    "O que precisaria mudar para você crescer com mais equilíbrio?"
  ]'::jsonb,
  updated_at = NOW()
WHERE day_number = 26;

-- =====================================================
-- REFORÇO DA PRESENÇA DA LYA - DIAS ESTRATÉGICOS
-- =====================================================

-- DIA 7: Fim da Semana 1 - Primeiro reforço
UPDATE journey_days
SET
  motivational_phrase = 'Você completou sua primeira semana. A LYA continua com você em cada próximo passo.',
  updated_at = NOW()
WHERE day_number = 7;

-- DIA 14: Fim da Semana 2 - Metade da jornada
UPDATE journey_days
SET
  title = 'Revisão da Semana de Visibilidade',
  motivational_phrase = 'Metade da jornada estruturada concluída. A LYA acompanha cada passo do seu crescimento.',
  updated_at = NOW()
WHERE day_number = 14;

-- DIA 21: Fim da Semana 3 - Preparação para transição
UPDATE journey_days
SET
  motivational_phrase = 'Você está construindo uma base sólida. Depois dos 30 dias, a LYA segue te guiando.',
  updated_at = NOW()
WHERE day_number = 21;

-- DIA 29: Preparação para Transição (não é fim!)
UPDATE journey_days
SET
  title = 'Preparando a Transição',
  objective = 'Reconhecer o que você construiu e entender que a LYA continua com você. Isso é importante porque os 30 dias são a base, não o fim.',
  guidance = 'Hoje é dia de olhar para trás e reconhecer sua evolução. Você passou por um processo de transformação: construiu mentalidade, rotina e clareza.

**Importante entender:** Os 30 dias estruturados são a **primeira fase**. A partir de agora, a LYA continua como sua mentora, te ajudando nas dúvidas do dia a dia, nos desafios que surgirem e no seu crescimento contínuo.

**Erro comum:** Achar que "acabou" e voltar aos velhos hábitos. A jornada continua, só muda o formato.',
  action_title = 'Reflita sobre o que mudou em você nesses 30 dias.',
  motivational_phrase = 'A fase estruturada termina, mas a LYA permanece com você.',
  updated_at = NOW()
WHERE day_number = 29;

-- DIA 30: Transição para Acompanhamento Contínuo
UPDATE journey_days
SET
  title = 'Início da Nova Fase',
  objective = 'Celebrar a conclusão da fase estruturada e iniciar o acompanhamento contínuo com a LYA. Isso é importante para consolidar a transformação.',
  guidance = 'Parabéns! Você completou os 30 dias estruturados da Jornada YLADA. Isso não é um fim, é uma transição.

**O que você conquistou:**
• Mentalidade de Nutri-Empresária
• Clareza sobre seu posicionamento
• Rotina mínima estruturada
• Visão de crescimento organizado

**O que acontece agora:**
A LYA continua disponível para te orientar. Sempre que tiver dúvidas, desafios ou precisar de direcionamento, ela está aqui. Você construiu a base, agora é hora de crescer com acompanhamento.

**Erro comum:** Abandonar a plataforma achando que "já aprendeu tudo". O valor está no acompanhamento contínuo.',
  action_title = 'Converse com a LYA sobre seus próximos passos.',
  motivational_phrase = 'A jornada estruturada termina aqui. Sua nova fase como Nutri-Empresária começa agora, com a LYA ao seu lado.',
  updated_at = NOW()
WHERE day_number = 30;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
SELECT 
  day_number,
  title,
  motivational_phrase,
  CASE 
    WHEN title ILIKE '%CTA%' THEN '⚠️ Tem CTA'
    WHEN title ILIKE '%lead%' THEN '⚠️ Tem Lead'
    ELSE '✅ OK'
  END as status
FROM journey_days
WHERE day_number IN (7, 14, 21, 29, 30)
ORDER BY day_number;
