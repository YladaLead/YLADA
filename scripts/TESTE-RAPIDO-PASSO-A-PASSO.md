# 🚀 TESTE RÁPIDO - Passo a Passo Completo

## 📧 **EMAIL DE TESTE PRONTO**

**Email:** `nutri1@ylada.com`  
**Senha:** `senha123`

---

## ✅ **PASSO 1: Criar Usuário no Supabase**

1. Abra o **Supabase Dashboard**
2. Vá em **Authentication** → **Users**
3. Clique no botão **"Add User"** (ou "Invite User")
4. Preencha:
   - **Email:** `nutri1@ylada.com`
   - **Password:** `senha123`
   - **Auto Confirm User:** ✅ **MARQUE ESTA OPÇÃO!**
5. Clique em **"Create User"**

✅ **Pronto! Usuário criado.**

---

## ✅ **PASSO 2: Criar Perfil do Usuário**

1. Abra o **Supabase SQL Editor**
2. Cole o script abaixo e execute:

```sql
-- Criar perfil para nutri1@ylada.com
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'nutri1@ylada.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado! Crie primeiro no Dashboard.';
  END IF;

  -- Criar perfil
  INSERT INTO user_profiles (
    user_id,
    email,
    nome_completo,
    perfil,
    diagnostico_completo,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    'nutri1@ylada.com',
    'Nutricionista Teste 1',
    'nutri',
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    perfil = 'nutri',
    diagnostico_completo = false,
    updated_at = NOW();

  RAISE NOTICE '✅ Perfil criado com sucesso!';
END $$;
```

✅ **Pronto! Perfil criado.**

---

## ✅ **PASSO 3: Fazer Login e Testar**

1. Abra o navegador
2. Acesse: `http://localhost:3000/pt/nutri/login`
3. Faça login com:
   - **Email:** `nutri1@ylada.com`
   - **Senha:** `senha123`
4. Você deve ser redirecionado para `/pt/nutri/onboarding`
5. Clique em **"Começar meu Diagnóstico Estratégico"**
6. Complete o diagnóstico
7. Teste o fluxo completo!

✅ **Pronto! Testando!**

---

## 🔄 **PASSO 4: Resetar para Testar Novamente**

Quando quiser resetar e testar tudo de novo:

1. Abra o **Supabase SQL Editor**
2. Cole o script abaixo e execute:

```sql
-- Resetar nutri1@ylada.com
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'nutri1@ylada.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado!';
  END IF;

  -- 1. Deletar diagnóstico
  DELETE FROM nutri_diagnostico WHERE user_id = v_user_id;
  
  -- 2. Resetar flag no perfil
  UPDATE user_profiles 
  SET diagnostico_completo = false 
  WHERE user_id = v_user_id;

  -- 3. Deletar progresso da jornada
  DELETE FROM journey_progress WHERE user_id = v_user_id;

  -- 4. Deletar perfil estratégico
  DELETE FROM nutri_perfil_estrategico WHERE user_id = v_user_id;

  -- 5. Deletar análises da LYA
  DELETE FROM lya_analise_nutri WHERE user_id = v_user_id;

  RAISE NOTICE '✅ Reset completo! Pode testar novamente.';
END $$;
```

✅ **Pronto! Resetado. Pode testar de novo!**

---

## 📋 **CHECKLIST RÁPIDO**

- [ ] Criou usuário no Dashboard (`nutri1@ylada.com` / `senha123`)
- [ ] Executou script de criar perfil
- [ ] Fez login no localhost
- [ ] Testou o fluxo completo
- [ ] Resetou quando precisou testar de novo

---

## 🎯 **O QUE TESTAR**

1. ✅ Login funciona
2. ✅ Redireciona para onboarding (sem diagnóstico)
3. ✅ Pode completar diagnóstico
4. ✅ Redireciona para home após diagnóstico
5. ✅ Dashboard simplificado aparece (Dia 1)
6. ✅ Sidebar mostra apenas itens da Fase 1
7. ✅ Chat LYA aparece após completar Dia 1

---

**Agora é só seguir os passos! 🚀**


