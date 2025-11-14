# 🔍 COMO O SISTEMA BUSCA SUBSCRIPTIONS

## 📊 FLUXO ATUAL DO SISTEMA

### **1. Usuário faz login:**
```
Usuário faz login
  ↓
Sistema autentica em auth.users
  ↓
Sistema busca perfil em user_profiles
  ↓
Obtém: user_id do perfil (ex: 55da1b82-...)
```

### **2. Sistema busca subscription:**
```typescript
// Código em subscription-helpers.ts
export async function getActiveSubscription(userId: string, area: string) {
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)  // ← Usa o user_id do PERFIL
    .eq('area', area)
    .eq('status', 'active')
}
```

**O sistema usa o `user_id` que vem do `user_profiles`!**

---

## ❌ PROBLEMA: IDs DIFERENTES

### **Cenário com problema:**

```
┌─────────────────────────────────────────────────┐
│ 1. Usuário faz login                            │
│    user_id do perfil: 55da1b82-...              │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│ 2. Sistema busca subscription                   │
│    WHERE user_id = '55da1b82-...'               │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│ 3. Subscription tem user_id diferente!          │
│    subscription.user_id = '62885dbf-...'        │
│    ❌ NÃO ENCONTRA!                             │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│ 4. Sistema retorna: "Sem subscription"          │
│    Usuário não tem acesso mesmo pagando!        │
└─────────────────────────────────────────────────┘
```

---

## ✅ SOLUÇÃO: IDs IGUAIS

### **Cenário após correção:**

```
┌─────────────────────────────────────────────────┐
│ 1. Usuário faz login                            │
│    user_id do perfil: 55da1b82-...              │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│ 2. Sistema busca subscription                   │
│    WHERE user_id = '55da1b82-...'               │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│ 3. Subscription tem mesmo user_id!              │
│    subscription.user_id = '55da1b82-...'        │
│    ✅ ENCONTRA!                                 │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│ 4. Sistema retorna: subscription encontrada     │
│    Usuário tem acesso normalmente!              │
└─────────────────────────────────────────────────┘
```

---

## 🎯 REGRA DE OURO

### **O `user_id` deve ser o MESMO em:**
1. ✅ `auth.users.id`
2. ✅ `user_profiles.user_id`
3. ✅ `subscriptions.user_id`

**Todos devem apontar para o mesmo usuário!**

---

## 🔧 COMO CORRIGIR

### **Opção 1: Script Automático**
```sql
-- Corrige todos os casos migrados
-- Arquivo: scripts/corrigir-todos-user-id-migrados.sql
```

### **Opção 2: Manual (Supabase)**
1. Vá em `subscriptions`
2. Veja o `user_id` atual (ERRADO)
3. Vá em `user_profiles` e veja o `user_id` correto
4. Atualize `subscriptions.user_id` para o correto

---

## 📊 IMPACTO

| Situação | user_id Subscription | user_id Perfil | Sistema Encontra? |
|----------|---------------------|----------------|-------------------|
| **❌ ERRADO** | `62885dbf-...` | `55da1b82-...` | ❌ NÃO |
| **✅ CORRETO** | `55da1b82-...` | `55da1b82-...` | ✅ SIM |

---

## 💡 RESUMO

**Como fica após correção:**
- ✅ Todos os `user_id` ficam iguais
- ✅ Sistema encontra subscriptions corretamente
- ✅ Usuários conseguem acessar
- ✅ Webhooks funcionam
- ✅ Renovações funcionam
- ✅ Área admin mostra dados corretos

**Recomendação:**
Execute o script `corrigir-todos-user-id-migrados.sql` para corrigir todos os casos de uma vez!

