-- Lote 4 (5 fluxos × RISK_DIAGNOSIS × leve|moderado|urgente): vendas wellness Pro Líderes — fluxos 16–20 (fecha o bloco dos 20 de fluxos-clientes).
-- Ver 387–389: filosofia, diagnosis_vertical NULL.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND flow_id IN (
    'trabalho-noturno',
    'rotina-estressante',
    'maes-ocupadas',
    'fim-tarde-sem-energia',
    'sedentarismo'
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (flow_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  -- --- Trabalho noturno / madrugada ---
  (
    'trabalho-noturno',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Turno invertido já desafia sua energia — ainda em patamar manejável',
      'profile_summary', 'Pelas respostas, trabalhar à noite ou de madrugada já puxa disposição ou foco, mas ainda parece algo que dá para sustentar com hábitos certos.',
      'frase_identificacao', 'Se isso combina, você provavelmente já notou horários em que o corpo “discorda” do relógio.',
      'main_blocker', 'A tensão é manter alerta e energia fora do ritmo natural — sem depender só de empurrões rápidos (café, açúcar, energético).',
      'consequence', 'Se o padrão cresce, pequenas quedas de foco ou sono viram desgaste acumulado em jornadas longas.',
      'growth_potential', 'Quem te enviou este link pode ajudar com nutrição funcional e rotina pensada para turno invertido — conversa objetiva, próximo passo prático.',
      'dica_rapida', 'Em horário noturno, energia estável importa tanto quanto força de vontade — ritmo e sustentação costumam fazer a diferença.',
      'cta_text', 'Quero falar sobre energia no meu turno da noite',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre trabalho à noite/madrugada e saiu um padrão leve de oscilação de energia. Quero conversar com quem me enviou este link sobre como me apoiar.'
    )
  ),
  (
    'trabalho-noturno',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu turno noturno já cobra caro em energia e foco',
      'profile_summary', 'Pelas respostas, falta de energia ou sonolência no trabalho já incomoda com frequência — e você pode já recorrer a estímulos para segurar o ritmo.',
      'frase_identificacao', 'Se você se identificou, talvez já calcule o turno em “trechos em que aguento” e “trechos em que apago”.',
      'main_blocker', 'O bloqueio é sustentar desempenho e segurança no trabalho quando o corpo pede descanso no horário “errado”.',
      'consequence', 'Manter o ciclo no improviso tende a aumentar desgaste físico e mental — e a sensação de nunca recuperar energia de verdade.',
      'growth_potential', 'Conversar com quem te enviou permite montar plano com hábitos e nutrição funcional voltados a estabilidade em horário invertido.',
      'dica_rapida', 'Turno de noite pede estratégia, não só resistência; pequeno protocolo diário costuma valer mais que picos de estimulante.',
      'cta_text', 'Quero um plano para aguentar melhor o trabalho noturno',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre turno da noite/madrugada e o resultado mostrou que cansaço e foco já me afetam bastante. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'trabalho-noturno',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Energia no turno invertido está no limite — fala com quem te acompanha',
      'profile_summary', 'Pelas respostas, o impacto da falta de energia ou sonolência no trabalho é forte e recorrente — com sinais claros de que atalhos não seguram bem.',
      'frase_identificacao', 'Se isso é você, segurança e bem-estar na jornada noturna já não são detalhe.',
      'main_blocker', 'A tensão é alto impacto na capacidade de manter atenção e disposição ao longo do turno — o corpo pede suporte estruturado.',
      'consequence', 'Adiar apoio aumenta desgaste e sensação de viver sempre “no modo sobrevivência”.',
      'growth_potential', 'O melhor passo é conversar com quem te enviou: há roteiro de nutrição funcional e hábitos para quem vive fora do ritmo solar — sempre junto de pausas e autocuidado.',
      'dica_rapida', 'Neste patamar, direção clara + consistência importam mais que empurrar o corpo sem plano.',
      'cta_text', 'Preciso de ajuda para energia estável no turno da noite',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre trabalho à noite/madrugada e o resultado ficou bem intenso na falta de energia e foco. Quero conversar com quem me enviou este link para ver o melhor próximo passo.'
    )
  ),

  -- --- Rotina estressante / vida no limite ---
  (
    'rotina-estressante',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua rotina pesa — mas ainda há folga para reorganizar o dia',
      'profile_summary', 'Pelas respostas, estresse ou sobrecarga já aparecem, porém num nível que ainda parece dá para administrar antes de virar esgotamento.',
      'frase_identificacao', 'Se faz sentido, você provavelmente já sentiu dias “no limite” misturados com dias mais ok.',
      'main_blocker', 'A tensão é pressão constante puxando energia e clareza: você funciona, mas com menos folga emocional e física.',
      'consequence', 'Se o padrão se fixa, irritação, cansaço e dificuldade de decisão costumam tomar mais espaço.',
      'growth_potential', 'Quem te enviou pode ajudar com apoio prático (hábitos + nutrição funcional) para dar estabilidade mesmo em dias exigentes.',
      'dica_rapida', 'Estresse alto pede combustível que sustenta — não só “aguentar” até o fim; pequeno ajuste diário soma.',
      'cta_text', 'Quero mais energia para aguentar minha rotina',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre rotina estressante/vida no limite e saiu um padrão leve. Quero conversar com quem me enviou este link sobre o próximo passo.'
    )
  ),
  (
    'rotina-estressante',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Estresse e sobrecarga já drenam sua energia com frequência',
      'profile_summary', 'Pelas respostas, o estresse já impacta sua energia com frequência — com esgotamento mental ou físico e sensação de cabeça carregada.',
      'frase_identificacao', 'Se você se identificou, talvez já viva no modo “lista infinita” sem espaço para recuperar.',
      'main_blocker', 'O bloqueio é viver acima da capacidade sustentável: o dia exige mais do que o corpo e a mente recuperam.',
      'consequence', 'Continuar sem estratégia tende a aumentar irritação, confusão mental e sensação de estar sempre atrasado em relação à própria vida.',
      'growth_potential', 'Conversar com quem te enviou abre caminho para plano de sustentação — nutrição funcional e hábitos focados em clareza e energia estável.',
      'dica_rapida', 'Quando a cabeça fica “pesada”, muitas vezes falta base de energia no corpo — não só gestão de tarefas.',
      'cta_text', 'Quero ajuda para sair do modo sobrecarga',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre rotina estressante e o resultado mostrou que o estresse já afeta bastante minha energia. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'rotina-estressante',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Você está na zona do “limite” de verdade — merece apoio estruturado',
      'profile_summary', 'Pelas respostas, o estresse e o desgaste são intensos e já moldam o dia de forma central — com pouca margem para recuperação.',
      'frase_identificacao', 'Se isso é você, provavelmente já sentiu que “só mais um dia” está ficando curto demais.',
      'main_blocker', 'A tensão é alto impacto em energia, clareza e estabilidade emocional: a rotina consome mais do que restitui.',
      'consequence', 'Adiar apoio aumenta risco de esgotamento e sensação de perda de controle sobre o próprio ritmo.',
      'growth_potential', 'Fala com quem te enviou: dá para montar próximo passo com nutrição funcional e hábitos pensados para quem vive pressão alta — conversa humana, sem julgamento.',
      'dica_rapida', 'Neste patamar, o foco é sustentação do corpo e da mente; pequenos pilares certos valem mais que heroísmo diário.',
      'cta_text', 'Preciso de apoio para minha rotina pesada',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre rotina estressante/vida no limite e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para ver um plano.'
    )
  ),

  -- --- Mães ocupadas / rotina intensa ---
  (
    'maes-ocupadas',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Rotina de mãe no limite do tempo — ainda dá para ganhar fôlego',
      'profile_summary', 'Pelas respostas, correria, cansaço ou queda de energia em alguns horários já aparecem, mas ainda num patamar que parece dá para alinhar com apoio.',
      'frase_identificacao', 'Se combina com você, provavelmente já sentiu que o dia “não fecha” sem custo de energia.',
      'main_blocker', 'A tensão é multitarefas sem folga: cuidar de tudo e todos puxa disposição e paciência o tempo todo.',
      'consequence', 'Se o padrão cresce, pequenos sinais de esgotamento viram pano de fundo — e o tempo para você some primeiro.',
      'growth_potential', 'Quem te enviou pode ajudar com nutrição funcional e microhábitos que cabem na tua realidade — sem discurso de “mágica”, mas com direção.',
      'dica_rapida', 'Mãe ocupada costuma precisar de energia estável, não só café; uma base simples no dia muda a sensação de peso.',
      'cta_text', 'Quero mais energia e leveza na minha rotina',
      'whatsapp_prefill', 'Oi! Fiz o quiz para mães com rotina intensa e saiu um padrão leve de cansaço. Quero conversar com quem me enviou este link sobre como me apoiar.'
    )
  ),
  (
    'maes-ocupadas',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Cansaço na rotina materna já incomoda com frequência',
      'profile_summary', 'Pelas respostas, o cansaço já atrapalha o dia com recorrência — entre tarefas, filhos e responsabilidades — e a sensação de exaustão aparece sem folga.',
      'frase_identificacao', 'Se você se identificou, talvez já se sinta no modo “faço tudo, mas no limite”.',
      'main_blocker', 'O bloqueio é energia irregular: você até entrega, mas paga com irritação, falta de foco ou sensação de nunca alcançar o fim da lista.',
      'consequence', 'Manter assim tende a aumentar culpa, curto-circuito emocional e sensação de perder você no meio da rotina.',
      'growth_potential', 'Conversar com quem te enviou permite montar plano gentil e possível — sustentação de energia para a tua rotina real.',
      'dica_rapida', 'Neste contexto, o que mais ajuda é consistência pequena que cabe na vida — não mais exigência em cima de si.',
      'cta_text', 'Quero ajuda para não viver só no limite',
      'whatsapp_prefill', 'Oi! Fiz o quiz para mães ocupadas e o resultado mostrou que o cansaço já me incomoda bastante. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'maes-ocupadas',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Sua energia na maternidade ocupada está muito baixa — conversa ajuda',
      'profile_summary', 'Pelas respostas, o impacto do cansaço e da sobrecarga é alto — com sensação frequente de esgotamento ao tentar dar conta de tudo.',
      'frase_identificacao', 'Se isso é você, você provavelmente já sentiu que o “sacrifício silencioso” virou normal.',
      'main_blocker', 'A tensão é pouquíssima margem: a rotina consome energia física e mental sem espaço real de recuperação.',
      'consequence', 'Adiar apoio prolonga exaustão e a sensação de que não sobra energia para cuidar de si.',
      'growth_potential', 'O melhor passo é falar com quem te enviou: próximo passo prático com nutrição funcional e hábitos pensados para quem cuida de muita gente — incluindo você.',
      'dica_rapida', 'Neste patamar, pedir apoio não é fraqueza — é estratégia para voltar a ter energia sustentável.',
      'cta_text', 'Preciso de apoio para minha energia no dia a dia',
      'whatsapp_prefill', 'Oi! Fiz o quiz para mães com rotina intensa e o resultado ficou bem intenso no cansaço. Quero conversar com quem me enviou este link para montar um plano.'
    )
  ),

  -- --- Fim de tarde sem energia ---
  (
    'fim-tarde-sem-energia',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Depois das 17h a energia cai — ainda parece dá para suavizar',
      'profile_summary', 'Pelas respostas, queda de disposição no fim da tarde já aparece, mas num nível que ainda parece manejável com ajuste de rotina e apoio.',
      'frase_identificacao', 'Se faz sentido, você talvez já saiba que certas horas “apagam” o seu dia.',
      'main_blocker', 'A tensão é desgaste acumulado que explode no final do expediente: família, casa e você competem pela mesma energia que já baixou.',
      'consequence', 'Se vira padrão, o fim do dia vira sobrevivência em vez de tempo de qualidade.',
      'growth_potential', 'Quem te enviou pode indicar como sustentar energia ao longo do dia — para o pós-trabalho não virar colapso.',
      'dica_rapida', 'Queda forte no fim da tarde muitas vezes começa cedo demais: o que você sustenta pela manhã define o que sobra à noite.',
      'cta_text', 'Quero mais disposição no fim do dia',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre fim de tarde sem energia e saiu um padrão leve. Quero conversar com quem me enviou este link sobre o próximo passo.'
    )
  ),
  (
    'fim-tarde-sem-energia',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'O fim da tarde já “zera” sua disposição com frequência',
      'profile_summary', 'Pelas respostas, manter energia depois das 17h já é difícil com recorrência — com irritação, perda de ânimo para tarefas simples ou sensação de estar esgotado.',
      'frase_identificacao', 'Se você se identificou, talvez já antecipe o fim do expediente com certo temor.',
      'main_blocker', 'O bloqueio é desgaste acumulado: o corpo e o emocional cobram exatamente quando você ainda tem metade da vida do dia pela frente.',
      'consequence', 'Continuar assim tende a roubar qualidade do tempo com família, hobbies e até sono.',
      'growth_potential', 'Conversar com quem te enviou ajuda a montar plano com nutrição funcional e hábitos para energia mais estável até o final do dia.',
      'dica_rapida', 'Estabilizar o meio do dia costuma mudar o fim da tarde mais do que “aguçar” só no pós-expediente.',
      'cta_text', 'Quero parar de despencar no fim da tarde',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre energia no fim da tarde e o resultado mostrou que isso já me incomoda bastante. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'fim-tarde-sem-energia',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Seu fim de tarde virou colapso energético — fala com quem te enviou',
      'profile_summary', 'Pelas respostas, a queda de energia no final do dia é intensa e interfere de forma clara na tua vida pós-trabalho — com irritação, cansaço profundo ou impossibilidade de render à noite.',
      'frase_identificacao', 'Se isso é você, você provavelmente já sente que “o dia acaba antes de acabar”.',
      'main_blocker', 'A tensão é alto impacto: sem combustível no corpo, o resto do dia vira apenas recuperação — não vida.',
      'consequence', 'Adiar apoio mantém o ciclo de acumular responsabilidade sem energia para honrá-la com leveza.',
      'growth_potential', 'O melhor passo é conversar com quem te enviou: plano de sustentação de energia (nutrição funcional + hábitos) para recuperar o fim do dia.',
      'dica_rapida', 'Neste patamar, o foco é o que sustenta você nas horas anteriores — não só “descansar mais” isolado.',
      'cta_text', 'Preciso recuperar energia para o final do dia',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre fim de tarde sem energia e o resultado ficou bem intenso. Quero conversar com quem me enviou este link para ver um plano.'
    )
  ),

  -- --- Estilo de vida sedentário (sem culpa, primeiro passo) ---
  (
    'sedentarismo',
    'RISK_DIAGNOSIS',
    'leve',
    NULL,
    jsonb_build_object(
      'profile_title', 'Rotina mais parada — e disposição que pede um primeiro passo',
      'profile_summary', 'Pelas respostas, pouca movimentação ou rotina sedentária já afeta como você sente energia e peso no corpo, mas num patamar que ainda parece dá para virar com apoio leve.',
      'frase_identificacao', 'Se combina, você provavelmente já pensou em mudar e sentiu que “começar” é a parte difícil.',
      'main_blocker', 'A tensão é corpo pesado e pouca disposição para iniciar mudança — não preguiça, mas falta de combustível e ritmo.',
      'consequence', 'Se o padrão segue, cansaço sem esforço e sensação de inércia costumam se fortalecer.',
      'growth_potential', 'Quem te enviou pode ajudar com nutrição funcional e um primeiro passo realista — sem promessa milagrosa, mas com direção.',
      'dica_rapida', 'Primeiro passo costuma ser sustentar energia no dia; movimento entra mais fácil quando o corpo deixa de estar no vermelho.',
      'cta_text', 'Quero um primeiro passo leve para mais disposição',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre estilo de vida mais sedentário e saiu um padrão leve de falta de disposição. Quero conversar com quem me enviou este link.'
    )
  ),
  (
    'sedentarismo',
    'RISK_DIAGNOSIS',
    'moderado',
    NULL,
    jsonb_build_object(
      'profile_title', 'Pouca movimentação já pesa na tua energia e no corpo',
      'profile_summary', 'Pelas respostas, sensação de corpo pesado, cansaço mesmo sem muito esforço ou dificuldade de começar mudanças já é recorrente.',
      'frase_identificacao', 'Se você se identificou, talvez já sinta que “parado demais” virou conforto e descrédito ao mesmo tempo.',
      'main_blocker', 'O bloqueio é atrito para iniciar: a energia não aparece para o primeiro movimento, e a rotina parada reforça o ciclo.',
      'consequence', 'Continuar no ciclo tende a aumentar desconforto com o próprio corpo e sensação de estar longe do ideal de saúde.',
      'growth_potential', 'Conversar com quem te enviou permite montar estratégia gentil: nutrição funcional + passos pequenos que quebram a inércia.',
      'dica_rapida', 'Mudança sustentável raramente começa com revolução; começa com base que te devolve fôlego para mover.',
      'cta_text', 'Quero ajuda para sair da inércia com apoio',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre sedentarismo/baixa disposição e o resultado mostrou que isso já me incomoda bastante. Quero falar com quem me enviou este link.'
    )
  ),
  (
    'sedentarismo',
    'RISK_DIAGNOSIS',
    'urgente',
    NULL,
    jsonb_build_object(
      'profile_title', 'Corpo pesado e sem energia para mudar — conversa com quem te acompanha',
      'profile_summary', 'Pelas respostas, o impacto da rotina parada na disposição é forte — com sensação de peso, cansaço fácil ou bloqueio claro para dar o primeiro passo.',
      'frase_identificacao', 'Se isso é você, talvez o tema já cause desconforto com a imagem que você tem do seu corpo e da sua energia.',
      'main_blocker', 'A tensão é alto impacto na motivação e no corpo: pouca movimentação e pouca disposição se alimentam mutuamente.',
      'consequence', 'Adiar apoio prolonga sensação de estar preso num ciclo difícil de sair sozinho.',
      'growth_potential', 'Fala com quem te enviou: dá para desenhar plano com nutrição funcional e metas mínimas viáveis — respeitando o teu ritmo.',
      'dica_rapida', 'Neste patamar, julgamento não move nada; estrutura e companhia na conversa sim.',
      'cta_text', 'Preciso de apoio para recuperar disposição',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre estilo de vida sedentário e o resultado ficou bem intenso na falta de energia e peso no corpo. Quero conversar com quem me enviou este link para um plano.'
    )
  );
