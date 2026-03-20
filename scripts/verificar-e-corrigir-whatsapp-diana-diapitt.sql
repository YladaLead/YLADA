-- =====================================================
-- VERIFICAR E CORRIGIR WHATSAPP: Diana (diapitt@gmail.com)
-- Problema: Botão do WhatsApp não aparece no diagnóstico
-- =====================================================
-- Este script verifica:
-- 1. Se o perfil da Diana tem WhatsApp configurado já
-- 2. Se os links da Diana têm cta_whatsapp configurado
-- 3. Atualiza os links sem cta_whatsapp com o WhatsApp do perfil
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'diapitt@gmail.com';
  v_whatsapp TEXT;
  v_country_code TEXT;
  v_whatsapp_formatted TEXT;
  v_links_updated INTEGER := 0;
BEGIN
  -- 1. Buscar usuário
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(v_email) LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email %. Verifique o e-mail no Supabase Auth.', v_email;
  END IF;

  RAISE NOTICE '✅ Usuário encontrado: % (ID: %)', v_email, v_user_id;

  -- 2. Buscar WhatsApp do perfil
  SELECT 
    up.whatsapp,
    COALESCE(up.country_code, 'BR') as country_code
  INTO v_whatsapp, v_country_code
  FROM user_profiles up
  WHERE up.user_id = v_user_id
  LIMIT 1;

  -- Se não encontrar em user_profiles, tentar em ylada_noel_profile
  IF v_whatsapp IS NULL OR v_whatsapp = '' THEN
    SELECT 
      (ynp.area_specific->>'whatsapp')::TEXT as whatsapp,
      COALESCE((ynp.area_specific->>'country_code')::TEXT, 'BR') as country_code
    INTO v_whatsapp, v_country_code
    FROM ylada_noel_profile ynp
    WHERE ynp.user_id = v_user_id
    LIMIT 1;
  END IF;

  -- 3. Formatar WhatsApp (remover caracteres não numéricos e adicionar código do país se necessário)
  IF v_whatsapp IS NOT NULL AND v_whatsapp != '' THEN
    v_whatsapp_formatted := REGEXP_REPLACE(v_whatsapp, '\D', '', 'g');
    
    -- Adicionar código do país se não tiver
    IF v_country_code = 'BR' AND NOT v_whatsapp_formatted LIKE '55%' THEN
      v_whatsapp_formatted := '55' || v_whatsapp_formatted;
    ELSIF v_country_code != 'BR' THEN
      -- Para outros países, você pode precisar ajustar a lógica
      -- Por enquanto, apenas remove caracteres não numéricos
    END IF;

    RAISE NOTICE '📱 WhatsApp encontrado no perfil: % (formatado: %)', v_whatsapp, v_whatsapp_formatted;
  ELSE
    RAISE NOTICE '⚠️ WhatsApp NÃO encontrado no perfil da Diana.';
    RAISE NOTICE '   Ela precisa configurar o WhatsApp no perfil empresarial primeiro.';
    RAISE NOTICE '   Depois, execute este script novamente ou atualize os links manualmente.';
    RETURN;
  END IF;

  -- 4. Verificar links sem cta_whatsapp
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Verificando links da Diana...';

  -- Mostrar links sem cta_whatsapp
  RAISE NOTICE 'Links SEM cta_whatsapp:';
  FOR v_link IN
    SELECT id, slug, title, cta_whatsapp, created_at
    FROM ylada_links
    WHERE user_id = v_user_id
      AND (cta_whatsapp IS NULL OR cta_whatsapp = '')
      AND status = 'active'
    ORDER BY created_at DESC
  LOOP
    RAISE NOTICE '  - Slug: %, Título: %, Criado em: %', v_link.slug, v_link.title, v_link.created_at;
  END LOOP;

  -- 5. Atualizar links sem cta_whatsapp
  UPDATE ylada_links
  SET
    cta_whatsapp = v_whatsapp_formatted,
    updated_at = NOW()
  WHERE user_id = v_user_id
    AND (cta_whatsapp IS NULL OR cta_whatsapp = '')
    AND status = 'active';

  GET DIAGNOSTICS v_links_updated = ROW_COUNT;

  IF v_links_updated > 0 THEN
    RAISE NOTICE '';
    RAISE NOTICE '✅ % link(s) atualizado(s) com WhatsApp: %', v_links_updated, v_whatsapp_formatted;
    RAISE NOTICE '   Os links agora devem mostrar o botão do WhatsApp corretamente.';
  ELSE
    RAISE NOTICE '';
    RAISE NOTICE 'ℹ️ Nenhum link precisou ser atualizado (todos já têm cta_whatsapp ou não há links ativos).';
  END IF;

  -- 6. Resumo final
  RAISE NOTICE '';
  RAISE NOTICE '📊 RESUMO:';
  RAISE NOTICE '   Email: %', v_email;
  RAISE NOTICE '   WhatsApp do perfil: %', v_whatsapp_formatted;
  RAISE NOTICE '   Links atualizados: %', v_links_updated;

END $$;

-- =====================================================
-- VERIFICAÇÃO ADICIONAL: Ver todos os links da Diana
-- =====================================================
SELECT 
  'Links da Diana' as tipo,
  yl.id,
  yl.slug,
  yl.title,
  yl.cta_whatsapp,
  CASE 
    WHEN yl.cta_whatsapp IS NULL OR yl.cta_whatsapp = '' THEN '❌ SEM WhatsApp'
    ELSE '✅ COM WhatsApp'
  END as status_whatsapp,
  yl.status,
  yl.created_at
FROM ylada_links yl
JOIN auth.users au ON au.id = yl.user_id
WHERE LOWER(au.email) = LOWER('diapitt@gmail.com')
ORDER BY yl.created_at DESC;
