-- =====================================================
-- MIGRAÇÃO COMPLETA - TEMPLATES WELLNESS PARA O BANCO
-- =====================================================
-- Este script migra TODOS os templates Wellness para o banco de dados
-- Fonte única da verdade: templates_nutrition com profession='wellness'
-- 
-- TOTAL: 52 templates
-- - 4 Calculadoras
-- - 32 Quizzes/Diagnósticos  
-- - 2 Checklists
-- - 14 Planilhas
-- =====================================================

-- =====================================================
-- IMPORTANTE: ESTRUTURA DA TABELA
-- =====================================================
-- A tabela templates_nutrition tem estas colunas:
-- id (UUID, auto-gerado)
-- name (VARCHAR) - Nome do template
-- type (VARCHAR) - Tipo: 'quiz', 'calculadora', 'planilha'
-- language (VARCHAR) - Idioma: 'pt', 'pt-PT', 'es', 'en'
-- specialization (VARCHAR) - Especialização (opcional)
-- objective (VARCHAR) - Objetivo (opcional)
-- title (VARCHAR) - Título para exibição
-- description (TEXT) - Descrição detalhada
-- content (JSONB) - Conteúdo do template
-- cta_text (VARCHAR) - Texto do botão (opcional)
-- whatsapp_message (TEXT) - Mensagem WhatsApp (opcional)
-- is_active (BOOLEAN) - Se está ativo
-- profession (VARCHAR) - Profissão: 'wellness', 'nutricionista' (pode não existir)
-- created_at, updated_at (TIMESTAMP)
-- =====================================================

-- =====================================================
-- ADICIONAR COLUNA PROFESSION SE NÃO EXISTIR
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'templates_nutrition'
    AND column_name = 'profession'
  ) THEN
    ALTER TABLE templates_nutrition ADD COLUMN profession VARCHAR(100);
    RAISE NOTICE 'Coluna "profession" adicionada com sucesso';
  ELSE
    RAISE NOTICE 'Coluna "profession" já existe';
  END IF;
END $$;

-- =====================================================
-- CALCULADORAS (4 templates)
-- =====================================================

-- Usar INSERT com ON CONFLICT baseado em name + language
-- Se não funcionar, o script ainda inserirá (pode criar duplicatas, mas funcionará)

INSERT INTO templates_nutrition (
  name, type, language, objective, title, description, 
  profession, is_active, content
) VALUES
-- 1. Calculadora IMC
(
  'Calculadora de IMC',
  'calculadora',
  'pt',
  'Avaliar IMC',
  'Calculadora de IMC',
  'Calcule o Índice de Massa Corporal com interpretação personalizada',
  'wellness',
  true,
  '{"template_type": "calculator", "fields": ["idade", "genero", "peso", "altura"]}'::jsonb
),
-- 2. Calculadora de Proteína
(
  'Calculadora de Proteína',
  'calculadora',
  'pt',
  'Calcular proteína diária',
  'Calculadora de Proteína',
  'Calcule a necessidade proteica diária do cliente',
  'wellness',
  true,
  '{"template_type": "calculator", "fields": ["peso", "atividade", "objetivo"]}'::jsonb
),
-- 3. Calculadora de Água
(
  'Calculadora de Água',
  'calculadora',
  'pt',
  'Calcular água diária',
  'Calculadora de Água',
  'Calcule a necessidade diária de hidratação',
  'wellness',
  true,
  '{"template_type": "calculator", "fields": ["peso", "atividade", "clima"]}'::jsonb
),
-- 4. Calculadora de Calorias
(
  'Calculadora de Calorias',
  'calculadora',
  'pt',
  'Calcular calorias diárias',
  'Calculadora de Calorias',
  'Calcule o gasto calórico diário e necessidades energéticas',
  'wellness',
  true,
  '{"template_type": "calculator", "fields": ["idade", "genero", "peso", "altura", "atividade"]}'::jsonb
)
ON CONFLICT DO NOTHING; -- Se não tiver constraint única, simplesmente insere (pode criar duplicatas)

-- =====================================================
-- QUIZZES/DIAGNÓSTICOS (32 templates)
-- =====================================================

INSERT INTO templates_nutrition (
  name, type, language, objective, title, description, 
  profession, is_active, content
) VALUES
-- 5. Quiz de Perfil Nutricional
(
  'Quiz de Perfil Nutricional',
  'quiz',
  'pt',
  'Diagnóstico inicial do perfil nutricional',
  'Quiz de Perfil Nutricional',
  'Identifique o perfil nutricional do cliente',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 7}'::jsonb
),
-- 6. Quiz: Perfil de Bem-Estar
(
  'Quiz: Perfil de Bem-Estar',
  'quiz',
  'pt',
  'Perfil completo de bem-estar',
  'Quiz: Perfil de Bem-Estar',
  'Descubra o perfil de bem-estar dos seus leads',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 6}'::jsonb
),
-- 7. Quiz: Alimentação Saudável
(
  'Quiz: Alimentação Saudável',
  'quiz',
  'pt',
  'Avaliar hábitos alimentares',
  'Quiz: Alimentação Saudável',
  'Avalie hábitos alimentares e oriente nutricionalmente',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 7}'::jsonb
),
-- 8. Quiz: Ganhos e Prosperidade
(
  'Quiz: Ganhos e Prosperidade',
  'quiz',
  'pt',
  'Avaliar potencial financeiro',
  'Quiz: Ganhos e Prosperidade',
  'Avalie se o estilo de vida permite ganhar mais',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 8}'::jsonb
),
-- 9. Quiz: Potencial e Crescimento
(
  'Quiz: Potencial e Crescimento',
  'quiz',
  'pt',
  'Avaliar potencial',
  'Quiz: Potencial e Crescimento',
  'Descubra se o potencial está sendo bem aproveitado',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 7}'::jsonb
),
-- 10. Quiz: Propósito e Equilíbrio
(
  'Quiz: Propósito e Equilíbrio',
  'quiz',
  'pt',
  'Alinhamento de vida',
  'Quiz: Propósito e Equilíbrio',
  'Descubra se o dia a dia está alinhado com seus sonhos',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 6}'::jsonb
),
-- 11. Quiz: Diagnóstico de Parasitas
(
  'Quiz: Diagnóstico de Parasitas',
  'quiz',
  'pt',
  'Avaliar saúde intestinal',
  'Quiz: Diagnóstico de Parasitas',
  'Descubra se você tem parasitas que estão afetando sua saúde',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 12. Avaliação Nutricional
(
  'Avaliação Nutricional',
  'quiz',
  'pt',
  'Avaliação nutricional completa',
  'Avaliação Nutricional',
  'Questionário completo de hábitos alimentares',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 12}'::jsonb
),
-- 13. Avaliação Inicial
(
  'Avaliação Inicial',
  'quiz',
  'pt',
  'Avaliação inicial completa',
  'Avaliação Inicial',
  'Avaliação completa de bem-estar e saúde',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 14. Story Interativo
(
  'Story Interativo',
  'quiz',
  'pt',
  'Captação através de story',
  'Story Interativo',
  'Formulário interativo estilo story',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 5}'::jsonb
),
-- 15. Formulário de Recomendações
(
  'Formulário de Recomendações',
  'quiz',
  'pt',
  'Coletar dados para recomendações',
  'Formulário de Recomendações',
  'Colete informações para recomendações personalizadas',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 8}'::jsonb
),
-- 16. Simulador de Resultados
(
  'Simulador de Resultados',
  'quiz',
  'pt',
  'Simular resultados',
  'Simulador de Resultados',
  'Simule resultados possíveis de mudanças de hábitos',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 6}'::jsonb
),
-- 17. Quiz Interativo
(
  'Quiz Interativo',
  'quiz',
  'pt',
  'Atrair leads frios',
  'Quiz Interativo',
  'Quiz com perguntas estratégicas para capturar informações dos clientes',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 6}'::jsonb
),
-- 18. Quiz de Bem-Estar
(
  'Quiz de Bem-Estar',
  'quiz',
  'pt',
  'Avaliação completa de bem-estar',
  'Quiz de Bem-Estar',
  'Avalie o bem-estar geral do cliente',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 6}'::jsonb
),
-- 19. Quiz Detox
(
  'Quiz Detox',
  'quiz',
  'pt',
  'Captação através de curiosidade sobre detox',
  'Quiz Detox',
  'Avalie a necessidade de processo detox',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 5}'::jsonb
),
-- 20. Quiz Energético
(
  'Quiz Energético',
  'quiz',
  'pt',
  'Segmentação por níveis de energia',
  'Quiz Energético',
  'Identifique níveis de energia e cansaço',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 6}'::jsonb
),
-- 21. Diagnóstico de Parasitose
(
  'Diagnóstico de Parasitose',
  'quiz',
  'pt',
  'Diagnóstico específico de parasitose',
  'Diagnóstico de Parasitose',
  'Ferramenta para diagnóstico de parasitose intestinal',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 22. Diagnóstico de Eletrólitos
(
  'Diagnóstico de Eletrólitos',
  'quiz',
  'pt',
  'Detecta necessidade de reposição de eletrólitos',
  'Diagnóstico de Eletrólitos',
  'Avalie sinais de desequilíbrio de sódio, potássio, magnésio e cálcio',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 23. Avaliação do Perfil Metabólico
(
  'Avaliação do Perfil Metabólico',
  'quiz',
  'pt',
  'Classifica seu perfil metabólico e orienta próximos passos',
  'Avaliação do Perfil Metabólico',
  'Identifique sinais de metabolismo acelerado, equilibrado ou lento',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 24. Diagnóstico de Sintomas Intestinais
(
  'Diagnóstico de Sintomas Intestinais',
  'quiz',
  'pt',
  'Detecta desequilíbrio intestinal e orienta próximos passos',
  'Diagnóstico de Sintomas Intestinais',
  'Identifique sinais de constipação, disbiose, inflamação e irregularidade',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 25. Avaliação do Sono e Energia
(
  'Avaliação do Sono e Energia',
  'quiz',
  'pt',
  'Classifica o descanso e energia',
  'Avaliação do Sono e Energia',
  'Avalie se o sono está restaurando sua energia diária',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 26. Teste de Retenção de Líquidos
(
  'Teste de Retenção de Líquidos',
  'quiz',
  'pt',
  'Detecta retenção hídrica e orienta próximos passos',
  'Teste de Retenção de Líquidos',
  'Avalie sinais de retenção hídrica e desequilíbrio mineral',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 27. Avaliação de Fome Emocional
(
  'Avaliação de Fome Emocional',
  'quiz',
  'pt',
  'Avalia influência emocional na alimentação',
  'Avaliação de Fome Emocional',
  'Identifique se a alimentação está sendo influenciada por emoções e estresse',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 28. Diagnóstico do Tipo de Metabolismo
(
  'Diagnóstico do Tipo de Metabolismo',
  'quiz',
  'pt',
  'Classifica o tipo metabólico por sintomas e hábitos',
  'Diagnóstico do Tipo de Metabolismo',
  'Avalie se seu metabolismo é lento, normal ou acelerado',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 29. Você é mais disciplinado ou emocional com a comida?
(
  'Você é mais disciplinado ou emocional com a comida?',
  'quiz',
  'pt',
  'Identifica perfil comportamental: disciplinado, intermediário ou emocional',
  'Você é mais disciplinado ou emocional com a comida?',
  'Avalie se o comportamento alimentar é guiado mais por razão ou emoções',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 30. Você está nutrido ou apenas alimentado?
(
  'Você está nutrido ou apenas alimentado?',
  'quiz',
  'pt',
  'Avalia qualidade nutricional e deficiências celulares',
  'Você está nutrido ou apenas alimentado?',
  'Descubra se está nutrido em nível celular ou apenas comendo calorias vazias',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 31. Qual é seu perfil de intestino?
(
  'Qual é seu perfil de intestino?',
  'quiz',
  'pt',
  'Classifica perfil intestinal: equilibrado, preso/sensível ou disbiose',
  'Qual é seu perfil de intestino?',
  'Identifique o tipo de funcionamento intestinal e saúde digestiva',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 32. Avaliação de Intolerâncias/Sensibilidades
(
  'Avaliação de Intolerâncias/Sensibilidades',
  'quiz',
  'pt',
  'Identifica possíveis reações alimentares e orienta próximos passos',
  'Avaliação de Intolerâncias/Sensibilidades',
  'Detecte sinais de sensibilidades alimentares não diagnosticadas',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 33. Risco de Síndrome Metabólica
(
  'Risco de Síndrome Metabólica',
  'quiz',
  'pt',
  'Sinaliza risco metabólico e orienta condutas',
  'Risco de Síndrome Metabólica',
  'Avalie fatores de risco ligados à resistência à insulina e inflamação',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 34. Descubra seu Perfil de Bem-Estar
(
  'Descubra seu Perfil de Bem-Estar',
  'quiz',
  'pt',
  'Diagnóstico leve com convite à avaliação personalizada',
  'Descubra seu Perfil de Bem-Estar',
  'Identifique se seu perfil é Estético, Equilibrado ou Saúde/Performance',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 35. Qual é o seu Tipo de Fome?
(
  'Qual é o seu Tipo de Fome?',
  'quiz',
  'pt',
  'Provoca curiosidade e direciona para avaliação',
  'Qual é o seu Tipo de Fome?',
  'Identifique Fome Física, por Hábito ou Emocional',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 36. Seu corpo está pedindo Detox?
(
  'Seu corpo está pedindo Detox?',
  'quiz',
  'pt',
  'Sinaliza necessidade de detox guiado',
  'Seu corpo está pedindo Detox?',
  'Avalie sinais de sobrecarga e acúmulo de toxinas',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 37. Você está se alimentando conforme sua rotina?
(
  'Você está se alimentando conforme sua rotina?',
  'quiz',
  'pt',
  'Aponta alinhamento da rotina e sugere reeducação',
  'Você está se alimentando conforme sua rotina?',
  'Descubra se sua rotina alimentar está adequada aos horários e demandas',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 38. Pronto para Emagrecer com Saúde?
(
  'Pronto para Emagrecer com Saúde?',
  'quiz',
  'pt',
  'Identifica prontidão e direciona para preparação personalizada',
  'Pronto para Emagrecer com Saúde?',
  'Avalie seu nível de prontidão física e emocional',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
),
-- 39. Você conhece o seu corpo?
(
  'Você conhece o seu corpo?',
  'quiz',
  'pt',
  'Mostra o quanto você entende seus sinais físicos e emocionais',
  'Você conhece o seu corpo?',
  'Avalie seu nível de autoconhecimento corporal e nutricional',
  'wellness',
  true,
  '{"template_type": "quiz", "questions": 10}'::jsonb
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- CHECKLISTS (2 templates)
-- =====================================================

INSERT INTO templates_nutrition (
  name, type, language, objective, title, description, 
  profession, is_active, content
) VALUES
-- 40. Checklist Detox
(
  'Checklist Detox',
  'planilha',
  'pt',
  'Educação rápida sobre detox',
  'Checklist Detox',
  'Lista de verificação para processo de detox',
  'wellness',
  true,
  '{"template_type": "checklist", "items": 10}'::jsonb
),
-- 41. Checklist Alimentar
(
  'Checklist Alimentar',
  'planilha',
  'pt',
  'Avaliação completa de hábitos alimentares',
  'Checklist Alimentar',
  'Avalie hábitos alimentares do cliente',
  'wellness',
  true,
  '{"template_type": "checklist", "items": 12}'::jsonb
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PLANILHAS (14 templates)
-- =====================================================

INSERT INTO templates_nutrition (
  name, type, language, objective, title, description, 
  profession, is_active, content
) VALUES
-- 42. Tabela Bem-Estar Diário
(
  'Tabela Bem-Estar Diário',
  'planilha',
  'pt',
  'Acompanhamento diário',
  'Tabela Bem-Estar Diário',
  'Acompanhe métricas de bem-estar diárias',
  'wellness',
  true,
  '{"template_type": "spreadsheet", "sections": ["agua", "exercicios", "sono", "alimentacao"]}'::jsonb
),
-- 43. Diário Alimentar
(
  'Diário Alimentar',
  'planilha',
  'pt',
  'Registro alimentar',
  'Diário Alimentar',
  'Registre todas as refeições e sentimentos',
  'wellness',
  true,
  '{"template_type": "spreadsheet", "sections": ["refeicoes", "sentimentos", "agua"]}'::jsonb
),
-- 44. Rastreador de Alimentos
(
  'Rastreador de Alimentos',
  'planilha',
  'pt',
  'Rastreamento nutricional',
  'Rastreador de Alimentos',
  'Acompanhe calorias e macronutrientes',
  'wellness',
  true,
  '{"template_type": "spreadsheet", "sections": ["calorias", "macronutrientes", "refeicoes"]}'::jsonb
),
-- 45. Guia de Hidratação
(
  'Guia de Hidratação',
  'planilha',
  'pt',
  'Plano de hidratação',
  'Guia de Hidratação',
  'Plano completo de hidratação diária',
  'wellness',
  true,
  '{"template_type": "spreadsheet", "sections": ["agua", "horarios", "lembretes"]}'::jsonb
),
-- 46. Metas Semanais
(
  'Metas Semanais',
  'planilha',
  'pt',
  'Acompanhamento de metas',
  'Metas Semanais',
  'Defina e acompanhe metas semanais de bem-estar',
  'wellness',
  true,
  '{"template_type": "spreadsheet", "sections": ["metas", "progresso", "recompensas"]}'::jsonb
),
-- 47. Desafio 21 Dias
(
  'Desafio 21 Dias',
  'planilha',
  'pt',
  'Transformação em 21 dias',
  'Desafio 21 Dias',
  'Plano completo de transformação em 21 dias',
  'wellness',
  true,
  '{"template_type": "spreadsheet", "sections": ["dias", "tarefas", "progresso"]}'::jsonb
),
-- 48. Desafio 7 Dias
(
  'Desafio 7 Dias',
  'planilha',
  'pt',
  'Transformação em 7 dias',
  'Desafio 7 Dias',
  'Plano de transformação rápida em 7 dias',
  'wellness',
  true,
  '{"template_type": "spreadsheet", "sections": ["dias", "tarefas", "progresso"]}'::jsonb
),
-- 49. Cardápio Detox
(
  'Cardápio Detox',
  'planilha',
  'pt',
  'Plano detox',
  'Cardápio Detox',
  'Plano completo de cardápio detox',
  'wellness',
  true,
  '{"template_type": "spreadsheet", "sections": ["refeicoes", "receitas", "bebidas"]}'::jsonb
),
-- 50. Receitas Saudáveis
(
  'Receitas Saudáveis',
  'planilha',
  'pt',
  'Receitas práticas',
  'Receitas Saudáveis',
  'Coleção de receitas saudáveis e práticas',
  'wellness',
  true,
  '{"template_type": "spreadsheet", "sections": ["cafe", "almoco", "jantar", "lanches"]}'::jsonb
),
-- 51. Infográfico
(
  'Infográfico',
  'planilha',
  'pt',
  'Informação visual',
  'Infográfico',
  'Visualize informações importantes de forma visual',
  'wellness',
  true,
  '{"template_type": "spreadsheet", "sections": ["graficos", "estatisticas", "dicas"]}'::jsonb
),
-- 52. Planejador Semanal
(
  'Planejador Semanal',
  'planilha',
  'pt',
  'Planejamento semanal',
  'Planejador Semanal',
  'Organize sua semana de bem-estar',
  'wellness',
  true,
  '{"template_type": "spreadsheet", "sections": ["refeicoes", "exercicios", "metas"]}'::jsonb
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar quantos templates foram inseridos
SELECT 
  COUNT(*) as total_templates,
  COUNT(*) FILTER (WHERE profession = 'wellness' AND language = 'pt' AND is_active = true) as wellness_ativos,
  COUNT(*) FILTER (WHERE type = 'calculadora') as calculadoras,
  COUNT(*) FILTER (WHERE type = 'quiz') as quizzes,
  COUNT(*) FILTER (WHERE type = 'planilha') as planilhas
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt';

-- Listar todos os templates wellness ativos
SELECT 
  name,
  type,
  objective,
  is_active,
  created_at,
  updated_at
FROM templates_nutrition
WHERE profession = 'wellness' AND language = 'pt' AND is_active = true
ORDER BY type, name;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- 1. Este script usa ON CONFLICT DO NOTHING para evitar duplicatas
--    Se não tiver constraint única, pode criar duplicatas, mas funcionará
-- 2. Se um template já existir, será ignorado (não atualizado)
-- 3. Todos os templates são marcados como is_active = true
-- 4. Todos têm profession = 'wellness' e language = 'pt'
-- 5. A coluna 'profession' é adicionada automaticamente se não existir
-- 6. Após executar, verifique o resultado das queries acima
