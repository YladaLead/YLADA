# 🧪 TESTE SIMPLES - FASE 1

**Teste passo a passo, um de cada vez**

---

## 🔧 TESTE SIMPLES (um por vez)

Cole no console, um de cada vez:

### **1. Salvar Estado**

```javascript
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
.then(data => {
  console.log('✅ RESULTADO SALVAR:', data)
  if (data.success) {
    console.log('✅ Estado salvo com sucesso!')
  } else {
    console.error('❌ Erro ao salvar:', data)
  }
})
.catch(err => console.error('❌ ERRO:', err))
```

**Aguarde o resultado antes de continuar.**

---

### **2. Buscar Estado (após salvar)**

```javascript
fetch('/api/nutri/ai/state', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  console.log('✅ RESULTADO BUSCAR:', data)
  if (data.state) {
    console.log('✅ Estado encontrado!')
    console.log('Dados:', data.state)
  } else {
    console.warn('⚠️ Estado não encontrado (null)')
    console.log('Isso é normal se é a primeira vez')
  }
})
.catch(err => console.error('❌ ERRO:', err))
```

---

### **3. Registrar Evento**

```javascript
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
.then(data => {
  console.log('✅ RESULTADO EVENTO:', data)
  if (data.success) {
    console.log('✅ Evento registrado!')
  } else {
    console.error('❌ Erro ao registrar:', data)
  }
})
.catch(err => console.error('❌ ERRO:', err))
```

---

### **4. Buscar Memória**

```javascript
fetch('/api/nutri/ai/memory/recent?limit=5', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  console.log('✅ RESULTADO MEMÓRIA:', data)
  if (data.events && Array.isArray(data.events)) {
    console.log('✅ Memória encontrada!')
    console.log('Eventos:', data.events.length)
  } else {
    console.warn('⚠️ Memória vazia ou erro')
  }
})
.catch(err => console.error('❌ ERRO:', err))
```

---

## 🔍 VERIFICAÇÃO

Se o "Buscar estado" retornar `null`, verifique:

1. **No terminal do servidor**, você deve ver logs como:
   ```
   🔍 [GET /api/nutri/ai/state] Buscando estado para user_id: ...
   ✅ [GET /api/nutri/ai/state] Estado encontrado: sim/não
   ```

2. **No Supabase SQL Editor**, execute:
   ```sql
   SELECT * FROM ai_state_user;
   ```
   
   Veja se há algum registro com seu `user_id`.

---

## ✅ CONCLUSÃO

Se 3 de 4 testes passarem (salvar, evento, memória), a Fase 1 está **funcional**. O "buscar estado" retornar `null` pode ser normal se:
- É a primeira vez que você salva
- O estado foi salvo mas ainda não foi buscado

**O importante é que o POST (salvar) funcionou!**

