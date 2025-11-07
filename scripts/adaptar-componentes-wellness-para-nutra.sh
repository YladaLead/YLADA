#!/bin/bash

# Script para adaptar componentes Wellness para Nutra
# Substitui imports, cores, textos

echo "🎨 Adaptando componentes Wellness para Nutra..."
echo ""

# Verificar se Nutra existe
if [ ! -d "src/components/nutra" ]; then
  echo "❌ Erro: Pasta src/components/nutra não encontrada!"
  echo "   Execute primeiro: ./scripts/copiar-wellness-para-nutra.sh"
  exit 1
fi

# Renomear arquivos
echo "📝 Renomeando arquivos..."
find src/components/nutra -type f -name "*Wellness*.tsx" | while read file; do
  newfile=$(echo "$file" | sed 's/Wellness/Nutra/g')
  mv "$file" "$newfile" 2>/dev/null
done

# Substituições nos arquivos
echo "🔄 Fazendo substituições..."

find src/components/nutra -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  # Substituições básicas
  sed -i '' \
    -e 's/Wellness/Nutra/g' \
    -e 's/wellness/nutra/g' \
    -e 's/WELLNESS/NUTRA/g' \
    -e 's|/pt/wellness|/pt/nutra|g' \
    -e 's|/api/wellness|/api/nutra|g' \
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

# Adaptar previews também
if [ -d "src/components/nutra-previews" ]; then
  find src/components/nutra-previews -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
    sed -i '' \
      -e 's/Wellness/Nutra/g' \
      -e 's/wellness/nutra/g' \
      "$file"
  done
fi

echo ""
echo "✅ Componentes adaptados!"
echo ""
echo "📋 Verificações necessárias:"
echo "   - [ ] Verificar imports nos arquivos"
echo "   - [ ] Verificar cores (roxo/rosa)"
echo "   - [ ] Verificar textos (Nutra, não Wellness)"

