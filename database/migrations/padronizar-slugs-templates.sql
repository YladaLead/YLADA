-- =====================================================
-- PADRONIZAR SLUGS DE TEMPLATES
-- Adiciona coluna slug fixa em templates_nutrition
-- Garante consistência mesmo se o nome mudar
-- =====================================================

-- 1. Adicionar coluna slug se não existir
ALTER TABLE templates_nutrition 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- 2. Remover índice único temporariamente para permitir atualizações
DROP INDEX IF EXISTS idx_templates_nutrition_slug;

-- 3. Atualizar slugs baseado no nome atual (normalização)
-- IMPORTANTE: Atualiza TODOS os templates que correspondem ao padrão para o mesmo slug

-- Calculadora de Hidratação/Água - atualizar TODOS para calc-hidratacao
UPDATE templates_nutrition
SET slug = 'calc-hidratacao'
WHERE (LOWER(name) LIKE '%água%' OR LOWER(name) LIKE '%agua%' OR LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%')
  AND type = 'calculadora';

-- Calculadora IMC
UPDATE templates_nutrition
SET slug = 'calc-imc'
WHERE (LOWER(name) LIKE '%imc%' OR LOWER(name) LIKE '%índice de massa corporal%')
  AND type = 'calculadora';

-- Calculadora de Proteína
UPDATE templates_nutrition
SET slug = 'calc-proteina'
WHERE (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%')
  AND type = 'calculadora';

-- Calculadora de Composição
UPDATE templates_nutrition
SET slug = 'calc-composicao'
WHERE (LOWER(name) LIKE '%composição%' OR LOWER(name) LIKE '%composicao%' OR LOWER(name) LIKE '%corporal%')
  AND type = 'calculadora';

-- Calculadora de Calorias
UPDATE templates_nutrition
SET slug = 'calc-calorias'
WHERE (LOWER(name) LIKE '%caloria%' OR LOWER(name) LIKE '%calorie%' OR LOWER(name) LIKE '%energia%')
  AND type = 'calculadora';

-- Quiz Ganhos
UPDATE templates_nutrition
SET slug = 'quiz-ganhos'
WHERE (LOWER(name) LIKE '%ganhos%' AND LOWER(name) LIKE '%prosperidade%')
  AND type = 'quiz';

-- Quiz Potencial
UPDATE templates_nutrition
SET slug = 'quiz-potencial'
WHERE (LOWER(name) LIKE '%potencial%' AND LOWER(name) LIKE '%crescimento%')
  AND type = 'quiz';

-- Quiz Propósito
UPDATE templates_nutrition
SET slug = 'quiz-proposito'
WHERE (LOWER(name) LIKE '%propósito%' OR LOWER(name) LIKE '%proposito%')
  AND type = 'quiz';

-- Quiz Parasitas
UPDATE templates_nutrition
SET slug = 'quiz-parasitas'
WHERE LOWER(name) LIKE '%parasitas%'
  AND type = 'quiz';

-- Quiz Alimentação
UPDATE templates_nutrition
SET slug = 'quiz-alimentacao'
WHERE (LOWER(name) LIKE '%alimentação%' OR LOWER(name) LIKE '%alimentacao%')
  AND type = 'quiz';

-- Planilha Meal Planner
UPDATE templates_nutrition
SET slug = 'planilha-meal-planner'
WHERE (LOWER(name) LIKE '%meal planner%' OR LOWER(name) LIKE '%planejador%' OR LOWER(name) LIKE '%cardápio%')
  AND type = 'planilha';

-- Planilha Diário Alimentar
UPDATE templates_nutrition
SET slug = 'planilha-diario-alimentar'
WHERE (LOWER(name) LIKE '%diário%' OR LOWER(name) LIKE '%diario%')
  AND type = 'planilha';

-- Planilha Metas Semanais
UPDATE templates_nutrition
SET slug = 'planilha-metas-semanais'
WHERE (LOWER(name) LIKE '%metas%' OR LOWER(name) LIKE '%semanal%')
  AND type = 'planilha';

-- Planilha Rastreador de Alimentos
UPDATE templates_nutrition
SET slug = 'planilha-rastreador-alimentos'
WHERE (LOWER(name) LIKE '%rastreador%' OR LOWER(name) LIKE '%food tracker%' OR LOWER(name) LIKE '%tracker%')
  AND type = 'planilha';

-- Planilha Bem-Estar Diário
UPDATE templates_nutrition
SET slug = 'planilha-bem-estar-diario'
WHERE (LOWER(name) LIKE '%bem-estar%' OR LOWER(name) LIKE '%bem estar%' OR LOWER(name) LIKE '%daily wellness%')
  AND type = 'planilha';

-- Planilha Guia de Hidratação
UPDATE templates_nutrition
SET slug = 'guia-hidratacao'
WHERE (LOWER(name) LIKE '%guia%' AND (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%'))
  AND type = 'planilha';

-- Planilha Desafio 21 Dias
UPDATE templates_nutrition
SET slug = 'template-desafio-21dias'
WHERE (LOWER(name) LIKE '%desafio%' AND (LOWER(name) LIKE '%21%' OR LOWER(name) LIKE '%vinte e um%'))
  AND type = 'planilha';

-- Planilha Desafio 7 Dias
UPDATE templates_nutrition
SET slug = 'template-desafio-7dias'
WHERE (LOWER(name) LIKE '%desafio%' AND (LOWER(name) LIKE '%7%' OR LOWER(name) LIKE '%sete%'))
  AND type = 'planilha';

-- Planilha Cardápio Detox
UPDATE templates_nutrition
SET slug = 'cardapio-detox'
WHERE (LOWER(name) LIKE '%cardápio%' OR LOWER(name) LIKE '%cardapio%') AND LOWER(name) LIKE '%detox%'
  AND type = 'planilha';

-- Planilha Receitas Saudáveis
UPDATE templates_nutrition
SET slug = 'template-receitas'
WHERE (LOWER(name) LIKE '%receita%' OR LOWER(name) LIKE '%recipe%')
  AND type = 'planilha';

-- Planilha Infográfico
UPDATE templates_nutrition
SET slug = 'infografico-educativo'
WHERE (LOWER(name) LIKE '%infográfico%' OR LOWER(name) LIKE '%infografico%' OR LOWER(name) LIKE '%infographic%')
  AND type = 'planilha';

-- Planilha Planejador Semanal
UPDATE templates_nutrition
SET slug = 'planilha-planejador-semanal'
WHERE (LOWER(name) LIKE '%planejador%' OR LOWER(name) LIKE '%planner%') AND LOWER(name) LIKE '%semanal%'
  AND type = 'planilha';

-- Checklist Detox
UPDATE templates_nutrition
SET slug = 'checklist-detox'
WHERE LOWER(name) LIKE '%checklist%' AND LOWER(name) LIKE '%detox%'
  AND type = 'planilha';

-- Checklist Alimentar
UPDATE templates_nutrition
SET slug = 'checklist-alimentar'
WHERE LOWER(name) LIKE '%checklist%' AND LOWER(name) LIKE '%alimentar%'
  AND type = 'planilha';

-- Quiz Avaliação de Fome Emocional
UPDATE templates_nutrition
SET slug = 'quiz-fome-emocional'
WHERE (LOWER(name) LIKE '%fome%' AND (LOWER(name) LIKE '%emocional%' OR LOWER(name) LIKE '%emotional%'))
  AND type = 'quiz';

-- Quiz Avaliação do Sono e Energia
UPDATE templates_nutrition
SET slug = 'quiz-sono-energia'
WHERE ((LOWER(name) LIKE '%sono%' OR LOWER(name) LIKE '%sleep%') AND (LOWER(name) LIKE '%energia%' OR LOWER(name) LIKE '%energy%'))
  AND type = 'quiz';

-- Quiz Interativo (genérico)
UPDATE templates_nutrition
SET slug = 'quiz-interativo'
WHERE (LOWER(name) LIKE '%quiz interativo%' OR LOWER(name) LIKE '%interactive quiz%')
  AND type = 'quiz';

-- Quiz Perfil Nutricional
UPDATE templates_nutrition
SET slug = 'quiz-perfil-nutricional'
WHERE (LOWER(name) LIKE '%perfil nutricional%' OR LOWER(name) LIKE '%nutritional profile%')
  AND type = 'quiz';

-- Quiz Perfil de Bem-Estar / Wellness Profile
UPDATE templates_nutrition
SET slug = 'quiz-wellness-profile'
WHERE (LOWER(name) LIKE '%perfil de bem-estar%' OR LOWER(name) LIKE '%wellness profile%' OR LOWER(name) LIKE '%descubra seu perfil%')
  AND type = 'quiz';

-- Quiz Detox (genérico - só se não foi mapeado por padrão mais específico)
UPDATE templates_nutrition
SET slug = 'quiz-detox'
WHERE (LOWER(name) LIKE '%detox%' AND LOWER(name) NOT LIKE '%cardápio%' AND LOWER(name) NOT LIKE '%cardapio%' AND LOWER(name) NOT LIKE '%corpo está pedindo%' AND LOWER(name) NOT LIKE '%corpo esta pedindo%')
  AND type = 'quiz'
  AND slug IS NULL;

-- Quiz Energético (só se não foi mapeado por padrão mais específico)
UPDATE templates_nutrition
SET slug = 'quiz-energetico'
WHERE (LOWER(name) LIKE '%energético%' OR LOWER(name) LIKE '%energetico%') AND LOWER(name) NOT LIKE '%sono%'
  AND type = 'quiz'
  AND slug IS NULL;

-- Quiz Bem-Estar (só se não foi mapeado por padrão mais específico)
UPDATE templates_nutrition
SET slug = 'quiz-bem-estar'
WHERE (LOWER(name) LIKE '%bem-estar%' AND LOWER(name) NOT LIKE '%perfil%' AND LOWER(name) NOT LIKE '%tabela%')
  AND type = 'quiz'
  AND slug IS NULL;

-- Avaliação Nutricional (Quiz Perfil Nutricional)
UPDATE templates_nutrition
SET slug = 'quiz-perfil-nutricional'
WHERE (LOWER(name) LIKE '%avaliação nutricional%' OR LOWER(name) LIKE '%avaliacao nutricional%' OR LOWER(name) LIKE '%nutrition assessment%')
  AND type = 'quiz';

-- Avaliação Inicial
UPDATE templates_nutrition
SET slug = 'template-avaliacao-inicial'
WHERE (LOWER(name) LIKE '%avaliação inicial%' OR LOWER(name) LIKE '%avaliacao inicial%' OR LOWER(name) LIKE '%initial assessment%')
  AND type = 'quiz';

-- Story Interativo
UPDATE templates_nutrition
SET slug = 'template-story-interativo'
WHERE (LOWER(name) LIKE '%story interativo%' OR LOWER(name) LIKE '%interactive story%')
  AND type = 'quiz';

-- Formulário de Recomendações
UPDATE templates_nutrition
SET slug = 'formulario-recomendacao'
WHERE ((LOWER(name) LIKE '%formulário%' OR LOWER(name) LIKE '%formulario%') AND LOWER(name) LIKE '%recomenda%')
  AND type = 'quiz';

-- Simulador de Resultados
UPDATE templates_nutrition
SET slug = 'simulador-resultados'
WHERE LOWER(name) LIKE '%simulador%'
  AND type = 'quiz';

-- Diagnóstico de Parasitose
UPDATE templates_nutrition
SET slug = 'quiz-parasitas'
WHERE (LOWER(name) LIKE '%parasitose%' OR LOWER(name) LIKE '%parasitas%')
  AND type = 'quiz';

-- Diagnóstico de Eletrólitos
UPDATE templates_nutrition
SET slug = 'diagnostico-eletrolitos'
WHERE (LOWER(name) LIKE '%eletrólito%' OR LOWER(name) LIKE '%eletrolito%' OR LOWER(name) LIKE '%electrolyte%')
  AND type = 'quiz';

-- Avaliação do Perfil Metabólico
UPDATE templates_nutrition
SET slug = 'avaliacao-perfil-metabolico'
WHERE (LOWER(name) LIKE '%perfil metabólico%' OR LOWER(name) LIKE '%perfil metabolico%' OR LOWER(name) LIKE '%metabolic profile%')
  AND type = 'quiz';

-- Diagnóstico de Sintomas Intestinais
UPDATE templates_nutrition
SET slug = 'diagnostico-sintomas-intestinais'
WHERE (LOWER(name) LIKE '%sintomas intestinais%' OR LOWER(name) LIKE '%intestinal symptoms%')
  AND type = 'quiz';

-- Teste de Retenção de Líquidos
UPDATE templates_nutrition
SET slug = 'retencao-liquidos'
WHERE (LOWER(name) LIKE '%retenção%' OR LOWER(name) LIKE '%retencao%' OR LOWER(name) LIKE '%retention%')
  AND type = 'quiz';

-- Diagnóstico do Tipo de Metabolismo
UPDATE templates_nutrition
SET slug = 'diagnostico-tipo-metabolismo'
WHERE (LOWER(name) LIKE '%tipo de metabolismo%' OR LOWER(name) LIKE '%metabolism type%')
  AND type = 'quiz';

-- Você é mais disciplinado ou emocional com a comida?
UPDATE templates_nutrition
SET slug = 'quiz-disciplina-emocional'
WHERE (LOWER(name) LIKE '%disciplinado%' OR LOWER(name) LIKE '%emocional%') AND LOWER(name) LIKE '%comida%'
  AND type = 'quiz';

-- Você está nutrido ou apenas alimentado?
UPDATE templates_nutrition
SET slug = 'nutrido-vs-alimentado'
WHERE (LOWER(name) LIKE '%nutrido%' OR LOWER(name) LIKE '%alimentado%')
  AND type = 'quiz';

-- Qual é seu perfil de intestino?
UPDATE templates_nutrition
SET slug = 'quiz-perfil-intestino'
WHERE LOWER(name) LIKE '%perfil de intestino%'
  AND type = 'quiz';

-- Avaliação de Intolerâncias/Sensibilidades
UPDATE templates_nutrition
SET slug = 'avaliacao-intolerancia'
WHERE (LOWER(name) LIKE '%intolerância%' OR LOWER(name) LIKE '%intolerancia%' OR LOWER(name) LIKE '%sensibilidade%')
  AND type = 'quiz';

-- Risco de Síndrome Metabólica
UPDATE templates_nutrition
SET slug = 'sindrome-metabolica'
WHERE (LOWER(name) LIKE '%síndrome metabólica%' OR LOWER(name) LIKE '%sindrome metabolica%' OR LOWER(name) LIKE '%metabolic syndrome%')
  AND type = 'quiz';

-- Qual é o seu Tipo de Fome?
UPDATE templates_nutrition
SET slug = 'tipo-fome'
WHERE (LOWER(name) LIKE '%tipo de fome%' OR LOWER(name) LIKE '%hunger type%')
  AND type = 'quiz';

-- Seu corpo está pedindo Detox?
UPDATE templates_nutrition
SET slug = 'quiz-detox-corpo'
WHERE LOWER(name) LIKE '%corpo está pedindo detox%' OR LOWER(name) LIKE '%corpo esta pedindo detox%'
  AND type = 'quiz';

-- Você está se alimentando conforme sua rotina?
UPDATE templates_nutrition
SET slug = 'alimentacao-rotina'
WHERE (LOWER(name) LIKE '%alimentando conforme%' OR LOWER(name) LIKE '%rotina%')
  AND type = 'quiz';

-- Pronto para Emagrecer com Saúde?
UPDATE templates_nutrition
SET slug = 'pronto-emagrecer'
WHERE (LOWER(name) LIKE '%pronto para emagrecer%' OR LOWER(name) LIKE '%ready to lose%')
  AND type = 'quiz';

-- Você conhece o seu corpo?
UPDATE templates_nutrition
SET slug = 'conhece-seu-corpo'
WHERE (LOWER(name) LIKE '%conhece o seu corpo%' OR LOWER(name) LIKE '%know your body%')
  AND type = 'quiz';

-- 4. Corrigir slugs malformados (que começam ou terminam com hífen)
UPDATE templates_nutrition
SET slug = TRIM(BOTH '-' FROM slug)
WHERE slug LIKE '-%' OR slug LIKE '%-';

-- 5. Para templates que ainda não têm slug, gerar slug do nome
-- CORRIGIDO: Remove hífens do início e fim, normaliza acentos, remove caracteres especiais
UPDATE templates_nutrition
SET slug = TRIM(
  BOTH '-' FROM
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              LOWER(name),
              '[àáâãäå]', 'a', 'gi'
            ),
            '[èéêë]', 'e', 'gi'
          ),
          '[ìíîï]', 'i', 'gi'
        ),
        '[òóôõö]', 'o', 'gi'
      ),
      '[ùúûü]', 'u', 'gi'
    ),
    '[^a-z0-9]+', '-', 'g'
  )
)
WHERE slug IS NULL OR slug = '' OR slug LIKE '-%' OR slug LIKE '%-';

-- 6. Lidar com duplicatas: manter apenas o template mais recente de cada slug
-- Para templates com mesmo slug, manter apenas o que tem maior id (mais recente)
DELETE FROM templates_nutrition t1
WHERE EXISTS (
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.slug = t1.slug
    AND t2.id > t1.id
    AND t2.slug IS NOT NULL
);

-- 7. Criar índice único APÓS remover duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_templates_nutrition_slug ON templates_nutrition(slug);

-- 8. Verificar resultado
SELECT 
  name,
  type,
  slug,
  profession,
  language
FROM templates_nutrition
WHERE profession = 'wellness' OR profession IS NULL
ORDER BY type, name;

-- 9. Verificar se ainda há duplicatas (não deveria ter)
SELECT 
  slug,
  COUNT(*) as total,
  STRING_AGG(name, ', ') as nomes
FROM templates_nutrition
WHERE slug IS NOT NULL
GROUP BY slug
HAVING COUNT(*) > 1;

