# 🔄 PLANO DE MIGRAÇÃO GRADUAL: WELLNESS → NUTRA

## ⚠️ OBJETIVO

Migrar **TUDO** da área Wellness para Nutra de forma **gradual e segura**, aproveitando 100% do código existente, como se fosse um backup completo.

**Princípio**: Wellness continua funcionando durante toda a migração.

---

## 📋 ESTRATÉGIA: MIGRAÇÃO EM FASES

### ✅ FASE 1: Backup Completo (Segurança)
### ✅ FASE 2: Copiar Estrutura (Base)
### ✅ FASE 3: Adaptar Componentes (Branding)
### ✅ FASE 4: Adaptar Páginas (Rotas)
### ✅ FASE 5: Adaptar APIs (Backend)
### ✅ FASE 6: Adaptar Templates (Conteúdo)
### ✅ FASE 7: Testes Completos (Validação)
### ✅ FASE 8: Ativar Nutra (Go Live)

---

## 🔒 FASE 1: BACKUP COMPLETO

### 1.1. Criar Backup da Estrutura Wellness

```bash
# Criar pasta de backup
mkdir -p backups/wellness-$(date +%Y%m%d)

# Copiar toda estrutura Wellness
cp -r src/app/pt/wellness backups/wellness-$(date +%Y%m%d)/

# Copiar componentes Wellness
cp -r src/components/wellness backups/wellness-$(date +%Y%m%d)/components/

# Backup do banco (via Supabase)
# Exportar dados de user_templates onde profession='wellness'
```

### 1.2. Script de Backup Automático

```bash
#!/bin/bash
# scripts/backup-wellness.sh

BACKUP_DIR="backups/wellness-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Criando backup completo da área Wellness..."

# Estrutura de páginas
cp -r src/app/pt/wellness "$BACKUP_DIR/pages"

# Componentes
cp -r src/components/wellness "$BACKUP_DIR/components"

# APIs
cp -r src/app/api/wellness "$BACKUP_DIR/api"

# Types
cp src/types/wellness.ts "$BACKUP_DIR/" 2>/dev/null || true

echo "✅ Backup criado em: $BACKUP_DIR"
```

---

## 📁 FASE 2: COPIAR ESTRUTURA BASE

### 2.1. Copiar Todas as Páginas

```bash
# Copiar estrutura completa
cp -r src/app/pt/wellness/* src/app/pt/nutra/

# Manter Wellness intacto (cópia, não move)
```

### 2.2. Estrutura a Copiar

```
src/app/pt/wellness/          →  src/app/pt/nutra/
├── page.tsx                  →  page.tsx
├── login/page.tsx            →  login/page.tsx
├── dashboard/page.tsx        →  dashboard/page.tsx
├── checkout/page.tsx         →  checkout/page.tsx
├── pagamento-sucesso/        →  pagamento-sucesso/
├── configuracao/             →  configuracao/
├── cursos/                   →  cursos/
├── suporte/                  →  suporte/
├── ferramentas/              →  ferramentas/
│   ├── page.tsx
│   ├── nova/page.tsx
│   └── [id]/editar/page.tsx
├── templates/                →  templates/
│   ├── page.tsx
│   └── [todos os templates]/
├── portals/                  →  portals/
├── quiz-personalizado/       →  quiz-personalizado/
└── [user-slug]/[tool-slug]/  →  [user-slug]/[tool-slug]/
```

### 2.3. Script de Cópia

```bash
#!/bin/bash
# scripts/copiar-wellness-para-nutra.sh

echo "🔄 Copiando estrutura Wellness para Nutra..."

# Criar diretório Nutra se não existir
mkdir -p src/app/pt/nutra

# Copiar tudo (exceto node_modules e .next)
rsync -av --exclude='node_modules' --exclude='.next' \
  src/app/pt/wellness/ \
  src/app/pt/nutra/

echo "✅ Estrutura copiada!"
```

---

## 🎨 FASE 3: ADAPTAR COMPONENTES

### 3.1. Criar Componentes Nutra

```bash
# Copiar componentes Wellness
cp -r src/components/wellness src/components/nutra
```

### 3.2. Adaptar Cada Componente

#### 3.2.1. NutraNavBar.tsx
```typescript
// src/components/nutra/NutraNavBar.tsx
// Copiar de WellnessNavBar.tsx e adaptar:
// - Cores: Verde → Laranja-âmbar (#FF7A00)
// - Links: /wellness → /nutra
// - Textos: "Wellness" → "Nutra"
```

#### 3.2.2. NutraHeader.tsx
```typescript
// src/components/nutra/NutraHeader.tsx
// Copiar de WellnessHeader.tsx
// Adaptar cores e textos
```

#### 3.2.3. NutraLanding.tsx
```typescript
// src/components/nutra/NutraLanding.tsx
// Copiar de WellnessLanding.tsx
// Adaptar textos e branding
```

#### 3.2.4. NutraCTAButton.tsx
```typescript
// src/components/nutra/NutraCTAButton.tsx
// Copiar de WellnessCTAButton.tsx
// Adaptar cores (verde → laranja-âmbar)
```

### 3.3. Script de Adaptação Automática

```bash
#!/bin/bash
# scripts/adaptar-componentes-wellness-para-nutra.sh

echo "🎨 Adaptando componentes Wellness para Nutra..."

# Substituições básicas
find src/components/nutra -type f -name "*.tsx" -exec sed -i '' \
  -e 's/wellness/nutra/g' \
  -e 's/Wellness/Nutra/g' \
  -e 's/WELLNESS/NUTRA/g' \
  -e 's/green-600/orange-600/g' \
  -e 's/green-500/orange-500/g' \
  -e 's/green-700/orange-700/g' \
  -e 's/emerald-500/orange-500/g' \
  {} \;

echo "✅ Componentes adaptados!"
```

---

## 📄 FASE 4: ADAPTAR PÁGINAS

### 4.1. Substituições Necessárias em Todas as Páginas

```typescript
// Substituir em TODOS os arquivos de src/app/pt/nutra/:

// 1. Imports
import WellnessNavBar → import NutraNavBar
import WellnessHeader → import NutraHeader
import WellnessLanding → import NutraLanding
import WellnessCTAButton → import NutraCTAButton

// 2. Rotas
/pt/wellness/ → /pt/nutra/
/api/wellness/ → /api/nutra/

// 3. Perfil/Área
perfil="wellness" → perfil="nutra"
area="wellness" → area="nutra"
profession='wellness' → profession='nutra'

// 4. Cores
green-600 → orange-600
green-500 → orange-500
emerald-500 → orange-500
bg-green → bg-orange
text-green → text-orange

// 5. Textos
"Wellness" → "Nutra"
"Distribuidor Wellness" → "Consultor Nutra"
```

### 4.2. Script de Substituição Automática

```bash
#!/bin/bash
# scripts/adaptar-paginas-wellness-para-nutra.sh

echo "📄 Adaptando páginas Wellness para Nutra..."

# Substituições em todos os arquivos .tsx e .ts
find src/app/pt/nutra -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's|/pt/wellness|/pt/nutra|g' \
  -e 's|/api/wellness|/api/nutra|g' \
  -e 's|WellnessNavBar|NutraNavBar|g' \
  -e 's|WellnessHeader|NutraHeader|g' \
  -e 's|WellnessLanding|NutraLanding|g' \
  -e 's|WellnessCTAButton|NutraCTAButton|g' \
  -e 's|perfil="wellness"|perfil="nutra"|g' \
  -e "s|perfil='wellness'|perfil='nutra'|g" \
  -e 's|area="wellness"|area="nutra"|g' \
  -e "s|area='wellness'|area='nutra'|g" \
  -e 's|profession="wellness"|profession="nutra"|g' \
  -e "s|profession='wellness'|profession='nutra'|g" \
  -e 's|green-600|orange-600|g' \
  -e 's|green-500|orange-500|g' \
  -e 's|green-700|orange-700|g' \
  -e 's|emerald-500|orange-500|g' \
  -e 's|bg-green|bg-orange|g' \
  -e 's|text-green|text-orange|g' \
  -e 's|Wellness|Nutra|g' \
  {} \;

echo "✅ Páginas adaptadas!"
```

---

## 🔌 FASE 5: ADAPTAR APIs

### 5.1. Copiar APIs

```bash
# Copiar APIs Wellness
cp -r src/app/api/wellness src/app/api/nutra
```

### 5.2. Adaptar APIs

#### 5.2.1. API de Templates
```typescript
// src/app/api/nutra/templates/route.ts
// Copiar de src/app/api/wellness/templates/route.ts
// Adaptar: profession='wellness' → profession='nutra'
```

#### 5.2.2. API de Ferramentas
```typescript
// src/app/api/nutra/ferramentas/route.ts
// Copiar e adaptar
```

#### 5.2.3. API de Checkout
```typescript
// src/app/api/nutra/checkout/route.ts
// Copiar de src/app/api/wellness/checkout/route.ts
// Adaptar área
```

### 5.3. Script de Adaptação de APIs

```bash
#!/bin/bash
# scripts/adaptar-apis-wellness-para-nutra.sh

echo "🔌 Adaptando APIs Wellness para Nutra..."

find src/app/api/nutra -type f -name "*.ts" -exec sed -i '' \
  -e "s|'wellness'|'nutra'|g" \
  -e 's|"wellness"|"nutra"|g' \
  -e 's|area:.*wellness|area: "nutra"|g' \
  {} \;

echo "✅ APIs adaptadas!"
```

---

## 🎯 FASE 6: ADAPTAR TEMPLATES

### 6.1. Copiar Todos os Templates

```bash
# Copiar todos os templates
cp -r src/app/pt/wellness/templates/* src/app/pt/nutra/templates/
```

### 6.2. Adaptar Templates

Cada template precisa:
- Importar componentes Nutra (não Wellness)
- Usar cores Nutra (laranja-âmbar: orange-500, #FF7A00)
- Textos adaptados para Nutra

### 6.3. Script de Adaptação de Templates

```bash
#!/bin/bash
# scripts/adaptar-templates-wellness-para-nutra.sh

echo "🎯 Adaptando templates Wellness para Nutra..."

find src/app/pt/nutra/templates -type f -name "*.tsx" -exec sed -i '' \
  -e 's|WellnessHeader|NutraHeader|g' \
  -e 's|WellnessLanding|NutraLanding|g' \
  -e 's|WellnessCTAButton|NutraCTAButton|g' \
  -e 's|green-600|orange-600|g' \
  -e 's|green-500|orange-500|g' \
  -e 's|emerald-500|orange-500|g' \
  {} \;

echo "✅ Templates adaptados!"
```

---

## 🗄️ FASE 7: ADAPTAR BANCO DE DADOS

### 7.1. Criar Templates Nutra no Banco

```sql
-- scripts/criar-templates-nutra.sql

-- Copiar todos os templates Wellness para Nutra
INSERT INTO templates_nutrition (
  name, type, language, profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active,
  slug, categoria
)
SELECT 
  name, type, language, 'nutra' as profession, specialization, objective,
  title, description, content, cta_text, whatsapp_message, is_active,
  slug, categoria
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;

-- Verificar quantos foram criados
SELECT COUNT(*) as total_nutra_templates
FROM templates_nutrition
WHERE profession = 'nutra';
```

### 7.2. Verificar Dados

```sql
-- Verificar se todos os templates foram copiados
SELECT 
  w.name as wellness_template,
  n.name as nutra_template,
  CASE WHEN n.id IS NULL THEN '❌ FALTANDO' ELSE '✅ OK' END as status
FROM templates_nutrition w
LEFT JOIN templates_nutrition n ON w.name = n.name AND n.profession = 'nutra'
WHERE w.profession = 'wellness'
  AND w.is_active = true
ORDER BY status, w.name;
```

---

## ✅ FASE 8: TESTES E VALIDAÇÃO

### 8.1. Checklist de Testes

- [ ] **Login Nutra funciona**
  - [ ] Página de login carrega
  - [ ] Autenticação funciona
  - [ ] Redireciona para dashboard

- [ ] **Dashboard Nutra funciona**
  - [ ] Carrega dados do usuário
  - [ ] Estatísticas aparecem
  - [ ] Links funcionam

- [ ] **Ferramentas Nutra**
  - [ ] Lista de ferramentas carrega
  - [ ] Criar nova ferramenta funciona
  - [ ] Editar ferramenta funciona
  - [ ] Deletar ferramenta funciona

- [ ] **Templates Nutra**
  - [ ] Página de templates carrega
  - [ ] Todos os templates aparecem
  - [ ] Preview funciona
  - [ ] Criar link funciona

- [ ] **Checkout Nutra**
  - [ ] Página de checkout carrega
  - [ ] Seleção de plano funciona
  - [ ] Redirecionamento funciona

- [ ] **Visual**
  - [ ] Cores corretas (laranja-âmbar: orange-500, #FF7A00)
  - [ ] Textos corretos (Nutra, não Wellness)
  - [ ] Logo e branding corretos

---

## 🚀 EXECUÇÃO: PASSO A PASSO

### Passo 1: Backup (5 minutos)
```bash
./scripts/backup-wellness.sh
```

### Passo 2: Copiar Estrutura (2 minutos)
```bash
./scripts/copiar-wellness-para-nutra.sh
```

### Passo 3: Adaptar Componentes (5 minutos)
```bash
./scripts/adaptar-componentes-wellness-para-nutra.sh
```

### Passo 4: Adaptar Páginas (5 minutos)
```bash
./scripts/adaptar-paginas-wellness-para-nutra.sh
```

### Passo 5: Adaptar APIs (3 minutos)
```bash
./scripts/adaptar-apis-wellness-para-nutra.sh
```

### Passo 6: Adaptar Templates (5 minutos)
```bash
./scripts/adaptar-templates-wellness-para-nutra.sh
```

### Passo 7: Banco de Dados (2 minutos)
```sql
-- Executar no Supabase SQL Editor
-- scripts/criar-templates-nutra.sql
```

### Passo 8: Testes (30 minutos)
- Testar cada funcionalidade
- Verificar visual
- Corrigir problemas

---

## 🔄 ROLLBACK (Se algo der errado)

### Como Reverter

```bash
# 1. Remover Nutra
rm -rf src/app/pt/nutra
rm -rf src/components/nutra
rm -rf src/app/api/nutra

# 2. Restaurar backup
cp -r backups/wellness-YYYYMMDD/pages/* src/app/pt/wellness/
cp -r backups/wellness-YYYYMMDD/components/* src/components/wellness/
cp -r backups/wellness-YYYYMMDD/api/* src/app/api/wellness/

# 3. Wellness volta ao normal
```

---

## 📝 CHECKLIST COMPLETO

### Preparação
- [ ] Backup criado
- [ ] Scripts de migração criados
- [ ] Banco de dados preparado

### Cópia
- [ ] Estrutura de páginas copiada
- [ ] Componentes copiados
- [ ] APIs copiadas
- [ ] Templates copiados

### Adaptação
- [ ] Componentes adaptados (cores, textos)
- [ ] Páginas adaptadas (rotas, imports)
- [ ] APIs adaptadas (profession, área)
- [ ] Templates adaptados (componentes, cores)

### Banco de Dados
- [ ] Templates Nutra criados no banco
- [ ] Verificação de dados executada

### Testes
- [ ] Login funciona
- [ ] Dashboard funciona
- [ ] Ferramentas funcionam
- [ ] Templates funcionam
- [ ] Checkout funciona
- [ ] Visual correto

---

## 🎯 RESULTADO FINAL

Após migração completa:
- ✅ Nutra idêntico a Wellness (funcionalmente)
- ✅ Branding Nutra (laranja-âmbar: orange-500, #FF7A00, textos Nutra)
- ✅ Wellness continua funcionando
- ✅ Tudo testado e validado

**Próximo passo**: Executar Fase 1 (Backup) e começar migração!

