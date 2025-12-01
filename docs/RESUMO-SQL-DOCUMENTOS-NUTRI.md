# 📋 Resumo: O que executar no SQL para Documentos Nutri

## ✅ Passo 1: Tabela de Documentos (JÁ CRIADA - Compartilhada)

A tabela `client_documents` já foi criada e funciona para **ambas as áreas** (Coach e Nutri).

**Não precisa executar novamente**, mas se ainda não executou:

```sql
-- migrations/criar-tabela-client-documents.sql
```

---

## ✅ Passo 2: Criar Bucket no Supabase Dashboard

**IMPORTANTE:** Isso é feito no Dashboard, não no SQL Editor.

1. Acesse **Supabase Dashboard** → **Storage**
2. Clique em **"New bucket"**
3. Configure:
   - **Name:** `nutri-documents`
   - **Public bucket:** ✅ **Marcado**
   - **File size limit:** 10 MB
   - **Allowed MIME types:** `image/jpeg,image/jpg,image/png,image/webp,application/pdf`

---

## ✅ Passo 3: Executar Políticas RLS (SQL)

**Execute este script no Supabase SQL Editor:**

```sql
-- migrations/configurar-storage-nutri-documents.sql
```

Ou copie e cole diretamente:

```sql
-- =====================================================
-- YLADA NUTRI - CONFIGURAÇÃO DO STORAGE PARA DOCUMENTOS
-- =====================================================

-- 1. POLÍTICA DE UPLOAD
CREATE POLICY IF NOT EXISTS "Nutricionistas podem fazer upload de documentos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'nutri-documents' AND
  (storage.foldername(name))[1] = 'nutri' AND
  (storage.foldername(name))[2] = 'client-documents'
);

-- 2. POLÍTICA DE LEITURA (PÚBLICA)
CREATE POLICY IF NOT EXISTS "Documentos Nutri são públicos para leitura"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'nutri-documents');

-- 3. POLÍTICA DE EXCLUSÃO
CREATE POLICY IF NOT EXISTS "Nutricionistas podem deletar seus documentos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'nutri-documents' AND
  (storage.foldername(name))[1] = 'nutri' AND
  (storage.foldername(name))[2] = 'client-documents'
);
```

---

## ✅ Passo 4: Verificar se Funcionou

Execute para verificar:

```sql
-- Verificar se o bucket existe
SELECT name, id, public, file_size_limit
FROM storage.buckets
WHERE name = 'nutri-documents';

-- Verificar se as políticas foram criadas
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%nutri%document%';
```

---

## 📝 Resumo Rápido

1. ✅ **Tabela:** Já existe (`client_documents`) - funciona para Coach e Nutri
2. ⚠️ **Bucket:** Criar manualmente no Dashboard: `nutri-documents`
3. ⚠️ **Políticas RLS:** Executar `migrations/configurar-storage-nutri-documents.sql`

**Pronto!** Depois disso, a funcionalidade estará disponível em `/pt/nutri/clientes/[id]` → Tab "Documentos"

