#!/bin/bash

# Script para sincronizar .env.local do repositório principal para o worktree
# Uso: ./scripts/sync-env-local.sh

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Diretório atual (worktree)
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# Diretório raiz do repositório (assumindo estrutura padrão)
REPO_ROOT="/Users/air/ylada-app"
SOURCE_ENV="$REPO_ROOT/.env.local"
TARGET_ENV="$CURRENT_DIR/.env.local"

echo "🔄 Sincronizando .env.local..."

# Verificar se o arquivo fonte existe
if [ ! -f "$SOURCE_ENV" ]; then
    echo -e "${YELLOW}⚠️  Arquivo fonte não encontrado: $SOURCE_ENV${NC}"
    echo "   Verificando se já existe no worktree..."
    
    if [ -f "$TARGET_ENV" ]; then
        echo -e "${GREEN}✅ .env.local já existe no worktree${NC}"
        exit 0
    else
        echo -e "${RED}❌ Nenhum .env.local encontrado${NC}"
        exit 1
    fi
fi

# Verificar se precisa copiar (se não existe ou se é diferente)
if [ ! -f "$TARGET_ENV" ]; then
    echo "📋 Copiando .env.local do repositório principal..."
    cp "$SOURCE_ENV" "$TARGET_ENV"
    echo -e "${GREEN}✅ .env.local copiado com sucesso${NC}"
elif ! cmp -s "$SOURCE_ENV" "$TARGET_ENV"; then
    echo "🔄 .env.local existe mas está diferente. Atualizando..."
    cp "$SOURCE_ENV" "$TARGET_ENV"
    echo -e "${GREEN}✅ .env.local atualizado${NC}"
else
    echo -e "${GREEN}✅ .env.local já está sincronizado${NC}"
fi

exit 0

