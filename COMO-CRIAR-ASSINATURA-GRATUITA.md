# 🎁 Como Criar Assinatura Gratuita para Usuários

## 📋 Método 1: Interface Admin (Mais Fácil)

1. **Acesse:** `/admin/subscriptions`
2. **Na seção "Criar Plano Gratuito":**
   - **User ID:** Cole o UUID do usuário (encontre em `/admin/usuarios`)
   - **Área:** Escolha `wellness`, `nutri`, `coach` ou `nutra`
   - **Dias de validade:** 
     - `30` = 1 mês grátis
     - `365` = 1 ano grátis
3. **Clique:** "Criar Plano Gratuito"

---

## 🔧 Método 2: API Direta (Para desenvolvedores)

### Endpoint:
```
POST /api/admin/subscriptions/free
```

### Headers:
```
Authorization: Bearer {seu_token_admin}
Content-Type: application/json
```

### Body:
```json
{
  "user_id": "uuid-do-usuario",
  "area": "coach",
  "expires_in_days": 365
}
```

### Exemplo com cURL:
```bash
curl -X POST https://seu-dominio.com/api/admin/subscriptions/free \
  -H "Authorization: Bearer seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-do-usuario",
    "area": "coach",
    "expires_in_days": 365
  }'
```

---

## 🗄️ Método 3: SQL Direto no Supabase

### Para 1 mês grátis:
```sql
INSERT INTO subscriptions (
  user_id,
  area,
  plan_type,
  status,
  current_period_start,
  current_period_end,
  stripe_account,
  stripe_subscription_id,
  stripe_customer_id,
  stripe_price_id,
  amount,
  currency
)
VALUES (
  'uuid-do-usuario',  -- Substitua pelo UUID do usuário
  'coach',            -- wellness, nutri, coach ou nutra
  'free',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days',  -- 1 mês
  'br',
  'free_' || 'uuid-do-usuario' || '_coach_' || EXTRACT(EPOCH FROM NOW())::bigint,
  'free_' || 'uuid-do-usuario',
  'free',
  0,
  'brl'
);
```

### Para 1 ano grátis:
```sql
INSERT INTO subscriptions (
  user_id,
  area,
  plan_type,
  status,
  current_period_start,
  current_period_end,
  stripe_account,
  stripe_subscription_id,
  stripe_customer_id,
  stripe_price_id,
  amount,
  currency
)
VALUES (
  'uuid-do-usuario',  -- Substitua pelo UUID do usuário
  'coach',            -- wellness, nutri, coach ou nutra
  'free',
  'active',
  NOW(),
  NOW() + INTERVAL '365 days',  -- 1 ano
  'br',
  'free_' || 'uuid-do-usuario' || '_coach_' || EXTRACT(EPOCH FROM NOW())::bigint,
  'free_' || 'uuid-do-usuario',
  'free',
  0,
  'brl'
);
```

---

## 🔍 Como Encontrar o User ID

1. Acesse `/admin/usuarios`
2. Busque pelo email ou nome do usuário
3. Copie o **User ID** (UUID) da coluna correspondente

---

## ⚠️ Importante

- **Áreas disponíveis:** `wellness`, `nutri`, `coach`, `nutra`
- **Validade máxima:** 400 dias (por segurança)
- **Validade mínima:** 1 dia
- Se o usuário já tiver assinatura ativa, ela será cancelada antes de criar a nova

---

## ✅ Verificar se Funcionou

1. Acesse `/admin/subscriptions`
2. Busque pelo User ID
3. Verifique se a assinatura aparece como "ativa" e "gratuito"

