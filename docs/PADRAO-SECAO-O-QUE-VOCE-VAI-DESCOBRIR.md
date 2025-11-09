# 📋 Padrão: Seção "O que você vai descobrir"

## 🎯 Objetivo

A seção **"O que você vai descobrir"** é uma ferramenta de conversão que aparece na **página de apresentação (Etapa 0)** do preview dinâmico. Ela estimula o preenchimento do quiz ao mostrar claramente os benefícios que o usuário receberá ao completar a avaliação.

## ✅ Quando Usar

**TODOS os templates de quiz devem ter essa seção**, pois ela:
- Aumenta a taxa de conversão
- Deixa claro o valor da avaliação
- Estimula o preenchimento
- Melhora a experiência do usuário

## 📐 Estrutura

A seção aparece na **Etapa 0 (Landing Page)** do preview dinâmico, logo após a descrição e antes do botão "Iniciar Quiz".

### Formato Visual

```
┌─────────────────────────────────────────┐
│ [Título do Quiz]                        │
│ [Descrição]                              │
│ [Mensagem motivacional]                  │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ 💡 O que você vai descobrir:         │ │
│ │ ✓ Benefício 1                        │ │
│ │ ✓ Benefício 2                        │ │
│ │ ✓ Benefício 3                        │ │
│ │ ✓ Benefício 4                        │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ [Botão: Iniciar Quiz]                    │
└─────────────────────────────────────────┘
```

## 📝 Template de Benefícios

Cada template deve ter **3-5 benefícios** que:
- Sejam específicos e concretos
- Mostrem valor claro para o usuário
- Sejam escritos em linguagem direta e objetiva
- Comecem com verbos de ação quando possível

### Exemplo de Boa Prática

```typescript
beneficios: [
  'Seu tipo de metabolismo específico',
  'Como seu corpo reage à alimentação e suplementos',
  'Estratégias personalizadas para otimizar sua energia',
  'O melhor caminho para ter mais resultados'
]
```

## 🔧 Implementação Técnica

A seção é implementada no componente `DynamicTemplatePreview.tsx` através da função `getIntroContent()`, que retorna um objeto com:

```typescript
{
  titulo: string,
  descricao: string,
  mensagem: string,
  beneficios?: string[]  // Array de 3-5 benefícios
}
```

### Localização no Código

- **Arquivo:** `src/components/shared/DynamicTemplatePreview.tsx`
- **Função:** `getIntroContent()` (linha ~106)
- **Renderização:** Etapa 0 (linha ~203-227)

## ✅ Templates com Seção Implementada

### Wellness (22/37)

- [x] **Quiz Interativo** - `quiz-interativo`
  - Benefícios: Tipo de metabolismo, reação do corpo, estratégias, melhor caminho
  
- [x] **Quiz Bem-Estar** - `quiz-bem-estar`
  - Benefícios: Perfil predominante, áreas para otimizar, rotina de autocuidado, estratégias
  
- [x] **Quiz Perfil Nutricional** - `quiz-perfil-nutricional`
  - Benefícios: Absorção de nutrientes, deficiências, oportunidades, recomendações
  
- [x] **Quiz Detox** - `quiz-detox`
  - Benefícios: Sinais de sobrecarga tóxica, impacto na energia, orientações, estratégias
  
- [x] **Quiz Energético** - `quiz-energetico`
  - Benefícios: Nível de energia, fatores afetantes, como aumentar, estratégias
  
- [x] **Avaliação Emocional** - `avaliacao-emocional`
  - Benefícios: Autoestima, motivação, como lida com desafios, perfil emocional
  
- [x] **Quiz Intolerância** - `quiz-intolerancia`
  - Benefícios: Intolerâncias alimentares, alimentos que causam desconforto, estratégias, produtos adequados
  
- [x] **Quiz Perfil Metabólico** - `quiz-perfil-metabolico`
  - Benefícios: Perfil metabólico completo, como acelerar metabolismo, estratégias, produtos otimizados
  
- [x] **Quiz Eletrólitos** - `quiz-eletrolitos`
  - Benefícios: Desequilíbrios eletrolíticos, como melhorar equilíbrio, estratégias, produtos adequados
  
- [x] **Quiz Sintomas Intestinais** - `quiz-sintomas-intestinais`
  - Benefícios: Problemas intestinais, como melhorar saúde digestiva, estratégias, produtos adequados
  
- [x] **Quiz Avaliação Inicial** - `quiz-avaliacao-inicial`
  - Benefícios: Perfil e necessidades, como podemos ajudar, estratégias, produtos adequados
  
- [x] **Quiz Pronto para Emagrecer** - `quiz-pronto-emagrecer`
  - Benefícios: Prontidão para emagrecer, como podemos ajudar, estratégias, produtos adequados
  
- [x] **Quiz Tipo de Fome** - `quiz-tipo-fome`
  - Benefícios: Tipo de fome, se é física ou emocional, estratégias, produtos adequados
  
- [x] **Quiz Alimentação Saudável** - `quiz-alimentacao-saudavel`
  - Benefícios: Pontos de melhoria, como criar hábitos saudáveis, recomendações, produtos adequados
  
- [x] **Quiz Síndrome Metabólica** - `quiz-sindrome-metabolica`
  - Benefícios: Risco de síndrome metabólica, como prevenir complicações, recomendações, produtos preventivos
  
- [x] **Quiz Retenção de Líquidos** - `quiz-retencao-liquidos`
  - Benefícios: Nível de retenção, como reduzir inchaço, recomendações, produtos específicos
  
- [x] **Quiz Conhece seu Corpo** - `quiz-conhece-seu-corpo`
  - Benefícios: Nível de conhecimento sobre corpo, como conhecer sinais, recomendações, produtos e estratégias
  
- [x] **Quiz Nutrido vs Alimentado** - `quiz-nutrido-vs-alimentado`
  - Benefícios: Se está nutrido ou alimentado, como transformar alimentação em nutrição, recomendações, produtos adequados
  
- [x] **Quiz Alimentação e Rotina** - `quiz-alimentacao-rotina`
  - Benefícios: Se alimentação está adequada à rotina, como adequar ao estilo de vida, recomendações, produtos adaptados
  
- [x] **Quiz Ganhos e Prosperidade** - `quiz-ganhos-prosperidade`
  - Benefícios: Potencial para ganhos, oportunidades de crescimento financeiro, insights, caminhos para prosperidade
  
- [x] **Quiz Potencial e Crescimento** - `quiz-potencial-crescimento`
  - Benefícios: Potencial de crescimento, oportunidades de desenvolvimento, insights, caminhos para alcançar seu máximo
  
- [x] **Quiz Propósito e Equilíbrio** - `quiz-proposito-equilibrio`
  - Benefícios: Alinhamento com propósito, oportunidades de equilíbrio, insights, caminhos para viver seu propósito

### Nutri (0/35)

- [ ] Ainda não migrados para preview dinâmico

## 📋 Checklist para Novos Templates

Ao criar ou migrar um novo template de quiz:

- [ ] Definir 3-5 benefícios específicos e concretos
- [ ] Adicionar `beneficios` no retorno de `getIntroContent()` para o slug do template
- [ ] Testar visualmente no preview dinâmico
- [ ] Verificar se os benefícios estão alinhados com o diagnóstico que será entregue
- [ ] Atualizar este documento com o novo template

## 🎨 Estilo Visual

A seção usa:
- **Fundo:** Branco com borda (`bg-white border border-gray-200`)
- **Título:** "💡 O que você vai descobrir:" em negrito
- **Lista:** Checkmarks (✓) com espaçamento adequado
- **Cores:** Adaptadas para templates especiais (ex: rosa/roxo para Quiz Emocional)

## 📊 Métricas de Sucesso

A seção "O que você vai descobrir" deve:
- ✅ Aparecer em 100% dos templates de quiz
- ✅ Ter 3-5 benefícios por template
- ✅ Ser escrita em linguagem clara e objetiva
- ✅ Estar alinhada com o diagnóstico entregue

## 🔄 Manutenção

Este documento deve ser atualizado sempre que:
- Um novo template for migrado para preview dinâmico
- Um template receber novos benefícios
- O padrão visual for alterado

---

**Última atualização:** 2025-01-XX  
**Responsável:** Equipe de Desenvolvimento  
**Status:** ✅ Padrão estabelecido e em uso

