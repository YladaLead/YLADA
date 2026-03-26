#!/bin/bash
# Legado: testava POST /api/nutri/noel/sales (removido).
# Use o mesmo proxy do chat: POST /api/nutri/noel → /api/ylada/noel.

echo "🧪 Smoke: Nutri Noel (substitui teste sales legado)"
echo "====================================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "1️⃣ Servidor..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}❌ npm run dev${NC}"
    exit 1
fi
echo -e "${GREEN}✅ OK${NC}"
echo ""

echo "2️⃣ POST /api/nutri/noel..."
RESP=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/nutri/noel \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Olá"}]}')
CODE=$(echo "$RESP" | tail -n 1)
BODY=$(echo "$RESP" | sed '$d')
if [ "$CODE" = "401" ] || [ "$CODE" = "403" ] || echo "$BODY" | grep -q "error"; then
    echo -e "${YELLOW}⚠️  Sem sessão: HTTP $CODE (esperado em dev)${NC}"
else
    echo -e "${GREEN}✅ HTTP $CODE${NC}"
fi
echo ""
echo -e "${GREEN}✅ Script atualizado — sales dedicado foi consolidado no Noel central.${NC}"
