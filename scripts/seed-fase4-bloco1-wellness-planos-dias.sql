-- ============================================
-- SEED FASE 4 - CRESCIMENTO PROGRESSIVO (Dias 31 a 40 - Bloco 1)
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
    31,
    4,
    'Início da Nova Fase',
    'Preparar mentalidade para crescimento',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Revisar objetivos financeiros", "Enviar 2 convites leves", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["instrucao_como_comecar", "fluxo_padrao_fluxo_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "motivacional_dia"]'::jsonb,
    'Seu próximo nível não exige perfeição — exige intenção e movimento.'
  ),
  (
    32,
    4,
    'Ação Direta com Leveza',
    'Construir pipeline novamente',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Oferecer 1 kit de bebidas", "Fazer 1 follow-up quente", "Adicionar 2 novos contatos", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'O segredo não é fazer tudo — é fazer o essencial com consistência.'
  ),
  (
    33,
    4,
    'Relação + Comunicação',
    'Construir confiança e proximidade',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 dica de bem-estar", "Responder pendências antigas", "Reforçar relacionamento com 2 contatos", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_pos_venda", "script_bebidas_beneficios_permitidos"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Quando você se importa, as pessoas sentem. Quando sentem, elas confiam.'
  ),
  (
    34,
    4,
    'Fechamentos Simples',
    'Transformar conversas em vendas leves',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 oferta pronta", "1 follow-up morno", "Atualizar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_fechamento", "script_followup_followup_24h"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "conquista"]'::jsonb,
    'A venda é o resultado natural de uma boa conversa. Vá com leveza e clareza.'
  ),
  (
    35,
    4,
    'Expansão Social',
    'Aumentar alcance e visibilidade',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Publicar 1 conteúdo útil", "Mandar 1 convite para avaliação", "Conectar com 2 pessoas novas", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Expansão acontece quando você aparece. Mostre seu valor ao mundo.'
  ),
  (
    36,
    4,
    'Ação Estratégica',
    'Executar ações que movem o negócio',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 convite forte", "Revisar lista de interessados", "Selecionar 3 conversas para priorizar amanhã", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'O crescimento vem de escolhas — escolha agir no que importa.'
  ),
  (
    37,
    4,
    'Movimento e Oportunidade',
    'Gerar novas conversas',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "2 convites leves", "1 oferta de bebida", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_vendas_apresentacao_produto"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Oportunidades não aparecem — são criadas pelo seu movimento.'
  ),
  (
    38,
    4,
    'Ação de Coragem',
    'Enfrentar conversas pendentes importantes',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Falar com 1 contato forte", "Fazer 1 follow-up direto", "Separar 2 contatos frios para reativar", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_followup_followup_pos_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'Crescimento exige coragem. Hoje você prova para si mesmo do que é capaz.'
  ),
  (
    39,
    4,
    'Comunidade e Autoridade',
    'Fortalecer percepção social',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 testemunho de cliente", "Compartilhar 1 história real", "Retomar conversa com contato morno", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_pos_venda", "script_vendas_apresentacao_produto"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Autoridade não é sobre saber tudo — é sobre viver aquilo que você ensina.'
  ),
  (
    40,
    4,
    'Fechamento do Ciclo Inicial',
    'Preparar terreno para a segunda parte da Fase 4',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Revisar resultados dos últimos 10 dias", "Celebrar pequenas vitórias", "Selecionar 5 contatos prioritários"]'::jsonb,
    '["instrucao_aumentar_pv", "frase_motivacional_consistencia"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "conquista"]'::jsonb,
    'Você está construindo algo sólido. Clareza é o primeiro passo do próximo nível.'
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

