#!/bin/bash

# Script para copiar estrutura Wellness para Nutra
# Faz cópia completa preservando Wellness

echo "🔄 Copiando estrutura Wellness para Nutra..."
echo ""

# Verificar se Wellness existe
if [ ! -d "src/app/pt/wellness" ]; then
  echo "❌ Erro: Pasta src/app/pt/wellness não encontrada!"
  exit 1
fi

# Criar diretório Nutra se não existir
mkdir -p src/app/pt/nutra

# Copiar estrutura completa (preservando Wellness)
echo "📁 Copiando páginas..."
rsync -av --exclude='node_modules' --exclude='.next' \
  src/app/pt/wellness/ \
  src/app/pt/nutra/

# Copiar componentes
echo "🧩 Copiando componentes..."
mkdir -p src/components/nutra
cp -r src/components/wellness/* src/components/nutra/ 2>/dev/null || echo "⚠️  Componentes wellness não encontrados"

# Copiar previews
echo "🎨 Copiando previews..."
mkdir -p src/components/nutra-previews
cp -r src/components/wellness-previews/* src/components/nutra-previews/ 2>/dev/null || echo "⚠️  Previews wellness não encontrados"

# Copiar APIs
echo "🔌 Copiando APIs..."
mkdir -p src/app/api/nutra
cp -r src/app/api/wellness/* src/app/api/nutra/ 2>/dev/null || echo "⚠️  API wellness não encontrada"

echo ""
echo "✅ Estrutura copiada com sucesso!"
echo "📁 Nutra criado em: src/app/pt/nutra"
echo ""
echo "⚠️  PRÓXIMO PASSO: Executar scripts de adaptação"
echo "   ./scripts/adaptar-componentes-wellness-para-nutra.sh"
echo "   ./scripts/adaptar-paginas-wellness-para-nutra.sh"
echo "   ./scripts/adaptar-apis-wellness-para-nutra.sh"

