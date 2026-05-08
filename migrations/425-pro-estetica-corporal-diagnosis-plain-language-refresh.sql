-- Pro Estética Corporal — refresh de copy (linguagem leiga; diagnóstico útil antes do convite).
-- Substitui pacotes corporais das migrações 401–405. Idempotente: DELETE + INSERT.
-- Limpa `ylada_diagnosis_cache` destes `template_id` para não servir texto antigo (v28).
-- @see src/config/ylada-diagnosis-result-standard.ts

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE diagnosis_vertical = 'corporal'
  AND (
    (
      architecture = 'RISK_DIAGNOSIS'
      AND template_id = ANY (
        ARRAY[
          'b1000121-0121-4000-8000-000000000121'::uuid,
          'b1000122-0122-4000-8000-000000000122'::uuid,
          'b1000124-0124-4000-8000-000000000124'::uuid,
          'b1000125-0125-4000-8000-000000000125'::uuid,
          'b1000126-0126-4000-8000-000000000126'::uuid,
          'b1000142-0142-4000-8000-000000000142'::uuid,
          'b1000143-0143-4000-8000-000000000143'::uuid,
          'b1000144-0144-4000-8000-000000000144'::uuid,
          'b1000145-0145-4000-8000-000000000145'::uuid,
          'b1000146-0146-4000-8000-000000000146'::uuid,
          'b1000147-0147-4000-8000-000000000147'::uuid,
          'b1000148-0148-4000-8000-000000000148'::uuid,
          'b1000149-0149-4000-8000-000000000149'::uuid,
          'b1000150-0150-4000-8000-000000000150'::uuid,
          'b1000151-0151-4000-8000-000000000151'::uuid,
          'b1000119-0119-4000-8000-000000000119'::uuid,
          'b1000120-0120-4000-8000-000000000120'::uuid,
          'b1000127-0127-4000-8000-000000000127'::uuid,
          'b1000038-0038-4000-8000-000000000038'::uuid,
          'b1000044-0044-4000-8000-000000000044'::uuid,
          'b1000046-0046-4000-8000-000000000046'::uuid,
          'b1000048-0048-4000-8000-000000000048'::uuid,
          'b1000050-0050-4000-8000-000000000050'::uuid
        ]
      )
    )
    OR (
      architecture = 'PROJECTION_CALCULATOR'
      AND template_id = ANY (
        ARRAY[
          'b1000025-0025-4000-8000-000000000025'::uuid,
          'b1000026-0026-4000-8000-000000000026'::uuid,
          'b1000027-0027-4000-8000-000000000027'::uuid,
          'b1000028-0028-4000-8000-000000000028'::uuid,
          'b1000031-0031-4000-8000-000000000031'::uuid,
          'b1000123-0123-4000-8000-000000000123'::uuid
        ]
      )
    )
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
(
    'b1000121-0121-4000-8000-000000000121',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Prioridade suave: drenagem, modeladora ou tecnologia — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há dúvida saudável sobre por onde começar, sem urgência extrema. É um bom momento para alinhar sensação, objetivo e orçamento com a profissional antes de escolher procedimento.',
      'frase_identificacao', 'Se você se identificou, provavelmente quer clareza sem “empurrar” três frentes ao mesmo tempo.',
      'main_blocker', 'O que segura é ordem: sem critério, vira tentativa solta de soluções que não conversam entre si.',
      'consequence', 'Sem um primeiro passo definido, o corpo continua na mesma sensação enquanto a decisão fica postergada.',
      'growth_potential', 'Na avaliação, a profissional costuma traduzir o que você sente em sequência segura (ex.: preparar tecido, depois firmar, depois contorno) — sempre dentro do que faz sentido para o seu caso.',
      'dica_rapida', 'Leve uma meta única para a conversa (ex.: menos retenção, mais firmeza ou textura) — foco acelera o plano.',
      'cta_text', 'Quero entender por onde começar no meu caso',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre drenagem, modeladora ou tecnologia. O resultado saiu exploratório — quero marcar um horário para definir ordem e próximos passos com vocês.'
    )
  ),
  (
    'b1000121-0121-4000-8000-000000000121',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Indecisão que já pesa no dia a dia — faz sentido ter uma leitura clara',
      'profile_summary', 'As respostas mostram que a dúvida entre abordagens já pesa no espelho, na roupa ou na confiança. Uma conversa guiada costuma trazer clareza sobre por onde começar — sem empilhar tudo de uma vez.',
      'frase_identificacao', 'Se isso combina com você, já tentou “um pouco de tudo” sem sentir continuidade.',
      'main_blocker', 'O que cansa é a oscilação: melhora um pouco e a sensação volta, porque falta uma linha que una rotina, descanso e o que você faz no corpo.',
      'consequence', 'Continuar sem prioridade tende a misturar tecnologias e hábitos que se anulam ou sobrecarregam a pele.',
      'growth_potential', 'Use o resultado para pedir uma conversa que una objetivo, região e sensibilidade — e só depois pensar em frequência ou combinações, com calma.',
      'dica_rapida', 'Antes de assumir muitos compromissos de uma vez, alinhar a sequência costuma importar mais que “volume” de coisas diferentes.',
      'cta_text', 'Quero avaliação para definir sequência e frequência',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre prioridade no corpo (drenagem/modeladora/tecnologia). O resultado mostra que preciso de clareza na sequência — podemos marcar um horário para conversar?'
    )
  ),
  (
    'b1000121-0121-4000-8000-000000000121',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Decisão corporal pedindo clareza rápida — evite improviso',
      'profile_summary', 'Pelas respostas, há intensidade na busca por mudança ou alívio. O melhor próximo passo é conversa objetiva com a profissional para calibrar expectativa, contraindicações e ritmo seguro',
      'frase_identificacao', 'Se você se reconhece aqui, sente que “qualquer coisa” menos conversa estruturada é tempo perdido.',
      'main_blocker', 'Urgência sem método aumenta risco de combinar procedimentos ou intervalos inadequados.',
      'consequence', 'Postergar avaliação mantém incerteza e pode prolongar o incômodo que já te motivou a responder o questionário.',
      'growth_potential', 'Peça prioridade na agenda para primeira avaliação e leve lista curta do que já tentou nos últimos meses.',
      'dica_rapida', 'Honestidade sobre saúde, gestação ou medicações protege o plano — traga isso na mensagem ou na consulta.',
      'cta_text', 'Preciso de avaliação com prioridade',
      'whatsapp_prefill', 'Oi! Fiz o questionário de prioridade no corpo e o resultado saiu urgente. Quero agendar avaliação o quanto antes para não improvisar com procedimentos.'
    )
  ),

  (
    'b1000122-0122-4000-8000-000000000122',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Dúvida entre tecnologias — ainda em modo pesquisa',
      'profile_summary', 'Pelas respostas, você está comparando opções (criolipo, radiofrequência, cavitação, endermologia, etc.) sem pressão extrema. Ótimo: na avaliação a profissional cruza objetivo com seu tipo de tecido e rotina.',
      'frase_identificacao', 'Se te identificas, queres “o que faz sentido” mais que moda de feed.',
      'main_blocker', 'Informação solta na internet raramente considera sua região, sensibilidade e continuidade possível.',
      'consequence', 'Escolher só pelo nome do aparelho pode gerar expectativa desalinhada com o que o corpo responde em sessões reais.',
      'growth_potential', 'Leve para o WhatsApp o que mais quer mudar (uma zona, sensação ou objetivo) — acelera a triagem na clínica.',
      'dica_rapida', 'Anote dúvidas sobre intervalo entre sessões e cuidados em casa — evita mal-entendidos.',
      'cta_text', 'Quero ajuda para escolher tecnologia com critério',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre qual tecnologia corporal faz mais sentido. O resultado está exploratório — quero avaliação para cruzar objetivo com a opção adequada.'
    )
  ),
  (
    'b1000122-0122-4000-8000-000000000122',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Escolha de tecnologia influenciando autoestima ou rotina',
      'profile_summary', 'As respostas indicam que a decisão não é só técnica — afeta como você se sente no corpo no dia a dia. Ter uma leitura profissional costuma reduzir ansiedade e a “comparação mental” entre procedimentos.',
      'frase_identificacao', 'Se isso é você, já gastou energia mental demais sem critério clínico de encaixe.',
      'main_blocker', 'Sem critério, o risco é trocar de estratégia antes do corpo ter tempo de responder ao que já foi feito.',
      'consequence', 'Oscilar entre métodos tende a fragmentar resultado e cansa.',
      'growth_potential', 'Na avaliação, peça explicação sobre por que uma tecnologia entra antes da outra no seu caso — e prazo realista.',
      'dica_rapida', 'Uma tecnologia forte mal indicada pode frustrar mais que uma sequência moderada bem montada.',
      'cta_text', 'Quero avaliação para decidir tecnologia e ritmo',
      'whatsapp_prefill', 'Oi! Fiz o questionário de tecnologia corporal. O resultado mostra que preciso decidir com orientação profissional e prazos realistas — podemos marcar avaliação?'
    )
  ),
  (
    'b1000122-0122-4000-8000-000000000122',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Necessidade forte de definir tecnologia — priorize uma conversa presencial ou por vídeo',
      'profile_summary', 'Pelas respostas, há combinação de objetivo corporal claro e pressão de tempo. Passo crítico: não fechar tratamento só por mensagem — marcar avaliação presencial ou vídeo conforme a clínica para alinhar segurança',
      'frase_identificacao', 'Se você se vê aqui, não quer mais adiar a decisão informada.',
      'main_blocker', 'Decidir sob estresse sem avaliação aumenta chance de expectativa ou sequência inadequadas.',
      'consequence', 'Adiar conversa estruturada prolonga o vai-e-volta entre opções.',
      'growth_potential', 'Solicite horário prioritário e diga seu objetivo e prazo na primeira mensagem — ajuda a clínica a responder com clareza.',
      'dica_rapida', 'Tratamento sério combina intervalos e preparação da pele; promessa de “sessão única milagrosa” costuma ser narrativa arriscada.',
      'cta_text', 'Quero agendar avaliação com urgência',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre tecnologia corporal; o resultado indica que preciso definir próximos passos com segurança. Quero avaliação prioritária — qual o próximo horário?'
    )
  ),

  (
    'b1000124-0124-4000-8000-000000000124',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Muitas frentes ao mesmo tempo — ainda dá para simplificar antes de empilhar',
      'profile_summary', 'Pelas respostas, existe tendência a querer resolver tudo junto, mas com margem para organizar. Camadas bem ordenadas costumam responder bem — uma frente estável, depois a próxima.',
      'frase_identificacao', 'Se te identificas, sente que “falta síntese” entre tantos passos possíveis.',
      'main_blocker', 'Empilhar etapas sem ordem cansa você e pode confundir leitura de resultado.',
      'consequence', 'Sem síntese, fica difícil saber o que realmente está funcionando.',
      'growth_potential', 'Na avaliação, peça uma organização em fases com marcos simples (ex.: 30 / 60 dias) — sem promessa de milagre.',
      'dica_rapida', 'Menos intervenções bem espaçadas costumam vencer agenda lotada de procedimentos aleatórios.',
      'cta_text', 'Quero organizar por fases na avaliação',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre camadas de cuidado no corpo. O resultado sugere organizar frentes em sequência — quero avaliação para montar isso em fases.'
    )
  ),
  (
    'b1000124-0124-4000-8000-000000000124',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Corpo pedindo método — risco de sobrecarga de camadas',
      'profile_summary', 'As respostas mostram que a soma de objetivos ou tratamentos pode estar pesando. Profissional costuma cortar ruído e definir o que fica, o que espera e o que não combina no mesmo ciclo.',
      'frase_identificacao', 'Se isso é familiar, você já sentiu piora ou estagnação quando “exagerou no pacote”.',
      'main_blocker', 'Sobrecarga reduz adesão e às vezes irrita tecido — menos pode ser mais quando bem direcionado.',
      'consequence', 'Manter tudo em paralelo tende a confundir causa de melhora ou piora.',
      'growth_potential', 'Use o resultado para pedir priorização: uma meta principal por período + suporte em casa coerente.',
      'dica_rapida', 'Leve lista do que já faz (clínica + casa) nos últimos 45 dias.',
      'cta_text', 'Quero priorizar camadas com a profissional',
      'whatsapp_prefill', 'Oi! Fiz o questionário de protocolo em camadas. O resultado indica sobrecarga ou falta de método — quero avaliação para priorizar o que manter e o que pausar.'
    )
  ),
  (
    'b1000124-0124-4000-8000-000000000124',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Hora de parar e reorganizar — evite mais uma rodada de tentativa e erro',
      'profile_summary', 'Pelas respostas, há intensidade na sensação de que o protocolo precisa ser desenhado de novo. Avaliação rápida ajuda a parar o ciclo de camadas conflitantes.',
      'frase_identificacao', 'Se você se revê aqui, sente que o corpo “não aguenta mais ruído”.',
      'main_blocker', 'Continuar sem decisão centralizada mantém irritação, tempo perdido e frustração.',
      'consequence', 'Sem pausa e reordenação, o desgaste emocional com o próprio corpo aumenta.',
      'growth_potential', 'Peça avaliação e diga claramente o que piorou ou estagnou — isso orienta desmontar o que não serve.',
      'cta_text', 'Quero reavaliar o que estou fazendo no corpo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre camadas do protocolo; preciso reavaliar com urgência o que estou fazendo em clínica e em casa — podemos agendar?'
    )
  ),

  (
    'b1000125-0125-4000-8000-000000000125',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Agenda de sessões: pequenos ajustes de intervalo já ajudam',
      'profile_summary', 'Pelas respostas, a dúvida é mais sobre ritmo (muito perto, muito longe, mistura de técnicas) do que crise. Ótimo ponto para alinhar com a profissional antes de mudar tudo.',
      'frase_identificacao', 'Se te identificas, quer resultado sem sacrificar recuperação.',
      'main_blocker', 'Intervalo inadequado pode tanto “apagar” efeito quanto sensibilizar demais.',
      'consequence', 'Sem calendário coerente, a sensação de progresso fica irregular.',
      'growth_potential', 'Na mensagem, diga quantas sessões fez no último mês e o que sentiu entre elas — facilita ajuste fino.',
      'dica_rapida', 'Recuperação de tecido importa tanto quanto a sessão em si.',
      'cta_text', 'Quero alinhar intervalo e frequência',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre agenda de sessões corporais. O resultado sugere ajuste de ritmo — quero conversar para alinhar intervalo e frequência com segurança.'
    )
  ),
  (
    'b1000125-0125-4000-8000-000000000125',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Cronograma corporal influenciando resultado — revise com calendário em mãos',
      'profile_summary', 'As respostas indicam que sessões muito agrupadas ou espaçadas demais podem estar sabotando o que você busca. Profissional costuma ajustar frequência com base em técnica e resposta da pele.',
      'frase_identificacao', 'Se isso é você, já notou resultado “oscilando” sem motivo claro.',
      'main_blocker', 'Agenda improvisada fragmenta efeito cumulativo dos tratamentos.',
      'consequence', 'Persistir sem ajuste tende a gerar achismo (“não funciona”) quando o problema é ritmo.',
      'growth_potential', 'Marque avaliação de continuidade: traga app de agenda ou lista de datas das últimas sessões.',
      'dica_rapida', 'Combinar procedimentos potentes no mesmo dia nem sempre é vantagem — confirme na clínica.',
      'cta_text', 'Quero revisão de cronograma na avaliação',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre agenda de sessões. O resultado aponta que o ritmo pode estar a interferir no resultado — quero revisar cronograma na avaliação.'
    )
  ),
  (
    'b1000125-0125-4000-8000-000000000125',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Agenda corporal em tensão — pare e reorganize com profissional',
      'profile_summary', 'Pelas respostas, há sinal de sobrecarga ou frustração com sequência de sessões. Antes de mais um agendamento, vale avaliação para proteger tecido e expectativa',
      'frase_identificacao', 'Se você se reconhece, sente cansaço ou irritação relacionada ao ritmo de tratamento.',
      'main_blocker', 'Continuar no automático aumenta risco de sensibilização ou resultado abaixo do esperado.',
      'consequence', 'Sem pausa estratégica, o corpo pode não responder como antes.',
      'growth_potential', 'Peça avaliação prioritária e descreva sintomas entre sessões (ardor, hematomas, dor, peso).',
      'cta_text', 'Preciso reavaliar frequência e combinações',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre agenda de sessões; o resultado saiu forte em tensão com o ritmo. Preciso reavaliar frequência e combinações — há urgência para encaixe?'
    )
  ),

  (
    'b1000126-0126-4000-8000-000000000126',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Inchaço ou “corpo pesado”: hábitos e cuidados ainda dá para alinhar com calma',
      'profile_summary', 'Pelas respostas, a sensação de retenção ou peso aparece, mas com espaço para ajuste progressivo de rotina e protocolo. Avaliação ajuda a separar o que é hábito do que pede tratamento.',
      'frase_identificacao', 'Se te identificas, suspeita que sono, sal ou pouca movimentação entram na conta.',
      'main_blocker', 'Confundir só “retenção estética” com outros fatores sem conversa costuma atrasar solução.',
      'consequence', 'Pequenos desvios de hábito podem manter a sensação mesmo com boa vontade no tratamento.',
      'growth_potential', 'Leve para a profissional um resumo de hidratação, sono e dias mais inchados da semana.',
      'dica_rapida', 'Monitor simples (ex.: sensação matinal vs. noite) já melhora diagnóstico de rotina na consulta.',
      'cta_text', 'Quero alinhar hábitos e o que faço no corpo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre inchaço e sensação de corpo pesado. O resultado está no tom leve — quero avaliação para alinhar hábitos com o que vocês indicarem.'
    )
  ),
  (
    'b1000126-0126-4000-8000-000000000126',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Retenção e rotina parecem entrelaçados — método importa',
      'profile_summary', 'As respostas sugerem que hábitos e tratamento precisam conversar: drenagem ou tecnologia entram melhor quando sono, líquidos e movimento não trabalham contra.',
      'frase_identificacao', 'Se isso é você, já tentou procedimento sem mexer no que mantém o inchaço.',
      'main_blocker', 'Só contar com a clínica, sem ajustar o que você faz em casa, costuma manter a mesma sensação voltando.',
      'consequence', 'Sem integração, a sensação de peso volta no mesmo ciclo semanal.',
      'growth_potential', 'Peça uma proposta que una duas frentes: o que faz sentido na clínica + ajustes realistas em casa — sem culpa, com critério.',
      'dica_rapida', 'Um eixo por vez (ex.: hidratação estável) já muda leitura do inchaço em poucas semanas.',
      'cta_text', 'Quero ver como unir hábito e tratamento',
      'whatsapp_prefill', 'Oi! Fiz o questionário inchaço e hábitos. O resultado indica que preciso integrar rotina com cuidado profissional — quero marcar avaliação para montar isso com vocês.'
    )
  ),
  (
    'b1000126-0126-4000-8000-000000000126',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Sensação de peso ou inchaço com impacto alto — avalie com prioridade',
      'profile_summary', 'Pelas respostas, o desconforto parece frequente ou limitante. Vale avaliação para orientar protocolo e, quando necessário, encaminhar o que não é só estética — sem alarmismo, com critério profissional',
      'frase_identificacao', 'Se você se vê aqui, o corpo já está pedindo escuta ativa.',
      'main_blocker', 'Postergar pode manter sintoma que soma com sono, circulação e autoconfiança.',
      'consequence', 'Sem direcionamento, tende a aumentar tentativas improvisadas em casa.',
      'growth_potential', 'Marque avaliação e mencione se há dor forte, vermelhidão persistente ou piora rápida — a clínica orienta o canal certo.',
      'cta_text', 'Quero avaliação prioritária para inchaço e sensação de peso',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre inchaço e sensação de peso corporal; o resultado saiu com prioridade alta. Quero avaliação o quanto antes para protocolo e orientação segura.'
    )
  ),
-- b1000142 — drenagem / pernas pesadas
  (
    'b1000142-0142-4000-8000-000000000142',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Pernas pesadas ou sensação de inchaço — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há incómodo leve ou episódico. Drenagem e hábitos podem ajudar, mas a decisão de indicação e ritmo fica na avaliação com a profissional.',
      'frase_identificacao', 'Se você se identificou, provavelmente quer perceber se drenagem faz sentido antes de decidir qualquer pacote.',
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
      'main_blocker', 'Tratamentos só na clínica, sem olhar sono, líquidos e rotina, costumam dar alívio que não se mantém.',
      'consequence', 'Sem plano, tende a repetir o ciclo de alívio pontual e volta da mesma sensação.',
      'growth_potential', 'Marque avaliação e leve resumo de rotina (trabalho em pé, treino, viagens) para a profissional encaixar frequência.',
      'dica_rapida', 'Às vezes menos idas, mas com direção clara, ajudam mais do que muitas idas sem norte.',
      'cta_text', 'Quero entender drenagem e hábitos na consulta',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre drenagem e pernas pesadas; o perfil saiu moderado. Quero avaliação para combinar drenagem, ritmo e o que fazer em casa no dia a dia.'
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
      'main_blocker', 'Escolher só por preço, sem alinhar técnica e frequência, costuma gerar desalinhamento.',
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
      'cta_text', 'Quero consulta para decidir com critério',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre massagem modeladora; o perfil saiu moderado. Quero consulta para definir técnica e frequência com critério profissional.'
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
      'profile_summary', 'Pelas respostas, há urgência em tratar zona específica. Antes de assumir muitos compromissos de uma vez, avaliação prioritária define candidatura real, série e cuidados — protege expectativa e segurança.',
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
  ),
-- b1000119 — prontidão / travas para investir no corpo
  (
    'b1000119-0119-4000-8000-000000000119',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Entre travas e curiosidade — ainda tempo de organizar com calma',
      'profile_summary', 'Pelas respostas, há hesitação (tempo, investimento, medo ou prioridade baixa) sem pressão extrema. Um bom passo é conversa inicial com a profissional para traduzir intenção em um começo mínimo viável, sem assumir um pacote longo de imediato.',
      'frase_identificacao', 'Se você se identificou, quer clareza sem sentir que está “atrasando” a vida.',
      'main_blocker', 'Decidir sozinha(o) entre mil opções de feed aumenta paralisia — a consulta ancora realismo.',
      'consequence', 'Adiar a conversa mantém a sensação de estar sempre no mesmo lugar em relação ao corpo.',
      'growth_potential', 'Use o resultado para pedir avaliação focada em uma vitória pequena nas próximas semanas.',
      'dica_rapida', 'Leve uma frase: o que mais segura hoje (tempo, preço ou medo) — acelera a primeira consulta.',
      'cta_text', 'Quero conversar sobre meu próximo passo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre o que me impede de investir no corpo. O resultado saiu exploratório — quero marcar uma avaliação para alinhar expectativa e um começo suave com vocês.'
    )
  ),
  (
    'b1000119-0119-4000-8000-000000000119',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Prontidão em construção — faz sentido definir prioridade com a profissional',
      'profile_summary', 'As respostas indicam interesse real, mas ainda há variáveis (rotina, experiências anteriores ou expectativa de prazo). Na consulta costuma ajudar comparar duas rotas (mais suave vs mais direcionada) e fechar frequência que você consiga manter.',
      'frase_identificacao', 'Se isso combina com você, já pesquisou bastante e quer decisão sem empurrão genérico.',
      'main_blocker', 'Assumir muitos compromissos antes de alinhar uma meta visível em 4–8 semanas costuma gerar desalinhamento depois.',
      'consequence', 'Continuar só na cabeça prolonga ansiedade e compras por impulso.',
      'growth_potential', 'Marque avaliação com este resultado como roteiro de perguntas — reduz ruído na conversa.',
      'dica_rapida', 'Peça critérios de melhora (sensação, medidas ou fotos padronizadas) antes de assinar série grande.',
      'cta_text', 'Quero avaliação para definir prioridade e frequência',
      'whatsapp_prefill', 'Oi! Fiz o questionário de prontidão para cuidar do corpo; o perfil saiu moderado. Quero consulta para alinhar prioridade, expectativa de prazo e frequência realista com a equipe.'
    )
  ),
  (
    'b1000119-0119-4000-8000-000000000119',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Intenção forte — traduzir em plano seguro, já',
      'profile_summary', 'Pelas respostas, há urgência e prioridade alta nos próximos dias ou semanas. O caminho responsável é avaliação objetiva: cronograma em fases, o que não misturar no mesmo dia se houver tecnologia, e expectativa honesta sobre prazo.',
      'frase_identificacao', 'Se você se reconhece aqui, quer “como” com método, não mais uma semana só pesquisando.',
      'main_blocker', 'Correr sessões sem triagem aumenta risco de combinação ou intervalo inadequados.',
      'consequence', 'Improviso prolonga frustração mesmo com boa vontade.',
      'growth_potential', 'Peça encaixe prioritário e mencione evento ou prazo mental — a profissional calibra o plano com honestidade.',
      'dica_rapida', 'Liste o que já tentou nos últimos meses — evita repetir o mesmo caminho sem critério.',
      'cta_text', 'Quero avaliação prioritária — cuidados no corpo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre travas e prioridade no corpo; o resultado saiu urgente. Quero avaliação o quanto antes para plano em fases, frequência e expectativa alinhada com a realidade do meu caso.'
    )
  ),

  -- b1000120 — mapa de zonas / foco corporal
  (
    'b1000120-0120-4000-8000-000000000120',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Mapa do corpo ainda aberto — boa hora para conversa guiada',
      'profile_summary', 'Pelas respostas, a prioridade de zonas ou tipo de incómodo ainda se mistura um pouco — comum no início. A avaliação presencial ajuda a nomear foco, sensibilidade da pele e o que é massagem, hábito ou tecnologia.',
      'frase_identificacao', 'Se te identificas, queres direção sem prometer três frentes ao mesmo tempo.',
      'main_blocker', 'Comparar com fotos alheias ou fechar zona errada atrasa protocolo certo para você.',
      'consequence', 'Sem foco, cada tratamento parece “meio resultado”.',
      'growth_potential', 'Leve este resultado anotando a área que marcou e há quanto tempo incomoda.',
      'dica_rapida', 'Uma vitória pequena (ex.: menos inchaço ou uma região primeiro) costuma destravar o resto.',
      'cta_text', 'Quero avaliação com base no meu mapa de zonas',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre zonas do corpo que mais incomodam. O resultado saiu no tom de primeiro mapeamento — quero marcar avaliação para priorizar foco e próximo passo com vocês.'
    )
  ),
  (
    'b1000120-0120-4000-8000-000000000120',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Foco definindo-se — cruzar zona, sensação e protocolo',
      'profile_summary', 'As respostas mostram direção razoável (zona + tipo de incómodo) mesmo que não seja única. Na consulta costuma funcionar combinar sequência segura e revisão em algumas semanas, em vez de espalhar por todo o corpo de uma vez.',
      'frase_identificacao', 'Se isso é você, já sabe mais ou menos onde quer atuar e quer critério profissional.',
      'main_blocker', 'Tratar várias áreas sem fases costuma dispersar investimento e atenção.',
      'consequence', 'Expectativa diluída em “full body” genérico tende a frustrar.',
      'growth_potential', 'Use o texto do resultado como lista de prioridades ao agendar — ganha tempo na conversa.',
      'dica_rapida', 'Comente treino ou mudança de peso recente — muda indicação de firmeza, textura ou contorno.',
      'cta_text', 'Quero consulta para plano em fases nas zonas certas',
      'whatsapp_prefill', 'Oi! Fiz o questionário do mapa de zonas corporais; o perfil saiu moderado. Quero avaliação para plano em fases, ordem de protocolo e revisão nas próximas semanas.'
    )
  ),
  (
    'b1000120-0120-4000-8000-000000000120',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Muitas frentes ou incómodo antigo — priorizar com a esteticista',
      'profile_summary', 'Pelas respostas, há várias zonas ou incómodo de longa data, misturando aparência e sensação. Avaliação prioritária ajuda a escolher uma frente inicial segura e calendarizar o resto, sem sobrecarga.',
      'frase_identificacao', 'Se te revês aqui, o corpo já pede ação estruturada, não mais experimentos soltos.',
      'main_blocker', 'Empilhar procedimentos sem ordem clara aumenta cansaço e custo com retorno confuso.',
      'consequence', 'Continuar sem prioridade máxima prolonga insatisfação com espelho ou roupa.',
      'growth_potential', 'Peça encaixe prioritário e leve lista do que já fez na região — evita repetir erro.',
      'dica_rapida', 'Fotos na mesma luz/postura ajudam a medir evolução — pergunte política da clínica.',
      'cta_text', 'Quero avaliação prioritária — mapa corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre zonas do corpo; o resultado saiu urgente (várias frentes ou incómodo há tempo). Quero avaliação prioritária para definir prioridade máxima e plano em fases com segurança.'
    )
  ),

  -- b1000127 — perfil de massagem (relax / drenagem / modeladora / combinação)
  (
    'b1000127-0127-4000-8000-000000000127',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Tipo de massagem a descobrir — começo suave faz sentido',
      'profile_summary', 'Pelas respostas, você está no início ou prefere ritmo devagar. A consulta ou primeira sessão costuma mapear pressão ideal e se o foco é relaxamento, circulação ou trabalho local — sempre com linguagem realista.',
      'frase_identificacao', 'Se te identificas, queres bem-estar sem pressão de “resultado já”.',
      'main_blocker', 'Escolher técnica só pelo nome, sem avaliar sensação e rotina, gera expectativa torta.',
      'consequence', 'Adiar a conversa mantém dúvida entre drenagem, modeladora ou relaxante.',
      'growth_potential', 'Guarde o resultado e mencione preferência de pressão ao marcar — personaliza a primeira ida.',
      'dica_rapida', 'Uma ida a cada duas semanas já pode ser plano mínimo viável — confirme com a profissional.',
      'cta_text', 'Quero alinhar tipo de massagem na avaliação',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre que massagem faz sentido para o meu corpo. O resultado saiu exploratório — quero marcar avaliação ou primeira sessão para alinhar técnica e pressão com vocês.'
    )
  ),
  (
    'b1000127-0127-4000-8000-000000000127',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Perfil de massagem a emergir — personalizar na consulta',
      'profile_summary', 'As respostas apontam objetivo dominante (leveza, tensão, zona local ou combinação leve) com frequência possível na sua rotina. Na avaliação costuma fechar-se linha principal — drenagem, modeladora ou relaxamento profundo — e cadência inicial.',
      'frase_identificacao', 'Se isso é você, já sente o corpo pedindo método, não só “uma massagem qualquer”.',
      'main_blocker', 'Sessões irregulares sem alvo costumam dar sensação de estagnação.',
      'consequence', 'Trocar de técnica a cada mês sem critério confunde o que realmente responde.',
      'growth_potential', 'Peça quantas sessões iniciais antes do primeiro balanço e o que fazer em casa entre uma e outra.',
      'dica_rapida', 'Sono e hidratação conversam com resultado de drenagem ou modeladora — comente hábitos.',
      'cta_text', 'Quero consulta para fechar linha de massagem e frequência',
      'whatsapp_prefill', 'Oi! Fiz o questionário de perfil de massagem corporal; o perfil saiu moderado. Quero consulta para definir técnica principal, pressão e frequência que eu consiga manter.'
    )
  ),
  (
    'b1000127-0127-4000-8000-000000000127',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Plano em camadas ou otimização — encaixe prioritário',
      'profile_summary', 'Pelas respostas, há foco em zona, ritmo de idas possível e abertura para combinar abordagens. Avaliação prioritária define ordem (sensação e circulação vs. contorno, por exemplo) e o que não misturar no mesmo dia sem critério profissional.',
      'frase_identificacao', 'Se te revês aqui, queres calendário claro, não empilhar tudo à cegas.',
      'main_blocker', 'Tecnologia e mãos no mesmo período sem plano aumentam sobrecarga e confusão de resultado.',
      'consequence', 'Investimento alto sem cronograma costuma virar frustração.',
      'growth_potential', 'Envie o resultado à clínica e peça proposta semanal-tipo alinhada ao que marcou no questionário.',
      'dica_rapida', 'Liste medicamentos ou gestação — segurança de indicação passa por isso na primeira conversa.',
      'cta_text', 'Quero avaliação prioritária — massagem e protocolo',
      'whatsapp_prefill', 'Oi! Fiz o questionário de perfil de massagem e combinações; o resultado saiu urgente. Quero avaliação prioritária para cronograma, ordem de técnicas e o que combinar com segurança na minha rotina.'
    )
  ),
-- b1000038 — retenção / sensação de inchaço
  (
    'b1000038-0038-4000-8000-000000000038',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Retenção ou inchaço no radar — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou episódicos de retenção ou peso no corpo. Hábitos e drenagem podem ajudar, mas a indicação e o ritmo seguro ficam na avaliação com a profissional — sem confundir estética com outras causas de inchaço.',
      'frase_identificacao', 'Se você se identificou, quer entender melhor o que o corpo está sinalizando antes de decidir qualquer coisa.',
      'main_blocker', 'Internet mistura diurético, dieta radical e massagem — sem critério isso atrasa o passo certo.',
      'consequence', 'Adiar conversa estruturada mantém a sensação a oscilar sem norte.',
      'growth_potential', 'Use o resultado para pedir avaliação e descrever quando o inchaço piora (manhã, fim do dia, viagens).',
      'dica_rapida', 'Anotar sal, álcool, sono e tempo em pé nos dias piores já enriquece a primeira consulta.',
      'cta_text', 'Quero tirar dúvidas sobre essa sensação de inchaço',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre retenção ou inchaço. O resultado saiu exploratório — quero marcar um horário para conversar e entender o que faz sentido no meu caso.'
    )
  ),
  (
    'b1000038-0038-4000-8000-000000000038',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Inchaço que volta com frequência — faz sentido olhar rotina e corpo com calma',
      'profile_summary', 'As respostas sugerem que a sensação de peso ou retenção já aparece com regularidade. Na consulta cruzam-se rotina, sensação nas pernas ou abdômen e se drenagem, hábito ou outra abordagem entram primeiro — sempre com linguagem realista.',
      'frase_identificacao', 'Se isso combina com você, o dia a dia ou o espelho já pedem continuidade, não só “uma sessão”.',
      'main_blocker', 'Só ir à clínica de vez em quando, sem encaixar sono, líquidos e rotina, costuma deixar o inchaço voltando ao mesmo padrão.',
      'consequence', 'Sem uma linha que una rotina e orientação profissional, tende a repetir alívio pontual e a mesma sensação volta.',
      'growth_potential', 'Marque avaliação e leve resumo de trabalho em pé, treino e viagens recentes.',
      'dica_rapida', 'Às vezes menos idas à clínica, mas com uma linha clara, ajudam mais do que muitas idas sem norte.',
      'cta_text', 'Quero entender meu inchaço e próximos passos',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre retenção; o perfil saiu moderado. Quero conversar com vocês para entender o que combina com meu caso e como encaixar rotina e cuidados.'
    )
  ),
  (
    'b1000038-0038-4000-8000-000000000038',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Inchaço ou peso intenso — priorize avaliação orientada',
      'profile_summary', 'Pelas respostas, o incômodo parece forte ou muito frequente. Uma conversa presencial ajuda a alinhar cuidados seguros e, quando necessário, o encaminhamento correto se algo não for só “retenção estética”.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de escuta ativa e próximos passos claros, não improviso.',
      'main_blocker', 'Postergar triagem mantém desconforto e tentativas soltas.',
      'consequence', 'Sem critério profissional, aumenta frustração e expectativa irreala sobre uma única técnica.',
      'growth_potential', 'Peça horário prioritário e mencione dor aguda, vermelhidão persistente ou piora rápida, se houver.',
      'dica_rapida', 'Evite diurético ou massagem agressiva sem orientação até a consulta.',
      'cta_text', 'Preciso de avaliação o quanto antes',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre retenção/inchaço; o resultado saiu urgente. Quero avaliação prioritária para orientação segura e próximos passos com vocês.'
    )
  ),

  -- b1000044 — rotina de cuidados (pele do corpo / preparação para protocolo)
  (
    'b1000044-0044-4000-8000-000000000044',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Cuidados com a pele do corpo — explorar antes de intensificar tratamentos',
      'profile_summary', 'Pelas respostas, há espaço para alinhar limpeza, hidratação e proteção das áreas que entram em tratamento corporal. Isso costuma apoiar resposta a massagem ou tecnologia — a combinação exata sai na avaliação.',
      'frase_identificacao', 'Se te identificas, queres base simples antes de subir intensidade de procedimentos.',
      'main_blocker', 'Produto ou rotina genérica sem critério de zona tratada limita conforto e resultado.',
      'consequence', 'Continuar aleatorio pode irritar pele ou diminuir aderência ao plano.',
      'growth_potential', 'Leve fotos de embalagens ou rotina atual — acelera orientação na consulta.',
      'dica_rapida', 'Pergunte na clínica o que pausar (ácidos, depilação) antes de sessões mais fortes.',
      'cta_text', 'Quero alinhar rotina com os cuidados no corpo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre cuidados com a pele e rotina. O resultado saiu exploratório — quero consulta para alinhar o que usar no corpo com o protocolo de vocês.'
    )
  ),
  (
    'b1000044-0044-4000-8000-000000000044',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Rotina e cuidados no corpo — faz sentido cruzar tudo com calma',
      'profile_summary', 'As respostas indicam que há incómodo ou lacunas claras na rotina enquanto você investe em corpo. Na consulta costuma fechar-se ordem: preparar pele, estimular, recuperar — sem empilhar tudo no mesmo dia sem critério.',
      'frase_identificacao', 'Se isso é você, já notou que procedimento sem base de cuidados custa mais caro em conforto.',
      'main_blocker', 'Muitos produtos ou trocas constantes confundem o que realmente responde.',
      'consequence', 'Sem ajuste, o protocolo parece “parado” mesmo com esforço.',
      'growth_potential', 'Peça checklist mínimo (limpeza, hidratação, proteção solar nas áreas expostas) para 14 dias.',
      'dica_rapida', 'Menos itens, melhor constância — valide com a profissional antes de comprar mais.',
      'cta_text', 'Quero consulta para rotina e cuidados no corpo',
      'whatsapp_prefill', 'Oi! Fiz o questionário de cuidados com a pele; o perfil saiu moderado. Quero avaliação para combinar rotina em casa com o que vocês indicarem, de forma segura.'
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
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre cuidados com a pele; preciso avaliação prioritária para alinhar rotina com os cuidados indicados sem irritar mais a pele.'
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
      'cta_text', 'Quero consulta para entender textura e celulite no meu caso',
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
      'cta_text', 'Quero alinhar hidratação com meus cuidados no corpo',
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
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre hidratação; o resultado saiu urgente. Quero avaliação prioritária para estabilizar a pele e só então retomar cuidados com segurança.'
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
      'frase_identificacao', 'Se te identificas, queres confirmar estágio antes de assumir muitos compromissos.',
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
      'profile_title', 'Flacidez ou contorno a incomodar — faz sentido definir um eixo com a profissional',
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
  ),
-- b1000025 — água (apoio a hábito / corpo)
  (
    'b1000025-0025-4000-8000-000000000025',
    'PROJECTION_CALCULATOR',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Meta de hidratação organizada — bom alinhamento com corpo e rotina',
      'profile_summary', 'Pelos números que você trouxe, a estimativa de água faz sentido como ordem de grandeza. No contexto corporal, hidratação adequada costuma apoiar sensação de leveza e resposta a drenagem ou massagem — o detalhe fino (saúde, medicamentos, treino) fica na conversa com a profissional.',
      'frase_identificacao', 'Se você se identifica, quer transformar o resultado da calculadora em hábito sustentável junto da clínica.',
      'main_blocker', 'Só olhar o copo contado sem encaixar na rotina real (trabalho, calor, treino) limita o efeito prático.',
      'consequence', 'Sem ajuste com quem te acompanha, o número vira meteoro na tela, não rotina.',
      'growth_potential', 'Use o print ou o resultado na avaliação para cruzar com o que vocês combinarem.',
      'dica_rapida', 'Distribuir a água ao longo do dia costuma vencer “tomar tudo de uma vez”.',
      'cta_text', 'Quero alinhar hidratação com meus cuidados no corpo',
      'whatsapp_prefill', 'Oi! Usei a calculadora de água no link de vocês. O resultado é estimativa — quero marcar avaliação para alinhar hidratação com hábito e com o que faço no corpo.'
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
      'whatsapp_prefill', 'Oi! Calculei minha meta de água; quero consulta para calibrar com rotina, treino e o que estou fazendo ou pretendo fazer no corpo.'
    )
  ),
  (
    'b1000025-0025-4000-8000-000000000025',
    'PROJECTION_CALCULATOR',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Meta de água sob pressão — priorize conversa antes de radicalizar',
      'profile_summary', 'Pelos dados, há combinação de prazo curto ou salto grande que puxa o alerta do planeamento. Para quem faz tratamentos corporais, mudanças bruscas em líquidos sem orientação podem ser contraproducentes — a avaliação prioritariza segurança e ritmo sustentável.',
      'frase_identificacao', 'Se você se reconhece aqui, quer resultado rápido mas precisa de norte profissional.',
      'main_blocker', 'Empurrar líquidos ou cortar sal sem critério pode descompensar sensação e rotina.',
      'consequence', 'Excesso de improviso aumenta cansaço e frustração.',
      'growth_potential', 'Peça encaixe prioritário e mencione medicamentos, gestação ou problemas renais/cardíacos, se existir.',
      'dica_rapida', 'Evite alterar drasticamente ingestão de água até falar com a equipe.',
      'cta_text', 'Quero avaliação prioritária — hidratação e cuidados no corpo',
      'whatsapp_prefill', 'Oi! Usei a calculadora de água e o perfil saiu com alerta de meta agressiva. Quero avaliação prioritária para ritmo seguro de hidratação junto dos meus cuidados no corpo.'
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
      'cta_text', 'Quero alinhar resultado da calculadora com meus cuidados',
      'whatsapp_prefill', 'Oi! Fiz a calculadora de calorias no link. Quero avaliação para alinhar esse referencial com hábito e com o que faço no corpo.'
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
      'cta_text', 'Quero avaliação prioritária — meta e cuidados no corpo',
      'whatsapp_prefill', 'Oi! A calculadora de calorias acusou meta agressiva; quero avaliação prioritária para ritmo seguro com acompanhamento adequado no corpo.'
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
      'cta_text', 'Quero conversar sobre meu corpo além do IMC',
      'whatsapp_prefill', 'Oi! Calculei meu IMC no link. Quero marcar avaliação corporal para alinhar expectativa e zonas com vocês — além do número.'
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
      'main_blocker', 'Focar só em “preciso baixar IMC” sem olhar hábito, pele e o que faz sentido primeiro pode desorganizar o próximo passo.',
      'consequence', 'Expectativa vaga prolonga gasto com tentativas desconexas.',
      'growth_potential', 'Peça avaliação com uma meta visível em 8 semanas e critérios de revisão.',
      'dica_rapida', 'Perda de peso rápida muda pele — comente com a profissional antes de intensificar.',
      'cta_text', 'Quero consulta para próximos passos com contexto do IMC',
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
      'cta_text', 'Quero avaliação prioritária — IMC e próximos passos',
      'whatsapp_prefill', 'Oi! A calculadora colocou meu IMC/projeção em alerta de meta agressiva; quero avaliação prioritária para próximos passos seguros e realistas.'
    )
  ),

  -- b1000028 — proteína (massa, recuperação, não prescritivo)
  (
    'b1000028-0028-4000-8000-000000000028',
    'PROJECTION_CALCULATOR',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Meta de proteína como referência — encaixar na rotina e no corpo',
      'profile_summary', 'A calculadora dá uma faixa útil de gramas por dia; para treino e estética corporal, distribuição ao longo do dia e tolerância individual importam. Na consulta pode alinhar-se com hábito e com sessões de massagem ou fortalecimento que vocês fizerem.',
      'frase_identificacao', 'Se te identificas, queres número para conversar com a profissional, não auto-prescrever.',
      'main_blocker', 'Multiplex de shakes sem orientação ignora digestão, sede e ritmo de treino.',
      'consequence', 'Expectativa só em suplemento sem comida real costuma não sustentar rotina.',
      'growth_potential', 'Leve o resultado e um dia típico de refeições (honesto) para ajuste fino.',
      'dica_rapida', 'Proteína no café da manhã ajuda saciedade — valide distribuição com a equipe.',
      'cta_text', 'Quero alinhar proteína com treino e corpo',
      'whatsapp_prefill', 'Oi! Usei a calculadora de proteína. Quero avaliação para alinhar gramas com treino e rotina com vocês.'
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
      'profile_summary', 'A projeção indica combinação exigente (muita proteína ou objetivo intenso em pouco tempo). Para quem faz tratamentos corporais, subir carga proteica sem triagem pode sobrecarregar — priorize conversa para ritmo seguro e sustentável.',
      'frase_identificacao', 'Se te revês aqui, queres performance ou contorno rápido mas com menos risco.',
      'main_blocker', 'Empurrar suplementação ou quantidade alta sem suporte pode irritar digestão ou rotina.',
      'consequence', 'Abandono do plano por desconforto atrasa o que você quer ver no espelho.',
      'growth_potential', 'Peça avaliação prioritária e mencione função renal, gestação ou restrições alimentares, se houver.',
      'dica_rapida', 'Não multiplique shakes até ouvir a equipe.',
      'cta_text', 'Quero avaliação prioritária — proteína e corpo',
      'whatsapp_prefill', 'Oi! A calculadora de proteína apontou meta agressiva; quero avaliação prioritária para ritmo seguro com o que faço no corpo.'
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
      'cta_text', 'Quero alinhar hidratação com treino e rotina',
      'whatsapp_prefill', 'Oi! Usei a calculadora de hidratação avançada. Quero marcar avaliação para alinhar copos/dia com treino, clima e rotina.'
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
      'profile_summary', 'A combinação de prazo curto com muitas idas por semana acende o alerta de planeamento. Antes de fechar qualquer pacote, avaliação prioritária alinha expectativa realista, recuperação da pele e intervalos seguros.',
      'frase_identificacao', 'Se te revês aqui, queres resultado visível rápido sem sabotar pele ou bolso.',
      'main_blocker', 'Empilhar sessões sem critério aumenta risco de irritação ou frustração.',
      'consequence', 'Investir em série agressiva sem triagem pode gerar arrependimento.',
      'growth_potential', 'Peça encaixe prioritário e diga evento ou prazo mental — para calibrar honestamente.',
      'dica_rapida', 'Evite fechar qualquer pacote online antes da primeira consulta presencial.',
      'cta_text', 'Quero avaliação prioritária — sessões e próximos passos',
      'whatsapp_prefill', 'Oi! A calculadora de expectativa de sessões saiu com ritmo intenso; quero avaliação prioritária para calibrar intervalos e expectativa com a profissional.'
    )
  )
;

-- Cache: forçar regeneração do diagnóstico visitante após mudança de `content_json`.
DELETE FROM ylada_diagnosis_cache c
USING ylada_links y
WHERE c.link_id = y.id
  AND y.status = 'active'
  AND (y.config_json -> 'meta' ->> 'pro_lideres_preset') IS DISTINCT FROM 'true'
  AND y.template_id = ANY (
    ARRAY[
    'b1000121-0121-4000-8000-000000000121'::uuid,
    'b1000122-0122-4000-8000-000000000122'::uuid,
    'b1000124-0124-4000-8000-000000000124'::uuid,
    'b1000125-0125-4000-8000-000000000125'::uuid,
    'b1000126-0126-4000-8000-000000000126'::uuid,
    'b1000142-0142-4000-8000-000000000142'::uuid,
    'b1000143-0143-4000-8000-000000000143'::uuid,
    'b1000144-0144-4000-8000-000000000144'::uuid,
    'b1000145-0145-4000-8000-000000000145'::uuid,
    'b1000146-0146-4000-8000-000000000146'::uuid,
    'b1000147-0147-4000-8000-000000000147'::uuid,
    'b1000148-0148-4000-8000-000000000148'::uuid,
    'b1000149-0149-4000-8000-000000000149'::uuid,
    'b1000150-0150-4000-8000-000000000150'::uuid,
    'b1000151-0151-4000-8000-000000000151'::uuid,
    'b1000119-0119-4000-8000-000000000119'::uuid,
    'b1000120-0120-4000-8000-000000000120'::uuid,
    'b1000127-0127-4000-8000-000000000127'::uuid,
    'b1000038-0038-4000-8000-000000000038'::uuid,
    'b1000044-0044-4000-8000-000000000044'::uuid,
    'b1000046-0046-4000-8000-000000000046'::uuid,
    'b1000048-0048-4000-8000-000000000048'::uuid,
    'b1000050-0050-4000-8000-000000000050'::uuid,
    'b1000025-0025-4000-8000-000000000025'::uuid,
    'b1000026-0026-4000-8000-000000000026'::uuid,
    'b1000027-0027-4000-8000-000000000027'::uuid,
    'b1000028-0028-4000-8000-000000000028'::uuid,
    'b1000031-0031-4000-8000-000000000031'::uuid,
    'b1000123-0123-4000-8000-000000000123'::uuid
    ]
  );
