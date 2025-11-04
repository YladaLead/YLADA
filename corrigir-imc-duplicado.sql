-- ============================================
-- CORRIGIR IMC DUPLICADO
-- Ativar "Calculadora de IMC" (nome mais completo)
-- Desativar "Calculadora IMC" (nome incompleto)
-- ============================================

-- Reativar "Calculadora de IMC" (nome mais completo)
UPDATE templates_nutrition
SET is_active = true
WHERE id = '39b79fb9-a115-4a17-ab12-17fb6c83a8d1'
  AND name = 'Calculadora de IMC';

-- Desativar "Calculadora IMC" (nome incompleto)
UPDATE templates_nutrition
SET is_active = false
WHERE id = '4db486d1-a525-4ff6-833d-f09ace962518'
  AND name = 'Calculadora IMC';

