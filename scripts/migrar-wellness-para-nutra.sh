#!/bin/bash

# =====================================================
# SCRIPT MASTER: MIGRAÇÃO COMPLETA WELLNESS → NUTRA
# =====================================================
# Executa todas as fases da migração em ordem
# ⚠️ IMPORTANTE: Execute com cuidado e teste cada fase

set -e  # Parar se houver erro

echo "🚀 =========================================="
echo "🚀 MIGRAÇÃO WELLNESS → NUTRA"
echo "🚀 =========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para confirmar
confirm() {
  read -p "$(echo -e ${YELLOW}$1${NC}) (s/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${RED}❌ Operação cancelada${NC}"
    exit 1
  fi
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
  exit 1
fi

echo -e "${YELLOW}⚠️  ATENÇÃO: Este script vai:${NC}"
echo "   1. Criar backup completo da Wellness"
echo "   2. Copiar toda estrutura para Nutra"
echo "   3. Adaptar componentes, páginas, APIs e templates"
echo "   4. Wellness continuará funcionando normalmente"
echo ""
confirm "Deseja continuar?"

# FASE 1: Backup
echo ""
echo -e "${GREEN}📦 FASE 1: Criando backup...${NC}"
./scripts/backup-wellness.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Erro no backup!${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Backup criado!${NC}"

# FASE 2: Copiar estrutura
echo ""
echo -e "${GREEN}📁 FASE 2: Copiando estrutura...${NC}"
./scripts/copiar-wellness-para-nutra.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Erro ao copiar estrutura!${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Estrutura copiada!${NC}"

# FASE 3: Adaptar componentes
echo ""
echo -e "${GREEN}🎨 FASE 3: Adaptando componentes...${NC}"
./scripts/adaptar-componentes-wellness-para-nutra.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Erro ao adaptar componentes!${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Componentes adaptados!${NC}"

# FASE 4: Adaptar páginas
echo ""
echo -e "${GREEN}📄 FASE 4: Adaptando páginas...${NC}"
./scripts/adaptar-paginas-wellness-para-nutra.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Erro ao adaptar páginas!${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Páginas adaptadas!${NC}"

# FASE 5: Adaptar APIs
echo ""
echo -e "${GREEN}🔌 FASE 5: Adaptando APIs...${NC}"
./scripts/adaptar-apis-wellness-para-nutra.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Erro ao adaptar APIs!${NC}"
  exit 1
fi
echo -e "${GREEN}✅ APIs adaptadas!${NC}"

# FASE 6: Adaptar templates
echo ""
echo -e "${GREEN}🎯 FASE 6: Adaptando templates...${NC}"
./scripts/adaptar-templates-wellness-para-nutra.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Erro ao adaptar templates!${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Templates adaptados!${NC}"

# FASE 7: Banco de dados
echo ""
echo -e "${YELLOW}🗄️  FASE 7: Banco de dados${NC}"
echo "   Execute o script SQL no Supabase:"
echo "   scripts/criar-templates-nutra.sql"
echo ""
confirm "Já executou o script SQL no banco?"

# Resumo
echo ""
echo -e "${GREEN}✅ =========================================="
echo -e "✅ MIGRAÇÃO CONCLUÍDA!"
echo -e "✅ ==========================================${NC}"
echo ""
echo "📋 Próximos passos:"
echo "   1. ✅ Executar script SQL no Supabase"
echo "   2. ✅ Testar login Nutra"
echo "   3. ✅ Testar dashboard Nutra"
echo "   4. ✅ Testar criar ferramenta"
echo "   5. ✅ Testar templates"
echo "   6. ✅ Verificar cores e textos"
echo ""
echo "📁 Backup salvo em: backups/wellness-*"
echo "🔄 Wellness continua funcionando normalmente"
echo ""

