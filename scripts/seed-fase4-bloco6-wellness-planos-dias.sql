-- ============================================
-- SEED FASE 4 - CRESCIMENTO PROGRESSIVO (Dias 81 a 90 - Bloco 6 - FINAL)
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
    81,
    4,
    'Início do Sprint Final',
    'Criar energia para a reta final',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 2 convites leves", "Selecionar 3 conversas importantes", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "motivacional_dia"]'::jsonb,
    'O que você faz nesses próximos 10 dias pode ser maior do que tudo o que fez até aqui.'
  ),
  (
    82,
    4,
    'Oportunidades Claras',
    'Gerar conversas que se transformam em resultado real',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Oferecer 1 kit de bebidas", "Fazer 1 follow-up quente", "Revisar pipeline", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Seu resultado cresce quando você cria clareza nas oportunidades que já existem.'
  ),
  (
    83,
    4,
    'Autoridade Consolidada',
    'Reforçar imagem profissional e confiável',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 prova social forte", "Compartilhar 1 dica de alto valor", "Reativar 1 contato frio", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_pos_venda", "script_bebidas_beneficios_permitidos"]'::jsonb,
    '["ritual_manha", "ritual_tarde"]'::jsonb,
    'Você não está mais começando — você está se consolidando. Mostre isso ao mundo.'
  ),
  (
    84,
    4,
    'Movimento Decisivo',
    'Criar espaço para resultados emergirem',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 convite firme", "Fazer 1 follow-up morno", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Decisões nascem de conversas firmes e cheias de propósito.'
  ),
  (
    85,
    4,
    'Expansão Consciente',
    'Criar novas conexões de qualidade e significado',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Conectar com 2 pessoas novas", "Enviar 1 convite para avaliação", "Atualizar pipeline", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_abordagem_inicial", "script_indicacao_pedir_indicacao"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Expansão verdadeira acontece quando você se conecta com intenção.'
  ),
  (
    86,
    4,
    'Dia de Coragem Final',
    'Destravar conversas que podem gerar resultados significativos',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Falar com 1 contato forte", "Enviar 1 oferta clara", "Selecionar 2 contatos para reengajar amanhã", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_apresentacao_produto", "script_vendas_fechamento"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "motivacional_dia"]'::jsonb,
    'Coragem cria destino. Hoje você avança para o seu próximo nível.'
  ),
  (
    87,
    4,
    'Reconexão Estratégica',
    'Reacender conversas com potencial de fechamento',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Reativar 1 contato", "Enviar 1 prova social", "Responder pendências abertas", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_followup_followup_24h", "script_followup_followup_pos_venda"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "microtarefa_lembrete"]'::jsonb,
    'Às vezes, uma pequena reconexão cria um resultado que você não esperava.'
  ),
  (
    88,
    4,
    'Ação de Impacto',
    'Produzir um movimento real no funil',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Enviar 1 convite firme e educado", "1 follow-up quente", "Registrar progresso", "Ritual 10: Revisar dia"]'::jsonb,
    '["script_vendas_fechamento", "script_followup_followup_24h"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "conquista"]'::jsonb,
    'Impacto é a soma da sua consistência com sua coragem. Hoje é dia de unir as duas.'
  ),
  (
    89,
    4,
    'Revisão e Força',
    'Rever aprendizados e preparar fechamento',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Revisar o que funcionou melhor", "Celebrar 3 conquistas concretas", "Selecionar 3 conversas para amanhã"]'::jsonb,
    '["instrucao_aumentar_pv", "frase_motivacional_consistencia"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "conquista"]'::jsonb,
    'Você já não é mais o mesmo. Hoje você vê o quanto cresceu.'
  ),
  (
    90,
    4,
    'Conclusão da Jornada',
    'Fechar o ciclo com visão, orgulho e preparação para o próximo nível',
    '["Ritual 2: 2 contatos", "Ritual 5: 5 ações", "Ritual 10: Revisar dia", "Revisar toda a jornada", "Celebrar conquistas emocionais e técnicas", "Definir novos objetivos com o NOEL"]'::jsonb,
    '["instrucao_desenvolver_equipe", "frase_motivacional_consistencia"]'::jsonb,
    '["ritual_manha", "ritual_tarde", "ritual_noite", "conquista"]'::jsonb,
    'Você completou 90 dias. Agora você tem aquilo que poucos têm: consistência, visão e identidade. O próximo nível começa hoje.'
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
-- - Dia 90: Conclusão da jornada completa de 90 dias
-- ============================================

