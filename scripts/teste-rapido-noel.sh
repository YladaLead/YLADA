#!/bin/bash

# Script de teste rápido do NOEL
# Verifica se tudo está configurado antes de testar

echo "🧪 TESTE RÁPIDO - NOEL"
echo "======================"
echo ""

# Verificar se servidor está rodando
echo "1️⃣ Verificando se servidor está rodando..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "   ✅ Servidor rodando em http://localhost:3000"
else
    echo "   ❌ Servidor NÃO está rodando"
    echo "   💡 Execute: npm run dev"
    exit 1
fi

# Verificar variáveis de ambiente
echo ""
echo "2️⃣ Verificando variáveis de ambiente..."
if [ -f .env.local ]; then
    if grep -q "OPENAI_ASSISTANT_NOEL_ID" .env.local; then
        ASSISTANT_ID=$(grep "OPENAI_ASSISTANT_NOEL_ID" .env.local | cut -d '=' -f2)
        echo "   ✅ OPENAI_ASSISTANT_NOEL_ID: $ASSISTANT_ID"
    else
        echo "   ❌ OPENAI_ASSISTANT_NOEL_ID não encontrado"
        exit 1
    fi
    
    if grep -q "OPENAI_API_KEY" .env.local; then
        echo "   ✅ OPENAI_API_KEY: configurado"
    else
        echo "   ❌ OPENAI_API_KEY não encontrado"
        exit 1
    fi
else
    echo "   ❌ Arquivo .env.local não encontrado"
    exit 1
fi

# Verificar se endpoint está acessível
echo ""
echo "3️⃣ Verificando endpoint do NOEL..."
if curl -s http://localhost:3000/api/wellness/noel -X POST -H "Content-Type: application/json" -d '{"message":"test"}' | grep -q "error\|Não autorizado"; then
    echo "   ✅ Endpoint acessível (retornou erro de autenticação, o que é esperado)"
else
    echo "   ⚠️  Endpoint pode não estar funcionando corretamente"
fi

# Resumo
echo ""
echo "✅ VERIFICAÇÕES CONCLUÍDAS"
echo ""
echo "📋 Próximos passos:"
echo "   1. Acesse: http://localhost:3000/pt/wellness/noel"
echo "   2. Execute os 3 testes do guia: docs/GUIA-TESTE-RAPIDO-NOEL.md"
echo "   3. Verifique os logs no terminal"
echo ""
echo "📖 Guia completo: docs/GUIA-TESTE-RAPIDO-NOEL.md"
echo ""
