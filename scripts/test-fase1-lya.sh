#!/bin/bash
# Smoke: mentor Nutri via POST /api/nutri/noel (proxy → /api/ylada/noel).
# Nome histórico do script; rotas /api/nutri/noel/analise foram removidas.

echo "🧪 Smoke: Nutri Noel (proxy)"
echo "============================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "1️⃣ Servidor em localhost:3000..."
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Servidor respondendo${NC}"
else
    echo -e "${RED}❌ Servidor não está rodando (npm run dev)${NC}"
    exit 1
fi
echo ""

echo "2️⃣ POST /api/nutri/noel (sem cookie → esperado 401 ou erro JSON)..."
API_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/nutri/noel \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"ping"}]}')
HTTP_CODE=$(echo "$API_RESPONSE" | tail -n 1)
HTTP_BODY=$(echo "$API_RESPONSE" | sed '$d')
if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ] || echo "$HTTP_BODY" | grep -q "error"; then
    echo -e "${YELLOW}⚠️  Resposta esperada sem sessão (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${GREEN}✅ HTTP $HTTP_CODE${NC}"
fi
echo ""

echo "3️⃣ Arquivos atuais..."
for f in \
  "src/lib/nutri/jornada-phase-display.ts" \
  "src/app/api/nutri/noel/route.ts" \
  "src/types/nutri-diagnostico.ts"
do
  if [ -f "$f" ]; then
    echo -e "${GREEN}✅ $f${NC}"
  else
    echo -e "${RED}❌ $f${NC}"
    exit 1
  fi
done

if [ -f "src/app/api/nutri/noel/analise/route.ts" ]; then
    echo -e "${RED}❌ Rota legada analise ainda existe${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Rota /api/nutri/noel/analise removida${NC}"
echo ""

echo "============================"
echo -e "${GREEN}✅ Smoke OK${NC}"
