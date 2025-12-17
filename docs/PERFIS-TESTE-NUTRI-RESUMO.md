# 📋 RESUMO DOS PERFIS DE TESTE - Área Nutri

## 🎯 **OS 3 PERFIS DE TESTE**

### **1. nutri1@ylada.com** - Usuário Novo (Sem Diagnóstico)
- **Email:** `nutri1@ylada.com`
- **Senha:** `senha123`
- **Nome:** Nutricionista Teste 1
- **Perfil:** `nutri`
- **Diagnóstico:** ❌ **SEM diagnóstico** (`diagnostico_completo = false`)
- **Assinatura:** ❌ **SEM assinatura**
- **Estado:** Usuário recém-criado, precisa completar onboarding

**Fluxo esperado:**
1. Login → `/pt/nutri/onboarding` (página de boas-vindas)
2. Completar diagnóstico estratégico
3. Após diagnóstico → `/pt/nutri/checkout` (precisa assinar)
4. Após assinatura → `/pt/nutri/home` (dashboard completo)

**Use para testar:**
- ✅ Fluxo de onboarding completo
- ✅ Página de onboarding
- ✅ Formulário de diagnóstico
- ✅ Redirecionamento após diagnóstico

---

### **2. nutri2@ylada.com** - Com Diagnóstico (Sem Assinatura)
- **Email:** `nutri2@ylada.com`
- **Senha:** `senha123`
- **Nome:** Nutricionista Teste 2
- **Perfil:** `nutri`
- **Diagnóstico:** ✅ **COM diagnóstico** (`diagnostico_completo = true`)
- **Assinatura:** ❌ **SEM assinatura**
- **Estado:** Diagnóstico completo, mas precisa assinar para acessar dashboard

**Detalhes do diagnóstico:**
- Perfil atual: `consultoria_individual`
- Experiência: 3 anos
- Tipo de atendimento: `presencial_online`
- Faturamento mensal: R$ 5.000
- Desafios: `['captacao', 'organizacao']`
- Objetivos: `['aumentar_faturamento', 'organizar_atendimentos']`

**Fluxo esperado:**
1. Login → `/pt/nutri/checkout` (redirecionado para checkout)
2. Após assinatura → `/pt/nutri/home` (dashboard completo)

**Use para testar:**
- ✅ Redirecionamento para checkout quando tem diagnóstico mas não tem assinatura
- ✅ Fluxo de pagamento
- ✅ Proteção de rotas protegidas

---

### **3. nutri3@ylada.com** - Usuário Completo (Com Diagnóstico + Assinatura)
- **Email:** `nutri3@ylada.com`
- **Senha:** `senha123`
- **Nome:** Nutricionista Teste 3
- **Perfil:** `nutri`
- **Diagnóstico:** ✅ **COM diagnóstico** (`diagnostico_completo = true`)
- **Assinatura:** ✅ **COM assinatura ativa** (`status = 'active'`, `plan_type = 'annual'`)
- **Estado:** Usuário completo, acesso total à plataforma

**Detalhes do diagnóstico:**
- Perfil atual: `consultoria_individual`
- Experiência: 3 anos
- Tipo de atendimento: `presencial_online`
- Faturamento mensal: R$ 5.000
- Desafios: `['captacao', 'organizacao']`
- Objetivos: `['aumentar_faturamento', 'organizar_atendimentos']`

**Detalhes da assinatura:**
- Status: `active`
- Plano: `annual` (anual)
- Período: 1 ano (de hoje até 1 ano a partir de hoje)

**Fluxo esperado:**
1. Login → `/pt/nutri/home` (dashboard completo)
2. Acesso total a todas as funcionalidades
3. Sem redirecionamentos para checkout ou onboarding

**Use para testar:**
- ✅ Dashboard completo
- ✅ Todas as funcionalidades da plataforma
- ✅ Sidebar progressivo
- ✅ LYA (assistente IA)
- ✅ Jornada de progresso
- ✅ Todas as rotas protegidas

---

## 🔑 **CREDENCIAIS RESUMIDAS**

| Email | Senha | Diagnóstico | Assinatura | Uso Principal |
|-------|-------|-------------|------------|---------------|
| `nutri1@ylada.com` | `senha123` | ❌ Não | ❌ Não | Testar onboarding |
| `nutri2@ylada.com` | `senha123` | ✅ Sim | ❌ Não | Testar checkout |
| `nutri3@ylada.com` | `senha123` | ✅ Sim | ✅ Sim | Testar dashboard completo |

---

## 📝 **SCRIPTS SQL PARA CONFIGURAR**

### **Ordem de execução:**

1. **Criar usuários no Supabase Dashboard** (Authentication → Users)
   - Criar manualmente os 3 usuários com "Auto Confirm User" marcado

2. **Criar perfis:** `scripts/03-criar-todos-usuarios-teste.sql`
   - Cria os perfis na tabela `user_profiles`
   - Define `diagnostico_completo` para cada um

3. **Criar diagnósticos:** `scripts/04-configurar-diagnosticos-teste.sql`
   - Cria diagnósticos completos para `nutri2` e `nutri3`
   - Atualiza `diagnostico_completo = true`

4. **Criar assinatura:** `scripts/05-configurar-assinatura-nutri3.sql`
   - Cria assinatura ativa apenas para `nutri3`

---

## 🔄 **RESETAR USUÁRIOS DE TESTE**

Para resetar todos os usuários para o estado inicial:

```sql
-- Execute: scripts/06-resetar-todos-usuarios-teste.sql
```

Isso vai:
- ❌ Remover diagnósticos de `nutri2` e `nutri3`
- ❌ Remover assinatura de `nutri3`
- ✅ Manter os perfis básicos (`diagnostico_completo = false` para todos)

---

## ✅ **VERIFICAR STATUS DOS PERFIS**

Execute no Supabase SQL Editor:

```sql
SELECT 
  au.email,
  up.nome_completo,
  up.perfil,
  CASE 
    WHEN up.diagnostico_completo = true THEN '✅ Com diagnóstico'
    ELSE '❌ Sem diagnóstico'
  END as status_diagnostico,
  CASE 
    WHEN s.status = 'active' THEN '✅ Com assinatura'
    ELSE '❌ Sem assinatura'
  END as status_assinatura
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN subscriptions s ON au.id = s.user_id AND s.area = 'nutri'
WHERE au.email IN ('nutri1@ylada.com', 'nutri2@ylada.com', 'nutri3@ylada.com')
ORDER BY au.email;
```

---

**Última atualização:** 17/12/2025
**Status:** ✅ Perfis configurados e prontos para teste
