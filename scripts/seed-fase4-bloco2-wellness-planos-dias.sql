-- ============================================
-- SEED FASE 4 - CRESCIMENTO PROGRESSIVO (Dias 41 a 50 - Bloco 2)
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
    41,
    4,
    'Retomada de Energia',
    'Voltar ao ritmo e reforçar identidade',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 2 convites leves", "Fazer 1 follow-up quente", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["frase_motivacional_manha", "script_vendas_abordagem_inicial"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'Quando você lembra quem você é, o seu ritmo volta. Hoje é dia de retomar seu movimento.'
  ),
  (
    42,
    4,
    'Ação que Gera Conversão',
    'Transformar conversas em oportunidades reais',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Oferecer 1 kit de bebidas", "Enviar 1 mensagem de curiosidade", "Atualizar pipeline quente", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'O segredo de hoje é clareza: faça uma ação que aproxima você do seu objetivo.'
  ),
  (
    43,
    4,
    'Nutrir e Educar',
    'Construir autoridade silenciosa',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 dica de bem-estar", "Responder mensagens pendentes", "Reativar 1 contato frio", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_bebidas_beneficios_permitidos", "script_followup_followup_pos_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Educar é a forma mais nobre de vender. Quem ensina, conquista.'
  ),
  (
    44,
    4,
    'Movimento Direto',
    'Criar volume de conversas',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "3 convites leves", "1 follow-up morno", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Quanto mais você conversa, mais portas se abrem. Hoje é dia de falar com o mundo.'
  ),
  (
    45,
    4,
    'Expansão de Rede',
    'Aumentar alcance social e influência',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Conectar com 2 pessoas novas", "Enviar 1 convite de avaliação", "Revisar lista de potenciais consultores", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_recrutamento_abordagem_recrutamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Você não precisa de milhares de pessoas — só precisa se conectar com as pessoas certas.'
  ),
  (
    46,
    4,
    'Dia de Coragem',
    'Atacar conversas que geram medo',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Falar com 1 contato forte", "Enviar 1 oferta direta", "Selecionar 2 pessoas para follow-up amanhã", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'A coragem de hoje abre resultados amanhã. Vá com confiança ― você domina o processo.'
  ),
  (
    47,
    4,
    'Fortalecimento da Autoridade',
    'Mostrar segurança e profissionalismo',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 depoimento real", "Compartilhar 1 história curta", "Reforçar relacionamento com 1 contato", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_pos_venda", "script_vendas_apresentacao_produto"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Autoridade é construída com histórias reais ― compartilhe algo que inspire.'
  ),
  (
    48,
    4,
    'Fechamento Simples',
    'Converter com leveza e confiança',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 oferta de kit simples", "1 follow-up direto", "Atualizar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_fechamento", "script_followup_followup_24h"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "conquista"]'::jsonb,
    'Vender não é pressionar — é ajudar alguém a tomar a decisão certa.'
  ),
  (
    49,
    4,
    'Reativação Estratégica',
    'Trazer contatos adormecidos de volta ao pipeline',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar mensagem de cuidado para 2 contatos", "Reativar 1 contato frio", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_24h", "script_followup_followup_pos_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Muitos resultados vêm de pessoas que estavam quietas. Traga-as de volta ao movimento.'
  ),
  (
    50,
    4,
    'Fechamento da Segunda Etapa',
    'Organizar dados e preparar novo ciclo',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Revisar os últimos 10 dias", "Celebrar pequenas vitórias", "Selecionar 5 contatos prioritários para o próximo ciclo"]'::jsonb,
    '["instrucao_aumentar_pv", "frase_motivacional_consistencia"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "conquista"]'::jsonb,
    'Clareza é força. Quando você sabe para onde vai, seus resultados aceleram.'
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

