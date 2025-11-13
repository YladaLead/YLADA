# 🔐 Como Resetar Senha do Admin via Supabase Dashboard

## ✅ Status Atual

- ✅ Email: `faulaandre@gmail.com`
- ✅ É Admin: `is_admin = true`
- ✅ Email confirmado: `2025-10-31`
- ✅ Último login: `2025-11-12`

**O problema é a senha, não o status admin.**

---

## 🔄 Resetar Senha via Supabase Dashboard

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Faça login na sua conta Supabase

2. **Vá para Authentication**
   - No menu lateral, clique em **"Authentication"**
   - Depois clique em **"Users"**

3. **Encontre seu usuário**
   - Procure por: `faulaandre@gmail.com`
   - Ou use a busca para encontrar rapidamente

4. **Resetar Senha**
   - Clique nos **"..."** (três pontos) ao lado do usuário
   - Selecione **"Reset Password"**
   - Um email será enviado para `faulaandre@gmail.com`

5. **Verificar Email**
   - Abra sua caixa de entrada
   - Procure por email do Supabase
   - Clique no link de reset de senha
   - Defina uma nova senha

6. **Fazer Login**
   - Acesse: `https://www.ylada.com/admin/login`
   - Email: `faulaandre@gmail.com`
   - Senha: A nova senha que você definiu

---

## 🔄 Alternativa: Resetar via API (se tiver acesso)

Se você tiver acesso a outro admin ou puder executar via terminal:

```bash
curl -X POST https://www.ylada.com/api/admin/reset-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -d '{
    "email": "faulaandre@gmail.com"
  }'
```

**Nota:** Isso requer que você já esteja logado como admin em outro lugar.

---

## 🆘 Se não receber o email de reset

1. **Verificar Spam/Lixo Eletrônico**
   - Procure na pasta de spam
   - Procure por "Supabase" ou "Reset Password"

2. **Verificar Email no Supabase**
   - No Dashboard > Authentication > Users
   - Verifique se o email está correto: `faulaandre@gmail.com`

3. **Tentar novamente**
   - Clique em "Reset Password" novamente
   - Aguarde alguns minutos

4. **Contato com Suporte Supabase**
   - Se nada funcionar, entre em contato com o suporte do Supabase

---

## ✅ Após Resetar a Senha

1. Faça login em: `https://www.ylada.com/admin/login`
2. Email: `faulaandre@gmail.com`
3. Senha: A nova senha que você definiu
4. Você deve ser redirecionado para `/admin`

---

## 📝 Notas Importantes

- ✅ Seu status admin está correto (`is_admin = true`)
- ✅ Seu email está confirmado
- ✅ O problema é apenas a senha
- ✅ O reset via Supabase Dashboard é a forma mais segura

---

## 🔗 Links Úteis

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Login Admin:** https://www.ylada.com/admin/login
- **Documentação:** `docs/SOLUCAO-PROBLEMA-ACESSO-ADMIN.md`

