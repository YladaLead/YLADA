# 🔍 DIAGNÓSTICO: LENTIDÃO NO DASHBOARD E PROBLEMAS DE LOGIN

## 🐛 PROBLEMAS IDENTIFICADOS

### **1. Múltiplas Chamadas de Autenticação**

O hook `useAuth` está fazendo várias chamadas desnecessárias:

```typescript
// useAuth.ts - Problema:
useEffect(() => {
  // 1. getSession() - Primeira chamada
  const { data: { session } } = await supabase.auth.getSession()
  
  // 2. fetchUserProfile() - Segunda chamada ao banco
  if (session?.user) {
    const profile = await fetchUserProfile(session.user.id)
  }
  
  // 3. onAuthStateChange - Listener que também chama fetchUserProfile()
  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const profile = await fetchUserProfile(session.user.id) // Terceira chamada!
    }
  })
}, [])
```

**Problema**: Isso pode causar 2-3 chamadas ao banco de dados na inicialização.

### **2. ProtectedRoute + useAuth = Duplicação**

- `ProtectedRoute` usa `useAuth()` 
- `Dashboard` também usa `useAuth()`
- Isso pode causar chamadas duplicadas

### **3. Dashboard espera user do useAuth**

O dashboard só carrega dados quando `user` está disponível, mas se o `useAuth` estiver lento, o dashboard fica travado esperando.

### **4. Cache do Next.js**

O cache do Next.js (`.next/`) pode estar causando problemas com componentes antigos ou dados desatualizados.

---

## ✅ SOLUÇÕES PROPOSTAS

### **SOLUÇÃO 1: Limpar Cache do Next.js**

```bash
# Parar o servidor
# No terminal:
rm -rf .next
npm run dev
```

### **SOLUÇÃO 2: Otimizar useAuth (Reduzir Chamadas)**

Criar uma versão otimizada que:
- Cache do perfil em memória
- Evita chamadas duplicadas
- Usa `useMemo` para evitar re-renders

### **SOLUÇÃO 3: Adicionar Loading States Melhorados**

Mostrar feedback visual claro enquanto carrega.

### **SOLUÇÃO 4: Verificar API /api/wellness/dashboard**

A API pode estar lenta ou fazendo queries pesadas.

---

## 🚀 AÇÕES IMEDIATAS

### **1. Limpar Cache (FAZER AGORA)**

Execute no terminal:

```bash
cd /Users/air/ylada-app
rm -rf .next
npm run dev
```

### **2. Verificar Console do Navegador**

Abra o console (F12) e verifique:
- Quantas chamadas estão sendo feitas
- Se há erros de rede
- Tempo de resposta das APIs

### **3. Verificar Network Tab**

No DevTools > Network:
- Veja quantas requisições estão sendo feitas
- Veja o tempo de cada uma
- Identifique requisições duplicadas

---

## 📊 CHECKLIST DE DIAGNÓSTICO

- [ ] Cache do Next.js limpo (`rm -rf .next`)
- [ ] Servidor reiniciado
- [ ] Console do navegador verificado (sem erros)
- [ ] Network tab verificado (identificar requisições lentas)
- [ ] API `/api/wellness/dashboard` testada diretamente
- [ ] Perfil do usuário existe e está correto no banco
- [ ] RLS policies não estão bloqueando acesso

---

## 🔧 PRÓXIMOS PASSOS (SE AINDA ESTIVER LENTO)

1. **Otimizar useAuth** - Reduzir chamadas duplicadas
2. **Adicionar React Query ou SWR** - Cache de requisições
3. **Lazy Loading** - Carregar componentes sob demanda
4. **Otimizar API** - Adicionar índices no banco, otimizar queries

---

## 📝 LOGS PARA COLETAR

Se ainda estiver lento, colete:

1. **Console do navegador** (F12 > Console)
   - Erros
   - Warnings
   - Tempo de carregamento

2. **Network Tab** (F12 > Network)
   - Quantidade de requisições
   - Tempo de cada requisição
   - Quais estão mais lentas

3. **React DevTools** (se instalado)
   - Componentes re-renderizando
   - Tempo de renderização

---

## 🎯 PRIORIDADE

1. **ALTA**: Limpar cache (`rm -rf .next`)
2. **MÉDIA**: Verificar console e network tab
3. **BAIXA**: Otimizar código (se necessário após diagnóstico)

