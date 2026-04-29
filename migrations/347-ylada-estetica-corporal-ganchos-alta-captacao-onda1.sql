-- =====================================================
-- Pro Estética corporal — onda 1: ganchos de alta captação + restauração 121–126.
-- A 337 sobrescreveu os UUIDs 121–126 com Joias; aqui repomos o conteúdo corporal (333) com títulos de captação.
-- Intros/hooks em 119, 120, 127; calculadoras e quizzes universais; reativa templates + itens biblioteca (segmento aesthetics).
-- @see src/config/pro-estetica-corporal-biblioteca.ts
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000121-0121-4000-8000-000000000121',
    'quiz_drenagem_modeladora_tecnologia_corporal',
    'diagnostico',
    $corp121$
    {
      "title": "Seu corpo precisa desinchar, definir contorno ou tecnologia primeiro?",
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
    $corp121$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    2,
    true
  ),
  (
    'b1000122-0122-4000-8000-000000000122',
    'quiz_qual_tecnologia_corporal',
    'diagnostico',
    $corp122$
    {
      "title": "Gordura localizada, textura ou retenção: qual abordagem explorar primeiro?",
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
    $corp122$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    2,
    true
  ),
  (
    'b1000123-0123-4000-8000-000000000123',
    'calc_expectativa_sessoes_corporal',
    'calculator',
    $corp123$
    {
      "title": "Quantas sessões cabem na sua meta de contorno? (expectativa realista)",
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
    $corp123$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    2,
    true
  ),
  (
    'b1000124-0124-4000-8000-000000000124',
    'quiz_protocolo_camadas_corporal',
    'diagnostico',
    $corp124$
    {
      "title": "Seu protocolo corporal está certo — ou misturando demais?",
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
    $corp124$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    2,
    true
  ),
  (
    'b1000125-0125-4000-8000-000000000125',
    'quiz_agenda_sessoes_corporal',
    'diagnostico',
    $corp125$
    {
      "title": "Seu tratamento atual está realmente ajudando o resultado?",
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
    $corp125$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    2,
    true
  ),
  (
    'b1000126-0126-4000-8000-000000000126',
    'quiz_alivio_corporal_retencao_habitos',
    'diagnostico',
    $corp126$
    {
      "title": "Seu corpo está mais inchado do que deveria?",
      "introTitle": "Pernas pesadas, barriga ou sensação de peso — em cerca de 2 minutos",
      "introSubtitle": "Relacione sono, água, sal e rotina com o que você sente. No final, um resumo para combinar drenagem ou protocolo com a sua esteticista.",
      "introMicro": "~2 min · 5 perguntas",
      "introBullets": [],
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
    $corp126$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    2,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  schema_json = EXCLUDED.schema_json,
  allowed_vars_json = EXCLUDED.allowed_vars_json,
  version = EXCLUDED.version,
  active = true,
  updated_at = NOW();

-- Quiz massagem (127): mantém corpo da 342; só ganchos na primeira tela
UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(
    jsonb_set(
      jsonb_set(schema_json::jsonb, '{title}', to_jsonb('Qual massagem seu corpo realmente precisa?'::text)),
      '{introTitle}',
      to_jsonb('Relaxar, drenar ou definir — descubra em cerca de 2 minutos'::text),
      true
    ),
    '{introSubtitle}',
    to_jsonb('Cinco perguntas sobre sensação, objetivo e frequência. No final, um perfil (relaxante, drenagem, modeladora ou combinação) para levar à consulta.'::text),
    true
  ),
  version = COALESCE(version, 1) + 1,
  active = true,
  updated_at = NOW()
WHERE id = 'b1000127-0127-4000-8000-000000000127';

UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(
    jsonb_set(
      jsonb_set(schema_json::jsonb, '{title}', to_jsonb('Descubra o protocolo corporal que faz sentido para você agora'::text)),
      '{introTitle}',
      to_jsonb('Seu corpo está pedindo um plano claro?'::text),
      true
    ),
    '{introSubtitle}',
    to_jsonb('Em cinco perguntas você mapeia travas, urgência e a vitória que mais importa. No final, um perfil claro para abrir a conversa com a sua esteticista.'::text),
    true
  ),
  version = COALESCE(version, 1) + 1,
  updated_at = NOW()
WHERE id = 'b1000119-0119-4000-8000-000000000119';

UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(
    jsonb_set(
      jsonb_set(schema_json::jsonb, '{title}', to_jsonb('Qual zona do seu corpo pede atenção primeiro?'::text)),
      '{introTitle}',
      to_jsonb('Antes da consulta: onde o foco faz mais diferença?'::text),
      true
    ),
    '{introSubtitle}',
    to_jsonb('Cinco perguntas sobre zona, tempo de incômodo e tipo de mudança. No final, um mapa para conversar com a sua esteticista (contorno, textura, sensação ou confiança).'::text),
    true
  ),
  version = COALESCE(version, 1) + 1,
  updated_at = NOW()
WHERE id = 'b1000120-0120-4000-8000-000000000120';

UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(schema_json::jsonb, '{title}', to_jsonb('Retenção de líquido: seu corpo pode estar dando sinais'::text)),
  version = COALESCE(version, 1) + 1,
  updated_at = NOW()
WHERE id = 'b1000038-0038-4000-8000-000000000038';

UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(schema_json::jsonb, '{title}', to_jsonb('O que sua celulite pode revelar sobre hábitos e circulação?'::text)),
  version = COALESCE(version, 1) + 1,
  updated_at = NOW()
WHERE id = 'b1000046-0046-4000-8000-000000000046';

UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(schema_json::jsonb, '{title}', to_jsonb('Água no dia a dia: quanto seu corpo pode precisar?'::text)),
  version = COALESCE(version, 1) + 1,
  updated_at = NOW()
WHERE id = 'b1000025-0025-4000-8000-000000000025';

UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(schema_json::jsonb, '{title}', to_jsonb('Calorias diárias: alinhe energia com seu objetivo corporal'::text)),
  version = COALESCE(version, 1) + 1,
  updated_at = NOW()
WHERE id = 'b1000026-0026-4000-8000-000000000026';

UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(schema_json::jsonb, '{title}', to_jsonb('IMC + contexto: primeiro passo para conversar com a esteticista'::text)),
  version = COALESCE(version, 1) + 1,
  updated_at = NOW()
WHERE id = 'b1000027-0027-4000-8000-000000000027';

UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(schema_json::jsonb, '{title}', to_jsonb('Proteína diária: base para definição e recuperação'::text)),
  version = COALESCE(version, 1) + 1,
  updated_at = NOW()
WHERE id = 'b1000028-0028-4000-8000-000000000028';

UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(schema_json::jsonb, '{title}', to_jsonb('Hidratação que acompanha treino e clima — meta em copos'::text)),
  version = COALESCE(version, 1) + 1,
  updated_at = NOW()
WHERE id = 'b1000031-0031-4000-8000-000000000031';

-- Itens biblioteca (Pro corporal + calculadoras compartilhadas)

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Seu corpo está mais inchado do que deveria?',
  description = 'Pernas pesadas, barriga ou “corpo pesado”: relacione rotina e sensação antes de fechar protocolo.',
  dor_principal = 'Inchaço ou retenção',
  objetivo_principal = 'Clarear se drenagem ou hábitos vêm primeiro',
  updated_at = NOW()
WHERE template_id = 'b1000126-0126-4000-8000-000000000126'::uuid
  AND 'aesthetics' = ANY(segment_codes);

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Qual massagem seu corpo realmente precisa?',
  description = 'Relaxar, drenar ou definir — perfil em minutos para levar à consulta.',
  dor_principal = 'Dúvida sobre tipo de massagem',
  objetivo_principal = 'Qualificar interesse e preparar avaliação',
  updated_at = NOW()
WHERE template_id = 'b1000127-0127-4000-8000-000000000127'::uuid
  AND 'aesthetics' = ANY(segment_codes);

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Seu corpo precisa desinchar, definir ou tecnologia primeiro?',
  description = 'Priorize sensação, contorno ou textura — e chegue na consulta com clareza.',
  dor_principal = 'Indecisão sobre por onde começar',
  objetivo_principal = 'Definir ordem de protocolo',
  updated_at = NOW()
WHERE template_id = 'b1000121-0121-4000-8000-000000000121'::uuid
  AND 'aesthetics' = ANY(segment_codes);

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Gordura localizada ou retenção: qual caminho faz sentido agora?',
  description = 'Alinhe objetivo, região e sensibilidade antes de escolher tecnologia ou combinação.',
  dor_principal = 'Dúvida entre procedimentos',
  objetivo_principal = 'Escolher abordagem com critério',
  updated_at = NOW()
WHERE template_id = 'b1000122-0122-4000-8000-000000000122'::uuid
  AND 'aesthetics' = ANY(segment_codes);

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Quantas sessões cabem na sua meta de contorno?',
  description = 'Estime frequência e prazo — sem promessa milagrosa, para alinhar expectativa com a clínica.',
  dor_principal = 'Expectativa desalinhada',
  objetivo_principal = 'Planejar frequência realista',
  updated_at = NOW()
WHERE template_id = 'b1000123-0123-4000-8000-000000000123'::uuid
  AND 'aesthetics' = ANY(segment_codes);

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Seu protocolo corporal está certo — ou misturando demais?',
  description = 'Descubra se o melhor caminho é uma frente por vez ou plano em fases.',
  dor_principal = 'Tudo ao mesmo tempo',
  objetivo_principal = 'Organizar protocolo',
  updated_at = NOW()
WHERE template_id = 'b1000124-0124-4000-8000-000000000124'::uuid
  AND 'aesthetics' = ANY(segment_codes);

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Seu tratamento atual está realmente ajudando o resultado?',
  description = 'Intervalos, combinações e frequência: evite armadilhas que atrasam evolução.',
  dor_principal = 'Sobrecarga ou ritmo errado',
  objetivo_principal = 'Proteger resultado com cronograma',
  updated_at = NOW()
WHERE template_id = 'b1000125-0125-4000-8000-000000000125'::uuid
  AND 'aesthetics' = ANY(segment_codes);

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Descubra o protocolo corporal ideal para você agora',
  description = 'Travas, urgência e vitória desejada — resultado para levar à esteticista.',
  dor_principal = 'Indecisão ou corpo em segundo plano',
  objetivo_principal = 'Clarear prioridade e próximo passo',
  updated_at = NOW()
WHERE template_id = 'b1000119-0119-4000-8000-000000000119'::uuid
  AND 'aesthetics' = ANY(segment_codes);

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Qual zona do seu corpo pede atenção primeiro?',
  description = 'Zona, tempo de incômodo e tipo de mudança — mapa pronto para a consulta.',
  dor_principal = 'Insatisfação com zonas do corpo',
  objetivo_principal = 'Definir prioridade de tratamento',
  updated_at = NOW()
WHERE template_id = 'b1000120-0120-4000-8000-000000000120'::uuid
  AND 'aesthetics' = ANY(segment_codes);

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Retenção de líquido: seu corpo pode estar dando sinais',
  description = 'Inchaço, pernas pesadas e hábitos — quiz rápido antes de falar em protocolo.',
  dor_principal = 'Sensação de retenção',
  objetivo_principal = 'Entender sinais e próximo passo',
  updated_at = NOW()
WHERE template_id = 'b1000038-0038-4000-8000-000000000038'::uuid;

UPDATE ylada_biblioteca_itens
SET
  titulo = 'O que sua celulite pode revelar sobre seu corpo?',
  description = 'Hábitos, circulação e rotina: contexto para conversar sobre protocolo corporal.',
  dor_principal = 'Celulite ou textura',
  objetivo_principal = 'Abrir conversa com a esteticista',
  updated_at = NOW()
WHERE template_id = 'b1000046-0046-4000-8000-000000000046'::uuid;

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Água no dia a dia: quanto seu corpo pode precisar?',
  description = 'Meta em copos com base em peso, clima e movimento — apoio a sensação de leveza.',
  updated_at = NOW()
WHERE template_id = 'b1000025-0025-4000-8000-000000000025'::uuid;

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Calorias diárias: alinhe energia com seu objetivo corporal',
  description = 'Mifflin-St Jeor com objetivo de peso — útil para combinar com plano corporal.',
  updated_at = NOW()
WHERE template_id = 'b1000026-0026-4000-8000-000000000026'::uuid;

UPDATE ylada_biblioteca_itens
SET
  titulo = 'IMC + contexto: primeiro passo para conversar com a esteticista',
  description = 'IMC com idade e sexo opcionais (contexto; não altera o cálculo) para a consulta.',
  updated_at = NOW()
WHERE template_id = 'b1000027-0027-4000-8000-000000000027'::uuid;

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Proteína diária: base para definição e recuperação',
  description = 'Estime gramas por dia conforme objetivo e treino — apoio a massa magra e rotina.',
  updated_at = NOW()
WHERE template_id = 'b1000028-0028-4000-8000-000000000028'::uuid;

UPDATE ylada_biblioteca_itens
SET
  titulo = 'Hidratação que acompanha treino e clima — meta em copos',
  description = 'Ajuste líquidos a peso, treino e clima — combinável com drenagem e bem-estar.',
  updated_at = NOW()
WHERE template_id = 'b1000031-0031-4000-8000-000000000031'::uuid;

-- Reativa itens do hub corporal desativados pela 338 (não toca linhas só joias)
UPDATE ylada_biblioteca_itens
SET active = true, updated_at = NOW()
WHERE template_id IN (
  'b1000121-0121-4000-8000-000000000121'::uuid,
  'b1000122-0122-4000-8000-000000000122'::uuid,
  'b1000123-0123-4000-8000-000000000123'::uuid,
  'b1000124-0124-4000-8000-000000000124'::uuid,
  'b1000125-0125-4000-8000-000000000125'::uuid,
  'b1000126-0126-4000-8000-000000000126'::uuid,
  'b1000127-0127-4000-8000-000000000127'::uuid
)
  AND 'aesthetics' = ANY(segment_codes);
