-- Pro Estética Corporal — lote 4: quizzes “biblioteca mista” no painel corporal
-- (b1000038 retenção, b1000044 rotina de cuidados, b1000046 celulite, b1000048 hidratação, b1000050 flacidez).
-- RISK_DIAGNOSIS × leve | moderado | urgente × diagnosis_vertical = corporal.
-- Copy alinhada a protocolo corporal / estética — sem diagnóstico médico nem promessa de resultado.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical = 'corporal'
  AND template_id IN (
    'b1000038-0038-4000-8000-000000000038'::uuid,
    'b1000044-0044-4000-8000-000000000044'::uuid,
    'b1000046-0046-4000-8000-000000000046'::uuid,
    'b1000048-0048-4000-8000-000000000048'::uuid,
    'b1000050-0050-4000-8000-000000000050'::uuid
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  -- b1000038 — retenção / sensação de inchaço
  (
    'b1000038-0038-4000-8000-000000000038',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Retenção ou inchaço no radar — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou episódicos de retenção ou peso no corpo. Hábitos e drenagem podem ajudar, mas a indicação e o ritmo seguro ficam na avaliação com a profissional — sem confundir estética com outras causas de inchaço.',
      'frase_identificacao', 'Se você se identificou, quer perceber se o que sente “combina” com protocolo corporal antes de fechar pacote.',
      'main_blocker', 'Internet mistura diurético, dieta radical e massagem — sem critério isso atrasa o passo certo.',
      'consequence', 'Adiar conversa estruturada mantém a sensação a oscilar sem norte.',
      'growth_potential', 'Use o resultado para pedir avaliação e descrever quando o inchaço piora (manhã, fim do dia, viagens).',
      'dica_rapida', 'Anotar sal, álcool, sono e tempo em pé nos dias piores já enriquece a primeira consulta.',
      'cta_text', 'Quero avaliar inchaço e possível protocolo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre retenção ou inchaço. O resultado saiu exploratório — quero marcar avaliação corporal para alinhar hábitos, drenagem ou próximo passo com vocês.'
    )
  ),
  (
    'b1000038-0038-4000-8000-000000000038',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Padrão de inchaço mais frequente — vale fechar plano com profissional',
      'profile_summary', 'As respostas sugerem que a sensação de peso ou retenção já aparece com regularidade. Na consulta cruzam-se rotina, sensação nas pernas ou abdômen e se drenagem, hábito ou outra abordagem entram primeiro — sempre com linguagem realista.',
      'frase_identificacao', 'Se isso combina com você, o dia a dia ou o espelho já pedem continuidade, não só “uma sessão”.',
      'main_blocker', 'Protocolo avulso sem hábito alinhado costuma dar resultado fraco ou instável.',
      'consequence', 'Sem plano, tende a repetir alívio pontual e volta da mesma sensação.',
      'growth_potential', 'Marque avaliação e leve resumo de trabalho em pé, treino e viagens recentes.',
      'dica_rapida', 'Menos sessões bem espaçadas com direção costumam vencer maratona sem critério.',
      'cta_text', 'Quero plano de drenagem / hábitos na consulta',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre retenção; o perfil saiu moderado. Quero avaliação para combinar protocolo corporal, ritmo e o que fazer entre sessões.'
    )
  ),
  (
    'b1000038-0038-4000-8000-000000000038',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Inchaço ou peso intenso — priorize avaliação orientada',
      'profile_summary', 'Pelas respostas, o incômodo parece forte ou muito frequente. Uma conversa presencial ajuda a alinhar protocolo estético seguro e, quando necessário, o encaminhamento correto se algo não for só “retenção estética”.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de escuta ativa e plano claro, não improviso.',
      'main_blocker', 'Postergar triagem mantém desconforto e tentativas soltas.',
      'consequence', 'Sem critério profissional, aumenta frustração e expectativa irreala sobre uma única técnica.',
      'growth_potential', 'Peça horário prioritário e mencione dor aguda, vermelhidão persistente ou piora rápida, se houver.',
      'dica_rapida', 'Evite diurético ou massagem agressiva sem orientação até a consulta.',
      'cta_text', 'Preciso de avaliação o quanto antes',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre retenção/inchaço; o resultado saiu urgente. Quero avaliação prioritária para protocolo seguro e orientação profissional.'
    )
  ),

  -- b1000044 — rotina de cuidados (pele do corpo / preparação para protocolo)
  (
    'b1000044-0044-4000-8000-000000000044',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Cuidados com a pele do corpo — explorar antes de intensificar protocolo',
      'profile_summary', 'Pelas respostas, há espaço para alinhar limpeza, hidratação e proteção das áreas que entram em tratamento corporal. Isso costuma apoiar resposta a massagem ou tecnologia — a combinação exata sai na avaliação.',
      'frase_identificacao', 'Se te identificas, queres base simples antes de subir intensidade de procedimentos.',
      'main_blocker', 'Produto ou rotina genérica sem critério de zona tratada limita conforto e resultado.',
      'consequence', 'Continuar aleatorio pode irritar pele ou diminuir aderência ao plano.',
      'growth_potential', 'Leve fotos de embalagens ou rotina atual — acelera orientação na consulta.',
      'dica_rapida', 'Pergunte na clínica o que pausar (ácidos, depilação) antes de sessões mais fortes.',
      'cta_text', 'Quero alinhar rotina com o protocolo corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre cuidados com a pele e rotina. O resultado saiu exploratório — quero consulta para alinhar o que usar no corpo com o protocolo de vocês.'
    )
  ),
  (
    'b1000044-0044-4000-8000-000000000044',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Rotina e tratamento corporal — hora de fechar combinação segura',
      'profile_summary', 'As respostas indicam que há incómodo ou lacunas claras na rotina enquanto você investe em corpo. Na consulta costuma fechar-se ordem: preparar pele, estimular, recuperar — sem empilhar tudo no mesmo dia sem critério.',
      'frase_identificacao', 'Se isso é você, já notou que procedimento sem base de cuidados custa mais caro em conforto.',
      'main_blocker', 'Muitos produtos ou trocas constantes confundem o que realmente responde.',
      'consequence', 'Sem ajuste, o protocolo parece “parado” mesmo com esforço.',
      'growth_potential', 'Peça checklist mínimo (limpeza, hidratação, proteção solar nas áreas expostas) para 14 dias.',
      'dica_rapida', 'Menos itens, melhor constância — valide com a profissional antes de comprar mais.',
      'cta_text', 'Quero consulta para rotina + protocolo corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário de cuidados com a pele; o perfil saiu moderado. Quero avaliação para combinar rotina em casa com o protocolo corporal de forma segura.'
    )
  ),
  (
    'b1000044-0044-4000-8000-000000000044',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Pele reativa ou rotina desalinhada — avaliação prioritária',
      'profile_summary', 'Pelas respostas, há urgência em corrigir rotina ou irritação antes de seguir com estímulos corporais. Avaliação rápida reduz risco de sensibilizar zona que já entra em tecnologia ou massagem firme.',
      'frase_identificacao', 'Se te revês aqui, queres parar o ciclo de tentativa e erro já.',
      'main_blocker', 'Intensificar tratamento com pele irritada ou despreparada pode piorar sensação e resultado.',
      'consequence', 'Adiar triagem prolonga incómodo e adia o plano corporal que você quer.',
      'growth_potential', 'Peça encaixe prioritário e descreva ardor, coceira ou vermelhidão, se existir.',
      'dica_rapida', 'Traga lista do que usou nas últimas 2 semanas na região — incluindo autobronzeador ou ácido.',
      'cta_text', 'Quero avaliação prioritária — pele e protocolo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre cuidados com a pele; preciso avaliação prioritária para alinhar rotina com o protocolo corporal sem irritar mais a pele.'
    )
  ),

  -- b1000046 — fatores ligados à celulite / textura (hábito + protocolo)
  (
    'b1000046-0046-4000-8000-000000000046',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Celulite e hábitos — explorar próximo passo com pé no chão',
      'profile_summary', 'Pelas respostas, há fatores de estilo de vida que conversam com textura ou celulite, sem drama excessivo. Na avaliação corporal junta-se movimento, hidratação e possível protocolo profissional — sem promessa mágica.',
      'frase_identificacao', 'Se te identificas, queres entender o que manda no espelho além de “só genética”.',
      'main_blocker', 'Comparar com corpos de redes sociais atrasa decisão informada na sua pele.',
      'consequence', 'Só cremes genéricos sem critério de técnica costumam frustrar.',
      'growth_potential', 'Leve hábitos atuais (treino, água, sono) — a consulta ganha realismo.',
      'dica_rapida', 'Uma meta por trimestre (textura vs. contorno) costuma destravar prioridade.',
      'cta_text', 'Quero avaliar celulite e protocolo realista',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre fatores e celulite. O resultado saiu exploratório — quero avaliação corporal para alinhar hábitos e possível técnica com vocês.'
    )
  ),
  (
    'b1000046-0046-4000-8000-000000000046',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Textura ou celulite a incomodar — cruzar hábito com técnica',
      'profile_summary', 'As respostas mostram combinação de fatores que já impactam aparência ou confiança. Plano costuma misturar mobilização, drenagem ou sucção mecânica, conforme estágio — a profissional define ordem e frequência.',
      'frase_identificacao', 'Se isso é você, já tentou várias frentas e quer critério único.',
      'main_blocker', 'Técnica isolada sem série e sem revisão tende a parecer “estacionada”.',
      'consequence', 'Parar no meio por frustração precoce é comum quando não há marcos de evolução.',
      'growth_potential', 'Combine data de reavaliação intermediária na primeira consulta.',
      'dica_rapida', 'Documentar evolução com mesma luz ajuda a ler resultado — pergunte na clínica.',
      'cta_text', 'Quero consulta para plano de textura / celulite',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre celulite e fatores; o perfil saiu moderado. Quero consulta para plano com técnica, frequência e hábitos entre sessões.'
    )
  ),
  (
    'b1000046-0046-4000-8000-000000000046',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Insatisfação forte com textura — avaliação prioritária',
      'profile_summary', 'Pelas respostas, há intensidade na busca por mudança visível. Mesmo com pressa, a ordem segura é avaliação: definem-se expectativa honesta, técnica e pausas — sem prometer resultado tipo anúncio.',
      'frase_identificacao', 'Se te revês aqui, queres ação com norte, não mais um produto aleatório.',
      'main_blocker', 'Empilhar procedimentos sem intervalo adequado pode irritar tecido.',
      'consequence', 'Correr sem triagem aumenta custo emocional e financeiro.',
      'growth_potential', 'Peça encaixe prioritário e diga zonas que mais incomodam ao vestir ou ao espelho.',
      'dica_rapida', 'Evite combinar peelings agressivos e sucção forte na mesma semana sem liberação da clínica.',
      'cta_text', 'Quero avaliação prioritária — textura corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre celulite/textura; o resultado saiu urgente. Quero avaliação prioritária para plano realista com frequência e revisão.'
    )
  ),

  -- b1000048 — hidratação (corpo / resposta a tratamentos)
  (
    'b1000048-0048-4000-8000-000000000048',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Hidratação corporal no radar — ajustar antes de escalar protocolo',
      'profile_summary', 'Pelas respostas, há sinais de pele do corpo mais ressecada ou desconforto leve. Hidratação e água conversam com conforto após massagem ou tecnologia — o detalhe de produto e frequência sai na avaliação.',
      'frase_identificacao', 'Se te identificas, queres “pele confortável” como base para resultados duradouros.',
      'main_blocker', 'Ignorar barreira cutânea enfraquece resposta a protocolos que pedem pele estável.',
      'consequence', 'Sem ajuste, repuxar ou descamação podem limitar aderência ao plano.',
      'growth_potential', 'Anote quantos copos de água realistas e uso de hidratante nas últimas semanas.',
      'dica_rapida', 'Banho muito quente prolongado resseca — comente rotina na consulta.',
      'cta_text', 'Quero alinhar hidratação com protocolo corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre hidratação da pele (corpo). O resultado saiu exploratório — quero avaliação para alinhar água, hidratante e sessões com vocês.'
    )
  ),
  (
    'b1000048-0048-4000-8000-000000000048',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Desidratação ou textura áspera — integrar ao plano corporal',
      'profile_summary', 'As respostas indicam padrão mais marcado de ressecamento ou desconforto. Em paralelo a drenagem, RF ou massagem, a profissional costuma recomendar camadas leves de hidratação e ritmo de banho — sempre personalizado.',
      'frase_identificacao', 'Se isso é você, já associa pele “pedindo água” com resultado que não rende.',
      'main_blocker', 'Só focar em tecnologia sem suportar pele limita sensação e aparência.',
      'consequence', 'Ignorar base de hidratação prolonga aspereza e irritação.',
      'growth_potential', 'Peça “plano mínimo” de hidratação corporal para 14 dias na consulta.',
      'dica_rapida', 'Esfoliação forte em demasia antes de sessões pode sensibilizar — alinhar frequência.',
      'cta_text', 'Quero consulta para hidratação + tratamento',
      'whatsapp_prefill', 'Oi! Fiz o questionário de hidratação; o perfil saiu moderado. Quero consulta para integrar hidratação corporal com o protocolo de tratamento.'
    )
  ),
  (
    'b1000048-0048-4000-8000-000000000048',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Pele muito ressecada ou desconforto intenso — priorizar avaliação',
      'profile_summary', 'Pelas respostas, desconforto ou sinais de desidratação parecem intensos. Avaliação prioritária ajuda a distinguir cuidado estético de irritação que precisa pausar estímulos até a pele estabilizar.',
      'frase_identificacao', 'Se te revês aqui, precisa alívio e plano, não mais um produto forte à sorte.',
      'main_blocker', 'Continuar tratamentos agressivos com barreira fragilizada aumenta irritação.',
      'consequence', 'Adiar triagem prolonga coceira, repuxo ou vermelhidão.',
      'growth_potential', 'Peça encaixe rápido e liste produtos usados na última semana.',
      'dica_rapida', 'Evite novos ácidos ou perfume em área irritada até a consulta.',
      'cta_text', 'Quero avaliação prioritária — pele e hidratação',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre hidratação; o resultado saiu urgente. Quero avaliação prioritária para estabilizar a pele e só então retomar protocolo corporal com segurança.'
    )
  ),

  -- b1000050 — flacidez / firmeza (corpo)
  (
    'b1000050-0050-4000-8000-000000000050',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Primeiros sinais de flacidez ou firmeza — explorar com calma',
      'profile_summary', 'Pelas respostas, há suspeita leve de perda de firmeza ou mudança de contorno. Na consulta corporal discute-se se massagem firme, radiofrequência ou outra abordagem entra — sempre com prazo realista.',
      'frase_identificacao', 'Se te identificas, queres confirmar estágio antes de fechar pacote grande.',
      'main_blocker', 'Expectativa de lifting em uma sessão costuma desalinear com o que protocolo costuma entregar.',
      'consequence', 'Adiar conversa mantém dúvida sobre o melhor primeiro passo.',
      'growth_potential', 'Aponte região e o que piorou (peso, gravidez, idade) — contexto muda plano.',
      'dica_rapida', 'RF e massagem modeladora costumam pedir série — pergunte intervalo típico.',
      'cta_text', 'Quero avaliar firmeza e possível protocolo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre sinais de flacidez/firmeza. O resultado saiu exploratório — quero avaliação corporal para ver indicação e expectativa realista.'
    )
  ),
  (
    'b1000050-0050-4000-8000-000000000050',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Flacidez ou contorno a incomodar — fechar eixo com a profissional',
      'profile_summary', 'As respostas mostram impacto mais claro na firmeza ou no contorno. Plano costuma combinar estímulo de colágeno (quando indicado), massagem orientada e hábitos — com revisão em semanas, não milagre imediato.',
      'frase_identificacao', 'Se isso é você, o espelho ou a roupa já pedem continuidade estruturada.',
      'main_blocker', 'Sessões esparsas sem energia ou técnica adequada limitam resposta do tecido.',
      'consequence', 'Trocar de método todo mês reinicia adaptação da pele.',
      'growth_potential', 'Defina na consulta primeira fase (4–8 semanas) e o que medir na revisão.',
      'dica_rapida', 'Sol, perda de peso rápida e sono influenciam firmeza — comente na avaliação.',
      'cta_text', 'Quero consulta para plano de firmeza corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre flacidez; o perfil saiu moderado. Quero consulta para montar fase inicial, frequência e revisão com vocês.'
    )
  ),
  (
    'b1000050-0050-4000-8000-000000000050',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Mudança visível de firmeza — avaliação prioritária',
      'profile_summary', 'Pelas respostas, há urgência em tratar perda de firmeza ou contorno. Avaliação prioritária define candidatura a técnica, intervalo seguro entre sessões e o que não combinar no mesmo período.',
      'frase_identificacao', 'Se te revês aqui, cada semana sem plano parece atraso demais.',
      'main_blocker', 'Empilhar tecnologias quentes sem pausa pode sensibilizar pele e confundir leitura de resultado.',
      'consequence', 'Agir no impulso sem critério aumenta frustração e custo.',
      'growth_potential', 'Peça encaixe prioritário e traga histórico de perda de peso ou procedimentos recentes.',
      'dica_rapida', 'Proteção solar e hidratação sustentam resposta — alinhe produtos com a clínica.',
      'cta_text', 'Quero avaliação prioritária — firmeza corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre flacidez/firmeza; preciso avaliação prioritária para série de protocolo e expectativa alinhada ao meu caso.'
    )
  );
