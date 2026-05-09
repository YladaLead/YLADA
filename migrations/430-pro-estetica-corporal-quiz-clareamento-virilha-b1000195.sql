-- Pro Estética corporal: quiz dedicado a clareamento de virilha (template b1000195).
-- OG estática: `public/images/og/pro-estetica-corporal/clareamento-virilha-proximo-passo-seguro.jpg`
-- (par com b1000194 → axilas/íntimo + `clareamento-intimo-axilas-proximo-passo-seguro.jpg`, b1000193 → tatuagem/micro).
-- Idempotente: limpa outcomes/cache deste ID; ON CONFLICT no template; WHERE NOT EXISTS no item de biblioteca.
-- @see src/config/pro-estetica-corporal-biblioteca.ts, src/config/ylada-link-og-image-bank.ts

DELETE FROM public.ylada_flow_diagnosis_outcomes
WHERE diagnosis_vertical = 'corporal'
  AND architecture = 'RISK_DIAGNOSIS'
  AND template_id = 'b1000195-0195-4000-8000-000000000195'::uuid;

DELETE FROM public.ylada_diagnosis_cache c
USING public.ylada_links y
WHERE c.link_id = y.id
  AND y.template_id = 'b1000195-0195-4000-8000-000000000195'::uuid;

INSERT INTO public.ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000195-0195-4000-8000-000000000195',
    'quiz_clareamento_virilha_corporal',
    'diagnostico',
    $t195$
    {
      "title": "Clareamento de virilha: abrir conversa com segurança",
      "introTitle": "Virilha e linha do biquíni: expectativa realista",
      "introSubtitle": "Quatro perguntas sobre tom, atrito, o que já tentou e objetivo. Na consulta a profissional explica o que é indicado para o seu tipo de pele — sem promessa de tom “padrão”.",
      "introMicro": "Cerca de 1 min · 4 perguntas",
      "introBullets": [],
      "questions": [
        {"id": "q1", "text": "O que mais te incomoda na virilha ou linha do biquíni?", "type": "single", "options": ["Tom mais escuro que o restante do corpo", "Manchas ou áreas irregulares após depilação", "Irritação frequente ou “bolinhas”", "Quero só entender o que é possível com segurança"]},
        {"id": "q2", "text": "Isso afeta sua autoestima ou rotina (praia, roupa íntima)?", "type": "single", "options": ["Quero prevenção ou manutenção suave", "Pouco, mas gostaria de melhorar", "Moderadamente — incomoda em algumas situações", "Muito — impacta confiança ou escolhas de roupa"]},
        {"id": "q3", "text": "Você já tentou algum tratamento na região?", "type": "single", "options": ["Nunca", "Cremes ou loções (compra ou prescrição)", "Procedimentos estéticos na área", "Métodos caseiros ou mistura de produtos"]},
        {"id": "q4", "text": "Seu maior objetivo é:", "type": "single", "options": ["Clarear visivelmente com acompanhamento", "Uniformizar tom sem abalar a barreira da pele", "Critério profissional antes de decidir", "Melhorar confiança no dia a dia"]}
      ],
      "results": [
        {"id": "r4", "label": "Impacto elevado", "minScore": 9, "headline": "Zona sensível e autoestima — priorize avaliação acolhedora", "description": "Suas respostas indicam que o incômodo já pesa no cotidiano. Clareamento em virilha exige calibragem de ativo, intervalo e fotoproteção. Na mensagem, peça horário e diga se há gestação, depilação recente ou irritação ativa — ajuda a clínica a orientar sem constrangimento."},
        {"id": "r3", "label": "Boa candidatura", "minScore": 6, "headline": "Dá para montar plano gradual", "description": "Há objetivo claro e histórico que a profissional precisa cruzar com tipo de escurecimento (fricção, pós-inflamatório, hormonal). Muitas pessoas respondem a séries espaçadas combinadas com hábitos suaves em casa."},
        {"id": "r2", "label": "Exploratório", "minScore": 3, "headline": "Ainda definindo prioridade — ok começar pela conversa", "description": "Impacto moderado ou tentativas anteriores pedem revisão do que funcionou ou irritou. Se se sentir confortável, leve fotos com luz uniforme para comparar evolução."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Prevenção ou primeiro contato", "description": "Mesmo com incômodo leve, avaliação ajuda a evitar produtos agressivos que podem escurecer mais a longo prazo. Use o resultado para pedir orientação sob medida."}
      ],
      "ctaDefault": "Quero conversar sobre clareamento de virilha com a profissional",
      "resultIntro": "Seu resultado:"
    }
    $t195$::jsonb,
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
SELECT 'quiz', ARRAY['aesthetics', 'nutrition', 'fitness'], 'pele', 'habitos', 'Clareamento de virilha: zona sensível, próximo passo seguro', 'Tom, atrito, depilação e objetivo — convite à conversa sem promessa de tom “padrão”.', 'Escurecimento ou irritação na virilha', 'Clarear virilha com orientação profissional', 'custom', 'b1000195-0195-4000-8000-000000000195'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_clareamento_virilha_corporal", "num_perguntas": 4, "tempo_minutos": 2, "diagnosis_vertical": "corporal", "architecture": "RISK_DIAGNOSIS"}'::jsonb, 314, true
WHERE NOT EXISTS (SELECT 1 FROM public.ylada_biblioteca_itens WHERE template_id = 'b1000195-0195-4000-8000-000000000195');

INSERT INTO public.ylada_flow_diagnosis_outcomes (template_id, architecture, archetype_code, diagnosis_vertical, content_json)
VALUES
  (
    'b1000195-0195-4000-8000-000000000195',
    'RISK_DIAGNOSIS',
    'leve',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Clareamento na virilha — começar com critério e sem fórmulas caseiras arriscadas',
      'profile_summary', 'Pelas respostas, o incômodo é leve ou preventivo. Virilha reage mal a esfoliação agressiva ou ácidos sem supervisão. Na avaliação você entende o que é fisiológico, o que é fricção/depilação e o que pode melhorar com protocolo suave.',
      'frase_identificacao', 'Se te identificas, queres orientação antes de comprar mais um creme aleatório.',
      'main_blocker', 'Produtos fortes sem critério costumam irritar dobras e escurecer mais a longo prazo.',
      'consequence', 'Sem direção, o gasto com soluções erradas soma e a pele pode ficar sensível.',
      'growth_potential', 'Pergunte na consulta sobre método de depilação, roupa apertada e suor — são causas comuns.',
      'dica_rapida', 'Fotos são opcionais; o importante é você se sentir acolhida para falar de rotina.',
      'cta_text', 'Quero orientação sobre clareamento de virilha',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre clareamento de virilha. O resultado saiu leve — quero marcar avaliação para entender o que faz sentido com segurança.'
    )
  ),
  (
    'b1000195-0195-4000-8000-000000000195',
    'RISK_DIAGNOSIS',
    'moderado',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Tom ou textura incomodando — combinar hábito e protocolo profissional',
      'profile_summary', 'As respostas mostram impacto moderado ou tentativas anteriores. Clareamento gradual costuma unir ativos específicos, intervalo seguro e fotoproteção — sem promessa de tom “padrão de catálogo”.',
      'frase_identificacao', 'Se isso é você, já notou diferença de cor ou irritação recorrente na região.',
      'main_blocker', 'Misturar vários ácidos em casa com procedimento na clínica na mesma semana irrita e mancha.',
      'consequence', 'Pausar por vergonha atrasa o que poderia ser resolvido com calma em etapas.',
      'growth_potential', 'Mencione hormonais, gestação recente ou atrito por atividade — contexto muda o plano.',
      'dica_rapida', 'Depilação no dia do procedimento forte costuma ser contraindicada — confirme na clínica.',
      'cta_text', 'Quero avaliar clareamento de virilha na clínica',
      'whatsapp_prefill', 'Oi! Fiz o questionário de clareamento de virilha; o perfil saiu moderado. Quero avaliação para combinar protocolo e cuidados em casa com segurança.'
    )
  ),
  (
    'b1000195-0195-4000-8000-000000000195',
    'RISK_DIAGNOSIS',
    'urgente',
    'corporal',
    jsonb_build_object(
      'profile_title', 'Autoestima muito afetada — peça acolhimento e plano claro na clínica',
      'profile_summary', 'Pelas respostas, o tema já interfere em confiança, roupa ou momentos de proximidade. O próximo passo é conversa respeitosa com profissional: ritmo, limites e sinais de pausa — priorizando saúde da pele fina da região.',
      'frase_identificacao', 'Se te revês aqui, o incômodo é real e merece escuta técnica.',
      'main_blocker', 'Garantir resultado rápido a qualquer custo atrai ofertas arriscadas fora do perfil da sua pele.',
      'consequence', 'Adiar pode manter sofrimento desnecessário; agir sem critério pode piorar a barreira cutânea.',
      'growth_potential', 'Peça encaixe e diga se há irritação ativa (ardor, feridas) — pode precisar acalmar antes de clareamento ativo.',
      'dica_rapida', 'Irritação ativa precisa ser resolvida antes de clareamento intenso — avise na recepção.',
      'cta_text', 'Quero avaliação prioritária (clareamento de virilha)',
      'whatsapp_prefill', 'Oi! Fiz o questionário sobre clareamento de virilha; o resultado saiu com impacto alto na autoestima. Preciso de avaliação com prioridade — há horário com a profissional?'
    )
  );
