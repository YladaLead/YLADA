# 📋 RESUMO EXECUTIVO: MIGRAÇÃO WELLNESS → NUTRA

## 🎯 OBJETIVO

Migrar **TUDO** da área Wellness para Nutra de forma **gradual e segura**, aproveitando 100% do código existente.

**Resultado**: Nutra idêntico a Wellness, mas com branding Nutra (roxo/rosa, textos Nutra).

---

## ⚡ EXECUÇÃO RÁPIDA (1 comando)

```bash
# Executar migração completa
./scripts/migrar-wellness-para-nutra.sh
```

**Tempo estimado**: 5-10 minutos

---

## 📋 O QUE SERÁ COPIADO E ADAPTADO

### ✅ Estrutura Completa
- ✅ Todas as páginas (`/pt/wellness/*` → `/pt/nutra/*`)
- ✅ Todos os componentes (`components/wellness/*` → `components/nutra/*`)
- ✅ Todas as APIs (`/api/wellness/*` → `/api/nutra/*`)
- ✅ Todos os templates (30+ templates)
- ✅ Todos os diagnósticos e lógicas

### ✅ Adaptações Automáticas
- ✅ Rotas: `/pt/wellness` → `/pt/nutra`
- ✅ APIs: `/api/wellness` → `/api/nutra`
- ✅ Perfil: `perfil="wellness"` → `perfil="nutra"`
- ✅ Área: `area="wellness"` → `area="nutra"`
- ✅ Profession: `profession='wellness'` → `profession='nutra'`
- ✅ Cores: Verde → Roxo/Rosa
- ✅ Textos: "Wellness" → "Nutra"
- ✅ Imports: Componentes Wellness → Componentes Nutra

---

## 🔄 FASES DA MIGRAÇÃO

### FASE 1: Backup (2 min)
```bash
./scripts/backup-wellness.sh
```
- Cria backup completo
- Salva em `backups/wellness-YYYYMMDD-HHMMSS/`

### FASE 2: Copiar (2 min)
```bash
./scripts/copiar-wellness-para-nutra.sh
```
- Copia toda estrutura
- Wellness permanece intacto

### FASE 3: Adaptar Componentes (2 min)
```bash
./scripts/adaptar-componentes-wellness-para-nutra.sh
```
- Renomeia arquivos (Wellness → Nutra)
- Adapta imports, cores, textos

### FASE 4: Adaptar Páginas (2 min)
```bash
./scripts/adaptar-paginas-wellness-para-nutra.sh
```
- Adapta rotas, imports, perfil, área
- Adapta cores e textos

### FASE 5: Adaptar APIs (1 min)
```bash
./scripts/adaptar-apis-wellness-para-nutra.sh
```
- Adapta profession, área
- Adapta rotas de API

### FASE 6: Adaptar Templates (2 min)
```bash
./scripts/adaptar-templates-wellness-para-nutra.sh
```
- Adapta componentes usados
- Adapta cores

### FASE 7: Banco de Dados (2 min)
```sql
-- Executar no Supabase SQL Editor
-- scripts/criar-templates-nutra.sql
```
- Copia templates Wellness para Nutra
- Verifica integridade

### FASE 8: Testes (30 min)
- Testar cada funcionalidade
- Verificar visual
- Corrigir problemas

---

## 🎨 MUDANÇAS VISUAIS

### Cores
- **Wellness**: Verde (`green-600`, `green-500`, `emerald-500`)
- **Nutra**: Laranja-âmbar (`orange-500`, `orange-600`, `#FF7A00`)

### Textos
- **Wellness**: "Distribuidor Wellness", "Área Wellness"
- **Nutra**: "Consultor Nutra", "Área Nutra"

### Logo
- **Wellness**: Logo verde
- **Nutra**: Logo roxo/rosa (ou mesmo logo, mas contexto Nutra)

---

## ✅ GARANTIAS

1. **Wellness continua funcionando**
   - Nada é removido de Wellness
   - Apenas cópia e adaptação

2. **Backup completo**
   - Tudo salvo antes de começar
   - Pode reverter se necessário

3. **Migração gradual**
   - Uma fase por vez
   - Teste entre fases
   - Rollback possível

4. **100% aproveitamento**
   - Todo código Wellness reutilizado
   - Nada é perdido

---

## 🚨 PONTOS DE ATENÇÃO

### 1. Imports Manuais
Alguns imports podem precisar ajuste manual:
```typescript
// Verificar se ficou correto:
import NutraNavBar from '@/components/nutra/NutraNavBar'
import NutraHeader from '@/components/nutra/NutraHeader'
```

### 2. Cores Específicas
Algumas cores podem precisar ajuste:
```typescript
// Verificar se todas as cores foram adaptadas
// Procurar por: green, emerald, teal
```

### 3. Textos Específicos
Alguns textos podem precisar ajuste manual:
```typescript
// Verificar textos como:
// "Distribuidor" → "Consultor"
// "Herbalife" → (remover ou adaptar)
```

### 4. Banco de Dados
Templates precisam ser criados no banco:
```sql
-- Executar: scripts/criar-templates-nutra.sql
```

---

## 📊 CHECKLIST PÓS-MIGRAÇÃO

### Funcionalidades
- [ ] Login Nutra funciona
- [ ] Dashboard Nutra carrega
- [ ] Criar ferramenta funciona
- [ ] Editar ferramenta funciona
- [ ] Listar ferramentas funciona
- [ ] Templates aparecem
- [ ] Preview funciona
- [ ] Criar link funciona
- [ ] Checkout funciona

### Visual
- [ ] Cores corretas (laranja-âmbar: `orange-500`, `#FF7A00`)
- [ ] Textos corretos (Nutra)
- [ ] Logo correto
- [ ] NavBar correta

### Banco de Dados
- [ ] Templates Nutra criados
- [ ] Mesmo número de templates
- [ ] Todos ativos

---

## 🔄 ROLLBACK (Se necessário)

```bash
# 1. Remover Nutra
rm -rf src/app/pt/nutra
rm -rf src/components/nutra
rm -rf src/app/api/nutra

# 2. Restaurar backup
cp -r backups/wellness-YYYYMMDD/pages/wellness/* src/app/pt/wellness/
cp -r backups/wellness-YYYYMMDD/components/wellness/* src/components/wellness/
cp -r backups/wellness-YYYYMMDD/api/wellness/* src/app/api/wellness/

# 3. Wellness volta ao normal
```

---

## 🚀 PRONTO PARA EXECUTAR?

Execute:
```bash
./scripts/migrar-wellness-para-nutra.sh
```

**Tempo total**: ~15 minutos (incluindo testes)

**Resultado**: Nutra idêntico a Wellness, funcionando perfeitamente! 🎉

