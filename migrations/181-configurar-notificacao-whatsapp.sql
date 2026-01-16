-- =====================================================
-- CONFIGURAR NOTIFICAÇÃO WHATSAPP
-- =====================================================
-- Telefone para receber notificações: 19981868000
-- Telefone integrado: 5519997230912

-- Verificar instância atual
SELECT 
  id,
  name,
  instance_id,
  area,
  phone_number,
  status
FROM z_api_instances
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';

-- IMPORTANTE: A variável Z_API_NOTIFICATION_PHONE deve ser configurada
-- na Vercel com o valor: 5519981868000
-- (formato internacional: 55 + DDD + número)

-- Verificar se há mensagens no banco
SELECT 
  COUNT(*) as total_mensagens,
  MAX(created_at) as ultima_mensagem
FROM whatsapp_messages;

-- Verificar conversas
SELECT 
  COUNT(*) as total_conversas,
  MAX(last_message_at) as ultima_conversa
FROM whatsapp_conversations;

-- Verificar se usuário é admin
SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as role,
  up.is_admin,
  CASE 
    WHEN u.raw_user_meta_data->>'role' = 'admin' OR up.is_admin = true 
    THEN '✅ É ADMIN'
    ELSE '❌ NÃO É ADMIN'
  END as status
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.email = 'faulaandre@gmail.com';
