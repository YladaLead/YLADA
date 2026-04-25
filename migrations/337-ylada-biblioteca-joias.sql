-- Biblioteca YLADA: quizzes para Joias e bijuterias (segment_codes = joias).
-- Corrige uso indevido de nutrition_vendedor na área /pt/joias/links.
-- IDs templates: b1000121–b1000128.

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000121-0121-4000-8000-000000000121',
    'quiz_joias_linha_produto',
    'diagnostico',
    $sj1${"title":"Qual linha de joias combina mais com você?","questions":[{"id":"q1","text":"Hoje você busca mais:","type":"single","options":["Joia fina ou peças em ouro/prata","Semijoia","Bijuteria para usar no dia a dia","Ainda estou descobrindo"]},{"id":"q2","text":"Para você, o mais importante na compra é:","type":"single","options":["Valor de revenda e margem","Durabilidade e qualidade percebida","Tendência e variedade","Presente e embalagem"]},{"id":"q3","text":"Seu cliente costuma chegar:","type":"single","options":["Só perguntando preço","Com foto de referência","Sem saber o tamanho ou material","Querendo combinar com look"]},{"id":"q4","text":"Onde você mais vende hoje:","type":"single","options":["WhatsApp ou direct","Loja física","Site ou catálogo","Eventos e feiras"]},{"id":"q5","text":"Seu maior desafio agora é:","type":"single","options":["Explicar diferença entre linhas","Fechar sem só descontar","Atrair gente certa","Organizar catálogo e estoque"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu perfil de compra","description":"O diagnóstico será gerado com base nas suas respostas."}],"ctaDefault":"Quero uma recomendação personalizada","resultIntro":"Seu resultado:"}$sj1$::jsonb,
    '["title","headline","description","ctaText","resultIntro","nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000122-0122-4000-8000-000000000122',
    'quiz_joias_estilo_ocasiao',
    'diagnostico',
    $sj2${"title":"Você compra joias mais por estilo ou por ocasião?","questions":[{"id":"q1","text":"Quando você pensa em joias, imagina mais:","type":"single","options":["Peça do dia a dia","Peça para eventos","Presente para alguém","Coleção e combinações"]},{"id":"q2","text":"Seu estilo pessoal é mais:","type":"single","options":["Discreto e minimalista","Clássico","Moderno ou tendência","Ousado e chamativo"]},{"id":"q3","text":"O que mais influencia sua escolha:","type":"single","options":["Conforto para usar o dia todo","Combina com várias roupas","Impacto visual","Significado emocional"]},{"id":"q4","text":"Você costuma usar:","type":"single","options":["Poucas peças fixas","Mistura e sobreposição","Só em ocasiões especiais","Quase sempre algo novo"]},{"id":"q5","text":"Para presentear, você prefere:","type":"single","options":["Algo seguro e atemporal","Algo personalizado","Algo que chame atenção","Algo útil no dia a dia"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu perfil de estilo","description":"O diagnóstico será gerado com base nas suas respostas."}],"ctaDefault":"Quero sugestões para meu estilo","resultIntro":"Seu resultado:"}$sj2$::jsonb,
    '["title","headline","description","ctaText","resultIntro","nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000123-0123-4000-8000-000000000123',
    'quiz_joias_whatsapp_vendas',
    'diagnostico',
    $sj3${"title":"Seu atendimento no WhatsApp está travando vendas?","questions":[{"id":"q1","text":"Quando alguém chama no WhatsApp, você costuma:","type":"single","options":["Mandar tabela de preços na primeira mensagem","Perguntar contexto antes de preço","Pedir foto ou referência","Encaminhar para outra pessoa"]},{"id":"q2","text":"A conversa morre porque:","type":"single","options":["Só ficam em preço","Somem depois do catálogo","Pedem desconto demais","Não entendem material ou linha"]},{"id":"q3","text":"Você usa diagnóstico ou quiz antes do orçamento?","type":"single","options":["Sim, sempre que posso","Às vezes","Raramente","Ainda não uso"]},{"id":"q4","text":"Seu follow-up após o primeiro contato é:","type":"single","options":["Organizado com lembretes","No feeling","Quase não faço","Muito agressivo"]},{"id":"q5","text":"O que mais te atrapalha a fechar:","type":"single","options":["Medo de parecer caro","Falta de tempo","Cliente indecisa","Concorrência só com preço"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu perfil de atendimento","description":"O diagnóstico será gerado com base nas suas respostas."}],"ctaDefault":"Quero melhorar minhas conversas no WhatsApp","resultIntro":"Seu resultado:"}$sj3$::jsonb,
    '["title","headline","description","ctaText","resultIntro","nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000124-0124-4000-8000-000000000124',
    'quiz_joias_marca_propria',
    'diagnostico',
    $sj4${"title":"Marca própria: seu posicionamento está claro?","questions":[{"id":"q1","text":"Sua marca fala mais de:","type":"single","options":["Preço acessível","Exclusividade e edições limitadas","Tendência e novidades","História e artesanato"]},{"id":"q2","text":"Seu cliente ideal hoje é:","type":"single","options":["Quem busca primeira joia","Presenteadores","Revendedoras","Colecionadoras"]},{"id":"q3","text":"O que diferencia você da concorrência:","type":"single","options":["Atendimento","Design próprio","Prazo e logística","Garantia e pós-venda"]},{"id":"q4","text":"Suas redes mostram mais:","type":"single","options":["Produto só","Bastidores e processo","Depoimentos","Promoções"]},{"id":"q5","text":"Seu maior medo ao subir preço é:","type":"single","options":["Perder cliente","Parecer injusto","Não saber explicar valor","Concorrência copiar"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu posicionamento","description":"O diagnóstico será gerado com base nas suas respostas."}],"ctaDefault":"Quero fortalecer minha marca","resultIntro":"Seu resultado:"}$sj4$::jsonb,
    '["title","headline","description","ctaText","resultIntro","nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000125-0125-4000-8000-000000000125',
    'quiz_joias_presentes',
    'diagnostico',
    $sj5${"title":"Presentes especiais: como escolher a peça certa?","questions":[{"id":"q1","text":"O presente é para:","type":"single","options":["Parceiro(a)","Mãe ou pai","Amiga","Colega de trabalho"]},{"id":"q2","text":"A pessoa usa joias:","type":"single","options":["Quase sempre","Só em festas","Pouco — tenho dúvida","Muito variado"]},{"id":"q3","text":"Você prefere errar por:","type":"single","options":["Peça discreta demais","Peça chamativa demais","Tamanho (anel/pulseira)","Material (alergia ou hábito)"]},{"id":"q4","text":"O orçamento é:","type":"single","options":["Entrada","Médio","Alto","Flexível se for perfeito"]},{"id":"q5","text":"O que mais te preocupa:","type":"single","options":["Não gostar","Não servir","Parecer genérico","Atrasar a entrega"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu guia de presente","description":"O diagnóstico será gerado com base nas suas respostas."}],"ctaDefault":"Quero ajuda para escolher o presente","resultIntro":"Seu resultado:"}$sj5$::jsonb,
    '["title","headline","description","ctaText","resultIntro","nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000126-0126-4000-8000-000000000126',
    'quiz_joias_cuidados_durabilidade',
    'diagnostico',
    $sj6${"title":"Suas peças vão durar o que você promete?","questions":[{"id":"q1","text":"Você costuma explicar cuidados na venda?","type":"single","options":["Sempre","Às vezes","Só se a cliente perguntar","Não tenho material pronto"]},{"id":"q2","text":"Reclamações depois da compra são mais sobre:","type":"single","options":["Escurecimento ou perda de brilho","Pedra solta ou travamento","Alergia ou irritação","Tamanho ou ajuste"]},{"id":"q3","text":"Seu cliente costuma:","type":"single","options":["Usar no banho ou academia","Tirar à noite","Misturar com perfume e cremes","Não sabe o que pode ou não"]},{"id":"q4","text":"Você oferece:","type":"single","options":["Garantia escrita","Polimento ou manutenção","Troca em X dias","Só orientação verbal"]},{"id":"q5","text":"O que mais aumenta confiança na compra:","type":"single","options":["Cartão de cuidados","Vídeo curto","Embalagem premium","Certificado ou nota"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu perfil de cuidado","description":"O diagnóstico será gerado com base nas suas respostas."}],"ctaDefault":"Quero um plano de cuidados para minhas peças","resultIntro":"Seu resultado:"}$sj6$::jsonb,
    '["title","headline","description","ctaText","resultIntro","nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000127-0127-4000-8000-000000000127',
    'quiz_joias_revenda_equipe',
    'diagnostico',
    $sj7${"title":"Revenda e equipe: onde está o gargalo?","questions":[{"id":"q1","text":"Sua equipe vende mais:","type":"single","options":["Por catálogo fixo","Por lives ou stories","Por indicação","Ainda está treinando"]},{"id":"q2","text":"A maior dúvida da equipe é:","type":"single","options":["Material e garantia","Tamanho e ajuste","Política de troca","Como falar preço"]},{"id":"q3","text":"Você padronizou script de atendimento?","type":"single","options":["Sim, atualizado","Tem, mas está velho","Só ideias soltas","Não"]},{"id":"q4","text":"Metas são acompanhadas:","type":"single","options":["Por semana","Por mês","Só no fim do mês","Sem meta clara"]},{"id":"q5","text":"O que mais travaria um novo revendedor:","type":"single","options":["Investimento inicial","Medo de não vender","Logística de pedidos","Suporte da marca"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu diagnóstico de equipe","description":"O diagnóstico será gerado com base nas suas respostas."}],"ctaDefault":"Quero organizar minha revenda","resultIntro":"Seu resultado:"}$sj7$::jsonb,
    '["title","headline","description","ctaText","resultIntro","nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000128-0128-4000-8000-000000000128',
    'quiz_joias_canais_venda',
    'diagnostico',
    $sj8${"title":"Instagram, loja ou site: onde focar primeiro?","questions":[{"id":"q1","text":"Hoje o que mais traz pedido é:","type":"single","options":["Direct e WhatsApp","Loja física","Site ou Shopee","Indicação"]},{"id":"q2","text":"Seu Instagram está mais:","type":"single","options":["Só vitrine de fotos","Com depoimentos e prova","Com pouco engajamento","Sem frequência"]},{"id":"q3","text":"Seu site ou link na bio:","type":"single","options":["Atualizado e rápido","Existe mas está confuso","Não tenho","Uso só PDF"]},{"id":"q4","text":"O cliente final costuma comprar:","type":"single","options":["No impulso do story","Depois de pesquisar","Só presencial","Por indicação"]},{"id":"q5","text":"Nos próximos 30 dias você quer:","type":"single","options":["Mais leads no digital","Mais ticket médio","Mais recorrência","Mais organização"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu mix de canais","description":"O diagnóstico será gerado com base nas suas respostas."}],"ctaDefault":"Quero priorizar meu canal certo","resultIntro":"Seu resultado:"}$sj8$::jsonb,
    '["title","headline","description","ctaText","resultIntro","nomeProfissional"]'::jsonb,
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
SELECT 'quiz', ARRAY['joias']::text[], 'joias_linha', 'habitos', 'Qual linha de joias combina mais com você?', 'Qualifique perfil de compra: fina, semijoia ou bijuteria antes do catálogo.', 'Cliente não entende diferença entre linhas', 'Qualificar intenção antes do orçamento', 'custom', 'b1000121-0121-4000-8000-000000000121', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","num_perguntas":5}'::jsonb, 195, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000121-0121-4000-8000-000000000121');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_estilo', 'habitos', 'Você compra joias mais por estilo ou por ocasião?', 'Abra conversa sobre uso, look e momento sem começar por preço.', 'Dificuldade em qualificar estilo', 'Aumentar engajamento e conversão', 'custom', 'b1000122-0122-4000-8000-000000000122', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","num_perguntas":5}'::jsonb, 196, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000122-0122-4000-8000-000000000122');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_whatsapp', 'habitos', 'Seu atendimento no WhatsApp está travando vendas?', 'Reduza conversa só em preço e organize follow-up.', 'Conversa no WhatsApp só vira preço', 'Melhorar taxa de fechamento', 'custom', 'b1000123-0123-4000-8000-000000000123', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","num_perguntas":5}'::jsonb, 197, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000123-0123-4000-8000-000000000123');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_marca', 'habitos', 'Marca própria: seu posicionamento está claro?', 'Alinhe narrativa, cliente ideal e diferencial antes do portfólio.', 'Marca própria sem narrativa clara', 'Fortalecer posicionamento', 'custom', 'b1000124-0124-4000-8000-000000000124', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","num_perguntas":5}'::jsonb, 198, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000124-0124-4000-8000-000000000124');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_presente', 'habitos', 'Presentes especiais: como escolher a peça certa?', 'Datas especiais com menos erro de tamanho e estilo.', 'Presentes sem orientação geram devolução', 'Aumentar confiança em presentes', 'custom', 'b1000125-0125-4000-8000-000000000125', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","num_perguntas":5}'::jsonb, 199, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000125-0125-4000-8000-000000000125');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_cuidados', 'habitos', 'Suas peças vão durar o que você promete?', 'Eduque sobre cuidados, banho e garantia para reduzir atrito pós-venda.', 'Cliente não sabe cuidar da peça', 'Aumentar satisfação e recorrência', 'custom', 'b1000126-0126-4000-8000-000000000126', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","num_perguntas":5}'::jsonb, 200, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000126-0126-4000-8000-000000000126');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_equipe', 'habitos', 'Revenda e equipe: onde está o gargalo?', 'Padronize discurso, metas e suporte para quem vende com você.', 'Equipe de revenda com discurso desalinhado', 'Alinhar equipe e revenda', 'custom', 'b1000127-0127-4000-8000-000000000127', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","num_perguntas":5}'::jsonb, 201, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000127-0127-4000-8000-000000000127');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_canal', 'habitos', 'Instagram, loja ou site: onde focar primeiro?', 'Veja onde está a demanda real e onde investir nos próximos 30 dias.', 'Tráfego no Instagram que não vira pedido', 'Entender qual canal priorizar', 'custom', 'b1000128-0128-4000-8000-000000000128', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","num_perguntas":5}'::jsonb, 202, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000128-0128-4000-8000-000000000128');
