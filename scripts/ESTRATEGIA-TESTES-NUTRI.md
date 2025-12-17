# 🧪 ESTRATÉGIA DE TESTES - Área Nutri

## 🎯 **CENÁRIOS DE TESTE**

Vamos criar **3 usuários de teste** para cobrir os principais fluxos:

### **1. Usuário Novo (Sem Diagnóstico)**
- **Email:** `nutri1@ylada.com`
- **Senha:** `senha123`
- **Estado:** Sem diagnóstico, sem assinatura
- **Testa:** Login → Onboarding → Diagnóstico → Home

### **2. Usuário com Diagnóstico (Sem Assinatura)**
- **Email:** `nutri2@ylada.com`
- **Senha:** `senha123`
- **Estado:** Com diagnóstico, sem assinatura
- **Testa:** Login → Checkout (deve aparecer) → Fluxo de pagamento

### **3. Usuário Completo (Com Diagnóstico + Assinatura)**
- **Email:** `nutri3@ylada.com`
- **Senha:** `senha123`
- **Estado:** Com diagnóstico, com assinatura
- **Testa:** Login → Home → Dashboard completo → Todas as funcionalidades

---

## 🚀 **PASSO A PASSO - CRIAR USUÁRIOS**

### **Método Rápido (Recomendado)**

#### **Passo 1: Criar Usuários no Supabase Dashboard**

1. Acesse: **Supabase Dashboard** → **Authentication** → **Users**
2. Clique em **"Add User"** (3 vezes, uma para cada usuário)

**Usuário 1:**
- Email: `nutri1@ylada.com`
- Password: `senha123`
- **Auto Confirm User:** ✅ (MARCAR!)
- Clique em **"Create User"**

**Usuário 2:**
- Email: `nutri2@ylada.com`
- Password: `senha123`
- **Auto Confirm User:** ✅ (MARCAR!)
- Clique em **"Create User"**

**Usuário 3:**
- Email: `nutri3@ylada.com`
- Password: `senha123`
- **Auto Confirm User:** ✅ (MARCAR!)
- Clique em **"Create User"**

✅ **Pronto! 3 usuários criados.**

---

#### **Passo 2: Criar Perfis (Execute no SQL Editor)**

Execute este script no **Supabase SQL Editor**:

```sql
-- Criar perfis para os 3 usuários de teste
DO $$
DECLARE
  v_user_id UUID;
  usuarios_teste TEXT[][] := ARRAY[
    ['nutri1@ylada.com', 'Nutricionista Teste 1', false],  -- Sem diagnóstico
    ['nutri2@ylada.com', 'Nutricionista Teste 2', true],  -- Com diagnóstico
    ['nutri3@ylada.com', 'Nutricionista Teste 3', true]   -- Com diagnóstico
  ];
  usuario TEXT[];
BEGIN
  FOREACH usuario SLICE 1 IN ARRAY usuarios_teste
  LOOP
    -- Buscar user_id
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = usuario[1];

    IF v_user_id IS NULL THEN
      RAISE NOTICE '⚠️ Usuário não encontrado: %', usuario[1];
      CONTINUE;
    END IF;

    -- Criar/atualizar perfil
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
      usuario[1],
      usuario[2],
      'nutri',
      (usuario[3] = 'true'),
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE
    SET 
      perfil = 'nutri',
      diagnostico_completo = (usuario[3] = 'true'),
      updated_at = NOW();

    RAISE NOTICE '✅ Perfil criado/atualizado: %', usuario[1];
  END LOOP;
END $$;

-- Verificar se funcionou
SELECT 
  au.email,
  up.nome_completo,
  up.perfil,
  CASE 
    WHEN up.diagnostico_completo = true THEN '✅ Com diagnóstico'
    ELSE '❌ Sem diagnóstico'
  END as status_diagnostico
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN ('nutri1@ylada.com', 'nutri2@ylada.com', 'nutri3@ylada.com')
ORDER BY au.email;
```

✅ **Pronto! Perfis criados.**

---

#### **Passo 3: Configurar Usuário 2 e 3 (Com Diagnóstico)**

Execute este script para criar diagnósticos para nutri2 e nutri3:

```sql
-- Criar diagnósticos para nutri2 e nutri3
DO $$
DECLARE
  v_user_id UUID;
  usuarios_com_diagnostico TEXT[] := ARRAY['nutri2@ylada.com', 'nutri3@ylada.com'];
  v_email TEXT;
BEGIN
  FOREACH v_email IN ARRAY usuarios_com_diagnostico
  LOOP
    -- Buscar user_id
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_email;

    IF v_user_id IS NULL THEN
      RAISE NOTICE '⚠️ Usuário não encontrado: %', v_email;
      CONTINUE;
    END IF;

    -- Criar diagnóstico básico
    INSERT INTO nutri_diagnostico (
      user_id,
      perfil_atual,
      experiencia_anos,
      tipo_atendimento,
      faturamento_mensal,
      principais_desafios,
      objetivos_principais,
      created_at,
      updated_at
    )
    VALUES (
      v_user_id,
      'consultoria_individual',
      3,
      'presencial_online',
      5000,
      ARRAY['captacao', 'organizacao'],
      ARRAY['aumentar_faturamento', 'organizar_atendimentos'],
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;

    -- Atualizar flag no perfil
    UPDATE user_profiles 
    SET diagnostico_completo = true 
    WHERE user_id = v_user_id;

    RAISE NOTICE '✅ Diagnóstico criado para: %', v_email;
  END LOOP;
END $$;
```

✅ **Pronto! Usuários 2 e 3 têm diagnóstico.**

---

#### **Passo 4: Configurar Usuário 3 (Com Assinatura)**

Execute este script para criar assinatura para nutri3:

```sql
-- Criar assinatura para nutri3@ylada.com
DO $$
DECLARE
  v_user_id UUID;
  v_subscription_id UUID;
BEGIN
  -- Buscar user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'nutri3@ylada.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Usuário nutri3@ylada.com não encontrado!';
  END IF;

  -- Criar assinatura ativa
  INSERT INTO subscriptions (
    user_id,
    area,
    plan_type,
    status,
    current_period_start,
    current_period_end,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    'nutri',
    'annual',
    'active',
    NOW(),
    NOW() + INTERVAL '1 year',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id, area) DO UPDATE
  SET 
    status = 'active',
    current_period_end = NOW() + INTERVAL '1 year',
    updated_at = NOW();

  RAISE NOTICE '✅ Assinatura criada para: nutri3@ylada.com';
END $$;

-- Verificar
SELECT 
  au.email,
  s.status,
  s.plan_type,
  s.current_period_end
FROM auth.users au
JOIN subscriptions s ON au.id = s.user_id
WHERE au.email = 'nutri3@ylada.com' AND s.area = 'nutri';
```

✅ **Pronto! Usuário 3 tem assinatura.**

---

## 🧪 **COMO TESTAR**

### **Teste 1: Usuário Novo (nutri1@ylada.com)**

1. Acesse: `http://localhost:3000/pt/nutri/login`
2. Login: `nutri1@ylada.com` / `senha123`
3. **Esperado:** Redireciona para `/pt/nutri/onboarding`
4. Clique em "Começar meu Diagnóstico Estratégico"
5. Complete o diagnóstico
6. **Esperado:** Redireciona para `/pt/nutri/home`
7. Verifique dashboard simplificado (Dia 1)

---

### **Teste 2: Usuário com Diagnóstico (nutri2@ylada.com)**

1. Acesse: `http://localhost:3000/pt/nutri/login`
2. Login: `nutri2@ylada.com` / `senha123`
3. **Esperado:** Redireciona para `/pt/nutri/checkout` (sem assinatura)
4. Verifique se a página de checkout aparece corretamente
5. Teste o botão "Voltar" (deve ir para `/pt/nutri`)
6. Verifique preços (R$ 297/mês e 12× R$ 197)

---

### **Teste 3: Usuário Completo (nutri3@ylada.com)**

1. Acesse: `http://localhost:3000/pt/nutri/login`
2. Login: `nutri3@ylada.com` / `senha123`
3. **Esperado:** Redireciona para `/pt/nutri/home`
4. Verifique dashboard completo
5. Teste sidebar (deve mostrar todas as opções)
6. Teste chat LYA
7. Teste todas as funcionalidades

---

## 🔄 **RESETAR PARA TESTAR NOVAMENTE**

### **Resetar Usuário 1 (Voltar ao estado inicial)**

```sql
-- Execute: scripts/02-resetar-nutri1.sql
-- Ou use o script genérico abaixo
```

### **Resetar Todos os Usuários de Teste**

```sql
-- Resetar nutri1, nutri2 e nutri3
DO $$
DECLARE
  v_user_id UUID;
  usuarios TEXT[] := ARRAY['nutri1@ylada.com', 'nutri2@ylada.com', 'nutri3@ylada.com'];
  v_email TEXT;
BEGIN
  FOREACH v_email IN ARRAY usuarios
  LOOP
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_email;

    IF v_user_id IS NULL THEN
      CONTINUE;
    END IF;

    -- Deletar diagnóstico
    DELETE FROM nutri_diagnostico WHERE user_id = v_user_id;
    
    -- Resetar flag no perfil
    UPDATE user_profiles 
    SET diagnostico_completo = false 
    WHERE user_id = v_user_id;

    -- Deletar progresso da jornada
    DELETE FROM journey_progress WHERE user_id = v_user_id;

    -- Deletar perfil estratégico
    DELETE FROM nutri_perfil_estrategico WHERE user_id = v_user_id;

    -- Deletar análises da LYA
    DELETE FROM lya_analise_nutri WHERE user_id = v_user_id;

    -- Deletar assinatura (se existir)
    DELETE FROM subscriptions WHERE user_id = v_user_id AND area = 'nutri';

    RAISE NOTICE '✅ Resetado: %', v_email;
  END LOOP;
END $$;
```

---

## 📋 **CHECKLIST DE TESTES**

### **Usuário 1 (Novo)**
- [ ] Login funciona
- [ ] Redireciona para onboarding
- [ ] Pode completar diagnóstico
- [ ] Redireciona para home após diagnóstico
- [ ] Dashboard simplificado aparece

### **Usuário 2 (Com Diagnóstico, Sem Assinatura)**
- [ ] Login funciona
- [ ] Redireciona para checkout
- [ ] Página de checkout aparece corretamente
- [ ] Preços estão corretos
- [ ] Botão "Voltar" funciona

### **Usuário 3 (Completo)**
- [ ] Login funciona
- [ ] Redireciona para home
- [ ] Dashboard completo aparece
- [ ] Sidebar mostra todas as opções
- [ ] Chat LYA funciona
- [ ] Todas as funcionalidades acessíveis

---

## 🎯 **RESUMO RÁPIDO**

**3 Usuários:**
1. `nutri1@ylada.com` - Novo (sem diagnóstico)
2. `nutri2@ylada.com` - Com diagnóstico (sem assinatura)
3. `nutri3@ylada.com` - Completo (com diagnóstico + assinatura)

**Senha:** `senha123` (para todos)

**Criar:** Dashboard → Authentication → Add User (3x)
**Perfis:** Execute script SQL do Passo 2
**Diagnóstico:** Execute script SQL do Passo 3 (nutri2 e nutri3)
**Assinatura:** Execute script SQL do Passo 4 (nutri3)

---

**Agora você tem uma estratégia completa de testes! 🚀**


