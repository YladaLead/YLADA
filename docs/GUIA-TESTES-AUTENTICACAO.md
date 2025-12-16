# 🧪 GUIA DE TESTES - AUTENTICAÇÃO SERVER-SIDE

**Data:** Dezembro 2024  
**Objetivo:** Testar a nova estrutura de autenticação server-side

---

## ✅ PRÉ-REQUISITOS

1. **Servidor rodando:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

2. **Acessar:** `http://localhost:3000`

3. **Ter console do navegador aberto** (F12 → Console)

4. **Ter terminal do servidor visível** (para ver logs server-side)

---

## 🧪 TESTES OBRIGATÓRIOS

### TESTE 1: Acesso sem Login ✅

**Objetivo:** Verificar se redireciona para login quando não autenticado

**Passos:**
1. Abra uma aba anônima/privada (ou faça logout se estiver logado)
2. Acesse diretamente: `http://localhost:3000/pt/wellness/home`
3. **Resultado esperado:**
   - ✅ Deve redirecionar automaticamente para `/pt/wellness/login`
   - ✅ Não deve mostrar conteúdo da home
   - ✅ No console do servidor: `❌ ProtectedLayout [wellness]: Usuário não autenticado`

**Como verificar:**
- URL muda para `/pt/wellness/login`
- Página de login aparece
- Console do servidor mostra log de redirecionamento

---

### TESTE 2: Login Válido ✅

**Objetivo:** Verificar se permite acesso quando autenticado corretamente

**Passos:**
1. Acesse: `http://localhost:3000/pt/wellness/login`
2. Faça login com credenciais válidas de wellness
3. Após login, deve redirecionar para `/pt/wellness/home`
4. **Resultado esperado:**
   - ✅ Deve mostrar conteúdo da home
   - ✅ Não deve redirecionar de volta para login
   - ✅ No console do servidor: `✅ Validação OK` (ou similar)

**Como verificar:**
- Página home carrega normalmente
- Conteúdo aparece (não fica em loading infinito)
- Console não mostra erros

---

### TESTE 3: Perfil Incorreto ✅

**Objetivo:** Verificar se bloqueia acesso quando perfil não corresponde

**Passos:**
1. Faça login como **nutri** (não wellness)
2. Tente acessar: `http://localhost:3000/pt/wellness/home`
3. **Resultado esperado:**
   - ✅ Deve redirecionar para `/pt/wellness/login`
   - ✅ Não deve mostrar conteúdo
   - ✅ No console do servidor: `❌ ProtectedLayout [wellness]: Perfil incorreto (nutri)`

**Como verificar:**
- URL muda para `/pt/wellness/login`
- Mensagem de erro pode aparecer (ou apenas redireciona)
- Console do servidor mostra log

---

### TESTE 4: Sem Assinatura ✅

**Objetivo:** Verificar se redireciona para checkout quando não tem assinatura

**Passos:**
1. Faça login como wellness **sem assinatura ativa**
2. Tente acessar: `http://localhost:3000/pt/wellness/home`
3. **Resultado esperado:**
   - ✅ Deve redirecionar para `/pt/wellness/checkout`
   - ✅ Não deve mostrar conteúdo da home
   - ✅ No console do servidor: `❌ ProtectedLayout [wellness]: Sem assinatura`

**Como verificar:**
- URL muda para `/pt/wellness/checkout`
- Página de checkout aparece
- Console do servidor mostra log

---

### TESTE 5: Admin Acessa Qualquer Área ✅

**Objetivo:** Verificar se admin pode acessar qualquer área

**Passos:**
1. Faça login como **admin**
2. Acesse: `http://localhost:3000/pt/wellness/home`
3. **Resultado esperado:**
   - ✅ Deve permitir acesso (mostrar conteúdo)
   - ✅ Não deve redirecionar
   - ✅ No console do servidor: validação passa

**Como verificar:**
- Página home carrega normalmente
- Conteúdo aparece
- Não há redirecionamento

---

### TESTE 6: Refresh F5 ✅

**Objetivo:** Verificar se mantém sessão após refresh

**Passos:**
1. Faça login como wellness
2. Acesse `/pt/wellness/home`
3. Pressione **F5** (refresh)
4. **Resultado esperado:**
   - ✅ Deve manter sessão
   - ✅ Deve mostrar conteúdo (não redirecionar para login)
   - ✅ Não deve ficar em loading infinito

**Como verificar:**
- Página recarrega e mostra conteúdo
- Não redireciona para login
- Console não mostra erros

---

### TESTE 7: Acesso Direto via URL ✅

**Objetivo:** Verificar se funciona ao acessar URL diretamente

**Passos:**
1. Estar logado como wellness
2. Digite diretamente na barra de endereço: `http://localhost:3000/pt/wellness/home`
3. Pressione Enter
4. **Resultado esperado:**
   - ✅ Deve carregar página normalmente
   - ✅ Não deve redirecionar
   - ✅ Não deve ficar em loading

**Como verificar:**
- Página carrega
- Conteúdo aparece
- Sem loops ou redirecionamentos

---

### TESTE 8: Logout ✅

**Objetivo:** Verificar se logout funciona corretamente

**Passos:**
1. Estar logado
2. Fazer logout
3. Tentar acessar: `http://localhost:3000/pt/wellness/home`
4. **Resultado esperado:**
   - ✅ Deve redirecionar para `/pt/wellness/login`
   - ✅ Não deve mostrar conteúdo

**Como verificar:**
- URL muda para login
- Sessão é limpa
- Não consegue acessar páginas protegidas

---

## 🔍 O QUE OBSERVAR NOS LOGS

### Console do Servidor (Terminal)

**Logs esperados (sucesso):**
```
✅ ProtectedLayout [wellness]: Validação OK
```

**Logs esperados (falha):**
```
❌ ProtectedLayout [wellness]: Usuário não autenticado
❌ ProtectedLayout [wellness]: Perfil não encontrado
❌ ProtectedLayout [wellness]: Perfil incorreto (nutri)
❌ ProtectedLayout [wellness]: Sem assinatura
```

### Console do Navegador (F12)

**Não deve aparecer:**
- ❌ Erros de autenticação
- ❌ Loops de redirecionamento
- ❌ "Internal Server Error"
- ❌ Avisos de segurança do Supabase (já corrigido)

**Pode aparecer (normal):**
- ✅ Logs de `useAuth` (carregamento normal)
- ✅ Logs de Fast Refresh (desenvolvimento)
- ✅ Logs de PWA (se aplicável)

---

## 📊 CHECKLIST DE TESTES

Marque conforme testa:

- [ ] **Teste 1:** Acesso sem login → redireciona para login
- [ ] **Teste 2:** Login válido → mostra conteúdo
- [ ] **Teste 3:** Perfil incorreto → redireciona para login
- [ ] **Teste 4:** Sem assinatura → redireciona para checkout
- [ ] **Teste 5:** Admin acessa qualquer área → permite acesso
- [ ] **Teste 6:** Refresh F5 → mantém sessão
- [ ] **Teste 7:** Acesso direto via URL → funciona
- [ ] **Teste 8:** Logout → limpa sessão e redireciona

---

## 🚨 PROBLEMAS COMUNS E SOLUÇÕES

### Problema: "Internal Server Error"
**Solução:**
- Verificar logs do servidor no terminal
- Verificar variáveis de ambiente
- Limpar cache: `rm -rf .next`

### Problema: Loop de redirecionamento
**Solução:**
- Verificar se AutoRedirect não está conflitando
- Verificar logs do servidor
- Limpar cookies do navegador

### Problema: Página fica em loading
**Solução:**
- Verificar se sessão está sendo detectada
- Verificar console do navegador
- Verificar logs do servidor

### Problema: Acesso permitido quando não deveria
**Solução:**
- Verificar logs do servidor
- Verificar se validação está sendo executada
- Verificar perfil do usuário no banco

---

## ✅ CRITÉRIOS DE SUCESSO

A migração está funcionando se:

1. ✅ **Zero loops** - Não há redirecionamentos infinitos
2. ✅ **Previsível** - Sempre funciona da mesma forma
3. ✅ **Seguro** - Bloqueia acesso não autorizado
4. ✅ **Rápido** - Não fica em loading infinito
5. ✅ **Logs claros** - Fácil debugar problemas

---

## 📝 RELATÓRIO DE TESTES

Após testar, preencha:

**Data do teste:** _______________

**Testes passaram:**
- [ ] Todos
- [ ] Maioria
- [ ] Alguns
- [ ] Nenhum

**Problemas encontrados:**
1. ________________________________
2. ________________________________
3. ________________________________

**Próximos passos:**
- [ ] Continuar migração
- [ ] Corrigir problemas
- [ ] Replicar para outras áreas

---

**Última atualização:** Dezembro 2024

