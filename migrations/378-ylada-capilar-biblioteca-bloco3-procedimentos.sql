-- Terapia capilar — Bloco 3: PROCEDIMENTOS / ESPECIALIDADES (premium + hub de escolha).
-- Templates b1000169–b1000177. Padrão intro + 5 perguntas + minScore 12/9/5/0.
-- @see src/config/pro-estetica-capilar-biblioteca.ts

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000169-0169-4000-8000-000000000169',
    'quiz_capilar_qual_terapia_hub',
    'diagnostico',
    $c169$
    {
      "title": "Qual terapia capilar pode fazer mais sentido para você agora?",
      "introTitle": "Micro, laser, LED, ozônio, argila… será que o melhor primeiro passo é conversar objetivo e sensibilidade do couro?",
      "introSubtitle": "Cinco perguntas sobre meta, histórico e ritmo; na avaliação presencial a profissional indica combinações seguras — este quiz organiza a conversa, não substitui indicação técnica nem avaliação médica quando couber.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Hoje você busca mais…", "type": "single", "options": ["Organizar rotina e produtos em casa", "Alívio ou equilíbrio do couro cabeludo", "Fortalecer fios ou preparar para química", "Resultado com apoio de tecnologias no salão"]},
        {"id": "q2", "text": "Seu couro costuma reagir a produto novo (ardor, coceira, vermelhidão)?", "type": "single", "options": ["Quase nunca", "Às vezes", "Frequentemente", "Tenho condição de pele acompanhada por médico"]},
        {"id": "q3", "text": "Você já fez microagulhamento, laser, LED ou ozônio no couro/cabelo?", "type": "single", "options": ["Nunca", "Uma ou duas vezes", "Várias vezes", "Faço protocolo com frequência"]},
        {"id": "q4", "text": "Sobre frequência no salão nas próximas semanas…", "type": "single", "options": ["Só quero uma avaliação primeiro", "Consigo 1 vez ao mês", "Consigo a cada 15 dias ou mais", "Depende da proposta técnica"]},
        {"id": "q5", "text": "Na primeira conversa, o que seria um bom resultado?", "type": "single", "options": ["Saber se preciso de tratamento", "Entender 1 a 2 opções com prós e contras", "Receber proposta com etapas (suave → intenso)", "Combinar técnicas em pacote com calendário"]}
      ],
      "results": [
        {"id": "r4", "label": "Perfil multi-tecnologia", "minScore": 12, "headline": "Seu relato pede conversa técnica sobre combinação e intervalo", "description": "Objetivo ambicioso com histórico de tecnologias pede ordem: o que entra primeiro, o que fica para depois e como respeitar recuperação do couro. Leve este resultado no WhatsApp para a profissional montar proposta sem empilhar tudo no mesmo dia."},
        {"id": "r3", "label": "Provável mix suave + tecnologia", "minScore": 9, "headline": "Há espaço para ritual (argila, óleos) e alguma tecnologia com critério", "description": "Suas respostas cabem em protocolo em camadas: base de couro e fio, depois estímulo direcionado. A escolha exata depende do aparelho da clínica e da avaliação — o quiz já qualifica sua intenção."},
        {"id": "r2", "label": "Entrada por avaliação", "minScore": 5, "headline": "O melhor próximo passo costuma ser avaliação antes de nomear procedimento", "description": "Ainda há dúvidas entre rotina, couro e tecnologia — normal. Na consulta dá para cruzar o que você quer com o que o fio aguenta hoje."},
        {"id": "r1", "label": "Prioridade educação", "minScore": 0, "headline": "Bom mapa para primeira conversa sem pressa de fechar pacote", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar meta realista e sensibilidade; depois a profissional sugere terapias com linguagem clara e intervalos seguros."}
      ],
      "ctaDefault": "Quero orientação sobre qual terapia faz sentido",
      "resultIntro": "Seu resultado:"
    }
    $c169$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000170-0170-4000-8000-000000000170',
    'quiz_capilar_microagulhamento',
    'diagnostico',
    $c170$
    {
      "title": "Microagulhamento capilar: faz sentido para o seu caso e para a sua expectativa?",
      "introTitle": "Você ouviu falar em micro para couro cabeludo: será que é prioridade antes de outras tecnologias?",
      "introSubtitle": "Cinco perguntas sobre sensibilidade, queda, medicação e medo; na presencial a profissional diz se há indicação, contraindicações e ritmo — procedimento é sempre decisão técnica presencial, não por quiz.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Seu couro hoje está mais…", "type": "single", "options": ["Tranquilo, sem lesão aparente", "Oleoso ou com caspa leve", "Irritado, ardendo ou muito sensível", "Com ferida, eczema ativo ou infecção recente (já tratada ou não)"]},
        {"id": "q2", "text": "Você usa anticoagulante, isotretinoína ou medicação que afeta pele (sem parar nada por conta própria)?", "type": "single", "options": ["Não uso", "Não sei dizer", "Uso algo — preciso avisar na consulta", "Uso e já sei que preciso de liberação médica"]},
        {"id": "q3", "text": "O que você espera do micro?", "type": "single", "options": ["Entender se serve para mim", "Melhorar absorção de ativos", "Estimular couro para queda ou falhas", "Resultado rápido com poucas sessões"]},
        {"id": "q4", "text": "Medo de dor, sangramento ou agulha?", "type": "single", "options": ["Tenho bastante medo", "Um pouco", "Tranquila desde que expliquem", "Não é problema"]},
        {"id": "q5", "text": "Quando pensa em começar?", "type": "single", "options": ["Só depois de conversar sem compromisso", "Nas próximas semanas se fizer sentido", "Já quero avaliar data", "Preciso comparar com outras clínicas"]}
      ],
      "results": [
        {"id": "r4", "label": "Checagem obrigatória", "minScore": 12, "headline": "Há pontos de atenção que precisam de conversa técnica (e possivelmente outro profissional)", "description": "Medicação, couro muito reativo ou expectativa muito acelerada pedem calma. Na avaliação a profissional explica o que é seguro, o que espera e o que não combina — sem pressão de procedimento."},
        {"id": "r3", "label": "Boa candidatura exploratória", "minScore": 9, "headline": "Perfil para entender indicação e sessões iniciais com critério", "description": "Suas respostas cabem em conversa sobre profundidade, intervalo entre sessões e combinação com ativos. Mande o resultado no WhatsApp para contextualizar sua chegada."},
        {"id": "r2", "label": "Ainda preparatório", "minScore": 5, "headline": "Talvez antes faça sentido acalmar o couro ou fortalecer o fio", "description": "Micro não substitui tratamento de base quando o couro está em alerta. Às vezes algumas semanas de protocolo suave abrem caminho com mais segurança."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para primeira consulta sobre micro", "description": "Com base nas suas respostas, o próximo passo costuma ser avaliação presencial com histórico sincero — para decidir juntas se entra micro, outra tecnologia ou fase preparatória."}
      ],
      "ctaDefault": "Quero saber se microagulhamento capilar combina comigo",
      "resultIntro": "Seu resultado:"
    }
    $c170$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000171-0171-4000-8000-000000000171',
    'quiz_capilar_laser',
    'diagnostico',
    $c171$
    {
      "title": "Laser capilar: o que você precisa alinhar antes de marcar?",
      "introTitle": "Laser no couro ou junto ao protocolo: será que sua dúvida é segurança, resultado ou frequência?",
      "introSubtitle": "Cinco perguntas sobre fototipo, sensibilidade e expectativa; na presencial a profissional explica aparelho, sessões e cuidados — sem promessa de crescimento garantido.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Sua pele no couro costuma…", "type": "single", "options": ["Bronzear fácil, raramente queima", "Bronzeia moderado", "Queima com sol", "Muito clara ou com manchas — já tive reação a luz"]},
        {"id": "q2", "text": "Expectativa principal com laser:", "type": "single", "options": ["Só entender como funciona", "Apoio a couro e metabolismo local", "Associar a queda ou falhas", "Substituir outros tratamentos"]},
        {"id": "q3", "text": "Você está com couro irritado, descamando forte ou em uso de ácido/roacutan na região?", "type": "single", "options": ["Não", "Leve", "Moderado", "Sim — preciso avisar na consulta"]},
        {"id": "q4", "text": "Sobre sessões e investimento…", "type": "single", "options": ["Quero uma avaliação primeiro", "Topo pacote se fizer sentido técnico", "Preciso de poucas sessões no começo", "Ainda não pensei em valor"]},
        {"id": "q5", "text": "Já fez laser capilar antes?", "type": "single", "options": ["Nunca", "Uma vez", "Várias", "Já fiz em outra área do corpo"]}
      ],
      "results": [
        {"id": "r4", "label": "Contraindicação possível até avaliar", "minScore": 12, "headline": "Fotossensibilidade ou expectativa muito ampla pedem conversa técnica fechada", "description": "Luz e medicamentos ou couro irritado não combinam sem liberação. Na consulta a profissional cruza equipamento, parâmetros e sua história — honestidade antes de agenda."},
        {"id": "r3", "label": "Bom perfil para proposta", "minScore": 9, "headline": "Há encaixe para explorar laser dentro de protocolo", "description": "Suas respostas cabem em explicação didática de objetivo, número de sessões e combinação com outros passos. Leve o resultado no WhatsApp."},
        {"id": "r2", "label": "Ainda educativo", "minScore": 5, "headline": "Vale esclarecer diferença entre laser, LED e outros estímulos", "description": "Nomes parecidos geram confusão. Uma conversa curta na clínica costuma alinhar o que cada um faz no seu caso."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para primeira conversa sobre laser", "description": "Com base nas suas respostas, o próximo passo costuma ser avaliação com protocolo escrito: o que fazer antes, entre e depois das sessões."}
      ],
      "ctaDefault": "Quero falar sobre laser capilar",
      "resultIntro": "Seu resultado:"
    }
    $c171$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000172-0172-4000-8000-000000000172',
    'quiz_capilar_led',
    'diagnostico',
    $c172$
    {
      "title": "LED no couro ou fios: combina com sensibilidade e com sua rotina?",
      "introTitle": "Luz LED costuma ser mais suave que outros estímulos: será que é um bom primeiro passo tecnológico para você?",
      "introSubtitle": "Cinco perguntas sobre sensibilidade, química recente e expectativa; na presencial a profissional encaixa LED no protocolo — resultado depende de continuidade e base de cuidado.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Seu couro está mais…", "type": "single", "options": ["Resistente e pouco reativo", "Sensível de vez em quando", "Sensível com frequência", "Muito irritado agora"]},
        {"id": "q2", "text": "Química ou descoloração nas últimas 4 semanas?", "type": "single", "options": ["Não", "Leve (tonalizante)", "Forte (luzes, descoloração)", "Processo em etapas ainda em curso"]},
        {"id": "q3", "text": "O que você espera do LED?", "type": "single", "options": ["Só relaxar e melhorar sensação do couro", "Apoio junto com máscaras e ativos", "Substituir outros tratamentos", "Resultado visível em poucas sessões"]},
        {"id": "q4", "text": "Consegue manter frequência sugerida nas primeiras semanas?", "type": "single", "options": ["Sim, flexível", "1 vez por semana", "A cada 15 dias", "Só quando der"]},
        {"id": "q5", "text": "Você já fez LED capilar antes?", "type": "single", "options": ["Nunca", "Poucas vezes", "Sim, gostei", "Sim, não notei diferença"]}
      ],
      "results": [
        {"id": "r4", "label": "Ajustar timing", "minScore": 12, "headline": "Couro irritado ou química muito recente pedem pausa antes de luz", "description": "LED costuma ser gentil, mas couro em crise pede primeiro acalmar. Na avaliação a profissional diz quando retomar estimulação com segurança."},
        {"id": "r3", "label": "Bom encaixe", "minScore": 9, "headline": "Perfil para LED como parte de protocolo", "description": "Suas respostas cabem em combinação LED + produtos + intervalo. Mande o resultado no WhatsApp para alinhar expectativa de sessões."},
        {"id": "r2", "label": "Exploratório", "minScore": 5, "headline": "Vale comparar LED com outras opções na mesma consulta", "description": "Às vezes LED entra como suporte, não como única peça. Uma conversa objetiva ajuda a não comparar com vídeo de internet."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre LED", "description": "Com base nas suas respostas, o próximo passo costuma ser definir objetivo (couro, absorção, sensação) e frequência realista com a profissional."}
      ],
      "ctaDefault": "Quero saber se LED capilar é para mim",
      "resultIntro": "Seu resultado:"
    }
    $c172$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000173-0173-4000-8000-000000000173',
    'quiz_capilar_ozonioterapia',
    'diagnostico',
    $c173$
    {
      "title": "Ozonioterapia capilar: alinhar expectativa antes de fechar sessões",
      "introTitle": "Ozônio no protocolo capilar: você busca higiene do couro, sensação de leveza ou apoio a outros tratamentos?",
      "introSubtitle": "Cinco perguntas sobre sensibilidade, química e confiança em procedimentos; na presencial a profissional explica técnica, segurança e combinações — sem promessa terapêutica genérica.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "O que mais te atrai no ozônio (pelo que você ouviu)?", "type": "single", "options": ["Limpeza profunda do couro", "Sensação de leveza", "Apoio junto com queda ou oleosidade", "Não sei — quero explicação honesta"]},
        {"id": "q2", "text": "Tem alergia respiratória forte, asma descontrolada ou gravidez (avisar sempre na consulta)?", "type": "single", "options": ["Não / não se aplica", "Tenho algo — aviso na recepção", "Prefiro só conversar antes", "Grávida ou amamentando — quero orientação profissional"]},
        {"id": "q3", "text": "Couro com ferida aberta, muito irritado ou infecção recente?", "type": "single", "options": ["Não", "Leve", "Moderado", "Sim — preciso de avaliação presencial primeiro"]},
        {"id": "q4", "text": "Expectativa de resultado:", "type": "single", "options": ["Entender se combina comigo", "Melhora gradual com sessões", "Mudança rápida", "Combinar com outras terapias da clínica"]},
        {"id": "q5", "text": "Já fez ozônio capilar antes?", "type": "single", "options": ["Nunca", "Uma vez", "Várias vezes", "Só em outras regiões / estética"]}
      ],
      "results": [
        {"id": "r4", "label": "Triagem presencial", "minScore": 12, "headline": "Contexto de saúde ou couro reativo pede conversa fechada antes de protocolo", "description": "Ozônio exige critério com irritação ativa e histórico pessoal. Na clínica a profissional decide o que é seguro e o que fica para depois — sem improviso."},
        {"id": "r3", "label": "Boa continuidade", "minScore": 9, "headline": "Perfil para explorar ozônio dentro de plano", "description": "Suas respostas cabem em combinação com limpeza, máscaras ou outras tecnologias. Leve o resultado no WhatsApp para alinhar primeira sessão."},
        {"id": "r2", "label": "Educar primeiro", "minScore": 5, "headline": "Vale esclarecer o que o ozônio faz e o que não faz no seu caso", "description": "Expectativa alinhada evita frustração. Uma consulta didática costuma bastar para decidir se entra no pacote."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre ozônio", "description": "Com base nas suas respostas, o próximo passo costuma ser avaliação com explicação de técnica, intervalo e cuidados pós-sessão."}
      ],
      "ctaDefault": "Quero falar sobre ozonioterapia capilar",
      "resultIntro": "Seu resultado:"
    }
    $c173$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000174-0174-4000-8000-000000000174',
    'quiz_capilar_argila_blend_oleos',
    'diagnostico',
    $c174$
    {
      "title": "Argilaterapia e blend de óleos: ritual para couro e fios — faz sentido para você?",
      "introTitle": "Argila, óleos e massagem: será que você busca sensorial, alívio no couro ou preparo antes de tecnologia?",
      "introSubtitle": "Cinco perguntas sobre oleosidade, sensibilidade e tempo; na presencial a profissional escolhe tipo de argila, diluição e óleos — ritual errado pode pesar no couro.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Seu couro hoje está mais…", "type": "single", "options": ["Equilibrado", "Oleoso na raiz", "Ressecado ou repuxando", "Sensível ou irritado"]},
        {"id": "q2", "text": "Você gosta de etapas com cheiro, textura e tempo de pausa na cadeira?", "type": "single", "options": ["Adoro", "Gosto se for objetivo", "Prefiro rápido", "Tenho alergia a perfume — aviso na consulta"]},
        {"id": "q3", "text": "Óleo em casa: como você usa?", "type": "single", "options": ["Quase nunca", "Só nas pontas", "Na raiz com frequência", "Misturo vários sem critério"]},
        {"id": "q4", "text": "Objetivo principal com ritual:", "type": "single", "options": ["Relaxar e desacelerar", "Melhorar sensação do couro", "Dar brilho e maciez", "Preparar para outro procedimento no mesmo dia"]},
        {"id": "q5", "text": "Já fez argilaterapia capilar antes?", "type": "single", "options": ["Nunca", "Uma vez", "Várias vezes", "Tive reação — quero reavaliar com profissional"]}
      ],
      "results": [
        {"id": "r4", "label": "Personalização obrigatória", "minScore": 12, "headline": "Oleosidade alta ou couro reativo pedem escolha fina de argila e óleo", "description": "Ritual bonito pode piorar se a base for errada. Na avaliação a profissional monta fórmula e tempo seguros — o quiz só organiza o que contar na chegada."},
        {"id": "r3", "label": "Ótimo perfil ritual", "minScore": 9, "headline": "Há encaixe para argila + blend com critério técnico", "description": "Suas respostas cabem em sessão sensorial com objetivo (couro, brilho ou preparo). Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Exploratório", "minScore": 5, "headline": "Talvez começar por avaliação curta e uma sessão teste", "description": "Quem tem pressa ou pele reativa costuma ganhar mais com uma prova controlada do que com pacote fechado no escuro."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre argila e óleos", "description": "Com base nas suas respostas, o próximo passo costuma ser definir se o foco é couro, comprimento ou preparo — e ajustar texturas ao seu perfil."}
      ],
      "ctaDefault": "Quero argilaterapia ou blend de óleos na clínica",
      "resultIntro": "Seu resultado:"
    }
    $c174$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000175-0175-4000-8000-000000000175',
    'quiz_capilar_alta_frequencia',
    'diagnostico',
    $c175$
    {
      "title": "Alta frequência no couro: o que alinhar antes de experimentar?",
      "introTitle": "Viu alta frequência em vídeo e quer saber se combina com oleosidade, folículo ou sensação de \"couro vivo\"?",
      "introSubtitle": "Cinco perguntas sobre metal no corpo, pele sensível e expectativa; na presencial a profissional explica uso capilar e contraindicações — aparelho exige critério, não moda.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Você tem marca-passo, metal importante ou gravidez (sempre avisar na consulta)?", "type": "single", "options": ["Não / não se aplica", "Tenho metal — aviso na recepção", "Grávida ou suspeita", "Não sei — preciso perguntar na clínica"]},
        {"id": "q2", "text": "Seu couro costuma…", "type": "single", "options": ["Aceitar estímulos sem reação", "Ficar avermelhado leve e passa", "Reagir forte a atrito ou calor", "Está irritado neste momento"]},
        {"id": "q3", "text": "O que você espera da alta frequência?", "type": "single", "options": ["Só entender o que é", "Sensação de limpeza ou leveza", "Apoio a oleosidade ou folículo", "Substituir tratamentos médicos"]},
        {"id": "q4", "text": "Já fez alta frequência na pele ou couro?", "type": "single", "options": ["Nunca", "Uma vez", "Várias vezes", "Tive desconforto"]},
        {"id": "q5", "text": "Frequência no salão nas próximas semanas?", "type": "single", "options": ["Só avaliação", "1 sessão teste", "Pacote se fizer sentido", "Depende de explicação técnica"]}
      ],
      "results": [
        {"id": "r4", "label": "Triagem", "minScore": 12, "headline": "Metal, gravidez ou couro irritado mudam a decisão — conversa presencial primeiro", "description": "Alta frequência tem contraindicações clássicas. Na clínica a profissional confirma o que é seguro para você; o quiz não libera procedimento."},
        {"id": "r3", "label": "Explorar com critério", "minScore": 9, "headline": "Perfil para testar em sessão curta dentro de protocolo", "description": "Suas respostas cabem em explicação + aplicação supervisionada. Leve o resultado no WhatsApp."},
        {"id": "r2", "label": "Educar", "minScore": 5, "headline": "Vale diferenciar alta frequência de outras tecnologias", "description": "Expectativa certa evita comparar com laser ou micro. Uma conversa objetiva resolve."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre alta frequência", "description": "Com base nas suas respostas, o próximo passo costuma ser avaliação com checklist de segurança e demonstração do que você vai sentir."}
      ],
      "ctaDefault": "Quero saber sobre alta frequência capilar",
      "resultIntro": "Seu resultado:"
    }
    $c175$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000176-0176-4000-8000-000000000176',
    'quiz_capilar_detox_profundo_salao',
    'diagnostico',
    $c176$
    {
      "title": "Detox profundo no salão: quando faz sentido ir além do shampoo de casa?",
      "introTitle": "Build-up, oleosidade persistente ou sensação de cabelo \"nunca limpo\": será que você precisa de protocolo profissional em etapas?",
      "introSubtitle": "Cinco perguntas sobre acúmulo de produto, química e frequência; na presencial a profissional monta detox em camadas — profundo não é sinônimo de agressivo.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Mesmo lavando, o cabelo fica…", "type": "single", "options": ["Limpo e leve", "Oleoso na raiz rápido", "Pesado ou encerado", "Repuxando e ressecado ao mesmo tempo"]},
        {"id": "q2", "text": "Camadas de leave-in, óleo, cera ou spray secos na semana?", "type": "single", "options": ["Pouco", "Moderado", "Muito", "Muitas camadas no mesmo dia"]},
        {"id": "q3", "text": "Química ou progressiva nos últimos meses?", "type": "single", "options": ["Não", "Leve", "Forte", "Vários processos"]},
        {"id": "q4", "text": "Expectativa do \"detox profundo\"…", "type": "single", "options": ["Só sensação de limpo", "Preparar para coloração", "Reduzir oleosidade de verdade", "Resolver coceira ou dermatite (sei que pode precisar de outro olhar)"]},
        {"id": "q5", "text": "Couro com ferida, muito ardido ou tratamento dermatológico ativo?", "type": "single", "options": ["Não", "Leve", "Moderado", "Sim — prioridade é avaliação presencial"]}
      ],
      "results": [
        {"id": "r4", "label": "Protocolo sob supervisão", "minScore": 12, "headline": "Acúmulo + sintomas no couro pedem ordem: às vezes médico antes, às vezes salão primeiro", "description": "Detox agressivo com couro reativo piora o quadro. Na clínica a profissional separa o que é build-up do que é desequilíbrio — com segurança."},
        {"id": "r3", "label": "Boa candidatura salão", "minScore": 9, "headline": "Há espaço para limpeza em etapas e máscaras corretivas", "description": "Suas respostas cabem em sessão estruturada + manutenção em casa. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Ajuste leve", "minScore": 5, "headline": "Talvez bastem clarifying espaçado e revisão de finalização", "description": "Nem todo cabelo pesado precisa de mega protocolo. Vale conversar antes de fechar pacote grande."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre detox profissional", "description": "Com base nas suas respostas, o próximo passo costuma ser definir o que é produto, o que é couro e o que é química — para não misturar soluções."}
      ],
      "ctaDefault": "Quero detox profundo capilar no salão",
      "resultIntro": "Seu resultado:"
    }
    $c176$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000177-0177-4000-8000-000000000177',
    'quiz_capilar_terapia_combinada',
    'diagnostico',
    $c177$
    {
      "title": "Terapia combinada: como empilhar etapas sem sobrecarregar couro e fio?",
      "introTitle": "Quer resultado mais rápido combinando tecnologias e rituais: será que o risco é misturar demais no mesmo dia?",
      "introSubtitle": "Cinco perguntas sobre tempo, sensibilidade e objetivo; na presencial a profissional desenha sequência (o que vem primeiro, intervalo, recuperação) — combinação boa é a que respeita o seu teto de tolerância.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Você imagina uma sessão com…", "type": "single", "options": ["Uma etapa só, bem feita", "Duas etapas (ex.: limpeza + máscara)", "Três ou mais (ritual + tecnologia)", "O que a profissional indicar — topo tudo se for seguro"]},
        {"id": "q2", "text": "Depois de tratamentos fortes no passado, seu couro costuma…", "type": "single", "options": ["Recuperar rápido", "Ficar sensível um ou dois dias", "Reagir vários dias", "Nunca fiz nada intenso"]},
        {"id": "q3", "text": "Principal objetivo agora:", "type": "single", "options": ["Manutenção leve", "Corrigir couro e fio ao mesmo tempo", "Potencializar crescimento ou fortalecimento", "Máximo resultado estético em pouco tempo"]},
        {"id": "q4", "text": "Sobre agenda e investimento…", "type": "single", "options": ["Prefiro ir devagar", "Posso 1 sessão completa por mês", "Posso ritmo mais fechado", "Flexível se o plano for claro"]},
        {"id": "q5", "text": "Já sentiu \"cabelo chocado\" depois de salão que fez muita coisa junto?", "type": "single", "options": ["Nunca", "Uma vez", "Várias vezes", "Por isso quero orientação"]}
      ],
      "results": [
        {"id": "r4", "label": "Plano em camadas obrigatório", "minScore": 12, "headline": "Muita intensidade no mesmo dia pode anular resultado", "description": "Combinação precisa de ordem e recuperação. Na avaliação a profissional propõe fases: semana 1, 2 e 3 — com transparência de custo e tempo."},
        {"id": "r3", "label": "Bom candidato a combo", "minScore": 9, "headline": "Há espaço para protocolo combinado com critério", "description": "Suas respostas cabem em 2 ou 3 frentes coordenadas. Leve o resultado no WhatsApp para montar proposta."},
        {"id": "r2", "label": "Começar enxuto", "minScore": 5, "headline": "Menos etapas bem escolhidas costumam render mais que cardápio longo", "description": "Às vezes uma base forte de couro libera tecnologia depois com mais segurança."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre terapia combinada", "description": "Com base nas suas respostas, o próximo passo costuma ser priorizar uma queixa principal e encaixar o restante como apoio — sem promessa de atalho."}
      ],
      "ctaDefault": "Quero um plano de terapia combinada",
      "resultIntro": "Seu resultado:"
    }
    $c177$::jsonb,
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

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Qual terapia capilar faz sentido para mim?', 'Hub: meta, sensibilidade e ritmo — abre conversa técnica.', 'Indecisão entre procedimentos', 'Avaliação e proposta', 'custom', 'b1000169-0169-4000-8000-000000000169'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_qual_terapia_hub", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 430, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000169-0169-4000-8000-000000000169');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Microagulhamento capilar: combina comigo?', 'Sensibilidade, expectativa e medicação — triagem honesta.', 'Dúvida sobre micro', 'Indicação e segurança', 'custom', 'b1000170-0170-4000-8000-000000000170'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_microagulhamento", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 431, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000170-0170-4000-8000-000000000170');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Laser capilar: o que alinhar antes de marcar', 'Fototipo, couro e expectativa — sem promessa vazia.', 'Dúvida sobre laser', 'Protocolo com critério', 'custom', 'b1000171-0171-4000-8000-000000000171'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_laser", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 432, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000171-0171-4000-8000-000000000171');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'LED capilar: combina com sensibilidade e rotina?', 'Química recente, expectativa e frequência.', 'Dúvida sobre LED', 'Protocolo suave + continuidade', 'custom', 'b1000172-0172-4000-8000-000000000172'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_led", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 433, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000172-0172-4000-8000-000000000172');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Ozonioterapia capilar: expectativa e segurança', 'Contexto de saúde, couro e combinações.', 'Dúvida sobre ozônio', 'Proposta técnica clara', 'custom', 'b1000173-0173-4000-8000-000000000173'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_ozonioterapia", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 434, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000173-0173-4000-8000-000000000173');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Argilaterapia e blend de óleos', 'Oleosidade, sensorial e preparo para outras etapas.', 'Ritual sem critério', 'Argila e óleos adequados', 'custom', 'b1000174-0174-4000-8000-000000000174'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_argila_blend_oleos", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 435, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000174-0174-4000-8000-000000000174');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Alta frequência capilar: segurança e expectativa', 'Metal, gravidez, couro — checklist antes da sessão.', 'Dúvida sobre alta frequência', 'Triagem e sessão teste', 'custom', 'b1000175-0175-4000-8000-000000000175'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_alta_frequencia", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 436, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000175-0175-4000-8000-000000000175');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Detox profundo no salão', 'Build-up, química e quando não forçar o couro.', 'Cabelo nunca limpo', 'Protocolo profissional em etapas', 'custom', 'b1000176-0176-4000-8000-000000000176'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_detox_profundo_salao", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 437, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000176-0176-4000-8000-000000000176');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Terapia combinada sem sobrecarga', 'Ordem, recuperação e objetivo — plano em fases.', 'Quer tudo junto', 'Combo seguro e realista', 'custom', 'b1000177-0177-4000-8000-000000000177'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_terapia_combinada", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 438, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000177-0177-4000-8000-000000000177');
