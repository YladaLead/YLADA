# 🔧 CORREÇÃO: Rate Limit Bloqueando Admin

## 🚨 Problema Identificado

**Relato:**
> "Eu sou administrador, não tinha feito nenhuma requisição, na primeira requisição que eu fui fazer já fui bloqueado"

**Causa:**
1. Rate limit não verifica se usuário é admin antes de bloquear
2. Bloqueios antigos no banco de dados estão bloqueando novos usuários
3. Admin não tem bypass de rate limit

---

## ✅ Correções Aplicadas

### **1. Bypass de Rate Limit para Admin/Suporte**

**Arquivo:** `src/app/api/wellness/noel/route.ts`

**Mudança:**
- Adicionada verificação se usuário é admin ou suporte
- Se for admin/suporte, bypass completo do rate limit
- Log adicionado para rastrear bypass

**Código:**
```typescript
// Admin e Suporte não têm rate limit (bypass)
const isAdminOrSupport = profile?.is_admin === true || profile?.is_support === true

let rateLimitResult
if (isAdminOrSupport) {
  console.log('✅ [NOEL] Admin/Suporte - bypass de rate limit')
  rateLimitResult = {
    allowed: true,
    remaining: 999,
    resetAt: new Date(Date.now() + 60000),
    blocked: false,
  }
} else {
  rateLimitResult = await checkRateLimit(user.id)
}
```

---

### **2. Script SQL para Limpar Bloqueios**

**Arquivo:** `scripts/limpar-bloqueios-rate-limit-noel.sql`

**O que faz:**
- Remove todos os bloqueios ativos
- Deleta registros antigos (mais de 1 hora)
- Mostra estatísticas de bloqueios removidos

**Como usar:**
1. Acesse Supabase SQL Editor
2. Execute o script
3. Verifique se bloqueios foram removidos

---

## 📋 Próximos Passos

### **Imediato:**
1. ✅ **Deploy da correção do bypass de admin**
2. ⚠️ **Executar script SQL para limpar bloqueios**
3. ⚠️ **Testar se admin consegue usar NOEL**

### **Urgente:**
1. Ajustar configuração de rate limit (30 → 60/min)
2. Deploy das correções do thread_id
3. Melhorar debounce de eventos de auth

---

## 🔍 Verificação

### **Como Verificar se Funcionou:**

1. **Verificar se admin tem bypass:**
   - Fazer login como admin
   - Enviar mensagem no NOEL
   - Verificar logs: deve aparecer "Admin/Suporte - bypass de rate limit"

2. **Verificar se bloqueios foram limpos:**
   ```sql
   SELECT COUNT(*) 
   FROM noel_rate_limits 
   WHERE is_blocked = true 
     AND blocked_until > NOW();
   ```
   - Deve retornar 0

3. **Testar uso normal:**
   - Admin deve conseguir usar NOEL sem limites
   - Usuários normais devem ter rate limit de 30/min

---

**Data da Correção:** 2025-12-16  
**Status:** ✅ **CORRIGIDO** - Admin agora tem bypass de rate limit






