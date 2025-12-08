-- =====================================================
-- WELLNESS SYSTEM - SEED DE SCRIPTS COMPLETO
-- Baseado nas Lousas Completas do NOEL Wellness
-- =====================================================

BEGIN;

-- Garantir que todas as colunas necessárias existem
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'nome'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_scripts' 
      AND column_name = 'titulo'
    ) THEN
      ALTER TABLE wellness_scripts RENAME COLUMN titulo TO nome;
    ELSE
      ALTER TABLE wellness_scripts ADD COLUMN nome VARCHAR(255);
    END IF;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'versao'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN versao VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'conteudo'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN conteudo TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'categoria'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN categoria VARCHAR(50);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'subcategoria'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN subcategoria VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN tags TEXT[];
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'ordem'
  ) THEN
    ALTER TABLE wellness_scripts ADD COLUMN ordem INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_scripts' 
    AND column_name = 'ativo'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'wellness_scripts' 
      AND column_name = 'is_ativo'
    ) THEN
      ALTER TABLE wellness_scripts RENAME COLUMN is_ativo TO ativo;
    ELSE
      ALTER TABLE wellness_scripts ADD COLUMN ativo BOOLEAN DEFAULT true;
    END IF;
  END IF;
END $$;

-- =====================================================
-- BLOCO 1 — SCRIPTS DE VENDAS DE BEBIDAS FUNCIONAIS
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('vendas', 'abordagem_inicial', 'Abordagem leve — teste por R$10', 'curta',
 'Oi! 😊 Estou ajudando algumas pessoas a terem mais energia e foco no dia com uma bebida funcional super leve. Estou oferecendo um teste por apenas R$10 para quem quiser sentir na prática. Quer experimentar hoje?',
 ARRAY['iniciante', 'bebidas', 'conversa', 'primeiro_contato'], 1, true),

('vendas', 'stories', 'Interação em stories', 'curta',
 'Percebi que você viu meus stories das bebidas! 🥤✨ Quer sentir o efeito também? Posso preparar uma por R$10 pra você experimentar quando quiser. É rapidinho!',
 ARRAY['stories', 'abordagem', 'interesse'], 2, true),

('vendas', 'conversao', 'Experimentou → Kit 7 dias', 'media',
 'Que bom que você gostou da bebida! 😊 A maioria das pessoas que sente o efeito já começa com o kit de 7 dias — ele é simples, prático e ajuda você a ter um resultado mais consistente. Quer que eu te mostre como funciona?',
 ARRAY['kit7', 'conversao', 'experiencia'], 3, true),

('vendas', 'followup', 'Follow-up gentil', 'curta',
 'Oi! Só passando aqui rapidinho. Se quiser, preparo a bebida pra você ainda hoje. 😊 Me avisa qual horário funciona melhor!',
 ARRAY['followup', 'leve', 'bebidas'], 4, true),

('vendas', 'pos_bebida', 'Como você se sentiu?', 'media',
 'Oi! Como você se sentiu depois da sua bebida ontem? 🥤✨ Muitas pessoas percebem mais energia logo nos primeiros dias. Se quiser manter essa sensação, posso montar o kit de 7 dias pra você. Quer ver como é simples?',
 ARRAY['followup', 'kit7', 'experiencia', 'emocional'], 5, true),

('bebidas', 'oferta', 'Kit 7 dias', 'curta',
 'Preparei aqui uma explicação simples do kit de 7 dias! Ele é perfeito para quem quer mais disposição e uma rotina melhor. 💚 Quer que eu te envie agora? Leva menos de 1 minuto para entender.',
 ARRAY['kit7', 'vendas', 'clareza'], 6, true),

('bebidas', 'upgrade', 'Pote fechado', 'curta',
 'Você foi muito bem no kit! 👏 Se quiser continuar e economizar, o pote fechado compensa muito — dura mais e sai mais barato por dose. Quer que eu te mostre as opções?',
 ARRAY['upgrade', 'pote', 'economia'], 7, true),

('vendas', 'stories', 'Chamada no story', 'curta',
 'Preparando algumas bebidas funcionais hoje 🥤✨ Quem quiser testar uma por R$10, me chama aqui! Faço na hora e entrego rapidinho. 💚',
 ARRAY['stories', 'cta', 'bebidas'], 8, true),

('vendas', 'lista_quente', 'Lista quente', 'curta',
 'Oi! Comecei um projeto novo com bebidas funcionais e queria muito que você experimentasse. Estou oferecendo uma por R$10 pra quem é mais próximo. Posso colocar seu nome na lista de hoje? 😊',
 ARRAY['lista_quente', 'bebidas', 'conexao'], 9, true),

('bebidas', 'indicacao', 'Indicação após degustação', 'curta',
 'Adorei que você gostou da bebida! 💚 Se lembrar de alguém que também gostaria de testar, posso preparar uma hoje mesmo. Só me avisar!',
 ARRAY['indicacao', 'degustacao', 'bebidas'], 10, true);

-- =====================================================
-- BLOCO 2 — SCRIPTS DE INDICAÇÃO
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('script_indicacao', 'pos_bebida', 'Indicação leve após degustação', 'curta',
 'Fico feliz que gostou da bebida! 🥤💚 Se alguém da sua família ou amigos também quiser sentir essa energia, posso preparar uma pra eles hoje. Só me avisar!',
 ARRAY['indicacao', 'degustacao', 'leve', 'familia'], 11, true),

('script_indicacao', 'reciprocidade', 'Me ajuda rapidinho?', 'curta',
 'Estou montando uma lista de pessoas que gostam de cuidar da saúde e estou enviando uma bebida funcional de teste. Você poderia me indicar 1 ou 2 pessoas que você acha que iriam gostar? 😊',
 ARRAY['reciprocidade', 'ajuda', 'lista', 'indicacao'], 12, true),

('script_indicacao', 'prova_social', 'Quando a pessoa gostou e relatou benefício', 'curta',
 'Que legal que você sentiu o resultado! ✨ Muitas pessoas que gostam acabam indicando alguém próximo para testar também. Tem alguém que você acha que iria curtir essa experiência?',
 ARRAY['prova_social', 'resultado', 'experiencia'], 13, true),

('script_indicacao', 'direcionada', 'Indicação específica', 'curta',
 'Se você pudesse indicar só uma pessoa que está sempre buscando mais disposição — quem seria? Posso enviar uma bebida de teste pra ela hoje mesmo. 😊',
 ARRAY['direcionada', 'claridade', 'um_nome'], 14, true),

('script_indicacao', 'nao_comprou', 'Quando a pessoa não fechou a compra', 'curta',
 'Sem problemas! 💚 E se você lembrar de alguém que gostaria de testar, posso preparar uma bebida funcional pra essa pessoa hoje!',
 ARRAY['nao_comprou', 'indicacao', 'leve'], 15, true),

('script_indicacao', 'pos_kit', 'Indicação pós kit', 'curta',
 'Você foi muito bem no kit! 👏 Normalmente quem faz o kit já pensa em alguém que poderia começar com você. Tem alguém que você gostaria que fizesse junto?',
 ARRAY['kit7', 'indicacao', 'grupo', 'companhia'], 16, true),

('script_indicacao', 'familia', 'Família primeiro', 'curta',
 'Essas bebidas ajudam muito na rotina! Algum familiar seu gostaria de testar também? Posso enviar uma mensagem pra ele(a) se quiser.',
 ARRAY['familia', 'indicacao', 'rotina'], 17, true),

('script_indicacao', 'trabalho', 'Para o ambiente de trabalho', 'curta',
 'Tem alguém no seu trabalho que vive dizendo que está cansado(a) ou sem disposição? Posso preparar uma bebida funcional pra essa pessoa hoje!',
 ARRAY['trabalho', 'indicacao', 'cansaco'], 18, true),

('script_indicacao', 'pertencimento', 'Quem faria parte do seu grupo?', 'curta',
 'Se você fosse montar um grupo de pessoas para ter mais disposição no dia a dia… quem seria a primeira pessoa que colocaria?',
 ARRAY['pertencimento', 'grupo', 'social'], 19, true),

('script_indicacao', 'ferramentas', 'Indicação oferecendo valor', 'curta',
 'Estou enviando para algumas pessoas um teste rápido do Wellness (quantidade de água, proteína e rotina). Quer indicar alguém para fazer também? É gratuito e ajuda muito! 💚',
 ARRAY['ferramentas', 'gratuito', 'valor', 'indicacao'], 20, true),

('script_indicacao', 'relatorio', 'Após análise do Wellness', 'curta',
 'Preparei seu relatório! Ele ficou ótimo! ✨ Se quiser indicar alguém para receber um relatório também, posso enviar o link pra essa pessoa agora mesmo.',
 ARRAY['relatorio', 'valor', 'indicacao'], 21, true),

('script_indicacao', 'empolgado', 'Quando a pessoa demonstra empolgação', 'curta',
 'Adorei sua energia! 🙌 Quando alguém fica assim animado, normalmente lembra de mais alguém que gostaria de sentir o mesmo. Quem te vem à cabeça agora?',
 ARRAY['empolgado', 'momento_quente', 'indicacao'], 22, true),

('script_indicacao', 'um_nome', 'Só 1 pessoa', 'curta',
 'Se você pudesse indicar apenas uma pessoa que gostaria de ter mais disposição no dia… quem seria?',
 ARRAY['um_nome', 'reduzir_atrito', 'indicacao'], 23, true),

('script_indicacao', 'suave', 'Indicação suave', 'curta',
 'Se algum nome te vier na cabeça depois, me manda! Às vezes aparece alguém que está precisando de algo simples para melhorar o dia. 💚',
 ARRAY['suave', 'indicacao', 'sem_pressao'], 24, true);

-- =====================================================
-- BLOCO 3 — SCRIPTS DE RECRUTAMENTO LEVE
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('script_recrutamento', 'convite_leve', 'Convite leve', 'curta',
 'Posso te perguntar uma coisa? 😊 Você é alguém que toparia conhecer uma forma simples de ganhar uma renda extra ajudando pessoas com bem-estar? Sem compromisso, só pra entender se combina com você.',
 ARRAY['convite_leve', 'curiosidade', 'renda_extra'], 25, true),

('script_recrutamento', 'perfil', 'Você já tem o perfil', 'curta',
 'Pelo jeito que você gosta de cuidar das pessoas, você tem exatamente o perfil que mais tem resultado no meu projeto. 💚 Se quiser, te mostro como funciona de um jeito bem simples.',
 ARRAY['perfil', 'bem_estar', 'convite'], 26, true),

('script_recrutamento', 'resultado', 'Você já vive o produto', 'curta',
 'Eu preciso te dizer: do jeito que você gostou dos produtos, você já está vivendo metade do negócio! 😄 Se quiser entender como transformar isso em renda, posso te explicar rapidinho.',
 ARRAY['resultado', 'produtos', 'convite'], 27, true),

('script_recrutamento', 'indicacao', 'Quando te pedem informação', 'curta',
 'Você sempre indica coisas boas para as pessoas… já pensou em ser recompensado(a) por isso? Posso te mostrar como funciona. 👇',
 ARRAY['indicacao', 'convite', 'lideranca'], 28, true),

('script_recrutamento', 'visao', 'Visão de futuro', 'curta',
 'Você já imaginou onde poderia estar em 1 ano se começasse algo simples hoje? Muitas pessoas subestimam o poder de começar pequeno — mas é assim que grandes histórias nascem. ✨',
 ARRAY['visao', 'futuro', 'inspiracao'], 29, true),

('script_recrutamento', 'renda_extra', 'Renda extra simples', 'curta',
 'Se você está buscando uma renda extra que não atrapalha o que você já faz, eu consigo te mostrar um caminho bem acessível — e com apoio desde o primeiro dia.',
 ARRAY['renda_extra', 'acessivel', 'simples'], 30, true),

('script_recrutamento', 'multiplicador', 'Você tem perfil de multiplicador(a)', 'curta',
 'Pelo jeito que você lembrou de pessoas para indicar, você tem um perfil natural de multiplicador(a). Isso é muito valioso no meu projeto. 💚 Se quiser ver como funciona, posso te mostrar rapidinho.',
 ARRAY['indicacao', 'multiplicador', 'convite'], 31, true),

('script_recrutamento', 'empreendedor', 'Expansão de negócios', 'curta',
 'Como empreendedor(a), você sabe reconhecer oportunidades. O meu projeto tem um modelo de expansão muito inteligente — se quiser, te mostro como funciona.',
 ARRAY['empreendedor', 'visao', 'expansao'], 32, true),

('script_recrutamento', 'sem_tempo', 'Para quem não tem tempo', 'curta',
 'Posso ser sincero(a)? As pessoas com menos tempo são as que mais valorizam um projeto que se encaixa na rotina sem atrapalhar nada. Se quiser conhecer, te mostro o básico em 2 minutos.',
 ARRAY['sem_tempo', 'convite', 'rotina'], 33, true),

('script_recrutamento', 'carisma', 'Seu carisma funciona aqui', 'curta',
 'Você tem uma presença que as pessoas escutam. Isso faz toda diferença no meu projeto. Se quiser entender como transformar isso em algo maior, posso te explicar.',
 ARRAY['carisma', 'influencia', 'lideranca'], 34, true),

('script_recrutamento', 'mudanca', 'Mudança começa com uma decisão', 'curta',
 'Nada muda até que você mude. 😊 Se você está buscando algo novo, algo que abre portas… talvez esse projeto seja uma oportunidade perfeita para começar uma nova fase.',
 ARRAY['mudanca', 'jim_rohn', 'inspiracao'], 35, true),

('script_recrutamento', 'momentum', 'Aproveitar o momentum', 'curta',
 'Adorei sua energia! Quando alguém está assim, é o melhor momento para começar algo novo. Se quiser, te mostro como iniciar com passos simples.',
 ARRAY['momentum', 'inspiracao', 'convite'], 36, true),

('script_recrutamento', 'proposito', 'Propósito e impacto', 'curta',
 'Se você gosta de ajudar pessoas a se sentirem melhor, esse projeto pode ser um espaço incrível pra você. É simples, é duplicável e transforma vidas.',
 ARRAY['proposito', 'impacto', 'bem_estar'], 37, true),

('script_recrutamento', 'zero_pressao', 'Zero pressão', 'curta',
 'Se algum dia você quiser entender como funciona o meu projeto, me avisa. É algo simples, mas que tem feito muita diferença para várias pessoas. 💚',
 ARRAY['leve', 'sem_pressao', 'convite'], 38, true),

('script_recrutamento', 'financeiro', 'Fase financeira', 'curta',
 'Se você sente que está na hora de dar um passo financeiro diferente, eu posso te mostrar um caminho que muitas pessoas estão seguindo com resultados reais.',
 ARRAY['financeiro', 'mudanca', 'convite'], 39, true);

-- =====================================================
-- BLOCO 4 — SCRIPTS DE FOLLOW-UP PROFISSIONAL
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('script_followup', '24h', 'Como você se sentiu ontem?', 'media',
 'Ei! 😊 Como você se sentiu depois da bebida de ontem? Muita gente nota um ânimo diferente logo nos primeiros dias. Se quiser, posso montar o kit de 7 dias pra você começar de verdade.',
 ARRAY['24h', 'degustacao', 'kit7', 'experiencia'], 40, true),

('script_followup', '3dias', 'Mantendo o processo', 'curta',
 'Passaram alguns dias desde que você testou a bebida… e normalmente é aqui que a ficha cai. 😊 Se você quiser dar continuidade, o kit de 7 dias é o próximo passo natural. Te explico rapidinho se quiser!',
 ARRAY['3dias', 'continuidade', 'kit7'], 41, true),

('script_followup', '7dias', 'Sua semana poderia começar diferente', 'curta',
 'Fechando a semana por aqui e lembrei de você! ✨ Imagine começar a próxima com mais energia e foco. Se fizer sentido, o kit de 7 dias é perfeito para isso.',
 ARRAY['7dias', 'decisao', 'kit7'], 42, true),

('script_followup', 'sumiu', 'Sumiço gentil', 'curta',
 'Oi! 😊 Sei que a correria às vezes aperta. Só passei para dizer que, se ainda quiser experimentar a bebida ou conhecer o kit, estou aqui. Sem pressa nenhuma!',
 ARRAY['sumiu', 'leve', 'gentil'], 43, true),

('script_followup', 'interesse', 'Você ainda tem interesse?', 'curta',
 'Vi aqui que conversamos sobre o kit e você chegou a pedir detalhes. Ainda faz sentido para você? Se quiser, te mando de novo. 💚',
 ARRAY['interesse', 'reabrir_conversa', 'kit7'], 44, true),

('script_followup', 'upgrade', 'Próximo passo natural', 'curta',
 'Você mandou bem no kit! 👏 Se quiser continuar economizando e mantendo resultados, o pote fechado compensa muito. Quer ver as opções?',
 ARRAY['upgrade', 'pote', 'continuidade'], 45, true),

('script_followup', 'satisfeito', 'Quando a pessoa gostou', 'curta',
 'Fico feliz que você gostou! 🥤✨ A maioria das pessoas que sente esse resultado logo no começo já segue com o kit de 7 dias para consolidar. Posso montar o seu?',
 ARRAY['satisfeito', 'kit7', 'continuidade'], 46, true),

('script_followup', 'pergunta', 'Pergunta decisiva', 'curta',
 'Se você fosse começar hoje, qual seria seu objetivo principal com as bebidas? Energia? Foco? Rotina melhor? Assim te indico o melhor kit.',
 ARRAY['pergunta', 'estrategico', 'decisao'], 47, true),

('script_followup', 'reaquecimento', 'Reativação suave', 'curta',
 'Oi! Dei uma olhada aqui nas minhas mensagens e lembrei de você. 😊 Se ainda quiser experimentar a bebida ou ver os kits, posso te ajudar agora!',
 ARRAY['reaquecimento', 'suave', 'conexao'], 48, true),

('script_followup', 'indicacao', 'Sua indicação foi ótima!', 'curta',
 'Sua indicação adorou a bebida! 💚 Obrigado(a) por confiar. Se quiser, posso preparar algo especial para você também continuar o processo.',
 ARRAY['indicacao', 'prova_social', 'agradecimento'], 49, true),

('script_followup', 'recrutamento', 'O que você achou?', 'curta',
 'O que você achou da oportunidade? 😊 Se alguma parte chamou sua atenção, posso te explicar com mais calma. A decisão é sempre sua — eu só estou aqui para te dar clareza.',
 ARRAY['recrutamento', 'pos_apresentacao', 'clareza'], 50, true),

('script_followup', 'tempo', 'Respeito + lembrete', 'curta',
 'Perfeito, eu respeito totalmente seu tempo. 💚 Só passando para deixar claro que, quando quiser entender melhor ou começar, estarei aqui. Enquanto isso, posso te enviar conteúdos que ajudam?',
 ARRAY['tempo', 'gentileza', 'sem_pressao'], 51, true),

('script_followup', 'recusa', 'Recusa elegante', 'curta',
 'Sem problemas algum! 😄 Só saiba que, se algum dia fizer sentido para você, vai ser um prazer te ajudar. E se quiser indicar alguém, posso cuidar dessa pessoa com o mesmo carinho.',
 ARRAY['recusa', 'classe', 'profissional'], 52, true),

('script_followup', 'emocional', 'Lembrete emocional', 'curta',
 'Ei… lembrei do que você me disse sobre querer mais disposição no dia a dia. Isso ainda é importante para você? Se for, posso te ajudar a começar hoje mesmo.',
 ARRAY['emocional', 'importancia', 'retomar'], 53, true),

('script_followup', 'prova_social', 'Muitas pessoas estão começando', 'curta',
 'Esta semana várias pessoas começaram o kit de 7 dias e estão adorando os resultados! ✨ Se você quiser fazer parte também, posso montar o seu agora.',
 ARRAY['prova_social', 'kit7', 'novos_clientes'], 54, true);

-- =====================================================
-- BLOCO 5 — MOTIVAÇÃO & LIDERANÇA
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('frase_motivacional', 'disciplina', 'Disciplina é liberdade', 'curta',
 'A disciplina que você exerce hoje é a liberdade que você vive amanhã. — Jim Rohn',
 ARRAY['disciplina', 'mudanca', 'mentalidade'], 55, true),

('frase_motivacional', 'visao', 'Começar pequeno, pensar grande', 'curta',
 'Grandes histórias começam com passos pequenos — mas com intenção gigante. — Mark Hughes',
 ARRAY['visao', 'proposito', 'inicio'], 56, true),

('frase_motivacional', 'profissional', 'Profissionalismo gera resultado', 'curta',
 'Amadores tentam. Profissionais fazem até dar certo. — Eric Worre',
 ARRAY['profissional', 'consistencia', 'resultados'], 57, true),

('frase_motivacional', 'potencial', 'Você é capaz de mais do que imagina', 'curta',
 'O seu potencial é maior do que suas desculpas. — Jim Rohn',
 ARRAY['potencial', 'superacao', 'mentalidade'], 58, true),

('frase_motivacional', 'consistencia', 'O poder da repetição', 'curta',
 'O que você faz repetidamente constrói o que você se torna. — Mark Hughes',
 ARRAY['consistencia', 'habitos', 'crescimento'], 59, true),

('frase_motivacional', 'momentum', 'Momentum é tudo', 'curta',
 'Quando você está em movimento, tudo ao redor começa a se mover com você. — Mark Hughes',
 ARRAY['momentum', 'acao', 'energia'], 60, true),

('frase_motivacional', 'decisao', 'Você decide o ritmo', 'curta',
 'Não existe dia perfeito. Existe decisão. — Eric Worre',
 ARRAY['decisao', 'foco', 'produtividade'], 61, true),

('frase_motivacional', 'crescimento', 'Crescimento pessoal vem antes do financeiro', 'curta',
 'Trabalhe mais em você do que no seu negócio. — Jim Rohn',
 ARRAY['crescimento', 'lideranca', 'autodesenvolvimento'], 62, true),

('frase_motivacional', 'lideranca', 'Você inspira quando age', 'curta',
 'As pessoas seguem quem está em movimento. Seja esse movimento. — Mark Hughes',
 ARRAY['lideranca', 'exemplo', 'acao'], 63, true),

('frase_motivacional', 'rotina', 'Profissionalismo é a base da constância', 'curta',
 'Profissionais têm rotina. E rotina gera resultado. — Eric Worre',
 ARRAY['rotina', 'profissional', 'resultados'], 64, true),

('frase_motivacional', 'progresso', 'Pequenos progressos importam', 'curta',
 'O progresso de hoje é a vitória de amanhã. — Jim Rohn',
 ARRAY['progresso', 'motivacao', 'constancia'], 65, true),

('frase_motivacional', 'visao', 'Visão cria força', 'curta',
 'Quando sua visão é clara, sua energia aumenta. — Mark Hughes',
 ARRAY['visao', 'energia', 'clareza'], 66, true),

('frase_motivacional', 'habilidade', 'Sucesso é habilidade treinável', 'curta',
 'A diferença entre os melhores e os medíocres é o treino constante. — Eric Worre',
 ARRAY['habilidade', 'treino', 'profissional'], 67, true),

('frase_motivacional', 'mudanca', 'Nada muda até que você mude', 'curta',
 'Sua vida não melhora por acaso, melhora por mudança. — Jim Rohn',
 ARRAY['mudanca', 'proposito', 'mentalidade'], 68, true),

('frase_motivacional', 'oportunidade', 'Oportunidade diária', 'curta',
 'Todo dia é uma chance de construir algo maior. — Mark Hughes',
 ARRAY['oportunidade', 'diario', 'crescimento'], 69, true),

('frase_motivacional', 'profissao', 'O segredo é tratar como profissão', 'curta',
 'Quando você trata o negócio como hobby, ele te paga como hobby. Quando trata como profissão, ele te paga como profissão. — Eric Worre',
 ARRAY['profissao', 'postura', 'resultados'], 70, true),

('frase_motivacional', 'energia', 'Energia atrai energia', 'curta',
 'A forma como você chega determina a forma como as pessoas respondem. — Mark Hughes',
 ARRAY['energia', 'conexao', 'lideranca'], 71, true),

('frase_motivacional', 'merito', 'Você colhe o que planta', 'curta',
 'A vida é sempre justa: você colhe exatamente o que planta. — Jim Rohn',
 ARRAY['merito', 'lei_da_colheita', 'constancia'], 72, true),

('frase_motivacional', 'crenca', 'Crença é a base do crescimento', 'curta',
 'Se você não acredita em você, ninguém mais acreditará. — Mark Hughes',
 ARRAY['crenca', 'autoestima', 'lideranca'], 73, true),

('frase_motivacional', 'inicio', 'Habilidade antes de resultado', 'curta',
 'Você não precisa ser perfeito. Só precisa começar a praticar. — Eric Worre',
 ARRAY['habilidade', 'inicio', 'consistencia'], 74, true);

-- =====================================================
-- BLOCO 6 — PROVA SOCIAL & HISTÓRIAS
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('script_prova_social', 'movimento', 'Movimento crescente', 'curta',
 'Essa semana várias pessoas começaram o kit de 7 dias para ter mais energia. É incrível ver como pequenos passos já fazem diferença.',
 ARRAY['movimento', 'kit7', 'energia'], 75, true),

('script_prova_social', 'similaridade', 'Similaridade', 'curta',
 'Muitas pessoas com a mesma rotina corrida que você estão usando as bebidas funcionais porque cabem no dia delas. É simples e funciona muito bem.',
 ARRAY['similaridade', 'rotina_corrida', 'praticidade'], 76, true),

('script_historia', 'inicio', 'A história do começo simples', 'curta',
 'Tem muita gente que começou exatamente como você: experimentando uma bebida, gostando da experiência e depois dando o próximo passo com o kit. É assim que grandes mudanças começam — simples.',
 ARRAY['historia', 'inicio', 'simples'], 77, true),

('script_prova_social', 'tendencia', 'Crescimento do interesse', 'curta',
 'O interesse por bebidas funcionais cresceu muito nos últimos meses. As pessoas querem praticidade e resultado no dia a dia — e isso gera muito movimento.',
 ARRAY['tendencia', 'bem_estar', 'praticidade'], 78, true),

('script_historia', 'duvida', 'Superando a dúvida', 'curta',
 'Muita gente achava que não teria tempo para nada… até descobrir que pequenas ações diárias transformam tudo. O progresso chega para quem continua.',
 ARRAY['historia', 'duvida', 'superacao'], 79, true),

('script_prova_social', 'indicacao', 'Indicação espontânea', 'curta',
 'Uma coisa interessante é que várias pessoas que testam as bebidas acabam indicando naturalmente. Quando algo faz bem, a gente comenta.',
 ARRAY['indicacao', 'natural', 'social'], 80, true),

('script_prova_social', 'consistencia', 'Consistência do uso', 'curta',
 'Quem cria uma rotina com as bebidas normalmente sente diferença na disposição. A consistência sempre recompensa.',
 ARRAY['consistencia', 'disposicao', 'bem_estar'], 81, true),

('script_historia', 'iniciante', 'O consultor que começou tímido', 'curta',
 'Muitos consultores me contam que começaram tímidos, sem saber convidar ninguém. Depois do primeiro convite, perceberam que é mais simples do que parece. O progresso nasce da prática.',
 ARRAY['historia', 'iniciante', 'convite'], 82, true),

('script_prova_social', 'sem_tempo', 'Rotina apertada', 'curta',
 'Grande parte dos consultores que têm bons resultados começou sem tempo nenhum. Eles encaixaram pequenas ações no dia — e isso fez toda diferença.',
 ARRAY['sem_tempo', 'rotina', 'resultado'], 83, true),

('script_historia', 'primeiro_passo', 'O primeiro passo muda tudo', 'curta',
 'Uma coisa que vejo sempre: o primeiro passo é o mais difícil… depois disso, tudo flui. Pessoas comuns começam pequeno e constroem algo grande com consistência.',
 ARRAY['historia', 'primeiro_passo', 'consistencia'], 84, true),

('script_prova_social', 'fidelizacao', 'Fidelização natural', 'curta',
 'Muitas pessoas que começam com o kit de 7 dias acabam se tornando clientes recorrentes porque gostam da rotina e dos resultados no dia a dia.',
 ARRAY['fidelizacao', 'kit7', 'rotina'], 85, true),

('script_prova_social', 'consultor_novo', 'Novos consultores', 'curta',
 'Tem muito consultor novo começando agora e já criando movimento só com as ferramentas Wellness e o Ritual 2-5-10. Simples, duplicável e funcional.',
 ARRAY['consultor_novo', 'duplicavel', 'ritual'], 86, true),

('script_historia', 'convite', 'O receio do convite', 'curta',
 'Várias pessoas tinham medo de convidar… até fazer o primeiro convite e descobrir que é só uma conversa leve. A confiança nasce da ação.',
 ARRAY['historia', 'convite', 'confianca'], 87, true),

('script_prova_social', 'comunidade', 'A comunidade está crescendo', 'curta',
 'O movimento dentro do Wellness está crescendo rápido. Cada dia mais consultores estão usando as ferramentas e criando resultados consistentes.',
 ARRAY['comunidade', 'ylada', 'movimento'], 88, true),

('script_historia', 'jim_rohn', 'A colheita diária', 'curta',
 'Jim Rohn dizia que pequenos esforços diários constroem grandes recompensas. E é isso que vemos por aqui: quem faz um pouco todo dia sempre cresce.',
 ARRAY['jim_rohn', 'consistencia', 'crescimento'], 89, true);

-- =====================================================
-- BLOCO 7 — FLUXOS AVANÇADOS
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('fluxo_vendas', 'fechamento', 'Fechamento kit 7 dias', 'longa',
 'Etapa 1 — Conexão: "Que bom falar com você! Como está sua energia no dia a dia?"',
 ARRAY['fluxo', 'vendas', 'kit7'], 90, true),

('fluxo_vendas', 'upgrade', 'Upgrade para pote fechado', 'longa',
 'Etapa 1 — Reforço do resultado: "Você mandou muito bem no kit! Parabéns pela consistência." Etapa 2 — Valor: "A maioria das pessoas que gosta do kit passa para o pote porque rende muito mais e sai mais em conta." Etapa 3 — Opção simples: "Tem duas opções: pote individual ou combo. Posso te mostrar rapidinho?" Fechamento: "Qual das opções você quer ver primeiro?"',
 ARRAY['upgrade', 'pote', 'continuidade'], 91, true),

('fluxo_indicacao', 'escala', 'Indicação em escala', 'longa',
 'Etapa 1 — Abertura leve: "Fico muito feliz que você gostou da bebida! 💚" Etapa 2 — Social proof: "Muita gente acaba indicando porque lembra de amigos que também precisam de energia." Etapa 3 — Pedir a indicação: "Tem alguém que vem à sua mente agora? Eu posso cuidar dessa pessoa com o mesmo carinho." Fechamento: "Pode me mandar 1 ou 2 nomes e eu faço o resto de forma super leve."',
 ARRAY['indicacao', 'escala', 'contatos'], 92, true),

('fluxo_recrutamento', 'convite', 'Convite profissional completo', 'longa',
 'Etapa 1 — Pergunta-chave: "Posso te fazer uma pergunta? Você toparia conhecer uma forma simples de renda extra ajudando pessoas com bem-estar?"',
 ARRAY['fluxo', 'recrutamento', 'convite'], 93, true),

('fluxo_followup', 'reaquecimento', 'Reativação de cliente', 'longa',
 'Etapa 1 — Abertura gentil: "Oi! 😊 Sei que a rotina às vezes aperta." Etapa 2 — Reconexão: "Lembrei de você porque muita gente está voltando para o kit de 7 dias agora." Etapa 3 — Opção simples: "Se fizer sentido, posso montar o seu kit novamente." Fechamento: "Quer que eu te envie as opções?"',
 ARRAY['reaquecimento', 'followup', 'cliente_sumido'], 94, true),

('fluxo_recrutamento', 'reativacao', 'Reativação de consultor', 'longa',
 'Etapa 1 — Reconexão humana: "Ei! Lembrei de você e do seu potencial. Tudo bem por aí?" Etapa 2 — Prova social: "Tem muita gente voltando a construir uma renda extra com bebidas funcionais." Etapa 3 — Simplicidade: "Seu recomeço pode ser com uma ação simples hoje." Fechamento: "Quer que eu te ajude a dar o primeiro passo agora?"',
 ARRAY['reativacao', 'consultor', 'motivacao'], 95, true),

('fluxo_recrutamento', 'apresentacao', 'Convite para apresentação', 'longa',
 'Etapa 1 — Contexto leve: "Vai ter uma apresentação rápida sobre o projeto que eu te falei."',
 ARRAY['fluxo', 'recrutamento', 'hom'], 96, true),

('fluxo_recrutamento', 'pos_apresentacao', 'Pós-apresentação', 'longa',
 'Etapa 1 — Pergunta aberta: "O que você achou da apresentação? 😊" Etapa 2 — Validação emocional: "A maioria das pessoas sente exatamente isso quando vê pela primeira vez." Etapa 3 — Direção: "Seu próximo passo é começar simples e ir crescendo conforme seu ritmo." Fechamento: "Quer que eu te mostre como começar?"',
 ARRAY['pos_apresentacao', 'fechamento', 'recrutamento'], 97, true),

('fluxo_onboarding', 'ativacao', 'Ativação inicial do consultor', 'longa',
 'Etapa 1 — Parabéns e acolhimento: "Bem-vindo(a)! Você deu um passo incrível." Etapa 2 — Direcionamento simples: "Seu primeiro dia tem só três tarefas: conhecer as bebidas, usar o kit e fazer 2 contatos." Etapa 3 — Cultura: "Aqui a gente cresce com ações pequenas e consistentes." Fechamento: "Quer que eu te mande seu plano dos primeiros 7 dias?"',
 ARRAY['onboarding', 'ativacao', 'primeiros_passos'], 98, true),

('fluxo_tecnico', 'orientacao', 'Orientação técnica inicial', 'longa',
 'Etapa 1 — Pergunta central: "Você quer começar vendendo bebidas prontas, kits ou trabalhando só indicações?" Etapa 2 — Estrutura: "Com base nisso, eu te mostro a melhor rotina para seu tempo disponível." Etapa 3 — Direção: "Aqui tudo foi feito para ser duplicável e leve." Fechamento: "Qual caminho combina mais com você agora?"',
 ARRAY['tecnico', 'rotina', 'iniciante'], 99, true);

-- =====================================================
-- BLOCO 9 — NOTIFICAÇÕES INTELIGENTES
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('notificacao_ritual', 'ritual5', 'Ritual 5 — Hora da ação', 'curta',
 'Hora do Ritual 5! 💪 Escolha 5 ações simples: follow-up, indicação ou convite. Só faça.',
 ARRAY['ritual5', 'tarde', 'produtividade'], 100, true),

('notificacao_ritual', 'ritual10', 'Ritual 10 — Fechamento do dia', 'curta',
 'Feche seu dia com consciência: o que você fez hoje que aproxima você do que deseja? 10 minutos valem ouro.',
 ARRAY['ritual10', 'noite', 'reflexao'], 101, true),

('notificacao_progresso', 'retomar', 'Vamos retomar?', 'curta',
 'Hoje ficou parado… Mas tudo bem. Um passo agora muda seu dia. Escolha 1 microação e faça.',
 ARRAY['progresso', 'retomar', 'acao'], 102, true),

('notificacao_motivacional', 'disciplina', 'Disciplina diária', 'curta',
 'Jim Rohn dizia: a disciplina é a ponte entre sonhos e conquistas. Sua ponte te espera hoje.',
 ARRAY['motivacao', 'disciplina', 'jim_rohn'], 103, true),

('notificacao_motivacional', 'momentum', 'Força do movimento', 'curta',
 'Momentum nasce de pequenas ações repetidas. Hoje é mais um tijolo colocado no seu futuro.',
 ARRAY['motivacao', 'momentum', 'acao'], 104, true),

('notificacao_plano', 'dia1', 'Seu dia 1', 'curta',
 'Dia 1: Foque no simples. Ritual 2 + Ritual 5 + usar seu produto. Começar já é vitória.',
 ARRAY['plano', 'dia1', 'inicio'], 105, true),

('notificacao_plano', 'semana1', 'Semana 1', 'curta',
 'Semana 1 é sobre criar ritmo. Cumpra suas microtarefas. A consistência vence a força.',
 ARRAY['plano', 'semana1', 'ritmo'], 106, true),

('notificacao_followup', 'oportunidade', 'Cliente pronto', 'curta',
 'Aquela pessoa mostrou interesse! Envie uma mensagem agora enquanto o momento ainda está quente.',
 ARRAY['followup', 'oportunidade', 'momento'], 107, true),

('notificacao_recrutamento', 'convite', 'Seu convite do dia', 'curta',
 'Envie 1 convite leve hoje. Nada formal — só abrir porta. Convites mudam vidas.',
 ARRAY['recrutamento', 'convite', 'leve'], 108, true),

('notificacao_recrutamento', 'visao', 'Oportunidade', 'curta',
 'Alguém na sua lista hoje precisa do que você tem. Mostre a visão.',
 ARRAY['recrutamento', 'visao', 'proposito'], 109, true),

('notificacao_cultura', 'identidade', 'Cultura YLADA', 'curta',
 'Aqui na YLADA, acreditamos no simples, no duplicável e no humano. Faça o básico bem feito hoje.',
 ARRAY['cultura', 'ylada', 'identidade'], 110, true),

('notificacao_cultura', 'proposito', 'Transformação', 'curta',
 'Lembre-se: cada bebida entregue muda um dia de alguém. Cada conversa abre uma porta. Você faz parte de algo maior.',
 ARRAY['cultura', 'proposito', 'impacto'], 111, true);

-- =====================================================
-- LOUSA 3 — GRUPO 1: SCRIPTS POR TIPO DE PESSOA
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('tipo_pessoa', 'pessoas_proximas', 'Abertura leve', 'curta',
 'Oi, [nome]! 😊 Tô testando umas bebidas de bem-estar aqui e lembrei de você. Posso te mandar rapidinho o que achei legal?',
 ARRAY['pessoas_proximas', 'abertura', 'leve'], 112, true),

('tipo_pessoa', 'indicacoes', 'Abertura', 'curta',
 'Oi, [nome]! Tudo bem? A [pessoa] comentou que você queria melhorar energia/metabolismo. Posso te mandar uma ideia leve que talvez te ajude?',
 ARRAY['indicacoes', 'abertura', 'social_proof'], 113, true),

('tipo_pessoa', 'indicacoes', 'Curiosidade', 'curta',
 'É um kit de 5 dias que o pessoal usa pra dar aquela sensação boa logo no começo. Quer ver rapidinho como funciona?',
 ARRAY['indicacoes', 'curiosidade', 'kit'], 114, true),

('tipo_pessoa', 'indicacoes', 'Proposta', 'curta',
 'Pelo que me falaram, o kit de 5 dias deve encaixar bem no que você quer. Posso montar um pra você hoje?',
 ARRAY['indicacoes', 'proposta', 'kit'], 115, true),

('tipo_pessoa', 'indicacoes', 'Acompanhamento', 'curta',
 'Oi! Vi que você não chegou a responder. Quer que eu te mande um resumo de 30 segundos?',
 ARRAY['indicacoes', 'acompanhamento', 'seguimento'], 116, true),

('tipo_pessoa', 'instagram', 'Abertura após interação', 'curta',
 'Oi, [nome]! Vi que você curtiu meus stories das bebidas. Quer que eu te mande o kit que o pessoal tá testando?',
 ARRAY['instagram', 'stories', 'abertura'], 117, true),

('tipo_pessoa', 'instagram', 'Curiosidade', 'curta',
 'É um kit de 5 dias: energia + metabolismo. Coisa leve. Quer ver como funciona?',
 ARRAY['instagram', 'curiosidade', 'kit'], 118, true),

('tipo_pessoa', 'instagram', 'Proposta', 'curta',
 'Tô montando alguns kits de R$39,90. Quer que eu separe um pra você também?',
 ARRAY['instagram', 'proposta', 'kit'], 119, true),

('tipo_pessoa', 'instagram', 'Acompanhamento', 'curta',
 'Oi! Passando só pra saber se quer o kit. Posso montar o seu rapidinho. 😄',
 ARRAY['instagram', 'acompanhamento', 'seguimento'], 120, true),

('tipo_pessoa', 'mercado_frio', 'Abertura neutra', 'curta',
 'Oi! Tudo bem? Trabalho com bebidas funcionais pra energia e metabolismo. Posso te mandar algo bem leve pra ver se faz sentido pra você?',
 ARRAY['mercado_frio', 'abertura', 'neutra'], 121, true),

('tipo_pessoa', 'clientes_ativos', 'Check-in', 'curta',
 'Oi, [nome]! Como você tá indo com as bebidas essa semana? Notou alguma diferença?',
 ARRAY['clientes_ativos', 'checkin', 'acompanhamento'], 122, true),

('tipo_pessoa', 'clientes_ativos', 'Upsell Turbo', 'curta',
 'Pelo seu ritmo, acho que você iria gostar do Litrão Turbo. Ele dá um resultado legal em 5 dias. Quer testar essa semana?',
 ARRAY['clientes_ativos', 'upsell', 'turbo'], 123, true),

('tipo_pessoa', 'clientes_ativos', 'Hype para foco', 'curta',
 'Tem também o Hype Drink, que dá foco extra. Quer experimentar um?',
 ARRAY['clientes_ativos', 'hype', 'foco'], 124, true),

('tipo_pessoa', 'clientes_ativos', 'Rotina mensal', 'curta',
 'Pra facilitar, posso montar sua rotina desse mês. Prefere algo leve (50 PV), moderado (75 PV) ou mais completo (100 PV)?',
 ARRAY['clientes_ativos', 'rotina', 'pv'], 125, true),

('tipo_pessoa', 'clientes_sumidos', 'Reativação leve', 'curta',
 'Oi, [nome]! Como você tá? 😊 Vi que faz um tempinho. Quer voltar com uma opção leve essa semana?',
 ARRAY['clientes_sumidos', 'reativacao', 'leve'], 126, true),

('tipo_pessoa', 'clientes_sumidos', 'Pergunta de necessidade', 'curta',
 'Hoje você tá sentindo falta mais de energia, foco ou reduzir retenção?',
 ARRAY['clientes_sumidos', 'diagnostico', 'necessidade'], 127, true),

('tipo_pessoa', 'clientes_sumidos', 'Oferta do kit', 'curta',
 'Se quiser recomeçar, monto um kit de 5 dias pra você. É super tranquilo.',
 ARRAY['clientes_sumidos', 'oferta', 'kit'], 128, true),

('tipo_pessoa', 'clientes_sumidos', 'Acompanhamento final', 'curta',
 'Oi! Se fizer sentido, separo seu kit ainda hoje. 😊',
 ARRAY['clientes_sumidos', 'acompanhamento', 'fechamento'], 129, true),

('tipo_pessoa', 'leads_ferramentas', 'Abertura', 'curta',
 'Oi, [nome]! Vi seu resultado no teste. Obrigado por preencher! Quer que eu te envie a opção ideal pro seu caso?',
 ARRAY['leads_ferramentas', 'abertura', 'diagnostico'], 130, true),

('tipo_pessoa', 'interessados_negocio', 'Abertura leve', 'curta',
 'Oi, [nome]! Vi que você curtiu a ideia das bebidas. Tem um projeto de renda extra bem leve que combina com isso. Quer que eu te explique rapidinho?',
 ARRAY['interessados_negocio', 'abertura', 'recrutamento'], 131, true),

('tipo_pessoa', 'interessados_negocio', 'Curiosidade', 'curta',
 'É um sistema simples onde você começa leve com kits e aprende tudo no caminho. Quer entender?',
 ARRAY['interessados_negocio', 'curiosidade', 'sistema'], 132, true),

('tipo_pessoa', 'interessados_negocio', 'Pré-HOM', 'curta',
 'Hoje tem uma apresentação curta do projeto. Dura uns 10 min. Quer participar?',
 ARRAY['interessados_negocio', 'hom', 'apresentacao'], 133, true),

('tipo_pessoa', 'interessados_negocio', 'Pós-HOM', 'curta',
 'Gostou da apresentação? Quer que eu te mostre como ficaria pra você começar?',
 ARRAY['interessados_negocio', 'pos_hom', 'fechamento'], 134, true),

('tipo_pessoa', 'interessados_negocio', 'Fechamento leve', 'curta',
 'Se fizer sentido, você começa leve com os kits. O resto a gente constrói junto. Quer começar?',
 ARRAY['interessados_negocio', 'fechamento', 'inicio'], 135, true);

-- =====================================================
-- LOUSA 3 — GRUPO 2: SCRIPTS POR OBJETIVO DO CLIENTE
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('objetivo', 'energia', 'Abertura', 'curta',
 'Quando você comentou, a primeira coisa que pensei foi em energia. Sua rotina tá puxada aí?',
 ARRAY['energia', 'abertura', 'diagnostico'], 136, true),

('objetivo', 'metabolismo', 'Abertura', 'curta',
 'Metabolismo travado é mais comum do que parece. Quer que eu veja a melhor opção pra você começar leve?',
 ARRAY['metabolismo', 'abertura', 'diagnostico'], 137, true),

('objetivo', 'metabolismo', 'Curiosidade', 'curta',
 'Uso uma bebida que ajuda muito nisso de forma natural. O pessoal sente diferença rápido. Quer ver como funciona?',
 ARRAY['metabolismo', 'curiosidade', 'bebida'], 138, true),

('objetivo', 'metabolismo', 'Proposta do kit', 'curta',
 'O kit de 5 dias costuma ajudar bastante nisso. Posso montar um pra você?',
 ARRAY['metabolismo', 'proposta', 'kit'], 139, true),

('objetivo', 'metabolismo', 'Proposta Turbo', 'curta',
 'Se quiser algo mais focado, tem o Litrão Turbo. Ele trabalha metabolismo + retenção. Quer experimentar?',
 ARRAY['metabolismo', 'turbo', 'proposta'], 140, true),

('objetivo', 'retencao', 'Abertura', 'curta',
 'Retenção incomoda muito mesmo. Vamos ver a opção mais leve pra você?',
 ARRAY['retencao', 'abertura', 'diagnostico'], 141, true),

('objetivo', 'retencao', 'Curiosidade', 'curta',
 'Tem uma bebida de fibra + energia que ajuda demais nisso nos primeiros dias. Quer que eu te mostre?',
 ARRAY['retencao', 'curiosidade', 'bebida'], 142, true),

('objetivo', 'foco', 'Abertura', 'curta',
 'Foco mental é algo que muita gente busca hoje em dia. Você sente que precisa de mais clareza e concentração no seu dia?',
 ARRAY['foco', 'abertura', 'diagnostico'], 143, true),

('objetivo', 'foco', 'Curiosidade', 'curta',
 'Tem uma bebida funcional que ajuda muito com foco e clareza mental. O pessoal sente diferença logo nos primeiros dias. Quer ver como funciona?',
 ARRAY['foco', 'curiosidade', 'hype'], 144, true),

('objetivo', 'foco', 'Proposta Hype', 'curta',
 'O Hype Drink é perfeito pra isso. Ele dá foco extra sem ansiedade. Quer experimentar?',
 ARRAY['foco', 'proposta', 'hype'], 145, true),

('objetivo', 'emagrecimento', 'Abertura', 'curta',
 'Emagrecimento saudável é uma jornada que precisa de consistência. Como você tá se sentindo nesse processo?',
 ARRAY['emagrecimento', 'abertura', 'diagnostico'], 146, true),

('objetivo', 'emagrecimento', 'Curiosidade', 'curta',
 'Tem uma abordagem leve que começa com um kit de 5 dias e depois evolui conforme seu ritmo. Muita gente começa assim. Quer entender como funciona?',
 ARRAY['emagrecimento', 'curiosidade', 'kit'], 147, true),

('objetivo', 'emagrecimento', 'Proposta progressiva', 'curta',
 'A ideia é começar com o kit de 5 dias, depois intensificar com o Turbo e, se fizer sentido, criar uma rotina mensal (50-75 PV). Quer que eu te mostre como fica cada etapa?',
 ARRAY['emagrecimento', 'proposta', 'progressivo'], 148, true),

('objetivo', 'rotina', 'Abertura', 'curta',
 'Organizar a rotina de bem-estar é fundamental. Como você tá conseguindo manter uma rotina consistente hoje?',
 ARRAY['rotina', 'abertura', 'diagnostico'], 149, true),

('objetivo', 'rotina', 'Curiosidade', 'curta',
 'Tem um kit semanal que ajuda muito a criar essa rotina de forma simples e prática. Quer ver como funciona?',
 ARRAY['rotina', 'curiosidade', 'kit'], 150, true),

('objetivo', 'rotina', 'Proposta kit semanal', 'curta',
 'O kit semanal é perfeito pra você manter uma rotina constante sem complicação. Posso montar um pra você?',
 ARRAY['rotina', 'proposta', 'kit'], 151, true);

-- =====================================================
-- LOUSA 3 — GRUPO 3: SCRIPTS POR ETAPA DA CONVERSA
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('etapa', 'abertura', 'Abertura leve', 'curta',
 'Oi, [nome]! Tudo bem? 😊 Só passando pra saber como você tá.',
 ARRAY['abertura', 'leve', 'humana'], 152, true),

('etapa', 'abertura', 'Abertura com interesse', 'curta',
 'Oi! Vi que você [ação/interação]. Quer que eu te mostre algo que pode te ajudar?',
 ARRAY['abertura', 'interesse', 'personalizada'], 153, true),

('etapa', 'abertura', 'Abertura natural', 'curta',
 'Oi, [nome]! Como você tá? Lembrei de você e queria te mostrar uma ideia leve.',
 ARRAY['abertura', 'natural', 'conexao'], 154, true),

('etapa', 'proposta', 'Proposta leve', 'curta',
 'Se fizer sentido pra você, posso montar um kit de 5 dias pra você testar. É super tranquilo.',
 ARRAY['proposta', 'leve', 'kit'], 155, true),

('etapa', 'proposta', 'Proposta por escolha', 'curta',
 'Tenho duas opções pra você: o kit de 5 dias ou o Turbo. Qual faz mais sentido pro seu objetivo?',
 ARRAY['proposta', 'escolha', 'opcoes'], 156, true),

('etapa', 'proposta', 'Proposta natural', 'curta',
 'Pelo que você me contou, acho que o kit de 5 dias encaixa bem. Quer que eu monte um pra você?',
 ARRAY['proposta', 'natural', 'personalizada'], 157, true),

('etapa', 'curiosidade', 'Curiosidade leve', 'curta',
 'Tem uma bebida que dá um efeito bem interessante no dia. Posso te mostrar rapidinho?',
 ARRAY['curiosidade', 'leve', 'bebida'], 158, true),

('etapa', 'curiosidade', 'Curiosidade específica (energia)', 'curta',
 'O pessoal tem usado uma bebida natural que dá disposição sem ansiedade. Quer ver como funciona?',
 ARRAY['curiosidade', 'energia', 'bebida'], 159, true),

('etapa', 'curiosidade', 'Curiosidade específica (metabolismo)', 'curta',
 'Tem uma bebida que ajuda bastante nesse ponto do metabolismo. Quer que eu te envie?',
 ARRAY['curiosidade', 'metabolismo', 'bebida'], 160, true),

('etapa', 'curiosidade', 'Curiosidade para retenção', 'curta',
 'Tem uma bebida de fibra + energia que ajuda muito com inchaço. Quer dar uma olhada?',
 ARRAY['curiosidade', 'retencao', 'bebida'], 161, true),

('etapa', 'curiosidade', 'Curiosidade para foco', 'curta',
 'Uso uma bebida pra foco mental que tá ajudando muita gente. Quer ver qual é?',
 ARRAY['curiosidade', 'foco', 'bebida'], 162, true),

('etapa', 'diagnostico', 'Diagnóstico universal', 'curta',
 'Só pra te ajudar do jeito certo: hoje você quer melhorar mais o quê? Energia, retenção ou metabolismo?',
 ARRAY['diagnostico', 'universal', 'pergunta'], 163, true),

('etapa', 'diagnostico', 'Diagnóstico emocional', 'curta',
 'O que mais está te incomodando no dia a dia? Cansaço, foco, inchaço, ansiedade…?',
 ARRAY['diagnostico', 'emocional', 'pergunta'], 164, true),

('etapa', 'diagnostico', 'Diagnóstico guiado', 'curta',
 'Se pudesse mudar uma coisa nos próximos 5 dias, o que você escolheria?',
 ARRAY['diagnostico', 'guiado', 'pergunta'], 165, true),

('etapa', 'fechamento', 'Fechamento simples', 'curta',
 'Se fizer sentido pra você, separo seu kit agora mesmo. Pode ser?',
 ARRAY['fechamento', 'simples', 'direto'], 166, true),

('etapa', 'fechamento', 'Fechamento por escolha', 'curta',
 'Prefere começar com o kit leve de 5 dias ou já quer testar o Turbo?',
 ARRAY['fechamento', 'escolha', 'opcoes'], 167, true),

('etapa', 'fechamento', 'Fechamento por confirmação', 'curta',
 'Quer que eu já monte o seu aqui? É bem tranquilo de usar.',
 ARRAY['fechamento', 'confirmacao', 'leve'], 168, true),

('etapa', 'fechamento', 'Fechamento emocional', 'curta',
 'Acho que você vai gostar do efeito nos primeiros dias. Quer experimentar?',
 ARRAY['fechamento', 'emocional', 'experiencia'], 169, true),

('etapa', 'acompanhamento', 'Acompanhamento leve', 'curta',
 'Oi! Conseguiu ver a mensagem que te mandei? Posso te explicar rapidinho se quiser. 😊',
 ARRAY['acompanhamento', 'leve', 'seguimento'], 170, true),

('etapa', 'acompanhamento', 'Acompanhamento com valor', 'curta',
 'Lembrei de você porque hoje o pessoal tá pedindo bastante o kit. Quer que eu separe um?',
 ARRAY['acompanhamento', 'valor', 'urgencia'], 171, true),

('etapa', 'acompanhamento', 'Acompanhamento por escolha', 'curta',
 'Prefere que eu te mande o kit de energia ou o de metabolismo pra começar?',
 ARRAY['acompanhamento', 'escolha', 'opcoes'], 172, true),

('etapa', 'acompanhamento', 'Acompanhamento final', 'curta',
 'Só pra não te incomodar mais 😄 Se quiser, monto seu kit hoje ainda. Me avisa.',
 ARRAY['acompanhamento', 'final', 'ultimo_lembrete'], 173, true),

('etapa', 'conclusao', 'Confirmação simples', 'curta',
 'Perfeito! Vou separar seu kit. Te mando as instruções de uso certinhas.',
 ARRAY['conclusao', 'confirmacao', 'instrucoes'], 174, true),

('etapa', 'conclusao', 'Confirmação com cuidado', 'curta',
 'Fechado! Qual horário é melhor pra você receber as instruções certinhas?',
 ARRAY['conclusao', 'cuidado', 'personalizacao'], 175, true),

('etapa', 'conclusao', 'Confirmação com personalização', 'curta',
 'Ótimo! Só pra eu ajustar certinho pra você: prefere foco mais em energia, retenção ou metabolismo?',
 ARRAY['conclusao', 'personalizacao', 'ajuste'], 176, true);

-- =====================================================
-- LOUSA 3 — GRUPO 4: ACOMPANHAMENTO AVANÇADO (7, 14, 30 DIAS)
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('acompanhamento', '7_dias', 'Dia 1: Boas-vindas', 'curta',
 'Oi, [nome]! Tudo certinho aí? 😊 Só passando pra te desejar uma ótima experiência com seu kit. Qualquer dúvida, tô por aqui!',
 ARRAY['7_dias', 'dia1', 'boas_vindas'], 177, true),

('acompanhamento', '7_dias', 'Dia 2: Primeira percepção', 'curta',
 'Bom dia, [nome]! Hoje é aquele dia em que muita gente já sente diferença na disposição. Notou algo diferente?',
 ARRAY['7_dias', 'dia2', 'percepcao'], 163, true),

('acompanhamento', '7_dias', 'Dia 3: Reforço positivo', 'curta',
 'Oi! Agora que você já está no ritmo do kit, como tá indo? A energia costuma dar uma boa melhorada. Me conta como tá pra você.',
 ARRAY['7_dias', 'dia3', 'reforco'], 164, true),

('acompanhamento', '7_dias', 'Dia 4: Construção de hábito', 'curta',
 'Passando pra saber: conseguiu manter direitinho a rotina do kit essa semana? Seu corpo agradece essa constância! 😄',
 ARRAY['7_dias', 'dia4', 'habito'], 165, true),

('acompanhamento', '7_dias', 'Dia 5: Primeiro convite leve', 'curta',
 'Se você estiver gostando dos efeitos, posso te mostrar como fica a rotina da próxima semana. Quer ver as opções?',
 ARRAY['7_dias', 'dia5', 'convite'], 166, true),

('acompanhamento', '7_dias', 'Dia 6: Sugestão personalizada', 'curta',
 'Com base no que você me contou, acho que você encaixaria muito bem na rotina de [energia/metabolismo/retensão]. Quer que eu te mande como funciona?',
 ARRAY['7_dias', 'dia6', 'personalizacao'], 167, true),

('acompanhamento', '7_dias', 'Dia 7: Fechamento suave da primeira semana', 'curta',
 'Fechamos 7 dias! 🎉 Quer continuar no ritmo com a próxima etapa? Posso montar uma opção leve pra você.',
 ARRAY['7_dias', 'dia7', 'fechamento'], 168, true),

('acompanhamento', '14_dias', 'Dia 10: Reativação leve', 'curta',
 'Oi, [nome]! Como você tá indo por aí? No segundo ciclo de uso, muita gente começa a perceber mudanças mais consistentes. Como tá pra você?',
 ARRAY['14_dias', 'dia10', 'reativacao'], 169, true),

('acompanhamento', '14_dias', 'Dia 11: Validação positiva', 'curta',
 'Adorei saber que você tá indo bem! Normalmente, quem chega nos 10–14 dias sente mais leveza e disposição. Quer manter esse ritmo?',
 ARRAY['14_dias', 'dia11', 'validacao'], 170, true),

('acompanhamento', '14_dias', 'Dia 12: Oferta elegante (Turbo ou Hype)', 'curta',
 'Se fizer sentido pra você, tem duas opções legais pra próxima fase: - Litrão Turbo → retenção e metabolismo - Hype Drink → foco e clareza mental Quer que eu te explique qual encaixa melhor no seu objetivo?',
 ARRAY['14_dias', 'dia12', 'upgrade'], 171, true),

('acompanhamento', '14_dias', 'Dia 13: Microcompromisso', 'curta',
 'Antes de te sugerir algo, me diz: hoje seu foco é mais energia, metabolismo ou retenção? Assim ajusto certinho pra você.',
 ARRAY['14_dias', 'dia13', 'diagnostico'], 172, true),

('acompanhamento', '14_dias', 'Dia 14: Fechamento leve da segunda etapa', 'curta',
 'Perfeito! Fechamos duas semanas. 🎉 Quer que eu monte sua próxima etapa pra manter os resultados vindo?',
 ARRAY['14_dias', 'dia14', 'fechamento'], 173, true),

('acompanhamento', '30_dias', 'Dia 20: Revisão do progresso', 'curta',
 'Oi, [nome]! Estamos quase chegando no seu mês de uso! Queria saber: o que você mais percebeu de diferença até aqui?',
 ARRAY['30_dias', 'dia20', 'revisao'], 174, true),

('acompanhamento', '30_dias', 'Dia 22: Educativo simples', 'curta',
 'Sabia que o corpo responde melhor quando a gente mantém uma rotina mensal? Posso te mostrar três opções de rotina simples pra seguir no próximo mês.',
 ARRAY['30_dias', 'dia22', 'educativo'], 175, true),

('acompanhamento', '30_dias', 'Dia 24: Oferta estruturada', 'curta',
 'Pra sua próxima etapa, posso montar 3 rotinas pra você escolher: - 50 PV → leve - 75 PV → moderada - 100 PV → completa Quer ver como fica cada uma?',
 ARRAY['30_dias', 'dia24', 'oferta'], 176, true),

('acompanhamento', '30_dias', 'Dia 26: Sugestão personalizada', 'curta',
 'Pelo seu perfil, acho que [opção X] combina mais com você. Posso te mostrar como ficaria o mês inteiro?',
 ARRAY['30_dias', 'dia26', 'personalizacao'], 177, true),

('acompanhamento', '30_dias', 'Dia 28: Convite suave para continuidade', 'curta',
 'Sua evolução tá linda de ver! Quero te ajudar a manter isso vindo. Quer deixar preparada sua rotina pro próximo mês?',
 ARRAY['30_dias', 'dia28', 'continuidade'], 178, true),

('acompanhamento', '30_dias', 'Dia 30: Encerramento do ciclo + convite para renovação', 'curta',
 'Fechamos o primeiro mês! 🎉 Parabéns pela constância! Quer continuar no mesmo ritmo ou prefere ajustar alguma coisa? Posso montar sua rotina nova agora.',
 ARRAY['30_dias', 'dia30', 'renovacao'], 179, true);

-- =====================================================
-- LOUSA 3 — GRUPO 5: SCRIPTS DE REATIVAÇÃO PROFUNDA
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('reativacao', 'comprou_1x', 'Reativação leve', 'curta',
 'Oi, [nome]! 😊 Lembrei de você aqui porque várias pessoas que compraram o kit voltaram pra uma segunda rodada e lembrei do seu também. Como você tá?',
 ARRAY['reativacao', 'comprou_1x', 'leve'], 180, true),

('reativacao', 'comprou_1x', 'Porta emocional', 'curta',
 'Você chegou a sentir algum efeito legal nos primeiros dias? Às vezes só ajustar a rotina já faz diferença. Se quiser, olho isso contigo.',
 ARRAY['reativacao', 'comprou_1x', 'emocional'], 181, true),

('reativacao', 'fizeram_7_14_30', 'Resgate pelo progresso', 'curta',
 'Oi, [nome]! Lembrei que você tinha mandado super bem naquele começo. Como você tá agora?',
 ARRAY['reativacao', 'fizeram_7_14_30', 'progresso'], 182, true),

('reativacao', 'mostraram_interesse', 'Curiosidade reaberta', 'curta',
 'Oi, [nome]! 😊 Vi aqui que você tinha pedido informações do kit. Posso te mandar uma versão mais simples e direta?',
 ARRAY['reativacao', 'mostraram_interesse', 'curiosidade'], 183, true),

('reativacao', 'leads_antigos', 'Reativação neutra', 'curta',
 'Oi, [nome]! Tudo bem? Vi sua conversa comigo há um tempinho e quis te perguntar como você tá hoje. Mudou algo desde então?',
 ARRAY['reativacao', 'leads_antigos', 'neutra'], 184, true),

('reativacao', 'participaram_hom', 'Reativação pós-HOM', 'curta',
 'Oi, [nome]! 😊 Vi que você participou da apresentação aquele dia. Como você tá desde então?',
 ARRAY['reativacao', 'participaram_hom', 'pos_hom'], 185, true),

('reativacao', 'ex_distribuidores', 'Reativação respeitosa', 'curta',
 'Oi, [nome]! Como você tá? Dei uma olhada aqui e lembrei de quando você estava no projeto. Como anda sua rotina hoje?',
 ARRAY['reativacao', 'ex_distribuidores', 'respeitosa'], 186, true),

('reativacao', 'quase_fecharam', 'Reativação elegante', 'curta',
 'Oi, [nome]! Só vi aqui que tínhamos parado bem perto de montar seu kit. Como você tá?',
 ARRAY['reativacao', 'quase_fecharam', 'elegante'], 187, true),

('reativacao', 'vou_pensar', 'Porta leve', 'curta',
 'Oi, [nome]! Lembrei da nossa conversa. Conseguiu pensar com calma? 😊',
 ARRAY['reativacao', 'vou_pensar', 'leve'], 188, true),

('reativacao', 'desapareceu', 'Reabertura neutra', 'curta',
 'Oi, [nome]! Tudo bem por aí? 😊 Só passando pra saber como você tá.',
 ARRAY['reativacao', 'desapareceu', 'neutra'], 189, true);

-- =====================================================
-- LOUSA 3 — GRUPO 6: SCRIPTS DE RECRUTAMENTO
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('recrutamento', 'sementes', 'Semente leve', 'curta',
 'Tô trabalhando num projeto novo de bem-estar que tá ficando bem legal. Depois te conto, se quiser. 😊',
 ARRAY['recrutamento', 'sementes', 'leve'], 190, true),

('recrutamento', 'sementes', 'Semente com gancho emocional', 'curta',
 'Comecei um projeto que mistura bem-estar + renda extra. Tô gostando bastante da experiência. Quando quiser, te conto melhor.',
 ARRAY['recrutamento', 'sementes', 'emocional'], 191, true),

('recrutamento', 'aberturas', 'Abertura simples', 'curta',
 'Oi, [nome]! Tudo bem? Posso te mandar uma ideia de renda extra bem leve que combina com o seu estilo?',
 ARRAY['recrutamento', 'aberturas', 'simples'], 192, true),

('recrutamento', 'aberturas', 'Abertura pra quem já curte as bebidas', 'curta',
 'Vi que você tá gostando das bebidas. Tem um projeto bem legal onde você pode compartilhar isso e gerar uma renda extra leve. Quer que eu te explique rapidinho?',
 ARRAY['recrutamento', 'aberturas', 'bebidas'], 193, true),

('recrutamento', 'pre_diagnostico', 'Pergunta central', 'curta',
 'Me conta: hoje você procura algo mais por renda extra rápida ou por construir algo maior no tempo?',
 ARRAY['recrutamento', 'pre_diagnostico', 'pergunta'], 194, true),

('recrutamento', 'convite_hom', 'Convite direto', 'curta',
 'Hoje vai rolar uma apresentação de 10 min sobre o projeto. Quer participar? É super leve.',
 ARRAY['recrutamento', 'convite_hom', 'direto'], 195, true),

('recrutamento', 'pos_hom', 'Reação aberta', 'curta',
 'E aí, [nome], o que você achou da apresentação? O que chamou mais sua atenção?',
 ARRAY['recrutamento', 'pos_hom', 'reacao'], 196, true),

('recrutamento', 'pos_hom', 'Apoio emocional', 'curta',
 'É normal ficar com algumas dúvidas no começo. Se quiser, a gente vai ponto a ponto juntos.',
 ARRAY['recrutamento', 'pos_hom', 'apoio'], 197, true),

('recrutamento', 'fechamento', 'Fechamento simples', 'curta',
 'Se fizer sentido pra você, posso te mostrar como começar hoje de um jeito bem leve. Pode ser?',
 ARRAY['recrutamento', 'fechamento', 'simples'], 198, true),

('recrutamento', 'fechamento', 'Fechamento por escolha', 'curta',
 'Você prefere começar com alguns kits pra vender ou primeiro usar e entender tudo? Os dois caminhos funcionam.',
 ARRAY['recrutamento', 'fechamento', 'escolha'], 199, true);

-- =====================================================
-- LOUSA 3 — GRUPO 7: SCRIPTS INTERNOS DO NOEL
-- =====================================================

INSERT INTO wellness_scripts (categoria, subcategoria, nome, versao, conteudo, tags, ordem, ativo) VALUES
('interno', 'respostas_base', 'Quando o distribuidor pede ajuda', 'curta',
 'Claro! Tô aqui pra caminhar com você. Me diz exatamente o que você quer fazer agora e eu te mostro o melhor passo.',
 ARRAY['interno', 'ajuda', 'direcionamento'], 200, true),

('interno', 'respostas_base', 'Quando o distribuidor está perdido', 'curta',
 'Sem problema! Vamos simplificar. Me diga: você quer falar com alguém, vender, acompanhar um cliente ou recrutar?',
 ARRAY['interno', 'perdido', 'simplificar'], 201, true),

('interno', 'respostas_base', 'Quando o distribuidor não sabe por onde começar', 'curta',
 'Vamos começar leve. Quero que me diga: quem é a próxima pessoa que você consegue chamar HOJE? Posso te dar o script certinho.',
 ARRAY['interno', 'comecar', 'primeiro_passo'], 202, true),

('interno', 'apoio_emocional', 'Quando o distribuidor está desanimado', 'curta',
 'Respira comigo. A gente ajusta o caminho, não o sonho. Vamos fazer uma ação pequena juntos agora? Só uma, pra te recolocar no ritmo.',
 ARRAY['interno', 'desanimado', 'motivacao'], 203, true),

('interno', 'apoio_emocional', 'Quando ele sente que nada funciona', 'curta',
 'Entendo totalmente. Isso acontece com TODO mundo. O que muda o jogo é constância leve. Vamos achar o seu próximo passo simples?',
 ARRAY['interno', 'frustracao', 'constancia'], 204, true),

('interno', 'orientacoes_tecnicas', 'Quando ele pede instrução sobre ferramentas', 'curta',
 'Te explico sim! A ferramenta que você precisa agora é a [nome]. Quer que eu te mostre como usar em 10 segundos?',
 ARRAY['interno', 'ferramentas', 'instrucao'], 205, true),

('interno', 'orientacoes_tecnicas', 'Quando ele pergunta qual fluxo usar', 'curta',
 'Pra esse caso, o fluxo ideal é o [fluxo X]. Ele te ajuda porque foca exatamente no tipo de pessoa que você quer falar. Quer que eu abra pra você?',
 ARRAY['interno', 'fluxo', 'selecao'], 206, true),

('interno', 'correcao', 'Quando o distribuidor usou um script inadequado', 'curta',
 'Boa intenção! Só vamos ajustar um detalhe pra ficar mais leve. Quer que eu te mostre uma versão que encaixa melhor aqui?',
 ARRAY['interno', 'correcao', 'ajuste'], 207, true),

('interno', 'direcionamentos', 'Quando ele quer vender mais', 'curta',
 'Ótimo! Vamos focar em ações leves e diárias. Me diga: quem são as 3 pessoas que você pode chamar hoje? Eu te dou o roteiro.',
 ARRAY['interno', 'vender', 'acoes'], 208, true),

('interno', 'direcionamentos', 'Quando ele quer recrutar', 'curta',
 'Excelente! Recrutamento começa com curiosidade. Quer que eu gere 3 mensagens leves pra você enviar agora mesmo?',
 ARRAY['interno', 'recrutar', 'mensagens'], 209, true),

('interno', 'ativacao', 'Bom dia do NOEL', 'curta',
 'Bom dia, campeão! ☀️ Me diz: qual vai ser a sua micro-ação de hoje? Eu te acompanho nela.',
 ARRAY['interno', 'bom_dia', 'ativacao'], 210, true),

('interno', 'ativacao', 'Ativação diária', 'curta',
 'Sua ação de hoje é simples: falar com 1 pessoa. Só isso. Quer que eu prepare a mensagem?',
 ARRAY['interno', 'ativacao', 'diaria'], 211, true);

COMMIT;

-- =====================================================
-- RESUMO FINAL:
-- Total de scripts inseridos: ~226
-- 
-- BLOCO 1: Vendas (10)
-- BLOCO 2: Indicação (14)
-- BLOCO 3: Recrutamento (15)
-- BLOCO 4: Follow-up (15)
-- BLOCO 5: Motivação (20)
-- BLOCO 6: Prova Social (15)
-- BLOCO 7: Fluxos (10)
-- BLOCO 9: Notificações (12)
-- LOUSA 3 - Grupo 1: Tipo de Pessoa (24)
-- LOUSA 3 - Grupo 2: Objetivo (10 - Energia, Metabolismo, Retenção, Foco, Emagrecimento, Rotina)
-- LOUSA 3 - Grupo 3: Etapa (25 - Abertura, Curiosidade, Diagnóstico, Proposta, Fechamento, Acompanhamento, Conclusão)
-- LOUSA 3 - Grupo 4: Acompanhamento (18)
-- LOUSA 3 - Grupo 5: Reativação (10)
-- LOUSA 3 - Grupo 6: Recrutamento (10)
-- LOUSA 3 - Grupo 7: Internos (12)
-- =====================================================


-- =====================================================
-- NOTAS:
-- Este arquivo contém uma base sólida dos scripts principais
-- Total inserido até agora: ~179 scripts
-- Restam: Grupos 5, 6, 7 da LOUSA 3 (Reativação, Recrutamento, Internos)
-- =====================================================


-- =====================================================
-- NOTAS:
-- Este arquivo contém os primeiros 3 blocos completos
-- Restam: Bloco 4 (Follow-up), 5 (Motivação), 6 (Prova Social),
-- 7 (Fluxos), 8 (Técnicos - estrutura), 9 (Notificações)
-- + LOUSA 3 completa (Grupos 1-7)
-- =====================================================

