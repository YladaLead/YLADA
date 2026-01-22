# 🔍 VERIFICAÇÃO: LYA e Dados do Diagnóstico

## 📋 RESUMO EXECUTIVO

**Status:** ⚠️ **DADOS INCOMPLETOS**

A LYA **NÃO está considerando todos os dados** do diagnóstico preenchido pela nutricionista. Ela está recebendo apenas **4 campos de 13 campos disponíveis**.

---

## ✅ O QUE A LYA ESTÁ RECEBENDO ATUALMENTE

### No endpoint `/api/nutri/lya/analise` (análise):
- ✅ `situacao_atual`
- ✅ `objetivo_principal`
- ✅ `travas` (insatisfações)
- ✅ `campo_aberto`

### No endpoint `/api/nutri/lya/analise-v2` (análise v2):
- ✅ `situacao_atual`
- ✅ `objetivo_principal`
- ✅ `travas` (insatisfações)
- ✅ `campo_aberto`

### No endpoint `/api/nutri/lya` (chat principal):
- ❌ **NÃO busca diagnóstico diretamente**
- ✅ Busca apenas: jornada, reflexões, branding

---

## ❌ O QUE A LYA NÃO ESTÁ RECEBENDO

### Dados do Diagnóstico que estão faltando:

1. **BLOCO 1: Perfil Profissional**
   - ❌ `tipo_atuacao` (clinica_fisica, online, hibrida, iniciante, outra)
   - ❌ `tempo_atuacao` (menos_1_ano, 1_3_anos, 3_5_anos, mais_5_anos)
   - ❌ `autoavaliacao` (tecnica_boa_negocio_fraco, tecnica_boa_negocio_razoavel, etc.)

2. **BLOCO 2: Momento Atual do Negócio**
   - ❌ `processos_captacao` (boolean)
   - ❌ `processos_avaliacao` (boolean)
   - ❌ `processos_fechamento` (boolean)
   - ❌ `processos_acompanhamento` (boolean)

3. **BLOCO 3: Objetivos e Metas**
   - ❌ `meta_financeira` (ate_5k, 5k_10k, 10k_20k, acima_20k)

4. **BLOCO 5: Tempo e Preferências**
   - ❌ `tempo_disponivel` (ate_30min, 30_60min, 1_2h, 2_3h, 3_4h, 4_6h, mais_6h)
   - ❌ `preferencia` (guiado, autonomo)

---

## 📊 ESTRUTURA COMPLETA DO DIAGNÓSTICO

A tabela `nutri_diagnostico` possui os seguintes campos:

```typescript
interface NutriDiagnostico {
  // BLOCO 1: Perfil Profissional
  tipo_atuacao: string          // ❌ NÃO está sendo passado
  tempo_atuacao: string         // ❌ NÃO está sendo passado
  autoavaliacao: string         // ❌ NÃO está sendo passado
  
  // BLOCO 2: Momento Atual do Negócio
  situacao_atual: string        // ✅ ESTÁ sendo passado
  processos_captacao: boolean   // ❌ NÃO está sendo passado
  processos_avaliacao: boolean  // ❌ NÃO está sendo passado
  processos_fechamento: boolean // ❌ NÃO está sendo passado
  processos_acompanhamento: boolean // ❌ NÃO está sendo passado
  
  // BLOCO 3: Objetivo Principal (90 dias)
  objetivo_principal: string    // ✅ ESTÁ sendo passado
  meta_financeira: string       // ❌ NÃO está sendo passado
  
  // BLOCO 4: Travas e Dificuldades
  travas: string[]              // ✅ ESTÁ sendo passado
  
  // BLOCO 5: Tempo, Energia e Disciplina
  tempo_disponivel: string      // ❌ NÃO está sendo passado
  preferencia: string           // ❌ NÃO está sendo passado
  
  // BLOCO 6: Campo Aberto
  campo_aberto: string          // ✅ ESTÁ sendo passado
}
```

---

## 🔍 ONDE OS DADOS SÃO BUSCADOS

### 1. `/api/nutri/lya/analise/route.ts` (linhas 252-256)

```typescript
Diagnóstico:
- Situação Atual: ${diagnostico.situacao_atual}
- Objetivo: ${diagnostico.objetivo_principal}
- Travas: ${diagnostico.travas.join(', ')}
${campoAbertoInfo}
```

**Problema:** Apenas 4 campos são passados.

### 2. `/api/nutri/lya/analise-v2/route.ts` (linhas 58-63)

```typescript
diagnostico: JSON.stringify({
  situacao_atual: diagnostico.situacao_atual,
  objetivo_principal: diagnostico.objetivo_principal,
  travas: diagnostico.travas,
  campo_aberto: diagnostico.campo_aberto || 'Não preenchido'
}),
```

**Problema:** Apenas 4 campos são passados.

### 3. `/api/nutri/lya/route.ts` (chat principal)

**Problema:** Não busca diagnóstico diretamente. Busca apenas:
- Jornada (day_number)
- Reflexões (journey_checklist_notes)
- Branding (user_profiles)

---

## 📝 SOBRE "TREINAMENTO EMPRESARIAL NUTRI EMPRESÁRIA"

**Verificação:** "Treinamento empresarial" ou "Formação Empresarial" não é um campo do diagnóstico, mas sim:

1. **Área de Formação na Plataforma:**
   - Existe uma trilha chamada "Formação Empresarial YLADA" (`courses_trails`)
   - É parte do conteúdo educacional da plataforma
   - Não é um dado do diagnóstico, mas sim um recurso disponível

2. **Perfil Estratégico (`nutri_perfil_estrategico`):**
   - É gerado automaticamente a partir do diagnóstico
   - Contém: `tipo_nutri`, `nivel_empresarial`, `foco_prioritario`, `tom_lya`, `ritmo_conducao`
   - ✅ **ESTÁ sendo passado para a LYA** nos endpoints de análise
   - ❌ **NÃO está sendo passado** no endpoint principal de chat (`/api/nutri/lya/route.ts`)

3. **Conceito "Nutri-Empresária":**
   - É a identidade que a plataforma ajuda a construir
   - Está presente no prompt da LYA como missão
   - Não é um dado do diagnóstico, mas sim o objetivo da transformação

**Status do Perfil Estratégico:**
- ✅ Buscado nos endpoints de análise
- ✅ Passado para a LYA nos endpoints de análise
- ❌ **NÃO buscado** no endpoint principal de chat
- ❌ **NÃO passado** para a LYA no chat principal

---

## 🎯 IMPACTO

### O que está funcionando:
- ✅ LYA recebe situação atual
- ✅ LYA recebe objetivo principal
- ✅ LYA recebe travas (insatisfações)
- ✅ LYA recebe campo aberto

### O que NÃO está funcionando:
- ❌ LYA não sabe o tipo de atuação da nutricionista
- ❌ LYA não sabe o tempo de atuação
- ❌ LYA não sabe a autoavaliação
- ❌ LYA não sabe quais processos já existem (captação, avaliação, fechamento, acompanhamento)
- ❌ LYA não sabe a meta financeira
- ❌ LYA não sabe o tempo disponível
- ❌ LYA não sabe a preferência (guiado/autônomo)

### Consequências:
- Respostas menos personalizadas
- Não considera contexto completo da nutricionista
- Não adapta orientações baseado em tempo disponível
- Não considera processos já existentes
- Não considera meta financeira nas orientações

---

## ✅ RECOMENDAÇÕES

### 1. Incluir TODOS os campos do diagnóstico nos endpoints:

**No `/api/nutri/lya/analise/route.ts`:**
```typescript
Diagnóstico:
- Tipo de Atuação: ${diagnostico.tipo_atuacao}
- Tempo de Atuação: ${diagnostico.tempo_atuacao}
- Autoavaliação: ${diagnostico.autoavaliacao}
- Situação Atual: ${diagnostico.situacao_atual}
- Processos Existentes:
  * Captação: ${diagnostico.processos_captacao ? 'Sim' : 'Não'}
  * Avaliação: ${diagnostico.processos_avaliacao ? 'Sim' : 'Não'}
  * Fechamento: ${diagnostico.processos_fechamento ? 'Sim' : 'Não'}
  * Acompanhamento: ${diagnostico.processos_acompanhamento ? 'Sim' : 'Não'}
- Objetivo Principal: ${diagnostico.objetivo_principal}
- Meta Financeira: ${diagnostico.meta_financeira}
- Travas: ${diagnostico.travas.join(', ')}
- Tempo Disponível: ${diagnostico.tempo_disponivel}
- Preferência: ${diagnostico.preferencia}
${campoAbertoInfo}
```

**No `/api/nutri/lya/analise-v2/route.ts`:**
```typescript
diagnostico: JSON.stringify({
  tipo_atuacao: diagnostico.tipo_atuacao,
  tempo_atuacao: diagnostico.tempo_atuacao,
  autoavaliacao: diagnostico.autoavaliacao,
  situacao_atual: diagnostico.situacao_atual,
  processos_captacao: diagnostico.processos_captacao,
  processos_avaliacao: diagnostico.processos_avaliacao,
  processos_fechamento: diagnostico.processos_fechamento,
  processos_acompanhamento: diagnostico.processos_acompanhamento,
  objetivo_principal: diagnostico.objetivo_principal,
  meta_financeira: diagnostico.meta_financeira,
  travas: diagnostico.travas,
  tempo_disponivel: diagnostico.tempo_disponivel,
  preferencia: diagnostico.preferencia,
  campo_aberto: diagnostico.campo_aberto || 'Não preenchido'
}),
```

**No `/api/nutri/lya/route.ts` (chat principal):**
- Adicionar busca do diagnóstico completo
- Incluir dados do diagnóstico no contexto passado para a LYA

### 2. Atualizar o prompt da LYA para usar todos os dados:

Adicionar instruções no prompt para que a LYA considere:
- Tipo de atuação ao dar orientações
- Tempo disponível ao sugerir ações
- Processos existentes ao recomendar ferramentas
- Meta financeira ao orientar sobre crescimento
- Preferência (guiado/autônomo) ao conduzir

---

## 📊 ESTATÍSTICA

**Campos do diagnóstico:** 13 campos
**Campos sendo passados:** 4 campos (30.7%)
**Campos faltando:** 9 campos (69.3%)

---

---

## 🎯 RESUMO FINAL

### ✅ O que está funcionando:
1. LYA recebe dados básicos do diagnóstico (4 campos)
2. LYA recebe perfil estratégico nos endpoints de análise
3. LYA recebe dados da jornada e reflexões

### ❌ O que NÃO está funcionando:
1. **9 campos do diagnóstico não são passados** (69.3% dos dados)
2. **Perfil estratégico não é buscado** no chat principal
3. **Dados do diagnóstico não são buscados** no chat principal

### 📊 Estatísticas:
- **Campos do diagnóstico:** 13 campos
- **Campos sendo passados:** 4 campos (30.7%)
- **Campos faltando:** 9 campos (69.3%)
- **Endpoints afetados:** 3 endpoints
  - `/api/nutri/lya/analise` - dados incompletos
  - `/api/nutri/lya/analise-v2` - dados incompletos
  - `/api/nutri/lya` - não busca diagnóstico nem perfil

### 🔧 Correções necessárias:
1. Incluir todos os 13 campos do diagnóstico nos endpoints de análise
2. Buscar diagnóstico completo no endpoint de chat principal
3. Buscar perfil estratégico no endpoint de chat principal
4. Passar todos os dados para a LYA no contexto

---

**Data da verificação:** 2025-01-21
**Status:** ⚠️ Dados incompletos - precisa correção
**Prioridade:** Alta - Impacta personalização das respostas da LYA
