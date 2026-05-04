-- Lote 2 (5 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): vendas wellness Pro Líderes — continuação da sequência fluxos-clientes.
-- Ver 387: filosofia, diagnosis_vertical NULL, flow_id = fluxos-clientes.id.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'foco-concentracao',
    'motoristas',
    'metabolismo-lento',
    'barriga-pesada',
    'retencao-inchaço'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  -- --- Foco e Concentração ---
  (
    'foco-concentracao',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu foco oscila, mas ainda dá para organizar o dia',
      'profile_summary', 'Pelas respostas, você perde rendimento ou atenção em alguns trechos — um incômodo que aparece, mas ainda parece manejável no conjunto da rotina.',
      'frase_identificacao', 'Se isso faz sentido, você provavelmente já notou dias em que a mente “demora a engatar”.',
      'main_blocker', 'A tensão está em sustentar atenção e clareza por períodos longos: o trabalho ou estudo avança, mas com mais esforço do que gostaria.',
      'consequence', 'Se isso vira padrão, pequenas distrações viram atraso acumulado e a sensação de nunca “entrar no fluxo” de verdade.',
      'growth_potential', 'Quem te enviou este link pode ajudar a ver como apoiar energia e clareza mental com hábitos simples e nutrição funcional — sem promessa milagrosa, com direção.',
      'dica_rapida', 'Clareza costuma melhorar quando o corpo deixa de brigar por energia; um próximo passo estruturado vale mais que só “forçar concentração”.',
      'cta_text', 'Quero falar sobre foco e produtividade com quem me enviou',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre foco e concentração e saiu um padrão leve de oscilação de atenção. Quero conversar com quem me enviou este link sobre como me apoiar melhor.'
    )
  ),
  (
    'foco-concentracao',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Foco e clareza mental já estão pesando na tua produtividade',
      'profile_summary', 'Pelas respostas, dificuldade de manter foco, mente pesada ou procrastinação por falta de energia mental já aparecem com frequência nítida.',
      'frase_identificacao', 'Se você se identificou, talvez já associe certos horários ao “apagão mental”.',
      'main_blocker', 'O custo é alto: você até produz, mas com sensação de embaçamento, cansaço mental ou necessidade constante de “reiniciar” a atenção.',
      'consequence', 'Continuar assim tende a aumentar estresse, sensação de atraso e culpa por não render o que você sabe que poderia.',
      'growth_potential', 'Conversar com quem te enviou abre espaço para um plano prático — sustentação de energia e clareza — para o foco deixar de ser luta diária.',
      'dica_rapida', 'Quando a mente cansa antes do corpo, muitas vezes o gargalo é ritmo de energia ao longo do dia, não falta de disciplina.',
      'cta_text', 'Quero ajuda para melhorar foco e clareza',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre foco e concentração e o resultado mostrou que isso já atrapalha bastante meu trabalho ou estudos. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'foco-concentracao',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua produtividade está travada na energia mental — merece atenção',
      'profile_summary', 'Pelas respostas, a dificuldade de foco e a sensação de mente pesada são fortes e recorrentes — com impacto claro no que você precisa entregar.',
      'frase_identificacao', 'Se isso é a sua realidade, provavelmente o dia já gira em torno de “aguentar até terminar”.',
      'main_blocker', 'A tensão é desempenho mental no limite: pouca folga para pensar com clareza, decisões mais lentas e sensação de sobrecarga constante.',
      'consequence', 'Sem endereçar, aumenta risco de erros, esgotamento e sensação de estar sempre atrás do seu próprio ritmo ideal.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: dá para estruturar apoio com nutrição funcional e hábitos para recuperar base de energia e foco sustentável.',
      'dica_rapida', 'No limite mental, o que ajuda não é “ficar mais horas na frente da tela” — é recuperar combustível que sustenta o cérebro ao longo do dia.',
      'cta_text', 'Preciso desbloquear foco e clareza — vamos conversar?',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre foco e concentração e o resultado ficou bem intenso: muita dificuldade de foco e mente pesada. Quero conversar com quem me enviou este link com urgência.'
    )
  ),

  -- --- Motoristas / longas horas ---
  (
    'motoristas',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Na direção, sua energia ainda oscila um pouco',
      'profile_summary', 'Pelas respostas, longas horas ao volante já geram algum cansaço ou queda de alerta — mas ainda num patamar que parece controlável com atenção.',
      'frase_identificacao', 'Se combina com você, talvez já tenha notado trechos em que o corpo ou a cabeça “pedem pausa”.',
      'main_blocker', 'A tensão é manter disposição e atenção estáveis ao longo da jornada, sem depender só de empurrões rápidos (café, doce, energético).',
      'consequence', 'Se o padrão cresce, pequenas perdas de alerta viram desgaste acumulado e o final do dia pesa mais do que deveria.',
      'growth_potential', 'Quem te enviou pode indicar um apoio prático para energia mais estável na jornada — conversa curta, foco em segurança e rotina.',
      'dica_rapida', 'Na estrada, o que mais importa é ritmo previsível de energia — não picos que depois viram queda.',
      'cta_text', 'Quero falar sobre energia na minha jornada de direção',
      'whatsapp_prefill', 'Oi! Fiz o quiz para quem dirige muitas horas e saiu que faço uso de alguns alertas leves de cansaço. Quero conversar com quem me enviou este link sobre como me manter mais estável ao volante.'
    )
  ),
  (
    'motoristas',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua jornada ao volante já pede sustentação de verdade',
      'profile_summary', 'Pelas respostas, a falta de energia ou picos de sonolência/cansaço já afeta a direção com frequência — e você já recorre a atalhos para segurar o ritmo.',
      'frase_identificacao', 'Se você se identificou, provavelmente já calcula paradas e estímulos só para “não cair”.',
      'main_blocker', 'O bloqueio é segurar alerta e disposição por muitas horas seguidas; o corpo cobra e o improviso vira estratégia.',
      'consequence', 'Manter esse ciclo aumenta desgaste físico e mental — e a sensação de que a jornada não fecha sem “empurrão” externo.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar um próximo passo com nutrição funcional e hábitos pensados para quem vive no trânsito — sem depender só de estimulante.',
      'dica_rapida', 'Quem dirige muito precisa de energia que dure, não só “ligar” por uma hora; o ajuste costuma ser de base, não de força de vontade.',
      'cta_text', 'Quero um plano para aguentar melhor a direção',
      'whatsapp_prefill', 'Oi! Fiz o quiz de motoristas/longas horas e o resultado mostrou que cansaço e oscilação de alerta já me afetam bastante na direção. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'motoristas',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Energia na direção está no limite — prioriza conversar com quem te acompanha',
      'profile_summary', 'Pelas respostas, a forma como a falta de energia interfere na direção é forte e recorrente — com sinais claros de que atalhos não resolvem de forma estável.',
      'frase_identificacao', 'Se isso é você, segurança e bem-estar na jornada já não são detalhe.',
      'main_blocker', 'A tensão é alto impacto na sua capacidade de manter atenção e disposição ao longo do dia — o corpo pede suporte estruturado, não só resistência.',
      'consequence', 'Sem plano, o desgaste tende a aumentar e a jornada fica cada vez mais dependente de compensações que não sustentam.',
      'growth_potential', 'Fala com quem te enviou o link: dá para desenhar apoio com hábitos e nutrição funcional voltados a energia estável — sempre complementando pausas e autocuidado na estrada.',
      'dica_rapida', 'Neste patamar, o próximo passo inteligente é combinar orientação de rotina com o que sustenta o corpo entre um trecho e outro.',
      'cta_text', 'Preciso de ajuda para energia estável na minha jornada',
      'whatsapp_prefill', 'Oi! Fiz o quiz para motoristas e o resultado ficou bem forte na falta de energia e no impacto na direção. Quero conversar com quem me enviou este link para ver o melhor próximo passo com segurança.'
    )
  ),

  -- --- Metabolismo lento / inchaço (linguagem bem-estar, não diagnóstico médico) ---
  (
    'metabolismo-lento',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sensação de corpo mais pesado ou “lento” — ainda dá para virar com hábitos',
      'profile_summary', 'Pelas respostas, você nota inchaço ou sensação de metabolismo mais parado, mas ainda como incômodo que dá para conviver enquanto busca ajuste.',
      'frase_identificacao', 'Se isso combina, provavelmente já pensou em “desinchar” ou se sentir mais leve no dia a dia.',
      'main_blocker', 'A tensão é a sensação de peso ou estufamento e a dificuldade de se sentir leve — puxando disposição e conforto ao longo do dia.',
      'consequence', 'Se o padrão continua, pequenos desconfortos viram o pano de fundo do dia e cansam a autoconfiança com o próprio corpo.',
      'growth_potential', 'Quem te enviou pode ajudar com um próximo passo em nutrição funcional e rotina para apoiar sensação de leveza — conversa objetiva, sem promessa mágica.',
      'dica_rapida', 'Sensação de retenção costuma responder melhor a consistência (água, movimento, ritmo alimentar) do que a soluções pontuais.',
      'cta_text', 'Quero falar sobre me sentir mais leve',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre metabolismo lento/inchaço e saiu um padrão leve de desconforto. Quero conversar com quem me enviou este link sobre como me apoiar.'
    )
  ),
  (
    'metabolismo-lento',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Inchaço e “corpo pesado” já são tema frequente no teu dia',
      'profile_summary', 'Pelas respostas, a incomodação com retenção ou sensação de metabolismo mais lento aparece com frequência e já afeta como você se sente no dia a dia.',
      'frase_identificacao', 'Se você se identificou, talvez já associe certas roupas ou horários ao desconforto.',
      'main_blocker', 'O bloqueio é dificuldade de se sentir leve: o corpo parece “segurar” líquido ou peso mesmo com esforço informal para melhorar.',
      'consequence', 'Seguir sem plano tende a manter a sensação de estar sempre um pouco fora do ideal de disposição e conforto.',
      'growth_potential', 'Conversar com quem te enviou abre caminho para apoio estruturado — hábitos e nutrição funcional focados em leveza e rotina sustentável.',
      'dica_rapida', 'Quando o desconforto é recorrente, o que costuma fazer diferença é combinar o que você faz no dia com o que sustenta o metabolismo no tempo.',
      'cta_text', 'Quero ajuda para reduzir essa sensação de peso',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre metabolismo lento/inchaço e o resultado mostrou que isso já me incomoda bastante. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'metabolismo-lento',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sensação de retenção e peso no corpo está alta — fala com quem te enviou',
      'profile_summary', 'Pelas respostas, o incômodo com inchaço ou “corpo travado” é intenso e recorrente — com impacto claro no seu bem-estar diário.',
      'frase_identificacao', 'Se isso é a sua realidade, o tema já ocupa espaço mental e emocional, não só físico.',
      'main_blocker', 'A tensão é alto impacto na leveza e na disposição: você sente o corpo pedindo mudança sustentável, não só improviso.',
      'consequence', 'Adiar um plano costuma prolongar a sensação de desconforto e a frustração com o ritmo do dia.',
      'growth_potential', 'O melhor movimento é conversar com quem te enviou: dá para montar próximo passo com nutrição funcional e hábitos, respeitando que cada corpo responde no seu tempo.',
      'dica_rapida', 'Neste nível, o foco é direção clara e consistência — pequenos ajustes certos valem mais que muitas tentativas soltas.',
      'cta_text', 'Preciso de um plano para me sentir mais leve',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre metabolismo lento/inchaço e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para ver o melhor caminho com apoio.'
    )
  ),

  -- --- Barriga pesada / estufa ---
  (
    'barriga-pesada',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Desconforto na barriga aparece, mas ainda parece manejável',
      'profile_summary', 'Pelas respostas, sensação de barriga pesada ou estufamento entra no seu dia, porém num patamar que ainda parece dá para organizar com apoio.',
      'frase_identificacao', 'Se faz sentido, você provavelmente já notou horários ou refeições em que isso aparece mais.',
      'main_blocker', 'A tensão é o estufamento ou peso que tira leveza — especialmente se oscila com refeições ou ao longo do dia.',
      'consequence', 'Se vira hábito, o desconforto vira pano de fundo e rouba disposição para outras coisas que você gostaria de fazer.',
      'growth_potential', 'Quem te enviou o link pode ajudar a ver próximos passos simples com nutrição funcional e hábitos voltados a conforto e leveza.',
      'dica_rapida', 'Muitas vezes a “barriga pesada” melhora quando o ritmo das refeições e o apoio digestivo entram no mesmo plano — conversa ajuda a priorizar.',
      'cta_text', 'Quero falar sobre desconforto e leveza',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre barriga pesada/estufamento e saiu um padrão leve. Quero conversar com quem me enviou este link sobre como melhorar.'
    )
  ),
  (
    'barriga-pesada',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Estufamento ou barriga pesada já te incomodam com frequência',
      'profile_summary', 'Pelas respostas, o desconforto abdominal ou sensação de peso já aparece de forma recorrente e afeta seu bem-estar ao longo do dia.',
      'frase_identificacao', 'Se você se identificou, provavelmente já adaptou roupa, horário de refeições ou postura por causa disso.',
      'main_blocker', 'O bloqueio é dificuldade de se sentir leve: o corpo reage com desconforto que se repete e cobra atenção.',
      'consequence', 'Continuar sem estratégia tende a manter o ciclo de incômodo e sensação de nunca “encerar” o dia confortável.',
      'growth_potential', 'Conversar com quem te enviou permite montar plano prático — nutrição funcional e hábitos — para reduzir o estufamento e ganhar leveza.',
      'dica_rapida', 'Quando piora após refeições, vale padrão alimentar + apoio do que combina com o teu dia — não só “comer menos” no improviso.',
      'cta_text', 'Quero ajuda com estufamento e leveza',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre barriga pesada e o resultado mostrou incômodo frequente. Quero falar com quem me enviou este link sobre o próximo passo.'
    )
  ),
  (
    'barriga-pesada',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Esse desconforto na barriga está pesado no teu dia — merece plano',
      'profile_summary', 'Pelas respostas, a intensidade do estufamento ou da sensação de barriga pesada é alta e interfere de forma nítida na sua rotina.',
      'frase_identificacao', 'Se isso é você, o tema provavelmente já não é “detalhe” — afeta disposição e paz no dia a dia.',
      'main_blocker', 'A tensão é alto impacto no conforto: leveza e bem-estar ficam travados enquanto o padrão se repete.',
      'consequence', 'Adiar apoio costuma manter o desconforto no centro das suas escolhas diárias.',
      'growth_potential', 'Fala com quem te enviou: dá para estruturar nutrição funcional e hábitos com foco em sensação de leveza — sempre lembrando que avaliação individual é conversa com quem te acompanha.',
      'dica_rapida', 'Neste patamar, consistência e direção importam mais volume de tentativas aleatórias.',
      'cta_text', 'Preciso melhorar esse desconforto — vamos conversar?',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre barriga pesada/estufamento e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para um plano de apoio.'
    )
  ),

  -- --- Retenção / inchaço pernas e rosto ---
  (
    'retencao-inchaço',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Retenção ou inchaço pontual — ainda dá para alinhar com apoio',
      'profile_summary', 'Pelas respostas, você percebe áreas com mais retenção (pernas, rosto, etc.), mas o incômodo ainda parece num nível que convida a ajuste, não a pânico.',
      'frase_identificacao', 'Se combina, você provavelmente já associou alguns dias ou situações a “inchar mais”.',
      'main_blocker', 'A tensão é a sensação de corpo menos leve ou inchado, puxando conforto e autoimagem no dia a dia.',
      'consequence', 'Se o padrão cresce, pequenos inchados viram narrativa fixa do corpo e cansam.',
      'growth_potential', 'Quem te enviou pode indicar próximo passo com nutrição funcional e hábitos para apoiar sensação de leveza — conversa curta, objetiva.',
      'dica_rapida', 'Movimento, hidratação e ritmo alimentar costumam ser base; o que falta muitas vezes é calibrar com quem entende o teu caso.',
      'cta_text', 'Quero falar sobre retenção e leveza',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre retenção/inchaço (pernas/rosto) e saiu um padrão leve. Quero conversar com quem me enviou este link sobre apoio.'
    )
  ),
  (
    'retencao-inchaço',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Retenção já é recorrente — pernas, rosto ou corpo pedem atenção',
      'profile_summary', 'Pelas respostas, a sensação de retenção ou inchaço incomoda com frequência e já molda como você se sente ao longo do dia.',
      'frase_identificacao', 'Se você se identificou, talvez já tenha estratégias caseiras que “seguram”, mas não resolvem de vez.',
      'main_blocker', 'O bloqueio é corpo que parece reter com facilidade, reduzindo leveza e conforto em horários ou dias específicos.',
      'consequence', 'Manter no improviso tende a repetir o ciclo e aumentar frustração com sensação de peso ou inchaço visível.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar plano com nutrição funcional e hábitos voltados à tua rotina real — trabalho sentado, calor, horários, etc.',
      'dica_rapida', 'Retenção perceptível quase sempre melhora quando há combinação de ritmo diário + apoio interno coerente — individualizado na conversa.',
      'cta_text', 'Quero reduzir essa sensação de retenção',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre retenção/inchaço e o resultado mostrou incômodo frequente. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'retencao-inchaço',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Inchaço e retenção estão forte no teu dia — melhor conversar já',
      'profile_summary', 'Pelas respostas, o incômodo com retenção ou inchaço é intenso, recorrente e já interfere de forma clara na forma como você vive o corpo no dia a dia.',
      'frase_identificacao', 'Se isso é você, o tema provavelmente ocupa cabeça e corpo de maneira central.',
      'main_blocker', 'A tensão é alto impacto na leveza: sensação de corpo “inchado” ou travado que não costuma passar só com desejo.',
      'consequence', 'Adiar apoio estruturado prolonga desconforto e sensação de estar longe do ideal de bem-estar.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: próximo passo com nutrição funcional e hábitos, com linguagem de bem-estar e conversa contínua.',
      'dica_rapida', 'Neste nível, direção clara vale mais que colecionar dicas soltas; quem te enviou ajuda a priorizar o que faz sentido para ti.',
      'cta_text', 'Preciso de um plano para me sentir menos inchada(o)',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre retenção/inchaço em pernas/rosto e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para montar o próximo passo.'
    )
  );
