-- Biblioteca YLADA v2: momento da conversa, dicas de uso, sequência; ferramentas Desafio 21 + Plano 90 dias.
-- PRÉ-REQUISITOS: 322 (tabela pro_lideres_script_templates e colunas meta nas secções).

ALTER TABLE pro_lideres_script_templates
  ADD COLUMN IF NOT EXISTS usage_hint TEXT,
  ADD COLUMN IF NOT EXISTS sequence_label TEXT,
  ADD COLUMN IF NOT EXISTS conversation_stage TEXT;

ALTER TABLE leader_tenant_pl_script_sections
  ADD COLUMN IF NOT EXISTS usage_hint TEXT,
  ADD COLUMN IF NOT EXISTS sequence_label TEXT,
  ADD COLUMN IF NOT EXISTS conversation_stage TEXT;

CREATE INDEX IF NOT EXISTS idx_pro_lideres_script_templates_stage
  ON pro_lideres_script_templates (conversation_stage);

COMMENT ON COLUMN pro_lideres_script_templates.usage_hint IS 'Uma linha: quando usar este modelo.';
COMMENT ON COLUMN pro_lideres_script_templates.sequence_label IS 'Resumo da sequência (ex.: Permissão → Pergunta → Convite).';
COMMENT ON COLUMN pro_lideres_script_templates.conversation_stage IS 'Filtro momento: primeiro_contato, pos_interesse, reativacao, convite, fechamento, objecao, indicacao, acompanhamento.';

DELETE FROM pro_lideres_script_templates;

INSERT INTO pro_lideres_script_templates (
  focus_main, intention_key, tool_preset_key, title, subtitle, usage_hint, sequence_label, conversation_stage, entries, sort_order
) VALUES
(
  'vendas', 'novos_contatos', 'bebida_funcional',
  'Bebidas funcionais — abordagem no primeiro contacto',
  'WhatsApp · 3 mensagens',
  'Use quando a pessoa ainda não demonstrou interesse; foco em energia e rotina leve.',
  'Permissão → Dor simples → Curiosidade',
  'primeiro_contato',
  $j$
[
  {"title":"1. Permissão","subtitle":"WhatsApp","body":"Oi! Tudo bem?\n\nPosso te fazer uma pergunta rápida?","how_to_use":"Abertura sem pressão."},
  {"title":"2. Identificação leve","subtitle":"WhatsApp","body":"Você sente que às vezes falta energia no meio do dia ou a rotina te puxa demais?","how_to_use":"Só depois do sim à permissão."},
  {"title":"3. Curiosidade","subtitle":"WhatsApp","body":"Perguntei porque tenho visto algo bem simples que algumas pessoas estão usando no dia a dia e achei que podia fazer sentido para você também.","how_to_use":"Se houver curiosidade, segue para convite à prova ou explicação curta."}
]
$j$::jsonb, 10
),
(
  'vendas', 'converter', 'bebida_funcional',
  'Bebidas funcionais — convite após interesse',
  'WhatsApp · 3 mensagens',
  'Use quando a pessoa já mostrou abertura (dor de energia/rotina).',
  'Validação → Solução leve → Convite',
  'convite',
  $j$
[
  {"title":"1. Validação","subtitle":"WhatsApp","body":"Pelo que você falou, faz sentido buscar algo mais prático no dia a dia.","how_to_use":"Retoma o que ela disse."},
  {"title":"2. Solução simples","subtitle":"WhatsApp","body":"Tenho uma opção bem simples que muita gente gosta pela praticidade.","how_to_use":"Sem prometer resultado."},
  {"title":"3. Convite","subtitle":"WhatsApp","body":"Quer que eu te mostre como funciona, no seu ritmo?","how_to_use":"Se sim, envia material ou combina prova."}
]
$j$::jsonb, 20
),
(
  'vendas', 'novos_contatos', 'espaco_saudavel',
  'Espaço Saudável — abordagem leve (primeiro contacto)',
  'WhatsApp · 3 mensagens',
  'Use com contacto morno ou conhecido; ainda sem pedir o link.',
  'Permissão → Identificação → Pergunta aberta',
  'primeiro_contato',
  $j$
[
  {"title":"1. Permissão","subtitle":"WhatsApp","body":"Oi! Posso te fazer uma pergunta rápida?","how_to_use":"Sempre no início."},
  {"title":"2. Identificação suave","subtitle":"WhatsApp","body":"Tenho falado com algumas pessoas que querem voltar a ter mais rotina e disposição no dia a dia…","how_to_use":"Tom consultivo."},
  {"title":"3. Pergunta","subtitle":"WhatsApp","body":"Isso tem feito falta para você também, ou hoje está tranquilo por aí?","how_to_use":"Se sim, segue para convite ao Espaço Saudável."}
]
$j$::jsonb, 30
),
(
  'vendas', 'converter', 'espaco_saudavel',
  'Espaço Saudável — convite depois de interesse',
  'WhatsApp · 3 mensagens',
  'Use quando a pessoa já demonstrou abertura à conversa.',
  'Validação → Simplicidade → Convite sem pressão',
  'convite',
  $j$
[
  {"title":"1. Validação","subtitle":"WhatsApp","body":"Entendi. Muita gente me fala algo parecido.","how_to_use":"Após ela admitir dor ou curiosidade."},
  {"title":"2. Caminho simples","subtitle":"WhatsApp","body":"Eu tenho um espaço onde consigo mostrar isso na prática, de forma simples e sem complicação.","how_to_use":"Sem prometer cura nem resultado médico."},
  {"title":"3. Convite","subtitle":"WhatsApp","body":"Se fizer sentido para você, posso te convidar a conhecer um dia, sem compromisso nenhum?","how_to_use":"Se aceitar, combina visita ou envia o link com permissão."}
]
$j$::jsonb, 40
),
(
  'vendas', 'reativar', 'espaco_saudavel',
  'Espaço Saudável — reativação sem cobrança',
  'WhatsApp · 2 mensagens',
  'Use quando o contacto esfriou mas há relação prévia.',
  'Reabertura → Conexão',
  'reativacao',
  $j$
[
  {"title":"1. Reabertura","subtitle":"WhatsApp","body":"Oi! Lembrei de você esses dias porque voltamos a falar com pessoas sobre rotina e energia. Como você está por aí?","how_to_use":"Zero tom de cobrança."},
  {"title":"2. Porta aberta","subtitle":"WhatsApp","body":"Se quiser retomar com calma, estou por aqui.","how_to_use":"Se responder, volta ao ponto em que pararam."}
]
$j$::jsonb, 50
),
(
  'vendas', 'novos_contatos', 'desafio_21',
  'Desafio 21 dias — abordagem (constância)',
  'WhatsApp · 3 mensagens',
  'Use quando a pessoa quer mudar hábito mas costuma travar na constância.',
  'Permissão → Identificação → Ponte para o desafio',
  'primeiro_contato',
  $j$
[
  {"title":"1. Permissão","subtitle":"WhatsApp","body":"Oi! Posso te fazer uma pergunta?","how_to_use":null},
  {"title":"2. Identificação","subtitle":"WhatsApp","body":"Você sente que começa bem, mas tem dificuldade em manter constância na rotina ou no corpo?","how_to_use":null},
  {"title":"3. Ponte","subtitle":"WhatsApp","body":"Perguntei porque estou com um desafio guiado de 21 dias para isso e lembrei de você.","how_to_use":"Se houver abertura, explica o desafio em mensagem à parte."}
]
$j$::jsonb, 60
),
(
  'vendas', 'converter', 'desafio_21',
  'Desafio 21 dias — convite',
  'WhatsApp · 3 mensagens',
  'Use quando já há interesse em mudar com acompanhamento curto.',
  'Validação → Acompanhamento → Convite claro',
  'convite',
  $j$
[
  {"title":"1. Validação","subtitle":"WhatsApp","body":"Perfeito. O que costuma fazer diferença é não tentar fazer tudo sozinho.","how_to_use":null},
  {"title":"2. Desafio guiado","subtitle":"WhatsApp","body":"Por isso estou com um desafio de 21 dias, com direção durante os dias.","how_to_use":null},
  {"title":"3. Convite","subtitle":"WhatsApp","body":"Quer que eu te explique como funciona e vejo se combina com você?","how_to_use":"Sem pressão de fecho."}
]
$j$::jsonb, 70
),
(
  'vendas', 'reativar', 'desafio_21',
  'Desafio 21 dias — nova turma',
  'WhatsApp · 2 mensagens',
  'Use para reativar quem mostrou interesse no passado.',
  'Lembrete → Convite suave',
  'reativacao',
  $j$
[
  {"title":"1. Lembrete","subtitle":"WhatsApp","body":"Oi! Lembrei de você porque estou abrindo uma nova fase do desafio de 21 dias.","how_to_use":null},
  {"title":"2. Convite","subtitle":"WhatsApp","body":"Você foi uma das pessoas que me veio à cabeça. Quer que eu explique em duas linhas como funciona?","how_to_use":null}
]
$j$::jsonb, 80
),
(
  'vendas', 'novos_contatos', 'plano_90_dias',
  'Plano 90 dias — abordagem mais qualificada',
  'WhatsApp · 2 mensagens',
  'Use quando a dor ou o objetivo pedem acompanhamento mais profundo (alto valor).',
  'Permissão → Qualificação suave',
  'primeiro_contato',
  $j$
[
  {"title":"1. Permissão","subtitle":"WhatsApp","body":"Oi! Posso te perguntar uma coisa com mais calma?","how_to_use":null},
  {"title":"2. Qualificação","subtitle":"WhatsApp","body":"Você está numa fase em que quer organizar rotina e resultado de verdade, ou ainda está experimentando coisas pontuais?","how_to_use":"Se quiser profundidade, marca conversa ou envia material do plano."}
]
$j$::jsonb, 90
),
(
  'vendas', 'converter', 'plano_90_dias',
  'Plano 90 dias — convite ao acompanhamento',
  'WhatsApp · 3 mensagens',
  'Use após conversa em que faz sentido pacote com acompanhamento.',
  'Clareza → Valor → Convite',
  'convite',
  $j$
[
  {"title":"1. Clareza","subtitle":"WhatsApp","body":"Pelo que você me contou, talvez o que você precise não seja algo solto de um dia para o outro.","how_to_use":null},
  {"title":"2. Acompanhamento","subtitle":"WhatsApp","body":"Há um plano de 90 dias com acompanhamento mais organizado — explico como funciona sem pressa.","how_to_use":"Sem promessas ilegais."},
  {"title":"3. Convite","subtitle":"WhatsApp","body":"Quer que eu explique em alto nível e você vê se faz sentido para o seu momento?","how_to_use":null}
]
$j$::jsonb, 100
),
(
  'vendas', 'acompanhar_cliente', 'plano_90_dias',
  'Plano 90 dias — check-in de evolução',
  'WhatsApp · 2 mensagens',
  'Use com quem já entrou no plano ou está em acompanhamento.',
  'Cuidado → Pergunta aberta',
  'acompanhamento',
  $j$
[
  {"title":"1. Check-in","subtitle":"WhatsApp","body":"Olá! Passei para saber como você tem se sentido até aqui com a evolução.","how_to_use":null},
  {"title":"2. Abertura","subtitle":"WhatsApp","body":"O que tem sido mais fácil e o que ainda te trava um pouco?","how_to_use":"Ouve antes de sugerir próximo passo."}
]
$j$::jsonb, 110
),
(
  'vendas', 'indicacao', 'espaco_saudavel',
  'Indicação leve — após boa experiência',
  'WhatsApp · 2 mensagens',
  'Use depois de a pessoa ter tido experiência positiva (sem pressão de extração).',
  'Validação → Terceira pessoa',
  'indicacao',
  $j$
[
  {"title":"1. Validação","subtitle":"WhatsApp","body":"Fico feliz que tenha feito sentido para você.","how_to_use":null},
  {"title":"2. Indicação suave","subtitle":"WhatsApp","body":"Quem você conhece que também poderia beneficiar de algo assim, com calma e zero obrigação?","how_to_use":"Saída honrosa se não houver nome."}
]
$j$::jsonb, 120
),
(
  'vendas', 'converter', 'conversa_um_a_um',
  'Objeções leves — respostas curtas',
  'WhatsApp · 5 respostas',
  'Use quando a pessoa trava com «vou pensar», tempo, dinheiro ou «preciso ver».',
  'Acolhimento → Pergunta útil',
  'objecao',
  $j$
[
  {"title":"«Vou pensar»","subtitle":"Resposta","body":"Claro, sem problema. O que você gostaria de entender melhor antes?","how_to_use":null},
  {"title":"«Agora não»","subtitle":"Resposta","body":"Tudo bem. Prefere que eu te chame em outro momento ou quer uma explicação rapidinha para avaliar com calma?","how_to_use":null},
  {"title":"«Sem dinheiro»","subtitle":"Resposta","body":"Entendo. Às vezes dá para começar por um caminho mais simples — o que faria mais sentido para você hoje?","how_to_use":null},
  {"title":"«Sem tempo»","subtitle":"Resposta","body":"Faz sentido. Muita gente que me diz isso procura justamente algo mais prático e guiado.","how_to_use":null},
  {"title":"«Preciso ver»","subtitle":"Resposta","body":"Posso explicar da forma mais simples possível para facilitar sua decisão.","how_to_use":null}
]
$j$::jsonb, 130
),
(
  'vendas', 'engajar', 'bebida_funcional',
  'Bebidas — acompanhamento inicial',
  'WhatsApp · 2 mensagens',
  'Use nos primeiros dias após a pessoa experimentar ou comprar.',
  'Cuidado → Continuidade',
  'acompanhamento',
  $j$
[
  {"title":"1. Check-in","subtitle":"WhatsApp","body":"Oi! Passei para saber como você tem se sentido nesses primeiros dias.","how_to_use":null},
  {"title":"2. Continuidade","subtitle":"WhatsApp","body":"O mais importante agora é continuidade, não perfeição. Como está correndo por aí?","how_to_use":null}
]
$j$::jsonb, 140
),
(
  'recrutamento', 'novos_contatos', 'plano_negocio',
  'Plano de negócio — abrir conversa (ético)',
  'WhatsApp · 2 mensagens',
  'Use com contacto aberto a projeto paralelo; sem prometer renda.',
  'Permissão → Curiosidade profissional',
  'primeiro_contato',
  $j$
[
  {"title":"1. Permissão","subtitle":"WhatsApp","body":"Oi! Tudo bem?\n\nPosso te pedir só um minuto?","how_to_use":null},
  {"title":"2. Curiosidade","subtitle":"WhatsApp","body":"Vi que você tem falado de [contexto]… Se fizer sentido, você teria uns minutos esta semana para eu te mostrar por alto como funciona o plano de negócio por aqui, sem compromisso?","how_to_use":"Sem garantias de ganho."}
]
$j$::jsonb, 200
),
(
  'recrutamento', 'converter', 'reuniao_participacao',
  'Reunião em participação — convite',
  'WhatsApp · 1 mensagem',
  'Use para convidar alguém já aquecido para conhecer o modelo na equipe.',
  'Permissão → Convite → Saída honrosa',
  'convite',
  $j$
[
  {"title":"Convite","subtitle":"WhatsApp","body":"Oi! Tudo bem?\n\nPosso te convidar para algo bem objetivo? Estamos com uma apresentação [dia/hora]. Se fizer sentido, topa participar para conhecer o modelo? Se não der, sem problema — me avisa.","how_to_use":"Convite ético."}
]
$j$::jsonb, 210
);
