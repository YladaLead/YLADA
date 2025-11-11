#!/bin/bash

# =====================================================
# COMPARAR 31 TEMPLATES DO BANCO VS DIRETÓRIOS NO CÓDIGO
# =====================================================

echo "📊 Comparando templates do banco vs diretórios no código..."
echo ""

# Listar todos os diretórios de templates
echo "📁 DIRETÓRIOS EXISTENTES NO CÓDIGO:"
echo "-----------------------------------"
find src/app/pt/wellness/templates -type d -mindepth 1 -maxdepth 1 | \
  sed 's|src/app/pt/wellness/templates/||' | \
  sort | \
  nl

echo ""
echo "⚠️  PRÓXIMO PASSO:"
echo "Execute o script SQL 'listar-31-templates-demo.sql' no Supabase"
echo "e cole o resultado aqui para compararmos."

