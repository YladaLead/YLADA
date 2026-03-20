-- =====================================================
-- CORRIGIR PERGUNTAS DISSERTATIVAS: Todos os links da Diana
-- Problema: Links têm perguntas dissertativas quando deveriam ser múltipla escolha
-- IMPORTANTE: Perguntas dissertativas NÃO podem existir - sempre devem ter opções
-- =====================================================
-- Este script:
-- 1. Busca todos os links ativos da Diana (diapitt@gmail.com)
-- 2. Verifica as perguntas no config_json
-- 3. Converte perguntas dissertativas em múltipla escolha
-- 4. Atualiza os links com as perguntas corrigidas
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'diapitt@gmail.com';
  v_link_record RECORD;
  v_config_json JSONB;
  v_form_config JSONB;
  v_fields JSONB;
  v_field JSONB;
  v_updated_fields JSONB;
  v_index INTEGER;
  v_links_processados INTEGER := 0;
  v_links_atualizados INTEGER := 0;
  v_campos_convertidos INTEGER := 0;
BEGIN
  -- 1. Buscar usuário
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(v_email) LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado com email: %', v_email;
  END IF;

  RAISE NOTICE '✅ Usuário encontrado: % (ID: %)', v_email, v_user_id;
  RAISE NOTICE '';

  -- 2. Processar cada link ativo da Diana
  FOR v_link_record IN
    SELECT id, slug, title, config_json
    FROM ylada_links
    WHERE user_id = v_user_id
      AND status = 'active'
    ORDER BY created_at DESC
  LOOP
    v_links_processados := v_links_processados + 1;
    v_config_json := COALESCE(v_link_record.config_json, '{}'::JSONB);
    v_form_config := COALESCE(v_config_json->'form', '{}'::JSONB);
    v_fields := COALESCE(v_form_config->'fields', '[]'::JSONB);
    v_updated_fields := '[]'::JSONB;
    v_campos_convertidos := 0;

    IF jsonb_array_length(v_fields) = 0 THEN
      RAISE NOTICE '⚠️ Link "%" (%): Nenhum campo encontrado. Pulando...', v_link_record.slug, v_link_record.title;
      CONTINUE;
    END IF;

    RAISE NOTICE '📋 Processando link: "%" (% - % campos)', v_link_record.slug, v_link_record.title, jsonb_array_length(v_fields);

    -- 3. Processar cada campo
    FOR v_index IN 0..jsonb_array_length(v_fields) - 1 LOOP
      v_field := v_fields->v_index;
      DECLARE
        v_label TEXT := LOWER(COALESCE(v_field->>'label', ''));
        v_opcoes JSONB;
        v_field_updated BOOLEAN := false;
      BEGIN
        -- Verificar se é campo de texto (dissertativa)
        IF (v_field->>'type') IS NULL OR (v_field->>'type') = 'text' OR (v_field->>'type') = 'textarea' THEN
          -- Determinar opções baseadas no label da pergunta
          IF v_label LIKE '%frequência%' OR v_label LIKE '%quantas vezes%' OR v_label LIKE '%com que frequência%' THEN
            v_opcoes := '["Todos os dias", "3-4 vezes por semana", "1-2 vezes por semana", "Raramente", "Nunca"]'::JSONB;
          ELSIF v_label LIKE '%intensidade%' OR v_label LIKE '%quanto%' OR v_label LIKE '%nível%' OR v_label LIKE '%grau%' THEN
            v_opcoes := '["Muito", "Moderado", "Pouco", "Nada"]'::JSONB;
          ELSIF v_label LIKE '%sim%' OR v_label LIKE '%não%' OR v_label LIKE '%você%' OR v_label LIKE '%sente%' THEN
            v_opcoes := '["Sim, sempre", "Sim, às vezes", "Não, raramente", "Não, nunca"]'::JSONB;
          ELSIF v_label LIKE '%tipo%' OR v_label LIKE '%qual%' THEN
            v_opcoes := '["Opção 1", "Opção 2", "Opção 3", "Outro"]'::JSONB;
          ELSE
            -- Opções genéricas
            v_opcoes := '["Sim", "Não", "Às vezes", "Não tenho certeza"]'::JSONB;
          END IF;

          -- Converter para múltipla escolha
          v_field := jsonb_set(
            jsonb_set(
              v_field,
              '{type}',
              '"select"'::JSONB
            ),
            '{options}',
            v_opcoes
          );
          v_field_updated := true;
          v_campos_convertidos := v_campos_convertidos + 1;
          RAISE NOTICE '  ✅ Campo "%" convertido para múltipla escolha', v_field->>'label';
        ELSIF (v_field->>'type') = 'select' AND (v_field->'options' IS NULL OR jsonb_array_length(COALESCE(v_field->'options', '[]'::JSONB)) = 0) THEN
          -- Campo select sem opções - adicionar opções padrão
          v_field := jsonb_set(
            v_field,
            '{options}',
            '["Sim", "Não", "Às vezes", "Não sei"]'::JSONB
          );
          v_field_updated := true;
          v_campos_convertidos := v_campos_convertidos + 1;
          RAISE NOTICE '  ✅ Campo "%" recebeu opções padrão', v_field->>'label';
        END IF;

        -- Adicionar ao array atualizado
        v_updated_fields := v_updated_fields || jsonb_build_array(v_field);
      END;
    END LOOP;

    -- 4. Atualizar config_json se houver mudanças
    IF v_campos_convertidos > 0 THEN
      v_form_config := jsonb_set(v_form_config, '{fields}', v_updated_fields);
      v_config_json := jsonb_set(v_config_json, '{form}', v_form_config);

      UPDATE ylada_links
      SET
        config_json = v_config_json,
        updated_at = NOW()
      WHERE id = v_link_record.id;

      v_links_atualizados := v_links_atualizados + 1;
      RAISE NOTICE '  ✅ Link "%" atualizado (% campo(s) convertido(s))', v_link_record.slug, v_campos_convertidos;
    ELSE
      RAISE NOTICE '  ℹ️ Link "%": Nenhuma alteração necessária', v_link_record.slug;
    END IF;

    RAISE NOTICE '';
  END LOOP;

  -- 5. Resumo final
  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 RESUMO:';
  RAISE NOTICE '   Links processados: %', v_links_processados;
  RAISE NOTICE '   Links atualizados: %', v_links_atualizados;
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ IMPORTANTE:';
  RAISE NOTICE '   Revise os links atualizados e ajuste as opções manualmente';
  RAISE NOTICE '   para que façam sentido com cada pergunta específica.';
  RAISE NOTICE '========================================';

END $$;

-- =====================================================
-- VERIFICAÇÃO: Listar todos os links da Diana
-- =====================================================
SELECT 
  'Links da Diana' as tipo,
  yl.slug,
  yl.title,
  jsonb_array_length(COALESCE(yl.config_json->'form'->'fields', '[]'::JSONB)) as total_campos,
  (
    SELECT COUNT(*)
    FROM jsonb_array_elements(COALESCE(yl.config_json->'form'->'fields', '[]'::JSONB)) as campo
    WHERE (campo->>'type') IS NULL 
       OR (campo->>'type') = 'text' 
       OR (campo->>'type') = 'textarea'
  ) as campos_dissertativos,
  yl.status,
  yl.updated_at
FROM ylada_links yl
JOIN auth.users au ON au.id = yl.user_id
WHERE LOWER(au.email) = LOWER('diapitt@gmail.com')
ORDER BY yl.created_at DESC;
