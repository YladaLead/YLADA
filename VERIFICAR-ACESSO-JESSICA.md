# 🔐 Verificar Acesso da Jessica Souza

**Email:** `jessica.souza17@yahoo.com`  
**Área:** Nutri  
**Situação:** Primeira pessoa do caso nutri que comprou a plataforma, conta criada manualmente

---

## ✅ PASSO 1: Executar Script de Verificação

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor** → **New Query**
3. Abra o arquivo: `VERIFICAR-ACESSO-JESSICA.sql`
4. Copie TODO o conteúdo
5. Cole no editor SQL
6. Clique em **Run**

O script vai verificar:
- ✅ Se o usuário existe no Supabase Auth
- ✅ Se o email está confirmado
- ✅ Se o perfil foi criado corretamente
- ✅ Se a assinatura está ativa
- ✅ Se o diagnóstico está completo (se necessário)

---

## 📋 PASSO 2: Verificar Resultados

Após executar o script, verifique os resultados de cada seção:

### **Seção 1: Verificação Completa do Usuário**
- ✅ **Email confirmado:** Deve aparecer "✅ Email confirmado"
- ✅ **Perfil OK:** Deve aparecer "✅ Perfil OK"
- ✅ **Perfil:** Deve ser `nutri`
- ✅ **Ativo:** `is_active` deve ser `true`

### **Seção 2: Verificação de Assinatura**
- ✅ **Status:** Deve aparecer "✅ Assinatura ATIVA"
- ✅ **Status da assinatura:** Deve ser `active`
- ✅ **Válida até:** `current_period_end` deve ser uma data futura

### **Seção 3: Verificação de Diagnóstico**
- ⚠️ **Diagnóstico:** Pode estar incompleto se for primeiro acesso (isso é normal)
- Se não tiver diagnóstico, o usuário será redirecionado para `/pt/nutri/onboarding`

### **Seção 4: Resumo Final**
- ✅ **Status geral:** Deve aparecer "✅ TUDO OK - Conta configurada corretamente!"

---

## 🔧 PASSO 3: Corrigir Problemas (se necessário)

### **Problema 1: Usuário não existe no Supabase Auth**

**Solução:**
1. Vá em **Authentication** → **Users**
2. Clique em **"Add User"**
3. Preencha:
   - **Email:** `jessica.souza17@yahoo.com`
   - **Password:** [Defina uma senha temporária - você vai enviar para ela]
   - **Auto Confirm User:** ✅ **MARCAR ESTA OPÇÃO!**
4. Clique em **"Create User"**
5. Execute o script novamente

---

### **Problema 2: Email não confirmado**

**Solução:**
1. Vá em **Authentication** → **Users**
2. Procure por `jessica.souza17@yahoo.com`
3. Clique no usuário
4. Clique em **"Confirm Email"** (ou envie o email de confirmação)

---

### **Problema 3: Perfil não existe ou está incorreto**

**Solução:**
O script já tenta corrigir automaticamente na Seção 5.1. Se ainda assim não funcionar:

1. Execute manualmente no SQL Editor:

```sql
INSERT INTO user_profiles (user_id, perfil, email, nome_completo, is_active)
SELECT 
  au.id,
  'nutri',
  'jessica.souza17@yahoo.com',
  'Jessica Souza',
  true
FROM auth.users au
WHERE LOWER(au.email) = LOWER('jessica.souza17@yahoo.com')
ON CONFLICT (user_id) 
DO UPDATE SET
  perfil = 'nutri',
  email = 'jessica.souza17@yahoo.com',
  is_active = true,
  updated_at = NOW();
```

---

### **Problema 4: Sem assinatura ou assinatura inativa**

**Solução:**
O script já tenta corrigir automaticamente na Seção 5.2. Se ainda assim não funcionar:

1. Execute manualmente no SQL Editor (ajuste o plano conforme necessário):

```sql
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER('jessica.souza17@yahoo.com');

  IF v_user_id IS NOT NULL THEN
    INSERT INTO subscriptions (
      user_id,
      area,
      plan_type,
      status,
      current_period_start,
      current_period_end
    )
    VALUES (
      v_user_id,
      'nutri',
      'annual', -- ou 'monthly' conforme o plano comprado
      'active',
      NOW(),
      NOW() + INTERVAL '1 year' -- Ajuste conforme necessário
    )
    ON CONFLICT (user_id, area) DO UPDATE
    SET 
      status = 'active',
      current_period_end = GREATEST(current_period_end, NOW() + INTERVAL '1 year'),
      updated_at = NOW();
  END IF;
END $$;
```

---

## ✅ PASSO 4: Verificação Final

Após fazer as correções, execute novamente a **Seção 6** do script (ou execute o script completo novamente) para verificar se tudo está OK.

**Resultado esperado:**
- ✅ Email confirmado: `true`
- ✅ Perfil correto: `true`
- ✅ Perfil ativo: `true`
- ✅ Assinatura ativa: `true`
- ✅ Assinatura válida: `true`
- ✅ Status final: "✅ TUDO OK!"

---

## 🧪 PASSO 5: Testar o Acesso

1. Abra uma janela anônima do navegador (ou faça logout se estiver logado)
2. Acesse: `https://ylada.app/pt/nutri/login` (ou `http://localhost:3000/pt/nutri/login` se estiver em desenvolvimento)
3. Faça login com:
   - **Email:** `jessica.souza17@yahoo.com`
   - **Senha:** [senha que você definiu]
4. **Fluxo esperado:**
   - Se **NÃO tem diagnóstico:** Será redirecionada para `/pt/nutri/onboarding` (isso é normal para primeiro acesso)
   - Se **TEM diagnóstico:** Será redirecionada para `/pt/nutri/home`

---

## 📧 PASSO 6: Enviar Credenciais para a Jessica

Após verificar que tudo está funcionando, envie para ela:

**Email:**
```
Olá Jessica!

Sua conta na plataforma Ylada foi criada com sucesso! 

Acesse: https://ylada.app/pt/nutri/login

Credenciais:
- Email: jessica.souza17@yahoo.com
- Senha: [senha que você definiu]

No primeiro acesso, você será direcionada para completar seu diagnóstico estratégico. Após isso, terá acesso completo à plataforma.

Qualquer dúvida, estou à disposição!
```

---

## 📝 CHECKLIST FINAL

Antes de considerar tudo pronto, verifique:

- [ ] Usuário criado no Supabase Auth
- [ ] Email confirmado
- [ ] Perfil criado com `perfil = 'nutri'`
- [ ] Perfil ativo (`is_active = true`)
- [ ] Assinatura criada e ativa
- [ ] Assinatura válida (data de expiração no futuro)
- [ ] Login testado e funcionando
- [ ] Credenciais enviadas para a Jessica

---

## ⚠️ OBSERVAÇÕES IMPORTANTES

1. **Diagnóstico:** Se a Jessica não completou o diagnóstico ainda, ela será redirecionada para `/pt/nutri/onboarding`. Isso é **normal** e esperado.

2. **Assinatura:** A assinatura deve estar ativa para ela ter acesso completo. Se ela comprou a plataforma, certifique-se de que a assinatura está configurada corretamente.

3. **Senha:** Se você definiu uma senha temporária, a Jessica pode alterá-la depois no perfil dela.

4. **Primeiro acesso:** No primeiro acesso, ela pode precisar completar o diagnóstico estratégico antes de ter acesso total à plataforma.

---

## 🆘 Se algo não funcionar

1. Verifique os logs do Supabase (Logs → Postgres Logs)
2. Verifique os logs da aplicação (se estiver rodando)
3. Execute o script de verificação novamente
4. Verifique se não há erros nas queries SQL
