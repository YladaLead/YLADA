-- ============================================
-- SEED FASE 1 - FUNDAÇÃO (Dias 1 a 7)
-- Sistema NOEL Wellness
-- ============================================
-- 
-- Fase 1: Criar ritmo, disciplina e identidade de consultor
-- Foco: Criar clareza, visão e compromisso
-- Tom: Mark Hughes + Jim Rohn + Eric Worre (intensidade moderada leve)
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
    1,
    1,
    'Início da Jornada',
    'Criar clareza, visão e compromisso',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Definir objetivo financeiro", "Enviar 1 convite leve", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite"]'::jsonb,
    'Todo grande resultado começa com uma decisão simples. Hoje você decidiu crescer.'
  ),
  (
    2,
    1,
    'Criando Movimento',
    'Dar os primeiros passos estruturados',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Revisar objetivo financeiro", "Enviar 1 oferta leve de bebida", "Atualizar pipeline", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'O movimento de hoje cria os resultados de amanhã. Continue leve, mas constante.'
  ),
  (
    3,
    1,
    'Relacionamento é Tudo',
    'Iniciar construção da rede com naturalidade',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 mensagem de cuidado", "Reativar 1 contato antigo", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_24h", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Pessoas compram confiança antes de comprar produtos. Conecte com verdade.'
  ),
  (
    4,
    1,
    'Primeira Oferta Direta',
    'Perder o medo de oferecer',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 oferta simples", "Fazer 1 follow-up leve", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'Você não vende produtos — você oferece soluções. Vá com leveza.'
  ),
  (
    5,
    1,
    'Construindo Consistência',
    'Estabelecer hábito duplicável',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Rever lista de contatos", "Enviar 1 convite leve", "Atualizar interesses", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_followup_followup_24h"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Consistência é fazer o simples todo dia. Você está construindo seu ritmo.'
  ),
  (
    6,
    1,
    'Reforço de Pipeline',
    'Aumentar o número de oportunidades reais',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Adicionar 2 novos contatos à lista", "Enviar 1 follow-up morno", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_pos_venda", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Quanto mais pessoas você alcança, mais oportunidades surgem. Expanda com leveza.'
  ),
  (
    7,
    1,
    'Fechamento da Primeira Semana',
    'Refletir, ajustar e fortalecer confiança',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Revisar os acertos da semana", "Celebrar 3 pequenas vitórias", "Selecionar 3 prioridades para a semana seguinte"]'::jsonb,
    '["instrucao_aumentar_pv", "frase_motivacional_consistencia"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "conquista"]'::jsonb,
    'Você completou sua primeira semana — poucos chegam até aqui. Orgulho é a palavra certa.'
  );

COMMIT;

-- ============================================
-- OBSERVAÇÕES:
-- 
-- - Todos os dias incluem Ritual 2-5-10
-- - Scripts sugeridos usam slugs da base de conhecimento
-- - Notificações seguem padrão estabelecido
-- - Mensagens NOEL no estilo aprovado (Mark Hughes + Jim Rohn + Eric Worre)
-- - Intensidade moderada leve mantida (início da jornada)
-- - Foco em criar ritmo, disciplina e identidade de consultor
-- ============================================

