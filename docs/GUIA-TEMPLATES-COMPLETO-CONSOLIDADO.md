# 📋 GUIA CONSOLIDADO: Templates - Criação e Manutenção

**Objetivo:** Documentar padrões, estrutura e manutenção de templates  
**Última atualização:** Hoje  
**Versão:** 1.0.0

---

## 📋 ÍNDICE

1. [Filosofia e Princípios](#1-filosofia-e-princípios)
2. [Estrutura de Templates](#2-estrutura-de-templates)
3. [Tipos de Templates](#3-tipos-de-templates)
4. [Preview Dinâmico](#4-preview-dinâmico)
5. [Diagnósticos](#5-diagnósticos)
6. [Benefícios e Landing](#6-benefícios-e-landing)
7. [Manutenção por Área](#7-manutenção-por-área)
8. [Checklist de Criação](#8-checklist-de-criação)
9. [Duplicação de Templates](#9-duplicação-de-templates)

---

## 1. FILOSOFIA E PRINCÍPIOS

### **1.1. Princípio Fundamental**

**"Servir Antes de Vender"** - Cada template deve agregar valor real ao usuário antes de qualquer intenção comercial.

### **1.2. Conformidade Científica**

**Organizações de Referência:**
- OMS (Organização Mundial da Saúde)
- FDA (Food and Drug Administration)
- ANVISA (Agência Nacional de Vigilância Sanitária)
- Sociedades Médicas Especializadas

**Regras:**
- ✅ Todas as informações devem ter base científica
- ✅ Referências atualizadas (máximo 5 anos)
- ✅ Não inventar dados ou recomendações
- ✅ Sempre citar fontes quando necessário

### **1.3. Disclaimers e Avisos Legais**

**🔴 OBRIGATÓRIO "CONSULTE ESPECIALISTA":**
- Calculadoras médicas (IMC, calorias específicas)
- Quizzes diagnósticos (sintomas, condições)
- Recomendações de suplementos específicos
- Planos alimentares personalizados
- Avaliações de saúde específicas

**🟡 RECOMENDADO:**
- Quizzes de bem-estar geral
- Calculadoras de hidratação
- Informações educativas sobre nutrição

**🟢 NÃO NECESSÁRIO:**
- Informações gerais de saúde
- Dicas de bem-estar básicas
- Conteúdo puramente educativo
- Templates organizacionais

**Texto Padrão:**
```
⚠️ IMPORTANTE: Este template é apenas informativo e educativo. 
Para recomendações específicas sobre sua saúde, consulte sempre 
um profissional qualificado (médico, nutricionista, etc.).
```

---

## 2. ESTRUTURA DE TEMPLATES

### **2.1. Estrutura Padrão**

```
1. INTRODUÇÃO (Landing Page)
   - Título claro e objetivo
   - Descrição do que será avaliado
   - Tempo estimado de preenchimento
   - Seção "O que você vai descobrir"
   - Seção "Por que usar esta ferramenta"
   - Botão de ação

2. CONTEÚDO PRINCIPAL
   - Perguntas/inputs organizados
   - Validação em tempo real
   - Progresso visual
   - Navegação (Anterior/Próxima)

3. RESULTADO
   - Diagnóstico baseado nas respostas
   - Recomendações gerais
   - Próximos passos sugeridos
   - CTAs personalizados por profissão

4. CONFIGURAÇÃO FINAL
   - Opção de captar dados
   - Opção de redirecionar
   - CTA personalizado por profissão
```

### **2.2. Estrutura no Banco de Dados**

**Tabela: `templates`**

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  profession TEXT NOT NULL, -- 'wellness', 'nutri', 'nutra', 'coach'
  template_type TEXT NOT NULL, -- 'quiz', 'calculator', 'checklist', etc.
  content JSONB NOT NULL, -- Estrutura do template
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Campo `content` (JSONB):**

```json
{
  "template_type": "quiz",
  "profession": "wellness",
  "questions": [
    {
      "id": 1,
      "question": "Como é seu nível de energia ao longo do dia?",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "(A) Vivo cansado, mesmo dormindo bem"},
        {"id": "b", "label": "(B) Tenho altos e baixos"},
        {"id": "c", "label": "(C) Energia constante o dia inteiro"}
      ]
    }
  ]
}
```

---

## 3. TIPOS DE TEMPLATES

### **3.1. QUIZES (1-5)**

**Estrutura:**
- 5-6 perguntas com 3 opções cada
- Pontuação: A=1, B=2, C=3 pontos
- Categorias: 3 resultados baseados na pontuação
- Gatilhos: Cada pergunta tem gatilho mental específico

**Exemplo:**
```typescript
{
  "template_type": "quiz",
  "questions": [
    {
      "id": 1,
      "question": "Pergunta 1",
      "type": "multiple_choice",
      "options": [
        {"id": "a", "label": "Opção A"},
        {"id": "b", "label": "Opção B"},
        {"id": "c", "label": "Opção C"}
      ]
    }
  ]
}
```

### **3.2. CALCULADORAS (6-9)**

**Estrutura:**
- Formulário com campos obrigatórios/opcionais
- Cálculo: Fórmula científica específica
- Categorias: Faixas baseadas em resultados numéricos
- Validação: Campos obrigatórios marcados

**Exemplo:**
```typescript
{
  "template_type": "calculator",
  "fields": [
    {"id": "peso", "label": "Peso (kg)", "type": "number", "required": true},
    {"id": "altura", "label": "Altura (cm)", "type": "number", "required": true}
  ],
  "formula": "peso / (altura / 100) ** 2"
}
```

### **3.3. CHECKLISTS (10-11)**

**Estrutura:**
- Lista de itens para marcar
- Pontuação: Contagem de itens marcados
- Categorias: Faixas baseadas na pontuação
- Ação: Recomendações baseadas no resultado

### **3.4. GUIAS/E-BOOKS (12-14, 25-26)**

**Estrutura:**
- Conteúdo educativo estruturado
- Categorias: Baseadas no nível de conhecimento
- Ação: Próximos passos específicos
- Valor: Conteúdo científico + prático

### **3.5. TABELAS (15-17, 22)**

**Estrutura:**
- Dados organizados em tabelas
- Categorias: Baseadas na seleção do usuário
- Ação: Recomendações específicas
- Interação: Seleção de opções

### **3.6. PLANOS/PLANNERS (18-21, 23-24)**

**Estrutura:**
- Cronograma ou plano estruturado
- Categorias: Baseadas no objetivo do usuário
- Ação: Personalização do plano
- Acompanhamento: Sistema de check-ins

---

## 4. PREVIEW DINÂMICO

### **4.1. Conceito**

O preview dinâmico renderiza templates automaticamente baseado no `content` JSONB do banco, sem precisar de código hardcoded para cada template.

### **4.2. Componente: `DynamicTemplatePreview`**

**Localização:** `src/components/templates/DynamicTemplatePreview.tsx`

**Uso:**
```typescript
<DynamicTemplatePreview
  template={template}
  content={template.content}
  diagnostico={getDiagnostico(template.slug, profession)}
/>
```

### **4.3. Estrutura de Etapas**

**⚠️ IMPORTANTE:** Para **previews**, não há tela de landing/introdução. O preview deve ser objetivo e começar direto na primeira pergunta.

```
Etapa 1+: Perguntas do Quiz (1, 2, 3, ...)
Etapa Final: Resultados/Diagnósticos
```

**Fluxo:**
1. **Etapa 1+ (Perguntas):**
   - Mostra barra de progresso
   - Mostra pergunta atual
   - Mostra opções de resposta
   - Botão "← Anterior" (desabilitado na primeira pergunta)
   - Botão "Próxima →" ou "Ver Resultado" (na última pergunta)

2. **Etapa Final (Resultados):**
   - Mostra diagnósticos baseados nas respostas
   - Botão "Reiniciar Preview" → volta para Etapa 1
   - Botão "Fechar" (se disponível)

### **4.4. Navegação**

**Botões:**
- **"← Anterior"**: `setEtapaAtual(Math.max(1, etapaAtual - 1))`
- **"Próxima →"**: `setEtapaAtual(etapaAtual + 1)`
- **"Ver Resultado"**: Na última pergunta
- **"Reiniciar Preview"**: `setEtapaAtual(1)` + `setRespostas({})`

### **4.5. Barra de Progresso**

**Exibição:**
- Mostrada apenas nas perguntas (etapa 1+)
- Formato: `Pergunta X de Y` + `Z%`
- Barra visual: `bg-gray-200` com `bg-blue-600` preenchendo

**Cálculo:**
```typescript
const progresso = (etapaAtual / totalPerguntas) * 100
```

---

## 5. DIAGNÓSTICOS

### **5.1. Estrutura Padrão (6 Dicas Essenciais)**

```
1. 📋 DIAGNÓSTICO: O que está acontecendo
2. 🔍 CAUSA RAIZ: Por que está acontecendo  
3. ⚡ AÇÃO IMEDIATA: O que fazer agora
4. 📅 PLANO 7 DIAS: Próximos passos
5. 💊 SUPLEMENTAÇÃO: Recomendações específicas
6. 🍎 ALIMENTAÇÃO: Ajustes alimentares
```

### **5.2. Localização**

**Arquivos TypeScript em:**
- `src/lib/diagnostics/wellness/` (Wellness)
- `src/lib/diagnostics/nutri/` (Nutri)
- `src/lib/diagnostics/nutra/` (Nutra)
- `src/lib/diagnostics/coach/` (Coach)

### **5.3. Estrutura Esperada**

```typescript
export const quizNomeDiagnosticos = {
  wellness: {
    resultado1: {
      diagnostico: "Texto do diagnóstico",
      causaRaiz: "Causa raiz identificada",
      acaoImediata: "Ação imediata recomendada",
      plano7Dias: "Plano de 7 dias",
      suplementacao: "Recomendações de suplementação",
      alimentacao: "Ajustes alimentares"
    },
    resultado2: { ... },
    resultado3: { ... }
  },
  nutri: { ... },
  nutra: { ... },
  coach: { ... }
}
```

### **5.4. Busca de Diagnósticos**

```typescript
import { getDiagnostico } from '@/lib/diagnostics'

const diagnostico = getDiagnostico(template.slug, profession)
```

---

## 6. BENEFÍCIOS E LANDING

### **6.1. Arquivo Centralizado**

**Localização:** `src/lib/template-benefits.ts`

**Função:**
```typescript
getTemplateBenefits(templateSlug: string): {
  discover: string[],
  whyUse: string[]
}
```

### **6.2. Componente Landing**

**Localização:** `src/components/wellness/WellnessLanding.tsx`

**Props:**
```typescript
<WellnessLanding
  config={config}
  defaultEmoji="📊"
  defaultTitle="Título do Template"
  defaultDescription="Descrição do Template"
  discover={templateBenefits.discover || []}  // "O que você vai descobrir"
  benefits={templateBenefits.whyUse || []}    // "Por que usar esta ferramenta"
  onStart={iniciarTemplate}
  buttonText="▶️ Começar Agora - É Grátis"
/>
```

### **6.3. Como Usar**

```typescript
import { getTemplateBenefits } from '@/lib/template-benefits'

{etapa === 'landing' && (() => {
  const templateBenefits = getTemplateBenefits('calc-imc')
  
  return (
    <WellnessLanding
      config={config}
      defaultEmoji="📊"
      defaultTitle="Calculadora de IMC"
      defaultDescription="Descubra seu Índice de Massa Corporal"
      discover={templateBenefits.discover || []}
      benefits={templateBenefits.whyUse || []}
      onStart={iniciarCalculo}
      buttonText="▶️ Calcular Agora - É Grátis"
    />
  )
})()}
```

### **6.4. Adicionar Novos Benefícios**

**Arquivo:** `src/lib/template-benefits.ts`

```typescript
if (slug.includes('meu-novo-template')) {
  return {
    discover: [
      'Benefício 1 que o usuário vai descobrir',
      'Benefício 2 que o usuário vai descobrir',
      'Benefício 3 que o usuário vai descobrir'
    ],
    whyUse: [
      'Razão 1 para usar esta ferramenta',
      'Razão 2 para usar esta ferramenta',
      'Razão 3 para usar esta ferramenta'
    ]
  }
}
```

---

## 7. MANUTENÇÃO POR ÁREA

### **7.1. Como Funciona Hoje**

**Templates no Banco:**
- Cada template tem `profession='wellness'` ou `profession='nutri'`
- Templates são independentes por área
- Um template pode existir em Wellness mas não em Nutri (e vice-versa)

**Preview Hardcoded:**
- Cada área tem seu próprio arquivo de preview
- Wellness: `src/app/pt/wellness/templates/page.tsx`
- Nutri: `src/app/pt/nutri/ferramentas/templates/page.tsx`

**Diagnósticos Hardcoded:**
- Wellness: `src/lib/diagnostics/wellness/*.ts`
- Nutri: `src/lib/diagnosticos-nutri.ts`

### **7.2. Adicionar Template Novo em Wellness**

**Passos:**
1. ✅ Adicionar template no banco com `profession='wellness'`
2. ✅ Adicionar preview hardcoded em `wellness/templates/page.tsx` (ou usar preview dinâmico)
3. ✅ Adicionar diagnóstico em `lib/diagnostics/wellness/`

**Resultado:**
- ✅ Template aparece em Wellness
- ❌ Template NÃO aparece em Nutri (correto)

### **7.3. Duplicar Template de Wellness para Nutri**

**Passos:**
1. ✅ Executar SQL para duplicar template no banco (mudar `profession='nutri'`)
2. ✅ Adicionar preview hardcoded em `nutri/ferramentas/templates/page.tsx` (ou usar preview dinâmico)
3. ✅ Verificar se diagnóstico já existe em `lib/diagnosticos-nutri.ts`
   - Se não existir, adicionar
   - Se existir, usar o existente

**Resultado:**
- ✅ Template aparece em ambas as áreas

### **7.4. Solução Recomendada: Preview Dinâmico**

**Vantagens:**
- ✅ Preview gerado automaticamente do `content` JSONB
- ✅ Não precisa adicionar preview hardcoded para cada template
- ✅ Funciona para templates novos automaticamente

**Implementação:**
```typescript
<DynamicPreview 
  template={template} 
  content={template.content}
  diagnostico={getDiagnostico(template.slug, profession)}
/>
```

---

## 8. CHECKLIST DE CRIAÇÃO

### **8.1. Antes de Criar**

- [ ] Definir tipo de template (quiz, calculator, checklist, etc.)
- [ ] Definir categorias/resultados da ferramenta
- [ ] Criar perguntas/inputs específicos
- [ ] Definir sistema de pontuação/cálculo
- [ ] Mapear gatilhos mentais
- [ ] Verificar base científica

### **8.2. Durante a Criação**

- [ ] Criar template no banco com `content` JSONB completo
- [ ] Criar diagnósticos para 3 profissões × 3 categorias (9 combinações)
- [ ] Adicionar benefícios em `template-benefits.ts`
- [ ] Desenvolver CTAs específicos (9 combinações)
- [ ] Adicionar preview (dinâmico ou hardcoded)
- [ ] Testar filtros dinâmicos

### **8.3. Após Criação**

- [ ] Verificar consistência científica
- [ ] Validar CTAs por profissão
- [ ] Testar fluxo completo
- [ ] Verificar responsividade
- [ ] Testar em diferentes navegadores
- [ ] Documentar especificidades

### **8.4. Checklist de Qualidade**

**Antes de publicar:**
- [ ] Base científica verificada
- [ ] Disclaimer adequado aplicado
- [ ] Configuração por profissão definida
- [ ] CTA personalizado configurado
- [ ] Teste de usabilidade realizado
- [ ] Responsividade verificada
- [ ] Tempo de carregamento otimizado

---

## 9. DUPLICAÇÃO DE TEMPLATES

### **9.1. Duplicar para Outra Área**

**Passo 1: Duplicar no Banco**
```sql
-- Duplicar template de Wellness para Nutri
INSERT INTO templates (name, description, slug, profession, template_type, content)
SELECT 
  name,
  description,
  slug || '-nutri', -- Novo slug
  'nutri',          -- Nova profissão
  template_type,
  content
FROM templates
WHERE slug = 'quiz-interativo' AND profession = 'wellness';
```

**Passo 2: Adicionar Preview (se necessário)**
- Se usar preview dinâmico: não precisa fazer nada
- Se usar preview hardcoded: adicionar na página da área

**Passo 3: Adicionar Diagnósticos**
- Verificar se diagnóstico já existe
- Se não existir, adicionar em `lib/diagnostics/[area]/`

### **9.2. Preservar Diagnósticos**

**Ao duplicar:**
- ✅ Manter diagnósticos existentes
- ✅ Adicionar diagnósticos específicos da nova área
- ✅ Usar função `getDiagnostico()` que busca automaticamente

### **9.3. Checklist de Duplicação**

- [ ] Template duplicado no banco
- [ ] Slug único criado
- [ ] Preview funcionando (dinâmico ou hardcoded)
- [ ] Diagnósticos adicionados
- [ ] Benefícios adicionados (se necessário)
- [ ] Testado na nova área

---

## 📚 REFERÊNCIAS

### **Documentos Relacionados:**
- `PADROES-CONSTRUCAO-FERRAMENTAS-YLADA.md` ⭐
- `TEMPLATES-PADROES-YLADA.md` ⭐
- `docs/PADRAO-COMPLETO-PREVIEW-DINAMICO.md` ⭐
- `docs/PADRAO-PREVIEW-DINAMICO-QUIZZES.md` ⭐
- `docs/MANUTENCAO-TEMPLATES-AREAS-SEPARADAS.md`
- `docs/COMO-USAR-BENEFICIOS-TEMPLATES.md`
- `docs/GUIA-DUPLICACAO-TEMPLATES-PRESERVANDO-DIAGNOSTICOS.md`

### **Arquivos de Código:**
- `src/lib/template-benefits.ts` - Benefícios centralizados
- `src/components/templates/DynamicTemplatePreview.tsx` - Preview dinâmico
- `src/lib/diagnostics/` - Diagnósticos por área
- `src/components/wellness/WellnessLanding.tsx` - Componente landing

---

## ✅ CONCLUSÃO

Este guia consolida todos os padrões e práticas para criação e manutenção de templates. Use como referência ao:
- Criar novos templates
- Duplicar templates para outras áreas
- Manter templates existentes
- Resolver problemas de preview ou diagnósticos

**Lembre-se:**
- ⚠️ Sempre verificar base científica
- ⚠️ Aplicar disclaimers quando necessário
- ⚠️ Usar preview dinâmico quando possível
- ⚠️ Manter diagnósticos organizados por área

---

**Última atualização:** Hoje  
**Versão:** 1.0.0  
**Mantido por:** Equipe YLADA

