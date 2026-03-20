-- =====================================================
-- CORRIGIR PERGUNTAS DISSERTATIVAS: Link mpx4xxnk
-- Problema: Link tem perguntas dissertativas quando deveria ser múltipla escolha
-- IMPORTANTE: Perguntas dissertativas NÃO podem existir - sempre devem ter opções
-- =====================================================
-- Este script:
-- 1. Busca o link pelo slug mpx4xxnk
-- 2. Verifica as perguntas no config_json
-- 3. Converte TODAS as perguntas dissertativas em múltipla escolha (OBRIGATÓRIO)
-- 4. Garante que todas as perguntas tenham opções definidas
-- 5. Atualiza o link com as perguntas corrigidas
-- =====================================================

DO $$
DECLARE
  v_link_id UUID;
  v_slug TEXT := 'mpx4xxnk';
  v_config_json JSONB;
  v_form_config JSONB;
  v_fields JSONB;
  v_field JSONB;
  v_updated_fields JSONB := '[]'::JSONB;
  v_field_updated BOOLEAN := false;
  v_index INTEGER;
BEGIN
  -- 1. Buscar o link
  SELECT id, config_json INTO v_link_id, v_config_json
  FROM ylada_links
  WHERE slug = v_slug
  LIMIT 1;

  IF v_link_id IS NULL THEN
    RAISE EXCEPTION 'Link não encontrado com slug: %', v_slug;
  END IF;

  RAISE NOTICE '✅ Link encontrado: % (ID: %)', v_slug, v_link_id;

  -- 2. Extrair configuração do formulário
  v_config_json := COALESCE(v_config_json, '{}'::JSONB);
  v_form_config := COALESCE(v_config_json->'form', '{}'::JSONB);
  v_fields := COALESCE(v_form_config->'fields', '[]'::JSONB);

  IF jsonb_array_length(v_fields) = 0 THEN
    RAISE NOTICE '⚠️ Nenhum campo encontrado no formulário.';
    RETURN;
  END IF;

  RAISE NOTICE '📋 Encontrados % campo(s) no formulário.', jsonb_array_length(v_fields);

  -- 3. Processar cada campo
  FOR v_index IN 0..jsonb_array_length(v_fields) - 1 LOOP
    v_field := v_fields->v_index;
    v_field_updated := false;

    -- Verificar se é campo de texto (dissertativa)
    IF (v_field->>'type') IS NULL OR (v_field->>'type') = 'text' OR (v_field->>'type') = 'textarea' THEN
      -- Determinar opções baseadas no label da pergunta (contexto de alimentação/nutrição)
      DECLARE
        v_label TEXT := LOWER(COALESCE(v_field->>'label', ''));
        v_opcoes JSONB;
      BEGIN
        -- Opções específicas para contexto de alimentação/nutrição
        IF v_label LIKE '%frequência%' OR v_label LIKE '%quantas vezes%' OR v_label LIKE '%com que frequência%' THEN
          v_opcoes := '["Todos os dias", "3-4 vezes por semana", "1-2 vezes por semana", "Raramente", "Nunca"]'::JSONB;
        ELSIF v_label LIKE '%intensidade%' OR v_label LIKE '%quanto%' OR v_label LIKE '%nível%' OR v_label LIKE '%grau%' THEN
          v_opcoes := '["Muito", "Moderado", "Pouco", "Nada"]'::JSONB;
        ELSIF v_label LIKE '%sim%' OR v_label LIKE '%não%' OR v_label LIKE '%você%' OR v_label LIKE '%sente%' THEN
          v_opcoes := '["Sim, sempre", "Sim, às vezes", "Não, raramente", "Não, nunca"]'::JSONB;
        ELSIF v_label LIKE '%tipo%' OR v_label LIKE '%qual%' THEN
          v_opcoes := '["Opção 1", "Opção 2", "Opção 3", "Outro"]'::JSONB;
        ELSE
          -- Opções genéricas para alimentação
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
        RAISE NOTICE '  ✅ Campo "%" convertido de texto para múltipla escolha (opções: %)', v_field->>'label', v_opcoes;
      END;
    ELSIF (v_field->>'type') = 'select' AND (v_field->'options' IS NULL OR jsonb_array_length(COALESCE(v_field->'options', '[]'::JSONB)) = 0) THEN
      -- Campo select sem opções - adicionar opções padrão
      v_field := jsonb_set(
        v_field,
        '{options}',
        '["Sim", "Não", "Às vezes", "Não sei"]'::JSONB
      );
      v_field_updated := true;
      RAISE NOTICE '  ✅ Campo "%" recebeu opções padrão', v_field->>'label';
    END IF;

    -- Adicionar ao array atualizado
    v_updated_fields := v_updated_fields || jsonb_build_array(v_field);
  END LOOP;

  -- 4. Atualizar config_json
  v_form_config := jsonb_set(v_form_config, '{fields}', v_updated_fields);
  v_config_json := jsonb_set(v_config_json, '{form}', v_form_config);

  -- 5. Salvar no banco
  UPDATE ylada_links
  SET
    config_json = v_config_json,
    updated_at = NOW()
  WHERE id = v_link_id;

  RAISE NOTICE '';
  RAISE NOTICE '✅ Link atualizado com sucesso!';
  RAISE NOTICE '   Todas as perguntas dissertativas foram convertidas para múltipla escolha.';
  RAISE NOTICE '   Opções padrão: ["Sim", "Não", "Às vezes", "Não sei"]';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ IMPORTANTE:';
  RAISE NOTICE '   Você pode precisar ajustar as opções manualmente no editor de links';
  RAISE NOTICE '   para que façam sentido com cada pergunta específica.';

END $$;

-- =====================================================
-- VERIFICAÇÃO: Mostrar configuração atual do link
-- =====================================================
SELECT 
  'Configuração do Link' as tipo,
  yl.slug,
  yl.title,
  yl.config_json->'form'->'fields' as campos_atualizados,
  yl.updated_at
FROM ylada_links yl
WHERE yl.slug = 'mpx4xxnk';
