-- Bloco 4 vendas Pro Líderes — lote 2 (fluxos 6–10 de pro-lideres-sales-block4-fluxos.ts).
-- Textos de bem-estar / nutrição funcional; não substituem avaliação profissional. diagnosis_vertical NULL.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'diagnostico-eletrolitos',
    'diagnostico-parasitose',
    'diagnostico-sintomas-intestinais',
    'calc-hidratacao',
    'calc-calorias'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'diagnostico-eletrolitos',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Hidratação e ritmo do corpo pedem um ajuste leve',
      'profile_summary', 'Pelas respostas, cansaço sem explicação clara, cãibras pontuais ou oscilação de disposição em dias corridos aparecem — ainda num patamar manejável.',
      'frase_identificacao', 'Se combina, você provavelmente já pensou se falta água, sal de cozinha “certo” ou pausa de verdade.',
      'main_blocker', 'A tensão é recuperação incompleta: rotina não sustenta hidratação e mineralização básicas de forma estável.',
      'consequence', 'Se vira hábito, desempenho e humor oscilam sem você saber o que calibrar primeiro.',
      'growth_potential', 'Quem te enviou pode ajudar com rotina simples de hidratação e suporte nutricional alinhado ao teu dia — conversa prática.',
      'dica_rapida', 'Pequena consistência em líquidos e refeição que sustenta o trecho pesado do dia costuma mudar o jogo rápido.',
      'cta_text', 'Quero ajustar hidratação e disposição com apoio',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre equilíbrio e eletrólitos (bem-estar) e saiu um padrão leve. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'diagnostico-eletrolitos',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Cansaço, cãibras ou queda de desempenho já aparecem com frequência',
      'profile_summary', 'Pelas respostas, hidratação inconsistente, sinais de esforço físico sem recuperação ou performance que cai em dia cheio já marcam a rotina.',
      'frase_identificacao', 'Se você se identificou, talvez já associe “dia puxado” a corpo que não responde igual.',
      'main_blocker', 'O bloqueio é base frágil: trabalho, calor ou movimento pedem suporte que ainda não está estruturado.',
      'consequence', 'Continuar sem plano tende a repetir oscilação e sensação de estar sempre “repondo” energia.',
      'growth_potential', 'Conversar com quem te enviou ajuda a organizar hábitos e nutrição funcional com foco em estabilidade — sem promessa milagrosa.',
      'dica_rapida', 'Quando o corpo responde mal ao esforço, vale olhar sono + água + ritmo alimentar em conjunto.',
      'cta_text', 'Quero melhorar minha estabilidade física no dia',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre equilíbrio/hidratação e o resultado mostrou incômodo frequente. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'diagnostico-eletrolitos',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Impacto alto no corpo no dia a dia — melhor conversar com quem te acompanha',
      'profile_summary', 'Pelas respostas, cansaço intenso sem causa clara, desconforto muscular recorrente ou queda forte de desempenho interfere de forma nítida na rotina.',
      'frase_identificacao', 'Se isso é você, o corpo já está pedindo organização com apoio — não mais palpite solto.',
      'main_blocker', 'A tensão é alto impacto na disposição e recuperação: a base custa caro em cada dia cheio.',
      'consequence', 'Adiar conversa guiada prolonga desgaste e aumenta risco de decisões aleatórias que não resolvem.',
      'growth_potential', 'Fala com quem te enviou: monte rotina de suporte (hidratação, alimentação, descanso) com linguagem de bem-estar e acompanhamento.',
      'dica_rapida', 'Neste patamar, direção clara importa mais que suplemento ou moda aleatória.',
      'cta_text', 'Preciso de plano para recuperação e disposição',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre hidratação/equilíbrio e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para um plano.'
    )
  ),

  (
    'diagnostico-parasitose',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Desconforto digestivo pede organização — excelente momento para conversa prática',
      'profile_summary', 'Pelas respostas, algum desconforto digestivo, oscilação intestinal ou sensação de fadiga ligada ao abdômen aparece — patamar ainda manejável com hábitos.',
      'frase_identificacao', 'Se combina, você provavelmente já notou que certos dias ou refeições pioram o quadro.',
      'main_blocker', 'A tensão é sintomas que somam sem critério: falta plano gradual para conforto digestivo no dia a dia.',
      'consequence', 'Sem encaminhamento, incômodo vira pano de fundo e puxa energia e humor.',
      'growth_potential', 'Quem te enviou pode ajudar a organizar próximos passos em bem-estar digestivo — conversa com quem te acompanha, sem autodiagnóstico.',
      'dica_rapida', 'Melhora digestiva costuma ser gradual: ritmo, hidratação e apoio profissional combinam melhor que “solução única” na internet.',
      'cta_text', 'Quero organizar meu conforto digestivo',
      'whatsapp_prefill', 'Oi! Fiz o questionário digestivo (ferramenta da biblioteca) e saiu um padrão leve de desconforto. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'diagnostico-parasitose',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sinais digestivos recorrentes — vale conversa guiada e plano gradual',
      'profile_summary', 'Pelas respostas, desconforto frequente, alteração intestinal sem padrão claro ou sensação de fadiga ligada ao intestino já marcam a semana.',
      'frase_identificacao', 'Se você se identificou, talvez já tenha tentado remendos pontuais sem resolver de forma estável.',
      'main_blocker', 'O bloqueio é falta de rota: sintomas pedem organização alimentar, ritmo e eventual encaminhamento com profissional quando fizer sentido.',
      'consequence', 'Manter no improviso tende a aumentar ansiedade com o corpo e afetar energia no resto do dia.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar plano inicial de bem-estar e nutrição funcional — com clareza do que observar e próximo passo.',
      'dica_rapida', 'Ferramenta de triagem não substitui exame; combinar hábitos com conversa é o caminho inteligente.',
      'cta_text', 'Quero um plano inicial para esse cenário',
      'whatsapp_prefill', 'Oi! Fiz o questionário digestivo e o resultado mostrou desconforto frequente. Quero falar com quem me enviou este link sobre o que fazer.'
    )
  ),
  (
    'diagnostico-parasitose',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Impacto forte no bem-estar digestivo — priorize conversa com quem te enviou',
      'profile_summary', 'Pelas respostas, desconforto digestivo intenso, alterações intestinais ou fadiga associada interfere de forma clara na rotina — tema central, não detalhe.',
      'frase_identificacao', 'Se isso é você, provavelmente já sentiu que o intestino “manda” no humor e na disposição.',
      'main_blocker', 'A tensão é alto impacto na qualidade de vida: sem plano, cada dia vira gestão de sintoma.',
      'consequence', 'Adiar apoio prolonga sofrimento desnecessário e decisões baseadas em medo ou achismo.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: organizar cuidado funcional, rotina e orientação adequada ao teu caso — sempre respeitando avaliação profissional quando preciso.',
      'dica_rapida', 'Neste patamar, combinar pessoa de confiança com critério profissional costuma ser o par certo.',
      'cta_text', 'Preciso de apoio para organizar esse quadro',
      'whatsapp_prefill', 'Oi! Fiz o questionário digestivo e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para definir o melhor encaminhamento.'
    )
  ),

  (
    'diagnostico-sintomas-intestinais',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Intestino um pouco fora do ritmo — dá para suavizar com estratégia',
      'profile_summary', 'Pelas respostas, estufamento ocasional, dias menos regulares ou sensibilidade a alguns gatilhos aparecem — patamar leve, mas já pedindo atenção.',
      'frase_identificacao', 'Se combina, você provavelmente já notou ligação entre stress e barriga.',
      'main_blocker', 'A tensão é desconforto que some e volta: falta padrão de cuidado que estabilize o intestino no teu dia.',
      'consequence', 'Sem ajuste, sintomas leves viram incômodo fixo e afetam disposição.',
      'growth_potential', 'Quem te enviou pode indicar plano simples — alimentação, ritmo e nutrição funcional — para reduzir sintomas com calma.',
      'dica_rapida', 'Mudança brusca costuma chacoalhar mais que ajudar; gradualidade com apoio costuma render melhor.',
      'cta_text', 'Quero reduzir sintomas intestinais com apoio',
      'whatsapp_prefill', 'Oi! Fiz o questionário de sintomas intestinais (bem-estar) e saiu padrão leve. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'diagnostico-sintomas-intestinais',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Estufamento, irregularidade ou gatilhos alimentares já marcam a semana',
      'profile_summary', 'Pelas respostas, estufamento frequente, intestino irregular ou relação clara entre stress e sintomas já são recorrentes — padrão intestinal desalinhado.',
      'frase_identificacao', 'Se você se identificou, talvez já adapte refeições ou evite situações por causa do incômodo.',
      'main_blocker', 'O bloqueio é desconforto que ocupa cabeça e corpo: falta protocolo em que você confie para manter.',
      'consequence', 'Continuar sem método tende a aumentar restrição alimentar no improviso e sensação de impotência.',
      'growth_potential', 'Conversar com quem te enviou ajuda a desenhar plano gradual e sustentável — menos tentativa e erro sozinho.',
      'dica_rapida', 'Intestino sensível costuma responder a rotina, calma e alimentação coerente — conversa individual acelera o que testar primeiro.',
      'cta_text', 'Quero um plano simples para o meu intestino',
      'whatsapp_prefill', 'Oi! Fiz o questionário de sintomas intestinais e o resultado mostrou incômodo frequente. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'diagnostico-sintomas-intestinais',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sintomas intestinais com impacto alto — conversa com apoio é prioridade',
      'profile_summary', 'Pelas respostas, desconforto intenso, irregularidade marcante ou alimentos que disparam reação forte interferem de forma nítida no dia.',
      'frase_identificacao', 'Se isso é você, o tema provavelmente já não é só barriga — é qualidade de vida.',
      'main_blocker', 'A tensão é alto impacto: sintomas mandam na rotina e drenam energia mental também.',
      'consequence', 'Adiar organização prolonga sofrimento e decisões no escuro.',
      'growth_potential', 'Fala com quem te enviou: estruture cuidado de bem-estar, hábitos e nutrição funcional — com encaminhamento profissional quando necessário.',
      'dica_rapida', 'Neste patamar, método e acompanhamento valem mais que lista infinita de cortes na comida.',
      'cta_text', 'Preciso de apoio para sintomas intestinais',
      'whatsapp_prefill', 'Oi! Fiz o questionário de sintomas intestinais e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para um plano.'
    )
  ),

  (
    'calc-hidratacao',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Hidratação com margem clara para melhorar',
      'profile_summary', 'Pelas respostas, peso, clima, atividade ou sede indicam que dá para organizar uma meta diária mais estável — ainda sem drama.',
      'frase_identificacao', 'Se combina, você provavelmente já sabe que devia beber mais água — falta formato.',
      'main_blocker', 'A tensão é hábito de líquidos no automático: sem meta simples, o dia passa e a hidratação oscila.',
      'consequence', 'Pequeno déficit repetido puxa foco, pele, digestão e energia sem você nomear a causa.',
      'growth_potential', 'Quem te enviou pode cruzar tua calculadora com rotina real e indicar próximo passo prático — conversa rápida.',
      'dica_rapida', 'Meta que funciona costuma ser ridícula de simples — mas amarrada ao teu horário, não à culpa.',
      'cta_text', 'Quero minha meta de hidratação com apoio',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de água e quero cruzar o resultado com orientação. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'calc-hidratacao',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sinais fortes de que a hidratação não sustenta seu dia',
      'profile_summary', 'Pelas respostas, sede frequente, calor ou atividade alta somam com padrão irregular — água virou variável que puxa disposição para baixo.',
      'frase_identificacao', 'Se você se identificou, talvez já associe cefaleia leve, foco ruim ou sede tardia demais.',
      'main_blocker', 'O bloqueio é volume e consistência: o corpo pede líquido e ritmo, não só um copo quando lembrar.',
      'consequence', 'Manter assim tende a repetir queda de energia e sensação de corpo seco ao longo do dia.',
      'growth_potential', 'Conversar com quem te enviou permite ajustar meta com teu peso, clima e expediente — referência que você consegue cumprir.',
      'dica_rapida', 'Calculadora dá referência; vida real precisa de gatilhos (garrafa, lembretes humanos, rotina).',
      'cta_text', 'Quero organizar hidratação de verdade',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de hidratação e o resultado mostrou que preciso melhorar com consistência. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'calc-hidratacao',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Hidratação no limite do que seu corpo aguenta no ritmo atual',
      'profile_summary', 'Pelas respostas, combinação de sede, calor, atividade e rotina pesada indica que falta de água pode estar com impacto alto em energia e bem-estar.',
      'frase_identificacao', 'Se isso é você, talvez já sinta o corpo pedindo líquido no meio do caos do dia.',
      'main_blocker', 'A tensão é alto impacto: desidratação leve repetida derruba performance física e mental.',
      'consequence', 'Adiar organização prolonga sintomas evitáveis e confunde causa de cansaço.',
      'growth_potential', 'Fala com quem te enviou: defina meta, ritmo e apoio — hidratação como base, não detalhe.',
      'dica_rapida', 'Neste patamar, tratar água com seriedade costuma ser o hack mais barato que existe.',
      'cta_text', 'Preciso de plano de hidratação que funcione',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de água e o resultado ficou bem intenso no descasamento com minha rotina. Quero conversar com quem me enviou este link.'
    )
  ),

  (
    'calc-calorias',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Referência calórica pode dar mais clareza — você está no caminho certo',
      'profile_summary', 'Pelas respostas, idade, peso, atividade e objetivo sugerem que uma referência simples ajuda a decidir com menos achismo no dia a dia.',
      'frase_identificacao', 'Se combina, você provavelmente já comeu no feeling e sentiu que faltou critério.',
      'main_blocker', 'A tensão é decisão alimentar sem bússola: referência existe, mas ainda não conversa com tua rotina.',
      'consequence', 'Sem bússola, oscila entre rigidez e improviso — nenhum dos dois sustenta.',
      'growth_potential', 'Quem te enviou pode traduzir o número da calculadora em prato e hábitos reais — conversa com quem te acompanha.',
      'dica_rapida', 'Caloria é ferramenta; consistência é objetivo — um não substitui o outro.',
      'cta_text', 'Quero minha referência calórica com orientação',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de calorias e quero alinhar o resultado com um plano prático. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'calc-calorias',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Consumo e objetivo ainda não conversam — referência pede calibragem humana',
      'profile_summary', 'Pelas respostas, combinação de perfil e objetivo (energia, manutenção ou mudança de peso) indica incerteza ou ajustes sem critério na rotina.',
      'frase_identificacao', 'Se você se identificou, talvez já tenha tentado app ou plano genérico que não colou.',
      'main_blocker', 'O bloqueio é falta de ponte: número na tela não vira refeição que cabe na tua semana.',
      'consequence', 'Continuar sem calibragem tende a frustrar e reforçar o padrão “tudo ou nada”.',
      'growth_potential', 'Conversar com quem te enviou permite usar a calculadora como ponto de partida — não como prisão.',
      'dica_rapida', 'Boa referência calórica vem com contexto: sono, stress e movimento mudam o que faz sentido.',
      'cta_text', 'Quero decidir melhor o que comer no dia a dia',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de calorias e preciso cruzar com orientação real da minha rotina. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'calc-calorias',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Alto desalinhamento entre referência e realidade — fala com quem te enviou',
      'profile_summary', 'Pelas respostas, perfil e objetivo indicam necessidade forte de clareza para não ficar preso em cortes aleatórios ou excessos sem direção.',
      'frase_identificacao', 'Se isso é você, talvez já sinta que o “número certo” sozinho não resolve o teu caso.',
      'main_blocker', 'A tensão é alto impacto emocional com comida sem sistema: referência técnica precisa virar plano humano.',
      'consequence', 'Adiar apoio prolonga ciclo de tentativa frustrada e autocobrança.',
      'growth_potential', 'O melhor passo é conversar com quem te enviou: use a calculadora como entrada, construa estratégia com acompanhamento.',
      'dica_rapida', 'Neste patamar, método gentil com critério costuma vencer restrição brutal.',
      'cta_text', 'Preciso de plano alimentar alinhado à calculadora',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de calorias e o resultado pede conversa firme para encaixar na minha vida. Quero falar com quem me enviou este link.'
    )
  );
