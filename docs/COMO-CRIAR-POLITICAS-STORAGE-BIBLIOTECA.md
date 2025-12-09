# 🔧 Como Criar Políticas de Storage para Biblioteca Wellness

## ⚠️ Problema

O Supabase pode não permitir criar políticas de storage via SQL se você não tiver permissões de superuser. Neste caso, você precisa criar as políticas manualmente via Dashboard.

---

## ✅ Solução: Criar Políticas Manualmente

### Passo 1: Executar Migration SQL (Criar Bucket)

1. Acesse: **Supabase Dashboard → SQL Editor**
2. Execute apenas a parte do bucket (primeiras 25 linhas de `migrations/022-criar-bucket-wellness-biblioteca.sql`):

```sql
-- Criar bucket wellness-biblioteca
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wellness-biblioteca',
  'wellness-biblioteca',
  true, -- Público para acesso direto
  104857600, -- 100MB limite
  ARRAY[
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
)
ON CONFLICT (id) DO NOTHING;
```

### Passo 2: Criar Políticas via Dashboard

1. Acesse: **Supabase Dashboard → Storage**
2. Clique no bucket: **wellness-biblioteca**
3. Vá na aba: **Policies**
4. Clique em: **New Policy**

#### Política 1: Upload (INSERT)

**Nome:** `Admins podem fazer upload`

**Target roles:** `authenticated`

**Allowed operation:** `INSERT`

**Policy definition:**
```sql
(bucket_id = 'wellness-biblioteca' AND
 EXISTS (
   SELECT 1 FROM user_profiles
   WHERE user_id = auth.uid()
   AND profile_type = 'admin'
 ))
```

#### Política 2: Leitura (SELECT)

**Nome:** `Wellness users podem ler`

**Target roles:** `authenticated`

**Allowed operation:** `SELECT`

**Policy definition:**
```sql
(bucket_id = 'wellness-biblioteca' AND
 EXISTS (
   SELECT 1 FROM user_profiles
   WHERE user_id = auth.uid()
   AND profile_type IN ('wellness', 'admin')
 ))
```

#### Política 3: Delete

**Nome:** `Admins podem deletar`

**Target roles:** `authenticated`

**Allowed operation:** `DELETE`

**Policy definition:**
```sql
(bucket_id = 'wellness-biblioteca' AND
 EXISTS (
   SELECT 1 FROM user_profiles
   WHERE user_id = auth.uid()
   AND profile_type = 'admin'
 ))
```

---

## 🔄 Alternativa: Script SQL Completo (Se Tiver Permissões)

Se você tiver permissões de superuser, pode executar o script completo:

```sql
-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Admins podem fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Wellness users podem ler" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar" ON storage.objects;

-- Criar políticas
CREATE POLICY "Admins podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'wellness-biblioteca' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND profile_type = 'admin'
  )
);

CREATE POLICY "Wellness users podem ler"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'wellness-biblioteca' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND profile_type IN ('wellness', 'admin')
  )
);

CREATE POLICY "Admins podem deletar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'wellness-biblioteca' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND profile_type = 'admin'
  )
);
```

---

## ✅ Verificar se Funcionou

Execute este SQL para verificar:

```sql
-- Verificar bucket
SELECT name, public, file_size_limit
FROM storage.buckets
WHERE name = 'wellness-biblioteca';

-- Verificar políticas
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname IN (
    'Admins podem fazer upload',
    'Wellness users podem ler',
    'Admins podem deletar'
  );
```

**Esperado:** Deve mostrar o bucket e as 3 políticas criadas.

---

## 📋 Resumo

1. ✅ Execute a parte do bucket (primeiras 25 linhas)
2. ⏳ Crie as 3 políticas via Dashboard OU execute o script SQL completo
3. ✅ Verifique se tudo está funcionando

---

**Status:** ⚠️ Requer criação manual de políticas via Dashboard (ou permissões de superuser)
