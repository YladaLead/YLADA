# 🔧 Solução: Érika Cremmer - Conta Apagada e Pagamento Realizado

**Email:** evsnutrivibe@gmail.com  
**Nome:** Érika Cremmer  
**Plano:** Anual (12x de R$ 47,90)  
**Problema:** ID foi apagado no Supabase, mas pagamento foi realizado no Mercado Pago

---

## ✅ SOLUÇÃO RÁPIDA (Interface Admin)

### Passo 1: Criar Conta e Assinatura

1. Acesse: `/admin/subscriptions`
2. Na seção **"Criar Plano Gratuito"**:
   - **Email:** `evsnutrivibe@gmail.com`
   - **Nome:** `Érika Cremmer`
   - **Área:** `wellness`
   - **Dias de validade:** `365` (1 ano)
3. Clique em **"Criar Plano Gratuito"**

Isso vai:
- ✅ Criar a conta dela (se não existir)
- ✅ Criar o perfil
- ✅ Criar assinatura anual válida por 365 dias

---

## 🔍 VERIFICAÇÃO (Opcional)

Execute no **Supabase SQL Editor** para verificar:

```sql
-- Verificar se usuário foi criado
SELECT 
  u.id as user_id,
  u.email,
  u.created_at,
  up.nome_completo,
  up.perfil
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE LOWER(u.email) = LOWER('evsnutrivibe@gmail.com');

-- Verificar assinatura
SELECT 
  s.id,
  s.user_id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.amount
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.user_id
WHERE LOWER(up.email) = LOWER('evsnutrivibe@gmail.com')
ORDER BY s.created_at DESC;
```

---

## 💰 SOBRE O PAGAMENTO DO MERCADO PAGO

O pagamento que ela fez no Mercado Pago pode:
1. **Ser processado automaticamente** quando o webhook chegar (se a conta existir)
2. **Ficar pendente** se a conta não existir quando o webhook chegar
3. **Ser vinculado manualmente** depois (se necessário)

**Recomendação:** Após criar a conta e assinatura pelo admin, verifique se o pagamento do Mercado Pago foi vinculado automaticamente. Se não, você pode:
- Aguardar o webhook processar novamente
- Ou criar a assinatura manualmente pelo admin (já feito acima)

---

## 📝 PRÓXIMOS PASSOS

1. ✅ Criar conta e assinatura pelo admin (Passo 1 acima)
2. ✅ Informar a Érika que a conta foi criada
3. ✅ Ela pode fazer login com: `evsnutrivibe@gmail.com` e a senha que receber por email
4. ✅ Se ela não receber email de senha, você pode resetar a senha pelo admin

---

## 🔐 RESETAR SENHA (Se necessário)

Se ela não conseguir fazer login:
1. Acesse: `/admin` → Usuários
2. Busque por: `evsnutrivibe@gmail.com`
3. Clique em "Resetar Senha"
4. Ou use a página de recuperação: `/pt/wellness/recuperar-senha`
