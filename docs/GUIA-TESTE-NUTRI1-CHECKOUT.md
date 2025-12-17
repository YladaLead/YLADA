# 🔍 GUIA DE TESTE: nutri1@ylada.com → Checkout

## 📋 **PROBLEMA**
O usuário `nutri1@ylada.com` (sem diagnóstico) está sendo redirecionado para `/pt/nutri/checkout` após login, quando deveria ir para `/pt/nutri/onboarding`.

---

## ✅ **CORREÇÕES APLICADAS**

### **1. Priorização da Verificação de Diagnóstico**
**Arquivo:** `src/lib/auth-server.ts`

**Mudança:**
- **ANTES:** Verificava rotas excluídas primeiro, depois diagnóstico
- **AGORA:** Verifica diagnóstico primeiro (mais importante), depois rotas excluídas

**Lógica:**
```typescript
// PRIORIDADE 1: Se usuário Nutri sem diagnóstico → SEMPRE permitir acesso
if (area === 'nutri' && !profile.diagnostico_completo) {
  hasSubscription = true // Virtualmente "tem assinatura"
}
// PRIORIDADE 2: Se for rota excluída → permitir acesso
else if (isExcludedRoute) {
  hasSubscription = true
}
// PRIORIDADE 3: Caso contrário → exige assinatura
else {
  redirect(`/pt/${area}/checkout`)
}
```

**Por quê?**
- A verificação de diagnóstico é mais importante que a rota
- Mesmo que a rota não seja explicitamente excluída, usuário sem diagnóstico deve ter acesso

---

## 🧪 **PASSOS PARA TESTAR**

### **1. Verificar Estado do Usuário no Banco**

Execute no Supabase SQL Editor:

```sql
-- Verificar perfil do nutri1
SELECT 
  email,
  perfil,
  diagnostico_completo,
  nome_completo
FROM user_profiles
WHERE email = 'nutri1@ylada.com';
```

**Resultado esperado:**
- `diagnostico_completo` = `false` ou `null`
- `perfil` = `'nutri'`

---

### **2. Resetar Usuário (se necessário)**

Se o `diagnostico_completo` estiver como `true` incorretamente, execute:

```sql
-- Resetar para estado inicial
UPDATE user_profiles
SET diagnostico_completo = false
WHERE email = 'nutri1@ylada.com';

-- Remover diagnóstico se existir
DELETE FROM nutri_diagnostico
WHERE user_id = (SELECT user_id FROM user_profiles WHERE email = 'nutri1@ylada.com');

-- Remover progresso da jornada (opcional)
DELETE FROM journey_progress
WHERE user_id = (SELECT user_id FROM user_profiles WHERE email = 'nutri1@ylada.com');
```

---

### **3. Limpar Cache do Navegador**

**Importante:** Limpar cache e localStorage antes de testar:

1. Abra o DevTools (F12)
2. Vá em **Application** → **Local Storage**
3. Procure por `ylada_last_visited_page`
4. **Delete** se contiver `/checkout`
5. Limpe também **Session Storage**
6. Feche e reabra o navegador (ou use aba anônima)

---

### **4. Testar Login**

1. Acesse `/pt/nutri/login` (ou `/pt/nutri`)
2. Faça login com `nutri1@ylada.com`
3. **Resultado esperado:** Redirecionar para `/pt/nutri/onboarding`
4. **Se redirecionar para checkout:** Verificar logs no console do navegador e logs do servidor

---

## 🔍 **DEBUG: ONDE VERIFICAR**

### **1. Logs do Servidor (Vercel/Produção)**
Procure por logs que contenham:
- `ProtectedLayout [nutri]`
- `Usuário sem diagnóstico`
- `Sem assinatura e não é exceção`

### **2. Logs do Cliente (Console do Navegador)**
Procure por:
- `LoginForm: Usuário Nutri sem diagnóstico, redirecionando para onboarding`
- `AutoRedirect: ...`
- Qualquer redirecionamento para `/checkout`

### **3. Verificar Componentes Client-Side**

**Arquivos que podem redirecionar:**
- `src/components/auth/LoginForm.tsx` - Redireciona após login
- `src/components/auth/AutoRedirect.tsx` - Redireciona se já logado
- `src/components/auth/RequireSubscription.tsx` - Pode redirecionar para checkout

---

## 🚨 **SE AINDA REDIRECIONAR PARA CHECKOUT**

### **Possíveis Causas:**

1. **`diagnostico_completo` está `true` no banco**
   - ✅ Solução: Executar script de reset (passo 2)

2. **`localStorage` ainda tem `/checkout` salvo**
   - ✅ Solução: Limpar localStorage (passo 3)

3. **Outro componente está redirecionando**
   - ✅ Solução: Verificar logs do console (passo 4)

4. **Cache do servidor (Vercel)**
   - ✅ Solução: Aguardar alguns minutos ou fazer deploy forçado

5. **Problema na detecção do `actualPath`**
   - ✅ Solução: Verificar logs do servidor para ver qual `actualPath` está sendo detectado

---

## 📝 **TESTAR COMO ADMINISTRADOR**

**Não recomendado** para testar o fluxo de usuário novo, pois:
- Admin tem permissões especiais
- Não reproduz o comportamento real de um usuário sem diagnóstico
- Pode mascarar problemas

**Recomendado:**
- Usar `nutri1@ylada.com` (usuário de teste sem diagnóstico)
- Limpar cache e localStorage
- Testar em aba anônima

---

## ✅ **PRÓXIMOS PASSOS**

1. Execute o script SQL para verificar/resetar o usuário
2. Limpe cache e localStorage
3. Teste o login em aba anônima
4. Se ainda redirecionar, envie os logs do console e do servidor
