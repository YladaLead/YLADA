# 📦 Passo a Passo: Criar Buckets Coach

## 🎯 Buckets para criar (4 buckets)

1. `coach-cursos-videos`
2. `coach-cursos-pdfs`
3. `coach-cursos-materiais`
4. `coach-cursos-thumbnails`

---

## 📋 Configuração de cada bucket

### 1️⃣ `coach-cursos-videos`
- **Public bucket:** ❌ Desmarcado
- **Restrict file size:** ✅ Marcado → `50 MB`
- **Restrict MIME types:** ✅ Marcado → Cole:
```
video/mp4, video/webm, video/ogg, video/quicktime, video/x-msvideo, video/x-matroska
```

### 2️⃣ `coach-cursos-pdfs`
- **Public bucket:** ❌ Desmarcado
- **Restrict file size:** ✅ Marcado → `50 MB`
- **Restrict MIME types:** ✅ Marcado → Cole:
```
application/pdf, application/x-pdf, image/jpeg, image/jpg, image/png
```

### 3️⃣ `coach-cursos-materiais`
- **Public bucket:** ❌ Desmarcado
- **Restrict file size:** ✅ Marcado → `50 MB`
- **Restrict MIME types:** ✅ Marcado → Cole:
```
application/pdf, application/x-pdf, image/jpeg, image/jpg, image/png, image/webp, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword
```

### 4️⃣ `coach-cursos-thumbnails`
- **Public bucket:** ✅ **MARCADO** (público)
- **Restrict file size:** ✅ Marcado → `5 MB`
- **Restrict MIME types:** ✅ Marcado → Cole:
```
image/jpeg, image/jpg, image/png, image/webp
```

---

## 🔐 Criar Policies (4 policies por bucket)

Para cada bucket, criar 4 policies na aba "Policies":

### Policy 1: SELECT (Leitura)
- **Name:** `Users can read [nome-do-bucket]`
- **Operation:** `SELECT`
- **SQL:**
```sql
(bucket_id = '[nome-do-bucket]'::text AND auth.role() = 'authenticated'::text)
```

### Policy 2: INSERT (Upload)
- **Name:** `Users can upload to [nome-do-bucket]`
- **Operation:** `INSERT`
- **SQL:** (mesmo acima)

### Policy 3: UPDATE (Atualização)
- **Name:** `Users can update [nome-do-bucket]`
- **Operation:** `UPDATE`
- **SQL:** (mesmo acima)

### Policy 4: DELETE (Exclusão)
- **Name:** `Users can delete from [nome-do-bucket]`
- **Operation:** `DELETE`
- **SQL:** (mesmo acima)

---

## ✅ Resultado esperado

Após criar tudo, você terá:
- ✅ 4 buckets Coach criados
- ✅ Cada bucket com 4 policies (total: 16 policies)
- ✅ Todos os buckets configurados corretamente

