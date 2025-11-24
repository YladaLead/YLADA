-- ===========================================================
-- DESATIVAR TEMPLATES EXTRAS NUTRI
-- 
-- IMPORTANTE: Execute o script de verificação primeiro!
-- Este script desativa templates Nutri que NÃO fazem parte
-- dos 29 templates oficiais.
-- ===========================================================

BEGIN;

-- Desativar templates Nutri que não estão na lista oficial
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'nutri'
  AND language = 'pt'
  AND slug NOT IN (
    -- 29 templates oficiais Nutri
    'quiz-tipo-fome',
    'quiz-alimentacao-nutri',
    'template-diagnostico-parasitose',
    'disciplinado-emocional-nutri',
    'alimentacao-rotina-nutri',
    'desafio-21-dias-nutri',
    'quiz-bem-estar-nutri',
    'quiz-detox-nutri',
    'quiz-energetico-nutri',
    'quiz-interativo-nutri',
    'avaliacao-inicial-nutri',
    'pronto-emagrecer-nutri',
    'avaliacao-intolerancia-nutri',
    'avaliacao-perfil-metabolico-nutri',
    'diagnostico-eletrolitos-nutri',
    'diagnostico-sintomas-intestinais-nutri',
    'sindrome-metabolica-nutri',
    'retencao-liquidos-nutri',
    'conhece-seu-corpo-nutri',
    'nutrido-vs-alimentado-nutri',
    'perfil-intestino',
    'quiz-pedindo-detox',
    'calculadora-agua',
    'calculadora-calorias',
    'calculadora-imc',
    'calculadora-proteina',
    'avaliacao-sono-energia',
    'descoberta-perfil-bem-estar',
    'quiz-perfil-nutricional'
  )
  AND is_active = true;

-- Verificar quantos foram desativados
SELECT 
  COUNT(*) as templates_desativados
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = false
  AND slug NOT IN (
    'quiz-tipo-fome',
    'quiz-alimentacao-nutri',
    'template-diagnostico-parasitose',
    'disciplinado-emocional-nutri',
    'alimentacao-rotina-nutri',
    'desafio-21-dias-nutri',
    'quiz-bem-estar-nutri',
    'quiz-detox-nutri',
    'quiz-energetico-nutri',
    'quiz-interativo-nutri',
    'avaliacao-inicial-nutri',
    'pronto-emagrecer-nutri',
    'avaliacao-intolerancia-nutri',
    'avaliacao-perfil-metabolico-nutri',
    'diagnostico-eletrolitos-nutri',
    'diagnostico-sintomas-intestinais-nutri',
    'sindrome-metabolica-nutri',
    'retencao-liquidos-nutri',
    'conhece-seu-corpo-nutri',
    'nutrido-vs-alimentado-nutri',
    'perfil-intestino',
    'quiz-pedindo-detox',
    'calculadora-agua',
    'calculadora-calorias',
    'calculadora-imc',
    'calculadora-proteina',
    'avaliacao-sono-energia',
    'descoberta-perfil-bem-estar',
    'quiz-perfil-nutricional'
  );

-- Verificar quantos oficiais estão ativos
SELECT 
  COUNT(*) as templates_oficiais_ativos
FROM templates_nutrition
WHERE profession = 'nutri'
  AND language = 'pt'
  AND is_active = true
  AND slug IN (
    'quiz-tipo-fome',
    'quiz-alimentacao-nutri',
    'template-diagnostico-parasitose',
    'disciplinado-emocional-nutri',
    'alimentacao-rotina-nutri',
    'desafio-21-dias-nutri',
    'quiz-bem-estar-nutri',
    'quiz-detox-nutri',
    'quiz-energetico-nutri',
    'quiz-interativo-nutri',
    'avaliacao-inicial-nutri',
    'pronto-emagrecer-nutri',
    'avaliacao-intolerancia-nutri',
    'avaliacao-perfil-metabolico-nutri',
    'diagnostico-eletrolitos-nutri',
    'diagnostico-sintomas-intestinais-nutri',
    'sindrome-metabolica-nutri',
    'retencao-liquidos-nutri',
    'conhece-seu-corpo-nutri',
    'nutrido-vs-alimentado-nutri',
    'perfil-intestino',
    'quiz-pedindo-detox',
    'calculadora-agua',
    'calculadora-calorias',
    'calculadora-imc',
    'calculadora-proteina',
    'avaliacao-sono-energia',
    'descoberta-perfil-bem-estar',
    'quiz-perfil-nutricional'
  );

COMMIT;

-- ===========================================================
-- INSTRUÇÕES:
-- 1. Execute primeiro: scripts/verificar-templates-extras-por-area.sql
-- 2. Revise a lista de templates extras
-- 3. Se estiver correto, execute este script para desativar
-- ===========================================================

