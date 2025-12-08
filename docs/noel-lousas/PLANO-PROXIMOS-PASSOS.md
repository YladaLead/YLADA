# 🎯 PLANO DE PRÓXIMOS PASSOS — INTEGRAÇÃO DAS LOUSAS

**Data:** 2025-01-06  
**Status:** ✅ Lousas Armazenadas → Próximo: Integração

---

## 📋 RESUMO DO QUE TEMOS AGORA

✅ **28 arquivos de lousas** organizados e armazenados  
✅ **Estrutura de banco de dados** já existe (wellness_scripts, wellness_objecoes, ylada_wellness_base_conhecimento)  
✅ **Sistema NOEL** já implementado parcialmente em `src/lib/noel-wellness/`  
✅ **Seeds iniciais** já existem (mas precisam ser atualizados com conteúdo das lousas)

---

## 🎯 PRÓXIMOS PASSOS (ORDEM DE EXECUÇÃO)

### **FASE 1: Popular Banco de Dados com Conteúdo das Lousas** 🔥 PRIORIDADE MÁXIMA

#### 1.1 Criar Scripts SQL para Popular Base de Conhecimento

**Arquivo a criar:** `scripts/seed-lousas-blocos-01-09.sql`

**Conteúdo a inserir:**
- ✅ Bloco 1: 10 scripts de vendas → `ylada_wellness_base_conhecimento` (categoria: `script_vendas`)
- ✅ Bloco 2: 14 scripts de indicação → `ylada_wellness_base_conhecimento` (categoria: `script_indicacao`)
- ✅ Bloco 3: 15 scripts de recrutamento → `ylada_wellness_base_conhecimento` (categoria: `script_recrutamento`)
- ✅ Bloco 4: 15 scripts de follow-up → `ylada_wellness_base_conhecimento` (categoria: `script_followup`)
- ✅ Bloco 5: 20 frases motivacionais → `ylada_wellness_base_conhecimento` (categoria: `frase_motivacional`)
- ✅ Bloco 6: 15 scripts de prova social → `ylada_wellness_base_conhecimento` (categoria: `script_prova_social`)
- ✅ Bloco 7: 10 fluxos completos → `ylada_wellness_base_conhecimento` (categoria: `fluxo_padrao`)
- ✅ Bloco 9: Notificações → `ylada_wellness_base_conhecimento` (categoria: `notificacao`)

**Total estimado:** ~100+ registros

---

#### 1.2 Atualizar Tabela de Objeções com Conteúdo Completo

**Arquivo a criar:** `scripts/seed-lousas-objecoes-completo.sql`

**Conteúdo a inserir:**
- ✅ Categoria 1: 10 objeções de clientes (Kit/Turbo/Hype)
- ✅ Categoria 2: 5 objeções de clientes recorrentes
- ✅ Categoria 3: 10 objeções de recrutamento
- ✅ Categoria 4: 10 objeções de distribuidores
- ✅ Categoria 5: 5 objeções avançadas

**Total:** 40 objeções com todas as versões (curta, média, longa, gatilho, etc.)

---

#### 1.3 Criar Tabela/Seed para Respostas Alternativas

**Arquivo a criar:** `scripts/seed-lousas-respostas-alternativas.sql`

**Conteúdo a inserir:**
- ✅ Grupo A: 10 respostas alternativas (clientes)
- ✅ Grupo B: 5 respostas alternativas (recorrentes)
- ✅ Grupo C: 10 respostas alternativas (recrutamento)
- ✅ Grupo D: 10 respostas alternativas (distribuidores)
- ✅ Grupo E: 24 respostas alternativas (emocionais)

**Total:** 59 respostas alternativas completas

**Nota:** Pode ser inserido na mesma tabela `wellness_objecoes` ou criar uma nova tabela `wellness_respostas_alternativas`

---

### **FASE 2: Integrar Prompts do NOEL** 🔥 PRIORIDADE ALTA

#### 2.1 Atualizar System Prompt do NOEL

**Arquivo a atualizar:** `src/lib/noel-wellness/persona.ts` ou criar `src/lib/noel-wellness/system-prompt.ts`

**Conteúdo a integrar:**
- ✅ Prompt-Mestre NOEL Lousa 1 (Seções 1-11)
- ✅ Prompt-Mestre NOEL Lousa 2 (Seções 12-19)
- ✅ Prompt Base Completo NOEL

**Ação:** Consolidar todos os prompts em um único System Prompt que será usado pela IA

---

#### 2.2 Atualizar Módulos do NOEL com Novas Regras

**Arquivos a atualizar:**
- `src/lib/noel-wellness/rules.ts` → Integrar Seção 3 (Princípios e Regras)
- `src/lib/noel-wellness/operation-modes.ts` → Integrar Seção 4 (Modos de Operação)
- `src/lib/noel-wellness/reasoning.ts` → Integrar Seção 5 (Como o NOEL Pensa)
- `src/lib/noel-wellness/data-usage.ts` → Integrar Seção 6 (Uso de Banco de Dados)
- `src/lib/noel-wellness/script-engine.ts` → Integrar Seção 7 (Uso de Scripts)
- `src/lib/noel-wellness/tools-integration.ts` → Integrar Seção 8 (Uso de Ferramentas)
- `src/lib/noel-wellness/response-structure.ts` → Integrar Seção 9 (Estrutura de Respostas)
- `src/lib/noel-wellness/teaching.ts` → Integrar Seção 11 (Ensino e Treino)
- `src/lib/noel-wellness/goals-tracker.ts` → Integrar Seção 12 (Metas e PV)
- `src/lib/noel-wellness/career.ts` → Integrar Seção 13 (Carreira)
- `src/lib/noel-wellness/client-diagnosis.ts` → Integrar Seção 14 (Diagnóstico)
- `src/lib/noel-wellness/sponsor-interaction.ts` → Integrar Seção 15 (Patrocinador)
- `src/lib/noel-wellness/personalization.ts` → Integrar Seção 16 (Personalização)

---

### **FASE 3: Integrar Planejamento Estratégico** 🔥 PRIORIDADE ALTA

#### 3.1 Implementar Plano de 90 Dias

**Arquivo a criar/atualizar:** `src/lib/noel-wellness/plano-generator.ts`

**Conteúdo a integrar:**
- ✅ Plano de 7 dias (Onboarding Educacional)
- ✅ Plano de 14 dias (Modelo Híbrido)
- ✅ Plano de 30 dias (Personalizado por Objetivo)
- ✅ Plano de 90 dias (Estrutura Completa)
- ✅ Ritual 2-5-10 (12 semanas)

---

#### 3.2 Implementar Diagnóstico Completo

**Arquivo a atualizar:** `src/lib/noel-wellness/client-diagnosis.ts`

**Conteúdo a integrar:**
- ✅ Diagnóstico por tempo disponível (6 faixas)
- ✅ Diagnóstico por objetivo financeiro
- ✅ Diagnóstico por perfil emocional
- ✅ Diagnóstico por estágio do negócio

---

### **FASE 4: Testes e Validação** 🔥 PRIORIDADE MÉDIA

#### 4.1 Testar Busca Semântica

- Verificar se scripts das lousas aparecem nas buscas
- Testar objeções com respostas alternativas
- Validar que o NOEL usa os novos scripts

---

#### 4.2 Testar Respostas do NOEL

- Testar com diferentes tipos de consultores
- Validar que o NOEL segue os novos prompts
- Verificar personalização por perfil

---

## 📊 CHECKLIST DE EXECUÇÃO

### ✅ FASE 1: Banco de Dados
- [ ] Criar `scripts/seed-lousas-blocos-01-09.sql`
- [ ] Criar `scripts/seed-lousas-objecoes-completo.sql`
- [ ] Criar `scripts/seed-lousas-respostas-alternativas.sql`
- [ ] Executar scripts no Supabase
- [ ] Gerar embeddings para busca semântica

### ✅ FASE 2: Integração de Prompts
- [ ] Consolidar System Prompt completo
- [ ] Atualizar todos os módulos do NOEL
- [ ] Testar que o NOEL usa os novos prompts

### ✅ FASE 3: Planejamento
- [ ] Implementar planos de 7/14/30/90 dias
- [ ] Implementar Ritual 2-5-10
- [ ] Implementar diagnóstico completo

### ✅ FASE 4: Testes
- [ ] Testar busca semântica
- [ ] Testar respostas do NOEL
- [ ] Validar personalização

---

## 🚀 RECOMENDAÇÃO IMEDIATA

**Começar pela FASE 1.1** — Criar o script SQL para popular os Blocos 1-9 na base de conhecimento.

Isso vai:
1. ✅ Popular o banco com TODO o conteúdo das lousas
2. ✅ Permitir que o NOEL use os scripts imediatamente
3. ✅ Validar que a estrutura está correta
4. ✅ Preparar para as próximas fases

---

## 📝 PRÓXIMA AÇÃO SUGERIDA

**Criar o primeiro script SQL** (`scripts/seed-lousas-blocos-01-09.sql`) extraindo o conteúdo dos arquivos:
- `docs/noel-lousas/blocos/bloco-01-vendas-bebidas.md`
- `docs/noel-lousas/blocos/bloco-02-indicacao.md`
- `docs/noel-lousas/blocos/bloco-03-recrutamento-leve.md`
- `docs/noel-lousas/blocos/bloco-04-follow-up-profissional.md`
- `docs/noel-lousas/blocos/bloco-05-motivacao-lideranca.md`
- `docs/noel-lousas/blocos/bloco-06-prova-social-historias.md`
- `docs/noel-lousas/blocos/bloco-07-fluxos-avancados.md`
- `docs/noel-lousas/blocos/bloco-09-notificacoes-inteligentes.md`

---

**Posso começar criando o primeiro script SQL agora?** 🚀

