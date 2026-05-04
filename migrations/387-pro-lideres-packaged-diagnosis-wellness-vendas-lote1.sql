-- Lote 1 (5 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): vendas wellness (catálogo Pro Líderes).
-- Filosofia: src/config/ylada-diagnosis-result-standard.ts (convite a falar com quem enviou o link).
-- diagnosis_vertical NULL: fetchPackagedDiagnosisOutcome usa estas linhas como fallback para qualquer link
-- com o mesmo flow_id (inclui links com meta.diagnosis_vertical = pro_lideres).
-- flow_id = fluxos-clientes.id; API também lê meta.pro_lideres_fluxo_id como flowId.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'energia-matinal',
    'energia-tarde',
    'troca-cafe',
    'anti-cansaco',
    'rotina-puxada'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  -- --- Energia Matinal ---
  (
    'energia-matinal',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua manhã ainda dá para alinhar sem virar batalha',
      'profile_summary', 'Pelas respostas, você já notou que acordar nem sempre é leve — mas o cenário ainda parece manejável, mais “desconforto recorrente” do que colapso.',
      'frase_identificacao', 'Se isso combina com você, provavelmente você já pensou: “eu consigo funcionar, só que o começo do dia não colabora”.',
      'main_blocker', 'A tensão está em depender de algo externo (como estimulante) ou levantar sem sensação de presença — o ritmo da manhã não sustenta o que você quer do seu dia.',
      'consequence', 'Se esse padrão vira o normal, o dia inteiro pode parecer curto demais e as escolhas boas para você ficam sempre “para quando der tempo”.',
      'growth_potential', 'Uma conversa com quem te enviou este link costuma destravar um apoio simples (hábitos + nutrição funcional) para manhã com mais clareza e menos improviso.',
      'dica_rapida', 'Olhe só as duas primeiras horas depois de acordar: é onde o dia “define o tom” — pequeno ajuste ali costuma mudar a sensação geral.',
      'cta_text', 'Quero falar com quem me enviou sobre minha manhã',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia matinal e o resultado mostrou que minha manhã ainda pede um ajuste leve. Quero conversar com quem me enviou este link sobre o próximo passo.'
    )
  ),
  (
    'energia-matinal',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua manhã está pedindo atenção de verdade',
      'profile_summary', 'Pelas respostas, levantar cansado(a), render pouco cedo e buscar “ligar” rápido já não é detalhe — é um padrão que aparece na produtividade e no humor.',
      'frase_identificacao', 'Se você se identificou, provavelmente já sentiu o dia começar meio atrasado, mesmo quando o relógio diz que não.',
      'main_blocker', 'O custo é alto nas primeiras horas: o corpo e a cabeça demoram para entrar no ritmo, e isso arrasta o resto da rotina.',
      'consequence', 'Continuar no automático tende a aumentar o desgaste e a sensação de estar sempre “apagando incêndio” em vez de conduzir o dia.',
      'growth_potential', 'Quem te enviou o link pode ajudar a montar um próximo passo prático — sem promessa milagrosa, mas com direção clara para estabilizar energia no começo do dia.',
      'dica_rapida', 'Quando a manhã falha, o que mais sobra é reação (café, pressa). Um plano simples de sustento costuma mudar mais que “força de vontade”.',
      'cta_text', 'Quero conversar sobre como melhorar minha energia matinal',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia matinal e apareceu um padrão mais forte de cansaço no começo do dia. Quero falar com quem me enviou este link para ver o próximo passo.'
    )
  ),
  (
    'energia-matinal',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu dia está começando no limite — isso merece conversa',
      'profile_summary', 'Pelas respostas, acordar esgotado(a), com muita dificuldade para levantar e dependência logo cedo de estimulante indica que a manhã virou gargalo central — não só fadiga.',
      'frase_identificacao', 'Se isso é a sua realidade, você provavelmente já notou que “aguentar até passar” virou estratégia diária.',
      'main_blocker', 'A tensão é peso real nas primeiras horas: você funciona, mas paga um preço alto em disposição e clareza até o corpo “aceitar” o dia.',
      'consequence', 'Manter esse ritmo sem endereçar costuma piorar a sensação de estar sempre recuperando energia em vez de construir consistência.',
      'growth_potential', 'O passo mais inteligente agora é falar com quem te enviou: há suporte de hábitos e nutrição para tirar isso do improviso e voltar a ter manhã sustentável.',
      'dica_rapida', 'Quando o gargalo é o acordar, não adianta só “se esforçar mais à noite” — o foco tem que ser o que sustenta você logo cedo.',
      'cta_text', 'Preciso de ajuda com energia ao acordar — vamos conversar?',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia matinal e o resultado ficou bem forte no cansaço ao acordar e na dificuldade de começar o dia. Quero conversar com quem me enviou este link com urgência para ver o que fazer.'
    )
  ),

  -- --- Energia da Tarde ---
  (
    'energia-tarde',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'O “apagão” da tarde está aparecendo — ainda dá para virar o jogo',
      'profile_summary', 'Pelas respostas, você já percebe queda de energia no meio da tarde, mas ela ainda parece controlável — mais incômodo recorrente do que travamento total.',
      'frase_identificacao', 'Se você se identificou, talvez já tenha associado certo horário do dia ao famoso “modo sobrevivência”.',
      'main_blocker', 'A tensão é perder fôlego no meio do expediente: foco e humor caem quando você ainda precisa render.',
      'consequence', 'Deixar isso solto costuma virar ciclo de compensação (doce, mais café, pausa improdutiva) que não resolve a causa do cansaço.',
      'growth_potential', 'Conversar com quem te enviou o link ajuda a ver o que sustenta energia de forma estável até o fim do dia — prático e alinhado à sua rotina.',
      'dica_rapida', 'A tarde revela como a manhã e o almoço te prepararam: quando o meio do dia desaba, muitas vezes o ajuste é de ritmo, não só “empurrar”.',
      'cta_text', 'Quero falar sobre minha energia à tarde',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia da tarde e saiu que tenho uma queda leve mas recorrente no meio do dia. Quero conversar com quem me enviou este link sobre como estabilizar isso.'
    )
  ),
  (
    'energia-tarde',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua tarde está comendo o seu melhor desempenho',
      'profile_summary', 'Pelas respostas, a queda depois do almoço ou no meio da tarde já atrapalha trabalho, estudos ou humor com frequência.',
      'frase_identificacao', 'Se isso é familiar, você provavelmente já calcula o dia em “antes e depois do apagão”.',
      'main_blocker', 'O bloqueio é sustentar produtividade e bem-estar no segundo tempo do dia sem depender de atalhos que depois cobram a conta.',
      'consequence', 'Seguir nesse ritmo tende a gerar sensação de atraso constante: você termina o dia cansado e com a sensação de que a parte mais importante ficou pela metade.',
      'growth_potential', 'Quem te enviou pode indicar um caminho de apoio nutricional/hábitos focado em estabilizar energia — para a tarde parar de ser o seu vilão.',
      'dica_rapida', 'Quando a tarde cai, o corpo costuma pedir sustento de verdade, não só estímulo — o próximo passo costuma ser combinação simples e repetível.',
      'cta_text', 'Quero ajuda para parar de travar à tarde',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia da tarde e o resultado mostrou que a queda no meio do dia já me atrapalha bastante. Quero falar com quem me enviou este link para montar o próximo passo.'
    )
  ),
  (
    'energia-tarde',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua tarde virou o ponto fraco do dia — isso precisa de plano',
      'profile_summary', 'Pelas respostas, a queda de energia no meio da tarde é intensa, recorrente e já interfere de forma clara no que você precisa cumprir.',
      'frase_identificacao', 'Se você se identificou, é provável que já use “força bruta” ou compensações só para chegar ao fim do expediente.',
      'main_blocker', 'A tensão é alto impacto na vida prática: foco, humor e consistência caem exatamente quando ainda há metade do dia pela frente.',
      'consequence', 'Sem endereçar, esse padrão costuma aumentar irritação, procrastinação e sensação de nunca render o que você quer.',
      'growth_potential', 'O melhor movimento agora é falar com quem te enviou o link: dá para estruturar suporte com nutrição funcional e hábitos para estabilizar energia ao longo do dia.',
      'dica_rapida', 'Quando a tarde “mata” o desempenho, o problema raramente é só disciplina — costuma ser sustento e ritmo acumulados desde cedo.',
      'cta_text', 'Preciso resolver essa queda de energia à tarde',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia da tarde e o resultado ficou forte: a queda no meio do dia já me atrapalha muito. Quero conversar com quem me enviou este link para ver um plano.'
    )
  ),

  -- --- Troca inteligente do café ---
  (
    'troca-cafe',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu café pode estar te dando energia “emprestada”',
      'profile_summary', 'Pelas respostas, você toma café com frequência e já notou algum vai-e-vém de disposição — ainda em nível que parece manejável.',
      'frase_identificacao', 'Se isso faz sentido, você provavelmente já sentiu o dia oscilar entre ligado demais e apagado.',
      'main_blocker', 'A tensão é depender de estimulante para manter ritmo e depois pagar com queda de clareza ou irritação.',
      'consequence', 'Se o ciclo continua, vira normal “precisar de mais uma xícara” só para voltar ao patamar básico de funcionamento.',
      'growth_potential', 'Conversar com quem te enviou ajuda a testar alternativas mais estáveis (bebidas funcionais / combinação de hábitos) sem discurso radicalista.',
      'dica_rapida', 'Energia boa costuma ser a que sustenta, não só a que empurra — a troca inteligente é sobre ritmo, não sobre culpa.',
      'cta_text', 'Quero ver opções melhores que só café',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre troca inteligente do café e saiu que tenho picos e quedas leves de energia ligados ao café. Quero conversar com quem me enviou este link sobre alternativas mais estáveis.'
    )
  ),
  (
    'troca-cafe',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'O café está segurando seu dia — e cobrando depois',
      'profile_summary', 'Pelas respostas, o consumo é frequente e os sinais de instabilidade (picos, quedas, dificuldade de foco contínuo) já são recorrentes.',
      'frase_identificacao', 'Se você se identificou, talvez já tenha tentado cortar e percebido que não é só “parar de tomar”.',
      'main_blocker', 'O padrão é usar café como alavanca principal; quando ele falha, o desempenho e o humor sentem na hora.',
      'consequence', 'Manter isso sem estratégia tende a aumentar tolerância e sensação de nunca estar “100%” sem estimulante.',
      'growth_potential', 'Quem te enviou o link pode mostrar um caminho de transição prático — substituição inteligente com apoio nutricional, sem virar sofrimento.',
      'dica_rapida', 'Trocar café não é guerra contra café: é construir outra base de energia para você não depender só dele.',
      'cta_text', 'Quero montar uma troca inteligente com apoio',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre troca do café e o resultado mostrou um padrão mais forte de picos e quedas. Quero falar com quem me enviou este link para ver como fazer essa transição.'
    )
  ),
  (
    'troca-cafe',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Café virou centro da sua energia — isso pesa no dia',
      'profile_summary', 'Pelas respostas, o volume é alto e os sinais de desgaste ou oscilação são fortes — o café parece indispensável e, mesmo assim, você não fica estável.',
      'frase_identificacao', 'Se isso é sua realidade, você provavelmente já sentiu que o dia “desliga” quando o estimulante some.',
      'main_blocker', 'A tensão é dependência funcional: sem o empurrão, falta foco, paciência e ritmo; com ele, o corpo cobra depois.',
      'consequence', 'Continuar no extremo aumenta cansaço acumulado, sensação de curto-circuito e dificuldade de regular sono e humor.',
      'growth_potential', 'Converse com quem te enviou: dá para desenhar um plano de sustentação de energia (nutrição funcional + hábitos) para você recuperar controle sem colapso.',
      'dica_rapida', 'Neste nível, o que mais ajuda não é culpa — é substituir a função do café por algo que sustente de verdade.',
      'cta_text', 'Preciso sair desse ciclo com café — vamos falar?',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre troca do café e o resultado ficou bem intenso: alto consumo e muitas oscilações. Quero conversar com quem me enviou este link para montar um plano de energia mais estável.'
    )
  ),

  -- --- Anti-Cansaço Geral ---
  (
    'anti-cansaco',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'O cansaço está presente — mas ainda parece “do dia a dia”',
      'profile_summary', 'Pelas respostas, você sente falta de disposição com frequência, em intensidade que ainda permite empurrar a rotina — mesmo com incômodo.',
      'frase_identificacao', 'Se você se identificou, provavelmente já se perguntou se “é só fadiga normal” ou se tem algo acumulando.',
      'main_blocker', 'A tensão é baixo rendimento contínuo: você funciona, mas sem folga energética para viver o dia com leveza.',
      'consequence', 'Se vira padrão, pequenas tarefas pesam mais do que deveriam e a sensação é de estar sempre um passo atrás do seu próprio ritmo.',
      'growth_potential', 'Falar com quem te enviou o link abre espaço para um apoio simples em hábitos e nutrição para recuperar fôlego no dia a dia.',
      'dica_rapida', 'Cansaço que não passa com descanso “normal” costuma pedir sustento, não só mais horas de cama.',
      'cta_text', 'Quero ver como melhorar minha disposição',
      'whatsapp_prefill', 'Oi! Fiz o quiz anti-cansaço e saiu um padrão leve/moderado de falta de energia ao longo do dia. Quero conversar com quem me enviou este link sobre o próximo passo.'
    )
  ),
  (
    'anti-cansaco',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu cansaço já é tema central da rotina',
      'profile_summary', 'Pelas respostas, a falta de disposição aparece na maior parte do dia e já afeta o que você consegue cumprir com consistência.',
      'frase_identificacao', 'Se isso combina com você, provavelmente você já tentou atalhos (café, energético, suplemento) sem sentir virada real.',
      'main_blocker', 'O bloqueio é energia que não “fecha a conta”: você até avança, mas paga caro em esforço e recuperação.',
      'consequence', 'Seguir assim tende a aumentar irritação, desânimo e sensação de que o dia sempre vence você no final.',
      'growth_potential', 'Quem te enviou pode ajudar a construir um plano prático — nutrição funcional e hábitos — para estabilizar energia sem discurso vazio.',
      'dica_rapida', 'Quando nada “resolve” rápido, o próximo passo costuma ser consistência pequena + suporte certo — não mais estimulante.',
      'cta_text', 'Quero apoio para sair desse cansaço constante',
      'whatsapp_prefill', 'Oi! Fiz o quiz anti-cansaço e o resultado mostrou cansaço recorrente que já pesa na minha rotina. Quero falar com quem me enviou este link para ver o que fazer.'
    )
  ),
  (
    'anti-cansaco',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Esse cansaço não é “só rotina” — merece endereçar com cuidado',
      'profile_summary', 'Pelas respostas, a falta de energia é intensa, frequente e já interfere de forma nítida no seu dia — com sinais de que atalhos não seguram.',
      'frase_identificacao', 'Se você se identificou, talvez já esteja administrando o dia no limite do que aguenta.',
      'main_blocker', 'A tensão é esgotamento operacional: você ainda se move, mas sem reserva — qualquer imprevisto derruba o resto.',
      'consequence', 'Manter isso sem plano costuma piorar sono, humor e capacidade de decisão — o dia vira reação contínua.',
      'growth_potential', 'O melhor passo é conversar com quem te enviou: há suporte estruturado (hábitos + nutrição) para recuperar base de energia com clareza e segurança.',
      'dica_rapida', 'Neste patamar, o foco é sustentação real do corpo — não empurrar mais com força de vontade.',
      'cta_text', 'Preciso de ajuda com esse cansaço — vamos conversar?',
      'whatsapp_prefill', 'Oi! Fiz o quiz anti-cansaço e o resultado ficou bem forte: cansaço constante que já atrapalha muito meu dia. Quero conversar com quem me enviou este link para ver um plano.'
    )
  ),

  -- --- Rotina puxada / trabalho intenso ---
  (
    'rotina-puxada',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua rotina exige mais do que o corpo entrega às vezes',
      'profile_summary', 'Pelas respostas, o dia costuma ser puxado e você já nota queda de energia ou foco em alguns trechos — ainda sem travar tudo.',
      'frase_identificacao', 'Se isso faz sentido, você provavelmente já vive no modo “vai dando” até o corpo reclamar.',
      'main_blocker', 'A tensão é carga alta sem reserva: você cumpre, mas paga com oscilação de desempenho ao longo do dia.',
      'consequence', 'Sem suporte certo, rotina intensa vira conta que sempre fecha no cansaço — não no resultado que você quer sustentar.',
      'growth_potential', 'Conversar com quem te enviou ajuda a encaixar apoio prático (nutrição funcional/hábitos) para aguentar o ritmo sem depender só de sobrecarga.',
      'dica_rapida', 'Rotina puxada precisa de combustível que dure — não só estímulo rápido no meio do caos.',
      'cta_text', 'Quero me preparar melhor para rotina intensa',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre rotina puxada e saiu que minha carga alta já gera oscilação de energia/foco. Quero falar com quem me enviou este link sobre como me sustentar melhor.'
    )
  ),
  (
    'rotina-puxada',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua rotina intensa está pedindo combustível de verdade',
      'profile_summary', 'Pelas respostas, você vive com demanda alta, sente necessidade grande de energia para cumprir o dia e nota queda ou falta de foco com recorrência.',
      'frase_identificacao', 'Se você se identificou, provavelmente já calcula o dia em blocos de “aguentar até”.',
      'main_blocker', 'O bloqueio é sustentar performance sem colapsar: o corpo e a cabeça pedem mais suporte do que improviso.',
      'consequence', 'Continuar no embalo aumenta erros, irritação e sensação de nunca chegar ao fim com folga.',
      'growth_potential', 'Quem te enviou o link pode montar próximo passo com apoio nutricional/hábitos voltado a estabilidade — para intensidade virar consistência.',
      'dica_rapida', 'Quem tem rotina pesada “paga” energia o dia todo; pequeno protocolo diário costuma valer mais que heroísmo pontual.',
      'cta_text', 'Quero consistência na minha rotina de trabalho',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre rotina puxada e o resultado mostrou que minha carga alta já afoca energia e foco com frequência. Quero conversar com quem me enviou este link para um plano.'
    )
  ),
  (
    'rotina-puxada',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você está no limite da sua carga diária — precisa de plano',
      'profile_summary', 'Pelas respostas, a rotina é muito exigente, a necessidade de energia é altíssima e a queda ou dificuldade de foco já compromete de forma clara o que você precisa entregar.',
      'frase_identificacao', 'Se isso é você, provavelmente já sentiu que “aguentar” virou estratégia principal — e ela está ficando curta.',
      'main_blocker', 'A tensão é desgaste acelerado: você funciona no limite e qualquer aumento de demanda derruba equilíbrio.',
      'consequence', 'Sem endereçar, o risco é entrar em ciclo de exaustão, menor qualidade no que você faz e sensação de estar sempre recuperando o fôlego.',
      'growth_potential', 'Converse com quem te enviou: dá para estruturar suporte com nutrição funcional e hábitos específicos para quem vive carga alta — com foco em sustentar o ritmo com segurança.',
      'dica_rapida', 'No limite, o que salva não é “forçar mais” — é base que segura performance ao longo das horas.',
      'cta_text', 'Preciso de suporte para aguentar essa rotina',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre rotina puxada e o resultado ficou bem intenso: alta demanda e queda forte de energia/foco. Quero conversar com quem me enviou este link para ver o melhor próximo passo.'
    )
  );
