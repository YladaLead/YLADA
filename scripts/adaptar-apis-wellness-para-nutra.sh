#!/bin/bash

# Script para adaptar APIs Wellness para Nutra
# Substitui profession, área, rotas

echo "🔌 Adaptando APIs Wellness para Nutra..."
echo ""

# Verificar se API Nutra existe
if [ ! -d "src/app/api/nutra" ]; then
  echo "❌ Erro: Pasta src/app/api/nutra não encontrada!"
  echo "   Execute primeiro: ./scripts/copiar-wellness-para-nutra.sh"
  exit 1
fi

# Substituições em todos os arquivos
echo "🔄 Fazendo substituições..."

find src/app/api/nutra -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
  sed -i '' \
    -e "s|'wellness'|'nutra'|g" \
    -e 's|"wellness"|"nutra"|g' \
    -e 's|area:.*wellness|area: "nutra"|g' \
    -e 's|profession.*wellness|profession: "nutra"|g' \
    -e 's|/wellness/|/nutra/|g' \
    -e 's|Wellness|Nutra|g' \
    "$file"
done

echo ""
echo "✅ APIs adaptadas!"
echo ""
echo "📋 Verificações necessárias:"
echo "   - [ ] Verificar profession='nutra' nas queries"
echo "   - [ ] Verificar área 'nutra' nos endpoints"
echo "   - [ ] Testar endpoints da API"

