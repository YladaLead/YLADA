-- =====================================================
-- Pro Estética corporal: 10 quizzes por técnica/tema (drenagem, modeladora, criolipo, RF, ultrassom,
-- lipocavitação, endermologia, celulite+flacidez, gordura localizada, detox corporal).
-- Templates b1000142–b1000151. Idempotente (ON CONFLICT + WHERE NOT EXISTS nos itens).
-- @see src/config/pro-estetica-corporal-biblioteca.ts
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000142-0142-4000-8000-000000000142',
    'quiz_drenagem_linfatica_indicacao_corporal',
    'diagnostico',
    $t142$
    {
      "title": "Drenagem linfática: faz sentido para o seu corpo agora?",
      "introTitle": "Pernas pesadas ou inchadas: será que a drenagem combina comigo?",
      "introSubtitle": "Cinco perguntas para organizar o que contar na avaliação; na presencial a profissional indica se faz sentido no seu caso e em que ritmo.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "O que mais descreve o que você sente hoje?", "type": "single", "options": ["Pernas pesadas ou inchaço ao fim do dia", "Abdômen ou corpo “inchado” com frequência", "Recuperação pós-procedimento (com orientação médica)", "Curiosidade: quero entender se drenagem combina comigo"]},
        {"id": "q2", "text": "Após muitas horas sentada, isso costuma…", "type": "single", "options": ["Piorar bastante", "Piorar um pouco", "Mudar pouco", "Não noto diferença"]},
        {"id": "q3", "text": "Sono e água no dia a dia…", "type": "single", "options": ["Consistentes e razoáveis", "Um dos dois falha bastante", "Os dois irregulares", "Não sei avaliar"]},
        {"id": "q4", "text": "Você já fez drenagem linfática antes?", "type": "single", "options": ["Nunca", "Poucas vezes", "Sim, com regularidade", "Estou em acompanhamento"]},
        {"id": "q5", "text": "Nas próximas semanas, sua prioridade seria…", "type": "single", "options": ["Só sensação de leveza", "Leveza + combinar com outro protocolo", "Orientação antes de fechar pacote", "Definir frequência com a profissional"]}
      ],
      "results": [
        {"id": "r4", "label": "Indicação forte", "minScore": 11, "headline": "Há bastante encaixe com conversa sobre drenagem", "description": "Suas respostas sugerem incômodo com peso/inchaço ou rotina que piora ao longo do dia — tópicos que muitas vezes a profissional avalia junto com drenagem e hábitos. Na consulta, peça: se há contraindicações no seu caso, frequência sugerida e o que observar nas primeiras sessões. Próximo passo: envie este resultado e peça o primeiro horário."},
        {"id": "r3", "label": "Boa candidatura", "minScore": 8, "headline": "Faz sentido explorar drenagem com critério", "description": "Há sinais de que drenagem pode entrar no plano, sozinha ou combinada, conforme avaliação. Leve à consulta o que piora (pernas, abdômen, rotina) e pergunte como medir sensação de melhora sem promessa de prazo milagroso."},
        {"id": "r2", "label": "Explorar", "minScore": 4, "headline": "Ainda dá para clarificar com a esteticista", "description": "Suas respostas misturam curiosidade e outros focos — comum. Peça uma avaliação para ver se drenagem entra como base, complemento ou não é prioridade agora."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Primeiro passo: conversa guiada", "description": "O melhor caminho depende de histórico e exame presencial. Use este quiz como roteiro do que mencionar na marcação — a profissional indica se drenagem é adequada e em que ritmo."}
      ],
      "ctaDefault": "Quero falar sobre drenagem na avaliação",
      "resultIntro": "Seu resultado:"
    }
    $t142$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000143-0143-4000-8000-000000000143',
    'quiz_massagem_modeladora_expectativa_corporal',
    'diagnostico',
    $t143$
    {
      "title": "Massagem modeladora: expectativa realista para o seu caso?",
      "introTitle": "Contorno e massagem firme: faz sentido na sua rotina?",
      "introSubtitle": "Cinco perguntas para alinhar expectativa antes de fechar pacote; na consulta vocês definem pressão, frequência e combinações seguras.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "Seu foco principal hoje é…", "type": "single", "options": ["Contorno (abdômen, culote, flancos)", "Textura da pele junto com contorno", "Só relaxamento, sem foco em medida", "Ainda estou definindo"]},
        {"id": "q2", "text": "Com que frequência você conseguiria ir ao salão?", "type": "single", "options": ["1x por semana ou mais", "A cada 15 dias", "1x ao mês", "Ainda não sei"]},
        {"id": "q3", "text": "Pressão firme na massagem…", "type": "single", "options": ["Gosto ou tolero bem", "Prefiro média", "Prefiro suave", "Tenho dúvida"]},
        {"id": "q4", "text": "Sobre resultado rápido, você está mais…", "type": "single", "options": ["Quero ver mudança nas primeiras semanas (realista)", "Posso acompanhar 2–3 meses", "Priorizo consistência sem pressa", "Só quero orientação"]},
        {"id": "q5", "text": "Tecnologia no mesmo plano (cavitação, RF, etc.)…", "type": "single", "options": ["Já uso ou quero combinar", "Talvez depois da massagem", "Prefiro só mãos por agora", "Quero que a profissional decida comigo"]}
      ],
      "results": [
        {"id": "r4", "label": "Plano ativo", "minScore": 11, "headline": "Bom perfil para conversa sobre modeladora + sequência", "description": "Há foco em zona, frequência possível e abertura para combinar. Na consulta, peça ordem segura entre massagem e tecnologia, e como avaliar evolução (sensação, fotos padronizadas ou medidas). Próximo passo: agende avaliação com este resultado."},
        {"id": "r3", "label": "Equilíbrio", "minScore": 8, "headline": "Modeladora pode entrar com expectativa alinhada", "description": "Suas respostas permitem discutir modeladora com metas claras e ritmo realista. Combine com a profissional o que fazer entre sessões."},
        {"id": "r2", "label": "A definir", "minScore": 4, "headline": "Falta fechar prioridade e ritmo", "description": "Ainda há variáveis (frequência, pressão ou foco). Uma avaliação costuma destravar o plano certo — leve este resumo."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Comece pela conversa", "description": "Modeladora rende mais com expectativa alinhada. Peça explicação didática na primeira consulta."}
      ],
      "ctaDefault": "Quero alinhar modeladora na avaliação",
      "resultIntro": "Seu resultado:"
    }
    $t143$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000144-0144-4000-8000-000000000144',
    'quiz_criolipolise_prontidao_corporal',
    'diagnostico',
    $t144$
    {
      "title": "Criolipólise: você está no ponto de conversar com segurança?",
      "introTitle": "Frio na zona certa: será que faz sentido para mim?",
      "introSubtitle": "Cinco perguntas para organizar o que levar à avaliação; na presencial você confere com a profissional o que é indicado para o seu caso.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "Seu objetivo principal com criolipólise é…", "type": "single", "options": ["Reduzir gordura localizada numa zona", "Refinar contorno já trabalhado com hábitos", "Ainda estou pesquisando", "Vi resultado em outra pessoa e quero avaliar se cabe em mim"]},
        {"id": "q2", "text": "Sobre sensibilidade ao frio ou circulação…", "type": "single", "options": ["Tenho condição ou histórico que preciso avisar (só na consulta)", "Sinto frio com facilidade", "Tolerância normal", "Nunca pensei nisso"]},
        {"id": "q3", "text": "Expectativa de tempo para ver mudança…", "type": "single", "options": ["Semanas", "1–3 meses", "Flexível", "Quero prazo exato (vou alinhar na consulta)"]},
        {"id": "q4", "text": "Massagem ou drenagem no mesmo período…", "type": "single", "options": ["Quero que a profissional defina o que combina", "Já combino com orientação", "Prefiro só crio por agora", "Não sei"]},
        {"id": "q5", "text": "Próximo passo que faz mais sentido para você…", "type": "single", "options": ["Avaliação presencial", "Tirar dúvidas por mensagem com contexto", "Comparar com outra tecnologia antes", "Só pesquisa por enquanto"]}
      ],
      "results": [
        {"id": "r4", "label": "Alta intenção", "minScore": 11, "headline": "Leve perguntas objetivas à consulta", "description": "Você já tem foco e expectativa — falta validar pele, zona e saúde na presencial. Peça: quantas sessões fazem sentido no seu caso, intervalos e o que não misturar no mesmo dia. Próximo passo: marque avaliação."},
        {"id": "r3", "label": "Bom encaminhamento", "minScore": 8, "headline": "Criolipólise pode ser tema central na conversa", "description": "Há encaixe para explorar indicação, alternativas e combinação com massagem/drenagem conforme protocolo da clínica."},
        {"id": "r2", "label": "Exploratório", "minScore": 4, "headline": "Ainda há dúvidas — normal", "description": "Use o resultado para listar perguntas na consulta: frio, sensibilidade, prazo e custo-benefício frente a outras opções."},
        {"id": "r1", "label": "Início", "minScore": 0, "headline": "Primeiro passo: informação com profissional", "description": "Decisão segura é sempre presencial. Este quiz ajuda a estruturar o que você vai perguntar."}
      ],
      "ctaDefault": "Quero avaliar criolipólise na clínica",
      "resultIntro": "Seu resultado:"
    }
    $t144$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000145-0145-4000-8000-000000000145',
    'quiz_radiofrequencia_corporal_protocolo',
    'diagnostico',
    $t145$
    {
      "title": "Radiofrequência corporal: firmeza, textura ou combinação?",
      "introTitle": "Calor na pele com objetivo: será que a radiofrequência corporal cabe em mim?",
      "introSubtitle": "Cinco perguntas para mapear foco e sensibilidade antes da avaliação; na presencial a profissional fecha protocolo e sessões.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "O que você mais quer melhorar com RF corporal?", "type": "single", "options": ["Firmeza da pele", "Textura / aspecto da pele", "Contorno com apoio de outras etapas", "Ainda não sei explicar"]},
        {"id": "q2", "text": "Sua pele costuma…", "type": "single", "options": ["Marcar ou ficar vermelha com facilidade", "Reagir normalmente", "Ser espessa ou pouco sensível", "Varia muito por zona"]},
        {"id": "q3", "text": "Sensação a calor no corpo…", "type": "single", "options": ["Incomoda rápido", "Tolerável", "Costumo tolerar bem", "Nunca fiz nada com calor"]},
        {"id": "q4", "text": "Frequência de idas ao salão que seria realista…", "type": "single", "options": ["Semanal", "Quinzenal", "Mensal", "A definir"]},
        {"id": "q5", "text": "Combinar com massagem ou drenagem…", "type": "single", "options": ["Quero plano integrado", "Só RF por agora", "Depende da avaliação", "Já combino e quero otimizar"]}
      ],
      "results": [
        {"id": "r4", "label": "Perfil definido", "minScore": 11, "headline": "Bom mapa para propor RF com sequência", "description": "Leve à consulta zona, sensibilidade e ritmo possível. Peça critérios de melhora e intervalo entre sessões."},
        {"id": "r3", "label": "Encaminhamento", "minScore": 8, "headline": "RF entra como hipótese forte", "description": "Há foco e tolerância razoável para conversar sobre parâmetros e combinações seguras."},
        {"id": "r2", "label": "Explorar", "minScore": 4, "headline": "A avaliação vai direcionar", "description": "Ainda há dúvidas sobre zona ou sensibilidade — perfeito para primeira consulta."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Comece pelo básico", "description": "Peça explicação em linguagem simples do que é RF corporal e o que esperar nas primeiras sessões."}
      ],
      "ctaDefault": "Quero falar sobre radiofrequência na avaliação",
      "resultIntro": "Seu resultado:"
    }
    $t145$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000146-0146-4000-8000-000000000146',
    'quiz_ultrassom_corporal_foco_corporal',
    'diagnostico',
    $t146$
    {
      "title": "Ultrassom corporal: onde entra no seu objetivo?",
      "introTitle": "Ultrassom corporal: será que é o próximo passo para a sua zona?",
      "introSubtitle": "Cinco perguntas para separar curiosidade de prioridade; na consulta vocês veem se encaixa com seu objetivo e pele.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "Você busca ultrassom corporal mais para…", "type": "single", "options": ["Apoio a contorno / localizado", "Textura ou sensação na pele", "Combinar com outra tecnologia", "Entender se faz sentido no meu caso"]},
        {"id": "q2", "text": "A zona que mais te incomoda…", "type": "single", "options": ["Abdômen", "Culote/coxas", "Braços ou costas", "Várias áreas"]},
        {"id": "q3", "text": "Já fez ultrassom focal ou cavitação antes?", "type": "single", "options": ["Sim, com acompanhamento", "Uma vez", "Nunca", "Não sei dizer o nome do aparelho"]},
        {"id": "q4", "text": "Sobre tolerância a barulho/vibração na sessão…", "type": "single", "options": ["Muito sensível", "Normal", "Pouco sensível", "Nunca experimentei"]},
        {"id": "q5", "text": "Próximo passo desejado…", "type": "single", "options": ["Avaliação presencial", "Comparar com criolipo ou RF", "Montar pacote com massagem", "Só tirar dúvidas"]}
      ],
      "results": [
        {"id": "r4", "label": "Foco claro", "minScore": 11, "headline": "Leve zona e objetivo à consulta", "description": "Suas respostas ajudam a profissional a sugerir sequência e frequência. Pergunte o que medir nas primeiras semanas."},
        {"id": "r3", "label": "Direção boa", "minScore": 8, "headline": "Ultrassom pode ser peça do plano", "description": "Há encaixe para discutir ultrassom com critério e possível combinação com outras etapas."},
        {"id": "r2", "label": "A clarificar", "minScore": 4, "headline": "Avaliação vai priorizar", "description": "Normalize dúvidas: a escolha depende de pele, equipamento e objetivo. Use este resultado como lista de tópicos."},
        {"id": "r1", "label": "Início", "minScore": 0, "headline": "Primeiro conto com a clínica", "description": "Peça explicação didática das opções e contraindicações no seu caso."}
      ],
      "ctaDefault": "Quero avaliar ultrassom corporal",
      "resultIntro": "Seu resultado:"
    }
    $t146$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000147-0147-4000-8000-000000000147',
    'quiz_lipocavitacao_indicacao_corporal',
    'diagnostico',
    $t147$
    {
      "title": "Lipocavitação: indicação e expectativa para o seu perfil?",
      "introTitle": "Cavitação e contorno: vale a pena levar isso na consulta?",
      "introSubtitle": "Cinco perguntas sobre zona, pele e expectativa; na presencial a profissional indica se lipocavitação entra no seu plano.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "Seu interesse em lipocavitação vem mais de…", "type": "single", "options": ["Gordura localizada visível", "Complementar dieta e exercício", "Indicação após avaliação anterior", "Curiosidade após ver resultado de outras pessoas"]},
        {"id": "q2", "text": "Pele na zona de interesse…", "type": "single", "options": ["Sensível ou com histórico de reação", "Normal", "Resistente", "Tenho dúvida"]},
        {"id": "q3", "text": "Expectativa de resultado…", "type": "single", "options": ["Quero alinhar expectativa na consulta", "Moderada em algumas semanas", "Flexível com consistência", "Muito alta — preciso ouvir limites na consulta"]},
        {"id": "q4", "text": "No mesmo período, massagem modeladora ou drenagem…", "type": "single", "options": ["Quero plano combinado se fizer sentido", "Só cavitação por agora", "Decido com a profissional", "Já combino"]},
        {"id": "q5", "text": "Próximo passo…", "type": "single", "options": ["Marcar avaliação", "Enviar fotos ou medidas (se a clínica pedir)", "Comparar com criolipo", "Só pesquisa"]}
      ],
      "results": [
        {"id": "r4", "label": "Alto encaixe", "minScore": 11, "headline": "Bom momento para avaliação técnica", "description": "Leve objetivo, zona e histórico de pele à conversa. Peça intervalo sugerido e sinais de alerta."},
        {"id": "r3", "label": "Promissor", "minScore": 8, "headline": "Lipocavitação pode ser discutida com base", "description": "Há foco e expectativa que cabem em plano realista com acompanhamento profissional."},
        {"id": "r2", "label": "Explorar", "minScore": 4, "headline": "A consulta vai filtrar", "description": "Ainda há variáveis — peça comparação honesta entre tecnologias e massagem."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Informação primeiro", "description": "Use o resultado para agendar conversa sem compromisso longo."}
      ],
      "ctaDefault": "Quero falar sobre lipocavitação na clínica",
      "resultIntro": "Seu resultado:"
    }
    $t147$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000148-0148-4000-8000-000000000148',
    'quiz_endermologia_celulite_corporal',
    'diagnostico',
    $t148$
    {
      "title": "Endermologia: textura, circulação ou contorno em primeiro lugar?",
      "introTitle": "Celulite e sucção: será que a endermologia é o caminho para mim?",
      "introSubtitle": "Cinco perguntas para levar sensações e rotina à avaliação; na consulta vocês alinham frequência e combinações.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "O que mais te incomoda na região de interesse?", "type": "single", "options": ["Aspecto “ondulado” da pele", "Sensação de peso ou inchaço", "Os dois", "Quero contorno mais definido"]},
        {"id": "q2", "text": "Marcas ou sensibilidade à sucção/rolagem…", "type": "single", "options": ["Tenho receio — vou falar na consulta", "Moderada", "Baixa", "Nunca fiz"]},
        {"id": "q3", "text": "Rotina: tempo sentada e água…", "type": "single", "options": ["Muito sentada e pouca água", "Equilibrada", "Ativa e hidratação ok", "Irregular"]},
        {"id": "q4", "text": "Combinar endermologia com drenagem ou massagem…", "type": "single", "options": ["Quero plano integrado", "Só endermologia primeiro", "Depende da avaliação", "Já faço combinação"]},
        {"id": "q5", "text": "Frequência que seria realista…", "type": "single", "options": ["1x/semana ou mais", "Quinzenal", "Mensal", "A definir"]}
      ],
      "results": [
        {"id": "r4", "label": "Perfil forte", "minScore": 11, "headline": "Endermologia é forte candidata no plano", "description": "Leve à consulta zona, sensibilidade e rotina. Peça sequência com massagem/drenagem se fizer sentido no seu caso."},
        {"id": "r3", "label": "Boa pista", "minScore": 8, "headline": "Vale explorar endermologia com critério", "description": "Há encaixe para discutir frequência e combinações seguras."},
        {"id": "r2", "label": "A definir", "minScore": 4, "headline": "Avaliação prioriza zona e pele", "description": "Use o resultado como lista de sintomas e hábitos para não esquecer na marcação."},
        {"id": "r1", "label": "Início", "minScore": 0, "headline": "Primeiro passo", "description": "Peça explicação do que é endermologia e o que esperar nas primeiras sessões."}
      ],
      "ctaDefault": "Quero falar sobre endermologia na avaliação",
      "resultIntro": "Seu resultado:"
    }
    $t148$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000149-0149-4000-8000-000000000149',
    'quiz_celulite_flacidez_prioridade_corporal',
    'diagnostico',
    $t149$
    {
      "title": "Celulite e flacidez: o que atacar primeiro no seu caso?",
      "introTitle": "Textura ou firmeza: o que te incomoda mais ao espelho?",
      "introSubtitle": "Cinco perguntas para priorizar o assunto na consulta — sem promessa de resultado; na presencial define-se ordem de protocolo.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "No espelho, o que mais chama atenção?", "type": "single", "options": ["Ondulação / irregularidade", "Falta de firmeza", "Os dois parecem iguais", "Inchaço junto"]},
        {"id": "q2", "text": "Há quanto tempo nota isso?", "type": "single", "options": ["Menos de 6 meses", "6 meses a 2 anos", "Mais de 2 anos", "Sempre me incomodou"]},
        {"id": "q3", "text": "Atividade física hoje…", "type": "single", "options": ["Regular 3+ por semana", "1–2 vezes", "Pouca ou nenhuma", "Variável"]},
        {"id": "q4", "text": "Sobre tecnologia (RF, endermo, etc.)…", "type": "single", "options": ["Aberta a sugestão", "Prefiro começar com massagem/hábitos", "Já uso e quero otimizar", "Tenho medo de investir errado"]},
        {"id": "q5", "text": "Objetivo nas próximas semanas…", "type": "single", "options": ["Melhora visível de textura", "Mais firmeza", "Plano misto com a profissional", "Só entender o que é prioridade"]}
      ],
      "results": [
        {"id": "r4", "label": "Mapa claro", "minScore": 11, "headline": "Dá para propor ordem de protocolo na consulta", "description": "Leve o que pesa mais (textura vs firmeza) e há quanto tempo. Peça plano em fases se necessário."},
        {"id": "r3", "label": "Boa base", "minScore": 8, "headline": "Há direção para combinar técnicas", "description": "A esteticista pode sugerir RF, endermologia, massagem ou combinação — sempre individualizado."},
        {"id": "r2", "label": "Explorar", "minScore": 4, "headline": "Ainda mistura objetivos", "description": "Peça avaliação para separar o que é celulite, flacidez ou inchaço na sua pele."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Comece pela avaliação", "description": "Este quiz organiza percepção; o diagnóstico estético é presencial."}
      ],
      "ctaDefault": "Quero avaliar celulite e flacidez na clínica",
      "resultIntro": "Seu resultado:"
    }
    $t149$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000150-0150-4000-8000-000000000150',
    'quiz_gordura_localizada_primeiro_passo_corporal',
    'diagnostico',
    $t150$
    {
      "title": "Gordura localizada: qual primeiro passo com a esteticista?",
      "introTitle": "Gordura localizada: por onde começar sem promessa milagrosa?",
      "introSubtitle": "Cinco perguntas sobre zona, hábitos e expectativa; na avaliação fechas tecnologia, massagem e ritmo com a profissional.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "A zona que mais te incomoda…", "type": "single", "options": ["Abdômen", "Culote/coxas", "Flancos/costas", "Várias"]},
        {"id": "q2", "text": "Sua rotina alimentar e de movimento…", "type": "single", "options": ["Já tenho base organizada", "Oscilo bastante", "Começando agora", "Prefiro não detalhar aqui"]},
        {"id": "q3", "text": "Expectativa sobre tecnologia (crio, cavi, etc.)…", "type": "single", "options": ["Quero entender prós e contras na consulta", "Já tenho preferência", "Prefiro massagem/modeladora primeiro", "Depende do orçamento"]},
        {"id": "q4", "text": "Prazo mental para ver alguma mudança…", "type": "single", "options": ["Semanas", "1–3 meses", "Flexível", "Quero o mais rápido possível (vou alinhar expectativa na consulta)"]},
        {"id": "q5", "text": "Próximo passo…", "type": "single", "options": ["Avaliação com medidas ou fotos padronizadas", "Conversa inicial sem compromisso", "Montar pacote com frequência", "Comparar duas tecnologias"]}
      ],
      "results": [
        {"id": "r4", "label": "Pronto para plano", "minScore": 11, "headline": "Leve zona e expectativa à consulta", "description": "Peça proposta em fases e o que não combinar no mesmo dia. Próximo passo: agende avaliação."},
        {"id": "r3", "label": "Encaminhamento", "minScore": 8, "headline": "Há base para falar em protocolo de contorno", "description": "A profissional pode cruzar hábitos, massagem e tecnologia conforme seu perfil."},
        {"id": "r2", "label": "Explorar", "minScore": 4, "headline": "Ainda falta priorizar uma zona", "description": "Use o resultado para não dispersar na primeira consulta."},
        {"id": "r1", "label": "Início", "minScore": 0, "headline": "Primeiro contato", "description": "Gordura localizada exige avaliação presencial; este quiz ajuda a estruturar dúvidas."}
      ],
      "ctaDefault": "Quero avaliar gordura localizada",
      "resultIntro": "Seu resultado:"
    }
    $t150$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000151-0151-4000-8000-000000000151',
    'quiz_detox_corporal_rotina_corporal',
    'diagnostico',
    $t151$
    {
      "title": "Detox corporal: rotina, sensação e o que perguntar na clínica",
      "introTitle": "Detox corporal: o que isso pode significar para o seu corpo?",
      "introSubtitle": "Cinco perguntas sobre hábitos e sensação antes da consulta; na presencial vocês separam o que é rotina, o que é protocolo e o que é promessa realista.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "O que “detox corporal” significa mais para você hoje?", "type": "single", "options": ["Menos inchaço e sensação de leveza", "Pele e aspecto do corpo", "Energia e rotina", "Seguir indicação da clínica"]},
        {"id": "q2", "text": "Água, sal e ultraprocessados na semana…", "type": "single", "options": ["Cuido bem", "Médio", "Costumo exagerar", "Não acompanho"]},
        {"id": "q3", "text": "Sono…", "type": "single", "options": ["Regular ou bom", "Irregular", "Ruim", "Uso apoio frequente (chá, tela, etc.)"]},
        {"id": "q4", "text": "Drenagem ou massagem já entram na sua cabeça como…", "type": "single", "options": ["Parte do plano", "Talvez", "Só depois de entender hábitos", "Já faço ou fiz"]},
        {"id": "q5", "text": "Próximo passo desejado…", "type": "single", "options": ["Avaliação na clínica", "Combinar hábitos + protocolo", "Só dicas até decidir", "Agendar primeira sessão"]}
      ],
      "results": [
        {"id": "r4", "label": "Plano integrado", "minScore": 11, "headline": "Bom perfil para conversa ampla na consulta", "description": "Leve hábitos e sensação à profissional para discutir drenagem, massagem e metas realistas — sem substituir orientação de saúde."},
        {"id": "r3", "label": "Encaminhamento", "minScore": 8, "headline": "Detox como tema de bem-estar corporal", "description": "Há espaço para alinhar rotina com protocolo na clínica."},
        {"id": "r2", "label": "Explorar", "minScore": 4, "headline": "Ainda genérico — normal", "description": "Peça na consulta o que a clínica inclui em “detox corporal” e o que é evidência vs marketing."},
        {"id": "r1", "label": "Início", "minScore": 0, "headline": "Primeiro passo: clareza", "description": "Use o resultado para agendar conversa e definir uma meta simples de sensação nas próximas semanas."}
      ],
      "ctaDefault": "Quero falar sobre detox corporal na avaliação",
      "resultIntro": "Seu resultado:"
    }
    $t151$::jsonb,
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
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'inchaço_retencao', 'metabolismo', 'Drenagem linfática: faz sentido para o seu corpo agora?', 'Inchaço, rotina e expectativa — organiza ideias antes da consulta.', 'Inchaço ou pernas pesadas', 'Agendar avaliação / drenagem', 'custom', 'b1000142-0142-4000-8000-000000000142'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_drenagem_linfatica_indicacao_corporal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 301, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000142-0142-4000-8000-000000000142');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'peso_gordura', 'metabolismo', 'Massagem modeladora: expectativa realista para o seu caso?', 'Contorno, pressão e frequência — perfil para conversar com a esteticista.', 'Dúvida sobre modeladora', 'Alinhar expectativa e pacote', 'custom', 'b1000143-0143-4000-8000-000000000143'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_massagem_modeladora_expectativa_corporal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 302, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000143-0143-4000-8000-000000000143');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'peso_gordura', 'metabolismo', 'Criolipólise: prontidão e dúvidas para a consulta', 'Frio local, expectativa e combinação com massagem — organiza ideias antes da consulta.', 'Dúvida sobre criolipo', 'Marcar avaliação técnica', 'custom', 'b1000144-0144-4000-8000-000000000144'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_criolipolise_prontidao_corporal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 303, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000144-0144-4000-8000-000000000144');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'flacidez', 'metabolismo', 'Radiofrequência corporal: firmeza, textura ou combinação?', 'Calor, pele e ritmo — roteiro objetivo para a avaliação.', 'Flacidez ou textura', 'Explorar RF corporal', 'custom', 'b1000145-0145-4000-8000-000000000145'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_radiofrequencia_corporal_protocolo", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 304, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000145-0145-4000-8000-000000000145');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'peso_gordura', 'metabolismo', 'Ultrassom corporal: onde entra no seu objetivo?', 'Zona e objetivo — o que levar antes de fechar protocolo.', 'Dúvida sobre ultrassom', 'Qualificar interesse', 'custom', 'b1000146-0146-4000-8000-000000000146'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_ultrassom_corporal_foco_corporal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 305, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000146-0146-4000-8000-000000000146');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'peso_gordura', 'metabolismo', 'Lipocavitação: indicação e expectativa para o seu perfil?', 'Localizado e expectativa — clareza antes da consulta.', 'Dúvida sobre cavitação', 'Marcar avaliação', 'custom', 'b1000147-0147-4000-8000-000000000147'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_lipocavitacao_indicacao_corporal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 306, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000147-0147-4000-8000-000000000147');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'celulite', 'metabolismo', 'Endermologia: textura, circulação ou contorno primeiro?', 'Celulite, sucção e hábitos — o que mencionar na avaliação.', 'Textura ou celulite', 'Explorar endermologia', 'custom', 'b1000148-0148-4000-8000-000000000148'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_endermologia_celulite_corporal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 307, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000148-0148-4000-8000-000000000148');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'celulite', 'metabolismo', 'Celulite e flacidez: o que atacar primeiro no seu caso?', 'Textura vs firmeza — prioridade para a consulta.', 'Celulite e flacidez', 'Definir ordem de protocolo', 'custom', 'b1000149-0149-4000-8000-000000000149'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_celulite_flacidez_prioridade_corporal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 308, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000149-0149-4000-8000-000000000149');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'peso_gordura', 'metabolismo', 'Gordura localizada: qual primeiro passo com a esteticista?', 'Zona, hábitos e tecnologia — organiza ideias antes de fechar pacote ou procedimento.', 'Gordura localizada', 'Agendar avaliação de contorno', 'custom', 'b1000150-0150-4000-8000-000000000150'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_gordura_localizada_primeiro_passo_corporal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 309, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000150-0150-4000-8000-000000000150');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'inchaço_retencao', 'metabolismo', 'Detox corporal: rotina, sensação e o que perguntar na clínica', 'Rotina e sensação — abre conversa sobre drenagem e bem-estar sem milagre.', 'Sensação de peso ou confusão com detox', 'Abrir conversa na clínica', 'custom', 'b1000151-0151-4000-8000-000000000151'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_detox_corporal_rotina_corporal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 310, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000151-0151-4000-8000-000000000151');
