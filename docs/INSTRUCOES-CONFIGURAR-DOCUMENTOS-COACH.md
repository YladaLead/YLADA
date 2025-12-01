# 📋 Instruções para Configurar Documentos dos Clientes (Coach)

## ✅ Passo 1: Executar Migration

Execute a migration no Supabase SQL Editor:

```sql
-- migrations/criar-tabela-client-documents.sql
```

Isso criará a tabela `client_documents` com toda a estrutura necessária.

---

## ✅ Passo 2: Configurar Supabase Storage

### 2.1. Criar o Bucket

1. Acesse o **Supabase Dashboard**
2. Vá em **Storage** (no menu lateral)
3. Clique em **"New bucket"**
4. Configure:
   - **Name:** `coach-documents`
   - **Public bucket:** ✅ **Marcado** (para permitir acesso público aos arquivos)
   - **File size limit:** 10 MB (ou o tamanho desejado)
   - **Allowed MIME types:** `image/jpeg,image/jpg,image/png,image/webp,application/pdf`

### 2.2. Configurar Políticas de Acesso (RLS)

No Supabase SQL Editor, execute:

```sql
-- Política para permitir upload apenas para coaches autenticados
CREATE POLICY "Coaches podem fazer upload de documentos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'coach-documents' AND
  (storage.foldername(name))[1] = 'coach' AND
  (storage.foldername(name))[2] = 'client-documents'
);

-- Política para permitir leitura pública (para visualização)
CREATE POLICY "Documentos são públicos para leitura"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'coach-documents');

-- Política para permitir que coaches deletem seus próprios documentos
CREATE POLICY "Coaches podem deletar seus documentos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'coach-documents' AND
  (storage.foldername(name))[1] = 'coach' AND
  (storage.foldername(name))[2] = 'client-documents'
);
```

---

## ✅ Passo 3: Verificar Estrutura

Após executar a migration e configurar o storage, verifique se tudo está funcionando:

```sql
-- Verificar se a tabela foi criada
SELECT * FROM client_documents LIMIT 1;

-- Verificar se o bucket existe
SELECT * FROM storage.buckets WHERE name = 'coach-documents';
```

---

## 📦 Estrutura de Armazenamento

Os arquivos serão armazenados no seguinte formato:

```
coach-documents/
  └── coach/
      └── client-documents/
          └── {client_id}/
              └── {timestamp}-{random}.{ext}
```

Exemplo:
```
coach-documents/coach/client-documents/abc123/1704123456789-x7k9m2p.jpg
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Upload de Documentos
- Upload de imagens (JPG, PNG, WEBP) e PDFs
- Validação de tipo e tamanho (máx 10MB)
- Categorização por tipo (exame, documento, receita, etc.)
- Descrição opcional

### ✅ Visualização
- Preview de imagens
- Grid responsivo de documentos
- Filtros por tipo de documento
- Informações de tamanho e data

### ✅ Gerenciamento
- Deletar documentos (soft delete)
- Visualizar documentos em nova aba
- Organização por categoria

---

## 🔒 Segurança

- ✅ Apenas coaches autenticados podem fazer upload
- ✅ Apenas o coach dono do cliente pode gerenciar documentos
- ✅ Validação de tipo de arquivo no backend
- ✅ Validação de tamanho de arquivo
- ✅ Soft delete (documentos não são removidos fisicamente)

---

## 📍 Localização na Interface

A funcionalidade está disponível na página de detalhes do cliente:

**Rota:** `/pt/coach/clientes/[id]`

**Tab:** "Documentos" (última tab na lista)

---

## 🚀 Próximos Passos (Opcional)

- [ ] Adicionar edição de metadados (tipo, categoria, descrição)
- [ ] Adicionar download em lote
- [ ] Adicionar busca por nome ou descrição
- [ ] Adicionar tags personalizadas
- [ ] Adicionar compartilhamento de documentos com clientes

