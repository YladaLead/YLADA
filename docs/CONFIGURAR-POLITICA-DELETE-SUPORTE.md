# 🔧 Configurar Política de Delete para Suporte

## 🎯 Objetivo

Permitir que a equipe de suporte possa deletar materiais da biblioteca wellness, além de fazer upload e editar.

---

## 📋 Passo a Passo

### 1. Acessar Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Storage** → **Policies** (no menu lateral)

### 2. Selecionar Bucket

1. Na lista de buckets, encontre: **`wellness-biblioteca`**
2. Clique no bucket para ver as políticas

### 3. Encontrar Política Antiga

1. Procure pela política: **"Admins podem deletar"**
2. Clique no ícone de **lápis (Edit)** ou **lixeira (Delete)**

### 4. Criar Nova Política

1. Clique em **"New Policy"** (ou edite a existente)
2. Preencha os campos:

#### **Nome da Política:**
```
Admins e Suporte podem deletar
```

#### **Target roles:**
```
authenticated
```

#### **Operation:**
```
DELETE
```

#### **USING expression:**
Cole este código SQL:

```sql
bucket_id = 'wellness-biblioteca' AND
EXISTS (
  SELECT 1 FROM user_profiles
  WHERE user_id = auth.uid()
  AND (is_admin = true OR is_support = true)
)
```

### 5. Salvar

1. Clique em **"Save"** ou **"Review"** → **"Save"**
2. Pronto! ✅

---

## ✅ Verificação

Após configurar, teste:

1. Faça login com: `suportewellness@ylada.com` / `123456`
2. Acesse: `/pt/wellness/biblioteca/gerenciar`
3. Tente deletar um material
4. Deve funcionar! ✅

---

## 🔍 Política Completa (Referência)

Se preferir copiar a política completa:

**Nome:** `Admins e Suporte podem deletar`  
**Target roles:** `authenticated`  
**Operation:** `DELETE`  
**USING:**
```sql
bucket_id = 'wellness-biblioteca' AND
EXISTS (
  SELECT 1 FROM user_profiles
  WHERE user_id = auth.uid()
  AND (is_admin = true OR is_support = true)
)
```

---

## 📝 Notas

- A API já foi atualizada para permitir suporte deletar
- Esta política apenas permite deletar arquivos do storage
- Se a política não for criada, o suporte ainda poderá deletar o registro do banco, mas o arquivo ficará no storage

---

**Última atualização:** Dezembro 2024
