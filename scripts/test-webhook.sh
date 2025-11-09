#!/bin/bash

# Script para testar webhooks do Stripe
# Uso: ./scripts/test-webhook.sh [evento]

echo "🧪 TESTE DE WEBHOOKS STRIPE"
echo "=========================="
echo ""

# Verificar se stripe CLI está instalado
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI não encontrado!"
    echo "Instale com: brew install stripe/stripe-cli/stripe"
    exit 1
fi

# Verificar se servidor está rodando
if ! lsof -ti:3000 &> /dev/null; then
    echo "⚠️  Servidor não está rodando na porta 3000"
    echo "Inicie com: npm run dev"
    exit 1
fi

# Evento padrão se não especificado
EVENT=${1:-checkout.session.completed}

echo "📡 Disparando evento: $EVENT"
echo ""

# Disparar evento
stripe trigger $EVENT

echo ""
echo "✅ Evento disparado!"
echo ""
echo "📋 Verifique:"
echo "   1. Terminal do servidor Next.js (logs do webhook)"
echo "   2. Terminal do 'stripe listen' (se estiver rodando)"
echo ""





