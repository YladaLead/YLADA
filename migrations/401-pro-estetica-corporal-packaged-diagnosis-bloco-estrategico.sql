-- Pro Estética Corporal — pacotes RISK_DIAGNOSIS por template (b1000121, 122, 124, 125, 126).
-- diagnosis_vertical = corporal: ligados com meta.diagnosis_vertical da biblioteca corporal.
-- Sem promessa de resultado; convite à avaliação / protocolo com a profissional (tom src/config/ylada-diagnosis-result-standard.ts).
-- b1000123 é calculadora (outra arquitetura) — fora deste lote.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical = 'corporal'
  AND template_id IN (
    'b1000121-0121-4000-8000-000000000121'::uuid,
    'b1000122-0122-4000-8000-000000000122'::uuid,
    'b1000124-0124-4000-8000-000000000124'::uuid,
    'b1000125-0125-4000-8000-000000000125'::uuid,
    'b1000126-0126-4000-8000-000000000126'::uuid
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
      'cta_text', 'Quero alinhar por onde começar no protocolo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre drenagem, modeladora ou tecnologia corporal. O resultado saiu no tom exploratório e quero marcar avaliação para definir ordem e protocolo com vocês.'
    )
  ),
  (
    'b1000121-0121-4000-8000-000000000121',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Indecisão com impacto no dia a dia — vale travar com plano',
      'profile_summary', 'As respostas mostram que a dúvida entre abordagens já pesa no espelho, na roupa ou na confiança. Um direcionamento profissional costuma poupar tempo e sessões mal encaixadas.',
      'frase_identificacao', 'Se isso combina com você, já tentou “um pouco de tudo” sem sentir continuidade.',
      'main_blocker', 'O custo é oscilação: melhora pontual sem critério — o padrão corporal volta ao mesmo ponto.',
      'consequence', 'Continuar sem prioridade tende a misturar tecnologias e hábitos que se anulam ou sobrecarregam a pele.',
      'growth_potential', 'Use o resultado para pedir uma avaliação que una objetivo, região e sensibilidade — e só então fechar frequência e combinação de procedimentos.',
      'dica_rapida', 'Evite fechar pacote grande antes de alinhar sequência; ordem correta costuma importar mais que volume.',
      'cta_text', 'Quero avaliação para definir sequência e frequência',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre prioridade corporal (drenagem/modeladora/tecnologia). O resultado indica que preciso alinhar sequência e frequência com avaliação — podemos agendar?'
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
      'whatsapp_prefill', 'Oi! Fiz o questionário de prioridade corporal e o resultado saiu com tom de urgência em ter plano claro. Quero agendar avaliação o quanto antes para não improvisar procedimentos.'
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
      'profile_summary', 'As respostas indicam que a decisão não é só técnica — afeta como você se sente no corpo no dia a dia. Um plano com profissional costuma reduzir ansiedade e “comparação mental” entre procedimentos.',
      'frase_identificacao', 'Se isso é você, já gastou energia mental demais sem critério clínico de encaixe.',
      'main_blocker', 'Sem critério, o risco é trocar de estratégia antes do tempo de resposta do protocolo.',
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
      'profile_title', 'Necessidade forte de definir tecnologia e protocolo — priorize avaliação',
      'profile_summary', 'Pelas respostas, há combinação de objetivo corporal claro e pressão de tempo. Passo crítico: não fechar tratamento só por mensagem — marcar avaliação presencial ou vídeo conforme a clínica para alinhar segurança',
      'frase_identificacao', 'Se você se vê aqui, não quer mais adiar a decisão informada.',
      'main_blocker', 'Decidir sob estresse sem avaliação aumenta chance de expectativa ou sequência inadequadas.',
      'consequence', 'Adiar conversa estruturada prolonga o vai-e-volta entre opções.',
      'growth_potential', 'Solicite horário prioritário e diga seu objetivo e prazo na primeira mensagem — ajuda a clínica a responder com clareza.',
      'dica_rapida', 'Protocolo corporal sério combina intervalos e preparação de tecido; “sessão única milagrosa” costuma ser narrativa arriscada.',
      'cta_text', 'Quero agendar avaliação com urgência',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre tecnologia corporal; o resultado indica alta necessidade de definir protocolo com segurança. Quero avaliação prioritária — qual o próximo horário?'
    )
  ),

  (
    'b1000124-0124-4000-8000-000000000124',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Protocolo em camadas: ainda dá para simplificar antes de empilhar',
      'profile_summary', 'Pelas respostas, existe tendência a querer resolver tudo junto, mas com margem para organizar. Camadas bem ordenadas costumam responder bem — uma frente estável, depois a próxima.',
      'frase_identificacao', 'Se te identificas, sente que “falta síntese” entre tantos passos possíveis.',
      'main_blocker', 'Empilhar etapas sem ordem cansa você e pode confundir leitura de resultado.',
      'consequence', 'Sem síntese, fica difícil saber o que realmente está funcionando.',
      'growth_potential', 'Na avaliação, peça um plano em fases com marcos simples (ex.: 30 / 60 dias) — sem promessa de milagre.',
      'dica_rapida', 'Menos intervenções bem espaçadas costumam vencer agenda lotada de procedimentos aleatórios.',
      'cta_text', 'Quero um plano em fases na avaliação',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre camadas do protocolo corporal. O resultado sugere organizar frentes em sequência — quero avaliação para montar plano em fases.'
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
      'profile_title', 'Momento de travar plano — evite mais uma rodada de tentativa e erro',
      'profile_summary', 'Pelas respostas, há intensidade na sensação de que o protocolo precisa ser desenhado de novo. Avaliação rápida ajuda a parar o ciclo de camadas conflitantes.',
      'frase_identificacao', 'Se você se revê aqui, sente que o corpo “não aguenta mais ruído”.',
      'main_blocker', 'Continuar sem decisão centralizada mantém irritação, tempo perdido e frustração.',
      'consequence', 'Sem pausa e reordenação, o desgaste emocional com o próprio corpo aumenta.',
      'growth_potential', 'Peça avaliação e diga claramente o que piorou ou estagnou — isso orienta desmontar o que não serve.',
      'cta_text', 'Quero reavaliar protocolo com urgência',
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
      'profile_title', 'Inchaço ou “corpo pesado”: hábitos e protocolo ainda alinháveis com calma',
      'profile_summary', 'Pelas respostas, a sensação de retenção ou peso aparece, mas com espaço para ajuste progressivo de rotina e protocolo. Avaliação ajuda a separar o que é hábito do que pede tratamento.',
      'frase_identificacao', 'Se te identificas, suspeita que sono, sal ou pouca movimentação entram na conta.',
      'main_blocker', 'Confundir só “retenção estética” com outros fatores sem conversa costuma atrasar solução.',
      'consequence', 'Pequenos desvios de hábito podem manter a sensação mesmo com boa vontade no tratamento.',
      'growth_potential', 'Leve para a profissional um resumo de hidratação, sono e dias mais inchados da semana.',
      'dica_rapida', 'Monitor simples (ex.: sensação matinal vs. noite) já melhora diagnóstico de rotina na consulta.',
      'cta_text', 'Quero alinhar hábitos e protocolo corporal',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre inchaço e sensação de corpo pesado. O resultado está no tom leve — quero avaliação para alinhar hábitos com o protocolo de vocês.'
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
      'main_blocker', 'Protocolo isolado de hábito costuma dar resultado frustrante.',
      'consequence', 'Sem integração, a sensação de peso volta no mesmo ciclo semanal.',
      'growth_potential', 'Peça plano que una duas frentes: clínica + ajustes realistas em casa — sem culpa, com critério.',
      'dica_rapida', 'Um eixo por vez (ex.: hidratação estável) já muda leitura do inchaço em poucas semanas.',
      'cta_text', 'Quero plano que una hábito e tratamento',
      'whatsapp_prefill', 'Oi! Fiz o questionário inchaço e hábitos. O resultado indica que preciso integrar rotina com protocolo — quero marcar avaliação para montar isso com vocês.'
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
  );
