#!/bin/bash

# Script para adaptar páginas Wellness para Nutra
# Substitui rotas, imports, cores, textos

echo "📄 Adaptando páginas Wellness para Nutra..."
echo ""

# Verificar se Nutra existe
if [ ! -d "src/app/pt/nutra" ]; then
  echo "❌ Erro: Pasta src/app/pt/nutra não encontrada!"
  echo "   Execute primeiro: ./scripts/copiar-wellness-para-nutra.sh"
  exit 1
fi

# Substituições em todos os arquivos
echo "🔄 Fazendo substituições..."

find src/app/pt/nutra -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  sed -i '' \
    -e 's|/pt/wellness|/pt/nutra|g' \
    -e 's|/api/wellness|/api/nutra|g' \
    -e 's|WellnessNavBar|NutraNavBar|g' \
    -e 's|WellnessHeader|NutraHeader|g' \
    -e 's|WellnessLanding|NutraLanding|g' \
    -e 's|WellnessCTAButton|NutraCTAButton|g' \
    -e 's|from.*wellness|from "@/components/nutra|g' \
    -e 's|perfil="wellness"|perfil="nutra"|g' \
    -e "s|perfil='wellness'|perfil='nutra'|g" \
    -e 's|area="wellness"|area="nutra"|g' \
    -e "s|area='wellness'|area='nutra'|g" \
    -e 's|profession="wellness"|profession="nutra"|g' \
    -e "s|profession='wellness'|profession='nutra'|g" \
    -e 's|green-600|orange-600|g' \
    -e 's|green-500|orange-500|g' \
    -e 's|green-700|orange-700|g' \
    -e 's|green-400|orange-400|g' \
    -e 's|green-300|orange-300|g' \
    -e 's|emerald-600|orange-600|g' \
    -e 's|emerald-500|orange-500|g' \
    -e 's|emerald-400|orange-400|g' \
    -e 's|bg-green|bg-orange|g' \
    -e 's|text-green|text-orange|g' \
    -e 's|border-green|border-orange|g' \
    -e 's|hover:bg-green|hover:bg-orange|g' \
    -e 's|hover:text-green|hover:text-orange|g' \
    -e 's|Distribuidor Wellness|Consultor Nutra|g' \
    -e 's|Wellness|Nutra|g' \
    "$file"
done

echo ""
echo "✅ Páginas adaptadas!"
echo ""
echo "📋 Verificações necessárias:"
echo "   - [ ] Verificar imports de componentes"
echo "   - [ ] Verificar rotas (/pt/nutra, /api/nutra)"
echo "   - [ ] Verificar perfil e área (nutra)"
echo "   - [ ] Verificar cores (roxo/rosa)"

