-- ============================================
-- Script para Popular Base de Conhecimento NOEL - Conteúdo Inicial
-- ============================================
-- Execute este script no Supabase SQL Editor
-- IMPORTANTE: Após inserir, você precisa gerar os embeddings via API

BEGIN;

-- ============================================
-- CATEGORIA: MENTOR (Estratégias e Vendas)
-- ============================================
-- Baseado em perguntas reais dos últimos 7 dias (similaridade 0%)

-- 1. Como Fazer Convite Leve (FREQUÊNCIA: 4)
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Como Fazer um Convite Leve Hoje',
  'convite-leve-hoje',
  'mentor',
  'recrutamento',
  ARRAY['convite', 'leve', 'hoje', 'recrutamento', 'iniciante'],
  10,
  'Como fazer um convite leve hoje:

**Ação prática:**
- Envie 1 convite leve, sem pressão
- Use mensagem, fica mais fácil
- Registre no sistema depois

**Script ideal (Convite Leve):**
"Posso te perguntar uma coisa? 😊
Você toparia conhecer uma forma simples de ganhar uma renda extra ajudando pessoas com bem-estar? Só para ver se combina com você."

**Variação (ainda mais leve):**
"Oi! Se algum dia você quiser entender meu projeto, me avisa.
É algo simples, mas tem feito diferença para muita gente."

**Reforço emocional:**
Coragem não é ausência de medo — é agir apesar dele.
Vamos juntos. Só um movimento hoje.',
  true
);

-- 2. Follow-up de Clientes
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Follow-up de Clientes Após Venda',
  'follow-up-clientes-pos-venda',
  'mentor',
  'vendas',
  ARRAY['follow-up', 'clientes', 'vendas', 'relacionamento', 'pós-venda'],
  9,
  'Estratégias de follow-up eficaz após a venda:

**1. Timing Ideal:**
- 24-48h após primeira compra: agradecer e verificar satisfação
- 7 dias: oferecer dicas de uso e suporte
- 30 dias: verificar resultados e oferecer complementos

**2. Mensagens de Follow-up:**
- "Oi! Como está sendo sua experiência com [produto]?"
- "Precisa de alguma dica para potencializar os resultados?"
- "Que tal conhecer [produto complementar]?"

**3. Oferta de Informações:**
- Produtos complementares
- Novidades que possam interessar
- Programa de indicações

**4. Manter Relacionamento:**
- Cliente feliz = defensor da marca
- Serviço e suporte contínuo
- Comunicação personalizada

Cada cliente feliz pode se tornar um defensor da sua marca!',
  true
);

-- 3. Superando Desânimo (FREQUÊNCIA: 3)
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Estou Desanimado Hoje - O Que Fazer',
  'desanimado-hoje-o-que-fazer',
  'mentor',
  'motivacao',
  ARRAY['desânimo', 'motivação', 'hoje', 'persistência', 'mindset'],
  10,
  'Quando estiver desanimado hoje:

**Lembre-se:**
Semente leva tempo para crescer — você está regando a sua.

**Ação prática de hoje:**
- Faça apenas uma coisa: Ritual 2
- Pause por hoje se necessário
- Amanhã faça só o Ritual 2 novamente
- Volte ao seu motivo inicial

**Frase estilo Jim Rohn:**
"Não deseje que fosse mais fácil. Deseje ser melhor."
E isso você já está fazendo.

**Frase motivacional:**
Grandes histórias têm capítulos difíceis.
O importante é não fechar o livro.',
  true
);

-- 4. Próximo Passo Após Vender Bebida (FREQUÊNCIA: 2)
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Próximo Passo Após Vender Bebida',
  'proximo-passo-apos-vender-bebida',
  'mentor',
  'vendas',
  ARRAY['vendas', 'bebidas', 'próximo-passo', 'follow-up', 'pós-venda'],
  9,
  'Próximos passos após vender uma bebida:

**1. Imediato (hoje):**
- Agradeça a confiança
- Confirme forma de entrega/retirada
- Envie dicas de uso básicas

**2. 24-48h depois:**
- Verifique se recebeu o produto
- Pergunte como está sendo a experiência
- Ofereça suporte se necessário

**3. 7 dias depois:**
- Verifique resultados
- Ofereça produtos complementares
- Peça indicação (se estiver satisfeito)

**Script de Follow-up (24-48h):**
"Oi! Como está sendo sua experiência com [bebida]?
Precisa de alguma dica para potencializar os resultados?"

**Frase:**
Cada cliente feliz pode se tornar um defensor da sua marca.',
  true
);

-- 5. O Que Fazer no Dia do Plano (FREQUÊNCIA: 2)
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'O Que Fazer Hoje no Meu Plano',
  'o-que-fazer-hoje-plano',
  'mentor',
  'plano',
  ARRAY['plano', 'hoje', 'dia', 'microtarefas', 'ação'],
  9,
  'O que fazer hoje no seu plano:

**1. Acesse o Plano do Dia:**
- Vá em "Plano" no menu
- Veja as microtarefas do dia
- Leia a mensagem motivacional do NOEL

**2. Execute as Microtarefas:**
- Marque cada uma conforme completa
- Não precisa fazer tudo de uma vez
- Foque em completar pelo menos 3-5 hoje

**3. Execute os Rituais:**
- Ritual 2: 2 contatos hoje
- Ritual 5: Se for dia de semana, faça 5 ações
- Ritual 10: Se for dia de revisão, revise últimos 10 dias

**4. Use os Scripts Sugeridos:**
- Abra os scripts do dia
- Adapte conforme sua necessidade
- Use para suas conversas

**5. Fale com o NOEL:**
- Se tiver dúvidas sobre o dia
- Peça ajuda com microtarefas específicas
- Obtenha motivação personalizada

**Frase:**
O simples diário vence o intenso ocasional.',
  true
);

-- 6. Como Fechar uma Venda
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Como Fechar uma Venda de Kit de Bebidas',
  'fechar-venda-kit-bebidas',
  'mentor',
  'vendas',
  ARRAY['fechamento', 'vendas', 'bebidas', 'kit', 'técnicas'],
  9,
  'Técnicas para fechar venda de kit de bebidas:

**Quando a pessoa já mostrou interesse:**

**1. Ação Imediata:**
- Envie o script abaixo
- Pergunte sabor preferido
- Ofereça retirada ou entrega

**2. Script Ideal:**
"Do jeito que você gostou das bebidas, você já está vivendo metade do negócio!
Se quiser, preparo um kit leve para você começar hoje."

**3. Próximos Passos:**
- Confirmar sabor
- Definir forma de entrega
- Agendar entrega/retirada
- Enviar link de pagamento

**Frase motivacional:**
Fechar é ajudar alguém a começar.',
  true
);

-- 7. Dificuldade de Convite
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Superando Dificuldade de Convite',
  'dificuldade-convite',
  'mentor',
  'recrutamento',
  ARRAY['convite', 'medo', 'receio', 'iniciante', 'primeiros-passos'],
  8,
  'Como superar o receio de convidar:

**É totalmente normal** — os maiores líderes passaram por isso.

**Ação prática:**
- Envie 1 convite leve, sem pressão
- Use mensagem, fica mais fácil
- Registre no sistema depois

**Script ideal (Convite Leve):**
"Posso te perguntar uma coisa? 😊
Você toparia conhecer uma forma simples de ganhar uma renda extra ajudando pessoas com bem-estar? Só para ver se combina com você."

**Reforço emocional:**
Coragem não é ausência de medo — é agir apesar dele.
Vamos juntos. Só um movimento hoje.',
  true
);

-- 8. Medo de Recrutar / Insegurança (FREQUÊNCIA: 1)
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Insegurança ao Convidar - O Que Fazer',
  'inseguranca-convidar',
  'mentor',
  'recrutamento',
  ARRAY['insegurança', 'convite', 'medo', 'receio', 'primeiros-passos'],
  9,
  'Quando estiver inseguro para convidar:

**É totalmente normal** — os maiores líderes passaram por isso.

**Ação prática:**
- Use mensagem, fica mais fácil que ligação
- Envie 1 convite ultraleve
- Sem pressão, sem expectativa
- Registre no sistema depois

**Script Ultra-Leve:**
"Oi! Se algum dia você quiser entender meu projeto, me avisa.
É algo simples, mas tem feito diferença para muita gente."

**Ou ainda mais leve:**
"Posso te perguntar uma coisa? Você toparia conhecer algo leve para renda extra?"

**Reforço emocional:**
Coragem não é ausência de medo — é agir apesar dele.
Você não precisa ser perfeito — só precisa ser presente.

**Frase:**
Quem convida abre portas. Quem força, fecha.',
  true
);

-- 9. Medo de Recrutar
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Superando Medo de Recrutar',
  'medo-recrutar',
  'mentor',
  'recrutamento',
  ARRAY['recrutamento', 'medo', 'pressão', 'convite'],
  8,
  'Recrutamento não é pressão — é oportunidade.

**Ação:**
Use convite ultraleve.

**Script:**
"Se algum dia você quiser entender meu projeto, me avisa.
É algo simples, mas tem feito diferença para muita gente."

**Frase:**
Quem convida abre portas. Quem força, fecha.',
  true
);

-- 10. Pensando em Desistir (FREQUÊNCIA: 1)
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Pensando em Desistir - O Que Fazer',
  'pensando-desistir',
  'mentor',
  'motivacao',
  ARRAY['desistir', 'desânimo', 'persistência', 'motivação', 'mindset'],
  9,
  'Quando estiver pensando em desistir:

**Lembre-se:**
Parar é uma emoção, não uma decisão.

**Ação prática:**
- Pause por hoje
- Amanhã faça só o Ritual 2
- Volte ao seu motivo inicial
- Reflita: por que começou?

**Perguntas para reflexão:**
- Qual era seu motivo inicial?
- O que você já conquistou até aqui?
- O que você perderia se desistisse?

**Frase motivacional:**
Grandes histórias têm capítulos difíceis.
O importante é não fechar o livro.

**Ação de hoje:**
Apenas pause. Não tome decisões grandes quando estiver desanimado.',
  true
);

-- 11. Dificuldade com Ofertas (FREQUÊNCIA: 1)
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Dificuldade de Enviar Ofertas',
  'dificuldade-enviar-ofertas',
  'mentor',
  'vendas',
  ARRAY['ofertas', 'vendas', 'dificuldade', 'timing', 'estratégia'],
  8,
  'Quando tiver dificuldade de enviar ofertas:

**Com pouco tempo (30 minutos):**
- Foque em 1 oferta leve
- Use script pronto
- Envie para 1 pessoa próxima

**Ação prática:**
- Ritual 2: 2 contatos
- 1 oferta leve de bebidas
- 1 follow-up morno

**Script de Oferta Leve:**
"Oi! Se você está buscando uma renda extra sem atrapalhar o que já faz, posso te mostrar um caminho leve e acessível — com apoio desde o primeiro dia."

**Ou oferta de produto:**
"Se você conhecer alguém que adoraria essa bebida, me avisa? Posso preparar uma para teste."

**Frase:**
O simples diário vence o intenso ocasional.',
  true
);

-- 12. Aumentar Vendas de Bebidas
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Como Aumentar Vendas de Bebidas',
  'aumentar-vendas-bebidas',
  'mentor',
  'vendas',
  ARRAY['vendas', 'bebidas', 'aumento', 'estratégia'],
  8,
  'Venda aumenta com indicação + consistência.

**Ação:**
- Mostre sua bebida diariamente
- Envie 1 oferta leve
- Peça 1 indicação

**Script (Indicação):**
"Se você conhecer alguém que adoraria essa bebida, me avisa? Posso preparar uma para teste."

**Frase:**
Quem serve gera movimento.',
  true
);

-- ============================================
-- CATEGORIA: SUPORTE (Sistema YLADA)
-- ============================================

-- 6. Como Usar o Sistema
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Como Usar o Sistema YLADA Wellness',
  'como-usar-sistema',
  'suporte',
  'inicio',
  ARRAY['sistema', 'início', 'tutorial', 'primeiros-passos'],
  9,
  'Guia rápido para usar o YLADA Wellness:

**1. Dashboard:**
- Acesse para ver seu progresso geral
- Visualize métricas e conquistas

**2. Plano Diário:**
- Acesse o plano do dia atual
- Marque microtarefas concluídas
- Veja scripts sugeridos

**3. Ritual 2-5-10:**
- Ritual 2: 2 contatos diários
- Ritual 5: 5 ações semanais
- Ritual 10: 10 revisões mensais

**4. Chat NOEL:**
- Use para tirar dúvidas
- Peça estratégias personalizadas
- Obtenha suporte técnico

**5. Notificações:**
- Configure lembretes
- Receba motivações diárias',
  true
);

-- ============================================
-- CATEGORIA: TÉCNICO (Bebidas e Produtos)
-- ============================================

-- 13. Bebida para Ansiedade (FREQUÊNCIA: 2)
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Bebida Funcional para Ansiedade',
  'bebida-ansiedade',
  'tecnico',
  'bebidas',
  ARRAY['ansiedade', 'bebidas', 'funcional', 'bem-estar', 'saúde'],
  8,
  'Bebidas funcionais que podem ajudar com ansiedade:

**IMPORTANTE:**
- Não faça alegações médicas
- Sempre oriente consultar profissional de saúde
- Bebidas funcionais são complementares, não substitutos

**Opções de Bebidas Funcionais:**
- Shakes com ingredientes calmantes (camomila, maracujá)
- Bebidas com magnésio e vitaminas do complexo B
- Chás funcionais (se disponíveis no portfólio)

**Orientações:**
- Explique os ingredientes e benefícios permitidos
- Enfatize que é complementar ao tratamento médico
- Nunca prometa cura ou substituição de medicamentos

**Script de Venda Responsável:**
"Temos bebidas funcionais que podem complementar seu bem-estar. Mas sempre recomendo consultar um profissional de saúde para casos de ansiedade."

**Lembre-se:**
Seja ético e responsável. Bebidas funcionais são para bem-estar geral, não tratamento médico.',
  true
);

-- 14. Preparo de Shake
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Como Preparar Shake Funcional',
  'preparo-shake-funcional',
  'tecnico',
  'bebidas',
  ARRAY['shake', 'preparo', 'bebidas', 'receita'],
  9,
  'Guia de preparo de shake funcional:

**Ingredientes básicos:**
- 1 scoop de proteína
- 200-300ml de líquido (água, leite ou bebida vegetal)
- Frutas opcionais
- Gelo (opcional)

**Preparo:**
1. Adicione o líquido no liquidificador
2. Adicione o scoop de proteína
3. Adicione frutas e gelo (se desejar)
4. Bata por 30-60 segundos
5. Sirva imediatamente

**Dicas:**
- Use líquido gelado para melhor textura
- Bata até ficar homogêneo
- Consuma logo após o preparo para melhor aproveitamento dos nutrientes',
  true
);

-- 8. Combinações de Bebidas
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Combinações de Bebidas Funcionais',
  'combinacoes-bebidas-funcionais',
  'tecnico',
  'bebidas',
  ARRAY['combinações', 'bebidas', 'receitas', 'variações'],
  8,
  'Combinações populares de bebidas funcionais:

**1. Shake Energético:**
- Proteína + banana + café
- Ideal para manhãs

**2. Shake Antioxidante:**
- Proteína + frutas vermelhas + espinafre
- Rico em antioxidantes

**3. Shake Proteico:**
- Proteína + aveia + amendoim
- Ideal pós-treino

**4. Shake Detox:**
- Proteína + abacaxi + hortelã
- Refrescante e leve

**Lembre-se:**
Sempre ajuste conforme preferências e objetivos do cliente.',
  true
);

-- ============================================
-- CATEGORIA: MENTOR (Motivação)
-- ============================================

-- 9. Desânimo e Motivação
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Superando Desânimo no Negócio',
  'superar-desanimo',
  'mentor',
  'motivacao',
  ARRAY['desânimo', 'motivação', 'persistência', 'mindset'],
  8,
  'Como superar momentos de desânimo:

**Lembre-se:**
Semente leva tempo para crescer — você está regando a sua.

**Ação hoje:**
- Ritual 10 (revisão)
- Revise últimos 10 dias
- Envie 1 convite leve

**Script:**
"Posso te perguntar uma coisa? Você toparia conhecer algo leve para renda extra?"

**Frase:**
O que parece pequeno hoje vira história amanhã.',
  true
);

-- 10. Consultor Iniciante
INSERT INTO knowledge_wellness_items (
  title, slug, category, subcategory, tags, priority, content, is_active
) VALUES (
  'Primeiros Passos para Consultor Iniciante',
  'primeiros-passos-iniciante',
  'mentor',
  'inicio',
  ARRAY['iniciante', 'primeiros-passos', 'começar', 'fundamentos'],
  9,
  'Guia para consultor totalmente iniciante:

**Ótimo — começar limpo é mais fácil.**

**Primeiro passo:**
- Faça o Ritual 2
- Aprenda o fluxo das bebidas
- Envie seu primeiro convite leve

**Script:**
"Posso te perguntar algo? Você toparia conhecer algo simples de renda extra?"

**Frase:**
O começo é pequeno. O efeito é gigante.',
  true
);

COMMIT;

-- ============================================
-- RESUMO DO QUE FOI ADICIONADO:
-- ============================================
-- Total de itens: 14+
-- 
-- ✅ BASEADO EM PERGUNTAS REAIS (últimos 7 dias):
--   1. "Como fazer convite leve" (frequência: 4) → PRIORIDADE 10
--   2. "Estou desanimado hoje" (frequência: 3) → PRIORIDADE 10
--   3. "Próximo passo após vender bebida" (frequência: 2) → PRIORIDADE 9
--   4. "O que fazer no plano hoje" (frequência: 2) → PRIORIDADE 9
--   5. "Bebida para ansiedade" (frequência: 2) → PRIORIDADE 8
--   6. "Insegurança ao convidar" (frequência: 1) → PRIORIDADE 9
--   7. "Pensando em desistir" (frequência: 1) → PRIORIDADE 9
--   8. "Dificuldade com ofertas" (frequência: 1) → PRIORIDADE 8
--
-- + Itens essenciais adicionais (follow-up, fechamento, etc.)

-- ============================================
-- PRÓXIMOS PASSOS APÓS EXECUTAR ESTE SCRIPT:
-- ============================================
-- 1. Verificar se os itens foram inseridos:
--    SELECT COUNT(*) FROM knowledge_wellness_items WHERE is_active = true;
--    (Deve retornar pelo menos 14)
--
-- 2. Gerar embeddings para todos os itens:
--    Execute o script: scripts/gerar-embeddings-base-conhecimento.js
--    Ou use a API: POST /api/wellness/knowledge/generate-embeddings
--
-- 3. Testar busca com perguntas reais:
--    - "NOEL, como eu faço um convite leve hoje?"
--    - "Estou desanimado hoje. O que eu faço?"
--    - "NOEL, vendi uma bebida agora. Qual é o próximo passo?"
--    - "NOEL, estou no dia 8 do meu plano. O que eu faço hoje?"
--    Verifique se a similaridade > 0% agora
--
-- 4. Monitorar taxa de acerto:
--    Execute: scripts/verificar-base-conhecimento-noel.sql
--    Verifique a query "Top 10 perguntas sem similaridade"
--    Esperado: essas perguntas não devem mais aparecer na lista

