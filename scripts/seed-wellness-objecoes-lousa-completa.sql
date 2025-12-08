-- =====================================================
-- WELLNESS SYSTEM - SEED DE OBJEÇÕES COMPLETO
-- Baseado na Lousa de Objeções Completa
-- =====================================================

BEGIN;

-- Garantir que todas as colunas necessárias existem
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'versao_curta'
  ) THEN
    ALTER TABLE wellness_objecoes ADD COLUMN versao_curta TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'versao_media'
  ) THEN
    ALTER TABLE wellness_objecoes ADD COLUMN versao_media TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'versao_longa'
  ) THEN
    ALTER TABLE wellness_objecoes ADD COLUMN versao_longa TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'gatilho_retomada'
  ) THEN
    ALTER TABLE wellness_objecoes ADD COLUMN gatilho_retomada TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'resposta_se_some'
  ) THEN
    ALTER TABLE wellness_objecoes ADD COLUMN resposta_se_some TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'resposta_se_negativa'
  ) THEN
    ALTER TABLE wellness_objecoes ADD COLUMN resposta_se_negativa TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wellness_objecoes' 
    AND column_name = 'upgrade'
  ) THEN
    ALTER TABLE wellness_objecoes ADD COLUMN upgrade TEXT;
  END IF;
END $$;

-- =====================================================
-- CATEGORIA 1 — OBJEÇÕES DE CLIENTES (KIT, TURBO, HYPE)
-- =====================================================

INSERT INTO wellness_objecoes (categoria, codigo, objeção, versao_curta, versao_media, versao_longa, tags, ordem, ativo) VALUES
('clientes', '1.1', 'Está caro',
 'Entendo totalmente, [nome]. 🙏 A ideia aqui não é pesar pra você. O kit é só uma forma leve de você sentir o efeito em 5 dias antes de decidir qualquer coisa maior. Muitas pessoas me falam isso no começo e depois percebem que, na verdade, é mais um teste do que um gasto. Se fizer sentido, posso te mostrar a opção mais leve possível pra você começar sem pressão. Quer ver?',
 'Entendo totalmente, [nome]. 🙏 A ideia aqui não é pesar pra você. O kit é só uma forma leve de você sentir o efeito em 5 dias antes de decidir qualquer coisa maior. Muitas pessoas me falam isso no começo e depois percebem que, na verdade, é mais um teste do que um gasto. Se fizer sentido, posso te mostrar a opção mais leve possível pra você começar sem pressão. Quer ver?',
 'Entendo totalmente, [nome]. 🙏 A ideia aqui não é pesar pra você. O kit é só uma forma leve de você sentir o efeito em 5 dias antes de decidir qualquer coisa maior. Muitas pessoas me falam isso no começo e depois percebem que, na verdade, é mais um teste do que um gasto. Se fizer sentido, posso te mostrar a opção mais leve possível pra você começar sem pressão. Quer ver?',
 ARRAY['preco', 'caro', 'economia'], 1, true),

('clientes', '1.2', 'Vou pensar',
 'Claro, [nome], super respeito isso. ❤️ Só pra te ajudar a decidir com mais clareza: o kit é só um teste curto pra você perceber na prática se te faz bem. Sem compromisso nenhum. Se quiser, te mando um resumo de 20 segundos pra facilitar sua decisão. Quer?',
 'Claro, [nome], super respeito isso. ❤️ Só pra te ajudar a decidir com mais clareza: o kit é só um teste curto pra você perceber na prática se te faz bem. Sem compromisso nenhum. Se quiser, te mando um resumo de 20 segundos pra facilitar sua decisão. Quer?',
 'Claro, [nome], super respeito isso. ❤️ Só pra te ajudar a decidir com mais clareza: o kit é só um teste curto pra você perceber na prática se te faz bem. Sem compromisso nenhum. Se quiser, te mando um resumo de 20 segundos pra facilitar sua decisão. Quer?',
 ARRAY['pensar', 'duvida', 'resumo'], 2, true),

('clientes', '1.3', 'Não sei se funciona para mim',
 'Totalmente normal pensar isso! Cada corpo reage de um jeito mesmo. Por isso a ideia do kit de 5 dias: é leve, rápido e você sente na prática se faz diferença no seu dia. Nada te prende. Quer que eu te mostre como funciona certinho?',
 'Totalmente normal pensar isso! Cada corpo reage de um jeito mesmo. Por isso a ideia do kit de 5 dias: é leve, rápido e você sente na prática se faz diferença no seu dia. Nada te prende. Quer que eu te mostre como funciona certinho?',
 'Totalmente normal pensar isso! Cada corpo reage de um jeito mesmo. Por isso a ideia do kit de 5 dias: é leve, rápido e você sente na prática se faz diferença no seu dia. Nada te prende. Quer que eu te mostre como funciona certinho?',
 ARRAY['duvida', 'funciona', 'teste'], 3, true),

('clientes', '1.4', 'Preciso falar com meu marido / esposa',
 'Super justo! Transparência em casa é essencial mesmo. ❤️ Se quiser, te mando uma explicação bem curtinha que facilita você explicar lá. Assim ninguém fica inseguro e você já leva uma informação redondinha. Quer que eu te envie?',
 'Super justo! Transparência em casa é essencial mesmo. ❤️ Se quiser, te mando uma explicação bem curtinha que facilita você explicar lá. Assim ninguém fica inseguro e você já leva uma informação redondinha. Quer que eu te envie?',
 'Super justo! Transparência em casa é essencial mesmo. ❤️ Se quiser, te mando uma explicação bem curtinha que facilita você explicar lá. Assim ninguém fica inseguro e você já leva uma informação redondinha. Quer que eu te envie?',
 ARRAY['consultar', 'resumo', 'transparencia'], 4, true),

('clientes', '1.5', 'Não tenho tempo',
 'Te entendo totalmente! A correria tá pegando todo mundo. O lado bom é que o kit não exige tempo: é só misturar e beber, coisa de segundos. Ele é justamente pra quem vive no modo correria. Quer que eu te mostre a rotina super rápida dele?',
 'Te entendo totalmente! A correria tá pegando todo mundo. O lado bom é que o kit não exige tempo: é só misturar e beber, coisa de segundos. Ele é justamente pra quem vive no modo correria. Quer que eu te mostre a rotina super rápida dele?',
 'Te entendo totalmente! A correria tá pegando todo mundo. O lado bom é que o kit não exige tempo: é só misturar e beber, coisa de segundos. Ele é justamente pra quem vive no modo correria. Quer que eu te mostre a rotina super rápida dele?',
 ARRAY['tempo', 'rapido', 'rotina'], 5, true),

('clientes', '1.6', 'Tenho medo de não usar certinho',
 'Relaxa, é mais simples do que parece. 😄 Eu te mando o passo a passo em 10 segundos e te acompanho durante os 5 dias. Você não faz nada sozinho(a). Quer que eu te mostre como funciona?',
 'Relaxa, é mais simples do que parece. 😄 Eu te mando o passo a passo em 10 segundos e te acompanho durante os 5 dias. Você não faz nada sozinho(a). Quer que eu te mostre como funciona?',
 'Relaxa, é mais simples do que parece. 😄 Eu te mando o passo a passo em 10 segundos e te acompanho durante os 5 dias. Você não faz nada sozinho(a). Quer que eu te mostre como funciona?',
 ARRAY['medo', 'acompanhamento', 'simples'], 6, true),

('clientes', '1.7', 'Já tentei outras coisas e não funcionou',
 'Entendo profundamente isso. De verdade. 🙏 Por isso mesmo o kit é diferente: ele é leve, rápido e você já sente algo nos primeiros dias — não é uma mudança gigante, é um ajuste no seu dia. Sem pressão. Quer ver como ficaria pra você testar sem compromisso?',
 'Entendo profundamente isso. De verdade. 🙏 Por isso mesmo o kit é diferente: ele é leve, rápido e você já sente algo nos primeiros dias — não é uma mudança gigante, é um ajuste no seu dia. Sem pressão. Quer ver como ficaria pra você testar sem compromisso?',
 'Entendo profundamente isso. De verdade. 🙏 Por isso mesmo o kit é diferente: ele é leve, rápido e você já sente algo nos primeiros dias — não é uma mudança gigante, é um ajuste no seu dia. Sem pressão. Quer ver como ficaria pra você testar sem compromisso?',
 ARRAY['frustracao', 'diferenca', 'teste'], 7, true),

('clientes', '1.8', 'Não gosto de bebida',
 'Super compreensível! Algumas pessoas têm isso mesmo. A boa notícia é que são bebidas bem leves, tipo um chazinho, nada pesado. E existem sabores diferentes. Se quiser, te mando as opções e você me diz qual te agrada mais. Pode ser?',
 'Super compreensível! Algumas pessoas têm isso mesmo. A boa notícia é que são bebidas bem leves, tipo um chazinho, nada pesado. E existem sabores diferentes. Se quiser, te mando as opções e você me diz qual te agrada mais. Pode ser?',
 'Super compreensível! Algumas pessoas têm isso mesmo. A boa notícia é que são bebidas bem leves, tipo um chazinho, nada pesado. E existem sabores diferentes. Se quiser, te mando as opções e você me diz qual te agrada mais. Pode ser?',
 ARRAY['sabor', 'alternativas', 'leve'], 8, true),

('clientes', '1.9', 'Estou sem dinheiro agora',
 'Super respeito isso. 🙏 O momento de cada pessoa é diferente. A ideia do kit é justamente ser a opção mais leve, só pra você testar sem peso financeiro. Se quiser, posso te avisar quando eu montar uma rodada mais econômica. Quer?',
 'Super respeito isso. 🙏 O momento de cada pessoa é diferente. A ideia do kit é justamente ser a opção mais leve, só pra você testar sem peso financeiro. Se quiser, posso te avisar quando eu montar uma rodada mais econômica. Quer?',
 'Super respeito isso. 🙏 O momento de cada pessoa é diferente. A ideia do kit é justamente ser a opção mais leve, só pra você testar sem peso financeiro. Se quiser, posso te avisar quando eu montar uma rodada mais econômica. Quer?',
 ARRAY['dinheiro', 'economia', 'leve'], 9, true),

('clientes', '1.10', 'Não quero me comprometer com nada',
 'Perfeito, e nem precisa! O kit não cria compromisso nenhum. É só um teste leve de 5 dias pra você sentir se faz bem. Nada de assinaturas, nada recorrente. Só você experimentando no seu ritmo. Quer que eu te mostre como funciona?',
 'Perfeito, e nem precisa! O kit não cria compromisso nenhum. É só um teste leve de 5 dias pra você sentir se faz bem. Nada de assinaturas, nada recorrente. Só você experimentando no seu ritmo. Quer que eu te mostre como funciona?',
 'Perfeito, e nem precisa! O kit não cria compromisso nenhum. É só um teste leve de 5 dias pra você sentir se faz bem. Nada de assinaturas, nada recorrente. Só você experimentando no seu ritmo. Quer que eu te mostre como funciona?',
 ARRAY['compromisso', 'teste', 'leve'], 10, true)
ON CONFLICT (categoria, codigo) 
DO UPDATE SET
  objeção = EXCLUDED.objeção,
  versao_curta = EXCLUDED.versao_curta,
  versao_media = EXCLUDED.versao_media,
  versao_longa = EXCLUDED.versao_longa,
  tags = EXCLUDED.tags,
  ordem = EXCLUDED.ordem,
  ativo = EXCLUDED.ativo;

-- =====================================================
-- CATEGORIA 2 — OBJEÇÕES DE CLIENTES RECORRENTES
-- =====================================================

INSERT INTO wellness_objecoes (categoria, codigo, objeção, versao_curta, versao_media, versao_longa, tags, ordem, ativo) VALUES
('clientes_recorrentes', '2.1', 'Quero esperar mais um pouco',
 'Super entendo, [nome]. 🙏 E não tem problema nenhum esperar. Só queria te lembrar de uma coisa: quando você mantém um ritmo leve agora, os resultados não "quebram". É igual academia — quando para, o corpo sente. Se quiser, te mando a opção mais leve possível só pra manter o que você já conquistou. Pode ser?',
 'Super entendo, [nome]. 🙏 E não tem problema nenhum esperar. Só queria te lembrar de uma coisa: quando você mantém um ritmo leve agora, os resultados não "quebram". É igual academia — quando para, o corpo sente. Se quiser, te mando a opção mais leve possível só pra manter o que você já conquistou. Pode ser?',
 'Super entendo, [nome]. 🙏 E não tem problema nenhum esperar. Só queria te lembrar de uma coisa: quando você mantém um ritmo leve agora, os resultados não "quebram". É igual academia — quando para, o corpo sente. Se quiser, te mando a opção mais leve possível só pra manter o que você já conquistou. Pode ser?',
 ARRAY['esperar', 'manutencao', 'ritmo'], 11, true),

('clientes_recorrentes', '2.2', 'Ainda tenho produto em casa',
 'Ótimo que você ainda tem! Isso mostra que você tá usando direitinho no seu ritmo. 😄 Pra facilitar, podemos montar só uma reposição menor, algo bem leve, pra você não ficar sem quando acabar. Nada pesado. Quer que eu te mostre uma sugestão rapidinha?',
 'Ótimo que você ainda tem! Isso mostra que você tá usando direitinho no seu ritmo. 😄 Pra facilitar, podemos montar só uma reposição menor, algo bem leve, pra você não ficar sem quando acabar. Nada pesado. Quer que eu te mostre uma sugestão rapidinha?',
 'Ótimo que você ainda tem! Isso mostra que você tá usando direitinho no seu ritmo. 😄 Pra facilitar, podemos montar só uma reposição menor, algo bem leve, pra você não ficar sem quando acabar. Nada pesado. Quer que eu te mostre uma sugestão rapidinha?',
 ARRAY['reposicao', 'leve', 'antecipacao'], 12, true),

('clientes_recorrentes', '2.3', 'Acho que não preciso todo mês',
 'Perfeito, [nome]. ❤️ Você conhece melhor o seu corpo. Só uma coisa: a constância leve é o que faz a diferença. Não é sobre usar muito — é sobre manter um mínimo pra não perder os benefícios. Se quiser, posso te sugerir uma rotina bem suave de manutenção. Quer ver como fica?',
 'Perfeito, [nome]. ❤️ Você conhece melhor o seu corpo. Só uma coisa: a constância leve é o que faz a diferença. Não é sobre usar muito — é sobre manter um mínimo pra não perder os benefícios. Se quiser, posso te sugerir uma rotina bem suave de manutenção. Quer ver como fica?',
 'Perfeito, [nome]. ❤️ Você conhece melhor o seu corpo. Só uma coisa: a constância leve é o que faz a diferença. Não é sobre usar muito — é sobre manter um mínimo pra não perder os benefícios. Se quiser, posso te sugerir uma rotina bem suave de manutenção. Quer ver como fica?',
 ARRAY['constancia', 'manutencao', 'rotina'], 13, true),

('clientes_recorrentes', '2.4', 'Esqueci de usar, por isso não quero comprar agora',
 'Totalmente normal! 😄 A rotina da gente é uma loucura mesmo. O lado bom é que o produto não estraga e você pode ajustar seu ritmo. Se quiser, posso te ajudar com uma rotina simples de lembretes pra você usar sem esforço — e aí você decide a reposição sem pressa. Quer que eu te mande?',
 'Totalmente normal! 😄 A rotina da gente é uma loucura mesmo. O lado bom é que o produto não estraga e você pode ajustar seu ritmo. Se quiser, posso te ajudar com uma rotina simples de lembretes pra você usar sem esforço — e aí você decide a reposição sem pressa. Quer que eu te mande?',
 'Totalmente normal! 😄 A rotina da gente é uma loucura mesmo. O lado bom é que o produto não estraga e você pode ajustar seu ritmo. Se quiser, posso te ajudar com uma rotina simples de lembretes pra você usar sem esforço — e aí você decide a reposição sem pressa. Quer que eu te mande?',
 ARRAY['esqueceu', 'rotina', 'lembretes'], 14, true),

('clientes_recorrentes', '2.5', 'Vou ver depois',
 'Claro, sem problema nenhum. ❤️ Pra não ficar pesado, posso te enviar as três opções bem levinhas (50 PV, 75 PV e 100 PV) e você escolhe quando quiser. Assim você já sabe o que funciona melhor pro seu dia. Quer que eu te envie agora ou prefere mais tarde?',
 'Claro, sem problema nenhum. ❤️ Pra não ficar pesado, posso te enviar as três opções bem levinhas (50 PV, 75 PV e 100 PV) e você escolhe quando quiser. Assim você já sabe o que funciona melhor pro seu dia. Quer que eu te envie agora ou prefere mais tarde?',
 'Claro, sem problema nenhum. ❤️ Pra não ficar pesado, posso te enviar as três opções bem levinhas (50 PV, 75 PV e 100 PV) e você escolhe quando quiser. Assim você já sabe o que funciona melhor pro seu dia. Quer que eu te envie agora ou prefere mais tarde?',
 ARRAY['ver_depois', 'opcoes', 'pv'], 15, true)
ON CONFLICT (categoria, codigo) 
DO UPDATE SET
  objeção = EXCLUDED.objeção,
  versao_curta = EXCLUDED.versao_curta,
  versao_media = EXCLUDED.versao_media,
  versao_longa = EXCLUDED.versao_longa,
  tags = EXCLUDED.tags,
  ordem = EXCLUDED.ordem,
  ativo = EXCLUDED.ativo;

-- =====================================================
-- CATEGORIA 3 — OBJEÇÕES DE RECRUTAMENTO
-- REGRA DE OURO: NUNCA mencionar PV para novos prospects
-- =====================================================

INSERT INTO wellness_objecoes (categoria, codigo, objeção, versao_curta, versao_media, versao_longa, tags, ordem, ativo) VALUES
('recrutamento', '3.1', 'Eu não tenho tempo para isso',
 'Super compreendo, [nome]. Hoje em dia ninguém tem tempo sobrando. 🙏 A boa notícia é que esse projeto começa leve: você investe alguns minutinhos por dia, literalmente. O que faz dar certo não é ter muito tempo — é ter um passo simples que cabe no seu dia. Se quiser, te mostro como isso funciona na prática. Quer ver?',
 'Super compreendo, [nome]. Hoje em dia ninguém tem tempo sobrando. 🙏 A boa notícia é que esse projeto começa leve: você investe alguns minutinhos por dia, literalmente. O que faz dar certo não é ter muito tempo — é ter um passo simples que cabe no seu dia. Se quiser, te mostro como isso funciona na prática. Quer ver?',
 'Super compreendo, [nome]. Hoje em dia ninguém tem tempo sobrando. 🙏 A boa notícia é que esse projeto começa leve: você investe alguns minutinhos por dia, literalmente. O que faz dar certo não é ter muito tempo — é ter um passo simples que cabe no seu dia. Se quiser, te mostro como isso funciona na prática. Quer ver?',
 ARRAY['tempo', 'flexibilidade', 'simples'], 16, true),

('recrutamento', '3.2', 'Eu não sou vendedor(a)',
 'Perfeito, e nem precisa ser! 😄 Esse projeto não é sobre "vender", é sobre compartilhar algo que já ajuda você e outras pessoas. A maioria do time começou exatamente assim: sem experiência nenhuma. Se quiser, te mostro o jeito leve e natural de começar sem parecer vendedor. Pode ser?',
 'Perfeito, e nem precisa ser! 😄 Esse projeto não é sobre "vender", é sobre compartilhar algo que já ajuda você e outras pessoas. A maioria do time começou exatamente assim: sem experiência nenhuma. Se quiser, te mostro o jeito leve e natural de começar sem parecer vendedor. Pode ser?',
 'Perfeito, e nem precisa ser! 😄 Esse projeto não é sobre "vender", é sobre compartilhar algo que já ajuda você e outras pessoas. A maioria do time começou exatamente assim: sem experiência nenhuma. Se quiser, te mostro o jeito leve e natural de começar sem parecer vendedor. Pode ser?',
 ARRAY['vender', 'compartilhar', 'natural'], 17, true),

('recrutamento', '3.3', 'Tenho vergonha de chamar as pessoas',
 'Totalmente normal! Muitas pessoas sentem isso no começo. ❤️ O segredo é começar leve, com mensagens simples e naturais — nada de forçar conversa. E eu posso te dar exatamente os textos prontos, no seu estilo, pra você se sentir seguro(a). Quer que eu te mostre como fica?',
 'Totalmente normal! Muitas pessoas sentem isso no começo. ❤️ O segredo é começar leve, com mensagens simples e naturais — nada de forçar conversa. E eu posso te dar exatamente os textos prontos, no seu estilo, pra você se sentir seguro(a). Quer que eu te mostre como fica?',
 'Totalmente normal! Muitas pessoas sentem isso no começo. ❤️ O segredo é começar leve, com mensagens simples e naturais — nada de forçar conversa. E eu posso te dar exatamente os textos prontos, no seu estilo, pra você se sentir seguro(a). Quer que eu te mostre como fica?',
 ARRAY['vergonha', 'textos_prontos', 'seguranca'], 18, true),

('recrutamento', '3.4', 'Não conheço muita gente',
 'Acredita que quase todo mundo começa falando isso? 😄 E depois percebe que conhece mais pessoas do que imagina. E outra: você não precisa de muitas pessoas — só de algumas pra começar leve. Eu posso te ajudar a identificar 5 nomes pra você dar o primeiro passo. Quer tentar?',
 'Acredita que quase todo mundo começa falando isso? 😄 E depois percebe que conhece mais pessoas do que imagina. E outra: você não precisa de muitas pessoas — só de algumas pra começar leve. Eu posso te ajudar a identificar 5 nomes pra você dar o primeiro passo. Quer tentar?',
 'Acredita que quase todo mundo começa falando isso? 😄 E depois percebe que conhece mais pessoas do que imagina. E outra: você não precisa de muitas pessoas — só de algumas pra começar leve. Eu posso te ajudar a identificar 5 nomes pra você dar o primeiro passo. Quer tentar?',
 ARRAY['contatos', 'comecar', '5_nomes'], 19, true),

('recrutamento', '3.5', 'Tenho medo de não dar certo',
 'Faz sentido sentir isso. Todo começo novo dá um friozinho mesmo. ❤️ Mas você não começa sozinho(a): eu caminho com você, passo a passo. E você só precisa começar leve, com pequenas ações. Quer que eu te mostre o jeito mais seguro de começar?',
 'Faz sentido sentir isso. Todo começo novo dá um friozinho mesmo. ❤️ Mas você não começa sozinho(a): eu caminho com você, passo a passo. E você só precisa começar leve, com pequenas ações. Quer que eu te mostre o jeito mais seguro de começar?',
 'Faz sentido sentir isso. Todo começo novo dá um friozinho mesmo. ❤️ Mas você não começa sozinho(a): eu caminho com você, passo a passo. E você só precisa começar leve, com pequenas ações. Quer que eu te mostre o jeito mais seguro de começar?',
 ARRAY['medo', 'acompanhamento', 'seguro'], 20, true),

('recrutamento', '3.6', 'Não tenho dinheiro para começar',
 'Super compreensível, [nome]. 🙏 O bom desse projeto é que você pode começar de forma bem leve com um pedido pequeno, sem peso financeiro. E ainda recupera o valor rápido com os primeiros kits. Se quiser, te mostro a forma mais econômica possível de começar. Pode ser?',
 'Super compreensível, [nome]. 🙏 O bom desse projeto é que você pode começar de forma bem leve com um pedido pequeno, sem peso financeiro. E ainda recupera o valor rápido com os primeiros kits. Se quiser, te mostro a forma mais econômica possível de começar. Pode ser?',
 'Super compreensível, [nome]. 🙏 O bom desse projeto é que você pode começar de forma bem leve com um pedido pequeno, sem peso financeiro. E ainda recupera o valor rápido com os primeiros kits. Se quiser, te mostro a forma mais econômica possível de começar. Pode ser?',
 ARRAY['dinheiro', 'economia', 'leve'], 21, true),

('recrutamento', '3.7', 'Não entendo nada de Herbalife / Wellness',
 'Ninguém começa sabendo! 😄 E, sinceramente, nem precisa. O sistema é feito pra você aprender no caminho, com passos simples e duplicáveis. E eu te ensino tudo o que precisa — sem informação demais. Quer que eu te mostre como seria seu começo?',
 'Ninguém começa sabendo! 😄 E, sinceramente, nem precisa. O sistema é feito pra você aprender no caminho, com passos simples e duplicáveis. E eu te ensino tudo o que precisa — sem informação demais. Quer que eu te mostre como seria seu começo?',
 'Ninguém começa sabendo! 😄 E, sinceramente, nem precisa. O sistema é feito pra você aprender no caminho, com passos simples e duplicáveis. E eu te ensino tudo o que precisa — sem informação demais. Quer que eu te mostre como seria seu começo?',
 ARRAY['aprender', 'simples', 'duplicavel'], 22, true),

('recrutamento', '3.8', 'Isso não é para mim',
 'Respeito total, [nome]. ❤️ Só te digo uma coisa leve: muita gente que pensava isso descobriu que era exatamente o tipo de projeto que encaixava no ritmo dela. Se quiser, posso te mostrar uma forma de começar sem compromisso nenhum — só pra você sentir se faz sentido. Quer ver?',
 'Respeito total, [nome]. ❤️ Só te digo uma coisa leve: muita gente que pensava isso descobriu que era exatamente o tipo de projeto que encaixava no ritmo dela. Se quiser, posso te mostrar uma forma de começar sem compromisso nenhum — só pra você sentir se faz sentido. Quer ver?',
 'Respeito total, [nome]. ❤️ Só te digo uma coisa leve: muita gente que pensava isso descobriu que era exatamente o tipo de projeto que encaixava no ritmo dela. Se quiser, posso te mostrar uma forma de começar sem compromisso nenhum — só pra você sentir se faz sentido. Quer ver?',
 ARRAY['perfil', 'teste', 'sem_compromisso'], 23, true),

('recrutamento', '3.9', 'Não quero incomodar as pessoas',
 'Perfeito, e nós também não queremos isso. 😊 O jeito que a gente trabalha aqui é leve: ninguém força nada. Você só compartilha de um jeito natural, sem pressão. E eu posso te mostrar textos prontos que não incomodam ninguém, só abrem conversa. Quer que eu te mostre?',
 'Perfeito, e nós também não queremos isso. 😊 O jeito que a gente trabalha aqui é leve: ninguém força nada. Você só compartilha de um jeito natural, sem pressão. E eu posso te mostrar textos prontos que não incomodam ninguém, só abrem conversa. Quer que eu te mostre?',
 'Perfeito, e nós também não queremos isso. 😊 O jeito que a gente trabalha aqui é leve: ninguém força nada. Você só compartilha de um jeito natural, sem pressão. E eu posso te mostrar textos prontos que não incomodam ninguém, só abrem conversa. Quer que eu te mostre?',
 ARRAY['incomodar', 'leve', 'textos_prontos'], 24, true),

('recrutamento', '3.10', 'Eu já tentei antes e não funcionou',
 'Entendo demais, [nome]. 🙏 O que muda agora é que você não vai caminhar sozinho(a). O processo é mais leve, mais claro e muito mais duplicável. E você começa no seu ritmo — sem peso. Posso te mostrar como seria diferente dessa vez?',
 'Entendo demais, [nome]. 🙏 O que muda agora é que você não vai caminhar sozinho(a). O processo é mais leve, mais claro e muito mais duplicável. E você começa no seu ritmo — sem peso. Posso te mostrar como seria diferente dessa vez?',
 'Entendo demais, [nome]. 🙏 O que muda agora é que você não vai caminhar sozinho(a). O processo é mais leve, mais claro e muito mais duplicável. E você começa no seu ritmo — sem peso. Posso te mostrar como seria diferente dessa vez?',
 ARRAY['tentou', 'diferente', 'acompanhamento'], 25, true)
ON CONFLICT (categoria, codigo) 
DO UPDATE SET
  objeção = EXCLUDED.objeção,
  versao_curta = EXCLUDED.versao_curta,
  versao_media = EXCLUDED.versao_media,
  versao_longa = EXCLUDED.versao_longa,
  tags = EXCLUDED.tags,
  ordem = EXCLUDED.ordem,
  ativo = EXCLUDED.ativo;

-- =====================================================
-- CATEGORIA 4 — OBJEÇÕES DE DISTRIBUIDORES
-- =====================================================

INSERT INTO wellness_objecoes (categoria, codigo, objeção, versao_curta, versao_media, versao_longa, tags, ordem, ativo) VALUES
('distribuidores', '4.1', 'Tenho medo de errar a abordagem',
 'Isso é mais comum do que você imagina, e é totalmente normal. 😊 O segredo não é ser perfeito — é ser leve. A abordagem certa é aquela que não parece abordagem. Eu posso te dar mensagens prontas e naturais, do jeitinho que funciona no dia a dia. Quer que eu te mostre uma agora?',
 'Isso é mais comum do que você imagina, e é totalmente normal. 😊 O segredo não é ser perfeito — é ser leve. A abordagem certa é aquela que não parece abordagem. Eu posso te dar mensagens prontas e naturais, do jeitinho que funciona no dia a dia. Quer que eu te mostre uma agora?',
 'Isso é mais comum do que você imagina, e é totalmente normal. 😊 O segredo não é ser perfeito — é ser leve. A abordagem certa é aquela que não parece abordagem. Eu posso te dar mensagens prontas e naturais, do jeitinho que funciona no dia a dia. Quer que eu te mostre uma agora?',
 ARRAY['medo', 'abordagem', 'textos_prontos'], 26, true),

('distribuidores', '4.2', 'Não sei o que dizer para as pessoas',
 'Fica tranquilo(a). É exatamente pra isso que eu estou aqui. 🙌 Você não precisa inventar nada — só seguir mensagens simples, curtas e naturais. Me diga o tipo de pessoa (próximo, indicação, Instagram…) e eu te entrego o texto certinho pra enviar. Quer começar por quem?',
 'Fica tranquilo(a). É exatamente pra isso que eu estou aqui. 🙌 Você não precisa inventar nada — só seguir mensagens simples, curtas e naturais. Me diga o tipo de pessoa (próximo, indicação, Instagram…) e eu te entrego o texto certinho pra enviar. Quer começar por quem?',
 'Fica tranquilo(a). É exatamente pra isso que eu estou aqui. 🙌 Você não precisa inventar nada — só seguir mensagens simples, curtas e naturais. Me diga o tipo de pessoa (próximo, indicação, Instagram…) e eu te entrego o texto certinho pra enviar. Quer começar por quem?',
 ARRAY['textos_prontos', 'simples', 'natural'], 27, true),

('distribuidores', '4.3', 'Tenho medo de rejeição',
 'Entendo 100%. ❤️ A verdade é que ninguém está rejeitando você — as pessoas só reagem ao momento delas. E, na maioria das vezes, a resposta não tem nada a ver com o seu valor. Eu te ensino formas de falar que não criam pressão, e aí ninguém se sente incomodado. Quer que eu te mostre uma abordagem bem segura?',
 'Entendo 100%. ❤️ A verdade é que ninguém está rejeitando você — as pessoas só reagem ao momento delas. E, na maioria das vezes, a resposta não tem nada a ver com o seu valor. Eu te ensino formas de falar que não criam pressão, e aí ninguém se sente incomodado. Quer que eu te mostre uma abordagem bem segura?',
 'Entendo 100%. ❤️ A verdade é que ninguém está rejeitando você — as pessoas só reagem ao momento delas. E, na maioria das vezes, a resposta não tem nada a ver com o seu valor. Eu te ensino formas de falar que não criam pressão, e aí ninguém se sente incomodado. Quer que eu te mostre uma abordagem bem segura?',
 ARRAY['rejeicao', 'seguranca', 'sem_pressao'], 28, true),

('distribuidores', '4.4', 'Não tenho disciplina',
 'Disciplina não nasce pronta — ela nasce pequena. E é por isso que aqui a gente trabalha com micro-ações, não com grandes metas. Se você fizer 1 ação por dia, já está no jogo e já está evoluindo. Quer que eu te diga qual é a sua micro-ação de hoje?',
 'Disciplina não nasce pronta — ela nasce pequena. E é por isso que aqui a gente trabalha com micro-ações, não com grandes metas. Se você fizer 1 ação por dia, já está no jogo e já está evoluindo. Quer que eu te diga qual é a sua micro-ação de hoje?',
 'Disciplina não nasce pronta — ela nasce pequena. E é por isso que aqui a gente trabalha com micro-ações, não com grandes metas. Se você fizer 1 ação por dia, já está no jogo e já está evoluindo. Quer que eu te diga qual é a sua micro-ação de hoje?',
 ARRAY['disciplina', 'micro_acoes', 'evolucao'], 29, true),

('distribuidores', '4.5', 'Sou tímido(a)',
 'Tímidos trabalham MUITO bem nesse projeto, sabia? Porque falam com leveza, sem pressão, e isso gera confiança. Além disso, você pode começar só por mensagem, sem áudio ou vídeo. Eu preparo tudo pra você copiar e colar. Quer testar uma abordagem leve agora?',
 'Tímidos trabalham MUITO bem nesse projeto, sabia? Porque falam com leveza, sem pressão, e isso gera confiança. Além disso, você pode começar só por mensagem, sem áudio ou vídeo. Eu preparo tudo pra você copiar e colar. Quer testar uma abordagem leve agora?',
 'Tímidos trabalham MUITO bem nesse projeto, sabia? Porque falam com leveza, sem pressão, e isso gera confiança. Além disso, você pode começar só por mensagem, sem áudio ou vídeo. Eu preparo tudo pra você copiar e colar. Quer testar uma abordagem leve agora?',
 ARRAY['timidez', 'leveza', 'mensagem'], 30, true),

('distribuidores', '4.6', 'Não sei usar as ferramentas',
 'Perfeito, e você não precisa saber tudo agora. Eu te ensino passo a passo, sem pressa e sem complicação. Me diga qual ferramenta você quer usar e eu te mostro em segundos como funciona. Quer começar por qual?',
 'Perfeito, e você não precisa saber tudo agora. Eu te ensino passo a passo, sem pressa e sem complicação. Me diga qual ferramenta você quer usar e eu te mostro em segundos como funciona. Quer começar por qual?',
 'Perfeito, e você não precisa saber tudo agora. Eu te ensino passo a passo, sem pressa e sem complicação. Me diga qual ferramenta você quer usar e eu te mostro em segundos como funciona. Quer começar por qual?',
 ARRAY['ferramentas', 'ensino', 'simples'], 31, true),

('distribuidores', '4.7', 'Não consigo vender',
 'Isso acontece quando a gente tenta "vender". O segredo é não vender — é conversar, despertar curiosidade e oferecer leveza. E isso qualquer pessoa consegue. Me diz quem é a pessoa que você quer conversar agora que eu te entrego a mensagem certinha pra funcionar.',
 'Isso acontece quando a gente tenta "vender". O segredo é não vender — é conversar, despertar curiosidade e oferecer leveza. E isso qualquer pessoa consegue. Me diz quem é a pessoa que você quer conversar agora que eu te entrego a mensagem certinha pra funcionar.',
 'Isso acontece quando a gente tenta "vender". O segredo é não vender — é conversar, despertar curiosidade e oferecer leveza. E isso qualquer pessoa consegue. Me diz quem é a pessoa que você quer conversar agora que eu te entrego a mensagem certinha pra funcionar.',
 ARRAY['vender', 'conversar', 'curiosidade'], 32, true),

('distribuidores', '4.8', 'Não consigo recrutar',
 'Recrutamento não é sobre convencer ninguém — é sobre convidar leve. É abrir portas, não empurrar ninguém. A maioria dos líderes começou sem recrutar ninguém no começo. Eu posso te dar 3 mensagens simples pra você enviar agora e destravar isso. Quer?',
 'Recrutamento não é sobre convencer ninguém — é sobre convidar leve. É abrir portas, não empurrar ninguém. A maioria dos líderes começou sem recrutar ninguém no começo. Eu posso te dar 3 mensagens simples pra você enviar agora e destravar isso. Quer?',
 'Recrutamento não é sobre convencer ninguém — é sobre convidar leve. É abrir portas, não empurrar ninguém. A maioria dos líderes começou sem recrutar ninguém no começo. Eu posso te dar 3 mensagens simples pra você enviar agora e destravar isso. Quer?',
 ARRAY['recrutar', 'convite_leve', 'mensagens'], 33, true),

('distribuidores', '4.9', 'Acho que não sirvo para isso',
 'Entendo esse sentimento, mas deixa eu te dizer uma coisa real: ninguém "nasce pronto". Você só precisa estar disposto(a) a dar pequenos passos. E eu caminho cada um deles com você. O que você sente que mais te trava? Assim eu te ajudo bem no ponto certo.',
 'Entendo esse sentimento, mas deixa eu te dizer uma coisa real: ninguém "nasce pronto". Você só precisa estar disposto(a) a dar pequenos passos. E eu caminho cada um deles com você. O que você sente que mais te trava? Assim eu te ajudo bem no ponto certo.',
 'Entendo esse sentimento, mas deixa eu te dizer uma coisa real: ninguém "nasce pronto". Você só precisa estar disposto(a) a dar pequenos passos. E eu caminho cada um deles com você. O que você sente que mais te trava? Assim eu te ajudo bem no ponto certo.',
 ARRAY['autoestima', 'pequenos_passos', 'apoio'], 34, true),

('distribuidores', '4.10', 'Minha equipe não anda',
 'Isso acontece com TODOS os líderes em algum momento. Não é falta de potencial, é falta de ritmo. A gente resolve isso juntos com ações simples que reacendem o time. Podemos começar com uma mensagem de reativação leve pros seus distribuidores. Quer que eu prepare pra você agora?',
 'Isso acontece com TODOS os líderes em algum momento. Não é falta de potencial, é falta de ritmo. A gente resolve isso juntos com ações simples que reacendem o time. Podemos começar com uma mensagem de reativação leve pros seus distribuidores. Quer que eu prepare pra você agora?',
 'Isso acontece com TODOS os líderes em algum momento. Não é falta de potencial, é falta de ritmo. A gente resolve isso juntos com ações simples que reacendem o time. Podemos começar com uma mensagem de reativação leve pros seus distribuidores. Quer que eu prepare pra você agora?',
 ARRAY['equipe', 'reativacao', 'lideranca'], 35, true)
ON CONFLICT (categoria, codigo) 
DO UPDATE SET
  objeção = EXCLUDED.objeção,
  versao_curta = EXCLUDED.versao_curta,
  versao_media = EXCLUDED.versao_media,
  versao_longa = EXCLUDED.versao_longa,
  tags = EXCLUDED.tags,
  ordem = EXCLUDED.ordem,
  ativo = EXCLUDED.ativo;

-- =====================================================
-- CATEGORIA 5 — OBJEÇÕES AVANÇADAS
-- =====================================================

INSERT INTO wellness_objecoes (categoria, codigo, objeção, versao_curta, versao_media, versao_longa, tags, ordem, ativo) VALUES
('avancadas', '5.1', 'Medos ocultos',
 'Obrigado por abrir isso comigo, [nome]. 🙏 Muitas vezes o medo não é do projeto — é do desconhecido. E está tudo bem. A gente caminha junto, no seu ritmo, sem pressão. Quero te ajudar a ganhar clareza, porque quando a gente entende o caminho, o medo diminui muito. Quer que eu te mostre um jeito leve de começar sem risco?',
 'Obrigado por abrir isso comigo, [nome]. 🙏 Muitas vezes o medo não é do projeto — é do desconhecido. E está tudo bem. A gente caminha junto, no seu ritmo, sem pressão. Quero te ajudar a ganhar clareza, porque quando a gente entende o caminho, o medo diminui muito. Quer que eu te mostre um jeito leve de começar sem risco?',
 'Obrigado por abrir isso comigo, [nome]. 🙏 Muitas vezes o medo não é do projeto — é do desconhecido. E está tudo bem. A gente caminha junto, no seu ritmo, sem pressão. Quero te ajudar a ganhar clareza, porque quando a gente entende o caminho, o medo diminui muito. Quer que eu te mostre um jeito leve de começar sem risco?',
 ARRAY['medo', 'clareza', 'sem_risco'], 36, true),

('avancadas', '5.2', 'Resistência emocional',
 'Totalmente compreensível. ❤️ Às vezes a resistência não é contra o projeto — é contra uma mudança que parece grande demais. Aqui você não precisa mudar tudo: só dar um passo pequeno. E eu te ajudo em cada um deles. Me conta: o que mais te pega por dentro quando pensa nisso?',
 'Totalmente compreensível. ❤️ Às vezes a resistência não é contra o projeto — é contra uma mudança que parece grande demais. Aqui você não precisa mudar tudo: só dar um passo pequeno. E eu te ajudo em cada um deles. Me conta: o que mais te pega por dentro quando pensa nisso?',
 'Totalmente compreensível. ❤️ Às vezes a resistência não é contra o projeto — é contra uma mudança que parece grande demais. Aqui você não precisa mudar tudo: só dar um passo pequeno. E eu te ajudo em cada um deles. Me conta: o que mais te pega por dentro quando pensa nisso?',
 ARRAY['resistencia', 'mudanca', 'pequenos_passos'], 37, true),

('avancadas', '5.3', 'Justificativas sociais',
 'Entendo demais, [nome]. A opinião dos outros pesa mesmo. Mas deixa eu te dizer uma coisa leve: ninguém vive sua vida por você. E quando as pessoas começam a ver seus resultados, a conversa muda rápido. Você não precisa anunciar nada — só caminhar em silêncio e deixar o resultado falar. Quer começar de forma discreta?',
 'Entendo demais, [nome]. A opinião dos outros pesa mesmo. Mas deixa eu te dizer uma coisa leve: ninguém vive sua vida por você. E quando as pessoas começam a ver seus resultados, a conversa muda rápido. Você não precisa anunciar nada — só caminhar em silêncio e deixar o resultado falar. Quer começar de forma discreta?',
 'Entendo demais, [nome]. A opinião dos outros pesa mesmo. Mas deixa eu te dizer uma coisa leve: ninguém vive sua vida por você. E quando as pessoas começam a ver seus resultados, a conversa muda rápido. Você não precisa anunciar nada — só caminhar em silêncio e deixar o resultado falar. Quer começar de forma discreta?',
 ARRAY['opiniao', 'discreto', 'resultados'], 38, true),

('avancadas', '5.4', 'Bloqueios financeiros',
 'Super respeito seu momento. 🙏 A ideia aqui não é te apertar, e sim te ajudar a encontrar uma forma leve de começar. Tem caminhos bem econômicos onde você já recupera rápido o que investiu. Se quiser, te mostro a forma mais segura pra você dar o primeiro passo sem peso. Pode ser?',
 'Super respeito seu momento. 🙏 A ideia aqui não é te apertar, e sim te ajudar a encontrar uma forma leve de começar. Tem caminhos bem econômicos onde você já recupera rápido o que investiu. Se quiser, te mostro a forma mais segura pra você dar o primeiro passo sem peso. Pode ser?',
 'Super respeito seu momento. 🙏 A ideia aqui não é te apertar, e sim te ajudar a encontrar uma forma leve de começar. Tem caminhos bem econômicos onde você já recupera rápido o que investiu. Se quiser, te mostro a forma mais segura pra você dar o primeiro passo sem peso. Pode ser?',
 ARRAY['financeiro', 'economia', 'seguro'], 39, true),

('avancadas', '5.5', 'Crenças limitantes',
 'Obrigado por confiar em mim pra falar disso. ❤️ Muitas vezes não é uma crença — é uma história que alguém contou pra você, e que ficou aí dentro. Mas nada disso define seu futuro. Vamos construir uma narrativa nova, leve, que combina com quem você está se tornando. Posso te mostrar um jeito simples de destravar isso juntos?',
 'Obrigado por confiar em mim pra falar disso. ❤️ Muitas vezes não é uma crença — é uma história que alguém contou pra você, e que ficou aí dentro. Mas nada disso define seu futuro. Vamos construir uma narrativa nova, leve, que combina com quem você está se tornando. Posso te mostrar um jeito simples de destravar isso juntos?',
 'Obrigado por confiar em mim pra falar disso. ❤️ Muitas vezes não é uma crença — é uma história que alguém contou pra você, e que ficou aí dentro. Mas nada disso define seu futuro. Vamos construir uma narrativa nova, leve, que combina com quem você está se tornando. Posso te mostrar um jeito simples de destravar isso juntos?',
 ARRAY['crencas', 'narrativa', 'destravar'], 40, true)
ON CONFLICT (categoria, codigo) 
DO UPDATE SET
  objeção = EXCLUDED.objeção,
  versao_curta = EXCLUDED.versao_curta,
  versao_media = EXCLUDED.versao_media,
  versao_longa = EXCLUDED.versao_longa,
  tags = EXCLUDED.tags,
  ordem = EXCLUDED.ordem,
  ativo = EXCLUDED.ativo;

COMMIT;

-- =====================================================
-- RESUMO:
-- Total de objeções inseridas: 40
-- - Clientes: 10 (1.1 a 1.10)
-- - Clientes Recorrentes: 5 (2.1 a 2.5)
-- - Recrutamento: 10 (3.1 a 3.10) - REGRA DE OURO aplicada
-- - Distribuidores: 10 (4.1 a 4.10)
-- - Avançadas: 5 (5.1 a 5.5)
-- =====================================================

