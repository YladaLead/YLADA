-- =====================================================
-- SCRIPT: Limpar Bloqueios de Rate Limit do NOEL
-- =====================================================
-- Execute este script para remover todos os bloqueios ativos
-- Isso permite que usuários usem o NOEL novamente
-- =====================================================

-- 1. Remover todos os bloqueios ativos
UPDATE noel_rate_limits
SET is_blocked = false,
    blocked_until = NULL
WHERE is_blocked = true;

-- 2. Deletar registros antigos (mais de 1 hora)
DELETE FROM noel_rate_limits
WHERE created_at < NOW() - INTERVAL '1 hour';

-- 3. Verificar quantos bloqueios foram removidos
SELECT 
  COUNT(*) as bloqueios_removidos,
  COUNT(DISTINCT user_id) as usuarios_afetados
FROM noel_rate_limits
WHERE is_blocked = true;

-- 4. Verificar se ainda há bloqueios ativos
SELECT 
  user_id,
  is_blocked,
  blocked_until,
  created_at
FROM noel_rate_limits
WHERE is_blocked = true
  AND blocked_until > NOW()
ORDER BY blocked_until DESC
LIMIT 10;

-- 5. Verificar total de registros na tabela
SELECT 
  COUNT(*) as total_registros,
  COUNT(DISTINCT user_id) as usuarios_unicos,
  COUNT(*) FILTER (WHERE is_blocked = true) as bloqueios_ativos
FROM noel_rate_limits;




