# 📧 Guia: Autorizar 3 Emails para Área Coach por 1 Ano

## 📋 Pré-requisitos

1. **Os 3 usuários precisam ter conta criada** no sistema (via cadastro em `/pt/coach/login` ou via Supabase Auth)
2. Você precisa ter acesso ao **Supabase SQL Editor** (como admin)
3. Ter os **3 emails** que serão autorizados

---

## 🚀 Método 1: Usando Script SQL (Recomendado)

### Passo 1: Abrir o Supabase SQL Editor

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**

### Passo 2: Editar o Script

1. Abra o arquivo `scripts/autorizar-emails-coach-1ano.sql`
2. **Substitua os emails** nas linhas:
   ```sql
   email1 TEXT := 'email1@exemplo.com';  -- ⚠️ SUBSTITUIR
   email2 TEXT := 'email2@exemplo.com';  -- ⚠️ SUBSTITUIR
   email3 TEXT := 'email3@exemplo.com';  -- ⚠️ SUBSTITUIR
   ```
3. Cole o script completo no SQL Editor

### Passo 3: Executar o Script

1. Clique em **Run** ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
2. O script irá:
   - ✅ Buscar os usuários pelos emails
   - ✅ Cancelar assinaturas antigas (se existirem)
   - ✅ Criar novas assinaturas anuais (365 dias)
   - ✅ Configurar o perfil como 'coach'
   - ✅ Mostrar confirmação com os IDs criados

### Passo 4: Verificar Resultado

O script mostra uma query de verificação no final. Você verá:
- ✅ Email do usuário
- ✅ ID da assinatura
- ✅ Data de início e término
- ✅ Tempo restante

---

## 🔧 Método 2: Usando API (Alternativa)

Se preferir usar a API, você pode fazer requisições POST para:

```
POST /api/admin/subscriptions/free
```

**Headers:**
```
Authorization: Bearer <seu_token_admin>
Content-Type: application/json
```

**Body (para cada email):**
```json
{
  "user_id": "uuid-do-usuario",
  "area": "coach",
  "expires_in_days": 365
}
```

**⚠️ Limitação:** A API precisa do `user_id` (UUID), não do email. Você precisaria buscar o `user_id` primeiro.

---

## 📝 Exemplo de Uso do Script SQL

### Antes de Executar:

```sql
-- Substituir estes emails:
email1 TEXT := 'joao@exemplo.com';
email2 TEXT := 'maria@exemplo.com';
email3 TEXT := 'pedro@exemplo.com';
```

### Após Executar:

O script retorna algo como:

```
✅ Assinaturas criadas com sucesso!
Email 1: joao@exemplo.com - User ID: abc123... - Subscription ID: xyz789...
Email 2: maria@exemplo.com - User ID: def456... - Subscription ID: uvw012...
Email 3: pedro@exemplo.com - User ID: ghi789... - Subscription ID: rst345...
Período: 2024-01-15 10:00:00 até 2025-01-15 10:00:00
Duração: 365 dias (1 ano)
```

---

## ⚠️ Importante

1. **Usuários devem existir primeiro**: Se algum email não tiver conta, o script falhará. Crie as contas primeiro via `/pt/coach/login` ou Supabase Auth.

2. **Assinaturas antigas**: O script cancela automaticamente assinaturas ativas existentes para a área Coach antes de criar novas.

3. **Período**: As assinaturas são válidas por **365 dias (1 ano)** a partir da data de execução.

4. **Valor**: As assinaturas são criadas com `amount: 0` (gratuitas).

---

## 🔍 Verificar Assinaturas Criadas

Para verificar se as assinaturas foram criadas corretamente, execute:

```sql
SELECT 
  u.email,
  s.id as subscription_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.current_period_end - NOW() as tempo_restante
FROM subscriptions s
JOIN auth.users u ON u.id = s.user_id
WHERE s.area = 'coach'
  AND s.status = 'active'
  AND s.current_period_end > NOW()
ORDER BY s.created_at DESC;
```

---

## ❓ Problemas Comuns

### Erro: "Usuário com email X não encontrado"
**Solução:** O usuário precisa criar conta primeiro em `/pt/coach/login`

### Erro: "Violação de constraint"
**Solução:** Verifique se o schema `subscriptions` está atualizado. Execute `schema-subscriptions.sql` se necessário.

### Assinatura não aparece
**Solução:** Verifique se o `status` está como 'active' e se `current_period_end` é maior que `NOW()`.

---

## 📞 Suporte

Se tiver problemas, verifique:
1. ✅ Os emails estão corretos?
2. ✅ Os usuários têm conta criada?
3. ✅ O schema `subscriptions` está atualizado?
4. ✅ Você tem permissão de admin no Supabase?

