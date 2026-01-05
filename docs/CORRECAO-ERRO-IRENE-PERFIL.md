# 🔧 Correção: Erro ao Salvar Perfil - Irene

## 📋 Problema Reportado

**Usuária:** Irene  
**Problema:** Ao tentar salvar dados do perfil, aparece erro "Você precisa fazer login para continuar"  
**Sintoma:** Não consegue salvar alterações no perfil, mesmo estando logada

---

## ✅ Correções Implementadas

### **1. Correção da Validação do Slug** ✅

**Problema:** A validação estava rejeitando slugs com hífens, mas as instruções na interface diziam para usar hífens no formato "nome-sobrenome".

**Arquivo:** `src/app/pt/wellness/configuracao/page.tsx`

**Antes:**
```typescript
// Validar que o slug não contém hífens (deve ser um nome unificado)
if (perfil.userSlug.includes('-')) {
  setErro('O slug deve ser um nome único sem hífens. Use apenas letras e números.')
  return
}
```

**Depois:**
```typescript
// Validar formato do slug: apenas letras minúsculas, números e hífens (formato nome-sobrenome)
const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/
if (!slugRegex.test(perfil.userSlug)) {
  setErro('O slug deve conter apenas letras minúsculas, números e hífens. Formato: nome-sobrenome (ex: joao-silva)')
  return
}
```

**Benefício:**
- Agora aceita o formato correto (nome-sobrenome com hífens)
- Validação consistente com as instruções mostradas na interface

---

### **2. Melhoria no Tratamento de Erros 401** ✅

**Problema:** Quando a sessão expirava, o sistema mostrava erro imediatamente sem tentar recuperar a sessão.

**Arquivo:** `src/app/pt/wellness/configuracao/page.tsx`

**O que foi adicionado:**
- Quando recebe erro 401, tenta fazer refresh da sessão automaticamente
- Se o refresh funcionar, tenta salvar novamente automaticamente
- Só mostra erro se o refresh também falhar

**Código:**
```typescript
if (response.status === 401) {
  console.warn('⚠️ Erro 401 detectado, tentando fazer refresh da sessão...')
  try {
    const supabase = createClient()
    const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
    
    if (refreshedSession && !refreshError) {
      // Tentar salvar novamente após refresh
      const retryResponse = await authenticatedFetch('/api/wellness/profile', {
        method: 'PUT',
        // ... dados
      })
      
      if (retryResponse.ok) {
        // Sucesso! Perfil salvo
        return
      }
    }
  } catch (refreshErr) {
    // Se refresh falhou, mostrar erro
    throw new Error('Sua sessão expirou. Por favor, faça login novamente.')
  }
}
```

**Benefício:**
- Resolve automaticamente casos de sessão expirada
- Melhor experiência do usuário (não precisa fazer login novamente)
- Logs detalhados para debug

---

## 🔍 Diagnóstico do Problema da Irene

### **Script SQL de Diagnóstico**

Criado script em `scripts/diagnostico-irene-perfil.sql` para verificar:

1. **Usuário no auth.users**
   - Verificar se existe
   - Verificar email confirmado
   - Verificar última sessão

2. **Perfil no user_profiles**
   - Verificar se perfil existe
   - Verificar se `perfil = 'wellness'`
   - Verificar se `is_active = true`
   - Verificar campos obrigatórios

3. **Assinatura Wellness**
   - Verificar se tem assinatura ativa
   - Verificar status da assinatura

4. **Múltiplos Perfis**
   - Verificar se há conflito de perfis

5. **Sessões Ativas**
   - Verificar sessões recentes

### **Como Usar o Script**

1. Execute a primeira query para encontrar o ID da Irene:
```sql
SELECT id, email, created_at, last_sign_in_at
FROM auth.users
WHERE email ILIKE '%irene%' 
  OR user_metadata->>'full_name' ILIKE '%irene%';
```

2. Use o ID encontrado nas outras queries (substitua `USER_ID_AQUI`)

3. Verifique especialmente:
   - Se `perfil = 'wellness'` ✅
   - Se `is_active = true` ✅
   - Se tem assinatura ativa ✅

---

## 🎯 Possíveis Causas do Problema

### **Causa 1: Sessão Expirada** 🔴
**Sintoma:** Erro 401 ao tentar salvar  
**Solução:** Agora o sistema tenta fazer refresh automaticamente

### **Causa 2: Perfil Incorreto** ⚠️
**Sintoma:** Erro 403 ou 401  
**Verificação:** Executar script SQL para verificar se `perfil = 'wellness'`

### **Causa 3: Cookies Bloqueados** ⚠️
**Sintoma:** Erro 401 mesmo após login  
**Solução:** Verificar configurações do navegador, limpar cookies

### **Causa 4: Slug Inválido** ✅ **CORRIGIDO**
**Sintoma:** Erro ao validar slug  
**Solução:** Agora aceita formato correto (nome-sobrenome com hífens)

---

## 🧪 Como Testar

1. **Teste de Validação do Slug:**
   - Tentar salvar com slug "irene-silva" → ✅ Deve aceitar
   - Tentar salvar com slug "irene_silva" → ❌ Deve rejeitar (underscore)
   - Tentar salvar com slug "Irene Silva" → ❌ Deve rejeitar (maiúsculas)

2. **Teste de Refresh de Sessão:**
   - Fazer login
   - Aguardar sessão expirar (ou forçar expiração)
   - Tentar salvar perfil
   - ✅ Deve tentar refresh automaticamente
   - ✅ Se refresh funcionar, deve salvar com sucesso

3. **Teste de Erro 401:**
   - Fazer logout
   - Tentar salvar perfil (sem estar logado)
   - ✅ Deve mostrar mensagem clara pedindo login

---

## 📝 Próximos Passos

1. **Executar diagnóstico SQL** para verificar perfil da Irene
2. **Verificar logs do servidor** quando Irene tentar salvar
3. **Verificar console do navegador** (F12) para ver detalhes técnicos
4. **Se problema persistir:**
   - Verificar se cookies estão sendo bloqueados
   - Verificar se há múltiplos perfis conflitantes
   - Verificar se assinatura está ativa

---

## 🔗 Arquivos Modificados

- ✅ `src/app/pt/wellness/configuracao/page.tsx` - Correção validação slug + refresh sessão
- ✅ `scripts/diagnostico-irene-perfil.sql` - Script de diagnóstico

---

## 💡 Dicas para Usuários

Se você está enfrentando o erro "Você precisa fazer login para continuar":

1. **Tente novamente** - O sistema agora tenta recuperar a sessão automaticamente
2. **Verifique o console** (F12) - Pode ter informações úteis
3. **Limpe cookies e cache** - Pode resolver problemas de sincronização
4. **Faça login novamente** - Se o problema persistir, faça logout e login

---

**Data:** 2024-01-XX  
**Status:** ✅ Correções implementadas, aguardando teste

