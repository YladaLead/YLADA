-- Pro Líderes: biblioteca YLADA de templates + metadados (foco, intenção, ferramenta) nas secções do líder.
-- PRÉ-REQUISITOS: 312 (leader_tenant_pl_script_sections), 316 (visible_to_team).

CREATE TABLE IF NOT EXISTS pro_lideres_script_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  focus_main TEXT NOT NULL CHECK (focus_main IN ('vendas', 'recrutamento')),
  intention_key TEXT NOT NULL,
  tool_preset_key TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  entries JSONB NOT NULL DEFAULT '[]'::JSONB,
  sort_order INT NOT NULL DEFAULT 0,
  vertical_code TEXT,
  CONSTRAINT pro_lideres_script_templates_title_nonempty CHECK (length(trim(title)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_pro_lideres_script_templates_focus
  ON pro_lideres_script_templates (focus_main, sort_order);

COMMENT ON TABLE pro_lideres_script_templates IS
  'Biblioteca pronta Pro Líderes (YLADA). Cópia para leader_tenant_pl_script_sections via API.';

DROP TRIGGER IF EXISTS tr_pro_lideres_script_templates_updated_at ON pro_lideres_script_templates;
CREATE TRIGGER tr_pro_lideres_script_templates_updated_at
  BEFORE UPDATE ON pro_lideres_script_templates
  FOR EACH ROW
  EXECUTE FUNCTION leader_tenant_pl_script_sections_set_updated_at();

ALTER TABLE leader_tenant_pl_script_sections
  ADD COLUMN IF NOT EXISTS focus_main TEXT NOT NULL DEFAULT 'vendas'
    CHECK (focus_main IN ('vendas', 'recrutamento')),
  ADD COLUMN IF NOT EXISTS intention_key TEXT NOT NULL DEFAULT 'geral',
  ADD COLUMN IF NOT EXISTS tool_preset_key TEXT,
  ADD COLUMN IF NOT EXISTS source_template_id UUID REFERENCES pro_lideres_script_templates (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_pl_script_sections_tenant_focus
  ON leader_tenant_pl_script_sections (leader_tenant_id, focus_main);

CREATE INDEX IF NOT EXISTS idx_pl_script_sections_tenant_intention
  ON leader_tenant_pl_script_sections (leader_tenant_id, intention_key);

COMMENT ON COLUMN leader_tenant_pl_script_sections.focus_main IS 'vendas | recrutamento — filtro e contexto.';
COMMENT ON COLUMN leader_tenant_pl_script_sections.intention_key IS 'Alinhado ao guiado (ex.: novos_contatos) ou geral.';
COMMENT ON COLUMN leader_tenant_pl_script_sections.tool_preset_key IS 'Preset do fluxo guiado (ex.: espaco_saudavel), opcional.';
COMMENT ON COLUMN leader_tenant_pl_script_sections.source_template_id IS 'Se copiado da biblioteca YLADA.';

ALTER TABLE pro_lideres_script_templates ENABLE ROW LEVEL SECURITY;

-- Seed (textos ilustrativos; líder duplica e edita no tenant)
INSERT INTO pro_lideres_script_templates (focus_main, intention_key, tool_preset_key, title, subtitle, entries, sort_order)
VALUES
(
  'vendas',
  'novos_contatos',
  'espaco_saudavel',
  'Espaço saudável — antes do link',
  'WhatsApp · 3 mensagens (exemplo)',
  $tpl$
[
  {"title":"1. Permissão","subtitle":"WhatsApp · 1:1","body":"Oi, [nome]! Tudo bem?\n\nPosso te mandar um link curtinho do Espaço Saudável só para você ver no seu tempo, sem compromisso?","how_to_use":"Primeiro contato ou retomada leve."},
  {"title":"2. Envio do link","subtitle":"WhatsApp · 1:1","body":"Aqui está: [cole o link]\n\nQuando puder, me diz o que achou. Se fizer sentido, pensa em alguém da família que possa curtir também.","how_to_use":"Depois que a pessoa aceitar receber o link."},
  {"title":"3. Acompanhamento","subtitle":"WhatsApp · 1:1","body":"Oi, [nome]! Passando só para saber se conseguiu abrir. Qualquer dúvida, me chama aqui.","how_to_use":"Um ou dois dias depois, se não houver retorno."}
]
$tpl$::JSONB,
  10
),
(
  'vendas',
  'indicacao',
  'indicacoes',
  'Pedir indicação — tom consultivo',
  'WhatsApp · exemplo curto',
  $tpl$
[
  {"title":"Mensagem única","subtitle":"WhatsApp","body":"[nome], você conhece alguém que esteja buscando cuidar melhor da rotina essa semana? Se topar me indicar um nome, eu te agradeço — zero pressão.","how_to_use":"Cliente ou contato morno que já te responde bem."}
]
$tpl$::JSONB,
  20
),
(
  'recrutamento',
  'novos_contatos',
  'plano_negocio',
  'Plano de negócio — abrir conversa',
  'WhatsApp · sem prometer renda',
  $tpl$
[
  {"title":"1. Curiosidade profissional","subtitle":"WhatsApp · 1:1","body":"Oi, [nome]! Vi que você tem falado de [contexto]. Você teria uns minutos esta semana para eu te mostrar como funciona o plano de negócio por aqui, sem compromisso?","how_to_use":"Contato que demonstra abertura a renda extra ou projeto paralelo."},
  {"title":"2. Depois do sim","subtitle":"WhatsApp · 1:1","body":"Perfeito. Te mando um material bem curto e, se fizer sentido, marcamos um café virtual de 15 minutos.","how_to_use":"Após aceite para ver o plano."}
]
$tpl$::JSONB,
  30
),
(
  'recrutamento',
  'converter',
  'reuniao_participacao',
  'Reunião em participação — convite',
  'Mensagem curta',
  $tpl$
[
  {"title":"Convite para a próxima reunião","subtitle":"WhatsApp","body":"[nome], estamos com uma reunião de apresentação [dia/hora]. Você topa participar para conhecer o modelo? Se não der, sem problema — me avisa.","how_to_use":"Convite ético, sem garantia de ganhos."}
]
$tpl$::JSONB,
  40
);
