-- Pro Líderes: WhatsApp nas respostas + material global «Pré-diagnóstico estratégico para líderes em liderança» (link por tenant via API).

ALTER TABLE pro_lideres_consultancy_form_responses
  ADD COLUMN IF NOT EXISTS respondent_whatsapp TEXT;

COMMENT ON COLUMN pro_lideres_consultancy_form_responses.respondent_whatsapp IS
  'WhatsApp indicado no pré-diagnóstico (cadastro / follow-up).';

INSERT INTO pro_lideres_consultancy_materials (id, title, material_kind, description, content, sort_order, is_published)
VALUES (
  'f8a3c2d1-4e5b-6a7c-8d9e-0f1a2b3c4d5e'::uuid,
  'Pré-diagnóstico estratégico para líderes em liderança',
  'formulario',
  NULL,
  $pl_pre_diag_json${
  "ui": {
    "contactBlockMode": "required_with_whatsapp",
    "nameLabel": "Nome completo (se for casal, os dois nomes)",
    "emailLabel": "E-mail",
    "whatsappLabel": "WhatsApp (com DDI ou DDD)"
  },
  "fields": [
    {
      "id": "pais_foco",
      "label": "País de foco principal da sua liderança",
      "type": "text",
      "required": true
    },
    {
      "id": "localizacao",
      "label": "Se for Brasil: estado principal. Se atuar em mais do que um país: indique até 2 países onde a equipa mais vive o dia a dia",
      "type": "textarea",
      "required": false
    },
    {
      "id": "anos_negocio",
      "label": "Há quantos anos no negócio (faixa, opcional)",
      "type": "select",
      "required": false,
      "options": [
        "menos de 10",
        "10–20",
        "20–30",
        "mais de 30",
        "Prefiro não informar"
      ]
    },
    {
      "id": "papel_lideranca",
      "label": "Papel ou reconhecimento na liderança hoje (opcional, texto curto)",
      "type": "text",
      "required": false
    },
    {
      "id": "maior_foco",
      "label": "Hoje o seu maior foco está em (pode marcar mais do que uma)",
      "type": "checkbox_group",
      "required": true,
      "options": [
        "Reativar grupo existente",
        "Construir nova equipa",
        "Fortalecer liderança atual",
        "Modernizar sistema de comunicação e rotina",
        "Aumentar vendas e consumo",
        "Atrair novos distribuidores",
        "Criar comunidade mais forte"
      ]
    },
    {
      "id": "perfil_equipe",
      "label": "Perfil predominante da sua equipa hoje",
      "type": "select",
      "required": true,
      "options": [
        "Grupo experiente, porém desmotivado",
        "Grupo ativo, mas com dificuldades modernas",
        "Grupo mais maduro, pouco digital",
        "Mistura forte entre quem está há muito tempo e quem é mais novo",
        "Muitos cadastros, pouca ativação",
        "Sensação clara de necessidade de renovação"
      ]
    },
    {
      "id": "ferramentas",
      "label": "O que a sua equipa mais utiliza hoje",
      "type": "checkbox_group",
      "required": true,
      "options": [
        "Lista quente / contactos pessoais",
        "WhatsApp (grupos ou mensagens diretas)",
        "Instagram / outras redes sociais",
        "Espaço físico / wellness / ponto de encontro",
        "Eventos presenciais",
        "Indicações e boca a boca",
        "Ainda não há um sistema claro definido"
      ]
    },
    {
      "id": "desafios",
      "label": "O que mais atrapalha nesses canais ou nessa rotina (pode marcar várias)",
      "type": "checkbox_group",
      "required": true,
      "options": [
        "Falta de constância",
        "Falta de novos contactos",
        "Desmotivação geral",
        "Comunicação desatualizada ou confusa",
        "Resistência ao digital",
        "Dificuldade em liderar ou alinhar líderes",
        "Falta de duplicação",
        "Queda de envolvimento ou de movimento na base",
        "Outro"
      ]
    },
    {
      "id": "mudanca_crescimento",
      "label": "Na sua visão, o que mais precisa de mudar para o negócio crescer de novo?",
      "type": "textarea",
      "required": true
    },
    {
      "id": "uma_prioridade",
      "label": "Se pudesse resolver só uma prioridade nos próximos meses, qual seria?",
      "type": "select",
      "required": true,
      "options": [
        "Reativar antigos líderes",
        "Atrair nova geração",
        "Melhorar sistema de comunicação",
        "Criar comunidade mais forte",
        "Melhorar vendas e consumo",
        "Gerar novos contactos de forma sustentável",
        "Estruturar liderança duplicável"
      ]
    },
    {
      "id": "peso_reuniao",
      "label": "O que você espera do nosso encontro (opcional)",
      "type": "textarea",
      "required": false
    }
  ]
}$pl_pre_diag_json$::jsonb,
  -100,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();
