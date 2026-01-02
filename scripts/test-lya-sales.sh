#!/bin/bash

# 🧪 Script de Teste Rápido - LYA Sales
# Testa se a API da LYA Sales está funcionando

echo "🧪 TESTE RÁPIDO - LYA SALES"
echo "============================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se servidor está rodando
echo "1️⃣ Verificando se servidor está rodando..."
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Servidor está rodando${NC}"
else
    echo -e "${RED}❌ Servidor não está rodando. Execute: npm run dev${NC}"
    exit 1
fi
echo ""

# Verificar variáveis de ambiente
echo "2️⃣ Verificando variáveis de ambiente..."
if [ -f .env.local ]; then
    if grep -q "OPENAI_ASSISTANT_LYA_SALES_ID" .env.local || grep -q "OPENAI_ASSISTANT_LYA_ID" .env.local; then
        echo -e "${GREEN}✅ Variáveis de ambiente encontradas${NC}"
        if grep -q "OPENAI_ASSISTANT_LYA_SALES_ID" .env.local; then
            echo -e "   ${GREEN}✅ OPENAI_ASSISTANT_LYA_SALES_ID configurado${NC}"
        else
            echo -e "   ${YELLOW}⚠️  Usando fallback OPENAI_ASSISTANT_LYA_ID${NC}"
        fi
    else
        echo -e "${RED}❌ Nenhuma variável de Assistant ID encontrada${NC}"
        echo -e "   Configure OPENAI_ASSISTANT_LYA_SALES_ID ou OPENAI_ASSISTANT_LYA_ID no .env.local"
        exit 1
    fi
else
    echo -e "${RED}❌ Arquivo .env.local não encontrado${NC}"
    exit 1
fi
echo ""

# Testar endpoint da API
echo "3️⃣ Testando endpoint /api/nutri/lya/sales..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/nutri/lya/sales \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá, como funciona a plataforma?"}')

if echo "$RESPONSE" | grep -q "response"; then
    echo -e "${GREEN}✅ API respondeu com sucesso${NC}"
    echo ""
    echo "📝 Resposta (primeiros 200 caracteres):"
    echo "$RESPONSE" | head -c 200
    echo "..."
else
    echo -e "${RED}❌ Erro na API${NC}"
    echo "Resposta completa:"
    echo "$RESPONSE"
    exit 1
fi
echo ""
echo ""

# Verificar página de vendas
echo "4️⃣ Verificando página de vendas..."
if curl -s http://localhost:3000/pt/nutri | grep -q "LyaSalesWidget\|Tirar dúvida"; then
    echo -e "${GREEN}✅ Página de vendas acessível${NC}"
else
    echo -e "${YELLOW}⚠️  Não foi possível verificar widget na página${NC}"
fi
echo ""

echo "============================"
echo -e "${GREEN}✅ TESTE CONCLUÍDO${NC}"
echo ""
echo "📖 Para testes completos, veja: docs/COMO-TESTAR-LYA-SALES.md"
echo ""
















