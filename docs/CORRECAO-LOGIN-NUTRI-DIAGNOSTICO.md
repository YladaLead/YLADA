# ✅ CORREÇÃO: Login Nutri - Verificação de Diagnóstico

## 🐛 **PROBLEMA IDENTIFICADO**

### **Sintoma:**
- Usuário `nutri1@ylada.com` faz login com sucesso
- Mas não consegue acessar a área protegida
- Sistema redireciona para `/pt/nutri` (página de vendas) ao invés de `/pt/nutri/home` ou `/pt/nutri/onboarding`

### **Causa:**
1. O usuário `nutri1@ylada.com` foi criado **sem diagnóstico completo** (`diagnostico_completo = false`)
2. O `LoginForm` estava redirecionando para `/pt/nutri/home` (padrão) **sem verificar se o usuário tem diagnóstico**
3. Quando tentava acessar `/pt/nutri/home`, o `RequireDiagnostico` detectava falta de diagnóstico e redirecionava para `/pt/nutri/onboarding`
4. Mas o redirecionamento inicial estava indo para `/pt/nutri` (página de vendas) porque essa era a última página visitada

---

## ✅ **CORREÇÃO APLICADA**

### **Arquivo:** `src/components/auth/LoginForm.tsx`

**Mudanças:**

1. **Verificação de Diagnóstico para Área Nutri:**
   - Antes de redirecionar, verifica se o usuário Nutri tem `diagnostico_completo`
   - Se **não tiver diagnóstico** → redireciona para `/pt/nutri/onboarding`
   - Se **tiver diagnóstico** → redireciona para `/pt/nutri/home`

2. **Exclusão de Páginas de Vendas:**
   - Páginas de vendas (`/pt/nutri`, `/pt/coach`, etc.) são **sempre ignoradas** no redirecionamento após login
   - Sempre usa o `baseRedirectPath` (que agora verifica diagnóstico) ao invés de páginas de vendas

3. **Exclusão de Onboarding:**
   - Se a última página visitada for `/onboarding`, não usa ela (sempre verifica diagnóstico novamente)

**Código adicionado:**
```typescript
// 🚀 NOVO: Para área Nutri, verificar diagnóstico antes de redirecionar
let baseRedirectPath = redirectPath
if (perfil === 'nutri') {
  try {
    const { data: nutriProfile } = await supabase
      .from('user_profiles')
      .select('diagnostico_completo')
      .eq('user_id', session.user.id)
      .maybeSingle()
    
    // Se não tem diagnóstico, redirecionar para onboarding
    if (!nutriProfile?.diagnostico_completo) {
      baseRedirectPath = '/pt/nutri/onboarding'
      console.log('ℹ️ Usuário Nutri sem diagnóstico, redirecionando para onboarding')
    } else {
      baseRedirectPath = '/pt/nutri/home'
      console.log('✅ Usuário Nutri com diagnóstico, redirecionando para home')
    }
  } catch (diagnosticoError) {
    console.warn('⚠️ Erro ao verificar diagnóstico, usando redirectPath padrão:', diagnosticoError)
    // Em caso de erro, usar redirectPath padrão
  }
}
```

---

## 🧪 **TESTE**

### **Cenário 1: Usuário Nutri SEM Diagnóstico**
1. Criar usuário `nutri1@ylada.com` sem diagnóstico (usar script `01-criar-perfil-nutri1.sql`)
2. Fazer login com `nutri1@ylada.com` / `senha123`
3. **Esperado:** Deve redirecionar para `/pt/nutri/onboarding`
4. Usuário deve ver a página de onboarding e poder iniciar o diagnóstico

### **Cenário 2: Usuário Nutri COM Diagnóstico**
1. Criar usuário com diagnóstico completo
2. Fazer login
3. **Esperado:** Deve redirecionar para `/pt/nutri/home`
4. Usuário deve ver o dashboard normalmente

### **Cenário 3: Última Página Visitada é Página de Vendas**
1. Acessar `/pt/nutri` (página de vendas)
2. Fazer login
3. **Esperado:** Deve **ignorar** a página de vendas e redirecionar para onboarding ou home (baseado no diagnóstico)

---

## 📋 **ARQUIVOS MODIFICADOS**

1. ✅ `src/components/auth/LoginForm.tsx` - Verificação de diagnóstico para área Nutri

---

## ✅ **BENEFÍCIOS**

1. **Fluxo correto de onboarding:** Usuários sem diagnóstico vão direto para onboarding
2. **Evita redirecionamentos desnecessários:** Não redireciona para home se não tem diagnóstico
3. **Melhor UX:** Usuário vê imediatamente o que precisa fazer (completar diagnóstico)
4. **Consistência:** Mesma lógica do `auth/callback/route.ts` aplicada no `LoginForm`

---

## ⚠️ **NOTAS IMPORTANTES**

- A verificação de diagnóstico é feita **apenas para área Nutri** (outras áreas não têm esse requisito)
- Em caso de erro na verificação, usa o `redirectPath` padrão (fail-safe)
- O `RequireDiagnostico` continua funcionando como proteção adicional nas páginas protegidas

---

**Última atualização:** 16/12/2025
**Status:** ✅ Completo


