-- =====================================================
-- CORRIGIR EMOJI DA CALCULADORA DE ÁGUA
-- Atualiza o emoji de 🧮 (ábaco) para 💧 (água) para todas as ferramentas
-- com slug 'agua' e template_slug 'calc-hidratacao'
-- =====================================================

-- 1. Primeiro, vamos verificar quais ferramentas precisam ser atualizadas
SELECT 
  ut.id,
  ut.title,
  ut.slug,
  ut.template_slug,
  ut.emoji as emoji_atual,
  up.user_slug,
  up.nome_completo
FROM user_templates ut
LEFT JOIN user_profiles up ON ut.user_id = up.user_id
WHERE ut.slug = 'agua'
  AND ut.template_slug = 'calc-hidratacao'
  AND (ut.emoji IS NULL OR ut.emoji != '💧')
ORDER BY ut.created_at DESC;

-- 2. Atualizar o emoji para 💧 (água) para todas as ferramentas encontradas
-- Esta query atualiza TODAS as ferramentas com slug 'agua' e template_slug 'calc-hidratacao'
UPDATE user_templates
SET emoji = '💧'
WHERE slug = 'agua'
  AND template_slug = 'calc-hidratacao'
  AND (emoji IS NULL OR emoji != '💧');

-- 3. Verificar o resultado da atualização
SELECT 
  ut.id,
  ut.title,
  ut.slug,
  ut.template_slug,
  ut.emoji as emoji_atualizado,
  up.user_slug,
  up.nome_completo
FROM user_templates ut
LEFT JOIN user_profiles up ON ut.user_id = up.user_id
WHERE ut.slug = 'agua'
  AND ut.template_slug = 'calc-hidratacao'
ORDER BY ut.created_at DESC;

-- =====================================================
-- ALTERNATIVA: Se quiser atualizar apenas para um usuário específico
-- Descomente e substitua 'SEU_USER_SLUG_AQUI' pelo user_slug correto
-- =====================================================
/*
UPDATE user_templates
SET emoji = '💧'
WHERE slug = 'agua'
  AND template_slug = 'calc-hidratacao'
  AND user_id IN (
    SELECT user_id FROM user_profiles WHERE user_slug = 'SEU_USER_SLUG_AQUI'
  );
*/





