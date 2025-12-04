-- ============================================
-- SEED FASE 4 - CRESCIMENTO PROGRESSIVO (Dias 71 a 80 - Bloco 5)
-- Sistema NOEL Wellness
-- ============================================
-- 
-- Fase 4: Crescimento progressivo e duplicação
-- Foco: Evolução, produtividade, duplicação, liderança
-- Tom: Mark Hughes + Jim Rohn + Eric Worre (intensidade moderada forte)
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
    71,
    4,
    'Ajuste de Rota',
    'Refinar o que funciona e eliminar o que atrapalha',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Revisar resultados da semana passada", "Selecionar 3 ações para repetir", "Parar 1 ação que não funciona", "Ritual 10: Revisar dia"]'::jsonb,
    '["instrucao_aumentar_pv", "fluxo_padrao_fluxo_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "motivacional_dia"]'::jsonb,
    'Você não precisa fazer mais. Precisa fazer melhor.'
  ),
  (
    72,
    4,
    'Oferta Direta com Leveza',
    'Aumentar assertividade mantendo conexão humana',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 oferta leve de kit", "2 follow-ups mornos", "Atualizar pipeline", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'A oferta certa, na hora certa, muda tudo.'
  ),
  (
    73,
    4,
    'Conectar e Nutrir',
    'Criar profundidade nos relacionamentos importantes',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 dica de valor", "Mandar mensagem de cuidado", "Reativar 1 contato distante", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_bebidas_beneficios_permitidos", "script_followup_followup_pos_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Quem cuida de verdade constrói resultados que duram.'
  ),
  (
    74,
    4,
    'Conversas de Oportunidade',
    'Gerar espaço para fechamento natural',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 convite firme e educado", "1 follow-up quente", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Oportunidades nascem da coragem de iniciar conversas sinceras.'
  ),
  (
    75,
    4,
    'Expansão Natural',
    'Chegar a novos círculos de maneira leve',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Conectar com 2 pessoas novas", "Enviar 1 convite de avaliação", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Quando você expande sua presença, você expande seus resultados.'
  ),
  (
    76,
    4,
    'Dia de Coragem Estratégica',
    'Resolver pendências importantes no pipeline',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Falar com 1 contato forte", "Enviar 1 oferta objetiva", "Separar 2 pessoas para follow-up amanhã", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'Os maiores avanços sempre vêm depois de uma conversa que parecia difícil.'
  ),
  (
    77,
    4,
    'Autoridade em Ação',
    'Posicionar-se como alguém confiável e constante',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar um depoimento real", "Compartilhar 1 história curta", "Reforçar relacionamento com 1 contato", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_pos_venda", "script_vendas_apresentacao_produto"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Autoridade é a soma da sua constância com a sua verdade.'
  ),
  (
    78,
    4,
    'Oferta com Confiança',
    'Fazer uma oferta de forma simples e segura',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 oferta simples", "1 follow-up direto", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_fechamento", "script_followup_followup_24h"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "conquista"]'::jsonb,
    'Quando você acredita no que entrega, a conversa flui com naturalidade.'
  ),
  (
    79,
    4,
    'Reconexão Profunda',
    'Fortalecer laços antigos e reabrir portas',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 mensagem de cuidado", "Reativar 1 contato frio", "Responder pendências", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_24h", "script_followup_followup_pos_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'A reconexão certa pode gerar mais resultado que dez contatos novos.'
  ),
  (
    80,
    4,
    'Fechamento do Bloco',
    'Revisar conquistas e preparar sprint final',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Revisar os últimos 10 dias", "Celebrar 3 conquistas reais", "Selecionar 5 contatos para a reta final"]'::jsonb,
    '["instrucao_aumentar_pv", "frase_motivacional_consistencia"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "conquista"]'::jsonb,
    'Agora começa a reta final. O próximo ciclo é onde você prova para si mesmo o quanto evoluiu.'
  );

COMMIT;

-- ============================================
-- OBSERVAÇÕES:
-- 
-- - Todos os dias incluem Ritual 2-5-10
-- - Scripts sugeridos usam slugs da base de conhecimento
-- - Notificações seguem padrão estabelecido
-- - Mensagens NOEL no estilo aprovado (Mark Hughes + Jim Rohn + Eric Worre)
-- - Intensidade moderada forte mantida
-- - Foco em crescimento progressivo, produtividade e duplicação
-- ============================================

