-- =====================================================
-- Script: Remover Guia de Hidratação e Checklists (Alimentar/Detox)
-- Objetivo: Excluir definitivamente esses templates do catálogo
-- Uso: execute no banco principal (Supabase) antes do próximo deploy
-- =====================================================

BEGIN;

WITH target_templates AS (
  SELECT id
  FROM templates_nutrition
  WHERE slug IN ('guia-hidratacao', 'checklist-alimentar', 'checklist-detox')
     OR name IN ('Guia de Hidratação', 'Checklist Alimentar', 'Checklist Detox')
)
DELETE FROM user_templates
WHERE template_id IN (SELECT id FROM target_templates)
RETURNING template_id;

DELETE FROM templates_nutrition
WHERE id IN (
  SELECT id
  FROM templates_nutrition
  WHERE slug IN ('guia-hidratacao', 'checklist-alimentar', 'checklist-detox')
     OR name IN ('Guia de Hidratação', 'Checklist Alimentar', 'Checklist Detox')
);

COMMIT;

