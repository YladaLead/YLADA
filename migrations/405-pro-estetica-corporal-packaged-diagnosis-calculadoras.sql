-- Pro Estética Corporal — calculadoras do painel (links com architecture PROJECTION_CALCULATOR).
-- Pacotes por template_id × leve | moderado | urgente × diagnosis_vertical = corporal.
-- Arquétipo vem do motor: projeção “agressiva” (warning) → urgente; meta calma → leve; resto moderado.
-- Números da calculadora não substituem consulta; copy convida avaliação profissional — sem prescrição.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'PROJECTION_CALCULATOR'
  AND diagnosis_vertical = 'corporal'
  AND template_id IN (
    'b1000025-0025-4000-8000-000000000025'::uuid,
    'b1000026-0026-4000-8000-000000000026'::uuid,
    'b1000027-0027-4000-8000-000000000027'::uuid,
    'b1000028-0028-4000-8000-000000000028'::uuid,
    'b1000031-0031-4000-8000-000000000031'::uuid,
    'b1000123-0123-4000-8000-000000000123'::uuid
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  -- b1000025 — água (apoio a hábito + protocolo corporal)
  (
    'b1000025-0025-4000-8000-000000000025',
    'PROJECTION_CALCULATOR',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Meta de hidratação organizada — bom alinhamento com corpo e protocolo',
      'profile_summary', 'Pelos números que você trouxe, a estimativa de água faz sentido como ordem de grandeza. No contexto corporal, hidratação adequada costuma apoiar sensação de leveza e resposta a drenagem ou massagem — o detalhe fino (saúde, medicamentos, treino) fica na conversa com a profissional.',
      'frase_identificacao', 'Se você se identifica, quer transformar o resultado da calculadora em hábito sustentável junto da clínica.',
      'main_blocker', 'Só olhar o copo contado sem encaixar na rotina real (trabalho, calor, treino) limita o efeito prático.',
      'consequence', 'Sem ajuste com quem te acompanha, o número vira meteoro na tela, não rotina.',
      'growth_potential', 'Use o print ou o resultado na avaliação para cruzar com protocolo que vocês fecharem.',
      'dica_rapida', 'Distribuir a água ao longo do dia costuma vencer “tomar tudo de uma vez”.',
      'cta_text', 'Quero alinhar hidratação com meu protocolo corporal',
      'whatsapp_prefill', 'Oi! Usei a calculadora de água no link de vocês. O resultado é estimativa — quero marcar avaliação para alinhar hidratação com hábito e protocolo corporal.'
    )
  ),
  (
    'b1000025-0025-4000-8000-000000000025',
    'PROJECTION_CALCULATOR',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Hidratação na mira — ajuste fino com a equipe faz diferença',
      'profile_summary', 'A estimativa da calculadora é um ponto de partida; no corpo em tratamento estético, treino, calor e sensação de inchaço mudam o que é realista. Na consulta costuma fechar-se meta simples de copos por dia e sinais de que precisa pausar ou adaptar.',
      'frase_identificacao', 'Se isso combina com você, já sente que “água certa” não é só número genérico.',
      'main_blocker', 'Comparar seu resultado com influencer sem contexto de peso, clima e saúde distorce expectativa.',
      'consequence', 'Rotina desalinhada prolonga sensação de peso ou pele desconfortável.',
      'growth_potential', 'Peça à profissional uma meta mínima para 14 dias e como observar evolução subjetiva.',
      'dica_rapida', 'Leve anotação de quanto bebe hoje (honesta) — o ajuste fica mais rápido.',
      'cta_text', 'Quero consulta para calibrar hidratação realista',
      'whatsapp_prefill', 'Oi! Calculei minha meta de água; quero consulta para calibrar com rotina, treino e o protocolo corporal que estou fazendo ou pretendo fazer.'
    )
  ),
  (
    'b1000025-0025-4000-8000-000000000025',
    'PROJECTION_CALCULATOR',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Meta de água sob pressão — priorize conversa antes de radicalizar',
      'profile_summary', 'Pelos dados, há combinação de prazo curto ou salto grande que puxa o alerta do planeamento. Para protocolo corporal, mudanças bruscas em líquidos sem orientação podem ser contraproducentes — a avaliação prioritariza segurança e ritmo sustentável.',
      'frase_identificacao', 'Se você se reconhece aqui, quer resultado rápido mas precisa de norte profissional.',
      'main_blocker', 'Empurrar líquidos ou cortar sal sem critério pode descompensar sensação e rotina.',
      'consequence', 'Excesso de improviso aumenta cansaço e frustração.',
      'growth_potential', 'Peça encaixe prioritário e mencione medicamentos, gestação ou problemas renais/cardíacos, se existir.',
      'dica_rapida', 'Evite alterar drasticamente ingestão de água até falar com a equipe.',
      'cta_text', 'Quero avaliação prioritária — hidratação e protocolo',
      'whatsapp_prefill', 'Oi! Usei a calculadora de água e o perfil saiu com alerta de meta agressiva. Quero avaliação prioritária para ritmo seguro de hidratação junto do protocolo corporal.'
    )
  ),

  -- b1000026 — calorias (contexto corpo / não substitui nutricionista)
  (
    'b1000026-0026-4000-8000-000000000026',
    'PROJECTION_CALCULATOR',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Referência calórica clara — próximo passo com quem acompanha o corpo',
      'profile_summary', 'O número da calculadora ajuda a ter ordem de grandeza. Para estética corporal, calorias conversam com composição, energia para treino e sensação — mas não substituem plano individual com nutricionista ou médico quando necessário.',
      'frase_identificacao', 'Se te identificas, queres usar o resultado como ponto de partida, não como rótulo definitivo.',
      'main_blocker', 'Transformar kcal de app em promessa de contorno sem hábito e protocolo em clínica costuma frustrar.',
      'consequence', 'Só perder peso na balança sem contexto pode mascarar flacidez ou prioridade de zona.',
      'growth_potential', 'Na consulta corporal, peça como encaixar nutrição com sessões que vocês combinarem.',
      'dica_rapida', 'Anotar fome, sono e treino na mesma semana do resultado enriquece a conversa.',
      'cta_text', 'Quero alinhar resultado da calculadora com protocolo',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de calorias no link. Quero avaliação para alinhar esse referencial com hábito e protocolo corporal com vocês.'
    )
  ),
  (
    'b1000026-0026-4000-8000-000000000026',
    'PROJECTION_CALCULATOR',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Calorias e objetivo corporal — cruzar com profissional',
      'profile_summary', 'A estimativa está no ar como guia; quem fecha contorno, firmeza ou performance costuma ajustar macronutrientes, micronutrientes e prazo com contexto real. Traga o resultado como abertura de conversa, não como meta fechada.',
      'frase_identificacao', 'Se isso é você, já sabe que número sozinho não desenha abdômen ou celulite.',
      'main_blocker', 'Cortar demais por conta própria pode afetar energia para treino e resposta à massagem ou tecnologia.',
      'consequence', 'Oscilação forte na ingesta prolonga irritação e irregularidade.',
      'growth_potential', 'Marque consulta com print do resultado e um dia típico de alimentação escrito.',
      'dica_rapida', 'Proteína e sono costumam influenciar fome — comente na avaliação.',
      'cta_text', 'Quero consulta para calibrar meta calórica e corpo',
      'whatsapp_prefill', 'Oi! Tenho o resultado da calculadora de calorias; quero consulta para calibrar meta com objetivo corporal e rotina realista.'
    )
  ),
  (
    'b1000026-0026-4000-8000-000000000026',
    'PROJECTION_CALCULATOR',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Meta calórica sob estresse — avaliação antes de forçar déficit',
      'profile_summary', 'Os dados sugerem combinação agressiva (prazo ou salto) em relação ao habitual. Para tratamento corporal, déficit extremo sem supervisão pode afetar recuperação, pele e aderência ao plano — priorize conversa orientada.',
      'frase_identificacao', 'Se te revês aqui, queres mudança rápida com método, não só menos kcal na calculadora.',
      'main_blocker', 'Forçar recorte sem triagem aumenta risco de fadiga e desistência.',
      'consequence', 'Ciclo de restritivo e estouro pode piorar sensação com espelho.',
      'growth_potential', 'Peça encaixe prioritário e seja franca sobre histórico alimentar sensível, se relevante.',
      'dica_rapida', 'Evite iniciar déficit agressivo sozinha(o) até alinhar com a equipe.',
      'cta_text', 'Quero avaliação prioritária — meta e protocolo corporal',
      'whatsapp_prefill', 'Oi! A calculadora de calorias acusou meta agressiva; quero avaliação prioritária para ritmo seguro com protocolo corporal e acompanhamento adequado.'
    )
  ),

  -- b1000027 — IMC (referência, não diagnóstico)
  (
    'b1000027-0027-4000-8000-000000000027',
    'PROJECTION_CALCULATOR',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'IMC como referência — conversa corporal pode ir além do número',
      'profile_summary', 'O IMC é um indicador simples; não descreve gordura localizada, músculo ou textura. Para estética corporal, o que importa na consulta é objetivo visível, zona tratável e protocolo — sempre com linguagem responsável.',
      'frase_identificacao', 'Se te identificas, queres contexto humano além da tabela na tela.',
      'main_blocker', 'Fixar só no índice sem olhar hábito e corpo real limita decisão de tratamento.',
      'consequence', 'Comparar seu número com meta de celebridade distorce expectativa de protocolo.',
      'growth_potential', 'Leve resultado e pergunte o que faz sentido primeiro: hábito, contorno ou firmeza.',
      'dica_rapida', 'Circunferência e foto de referência sua ajudam mais que só o IMC.',
      'cta_text', 'Quero avaliação corporal além do IMC',
      'whatsapp_prefill', 'Oi! Calculei meu IMC no link. Quero marcar avaliação corporal para alinhar expectativa, zonas e protocolo com vocês — além do número.'
    )
  ),
  (
    'b1000027-0027-4000-8000-000000000027',
    'PROJECTION_CALCULATOR',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'IMC + objetivo corporal — alinhar expectativa na consulta',
      'profile_summary', 'O número do IMC é uma peça; na estética corporal entram zonas, sensação, rotina e o que é seguro combinar. Use o resultado para abrir conversa honesta sobre prazo e prioridade — sem promessa de corpo de editorial.',
      'frase_identificacao', 'Se isso é você, quer traduzir índice em plano que conversa com o espelho.',
      'main_blocker', 'Fechar pacote só por “preciso baixar IMC” ignora ordem de protocolo (hábito, pele, tecnologia).',
      'consequence', 'Expectativa vaga prolonga gasto com tentativas desconexas.',
      'growth_potential', 'Peça avaliação com uma meta visível em 8 semanas e critérios de revisão.',
      'dica_rapida', 'Perda de peso rápida muda pele — comente com a profissional antes de intensificar.',
      'cta_text', 'Quero consulta para plano corporal com contexto do IMC',
      'whatsapp_prefill', 'Oi! Tenho meu IMC da calculadora e objetivos corporais; quero consulta para plano realista com ordem de protocolo e revisão.'
    )
  ),
  (
    'b1000027-0027-4000-8000-000000000027',
    'PROJECTION_CALCULATOR',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Pressa em mudar peso/IMC — priorize avaliação segura',
      'profile_summary', 'Pelos dados da projeção, há tensão entre prazo e mudança desejada. Antes de dietas ou protocolos intensos, a conversa presencial protege expectativa e saúde — especialmente se houver histórico sensitivo ou uso de medicamentos.',
      'frase_identificacao', 'Se te revês aqui, queres resultado visível rápido com menos improviso.',
      'main_blocker', 'Urgência sem triagem aumenta risco de método inadequado ou frustrante.',
      'consequence', 'Ciclo de tentativa e erro prolonga insatisfação com o corpo.',
      'growth_potential', 'Peça encaixe prioritário e traga exames ou acompanhamento médico relevantes, se houver.',
      'dica_rapida', 'Evite iniciar restritivo extremo sozinha(o) até alinhar com a equipe.',
      'cta_text', 'Quero avaliação prioritária — IMC e protocolo',
      'whatsapp_prefill', 'Oi! A calculadora colocou meu IMC/projeção em alerta de meta agressiva; quero avaliação prioritária para plano corporal seguro e realista.'
    )
  ),

  -- b1000028 — proteína (massa, recuperação, não prescritivo)
  (
    'b1000028-0028-4000-8000-000000000028',
    'PROJECTION_CALCULATOR',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Meta de proteína como referência — encaixar no protocolo corporal',
      'profile_summary', 'A calculadora dá uma faixa útil de gramas por dia; para treino e estética corporal, distribuição ao longo do dia e tolerância individual importam. Na consulta pode alinhar-se com hábito e com sessões de massagem ou fortalecimento que vocês fizerem.',
      'frase_identificacao', 'Se te identificas, queres número para conversar com a profissional, não auto-prescrever.',
      'main_blocker', 'Multiplex de shakes sem orientação ignora digestão, sede e ritmo de treino.',
      'consequence', 'Expectativa só em suplemento sem comida real costuma não sustentar rotina.',
      'growth_potential', 'Leve o resultado e um dia típico de refeições (honesto) para ajuste fino.',
      'dica_rapida', 'Proteína no café da manhã ajuda saciedade — valide distribuição com a equipe.',
      'cta_text', 'Quero alinhar proteína com treino e protocolo',
      'whatsapp_prefill', 'Oi! Usei a calculadora de proteína. Quero avaliação para alinhar gramas com treino, rotina e protocolo corporal com vocês.'
    )
  ),
  (
    'b1000028-0028-4000-8000-000000000028',
    'PROJECTION_CALCULATOR',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Proteína e objetivo corporal — personalizar na consulta',
      'profile_summary', 'O valor estimado é ponto de partida; objetivo de contorno, performance ou recuperação muda prioridade. Quem acompanha corpo costuma ajustar proteína com peso, saúde intestinal e preferências — sem prometer ganho de massa só por número.',
      'frase_identificacao', 'Se isso é você, já sente que macro não é “tudo igual para todo mundo”.',
      'main_blocker', 'Copiar gramas de app sem ver fome, sono e treino gera inconsistência.',
      'consequence', 'Oscilar entre muito e pouco proteína atrasa sensação de firmeza e energia.',
      'growth_potential', 'Marque consulta com meta da calculadora e horários em que mais sente fome.',
      'dica_rapida', 'Hidratação ajuda metabolização — integre com orientação da clínica.',
      'cta_text', 'Quero consulta para calibrar proteína e corpo',
      'whatsapp_prefill', 'Oi! Tenho meta de proteína da calculadora; quero consulta para calibrar com objetivo corporal e hábitos reais.'
    )
  ),
  (
    'b1000028-0028-4000-8000-000000000028',
    'PROJECTION_CALCULATOR',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Meta proteica agressiva — revisar com profissional antes de escalar',
      'profile_summary', 'A projeção indica combinação exigente (muita proteína ou objetivo intenso em pouco tempo). Para protocolo corporal, subir carga proteica sem triagem pode sobrecarregar — priorize conversa para ritmo seguro e sustentável.',
      'frase_identificacao', 'Se te revês aqui, queres performance ou contorno rápido mas com menos risco.',
      'main_blocker', 'Empurrar suplementação ou quantidade alta sem suporte pode irritar digestão ou rotina.',
      'consequence', 'Abandono do plano por desconforto atrasa o que você quer ver no espelho.',
      'growth_potential', 'Peça avaliação prioritária e mencione função renal, gestação ou restrições alimentares, se houver.',
      'dica_rapida', 'Não multiplique shakes até ouvir a equipe.',
      'cta_text', 'Quero avaliação prioritária — proteína e protocolo',
      'whatsapp_prefill', 'Oi! A calculadora de proteína apontou meta agressiva; quero avaliação prioritária para ritmo seguro com protocolo corporal.'
    )
  ),

  -- b1000031 — hidratação avançada (peso, treino, clima)
  (
    'b1000031-0031-4000-8000-000000000031',
    'PROJECTION_CALCULATOR',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Hidratação considerando treino e clima — boa base para o corpo',
      'profile_summary', 'A estimativa junta peso, movimento e temperatura — útil antes de sessões de suor ou drenagem. Ainda assim, medicamentos, saúde e sensação pessoal ajustam o alvo na consulta.',
      'frase_identificacao', 'Se te identificas, queres número que faça sentido para quem treina ou mora em clima quente.',
      'main_blocker', 'Ignorar treino ou calor na rotina real subestima necessidade e sensação de fadiga.',
      'consequence', 'Vir treinar ou fazer sessão desidratada limita resultado e conforto.',
      'growth_potential', 'Use o resultado na avaliação para cruzar com frequência de sessões e esforço.',
      'dica_rapida', 'Água no período ao redor do treino costuma ser prioridade — alinhe horários.',
      'cta_text', 'Quero alinhar hidratação com treino e protocolo',
      'whatsapp_prefill', 'Oi! Usei a calculadora de hidratação avançada. Quero marcar avaliação para alinhar copos/dia com treino, clima e protocolo corporal.'
    )
  ),
  (
    'b1000031-0031-4000-8000-000000000031',
    'PROJECTION_CALCULATOR',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Água, suor e estética corporal — calibrar com a equipe',
      'profile_summary', 'O número da calculadora orienta; na prática, intensidade de treino muda semana a semana e sessões na clínica somam estresse térmico ou massagem profunda. Uma consulta ajuda a ajustar meta sem mitos.',
      'frase_identificacao', 'Se isso é você, já percebeu que “meta fixa” raramente dura o mês todo.',
      'main_blocker', 'Copiar meta de outra pessoa com peso e treino diferentes distorce necessidade.',
      'consequence', 'Desidratação leve prolonga inchaço mal interpretado ou treino fraco.',
      'growth_potential', 'Peça plano de hidratação para dias de clínica + dias de treino pesado.',
      'dica_rapida', 'Eletrólitos e refeição são tema para profissional — não improvisar dieta só com água.',
      'cta_text', 'Quero consulta para hidratação + agenda corporal',
      'whatsapp_prefill', 'Oi! Calculei hidratação com treino/clima; quero consulta para alinhar com minha agenda de sessões e treinos.'
    )
  ),
  (
    'b1000031-0031-4000-8000-000000000031',
    'PROJECTION_CALCULATOR',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Demanda de líquidos alta — priorize segurança e avaliação',
      'profile_summary', 'Pelos dados, a meta de ingestão ou o ritmo são intensos em conjunto com treino ou calor. Mudanças bruscas podem ser mal toleradas; a profissional ou equipe multiprofissional ajuda a calibrar com saúde e rotina.',
      'frase_identificacao', 'Se te revês aqui, queres performance ou desinchar rápido sem gambiarra.',
      'main_blocker', 'Forçar litragem extrema sem orientação clínica pode ser arriscado.',
      'consequence', 'Mal-estar ou irregularidade prolonga distância do objetivo corporal.',
      'growth_potential', 'Peça encaixe prioritário e mencione cardiologia, rins ou medicamentos diuréticos, se houver.',
      'dica_rapida', 'Antes de turbinar água ou sal, converse com a clínica.',
      'cta_text', 'Quero avaliação prioritária — hidratação e corpo',
      'whatsapp_prefill', 'Oi! A calculadora de hidratação deu meta agressiva no meu contexto; quero avaliação prioritária para ritmo seguro com treino e protocolo.'
    )
  ),

  -- b1000123 — expectativa de sessões (checkpoint × frequência; projeção genérica no link)
  (
    'b1000123-0123-4000-8000-000000000123',
    'PROJECTION_CALCULATOR',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Sessões estimadas — bom para alinhar expectativa com calma',
      'profile_summary', 'Pelos números, o ritmo que você imaginou parece compatível com conversa franca na clínica. Lembre: é ordem de grandeza, não promessa de resultado; cabe à profissional fechar série, intervalo e técnica para a sua zona.',
      'frase_identificacao', 'Se te identificas, queres “quantas idas” sem drama nem marketing milagroso.',
      'main_blocker', 'Tratar estimativa como contrato fechado gera atrito quando o corpo responde em ritmo próprio.',
      'consequence', 'Expectativa rígida sem revisão na meia-volta do plano costuma frustrar.',
      'growth_potential', 'Leve o resultado e pergunte como a clínica mede progresso no checkpoint combinado.',
      'dica_rapida', 'Combinar revisão fotográfica ou subjetiva na metade da série costuma ajudar.',
      'cta_text', 'Quero validar frequência e checkpoint na avaliação',
      'whatsapp_prefill', 'Oi! Usei a calculadora de expectativa de sessões; quero avaliação para validar frequência, número inicial e como vocês medem progresso — sem promessa, só alinhamento.'
    )
  ),
  (
    'b1000123-0123-4000-8000-000000000123',
    'PROJECTION_CALCULATOR',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Planeamento de sessões — hora de fechar com profissional',
      'profile_summary', 'A estimativa mostra densidade de idas que você colocou; na prática, pele, técnica e intervalo seguro mudam o que é viável. Na consulta costuma acertar-se série inicial e data de revisão antes de pacote grande.',
      'frase_identificacao', 'Se isso é você, já filtrou hype e quer calendário com critério.',
      'main_blocker', 'Agendar “muitas sessões” sem ordem entre tecnologias pode sobrecarregar a zona.',
      'consequence', 'Pacote longo sem marcos intermediários dificulta ajuste se a resposta for lenta.',
      'growth_potential', 'Peça proposta em duas fases (entrada + intensificação) com explicação escrita.',
      'dica_rapida', 'Pergunte o que não misturar na mesma semana na sua pele.',
      'cta_text', 'Quero consulta para série e revisão',
      'whatsapp_prefill', 'Oi! Calculei sessões até o checkpoint; o perfil saiu moderado. Quero consulta para fechar série inicial, intervalo e revisão com vocês.'
    )
  ),
  (
    'b1000123-0123-4000-8000-000000000123',
    'PROJECTION_CALCULATOR',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Prazo apertado ou muita frequência — calibrar com urgência na clínica',
      'profile_summary', 'A combinação de prazo curto com muitas idas por semana acende o alerta de planeamento. Antes de fechar pacote, avaliação prioritária alinha expectativa realista, recuperação da pele e intervalos seguros.',
      'frase_identificacao', 'Se te revês aqui, queres resultado visível rápido sem sabotar pele ou bolso.',
      'main_blocker', 'Empilhar sessões sem critério aumenta risco de irritação ou frustração.',
      'consequence', 'Investir em série agressiva sem triagem pode gerar arrependimento.',
      'growth_potential', 'Peça encaixe prioritário e diga evento ou prazo mental — para calibrar honestamente.',
      'dica_rapida', 'Evite fechar pacote fechado online antes da primeira consulta presencial.',
      'cta_text', 'Quero avaliação prioritária — sessões e protocolo',
      'whatsapp_prefill', 'Oi! A calculadora de expectativa de sessões saiu com ritmo intenso; quero avaliação prioritária para calibrar série segura, intervalos e expectativa com a profissional.'
    )
  );
