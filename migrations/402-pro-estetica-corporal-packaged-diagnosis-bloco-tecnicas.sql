-- Pro Estética Corporal — lote 2: quizzes por técnica / tema (b1000142–151, mig. 348 + capas 351).
-- RISK_DIAGNOSIS × leve | moderado | urgente × diagnosis_vertical = corporal.
-- Tom: avaliação presencial, protocolo, sem promessa de resultado nem diagnóstico médico.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical = 'corporal'
  AND template_id IN (
    'b1000142-0142-4000-8000-000000000142'::uuid,
    'b1000143-0143-4000-8000-000000000143'::uuid,
    'b1000144-0144-4000-8000-000000000144'::uuid,
    'b1000145-0145-4000-8000-000000000145'::uuid,
    'b1000146-0146-4000-8000-000000000146'::uuid,
    'b1000147-0147-4000-8000-000000000147'::uuid,
    'b1000148-0148-4000-8000-000000000148'::uuid,
    'b1000149-0149-4000-8000-000000000149'::uuid,
    'b1000150-0150-4000-8000-000000000150'::uuid,
    'b1000151-0151-4000-8000-000000000151'::uuid
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  -- b1000142 — drenagem / pernas pesadas
  (
    'b1000142-0142-4000-8000-000000000142',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Pernas pesadas ou sensação de inchaço — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há incómodo leve ou episódico. Drenagem e hábitos podem ajudar, mas a decisão de indicação e ritmo fica na avaliação com a profissional.',
      'frase_identificacao', 'Se você se identificou, provavelmente quer perceber se drenagem faz sentido antes de fechar pacote.',
      'main_blocker', 'Sem avaliação, é fácil confundir só “estética” com outras causas de inchaço — a conversa alinha expectativa.',
      'consequence', 'Adiar o alinhamento mantém a sensação a oscilar sem critério de continuidade.',
      'growth_potential', 'Use o resultado para pedir avaliação e contar em que momentos do dia o peso piora — isso orienta protocolo.',
      'dica_rapida', 'Anotar líquidos, sono e tempo em pé nos dias piores já melhora a primeira consulta.',
      'cta_text', 'Quero avaliar se a drenagem combina comigo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre pernas pesadas ou inchadas e drenagem. O resultado saiu exploratório — quero marcar avaliação para ver indicação e ritmo com vocês.'
    )
  ),
  (
    'b1000142-0142-4000-8000-000000000142',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Inchaço ou peso nas pernas com impacto na rotina — priorize avaliação',
      'profile_summary', 'As respostas sugerem que o incómodo já aparece com frequência. Drenagem pode integrar um plano, mas precisa de critério profissional (sequência, contraindicações, hábitos).',
      'frase_identificacao', 'Se isso combina com você, o espelho ou o dia a dia já pedem continuidade, não só “uma sessão”.',
      'main_blocker', 'Protocolo isolado sem hábito alinhado costuma dar resultado fraco ou oscilante.',
      'consequence', 'Sem plano, tende a repetir o ciclo de alívio pontual e volta da mesma sensação.',
      'growth_potential', 'Marque avaliação e leve resumo de rotina (trabalho em pé, treino, viagens) para a profissional encaixar frequência.',
      'dica_rapida', 'Menos sessões bem espaçadas costumam vencer maratona sem direção.',
      'cta_text', 'Quero plano de drenagem e hábitos na consulta',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre drenagem e pernas pesadas; o perfil saiu moderado. Quero avaliação para combinar drenagem, ritmo e o que fazer em casa entre sessões.'
    )
  ),
  (
    'b1000142-0142-4000-8000-000000000142',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Sensação forte de peso ou inchaço — avaliação com prioridade',
      'profile_summary', 'Pelas respostas, o incómodo parece intenso ou muito frequente. O passo inteligente é conversa presencial: a profissional orienta protocolo seguro e, quando necessário, encaminha o que não é só estética.',
      'frase_identificacao', 'Se você se reconhece aqui, o corpo já está pedindo escuta ativa e plano claro.',
      'main_blocker', 'Postergar avaliação mantém desconforto e tentativas improvisadas.',
      'consequence', 'Sem critério, aumenta frustração e risco de expectativa irreala sobre “drenagem resolve tudo”.',
      'growth_potential', 'Peça horário prioritário e mencione se há dor aguda, vermelhidão persistente ou piora rápida — a clínica orienta o canal certo.',
      'dica_rapida', 'Evite automedicar diuréticos ou excesso de massagem agressiva sem orientação.',
      'cta_text', 'Preciso de avaliação o quanto antes',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre pernas inchadas/pesadas; o resultado saiu com urgência. Quero avaliação prioritária para protocolo seguro e orientação profissional.'
    )
  ),

  -- b1000143 — massagem modeladora
  (
    'b1000143-0143-4000-8000-000000000143',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Contorno e massagem firme — explorar expectativa com calma',
      'profile_summary', 'Pelas respostas, há curiosidade sobre modeladora sem pressão extrema. Na consulta alinham pressão tolerada, frequência e o que é realista para o seu corpo — sem promessa milagrosa.',
      'frase_identificacao', 'Se te identificas, queres sentir firmeza ou contorno com método, não moda.',
      'main_blocker', 'Fechar pacote só por preço sem alinhar técnica e frequência costuma gerar desalinhamento.',
      'consequence', 'Expectativa vaga tende a virar frustração quando o resultado é gradual.',
      'growth_potential', 'Leve para a avaliação uma meta única (ex.: flancos, abdómen, coxas) e o que já tentou em casa.',
      'dica_rapida', 'Massagem modeladora costuma pedir continuidade — pergunte intervalo recomendado na consulta.',
      'cta_text', 'Quero alinhar expectativa da modeladora',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre massagem modeladora e contorno. O resultado é exploratório — quero marcar avaliação para alinhar pressão, frequência e expectativa realista.'
    )
  ),
  (
    'b1000143-0143-4000-8000-000000000143',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Modeladora no radar — momento de cruzar técnica com objetivo',
      'profile_summary', 'As respostas indicam que o contorno ou a firmeza já mexem com sua autoimagem ou rotina. Um plano com profissional costuma definir cadência e combinações seguras com outras etapas.',
      'frase_identificacao', 'Se isso é você, já pensou em pacote mas quer segurança de método.',
      'main_blocker', 'Sessões irregulares ou pressão inadequada podem limitar o que o tecido responde.',
      'consequence', 'Sem ajuste, o resultado parece “estacionado” mesmo com esforço.',
      'growth_potential', 'Na avaliação, peça explicação de por que certa região entra antes e como medir progresso ao longo das semanas.',
      'dica_rapida', 'Peeling de vida (sono, inflamação, hidratação) conversa com resultado de massagem — comente na consulta.',
      'cta_text', 'Quero consulta para fechar pacote com critério',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre massagem modeladora; o perfil saiu moderado. Quero consulta para definir técnica, frequência e pacote com critério profissional.'
    )
  ),
  (
    'b1000143-0143-4000-8000-000000000143',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Alta expectativa em contorno — calibrar já com a esteticista',
      'profile_summary', 'Pelas respostas, há intensidade na busca por mudança corporal via modeladora ou combinações. Priorize avaliação para não acumular sessões sem direção nem tolerância mapeada.',
      'frase_identificacao', 'Se te revês aqui, queres resultado visível e conversa objetiva, não discurso vago.',
      'main_blocker', 'Urgência sem plano aumenta risco de sobrecarga ou combinações inadequadas.',
      'consequence', 'Continuar sem alinhamento pode gerar desgaste financeiro e corporal.',
      'growth_potential', 'Solicite avaliação prioritária e diga o prazo mental que tem (evento, viagem) — para calibrar honestamente.',
      'dica_rapida', 'Na primeira consulta, peça limite de pressão e sinais de que deve pausar — segurança primeiro.',
      'cta_text', 'Quero avaliação prioritária para modeladora',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre massagem modeladora e contorno; preciso alinhar com urgência expectativa e protocolo. Há encaixe para avaliação prioritária?'
    )
  ),

  -- b1000144 — criolipólise / frio
  (
    'b1000144-0144-4000-8000-000000000144',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Frio localizado no radar — dúvidas saudáveis antes da consulta',
      'profile_summary', 'Pelas respostas, há interesse em tecnologia a frio sem decisão fechada. Na avaliação a profissional cruza gordura localizada, sensibilidade, contraindicações e ritmo realista.',
      'frase_identificacao', 'Se te identificas, queres “faz sentido para mim?” mais que antes e depois de redes sociais.',
      'main_blocker', 'Escolher só pelo aparelho ou pelo preço ignora pele, zona e expectativa de sessões.',
      'consequence', 'Sem critério, a expectativa pode desancorar do que o protocolo costuma entregar.',
      'growth_potential', 'Leve foto de referência (sua) e lista de medicamentos ou cirurgias relevantes para a consulta.',
      'dica_rapida', 'Frio local pede tempo de resposta — pergunte sobre prazo típico de leitura de resultado na clínica.',
      'cta_text', 'Quero saber se crioterapia corporal faz sentido para mim',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre tratamento a frio no corpo. O resultado saiu exploratório — quero avaliação para ver indicação, zona e expectativa realista.'
    )
  ),
  (
    'b1000144-0144-4000-8000-000000000144',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Objetivo em gordura localizada — cruzar frio com seu perfil',
      'profile_summary', 'As respostas mostram combinação de interesse forte e necessidade de segurança. Avaliação presencial fecha zona tratável, número de ciclos possíveis e combinação com massagem ou outros apoios.',
      'frase_identificacao', 'Se isso é você, já pesquisou bastante e quer decisão informada.',
      'main_blocker', 'Informação genérica não substitui palpação e critério de indicador de localização.',
      'consequence', 'Adiar consulta mantém dúvida e pode atrasar janela de planeamento pessoal.',
      'growth_potential', 'Marque avaliação e diga o que já fez (dieta, treino, outros procedimentos) nos últimos 6 meses.',
      'dica_rapida', 'Combinações no mesmo dia nem sempre são boa ideia — alinhar com a clínica.',
      'cta_text', 'Quero avaliação para tecnologia a frio',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre frio na zona certa; o perfil saiu moderado. Quero avaliação presencial para fechar indicação, ciclos e combinações seguras.'
    )
  ),
  (
    'b1000144-0144-4000-8000-000000000144',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Decisão sobre crioterapia com pressa — priorize consulta segura',
      'profile_summary', 'Pelas respostas, há urgência em definir tratamento. O caminho responsável é avaliação rápida com profissional: contraindicações e expectativa precisam estar claras antes de qualquer aplicação.',
      'frase_identificacao', 'Se te revês aqui, queres data e plano, não mais uma semana só a pesquisar.',
      'main_blocker', 'Urgência sem triagem aumenta risco de indicação errada ou expectativa irreala.',
      'consequence', 'Agir no impulso sem consulta pode gerar arrependimento ou intercorrência evitável.',
      'growth_potential', 'Peça encaixe prioritário e traga todas as dúvidas sobre sessões, volta às atividades e cuidados pós.',
      'dica_rapida', 'Liste medicamentos e se sente alterações de sensibilidade na zona — acelera triagem responsável.',
      'cta_text', 'Quero consulta prioritária (frio local)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre tratamento a frio corporal; preciso consulta prioritária para indicar zona, sessões e expectativa com segurança.'
    )
  ),

  -- b1000145 — radiofrequência
  (
    'b1000145-0145-4000-8000-000000000145',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Radiofrequência corporal — explorar se cabe no seu objetivo',
      'profile_summary', 'Pelas respostas, há curiosidade sobre calor controlado para firmeza ou textura. A avaliação alinha zona, sensibilidade da pele, série de sessões e o que esperar em prazo realista.',
      'frase_identificacao', 'Se te identificas, queres firmeza com método, não milagre.',
      'main_blocker', 'Sem triagem, é fácil misturar RF com outras tecnologias no mesmo ciclo sem necessidade.',
      'consequence', 'Expectativa solta tende a colidir com a resposta gradual do colágeno.',
      'growth_potential', 'Na mensagem, diga a região do corpo e o que mais te incomoda ao toque ou ao espelho.',
      'dica_rapida', 'RF costuma pedir série — pergunte intervalo típico na clínica.',
      'cta_text', 'Quero avaliar radiofrequência corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre radiofrequência corporal. O resultado saiu no tom exploratório — quero marcar avaliação para ver indicação e série de sessões.'
    )
  ),
  (
    'b1000145-0145-4000-8000-000000000145',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Flacidez ou textura na mira — RF como peça de protocolo',
      'profile_summary', 'As respostas indicam que a sensação de perda de firmeza ou textura já influencia roupa ou confiança. A profissional costuma encaixar RF com preparação de pele, hidratação e eventual combinação segura.',
      'frase_identificacao', 'Se isso é você, busca resultado mas com medo de queimar ou sensibilizar pele.',
      'main_blocker', 'Ajuste de energia e técnica errados podem irritar sem entregar o desejado — por isso avaliação importa.',
      'consequence', 'Sessões isoladas sem série planejada costumam frustrar.',
      'growth_potential', 'Leve para a consulta rotina de sol, academia ou perda de peso recente — contexto muda plano.',
      'dica_rapida', 'Proteção solar e hidratação sustentam resposta — comente produtos que usa.',
      'cta_text', 'Quero protocolo com RF na consulta',
      'whatsapp_prefill', 'Oi! Fiz o questionário de radiofrequência corporal; o perfil saiu moderado. Quero avaliação para montar protocolo, energia e frequência com vocês.'
    )
  ),
  (
    'b1000145-0145-4000-8000-000000000145',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Objetivo firme com urgência — alinhar RF sem improviso',
      'profile_summary', 'Pelas respostas, há pressa em ver mudança. RF no corpo pede série e critério — avaliação prioritária ajuda a definir cadência e evitar combinações aglomeradas no mesmo período.',
      'frase_identificacao', 'Se te revês aqui, cada semana sem plano parece atraso demais.',
      'main_blocker', 'Empilhar tecnologias quentes sem pausa pode sensibilizar pele e confundir leitura de resultado.',
      'consequence', 'Sem plano, aumenta frustração e custo com resultado abaixo do esperado.',
      'growth_potential', 'Peça encaixe urgente e seja clara sobre eventos ou prazos pessoais para calibrar honestamente.',
      'dica_rapida', 'Evite sessões muito próximas de depilação química ou peelings agressivos na mesma região — confirme na clínica.',
      'cta_text', 'Quero avaliação prioritária (radiofrequência)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre radiofrequência corporal; preciso avaliação prioritária para série de sessões e expectativa alinhada com a realidade do meu caso.'
    )
  ),

  -- b1000146 — ultrassom corporal
  (
    'b1000146-0146-4000-8000-000000000146',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Ultrassom na zona certa — ainda a decidir com calma',
      'profile_summary', 'Pelas respostas, há interesse em ultrassom corporal como possível passo. Na consulta cruzam-se espessura de tecido, objetivo e se a tecnologia entra antes ou depois de outras etapas.',
      'frase_identificacao', 'Se te identificas, queres saber se não é “mais do mesmo” que já tentaste.',
      'main_blocker', 'Tecnologia sem critério de zona tratável gera expectativa desalinhada.',
      'consequence', 'Curiosidade sem consulta prolonga indecisão enquanto o incómodo segue.',
      'growth_potential', 'Anote qual zona incomoda e se há alteração de peso recente — ajuda a triagem.',
      'dica_rapida', 'Pergunte na clínica como medem progresso entre sessões (fotos, circunferência, etc.).',
      'cta_text', 'Quero avaliar ultrassom corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre ultrassom corporal. O resultado é exploratório — quero avaliação para ver se faz sentido na minha zona e objetivo.'
    )
  ),
  (
    'b1000146-0146-4000-8000-000000000146',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Zona e objetivo definidos — hora de fechar protocolo com profissional',
      'profile_summary', 'As respostas mostram clareza razoável sobre o que quer mudar. Ultrassom pode integrar plano, mas precisa de frequência, preparação de pele e às vezes combinação com massagem ou outros métodos.',
      'frase_identificacao', 'Se isso é você, já filtrou ruído de internet e quer decisão na mesa com a esteticista.',
      'main_blocker', 'Intervalo errado entre sessões pode anular efeito cumulativo.',
      'consequence', 'Pacotes genéricos sem reavaliação perdem aderência ao que o corpo responde.',
      'growth_potential', 'Marque consulta para alinhar número de sessões iniciais e data de revisão.',
      'dica_rapida', 'Hidratação e movimento leve costumam apoiar resposta — confirme orientações na clínica.',
      'cta_text', 'Quero consulta para protocolo de ultrassom',
      'whatsapp_prefill', 'Oi! Fiz o questionário de ultrassom corporal; o perfil saiu moderado. Quero consulta para fechar zona, sessões iniciais e revisão de progresso.'
    )
  ),
  (
    'b1000146-0146-4000-8000-000000000146',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Pressa em definir ultrassom — avaliação prioritária',
      'profile_summary', 'Pelas respostas, há urgência em avançar. Mesmo com pressa, a ordem segura é avaliação: definem-se zona, contraindicações e série sem sobrecarregar pele ou agenda.',
      'frase_identificacao', 'Se te revês aqui, queres data e primeira sessão com norte claro.',
      'main_blocker', 'Começar sem plano completo aumenta risco de sessões mal focadas.',
      'consequence', 'Correr sem triagem pode desperdiçar investimento e tempo.',
      'growth_potential', 'Peça encaixe rápido e leve documentos ou histórico de procedimentos anteriores na região.',
      'dica_rapida', 'Anote se há dor à palpação ou alteração recente de volume — diferencia urgência estética de outro cuidado.',
      'cta_text', 'Quero avaliação urgente — ultrassom corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre ultrassom corporal; preciso avaliação prioritária para definir zona, série de sessões e cuidados entre uma e outra.'
    )
  ),

  -- b1000147 — cavitação / lipocavitação
  (
    'b1000147-0147-4000-8000-000000000147',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Cavitação no horizonte — esclarecer antes de fechar',
      'profile_summary', 'Pelas respostas, há curiosidade sobre lipocavitação ou contorno por ultrassom focal. A consulta valida textura de pele, camada a tratar e expectativa sobre sessões — sem promessa de copo d’água a menos.',
      'frase_identificacao', 'Se te identificas, queres “faço ou não faço?” com critério clínico-estético.',
      'main_blocker', 'Marketing agressivo costuma distorcer o que a tecnologia altera em cada ciclo.',
      'consequence', 'Decidir só por vídeo tende a gerar choque de expectativa.',
      'growth_potential', 'Leve perguntas sobre intervalo, cuidados pós e sinais de que deves pausar.',
      'dica_rapida', 'Combinação com drenagem ou massagem pode fazer parte do plano — pergunte na avaliação.',
      'cta_text', 'Quero avaliar cavitação corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre cavitação e contorno. O resultado saiu exploratório — quero avaliação para ver indicação, zona e número realista de sessões.'
    )
  ),
  (
    'b1000147-0147-4000-8000-000000000147',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Localizado na mira — cavitação como peça de um plano',
      'profile_summary', 'As respostas indicam foco em zona específica e desejo de contorno. Um plano profissional costuma alternar tecnologia, drenagem e hábitos para leitura de resultado mais estável.',
      'frase_identificacao', 'Se isso é você, já notou que dieta sozinha não resolve a gaveta que incomoda.',
      'main_blocker', 'Só tecnologia sem acompanhamento de rotina pode limitar o que se vê no espelho.',
      'consequence', 'Parar no meio por frustração precoce é comum quando não há marcos de revisão.',
      'growth_potential', 'Combine na consulta data de reavaliação intermediária — ajusta força ou pausa se necessário.',
      'dica_rapida', 'Pele muito flácida pode precisar de outra estratégia primeiro — confie na triagem.',
      'cta_text', 'Quero plano com cavitação na consulta',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre cavitação; o perfil saiu moderado. Quero consulta para montar plano com zona, sessões, drenagem e revisão intermediária.'
    )
  ),
  (
    'b1000147-0147-4000-8000-000000000147',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Urgência em contorno — calibrar cavitação com segurança',
      'profile_summary', 'Pelas respostas, há intensidade na busca por resultado em zona localizada. Avaliação prioritária protege pele e agenda: define intensidade, pausas e o que não misturar na mesma semana.',
      'frase_identificacao', 'Se te revês aqui, queres progresso visível sem passos arriscados.',
      'main_blocker', 'Empilhar sessões sem intervalo adequado pode irritar tecido.',
      'consequence', 'Sem supervisão, aumenta risco de queixa ou desinscrição do plano.',
      'growth_potential', 'Peça encaixe prioritário e diga se há viagem ou exposição solar planejada — muda protocolo.',
      'dica_rapida', 'Evite combinar com outros procedimentos agressivos na mesma semana sem autorização da clínica.',
      'cta_text', 'Avaliação prioritária — cavitação',
      'whatsapp_prefill', 'Oi! Fiz o questionário de cavitação e contorno; preciso avaliação prioritária para calibrar sessões, intervalos e combinações seguras com a minha pele e rotina.'
    )
  ),

  -- b1000148 — endermologia / celulite
  (
    'b1000148-0148-4000-8000-000000000148',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Celulite e sucção mecânica — explorar indicação com calma',
      'profile_summary', 'Pelas respostas, há interesse em endermologia ou sucção para textura. A consulta alinha frequência, sensação esperada e integração com massagem ou RF — sempre com linguagem realista.',
      'frase_identificacao', 'Se te identificas, queres textura melhor sem fantasia de “sumir tudo”.',
      'main_blocker', 'Comparar seu estágio com foto alheia gera expectativa tóxica.',
      'consequence', 'Expectativa irreal leva a abandonar protocolo antes do tempo de resposta.',
      'growth_potential', 'Descreva o grau de incómodo (estético vs. dor) na mensagem — orienta prioridade.',
      'dica_rapida', 'Resultado costuma ser gradual — pergunte como a clínica documenta evolução.',
      'cta_text', 'Quero avaliar endermologia para a minha pele',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre celulite e sucção mecânica. O resultado é exploratório — quero avaliação para ver se endermologia entra no meu plano e com que frequência.'
    )
  ),
  (
    'b1000148-0148-4000-8000-000000000148',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Textura e celulite a incomodar — hora de série estruturada',
      'profile_summary', 'As respostas sugerem que a aparência da pele já pesa na escolha de roupa ou na autoimagem. Protocolo com sucção/mobilização costuma funcionar melhor com cadência combinada com profissional.',
      'frase_identificacao', 'Se isso é você, já tentou cremes genéricos e quer camada profissional.',
      'main_blocker', 'Parar e recomeçar a cada mês reinicia resposta do tecido.',
      'consequence', 'Sem compromisso de série, o quadro parece “estagnado”.',
      'growth_potential', 'Na consulta, alinhe 6–8 semanas iniciais com data de revisão fotográfica ou subjetiva.',
      'dica_rapida', 'Hidratação e movimento podem realçar resposta — integre com orientação da clínica.',
      'cta_text', 'Quero consulta para série de endermologia',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre celulite e endermologia; o perfil saiu moderado. Quero consulta para definir série inicial, intervalo e revisão em 6–8 semanas.'
    )
  ),
  (
    'b1000148-0148-4000-8000-000000000148',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Incómodo forte com textura — priorizar avaliação e plano',
      'profile_summary', 'Pelas respostas, a questão da celulite ou firmeza parece urgente emocional ou física. Avaliação rápida estrutura técnica, força de sucção/ritmo e pausas — sem promessa, com critério.',
      'frase_identificacao', 'Se te revês aqui, precisa de acção, não de mais um creme sortido.',
      'main_blocker', 'Sem plano, tende a saltar entre procedimentos sem dar tempo de resposta.',
      'consequence', 'Frustração e custo repetido sem método.',
      'growth_potential', 'Peça encaixe prioritário e diga o que já fez de invasivo ou minimally invasive na área.',
      'dica_rapida', 'Use roupas confortáveis na primeira consulta — facilita avaliação da zona sem pressa.',
      'cta_text', 'Avaliação prioritária — celulite / endermologia',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre celulite e sucção; o resultado saiu urgente. Quero avaliação prioritária para protocolo estruturado e expectativa honesta com a profissional.'
    )
  ),

  -- b1000149 — textura vs firmeza ao espelho
  (
    'b1000149-0149-4000-8000-000000000149',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Ao espelho: textura ou firmeza — organizar prioridade',
      'profile_summary', 'Pelas respostas, ainda há exploração sobre o que mais te incomoda. Na consulta separa-se textura (superfície) de firmeza (suporte) — ordens de protocolo diferentes.',
      'frase_identificacao', 'Se te identificas, queres clareza sem atacar tudo de uma vez.',
      'main_blocker', 'Misturar objetivos na mesma sessão pode diluir resultado e confundir leitura.',
      'consequence', 'Sem prioridade, cada tratamento parece “meio termo”.',
      'growth_potential', 'Leve 1 frase: “O que eu mais quero mudar em 60 dias” — ancora a conversa.',
      'dica_rapida', 'Fotos com luz uniforme ajudam comparar evolução — pergunte política de registo na clínica.',
      'cta_text', 'Quero consulta para priorizar textura ou firmeza',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre textura e firmeza ao espelho. O resultado saiu exploratório — quero consulta para priorizar objetivo e ordem de protocolo.'
    )
  ),
  (
    'b1000149-0149-4000-8000-000000000149',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Incomodidade visível com pele ou contorno — cruzar técnicas',
      'profile_summary', 'As respostas indicam impacto na confiança. A profissional costuma escolher primeiro o eixo principal (firmeza vs. textura vs. volume localizado) e encaixa tecnologias compatíveis.',
      'frase_identificacao', 'Se isso é você, o espelho já condiciona escolhas de roupa ou fotos.',
      'main_blocker', 'Protocolo genérico “full body” raramente resolve foco específico.',
      'consequence', 'Dispersão de tratamentos aumenta custo e cansaço emocional.',
      'growth_potential', 'Marque avaliação com lista do que já fez (3 últimos meses) para evitar repetir erro.',
      'dica_rapida', 'Menos frentes, mais profundidade — peça plano em fases explícitas.',
      'cta_text', 'Quero plano em fases na avaliação',
      'whatsapp_prefill', 'Oi! Fiz o questionário textura vs firmeza; o perfil saiu moderado. Quero avaliação para plano em fases com ordem clara de protocolo.'
    )
  ),
  (
    'b1000149-0149-4000-8000-000000000149',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Espelho e corpo com peso emocional alto — avaliação prioritária',
      'profile_summary', 'Pelas respostas, há intensidade na insatisfação com pele ou contorno. Avaliação rápida estrutura expectativa honesta e sequência segura — evita mais uma compra por impulso.',
      'frase_identificacao', 'Se te revês aqui, queres mudança com acompanhamento, não mais um “truque”.',
      'main_blocker', 'Decidir sob aflição aumenta risco de pacote errado para o estágio atual.',
      'consequence', 'Ciclo de esperança e frustração sem método.',
      'growth_potential', 'Peça consulta prioritária e seja franca sobre histórico de TCA ou body image se relevante — ajuda tom de cuidado.',
      'dica_rapida', 'Traga uma foto sua recente (mesma luz/hábito) como referência honesta — não comparar com anúncios.',
      'cta_text', 'Consulta prioritária — textura e firmeza',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre o que mais incomoda ao espelho; preciso consulta prioritária para plano realista e acolhedor com a equipe.'
    )
  ),

  -- b1000150 — gordura localizada
  (
    'b1000150-0150-4000-8000-000000000150',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Gordura localizada — por onde começar sem milagre',
      'profile_summary', 'Pelas respostas, há interesse em reordenar estratégia (hábito + estética) sem promessa fantasiosa. Avaliação alinha o que é tratável na clínica e o que pede nutrição ou movimento em paralelo.',
      'frase_identificacao', 'Se te identificas, quer método e honestidade sobre prazo.',
      'main_blocker', 'Propaganda de “derreter” sem contexto corporal gerou expectativas irreais no mercado.',
      'consequence', 'Comparar com corpos alheios atrasa decisão informada.',
      'growth_potential', 'Leve hábitos atuais (sono, álcool, treino) — a consulta ganha realismo.',
      'dica_rapida', 'Objetivo único por trimestre costuma vencer três metas em simultâneo.',
      'cta_text', 'Quero consulta para localizado sem promessa vazia',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre gordura localizada e por onde começar. Quero avaliação para alinhar expectativa, tecnologia possível e hábitos — sem milagre.'
    )
  ),
  (
    'b1000150-0150-4000-8000-000000000150',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Localizado a atrapalhar — cruzar tecnologia, massagem e rotina',
      'profile_summary', 'As respostas indicam que a zona específica já condiciona roupa ou autoestima. Plano costuma misturar abordagem in-office e dever de casa — a profissional fecha prioridade e ordem.',
      'frase_identificacao', 'Se isso é você, já tentou generalidades e quer foco.',
      'main_blocker', 'Tecnologia sem continuidade ou sem preparação do tecido limita resultado.',
      'consequence', 'Gastar em sessões avulsas sem norte tende a desanimar.',
      'growth_potential', 'Combine revisão a 30 dias na mensagem — reforça compromisso de plano.',
      'dica_rapida', 'Perda de peso recente muda pele — comente para ajustar técnica.',
      'cta_text', 'Quero plano para localizado na consulta',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre gordura localizada; o perfil saiu moderado. Quero consulta para plano com ordem de técnicas, massagem e hábitos entre sessões.'
    )
  ),
  (
    'b1000150-0150-4000-8000-000000000150',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Pressa em ver mudança no localizado — avaliação prioritária',
      'profile_summary', 'Pelas respostas, há urgência em tratar zona específica. Antes de fechar pacote grande, avaliação prioritária define candidatura real, série e cuidados — protege expectativa e segurança.',
      'frase_identificacao', 'Se te revês aqui, cada semana sem plano parece custo demais.',
      'main_blocker', 'Negociar só por número de sessões sem triagem pode gerar desalinhamento.',
      'consequence', 'Frustração se o corpo responde mais devagar que o prazo mental.',
      'growth_potential', 'Peça encaixe rápido e traga meta realista por escrito — alinha conversa.',
      'dica_rapida', 'Confirme se houve mudança de peso ou hormonoterapia recente — pode mudar indicação e expectativa.',
      'cta_text', 'Avaliação prioritária — gordura localizada',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre gordura localizada; preciso avaliação prioritária para indicar técnica, série e prazo honesto com a profissional.'
    )
  ),

  -- b1000151 — detox corporal (rotina vs promessa)
  (
    'b1000151-0151-4000-8000-000000000151',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', '“Detox” corporal — separar rotina de promessa',
      'profile_summary', 'Pelas respostas, há curiosidade sobre detox sem radicalização. Na consulta separa-se o que é hábito sustentável do que é protocolo clínico — evita confusão entre marketing e cuidado real.',
      'frase_identificacao', 'Se te identificas, queres sensação de leveza com pé no chão.',
      'main_blocker', 'Linguagem de detox milagroso pode empurrar produtos ou jejuns inadequados.',
      'consequence', 'Expectativa mágica frustra quando o corpo responde devagar.',
      'growth_potential', 'Leve perguntas sobre hidratação, sono e digestão — contexto útil na avaliação.',
      'dica_rapida', 'Melhora duradoura costuma ser soma de pequenos hábitos + protocolo quando indicado.',
      'cta_text', 'Quero conversar sobre detox realista na clínica',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre detox corporal. O resultado saiu exploratório — quero consulta para separar rotina, protocolo e expectativa sem promessa vazia.'
    )
  ),
  (
    'b1000151-0151-4000-8000-000000000151',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Sensação de peso ou confusão com “limpeza” — alinhar na consulta',
      'profile_summary', 'As respostas sugerem que rotina e sensação corporal já pesam. A profissional costuma montar ponte entre hábitos e tratamentos (ex.: drenagem) sem discurso de cura mágica.',
      'frase_identificacao', 'Se isso é você, já tentou modas de detox e quer critério.',
      'main_blocker', 'Misturar muitas restrições com estimulação agressiva pode cansar mais que ajudar.',
      'consequence', 'Ciclo de culpa e recomeço sem avaliação prolonga incómodo.',
      'growth_potential', 'Marque consulta com lista de sintomas leves (inchaço matinal, digestão) — sempre com honestidade, sem autodiagnóstico.',
      'dica_rapida', 'Peça “plano mínimo viável” para 14 dias — mede adesão antes de escalar.',
      'cta_text', 'Quero plano hábito + protocolo na avaliação',
      'whatsapp_prefill', 'Oi! Fiz o questionário detox corporal; o perfil saiu moderado. Quero consulta para alinhar hábitos com protocolo da clínica e expectativa realista.'
    )
  ),
  (
    'b1000151-0151-4000-8000-000000000151',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Urgência em se sentir “limpa” ou leve — priorizar avaliação segura',
      'profile_summary', 'Pelas respostas, há intensidade na busca por alívio ou mudança rápida. Avaliação prioritária ajuda a evitar extremos e encaixa drenagem ou protocolo adequado ao seu caso — com critério profissional.',
      'frase_identificacao', 'Se te revês aqui, o corpo ou a cabeça pedem ação já — mas com norte.',
      'main_blocker', 'Decisões extremas sob estresse podem ser contraproducentes; a clínica acolhe com método.',
      'consequence', 'Adiar conversa estruturada prolonga sensação de peso e tentativas soltas.',
      'growth_potential', 'Peça encaixe prioritário e mencione se há quadro digestivo ou hormonal em acompanhamento médico — informação para conversa honesta com a equipe.',
      'dica_rapida', 'Evite jejuns extremos ou “kits milagre” até ouvir a profissional — protege continuidade e segurança.',
      'cta_text', 'Consulta prioritária — detox / leveza corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre detox corporal; o resultado saiu urgente. Quero consulta prioritária para plano seguro e realista com a profissional, sem extremos.'
    )
  );
