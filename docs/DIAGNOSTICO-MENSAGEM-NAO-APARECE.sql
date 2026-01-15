-- =====================================================
-- DIAGNÓSTICO: Mensagem não aparece
-- Execute estes SQLs no Supabase para verificar
-- =====================================================

-- 1. Verificar se instância está cadastrada e conectada
SELECT 
  name,
  instance_id,
  area,
  phone_number,
  status,
  created_at,
  updated_at
FROM z_api_instances
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';

-- 2. Verificar se há conversas no banco
SELECT 
  id,
  phone,
  name,
  area,
  status,
  total_messages,
  unread_count,
  last_message_at,
  created_at
FROM whatsapp_conversations
ORDER BY created_at DESC
LIMIT 10;

-- 3. Verificar se há mensagens no banco
SELECT 
  id,
  conversation_id,
  sender_type,
  sender_name,
  sender_phone,
  message,
  message_type,
  status,
  created_at
FROM whatsapp_messages
ORDER BY created_at DESC
LIMIT 10;

-- 4. Verificar últimas mensagens com detalhes
SELECT 
  m.id,
  m.message,
  m.sender_type,
  m.sender_phone,
  m.created_at,
  c.phone as conversation_phone,
  c.area,
  c.name as conversation_name
FROM whatsapp_messages m
LEFT JOIN whatsapp_conversations c ON c.id = m.conversation_id
ORDER BY m.created_at DESC
LIMIT 10;

-- 5. Contar total de mensagens por tipo
SELECT 
  sender_type,
  COUNT(*) as total
FROM whatsapp_messages
GROUP BY sender_type;
