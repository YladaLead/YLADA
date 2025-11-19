-- =====================================================
-- REMOVER CLIENTES FICTÍCIOS
-- =====================================================
-- Execute este script para remover todos os dados fictícios
-- criados pelo script inserir-clientes-ficticios.sql
-- =====================================================

BEGIN;

-- Remover histórico
DELETE FROM client_history 
WHERE client_id IN (
  SELECT id FROM clients 
  WHERE name IN (
    'Maria Silva Santos',
    'João Pedro Oliveira',
    'Ana Carolina Costa',
    'Carlos Eduardo Lima',
    'Fernanda Alves',
    'Roberto Santos'
  )
);

-- Remover registros emocionais/comportamentais
DELETE FROM emotional_behavioral_history 
WHERE client_id IN (
  SELECT id FROM clients 
  WHERE name IN (
    'Maria Silva Santos',
    'João Pedro Oliveira',
    'Ana Carolina Costa',
    'Carlos Eduardo Lima',
    'Fernanda Alves',
    'Roberto Santos'
  )
);

-- Remover avaliações
DELETE FROM assessments 
WHERE client_id IN (
  SELECT id FROM clients 
  WHERE name IN (
    'Maria Silva Santos',
    'João Pedro Oliveira',
    'Ana Carolina Costa',
    'Carlos Eduardo Lima',
    'Fernanda Alves',
    'Roberto Santos'
  )
);

-- Remover consultas
DELETE FROM appointments 
WHERE client_id IN (
  SELECT id FROM clients 
  WHERE name IN (
    'Maria Silva Santos',
    'João Pedro Oliveira',
    'Ana Carolina Costa',
    'Carlos Eduardo Lima',
    'Fernanda Alves',
    'Roberto Santos'
  )
);

-- Remover evoluções
DELETE FROM client_evolution 
WHERE client_id IN (
  SELECT id FROM clients 
  WHERE name IN (
    'Maria Silva Santos',
    'João Pedro Oliveira',
    'Ana Carolina Costa',
    'Carlos Eduardo Lima',
    'Fernanda Alves',
    'Roberto Santos'
  )
);

-- Remover clientes
DELETE FROM clients 
WHERE name IN (
  'Maria Silva Santos',
  'João Pedro Oliveira',
  'Ana Carolina Costa',
  'Carlos Eduardo Lima',
  'Fernanda Alves',
  'Roberto Santos'
);

COMMIT;

-- Verificar se foram removidos
SELECT 
  'Clientes restantes:' as info,
  COUNT(*) as total
FROM clients
WHERE name IN (
  'Maria Silva Santos',
  'João Pedro Oliveira',
  'Ana Carolina Costa',
  'Carlos Eduardo Lima',
  'Fernanda Alves',
  'Roberto Santos'
);

-- Se retornar 0, todos foram removidos com sucesso!

