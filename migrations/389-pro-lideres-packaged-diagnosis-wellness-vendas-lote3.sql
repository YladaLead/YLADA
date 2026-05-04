-- Lote 3 (5 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): vendas wellness Pro Líderes — fluxos 11–15 em fluxos-clientes.ts.
-- Ver 387/388: filosofia, diagnosis_vertical NULL, flow_id = fluxos-clientes.id.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'desconforto-pos-refeicao',
    'inchaço-manha',
    'ansiedade-doce',
    'mente-cansada',
    'falta-disposicao-treinar'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  -- --- Desconforto após refeições ---
  (
    'desconforto-pos-refeicao',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Depois de comer, o desconforto ainda parece leve — mas já chama atenção',
      'profile_summary', 'Pelas respostas, estufamento ou sensação de peso após refeições aparece, porém num nível que ainda dá para administrar no dia a dia.',
      'frase_identificacao', 'Se isso combina com você, talvez já tenha notado refeições que “pesam” mais que outras.',
      'main_blocker', 'A tensão é perder leveza e disposição logo depois de comer — o corpo parece demorar a “encaixar” de novo na rotina.',
      'consequence', 'Se vira hábito, você pode começar a antecipar o incômodo e isso rouba prazer e energia do resto do dia.',
      'growth_potential', 'Quem te enviou este link pode ajudar com hábitos e nutrição funcional focados em conforto pós-refeição — conversa simples, próximo passo claro.',
      'dica_rapida', 'Leveza após comer costuma melhorar quando ritmo e combinações alimentares conversam com o teu dia — não só “comer menos” no impulso.',
      'cta_text', 'Quero falar sobre desconforto depois de comer',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre desconforto após refeições e saiu um padrão leve. Quero conversar com quem me enviou este link sobre como melhorar essa sensação.'
    )
  ),
  (
    'desconforto-pos-refeicao',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Estufamento ou lentidão após comer já afetam seu bem-estar com frequência',
      'profile_summary', 'Pelas respostas, o incômodo depois das refeições já incomoda de forma recorrente — às vezes em mais de uma refeição — e puxa disposição para baixo.',
      'frase_identificacao', 'Se você se identificou, provavelmente já associou certas horas do dia a sensação de “corpo pesado”.',
      'main_blocker', 'O bloqueio é demorar a se sentir leve de novo: energia e conforto caem quando você precisaria render ou simplesmente estar bem.',
      'consequence', 'Continuar sem plano tende a repetir o ciclo e aumentar frustração com a própria rotina alimentar.',
      'growth_potential', 'Conversar com quem te enviou abre espaço para montar estratégia prática — nutrição funcional e hábitos — sem radicalismo.',
      'dica_rapida', 'Quando melhora só depois de muitas horas, o foco costuma ser ritmo digestivo e sustentação do dia — calibrar com apoio ajuda.',
      'cta_text', 'Quero ajuda para me sentir mais leve após comer',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre desconforto após refeições e o resultado mostrou que isso já me incomoda bastante. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'desconforto-pos-refeicao',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'O desconforto pós-refeição está forte — vale conversar com quem te acompanha',
      'profile_summary', 'Pelas respostas, estufamento, lentidão ou peso após comer são intensos e interferem de forma clara no seu bem-estar diário.',
      'frase_identificacao', 'Se isso é a sua realidade, o tema provavelmente já ocupa um lugar central na forma como você organiza o dia.',
      'main_blocker', 'A tensão é alto impacto na leveza e na energia: refeições deixam de ser só “combustível” e viram fonte de incômodo recorrente.',
      'consequence', 'Adiar apoio costuma prolongar o desconforto e a sensação de estar sempre “compensando” depois de comer.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: próximo passo com nutrição funcional e hábitos voltados a conforto e rotina sustentável.',
      'dica_rapida', 'Neste patamar, consistência e direção importam mais que tentativas soltas; a conversa individual é o que desata o nó.',
      'cta_text', 'Preciso melhorar isso após as refeições — vamos conversar?',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre desconforto após refeições e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para um plano de apoio.'
    )
  ),

  -- --- Inchaço ao acordar / manhã pesada ---
  (
    'inchaço-manha',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Acordar um pouco inchado(a) já entrou no seu radar',
      'profile_summary', 'Pelas respostas, você percebe rosto, barriga, mãos ou corpo menos leve ao acordar — ainda num nível que parece dá para alinhar com hábitos.',
      'frase_identificacao', 'Se faz sentido, você provavelmente já comparou manhãs “melhores” e “piores” sem saber exatamente o porquê.',
      'main_blocker', 'A tensão é começar o dia com sensação de peso ou retenção — o corpo demora a “assentar” nas primeiras horas.',
      'consequence', 'Se o padrão cresce, a manhã vira gargalo de disposição e autoimagem, mesmo antes da rotina começar de verdade.',
      'growth_potential', 'Quem te enviou pode indicar ativação metabólica leve e nutrição funcional pensada para manhã mais confortável — conversa objetiva.',
      'dica_rapida', 'Retenção matinal costuma conversar com sono, ritmo do dia anterior e hidratação/movimento — pequeno ajuste consistente ajuda.',
      'cta_text', 'Quero acordar mais leve — falar com quem me enviou',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre inchaço ao acordar/manhã pesada e saiu um padrão leve. Quero conversar com quem me enviou este link sobre o próximo passo.'
    )
  ),
  (
    'inchaço-manha',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Manhã “pesada” ou inchada já é recorrente no teu acordar',
      'profile_summary', 'Pelas respostas, a sensação de inchaço ao levantar incomoda com frequência — em áreas que você já consegue identificar — e demora a melhorar.',
      'frase_identificacao', 'Se você se identificou, talvez já adapte rotina matinal ou roupas por causa disso.',
      'main_blocker', 'O bloqueio é pouca leveza nas primeiras horas: o dia começa com o corpo pedindo tempo que você nem sempre tem.',
      'consequence', 'Manter no improviso tende a repetir o ciclo e aumentar sensação de cansaço antes mesmo da rotina pesada começar.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar plano com hábitos e nutrição funcional voltados a reduzir retenção matinal.',
      'dica_rapida', 'Quando só melhora depois de horas, vale olhar o que sustenta o teu “reset” noturno e o primeiro bloco do dia — com orientação.',
      'cta_text', 'Quero reduzir esse inchaço ao acordar',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre inchaço ao acordar e o resultado mostrou incômodo frequente pela manhã. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'inchaço-manha',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Acordar inchado(a) ou pesado(a) está com impacto alto — melhor agir com apoio',
      'profile_summary', 'Pelas respostas, a intensidade do inchaço ou da manhã pesada é forte e afeta de forma nítida como você inicia o dia e a sua disposição.',
      'frase_identificacao', 'Se isso é você, o tema provavelmente já não é detalhe: puxa energia, humor e confiança logo cedo.',
      'main_blocker', 'A tensão é alto impacto na leveza matinal: você acorda já “carregando” sensação de retenção ou peso.',
      'consequence', 'Adiar estratégia costuma manter o ciclo e aumentar desgaste emocional com o próprio corpo.',
      'growth_potential', 'Fala com quem te enviou: dá para estruturar nutrição funcional e hábitos com foco em manhã mais leve — sempre no tom de bem-estar e conversa contínua.',
      'dica_rapida', 'Neste nível, o que mais ajuda é direção clara + consistência; evite acumular soluções avulsas sem critério.',
      'cta_text', 'Preciso de ajuda para manhã mais leve',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre inchaço ao acordar/manhã pesada e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar um plano.'
    )
  ),

  -- --- Ansiedade por doce / fome emocional (sem julgamento, foco energia e ritmo) ---
  (
    'ansiedade-doce',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'A vontade de alívio no doce aparece — mas ainda em patamar manejável',
      'profile_summary', 'Pelas respostas, picos de vontade de doce ou “fome nervosa” entram no seu dia, porém sem dominar todas as decisões.',
      'frase_identificacao', 'Se combina, você provavelmente já notou que certos horários ou cansaços puxam mais para esse impulso.',
      'main_blocker', 'A tensão é oscilação de energia ou humor que pede compensação rápida — e o doce vira atalho familiar.',
      'consequence', 'Se o padrão cresce, o dia pode virar sequência de picos e quedas, com sensação de pouco controle no meio.',
      'growth_potential', 'Quem te enviou pode ajudar a montar ritmo mais estável com nutrição funcional e hábitos — para você ter opções além do impulso.',
      'dica_rapida', 'Muitas vezes a “vontade forte” cai quando a base de energia ao longo do dia para de oscilar tanto — pequeno suporte, grande diferença.',
      'cta_text', 'Quero mais estabilidade sem depender do impulso',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre ansiedade por doce/fome emocional e saiu um padrão leve. Quero conversar com quem me enviou este link sobre como me apoiar.'
    )
  ),
  (
    'ansiedade-doce',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Doce ou “fome emocional” já puxa seu dia com frequência',
      'profile_summary', 'Pelas respostas, a vontade ou a urgência por doce já incomoda de forma recorrente — muitas vezes ligada a queda de energia ou a certos horários.',
      'frase_identificacao', 'Se você se identificou, talvez já tenha tentado “segurar” sozinho e sentido que o ciclo volta.',
      'main_blocker', 'O bloqueio é estabilidade: o corpo ou o emocional pedem alívio rápido, e o padrão se repete.',
      'consequence', 'Continuar só na força de vontade tende a aumentar frustração e sensação de estar sempre negociando consigo mesmo.',
      'growth_potential', 'Conversar com quem te enviou abre espaço para plano gentil e prático — sustentação de energia e clareza — sem discurso de culpa.',
      'dica_rapida', 'Controle de verdade costuma vir de base estável, não de regra rígida; quem te acompanha ajuda a achar o teu ritmo.',
      'cta_text', 'Quero ajuda para sair desse ciclo com apoio',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre vontade de doce/fome emocional e o resultado mostrou que isso já me incomoda bastante. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'ansiedade-doce',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Esse ciclo com doce ou fome emocional está forte — conversa ajuda',
      'profile_summary', 'Pelas respostas, a intensidade da vontade ou do impulso é alta e já interfere de forma clara na forma como você passa o dia.',
      'frase_identificacao', 'Se isso é a sua realidade, você provavelmente já sentiu que isso vai além de “gostar de doce”.',
      'main_blocker', 'A tensão é oscilação profunda de energia ou estímulo emocional que empurra para compensações repetidas — difícil de sustentar sozinho.',
      'consequence', 'Adiar apoio costuma manter o ciclo e aumentar desgaste com autocobrança.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: próximo passo com nutrição funcional e estratégia de ritmo — conversa humana, sem julgamento.',
      'dica_rapida', 'Neste patamar, o foco é reconstruir estabilidade no dia; isso muda o terreno em que o impulso aparece.',
      'cta_text', 'Preciso de apoio para estabilizar meu dia',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre ansiedade por doce/fome emocional e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para ver o melhor caminho.'
    )
  ),

  -- --- Mente cansada / cabeça pesada ---
  (
    'mente-cansada',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua cabeça pesa às vezes — mas ainda dá para recuperar ritmo',
      'profile_summary', 'Pelas respostas, fadiga mental ou sensação de mente pesada aparece, porém num nível que ainda parece dá para organizar com apoio.',
      'frase_identificacao', 'Se faz sentido, você provavelmente já teve dias em que “pensa devagar” ou se sente embaçado sem explicação dramática.',
      'main_blocker', 'A tensão é clareza e foco que não fluem o dia todo: produtividade existe, mas com mais atrito do que gostaria.',
      'consequence', 'Se vira padrão, tarefas simples pesam mais e o dia parece mais longo mentalmente.',
      'growth_potential', 'Quem te enviou pode indicar apoio com hábitos e nutrição funcional voltados a energia mental — próximo passo simples.',
      'dica_rapida', 'Cabeça pesada costuma melhorar quando o corpo deixa de brigar por energia de base; pequeno ajuste diário soma.',
      'cta_text', 'Quero mais clareza mental no dia a dia',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre mente cansada/cabeça pesada e saiu um padrão leve. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'mente-cansada',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Fadiga mental ou confusão já afetam sua produtividade com frequência',
      'profile_summary', 'Pelas respostas, mente pesada, dificuldade de organizar pensamentos ou clareza baixa já aparecem de forma recorrente — em horários que você já reconhece.',
      'frase_identificacao', 'Se você se identificou, talvez já associe multitarefas ou certas cargas de trabalho a esse estado.',
      'main_blocker', 'O bloqueio é rendimento mental que não acompanha a demanda: você se esforça, mas a sensação é de “travar”.',
      'consequence', 'Continuar assim tende a aumentar atrasos, irritação e sensação de estar sempre recuperando foco.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar plano para sustentar energia e clareza — prático, adaptado à tua rotina.',
      'dica_rapida', 'Quando a mente cansa antes do prazo, muitas vezes falta base de energia estável, não falta de esforço.',
      'cta_text', 'Quero ajuda para clareza e foco',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre mente cansada e o resultado mostrou que isso já afeta bastante minha produtividade. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'mente-cansada',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua mente está no limite — merece plano de apoio',
      'profile_summary', 'Pelas respostas, a fadiga mental, confusão ou cabeça pesada é intensa e interfere de forma clara em produtividade e bem-estar.',
      'frase_identificacao', 'Se isso é você, provavelmente o dia já exige esforço extra só para “manter o raciocínio ligado”.',
      'main_blocker', 'A tensão é alto impacto na clareza: pouca folga cognitiva, sensação constante de sobrecarga ou embaçamento.',
      'consequence', 'Adiar suporte aumenta risco de esgotamento e sensação de nunca render no nível que você precisa.',
      'growth_potential', 'Fala com quem te enviou: dá para estruturar nutrição funcional e hábitos com foco em energia mental sustentável.',
      'dica_rapida', 'Neste patamar, direção + consistência valem mais que “forçar foco”; o corpo sustenta a mente.',
      'cta_text', 'Preciso recuperar clareza — vamos conversar?',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre mente cansada/cabeça pesada e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar o próximo passo.'
    )
  ),

  -- --- Falta de disposição para treinar ---
  (
    'falta-disposicao-treinar',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Treinar “pesa” um pouco — mas você ainda sente que dá para encaixar',
      'profile_summary', 'Pelas respostas, falta disposição para treinar aparece, mas ainda num patamar que parece dá para ajustar com motivação e apoio certo.',
      'frase_identificacao', 'Se combina, você provavelmente já adiou algum treino por falta de energia, sem desistir por completo.',
      'main_blocker', 'A tensão é energia que não chega na hora do movimento: o desejo existe, mas o corpo não “aceita” o horário com leveza.',
      'consequence', 'Se o padrão cresce, constância oscila e a frustração com meta de saúde aumenta.',
      'growth_potential', 'Quem te enviou pode ajudar com apoio nutricional/hábitos pensado para disposição antes do treino — conversa curta, próximo passo.',
      'dica_rapida', 'Disposição para treino costuma subir quando a energia base do dia para de ficar no vermelho — antes do ginásio.',
      'cta_text', 'Quero mais disposição para treinar',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre falta de disposição para treinar e saiu um padrão leve. Quero conversar com quem me enviou este link sobre como me apoiar.'
    )
  ),
  (
    'falta-disposicao-treinar',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Falta de fôlego para treinar já trava sua constância',
      'profile_summary', 'Pelas respostas, dificuldade de disposição para atividade física já incomoda com frequência — com adiamentos ou desistências ligadas à energia.',
      'frase_identificacao', 'Se você se identificou, talvez já saiba qual horário do dia é o mais difícil para começar.',
      'main_blocker', 'O bloqueio é transformar intenção em rotina: o corpo não acompanha o que a cabeça planejou.',
      'consequence', 'Manter o ciclo tende a aumentar sensação de atraso em objetivos de saúde e autoestima com o próprio compromisso.',
      'growth_potential', 'Conversar com quem te enviou permite montar estratégia de energia e foco antes do treino — sem promessa milagrosa, com caminho.',
      'dica_rapida', 'Quando o problema é energia (não tempo), o ajuste costuma ser sustentação do dia + primeiro passo pequeno no treino.',
      'cta_text', 'Quero ajuda para manter constância no treino',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre disposição para treinar e o resultado mostrou que isso já atrapalha bastante minha rotina. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'falta-disposicao-treinar',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Disposição para treinar está muito baixa — conversa com quem te enviou',
      'profile_summary', 'Pelas respostas, a falta de energia para treinar é intensa e já interfere de forma clara na sua constância e bem-estar.',
      'frase_identificacao', 'Se isso é você, talvez o treino já tenha virado fonte de frustração, não só de saúde.',
      'main_blocker', 'A tensão é alto impacto: sem combustível certo, movimento vira luta diária em vez de hábito sustentável.',
      'consequence', 'Adiar apoio costuma prolongar o ciclo de iniciar e parar — com desgaste emocional junto.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: plano prático para energia e rotina alinhados ao teu horário de treino.',
      'dica_rapida', 'Neste nível, o foco é recuperar base antes de exigir performance; constância nasce de sustentação.',
      'cta_text', 'Preciso de apoio para voltar a treinar com energia',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre falta de disposição para treinar e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para ver o melhor próximo passo.'
    )
  );
