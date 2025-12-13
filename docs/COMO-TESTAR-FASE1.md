# 🧪 COMO TESTAR FASE 1 - APIs de Memória LYA

**Guia passo a passo para testar as APIs criadas**

---

## ✅ PRÉ-REQUISITOS

1. ✅ Migration executada no Supabase (já feito)
2. ✅ Tabelas criadas (confirmado)
3. ✅ Servidor rodando (`npm run dev`)

---

## 🚀 PASSO A PASSO

### **Passo 1: Iniciar o servidor (se não estiver rodando)**

```bash
npm run dev
```

Aguarde até ver: `Ready on http://localhost:3000`

---

### **Passo 2: Fazer login na área Nutri**

1. Abra o navegador em `http://localhost:3000`
2. Vá para `/pt/nutri/login`
3. Faça login com sua conta de nutricionista
4. Você será redirecionado para `/pt/nutri/home`

---

### **Passo 3: Abrir o Console do navegador**

1. Pressione `F12` (ou `Cmd+Option+I` no Mac)
2. Clique na aba **Console**
3. Você verá o console JavaScript

---

### **Passo 4: Executar os testes**

**Opção A: Teste completo (recomendado)**

Copie e cole este código no console:

```javascript
// ============================================
// TESTE COMPLETO - Todos de uma vez
// ============================================
console.log('🚀 Executando todos os testes...')

Promise.all([
  // Teste 1: Salvar estado
  fetch('/api/nutri/ai/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      perfil: { nicho: "nutrição" },
      preferencias: {},
      restricoes: {}
    })
  }).then(r => r.json()),
  
  // Teste 2: Buscar estado
  fetch('/api/nutri/ai/state', { credentials: 'include' }).then(r => r.json()),
  
  // Teste 3: Registrar evento
  fetch('/api/nutri/ai/memory/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      tipo: 'acao',
      conteudo: { acao: "teste" },
      util: true
    })
  }).then(r => r.json()),
  
  // Teste 4: Buscar memória
  fetch('/api/nutri/ai/memory/recent?limit=5', { credentials: 'include' }).then(r => r.json())
])
.then(results => {
  console.log('📊 RESULTADOS:')
  console.log('1. Salvar estado:', results[0].success ? '✅' : '❌', results[0])
  console.log('2. Buscar estado:', results[1].state ? '✅' : '❌', results[1])
  console.log('3. Registrar evento:', results[2].success ? '✅' : '❌', results[2])
  console.log('4. Buscar memória:', Array.isArray(results[3].events) ? '✅' : '❌', results[3])
  
  const allPassed = results[0].success && results[1].state && results[2].success && Array.isArray(results[3].events)
  
  if (allPassed) {
    console.log('')
    console.log('🎉 TODOS OS TESTES PASSARAM!')
    console.log('✅ FASE 1 ESTÁ 100% FUNCIONAL')
  } else {
    console.log('')
    console.log('⚠️  ALGUNS TESTES FALHARAM')
    console.log('Verifique os resultados acima')
  }
})
.catch(err => console.error('❌ ERRO GERAL:', err))
```

**Opção B: Testes individuais**

Se preferir testar um por vez:

```javascript
// Teste 1: Salvar estado
fetch('/api/nutri/ai/state', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    perfil: { nicho: "nutrição" },
    preferencias: {},
    restricoes: {}
  })
})
.then(r => r.json())
.then(data => console.log('✅ Estado salvo:', data))
```

```javascript
// Teste 2: Buscar estado
fetch('/api/nutri/ai/state', { credentials: 'include' })
.then(r => r.json())
.then(data => console.log('✅ Estado encontrado:', data))
```

```javascript
// Teste 3: Registrar evento
fetch('/api/nutri/ai/memory/event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    tipo: 'acao',
    conteudo: { acao: "teste" },
    util: true
  })
})
.then(r => r.json())
.then(data => console.log('✅ Evento registrado:', data))
```

```javascript
// Teste 4: Buscar memória
fetch('/api/nutri/ai/memory/recent?limit=5', { credentials: 'include' })
.then(r => r.json())
.then(data => console.log('✅ Memória recente:', data))
```

---

## ✅ RESULTADO ESPERADO

Se tudo estiver funcionando, você verá:

```
📊 RESULTADOS:
1. Salvar estado: ✅ { success: true, state: {...} }
2. Buscar estado: ✅ { state: {...} }
3. Registrar evento: ✅ { success: true, event: {...} }
4. Buscar memória: ✅ { events: [...] }

🎉 TODOS OS TESTES PASSARAM!
✅ FASE 1 ESTÁ 100% FUNCIONAL
```

---

## ❌ SE ALGO FALHAR

**Erro de autenticação:**
- Certifique-se de estar logado
- Recarregue a página e tente novamente

**Erro 500:**
- Verifique os logs do servidor (`npm run dev`)
- Verifique se as tabelas existem no Supabase

**Erro 404:**
- Verifique se o servidor está rodando
- Verifique se a rota está correta

---

## 🎯 PRÓXIMO PASSO

Se todos os testes passarem:
- ✅ Fase 1 está completa
- ✅ Podemos avançar para Fase 2 (Responses API)

