-- Script de Validação: Verificar se a Trilha de Aprendizado está completa
-- Execute este script após popular todos os módulos (1 a 8)

DO $$
DECLARE
    v_trilha_id UUID;
    v_total_modulos INTEGER;
    v_total_aulas INTEGER;
    v_total_scripts INTEGER;
    v_total_checklists INTEGER;
BEGIN
    -- Buscar ID da trilha
    SELECT id INTO v_trilha_id
    FROM wellness_trilhas
    WHERE slug = 'distribuidor-iniciante'
    LIMIT 1;

    IF v_trilha_id IS NULL THEN
        RAISE EXCEPTION '❌ ERRO: Trilha "distribuidor-iniciante" não encontrada!';
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════════';
    RAISE NOTICE '📊 VALIDAÇÃO DA TRILHA DE APRENDIZADO WELLNESS';
    RAISE NOTICE '═══════════════════════════════════════════════════════════════';
    RAISE NOTICE '';

    -- Contar módulos
    SELECT COUNT(*) INTO v_total_modulos
    FROM wellness_modulos
    WHERE trilha_id = v_trilha_id AND is_ativo = true;

    -- Contar aulas
    SELECT COUNT(*) INTO v_total_aulas
    FROM wellness_aulas a
    INNER JOIN wellness_modulos m ON m.id = a.modulo_id
    WHERE m.trilha_id = v_trilha_id AND a.is_ativo = true;

    -- Contar scripts
    SELECT COUNT(*) INTO v_total_scripts
    FROM wellness_scripts s
    INNER JOIN wellness_modulos m ON m.id = s.modulo_id
    WHERE m.trilha_id = v_trilha_id AND s.is_ativo = true;

    -- Contar checklists
    SELECT COUNT(*) INTO v_total_checklists
    FROM wellness_checklists c
    INNER JOIN wellness_modulos m ON m.id = c.modulo_id
    WHERE m.trilha_id = v_trilha_id AND c.is_ativo = true;

    RAISE NOTICE '✅ Trilha encontrada: Distribuidor Iniciante';
    RAISE NOTICE '';
    RAISE NOTICE '📦 ESTATÍSTICAS GERAIS:';
    RAISE NOTICE '   • Total de Módulos: %', v_total_modulos;
    RAISE NOTICE '   • Total de Aulas: %', v_total_aulas;
    RAISE NOTICE '   • Total de Scripts: %', v_total_scripts;
    RAISE NOTICE '   • Total de Checklists: %', v_total_checklists;
    RAISE NOTICE '';

END $$;

-- ============================================================================
-- DETALHAMENTO POR MÓDULO
-- ============================================================================

SELECT 
    m.ordem as "Ordem",
    m.nome as "Módulo",
    m.icone as "Ícone",
    COUNT(DISTINCT a.id) as "Aulas",
    COUNT(DISTINCT s.id) as "Scripts",
    COUNT(DISTINCT c.id) as "Checklists",
    CASE 
        WHEN m.ordem = 1 AND COUNT(DISTINCT a.id) = 5 THEN '✅ OK'
        WHEN m.ordem = 2 AND COUNT(DISTINCT a.id) = 5 THEN '✅ OK'
        WHEN m.ordem = 3 AND COUNT(DISTINCT a.id) = 5 THEN '✅ OK'
        WHEN m.ordem = 4 AND COUNT(DISTINCT a.id) = 5 THEN '✅ OK'
        WHEN m.ordem = 5 AND COUNT(DISTINCT a.id) = 6 THEN '✅ OK'
        WHEN m.ordem = 6 AND COUNT(DISTINCT a.id) = 6 THEN '✅ OK'
        WHEN m.ordem = 7 AND COUNT(DISTINCT a.id) = 5 THEN '✅ OK'
        WHEN m.ordem = 8 AND COUNT(DISTINCT a.id) = 6 THEN '✅ OK'
        ELSE '⚠️ Verificar'
    END as "Status"
FROM wellness_modulos m
LEFT JOIN wellness_aulas a ON a.modulo_id = m.id AND a.is_ativo = true
LEFT JOIN wellness_scripts s ON s.modulo_id = m.id AND s.is_ativo = true
LEFT JOIN wellness_checklists c ON c.modulo_id = m.id AND c.is_ativo = true
WHERE m.trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
  AND m.is_ativo = true
GROUP BY m.id, m.ordem, m.nome, m.icone
ORDER BY m.ordem;

-- ============================================================================
-- VERIFICAÇÃO DE MÓDULOS ESPERADOS
-- ============================================================================

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM wellness_modulos 
            WHERE trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
            AND ordem = 1
        ) THEN '✅ Módulo 1 - Fundamentos'
        ELSE '❌ Módulo 1 - Fundamentos FALTANDO'
    END as "Módulo 1",
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM wellness_modulos 
            WHERE trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
            AND ordem = 2
        ) THEN '✅ Módulo 2 - Configuração'
        ELSE '❌ Módulo 2 - Configuração FALTANDO'
    END as "Módulo 2",
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM wellness_modulos 
            WHERE trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
            AND ordem = 3
        ) THEN '✅ Módulo 3 - Ferramentas'
        ELSE '❌ Módulo 3 - Ferramentas FALTANDO'
    END as "Módulo 3",
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM wellness_modulos 
            WHERE trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
            AND ordem = 4
        ) THEN '✅ Módulo 4 - Diagnóstico WOW'
        ELSE '❌ Módulo 4 - Diagnóstico WOW FALTANDO'
    END as "Módulo 4",
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM wellness_modulos 
            WHERE trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
            AND ordem = 5
        ) THEN '✅ Módulo 5 - Ofertas'
        ELSE '❌ Módulo 5 - Ofertas FALTANDO'
    END as "Módulo 5",
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM wellness_modulos 
            WHERE trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
            AND ordem = 6
        ) THEN '✅ Módulo 6 - Gerar Clientes'
        ELSE '❌ Módulo 6 - Gerar Clientes FALTANDO'
    END as "Módulo 6",
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM wellness_modulos 
            WHERE trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
            AND ordem = 7
        ) THEN '✅ Módulo 7 - Atendimento'
        ELSE '❌ Módulo 7 - Atendimento FALTANDO'
    END as "Módulo 7",
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM wellness_modulos 
            WHERE trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
            AND ordem = 8
        ) THEN '✅ Módulo 8 - Escala'
        ELSE '❌ Módulo 8 - Escala FALTANDO'
    END as "Módulo 8";

-- ============================================================================
-- DETALHAMENTO DE AULAS POR MÓDULO
-- ============================================================================

SELECT 
    m.ordem as "Módulo",
    m.nome as "Nome do Módulo",
    a.ordem as "Aula",
    a.titulo as "Título da Aula",
    a.duracao_minutos as "Duração (min)",
    CASE WHEN a.is_ativo THEN '✅ Ativa' ELSE '❌ Inativa' END as "Status"
FROM wellness_modulos m
INNER JOIN wellness_aulas a ON a.modulo_id = m.id
WHERE m.trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
  AND m.is_ativo = true
ORDER BY m.ordem, a.ordem;

-- ============================================================================
-- RESUMO FINAL
-- ============================================================================

SELECT 
    '📊 RESUMO FINAL' as "Resumo",
    COUNT(DISTINCT m.id) as "Total Módulos",
    COUNT(DISTINCT a.id) as "Total Aulas",
    COUNT(DISTINCT s.id) as "Total Scripts",
    COUNT(DISTINCT c.id) as "Total Checklists",
    SUM(a.duracao_minutos) as "Duração Total (min)",
    ROUND(SUM(a.duracao_minutos) / 60.0, 1) as "Duração Total (horas)"
FROM wellness_modulos m
LEFT JOIN wellness_aulas a ON a.modulo_id = m.id AND a.is_ativo = true
LEFT JOIN wellness_scripts s ON s.modulo_id = m.id AND s.is_ativo = true
LEFT JOIN wellness_checklists c ON c.modulo_id = m.id AND c.is_ativo = true
WHERE m.trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
  AND m.is_ativo = true;

-- ============================================================================
-- VALORES ESPERADOS (para comparação)
-- ============================================================================

SELECT 
    '📋 VALORES ESPERADOS' as "Referência",
    8 as "Módulos Esperados",
    43 as "Aulas Esperadas",
    55 as "Scripts Esperados",
    46 as "Checklists Esperadas",
    431 as "Duração Esperada (min)",
    7.2 as "Duração Esperada (horas)";

