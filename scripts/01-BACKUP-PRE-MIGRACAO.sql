-- =====================================================
-- SCRIPT 01: BACKUP COMPLETO ANTES DA MIGRAÇÃO
-- =====================================================
-- Execute este script ANTES de qualquer mudança
-- Data: {{DATE}}
-- =====================================================

-- 1. Backup de templates_nutrition
CREATE TABLE IF NOT EXISTS templates_nutrition_backup_pre_migracao AS 
SELECT * FROM templates_nutrition;

-- 2. Backup de user_templates
CREATE TABLE IF NOT EXISTS user_templates_backup_pre_migracao AS 
SELECT * FROM user_templates;

-- 3. Verificar se backups foram criados
SELECT 
  'templates_nutrition_backup_pre_migracao' as tabela,
  COUNT(*) as total_registros
FROM templates_nutrition_backup_pre_migracao
UNION ALL
SELECT 
  'user_templates_backup_pre_migracao' as tabela,
  COUNT(*) as total_registros
FROM user_templates_backup_pre_migracao;

-- ✅ Backup concluído! Guarde a data de execução.

