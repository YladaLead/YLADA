-- Fase 1 biblioteca Joias: quizzes para curiosidade da CLIENTE final (viral + identificação).
-- Desativa os 8 fluxos operacionais da 337 (vendedor/revenda/canais).
-- Novos templates: b1000130–b1000141.

UPDATE ylada_biblioteca_itens
SET active = false, updated_at = NOW()
WHERE template_id IN (
  'b1000121-0121-4000-8000-000000000121',
  'b1000122-0122-4000-8000-000000000122',
  'b1000123-0123-4000-8000-000000000123',
  'b1000124-0124-4000-8000-000000000124',
  'b1000125-0125-4000-8000-000000000125',
  'b1000126-0126-4000-8000-000000000126',
  'b1000127-0127-4000-8000-000000000127',
  'b1000128-0128-4000-8000-000000000128'
);

UPDATE ylada_link_templates
SET active = false, updated_at = NOW()
WHERE id IN (
  'b1000121-0121-4000-8000-000000000121',
  'b1000122-0122-4000-8000-000000000122',
  'b1000123-0123-4000-8000-000000000123',
  'b1000124-0124-4000-8000-000000000124',
  'b1000125-0125-4000-8000-000000000125',
  'b1000126-0126-4000-8000-000000000126',
  'b1000127-0127-4000-8000-000000000127',
  'b1000128-0128-4000-8000-000000000128'
);

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000130-0130-4000-8000-000000000130',
  'quiz_joias_estilo_personalidade',
  'diagnostico',
  $sj00${"title":"Qual estilo de bijuteria combina com sua personalidade?","questions":[{"id":"q1","text":"No dia a dia, você se sente mais:","type":"single","options":["Discreta e essencial","Equilibrada: um toque a mais","Na moda: amo tendências","Bem eu: brilho e impacto"]},{"id":"q2","text":"O que mais te atrai em acessório?","type":"single","options":["Peças atemporais","Novidades do momento","Significado ou lembrança","Completar o look do dia"]},{"id":"q3","text":"Quando você monta um look, a bijuteria:","type":"single","options":["Quase não aparece","Completa com equilíbrio","É o destaque","Depende do humor"]},{"id":"q4","text":"Você compra bijuteria pensando em:","type":"single","options":["Usar muitas vezes","Testar tendência","Presentear alguém","Ocasião especial"]},{"id":"q5","text":"Seu estilo em uma palavra:","type":"single","options":["Clássica","Moderna","Ousada","Minimalista"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj00$::jsonb,
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

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000131-0131-4000-8000-000000000131',
  'quiz_joias_classica_moderna_ousada',
  'diagnostico',
  $sj01${"title":"Você é mais clássica, moderna ou ousada?","questions":[{"id":"q1","text":"Seu guarda-roupa tem mais:","type":"single","options":["Cores neutras e cortes limpos","Mix de tendência e básico","Estampas, brilho e volume","Peças únicas e autorais"]},{"id":"q2","text":"Para um evento, você prefere:","type":"single","options":["Discreto e elegante","Atual sem exagerar","Chamar atenção de propósito","Surpreender com criatividade"]},{"id":"q3","text":"Bijuteria para você é:","type":"single","options":["Complemento refinado","Atualização do look","Atitude e presença","Brincar com combinações"]},{"id":"q4","text":"Você arrisca em acessório quando:","type":"single","options":["Quase nunca","Às vezes","Sempre que dá vontade","Só em ocasiões especiais"]},{"id":"q5","text":"O que te descreve melhor hoje:","type":"single","options":["Clássica","Moderna","Ousada","Um pouco de cada"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj01$::jsonb,
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

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000132-0132-4000-8000-000000000132',
  'quiz_joias_pedra_curiosidade',
  'diagnostico',
  $sj02${"title":"Qual pedra combina com sua energia no momento?","questions":[{"id":"q1","text":"Hoje você sente que precisa mais de:","type":"single","options":["Calma e equilíbrio","Confiança e presença","Leveza e alegria","Proteção e firmeza"]},{"id":"q2","text":"Você escolhe pedra mais por:","type":"single","options":["Significado que contei pra mim","Cor que combina com tudo","O que está na moda","Indicação de alguém de confiança"]},{"id":"q3","text":"Seu momento de vida está mais:","type":"single","options":["De organizar e simplificar","De abrir portas e arriscar","De cuidar de você","De celebrar conquistas"]},{"id":"q4","text":"Qual sensação você quer transmitir agora:","type":"single","options":["Serenidade","Poder suave","Alegria","Segurança"]},{"id":"q5","text":"Você acredita que acessório influencia o humor?","type":"single","options":["Muito","Um pouco","É mais estética","Quero descobrir"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj02$::jsonb,
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

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000133-0133-4000-8000-000000000133',
  'quiz_joias_ouro_prata_pele',
  'diagnostico',
  $sj03${"title":"Ouro ou prata: o que mais valoriza sua pele?","questions":[{"id":"q1","text":"Sua pele no sol costuma:","type":"single","options":["Dourar fácil","Vermelhar e depois bronze","Queimar rápido","Oscilar conforme o cuidado"]},{"id":"q2","text":"Veias no pulso parecem mais:","type":"single","options":["Esverdeadas","Azuladas","Não sei dizer","Um misto"]},{"id":"q3","text":"Prata fria ou ouro quente no rosto:","type":"single","options":["Fico melhor em prata","Fico melhor em ouro","Gosto dos dois","Depende da maquiagem"]},{"id":"q4","text":"Você usa mais:","type":"single","options":["Prata e tons frios","Ouro e tons quentes","Rose e misturas","O que combinar com a roupa"]},{"id":"q5","text":"Para um brinco statement, você escolheria:","type":"single","options":["Prata brilhante","Ouro ou dourado","Bicolor","Colorido"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj03$::jsonb,
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

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000134-0134-4000-8000-000000000134',
  'quiz_joias_ocasiao_evento',
  'diagnostico',
  $sj04${"title":"Qual acessório combina com seu próximo evento?","questions":[{"id":"q1","text":"Seu próximo momento é mais:","type":"single","options":["Trabalho ou reunião","Festas ou formatura","Encontro casual","Dia a dia corrido"]},{"id":"q2","text":"O dress code está mais:","type":"single","options":["Sóbrio","Elegante","Criativo","Livre"]},{"id":"q3","text":"Você quer que o acessório:","type":"single","options":["Quase não apareça","Complete com classe","Seja o destaque","Conte uma história"]},{"id":"q4","text":"Você prefere:","type":"single","options":["Brincos","Colares","Pulseiras","Mix equilibrado"]},{"id":"q5","text":"Seu medo ao escolher é:","type":"single","options":["Passar despercebida","Exagerar","Errar o tom","Não combinar com o vestido"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj04$::jsonb,
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

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000135-0135-4000-8000-000000000135',
  'quiz_joias_impulso_estrategia',
  'diagnostico',
  $sj05${"title":"Você compra bijuteria por impulso ou com estratégia?","questions":[{"id":"q1","text":"Quando vê uma peça linda, você:","type":"single","options":["Compra na hora","Salva e volta depois","Pensa onde usar","Compara com o que já tem"]},{"id":"q2","text":"Você tem peças que:","type":"single","options":["Quase não usa","Usa sempre as mesmas","Mistura bastante","Esqueceu que existiam"]},{"id":"q3","text":"Antes de comprar, você:","type":"single","options":["Não pensa muito","Pergunta se combina com algo","Imagina o look","Espera promoção"]},{"id":"q4","text":"Seu objetivo com bijuteria hoje é:","type":"single","options":["Renovar o básico","Ter opções para eventos","Montar um estilo marcante","Presentear alguém"]},{"id":"q5","text":"O que mais te incomoda:","type":"single","options":["Comprar e não usar","Não achar combinação","Não saber o que falta","Gastar sem planejar"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj05$::jsonb,
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

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000136-0136-4000-8000-000000000136',
  'quiz_joias_mix_colares',
  'diagnostico',
  $sj06${"title":"Você sabe combinar colares na medida certa?","questions":[{"id":"q1","text":"Você usa colares:","type":"single","options":["Um por vez","Dois em camadas","Três ou mais","Depende do decote"]},{"id":"q2","text":"Comprimentos misturados:","type":"single","options":["Amo","Uso com cuidado","Evito","Ainda estou testando"]},{"id":"q3","text":"Pingentes grandes com corrente fina:","type":"single","options":["Combino com equilíbrio","Evito","Amo o contraste","Depende da ocasião"]},{"id":"q4","text":"Seu pescoço parece mais:","type":"single","options":["Curto: cuidado com excesso","Longo: aguenta camadas","Neutro","Não penso nisso"]},{"id":"q5","text":"Para um look “arrumado mas cool”, você:","type":"single","options":["Fica no minimal","Colar médio + curto","Vai de stack completo","Tira tudo e deixa só brinco"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj06$::jsonb,
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

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000137-0137-4000-8000-000000000137',
  'quiz_joias_brinco_formato_rosto',
  'diagnostico',
  $sj07${"title":"Qual tipo de brinco valoriza mais seu rosto?","questions":[{"id":"q1","text":"Seu rosto lembra mais:","type":"single","options":["Redondo","Oval","Quadrado","Coração"]},{"id":"q2","text":"Você prefere brinco:","type":"single","options":["Pequeno e delicado","Médio","Grande e marcante","Asa ou alongado"]},{"id":"q3","text":"O que você quer destacar:","type":"single","options":["Olhos","Mandíbula","Bochechas","Equilíbrio geral"]},{"id":"q4","text":"Você usa brinco:","type":"single","options":["Quase sempre","Só em eventos","Quase nunca","Depende do mood"]},{"id":"q5","text":"Seu maior dilema é:","type":"single","options":["Parecer pequeno demais","Pesar na orelha","Não combinar com o cabelo","Não saber o tamanho certo"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj07$::jsonb,
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

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000138-0138-4000-8000-000000000138',
  'quiz_joias_erros_acessorios',
  'diagnostico',
  $sj08${"title":"Você comete esses erros com acessórios sem perceber?","questions":[{"id":"q1","text":"Você mistura metais:","type":"single","options":["De propósito","Sem perceber","Evito misturar","Só com regra clara"]},{"id":"q2","text":"Colar + brinco + pulseira + anel:","type":"single","options":["Uso tudo sempre","Equilibro","Prefiro menos peças","Depende do look"]},{"id":"q3","text":"Bijuteria com cheiro/creme:","type":"single","options":["Evito contato","Às vezes esqueço","Não sabia que atrapalha","Cuido bastante"]},{"id":"q4","text":"Peças empenadas ou escuras:","type":"single","options":["Tenho e quero recuperar","Não tenho","Troco rápido","Guardei errado"]},{"id":"q5","text":"O que mais “quebra” um look:","type":"single","options":["Excesso no mesmo ponto","Tamanho errado","Estilo conflitante","Falta de harmonia"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj08$::jsonb,
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

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000139-0139-4000-8000-000000000139',
  'quiz_joias_ajuste_visual',
  'diagnostico',
  $sj09${"title":"Pequenos ajustes nos acessórios mudariam seu visual?","questions":[{"id":"q1","text":"Seu estilo hoje está mais:","type":"single","options":["Atualizado","Um pouco parado","Na transição","Em busca de identidade"]},{"id":"q2","text":"O que mudaria primeiro:","type":"single","options":["Brincos","Colar","Pulseiras","Mix geral"]},{"id":"q3","text":"Você sente que falta:","type":"single","options":["Um ponto de luz","Mais personalidade","Mais equilíbrio","Mais praticidade"]},{"id":"q4","text":"Você toparia testar:","type":"single","options":["Uma peça statement","Um básico premium","Um mix guiado","Uma consultoria rápida"]},{"id":"q5","text":"Seu objetivo imediato é:","type":"single","options":["Parecer mais elegante","Parecer mais moderna","Parecer mais confiante","Simplificar e melhorar"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj09$::jsonb,
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

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000140-0140-4000-8000-000000000140',
  'quiz_joias_presente_ideal',
  'diagnostico',
  $sj10${"title":"Qual bijuteria seria o presente ideal para ela?","questions":[{"id":"q1","text":"Ela usa bijuteria:","type":"single","options":["Todo dia","Às vezes","Só em festa","Quase nunca"]},{"id":"q2","text":"O estilo dela é mais:","type":"single","options":["Clássico","Moderno","Romântico","Ousado"]},{"id":"q3","text":"A ocasião é:","type":"single","options":["Aniversário","Datas simbólicas","Sem data: surpresa","Amigo secreto"]},{"id":"q4","text":"Seu maior medo é:","type":"single","options":["Não servir","Não combinar","Parecer barato","Ela já ter igual"]},{"id":"q5","text":"Você prefere presente:","type":"single","options":["Discreto e seguro","Marcante e memorável","Personalizável","Útil no dia a dia"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj10$::jsonb,
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

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES (
  'b1000141-0141-4000-8000-000000000141',
  'quiz_joias_minimal_chamativo',
  'diagnostico',
  $sj11${"title":"Minimalista ou chamativo: o que combina mais com você?","questions":[{"id":"q1","text":"Num look básico (jeans + t-shirt), você:","type":"single","options":["Fica no mínimo","Só um destaque","Vai de impacto","Muda conforme o dia"]},{"id":"q2","text":"Brincos:","type":"single","options":["Quase imperceptíveis","Médios","Grandes","Depende do cabelo preso/solto"]},{"id":"q3","text":"Se alguém te chama de:","type":"single","options":["Elegante","Estilosa","Animada","Clássica"]},{"id":"q4","text":"Você posta look com acessório:","type":"single","options":["Raramente","Às vezes","Sempre","Só em ocasiões"]},{"id":"q5","text":"Para um story “A ou B”, você escolhe:","type":"single","options":["A: clean","B: power","Meio-termo","Depende da foto"]}],"results":[{"id":"r1","label":"Resultado","minScore":0,"headline":"Seu resultado","description":"Resultado personalizado com base nas suas escolhas."}],"ctaDefault":"Quero uma sugestão no WhatsApp","resultIntro":"Seu resultado:"}$sj11$::jsonb,
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
SELECT 'quiz', ARRAY['joias']::text[], 'joias_estilo_pessoal', 'habitos', 'Qual estilo de bijuteria combina com sua personalidade?', 'Descubra um ângulo de estilo para postar no story e gerar identificação.', 'Não sei que bijuteria combina comigo', 'Gerar curiosidade e clique', 'custom', 'b1000130-0130-4000-8000-000000000130', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 210, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000130-0130-4000-8000-000000000130');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_classica_moderna', 'habitos', 'Você é mais clássica, moderna ou ousada?', 'Quiz rápido para direct: a pessoa se reconhece e comenta.', 'Dúvida sobre como se descrever em estilo', 'Iniciar conversa com leveza', 'custom', 'b1000131-0131-4000-8000-000000000131', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 211, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000131-0131-4000-8000-000000000131');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_pedra_curiosidade', 'habitos', 'Qual pedra combina com sua energia no momento?', 'Curiosidade + identificação (entretenimento; não é avaliação de saúde).', 'Curiosidade sobre pedras e significados', 'Engajar e educar com leveza', 'custom', 'b1000132-0132-4000-8000-000000000132', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 212, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000132-0132-4000-8000-000000000132');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_ouro_prata', 'habitos', 'Ouro ou prata: o que mais valoriza sua pele?', 'Alto compartilhamento: pessoas adoram se testar em ouro vs prata.', 'Dúvida entre metal quente e frio', 'Gerar comentários e saves', 'custom', 'b1000133-0133-4000-8000-000000000133', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 213, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000133-0133-4000-8000-000000000133');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_ocasiao', 'habitos', 'Qual acessório combina com seu próximo evento?', 'Intenção de compra: trabalho, festa, date ou dia a dia.', 'Não sei o que usar na ocasião', 'Qualificar ocasião antes do catálogo', 'custom', 'b1000134-0134-4000-8000-000000000134', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 214, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000134-0134-4000-8000-000000000134');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_compra_impulso', 'habitos', 'Você compra bijuteria por impulso ou com estratégia?', 'Faz a cliente refletir — abre conversa sobre coleção e peças-chave.', 'Porta-joias confuso ou compras repetidas', 'Educar sem julgar', 'custom', 'b1000135-0135-4000-8000-000000000135', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 215, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000135-0135-4000-8000-000000000135');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_mix_colares', 'habitos', 'Você sabe combinar colares na medida certa?', 'Stack na tendência: viral em reels com “sim ou não”.', 'Medo de exagerar ou ficar sem graça', 'Mostrar autoridade em combinação', 'custom', 'b1000136-0136-4000-8000-000000000136', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 216, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000136-0136-4000-8000-000000000136');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_brinco_rosto', 'habitos', 'Qual tipo de brinco valoriza mais seu rosto?', 'Autoimagem + dica prática: gera DM com foto de referência.', 'Dúvida de formato e proporção', 'Ajudar a escolher sem provar na loja', 'custom', 'b1000137-0137-4000-8000-000000000137', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 217, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000137-0137-4000-8000-000000000137');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_erros_comuns', 'habitos', 'Você comete esses erros com acessórios sem perceber?', 'Educação leve: autoridade sem humilhar.', 'Look “quase bom” mas estranho', 'Mostrar que pequenos ajustes importam', 'custom', 'b1000138-0138-4000-8000-000000000138', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 218, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000138-0138-4000-8000-000000000138');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_ajuste_visual', 'habitos', 'Pequenos ajustes nos acessórios mudariam seu visual?', 'Transformação mental: antes/depois sem promessa milagrosa.', 'Sensação de visual parado', 'Inspirar renovação com peças certas', 'custom', 'b1000139-0139-4000-8000-000000000139', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 219, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000139-0139-4000-8000-000000000139');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_presente_ideal', 'habitos', 'Qual bijuteria seria o presente ideal para ela?', 'Compartilhável: marcar amiga, irmã, mãe.', 'Medo de errar o presente', 'Gerar indicação e conversa', 'custom', 'b1000140-0140-4000-8000-000000000140', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 220, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000140-0140-4000-8000-000000000140');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['joias']::text[], 'joias_minimal_ou_chamativo', 'habitos', 'Minimalista ou chamativo: o que combina mais com você?', 'Formato estilo Reels: resposta rápida e alta taxa de conclusão.', 'Dúvida entre discreto e impacto', 'Viralizar com pergunta binária', 'custom', 'b1000141-0141-4000-8000-000000000141', 'diagnostico_risco', '{"architecture":"RISK_DIAGNOSIS","segment_code":"joias","intencao":"curiosidade_cliente","num_perguntas":5}'::jsonb, 221, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000141-0141-4000-8000-000000000141');

