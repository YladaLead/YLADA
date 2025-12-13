#!/bin/bash

echo "🧪 TESTE FASE 1: Formato Fixo da LYA"
echo "======================================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar se servidor está rodando
echo "1️⃣ Verificando se servidor está rodando..."
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Servidor rodando em http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Servidor não está rodando${NC}"
    echo "   Execute: npm run dev"
    exit 1
fi
echo ""

# 2. Verificar estrutura da API
echo "2️⃣ Verificando estrutura da API..."
API_RESPONSE=$(curl -s http://localhost:3000/api/nutri/lya/analise 2>&1)
if echo "$API_RESPONSE" | grep -q "error\|401\|403"; then
    echo -e "${YELLOW}⚠️  API retornou erro (normal se não estiver autenticado)${NC}"
    echo "   Resposta: $(echo "$API_RESPONSE" | head -c 200)"
else
    echo -e "${GREEN}✅ API está respondendo${NC}"
fi
echo ""

# 3. Verificar arquivos implementados
echo "3️⃣ Verificando arquivos implementados..."
FILES=(
    "src/components/nutri/LyaAnaliseHoje.tsx"
    "src/app/api/nutri/lya/analise/route.ts"
    "src/lib/nutri/parse-lya-response.ts"
    "src/types/nutri-diagnostico.ts"
    "migrations/155-atualizar-tabela-lya-analise-formato-fixo.sql"
)

ALL_EXIST=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file (não encontrado)${NC}"
        ALL_EXIST=false
    fi
done

if [ "$ALL_EXIST" = false ]; then
    echo -e "${RED}❌ Alguns arquivos estão faltando${NC}"
    exit 1
fi
echo ""

# 4. Verificar se parser tem função parseLyaResponse
echo "4️⃣ Verificando parser..."
if grep -q "parseLyaResponse" src/lib/nutri/parse-lya-response.ts; then
    echo -e "${GREEN}✅ Parser implementado${NC}"
else
    echo -e "${RED}❌ Parser não encontrado${NC}"
    exit 1
fi
echo ""

# 5. Verificar se componente usa novo formato
echo "5️⃣ Verificando componente..."
if grep -q "foco_prioritario\|acoes_recomendadas\|onde_aplicar\|metrica_sucesso" src/components/nutri/LyaAnaliseHoje.tsx; then
    echo -e "${GREEN}✅ Componente usa novo formato${NC}"
else
    echo -e "${RED}❌ Componente não usa novo formato${NC}"
    exit 1
fi
echo ""

# 6. Verificar se API usa parser
echo "6️⃣ Verificando integração API..."
if grep -q "parseLyaResponse\|parse-lya-response" src/app/api/nutri/lya/analise/route.ts; then
    echo -e "${GREEN}✅ API integrada com parser${NC}"
else
    echo -e "${RED}❌ API não usa parser${NC}"
    exit 1
fi
echo ""

echo "======================================"
echo -e "${GREEN}✅ TESTE ESTRUTURAL COMPLETO${NC}"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Executar migration no Supabase:"
echo "   migrations/155-atualizar-tabela-lya-analise-formato-fixo.sql"
echo ""
echo "2. Testar no navegador:"
echo "   - Login com demo.nutri@ylada.com"
echo "   - Acessar /pt/nutri/home"
echo "   - Verificar card da LYA"
echo ""
echo "3. Verificar console (F12) para logs de validação"

