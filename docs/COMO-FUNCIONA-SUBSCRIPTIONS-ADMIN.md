# 📋 COMO FUNCIONA SUBSCRIPTIONS NA ÁREA ADMINISTRATIVA

## 🔍 ESTRUTURA DA TABELA `subscriptions`

### **Campos Principais:**
- `id` (UUID) - ID único da subscription
- `user_id` (UUID) - Referência ao usuário (NÃO tem email aqui!)
- `area` - Área da assinatura (wellness, nutri, coach, nutra)
- `plan_type` - Tipo de plano (monthly, annual)
- `status` - Status (active, canceled, past_due, etc)
- `current_period_end` - Data de vencimento
- `current_period_start` - Data de início do período atual

### **⚠️ IMPORTANTE:**
A tabela `subscriptions` **NÃO tem campo `email`** diretamente!
- Para encontrar o email, precisa fazer JOIN com `user_profiles` ou `auth.users`
- O relacionamento é: `subscriptions.user_id` → `auth.users.id` → `user_profiles.user_id`

---

## 🔎 COMO ENCONTRAR UMA PESSOA NA TABELA SUBSCRIPTIONS

### **Opção 1: Buscar por Email (via JOIN)**
```sql
SELECT 
  s.id as subscription_id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  u.email,
  up.nome_completo
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE u.email = 'gladisgordaliza@gmail.com'
  AND s.status = 'active';
```

### **Opção 2: Buscar por User ID**
```sql
SELECT *
FROM subscriptions
WHERE user_id = 'UUID_DO_USUARIO'
  AND status = 'active';
```

### **Opção 3: Buscar por Subscription ID**
```sql
SELECT *
FROM subscriptions
WHERE id = 'UUID_DA_SUBSCRIPTION';
```

---

## ✏️ COMO FUNCIONA A ATUALIZAÇÃO NA ÁREA ADMINISTRATIVA

### **1. Na Página de Usuários (`/admin/usuarios`):**
- Lista todos os usuários com suas subscriptions
- Mostra email, nome, área, status da assinatura
- Para editar: clica no botão "Editar Assinatura"
- Usa o `subscription.id` para atualizar via API

### **2. Na Página de Subscriptions (`/admin/subscriptions`):**
- Lista todas as subscriptions
- Mostra email do usuário (faz JOIN automaticamente)
- Permite criar planos gratuitos e migrar assinaturas

### **3. API de Atualização (`/api/admin/subscriptions/[id]`):**
```typescript
PUT /api/admin/subscriptions/{subscription_id}
Body: {
  current_period_end?: "2025-12-31T23:59:59Z",
  plan_type?: "monthly" | "annual",
  status?: "active" | "canceled" | "past_due"
}
```

**⚠️ IMPORTANTE:** A atualização usa o `subscription.id`, NÃO o email!

---

## 🛠️ COMO USAR NA PRÁTICA

### **Cenário 1: Encontrar subscription de uma pessoa pelo email**
1. Acesse Supabase Dashboard
2. Vá em "SQL Editor"
3. Execute:
```sql
SELECT 
  s.id,
  s.user_id,
  s.current_period_end,
  u.email,
  up.nome_completo
FROM subscriptions s
INNER JOIN auth.users u ON u.id = s.user_id
LEFT JOIN user_profiles up ON up.user_id = s.user_id
WHERE u.email = 'EMAIL_DA_PESSOA'
  AND s.status = 'active';
```

### **Cenário 2: Atualizar vencimento na área admin**
1. Acesse `/admin/usuarios`
2. Busque pelo nome ou email da pessoa
3. Clique em "Editar Assinatura"
4. Altere a data de vencimento
5. Salve

### **Cenário 3: Atualizar via SQL direto**
```sql
UPDATE subscriptions
SET 
  current_period_end = '2025-12-31T23:59:59Z'::timestamp with time zone,
  updated_at = NOW()
WHERE id = 'UUID_DA_SUBSCRIPTION';
```

---

## 📊 RESUMO

| O que você tem | Como encontrar subscription |
|----------------|---------------------------|
| **Email** | JOIN com `auth.users` → `subscriptions.user_id` |
| **User ID** | `subscriptions.user_id = 'UUID'` |
| **Subscription ID** | `subscriptions.id = 'UUID'` |
| **Nome** | JOIN com `user_profiles` → `subscriptions.user_id` |

---

## 💡 DICA

Na área administrativa, quando você busca por email ou nome, o sistema:
1. Busca em `user_profiles` ou `auth.users`
2. Pega o `user_id`
3. Busca as subscriptions desse `user_id`
4. Mostra tudo junto na tela

Por isso você vê o email na lista, mesmo que não esteja diretamente na tabela `subscriptions`!

