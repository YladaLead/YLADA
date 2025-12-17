-- Script para verificar se as tabelas de anotações existem
-- Execute este script no Supabase SQL Editor para confirmar

-- Verificar tabela de notas dos exercícios de reflexão
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'journey_checklist_notes'
ORDER BY ordinal_position;

-- Verificar tabela de anotações diárias
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'journey_daily_notes'
ORDER BY ordinal_position;

-- Verificar se há dados de exemplo (substitua o email pelo seu usuário de teste)
SELECT 
  u.email,
  jcn.day_number,
  jcn.item_index,
  jcn.nota,
  jcn.created_at
FROM journey_checklist_notes jcn
JOIN auth.users u ON u.id = jcn.user_id
WHERE u.email = 'nutri1@ylada.com'
ORDER BY jcn.day_number, jcn.item_index;

-- Verificar anotações diárias
SELECT 
  u.email,
  jdn.day_number,
  jdn.conteudo,
  jdn.created_at
FROM journey_daily_notes jdn
JOIN auth.users u ON u.id = jdn.user_id
WHERE u.email = 'nutri1@ylada.com'
ORDER BY jdn.day_number;
