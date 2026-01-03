-- =====================================================
-- VERIFICAR AGENDA DA CONTA DEMO
-- =====================================================
-- Execute este script primeiro para verificar o estado atual

-- 1. Verificar se a conta demo existe
SELECT 
  '📋 VERIFICAÇÃO DA CONTA DEMO' as info,
  up.user_id,
  up.email,
  up.nome_completo,
  up.perfil
FROM user_profiles up
WHERE up.email = 'demo.nutri@ylada.com';

-- 2. Verificar quantos clientes existem
SELECT 
  '👥 CLIENTES DA CONTA DEMO' as info,
  COUNT(*) as total_clientes
FROM clients c
JOIN user_profiles up ON up.user_id = c.user_id
WHERE up.email = 'demo.nutri@ylada.com';

-- 3. Verificar consultas existentes
SELECT 
  '📅 CONSULTAS EXISTENTES' as info,
  COUNT(*) as total_consultas,
  COUNT(CASE WHEN start_time >= '2024-12-01' AND start_time < '2025-01-01' THEN 1 END) as dezembro_2024,
  COUNT(CASE WHEN DATE(start_time) = '2025-11-25' THEN 1 END) as novembro_25_2025,
  MIN(start_time) as primeira_consulta,
  MAX(start_time) as ultima_consulta
FROM appointments a
JOIN user_profiles up ON up.user_id = a.user_id
WHERE up.email = 'demo.nutri@ylada.com';

-- 4. Verificar consultas por data (últimos 30 dias e próximos 30 dias)
SELECT 
  DATE(start_time) as data,
  COUNT(*) as total_consultas,
  COUNT(CASE WHEN status = 'agendado' THEN 1 END) as agendadas,
  COUNT(CASE WHEN status = 'concluido' THEN 1 END) as concluidas
FROM appointments a
JOIN user_profiles up ON up.user_id = a.user_id
WHERE up.email = 'demo.nutri@ylada.com'
  AND start_time >= NOW() - INTERVAL '30 days'
  AND start_time <= NOW() + INTERVAL '30 days'
GROUP BY DATE(start_time)
ORDER BY data;

-- 5. Verificar se há consultas em dezembro 2024
SELECT 
  '📅 DEZEMBRO 2024' as info,
  COUNT(*) as total_consultas,
  COUNT(DISTINCT DATE(start_time)) as dias_com_consultas
FROM appointments a
JOIN user_profiles up ON up.user_id = a.user_id
WHERE up.email = 'demo.nutri@ylada.com'
  AND start_time >= '2024-12-01'
  AND start_time < '2025-01-01';

-- 6. Verificar se há consultas em 25/11/2025
SELECT 
  '📅 25 NOVEMBRO 2025' as info,
  COUNT(*) as total_consultas
FROM appointments a
JOIN user_profiles up ON up.user_id = a.user_id
WHERE up.email = 'demo.nutri@ylada.com'
  AND DATE(start_time) = '2025-11-25';


