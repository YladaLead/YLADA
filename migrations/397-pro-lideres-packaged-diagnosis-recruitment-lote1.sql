-- Lote 1 (5 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): recrutamento Pro Líderes (quizzes + clássicos iniciais).
-- Tom: oportunidade de negócio / conversa com quem enviou o link — sem promessa de ganho nem diagnóstico clínico.
-- diagnosis_vertical NULL (mesmo fallback que vendas Pro Líderes); meta.diagnosis_vertical = pro_lideres nos links novos.
-- v2: reescrita completa para PT-BR (eliminados europeísmos de v1).

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'quiz-recrut-ganhos-prosperidade',
    'quiz-recrut-potencial-crescimento',
    'quiz-recrut-proposito-equilibrio',
    'renda-extra-imediata',
    'maes-trabalhar-casa'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'quiz-recrut-ganhos-prosperidade',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil curioso sobre ganhos e crescimento — vale uma conversa',
      'profile_summary', 'Pelas respostas, há abertura para entender se o que foi proposto para você faz sentido, sem ainda ser um "sim" fechado. É um bom ponto de partida para falar com quem te enviou o link.',
      'frase_identificacao', 'Se você se identifica: quer entender como funciona na prática, mas ainda precisa de mais contexto antes de avançar.',
      'main_blocker', 'O que segura é sobretudo falta de informação clara, não falta de interesse — você precisa de alguém da equipe para explicar o modelo e responder às suas dúvidas.',
      'consequence', 'Se não esclarecer com quem te convidou, pode ficar com uma dúvida no ar sem saber se faz sentido ou não para a sua vida.',
      'growth_potential', 'Quem compartilhou o quiz com você consegue te contar o dia a dia do negócio e te ajudar a ver se o timing e o seu perfil combinam — sem pressão.',
      'dica_rapida', 'Anote as suas duas maiores dúvidas antes de escrever no WhatsApp: a conversa fica mais produtiva em cinco minutos.',
      'cta_text', 'Quero falar com quem me enviou o quiz',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre ganhos e prosperidade e o resultado saiu com perfil aberto a saber mais. Quero conversar com quem me enviou este link para entender o próximo passo.'
    )
  ),
  (
    'quiz-recrut-ganhos-prosperidade',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Interesse claro em oportunidade — próximo passo é alinhar expectativas',
      'profile_summary', 'As suas respostas mostram motivação real e disposição para explorar caminhos de crescimento. Isso é forte sinal de que vale a pena continuar com quem te enviou o link.',
      'frase_identificacao', 'Se você se vê aqui, provavelmente já pensou "isso podia encaixar na minha vida se for sério e flexível".',
      'main_blocker', 'O bloqueio comum nesta fase é não saber ainda como é o modelo de negócio independente em detalhes — e o que implica no seu tempo.',
      'consequence', 'Adiar a conversa costuma deixar dúvidas esfriando; quem te convidou consegue te dar o quadro completo em pouco tempo.',
      'growth_potential', 'Com alguém da sua liderança na equipe, dá para mapear se o seu ritmo e objetivos combinam com a oportunidade — de forma transparente.',
      'dica_rapida', 'Pergunte diretamente: que suporte e formação existem para quem começa — evite suposições.',
      'cta_text', 'Quero continuar no WhatsApp sobre a oportunidade',
      'whatsapp_prefill', 'Oi! Fiz o quiz ganhos e prosperidade e o perfil saiu com interesse forte para explorar. Quero falar com quem me enviou este link para alinhar expectativas e próximos passos.'
    )
  ),
  (
    'quiz-recrut-ganhos-prosperidade',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Alta motivação para mudar o jogo financeiro — conversa prioritária',
      'profile_summary', 'Pelas respostas, há urgência e abertura fortes para oportunidades alinhadas a propósito e resultado. Este é o tipo de perfil com que a equipe costuma avançar rápido no esclarecimento.',
      'frase_identificacao', 'Se esta é a sua realidade, provavelmente quer respostas objetivas o quanto antes — não conversa vaga.',
      'main_blocker', 'O risco agora é tentar "adivinhar" sozinho como funciona; o modelo tem regras e suporte — você precisa da pessoa certa para te guiar.',
      'consequence', 'Sem essa conversa estruturada, pode tomar decisões com meia informação ou adiar algo que para você já é prioritário.',
      'growth_potential', 'Fale já com quem te enviou o link: dá para agendar um próximo passo concreto (apresentação, call breve, o que a equipe usar) alinhado ao seu ritmo.',
      'dica_rapida', 'Procure saber o que é necessário para começar de forma ética e sustentável — sem atalhos nem promessas vazias.',
      'cta_text', 'Preciso falar hoje com quem me enviou o quiz',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre ganhos e prosperidade e o resultado indica forte motivação para explorar a oportunidade com clareza. Quero falar com quem me enviou este link o mais cedo possível para o próximo passo.'
    )
  ),

  (
    'quiz-recrut-potencial-crescimento',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Potencial de crescimento a explorar — bom momento para perguntar',
      'profile_summary', 'As respostas sugerem interesse em desenvolvimento mas ainda em modo exploratório. É natural — a conversa com quem compartilhou o quiz com você esclarece se o caminho faz sentido para você.',
      'frase_identificacao', 'Se você se identifica, quer crescer mas ainda quer entender o "como" antes de se comprometer com qualquer coisa.',
      'main_blocker', 'O que falta é contexto personalizado: conteúdo genérico não substitui alguém da equipe que te mostre o dia a dia.',
      'consequence', 'Sem esse esclarecimento, você pode adiar possibilidades que até encaixariam no seu momento de vida.',
      'growth_potential', 'Quem te enviou o link já percorreu o caminho e pode te ajudar a ver onde o seu potencial se encaixa no modelo.',
      'dica_rapida', 'Pense em uma área em que quer crescer este ano — leve isso para a conversa a partir de "eu quero desenvolver…".',
      'cta_text', 'Quero uma conversa sobre o meu potencial',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre potencial e crescimento. O resultado aponta para explorar melhor o encaixe. Quero falar com quem me enviou este link para entender o próximo passo.'
    )
  ),
  (
    'quiz-recrut-potencial-crescimento',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil com vontade séria de crescimento e mentoria',
      'profile_summary', 'Pelas respostas, você valoriza suporte e trajetória clara. Isso combina bem com um negócio em equipe, onde há treino e duplicação de boas práticas.',
      'frase_identificacao', 'Se isso te descreve, você procura um ambiente onde não esteja sozinho "inventando" tudo.',
      'main_blocker', 'A dúvida típica é se o ritmo da equipe e o tipo de mentoria combinam com o seu estilo de aprendizagem.',
      'consequence', 'Evitar a conversa deixa essa dúvida em aberto — e atrasa a sua decisão informada.',
      'growth_potential', 'Falar com quem te convidou permite ver exemplos reais de onboarding e entender o que esperam de você no início.',
      'dica_rapida', 'Pergunte que tipo de acompanhamento existe nas primeiras semanas — isso diz muito sobre a cultura da equipe.',
      'cta_text', 'Quero saber como é o suporte na prática',
      'whatsapp_prefill', 'Oi! Fiz o quiz potencial e crescimento e o perfil saiu com forte valorização de mentoria. Quero conversar com quem me enviou este link sobre como funciona o acompanhamento na equipe.'
    )
  ),
  (
    'quiz-recrut-potencial-crescimento',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Momento de virar potencial em ação — próximo passo imediato',
      'profile_summary', 'As suas respostas indicam combinação forte de abertura, propósito e disposição para construir algo sustentável. Este perfil costuma se beneficiar de dar sequência rápida com a liderança.',
      'frase_identificacao', 'Se você se vê aqui, sente que já deixou passar tempo demais só "pensando" sem alinhar com alguém experiente.',
      'main_blocker', 'O maior custo agora é a inércia: sem agendar com quem te enviou o link, o entusiasmo esfria e a vida volta ao automático.',
      'consequence', 'Adiar tende a atrasar também o aprendizado prático que só vem quando você fala com quem já executa o modelo.',
      'growth_potential', 'Agende já uma conversa curta no WhatsApp com quem compartilhou o quiz com você — peça o formato que a equipe usa (vídeo, reunião, materiais).',
      'dica_rapida', 'Defina uma meta realista para as próximas 4 semanas e peça ajuda para alinhar isso ao plano da equipe.',
      'cta_text', 'Quero agendar o próximo passo com quem me enviou o link',
      'whatsapp_prefill', 'Oi! Fiz o quiz potencial e crescimento e o resultado saiu muito alinhado com avançar já. Quero agendar o próximo passo com quem me enviou este link o quanto antes.'
    )
  ),

  (
    'quiz-recrut-proposito-equilibrio',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Busca mais equilíbrio e significado — vale explorar com quem te convidou',
      'profile_summary', 'Pelas respostas, há espaço para alinhar propósito, tempo e trabalho de forma mais intencional. A conversa com quem enviou o link ajuda a ver se este modelo encaixa nessa visão.',
      'frase_identificacao', 'Se você se identifica, não quer uma mudança "a qualquer custo" — quer algo que faça sentido com a sua vida.',
      'main_blocker', 'O que trava muitas vezes é o medo de comprometer tempo sem saber se há flexibilidade real — isso só se esclarece com transparência.',
      'consequence', 'Ficar só na cabeça sem falar com ninguém da equipe mantém o desalinhamento entre o que você sonha e o que faz.',
      'growth_potential', 'Quem compartilhou o convite com você pode mostrar como outras pessoas organizaram rotina e propósito dentro do modelo.',
      'dica_rapida', 'Escreva em uma frase o que "equilíbrio" significa para você este mês — leve isso para o WhatsApp.',
      'cta_text', 'Quero conversar sobre propósito e flexibilidade',
      'whatsapp_prefill', 'Oi! Fiz o quiz propósito e equilíbrio. O resultado sugere explorar como alinhar isso ao trabalho. Quero falar com quem me enviou este link para entender se faz sentido para mim.'
    )
  ),
  (
    'quiz-recrut-proposito-equilibrio',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Alinhamento entre vida, trabalho e impacto — perfil promissor',
      'profile_summary', 'As respostas mostram que você valoriza significado e também flexibilidade. Esse combo costuma funcionar bem em um negócio em equipe focado em bem-estar e impacto nas pessoas.',
      'frase_identificacao', 'Se isso combina com você, quer ganhar sem perder a sua identidade no processo.',
      'main_blocker', 'A questão central é ver se a cultura da equipe e o ritmo de construção respeitam os seus limites e valores.',
      'consequence', 'Sem essa conversa, você pode idealizar ou descartar a oportunidade sem dados reais.',
      'growth_potential', 'Pedir a quem te enviou o link exemplos de rotina e expectativas iniciais costuma trazer clareza rápida.',
      'dica_rapida', 'Comprometa-se a fazer três perguntas honestas sobre tempo disponível e suporte — evite suposições.',
      'cta_text', 'Quero entender a cultura da equipe',
      'whatsapp_prefill', 'Oi! Fiz o quiz propósito e equilíbrio e o perfil saiu com foco em significado e flexibilidade. Quero conversar com quem me enviou este link sobre cultura da equipe e rotina.'
    )
  ),
  (
    'quiz-recrut-proposito-equilibrio',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Forte desejo de reorganizar vida e propósito — prioridade de conversa',
      'profile_summary', 'Pelas respostas, há intensidade real na busca por mudança. Este é um momento em que falar com quem te convidou pode acelerar decisões com informação.',
      'frase_identificacao', 'Se você se vê aqui, sente que o cenário atual já não serve e quer um plano em movimento, não só teorias.',
      'main_blocker', 'O risco é tentar resolver tudo sozinho; quem já constrói no modelo consegue te poupar erros comuns no início.',
      'consequence', 'Adiar a conversa estruturada pode te manter preso ao mesmo padrão enquanto a motivação esfria.',
      'growth_potential', 'Entre em contato já com quem te enviou o quiz e peça o próximo passo definido — apresentação, materiais ou call rápida.',
      'dica_rapida', 'Seja honesto sobre o tempo semanal disponível: isso orienta um plano realista desde o primeiro dia.',
      'cta_text', 'Quero falar hoje sobre propósito e próximo passo',
      'whatsapp_prefill', 'Oi! Fiz o quiz propósito e equilíbrio e o resultado indica urgência em reorganizar vida e trabalho com sentido. Quero falar com quem me enviou este link o mais breve possível.'
    )
  ),

  (
    'renda-extra-imediata',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Interesse em complementar renda — esclareça com quem te convidou',
      'profile_summary', 'Pelas respostas, você busca opções para ganhar mais ou estabilizar as finanças, ainda com dúvidas sobre formato e tempo. Normal — a conversa com quem enviou o link traz contexto real.',
      'frase_identificacao', 'Se você se identifica, quer entender se isso encaixa sem comprometer o que já tem em curso.',
      'main_blocker', 'Falta clareza sobre o que é necessário para começar e como se organiza o trabalho do dia a dia no modelo.',
      'consequence', 'Sem uma pergunta direta à equipe, você pode adiar uma opção válida ou, ao contrário, criar expectativas erradas.',
      'growth_potential', 'Quem compartilhou o fluxo com você explica o modelo de negócio de forma transparente — incluindo o que ele não é.',
      'dica_rapida', 'Evite comparar com "ganhos fáceis"; pergunte o que exige esforço consistente e que suporte existe.',
      'cta_text', 'Quero aprender como funciona a renda extra aqui',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre renda extra imediata. O resultado sugere explorar com calma se faz sentido. Quero falar com quem me enviou este link para entender como funciona na prática.'
    )
  ),
  (
    'renda-extra-imediata',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Motivação clara para gerar renda extra com direção',
      'profile_summary', 'As respostas mostram que a renda extra é prioridade e você está aberto a conhecer um caminho estruturado em equipe — com produtos de bem-estar e modelo duplicável.',
      'frase_identificacao', 'Se isso te descreve, quer números e passos, não só entusiasmo genérico.',
      'main_blocker', 'O ponto sensível é alinhar expectativa de esforço e tempo disponível com o que o negócio exige no início.',
      'consequence', 'Sem conversa com a liderança, você pode subestimar ou superestimar o que leva a ver primeiros resultados consistentes.',
      'growth_potential', 'Falar com quem te enviou o link permite ver planos de atividade iniciais e a formação da equipe.',
      'dica_rapida', 'Diga quantas horas por semana você consegue dedicar nas próximas 8 semanas — isso filtra o realismo.',
      'cta_text', 'Quero alinhar tempo disponível e próximo passo',
      'whatsapp_prefill', 'Oi! Fiz o quiz renda extra imediata e o perfil saiu com motivação forte. Quero conversar com quem me enviou este link para alinhar tempo, esforço e próximos passos.'
    )
  ),
  (
    'renda-extra-imediata',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Necessidade urgente de melhorar a renda — conversa prioritária com a equipe',
      'profile_summary', 'Pelas respostas, há combinação de necessidade financeira e abertura forte para oportunidade. O melhor movimento é falar já com quem te convidou para ver encaixe e condições com clareza.',
      'frase_identificacao', 'Se você se vê aqui, precisa de opções concretas agora, não de promessas vazias.',
      'main_blocker', 'O risco é decisão precipitada sem informação; a solução é esclarecimento franco com quem já opera no modelo.',
      'consequence', 'Adiar pode prolongar o aperto atual; agendar uma conversa estruturada costuma trazer um mapa claro em pouco tempo.',
      'growth_potential', 'Peça a quem te enviou o link o fluxo que a equipe usa para novos interessados e avance no formato combinado.',
      'dica_rapida', 'Assuma que qualquer negócio sério exige aprendizagem — pergunte que formação você precisa fazer e em que ritmo.',
      'cta_text', 'Preciso falar hoje sobre esta oportunidade',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre renda extra imediata e o resultado indica necessidade forte de explorar já uma opção séria. Quero conversar com quem me enviou este link com prioridade.'
    )
  ),

  (
    'maes-trabalhar-casa',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Busca flexibilidade em casa — veja se este modelo encaixa',
      'profile_summary', 'Pelas respostas, o cenário de conciliar família, tempo e renda está na mesa, mas ainda em exploração. Quem te enviou o link pode contar como outras mães e pais se organizam.',
      'frase_identificacao', 'Se você se identifica, quer algo que respeite horários imprevisíveis e ainda assim dê margem de crescimento.',
      'main_blocker', 'A dúvida típica é "consigo conciliar?" — só se responde com exemplos reais e honestos da equipe.',
      'consequence', 'Sem conversar, você pode descartar algo que até seria viável com o suporte certo.',
      'growth_potential', 'Peça exemplos de rotina de quem também trabalha de casa com cuidado das crianças ou outras responsabilidades.',
      'dica_rapida', 'Indique o seu melhor bloco de tempo semanal (mesmo que pequeno) — ajuda a conversa a ser prática.',
      'cta_text', 'Quero falar sobre trabalhar de casa com flexibilidade',
      'whatsapp_prefill', 'Oi! Fiz o quiz para mães/trabalho em casa. O resultado sugere explorar se encaixa na minha rotina. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'maes-trabalhar-casa',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil familiar com necessidade de flexibilidade e resultado',
      'profile_summary', 'As respostas indicam que flexibilidade não é luxo — é condição. Esse perfil costuma valorizar modelos com tempo de construção claros e apoio da equipe.',
      'frase_identificacao', 'Se isso combina com você, precisa de um projeto que caiba na vida real, não num Instagram filtrado.',
      'main_blocker', 'O bloqueio comum é o medo de sobrecarga: trabalhar em casa mal organizado cansa tanto quanto sair.',
      'consequence', 'Sem um plano conversado com a liderança, você pode repetir padrões de burnout mesmo em negócio próprio.',
      'growth_potential', 'Quem te convidou ajuda a desenhar uma cadência inicial compatível com a sua disponibilidade.',
      'dica_rapida', 'Pergunte como a equipe protege limites no início — cultura saudável evita "sim" a tudo.',
      'cta_text', 'Quero um plano realista com quem me enviou o link',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar em casa e o perfil saiu com foco em flexibilidade com resultado. Quero alinhar um plano realista com quem me enviou este link.'
    )
  ),
  (
    'maes-trabalhar-casa',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Momento de decidir como ganhar flexibilidade e renda em casa',
      'profile_summary', 'Pelas respostas, a pressão entre responsabilidades familiares e necessidade de renda está alta. Conversar já com quem te enviou o link pode mostrar caminhos sem ilusões nem promessas impossíveis.',
      'frase_identificacao', 'Se você se vê aqui, não quer mais um mês adiando uma decisão que afeta toda a família.',
      'main_blocker', 'O custo de não decidir com informação é continuar num limbo entre cansaço e frustração financeira.',
      'consequence', 'Sem um próximo passo claro com a equipe, a sensação de estagnação tende a aumentar.',
      'growth_potential', 'Agende uma conversa curta com quem compartilhou o fluxo: peça o roadmap dos primeiros 30 dias e o suporte disponível.',
      'dica_rapida', 'Seja explícita sobre o que não negocia (ex.: horários críticos com as crianças) — facilita um encaixe honesto.',
      'cta_text', 'Quero falar hoje sobre trabalho flexível em casa',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar em casa e o resultado indica urgência em encontrar flexibilidade e renda. Quero falar com quem me enviou este link o quanto antes.'
    )
  );
