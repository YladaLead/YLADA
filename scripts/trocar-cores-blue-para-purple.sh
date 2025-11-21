#!/bin/bash

# Script para trocar cores blue por purple em todos os arquivos coach

echo "🎨 Trocando cores blue → purple..."

DIRS=(
  "src/app/pt/coach"
  "src/app/api/coach"
  "src/components/coach"
)

for dir in "${DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "📁 Processando: $dir"
    
    find "$dir" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
      -e 's|bg-blue-|bg-purple-|g' \
      -e 's|text-blue-|text-purple-|g' \
      -e 's|border-blue-|border-purple-|g' \
      -e 's|hover:bg-blue-|hover:bg-purple-|g' \
      -e 's|hover:text-blue-|hover:text-purple-|g' \
      -e 's|hover:border-blue-|hover:border-purple-|g' \
      -e 's|from-blue-|from-purple-|g' \
      -e 's|to-blue-|to-purple-|g' \
      -e 's|ring-blue-|ring-purple-|g' \
      -e 's|focus:ring-blue-|focus:ring-purple-|g' \
      -e 's|focus:border-blue-|focus:border-purple-|g' \
      {} \;
  fi
done

echo "✅ Cores trocadas!"

