-- =====================================================
-- Estética corporal (Pro): 5 quizzes + 1 calculadora estratégicos.
-- Templates b1000121–b1000126. Idempotente (ON CONFLICT + WHERE NOT EXISTS).
-- @see src/config/pro-estetica-corporal-biblioteca.ts — IDs b1000121–126 na lista permitida e ordem de destaque.
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000121-0121-4000-8000-000000000121',
    'quiz_drenagem_modeladora_tecnologia_corporal',
    'diagnostico',
    $json$
    {
      "title": "O seu corpo pede drenagem, modeladora ou tecnologia primeiro?",
      "questions": [
        {"id": "q1", "text": "Hoje, o que mais te incomoda no dia a dia?", "type": "single", "options": ["Pernas pesadas ou inchaço ao fim do dia", "Textura da pele (ondulação ou irregularidade)", "Volume localizado (abdômen, culote, flancos)", "Cansaço geral, sem foco numa zona"]},
        {"id": "q2", "text": "O que você gostaria de ver primeiro com um protocolo?", "type": "single", "options": ["Sensação de leveza e circulação", "Contorno e definição", "Pele mais uniforme ou firme", "Relaxamento e alívio de tensão"]},
        {"id": "q3", "text": "Como você descreve sua tolerância a estímulos fortes (frio intenso, sucção, calor profundo)?", "type": "single", "options": ["Baixa — prefiro abordagens mais suaves", "Média", "Alta — consigo suportar estímulo forte", "Ainda não sei"]},
        {"id": "q4", "text": "Sua rotina típica é mais…", "type": "single", "options": ["Muitas horas sentada", "Mista (sentada + em pé + movimento)", "Bem ativa ou em pé a maior parte do dia"]},
        {"id": "q5", "text": "Se você pudesse escolher só UMA prioridade nas próximas 2 semanas, qual seria?", "type": "single", "options": ["Reduzir sensação de peso/inchaço", "Melhorar contorno numa zona", "Trabalhar textura ou firmeza da pele", "Montar um plano com calma (sem pressa extrema)"]}
      ],
      "results": [
        {"id": "r4", "label": "Perfil intenso", "minScore": 10, "headline": "Muita informação ao mesmo tempo", "description": "Suas respostas misturam incômodos e prioridades — isso é comum. Na avaliação presencial, o melhor caminho costuma ser escolher UMA frente inicial (sensação, contorno ou textura) e encaixar o restante em fases, com intervalos seguros."},
        {"id": "r3", "label": "Perfil misto", "minScore": 7, "headline": "Dá para organizar em prioridades", "description": "Há espaço para alinhar o que você sente no corpo com o que quer ver no espelho, sem atropelar etapas. Leve este resultado para conversar sobre ordem: drenagem/modeladora/tecnologia — o que entra primeiro depende da sua queixa e da avaliação."},
        {"id": "r2", "label": "Perfil em definição", "minScore": 4, "headline": "Um foco começa a aparecer", "description": "Você já caminha para um eixo mais claro (leveza, contorno ou textura). Use o resultado para pedir uma proposta de sequência simples na consulta — sempre com critério profissional e sem promessa de prazo milagroso."},
        {"id": "r1", "label": "Entrada suave", "minScore": 0, "headline": "Bom momento para conversa guiada", "description": "Com base nas suas respostas, o próximo passo costuma ser combinar hábitos do dia a dia com a ordem certa de procedimentos — sempre com avaliação presencial para ajustar à sua pele, sensibilidade e saúde."}
      ],
      "ctaDefault": "Quero minha ordem de prioridades na avaliação",
      "resultIntro": "Seu resultado:"
    }
    $json$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000122-0122-4000-8000-000000000122',
    'quiz_qual_tecnologia_corporal',
    'diagnostico',
    $json$
    {
      "title": "Qual tecnologia ou abordagem faz mais sentido para o seu objetivo agora?",
      "questions": [
        {"id": "q1", "text": "Seu foco principal é…", "type": "single", "options": ["Reduzir gordura localizada / contorno", "Firmar pele ou melhorar flacidez", "Melhorar textura superficial (aspecto “ondulado”)", "Alívio de retenção e sensação de peso"]},
        {"id": "q2", "text": "A região que mais te incomoda hoje é…", "type": "single", "options": ["Abdômen", "Culote ou coxas", "Flancos ou costas", "Braços", "Pernas inteiras", "Várias áreas ao mesmo tempo"]},
        {"id": "q3", "text": "Você já fez algum destes (ou similar) antes?", "type": "single", "options": ["Criolipólise ou frio local", "Radiofrequência ou calor", "Lipocavitação ou ultrassom focal", "Endermologia ou vácuo-rolagem", "Nunca fiz tecnologias corporais"]},
        {"id": "q4", "text": "Sua pele costuma…", "type": "single", "options": ["Marcar fácil (roxo) ou ficar sensível", "Reagir de forma normal", "Ser resistente e pouco reativa"]},
        {"id": "q5", "text": "Sobre prazo, você está mais…", "type": "single", "options": ["Quero ver mudança nas primeiras semanas (com expectativa realista)", "Posso acompanhar 2 a 3 meses", "Flexível — quero sobretudo segurança e consistência"]}
      ],
      "results": [
        {"id": "r4", "label": "Alta complexidade", "minScore": 11, "headline": "Objetivo + região pedem conversa técnica", "description": "Você trouxe combinações que mudam escolha de equipamento e ritmo. Na consulta, peça uma explicação didática: o que faz sentido primeiro, o que fica para depois e por quê — sem empilhar tudo no mesmo dia."},
        {"id": "r3", "label": "Meio-termo ativo", "minScore": 8, "headline": "Direção clara, detalhe na avaliação", "description": "A combinação ideal depende da região, da sensibilidade da pele e do aparelho disponível. Este quiz já organiza intenção; falta só traduzir para protocolo com intervalos seguros na mão da profissional."},
        {"id": "r2", "label": "Exploratório", "minScore": 4, "headline": "Bom mapa para primeira consulta", "description": "Você ainda equilibra objetivos — normal. Use o resultado para pedir opções em 2 ou 3 linhas (com prós e contras leigos), e decida junto após avaliação presencial."},
        {"id": "r1", "label": "Introdução", "minScore": 0, "headline": "Primeiro passo: intenção e segurança", "description": "A combinação ideal depende da avaliação, da região e do equipamento. Este quiz organiza intenção e sensibilidade — na consulta traduzimos para protocolo com intervalos seguros."}
      ],
      "ctaDefault": "Quero traduzir isso num protocolo",
      "resultIntro": "Seu resultado:"
    }
    $json$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000123-0123-4000-8000-000000000123',
    'calc_expectativa_sessoes_corporal',
    'calculator',
    $json$
    {
      "title": "Expectativa de sessões (gordura localizada / contorno)",
      "fields": [
        {"id": "semanas", "label": "Em quantas semanas você imagina o primeiro “checkpoint” visível?", "type": "select", "options": [{"value": 4, "label": "4 semanas"}, {"value": 8, "label": "8 semanas"}, {"value": 12, "label": "12 semanas"}]},
        {"id": "sessoes", "label": "Quantas vezes por semana você consegue ir ao salão?", "type": "select", "options": [{"value": 1, "label": "1 vez"}, {"value": 2, "label": "2 vezes"}, {"value": 3, "label": "3 ou mais"}]}
      ],
      "formula": "Math.round(semanas * sessoes)",
      "resultLabel": "Sessões estimadas até o checkpoint (ordem de grandeza):",
      "resultPrefix": "",
      "resultSuffix": " sessões",
      "resultIntro": "Isto não é promessa de resultado — é só para alinhar expectativa com frequência. Ajuste fino é sempre presencial:",
      "ctaDefault": "Quero ver se minha meta é realista"
    }
    $json$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000124-0124-4000-8000-000000000124',
    'quiz_protocolo_camadas_corporal',
    'diagnostico',
    $json$
    {
      "title": "Seu protocolo corporal precisa de quantas “camadas”?",
      "questions": [
        {"id": "q1", "text": "Hoje você sente que o problema é…", "type": "single", "options": ["Um foco claro (uma zona ou um sintoma)", "Vários incômodos ao mesmo tempo", "Não consigo nomear — só sei que quero melhorar"]},
        {"id": "q2", "text": "O que você já tentou antes?", "type": "single", "options": ["Várias coisas soltas, sem sequência", "Um protocolo fechado por um tempo", "Quase nada de estética corporal profissional"]},
        {"id": "q3", "text": "Quantas idas ao salão por semana são realistas para você?", "type": "single", "options": ["1", "2", "3 ou mais", "Ainda não sei"]},
        {"id": "q4", "text": "Você prioriza mais…", "type": "single", "options": ["Sensação (leveza, conforto)", "Medida/contorno no espelho", "Equilíbrio entre os dois"]},
        {"id": "q5", "text": "Para começar, você prefere…", "type": "single", "options": ["Entrada suave (menos estímulo, mais consistência)", "Plano mais intenso (com critério e recuperação)", "Só orientação até decidir investimento"]}
      ],
      "results": [
        {"id": "r4", "label": "Plano denso", "minScore": 8, "headline": "Você pede ritmo — combine com critério", "description": "Protocolos fortes funcionam melhor em camadas: base (hábito + sensação), depois estímulo direcionado, depois refinamento. Com muitas frentes ao mesmo tempo, peça um cronograma explícito na avaliação para não perder resultado nem descanso da pele."},
        {"id": "r3", "label": "Equilíbrio", "minScore": 5, "headline": "Camadas fazem sentido para você", "description": "Há sinais de que misturar tudo de uma vez pode cansar antes de evoluir. Na consulta, alinhe fase 1 (o que entra já) e fase 2 (o que espera) com a profissional."},
        {"id": "r2", "label": "Ainda disperso", "minScore": 3, "headline": "Um foco por vez costuma render mais", "description": "Protocolos fortes costumam funcionar melhor em camadas: base (hábito + sensação), depois estímulo direcionado, depois refinamento. Experimente pedir um plano em duas etapas na primeira avaliação."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Seu resultado", "description": "Protocolos fortes costumam funcionar melhor em camadas: base (hábito + sensação), depois estímulo direcionado, depois refinamento. A ordem exata é personalizada na avaliação."}
      ],
      "ctaDefault": "Quero um plano em camadas",
      "resultIntro": "Seu resultado:"
    }
    $json$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000125-0125-4000-8000-000000000125',
    'quiz_agenda_sessoes_corporal',
    'diagnostico',
    $json$
    {
      "title": "Sua agenda de sessões está ajudando ou atrapalhando o resultado?",
      "questions": [
        {"id": "q1", "text": "Duas técnicas intensas na mesma região no mesmo dia costuma ser…", "type": "single", "options": ["Arriscado sem orientação profissional", "Depende do protocolo e do equipamento", "Sempre uma boa ideia para acelerar"]},
        {"id": "q2", "text": "Após um procedimento com frio intenso na zona, você imagina que…", "type": "single", "options": ["Calor forte no mesmo local no mesmo dia é combinação a evitar na maioria dos casos", "Posso combinar tudo no mesmo dia", "Não sei"]},
        {"id": "q3", "text": "Quando não há resultado rápido, você costuma…", "type": "single", "options": ["Trocar de técnica toda semana", "Manter o combinado e revisar na data certa", "Parar antes do prazo combinado"]},
        {"id": "q4", "text": "Sobre intervalo entre sessões, você…", "type": "single", "options": ["Segue o que a profissional indica", "Encurta para “acelerar”", "Espalha demais e perde ritmo"]},
        {"id": "q5", "text": "O que você quer que a profissional te explique na primeira consulta?", "type": "single", "options": ["Ordem segura entre procedimentos", "Frequência ideal para o meu objetivo", "O que não misturar no mesmo dia", "Tudo isso"]}
      ],
      "results": [
        {"id": "r4", "label": "Agenda exigente", "minScore": 8, "headline": "Risco de sobrecarga se não houver plano", "description": "Boa agenda protege resultado: menos empilhamento aleatório, mais critério. Leve estas respostas e peça por escrito o que pode ou não ir no mesmo dia, com intervalo mínimo sugerido para a sua pele."},
        {"id": "r3", "label": "Agenda consciente", "minScore": 5, "headline": "Você já evita armadilhas comuns", "description": "Há espaço para refinar: ordem entre procedimentos, frequência e sinais de alerta. Use o resultado para fechar um combinado claro com a profissional."},
        {"id": "r2", "label": "Ainda improvisado", "minScore": 3, "headline": "Um cronograma simples já ajuda", "description": "Boa agenda protege resultado: menos empilhamento aleatório, mais critério. Peça um modelo de semana-tipo (1–2 idas) alinhado ao seu objetivo."},
        {"id": "r1", "label": "Base", "minScore": 0, "headline": "Seu resultado", "description": "Boa agenda protege resultado: menos empilhamento aleatório, mais critério. Use este diagnóstico para pedir um cronograma claro na avaliação."}
      ],
      "ctaDefault": "Quero um cronograma seguro",
      "resultIntro": "Seu resultado:"
    }
    $json$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000126-0126-4000-8000-000000000126',
    'quiz_alivio_corporal_retencao_habitos',
    'diagnostico',
    $json$
    {
      "title": "O que mais pesa na sua sensação de inchaço ou “corpo pesado”?",
      "questions": [
        {"id": "q1", "text": "Ao fim do dia, pernas ou corpo inchados…", "type": "single", "options": ["Frequentemente", "Às vezes", "Raramente"]},
        {"id": "q2", "text": "Sono nas últimas semanas…", "type": "single", "options": ["Regular ou bom", "Irregular", "Bem ruim"]},
        {"id": "q3", "text": "Água no dia a dia…", "type": "single", "options": ["Consistente", "Irregular", "Baixa"]},
        {"id": "q4", "text": "Sal e ultraprocessados…", "type": "single", "options": ["Pouco", "Médio", "Muito frequentes"]},
        {"id": "q5", "text": "Ciclo menstrual, viagem ou muito tempo sentada pioram isso?", "type": "single", "options": ["Sim, bastante", "Um pouco", "Não noto ligação"]}
      ],
      "results": [
        {"id": "r4", "label": "Sinais fortes de rotina", "minScore": 7, "headline": "Hábito e corpo pedem conversa junta", "description": "Muitas vezes “inchaço” soma rotina + posição + sono. Drenagem e protocolo corporal entram melhor quando hábitos básicos acompanham — sem culpa, com estratégia. Na consulta, peça um plano que una sono, hidratação e movimento leve ao protocolo."},
        {"id": "r3", "label": "Meio-termo", "minScore": 5, "headline": "Ajustes pequenos já mudam a sensação", "description": "Há espaço para melhorar sono, água ou sal sem radicalismo. Combine isso com orientação profissional sobre drenagem ou tecnologia — sempre individualizado."},
        {"id": "r2", "label": "Pontos soltos", "minScore": 3, "headline": "Um eixo por vez", "description": "Muitas vezes “inchaço” soma rotina + posição + sono. Escolha um hábito para acompanhar por 2 semanas e retome o protocolo corporal com a profissional."},
        {"id": "r1", "label": "Introdução", "minScore": 0, "headline": "Seu resultado", "description": "Muitas vezes “inchaço” soma rotina + posição + sono. Drenagem e protocolo corporal entram melhor quando hábitos básicos acompanham — sem culpa, com estratégia."}
      ],
      "ctaDefault": "Quero combinar hábito + protocolo",
      "resultIntro": "Seu resultado:"
    }
    $json$::jsonb,
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
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'inchaço_retencao', 'metabolismo', 'O seu corpo pede drenagem, modeladora ou tecnologia primeiro?', 'Priorize sensação, contorno ou textura — e chegue na consulta com clareza.', 'Indecisão sobre por onde começar', 'Definir ordem de protocolo', 'custom', 'b1000121-0121-4000-8000-000000000121'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_drenagem_modeladora_tecnologia_corporal", "num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 144, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000121-0121-4000-8000-000000000121');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'peso_gordura', 'metabolismo', 'Qual tecnologia faz mais sentido para o seu objetivo agora?', 'Alinhe objetivo, região e sensibilidade antes de escolher criolipo, RF, cavitação ou endermologia.', 'Dúvida entre procedimentos', 'Escolher abordagem com critério', 'custom', 'b1000122-0122-4000-8000-000000000122'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_qual_tecnologia_corporal", "num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 145, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000122-0122-4000-8000-000000000122');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'calculadora', ARRAY['aesthetics', 'nutrition', 'fitness'], 'peso_gordura', 'metabolismo', 'Expectativa de sessões (contorno / localizado)', 'Estime quantas sessões cabem no seu prazo e frequência — sem promessa milagrosa.', 'Expectativa desalinhada', 'Planejar frequência realista', 'custom', 'b1000123-0123-4000-8000-000000000123'::uuid, NULL, '{"nomenclatura": "calc_expectativa_sessoes_corporal", "tempo_minutos": 1}'::jsonb, 146, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000123-0123-4000-8000-000000000123');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'habitos', 'habitos', 'Seu protocolo corporal precisa de quantas camadas?', 'Descubra se o melhor caminho é uma frente por vez ou plano em fases.', 'Tudo ao mesmo tempo', 'Organizar protocolo', 'custom', 'b1000124-0124-4000-8000-000000000124'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_protocolo_camadas_corporal", "num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 147, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000124-0124-4000-8000-000000000124');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'habitos', 'habitos', 'Sua agenda de sessões está ajudando ou atrapalhando o resultado?', 'Evite combinações arriscadas e ganhe clareza sobre intervalos e prioridade.', 'Sobrecarga de sessões', 'Proteger resultado com cronograma', 'custom', 'b1000125-0125-4000-8000-000000000125'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_agenda_sessoes_corporal", "num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 148, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000125-0125-4000-8000-000000000125');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'inchaço_retencao', 'metabolismo', 'O que mais pesa na sua sensação de inchaço ou “corpo pesado”?', 'Relacione rotina (sono, água, sal) com sensação — antes de falar em protocolo.', 'Sensação de peso', 'Alinhar hábitos e drenagem', 'custom', 'b1000126-0126-4000-8000-000000000126'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_alivio_corporal_retencao_habitos", "num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 149, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000126-0126-4000-8000-000000000126');
