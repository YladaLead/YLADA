# 🧪 TESTE FASE 1 - VERSÃO CORRIGIDA

**Teste com delay para garantir que o POST termine antes do GET**

---

## 🔧 TESTE CORRIGIDO (com delay)

Cole este código no console do navegador (após fazer login):

```javascript
// Teste com delay entre POST e GET
async function testarFase1() {
  console.log('🚀 Iniciando testes...')
  
  // Teste 1: Salvar estado
  console.log('1️⃣ Salvando estado...')
  const saveResult = await fetch('/api/nutri/ai/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      perfil: { nicho: "nutrição" },
      preferencias: {},
      restricoes: {}
    })
  }).then(r => r.json())
  
  console.log('✅ Estado salvo:', saveResult)
  
  // Aguardar 500ms para garantir que salvou
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Teste 2: Buscar estado
  console.log('2️⃣ Buscando estado...')
  const getResult = await fetch('/api/nutri/ai/state', {
    credentials: 'include'
  }).then(r => r.json())
  
  console.log('✅ Estado encontrado:', getResult)
  
  // Teste 3: Registrar evento
  console.log('3️⃣ Registrando evento...')
  const eventResult = await fetch('/api/nutri/ai/memory/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      tipo: 'acao',
      conteudo: { acao: "teste" },
      util: true
    })
  }).then(r => r.json())
  
  console.log('✅ Evento registrado:', eventResult)
  
  // Teste 4: Buscar memória
  console.log('4️⃣ Buscando memória...')
  const memoryResult = await fetch('/api/nutri/ai/memory/recent?limit=5', {
    credentials: 'include'
  }).then(r => r.json())
  
  console.log('✅ Memória encontrada:', memoryResult)
  
  // Resultado final
  console.log('')
  console.log('📊 RESULTADOS FINAIS:')
  console.log('1. Salvar estado:', saveResult.success ? '✅' : '❌')
  console.log('2. Buscar estado:', getResult.state ? '✅' : '❌')
  console.log('3. Registrar evento:', eventResult.success ? '✅' : '❌')
  console.log('4. Buscar memória:', Array.isArray(memoryResult.events) ? '✅' : '❌')
  
  const allPassed = saveResult.success && getResult.state && eventResult.success && Array.isArray(memoryResult.events)
  
  if (allPassed) {
    console.log('')
    console.log('🎉 TODOS OS TESTES PASSARAM!')
    console.log('✅ FASE 1 ESTÁ 100% FUNCIONAL')
  } else {
    console.log('')
    console.log('⚠️ ALGUNS TESTES FALHARAM')
    if (!saveResult.success) console.log('   - Salvar estado falhou')
    if (!getResult.state) console.log('   - Buscar estado falhou (retornou null)')
    if (!eventResult.success) console.log('   - Registrar evento falhou')
    if (!Array.isArray(memoryResult.events)) console.log('   - Buscar memória falhou')
  }
}

// Executar
testarFase1()
```

---

## 🔍 VERIFICAÇÃO NO SUPABASE

Se o teste ainda falhar, verifique diretamente no Supabase:

```sql
-- Verificar se o estado foi salvo
SELECT * FROM ai_state_user 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com');

-- Verificar eventos
SELECT * FROM ai_memory_events 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com')
ORDER BY created_at DESC;
```

---

## 🐛 POSSÍVEIS CAUSAS

1. **RLS bloqueando:** Verifique se as políticas RLS estão corretas
2. **Timing:** O delay de 500ms deve resolver
3. **User ID diferente:** Improvável, mas verifique os logs do servidor

---

## ✅ PRÓXIMO PASSO

Execute o teste corrigido e me avise o resultado!

