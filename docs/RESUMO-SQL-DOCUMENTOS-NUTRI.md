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

## ✅ Passo 3: Executar SQL Completo

**Execute este script completo no Supabase SQL Editor:**

📄 **Arquivo:** `docs/SQL-COMPLETO-DOCUMENTOS-NUTRI.sql`

Ou copie e cole diretamente:

```sql
-- =====================================================
-- YLADA NUTRI - SQL COMPLETO PARA DOCUMENTOS
-- =====================================================

-- PARTE 1: CRIAR TABELA (se ainda não existe)
CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(50) NOT NULL,
  file_extension VARCHAR(10),
  document_type VARCHAR(50) NOT NULL DEFAULT 'outro',
  category VARCHAR(100),
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_user_id ON client_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_document_type ON client_documents(document_type);

-- PARTE 2: POLÍTICAS RLS DO STORAGE
DROP POLICY IF EXISTS "Nutricionistas podem fazer upload de documentos" ON storage.objects;
CREATE POLICY "Nutricionistas podem fazer upload de documentos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'nutri-documents' AND
  (storage.foldername(name))[1] = 'nutri' AND
  (storage.foldername(name))[2] = 'client-documents'
);

DROP POLICY IF EXISTS "Documentos Nutri são públicos para leitura" ON storage.objects;
CREATE POLICY "Documentos Nutri são públicos para leitura"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'nutri-documents');

DROP POLICY IF EXISTS "Nutricionistas podem deletar seus documentos" ON storage.objects;
CREATE POLICY "Nutricionistas podem deletar seus documentos"
ON storage.objects FOR DELETE TO authenticated
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

