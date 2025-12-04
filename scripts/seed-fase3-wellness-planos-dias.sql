-- ============================================
-- SEED FASE 3 - CONSISTÊNCIA (Dias 15 a 30)
-- Sistema NOEL Wellness
-- ============================================
-- 
-- Fase 3: Consolidação de hábitos e aumento de volume
-- Foco: Carteira de clientes, PV, planejamento semanal, repetição inteligente
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
    15,
    3,
    'Consolidação de Hábitos',
    'Reforçar disciplina e continuidade',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 2 convites leves", "Fazer 1 follow-up quente", "Adicionar 3 nomes novos na lista", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Disciplina é decidir fazer mesmo quando não dá vontade. É assim que você cresce.'
  ),
  (
    16,
    3,
    'Construindo Volume Leve',
    'Aumentar levemente esforço de venda',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 oferta simples de bebida", "Rever 1 script de convite", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'A constância cria confiança. Continue com passos firmes.'
  ),
  (
    17,
    3,
    'Reforço do Pipeline',
    'Criar movimento contínuo no funil',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "2 mensagens de follow-up", "1 convite para degustação", "Atualizar contatos", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_24h", "script_vendas_apresentacao_produto"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'É o movimento diário que mantém o negócio vivo. Faça o simples com energia.'
  ),
  (
    18,
    3,
    'Nutrição de Relacionamentos',
    'Criar autoridade afetiva',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Compartilhar 1 conteúdo útil", "Mandar 1 mensagem de cuidado", "Responder pendências", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_pos_venda", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Pessoas compram confiança antes de comprar produtos.'
  ),
  (
    19,
    3,
    'Leve Escalada',
    'Aumentar o volume com leveza',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "2 convites leves", "1 follow-up morno", "Oferecer uma variação de bebida", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_bebidas_variacoes_sabor"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'Nada muda até que você mude seu ritmo. Hoje é dia de subir um degrau.'
  ),
  (
    20,
    3,
    'Primeira Dobra',
    'Gerar os primeiros resultados reais',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 oferta de kit de bebidas", "Convidar 1 pessoa para avaliação", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_fechamento", "script_vendas_apresentacao_produto"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "conquista"]'::jsonb,
    'Resultados pequenos começam a abrir portas. Continue firme.'
  ),
  (
    21,
    3,
    'Semana de Força',
    'Fechamento sólido da semana',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Revisar ações", "Enviar mensagem de agradecimento a 3 pessoas", "Anotar aprendizados"]'::jsonb,
    '["script_followup_followup_pos_venda", "frase_motivacional_consistencia"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "conquista"]'::jsonb,
    'Você não é o que faz de vez em quando; é o que faz sempre.'
  ),
  (
    22,
    3,
    'Expansão Leve',
    'Explorar novos círculos',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Buscar 2 contatos fora da lista", "Oferecer 1 degustação", "Revisar script de convite", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Seu círculo é maior do que você imagina. Hoje é dia de acessar novos espaços.'
  ),
  (
    23,
    3,
    'Aquecimento do Funil',
    'Ativar conversas mornas',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "2 follow-ups mornos", "Mandar 1 mensagem de curiosidade", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_24h", "script_vendas_abordagem_inicial"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'O funil só funciona se estiver sempre em movimento. Vamos aquecer ele hoje.'
  ),
  (
    24,
    3,
    'Ação Quebra-Medo',
    'Enfrentar conversa que está sendo evitada',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 oferta para contato que você tem receio", "Revisar benefício das bebidas", "Responder pendências", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_bebidas_beneficios_permitidos"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'Coragem é fazer mesmo com receio. Hoje é dia de crescer.'
  ),
  (
    25,
    3,
    'Pequenos Fechamentos',
    'Gerar conversões simples',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 oferta de kit básico", "1 follow-up quente", "Revisar variações de bebida", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_fechamento", "script_bebidas_variacoes_sabor"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "conquista"]'::jsonb,
    'O fechamento é o resultado natural de uma boa conversa. Vá com leveza.'
  ),
  (
    26,
    3,
    'Organização Estratégica',
    'Colocar ordem no pipeline',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Organizar lista completa", "Separar 5 contatos para amanhã", "Registrar progresso"]'::jsonb,
    '["instrucao_como_comecar", "fluxo_padrao_fluxo_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite"]'::jsonb,
    'Organização cria potência. Quanto mais claro, mais rápido você cresce.'
  ),
  (
    27,
    3,
    'Primeira Elevação de Nível',
    'Aumentar um pouco o volume de convites',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "3 convites leves", "1 follow-up", "Atualizar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'O que você fez até aqui te trouxe até aqui. Agora damos o próximo passo.'
  ),
  (
    28,
    3,
    'Relação e Autoridade',
    'Educar e conscientizar',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 dica de bem-estar", "Oferecer bebida para quem demonstrou interesse", "Revisar scripts", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_bebidas_beneficios_permitidos", "script_followup_followup_pos_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Educar é liderar. Liderança constrói clientes fiéis.'
  ),
  (
    29,
    3,
    'Reforço de Confiança',
    'Construir segurança nas abordagens',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "1 oferta leve", "1 convite com energia", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "frase_motivacional_manha"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'A confiança cresce quando você age. Faça uma ação com energia hoje.'
  ),
  (
    30,
    3,
    'Fechamento da Fase 3',
    'Preparar terreno para crescimento',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Revisar resultados da fase", "Celebrar pequenas conquistas", "Planejar Fase 4"]'::jsonb,
    '["frase_motivacional_consistencia", "instrucao_aumentar_pv"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "conquista"]'::jsonb,
    'Você está mais forte do que quando começou. A próxima fase vai te surpreender.'
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
-- - Foco em consistência, volume leve e organização
-- ============================================

