-- Pro Estética Capilar / Terapia capilar — lote 1: quizzes base biblioteca (b1000103–107, mig. 284).
-- RISK_DIAGNOSIS × leve | moderado | urgente × diagnosis_vertical = capilar.
-- Tom: avaliação presencial com profissional capilar; sem promessa nem diagnóstico médico.

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical = 'capilar'
  AND template_id IN (
    'b1000103-0103-4000-8000-000000000103'::uuid,
    'b1000104-0104-4000-8000-000000000104'::uuid,
    'b1000105-0105-4000-8000-000000000105'::uuid,
    'b1000106-0106-4000-8000-000000000106'::uuid,
    'b1000107-0107-4000-8000-000000000107'::uuid
  );

INSERT INTO public.ylada_flow_diagnosis_outcomes
  (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'b1000103-0103-4000-8000-000000000103',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Queda ou enfraquecimento dos fios — ainda dá para organizar com calma',
      'profile_summary', 'Pelas respostas, há sinais leves ou dúvidas sobre o que pode estar por trás da queda. Na consulta capilar costuma alinhar-se rotina, produtos e se faz sentido encaminhamento para saúde — sem alarmismo e sem promessa de “milagre”.',
      'frase_identificacao', 'Se você se identificou, quer entender o que é cuidado capilar e o que pode precisar de outro olhar.',
      'main_blocker', 'Trocar de shampoo toda semana sem critério atrasa o que poderia ser resolvido com plano.',
      'consequence', 'Adiar conversa mantém o ralo ou o espelho como preocupação de fundo.',
      'growth_potential', 'Use o resultado para pedir avaliação e listar há quanto tempo notou mudança.',
      'dica_rapida', 'Fotos na mesma luz (mês a mês) ajudam a comparar evolução — pergunte se a clínica usa registo.',
      'cta_text', 'Quero avaliação capilar para minha queda',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre queda de cabelo. O resultado saiu exploratório — quero marcar avaliação capilar para alinhar rotina e próximo passo com vocês.'
    )
  ),
  (
    'b1000103-0103-4000-8000-000000000103',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Queda com impacto na rotina — hora de protocolo com profissional',
      'profile_summary', 'As respostas indicam que o tema do cabelo já pesa no dia a dia ou na autoimagem. Um plano capilar costuma unir higiene, tratamentos em salão quando indicados e honestidade sobre prazo — sempre presencial.',
      'frase_identificacao', 'Se isso combina com você, já tentou vitamina ou moda de internet e quer método.',
      'main_blocker', 'Expectativa de resultado imediato sem avaliação costuma gerar frustração e gasto solto.',
      'consequence', 'Sem prioridade, tende a repetir ciclo de esperança e desânimo.',
      'growth_potential', 'Marque consulta com resumo de medicamentos, química recente e estresse ou falta de sono.',
      'dica_rapida', 'Evite puxar trança apertada ou chapinha diária até alinhar com a profissional.',
      'cta_text', 'Quero consulta para plano de queda',
      'whatsapp_prefill', 'Oi! Fiz o questionário de queda capilar; o perfil saiu moderado. Quero consulta para definir protocolo, frequência e o que fazer em casa com orientação de vocês.'
    )
  ),
  (
    'b1000103-0103-4000-8000-000000000103',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Queda intensa ou rápida — priorize avaliação orientada',
      'profile_summary', 'Pelas respostas, há urgência ou intensidade que pedem conversa presencial. A terapeuta capilar organiza cuidado do couro e dos fios; quando indicado, apoia encaminhamento para saúde geral — sem substituir médico.',
      'frase_identificacao', 'Se você se reconhece aqui, precisa de clareza rápida, não de mais um produto aleatório.',
      'main_blocker', 'Postergar triagem prolonga o desconforto emocional e físico com o couro ou volume.',
      'consequence', 'Continuar sozinha(o) sem critério pode agravar trauma mecânico ou usar química errada.',
      'growth_potential', 'Peça encaixe prioritário e mencione sintomas sistémicos ou pós-cirúrgico, se houver.',
      'dica_rapida', 'Leve lista do que já usou nas últimas 8 semanas (shampoo, tônico, minoxidil, etc.).',
      'cta_text', 'Preciso de avaliação capilar o quanto antes',
      'whatsapp_prefill', 'Oi! O questionário sobre queda saiu urgente; quero avaliação prioritária na clínica para protocolo seguro e orientação honesta.'
    )
  ),

  (
    'b1000104-0104-4000-8000-000000000104',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Tipo de fio e rotina — explorar com calma antes de fechar compras',
      'profile_summary', 'Pelas respostas, há curiosidade sobre textura, espessura ou como tratar o seu fio. Na consulta capilar costuma fechar-se o que é porosidade, tensão do córtex e frequência certa de hidratação — sem rótulo de internet genérico.',
      'frase_identificacao', 'Se te identificas, queres produto certo, não só “linha famosa”.',
      'main_blocker', 'Comparar teu cabelo com vídeo alheio gera expectativa que não conversa com a tua estrutura.',
      'consequence', 'Armário cheio de produto errado para o teu fio atrasa resultado.',
      'growth_potential', 'Leva uma foto do fio ao natural e conta se usas progressiva ou descoloração.',
      'dica_rapida', 'Menos etapas bem feitas costumam vencer cronograma confuso em casa.',
      'cta_text', 'Quero alinhar tipo de fio na avaliação',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre tipo de cabelo. O resultado saiu exploratório — quero marcar avaliação para alinhar rotina e produtos com vocês.'
    )
  ),
  (
    'b1000104-0104-4000-8000-000000000104',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fio difícil de domar ou sem brilho — cruzar técnica com profissional',
      'profile_summary', 'As respostas mostram incómodo recorrente com textura, frizz ou falta de definição. Plano capilar costuma combinar lavagem, condicionamento e tratamentos em salão com intervalo seguro.',
      'frase_identificacao', 'Se isso é você, o espelho ou o pentear já roubam tempo de manhã.',
      'main_blocker', 'Excesso de calor ou química sem pausa limita o que o fio aguenta.',
      'consequence', 'Sem ajuste, o cabelo parece “rebelde” mesmo com esforço.',
      'growth_potential', 'Na consulta, peça protocolo mínimo para 4 semanas e data de revisão.',
      'dica_rapida', 'Toalha e tracção no secador importam tanto quanto máscara — comente hábitos.',
      'cta_text', 'Quero consulta para protocolo do meu fio',
      'whatsapp_prefill', 'Oi! Questionário sobre tipo de fio; perfil moderado. Quero consulta para protocolo, produtos e frequência realista.'
    )
  ),
  (
    'b1000104-0104-4000-8000-000000000104',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Frustração alta com textura ou identidade do cabelo — encaixe prioritário',
      'profile_summary', 'Pelas respostas, há intensidade em aceitar ou tratar o fio. Avaliação prioritária ajuda a evitar mais química impulsiva e a montar plano seguro com honestidade sobre prazo.',
      'frase_identificacao', 'Se te revês aqui, queres mudança visível com acompanhamento, não discurso vago.',
      'main_blocker', 'Decidir sob aflição aumenta risco de processo agressivo no mesmo mês.',
      'consequence', 'Ciclo de arrependimento e tensão com o couro pode prolongar-se.',
      'growth_potential', 'Pedir horário prioritário e levar histórico de alisamentos ou luzes dos últimos meses.',
      'dica_rapida', 'Evita nova coloração ou alisamento até a primeira conversa presencial.',
      'cta_text', 'Quero avaliação prioritária — tipo de fio e rotina',
      'whatsapp_prefill', 'Oi! O quiz sobre tipo de fio saiu urgente; quero avaliação prioritária para rotina e tratamentos seguros com a equipe.'
    )
  ),

  (
    'b1000105-0105-4000-8000-000000000105',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Couro cabeludo no radar — boa hora para conversa guiada',
      'profile_summary', 'Pelas respostas, há coceira leve, oleosidade ou dúvida se o couro está “normal”. Na avaliação capilar organiza-se higiene, frequência de lavagem e o que observar — sem autodiagnóstico.',
      'frase_identificacao', 'Se te identificas, queres saber se é só rotina ou precisa de protocolo.',
      'main_blocker', 'Esfoliar couro em casa ou trocar shampoo em excesso pode irritar mais que ajudar.',
      'consequence', 'Incómodo leve pode escalar se o couro ficar sensibilizado.',
      'growth_potential', 'Anota produtos que usas há 30 dias — acelera a consulta.',
      'dica_rapida', 'Água muito quente costuma piorar coceira — experimenta morno até avaliares.',
      'cta_text', 'Quero avaliar saúde do meu couro cabeludo',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre couro cabeludo. Resultado exploratório — quero marcar avaliação capilar para alinhar higiene e próximo passo.'
    )
  ),
  (
    'b1000105-0105-4000-8000-000000000105',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Couro incómodo com frequência — fechar protocolo suave',
      'profile_summary', 'As respostas sugerem desequilíbrio recorrente (oleosidade, caspa leve, sensação de aperto). Plano capilar costuma combinar limpeza adequada, pausa de produtos agressivos e terapias em salão quando indicadas.',
      'frase_identificacao', 'Se isso é você, já notou que “só trocar marca” não resolve.',
      'main_blocker', 'Ignorar sinais prolonga inflamação leve que pede critério profissional.',
      'consequence', 'Coceira frequente pode levar a machucar o couro nas unhas.',
      'growth_potential', 'Marca consulta e menciona se usas minoxidil, tinta ou relaxamento.',
      'dica_rapida', 'Não somar ácidos e esfoliação forte na mesma semana sem orientação.',
      'cta_text', 'Quero consulta para protocolo de couro',
      'whatsapp_prefill', 'Oi! Quiz do couro cabeludo; perfil moderado. Quero consulta para protocolo, produtos e frequência com vocês.'
    )
  ),
  (
    'b1000105-0105-4000-8000-000000000105',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Couro muito reativo, dor ou piora rápida — prioridade na clínica',
      'profile_summary', 'Pelas respostas, há urgência (ardor forte, crostas, sangramento leve ou piora após química). Avaliação prioritária na terapia capilar organiza o relato; se for o caso, encaminha avaliação médica — sem competir com dermatologia.',
      'frase_identificacao', 'Se te revês aqui, precisas de acalmar o couro com norte profissional.',
      'main_blocker', 'Automedicar ou aplicar óleo forte em couro inflamado pode piorar o quadro.',
      'consequence', 'Atrasar conversa prolonga dor e limita opções de tratamento capilar.',
      'growth_potential', 'Pedir encaixe prioritário e levar fotos recentes do couro (com discreção).',
      'dica_rapida', 'Evita coloração ou descoloração até a profissional liberar.',
      'cta_text', 'Quero avaliação prioritária — couro cabeludo',
      'whatsapp_prefill', 'Oi! O questionário do couro saiu urgente; quero avaliação prioritária e orientação segura (e encaminhamento se precisar).'
    )
  ),

  (
    'b1000106-0106-4000-8000-000000000106',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Hidratação e brilho — ajustar antes de escalar química',
      'profile_summary', 'Pelas respostas, o fio parece áspero ou sem vida, sem drama extremo. Na consulta capilar alinha-se máscara, leave-in e frequência de calor — com linguagem realista sobre “fio novo” vs recuperação.',
      'frase_identificacao', 'Se te identificas, queres maciez sem promessa de anúncio.',
      'main_blocker', 'Comprar só máscara cara sem técnica de enxágue e frequência limita resultado.',
      'consequence', 'Ressecação leve vira quebra nas pontas com tempo.',
      'growth_potential', 'Leva o resultado e pergunta por plano mínimo para 3 lavagens.',
      'dica_rapida', 'Óleo demais no couro pode aumentar lavagens — equilibra com a profissional.',
      'cta_text', 'Quero alinhar hidratação capilar',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre hidratação do cabelo. Exploratório — quero avaliação para rotina e tratamentos com vocês.'
    )
  ),
  (
    'b1000106-0106-4000-8000-000000000106',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fio poroso ou sem vida — cronograma com profissional',
      'profile_summary', 'As respostas indicam desconforto visível ou tátil. Plano capilar costuma alternar nutrição, reconstrução leve e pausa de processos agressivos — com revisão em semanas.',
      'frase_identificacao', 'Se isso é você, o pente ou o secador já “puxam” o fio.',
      'main_blocker', 'Empilhar química e chapinha sem recuperação quebra o córtex.',
      'consequence', 'Pontas duplas e perda de comprimento aparecem disfarçadas de “não cresce”.',
      'growth_potential', 'Consulta com histórico de luzes/alisamento dos últimos 6 meses.',
      'dica_rapida', 'Secagem gentil com camiseta de algodão costuma reduzir quebra — comente o hábito na consulta.',
      'cta_text', 'Quero consulta para hidratação e fortalecimento',
      'whatsapp_prefill', 'Oi! Quiz hidratação; perfil moderado. Quero consulta para cronograma e pausa segura de química se precisar.'
    )
  ),
  (
    'b1000106-0106-4000-8000-000000000106',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Fio elástico, gomoso ou quebra extrema — avaliação prioritária',
      'profile_summary', 'Pelas respostas, há urgência: medo de perder comprimento, cheiro de queimado ou mudança rápida após processo. Avaliação prioritária reduz dano adicional e define se precisa pausa total de química.',
      'frase_identificacao', 'Se te revês aqui, queres parar o estrago já.',
      'main_blocker', 'Refazer luz ou progressiva “para disfarçar” sem triagem aumenta risco.',
      'consequence', 'Nova química sobre fio comprometido pode exigir corte maior depois.',
      'growth_potential', 'Pedir encaixe prioritário e não aplicar nada forte em casa até a consulta.',
      'dica_rapida', 'Tira foto das pontas e do elástico do fio ao molhar — ajuda a triagem.',
      'cta_text', 'Quero avaliação urgente — recuperação capilar',
      'whatsapp_prefill', 'Oi! O quiz de hidratação/dano saiu urgente. Quero avaliação prioritária para plano de recuperação e segurança do fio.'
    )
  ),

  (
    'b1000107-0107-4000-8000-000000000107',
    'RISK_DIAGNOSIS',
    'leve',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Coloração e saúde do fio — explorar equilíbrio com calma',
      'profile_summary', 'Pelas respostas, há curiosidade se a tintura está a “pesar” no brilho ou na textura. Na consulta capilar pode alinhar-se frequência de retoque, tonalizante vs permanente e cuidado entre uma coloração e outra.',
      'frase_identificacao', 'Se te identificas, queres cor sem sacrificar o fio.',
      'main_blocker', 'Retoques em cima de retoque sem avaliação do córtex fragiliza o comprimento.',
      'consequence', 'Tom desbotado ou frisado pode mascarar quebra em progressão.',
      'growth_potential', 'Leva foto do fio na raiz e nas pontas e diz quando foi a última química.',
      'dica_rapida', 'Pede à profissional o intervalo mínimo seguro entre processos na tua cabeça.',
      'cta_text', 'Quero alinhar coloração com saúde do fio',
      'whatsapp_prefill', 'Oi! Fiz o quiz sobre tintura e fios. Exploratório — quero avaliação para equilibrar cor e saúde com vocês.'
    )
  ),
  (
    'b1000107-0107-4000-8000-000000000107',
    'RISK_DIAGNOSIS',
    'moderado',
    'capilar',
    jsonb_build_object(
      'profile_title', 'Cor frequente ou química acumulada — plano em fases',
      'profile_summary', 'As respostas mostram ritmo intenso de coloração ou sinais de porosidade. Um plano capilar costuma espaçar processos, usar tratamentos de reconstrução quando indicados e proteger o comprimento.',
      'frase_identificacao', 'Se isso é você, já sentes o fio “diferente” após várias idas ao salão.',
      'main_blocker', 'Corrigir cor em casa com produto farmácia após erro pode piorar o tom e o fio.',
      'consequence', 'Sem pausa estratégica, o dano fica caro em tempo e comprimento.',
      'growth_potential', 'Consulta com calendário das últimas colorações e fotos.',
      'dica_rapida', 'Protetor térmico sério antes de secador — confirma marca com a clínica.',
      'cta_text', 'Quero consulta para cor + recuperação',
      'whatsapp_prefill', 'Oi! Quiz tintura; perfil moderado. Quero consulta para planejar retoques e tratamentos sem destruir o fio.'
    )
  ),
  (
    'b1000107-0107-4000-8000-000000000107',
    'RISK_DIAGNOSIS',
    'urgente',
    'capilar',
    jsonb_build_object(
      'profile_title', 'After química ruim ou medo de perder o fio — encaixe prioritário',
      'profile_summary', 'Pelas respostas, há urgência após processo (quebra em massa, elástico, cor inesperada). Avaliação prioritária define pausa, tratamento de emergência capilar e honestidade sobre corte necessário — sem promessa impossível.',
      'frase_identificacao', 'Se te revês aqui, queres resgate profissional já.',
      'main_blocker', 'Aplicar nova química por conta para “fechar cor” sem triagem é arriscado.',
      'consequence', 'Mais uma rodada mal calibrada pode exigir intervenção maior.',
      'growth_potential', 'Pede horário prioritário e leva embalagem do produto usado, se tiveres.',
      'dica_rapida', 'Não lavar em excesso com detergente caseiro — prioriza orientação.',
      'cta_text', 'Quero avaliação prioritária — química e recuperação',
      'whatsapp_prefill', 'Oi! O quiz sobre tintura/prejuízo do fio saiu urgente. Quero avaliação prioritária para plano de recuperação com a equipe.'
    )
  );
