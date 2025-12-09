# 🔍 Investigação: Problema com Senha Provisória

## ❌ Problema Reportado

**Usuária Marta:**
1. Recebe senha provisória
2. Entra com a senha provisória ✅
3. Vai salvar nova senha
4. **Quando tenta entrar novamente, não consegue entrar** ❌
5. **Ou o salvamento não está acontecendo** ❌

---

## 🔍 Análise do Fluxo Atual

### Fluxo Esperado

```
1. Admin gera senha provisória
   ↓
2. Senha provisória é definida no Supabase Auth
   ↓
3. temporary_password_expires_at é salvo em user_profiles
   ↓
4. Usuário faz login com senha provisória
   ↓
5. Usuário vai em Configurações → Segurança
   ↓
6. Usuário preenche:
   - Senha atual (senha provisória)
   - Nova senha
   - Confirmar nova senha
   ↓
7. Sistema verifica senha atual (faz login temporário)
   ↓
8. Se correto, atualiza senha no Supabase Auth
   ↓
9. Limpa temporary_password_expires_at
   ↓
10. Faz logout e redireciona para login
   ↓
11. Usuário faz login com nova senha
```

---

## 🐛 Problemas Identificados

### Problema 1: Verificação de Senha Atual Pode Falhar

**Localização:** `src/app/api/wellness/change-password/route.ts` (linhas 63-89)

**Código:**
```typescript
const { data: signInData, error: signInError } = await tempSupabase.auth.signInWithPassword({
  email: user.email!,
  password: currentPassword
})

if (signInError || !signInData.session) {
  return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 401 })
}
```

**Possíveis Problemas:**
- Se a senha provisória foi alterada manualmente no Supabase, pode não corresponder
- Se há problema de sincronização entre senha provisória e o que o usuário digitou
- Se a senha provisória tem caracteres especiais que estão sendo interpretados incorretamente

### Problema 2: Sessão Pode Não Ser Invalidada Corretamente

**Localização:** `src/app/pt/wellness/configuracao/page.tsx` (linhas 894-904)

**Código:**
```typescript
setTimeout(async () => {
  try {
    await signOut()
    router.push('/pt/wellness/login?password_changed=success')
  } catch (logoutError) {
    router.push('/pt/wellness/login?password_changed=success')
  }
}, 2000)
```

**Possíveis Problemas:**
- O `signOut()` pode não estar invalidando a sessão corretamente
- A sessão antiga pode ainda estar ativa
- O redirecionamento pode estar acontecendo antes do logout completar

### Problema 3: Senha Pode Não Estar Sendo Atualizada no Supabase

**Localização:** `src/app/api/wellness/change-password/route.ts` (linhas 96-122)

**Código:**
```typescript
const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
  user.id,
  { password: newPassword }
)
```

**Possíveis Problemas:**
- O `updateUserById` pode estar falhando silenciosamente
- A senha pode estar sendo atualizada, mas a sessão antiga ainda está ativa
- Pode haver problema de permissões com `supabaseAdmin`

### Problema 4: Limpeza de Senha Provisória Pode Falhar

**Localização:** `src/app/api/wellness/change-password/route.ts` (linhas 127-137)

**Código:**
```typescript
const { error: profileUpdateError } = await supabaseAdmin
  .from('user_profiles')
  .update({ temporary_password_expires_at: null })
  .eq('user_id', user.id)
```

**Possíveis Problemas:**
- Se isso falhar, o `temporary_password_expires_at` pode ainda estar ativo
- Isso pode causar problemas no login futuro

---

## 🔧 Correções Necessárias

### Correção 1: Melhorar Logs e Validação

Adicionar logs detalhados em cada etapa:
- Logar quando verifica senha atual
- Logar quando atualiza senha
- Logar quando limpa senha provisória
- Logar erros específicos

### Correção 2: Garantir Logout Completo

Garantir que o logout seja feito corretamente antes de redirecionar:
- Aguardar logout completar
- Limpar cookies/sessão
- Redirecionar apenas após logout completo

### Correção 3: Verificar Se Senha Foi Atualizada

Após atualizar a senha, verificar se realmente foi atualizada:
- Tentar fazer login com a nova senha
- Se falhar, retornar erro claro
- Se suceder, prosseguir com logout

### Correção 4: Melhorar Tratamento de Erros

Mensagens de erro mais específicas:
- "Senha atual incorreta" vs "Erro ao verificar senha"
- "Erro ao atualizar senha" vs "Senha não foi atualizada"
- Logs detalhados para diagnóstico

---

## 📋 Checklist de Verificação

### Backend (`/api/wellness/change-password/route.ts`)
- [ ] Logs detalhados em cada etapa
- [ ] Verificação se senha foi realmente atualizada
- [ ] Limpeza de `temporary_password_expires_at` sempre funciona
- [ ] Mensagens de erro são claras

### Frontend (`configuracao/page.tsx`)
- [ ] Logout é feito corretamente
- [ ] Aguarda logout completar antes de redirecionar
- [ ] Mensagens de erro são exibidas
- [ ] Feedback de sucesso é claro

### Fluxo Completo
- [ ] Senha provisória funciona no login
- [ ] Mudança de senha funciona
- [ ] Nova senha funciona no login
- [ ] Senha provisória é limpa após mudança

---

## 🧪 Testes Necessários

### Teste 1: Fluxo Completo
1. Gerar senha provisória para usuário de teste
2. Fazer login com senha provisória
3. Ir em Configurações → Segurança
4. Alterar senha (usando senha provisória como "senha atual")
5. Fazer logout
6. Tentar fazer login com nova senha
7. **Esperado:** Deve funcionar ✅

### Teste 2: Verificar Se Senha Foi Atualizada
1. Após mudança de senha, verificar no Supabase Dashboard
2. Tentar fazer login com nova senha
3. **Esperado:** Deve funcionar ✅

### Teste 3: Verificar Limpeza de Senha Provisória
1. Após mudança de senha, verificar `temporary_password_expires_at` no banco
2. **Esperado:** Deve ser `NULL` ✅

---

## 🔍 Próximos Passos

1. ✅ Criar este relatório de investigação
2. ⏳ Adicionar logs detalhados
3. ⏳ Melhorar validação e tratamento de erros
4. ⏳ Garantir logout completo
5. ⏳ Testar fluxo completo

---

**Status:** 🔍 Investigação completa - Pronto para implementar correções
