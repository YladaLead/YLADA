#!/bin/bash

# =====================================================
# REMOVER TEMPLATES EXTRAS (NÃO ESTÃO NOS 31 DO BANCO)
# =====================================================
# Este script remove os diretórios de templates que não estão
# na lista dos 31 templates ativos do banco de dados

echo "🗑️  Removendo templates extras que não estão nos 31 do banco..."
echo ""

# Lista de diretórios para remover
DIRETORIOS_REMOVER=(
  "composicao"
  "parasitas"
  "emotional-assessment"
  "food-diary"
  "meal-planner"
  "nutrition-assessment"
  "weekly-goals"
  "recipes"
  "recommendation-form"
  "infographic"
  "daily-wellness"
  "food-tracker"
  "results-simulator"
)

BASE_DIR="src/app/pt/wellness/templates"

echo "⚠️  ATENÇÃO: Este script irá remover os seguintes diretórios:"
echo ""

for dir in "${DIRETORIOS_REMOVER[@]}"; do
  if [ -d "$BASE_DIR/$dir" ]; then
    echo "  ❌ $dir/"
  else
    echo "  ⚠️  $dir/ (não encontrado)"
  fi
done

echo ""
read -p "Deseja continuar? (sim/não): " confirmacao

if [ "$confirmacao" != "sim" ]; then
  echo "❌ Operação cancelada."
  exit 0
fi

echo ""
echo "🗑️  Removendo diretórios..."

for dir in "${DIRETORIOS_REMOVER[@]}"; do
  if [ -d "$BASE_DIR/$dir" ]; then
    echo "  Removendo: $dir/"
    rm -rf "$BASE_DIR/$dir"
    if [ $? -eq 0 ]; then
      echo "    ✅ Removido com sucesso"
    else
      echo "    ❌ Erro ao remover"
    fi
  else
    echo "  ⚠️  $dir/ não encontrado (já foi removido?)"
  fi
done

echo ""
echo "✅ Limpeza concluída!"
echo ""
echo "📊 Verificando diretórios restantes..."
find "$BASE_DIR" -type d -mindepth 1 -maxdepth 1 | wc -l | xargs echo "Total de diretórios restantes:"

