#!/bin/bash

# Script de teste para APIs da Fase 1 - LYA Memória
# Execute este script após fazer login na área Nutri no navegador

echo "🧪 TESTE FASE 1 - APIs de Memória LYA"
echo "======================================"
echo ""

# Verificar se o servidor está rodando
if ! lsof -ti:3000 > /dev/null 2>&1; then
  echo "❌ Servidor não está rodando na porta 3000"
  echo "   Execute: npm run dev"
  exit 1
fi

echo "✅ Servidor está rodando"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   1. Faça login na área Nutri em http://localhost:3000"
echo "   2. Abra o Console do navegador (F12)"
echo "   3. Execute os comandos abaixo no console:"
echo ""
echo "======================================"
echo ""

cat << 'EOF'
// ============================================
// TESTE 1: Salvar Estado da Usuária
// ============================================
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
.then(data => {
  console.log('✅ TESTE 1 - Estado salvo:', data)
  if (data.success) {
    console.log('✅ TESTE 1 PASSOU!')
  } else {
    console.error('❌ TESTE 1 FALHOU:', data)
  }
})
.catch(err => console.error('❌ TESTE 1 ERRO:', err))

// ============================================
// TESTE 2: Buscar Estado da Usuária
// ============================================
fetch('/api/nutri/ai/state', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  console.log('✅ TESTE 2 - Estado encontrado:', data)
  if (data.state) {
    console.log('✅ TESTE 2 PASSOU!')
  } else {
    console.error('❌ TESTE 2 FALHOU:', data)
  }
})
.catch(err => console.error('❌ TESTE 2 ERRO:', err))

// ============================================
// TESTE 3: Registrar Evento de Memória
// ============================================
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
.then(data => {
  console.log('✅ TESTE 3 - Evento registrado:', data)
  if (data.success && data.event) {
    console.log('✅ TESTE 3 PASSOU!')
  } else {
    console.error('❌ TESTE 3 FALHOU:', data)
  }
})
.catch(err => console.error('❌ TESTE 3 ERRO:', err))

// ============================================
// TESTE 4: Buscar Memória Recente
// ============================================
fetch('/api/nutri/ai/memory/recent?limit=5', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  console.log('✅ TESTE 4 - Memória recente:', data)
  if (data.events && Array.isArray(data.events)) {
    console.log('✅ TESTE 4 PASSOU!')
  } else {
    console.error('❌ TESTE 4 FALHOU:', data)
  }
})
.catch(err => console.error('❌ TESTE 4 ERRO:', err))

// ============================================
// TESTE COMPLETO (todos de uma vez)
// ============================================
console.log('🚀 Executando todos os testes...')

Promise.all([
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
  
  fetch('/api/nutri/ai/state', { credentials: 'include' }).then(r => r.json()),
  
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
  
  fetch('/api/nutri/ai/memory/recent?limit=5', { credentials: 'include' }).then(r => r.json())
])
.then(results => {
  console.log('📊 RESULTADOS:')
  console.log('1. Salvar estado:', results[0].success ? '✅' : '❌')
  console.log('2. Buscar estado:', results[1].state ? '✅' : '❌')
  console.log('3. Registrar evento:', results[2].success ? '✅' : '❌')
  console.log('4. Buscar memória:', Array.isArray(results[3].events) ? '✅' : '❌')
  
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
EOF

echo ""
echo "======================================"
echo ""
echo "📋 INSTRUÇÕES:"
echo "   1. Copie todo o código acima"
echo "   2. Cole no Console do navegador (F12)"
echo "   3. Pressione Enter"
echo "   4. Veja os resultados"
echo ""

