-- ============================================
-- SEED FASE 2 - RITMO (Dias 8 a 14)
-- Sistema NOEL Wellness
-- ============================================
-- 
-- Fase 2: Transforma de "iniciante" para "em andamento"
-- Foco: Microtarefas simples, consistentes, volume leve de contatos
-- Tom: Mark Hughes + Jim Rohn + Eric Worre (intensidade moderada)
-- ============================================

BEGIN;

INSERT INTO wellness_planos_dias (
  dia,
  fase,
  titulo,
  foco,
  microtarefas,
  scripts_sugeridos,
  notificacoes_do_dia,
  mensagem_noel
) VALUES
  (
    8,
    2,
    'Ajuste de Marcha',
    'Organizar ritmo e reforçar consistência',
    '["Ritual 2: 2 contatos leves", "Enviar 1 convite leve usando script", "Responder 1 follow-up pendente", "Organizar lista de contatos (5 nomes)", "Ritual 5: 5 ações", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial"]'::jsonb,
    '["ritual_manha", "microtarefa_lembrete"]'::jsonb,
    'Vamos ajustar a marcha: pequenos passos, todos os dias, geram mudanças grandes. Só continue.'
  ),
  (
    9,
    2,
    'Movimento Gera Clareza',
    'Vencer inércia e criar momentum leve',
    '["Ritual 2: 2 contatos", "Mandar 1 mensagem de curiosidade", "Convidar 1 pessoa para conhecer as bebidas", "Registrar progresso na plataforma", "Ritual 5: 5 ações", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto"]'::jsonb,
    '["ritual_manha", "motivacional_dia"]'::jsonb,
    'O simples feito hoje abre portas que você nem imagina. Só faça a próxima ação.'
  ),
  (
    10,
    2,
    'Ação Duplicável',
    'Aprender a repetir ações que funcionam',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Fazer 1 convite leve", "Responder 1 interessado", "Oferecer 1 degustação ou amostra", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'O que você faz hoje, sua equipe fará amanhã. Simples, duplicável e constante.'
  ),
  (
    11,
    2,
    'Consistência no Baixo Volume',
    'Manter ritmo mesmo quando o dia é corrido',
    '["Ritual 2: 2 contatos", "Responder 1 follow-up", "Revisar scripts de vendas", "Adicionar 3 novos nomes na lista de contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_24h", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "microtarefa_lembrete"]'::jsonb,
    'Não é sobre correr. É sobre não parar. Hoje é dia de continuidade.'
  ),
  (
    12,
    2,
    'Construindo Confiança',
    'Criar relacionamento antes da venda',
    '["Ritual 2: 2 contatos", "1 mensagem de cuidado (não venda)", "Enviar 1 conteúdo útil (água, proteína, bem-estar)", "1 convite suave baseado em comportamento", "Ritual 5: 5 ações", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_followup_followup_pos_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Quando você serve primeiro, o negócio cresce naturalmente. Liderança começa pelo cuidado.'
  ),
  (
    13,
    2,
    'Elevação de Energia',
    'Criar vibração produtiva no dia',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Revisar metas do mês", "Convidar 1 pessoa com energia alta", "Registrar sentimentos do dia", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "frase_motivacional_manha"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'A energia que você coloca no negócio é a energia que volta. Hoje é dia de vibrar alto.'
  ),
  (
    14,
    2,
    'Fechamento da Semana 2',
    'Criar visão de continuidade',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Revisar resultados da semana", "Anotar aprendizados", "Organizar plano da próxima fase"]'::jsonb,
    '["frase_motivacional_consistencia"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "conquista"]'::jsonb,
    'Você está construindo algo. Semana após semana, sua confiança aumenta. Continue.'
  );

COMMIT;

-- ============================================
-- OBSERVAÇÕES:
-- 
-- - Todos os dias incluem Ritual 2-5-10
-- - Scripts sugeridos usam slugs da base de conhecimento
-- - Notificações seguem padrão estabelecido
-- - Mensagens NOEL no estilo aprovado (Mark Hughes + Jim Rohn + Eric Worre)
-- - Intensidade moderada mantida
-- ============================================

