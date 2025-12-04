-- ============================================
-- SEED FASE 4 - CRESCIMENTO PROGRESSIVO (Dias 61 a 70 - Bloco 4)
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
    61,
    4,
    'Nova Semana, Nova Energia',
    'Iniciar ciclo com clareza e intenção',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 2 convites leves", "Selecionar 3 conversas para avançar", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "motivacional_dia"]'::jsonb,
    'O começo da semana define o tom. Escolha começar com força.'
  ),
  (
    62,
    4,
    'Conversas que Geram Oportunidade',
    'Criar intenção real nas conversas',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Oferecer 1 kit de bebidas", "Fazer 1 follow-up quente", "Revisar pipeline", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Quando você conversa com intenção, as oportunidades aparecem.'
  ),
  (
    63,
    4,
    'Fortalecendo a Presença',
    'Aparecer de forma profissional e consistente',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Compartilhar 1 dica prática", "Enviar 1 prova social", "Conectar com 1 pessoa nova", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_bebidas_beneficios_permitidos", "script_followup_followup_pos_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Quando você aparece com constância, o mercado te enxerga como referência.'
  ),
  (
    64,
    4,
    'Ação Direta e Controlada',
    'Executar ações que movem o funil para frente',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 oferta simples", "2 follow-ups mornos", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_fechamento", "script_followup_followup_24h"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Um pequeno movimento no funil pode abrir um grande resultado.'
  ),
  (
    65,
    4,
    'Relações que Convertem',
    'Nutrindo laços que geram fidelidade e vendas',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 mensagem de cuidado", "Responder pendências antigas", "Reativar 1 contato frio", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_pos_venda", "script_followup_followup_24h"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Quem cuida, cresce. Hoje é dia de regar suas relações.'
  ),
  (
    66,
    4,
    'Ação de Confiança',
    'Reforçar postura profissional',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 convite firme e educado", "Fazer 1 follow-up quente", "Selecionar 2 contatos para amanhã", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'Quando você fala com clareza, as pessoas te escutam. Hoje é dia de ser claro.'
  ),
  (
    67,
    4,
    'Expansão Inteligente',
    'Aumentar alcance com intenção',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Conectar com 2 pessoas novas", "Enviar 1 convite para avaliação", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'A expansão acontece quando você planta sementes todos os dias.'
  ),
  (
    68,
    4,
    'Movimento de Coragem',
    'Avançar apesar do desconforto',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Falar com 1 contato forte", "Enviar 1 oferta objetiva", "Responder dúvidas abertas", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'Coragem é a ponte entre onde você está e onde deseja chegar.'
  ),
  (
    69,
    4,
    'Reforço da Identidade',
    'Reconectar com visão e propósito',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 mensagem inspiradora", "Compartilhar 1 prova social", "Revisar seus motivos para continuar", "Ritual 10: Revisar dia"]'::jsonb,
    '["frase_motivacional_manha", "script_followup_followup_pos_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'Você não está aqui só por resultados — está aqui porque está construindo uma nova versão de si.'
  ),
  (
    70,
    4,
    'Fechamento do Bloco',
    'Organizar avanços e preparar nova fase',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Analisar os últimos 10 dias", "Celebrar 3 vitórias reais", "Escolher os 5 contatos mais importantes"]'::jsonb,
    '["instrucao_aumentar_pv", "frase_motivacional_consistencia"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "conquista"]'::jsonb,
    'Os próximos 20 dias vão definir o seu salto. Você está pronto.'
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

