-- Pro Estética corporal: 3 quizzes (peeling Hollywood / black peel, despigmentação tatuagem-micro, clareamento íntimo-axilas).
-- Templates b1000192–b1000194. Idempotente: remove outcomes + cache destes IDs; ON CONFLICT nos templates; WHERE NOT EXISTS nos itens.
-- @see src/config/pro-estetica-corporal-biblioteca.ts

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE diagnosis_vertical = 'corporal'
  AND architecture = 'RISK_DIAGNOSIS'
  AND template_id = ANY (
    ARRAY[
      'b1000192-0192-4000-8000-000000000192'::uuid,
      'b1000193-0193-4000-8000-000000000193'::uuid,
      'b1000194-0194-4000-8000-000000000194'::uuid
    ]
  );

DELETE FROM public.ylada_diagnosis_cache c
USING public.ylada_links y
WHERE c.link_id = y.id
  AND y.template_id = ANY (
    ARRAY[
      'b1000192-0192-4000-8000-000000000192'::uuid,
      'b1000193-0193-4000-8000-000000000193'::uuid,
      'b1000194-0194-4000-8000-000000000194'::uuid
    ]
  );

INSERT INTO public.ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000192-0192-4000-8000-000000000192',
    'quiz_black_peel_hollywood_facial_corporal',
    'diagnostico',
    $t192$
    {
      "title": "Black peel / peeling Hollywood: faz sentido para sua pele agora?",
      "introTitle": "Renovação facial intensa: organize o que contar na avaliação",
      "introSubtitle": "Quatro perguntas sobre como você vê a pele, experiência e objetivo — foco facial; na consulta a profissional confirma indicação, preparo e ritmo seguros para o seu caso.",
      "introMicro": "Cerca de 1 min · 4 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "Como você percebe sua pele hoje?", "type": "single", "options": ["Sem brilho ou aspecto opaco", "Manchas ou tonalidade irregular", "Acne ativa ou marcas recentes", "Poros aparentes ou textura que incomoda"]},
        {"id": "q2", "text": "O que mais te incomoda ao se olhar?", "type": "single", "options": ["Aparência cansada ou sem viço", "Textura irregular (aspereza, “poros”)", "Oleosidade ou brilho excessivo", "Manchas ou tonalidade desuniforme"]},
        {"id": "q3", "text": "Você já realizou algum tratamento facial antes?", "type": "single", "options": ["Nunca", "Limpeza de pele ou hidratação profissional", "Peelings leves ou químicos suaves", "Procedimentos estéticos faciais mais avançados"]},
        {"id": "q4", "text": "Seu objetivo principal é:", "type": "single", "options": ["Clarear manchas ou uniformizar tom", "Renovar textura e viço", "Uniformizar aparência geral", "Rejuvenescer ou “código de barra” mais suave"]}
      ],
      "results": [
        {"id": "r4", "label": "Indicação a explorar com prioridade", "minScore": 9, "headline": "Há foco claro — vale conversa objetiva na clínica", "description": "Suas respostas misturam incômodo visível, experiência prévia e objetivo definido. Peelings mais intensos pedem avaliação presencial: fototipo, medicamentos, gestação, rotina de ácidos e sol. Leve este resultado e peça explicação sobre preparo, número de sessões típicas e o que esperar entre uma e outra — sem promessa de data milagrosa."},
        {"id": "r3", "label": "Boa candidatura a alinhar", "minScore": 6, "headline": "Encaixe plausível — falta fechar critério com a profissional", "description": "Há combinação de queixa e objetivo que costuma ser discutida em protocolos de renovação facial. Na consulta, alinhe sensibilidade da pele, acne ativa (se houver) e intervalo seguro com outros tratamentos que você usa."},
        {"id": "r2", "label": "Exploratório", "minScore": 3, "headline": "Ainda dá para clarificar expectativa e histórico", "description": "Suas respostas mostram curiosidade ou incômodo mais leve — normal. Use o questionário como roteiro: diga o que já usou em casa (retinol, ácidos) e se tem evento com prazo. A profissional indica se peeling profundo é etapa inicial ou se outro passo vem antes."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Primeiro passo: conversa guiada", "description": "O melhor caminho depende de pele viva, histórico e contraindicações. Este resultado ajuda a abrir a conversa com calma — avaliação presencial ou por vídeo conforme a clínica."}
      ],
      "ctaDefault": "Quero avaliar peeling / renovação facial na clínica",
      "resultIntro": "Seu resultado:"
    }
    $t192$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000193-0193-4000-8000-000000000193',
    'quiz_despigmentacao_tatuagem_micro_corporal',
    'diagnostico',
    $t193$
    {
      "title": "Despigmentação: tatuagem, micro ou micropigmentação — por onde começar?",
      "introTitle": "Cor, área e tempo: organize o que contar na avaliação",
      "introSubtitle": "Quatro perguntas para qualificar expectativa (clarear, corrigir tom ou remover). Cada caso responde diferente — só a consulta confirma possibilidades e limites.",
      "introMicro": "Cerca de 1 min · 4 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "Qual área você deseja corrigir?", "type": "single", "options": ["Sobrancelhas micropigmentadas", "Lábios (micropigmentação / contorno)", "Tatuagem corporal", "Outra pigmentação ou mancha localizada"]},
        {"id": "q2", "text": "O que mais incomoda?", "type": "single", "options": ["Cor escurecida ou cinza/azulado", "Tom que não combina com o restante", "Arrependimento estético ou mudança de estilo", "Aspecto artificial ou contorno marcado demais"]},
        {"id": "q3", "text": "Há quanto tempo realizou o procedimento?", "type": "single", "options": ["Mais de 3 anos", "Entre 1 e 3 anos", "Há menos de 1 ano", "Timing variado / prefiro explicar na consulta"]},
        {"id": "q4", "text": "Seu objetivo é:", "type": "single", "options": ["Clarear parcialmente ou suavizar", "Corrigir tom para ficar mais natural", "Remover o máximo possível", "Só avaliar o que é realista no meu caso"]}
      ],
      "results": [
        {"id": "r4", "label": "Expectativa intensa", "minScore": 9, "headline": "Pedido forte de mudança — priorize conversa franca na clínica", "description": "Área, cor e tempo influenciam resposta a laser, despigmentantes ou outras abordagens. Expectativa de remoção total nem sempre é realista em poucas sessões. Na avaliação, peça plano por fases, fotos de referência e explicação de risco de hipopigmentação ou textura — sempre no contexto do seu fototipo e histórico."},
        {"id": "r3", "label": "Caminho plausível", "minScore": 6, "headline": "Há encaixe para protocolo sob orientação", "description": "Suas respostas indicam incômodo claro com cor ou formato e objetivo definido. Muitos casos combinam sessões espaçadas e cuidados domiciliares específicos. Leve lista de sessões anteriores (se houver) e produtos que usa na região."},
        {"id": "r2", "label": "Exploratório", "minScore": 3, "headline": "Ainda há variáveis — normal em despigmentação", "description": "Pigmento profundo, cor antiga ou área delicada mudam estratégia. Use o resultado para agendar avaliação com fotos da evolução e honestidade sobre bronzeamento ou sol."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Primeiro passo: avaliação individualizada", "description": "Não dá para “adivinhar” número de sessões só pelo questionário. Este resumo ajuda a profissional a direcionar o que examinar primeiro."}
      ],
      "ctaDefault": "Quero avaliar despigmentação na clínica",
      "resultIntro": "Seu resultado:"
    }
    $t193$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000194-0194-4000-8000-000000000194',
    'quiz_clareamento_intimo_axilas_corporal',
    'diagnostico',
    $t194$
    {
      "title": "Clareamento (axilas, virilha ou região íntima): abrir conversa com segurança",
      "introTitle": "Zona sensível, expectativa realista",
      "introSubtitle": "Quatro perguntas sobre área, impacto na autoestima, o que já tentou e objetivo. Na consulta a profissional explica o que é indicado para o seu tipo de pele — sem promessa de tom “padrão”.",
      "introMicro": "Cerca de 1 min · 4 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "Qual região mais te incomoda?", "type": "single", "options": ["Axilas", "Virilha", "Região íntima externa", "Mais de uma dessas áreas"]},
        {"id": "q2", "text": "O escurecimento afeta sua autoestima?", "type": "single", "options": ["Quero prevenção ou manutenção suave", "Pouco, mas gostaria de melhorar", "Moderadamente — incomoda em algumas situações", "Muito — impacta roupa, praia ou intimidade"]},
        {"id": "q3", "text": "Você já tentou algum tratamento?", "type": "single", "options": ["Nunca", "Cremes ou loções (compra ou prescrição)", "Procedimentos estéticos na região", "Métodos caseiros ou mistura de produtos"]},
        {"id": "q4", "text": "Seu maior objetivo é:", "type": "single", "options": ["Clarear visivelmente com acompanhamento", "Uniformizar tom sem abalar a barreira da pele", "Segurança e critério profissional antes de decidir", "Melhorar confiança no dia a dia"]}
      ],
      "results": [
        {"id": "r4", "label": "Impacto elevado", "minScore": 9, "headline": "Autoestima e zona sensível — priorize avaliação acolhedora", "description": "Suas respostas indicam que o incômodo já pesa no cotidiano. Clareamento em dobras e mucosas exige calibragem de ativo, intervalo e fotoproteção. Na mensagem, peça horário e diga se há gestação, depilação recente ou irritação ativa — ajuda a clínica a orientar sem constrangimento."},
        {"id": "r3", "label": "Boa candidatura", "minScore": 6, "headline": "Dá para montar plano gradual", "description": "Há objetivo claro e histórico que a profissional precisa cruzar com tipo de escurecimento (fricção, pós-inflamatório, hormonal). Muitas pessoas respondem a séries espaçadas combinadas com hábitos suaves em casa."},
        {"id": "r2", "label": "Exploratório", "minScore": 3, "headline": "Ainda definindo prioridade — ok começar pela conversa", "description": "Impacto moderado ou tentativas anteriores pedem revisão do que funcionou ou irritou. Leve fotos com luz uniforme (se você se sentir confortável) para comparar evolução."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Prevenção ou primeiro contato", "description": "Mesmo com incômodo leve, avaliação ajuda a evitar produtos agressivos que escurecem mais a longo prazo. Use o resultado para pedir orientação sob medida."}
      ],
      "ctaDefault": "Quero conversar sobre clareamento com a profissional",
      "resultIntro": "Seu resultado:"
    }
    $t194$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  schema_json = EXCLUDED.schema_json,
  allowed_vars_json = EXCLUDED.allowed_vars_json,
  version = EXCLUDED.version,
  active = EXCLUDED.active,
  updated_at = NOW();

INSERT INTO public.ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'pele', 'habitos', 'Black peel / peeling Hollywood: sua pele e seu objetivo', 'Quatro perguntas sobre percepção da pele, incômodo, experiência e meta — roteiro para avaliação facial.', 'Aspecto da pele ou dúvida sobre peeling', 'Avaliação facial / renovação', 'custom', 'b1000192-0192-4000-8000-000000000192'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_black_peel_hollywood_facial_corporal", "num_perguntas": 4, "tempo_minutos": 2, "diagnosis_vertical": "corporal", "architecture": "RISK_DIAGNOSIS"}'::jsonb, 311, true
WHERE NOT EXISTS (SELECT 1 FROM public.ylada_biblioteca_itens WHERE template_id = 'b1000192-0192-4000-8000-000000000192');

INSERT INTO public.ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'pele', 'habitos', 'Despigmentação: tatuagem, micro ou lábios — expectativa realista', 'Área, incômodo, tempo desde o procedimento e meta — abre conversa sobre possibilidades e limites.', 'Cor ou formato da pigmentação', 'Avaliar despigmentação / correção', 'custom', 'b1000193-0193-4000-8000-000000000193'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_despigmentacao_tatuagem_micro_corporal", "num_perguntas": 4, "tempo_minutos": 2, "diagnosis_vertical": "corporal", "architecture": "RISK_DIAGNOSIS"}'::jsonb, 312, true
WHERE NOT EXISTS (SELECT 1 FROM public.ylada_biblioteca_itens WHERE template_id = 'b1000193-0193-4000-8000-000000000193');

INSERT INTO public.ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'pele', 'habitos', 'Clareamento íntimo / axilas: zona sensível, próximo passo seguro', 'Área, autoestima, tentativas anteriores e objetivo — convite à conversa sem promessa de tom “padrão”.', 'Escurecimento em áreas íntimas ou axilas', 'Clarear com orientação profissional', 'custom', 'b1000194-0194-4000-8000-000000000194'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_clareamento_intimo_axilas_corporal", "num_perguntas": 4, "tempo_minutos": 2, "diagnosis_vertical": "corporal", "architecture": "RISK_DIAGNOSIS"}'::jsonb, 313, true
WHERE NOT EXISTS (SELECT 1 FROM public.ylada_biblioteca_itens WHERE template_id = 'b1000194-0194-4000-8000-000000000194');

INSERT INTO public.ylada_flow_diagnosis_outcomes (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'b1000192-0192-4000-8000-000000000192',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Renovação facial no radar — dúvidas saudáveis antes de decidir peeling',
      'profile_summary', 'Pelas respostas, há interesse em pele com mais viço ou uniformidade, sem sinal de “urgência extrema”. Peelings mais profundos pedem avaliação: fototipo, acne ativa, uso de ácidos em casa e exposição ao sol entram na decisão.',
      'frase_identificacao', 'Se te identificas, queres entender se peeling combina contigo antes de marcar data.',
      'main_blocker', 'Informação solta nas redes não substitui análise da sua barreira cutânea e do ritmo seguro entre sessões.',
      'consequence', 'Sem triagem, o risco é expectativa desalinhada ou irritação que atrasa qualquer plano.',
      'growth_potential', 'Leve à consulta lista de produtos que usa (incluindo retinol) e se tem evento com prazo — ajuda a calibrar janela de tratamento.',
      'dica_rapida', 'Bronzeado recente ou uso agressivo de ácidos em casa costuma postergar peeling — comente com franqueza.',
      'cta_text', 'Quero avaliar se peeling faz sentido para mim',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre black peel / peeling Hollywood. O resultado saiu no tom exploratório — quero marcar avaliação para ver indicação, preparo da pele e ritmo seguro.'
    )
  ),
  (
    'b1000192-0192-4000-8000-000000000192',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Pele pedindo renovação — cruzar objetivo com experiência e sensibilidade',
      'profile_summary', 'As respostas mostram incômodo mais definido (textura, manchas ou oleosidade) e alguma vivência com estética facial. Bom momento para alinhar tipo de peeling, número de sessões típicas e cuidados entre elas — sempre sem promessa de prazo milagroso.',
      'frase_identificacao', 'Se isso é você, já notou que “só skincare em casa” não resolve o que te incomoda no espelho.',
      'main_blocker', 'Escolher intensidade errada para a sua pele pode irritar mais do que renovar — por isso a sequência importa.',
      'consequence', 'Adiar conversa estruturada mantém o ciclo de produtos aleatórios e resultado irregular.',
      'growth_potential', 'Na mensagem, diga se tem acne inflamada ativa ou uso de isotretinoína no último ano — acelera triagem responsável.',
      'dica_rapida', 'Peeling profundo e sol não combinam na mesma janela — planeje fotoproteção séria se seguir em frente.',
      'cta_text', 'Quero alinhar peeling e cuidados na avaliação',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre peeling Hollywood / renovação facial; o perfil saiu moderado. Quero avaliação para definir tipo de peeling, preparo e frequência com vocês.'
    )
  ),
  (
    'b1000192-0192-4000-8000-000000000192',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Expectativa forte em renovação facial — evite improviso com ácidos ou combo em casa',
      'profile_summary', 'Pelas respostas, há intensidade na busca por mudança visível na pele. O passo seguro é avaliação prioritária: contraindicações, preparo e intervalo entre procedimentos precisam estar claros antes de qualquer peeling agressivo.',
      'frase_identificacao', 'Se te revês aqui, queres data e plano, não mais uma semana só a pesquisar no feed.',
      'main_blocker', 'Urgência sem método aumenta risco de hiperpigmentação pós-inflamatória ou barreira irritada.',
      'consequence', 'Agir no impulso com produtos fortes em casa pode piorar manchas ou sensibilidade.',
      'growth_potential', 'Peça encaixe e liste medicamentos, gestação ou lactação, e procedimentos recentes na face.',
      'dica_rapida', 'Uma sessão “forte” sem preparo costuma ser pior negócio que série moderada bem orientada.',
      'cta_text', 'Quero avaliação prioritária para peeling',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre black peel / peeling Hollywood; preciso de avaliação com prioridade para não improvisar. Qual o próximo horário disponível?'
    )
  ),

  (
    'b1000193-0193-4000-8000-000000000193',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Despigmentação no papel — entender possibilidades antes de prometer resultado',
      'profile_summary', 'Pelas respostas, há curiosidade ou incômodo leve com pigmento antigo ou tom desalinhado. Cada área (sobrancelha, lábio, corpo) responde a ritmos diferentes; a consulta traduz isso em expectativa realista.',
      'frase_identificacao', 'Se te identificas, queres sobretudo saber “o que dá para fazer” sem pressão.',
      'main_blocker', 'Comparar seu caso com foto alheia gera meta impossível — profundidade de pigmento e pele mudam tudo.',
      'consequence', 'Sem plano por fases, é fácil desistir cedo demais ou insistir em sessão inadequada.',
      'growth_potential', 'Leve fotos da região em luz neutra e idade aproximada do procedimento — acelera a conversa.',
      'dica_rapida', 'Bronzeado na área costuma atrasar várias abordagens — pergunte na clínica.',
      'cta_text', 'Quero avaliar despigmentação com calma',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre despigmentação (tatuagem/micro/lábios). O resultado saiu exploratório — quero marcar avaliação para entender possibilidades e limites no meu caso.'
    )
  ),
  (
    'b1000193-0193-4000-8000-000000000193',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Cor ou formato incomodando — protocolo costuma ser por etapas',
      'profile_summary', 'As respostas indicam desconforto claro com tom, borda ou arrependimento estético. Muitos planos misturam tecnologia, tempo de espera entre sessões e cuidados domiciliares — a profissional ajusta ao seu fototipo e histórico.',
      'frase_identificacao', 'Se isso é você, já evitou certas situações por causa da pigmentação.',
      'main_blocker', 'Expectativa de “sumir 100% rápido” colide com biologia do pigmento — frustra sem orientação.',
      'consequence', 'Remédios caseiros agressivos podem fixar mais pigmento ou cicatrizar.',
      'growth_potential', 'Na mensagem, diga se já tentou laser ou ácidos antes e como a pele reagiu.',
      'dica_rapida', 'Sobrancelha e lábio têm limites diferentes de pele larga no braço — confirme experiência da clínica na sua área.',
      'cta_text', 'Quero plano de despigmentação na consulta',
      'whatsapp_prefill', 'Oi! Fiz o questionário de despigmentação; o perfil saiu moderado. Quero avaliação para montar etapas, prazo realista e cuidados entre sessões.'
    )
  ),
  (
    'b1000193-0193-4000-8000-000000000193',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Alta carga emocional com pigmentação — priorize conversa franca e segura',
      'profile_summary', 'Pelas respostas, há intensidade na busca por correção (tom, remoção ou reversão de resultado artificial). Passo crítico: avaliação sem promessa vazia — entender risco, número de sessões possíveis e alternativas se uma via não responder.',
      'frase_identificacao', 'Se te revês aqui, o tema ocupa cabeça e autoimagem de verdade.',
      'main_blocker', 'Decidir sob pressão sem patch test ou histórico completo aumenta risco de piora.',
      'consequence', 'Sessões em sequência curta demais com técnica inadequada pode espessar cicatriz ou manchar mais.',
      'growth_potential', 'Peça horário prioritário e seja explícita sobre medicamentos e gestação — protege o plano.',
      'dica_rapida', 'Leve expectativa por escrito (3 frases) — ajuda a profissional a alinhar honestamente.',
      'cta_text', 'Quero avaliação prioritária (despigmentação)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre despigmentação/tatuagem/micro; preciso de avaliação prioritária. O resultado saiu urgente — há encaixe para conversar com a profissional?'
    )
  ),

  (
    'b1000194-0194-4000-8000-000000000194',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Clareamento em zona sensível — começar com critério e sem vergonha de perguntar',
      'profile_summary', 'Pelas respostas, o incômodo é leve ou preventivo. Ainda assim, axilas e regiões íntimas reagem mal a “fórmulas da internet”. Na avaliação você entende o que é fisiológico, o que é fricção e o que pode melhorar com protocolo suave.',
      'frase_identificacao', 'Se te identificas, queres orientação antes de comprar mais um creme aleatório.',
      'main_blocker', 'Esfoliação agressiva ou ácidos fortes sem supervisão costumam escurecer mais a longo prazo.',
      'consequence', 'Sem direção, o gasto com produtos errados soma e a pele pode ficar sensível.',
      'growth_potential', 'Pergunte na consulta sobre depilação, deodorante e atrito — são causas comuns.',
      'dica_rapida', 'Fotos são opcionais; o importante é você se sentir acolhida para falar de rotina.',
      'cta_text', 'Quero orientação sobre clareamento',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre clareamento (axilas/íntimo). O resultado saiu leve — quero marcar avaliação para entender o que faz sentido com segurança.'
    )
  ),
  (
    'b1000194-0194-4000-8000-000000000194',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Tom mais escuro incomodando — dá para combinar hábito e protocolo profissional',
      'profile_summary', 'As respostas mostram impacto moderado ou tentativas anteriores (cremes, salão ou caseiro). Clareamento gradual costuma unir ativos específicos, intervalo seguro e fotoproteção — sem promessa de tom “padrão de catálogo”.',
      'frase_identificacao', 'Se isso é você, já percebeu diferença de cor entre áreas e quer uniformizar.',
      'main_blocker', 'Misturar vários ácidos em casa comprocedimento na clínica na mesma semana irrita e mancha.',
      'consequence', 'Pausar tudo por vergonha atrasa o que poderia ser resolvido com calma em etapas.',
      'growth_potential', 'Digite na mensagem se há hormonais, gravidez recente ou atrito por atividade — contexto muda o plano.',
      'dica_rapida', 'Roupa apertada e suor constante contam — comente na consulta.',
      'cta_text', 'Quero avaliar clareamento na clínica',
      'whatsapp_prefill', 'Oi! Fiz o questionário de clareamento íntimo/axilas; o perfil saiu moderado. Quero avaliação para combinar protocolo e cuidados em casa com segurança.'
    )
  ),
  (
    'b1000194-0194-4000-8000-000000000194',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Autoestima muito afetada — peça acolhimento e plano claro na clínica',
      'profile_summary', 'Pelas respostas, o escurecimento já interfere em confiança, roupa ou momentos de proximidade. O próximo passo é conversa respeitosa com profissional: explicar limites, ritmo e sinais de que deve pausar — sempre priorizando saúde da mucosa e da pele fina.',
      'frase_identificacao', 'Se te revês aqui, não é “frescura” — é incômodo real que merece escuta técnica.',
      'main_blocker', 'Garantir resultado rápido a qualquer custo atrai ofertas arriscadas fora do perfil da sua pele.',
      'consequence', 'Adiar pode manter sofrimento desnecessário; agir sem critério pode piorar a barreira cutânea.',
      'growth_potential', 'Peça encaixe e diga qual área prioriza se houver mais de uma — reduz ansiedade na primeira ida.',
      'dica_rapida', 'Irritação ativa (ardor, feridas) precisa ser resolvida antes de clareamento ativo — avise na recepção.',
      'cta_text', 'Quero avaliação prioritária (clareamento)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre clareamento de axilas/íntimo; o resultado saiu com impacto alto na autoestima. Preciso de avaliação com prioridade — há horário com a profissional?'
    )
  );
