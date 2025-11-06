# 📋 ACOMPANHAMENTO DA MIGRAÇÃO GRADUAL

**Data de Início:** {{DATE}}  
**Status Atual:** 🟡 Em Andamento  
**Última Atualização:** {{DATE}}

---

## 🎯 OBJETIVO

Duplicar templates Nutri para Wellness, Coach e Nutra, mantendo tudo funcionando independente, sem perder dados.

---

## ✅ ETAPAS CONCLUÍDAS

### ✅ **Pré-Migração: Otimização do Dashboard**
- [x] Removida seção de cursos hardcoded
- [x] Removido estado `leadsRecentes` não utilizado
- [x] Login desabilitado temporariamente (com TODOs para reativar)
- [x] Chat desabilitado temporariamente
- [x] Carregamento de dados desabilitado (dashboard mais rápido)
- [x] Dashboard otimizado e funcionando sem login

**Data:** {{DATE}}

---

## ✅ FASES CONCLUÍDAS

### ✅ **Fase 1: Backup e Verificação** ⚠️ CRÍTICO
- ✅ Backup criado: 42 templates
- ✅ Estado verificado: Nutri (6), Wellness (36)

### ✅ **Fase 2: Duplicar Templates no Banco** 🗄️
- ✅ Coluna profession garantida
- ✅ Templates Nutri completados (36 templates)
- ✅ Templates Coach criados (36 templates, desativados)
- ✅ Templates Nutra criados (36 templates, desativados)
- ✅ Verificação concluída: 144 templates totais (36 × 4 áreas)

---

## 🟡 ETAPAS EM ANDAMENTO

### 🟡 **Fase 1: Backup e Verificação** ⚠️ CRÍTICO
- [x] **1.1. Backup do Banco de Dados**
  - [x] Abrir Supabase Dashboard → SQL Editor
  - [x] Executar `scripts/01-BACKUP-PRE-MIGRACAO.sql`
  - [x] Verificar se backups foram criados
  - [x] Anotar data do backup
  - **Resultado:** ✅ Backup criado - 42 templates, 0 links
  
- [x] **1.2. Verificar Estado Atual**
  - [x] Executar `scripts/02-VERIFICAR-ESTADO-ATUAL-FINAL.sql`
  - [x] Documentar quantos templates Nutri existem
  - [x] Verificar templates sem `profession`
  - [x] Verificar se coluna `profession` existe em `user_templates`
  - [x] Listar todos os templates por área
  
  **Resultados:**
  - **Nutri:** 6 templates (1 calculadora, 1 planilha, 4 quiz)
  - **Wellness:** 36 templates (4 calculadora, 7 planilha, 25 quiz)
  - **Total:** 42 templates (conferindo com backup)
  
- [ ] **1.3. Documentar Templates Nutri**
  - [ ] Exportar lista completa de templates Nutri
  - [ ] Verificar conteúdo dos templates

**Status:** ✅ Fase 1 CONCLUÍDA  
**Resultado:** 
- Backup: 42 templates ✅
- Nutri: 6 templates (1 calc, 1 planilha, 4 quiz)
- Wellness: 36 templates (4 calc, 7 planilha, 25 quiz)
- **Análise:** `ANALISE-ESTADO-ATUAL.md`

**Próxima Ação:** Fase 2 - Garantir coluna profession e duplicar templates

---

## ⏸️ ETAPAS PENDENTES

### 🟡 **Fase 2: Duplicar Templates no Banco** 🗄️
- [x] **2.1. Garantir Coluna `profession`**
  - [x] Executar `scripts/03-GARANTIR-COLUNA-PROFESSION-FASE2.sql`
  - [x] Verificar se coluna foi criada/atualizada
  - [x] Confirmar coluna existe em `templates_nutrition` e `user_templates`
  - **Resultado:** ✅ Coluna `profession` já existe em `user_templates`
  
- [x] **2.2. Completar Templates Nutri (Wellness → Nutri)**
  - [x] Executar `scripts/04-DUPLICAR-WELLNESS-TO-NUTRI.sql`
  - [x] Verificar contagem (esperado: Nutri com 36 templates)
  - [x] Validar alguns templates duplicados
  - **Resultado:** ✅ Templates duplicados com sucesso! Exemplos confirmados: Calculadora de Água, IMC, Proteína, Calorias, Quiz Alimentação Saudável
  
- [x] **2.3. Criar Templates Coach (Wellness → Coach)**
  - [x] Executar primeira parte de `scripts/05-DUPLICAR-WELLNESS-TO-COACH-NUTRA.sql`
  - [x] Verificar que foram criados (esperado: 36 templates, desativados)
  - **Resultado:** ✅ Templates Coach criados! Exemplo: Calculadora de IMC (coach, desativado)
  
- [x] **2.4. Criar Templates Nutra (Wellness → Nutra)**
  - [x] Executar segunda parte de `scripts/05-DUPLICAR-WELLNESS-TO-COACH-NUTRA.sql`
  - [x] Verificar que foram criados (esperado: 36 templates, desativados)
  - **Resultado:** ✅ Templates Nutra criados! Exemplo: Calculadora de IMC (nutra, desativado)
  
- [x] **2.5. Verificar Duplicação Completa**
  - [x] Executar `scripts/06-VERIFICAR-DUPLICACAO-FASE2.sql`
  - [x] Confirmar que todos os templates foram duplicados
  - [x] Verificar se não há templates faltando
  - **Resultado:** ✅ Fase 2 CONCLUÍDA! Exemplo confirmado: Calculadora de IMC existe nas 4 áreas:
    - ✅ coach (desativado)
    - ✅ nutra (desativado)
    - ✅ nutri (ativo)
    - ✅ wellness (ativo)

**Status:** ✅ Fase 2 CONCLUÍDA  
**Resultado Final:** 144 templates (36 × 4 áreas)  
**Próxima Fase:** Fase 3 - Separar Diagnósticos

---

### 🟡 **Fase 3: Separar Diagnósticos** 📝
- [x] **3.1. Criar Estrutura de Pastas**
  - [x] Criar `src/lib/diagnostics/nutri/`
  - [x] Criar `src/lib/diagnostics/wellness/`
  - [x] Criar `src/lib/diagnostics/coach/`
  - [x] Criar `src/lib/diagnostics/nutra/`
  - [x] Criar `src/lib/diagnostics/types.ts` (tipos compartilhados)
  - **Resultado:** ✅ Estrutura criada, primeiro template (checklist-alimentar) separado
  
- [ ] **3.2. Dividir `diagnosticos-nutri.ts`**
  - [ ] Ler arquivo completo
  - [ ] Criar arquivo separado para cada template
  - [ ] Exportar apenas diagnóstico daquele template
  
- [ ] **3.3. Copiar Diagnósticos para Outras Áreas**
  - [ ] Copiar Nutri → Wellness
  - [ ] Copiar Nutri → Coach
  - [ ] Copiar Nutri → Nutra
  - [ ] Ajustar imports/exports

**Status:** ⏸️ Aguardando Fase 2

---

### ⏸️ **Fase 4: Atualizar APIs e Componentes** 🔧
- [ ] **4.1. Verificar APIs Existentes**
  - [ ] Verificar se `/api/nutri/*` existe
  - [ ] Documentar APIs Wellness (já funcionam)
  - [ ] Criar APIs Coach se necessário
  - [ ] Criar APIs Nutra se necessário
  
- [ ] **4.2. Atualizar Componentes de Preview**
  - [ ] Atualizar `/pt/nutri/ferramentas/templates/page.tsx` → Importar de `diagnostics/nutri/*`
  - [ ] Atualizar `/pt/wellness/templates/page.tsx` → Importar de `diagnostics/wellness/*`
  - [ ] Criar `/pt/coach/templates/page.tsx` se necessário
  - [ ] Criar `/pt/nutra/templates/page.tsx` se necessário

**Status:** ⏸️ Aguardando Fase 3

---

### ⏸️ **Fase 5: Validação e Testes** ✅
- [ ] **5.1. Checklist de Validação**
  - [ ] Templates Nutri: 38 templates
  - [ ] Templates Wellness: 38 templates (duplicados)
  - [ ] Templates Coach: 38 templates (duplicados, desativados)
  - [ ] Templates Nutra: 38 templates (duplicados, desativados)
  - [ ] Links criados mantêm `profession` correto
  
- [ ] **5.2. Testes Frontend**
  - [ ] `/pt/nutri/ferramentas/templates` → Mostra 38 templates Nutri
  - [ ] `/pt/wellness/templates` → Mostra 38 templates Wellness
  - [ ] Preview Nutri usa diagnósticos Nutri
  - [ ] Preview Wellness usa diagnósticos Wellness
  - [ ] Criação de links funciona em todas as áreas
  
- [ ] **5.3. Testes de Isolamento**
  - [ ] Criar link em Wellness → Não aparece em Nutri
  - [ ] Desativar template em Coach → Não afeta Wellness
  - [ ] Editar diagnóstico Wellness → Não afeta Nutri

**Status:** ⏸️ Aguardando Fase 4

---

### ⏸️ **Fase 6: Reativar Login e Finalizar** 🔐
- [ ] **6.1. Reativar Proteções de Login**
  - [ ] Descomentar `ProtectedRoute` no Dashboard
  - [ ] Reativar `useAuth` hooks
  - [ ] Testar login em todas as áreas
  
- [ ] **6.2. Reativar Funcionalidades Temporariamente Desabilitadas**
  - [ ] Reativar Chat IA
  - [ ] Reativar carregamento de dados do dashboard
  - [ ] Testar tudo funcionando com login

**Status:** ⏸️ Aguardando Fase 5

---

## 📊 MÉTRICAS E VALIDAÇÕES

### Templates por Área
- **Nutri:** _[será preenchido após Fase 1]_
- **Wellness:** _[será preenchido após Fase 2]_
- **Coach:** _[será preenchido após Fase 2]_
- **Nutra:** _[será preenchido após Fase 2]_

### Validações de Isolamento
- [ ] Links Wellness isolados de Nutri
- [ ] Diagnósticos Wellness isolados de Nutri
- [ ] Templates Coach isolados (desativados)
- [ ] Templates Nutra isolados (desativados)

---

## 🚨 PROBLEMAS ENCONTRADOS

### Problema 1: [Título]
- **Quando:** [Data]
- **Descrição:** [Descrição do problema]
- **Solução:** [Solução aplicada]
- **Status:** [Resolvido/Pendente]

---

## 📝 NOTAS IMPORTANTES

- ✅ Login desabilitado temporariamente para facilitar migração
- ✅ Chat desabilitado temporariamente
- ✅ Dashboard otimizado (removido seção de cursos hardcoded)
- ⚠️ TODOs marcados no código para reativar login após migração

---

## 🔄 PRÓXIMAS AÇÕES

1. **Agora:** Executar Fase 1 - Backup e Verificação
2. **Depois:** Fase 2 - Duplicar Templates no Banco
3. **Em seguida:** Fase 3 - Separar Diagnósticos

---

## 📞 CONTATO E REFERÊNCIAS

- **Plano Completo:** `PLANO-MIGRACAO-GRADUAL-SEGURA.md`
- **Scripts SQL:** Pasta `scripts/`
- **Estrutura Detalhada:** `ESTRUTURA-DETALHADA-AREAS-INDEPENDENTES.md`

---

**Última Atualização:** {{DATE}}  
**Status Geral:** 🟡 Em Andamento - Fase 1

