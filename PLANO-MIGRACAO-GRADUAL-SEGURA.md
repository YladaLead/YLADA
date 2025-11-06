# 🛡️ PLANO DE MIGRAÇÃO GRADUAL E SEGURA

## 📊 SITUAÇÃO ATUAL (INVENTÁRIO)

### ✅ **O que já está funcionando:**

1. **Área Nutri:**
   - ✅ 38 templates completos e funcionais
   - ✅ Diagnósticos em `src/lib/diagnosticos-nutri.ts`
   - ✅ Preview completo em `/pt/nutri/ferramentas/templates/page.tsx`
   - ✅ Criação de links: `/pt/nutri/ferramentas/nova/page.tsx`
   - ✅ Criação de quizzes: `/pt/nutri/quiz-personalizado/page.tsx`
   - ✅ APIs: `/api/nutri/*` (ainda não unificadas)

2. **Área Wellness:**
   - ✅ Estrutura básica criada
   - ✅ APIs funcionais: `/api/wellness/*`
   - ✅ Alguns templates já migrados
   - ✅ Criação de links funcionando
   - ✅ Criação de quizzes funcionando
   - ⚠️ Diagnósticos ainda usando versão Nutri (cópia)

3. **Banco de Dados:**
   - ✅ `templates_nutrition` com coluna `profession` (alguns templates têm, outros não)
   - ✅ `user_templates` com coluna `profession`
   - ✅ Links criados já têm `profession` isolado

4. **Componentes:**
   - ✅ `NutriNavBar.tsx` e `WellnessNavBar.tsx` criados
   - ⚠️ Preview ainda compartilhado (precisa separar)

---

## 🎯 OBJETIVO DA MIGRAÇÃO

**Meta:** Duplicar templates Nutri para Wellness, Coach e Nutra, mantendo tudo funcionando independente.

**Princípios:**
1. ✅ **Nunca perder dados existentes**
2. ✅ **Migração incremental (passo a passo)**
3. ✅ **Testar cada etapa antes de avançar**
4. ✅ **Backup antes de cada mudança**
5. ✅ **Rollback possível a qualquer momento**

---

## 📋 ESTRATÉGIA DE MIGRAÇÃO (5 FASES)

### **FASE 1: Backup e Preparação** ⚠️ CRÍTICO

**Objetivo:** Garantir que nada será perdido.

#### **1.1. Backup do Banco de Dados**

```sql
-- Script: BACKUP-PRE-MIGRACAO.sql

-- 1. Backup de templates_nutrition
CREATE TABLE templates_nutrition_backup_YYYYMMDD AS 
SELECT * FROM templates_nutrition;

-- 2. Backup de user_templates
CREATE TABLE user_templates_backup_YYYYMMDD AS 
SELECT * FROM user_templates;

-- 3. Backup de diagnósticos (exportar arquivo)
-- Copiar src/lib/diagnosticos-nutri.ts para diagnosticos-nutri-backup.ts
```

#### **1.2. Verificar Estado Atual**

```sql
-- Script: VERIFICAR-ESTADO-ATUAL.sql

-- 1. Templates por profession
SELECT profession, COUNT(*) as total
FROM templates_nutrition
GROUP BY profession;

-- 2. Templates sem profession
SELECT COUNT(*) as sem_profession
FROM templates_nutrition
WHERE profession IS NULL;

-- 3. Links criados por profession
SELECT profession, COUNT(*) as total_links
FROM user_templates
GROUP BY profession;

-- 4. Listar todos os templates Nutri
SELECT id, name, type, profession
FROM templates_nutrition
WHERE profession = 'nutri' OR profession IS NULL
ORDER BY name;
```

#### **1.3. Documentar Templates Nutri**

```sql
-- Script: EXPORTAR-TEMPLATES-NUTRI.sql

-- Exportar todos os templates Nutri para arquivo
SELECT 
  name,
  type,
  language,
  specialization,
  objective,
  title,
  description,
  content,
  cta_text,
  whatsapp_message,
  is_active
FROM templates_nutrition
WHERE profession = 'nutri' OR profession IS NULL
ORDER BY name, type;
```

**Resultado Fase 1:**
- ✅ Backup completo do banco
- ✅ Backup do arquivo de diagnósticos
- ✅ Inventário completo do que existe
- ✅ Lista de templates Nutri para duplicar

---

### **FASE 2: Duplicar Templates no Banco** 🗄️

**Objetivo:** Criar versões dos templates Nutri para Wellness, Coach e Nutra.

#### **2.1. Garantir Coluna `profession`**

```sql
-- Script: GARANTIR-COLUNA-PROFESSION.sql

-- Adicionar coluna se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'templates_nutrition'
    AND column_name = 'profession'
  ) THEN
    ALTER TABLE templates_nutrition ADD COLUMN profession VARCHAR(100);
    RAISE NOTICE 'Coluna profession adicionada';
  END IF;
END $$;

-- Atualizar templates Nutri existentes sem profession
UPDATE templates_nutrition
SET profession = 'nutri'
WHERE profession IS NULL;
```

#### **2.2. Duplicar Templates Nutri → Wellness**

```sql
-- Script: DUPLICAR-TEMPLATES-NUTRI-TO-WELLNESS.sql

-- Para cada template Nutri, criar versão Wellness
INSERT INTO templates_nutrition (
  name,
  type,
  language,
  specialization,
  objective,
  title,
  description,
  content,
  cta_text,
  whatsapp_message,
  is_active,
  profession
)
SELECT 
  name,
  type,
  language,
  specialization,
  objective,
  title,
  description,
  content,
  cta_text,
  whatsapp_message,
  is_active,
  'wellness' as profession  -- ← Mudar profession
FROM templates_nutrition
WHERE profession = 'nutri'
AND NOT EXISTS (
  -- Evitar duplicatas se já existir
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.name = templates_nutrition.name
  AND t2.type = templates_nutrition.type
  AND t2.language = templates_nutrition.language
  AND t2.profession = 'wellness'
);
```

#### **2.3. Duplicar Templates Nutri → Coach**

```sql
-- Script: DUPLICAR-TEMPLATES-NUTRI-TO-COACH.sql

INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message,
  is_active, profession
)
SELECT 
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message,
  false as is_active,  -- ← Desativar por padrão (ativar depois)
  'coach' as profession
FROM templates_nutrition
WHERE profession = 'nutri'
AND NOT EXISTS (
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.name = templates_nutrition.name
  AND t2.type = templates_nutrition.type
  AND t2.language = templates_nutrition.language
  AND t2.profession = 'coach'
);
```

#### **2.4. Duplicar Templates Nutri → Nutra**

```sql
-- Script: DUPLICAR-TEMPLATES-NUTRI-TO-NUTRA.sql

INSERT INTO templates_nutrition (
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message,
  is_active, profession
)
SELECT 
  name, type, language, specialization, objective,
  title, description, content, cta_text, whatsapp_message,
  false as is_active,  -- ← Desativar por padrão
  'nutra' as profession
FROM templates_nutrition
WHERE profession = 'nutri'
AND NOT EXISTS (
  SELECT 1 FROM templates_nutrition t2
  WHERE t2.name = templates_nutrition.name
  AND t2.type = templates_nutrition.type
  AND t2.language = templates_nutrition.language
  AND t2.profession = 'nutra'
);
```

#### **2.5. Verificar Duplicação**

```sql
-- Script: VERIFICAR-DUPLICACAO.sql

-- Contar templates por área
SELECT profession, COUNT(*) as total
FROM templates_nutrition
GROUP BY profession
ORDER BY profession;

-- Verificar templates específicos
SELECT name, type, profession, is_active
FROM templates_nutrition
WHERE name = 'Checklist Alimentar'
ORDER BY profession;
```

**Resultado Fase 2:**
- ✅ Todos os templates Nutri duplicados para Wellness
- ✅ Templates duplicados para Coach (desativados)
- ✅ Templates duplicados para Nutra (desativados)
- ✅ Verificação de duplicatas

---

### **FASE 3: Separar Diagnósticos** 📝

**Objetivo:** Criar arquivos de diagnósticos separados por área.

#### **3.1. Estrutura de Pastas**

```
src/lib/diagnostics/
├── nutri/
│   ├── checklist-alimentar.ts
│   ├── checklist-detox.ts
│   ├── calculadora-imc.ts
│   ├── calculadora-agua.ts
│   ├── calculadora-proteina.ts
│   ├── calculadora-calorias.ts
│   └── ... (todos os 38 templates)
│
├── wellness/
│   ├── checklist-alimentar.ts  ← Copiar de nutri e ajustar cores
│   ├── checklist-detox.ts
│   └── ... (todos os 38 templates)
│
├── coach/
│   └── ... (todos os 38 templates)
│
└── nutra/
    └── ... (todos os 38 templates)
```

#### **3.2. Script de Migração dos Diagnósticos**

```typescript
// Script: DIVIDIR-DIAGNOSTICOS-NUTRI.ts
// Este script divide o arquivo diagnosticos-nutri.ts em arquivos menores

// 1. Ler diagnosticos-nutri.ts
// 2. Para cada template, criar arquivo separado:
//    src/lib/diagnostics/nutri/[nome-template].ts
// 3. Exportar apenas o diagnóstico daquele template
```

**Exemplo de arquivo separado:**

```typescript
// src/lib/diagnostics/nutri/checklist-alimentar.ts
export const checklistAlimentarDiagnosticos = {
  nutri: {
    alimentacaoDeficiente: { ... },
    alimentacaoModerada: { ... },
    alimentacaoEquilibrada: { ... }
  }
}

// src/lib/diagnostics/wellness/checklist-alimentar.ts
export const checklistAlimentarDiagnosticos = {
  wellness: {
    alimentacaoDeficiente: { 
      // Mesmo conteúdo, mas pode ser ajustado depois
      ... 
    },
    alimentacaoModerada: { ... },
    alimentacaoEquilibrada: { ... }
  }
}
```

#### **3.3. Copiar Diagnósticos para Outras Áreas**

**Estratégia:** Copiar diagnósticos Nutri para Wellness/Coach/Nutra inicialmente, depois personalizar.

```bash
# Script: COPIAR-DIAGNOSTICOS.sh

# Copiar diagnósticos Nutri → Wellness
cp -r src/lib/diagnostics/nutri/* src/lib/diagnostics/wellness/

# Copiar diagnósticos Nutri → Coach
cp -r src/lib/diagnostics/nutri/* src/lib/diagnostics/coach/

# Copiar diagnósticos Nutri → Nutra
cp -r src/lib/diagnostics/nutri/* src/lib/diagnostics/nutra/
```

**Depois ajustar imports e exports** para usar `wellness`, `coach`, `nutra` ao invés de `nutri`.

**Resultado Fase 3:**
- ✅ Diagnósticos separados por template
- ✅ Estrutura de pastas por área
- ✅ Diagnósticos copiados para todas as áreas
- ✅ Prontos para personalização futura

---

### **FASE 4: Atualizar APIs e Componentes** 🔧

**Objetivo:** Garantir que APIs e componentes usem `profession` corretamente.

#### **4.1. Verificar APIs Existentes**

**APIs Nutri:**
- ⚠️ Verificar se existem: `/api/nutri/*`
- ✅ Se não existirem, criar baseadas em `/api/wellness/*`

**APIs Wellness:**
- ✅ Já funcionam com `profession='wellness'`
- ✅ Usar como modelo para outras áreas

**APIs Coach/Nutra:**
- ⚠️ Criar baseadas em Wellness

#### **4.2. Estrutura de APIs Unificada (Opcional - Futuro)**

**Opção A: Manter separado (mais seguro agora)**
```
/api/nutri/templates/
/api/wellness/templates/
/api/coach/templates/
/api/nutra/templates/
```

**Opção B: Unificar (depois)**
```
/api/[profession]/templates/
```

**Recomendação:** **Manter separado agora**, unificar depois que tudo estiver funcionando.

#### **4.3. Atualizar Componentes de Preview**

**Atual:**
- `/pt/nutri/ferramentas/templates/page.tsx` → Usa diagnósticos Nutri
- `/pt/wellness/templates/page.tsx` → Usa diagnósticos Nutri (cópia)

**Novo:**
- `/pt/nutri/ferramentas/templates/page.tsx` → Importa de `@/lib/diagnostics/nutri/*`
- `/pt/wellness/templates/page.tsx` → Importa de `@/lib/diagnostics/wellness/*`
- `/pt/coach/templates/page.tsx` → Importa de `@/lib/diagnostics/coach/*`
- `/pt/nutra/templates/page.tsx` → Importa de `@/lib/diagnostics/nutra/*`

**Resultado Fase 4:**
- ✅ APIs funcionando para todas as áreas
- ✅ Componentes usando diagnósticos corretos
- ✅ Preview funcionando independente por área

---

### **FASE 5: Validação e Testes** ✅

**Objetivo:** Garantir que tudo funciona corretamente.

#### **5.1. Checklist de Validação**

**Banco de Dados:**
- [ ] Templates Nutri: 38 templates
- [ ] Templates Wellness: 38 templates (duplicados)
- [ ] Templates Coach: 38 templates (duplicados, desativados)
- [ ] Templates Nutra: 38 templates (duplicados, desativados)
- [ ] Links criados mantêm `profession` correto

**Frontend:**
- [ ] `/pt/nutri/ferramentas/templates` → Mostra 38 templates Nutri
- [ ] `/pt/wellness/templates` → Mostra 38 templates Wellness
- [ ] Preview Nutri usa diagnósticos Nutri
- [ ] Preview Wellness usa diagnósticos Wellness
- [ ] Criação de links funciona em todas as áreas
- [ ] Criação de quizzes funciona em todas as áreas

**APIs:**
- [ ] `GET /api/nutri/templates` → Retorna templates Nutri
- [ ] `GET /api/wellness/templates` → Retorna templates Wellness
- [ ] `GET /api/coach/templates` → Retorna templates Coach
- [ ] `GET /api/nutra/templates` → Retorna templates Nutra

#### **5.2. Testes de Isolamento**

**Teste 1: Templates**
- ✅ Criar link em Wellness → Não aparece em Nutri
- ✅ Desativar template em Coach → Não afeta Wellness

**Teste 2: Diagnósticos**
- ✅ Editar diagnóstico Wellness → Não afeta Nutri
- ✅ Preview Wellness mostra diagnóstico Wellness

**Teste 3: Links Criados**
- ✅ Link criado em Nutri → URL: `/pt/nutri/...`
- ✅ Link criado em Wellness → URL: `/pt/wellness/...`

**Resultado Fase 5:**
- ✅ Tudo validado e funcionando
- ✅ Isolamento confirmado
- ✅ Pronto para produção

---

## 📅 CRONOGRAMA SUGERIDO

### **Semana 1: Backup e Preparação**
- **Dia 1-2:** Fase 1 (Backup e Inventário)
- **Dia 3:** Documentar e revisar

### **Semana 2: Duplicação de Templates**
- **Dia 1:** Fase 2.1-2.2 (Duplicar Nutri → Wellness)
- **Dia 2:** Fase 2.3-2.4 (Duplicar Nutri → Coach/Nutra)
- **Dia 3:** Validação e testes

### **Semana 3: Separar Diagnósticos**
- **Dia 1-2:** Fase 3 (Dividir e copiar diagnósticos)
- **Dia 3:** Atualizar imports nos componentes

### **Semana 4: APIs e Componentes**
- **Dia 1-2:** Fase 4 (APIs e componentes)
- **Dia 3:** Validação

### **Semana 5: Testes Finais**
- **Dia 1-2:** Fase 5 (Validação completa)
- **Dia 3:** Correções finais e deploy

---

## 🚨 PONTOS DE ATENÇÃO

### **1. Dados Existentes**
- ⚠️ **NUNCA** deletar templates Nutri existentes
- ⚠️ **NUNCA** deletar links já criados
- ✅ Sempre criar novos registros (duplicar)

### **2. Rollback**
- ✅ Backups permitem rollback completo
- ✅ Se algo der errado, restaurar backup
- ✅ Testar cada fase antes de avançar

### **3. Performance**
- ⚠️ Duplicar 38 templates × 3 áreas = 114 novos registros
- ✅ Banco de dados suporta (pequeno volume)
- ✅ Indexar `profession` para performance

### **4. Testes**
- ✅ Testar cada área isoladamente
- ✅ Não testar tudo de uma vez
- ✅ Validar antes de avançar

---

## 📝 CHECKLIST GERAL

### **Antes de Começar:**
- [ ] Backup completo do banco
- [ ] Backup do código atual (git commit)
- [ ] Documentar estado atual
- [ ] Listar todos os templates Nutri

### **Durante a Migração:**
- [ ] Fase 1 ✅
- [ ] Fase 2 ✅
- [ ] Fase 3 ✅
- [ ] Fase 4 ✅
- [ ] Fase 5 ✅

### **Depois da Migração:**
- [ ] Validar todas as áreas
- [ ] Testar criação de links
- [ ] Testar criação de quizzes
- [ ] Verificar isolamento
- [ ] Documentar mudanças

---

## 🎯 RESULTADO FINAL

**Após a migração:**
- ✅ 38 templates Nutri (mantidos)
- ✅ 38 templates Wellness (duplicados)
- ✅ 38 templates Coach (duplicados)
- ✅ 38 templates Nutra (duplicados)
- ✅ Diagnósticos separados por área
- ✅ APIs funcionando independente
- ✅ Componentes isolados por área
- ✅ Zero perda de dados
- ✅ Zero quebra de funcionalidades

**Pronto para começar?** 🚀

---

## 📞 SUPORTE

Se algo der errado:
1. **Parar imediatamente**
2. **Restaurar backup**
3. **Documentar o erro**
4. **Ajustar plano e tentar novamente**

**Migração gradual = Sucesso garantido!** ✅

