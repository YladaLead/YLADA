#!/bin/bash

# Script para limpar variáveis Stripe BR do .env.local
# ⚠️ ATENÇÃO: Faça backup antes de executar!

echo "🧹 Limpando variáveis Stripe BR do .env.local"
echo ""

# Verificar se .env.local existe
if [ ! -f .env.local ]; then
    echo "❌ Arquivo .env.local não encontrado!"
    exit 1
fi

# Criar backup
echo "📦 Criando backup: .env.local.backup"
cp .env.local .env.local.backup

# Listar variáveis que serão removidas
echo ""
echo "📋 Variáveis que serão removidas:"
grep -E "STRIPE.*BR|STRIPE.*_BR" .env.local || echo "   (nenhuma encontrada)"

# Confirmar
echo ""
read -p "⚠️  Continuar? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Operação cancelada"
    exit 1
fi

# Remover linhas com STRIPE e BR
echo "🗑️  Removendo variáveis..."
sed -i '' '/STRIPE.*BR/d' .env.local
sed -i '' '/STRIPE.*_BR/d' .env.local

echo ""
echo "✅ Limpeza concluída!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Verifique o arquivo .env.local"
echo "   2. Adicione as variáveis do Mercado Pago"
echo "   3. Teste a aplicação"
echo ""
echo "💾 Backup salvo em: .env.local.backup"

