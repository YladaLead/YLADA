#!/bin/bash

# Script para substituir nutri por coach em todos os arquivos

echo "🔄 Iniciando substituições nutri → coach..."

# Diretórios a processar
DIRS=(
  "src/app/pt/coach"
  "src/app/api/coach"
  "src/components/coach"
  "src/lib/diagnostics/coach"
)

# Substituições básicas
for dir in "${DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "📁 Processando: $dir"
    
    # Substituir em arquivos .tsx, .ts, .js, .jsx
    find "$dir" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i '' \
      -e 's|/pt/nutri/|/pt/coach/|g' \
      -e 's|/api/nutri/|/api/coach/|g' \
      -e 's|NutriSidebar|CoachSidebar|g' \
      -e 's|NutriNavBar|CoachNavBar|g' \
      -e 's|NutriLayout|CoachLayout|g' \
      -e 's|NutriDashboard|CoachDashboard|g' \
      -e 's|from.*nutri|from "@/components/coach|g' \
      -e 's|from.*Nutri|from "@/components/coach/Coach|g' \
      -e "s|profession='nutri'|profession='coach'|g" \
      -e 's|profession: "nutri"|profession: "coach"|g' \
      -e 's|profession: '\''nutri'\''|profession: '\''coach'\''|g' \
      -e 's|perfil="nutri"|perfil="coach"|g' \
      -e 's|perfil: "nutri"|perfil: "coach"|g' \
      -e 's|/images/logo/nutri/|/images/logo/coach/|g' \
      -e 's|Logo_Nutri_|Logo_Coach_|g' \
      -e 's|manifest-nutri|manifest-coach|g' \
      -e 's|Nutri by YLADA|Coach by YLADA|g' \
      {} \;
  fi
done

echo "✅ Substituições básicas concluídas!"

