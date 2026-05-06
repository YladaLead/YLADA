-- Bem-estar (catálogo): conscientização + desejo de melhorar + convite ao WhatsApp.
-- Substitui pacotes do lote 387 (5 fluxos × 3 arquétipos). Ver YLADA_DIAGNOSIS_WELLNESS_CONSCIENTIZATION_CHECKLIST em ylada-diagnosis-result-standard.ts.
-- Idempotente: DELETE + INSERT dos mesmos flow_id.

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
  (
    'energia-matinal',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Manhã pedindo ajuste — e você já percebeu',
      'profile_summary', 'Pelas respostas, acordar ainda não é um drama diário, mas também não é leve: você sente que o começo do dia define o humor do resto.',
      'frase_identificacao', 'Se isso combina com você, você já pensou que consegue funcionar, só que o corpo demora a engatar.',
      'espelho_comportamental', 'Quando você nomeia isso, deixa de ser frescura e vira algo que dá para melhorar com apoio — um passo de cada vez.',
      'main_blocker', 'A tensão está em depender de estimulante ou levantar sem sensação de presença — o ritmo da manhã não sustenta o que você quer do seu dia.',
      'causa_provavel', 'O descompasso matinal costuma juntar sono irregular, estímulo cedo demais e pouca estrutura no que quebra o jejum — não falta disciplina.',
      'preocupacoes', 'Se o primeiro bloco do dia falha, o resto vira correria e escolhas boas para você ficam sempre para depois.',
      'consequence', 'Se esse padrão vira normal, o dia inteiro parece curto demais e você vive reagindo em vez de conduzir.',
      'growth_potential', 'Uma conversa com quem te enviou este link costuma destravar um próximo passo pequeno e repetível — hábito e nutrição funcional sem promessa milagrosa.',
      'dica_rapida', 'Olhe só as duas primeiras horas depois de acordar: é onde o dia define o tom — microajuste ali muda a sensação geral.',
      'specific_actions', jsonb_build_array('Hoje, de 0 a 10, como foi acordar até o almoço? Anote numa nota.', 'No WhatsApp diga que quer um primeiro passo leve para manhã mais clara.', 'Pergunte uma sugesta que caiba em 10 minutos na rotina, não uma revolução.'),
      'cta_text', 'Quero dar o primeiro passo na minha manhã',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia matinal e quero melhorar como eu começo o dia. Quero conversar com quem me enviou este link para um primeiro passo simples e realista para mim.'
    )
  ),

  (
    'energia-matinal',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua manhã está pedindo atenção de verdade',
      'profile_summary', 'Pelas respostas, levantar cansado(a), render pouco cedo e buscar ligar rápido já não é detalhe — é um padrão que aparece na produtividade e no humor.',
      'frase_identificacao', 'Se você se identificou, já sentiu o dia começar meio atrasado, mesmo quando o relógio diz que não.',
      'espelho_comportamental', 'Reconhecer o padrão é o convite para parar de só aguentar — dá para buscar sustento de verdade com orientação.',
      'main_blocker', 'O custo é alto nas primeiras horas: corpo e cabeça demoram para entrar no ritmo, e isso arrasta o resto da rotina.',
      'causa_provavel', 'Muitas vezes o corpo está pedindo regularidade de sono e combustível estável, não mais força de vontade no despertador.',
      'preocupacoes', 'Continuar no automático aumenta desgaste e a sensação de apagar incêndio em vez de conduzir o dia.',
      'consequence', 'Seguir no automático tende a aumentar o desgaste e a sensação de estar sempre apagando incêndio em vez de conduzir o dia.',
      'growth_potential', 'Quem te enviou o link pode ajudar a montar próximo passo prático — direção clara para estabilizar energia cedo.',
      'dica_rapida', 'Quando a manhã falha, o que sobra é reação (café, pressa). Plano simples de sustento costuma mudar mais que heroísmo.',
      'specific_actions', jsonb_build_array('Liste o que você faz nas primeiras 60 minutos (água, café, comida, luz).', 'Mande no WhatsApp que quer entender o que priorizar primeiro.', 'Peça um exemplo de rotina mínima que outras pessoas na equipe usaram no começo.'),
      'cta_text', 'Quero conversar sobre como melhorar minha energia matinal',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia matinal e quero melhorar de verdade o meu começo de dia. Quero falar com quem me enviou este link para ver o que faz sentido para mim.'
    )
  ),

  (
    'energia-matinal',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu dia está começando no limite — isso merece conversa',
      'profile_summary', 'Pelas respostas, acordar esgotado(a), com dificuldade de levantar e dependência logo cedo de estimulante indica que a manhã virou gargalo — não só fadiga.',
      'frase_identificacao', 'Se isso é a sua realidade, aguentar até passar virou estratégia diária — e você merece outro caminho.',
      'espelho_comportamental', 'Nomear o limite não é fraqueza: é o ponto em que melhorar deixa de ser luxo e vira cuidado concreto.',
      'main_blocker', 'A tensão é peso real nas primeiras horas: você funciona, mas paga caro em disposição e clareza até o corpo aceitar o dia.',
      'causa_provavel', 'Neste nível o corpo costuma estar sem reserva de energia estável; atalhos seguram menos e cobram mais depois.',
      'preocupacoes', 'Manter o ritmo sem endereçar costuma piorar recuperação, humor e clareza para decidir.',
      'consequence', 'Manter esse ritmo sem endereçar costuma piorar a sensação de estar sempre recuperando energia em vez de construir consistência.',
      'growth_potential', 'Falar com quem te enviou abre suporte de hábitos e nutrição para tirar do improviso e buscar manhã sustentável.',
      'dica_rapida', 'Quando o gargalo é o acordar, foco tem que ser o que sustenta você logo cedo — não só esforço à noite.',
      'specific_actions', jsonb_build_array('Escreva em três palavras como você acorda na maior parte dos dias.', 'Peça no WhatsApp um plano curto (7 dias) só para estabilizar o começo do dia.', 'Se algo doer ou for muito intenso, mencione para quem te orientar encaminhar avaliação presencial se precisar.'),
      'cta_text', 'Preciso de ajuda com energia ao acordar — vamos conversar?',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia matinal e quero melhorar com urgência como eu acordo e começo o dia. Quero conversar com quem me enviou este link para ver o melhor próximo passo para mim.'
    )
  ),

  (
    'energia-tarde',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'O apagão da tarde aparece — ainda dá para virar o jogo',
      'profile_summary', 'Pelas respostas, você já percebe queda de energia no meio da tarde, mas ainda parece controlável — mais incômodo recorrente do que travamento total.',
      'frase_identificacao', 'Se você se identificou, talvez já associe certo horário ao modo sobrevivência.',
      'espelho_comportamental', 'Notar o horário do blecaute já é mapa: dá para experimentar ajustes pequenos antes de virar crise.',
      'main_blocker', 'A tensão é perder fôlego no meio do expediente: foco e humor caem quando você ainda precisa render.',
      'causa_provavel', 'Queda da tarde muitas vezes reflete o que veio antes: sono, almoço, hidratação e picos de estímulo — não só preguiça.',
      'preocupacoes', 'Deixar solto vira ciclo de compensação (doce, mais café) que não resolve a causa do cansaço.',
      'consequence', 'Deixar isso solto costuma virar ciclo de compensação que não resolve a causa do cansaço.',
      'growth_potential', 'Conversar com quem te enviou ajuda a ver o que sustenta energia até o fim do dia de forma estável.',
      'dica_rapida', 'A tarde revela como manhã e almoço te prepararam; muitas vezes o ajuste é de ritmo, não só empurrar.',
      'specific_actions', jsonb_build_array('Marque o horário em que a energia cai mais (ex.: 15h).', 'No WhatsApp diga que quer ideias simples para essa janela.', 'Pergunte um hábito de 5 minutos para testar por uma semana.'),
      'cta_text', 'Quero falar sobre minha energia à tarde',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia da tarde e quero melhorar essa queda no meio do dia. Quero conversar com quem me enviou este link para ver o que experimentar primeiro.'
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
      'frase_identificacao', 'Se isso é familiar, você já calcula o dia em antes e depois do apagão.',
      'espelho_comportamental', 'Quando você enxerga o padrão, dá para combinar microestrutura em vez de só resistir.',
      'main_blocker', 'O bloqueio é sustentar produtividade e bem-estar no segundo tempo do dia sem atalhos que depois cobram a conta.',
      'causa_provavel', 'Corpo pede ritmo de combustível e pausas reais; café e açúcar mascaram sem repor energia estável.',
      'preocupacoes', 'Seguir nesse ritmo gera sensação de atraso constante e dia que termina pela metade.',
      'consequence', 'Seguir nesse ritmo tende a gerar sensação de atraso constante: você termina o dia cansado e com a sensação de que a parte mais importante ficou pela metade.',
      'growth_potential', 'Quem te enviou pode indicar caminho de hábitos e nutrição para a tarde parar de ser vilã.',
      'dica_rapida', 'Quando a tarde cai, o corpo pede sustento de verdade — combinação simples e repetível costuma ajudar mais que estímulo.',
      'specific_actions', jsonb_build_array('Anote três dias: o que você almoçou antes da pior queda.', 'Peça no WhatsApp um modelo de lanche ou pausa que a equipe recomenda.', 'Combine uma meta pequena: uma semana testando um ajuste só.'),
      'cta_text', 'Quero ajuda para parar de travar à tarde',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia da tarde e quero melhorar meu foco e disposição depois do almoço. Quero falar com quem me enviou este link para montar algo simples que eu consiga manter.'
    )
  ),

  (
    'energia-tarde',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua tarde virou ponto fraco do dia — isso precisa de plano',
      'profile_summary', 'Pelas respostas, a queda no meio da tarde é intensa, recorrente e já interfere de forma clara no que você precisa cumprir.',
      'frase_identificacao', 'Se você se identificou, já usa força bruta ou compensações só para chegar ao fim do expediente.',
      'espelho_comportamental', 'Admitir que isso pesa é o primeiro passo para buscar sustentação em vez de só remendos.',
      'main_blocker', 'A tensão é alto impacto na vida prática: foco, humor e consistência caem quando ainda há metade do dia.',
      'causa_provavel', 'Neste patamar o corpo opera sem margem; pequenos desvios de sono ou alimentação derrubam o resto.',
      'preocupacoes', 'Sem endereçar, aumentam irritação, procrastinação e sensação de nunca render o que você quer.',
      'consequence', 'Sem endereçar, esse padrão costuma aumentar irritação, procrastinação e sensação de nunca render o que você quer.',
      'growth_potential', 'Falar com quem te enviou permite estruturar suporte com nutrição e hábitos para estabilizar energia ao longo do dia.',
      'dica_rapida', 'Quando a tarde mata o desempenho, o problema raramente é só disciplina — costuma ser sustento e ritmo desde cedo.',
      'specific_actions', jsonb_build_array('Escreva o que você mais perde quando a tarde cai (foco, paciência, treino).', 'Peça no WhatsApp prioridade: o que mudar primeiro nesta semana.', 'Combine check-in em 7 dias para ver se o ajuste fez diferença perceptível.'),
      'cta_text', 'Preciso resolver essa queda de energia à tarde',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia da tarde e quero melhorar com prioridade essa queda forte no meio do dia. Quero conversar com quem me enviou este link para um plano que eu consiga seguir.'
    )
  ),

  (
    'troca-cafe',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu café pode estar te dando energia emprestada',
      'profile_summary', 'Pelas respostas, você toma café com frequência e já notou vai-e-vém de disposição — ainda em nível manejável.',
      'frase_identificacao', 'Se isso faz sentido, você já sentiu o dia oscilar entre ligado demais e apagado.',
      'espelho_comportamental', 'Perceber o balanço é convite para testar sustentação sem radicalismo — pequena troca, grande alívio.',
      'main_blocker', 'A tensão é depender de estimulante para manter ritmo e depois pagar com queda de clareza ou irritação.',
      'causa_provavel', 'Picos e quedas costumam vir de cafeína em jejum longo ou sono curto — não de falta de força.',
      'preocupacoes', 'Se o ciclo continua, vira normal precisar de mais uma xícara só para voltar ao patamar básico.',
      'consequence', 'Se o ciclo continua, vira normal precisar de mais uma xícara só para voltar ao patamar básico de funcionamento.',
      'growth_potential', 'Conversar com quem te enviou ajuda a testar alternativas mais estáveis com apoio, sem discurso radicalista.',
      'dica_rapida', 'Energia boa costuma ser a que sustenta, não só a que empurra — troca inteligente é sobre ritmo, não culpa.',
      'specific_actions', jsonb_build_array('Conte quantos cafés você toma até meio-dia, sem julgar.', 'No WhatsApp diga que quer opções mais estáveis para o seu caso.', 'Pergunte um plano de transição em etapas curtas.'),
      'cta_text', 'Quero ver opções melhores que só café',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre troca inteligente do café e quero melhorar minha energia sem ficar nesse vai-e-vém. Quero conversar com quem me enviou este link para ver alternativas.'
    )
  ),

  (
    'troca-cafe',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'O café está segurando seu dia — e cobrando depois',
      'profile_summary', 'Pelas respostas, o consumo é frequente e sinais de instabilidade já são recorrentes.',
      'frase_identificacao', 'Se você se identificou, já tentou cortar e percebeu que não é só parar de tomar.',
      'espelho_comportamental', 'Isso mostra que seu corpo pede outra base — não guerra contra café, e sim sustentação.',
      'main_blocker', 'O padrão é usar café como alavanca principal; quando ele falha, desempenho e humor sentem na hora.',
      'causa_provavel', 'Tolerância sobe e você nunca fica 100% sem estimulante — sinal de que a função do café precisa ser substituída.',
      'preocupacoes', 'Manter isso sem estratégia aumenta sensação de curto-circuito no dia.',
      'consequence', 'Manter isso sem estratégia tende a aumentar tolerância e sensação de nunca estar 100% sem estimulante.',
      'growth_potential', 'Quem te enviou pode mostrar transição prática com apoio nutricional, sem sofrimento.',
      'dica_rapida', 'Trocar café é construir outra base de energia para você não depender só dele.',
      'specific_actions', jsonb_build_array('Anote em que momentos o café é automático, não escolha.', 'Peça no WhatsApp um substituto ou combo que a equipe usa em transição.', 'Combine meta de 10 dias com acompanhamento leve.'),
      'cta_text', 'Quero montar uma troca inteligente com apoio',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre troca do café e quero melhorar minha estabilidade de energia ao longo do dia. Quero falar com quem me enviou este link para uma transição que eu consiga manter.'
    )
  ),

  (
    'troca-cafe',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Café virou centro da sua energia — isso pesa no dia',
      'profile_summary', 'Pelas respostas, o volume é alto e oscilação é forte — café parece indispensável e, mesmo assim, você não fica estável.',
      'frase_identificacao', 'Se isso é sua realidade, o dia desliga quando o estimulante some — e isso cansa.',
      'espelho_comportamental', 'Reconhecer a dependência funcional é passo para recuperar controle com plano, não com culpa.',
      'main_blocker', 'A tensão é dependência funcional: sem empurrão, falta foco e ritmo; com ele, o corpo cobra depois.',
      'causa_provavel', 'Neste nível o sistema nervoso e o sono costumam estar sob estresse do vai-e-vêm químico.',
      'preocupacoes', 'Continuar no extremo aumenta cansaço acumulado e dificuldade de regular sono e humor.',
      'consequence', 'Continuar no extremo aumenta cansaço acumulado, sensação de curto-circuito e dificuldade de regular sono e humor.',
      'growth_potential', 'Converse com quem te enviou para desenhar sustentação de energia com hábitos e nutrição, sem colapso.',
      'dica_rapida', 'O que mais ajuda não é culpa — é substituir a função do café por algo que sustente de verdade.',
      'specific_actions', jsonb_build_array('Escreva como você se sente quando passa muitas horas sem café.', 'Peça no WhatsApp um plano de sustentação com prioridades claras.', 'Se tiver palpitação forte ou mal-estar intenso, mencione para orientação presencial se necessário.'),
      'cta_text', 'Preciso sair desse ciclo com café — vamos falar?',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre troca do café e quero melhorar com urgência esse ciclo de picos e quedas. Quero conversar com quem me enviou este link para um plano de energia mais estável.'
    )
  ),

  (
    'anti-cansaco',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'O cansaço está presente — mas ainda parece do dia a dia',
      'profile_summary', 'Pelas respostas, você sente falta de disposição com frequência, em intensidade que ainda permite empurrar a rotina.',
      'frase_identificacao', 'Se você se identificou, já se perguntou se é só fadiga normal ou algo acumulando.',
      'espelho_comportamental', 'Essa dúvida saudável é porta de entrada: pequenos ajustes costumam devolver folga antes de virar trava.',
      'main_blocker', 'A tensão é baixo rendimento contínuo: você funciona, mas sem folga energética para leveza no dia.',
      'causa_provavel', 'Cansaço persistente costuma misturar sono, alimentação e estresse acumulado — não preguiça.',
      'preocupacoes', 'Se vira padrão, tarefas pequenas pesam mais e você se sente um passo atrás do próprio ritmo.',
      'consequence', 'Se vira padrão, pequenas tarefas pesam mais do que deveriam e a sensação é de estar sempre um passo atrás do seu próprio ritmo.',
      'growth_potential', 'Falar com quem te enviou abre apoio simples em hábitos e nutrição para recuperar fôlego.',
      'dica_rapida', 'Cansaço que não passa com descanso normal costuma pedir sustento, não só mais horas de cama.',
      'specific_actions', jsonb_build_array('Dê nota de 0 a 10 à sua disposição em três horários do dia.', 'No WhatsApp peça um primeiro hábito mínimo para testar 7 dias.', 'Pergunte o que mais costuma ajudar pessoas com o seu mesmo padrão no quiz.'),
      'cta_text', 'Quero ver como melhorar minha disposição',
      'whatsapp_prefill', 'Oi! Fiz o quiz anti-cansaço e quero melhorar minha energia no dia a dia. Quero conversar com quem me enviou este link para um próximo passo simples.'
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
      'frase_identificacao', 'Se isso combina com você, já tentou atalhos sem sentir virada real.',
      'espelho_comportamental', 'Isso é sinal de que o corpo pede estratégia, não mais estimulante — e dá para mudar com guia.',
      'main_blocker', 'O bloqueio é energia que não fecha a conta: você avança, mas paga caro em esforço e recuperação.',
      'causa_provavel', 'Reserva baixa costuma virar irritação e desânimo — não é falta de atitude.',
      'preocupacoes', 'Seguir assim aumenta sensação de que o dia sempre vence você no final.',
      'consequence', 'Seguir assim tende a aumentar irritação, desânimo e sensação de que o dia sempre vence você no final.',
      'growth_potential', 'Quem te enviou pode ajudar a construir plano prático de nutrição e hábitos para estabilizar energia.',
      'dica_rapida', 'Quando nada resolve rápido, próximo passo costuma ser consistência pequena com suporte certo.',
      'specific_actions', jsonb_build_array('Liste o que piora seu cansaço (sono curto, refeição, estresse).', 'Peça no WhatsApp duas prioridades para a próxima semana.', 'Combine um check-in curto para ajustar o que não colar.'),
      'cta_text', 'Quero apoio para sair desse cansaço constante',
      'whatsapp_prefill', 'Oi! Fiz o quiz anti-cansaço e quero melhorar de verdade essa falta de disposição que já pesa na rotina. Quero falar com quem me enviou este link para um plano prático.'
    )
  ),

  (
    'anti-cansaco',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Esse cansaço não é só rotina — merece endereçar com cuidado',
      'profile_summary', 'Pelas respostas, a falta de energia é intensa, frequente e já interfere de forma nítida no seu dia.',
      'frase_identificacao', 'Se você se identificou, talvez administre o dia no limite do que aguenta.',
      'espelho_comportamental', 'Nomear o limite é autocuidado: melhorar aqui é proteger o que você ainda consegue fazer bem.',
      'main_blocker', 'A tensão é esgotamento operacional: você se move, mas sem reserva — imprevistos derrubam o resto.',
      'causa_provavel', 'Sem margem, sono, humor e decisão sofrem em cascata — o corpo pede reorganização.',
      'preocupacoes', 'Manter isso sem plano costuma piorar recuperação e virar reação contínua.',
      'consequence', 'Manter isso sem plano costuma piorar sono, humor e capacidade de decisão — o dia vira reação contínua.',
      'growth_potential', 'Converse com quem te enviou: há suporte estruturado para recuperar base de energia com clareza.',
      'dica_rapida', 'Neste patamar, foco é sustentação real do corpo — não empurrar mais com força de vontade.',
      'specific_actions', jsonb_build_array('Escreva o que você deixa de fazer por falta de energia (ex.: treino, lazer).', 'Peça no WhatsApp um plano curto com prioridade máxima.', 'Se houver sintomas muito intensos, peça orientação sobre avaliação presencial se fizer sentido.'),
      'cta_text', 'Preciso de ajuda com esse cansaço — vamos conversar?',
      'whatsapp_prefill', 'Oi! Fiz o quiz anti-cansaço e quero melhorar com urgência essa falta de energia que já atrapalha muito meu dia. Quero conversar com quem me enviou este link para ver o melhor próximo passo.'
    )
  ),

  (
    'rotina-puxada',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua rotina exige mais do que o corpo entrega às vezes',
      'profile_summary', 'Pelas respostas, o dia costuma ser puxado e você já nota queda de energia ou foco em alguns trechos — ainda sem travar tudo.',
      'frase_identificacao', 'Se isso faz sentido, você vive no modo vai dando até o corpo reclamar.',
      'espelho_comportamental', 'Ouvir o corpo cedo evita virar esgotamento silencioso — pequeno ajuste protege o ritmo que você quer.',
      'main_blocker', 'A tensão é carga alta sem reserva: você cumpre, mas paga com oscilação de desempenho ao longo do dia.',
      'causa_provavel', 'Rotina intensa sem combustível estável drena foco — não é falta de profissionalismo.',
      'preocupacoes', 'Sem suporte certo, intensidade vira conta que fecha no cansaço.',
      'consequence', 'Sem suporte certo, rotina intensa vira conta que sempre fecha no cansaço — não no resultado que você quer sustentar.',
      'growth_potential', 'Conversar com quem te enviou ajuda a encaixar hábitos e nutrição para aguentar ritmo sem só sobrecarga.',
      'dica_rapida', 'Rotina puxada precisa de combustível que dure — não só estímulo rápido no meio do caos.',
      'specific_actions', jsonb_build_array('Marque um dia da semana mais pesado e anote onde a energia cai primeiro.', 'No WhatsApp peça uma dica de sustento para dias assim.', 'Pergunte um protocolo mínimo para testar duas semanas.'),
      'cta_text', 'Quero me preparar melhor para rotina intensa',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre rotina puxada e quero melhorar como eu sustento energia e foco em dias cheios. Quero conversar com quem me enviou este link para ver o que experimentar.'
    )
  ),

  (
    'rotina-puxada',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua rotina intensa está pedindo combustível de verdade',
      'profile_summary', 'Pelas respostas, você vive demanda alta, sente necessidade grande de energia e nota queda ou falta de foco com recorrência.',
      'frase_identificacao', 'Se você se identificou, calcula o dia em blocos de aguentar até.',
      'espelho_comportamental', 'Quando aguentar vira métrica, melhorar deixa de ser luxo — é performance sustentável.',
      'main_blocker', 'O bloqueio é sustentar performance sem colapsar: corpo e cabeça pedem mais suporte que improviso.',
      'causa_provavel', 'Alta carga sem reserva vira erros, irritação e sensação de nunca chegar ao fim com folga.',
      'preocupacoes', 'Continuar no embalo aumenta desgaste sem resultado proporcional.',
      'consequence', 'Continuar no embalo aumenta erros, irritação e sensação de nunca chegar ao fim com folga.',
      'growth_potential', 'Quem te enviou pode montar próximo passo com hábitos e nutrição para intensidade virar consistência.',
      'dica_rapida', 'Quem tem rotina pesada paga energia o dia todo; protocolo diário pequeno vale mais que heroísmo pontual.',
      'specific_actions', jsonb_build_array('Defina sua maior perda quando a energia cai (reuniões, treino, família).', 'Peça no WhatsApp um plano de sustentação para dias de alta carga.', 'Combine uma meta de consistência, não de perfeição.'),
      'cta_text', 'Quero consistência na minha rotina de trabalho',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre rotina puxada e quero melhorar minha energia e foco em dias exigentes. Quero conversar com quem me enviou este link para um plano que eu consiga manter.'
    )
  ),

  (
    'rotina-puxada',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você está no limite da sua carga diária — precisa de plano',
      'profile_summary', 'Pelas respostas, a rotina é muito exigente, necessidade de energia é altíssima e queda ou falta de foco já compromete o que você precisa entregar.',
      'frase_identificacao', 'Se isso é você, aguentar virou estratégia principal — e ela está ficando curta.',
      'espelho_comportamental', 'Reconhecer o limite é o primeiro passo para sustentar resultado sem se destruir no processo.',
      'main_blocker', 'A tensão é desgaste acelerado: você funciona no limite e qualquer aumento de demanda derruba equilíbrio.',
      'causa_provavel', 'Sem margem, performance cai e recuperação não acompanha — o corpo cobra.',
      'preocupacoes', 'Sem endereçar, risco é ciclo de exaustão e sensação de sempre recuperar fôlego.',
      'consequence', 'Sem endereçar, o risco é entrar em ciclo de exaustão, menor qualidade no que você faz e sensação de estar sempre recuperando o fôlego.',
      'growth_potential', 'Converse com quem te enviou para estruturar suporte com nutrição e hábitos para quem vive carga alta.',
      'dica_rapida', 'No limite, o que salva não é forçar mais — é base que segura performance ao longo das horas.',
      'specific_actions', jsonb_build_array('Escreva em uma frase o que mais sofre quando você está no limite.', 'Peça no WhatsApp prioridade máxima para esta semana.', 'Combine acompanhamento para ajustar o plano sem culpa se algo não colar.'),
      'cta_text', 'Preciso de suporte para aguentar essa rotina',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre rotina puxada e quero melhorar com urgência como eu sustento energia e foco em alta demanda. Quero conversar com quem me enviou este link para ver o melhor próximo passo.'
    )
  );