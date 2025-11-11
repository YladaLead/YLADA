#!/bin/bash

# Remover diretórios vazios dos templates que não estão nos 31 do banco

cd src/app/pt/wellness/templates

# Remover diretórios vazios
rmdir composicao 2>/dev/null && echo "✅ Removido: composicao"
rmdir daily-wellness 2>/dev/null && echo "✅ Removido: daily-wellness"
rmdir emotional-assessment 2>/dev/null && echo "✅ Removido: emotional-assessment"
rmdir food-diary 2>/dev/null && echo "✅ Removido: food-diary"
rmdir food-tracker 2>/dev/null && echo "✅ Removido: food-tracker"
rmdir infographic 2>/dev/null && echo "✅ Removido: infographic"
rmdir meal-planner 2>/dev/null && echo "✅ Removido: meal-planner"
rmdir nutrition-assessment 2>/dev/null && echo "✅ Removido: nutrition-assessment"
rmdir parasitas 2>/dev/null && echo "✅ Removido: parasitas"
rmdir recipes 2>/dev/null && echo "✅ Removido: recipes"
rmdir recommendation-form 2>/dev/null && echo "✅ Removido: recommendation-form"
rmdir results-simulator 2>/dev/null && echo "✅ Removido: results-simulator"
rmdir weekly-goals 2>/dev/null && echo "✅ Removido: weekly-goals"

echo ""
echo "✅ Limpeza concluída!"

