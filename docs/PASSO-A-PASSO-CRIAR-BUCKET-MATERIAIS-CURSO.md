# 📦 Passo a Passo: Criar Bucket `materiais_curso` no Supabase Storage

## 🎯 Objetivo
Criar um bucket para armazenar materiais complementares dos cursos (PDFs, imagens, anexos).

---

## 📋 Passo a Passo

### 1️⃣ **Criar o Bucket**

1. Na tela do Supabase Storage (onde você está agora)
2. Clique no botão verde **"+ New bucket"** (canto superior direito)
3. Preencha o formulário:
   - **Name:** `materiais_curso`
   - **Public bucket:** ❌ **DESMARQUE** (deixe privado)
   - **File size limit:** `50 MB` (ou o valor que preferir)
   - **Allowed MIME types:** 
     ```
     application/pdf, application/x-pdf, image/jpeg, image/jpg, image/png, image/webp, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
     ```
   - Clique em **"Create bucket"**

---

### 2️⃣ **Configurar Policies (Políticas de Acesso)**

Após criar o bucket, você precisa configurar as políticas para que usuários autenticados possam ler e escrever.

1. Clique na aba **"Policies"** (ao lado de "Buckets")
2. Selecione o bucket `materiais_curso` no dropdown (se não aparecer automaticamente)
3. Clique em **"+ New Policy"** ou **"New Policy"**

#### **Policy 1: Permitir Leitura (SELECT) para Usuários Autenticados**

1. Escolha: **"For full customization"** ou **"Create policy from scratch"**
2. Preencha:
   - **Policy name:** `Users can read materiais_curso`
   - **Allowed operation:** `SELECT` (Read)
   - **Policy definition:** Cole o SQL abaixo:

```sql
(
  bucket_id = 'materiais_curso'::text
  AND auth.role() = 'authenticated'::text
)
```

3. Clique em **"Review"** e depois **"Save policy"**

---

#### **Policy 2: Permitir Upload (INSERT) para Usuários Autenticados**

1. Clique novamente em **"+ New Policy"**
2. Preencha:
   - **Policy name:** `Users can upload to materiais_curso`
   - **Allowed operation:** `INSERT` (Create)
   - **Policy definition:** Cole o SQL abaixo:

```sql
(
  bucket_id = 'materiais_curso'::text
  AND auth.role() = 'authenticated'::text
)
```

3. Clique em **"Review"** e depois **"Save policy"**

---

#### **Policy 3: Permitir Atualização (UPDATE) para Usuários Autenticados**

1. Clique novamente em **"+ New Policy"**
2. Preencha:
   - **Policy name:** `Users can update materiais_curso`
   - **Allowed operation:** `UPDATE` (Update)
   - **Policy definition:** Cole o SQL abaixo:

```sql
(
  bucket_id = 'materiais_curso'::text
  AND auth.role() = 'authenticated'::text
)
```

3. Clique em **"Review"** e depois **"Save policy"**

---

#### **Policy 4: Permitir Exclusão (DELETE) para Usuários Autenticados**

1. Clique novamente em **"+ New Policy"**
2. Preencha:
   - **Policy name:** `Users can delete from materiais_curso`
   - **Allowed operation:** `DELETE` (Delete)
   - **Policy definition:** Cole o SQL abaixo:

```sql
(
  bucket_id = 'materiais_curso'::text
  AND auth.role() = 'authenticated'::text
)
```

3. Clique em **"Review"** e depois **"Save policy"**

---

### 3️⃣ **Verificar Configuração**

1. Volte para a aba **"Buckets"**
2. Verifique se o bucket `materiais_curso` aparece na lista
3. Verifique se mostra **"4"** na coluna **"POLICIES"** (igual aos outros buckets)

---

## ✅ Resultado Esperado

Após seguir os passos, você terá:

- ✅ Bucket `materiais_curso` criado
- ✅ 4 políticas configuradas (SELECT, INSERT, UPDATE, DELETE)
- ✅ Acesso restrito a usuários autenticados
- ✅ Limite de tamanho de arquivo configurado
- ✅ Tipos MIME permitidos configurados

---

## 🔍 Observações

- O bucket é **privado** (não público), então apenas usuários autenticados podem acessar
- As políticas permitem que qualquer usuário autenticado leia/escreva (se quiser restringir mais, pode adicionar condições adicionais)
- O limite de 50 MB é suficiente para PDFs e imagens, mas pode ser ajustado conforme necessário

---

## 🚀 Próximo Passo

Após criar o bucket, você pode:
1. Testar fazendo upload de um arquivo de teste
2. Usar o bucket nas APIs de cursos para armazenar materiais complementares

