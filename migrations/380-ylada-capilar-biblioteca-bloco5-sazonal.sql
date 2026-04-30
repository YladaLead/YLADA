-- Terapia capilar — Bloco 5: SAZONAL / CAMPANHAS (anúncios, stories, datas).
-- Templates b1000186–b1000191. Copy pode ser trocada por UTM; estrutura técnica igual aos blocos anteriores.
-- @see src/config/pro-estetica-capilar-biblioteca.ts

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000186-0186-4000-8000-000000000186',
    'quiz_capilar_queda_sazonal',
    'diagnostico',
    $c186$
    {
      "title": "Queda sazonal: será que o seu cabelo está só \"trocando de fase\" ou pede avaliação?",
      "introTitle": "Mais fio no banho em certa época do ano: antes de se desesperar, vale separar sazonal do que precisa de plano?",
      "introSubtitle": "Cinco perguntas sobre duração, padrão e outros sintomas; na presencial a profissional orienta — queda sazonal existe, mas nem tudo que cai é \"normal\" para sempre.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Há quanto tempo a queda está mais evidente?", "type": "single", "options": ["Menos de 3 semanas", "3 a 8 semanas", "2 a 4 meses", "Mais de 4 meses"]},
        {"id": "q2", "text": "A queda veio junto de mudança de estação ou viagem forte de clima?", "type": "single", "options": ["Não relaciono", "Talvez", "Sim, próximo da data", "Não sei — só notei o cabelo"]},
        {"id": "q3", "text": "Fios finos na raiz, falhas ou couro muito sensível apareceram junto?", "type": "single", "options": ["Não", "Leve", "Moderado", "Sim, bastante"]},
        {"id": "q4", "text": "Outras mudanças (peso, sono, estresse, doença, parto nos últimos 12 meses)?", "type": "single", "options": ["Nada disso", "Uma coisa", "Várias", "Prefiro falar na consulta"]},
        {"id": "q5", "text": "O que você quer agora?", "type": "single", "options": ["Só tranquilidade", "Rotina em casa para apoiar", "Avaliação capilar", "Checar se preciso de outro tipo de avaliação"]}
      ],
      "results": [
        {"id": "r4", "label": "Ultrapassou o \"comum\"", "minScore": 12, "headline": "Tempo longo ou sinais fortes pedem conversa — sazonal não explica tudo para sempre", "description": "Na avaliação capilar você organiza o relato e o que observar. Se fizer sentido, a profissional sugere outros cuidados de saúde — sem drama, com critério."},
        {"id": "r3", "label": "Compatível com fase", "minScore": 9, "headline": "Perfil para apoio capilar + rotina gentil enquanto o ciclo passa", "description": "Suas respostas cabem em shampoo adequado, menos tração no fio e talvez sessões de couro. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Ainda observando", "minScore": 5, "headline": "Vale registrar por 2 a 3 semanas antes de concluir", "description": "Foto do ralo e data no calendário ajudam. Se estabilizar, segue vida; se subir, marca consulta."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre queda e época do ano", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar o que é ciclo do cabelo com o que merece checklist na primeira visita."}
      ],
      "ctaDefault": "Quero avaliar minha queda (sazonal ou não)",
      "resultIntro": "Seu resultado:"
    }
    $c186$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000187-0187-4000-8000-000000000187',
    'quiz_capilar_pos_verao',
    'diagnostico',
    $c187$
    {
      "title": "Pós-verão: sol, praia e piscina deixaram seu cabelo e couro pedindo recuperação?",
      "introTitle": "Ressecamento, cor desbotada ou couro irritado depois do verão: será que é hora de protocolo e não só \"um creminho\"?",
      "introSubtitle": "Cinco perguntas sobre exposição e sensação; na presencial a profissional monta recuperação em fases — pós-verão costuma ser couro + fio + cor, cada um no seu tempo.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Quanto tempo você passou com sol forte ou água salgada/cloro neste verão?", "type": "single", "options": ["Pouco", "Alguns fins de semana", "Várias semanas", "Quase o verão inteiro"]},
        {"id": "q2", "text": "Cor ou luzes desbotaram mais que o normal?", "type": "single", "options": ["Não colore", "Leve", "Moderado", "Muito — cor \"sumiu\""]},
        {"id": "q3", "text": "Couro: coceira, queimação ou caspa após sol ou piscina?", "type": "single", "options": ["Não", "Leve", "Moderado", "Forte"]},
        {"id": "q4", "text": "O fio está áspero, embaraçando ou quebrando mais?", "type": "single", "options": ["Quase igual ao início do verão", "Um pouco", "Bastante", "Muito — preciso de plano"]},
        {"id": "q5", "text": "O que você quer na volta da temporada?", "type": "single", "options": ["Só hidratar em casa", "Corte + hidratação", "Protocolo no salão", "Plano completo couro + fio + cor"]}
      ],
      "results": [
        {"id": "r4", "label": "Recuperação prioritária", "minScore": 12, "headline": "Exposição alta + sintomas no couro e no fio pedem sequência", "description": "Na consulta dá para priorizar o que entra primeiro: alívio do couro, reconstrução ou cor — sem prometer milagre em uma ida."},
        {"id": "r3", "label": "Bom protocolo sazonal", "minScore": 9, "headline": "Há espaço para 2 a 4 sessões bem planejadas + casa", "description": "Suas respostas cabem em detox suave, nutrição e proteção até a próxima estação. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Ajuste leve", "minScore": 5, "headline": "Às vezes bastam máscara certa e pausa de calor", "description": "Nem todo pós-verão precisa pacote gigante. Vale conversar antes de comprar linha inteira."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa pós-verão", "description": "Com base nas suas respostas, o próximo passo costuma ser foto do cabelo em luz natural e lista do que você usou no sol — para montar plano realista."}
      ],
      "ctaDefault": "Quero plano pós-verão para meu cabelo",
      "resultIntro": "Seu resultado:"
    }
    $c187$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000188-0188-4000-8000-000000000188',
    'quiz_capilar_pos_progressiva_alisamento',
    'diagnostico',
    $c188$
    {
      "title": "Pós-progressiva ou alisamento: seu fio está pedindo pausa ou reconstrução?",
      "introTitle": "Retoque atrasado, raiz rebelde ou fio fino: será que a próxima decisão é técnica e não só \"marcar de novo\"?",
      "introSubtitle": "Cinco perguntas sobre intervalo, quebra e sensação; na presencial a profissional alinha retoque com saúde do fio — continuidade segura vale mais que data no calendário a qualquer custo.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Há quanto tempo foi o último alisamento ou progressiva?", "type": "single", "options": ["Menos de 2 meses", "2 a 4 meses", "4 a 8 meses", "Mais de 8 meses"]},
        {"id": "q2", "text": "Quebra, elástico ou pontas finas aumentaram?", "type": "single", "options": ["Não", "Leve", "Moderado", "Muito"]},
        {"id": "q3", "text": "Raiz com volume ou frizz que \"não obedece\" ao liso?", "type": "single", "options": ["Quase nada", "Leve", "Moderado", "Muito — quero retocar logo"]},
        {"id": "q4", "text": "O que você sente ao lavar (repuxar, emborrachado, elástico demais)?", "type": "single", "options": ["Normal", "Leve estranheza", "Emborrachado ou elástico", "Muito seco ou quebrando"]},
        {"id": "q5", "text": "Próximo passo desejado:", "type": "single", "options": ["Só avaliar se o fio aguenta retoque", "Reconstruir antes de retocar", "Mudar de técnica com orientação", "Plano longo com a profissional"]}
      ],
      "results": [
        {"id": "r4", "label": "Pausa técnica", "minScore": 12, "headline": "Fio reagente com retoque apertando pede conversa antes de mais química", "description": "Na avaliação dá para combinar nutrição/reconstrução e data segura. Pressa costuma ser o que mais afinha o cabelo."},
        {"id": "r3", "label": "Retoque com critério", "minScore": 9, "headline": "Há espaço para alinhar raiz sem sacrificar comprimento", "description": "Suas respostas cabem em diagnóstico capilar + escolha de produto entre uma química e outra. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Manutenção", "minScore": 5, "headline": "Ainda dá para segurar com casa + salão sem drama", "description": "Às vezes só falta leave-in certo e temperatura do secador até a data do retoque."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa pós-progressiva", "description": "Com base nas suas respostas, o próximo passo costuma ser foto do comprimento e honestidade sobre último processo — para a profissional decidir com segurança."}
      ],
      "ctaDefault": "Quero orientação pós-progressiva ou alisamento",
      "resultIntro": "Seu resultado:"
    }
    $c188$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000189-0189-4000-8000-000000000189',
    'quiz_capilar_campanha_menopausa_cabelo',
    'diagnostico',
    $c189$
    {
      "title": "Menopausa e cabelo: seco, fino ou diferente — o que faz sentido na sua fase?",
      "introTitle": "Mudança de textura ou queda na perimenopausa ou menopausa: será que um plano capilar ajuda sem misturar tudo com \"só hormônio\"?",
      "introSubtitle": "Cinco perguntas sobre tempo e sintomas; acompanhamento ginecológico ou geral continua com seu médico — aqui organizamos cuidado do fio e do couro com continuidade e respeito.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "O que mais mudou no cabelo recentemente?", "type": "single", "options": ["Quase nada", "Mais seco ou opaco", "Mais fino ou com menos volume", "Queda mais evidente"]},
        {"id": "q2", "text": "Há quanto tempo percebe essa fase?", "type": "single", "options": ["Menos de 2 meses", "2 a 6 meses", "6 a 12 meses", "Mais de 1 ano"]},
        {"id": "q3", "text": "Você conversou com profissional de saúde sobre menopausa, tireoide ou suplementação?", "type": "single", "options": ["Sim, atualizado", "Há um tempo", "Ainda não", "Prefiro na consulta capilar só o capilar"]},
        {"id": "q4", "text": "Couro: oleoso, seco, sensível ou parecido ao sempre?", "type": "single", "options": ["Parecido", "Mais oleoso", "Mais seco", "Mais sensível"]},
        {"id": "q5", "text": "O que você quer da clínica capilar?", "type": "single", "options": ["Hidratação e brilho", "Volume e sensação de corpo", "Menos queda na escova", "Plano completo com honestidade"]}
      ],
      "results": [
        {"id": "r4", "label": "Plano integrado", "minScore": 12, "headline": "Várias mudanças juntas pedem capilar organizado e saúde geral em dia", "description": "Terapia capilar ajuda com textura, couro e rotina. Exames e ajustes com médico ficam no seu time de saúde — a clínica entra com o que é dela, sem confusão de papéis."},
        {"id": "r3", "label": "Protocolo de fase", "minScore": 9, "headline": "Há espaço para nutrição, fortalecimento e frequência realista", "description": "Suas respostas cabem em sessões espaçadas com foco em envelhecimento do fio com dignidade. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Suave", "minScore": 5, "headline": "Ainda dá para começar com ajuste de shampoo e máscara", "description": "Pequenas mudanças já melhoram sensação até você decidir pacote maior."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa sobre cabelo na menopausa", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar meta com o que o fio aguenta hoje — com linguagem acolhedora."}
      ],
      "ctaDefault": "Quero plano capilar para minha fase",
      "resultIntro": "Seu resultado:"
    }
    $c189$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000190-0190-4000-8000-000000000190',
    'quiz_capilar_fim_ano_estresse',
    'diagnostico',
    $c190$
    {
      "title": "Fim de ano cheio: seu cabelo está sentindo o ritmo também?",
      "introTitle": "Correria, menos sono e mais retocar visual: será que o cabelo virou último da lista — e está cobrando?",
      "introSubtitle": "Cinco perguntas sobre sono, química de festa e tempo; na presencial a profissional propõe um respiro capilar realista — autocuidado também é estratégia.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "Nas últimas semanas seu sono foi…", "type": "single", "options": ["Regular", "Curto mas ok", "Ruim várias noites", "Péssimo quase sempre"]},
        {"id": "q2", "text": "Queda ou frizz pioraram nesse período?", "type": "single", "options": ["Não", "Leve", "Moderado", "Bastante"]},
        {"id": "q3", "text": "Química, escova ou penteado extra para festas?", "type": "single", "options": ["Nada além do normal", "Um pouco mais", "Várias vezes", "Quase toda semana"]},
        {"id": "q4", "text": "Tempo real para cuidar do cabelo em casa?", "type": "single", "options": ["Consigo manter", "Reduzi sem querer", "Quase zero", "Só no salão quando dá"]},
        {"id": "q5", "text": "O que você quer de presente para você mesma neste ciclo?", "type": "single", "options": ["Um reset rápido no salão", "Rotina mínima que funcione", "Sessão relax com resultado", "Plano para janeiro inteiro"]}
      ],
      "results": [
        {"id": "r4", "label": "Sobrecarga", "minScore": 12, "headline": "Sono, estresse e excesso de processo aparecem juntos no seu relato", "description": "O cabelo reage ao ritmo. Na consulta dá para combinar algo leve que caiba na agenda e alivie o espelho — sem culpa de \"não dar conta\"."},
        {"id": "r3", "label": "Respiro capilar", "minScore": 9, "headline": "Uma ou duas sessões bem escolhidas já reorganizam o mês", "description": "Suas respostas cabem em protocolo de couro + hidratação com horário marcado. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Ajuste", "minScore": 5, "headline": "Pequenos cortes de rotina costumam ajudar mais que pacote caro", "description": "Às vezes só falta 48h com menos calor no fio."},
        {"id": "r1", "label": "Entrada", "minScore": 0, "headline": "Bom mapa para conversa de fim de ano", "description": "Com base nas suas respostas, o próximo passo costuma ser alinhar o que é possível agora e o que fica para o calendário de janeiro."}
      ],
      "ctaDefault": "Quero cuidar do cabelo nessa correria",
      "resultIntro": "Seu resultado:"
    }
    $c190$::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000191-0191-4000-8000-000000000191',
    'quiz_capilar_masculino_entradas',
    'diagnostico',
    $c191$
    {
      "title": "Cabelo masculino: entradas ou rarefação — quando vale falar com terapia capilar?",
      "introTitle": "Genética conta, mas rotina, couro e estresse também: será que você quer só entender opções com linguagem direta?",
      "introSubtitle": "Cinco perguntas sem julgamento; na presencial a profissional orienta cuidado do couro, fortalecimento e o que é realista — sem promessa de voltar ao cabelo dos 18.",
      "introMicro": "Cerca de 2 min · 5 perguntas",
      "questions": [
        {"id": "q1", "text": "O que mais te incomoda hoje?", "type": "single", "options": ["Entradas ou linha recuando", "Fio mais fino no geral", "Couro oleoso ou com caspa", "Só quero manter o que tenho o máximo possível"]},
        {"id": "q2", "text": "Há quanto tempo notou a mudança mais clara?", "type": "single", "options": ["Menos de 6 meses", "6 meses a 2 anos", "2 a 5 anos", "Mais de 5 anos"]},
        {"id": "q3", "text": "Você usa minoxidil ou medicamento para cabelo sem acompanhamento?", "type": "single", "options": ["Não", "Já usei e parei", "Uso com orientação", "Uso por conta — quero revisar com profissional"]},
        {"id": "q4", "text": "Rotina atual: shampoo 2 em 1 só, barra de sabão ou produto específico?", "type": "single", "options": ["Produto específico", "2 em 1 ou genérico", "Sabonete/barra às vezes", "Quase não uso nada além do shampoo"]},
        {"id": "q5", "text": "O que seria sucesso na primeira conversa?", "type": "single", "options": ["Saber o que é normal e o que não é", "Rotina simples em casa", "Protocolo no salão com calendário", "Plano claro sem conversa mole"]}
      ],
      "results": [
        {"id": "r4", "label": "Plano direto", "minScore": 12, "headline": "Várias frentes (couro, finura, medicação) pedem conversa técnica organizada", "description": "Na avaliação capilar você sai com próximos passos claros e linguagem de adulto — sem empurrar milagre nem ignorar o que já usa."},
        {"id": "r3", "label": "Bom encaixe", "minScore": 9, "headline": "Há espaço para fortalecer couro e fio com continuidade", "description": "Suas respostas cabem em shampoo certo, frequência e talvez tecnologias da clínica. Mande o resultado no WhatsApp."},
        {"id": "r2", "label": "Entrada", "minScore": 5, "headline": "Ainda dá para educar e prevenir acelerar demais", "description": "Quanto antes organizar rotina, mais opções costumam existir — sempre com expectativa realista."},
        {"id": "r1", "label": "Curiosidade", "minScore": 0, "headline": "Bom mapa para primeira consulta capilar masculina", "description": "Com base nas suas respostas, o próximo passo costuma ser avaliação com foco em couro, densidade percebida e hábito — em tom respeitoso."}
      ],
      "ctaDefault": "Quero conversar sobre entradas e couro cabeludo",
      "resultIntro": "Seu resultado:"
    }
    $c191$::jsonb,
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
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Queda sazonal: é fase ou precisa olhar?', 'Duração e outros sintomas — campanha de estação.', 'Queda em época específica', 'Avaliar e acalmar', 'custom', 'b1000186-0186-4000-8000-000000000186'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_queda_sazonal", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 450, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000186-0186-4000-8000-000000000186');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Pós-verão: sol, praia e piscina no cabelo', 'Recuperação de cor, couro e fio.', 'Ressecamento pós-sol', 'Protocolo pós-estação', 'custom', 'b1000187-0187-4000-8000-000000000187'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_pos_verao", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 451, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000187-0187-4000-8000-000000000187');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Pós-progressiva ou alisamento', 'Intervalo, quebra e retoque com segurança.', 'Retoque vs saúde do fio', 'Continuidade segura', 'custom', 'b1000188-0188-4000-8000-000000000188'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_pos_progressiva_alisamento", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 452, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000188-0188-4000-8000-000000000188');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Menopausa e mudança no cabelo', 'Textura, seco e queda — campanha acolhedora.', 'Cabelo na menopausa', 'Plano por fase', 'custom', 'b1000189-0189-4000-8000-000000000189'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_campanha_menopausa_cabelo", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 453, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000189-0189-4000-8000-000000000189');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Fim de ano: correria e cabelo', 'Sono, festas e tempo — reset realista.', 'Estresse e rotina', 'Autocuidado capilar', 'custom', 'b1000190-0190-4000-8000-000000000190'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_fim_ano_estresse", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 454, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000190-0190-4000-8000-000000000190');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics']::text[], 'cabelo', 'habitos', 'Cabelo masculino: entradas e couro', 'Linguagem direta, sem promessa de milagre.', 'Entradas ou rarefação', 'Plano capilar masculino', 'custom', 'b1000191-0191-4000-8000-000000000191'::uuid, 'diagnostico_risco', '{"nomenclatura": "quiz_capilar_masculino_entradas", "num_perguntas": 5, "tempo_minutos": 2}'::jsonb, 455, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000191-0191-4000-8000-000000000191');
