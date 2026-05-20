-- =====================================================
-- VERIFICAR TODAS AS COLUNAS EM user_templates
-- Script para verificar se todas as colunas necessárias existem
-- =====================================================

-- Listar todas as colunas atuais da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_name = 'user_templates'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar se colunas específicas existem
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'leader_data_collection'
    ) THEN '✅ leader_data_collection existe'
    ELSE '❌ leader_data_collection NÃO existe'
  END AS status_leader_data_collection,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'short_code'
    ) THEN '✅ short_code existe'
    ELSE '❌ short_code NÃO existe'
  END AS status_short_code,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'emoji'
    ) THEN '✅ emoji existe'
    ELSE '❌ emoji NÃO existe'
  END AS status_emoji,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'custom_colors'
    ) THEN '✅ custom_colors existe'
    ELSE '❌ custom_colors NÃO existe'
  END AS status_custom_colors,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'cta_type'
    ) THEN '✅ cta_type existe'
    ELSE '❌ cta_type NÃO existe'
  END AS status_cta_type,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'whatsapp_number'
    ) THEN '✅ whatsapp_number existe'
    ELSE '❌ whatsapp_number NÃO existe'
  END AS status_whatsapp_number,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'external_url'
    ) THEN '✅ external_url existe'
    ELSE '❌ external_url NÃO existe'
  END AS status_external_url,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'cta_button_text'
    ) THEN '✅ cta_button_text existe'
    ELSE '❌ cta_button_text NÃO existe'
  END AS status_cta_button_text,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'template_slug'
    ) THEN '✅ template_slug existe'
    ELSE '❌ template_slug NÃO existe'
  END AS status_template_slug,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'profession'
    ) THEN '✅ profession existe'
    ELSE '❌ profession NÃO existe'
  END AS status_profession,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_templates' 
      AND column_name = 'custom_whatsapp_message'
    ) THEN '✅ custom_whatsapp_message existe'
    ELSE '❌ custom_whatsapp_message NÃO existe'
  END AS status_custom_whatsapp_message;

