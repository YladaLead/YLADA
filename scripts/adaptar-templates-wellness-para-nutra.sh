#!/bin/bash

# Script para adaptar templates Wellness para Nutra
# Substitui componentes, cores, textos

echo "🎯 Adaptando templates Wellness para Nutra..."
echo ""

# Verificar se templates Nutra existem
if [ ! -d "src/app/pt/nutra/templates" ]; then
  echo "❌ Erro: Pasta src/app/pt/nutra/templates não encontrada!"
  echo "   Execute primeiro: ./scripts/copiar-wellness-para-nutra.sh"
  exit 1
fi

# Substituições em todos os templates
echo "🔄 Fazendo substituições..."

find src/app/pt/nutra/templates -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  sed -i '' \
    -e 's|WellnessHeader|NutraHeader|g' \
    -e 's|WellnessLanding|NutraLanding|g' \
    -e 's|WellnessCTAButton|NutraCTAButton|g' \
    -e 's|from.*wellness|from "@/components/nutra|g' \
    -e 's|green-600|orange-600|g' \
    -e 's|green-500|orange-500|g' \
    -e 's|green-700|orange-700|g' \
    -e 's|green-400|orange-400|g' \
    -e 's|emerald-600|orange-600|g' \
    -e 's|emerald-500|orange-500|g' \
    -e 's|bg-green|bg-orange|g' \
    -e 's|text-green|text-orange|g' \
    -e 's|border-green|border-orange|g' \
    -e 's|hover:bg-green|hover:bg-orange|g' \
    -e 's|hover:text-green|hover:text-orange|g' \
    "$file"
done

echo ""
echo "✅ Templates adaptados!"
echo ""
echo "📋 Verificações necessárias:"
echo "   - [ ] Verificar imports de componentes Nutra"
echo "   - [ ] Verificar cores (roxo/rosa)"
echo "   - [ ] Testar cada template"

