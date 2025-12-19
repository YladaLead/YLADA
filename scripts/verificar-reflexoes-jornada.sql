-- =====================================================
-- Verificar reflexões da jornada salvas
-- Execute no Supabase SQL Editor
-- =====================================================

-- 1. Ver quantas reflexões existem no total
SELECT 
  COUNT(*) as total_reflexoes,
  COUNT(DISTINCT user_id) as usuarios_com_reflexoes
FROM journey_checklist_notes
WHERE nota IS NOT NULL AND nota != '';

-- 2. Ver reflexões por usuário (primeiros 10)
SELECT 
  u.email,
  jcn.day_number,
  jcn.item_index,
  LEFT(jcn.nota, 50) as nota_preview,
  jcn.created_at
FROM journey_checklist_notes jcn
JOIN auth.users u ON u.id = jcn.user_id
WHERE jcn.nota IS NOT NULL AND jcn.nota != ''
ORDER BY jcn.created_at DESC
LIMIT 20;

-- 3. Ver reflexões de um usuário específico (substitua o email)
-- SELECT * FROM journey_checklist_notes jcn
-- JOIN auth.users u ON u.id = jcn.user_id
-- WHERE u.email = 'SEU_EMAIL_AQUI'
-- AND jcn.nota IS NOT NULL AND jcn.nota != ''
-- ORDER BY jcn.day_number, jcn.item_index;

-- 4. Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'journey_checklist_notes';

-- 5. Ver políticas RLS da tabela
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'journey_checklist_notes';


