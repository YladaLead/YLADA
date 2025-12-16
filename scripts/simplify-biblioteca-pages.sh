#!/bin/bash
# Script para simplificar páginas da biblioteca

cd src/app/pt/wellness/biblioteca

# Lista de arquivos para processar
files=(
  "cartilhas/page.tsx"
  "scripts/page.tsx"
  "divulgacao/page.tsx"
  "materiais/page.tsx"
  "gerenciar/page.tsx"
  "videos/page.tsx"
  "produtos/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file"
    # Remover imports
    sed -i '' '/import ProtectedRoute/d' "$file"
    sed -i '' '/import RequireSubscription/d' "$file"
    # Substituir wrapper
    # Isso precisa ser feito manualmente para cada arquivo
  fi
done

echo "Done!"

