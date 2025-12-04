-- ============================================
-- SEED FASE 4 - CRESCIMENTO PROGRESSIVO (Dias 51 a 60 - Bloco 3)
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
    51,
    4,
    'Abertura de Novo Ciclo',
    'Entrar na segunda metade com energia e clareza',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 2 convites leves", "Selecionar 3 conversas prioritárias", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "motivacional_dia"]'::jsonb,
    'O que você constrói daqui pra frente determina quem você se torna. Recomece com intenção.'
  ),
  (
    52,
    4,
    'Pipeline Ativo',
    'Gerar movimento constante nas conversas',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "1 oferta leve de bebida", "2 follow-ups mornos", "Atualizar lista de interessados", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_followup_followup_24h"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Negócio ativo é pipeline ativo. Movimento gera resultado.'
  ),
  (
    53,
    4,
    'Autoridade e Valor',
    'Aumentar percepção de profissionalismo',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 dica simples de saúde/bem-estar", "Compartilhar 1 prova social", "Reativar 1 contato frio", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_bebidas_beneficios_permitidos", "script_followup_followup_pos_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Valor é aquilo que você entrega antes de qualquer venda. Mostre seu valor hoje.'
  ),
  (
    54,
    4,
    'Conversa Direta',
    'Gerar oportunidade com clareza e objetividade',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 convite direto", "Fazer 1 follow-up quente", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'A clareza acelera as decisões. Seja claro hoje — com respeito e energia.'
  ),
  (
    55,
    4,
    'Influência Positiva',
    'Fortalecer presença e inspiração',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 mensagem inspiradora", "Compartilhar 1 história curta real", "Selecionar 2 contatos para follow-up amanhã", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_pos_venda", "frase_motivacional_manha"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'A influência começa quando você inspira — e cresce quando você age.'
  ),
  (
    56,
    4,
    'Oferta Estratégica',
    'Aproveitar o ritmo da semana para converter',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 oferta simples", "1 follow-up morno", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_fechamento", "script_vendas_apresentacao_produto"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "conquista"]'::jsonb,
    'Quando você oferece com clareza, a pessoa entende o valor. Hoje é dia de oferecer.'
  ),
  (
    57,
    4,
    'Nutrição Profunda',
    'Cuidar do relacionamento de forma genuína',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar mensagem de cuidado para 2 contatos", "Responder pendências antigas", "Reforçar relacionamento com 1 cliente", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_pos_venda", "script_followup_followup_24h"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Relacionamento é tudo. Quem cuida, colhe.'
  ),
  (
    58,
    4,
    'Ação de Coragem 2.0',
    'Fortalecer mentalidade e lidar com barreiras',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Falar com 1 contato que você evita", "Enviar 1 oferta objetiva", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'A coragem de hoje desbloqueia resultados de amanhã. Continue avançando.'
  ),
  (
    59,
    4,
    'Reconexão e Alcance',
    'Trazer de volta pessoas importantes do pipeline',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Reativar 1 contato", "Enviar 1 prova social", "Responder dúvidas abertas", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_24h", "script_vendas_apresentacao_produto"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Algumas oportunidades só precisam de um toque para voltarem a viver. Toque nelas hoje.'
  ),
  (
    60,
    4,
    'Fechamento do Bloco',
    'Revisar, consolidar e preparar para novo ciclo',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Avaliar ganhos e desafios", "Celebrar 3 pequenas conquistas", "Selecionar 5 prioridades para a próxima etapa"]'::jsonb,
    '["instrucao_aumentar_pv", "frase_motivacional_consistencia"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "conquista"]'::jsonb,
    'Você já está muito mais forte do que imagina. A consistência está formando o seu próximo nível.'
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

