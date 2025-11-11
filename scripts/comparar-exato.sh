#!/bin/bash

# =====================================================
# COMPARAÇÃO EXATA: 31 Templates Banco vs Diretórios
# =====================================================

echo "📊 Comparação Exata: Templates do Banco vs Diretórios"
echo "===================================================="
echo ""

# Templates do banco (31) - mapeados para diretórios
TEMPLATES_BANCO=(
  "hidratacao"              # Calculadora de Água
  "calorias"                # Calculadora de Calorias
  "imc"                     # Calculadora de IMC
  "proteina"                # Calculadora de Proteína
  "hydration-guide"         # Guia de Hidratação
  "checklist-alimentar"     # Checklist Alimentar
  "detox-menu"              # Checklist Detox
  "hunger-type"             # Avaliação de Fome Emocional / Qual é o seu Tipo de Fome?
  "intolerance-assessment"  # Avaliação de Intolerâncias/Sensibilidades
  "metabolic-profile-assessment"  # Avaliação do Perfil Metabólico
  "initial-assessment"      # Avaliação Inicial
  "21-day-challenge"        # Desafio 21 Dias
  "7-day-challenge"         # Desafio 7 Dias
  "electrolyte-diagnosis"   # Diagnóstico de Eletrólitos
  "intestinal-symptoms-diagnosis"  # Diagnóstico de Sintomas Intestinais
  "ready-to-lose-weight"    # Pronto para Emagrecer com Saúde?
  "wellness-profile"        # Quiz de Bem-Estar
  "story-interativo"        # Quiz Interativo
  "healthy-eating"          # Quiz: Alimentação Saudável
  "healthy-eating-quiz"     # Quiz: Alimentação Saudável (duplicata)
  "ganhos"                  # Quiz: Ganhos e Prosperidade
  "gains-and-prosperity"    # Quiz: Ganhos e Prosperidade (duplicata)
  "potencial"               # Quiz: Potencial e Crescimento
  "potential-and-growth"    # Quiz: Potencial e Crescimento (duplicata)
  "proposito"               # Quiz: Propósito e Equilíbrio
  "purpose-and-balance"     # Quiz: Propósito e Equilíbrio (duplicata)
  "metabolic-syndrome-risk" # Risco de Síndrome Metabólica
  "water-retention-test"    # Teste de Retenção de Líquidos
  "body-awareness"          # Você conhece o seu corpo?
  "nourished-vs-fed"        # Você está nutrido ou apenas alimentado?
  "eating-routine"          # Você está se alimentando conforme sua rotina?
)

echo "✅ Templates do banco (31):"
for template in "${TEMPLATES_BANCO[@]}"; do
  echo "  - $template"
done

echo ""
echo "🔍 Diretórios existentes no código:"
find src/app/pt/wellness/templates -type d -mindepth 1 -maxdepth 1 | \
  sed 's|src/app/pt/wellness/templates/||' | \
  sort | while read dir; do
    # Verificar se está na lista do banco
    found=false
    for keep in "${TEMPLATES_BANCO[@]}"; do
      if [ "$dir" == "$keep" ]; then
        found=true
        break
      fi
    done
    
    if [ "$found" == true ]; then
      echo "  ✅ MANTER: $dir"
    else
      # Ignorar arquivos .tsx na raiz
      if [[ "$dir" != "page.tsx" ]] && \
         [[ "$dir" != "page-nutri-backup.tsx" ]] && \
         [[ "$dir" != "page-wellness-backup-20251105-210533.tsx" ]]; then
        echo "  ❌ REMOVER: $dir"
      fi
    fi
  done

