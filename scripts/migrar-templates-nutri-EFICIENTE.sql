-- ============================================
-- MIGRAR TEMPLATES HARDCODED NUTRI → BANCO (VERSÃO EFICIENTE)
-- Reutiliza content de Wellness quando disponível
-- ============================================

-- ⚠️ IMPORTANTE: 
-- 1. Este script migra os 35 templates hardcoded da Nutri para o banco
-- 2. Usa CTE (Common Table Expression) para definir todos os templates de uma vez
-- 3. Faz JOIN com Wellness para copiar content automaticamente
-- 4. Preserva nome/descrição da Nutri (hardcoded)
-- 5. Diagnósticos continuam no código TypeScript (não são afetados)

-- ============================================
-- 1. VERIFICAR ESTADO ANTES
-- ============================================
SELECT 
  'ANTES' as etapa,
  'Wellness' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt'

UNION ALL

SELECT 
  'ANTES' as etapa,
  'Nutri' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt';

-- ============================================
-- 2. DEFINIR TODOS OS TEMPLATES HARDCODED NUTRI
-- ============================================
-- Usando CTE para definir todos os 35 templates de uma vez
WITH templates_nutri_hardcoded AS (
  SELECT * FROM (VALUES
    -- QUIZZES (5)
    ('quiz-interativo', 'Quiz Interativo', 'quiz', 'Quiz com perguntas estratégicas para capturar informações dos clientes', 'quiz interativo', 'interativo'),
    ('quiz-bem-estar', 'Quiz de Bem-Estar', 'quiz', 'Avalie o bem-estar geral do cliente', 'bem-estar', 'bem estar'),
    ('quiz-perfil-nutricional', 'Quiz de Perfil Nutricional', 'quiz', 'Identifique o perfil nutricional do cliente', 'perfil nutricional', 'perfil nutricional'),
    ('quiz-detox', 'Quiz Detox', 'quiz', 'Avalie a necessidade de processo detox', 'quiz detox', 'detox'),
    ('quiz-energetico', 'Quiz Energético', 'quiz', 'Identifique níveis de energia e cansaço', 'energético', 'energetico'),
    
    -- CALCULADORAS (4)
    ('calculadora-imc', 'Calculadora de IMC', 'calculadora', 'Calcule o Índice de Massa Corporal com interpretação personalizada', 'imc', 'imc'),
    ('calculadora-proteina', 'Calculadora de Proteína', 'calculadora', 'Calcule a necessidade proteica diária do cliente', 'proteína', 'proteina'),
    ('calculadora-agua', 'Calculadora de Água', 'calculadora', 'Calcule a necessidade diária de hidratação', 'água', 'agua'),
    ('calculadora-calorias', 'Calculadora de Calorias', 'calculadora', 'Calcule o gasto calórico diário e necessidades energéticas', 'caloria', 'caloria'),
    
    -- CHECKLISTS (2)
    ('checklist-detox', 'Checklist Detox', 'planilha', 'Lista de verificação para processo de detox', 'checklist detox', 'checklist detox'),
    ('checklist-alimentar', 'Checklist Alimentar', 'planilha', 'Avalie hábitos alimentares do cliente', 'checklist alimentar', 'checklist alimentar'),
    
    -- CONTEÚDO EDUCATIVO (5)
    ('mini-ebook', 'Mini E-book Educativo', 'planilha', 'E-book compacto para demonstrar expertise e autoridade', 'ebook', 'e-book'),
    ('guia-nutraceutico', 'Guia Nutracêutico', 'planilha', 'Guia completo sobre suplementos e nutracêuticos', 'nutracêutico', 'nutraceutico'),
    ('guia-proteico', 'Guia Proteico', 'planilha', 'Guia especializado sobre proteínas e fontes proteicas', 'guia proteico', 'guia-proteico'),
    ('tabela-comparativa', 'Tabela Comparativa', 'planilha', 'Tabelas comparativas de alimentos e nutrientes', 'tabela comparativa', 'tabela comparativa'),
    ('tabela-substituicoes', 'Tabela de Substituições', 'planilha', 'Tabela de substituições de alimentos para mais variedade', 'tabela substituição', 'substituição'),
    
    -- DIAGNÓSTICOS ESPECÍFICOS (19)
    ('template-diagnostico-parasitose', 'Diagnóstico de Parasitose', 'quiz', 'Ferramenta para diagnóstico de parasitose intestinal', 'parasitose', 'parasita'),
    ('diagnostico-eletritos', 'Diagnóstico de Eletrólitos', 'quiz', 'Avalie sinais de desequilíbrio de sódio, potássio, magnésio e cálcio', 'eletrólito', 'eletrolito'),
    ('diagnostico-perfil-metabolico', 'Avaliação do Perfil Metabólico', 'quiz', 'Identifique sinais de metabolismo acelerado, equilibrado ou lento', 'perfil metabólico', 'perfil metabolico'),
    ('diagnostico-sintomas-intestinais', 'Diagnóstico de Sintomas Intestinais', 'quiz', 'Identifique sinais de constipação, disbiose, inflamação e irregularidade', 'sintomas intestinais', 'sintomas intestinais'),
    ('avaliacao-sono-energia', 'Avaliação do Sono e Energia', 'quiz', 'Avalie se o sono está restaurando sua energia diária', 'sono energia', 'sono e energia'),
    ('teste-retencao-liquidos', 'Teste de Retenção de Líquidos', 'quiz', 'Avalie sinais de retenção hídrica e desequilíbrio mineral', 'retenção', 'retencao'),
    ('avaliacao-fome-emocional', 'Avaliação de Fome Emocional', 'quiz', 'Identifique se a alimentação está sendo influenciada por emoções e estresse', 'fome emocional', 'fome emocional'),
    ('diagnostico-tipo-metabolismo', 'Diagnóstico do Tipo de Metabolismo', 'quiz', 'Avalie se seu metabolismo é lento, normal ou acelerado', 'tipo metabolismo', 'tipo de metabolismo'),
    ('disciplinado-emocional', 'Você é mais disciplinado ou emocional com a comida?', 'quiz', 'Avalie se o comportamento alimentar é guiado mais por razão ou emoções', 'disciplinado emocional', 'disciplinado ou emocional'),
    ('nutrido-alimentado', 'Você está nutrido ou apenas alimentado?', 'quiz', 'Descubra se está nutrido em nível celular ou apenas comendo calorias vazias', 'nutrido alimentado', 'nutrido ou alimentado'),
    ('perfil-intestino', 'Qual é seu perfil de intestino?', 'quiz', 'Identifique o tipo de funcionamento intestinal e saúde digestiva', 'perfil intestino', 'perfil de intestino'),
    ('avaliacao-sensibilidades', 'Avaliação de Intolerâncias/Sensibilidades', 'quiz', 'Detecte sinais de sensibilidades alimentares não diagnosticadas', 'intolerância', 'intolerancia'),
    ('avaliacao-sindrome-metabolica', 'Risco de Síndrome Metabólica', 'quiz', 'Avalie fatores de risco ligados à resistência à insulina e inflamação', 'síndrome metabólica', 'sindrome metabolica'),
    ('descoberta-perfil-bem-estar', 'Descubra seu Perfil de Bem-Estar', 'quiz', 'Identifique se seu perfil é Estético, Equilibrado ou Saúde/Performance', 'perfil bem-estar', 'perfil de bem-estar'),
    ('quiz-tipo-fome', 'Qual é o seu Tipo de Fome?', 'quiz', 'Identifique Fome Física, por Hábito ou Emocional', 'tipo fome', 'tipo de fome'),
    ('quiz-pedindo-detox', 'Seu corpo está pedindo Detox?', 'quiz', 'Avalie sinais de sobrecarga e acúmulo de toxinas', 'pedindo detox', 'corpo pedindo detox'),
    ('avaliacao-rotina-alimentar', 'Você está se alimentando conforme sua rotina?', 'quiz', 'Descubra se sua rotina alimentar está adequada aos horários e demandas', 'rotina alimentar', 'alimentando conforme rotina'),
    ('pronto-emagrecer', 'Pronto para Emagrecer com Saúde?', 'quiz', 'Avalie seu nível de prontidão física e emocional', 'pronto emagrecer', 'pronto para emagrecer'),
    ('autoconhecimento-corporal', 'Você conhece o seu corpo?', 'quiz', 'Avalie seu nível de autoconhecimento corporal e nutricional', 'conhece corpo', 'conhece seu corpo')
  ) AS t(slug, name, type, description, search_term_1, search_term_2)
),
-- Buscar content de Wellness para cada template
templates_com_content AS (
  SELECT 
    t.slug,
    t.name,
    t.type,
    t.description,
    COALESCE(
      (SELECT w.content 
       FROM templates_nutrition w
       WHERE w.profession = 'wellness' 
       AND w.language = 'pt'
       AND (
         LOWER(w.name) LIKE '%' || LOWER(t.search_term_1) || '%'
         OR LOWER(w.name) LIKE '%' || LOWER(t.search_term_2) || '%'
         OR LOWER(w.slug) LIKE '%' || LOWER(t.slug) || '%'
       )
       LIMIT 1),
      CASE 
        WHEN t.type = 'quiz' THEN '{"template_type": "quiz", "questions": 10}'::jsonb
        WHEN t.type = 'calculadora' THEN '{"template_type": "calculator", "fields": []}'::jsonb
        WHEN t.type = 'planilha' THEN '{"template_type": "planilha", "items": []}'::jsonb
        ELSE '{"template_type": "quiz", "questions": 10}'::jsonb
      END
    ) as content
  FROM templates_nutri_hardcoded t
)
-- Inserir todos os templates de uma vez
-- Usar ON CONFLICT para evitar duplicatas (se slug já existe, não insere)
-- Se o template já existe, apenas atualiza o content se for diferente
INSERT INTO templates_nutrition (
  name, type, language, profession, title, description, content, is_active, slug, created_at, updated_at
)
SELECT 
  t.name,
  t.type,
  'pt' as language,
  'nutri' as profession,
  t.name as title,
  t.description,
  t.content,
  true as is_active,
  t.slug,
  NOW() as created_at,
  NOW() as updated_at
FROM templates_com_content t
ON CONFLICT (slug) 
DO UPDATE SET
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  updated_at = NOW()
WHERE templates_nutrition.profession = 'nutri' 
  AND templates_nutrition.language = 'pt';

-- ============================================
-- 3. VERIFICAR ESTADO DEPOIS
-- ============================================
SELECT 
  'DEPOIS' as etapa,
  'Wellness' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt'

UNION ALL

SELECT 
  'DEPOIS' as etapa,
  'Nutri' as area,
  COUNT(*) as total
FROM templates_nutrition
WHERE profession = 'nutri' AND language = 'pt';

-- ============================================
-- 4. VERIFICAR QUANTOS FORAM CRIADOS
-- ============================================
SELECT 
  COUNT(*) as templates_criados
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND created_at >= NOW() - INTERVAL '1 minute';

-- ============================================
-- 5. LISTAR TEMPLATES CRIADOS
-- ============================================
SELECT 
  name,
  type,
  slug,
  CASE 
    WHEN content::text LIKE '%wellness%' OR content::text NOT LIKE '%template_type%' THEN '✅ Content de Wellness'
    ELSE '⚠️ Content básico criado'
  END as status_content
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND created_at >= NOW() - INTERVAL '1 minute'
ORDER BY type, name;

-- ============================================
-- ✅ IMPORTANTE: PRÓXIMOS PASSOS
-- ============================================
-- Após executar este script:
-- 1. Os templates estarão no banco com profession='nutri'
-- 2. Content foi copiado de Wellness quando disponível
-- 3. Diagnósticos continuam no código TypeScript (não afetados)
-- 4. Atualizar página Nutri para carregar do banco

