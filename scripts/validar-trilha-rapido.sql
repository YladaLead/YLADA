-- Script de Validação RÁPIDO: Verificar se a Trilha está completa
-- Versão simplificada para verificação rápida

-- ============================================================================
-- RESUMO GERAL
-- ============================================================================

SELECT 
    '📊 RESUMO GERAL' as "Tipo",
    COUNT(DISTINCT m.id) as "Módulos",
    COUNT(DISTINCT a.id) as "Aulas",
    COUNT(DISTINCT s.id) as "Scripts",
    COUNT(DISTINCT c.id) as "Checklists",
    CASE 
        WHEN COUNT(DISTINCT m.id) = 8 THEN '✅ OK'
        ELSE '❌ FALTANDO MÓDULOS'
    END as "Status"
FROM wellness_modulos m
LEFT JOIN wellness_aulas a ON a.modulo_id = m.id AND a.is_ativo = true
LEFT JOIN wellness_scripts s ON s.modulo_id = m.id AND s.is_ativo = true
LEFT JOIN wellness_checklists c ON c.modulo_id = m.id AND c.is_ativo = true
WHERE m.trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
  AND m.is_ativo = true;

-- ============================================================================
-- LISTA DE MÓDULOS COM CONTAGENS
-- ============================================================================

SELECT 
    m.ordem as "#",
    m.icone || ' ' || m.nome as "Módulo",
    COUNT(DISTINCT a.id) as "Aulas",
    COUNT(DISTINCT s.id) as "Scripts",
    COUNT(DISTINCT c.id) as "Checklists"
FROM wellness_modulos m
LEFT JOIN wellness_aulas a ON a.modulo_id = m.id AND a.is_ativo = true
LEFT JOIN wellness_scripts s ON s.modulo_id = m.id AND s.is_ativo = true
LEFT JOIN wellness_checklists c ON c.modulo_id = m.id AND c.is_ativo = true
WHERE m.trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
  AND m.is_ativo = true
GROUP BY m.id, m.ordem, m.nome, m.icone
ORDER BY m.ordem;

-- ============================================================================
-- VERIFICAÇÃO RÁPIDA: Módulos esperados vs encontrados
-- ============================================================================

SELECT 
    'Esperado' as "Tipo",
    8 as "Módulos",
    43 as "Aulas",
    55 as "Scripts",
    46 as "Checklists"
UNION ALL
SELECT 
    'Encontrado' as "Tipo",
    COUNT(DISTINCT m.id)::INTEGER as "Módulos",
    COUNT(DISTINCT a.id)::INTEGER as "Aulas",
    COUNT(DISTINCT s.id)::INTEGER as "Scripts",
    COUNT(DISTINCT c.id)::INTEGER as "Checklists"
FROM wellness_modulos m
LEFT JOIN wellness_aulas a ON a.modulo_id = m.id AND a.is_ativo = true
LEFT JOIN wellness_scripts s ON s.modulo_id = m.id AND s.is_ativo = true
LEFT JOIN wellness_checklists c ON c.modulo_id = m.id AND c.is_ativo = true
WHERE m.trilha_id = (SELECT id FROM wellness_trilhas WHERE slug = 'distribuidor-iniciante')
  AND m.is_ativo = true;

