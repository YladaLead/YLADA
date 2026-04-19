-- Alinha textos seed da biblioteca YLADA com light copy, permissão explícita e
-- indicação como missão (pós-322). Idempotente: atualiza por título.

UPDATE pro_lideres_script_templates
SET
  subtitle = 'WhatsApp · 3 mensagens (exemplo)',
  entries = $tpl$
[
  {"title":"1. Permissão","subtitle":"WhatsApp · 1:1","body":"Oi, [nome]! Tudo bem?\n\nPosso te mandar um link curtinho do Espaço Saudável só para você ver no seu tempo, sem compromisso?","how_to_use":"Primeiro contato ou retomada leve."},
  {"title":"2. Envio do link","subtitle":"WhatsApp · 1:1","body":"Aqui está: [cole o link]\n\nQuando puder, conta o que achou. Se fizer sentido para ti, talvez valha pensar em alguém da casa ou do trabalho que também gostasse de ver com calma — sem qualquer obrigação.","how_to_use":"Depois que a pessoa aceitar receber o link."},
  {"title":"3. Acompanhamento","subtitle":"WhatsApp · 1:1","body":"Oi, [nome]! Passando só para saber se conseguiu abrir. Qualquer dúvida, me chama aqui.","how_to_use":"Um ou dois dias depois, se não houver retorno."}
]
$tpl$::jsonb,
  updated_at = NOW()
WHERE title = 'Espaço saudável — antes do link';

UPDATE pro_lideres_script_templates
SET
  subtitle = 'WhatsApp · permissão + missão (sem pressão)',
  entries = $tpl$
[
  {"title":"1. Permissão","subtitle":"WhatsApp · 1:1","body":"Oi, [nome]! Tudo bem?\n\nPosso te fazer uma pergunta bem leve? É rápida e sem compromisso.","how_to_use":"Sempre antes de pedir nome ou indicação."},
  {"title":"2. Indicação como missão","subtitle":"WhatsApp · 1:1","body":"Obrigado por abrir espaço. Estou numa rodinha com quem já confia em mim: tem **alguém que você conheça** (amigo, familiar ou colega) a quem faria sentido só **saber mais** sobre cuidar um pouco melhor da rotina — tipo uma dica, sem obrigação?\n\nSe não vier ninguém à cabeça, está tudo certo; se pintar um nome depois, me chama aqui.","how_to_use":"Só depois do sim à permissão. Terceira pessoa, propósito de ajuda, saída honrosa."}
]
$tpl$::jsonb,
  updated_at = NOW()
WHERE title = 'Pedir indicação — tom consultivo';

UPDATE pro_lideres_script_templates
SET
  entries = $tpl$
[
  {"title":"1. Permissão e curiosidade","subtitle":"WhatsApp · 1:1","body":"Oi, [nome]! Tudo bem?\n\nPosso te pedir só um minuto? Vi que você tem falado de [contexto]… Se fizer sentido, teria uns minutos esta semana para eu te mostrar **por alto** como funciona o plano de negócio por aqui, sem compromisso nenhum?","how_to_use":"Contato que demonstra abertura a renda extra ou projeto paralelo."},
  {"title":"2. Depois do sim","subtitle":"WhatsApp · 1:1","body":"Perfeito. Te mando um material bem curto e, se fizer sentido, marcamos um café virtual de 15 minutos.","how_to_use":"Após aceite para ver o plano."}
]
$tpl$::jsonb,
  updated_at = NOW()
WHERE title = 'Plano de negócio — abrir conversa';

UPDATE pro_lideres_script_templates
SET
  entries = $tpl$
[
  {"title":"Convite para a próxima reunião","subtitle":"WhatsApp","body":"Oi, [nome]! Tudo bem?\n\nPosso te convidar para algo bem objetivo? Estamos com uma reunião de apresentação [dia/hora]. Se fizer sentido para ti, topa participar para conhecer o modelo? Se não der, sem problema — me avisa.","how_to_use":"Convite ético, sem garantia de ganhos; permissão antes do convite."}
]
$tpl$::jsonb,
  updated_at = NOW()
WHERE title = 'Reunião em participação — convite';
