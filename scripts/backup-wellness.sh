#!/bin/bash

# Script de Backup Completo da Área Wellness
# Cria backup de toda estrutura antes de migração

BACKUP_DIR="backups/wellness-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Criando backup completo da área Wellness..."
echo "📁 Diretório: $BACKUP_DIR"
echo ""

# 1. Estrutura de páginas
echo "📄 Copiando páginas..."
mkdir -p "$BACKUP_DIR/pages"
cp -r src/app/pt/wellness "$BACKUP_DIR/pages/" 2>/dev/null || echo "⚠️  Pasta wellness não encontrada"

# 2. Componentes
echo "🧩 Copiando componentes..."
mkdir -p "$BACKUP_DIR/components"
cp -r src/components/wellness "$BACKUP_DIR/components/" 2>/dev/null || echo "⚠️  Componentes wellness não encontrados"
cp -r src/components/wellness-previews "$BACKUP_DIR/components/" 2>/dev/null || echo "⚠️  Previews wellness não encontrados"

# 3. APIs
echo "🔌 Copiando APIs..."
mkdir -p "$BACKUP_DIR/api"
cp -r src/app/api/wellness "$BACKUP_DIR/api/" 2>/dev/null || echo "⚠️  API wellness não encontrada"

# 4. Types
echo "📝 Copiando types..."
mkdir -p "$BACKUP_DIR/types"
cp src/types/wellness.ts "$BACKUP_DIR/types/" 2>/dev/null || echo "⚠️  Type wellness.ts não encontrado"

# 5. Criar arquivo de informações
cat > "$BACKUP_DIR/INFO.txt" << EOF
Backup da Área Wellness
Data: $(date)
Diretório: $BACKUP_DIR

Conteúdo:
- Páginas: src/app/pt/wellness/
- Componentes: src/components/wellness/
- APIs: src/app/api/wellness/
- Types: src/types/wellness.ts

Para restaurar:
cp -r $BACKUP_DIR/pages/wellness/* src/app/pt/wellness/
cp -r $BACKUP_DIR/components/wellness/* src/components/wellness/
cp -r $BACKUP_DIR/api/wellness/* src/app/api/wellness/
EOF

echo ""
echo "✅ Backup criado com sucesso!"
echo "📁 Localização: $BACKUP_DIR"
echo "📄 Informações: $BACKUP_DIR/INFO.txt"

