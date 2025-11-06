# ⚡ SOLUÇÃO RÁPIDA: LENTIDÃO NO DASHBOARD E LOGIN

## 🔥 AÇÃO IMEDIATA (FAZER AGORA)

### **1. Limpar Cache do Next.js**

```bash
# Parar o servidor (Ctrl+C)
# Depois executar:
rm -rf .next
npm run dev
```

### **2. Limpar Cache do Navegador**

- **Chrome/Edge**: Ctrl+Shift+Delete (Windows) ou Cmd+Shift+Delete (Mac)
- Selecione "Cache" e "Cookies"
- Ou use modo anônimo para testar

### **3. Verificar Console do Navegador**

Pressione **F12** e verifique:
- **Console Tab**: Erros em vermelho?
- **Network Tab**: Requisições lentas? (mais de 2 segundos)

---

## 🐛 PROBLEMAS IDENTIFICADOS

### **Problema 1: Múltiplas Chamadas de Auth**

O `useAuth` está fazendo várias chamadas:
1. `getSession()` - Primeira chamada
2. `fetchUserProfile()` - Segunda chamada ao banco
3. `onAuthStateChange()` - Listener que chama `fetchUserProfile()` novamente

**Resultado**: 2-3 chamadas ao banco na inicialização = **LENTIDÃO**

### **Problema 2: ProtectedRoute + Dashboard = Duplicação**

- `ProtectedRoute` usa `useAuth()` 
- `Dashboard` também usa `useAuth()`
- Isso causa chamadas duplicadas

### **Problema 3: Perfil Não Existe ou Incorreto**

Se o perfil não existe na tabela `user_profiles`, o sistema pode:
- Ficar tentando buscar infinitamente
- Redirecionar para login repetidamente
- Causar loops de redirecionamento

---

## ✅ SOLUÇÕES

### **SOLUÇÃO 1: Executar Script SQL (CRÍTICO)**

Execute o script `CORRIGIR-ACESSO-RENATA-COM-UIDS.sql` no Supabase para garantir que os perfis existem.

### **SOLUÇÃO 2: Limpar Cache (CRÍTICO)**

```bash
rm -rf .next
npm run dev
```

### **SOLUÇÃO 3: Verificar Perfis no Banco**

Execute no Supabase SQL Editor:

```sql
-- Verificar se os perfis existem
SELECT 
  up.user_id,
  up.email,
  up.perfil,
  au.email as auth_email,
  au.email_confirmed_at
FROM user_profiles up
RIGHT JOIN auth.users au ON up.user_id = au.id
WHERE au.email IN ('renatateste@gmail.com', 'renataborges.mpm@gmail.com');
```

**Resultado esperado:**
- Ambas as contas devem ter perfil criado
- `perfil` deve ser 'wellness' para renatateste@gmail.com
- `perfil` deve ser 'nutri' para renataborges.mpm@gmail.com

---

## 🔍 DIAGNÓSTICO PASSO A PASSO

### **Passo 1: Verificar Console do Navegador**

1. Abra o dashboard
2. Pressione **F12**
3. Vá na aba **Console**
4. Procure por:
   - ❌ Erros em vermelho
   - ⚠️ Warnings em amarelo
   - 🔄 Mensagens de "Carregando..." repetidas

### **Passo 2: Verificar Network Tab**

1. Abra o dashboard
2. Pressione **F12**
3. Vá na aba **Network**
4. Recarregue a página (F5)
5. Veja:
   - Quantas requisições estão sendo feitas
   - Quais estão mais lentas (vermelho = lento)
   - Se há requisições que falham (código 4xx ou 5xx)

### **Passo 3: Verificar Tempo de Resposta da API**

No Network tab, procure por:
- `/api/wellness/dashboard` - Deve ser rápido (< 500ms)
- Se estiver lento (> 2s), pode ser problema no banco

### **Passo 4: Verificar se Perfil Existe**

Se o dashboard está travando, pode ser que:
- O perfil não existe no banco
- O perfil está incorreto
- RLS está bloqueando o acesso

---

## 📋 CHECKLIST DE RESOLUÇÃO

- [ ] Cache do Next.js limpo (`rm -rf .next`)
- [ ] Servidor reiniciado (`npm run dev`)
- [ ] Cache do navegador limpo
- [ ] Script SQL executado (perfis criados)
- [ ] Console do navegador verificado (sem erros)
- [ ] Network tab verificado (sem requisições lentas)
- [ ] Perfis verificados no banco (existem e estão corretos)
- [ ] Login testado novamente

---

## 🚨 SE AINDA ESTIVER LENTO

### **Verificar se é problema de rede:**

```bash
# Testar se o Supabase está respondendo
curl -I https://seu-projeto.supabase.co
```

### **Verificar logs do servidor:**

No terminal onde está rodando `npm run dev`, veja se há:
- Erros de conexão
- Timeouts
- Queries lentas

### **Verificar RLS Policies:**

No Supabase SQL Editor:

```sql
-- Verificar se RLS está bloqueando
SELECT * FROM pg_policies 
WHERE tablename = 'user_profiles';
```

---

## 💡 OTIMIZAÇÕES FUTURAS (Se necessário)

1. **Adicionar cache no useAuth** - Evitar chamadas duplicadas
2. **Usar React Query** - Cache de requisições
3. **Lazy Loading** - Carregar componentes sob demanda
4. **Otimizar queries** - Adicionar índices no banco

---

## 🎯 PRIORIDADE DE AÇÕES

1. ⚡ **URGENTE**: Limpar cache (`rm -rf .next`)
2. ⚡ **URGENTE**: Executar script SQL para criar perfis
3. 🔍 **IMPORTANTE**: Verificar console e network tab
4. 📝 **MÉDIO**: Otimizar código (se necessário)

---

**Execute primeiro**: Limpar cache e executar script SQL!

