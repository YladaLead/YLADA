-- =====================================================
-- YLADA NUTRI - VERIFICAÇÃO COMPLETA DOS DOCUMENTOS
-- Execute este script para verificar se tudo está configurado
-- =====================================================

-- 1. Verificar se a tabela existe e quantos documentos há
SELECT 
  'Tabela client_documents' AS item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_documents')
    THEN '✅ Existe'
    ELSE '❌ Não existe'
  END AS status,
  (SELECT COUNT(*) FROM client_documents) AS total_documentos;

-- 2. Verificar se o bucket existe
SELECT 
  'Bucket nutri-documents' AS item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'nutri-documents')
    THEN '✅ Existe'
    ELSE '❌ Não existe - Crie no Dashboard!'
  END AS status,
  (SELECT public FROM storage.buckets WHERE name = 'nutri-documents') AS publico;

-- 3. Verificar políticas RLS criadas
SELECT 
  'Políticas RLS' AS item,
  COUNT(*) AS total_politicas,
  STRING_AGG(policyname, ', ') AS politicas
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%nutri%document%';

-- 4. Listar todas as políticas relacionadas a nutri-documents
SELECT 
  policyname AS "Nome da Política",
  cmd AS "Comando",
  roles AS "Roles",
  CASE 
    WHEN cmd = 'INSERT' THEN 'Upload'
    WHEN cmd = 'SELECT' THEN 'Leitura'
    WHEN cmd = 'DELETE' THEN 'Exclusão'
    ELSE cmd
  END AS "Tipo"
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%nutri%document%'
ORDER BY cmd;

-- 5. Verificar estrutura da tabela
SELECT 
  column_name AS "Coluna",
  data_type AS "Tipo",
  is_nullable AS "Pode ser NULL"
FROM information_schema.columns
WHERE table_name = 'client_documents'
ORDER BY ordinal_position;

-- 6. Verificar índices criados
SELECT 
  indexname AS "Índice",
  indexdef AS "Definição"
FROM pg_indexes
WHERE tablename = 'client_documents';

