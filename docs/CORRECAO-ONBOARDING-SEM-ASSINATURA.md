# ✅ CORREÇÃO: Onboarding Sem Assinatura

## 🐛 **PROBLEMA**

O usuário `nutri1@ylada.com` (sem diagnóstico, sem assinatura) sempre era redirecionado para `/pt/nutri/checkout` ao tentar acessar `/pt/nutri/onboarding`.

**Causa:** O `ProtectedLayout` estava exigindo assinatura para **TODAS** as rotas dentro de `(protected)`, incluindo onboarding e diagnóstico.

---

## ✅ **SOLUÇÃO IMPLEMENTADA**

### **1. Modificação no `auth-server.ts`**

Adicionada lógica para permitir rotas de onboarding e diagnóstico sem assinatura:

- Novo parâmetro `excludeRoutesFromSubscription`: Lista de rotas que não exigem assinatura
- Novo parâmetro `currentPath`: Pathname atual (opcional)
- Verificação automática via `referer` header se `currentPath` não for fornecido
- Se a rota for onboarding ou diagnostico, não redireciona para checkout

### **2. Modificação no `ProtectedLayout`**

O layout agora passa as rotas excluídas:

```typescript
await validateProtectedAccess('nutri', {
  requireSubscription: true,
  allowAdmin: true,
  allowSupport: true,
  excludeRoutesFromSubscription: ['/onboarding', '/diagnostico'],
  currentPath: '',
})
```

---

## 🧪 **TESTE**

### **Cenário: Usuário Novo (nutri1@ylada.com)**

1. Login com `nutri1@ylada.com` / `senha123`
2. **Esperado:** Deve redirecionar para `/pt/nutri/onboarding`
3. **Esperado:** Página de onboarding deve aparecer (NÃO deve redirecionar para checkout)
4. Clique em "Começar meu Diagnóstico Estratégico"
5. **Esperado:** Deve ir para `/pt/nutri/diagnostico`
6. Complete o diagnóstico
7. **Esperado:** Após diagnóstico, pode ser redirecionado para checkout (agora precisa assinar)

---

## 📋 **ARQUIVOS MODIFICADOS**

1. ✅ `src/lib/auth-server.ts` - Lógica de exceção para rotas sem assinatura
2. ✅ `src/app/pt/nutri/(protected)/layout.tsx` - Passa rotas excluídas

---

## ⚠️ **NOTAS IMPORTANTES**

- A detecção da rota atual usa o header `referer` como fallback
- Se o `referer` não estiver disponível, pode não funcionar perfeitamente
- Em produção, considere usar middleware para passar pathname como header customizado

---

**Última atualização:** 16/12/2025
**Status:** ✅ Implementado - Aguardando teste


