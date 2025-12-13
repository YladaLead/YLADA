# 🧪 TESTE FASE 1 - APIs de Memória LYA

**Validação das APIs criadas na Fase 1**

---

## ✅ PRÉ-REQUISITOS

- [x] Migration executada no Supabase
- [x] Tabelas criadas: `ai_state_user`, `ai_memory_events`, `ai_knowledge_chunks`
- [x] Servidor rodando (`npm run dev`)

---

## 🧪 TESTES

### **Teste 1: Salvar Estado da Usuária**

**Endpoint:** `POST /api/nutri/ai/state`

**Como testar:**
1. Abra o navegador em `http://localhost:3000`
2. Faça login na área Nutri
3. Abra o Console do navegador (F12)
4. Execute no console:

```javascript
fetch('/api/nutri/ai/state', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    perfil: { nicho: "nutrição", objetivos: "emagrecimento" },
    preferencias: { metas: ["aumentar clientes"] },
    restricoes: {}
  })
})
.then(r => r.json())
.then(data => console.log('✅ Estado salvo:', data))
.catch(err => console.error('❌ Erro:', err))
```

**Resultado esperado:**
```json
{
  "success": true,
  "state": {
    "user_id": "...",
    "perfil": { "nicho": "nutrição", "objetivos": "emagrecimento" },
    "preferencias": { "metas": ["aumentar clientes"] },
    "restricoes": {},
    "ultima_atualizacao": "2024-..."
  }
}
```

---

### **Teste 2: Buscar Estado da Usuária**

**Endpoint:** `GET /api/nutri/ai/state`

**Como testar:**
```javascript
fetch('/api/nutri/ai/state', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log('✅ Estado encontrado:', data))
.catch(err => console.error('❌ Erro:', err))
```

**Resultado esperado:**
```json
{
  "state": {
    "user_id": "...",
    "perfil": { ... },
    "preferencias": { ... },
    "restricoes": { ... }
  }
}
```

---

### **Teste 3: Registrar Evento de Memória**

**Endpoint:** `POST /api/nutri/ai/memory/event`

**Como testar:**
```javascript
fetch('/api/nutri/ai/memory/event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    tipo: 'acao',
    conteudo: { acao: "criou quiz", resultado: "10 visualizações" },
    util: true
  })
})
.then(r => r.json())
.then(data => console.log('✅ Evento registrado:', data))
.catch(err => console.error('❌ Erro:', err))
```

**Resultado esperado:**
```json
{
  "success": true,
  "event": {
    "id": "...",
    "user_id": "...",
    "tipo": "acao",
    "conteudo": { "acao": "criou quiz", "resultado": "10 visualizações" },
    "util": true,
    "created_at": "2024-..."
  }
}
```

---

### **Teste 4: Buscar Memória Recente**

**Endpoint:** `GET /api/nutri/ai/memory/recent?limit=5`

**Como testar:**
```javascript
fetch('/api/nutri/ai/memory/recent?limit=5', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log('✅ Memória recente:', data))
.catch(err => console.error('❌ Erro:', err))
```

**Resultado esperado:**
```json
{
  "events": [
    {
      "id": "...",
      "user_id": "...",
      "tipo": "acao",
      "conteudo": { ... },
      "util": true,
      "created_at": "2024-..."
    }
  ]
}
```

---

## ✅ VALIDAÇÃO FINAL

Se todos os 4 testes passarem:
- ✅ Fase 1 está 100% funcional
- ✅ Podemos avançar para Fase 2 (Responses API)

Se algum teste falhar:
- ❌ Verificar erro no console
- ❌ Verificar logs do servidor
- ❌ Me avisar qual teste falhou

---

## 🔍 VERIFICAÇÃO NO SUPABASE

Você também pode verificar diretamente no Supabase:

```sql
-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ai_state_user', 'ai_memory_events', 'ai_knowledge_chunks');

-- Verificar dados inseridos
SELECT * FROM ai_state_user LIMIT 1;
SELECT * FROM ai_memory_events ORDER BY created_at DESC LIMIT 5;
```

