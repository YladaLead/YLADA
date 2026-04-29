-- =====================================================
-- Pro Estética corporal: quiz novo (massagem) + resultados completos nos quizzes 119 e 120.
-- Template novo: b1000127. Idempotente (ON CONFLICT / WHERE NOT EXISTS).
-- @see src/config/pro-estetica-corporal-biblioteca.ts — incluir b1000127 na lista permitida.
-- =====================================================

UPDATE ylada_link_templates
SET
  name = 'quiz_prontidao_protocolo_corporal',
  type = 'diagnostico',
  schema_json = $json$
{
  "title": "Do travamento ao plano: onde você está com o seu corpo agora?",
  "introTitle": "O que está entre você e o protocolo corporal que você quer?",
  "introSubtitle": "Em cinco perguntas você mapeia travas, urgência e a vitória que mais importa. No final, um perfil claro para abrir a conversa com a sua esteticista.",
  "introMicro": "~2 minutos · 5 perguntas · resultado para levar à clínica",
  "introBullets": [],
  "questions": [
    {"id": "q1", "text": "O que mais segura você de começar um protocolo corporal?", "type": "single", "options": ["Medo de não funcionar", "Investimento ou preço", "Falta de prioridade", "Tempo na rotina", "Quero começar — falta um plano claro na agenda"]},
    {"id": "q2", "text": "Em quanto tempo você gostaria de ver uma mudança visível?", "type": "single", "options": ["Sem pressa ou não sei", "2 a 3 meses", "Até 1 mês", "Até 2 semanas"]},
    {"id": "q3", "text": "Você já fez tratamento corporal profissional antes?", "type": "single", "options": ["Nunca", "Sim, com resultado fraco", "Estou em tratamento", "Sim, funcionou bem"]},
    {"id": "q4", "text": "De 0 a 10, quanto você prioriza resolver isso nos próximos 30 dias?", "type": "single", "options": ["0 a 3 — baixa", "4 a 6 — média", "7 a 8 — alta", "9 a 10 — máxima"]},
    {"id": "q5", "text": "Hoje, o que seria uma vitória clara para você?", "type": "single", "options": ["Mais confiança no dia a dia", "Encaixar melhor nas roupas", "Textura da pele (celulite ou flacidez)", "Contorno em abdômen, culote ou flancos", "Corpo mais leve ou menos inchado"]}
  ],
  "results": [
    {"id": "r4", "label": "Prioridade alta", "minScore": 14, "headline": "Você está com intenção forte — hora de traduzir em plano", "description": "Suas respostas indicam desejo claro de mudança em prazo curto e pouca hesitação em relação ao “se” — o foco passa a ser o “como” com segurança. O que costuma ajudar: uma primeira consulta objetiva com cronograma (frequência, fases e o que medir: sensação, fotos ou circunferências, sempre com critério profissional). Na consulta, peça: proposta em duas fases (entrada + intensificação) e o que não misturar no mesmo dia se houver tecnologia. Próximo passo: envie este resultado à clínica e peça o primeiro encaixe — você já leva contexto e ganha tempo na conversa."},
    {"id": "r3", "label": "Quase lá", "minScore": 11, "headline": "Boa base — falta fechar prioridade e expectativa", "description": "Há interesse real, mas ainda há variáveis (tempo, investimento ou experiências anteriores) que pedem conversa franca com a profissional. O que costuma ajudar: alinhar uma meta visível em 4 a 8 semanas com a frequência que você consegue manter, em vez de prometer milagre. Na consulta, peça: duas opções de pacote (mais suave vs mais completa) com prós e contras em linguagem simples. Próximo passo: use o resultado como roteiro de perguntas na avaliação — reduz ansiedade e evita combinados genéricos."},
    {"id": "r2", "label": "Explorando", "minScore": 7, "headline": "Você está mapeando — isso é um ótimo ponto de partida", "description": "É comum oscilar entre curiosidade e prioridade baixa, ou entre medo de investir e vontade de melhorar. O que costuma ajudar: começar por uma avaliação que explique o “porquê” de cada etapa antes de fechar pacote fechado. Na consulta, peça: um plano mínimo viável (menos sessões, mais consistência) e sinais de que o caminho está certo ao longo das semanas. Próximo passo: marque avaliação sem compromisso com tratamento longo — foque em clareza e confiança no processo."},
    {"id": "r1", "label": "Primeiro passo", "minScore": 0, "headline": "Primeiro passo: organizar intenção e rotina", "description": "Suas respostas sugerem que o corpo ainda não é prioridade número um — ou que há travas emocionais ou de agenda. Tudo bem: protocolo corporal rende mais quando entra com expectativa realista. O que costuma ajudar: uma conversa inicial para definir UMA vitória pequena nas próximas semanas (ex.: menos inchaço ou melhor sono ligado a tensão). Na consulta, peça: sugestão de frequência mínima e o que fazer em casa entre sessões. Próximo passo: guarde este resultado e retome quando sentir que a prioridade subiu — ou leve já à profissional para desenhar um começo suave."}
  ],
  "ctaDefault": "Quero alinhar meu próximo passo na avaliação",
  "resultIntro": "Seu resultado:"
}
$json$::jsonb,
  allowed_vars_json = '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
  version = 2,
  updated_at = NOW()
WHERE id = 'b1000119-0119-4000-8000-000000000119';

UPDATE ylada_link_templates
SET
  name = 'quiz_mapa_zonas_corpo',
  type = 'diagnostico',
  schema_json = $json$
{
  "title": "Qual zona do seu corpo pede atenção primeiro — e com que urgência?",
  "introTitle": "Antes da consulta: onde o seu corpo “grita” mais hoje?",
  "introSubtitle": "Em cinco perguntas você prioriza zona, tempo de incômodo e o tipo de mudança que mais importa. No final recebe um mapa de foco para a conversa com sua esteticista (contorno, textura, sensação ou confiança), o que costuma orientar protocolo e o que levar anotado à avaliação.",
  "introMicro": "~2 min · 5 perguntas · resultado para partilhar com a clínica",
  "introBullets": [
    "Zona prioritária (abdômen, culote, braços, pernas…)",
    "Há quanto tempo isso pesa em você",
    "Se o incômodo é mais aparência, sensação ou os dois"
  ],
  "questions": [
    {"id": "q1", "text": "Qual área você gostaria de priorizar primeiro?", "type": "single", "options": ["Abdômen", "Culote e coxas", "Flancos ou costas", "Braços", "Pernas inteiras", "Várias zonas ao mesmo tempo"]},
    {"id": "q2", "text": "Há quanto tempo isso te incomoda?", "type": "single", "options": ["Menos de 3 meses", "3 a 12 meses", "Mais de 1 ano", "Há muito tempo ou sempre"]},
    {"id": "q3", "text": "O incômodo é mais aparência, sensação (peso ou inchaço) ou os dois?", "type": "single", "options": ["Mais aparência", "Mais sensação física", "Os dois igualmente"]},
    {"id": "q4", "text": "Você pratica atividade física com regularidade?", "type": "single", "options": ["Não ou quase nunca", "1 a 2 vezes por semana", "3 vezes ou mais por semana"]},
    {"id": "q5", "text": "Se você pudesse mudar uma coisa já nas próximas semanas, qual seria?", "type": "single", "options": ["Mais confiança no dia a dia", "Encaixar melhor nas roupas que gosto", "Textura da pele (celulite ou flacidez)", "Contorno mais definido", "Menos inchaço ou pernas mais leves"]}
  ],
  "results": [
    {"id": "r4", "label": "Mapa denso", "minScore": 13, "headline": "Várias frentes — peça um plano em fases na consulta", "description": "Você indicou mais de uma zona ou um incômodo antigo, às vezes misturando aparência e sensação. Isso é comum e pede priorização para não dispersar energia (e investimento). O que costuma ajudar: escolher UMA frente inicial (ex.: sensação de leveza ou contorno numa região) e encaixar o restante em fase 2, com intervalos seguros se houver tecnologia. Na consulta, peça: fotos ou medidas no mesmo critério e uma explicação didática da ordem dos procedimentos. Próximo passo: leve este resultado — a profissional ganha contexto e você sai com cronograma mais claro."},
    {"id": "r3", "label": "Foco emergindo", "minScore": 10, "headline": "Já dá para ver um eixo principal", "description": "Há uma direção razoável (zona + tipo de incômodo) ainda que não seja única. O que costuma ajudar: combinar massagem orientada (drenagem, modeladora ou relaxamento profundo) com hábitos simples entre sessões, conforme a avaliação. Na consulta, peça: expectativa realista em 4 a 8 semanas e o que será avaliado em cada retorno. Próximo passo: use o texto do resultado como lista de prioridades ao agendar."},
    {"id": "r2", "label": "Ainda a definir", "minScore": 6, "headline": "Um foco por vez costuma destravar o resto", "description": "Suas respostas ainda misturam objetivos — normal quando o incômodo é recente ou pouco nomeado. O que costuma ajudar: primeira sessão ou avaliação para traduzir queixa em protocolo (mãos, tecnologia ou combinação). Na consulta, peça: duas hipóteses de caminho (mais suave vs mais direcionada) e critérios de melhora. Próximo passo: marque avaliação e mencione as zonas que marcou aqui."},
    {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom momento para conversa guiada com a profissional", "description": "Você está no início do mapeamento ou com foco ainda amplo. O que costuma ajudar: não fechar pacote longo antes de entender pele, rotina e sensibilidade na avaliação presencial. Na consulta, peça: explicação do que é massagem, o que é tecnologia e o que é hábito — e como se complementam no seu caso. Próximo passo: guarde este resultado e leve ao primeiro contato com a clínica."}
  ],
  "ctaDefault": "Quero uma avaliação com base neste mapa",
  "resultIntro": "Seu resultado:"
}
$json$::jsonb,
  allowed_vars_json = '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
  version = 2,
  updated_at = NOW()
WHERE id = 'b1000120-0120-4000-8000-000000000120';

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000127-0127-4000-8000-000000000127',
    'quiz_perfil_massagem_estetica_corporal',
    'diagnostico',
    $json$
{
  "title": "Que tipo de massagem faz mais sentido para o seu corpo neste momento?",
  "introTitle": "Em 2 minutos: massagem certa para o que você sente — e o que levar à consulta",
  "introSubtitle": "Responda cinco perguntas sobre sensação, objetivo, frequência e preferências. No final recebe um perfil (relaxamento, drenagem, modeladora ou combinação) e um próximo passo para combinar com a sua esteticista.",
  "introMicro": "~2 min · 5 perguntas · resultado para enviar à clínica",
  "introBullets": [],
  "questions": [
    {"id": "q1", "text": "Hoje, o que você mais sente no corpo?", "type": "single", "options": ["Cansaço geral e tensão difusa", "Costas ou pescoço carregados", "Pernas pesadas ou inchaço ao fim do dia", "Quero trabalhar uma zona (abdômen, culote, flancos) com apoio de massagem"]},
    {"id": "q2", "text": "Nas próximas semanas, o que seria mais valioso para você?", "type": "single", "options": ["Dormir melhor e descontrair", "Aliviar tensão muscular do dia a dia", "Sentir mais leveza e circulação", "Somar bem-estar com contorno ou textura da pele"]},
    {"id": "q3", "text": "Com que frequência você conseguiria ir ao salão?", "type": "single", "options": ["Uma vez ao mês ou menos", "A cada duas semanas", "Uma vez por semana", "Duas vezes ou mais por semana"]},
    {"id": "q4", "text": "Sobre pressão na massagem, você prefere…", "type": "single", "options": ["Muito suave, quase sedosa", "Média, confortável", "Firme, que chegue bem ao músculo", "Ainda não sei — quero que a profissional indique"]},
    {"id": "q5", "text": "Além das mãos (massagem), tecnologias na mesma rotina…", "type": "single", "options": ["Prefiro só massagem por agora", "Aberta a sugestões pontuais", "Gosto de combinar quando faz sentido", "Já combino e quero otimizar o plano"]}
  ],
  "results": [
    {"id": "r4", "label": "Perfil combinado", "minScore": 9, "headline": "Seu corpo pede plano em camadas — mãos + possível tecnologia", "description": "Você tem zona de foco, ritmo de idas possível e abertura para combinar abordagens. Isso costuma funcionar melhor quando a profissional define ordem: sensação e circulação primeiro ou contorno conforme a avaliação, depois refinamento — sem empilhar tudo no mesmo dia sem critério. O que costuma ajudar: combinar massagem modeladora ou drenagem (conforme queixa) com orientação de hábitos entre sessões. Na consulta, peça: cronograma semanal-tipo, o que não misturar no mesmo dia e como medir evolução (sensação, fotos padronizadas ou circunferências). Próximo passo: envie este resultado à clínica e peça proposta alinhada ao seu ritmo."},
    {"id": "r3", "label": "Perfil direcionado", "minScore": 6, "headline": "Há um eixo claro — falta personalizar na avaliação", "description": "Suas respostas apontam para um tipo de objetivo dominante (relaxamento, leveza ou trabalho local) com frequência realista. O que costuma ajudar: escolher a linha principal (ex.: drenagem leve vs modeladora mais firme) e ajustar pressão à sua sensibilidade. Na consulta, peça: quantas sessões iniciais fazem sentido antes do primeiro balanço e o que fazer em casa (movimento leve, hidratação, sono). Próximo passo: use o resumo como guia de conversa na marcação."},
    {"id": "r2", "label": "Perfil bem-estar", "minScore": 3, "headline": "Prioridade forte em descanso, circulação ou alívio de tensão", "description": "O foco parece mais ligado a bem-estar e sensação do que a contorno imediato — ótimo para protocolos com massagem relaxante, drenagem suave ou trabalho postural, conforme avaliação. O que costuma ajudar: consistência moderada (mesmo que uma ida a cada duas semanas) com uma meta simples (ex.: menos rigidez ao acordar). Na consulta, peça: se há contraindicações a considerar e qual técnica a profissional recomenda primeiro. Próximo passo: marque uma primeira sessão ou avaliação e mencione o que marcou aqui."},
    {"id": "r1", "label": "Entrada suave", "minScore": 0, "headline": "Primeiro passo: conhecer o corpo e ajustar expectativa", "description": "Você está no início da jornada ou prefere ir devagar — perfeitamente válido. O que costuma ajudar: uma conversa inicial sobre objetivos e sensibilidade, com primeira massagem mais leve para mapear resposta do corpo. Na consulta, peça: explicação em linguagem simples das opções (relaxante, drenagem, modeladora) e o que esperar nas primeiras visitas. Próximo passo: guarde este resultado e leve ao primeiro contato com a esteticista."}
  ],
  "ctaDefault": "Quero alinhar massagem e protocolo na avaliação",
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
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'habitos', 'habitos', 'Em 2 minutos: que massagem faz sentido para o seu corpo agora?', 'Perfil de massagem (relaxamento, drenagem, modeladora ou combinação) com próximo passo para a consulta.', 'Dúvida sobre tipo de massagem ou protocolo', 'Qualificar interesse e preparar avaliação', 'custom', 'b1000127-0127-4000-8000-000000000127'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_perfil_massagem_estetica_corporal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 150, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000127-0127-4000-8000-000000000127');

UPDATE ylada_biblioteca_itens
SET titulo = 'Do travamento ao plano: onde você está com o seu corpo agora?',
    description = 'Mapeie travas, urgência e vitória desejada — resultado completo para levar à esteticista.',
    dor_principal = 'Indecisão ou adiamento',
    objetivo_principal = 'Clarear prioridade e próximo passo',
    meta = COALESCE(meta, '{}'::jsonb) || '{"nomenclatura": "quiz_prontidao_protocolo_corporal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb
WHERE template_id = 'b1000119-0119-4000-8000-000000000119'::uuid;

UPDATE ylada_biblioteca_itens
SET titulo = 'Qual zona do seu corpo pede atenção primeiro — e com que urgência?',
    description = 'Priorize zona, tempo de incômodo e tipo de mudança — mapa pronto para a consulta.',
    dor_principal = 'Insatisfação com zonas do corpo',
    objetivo_principal = 'Definir prioridade de tratamento',
    meta = COALESCE(meta, '{}'::jsonb) || '{"nomenclatura": "quiz_mapa_zonas_corpo", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb
WHERE template_id = 'b1000120-0120-4000-8000-000000000120'::uuid;
