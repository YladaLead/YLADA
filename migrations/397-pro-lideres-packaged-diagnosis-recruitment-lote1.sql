-- Lote 1 (5 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): recrutamento Pro Líderes (quizzes + clássicos iniciais).
-- Tom: oportunidade de negócio / conversa com quem enviou o link — sem promessa de ganho nem diagnóstico clínico.
-- diagnosis_vertical NULL (mesmo fallback que vendas Pro Líderes); meta.diagnosis_vertical = pro_lideres nos links novos.

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
      'profile_summary', 'Pelas respostas, há abertura para perceber se encaixa com o que te foi proposto, sem ainda ser um “sim” fechado. É um bom ponto de partida para falar com quem te enviou o link.',
      'frase_identificacao', 'Se te identificas: interessas-te em perceber como funciona na prática, mas ainda queres contexto antes de avançar.',
      'main_blocker', 'O que segura é sobretudo falta de informação clara, não falta de interesse — precisas de alguém da equipa a explicar o modelo e responder às tuas dúvidas.',
      'consequence', 'Se não esclareceres com quem te convidou, podes ficar com uma curiosidade a meio sem saber se faz sentido ou não para a tua vida.',
      'growth_potential', 'Quem te partilhou o quiz consegue contar-te o dia a dia do negócio e ajudar-te a ver se o timing e o teu perfil batem certo — sem pressão.',
      'dica_rapida', 'Anota as tuas duas maiores dúvidas antes de escreveres no WhatsApp: a conversa fica mais produtiva em cinco minutos.',
      'cta_text', 'Quero falar com quem me enviou o quiz',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre ganhos e prosperidade e o resultado saiu com perfil aberto a saber mais. Quero conversar com quem me enviou este link para perceber o próximo passo.'
    )
  ),
  (
    'quiz-recrut-ganhos-prosperidade',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Interesse claro em oportunidade — próximo passo é alinhar expectativas',
      'profile_summary', 'As tuas respostas mostram motivação real e disposição para explorar caminhos de crescimento. Isso é forte sinal de que vale a pena continuar com quem te enviou o link.',
      'frase_identificacao', 'Se te revês aqui, provavelmente já pensaste “isto podia encaixar na minha vida se for sério e flexível”.',
      'main_blocker', 'O bloqueio comum nesta fase é não saber ainda como é o modelo de negócio independente ao pormenor — e o que implica no teu tempo.',
      'consequence', 'Adiar a conversa costuma deixar dúvidas a arrefecer; quem te convidou consegue dar-te o quadro completo em pouco tempo.',
      'growth_potential', 'Com alguém da tua liderança na equipa, dá para mapear se o teu ritmo e objetivos combinam com a oportunidade — de forma transparente.',
      'dica_rapida', 'Pergunta diretamente: que suporte e formação existem para quem começa — evita suposições.',
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
      'profile_summary', 'Pelas respostas, há urgência e abertura fortes para oportunidades alinhadas a propósito e resultado. Este é o tipo de perfil com que a equipa costuma avançar rápido no esclarecimento.',
      'frase_identificacao', 'Se isto é a tua realidade, provavelmente queres respostas objetivas o quanto antes — não conversa vaga.',
      'main_blocker', 'O risco agora é tentar “adivinhar” sozinho como funciona; o modelo tem regras e suporte — precisas da pessoa certa a guiar-te.',
      'consequence', 'Sem essa conversa estruturada, podes tomar decisões com meia informação ou adiar algo que para ti já é prioritário.',
      'growth_potential', 'Fala já com quem te enviou o link: dá para agendar um próximo passo concreto (apresentação, call breve, o que a equipa usar) alinhado ao teu ritmo.',
      'dica_rapida', 'Procura saber o que é necessário para começar de forma ética e sustentável — não atalhos nem promessas vazias.',
      'cta_text', 'Preciso de falar hoje com quem me enviou o quiz',
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
      'profile_summary', 'As respostas sugerem interesse em desenvolvimento mas ainda em modo exploratório. É natural — a conversa com quem partilhou o quiz esclarece se o caminho faz sentido para ti.',
      'frase_identificacao', 'Se te identificas, queres crescer mas ainda queres perceber o “como” antes de te comprometeres com qualquer coisa.',
      'main_blocker', 'O que falta é contexto personalizado: livros e vídeos genéricos não substituem alguém da equipa que te mostre o dia a dia.',
      'consequence', 'Sem esse esclarecimento, podes adiar hipóteses que até encaixariam no teu momento de vida.',
      'growth_potential', 'Quem te enviou o link já percorreu o caminho e pode ajudar-te a ver onde o teu potencial encaixa no modelo.',
      'dica_rapida', 'Pensa numa área em que queres crescer este ano — traz isso para a conversa a partir de “eu quero desenvolver…”.',
      'cta_text', 'Quero uma conversa sobre o meu potencial',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre potencial e crescimento. O resultado aponta para explorar melhor o encaixe. Quero falar com quem me enviou este link para perceber o próximo passo.'
    )
  ),
  (
    'quiz-recrut-potencial-crescimento',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Perfil com vontade séria de crescimento e mentoria',
      'profile_summary', 'Pelas respostas, valorizas suporte e trajetória clara. Isso combina bem com um negócio em equipipe, onde há treino e duplicação de boas práticas.',
      'frase_identificacao', 'Se isto descreve-te, procuras um ambiente onde não estejas sozinho a “inventar” tudo.',
      'main_blocker', 'A dúvida típica é se o ritmo da equipa e o tipo de mentoria batem certo com o teu estilo de aprendizagem.',
      'consequence', 'Evitar a conversa deixa essa dúvida por esclarecer — e atrasa a tua decisão informada.',
      'growth_potential', 'Falar com quem te convidou permite ver exemplos reais de onboarding e acompanhar o que esperam de ti no início.',
      'dica_rapida', 'Pergunta que tipo de acompanhamento existe nas primeiras semanas — isso diz muito sobre cultura de equipa.',
      'cta_text', 'Quero saber como é o suporte na prática',
      'whatsapp_prefill', 'Oi! Fiz o quiz potencial e crescimento e o perfil saiu com forte valorização de mentoria. Quero conversar com quem me enviou este link sobre como funciona o acompanhamento na equipa.'
    )
  ),
  (
    'quiz-recrut-potencial-crescimento',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Momento de virar potencial em ação — próximo passo imediato',
      'profile_summary', 'As tuas respostas indicam combinação forte de abertura, propósito e disposição para construir algo sustentável. Este perfil costuma beneficiar de dar sequência rápida com a liderança.',
      'frase_identificacao', 'Se te revês aqui, sentes que já deixaste passar tempo demais só a “pensar” sem alinhar com alguém experiente.',
      'main_blocker', 'O maior custo agora é a inércia: sem agenda com quem te enviou o link, o entusiasmo esfria e a vida volta ao automático.',
      'consequence', 'Postergar tende a adiar também o aprendizado prático que só vem quando falas com quem já executa o modelo.',
      'growth_potential', 'Marca já uma conversa curta no WhatsApp com quem te partilhou o quiz — pede o formato que a equipa usa (vídeo, reunião, materiais).',
      'dica_rapida', 'Define uma meta realista para as próximas 4 semanas e pede ajuda a alinhar isso ao plano da equipa.',
      'cta_text', 'Quero agendar o próximo passo com quem me enviou o link',
      'whatsapp_prefill', 'Oi! Fiz o quiz potencial e crescimento e o resultado saiu muito alinhado com avançar já. Quero marcar o próximo passo com quem me enviou este link o quanto antes.'
    )
  ),

  (
    'quiz-recrut-proposito-equilibrio',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Buscas mais equilíbrio e significado — vale explorar com quem te convidou',
      'profile_summary', 'Pelas respostas, há espaço para alinhar propósito, tempo e trabalho de forma mais intencional. A conversa com quem enviou o link ajuda a ver se este modelo encaixa nessa visão.',
      'frase_identificacao', 'Se te identificas, não queres uma mudança “a qualquer custo” — queres algo que faça sentido com a tua vida.',
      'main_blocker', 'O que trava muitas vezes é medo de comprometer tempo sem saber se há flexibilidade real — isso só se esclarece com transparência.',
      'consequence', 'Ficar só na cabeça sem falar com ninguém da equipa mantém o desalinhamento entre o que sonhas e o que fazes.',
      'growth_potential', 'Quem te partilhou o convite pode mostrar como outras pessoas organizaram rotina e propósito dentro do modelo.',
      'dica_rapida', 'Escreve em uma frase o que “equilíbrio” significa para ti este mês — leva isso para o WhatsApp.',
      'cta_text', 'Quero conversar sobre propósito e flexibilidade',
      'whatsapp_prefill', 'Oi! Fiz o quiz propósito e equilíbrio. O resultado sugere explorar como alinhar isso ao trabalho. Quero falar com quem me enviou este link para perceber se faz sentido para mim.'
    )
  ),
  (
    'quiz-recrut-proposito-equilibrio',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Alinhamento entre vida, trabalho e impacto — perfil promissor',
      'profile_summary', 'As respostas mostram que valorizas significado e também flexibilidade. Esse combo costuma funcionar bem num negócio em equipipe focado em bem-estar e impacto nas pessoas.',
      'frase_identificacao', 'Se isto é contigo, queres ganhar sem perder a tua identidade no processo.',
      'main_blocker', 'A questão central é ver se a cultura da equipa e o ritmo de construção respeitam os teus limites e valores.',
      'consequence', 'Sem essa conversa, podes idealizar ou descartar a oportunidade sem dados reais.',
      'growth_potential', 'Pedir a quem te enviou o link exemplos de rotina e expectativas iniciais costuma trazer clareza rápida.',
      'dica_rapida', 'Compromete-te a fazer três perguntas honestas sobre tempo disponível e suporte — evita suposições.',
      'cta_text', 'Quero entender a cultura da equipa',
      'whatsapp_prefill', 'Oi! Fiz o quiz propósito e equilíbrio e o perfil saiu com foco em significado e flexibilidade. Quero conversar com quem me enviou este link sobre cultura da equipa e rotina.'
    )
  ),
  (
    'quiz-recrut-proposito-equilibrio',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Forte desejo de reorganizar vida e propósito — prioridade de conversa',
      'profile_summary', 'Pelas respostas, há intensidade real na procura de mudança. Este é um momento em que falar com quem te convidou pode acelerar decisões com informação.',
      'frase_identificacao', 'Se te revês aqui, sentes que o cenário atual já não serve e queres um plano em movimento, não só teorias.',
      'main_blocker', 'O risco é tentar resolver tudo sozinho; quem já constrói no modelo consegue poupar-te erros comuns no início.',
      'consequence', 'Adiar a conversa estruturada pode manter-te preso ao mesmo padrão enquanto a motivação arrefece.',
      'growth_potential', 'Contacta já quem te enviou o quiz e pede o próximo passo definido — apresentação, materiais ou call rápida.',
      'dica_rapida', 'Seja honesto sobre tempo semanal disponível: isso orienta um plano realista desde o primeiro dia.',
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
      'profile_title', 'Interesse em complementar rendimento — esclarece com quem te convidou',
      'profile_summary', 'Pelas respostas, procuras opções para ganhar mais ou estabilizar finanças, ainda com dúvidas sobre formato e tempo. Normal — a conversa com quem enviou o link traz contexto real.',
      'frase_identificacao', 'Se te identificas, queres perceber se isto encaixa sem comprometer o que já tens em curso.',
      'main_blocker', 'Falta clareza sobre o que é necessário para começar e como se organiza o trabalho do dia a dia no modelo.',
      'consequence', 'Sem pergunta direta à equipa, podes adiar uma opção válida ou, inversamente, criar expectativas erradas.',
      'growth_potential', 'Quem te partilhou o fluxo explica o modelo de negócio independente de forma transparente — incluindo o que não é.',
      'dica_rapida', 'Evita comparar com “ganhos fáceis”; pergunta o que pede esforço consistente e que suporte existe.',
      'cta_text', 'Quero aprender como funciona a renda extra aqui',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre renda extra imediata. O resultado sugere explorar com calma se faz sentido. Quero falar com quem me enviou este link para perceber como funciona na prática.'
    )
  ),
  (
    'renda-extra-imediata',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Motivação clara para gerar renda extra com direção',
      'profile_summary', 'As respostas mostram que a renda extra é prioridade e estás aberto a conhecer um caminho estruturado em equipa — com produtos de bem-estar e modelo duplicável.',
      'frase_identificacao', 'Se isto descreve-te, queres números e passos, não só entusiasmo genérico.',
      'main_blocker', 'O ponto sensível é alinhar expectativa de esforço e tempo disponível com o que o negócio pede no início.',
      'consequence', 'Sem conversa com a liderança, podes subestimar ou suparestimar o que leva a ver primeiros resultados consistentes.',
      'growth_potential', 'Falar com quem te enviou o link permite ver planos de atividade iniciais e formação da equipa.',
      'dica_rapida', 'Diz quantas horas por semana conseguires dedicar nas próximas 8 semanas — isso filtra o realismo.',
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
      'profile_title', 'Pressing need de melhorar rendimento — conversa prioritária com a equipa',
      'profile_summary', 'Pelas respostas, há combinação de necessidade financeira e abertura forte para oportunidade. O melhor movimento é falar já com quem te convidou para ver encaixe e condições com clareza.',
      'frase_identificacao', 'Se te revês aqui, precisas de opções concretas rápido, não de promessas vazias.',
      'main_blocker', 'O risco é decisão precipitada sem informação; a solução é esclarecimento franco com quem já opera no modelo.',
      'consequence', 'Adiar pode prolongar o aperto atual; agendar conversa estruturada costuma trazer mapa claro em pouco tempo.',
      'growth_potential', 'Pede a quem te enviou o link o fluxo que a equipa usa para novos interessados e avança no formato combinado.',
      'dica_rapida', 'Assume que qualquer negócio sério pede aprendizagem — pergunta que formação és obrigado a fazer e em que ritmo.',
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
      'profile_title', 'Procuras flexibilidade em casa — vê se este modelo encaixa',
      'profile_summary', 'Pelas respostas, o cenário em volta de conciliar família, tempo e rendimento está na mesa, mas ainda em exploração. Quem te enviou o link pode contar como outras mães/pais organizam.',
      'frase_identificacao', 'Se te identificas, queres algo que respeite horários imprevisíveis e ainda assim te dê margem de crescimento.',
      'main_blocker', 'A dúvida típica é “consigo mesmo conciliar?” — só se responde com exemplos reais e honestos da equipa.',
      'consequence', 'Sem conversa, podes descartar algo que até seria viável com o suporte certo.',
      'growth_potential', 'Pede exemplos de rotina de quem também trabalha de casa com cuidados aos miúdos ou outras responsabilidades.',
      'dica_rapida', 'Indica o teu melhor bloco de tempo semanal (mesmo que pequeno) — ajuda a conversa a ser prática.',
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
      'profile_summary', 'As respostas indicam que flexibilidade não é luxo — é condição. Esse perfil costuma valorizar modelos com tempo de construção claros e apoio da equipa.',
      'frase_identificacao', 'Se isto é contigo, precisas de um projeto que caiba na vida real, não num Instagram filtrado.',
      'main_blocker', 'O bloqueio comum é medo de sobrecarga: trabalhar em casa mal organizado cansa tanto quanto sair.',
      'consequence', 'Sem um plano conversado com a liderança, podes repetir padrões de burnout mesmo em negócio próprio.',
      'growth_potential', 'Quem te convidou ajuda a desenhar cadência inicial compatível com a tua disponibilidade.',
      'dica_rapida', 'Pergunta como a equipa protege limites no início — cultura saudável evita “sim” a tudo.',
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
      'profile_title', 'Momento de decidir como ganhar flexibilidade e rendimento em casa',
      'profile_summary', 'Pelas respostas, a pressão entre responsabilidades familiares e necessidade de rendimento está alta. Conversar já com quem te enviou o link pode mostrar caminhos sem ilusões nem promessas impossíveis.',
      'frase_identificacao', 'Se te revês aqui, não queres mais um mês a adiar uma decisão que afeta toda a família.',
      'main_blocker', 'O custo de não decidir informado é continuar num limbo entre cansaço e frustração financeira.',
      'consequence', 'Sem próximo passo claro com a equipa, a sensação de estagnação tende a aumentar.',
      'growth_potential', 'Marca conversa curta com quem partilhou o fluxo: pede roadmap dos primeiros 30 dias e suporte disponível.',
      'dica_rapida', 'Sê explícita sobre o que não negocias (ex.: horários críticos com os miúdos) — facilita encaixe honesto.',
      'cta_text', 'Quero falar hoje sobre trabalho flexível em casa',
      'whatsapp_prefill', 'Oi! Fiz o quiz trabalhar em casa e o resultado indica urgência em encontrar flexibilidade e rendimento. Quero falar com quem me enviou este link o quanto antes.'
    )
  );
