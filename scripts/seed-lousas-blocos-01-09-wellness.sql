-- =====================================================
-- SEED COMPLETO - BLOCOS 1 A 9 DO NOEL WELLNESS
-- Baseado nas lousas armazenadas em docs/noel-lousas/blocos/
-- =====================================================

BEGIN;

-- Garantir que a coluna tipo_mentor existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ylada_wellness_base_conhecimento' 
    AND column_name = 'tipo_mentor'
  ) THEN
    ALTER TABLE ylada_wellness_base_conhecimento 
    ADD COLUMN tipo_mentor TEXT DEFAULT 'noel' 
    CHECK (tipo_mentor IN ('noel', 'vendedor', 'suporte'));
  END IF;
END $$;

-- =====================================================
-- BLOCO 1 — SCRIPTS DE VENDAS DE BEBIDAS FUNCIONAIS
-- =====================================================

INSERT INTO ylada_wellness_base_conhecimento (
  tipo_mentor, categoria, subcategoria, titulo, conteudo, tags, prioridade, estagio_negocio, tempo_disponivel, ativo
) VALUES
('noel', 'script_vendas', 'abordagem_inicial', 'Abordagem leve — teste por R$10', 
'Oi! 😊 Estou ajudando algumas pessoas a terem mais energia e foco no dia com uma bebida funcional super leve. Estou oferecendo um teste por apenas R$10 para quem quiser sentir na prática. Quer experimentar hoje?', 
ARRAY['iniciante','bebidas','conversa','primeiro_contato'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min','1-2h'], true),

('noel', 'script_vendas', 'stories', 'Interação em stories', 
'Percebi que você viu meus stories das bebidas! 🥤✨ Quer sentir o efeito também? Posso preparar uma por R$10 pra você experimentar quando quiser. É rapidinho!', 
ARRAY['stories','abordagem','interesse'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min','1-2h'], true),

('noel', 'script_vendas', 'conversao', 'Experimentou → Kit 7 dias', 
'Que bom que você gostou da bebida! 😊 A maioria das pessoas que sente o efeito já começa com o kit de 7 dias — ele é simples, prático e ajuda você a ter um resultado mais consistente. Quer que eu te mostre como funciona?', 
ARRAY['kit7','conversao','experiencia'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min','1-2h'], true),

('noel', 'script_vendas', 'followup', 'Follow-up gentil', 
'Oi! Só passando aqui rapidinho. Se quiser, preparo a bebida pra você ainda hoje. 😊 Me avisa qual horário funciona melhor!', 
ARRAY['followup','leve','bebidas'], 8, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_vendas', 'followup_pos_bebida', 'Como você se sentiu?', 
'Oi! Como você se sentiu depois da sua bebida ontem? 🥤✨ Muitas pessoas percebem mais energia logo nos primeiros dias. Se quiser manter essa sensação, posso montar o kit de 7 dias pra você. Quer ver como é simples?', 
ARRAY['followup','kit7','experiencia','emocional'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min','1-2h'], true),

('noel', 'script_bebidas', 'kit_7_dias', 'Kit 7 dias', 
'Preparei aqui uma explicação simples do kit de 7 dias! Ele é perfeito para quem quer mais disposição e uma rotina melhor. 💚 Quer que eu te envie agora? Leva menos de 1 minuto para entender.', 
ARRAY['kit7','vendas','clareza'], 9, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min','1-2h'], true),

('noel', 'script_bebidas', 'upgrade_pote', 'Pote fechado', 
'Você foi muito bem no kit! 👏 Se quiser continuar e economizar, o pote fechado compensa muito — dura mais e sai mais barato por dose. Quer que eu te mostre as opções?', 
ARRAY['upgrade','pote','economia'], 9, 
ARRAY['ativo','produtivo','multiplicador'], ARRAY['30-60 min','1-2h','2-3h'], true),

('noel', 'script_vendas', 'story_cta', 'Chamada no story', 
'Preparando algumas bebidas funcionais hoje 🥤✨ Quem quiser testar uma por R$10, me chama aqui! Faço na hora e entrego rapidinho. 💚', 
ARRAY['stories','cta','bebidas'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_vendas', 'lista_quente', 'Lista quente', 
'Oi! Comecei um projeto novo com bebidas funcionais e queria muito que você experimentasse. Estou oferecendo uma por R$10 pra quem é mais próximo. Posso colocar seu nome na lista de hoje? 😊', 
ARRAY['lista_quente','bebidas','conexao'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_bebidas', 'indicacao_degustacao', 'Indicação após degustação', 
'Adorei que você gostou da bebida! 💚 Se lembrar de alguém que também gostaria de testar, posso preparar uma hoje mesmo. Só me avisar!', 
ARRAY['indicacao','degustacao','bebidas'], 9, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true);

-- =====================================================
-- BLOCO 2 — SCRIPTS DE INDICAÇÃO
-- =====================================================

INSERT INTO ylada_wellness_base_conhecimento (
  tipo_mentor, categoria, subcategoria, titulo, conteudo, tags, prioridade, estagio_negocio, tempo_disponivel, ativo
) VALUES
('noel', 'script_indicacao', 'natural_pos_bebida', 'Indicação leve após degustação', 
'Fico feliz que gostou da bebida! 🥤💚 Se alguém da sua família ou amigos também quiser sentir essa energia, posso preparar uma pra eles hoje. Só me avisar!', 
ARRAY['indicacao','degustacao','leve','familia'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_indicacao', 'por_ajuda', 'Me ajuda rapidinho?', 
'Estou montando uma lista de pessoas que gostam de cuidar da saúde e estou enviando uma bebida funcional de teste. Você poderia me indicar 1 ou 2 pessoas que você acha que iriam gostar? 😊', 
ARRAY['reciprocidade','ajuda','lista','indicacao'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_indicacao', 'apos_resultado', 'Quando a pessoa gostou e relatou benefício', 
'Que legal que você sentiu o resultado! ✨ Muitas pessoas que gostam acabam indicando alguém próximo para testar também. Tem alguém que você acha que iria curtir essa experiência?', 
ARRAY['prova_social','resultado','experiencia'], 9, 
ARRAY['ativo','produtivo','multiplicador'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_indicacao', 'direcionada', 'Indicação específica', 
'Se você pudesse indicar só uma pessoa que está sempre buscando mais disposição — quem seria? Posso enviar uma bebida de teste pra ela hoje mesmo. 😊', 
ARRAY['direcionada','claridade','um_nome'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_indicacao', 'nao_comprou', 'Quando a pessoa não fechou a compra', 
'Sem problemas! 💚 E se você lembrar de alguém que gostaria de testar, posso preparar uma bebida funcional pra essa pessoa hoje!', 
ARRAY['nao_comprou','indicacao','leve'], 8, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'script_indicacao', 'apos_kit', 'Indicação pós kit', 
'Você foi muito bem no kit! 👏 Normalmente quem faz o kit já pensa em alguém que poderia começar com você. Tem alguém que você gostaria que fizesse junto?', 
ARRAY['kit7','indicacao','grupo','companhia'], 10, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_indicacao', 'familiares', 'Família primeiro', 
'Essas bebidas ajudam muito na rotina! Algum familiar seu gostaria de testar também? Posso enviar uma mensagem pra ele(a) se quiser.', 
ARRAY['familia','indicacao','rotina'], 8, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_indicacao', 'trabalho', 'Para o ambiente de trabalho', 
'Tem alguém no seu trabalho que vive dizendo que está cansado(a) ou sem disposição? Posso preparar uma bebida funcional pra essa pessoa hoje!', 
ARRAY['trabalho','indicacao','cansaco'], 9, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_indicacao', 'social', 'Quem faria parte do seu grupo?', 
'Se você fosse montar um grupo de pessoas para ter mais disposição no dia a dia… quem seria a primeira pessoa que colocaria?', 
ARRAY['pertencimento','grupo','social'], 9, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_indicacao', 'ferramenta_wellness', 'Indicação oferecendo valor', 
'Estou enviando para algumas pessoas um teste rápido do Wellness (quantidade de água, proteína e rotina). Quer indicar alguém para fazer também? É gratuito e ajuda muito! 💚', 
ARRAY['ferramentas','gratuito','valor','indicacao'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_indicacao', 'pos_relatorio', 'Após análise do Wellness', 
'Preparei seu relatório! Ele ficou ótimo! ✨ Se quiser indicar alguém para receber um relatório também, posso enviar o link pra essa pessoa agora mesmo.', 
ARRAY['relatorio','valor','indicacao'], 10, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_indicacao', 'momento_quente', 'Quando a pessoa demonstra empolgação', 
'Adorei sua energia! 🙌 Quando alguém fica assim animado, normalmente lembra de mais alguém que gostaria de sentir o mesmo. Quem te vem à cabeça agora?', 
ARRAY['empolgado','momento_quente','indicacao'], 9, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_indicacao', 'um_nome', 'Só 1 pessoa', 
'Se você pudesse indicar apenas uma pessoa que gostaria de ter mais disposição no dia… quem seria?', 
ARRAY['um_nome','reduzir_atrito','indicacao'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'script_indicacao', 'suave', 'Indicação suave', 
'Se algum nome te vier na cabeça depois, me manda! Às vezes aparece alguém que está precisando de algo simples para melhorar o dia. 💚', 
ARRAY['suave','indicacao','sem_pressao'], 7, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true);

-- =====================================================
-- BLOCO 3 — SCRIPTS DE RECRUTAMENTO LEVE
-- =====================================================

INSERT INTO ylada_wellness_base_conhecimento (
  tipo_mentor, categoria, subcategoria, titulo, conteudo, tags, prioridade, estagio_negocio, tempo_disponivel, ativo
) VALUES
('noel', 'script_recrutamento', 'convite_leve', 'Convite leve', 
'Posso te perguntar uma coisa? 😊 Você é alguém que toparia conhecer uma forma simples de ganhar uma renda extra ajudando pessoas com bem-estar? Sem compromisso, só pra entender se combina com você.', 
ARRAY['convite_leve','curiosidade','renda_extra'], 10, 
ARRAY['produtivo','multiplicador','lider'], ARRAY['1-2h','2-3h','3-5h'], true),

('noel', 'script_recrutamento', 'perfil_bem_estar', 'Você já tem o perfil', 
'Pelo jeito que você gosta de cuidar das pessoas, você tem exatamente o perfil que mais tem resultado no meu projeto. 💚 Se quiser, te mostro como funciona de um jeito bem simples.', 
ARRAY['perfil','bem_estar','convite'], 9, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_recrutamento', 'pos_experiencia', 'Você já vive o produto', 
'Eu preciso te dizer: do jeito que você gostou dos produtos, você já está vivendo metade do negócio! 😄 Se quiser entender como transformar isso em renda, posso te explicar rapidinho.', 
ARRAY['resultado','produtos','convite'], 10, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_recrutamento', 'pede_indicacao', 'Quando te pedem informação', 
'Você sempre indica coisas boas para as pessoas… já pensou em ser recompensado(a) por isso? Posso te mostrar como funciona. 👇', 
ARRAY['indicacao','convite','lideranca'], 9, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_recrutamento', 'visao_futuro', 'Visão de futuro', 
'Você já imaginou onde poderia estar em 1 ano se começasse algo simples hoje? Muitas pessoas subestimam o poder de começar pequeno — mas é assim que grandes histórias nascem. ✨', 
ARRAY['visao','futuro','inspiracao'], 10, 
ARRAY['ativo','produtivo','multiplicador'], ARRAY['1-2h','2-3h'], true),

('noel', 'script_recrutamento', 'renda_extra', 'Renda extra simples', 
'Se você está buscando uma renda extra que não atrapalha o que você já faz, eu consigo te mostrar um caminho bem acessível — e com apoio desde o primeiro dia.', 
ARRAY['renda_extra','acessivel','simples'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_recrutamento', 'multiplicador', 'Você tem perfil de multiplicador(a)', 
'Pelo jeito que você lembrou de pessoas para indicar, você tem um perfil natural de multiplicador(a). Isso é muito valioso no meu projeto. 💚 Se quiser ver como funciona, posso te mostrar rapidinho.', 
ARRAY['indicacao','multiplicador','convite'], 9, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_recrutamento', 'empreendedor', 'Expansão de negócios', 
'Como empreendedor(a), você sabe reconhecer oportunidades. O meu projeto tem um modelo de expansão muito inteligente — se quiser, te mostro como funciona.', 
ARRAY['empreendedor','visao','expansao'], 9, 
ARRAY['produtivo','multiplicador','lider'], ARRAY['1-2h','2-3h'], true),

('noel', 'script_recrutamento', 'sem_tempo', 'Para quem não tem tempo', 
'Posso ser sincero(a)? As pessoas com menos tempo são as que mais valorizam um projeto que se encaixa na rotina sem atrapalhar nada. Se quiser conhecer, te mostro o básico em 2 minutos.', 
ARRAY['sem_tempo','convite','rotina'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'script_recrutamento', 'carisma', 'Seu carisma funciona aqui', 
'Você tem uma presença que as pessoas escutam. Isso faz toda diferença no meu projeto. Se quiser entender como transformar isso em algo maior, posso te explicar.', 
ARRAY['carisma','influencia','lideranca'], 8, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_recrutamento', 'mudanca', 'Mudança começa com uma decisão', 
'Nada muda até que você mude. 😊 Se você está buscando algo novo, algo que abre portas… talvez esse projeto seja uma oportunidade perfeita para começar uma nova fase.', 
ARRAY['mudanca','jim_rohn','inspiracao'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_recrutamento', 'momentum', 'Aproveitar o momentum', 
'Adorei sua energia! Quando alguém está assim, é o melhor momento para começar algo novo. Se quiser, te mostro como iniciar com passos simples.', 
ARRAY['momentum','inspiracao','convite'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_recrutamento', 'proposito', 'Propósito e impacto', 
'Se você gosta de ajudar pessoas a se sentirem melhor, esse projeto pode ser um espaço incrível pra você. É simples, é duplicável e transforma vidas.', 
ARRAY['proposito','impacto','bem_estar'], 9, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_recrutamento', 'zero_pressao', 'Zero pressão', 
'Se algum dia você quiser entender como funciona o meu projeto, me avisa. É algo simples, mas que tem feito muita diferença para várias pessoas. 💚', 
ARRAY['leve','sem_pressao','convite'], 7, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'script_recrutamento', 'financeiro', 'Fase financeira', 
'Se você sente que está na hora de dar um passo financeiro diferente, eu posso te mostrar um caminho que muitas pessoas estão seguindo com resultados reais.', 
ARRAY['financeiro','mudanca','convite'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true);

-- =====================================================
-- BLOCO 4 — SCRIPTS DE FOLLOW-UP PROFISSIONAL
-- =====================================================

INSERT INTO ylada_wellness_base_conhecimento (
  tipo_mentor, categoria, subcategoria, titulo, conteudo, tags, prioridade, estagio_negocio, tempo_disponivel, ativo
) VALUES
('noel', 'script_followup', '24h_pos_degustacao', 'Como você se sentiu ontem?', 
'Ei! 😊 Como você se sentiu depois da bebida de ontem? Muita gente nota um ânimo diferente logo nos primeiros dias. Se quiser, posso montar o kit de 7 dias pra você começar de verdade.', 
ARRAY['24h','degustacao','kit7','experiencia'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_followup', '3_dias', 'Mantendo o processo', 
'Passaram alguns dias desde que você testou a bebida… e normalmente é aqui que a ficha cai. 😊 Se você quiser dar continuidade, o kit de 7 dias é o próximo passo natural. Te explico rapidinho se quiser!', 
ARRAY['3dias','continuidade','kit7'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_followup', '7_dias', 'Sua semana poderia começar diferente', 
'Fechando a semana por aqui e lembrei de você! ✨ Imagine começar a próxima com mais energia e foco. Se fizer sentido, o kit de 7 dias é perfeito para isso.', 
ARRAY['7dias','decisao','kit7'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_followup', 'sumiu', 'Sumiço gentil', 
'Oi! 😊 Sei que a correria às vezes aperta. Só passei para dizer que, se ainda quiser experimentar a bebida ou conhecer o kit, estou aqui. Sem pressa nenhuma!', 
ARRAY['sumiu','leve','gentil'], 8, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'script_followup', 'interesse_nao_concluido', 'Você ainda tem interesse?', 
'Vi aqui que conversamos sobre o kit e você chegou a pedir detalhes. Ainda faz sentido para você? Se quiser, te mando de novo. 💚', 
ARRAY['interesse','reabrir_conversa','kit7'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_followup', 'upgrade_pote', 'Próximo passo natural', 
'Você mandou bem no kit! 👏 Se quiser continuar economizando e mantendo resultados, o pote fechado compensa muito. Quer ver as opções?', 
ARRAY['upgrade','pote','continuidade'], 10, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_followup', 'cliente_satisfeito', 'Quando a pessoa gostou', 
'Fico feliz que você gostou! 🥤✨ A maioria das pessoas que sente esse resultado logo no começo já segue com o kit de 7 dias para consolidar. Posso montar o seu?', 
ARRAY['satisfeito','kit7','continuidade'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_followup', 'pergunta_estrategica', 'Pergunta decisiva', 
'Se você fosse começar hoje, qual seria seu objetivo principal com as bebidas? Energia? Foco? Rotina melhor? Assim te indico o melhor kit.', 
ARRAY['pergunta','estrategico','decisao'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_followup', 'reaquecimento', 'Reativação suave', 
'Oi! Dei uma olhada aqui nas minhas mensagens e lembrei de você. 😊 Se ainda quiser experimentar a bebida ou ver os kits, posso te ajudar agora!', 
ARRAY['reaquecimento','suave','conexao'], 8, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'script_followup', 'pos_indicacao', 'Sua indicação foi ótima!', 
'Sua indicação adorou a bebida! 💚 Obrigado(a) por confiar. Se quiser, posso preparar algo especial para você também continuar o processo.', 
ARRAY['indicacao','prova_social','agradecimento'], 9, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min'], true),

('noel', 'script_followup', 'pos_apresentacao', 'O que você achou?', 
'O que você achou da oportunidade? 😊 Se alguma parte chamou sua atenção, posso te explicar com mais calma. A decisão é sempre sua — eu só estou aqui para te dar clareza.', 
ARRAY['recrutamento','pos_apresentacao','clareza'], 10, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_followup', 'pediu_tempo', 'Respeito + lembrete', 
'Perfeito, eu respeito totalmente seu tempo. 💚 Só passando para deixar claro que, quando quiser entender melhor ou começar, estarei aqui. Enquanto isso, posso te enviar conteúdos que ajudam?', 
ARRAY['tempo','gentileza','sem_pressao'], 8, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'script_followup', 'recusa', 'Recusa elegante', 
'Sem problemas algum! 😄 Só saiba que, se algum dia fizer sentido para você, vai ser um prazer te ajudar. E se quiser indicar alguém, posso cuidar dessa pessoa com o mesmo carinho.', 
ARRAY['recusa','classe','profissional'], 7, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'script_followup', 'recuperacao', 'Lembrete emocional', 
'Ei… lembrei do que você me disse sobre querer mais disposição no dia a dia. Isso ainda é importante para você? Se for, posso te ajudar a começar hoje mesmo.', 
ARRAY['emocional','importancia','retomar'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_followup', 'prova_social', 'Muitas pessoas estão começando', 
'Esta semana várias pessoas começaram o kit de 7 dias e estão adorando os resultados! ✨ Se você quiser fazer parte também, posso montar o seu agora.', 
ARRAY['prova_social','kit7','novos_clientes'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true);

-- =====================================================
-- BLOCO 5 — MOTIVAÇÃO & LIDERANÇA (Frases)
-- =====================================================

INSERT INTO ylada_wellness_base_conhecimento (
  tipo_mentor, categoria, subcategoria, titulo, conteudo, tags, prioridade, estagio_negocio, tempo_disponivel, ativo
) VALUES
('noel', 'frase_motivacional', 'disciplina', 'Disciplina é liberdade', 
'A disciplina que você exerce hoje é a liberdade que você vive amanhã. — Jim Rohn', 
ARRAY['disciplina','mudanca','mentalidade'], 10, 
ARRAY['iniciante','ativo','produtivo','multiplicador','lider'], ARRAY['15-30 min','30-60 min','1-2h'], true),

('noel', 'frase_motivacional', 'comecar_pequeno', 'Começar pequeno, pensar grande', 
'Grandes histórias começam com passos pequenos — mas com intenção gigante. — Mark Hughes', 
ARRAY['visao','proposito','inicio'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'frase_motivacional', 'profissionalismo', 'Profissionalismo gera resultado', 
'Amadores tentam. Profissionais fazem até dar certo. — Eric Worre', 
ARRAY['profissional','consistencia','resultados'], 10, 
ARRAY['ativo','produtivo','multiplicador','lider'], ARRAY['30-60 min','1-2h','2-3h'], true),

('noel', 'frase_motivacional', 'potencial', 'Você é capaz de mais do que imagina', 
'O seu potencial é maior do que suas desculpas. — Jim Rohn', 
ARRAY['potencial','superacao','mentalidade'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'frase_motivacional', 'repeticao', 'O poder da repetição', 
'O que você faz repetidamente constrói o que você se torna. — Mark Hughes', 
ARRAY['consistencia','habitos','crescimento'], 9, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'frase_motivacional', 'momentum', 'Momentum é tudo', 
'Quando você está em movimento, tudo ao redor começa a se mover com você. — Mark Hughes', 
ARRAY['momentum','acao','energia'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'frase_motivacional', 'decisao', 'Você decide o ritmo', 
'Não existe dia perfeito. Existe decisão. — Eric Worre', 
ARRAY['decisao','foco','produtividade'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'frase_motivacional', 'crescimento_pessoal', 'Crescimento pessoal vem antes do financeiro', 
'Trabalhe mais em você do que no seu negócio. — Jim Rohn', 
ARRAY['crescimento','lideranca','autodesenvolvimento'], 10, 
ARRAY['produtivo','multiplicador','lider'], ARRAY['1-2h','2-3h'], true),

('noel', 'frase_motivacional', 'inspiracao', 'Você inspira quando age', 
'As pessoas seguem quem está em movimento. Seja esse movimento. — Mark Hughes', 
ARRAY['lideranca','exemplo','acao'], 9, 
ARRAY['produtivo','multiplicador','lider'], ARRAY['1-2h','2-3h'], true),

('noel', 'frase_motivacional', 'rotina', 'Profissionalismo é a base da constância', 
'Profissionais têm rotina. E rotina gera resultado. — Eric Worre', 
ARRAY['rotina','profissional','resultados'], 10, 
ARRAY['ativo','produtivo','multiplicador'], ARRAY['30-60 min','1-2h'], true),

('noel', 'frase_motivacional', 'progresso', 'Pequenos progressos importam', 
'O progresso de hoje é a vitória de amanhã. — Jim Rohn', 
ARRAY['progresso','motivacao','constancia'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'frase_motivacional', 'visao', 'Visão cria força', 
'Quando sua visão é clara, sua energia aumenta. — Mark Hughes', 
ARRAY['visao','energia','clareza'], 10, 
ARRAY['ativo','produtivo','multiplicador'], ARRAY['30-60 min','1-2h'], true),

('noel', 'frase_motivacional', 'habilidade', 'Sucesso é habilidade treinável', 
'A diferença entre os melhores e os medíocres é o treino constante. — Eric Worre', 
ARRAY['habilidade','treino','profissional'], 9, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'frase_motivacional', 'mudanca', 'Nada muda até que você mude', 
'Sua vida não melhora por acaso, melhora por mudança. — Jim Rohn', 
ARRAY['mudanca','proposito','mentalidade'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'frase_motivacional', 'oportunidade', 'Oportunidade diária', 
'Todo dia é uma chance de construir algo maior. — Mark Hughes', 
ARRAY['oportunidade','diario','crescimento'], 9, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'frase_motivacional', 'profissao', 'O segredo é tratar como profissão', 
'Quando você trata o negócio como hobby, ele te paga como hobby. Quando trata como profissão, ele te paga como profissão. — Eric Worre', 
ARRAY['profissao','postura','resultados'], 10, 
ARRAY['ativo','produtivo','multiplicador'], ARRAY['30-60 min','1-2h'], true),

('noel', 'frase_motivacional', 'energia', 'Energia atrai energia', 
'A forma como você chega determina a forma como as pessoas respondem. — Mark Hughes', 
ARRAY['energia','conexao','lideranca'], 8, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min'], true),

('noel', 'frase_motivacional', 'colheita', 'Você colhe o que planta', 
'A vida é sempre justa: você colhe exatamente o que planta. — Jim Rohn', 
ARRAY['merito','lei_da_colheita','constancia'], 10, 
ARRAY['ativo','produtivo','multiplicador'], ARRAY['30-60 min','1-2h'], true),

('noel', 'frase_motivacional', 'crenca', 'Crença é a base do crescimento', 
'Se você não acredita em você, ninguém mais acreditará. — Mark Hughes', 
ARRAY['crenca','autoestima','lideranca'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'frase_motivacional', 'inicio', 'Habilidade antes de resultado', 
'Você não precisa ser perfeito. Só precisa começar a praticar. — Eric Worre', 
ARRAY['habilidade','inicio','consistencia'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true);

-- =====================================================
-- BLOCO 6 — PROVA SOCIAL & HISTÓRIAS
-- =====================================================

INSERT INTO ylada_wellness_base_conhecimento (
  tipo_mentor, categoria, subcategoria, titulo, conteudo, tags, prioridade, estagio_negocio, tempo_disponivel, ativo
) VALUES
('noel', 'script_vendas', 'prova_social_movimento', 'Movimento crescente', 
'Essa semana várias pessoas começaram o kit de 7 dias para ter mais energia. É incrível ver como pequenos passos já fazem diferença.', 
ARRAY['movimento','kit7','energia'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_vendas', 'prova_social_similaridade', 'Gente como você está avançando', 
'Muitas pessoas com a mesma rotina corrida que você estão usando as bebidas funcionais porque cabem no dia delas. É simples e funciona muito bem.', 
ARRAY['similaridade','rotina_corrida','praticidade'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'instrucao', 'historia_comeco_simples', 'A história do começo simples', 
'Tem muita gente que começou exatamente como você: experimentando uma bebida, gostando da experiência e depois dando o próximo passo com o kit. É assim que grandes mudanças começam — simples.', 
ARRAY['historia','inicio','simples'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_vendas', 'prova_social_tendencia', 'Momentum do bem-estar', 
'O interesse por bebidas funcionais cresceu muito nos últimos meses. As pessoas querem praticidade e resultado no dia a dia — e isso gera muito movimento.', 
ARRAY['tendencia','bem_estar','praticidade'], 9, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'instrucao', 'historia_superacao', 'Superando a dúvida', 
'Muita gente achava que não teria tempo para nada… até descobrir que pequenas ações diárias transformam tudo. O progresso chega para quem continua.', 
ARRAY['historia','duvida','superacao'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_indicacao', 'prova_social_indicacao', 'Indicação espontânea', 
'Uma coisa interessante é que várias pessoas que testam as bebidas acabam indicando naturalmente. Quando algo faz bem, a gente comenta.', 
ARRAY['indicacao','natural','social'], 8, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min'], true),

('noel', 'script_vendas', 'prova_social_consistencia', 'Resultados consistentes', 
'Quem cria uma rotina com as bebidas normalmente sente diferença na disposição. A consistência sempre recompensa.', 
ARRAY['consistencia','disposicao','bem_estar'], 10, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'instrucao', 'historia_consultor_timido', 'O consultor que começou tímido', 
'Muitos consultores me contam que começaram tímidos, sem saber convidar ninguém. Depois do primeiro convite, perceberam que é mais simples do que parece. O progresso nasce da prática.', 
ARRAY['historia','iniciante','convite'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_vendas', 'prova_social_sem_tempo', 'Quem tem pouco tempo consegue', 
'Grande parte dos consultores que têm bons resultados começou sem tempo nenhum. Eles encaixaram pequenas ações no dia — e isso fez toda diferença.', 
ARRAY['sem_tempo','rotina','resultado'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'instrucao', 'historia_primeiro_passo', 'O primeiro passo muda tudo', 
'Uma coisa que vejo sempre: o primeiro passo é o mais difícil… depois disso, tudo flui. Pessoas comuns começam pequeno e constroem algo grande com consistência.', 
ARRAY['historia','primeiro_passo','consistencia'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'script_followup', 'prova_social_fidelizacao', 'Fidelização natural', 
'Muitas pessoas que começam com o kit de 7 dias acabam se tornando clientes recorrentes porque gostam da rotina e dos resultados no dia a dia.', 
ARRAY['fidelizacao','kit7','rotina'], 9, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'script_recrutamento', 'prova_social_consultor_novo', 'Consultores novos tendo resultados simples', 
'Tem muito consultor novo começando agora e já criando movimento só com as ferramentas Wellness e o Ritual 2-5-10. Simples, duplicável e funcional.', 
ARRAY['consultor_novo','duplicavel','ritual'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'instrucao', 'historia_medo_convite', 'O receio do convite', 
'Várias pessoas tinham medo de convidar… até fazer o primeiro convite e descobrir que é só uma conversa leve. A confiança nasce da ação.', 
ARRAY['historia','convite','confianca'], 8, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'instrucao', 'prova_social_comunidade', 'A comunidade está crescendo', 
'O movimento dentro do Wellness está crescendo rápido. Cada dia mais consultores estão usando as ferramentas e criando resultados consistentes.', 
ARRAY['comunidade','ylada','movimento'], 10, 
ARRAY['ativo','produtivo','multiplicador'], ARRAY['30-60 min','1-2h'], true),

('noel', 'instrucao', 'historia_jim_rohn', 'A força da consistência', 
'Jim Rohn dizia que pequenos esforços diários constroem grandes recompensas. E é isso que vemos por aqui: quem faz um pouco todo dia sempre cresce.', 
ARRAY['jim_rohn','consistencia','crescimento'], 10, 
ARRAY['ativo','produtivo','multiplicador'], ARRAY['30-60 min','1-2h'], true);

-- =====================================================
-- BLOCO 7 — FLUXOS AVANÇADOS
-- =====================================================

INSERT INTO ylada_wellness_base_conhecimento (
  tipo_mentor, categoria, subcategoria, titulo, conteudo, tags, prioridade, estagio_negocio, tempo_disponivel, ativo
) VALUES
('noel', 'fluxo_padrao', 'fechamento_kit', 'Fechamento kit 7 dias', 
'**Etapa 1 — Conexão:** "Que bom falar com você! Como está sua energia no dia a dia?"

**Etapa 2 — Diagnóstico leve:** "Muita gente que eu converso sente falta de mais disposição. Você também sente isso às vezes?"

**Etapa 3 — Proposta:** "Tenho um kit de 7 dias que ajuda muito nisso. É simples, prático e você já sente diferença nos primeiros dias. Quer que eu te mostre como funciona?"

**Fechamento:** "Posso montar o seu kit hoje mesmo. Qual horário funciona melhor pra você receber?"', 
ARRAY['kit7','vendas','fechamento'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'fluxo_padrao', 'upgrade_pote', 'Upgrade para pote fechado', 
'**Etapa 1 — Reforço do resultado:** "Você mandou muito bem no kit! Parabéns pela consistência."

**Etapa 2 — Valor:** "A maioria das pessoas que gosta do kit passa para o pote porque rende muito mais e sai mais em conta."

**Etapa 3 — Opção simples:** "Tem duas opções: pote individual ou combo. Posso te mostrar rapidinho?"

**Fechamento:** "Qual das opções você quer ver primeiro?"', 
ARRAY['upgrade','pote','continuidade'], 10, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'fluxo_padrao', 'indicacao_escala', 'Indicação em escala', 
'**Etapa 1 — Abertura leve:** "Fico muito feliz que você gostou da bebida! 💚"

**Etapa 2 — Social proof:** "Muita gente acaba indicando porque lembra de amigos que também precisam de energia."

**Etapa 3 — Pedir a indicação:** "Tem alguém que vem à sua mente agora? Eu posso cuidar dessa pessoa com o mesmo carinho."

**Fechamento:** "Pode me mandar 1 ou 2 nomes e eu faço o resto de forma super leve."', 
ARRAY['indicacao','escala','contatos'], 9, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'fluxo_padrao', 'convite_profissional', 'Convite profissional completo', 
'**Etapa 1 — Pergunta-chave:** "Posso te fazer uma pergunta? Você toparia conhecer uma forma simples de renda extra ajudando pessoas com bem-estar?"

**Etapa 2 — Validação:** "Muita gente que eu conheço está buscando isso. É algo leve, que não atrapalha o que você já faz."

**Etapa 3 — Proposta:** "Se fizer sentido, posso te mostrar como funciona em 2 minutos. É bem simples."

**Fechamento:** "Quer que eu te explique rapidinho?"', 
ARRAY['recrutamento','convite','profissional'], 10, 
ARRAY['produtivo','multiplicador','lider'], ARRAY['1-2h','2-3h'], true),

('noel', 'fluxo_padrao', 'reativacao_cliente', 'Reativação de cliente', 
'**Etapa 1 — Abertura gentil:** "Oi! 😊 Sei que a rotina às vezes aperta."

**Etapa 2 — Reconexão:** "Lembrei de você porque muita gente está voltando para o kit de 7 dias agora."

**Etapa 3 — Opção simples:** "Se fizer sentido, posso montar o seu kit novamente."

**Fechamento:** "Quer que eu te envie as opções?"', 
ARRAY['reaquecimento','followup','cliente_sumido'], 9, 
ARRAY['ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'fluxo_padrao', 'reativacao_consultor', 'Reativação de consultor', 
'**Etapa 1 — Reconexão humana:** "Ei! Lembrei de você e do seu potencial. Tudo bem por aí?"

**Etapa 2 — Prova social:** "Tem muita gente voltando a construir uma renda extra com bebidas funcionais."

**Etapa 3 — Simplicidade:** "Seu recomeço pode ser com uma ação simples hoje."

**Fechamento:** "Quer que eu te ajude a dar o primeiro passo agora?"', 
ARRAY['reativacao','consultor','motivacao'], 10, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'fluxo_padrao', 'convite_apresentacao', 'Convite para apresentação', 
'**Etapa 1 — Contexto leve:** "Vai ter uma apresentação rápida sobre o projeto que eu te falei."

**Etapa 2 — Benefício:** "É bem leve, dura uns 10 minutos e explica tudo de forma simples."

**Etapa 3 — Convite:** "Quer participar? Posso te mandar o link."

**Fechamento:** "Me avisa se quiser que eu te envie!"', 
ARRAY['apresentacao','recrutamento','convite'], 9, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'fluxo_padrao', 'pos_apresentacao', 'Pós-apresentação', 
'**Etapa 1 — Pergunta aberta:** "O que você achou da apresentação? 😊"

**Etapa 2 — Validação emocional:** "A maioria das pessoas sente exatamente isso quando vê pela primeira vez."

**Etapa 3 — Direção:** "Seu próximo passo é começar simples e ir crescendo conforme seu ritmo."

**Fechamento:** "Quer que eu te mostre como começar?"', 
ARRAY['pos_apresentacao','fechamento','recrutamento'], 10, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'fluxo_padrao', 'ativacao_consultor', 'Ativação inicial do consultor', 
'**Etapa 1 — Parabéns e acolhimento:** "Bem-vindo(a)! Você deu um passo incrível."

**Etapa 2 — Direcionamento simples:** "Seu primeiro dia tem só três tarefas: conhecer as bebidas, usar o kit e fazer 2 contatos."

**Etapa 3 — Cultura:** "Aqui a gente cresce com ações pequenas e consistentes."

**Fechamento:** "Quer que eu te mande seu plano dos primeiros 7 dias?"', 
ARRAY['onboarding','ativacao','primeiros_passos'], 10, 
ARRAY['iniciante'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'fluxo_padrao', 'orientacao_tecnica', 'Orientação técnica inicial', 
'**Etapa 1 — Pergunta central:** "Você quer começar vendendo bebidas prontas, kits ou trabalhando só indicações?"

**Etapa 2 — Estrutura:** "Com base nisso, eu te mostro a melhor rotina para seu tempo disponível."

**Etapa 3 — Direção:** "Aqui tudo foi feito para ser duplicável e leve."

**Fechamento:** "Qual caminho combina mais com você agora?"', 
ARRAY['tecnico','rotina','iniciante'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true);

-- =====================================================
-- BLOCO 9 — NOTIFICAÇÕES INTELIGENTES
-- =====================================================

INSERT INTO ylada_wellness_base_conhecimento (
  tipo_mentor, categoria, subcategoria, titulo, conteudo, tags, prioridade, estagio_negocio, tempo_disponivel, ativo
) VALUES
('noel', 'instrucao', 'ritual_5', 'Ritual 5 — Hora da ação', 
'Hora do Ritual 5! 💪 Escolha 5 ações simples: follow-up, indicação ou convite. Só faça.', 
ARRAY['ritual5','tarde','produtividade'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'instrucao', 'ritual_10', 'Ritual 10 — Fechamento do dia', 
'Feche seu dia com consciência: o que você fez hoje que aproxima você do que deseja? 10 minutos valem ouro.', 
ARRAY['ritual10','noite','reflexao'], 9, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min'], true),

('noel', 'instrucao', 'progresso_0', 'Vamos retomar?', 
'Hoje ficou parado… Mas tudo bem. Um passo agora muda seu dia. Escolha 1 microação e faça.', 
ARRAY['progresso','retomar','acao'], 10, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min'], true),

('noel', 'instrucao', 'motivacional_disciplina', 'Disciplina diária', 
'Jim Rohn dizia: a disciplina é a ponte entre sonhos e conquistas. Sua ponte te espera hoje.', 
ARRAY['motivacao','disciplina','jim_rohn'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'instrucao', 'motivacional_momentum', 'Força do movimento', 
'Momentum nasce de pequenas ações repetidas. Hoje é mais um tijolo colocado no seu futuro.', 
ARRAY['motivacao','momentum','acao'], 9, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'instrucao', 'plano_dia1', 'Seu dia 1', 
'Dia 1: Foque no simples. Ritual 2 + Ritual 5 + usar seu produto. Começar já é vitória.', 
ARRAY['plano','dia1','inicio'], 10, 
ARRAY['iniciante'], ARRAY['15-30 min'], true),

('noel', 'instrucao', 'plano_semana1', 'Semana 1', 
'Semana 1 é sobre criar ritmo. Cumpra suas microtarefas. A consistência vence a força.', 
ARRAY['plano','semana1','ritmo'], 9, 
ARRAY['iniciante','ativo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'instrucao', 'followup_cliente_quente', 'Cliente pronto', 
'Aquela pessoa mostrou interesse! Envie uma mensagem agora enquanto o momento ainda está quente.', 
ARRAY['followup','oportunidade','momento'], 10, 
ARRAY['ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'instrucao', 'recrutamento_convite', 'Seu convite do dia', 
'Envie 1 convite leve hoje. Nada formal — só abrir porta. Convites mudam vidas.', 
ARRAY['recrutamento','convite','leve'], 10, 
ARRAY['ativo','produtivo'], ARRAY['30-60 min','1-2h'], true),

('noel', 'instrucao', 'recrutamento_visao', 'Oportunidade', 
'Alguém na sua lista hoje precisa do que você tem. Mostre a visão.', 
ARRAY['recrutamento','visao','proposito'], 9, 
ARRAY['produtivo','multiplicador'], ARRAY['1-2h','2-3h'], true),

('noel', 'instrucao', 'cultura_identidade', 'Cultura YLADA', 
'Aqui na YLADA, acreditamos no simples, no duplicável e no humano. Faça o básico bem feito hoje.', 
ARRAY['cultura','ylada','identidade'], 10, 
ARRAY['iniciante','ativo','produtivo'], ARRAY['15-30 min','30-60 min'], true),

('noel', 'instrucao', 'cultura_proposito', 'Transformação', 
'Lembre-se: cada bebida entregue muda um dia de alguém. Cada conversa abre uma porta. Você faz parte de algo maior.', 
ARRAY['cultura','proposito','impacto'], 10, 
ARRAY['ativo','produtivo','multiplicador'], ARRAY['30-60 min','1-2h'], true);

COMMIT;

-- =====================================================
-- RESUMO
-- =====================================================
-- Bloco 1: 10 scripts de vendas
-- Bloco 2: 14 scripts de indicação
-- Bloco 3: 15 scripts de recrutamento
-- Bloco 4: 15 scripts de follow-up
-- Bloco 5: 20 frases motivacionais
-- Bloco 6: 15 scripts de prova social/histórias
-- Bloco 7: 10 fluxos completos
-- Bloco 9: 12 notificações
-- TOTAL: 111 registros inseridos

