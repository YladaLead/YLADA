-- =====================================================
-- CONFIGURAR USER_SLUG PARA CONTA DEMO NUTRI
-- Migração 157: Garantir que demo.nutri@ylada.com tenha user_slug configurado
-- =====================================================

-- Verificar se user_slug já existe
DO $$
DECLARE
  v_user_id UUID;
  v_user_slug TEXT;
BEGIN
  -- Buscar user_id da conta demo
  SELECT user_id, user_slug INTO v_user_id, v_user_slug
  FROM user_profiles
  WHERE email = 'demo.nutri@ylada.com';
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE '❌ Usuário demo.nutri@ylada.com não encontrado!';
  ELSE
    RAISE NOTICE '✅ Usuário encontrado: %', v_user_id;
    
    -- Se não tem user_slug, configurar como 'demo-nutri'
    IF v_user_slug IS NULL OR v_user_slug = '' THEN
      UPDATE user_profiles
      SET 
        user_slug = 'demo-nutri',
        updated_at = NOW()
      WHERE user_id = v_user_id;
      
      RAISE NOTICE '✅ user_slug configurado: demo-nutri';
    ELSE
      RAISE NOTICE '✅ user_slug já existe: %', v_user_slug;
    END IF;
  END IF;
END $$;

-- Verificar resultado
SELECT 
  email,
  user_slug,
  nome_completo,
  updated_at
FROM user_profiles
WHERE email = 'demo.nutri@ylada.com';

