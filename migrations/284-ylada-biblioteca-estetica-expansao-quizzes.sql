-- =====================================================
-- Biblioteca Estética: expansão de quizzes (cabelo, unhas, sobrancelha, maquiagem).
-- IDs: b1000103 a b1000118 (16 novos quizzes).
-- Idempotente: ON CONFLICT para templates; INSERT direto para itens (cada um com template_id único).
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  -- CABELO (5 novos)
  (
    'b1000103-0103-4000-8000-000000000103',
    'quiz_cabelo_queda',
    'diagnostico',
    '{"title": "O que pode estar causando sua queda de cabelo?", "questions": [{"id": "q1", "text": "Quanto tempo você percebe a queda?", "type": "single", "options": ["Menos de 1 mês", "1 a 3 meses", "3 a 6 meses", "Mais de 6 meses"]}, {"id": "q2", "text": "Quantos fios você perde ao dia (aprox.)?", "type": "single", "options": ["Poucos (até 50)", "Moderado (50-100)", "Muito (100-150)", "Excessivo (mais de 150)"]}, {"id": "q3", "text": "Você passou por estresse ou mudança recente?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q4", "text": "Sua alimentação é equilibrada?", "type": "single", "options": ["Sim", "Razoável", "Irregular", "Não"]}, {"id": "q5", "text": "Você usa fontes de calor (secador, chapinha) com frequência?", "type": "single", "options": ["Raramente", "Às vezes", "Frequentemente", "Todo dia"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar minha queda capilar", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000104-0104-4000-8000-000000000104',
    'quiz_cabelo_tipo_fio',
    'diagnostico',
    '{"title": "Qual é o verdadeiro tipo do seu fio?", "questions": [{"id": "q1", "text": "Seu cabelo tem formato natural definido?", "type": "single", "options": ["Sim, bem cacheado/ondulado", "Ondulado leve", "Quase liso", "Totalmente liso"]}, {"id": "q2", "text": "Qual a espessura dos fios?", "type": "single", "options": ["Fios finos", "Média", "Grossos", "Misto (fina na raiz, grossa nas pontas)"]}, {"id": "q3", "text": "Seu cabelo tem tendência a frizz?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q4", "text": "Quanto tempo leva para secar naturalmente?", "type": "single", "options": ["Muito rápido", "Normal", "Demora um pouco", "Muito lento"]}, {"id": "q5", "text": "Seu cabelo absorve hidratantes com facilidade?", "type": "single", "options": ["Sim, demora para ficar pesado", "Às vezes", "Fica pesado fácil", "Muito oleoso"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero conhecer meu tipo de fio", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000105-0105-4000-8000-000000000105',
    'quiz_couro_cabeludo',
    'diagnostico',
    '{"title": "Seu couro cabeludo está saudável?", "questions": [{"id": "q1", "text": "Seu couro cabeludo coça com frequência?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}, {"id": "q2", "text": "Você percebe caspa ou descamação?", "type": "single", "options": ["Não", "Pouca", "Moderada", "Muita"]}, {"id": "q3", "text": "Seu couro cabeludo fica oleoso rapidamente?", "type": "single", "options": ["Não", "No 3º dia ou mais", "No 2º dia", "No mesmo dia"]}, {"id": "q4", "text": "Você usa produtos específicos para o couro cabeludo?", "type": "single", "options": ["Sim, regularmente", "Às vezes", "Raramente", "Nunca"]}, {"id": "q5", "text": "Você sente desconforto ou sensibilidade?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero cuidar do meu couro cabeludo", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000106-0106-4000-8000-000000000106',
    'quiz_cabelo_hidratacao',
    'diagnostico',
    '{"title": "Seu cabelo está realmente hidratado?", "questions": [{"id": "q1", "text": "Com que frequência você faz hidratação?", "type": "single", "options": ["Semanalmente", "A cada 15 dias", "Mensalmente", "Raramente"]}, {"id": "q2", "text": "Seu cabelo está poroso ou emborrachado?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q3", "text": "As pontas estão ressecadas ou duplas?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q4", "text": "Seu cabelo tem brilho?", "type": "single", "options": ["Muito", "Normal", "Pouco", "Sem brilho"]}, {"id": "q5", "text": "Você usa leave-in ou produto de finalização?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero hidratar melhor meu cabelo", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000107-0107-4000-8000-000000000107',
    'quiz_cabelo_tintura',
    'diagnostico',
    '{"title": "Sua tintura está prejudicando seus fios?", "questions": [{"id": "q1", "text": "Com que frequência você tinge o cabelo?", "type": "single", "options": ["Raramente", "A cada 2-3 meses", "Mensalmente", "A cada 2-3 semanas"]}, {"id": "q2", "text": "Você usa produtos específicos para cabelo tingido?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Seu cabelo desbota rapidamente?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q4", "text": "Os fios estão quebradiços ou opacos?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q5", "text": "Você faz reconstrução ou cronograma capilar?", "type": "single", "options": ["Sim, regularmente", "Às vezes", "Raramente", "Nunca"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero preservar minha cor e saúde capilar", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- UNHAS (4 novos)
  (
    'b1000108-0108-4000-8000-000000000108',
    'quiz_unhas_cuticulas',
    'diagnostico',
    '{"title": "Suas cutículas estão saudáveis?", "questions": [{"id": "q1", "text": "Você mexe ou remove as cutículas?", "type": "single", "options": ["Não mexo", "Apenas empurro", "Retiro às vezes", "Retiro sempre"]}, {"id": "q2", "text": "Suas cutículas estão ressecadas ou rachadas?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q3", "text": "Você usa óleo ou creme para cutículas?", "type": "single", "options": ["Diariamente", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "Você sente dor ou inflamação ao redor das unhas?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}, {"id": "q5", "text": "Suas cutículas crescem rápido demais?", "type": "single", "options": ["Não", "Às vezes", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero cuidar das minhas cutículas", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000109-0109-4000-8000-000000000109',
    'quiz_unhas_alongamento',
    'diagnostico',
    '{"title": "Alongamento de unhas: o que você precisa saber?", "questions": [{"id": "q1", "text": "Você já fez ou pensa em fazer alongamento?", "type": "single", "options": ["Já faço há tempo", "Comecei recentemente", "Estou pensando", "Não tenho interesse"]}, {"id": "q2", "text": "Qual técnica você usa ou prefere?", "type": "single", "options": ["Gel", "Fibra", "Acrílico", "Não sei"]}, {"id": "q3", "text": "Suas unhas naturais ficam prejudicadas após retirar?", "type": "single", "options": ["Não", "Pouco", "Sim", "Muito"]}, {"id": "q4", "text": "Com que frequência você faz manutenção?", "type": "single", "options": ["A cada 15-20 dias", "A cada 3 semanas", "Mensalmente ou mais", "Irregular"]}, {"id": "q5", "text": "Você gostaria de alongar sem prejudicar as unhas naturais?", "type": "single", "options": ["Não preciso", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero alongar minhas unhas com segurança", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000110-0110-4000-8000-000000000110',
    'quiz_unhas_nail_art',
    'diagnostico',
    '{"title": "Qual estilo de nail art combina com você?", "questions": [{"id": "q1", "text": "Qual estilo você prefere?", "type": "single", "options": ["Minimalista", "Colorido e divertido", "Elegante e neutro", "Ousado e criativo"]}, {"id": "q2", "text": "Com que frequência você faz nail art?", "type": "single", "options": ["Todo mês", "A cada 2 meses", "Raramente", "Nunca fiz"]}, {"id": "q3", "text": "Você tem tempo para manutenção regular?", "type": "single", "options": ["Sim", "Moderado", "Pouco", "Muito pouco"]}, {"id": "q4", "text": "Seu trabalho permite unhas decoradas?", "type": "single", "options": ["Sim", "Discreto sim", "Não muito", "Não"]}, {"id": "q5", "text": "Você gostaria de descobrir um look ideal para você?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero descobrir meu estilo de nail art", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000111-0111-4000-8000-000000000111',
    'quiz_unhas_fortalecedor',
    'diagnostico',
    '{"title": "Suas unhas precisam de fortalecimento?", "questions": [{"id": "q1", "text": "Suas unhas descascam em camadas?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}, {"id": "q2", "text": "Você usa base fortalecedora?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Suas unhas ficam em contato com água por muito tempo?", "type": "single", "options": ["Raramente", "Às vezes", "Frequentemente", "Todo dia"]}, {"id": "q4", "text": "Você roe as unhas ou cutículas?", "type": "single", "options": ["Não", "Às vezes", "Frequentemente", "Sempre"]}, {"id": "q5", "text": "Você gostaria de unhas mais resistentes?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero fortalecer minhas unhas", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- SOBRANCELHA (3 novos)
  (
    'b1000112-0112-4000-8000-000000000112',
    'quiz_sobrancelha_microblading',
    'diagnostico',
    '{"title": "Microblading é a solução para suas sobrancelhas?", "questions": [{"id": "q1", "text": "Suas sobrancelhas são ralas ou têm falhas?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q2", "text": "Você perdeu pelos por motivo hormonal ou químico?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q3", "text": "Quanto tempo você gasta preenchendo as sobrancelhas por dia?", "type": "single", "options": ["Nada", "Menos de 2 min", "2 a 5 min", "Mais de 5 min"]}, {"id": "q4", "text": "Você busca resultado natural e duradouro?", "type": "single", "options": ["Não preciso", "Talvez", "Sim", "Muito"]}, {"id": "q5", "text": "Você está disposta a fazer retoque periódico?", "type": "single", "options": ["Não", "Talvez", "Sim", "Sim, sem problema"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero avaliar microblading", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000113-0113-4000-8000-000000000113',
    'quiz_sobrancelha_laminacao',
    'diagnostico',
    '{"title": "Laminagem de sobrancelha combina com você?", "questions": [{"id": "q1", "text": "Seus pelos da sobrancelha são rebeldes ou desalinhados?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Muito"]}, {"id": "q2", "text": "Você busca um efeito natural e definido?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}, {"id": "q3", "text": "Sua sobrancelha tem bom volume mas falta definição?", "type": "single", "options": ["Não", "Pouco", "Sim", "Muito"]}, {"id": "q4", "text": "Você prefere procedimento temporário (sem tatuagem)?", "type": "single", "options": ["Não sei", "Não", "Talvez", "Sim"]}, {"id": "q5", "text": "Você gostaria de acordar com sobrancelha arrumada?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero saber mais sobre laminagem", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000114-0114-4000-8000-000000000114',
    'quiz_sobrancelha_definicao',
    'diagnostico',
    '{"title": "Sua sobrancelha valoriza seu rosto?", "questions": [{"id": "q1", "text": "Você sabe qual formato combina com seu rosto?", "type": "single", "options": ["Sim", "Mais ou menos", "Não tenho certeza", "Não sei"]}, {"id": "q2", "text": "Sua sobrancelha está proporcionada ao tamanho dos olhos?", "type": "single", "options": ["Sim", "Quase", "Não muito", "Não"]}, {"id": "q3", "text": "Você usa lápis, gel ou sombra para preencher?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q4", "text": "As sobrancelhas são simétricas?", "type": "single", "options": ["Sim", "Quase", "Não muito", "Não"]}, {"id": "q5", "text": "Você gostaria de valorizar o olhar com sobrancelha definida?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero definir minha sobrancelha", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  -- MAQUIAGEM (4 novos)
  (
    'b1000115-0115-4000-8000-000000000115',
    'quiz_maquiagem_look_dia',
    'diagnostico',
    '{"title": "Qual look do dia combina com você?", "questions": [{"id": "q1", "text": "Quanto tempo você tem para se maquiar pela manhã?", "type": "single", "options": ["Mais de 15 min", "10 a 15 min", "5 a 10 min", "Menos de 5 min"]}, {"id": "q2", "text": "Qual é seu ambiente de trabalho?", "type": "single", "options": ["Escritório/formal", "Remoto/casa", "Ao ar livre", "Variado"]}, {"id": "q3", "text": "Você prefere maquiagem discreta ou marcante?", "type": "single", "options": ["Bem discreta", "Natural", "Média", "Marcante"]}, {"id": "q4", "text": "Qual parte do rosto você gosta de destacar?", "type": "single", "options": ["Olhos", "Bochechas/lábios", "Pele uniforme", "Todo o rosto equilibrado"]}, {"id": "q5", "text": "Sua maquiagem precisa durar o dia todo?", "type": "single", "options": ["Sim", "Maior parte do dia", "Metade do dia", "Poucas horas"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero descobrir meu look ideal", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000116-0116-4000-8000-000000000116',
    'quiz_maquiagem_iniciantes',
    'diagnostico',
    '{"title": "Você está pronta para aprender maquiagem do zero?", "questions": [{"id": "q1", "text": "Qual seu nível em maquiagem?", "type": "single", "options": ["Iniciante total", "Sei o básico", "Intermediário", "Avançado"]}, {"id": "q2", "text": "O que mais te impede de se maquiar?", "type": "single", "options": ["Não sei por onde começar", "Falta de tempo", "Medo de errar", "Não tenho produtos"]}, {"id": "q3", "text": "Você conhece seus melhores pontos no rosto?", "type": "single", "options": ["Sim", "Mais ou menos", "Pouco", "Não"]}, {"id": "q4", "text": "Quantos produtos de maquiagem você tem?", "type": "single", "options": ["Quase nenhum", "5 a 10", "10 a 20", "Muitos"]}, {"id": "q5", "text": "Você gostaria de um passo a passo personalizado?", "type": "single", "options": ["Não", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero aprender maquiagem", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000117-0117-4000-8000-000000000117',
    'quiz_maquiagem_base_pele',
    'diagnostico',
    '{"title": "Qual base e preparação ideal para sua pele?", "questions": [{"id": "q1", "text": "Sua pele é oleosa, mista, seca ou normal?", "type": "single", "options": ["Oleosa", "Mista", "Seca", "Normal"]}, {"id": "q2", "text": "Você usa primer antes da base?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Sua base escorrega ou craquela ao longo do dia?", "type": "single", "options": ["Não", "Pouco", "Às vezes", "Sempre"]}, {"id": "q4", "text": "Você prefere cobertura leve, média ou total?", "type": "single", "options": ["Leve", "Média", "Alta", "Não sei"]}, {"id": "q5", "text": "Sua pele tem poros dilatados ou textura irregular?", "type": "single", "options": ["Não", "Pouco", "Moderado", "Sim"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero encontrar minha base ideal", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  ),
  (
    'b1000118-0118-4000-8000-000000000118',
    'quiz_maquiagem_pele_sensivel',
    'diagnostico',
    '{"title": "Sua pele sensível aceita maquiagem?", "questions": [{"id": "q1", "text": "Sua pele irrita ou avermelha com produtos?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}, {"id": "q2", "text": "Você usa produtos hipoalergênicos ou para peles sensíveis?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nunca"]}, {"id": "q3", "text": "Você remove a maquiagem com cuidado todos os dias?", "type": "single", "options": ["Sempre", "Às vezes", "Raramente", "Nem sempre"]}, {"id": "q4", "text": "Sua pele coça ou arde após maquiagem?", "type": "single", "options": ["Nunca", "Raramente", "Às vezes", "Frequentemente"]}, {"id": "q5", "text": "Você gostaria de maquiar sem agredir a pele?", "type": "single", "options": ["Não preciso", "Talvez", "Sim", "Muito"]}], "results": [{"id": "r1", "label": "Resultado", "minScore": 0, "headline": "Seu resultado", "description": "O diagnóstico será gerado com base no seu perfil."}], "ctaDefault": "Quero maquiagem para pele sensível", "resultIntro": "Seu resultado:"}'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1, true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  schema_json = EXCLUDED.schema_json,
  allowed_vars_json = EXCLUDED.allowed_vars_json,
  version = EXCLUDED.version,
  active = EXCLUDED.active,
  updated_at = NOW();

-- Biblioteca itens: INSERT idempotente (WHERE NOT EXISTS por template_id)
INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'cabelo', 'habitos', 'O que pode estar causando sua queda de cabelo?', 'Identifique fatores que podem estar afetando seus fios e receba orientações.', 'Queda capilar', 'Reduzir queda e fortalecer', 'custom', 'b1000103-0103-4000-8000-000000000103'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 126, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000103-0103-4000-8000-000000000103');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'cabelo', 'habitos', 'Qual é o verdadeiro tipo do seu fio?', 'Descubra seu tipo de cabelo para escolher os cuidados certos.', 'Cuidados inadequados', 'Conhecer tipo de fio', 'custom', 'b1000104-0104-4000-8000-000000000104'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 127, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000104-0104-4000-8000-000000000104');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'cabelo', 'habitos', 'Seu couro cabeludo está saudável?', 'Avalie sinais de desequilíbrio e receba orientações especializadas.', 'Couro cabeludo irritado', 'Couro cabeludo saudável', 'custom', 'b1000105-0105-4000-8000-000000000105'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 128, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000105-0105-4000-8000-000000000105');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'cabelo', 'habitos', 'Seu cabelo está realmente hidratado?', 'Identifique sinais de desidratação e saiba como hidratar corretamente.', 'Cabelo ressecado', 'Cabelo hidratado e com brilho', 'custom', 'b1000106-0106-4000-8000-000000000106'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 129, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000106-0106-4000-8000-000000000106');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'cabelo', 'habitos', 'Sua tintura está prejudicando seus fios?', 'Avalie o impacto da coloração e como preservar a saúde capilar.', 'Cabelo danificado por tintura', 'Preservar cor e saúde', 'custom', 'b1000107-0107-4000-8000-000000000107'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 130, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000107-0107-4000-8000-000000000107');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'unhas', 'habitos', 'Suas cutículas estão saudáveis?', 'Avalie o estado das suas cutículas e receba dicas de cuidado.', 'Cutículas ressecadas', 'Cutículas bem cuidadas', 'custom', 'b1000108-0108-4000-8000-000000000108'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 131, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000108-0108-4000-8000-000000000108');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'unhas', 'habitos', 'Alongamento de unhas: o que você precisa saber?', 'Descubra a melhor forma de alongar sem prejudicar as unhas naturais.', 'Unhas naturais danificadas', 'Alongamento seguro', 'custom', 'b1000109-0109-4000-8000-000000000109'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 132, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000109-0109-4000-8000-000000000109');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'unhas', 'habitos', 'Qual estilo de nail art combina com você?', 'Descubra looks de unha que combinam com seu estilo e rotina.', 'Dúvida sobre estilo', 'Nail art personalizado', 'custom', 'b1000110-0110-4000-8000-000000000110'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 133, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000110-0110-4000-8000-000000000110');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'unhas', 'habitos', 'Suas unhas precisam de fortalecimento?', 'Identifique fragilidade e saiba como fortalecer as unhas.', 'Unhas quebradiças', 'Unhas fortes e resistentes', 'custom', 'b1000111-0111-4000-8000-000000000111'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 134, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000111-0111-4000-8000-000000000111');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'sobrancelha', 'habitos', 'Microblading é a solução para suas sobrancelhas?', 'Avalie se o procedimento é ideal para seu caso.', 'Sobrancelha rala', 'Sobrancelha definida e natural', 'custom', 'b1000112-0112-4000-8000-000000000112'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 135, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000112-0112-4000-8000-000000000112');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'sobrancelha', 'habitos', 'Laminagem de sobrancelha combina com você?', 'Descubra se a laminagem é a solução para seus pelos rebeldes.', 'Sobrancelha desalinhada', 'Sobrancelha definida e natural', 'custom', 'b1000113-0113-4000-8000-000000000113'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 136, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000113-0113-4000-8000-000000000113');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'sobrancelha', 'habitos', 'Sua sobrancelha valoriza seu rosto?', 'Descubra o formato e definição que realçam seus traços.', 'Sobrancelha irregular', 'Sobrancelha que valoriza o rosto', 'custom', 'b1000114-0114-4000-8000-000000000114'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 137, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000114-0114-4000-8000-000000000114');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'maquiagem', 'habitos', 'Qual look do dia combina com você?', 'Descubra a maquiagem ideal para sua rotina e personalidade.', 'Maquiagem inadequada', 'Look do dia personalizado', 'custom', 'b1000115-0115-4000-8000-000000000115'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 138, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000115-0115-4000-8000-000000000115');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'maquiagem', 'habitos', 'Você está pronta para aprender maquiagem do zero?', 'Avalie seu nível e receba um caminho personalizado para começar.', 'Dificuldade em maquiar', 'Aprender maquiagem', 'custom', 'b1000116-0116-4000-8000-000000000116'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 139, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000116-0116-4000-8000-000000000116');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'maquiagem', 'habitos', 'Qual base e preparação ideal para sua pele?', 'Descubra produtos e técnicas para sua base ficar impecável.', 'Base inadequada', 'Base que valoriza', 'custom', 'b1000117-0117-4000-8000-000000000117'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 140, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000117-0117-4000-8000-000000000117');

INSERT INTO ylada_biblioteca_itens (tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, source_type, template_id, flow_id, meta, sort_order, active)
SELECT 'quiz', ARRAY['aesthetics'], 'maquiagem', 'habitos', 'Sua pele sensível aceita maquiagem?', 'Avalie produtos e rotinas para peles sensíveis.', 'Pele irritada com maquiagem', 'Maquiagem sem irritar', 'custom', 'b1000118-0118-4000-8000-000000000118'::uuid, 'diagnostico_risco', '{"num_perguntas": 5, "tempo_minutos": 1}'::jsonb, 141, true
WHERE NOT EXISTS (SELECT 1 FROM ylada_biblioteca_itens WHERE template_id = 'b1000118-0118-4000-8000-000000000118');
