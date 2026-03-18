-- ============================================
-- Corrigir nome do presidente: Lilian e Alexandre Lazari
-- (antes: "Lilian e Alexandre" ou exibido como "mídia EUA" em alguns lugares)
-- ============================================

-- Presidentes autorizados: padronizar nome
UPDATE presidentes_autorizados
SET nome_completo = 'Lilian e Alexandre Lazari', updated_at = NOW()
WHERE LOWER(TRIM(nome_completo)) = 'lilian e alexandre';

-- Perfis de usuário: quem tinha "mídia EUA" ou "Lilian e Alexandre" passa a ter o nome correto
UPDATE user_profiles
SET nome_presidente = 'Lilian e Alexandre Lazari'
WHERE LOWER(TRIM(nome_presidente)) IN ('mídia eua', 'midia eua', 'lilian e alexandre');
