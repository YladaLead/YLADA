-- =====================================================
-- ATUALIZAR SEMANA 4 COMPLETA (DIAS 22-30)
-- =====================================================
-- Textos melhorados pelo ChatGPT, no mesmo padrão da Semana 1
-- Sem travessões, sem "tração", linguagem simples e didática

-- =====================================================
-- DIA 22: Introdução ao GSAL (Gerar, Servir, Acompanhar, Lucrar)
-- =====================================================
UPDATE journey_days
SET
  title = 'Introdução ao GSAL (Gerar, Servir, Acompanhar, Lucrar)',
  objective = 'Entender o GSAL como um modelo simples de crescimento profissional. Isso é importante porque crescimento precisa de lógica, não de improviso.',
  guidance = 'Hoje você vai conhecer uma visão mais ampla do seu trabalho. O GSAL não é uma fórmula mágica. É uma forma organizada de pensar o crescimento. O erro comum é tentar aplicar tudo de uma vez. Hoje, apenas compreenda o modelo.',
  action_type = 'pilar',
  action_id = NULL,
  action_title = 'Ler a explicação do GSAL com foco em entender a lógica, não em executar.',
  checklist_items = '[
    "Em qual etapa do GSAL você sente mais dificuldade hoje?",
    "Qual parte parece mais natural para você?"
  ]'::jsonb,
  motivational_phrase = 'Crescer fica mais leve quando existe um caminho claro.',
  updated_at = NOW()
WHERE day_number = 22;

-- =====================================================
-- DIA 23: G de Gerar: Criando Fluxo de Oportunidades
-- =====================================================
UPDATE journey_days
SET
  title = 'G de Gerar: Criando Fluxo de Oportunidades',
  objective = 'Entender a importância de gerar oportunidades de forma constante. Isso é importante porque crescimento começa pelo movimento.',
  guidance = 'Hoje você vai olhar para o "gerar" com mais clareza. Gerar não é insistir, é aparecer. Pequenos movimentos geram grandes oportunidades ao longo do tempo. O erro comum é só agir quando precisa. Constância vem antes da urgência.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Refletir sobre como você gera oportunidades hoje.',
  checklist_items = '[
    "O que você faz hoje que gera novas oportunidades?",
    "O que poderia ser feito com mais constância?"
  ]'::jsonb,
  motivational_phrase = 'Oportunidade nasce do movimento, não da espera.',
  updated_at = NOW()
WHERE day_number = 23;

-- =====================================================
-- DIA 24: S de Servir: Entregando Valor que Conecta
-- =====================================================
UPDATE journey_days
SET
  title = 'S de Servir: Entregando Valor que Conecta',
  objective = 'Compreender o servir como base da conexão profissional. Isso é importante porque confiança vem da entrega, não da promessa.',
  guidance = 'Hoje você vai perceber que servir não é se doar demais. É entregar valor com intenção. Quando você serve bem, a conexão acontece naturalmente. O erro comum é tentar agradar todo mundo. Foque em servir com clareza.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Pensar em como você costuma ajudar antes de vender.',
  checklist_items = '[
    "Como você demonstra valor no seu trabalho hoje?",
    "O que poderia ser feito com mais intenção e menos esforço?"
  ]'::jsonb,
  motivational_phrase = 'Servir bem cria vínculos duradouros.',
  updated_at = NOW()
WHERE day_number = 24;

-- =====================================================
-- DIA 25: A de Acompanhar: Transformando Interesse em Decisão
-- =====================================================
UPDATE journey_days
SET
  title = 'A de Acompanhar: Transformando Interesse em Decisão',
  objective = 'Entender a importância do acompanhamento profissional. Isso é importante porque interesse sem acompanhamento se perde.',
  guidance = 'Hoje você vai enxergar acompanhamento como cuidado. Não é cobrança. É presença. O erro comum é sumir ou insistir demais. Equilíbrio constrói confiança.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Refletir sobre como você acompanha pessoas interessadas hoje.',
  checklist_items = '[
    "Você costuma acompanhar ou espera o outro voltar?",
    "O que poderia tornar esse acompanhamento mais natural?"
  ]'::jsonb,
  motivational_phrase = 'Acompanhar é mostrar que você se importa.',
  updated_at = NOW()
WHERE day_number = 25;

-- =====================================================
-- DIA 26: L de Lucrar: Estruturando Agenda e Crescimento
-- =====================================================
UPDATE journey_days
SET
  title = 'L de Lucrar: Estruturando Agenda e Crescimento',
  objective = 'Entender o lucro como consequência de organização. Isso é importante porque crescer sem estrutura gera desgaste.',
  guidance = 'Hoje você vai tirar o peso da palavra lucro. Lucrar não é explorar, é sustentar. Agenda organizada protege seu tempo e sua energia. O erro comum é aceitar tudo. Clareza gera equilíbrio.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Pensar em como sua agenda impacta seu bem-estar hoje.',
  checklist_items = '[
    "Sua agenda hoje te ajuda ou te sobrecarrega?",
    "O que precisaria mudar para você crescer com mais equilíbrio?"
  ]'::jsonb,
  motivational_phrase = 'Lucro saudável começa com limites claros.',
  updated_at = NOW()
WHERE day_number = 26;

-- =====================================================
-- DIA 27: Checklist Geral de Crescimento YLADA
-- =====================================================
UPDATE journey_days
SET
  title = 'Checklist Geral de Crescimento YLADA',
  objective = 'Consolidar a base construída ao longo da jornada. Isso é importante para reconhecer sua evolução real.',
  guidance = 'Hoje você vai olhar para tudo que construiu. Não para se cobrar, mas para reconhecer. Você não está no mesmo lugar do início. O erro comum é minimizar a própria evolução. Valorize o caminho.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Revisar mentalmente os principais pontos da jornada.',
  checklist_items = '[
    "O que hoje está mais claro para você como profissional?",
    "Qual mudança você mais percebe em si mesma?"
  ]'::jsonb,
  motivational_phrase = 'Reconhecer a evolução fortalece a confiança.',
  updated_at = NOW()
WHERE day_number = 27;

-- =====================================================
-- DIA 28: O Plano de 30 Dias à Frente
-- =====================================================
UPDATE journey_days
SET
  title = 'O Plano de 30 Dias à Frente',
  objective = 'Criar uma visão simples para o próximo ciclo. Isso é importante para manter constância após a jornada.',
  guidance = 'Hoje você vai olhar para frente com mais segurança. Planejar não é engessar. É escolher prioridades. O erro comum é tentar abraçar tudo. Foque no essencial.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Pensar no que você quer manter ativo nos próximos 30 dias.',
  checklist_items = '[
    "Qual hábito você quer manter após a jornada?",
    "Qual será seu foco principal no próximo mês?"
  ]'::jsonb,
  motivational_phrase = 'Clareza hoje gera tranquilidade amanhã.',
  updated_at = NOW()
WHERE day_number = 28;

-- =====================================================
-- DIA 29: Preparação para o Ritual de Conclusão
-- =====================================================
UPDATE journey_days
SET
  title = 'Preparação para o Ritual de Conclusão',
  objective = 'Preparar sua mente para encerrar um ciclo com consciência. Isso é importante para integrar a mudança vivida.',
  guidance = 'Hoje não é sobre fazer. É sobre reconhecer. Você passou por um processo de transformação interna. O erro comum é pular essa etapa. Integração é parte da evolução.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Refletir sobre como você se sente ao concluir a jornada.',
  checklist_items = '[
    "O que mudou na forma como você se vê como nutricionista?",
    "O que você leva dessa jornada para sua vida profissional?"
  ]'::jsonb,
  motivational_phrase = 'Encerrar um ciclo com consciência fortalece o próximo.',
  updated_at = NOW()
WHERE day_number = 29;

-- =====================================================
-- DIA 30: Ritual de Conclusão do Método YLADA
-- =====================================================
UPDATE journey_days
SET
  title = 'Ritual de Conclusão do Método YLADA',
  objective = 'Encerrar a jornada integrando a identidade YLADA. Isso é importante para consolidar a transformação vivida.',
  guidance = 'Hoje você encerra um ciclo importante. Não porque chegou ao fim, mas porque está pronta para continuar. Você construiu base, clareza e visão. O erro comum é achar que "agora começa tudo do zero". Você já é diferente.',
  action_type = 'exercicio',
  action_id = NULL,
  action_title = 'Participar do ritual final com presença e atenção.',
  checklist_items = '[
    "Quem você se tornou ao longo dessa jornada?",
    "O que significa, para você, ser uma Nutri-Empresária hoje?"
  ]'::jsonb,
  motivational_phrase = 'A jornada termina aqui. A sua nova fase começa agora.',
  updated_at = NOW()
WHERE day_number = 30;

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
WHERE day_number BETWEEN 22 AND 30
ORDER BY day_number;
