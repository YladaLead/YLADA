#!/bin/bash

# =====================================================
# IDENTIFICAR TEMPLATES PARA REMOVER
# =====================================================
# Compara os 31 templates do banco com os 44 diretórios

echo "📊 Análise: Templates do Banco vs Diretórios no Código"
echo "======================================================"
echo ""

# Templates que DEVEM ser mantidos (31 do banco)
TEMPLATES_MANTER=(
  "hidratacao"
  "calorias"
  "imc"
  "proteina"
  "hydration-guide"
  "checklist-alimentar"
  "detox-menu"
  "hunger-type"
  "intolerance-assessment"
  "metabolic-profile-assessment"
  "initial-assessment"
  "21-day-challenge"
  "7-day-challenge"
  "electrolyte-diagnosis"
  "intestinal-symptoms-diagnosis"
  "ready-to-lose-weight"
  "wellness-profile"
  "story-interativo"
  "healthy-eating"
  "healthy-eating-quiz"
  "ganhos"
  "gains-and-prosperity"
  "potencial"
  "potential-and-growth"
  "proposito"
  "purpose-and-balance"
  "metabolic-syndrome-risk"
  "water-retention-test"
  "body-awareness"
  "nourished-vs-fed"
  "eating-routine"
)

echo "✅ Templates a manter (31):"
for template in "${TEMPLATES_MANTER[@]}"; do
  echo "  - $template"
done

echo ""
echo "🔍 Verificando diretórios existentes..."
echo ""

# Listar todos os diretórios
find src/app/pt/wellness/templates -type d -mindepth 1 -maxdepth 1 | \
  sed 's|src/app/pt/wellness/templates/||' | \
  sort | while read dir; do
    # Verificar se está na lista de manter
    found=false
    for keep in "${TEMPLATES_MANTER[@]}"; do
      if [ "$dir" == "$keep" ]; then
        found=true
        break
      fi
    done
    
    if [ "$found" == false ]; then
      # Verificar se é um diretório especial (backup, etc)
      if [[ "$dir" != "page-nutri-backup.tsx" ]] && \
         [[ "$dir" != "page-wellness-backup-20251105-210533.tsx" ]] && \
         [[ "$dir" != "page.tsx" ]] && \
         [[ ! "$dir" =~ ^daily-wellness$ ]] && \
         [[ ! "$dir" =~ ^food-tracker$ ]] && \
         [[ ! "$dir" =~ ^results-simulator$ ]] && \
         [[ ! "$dir" =~ ^infographic$ ]] && \
         [[ ! "$dir" =~ ^recipes$ ]] && \
         [[ ! "$dir" =~ ^recommendation-form$ ]] && \
         [[ ! "$dir" =~ ^weekly-goals$ ]] && \
         [[ ! "$dir" =~ ^nutrition-assessment$ ]] && \
         [[ ! "$dir" =~ ^composicao$ ]] && \
         [[ ! "$dir" =~ ^parasitas$ ]] && \
         [[ ! "$dir" =~ ^emotional-assessment$ ]]; then
        echo "❌ REMOVER: $dir"
      fi
    fi
  done

echo ""
echo "📝 Nota: Alguns diretórios podem ser duplicatas ou variações."
echo "   Revisar manualmente antes de remover."

