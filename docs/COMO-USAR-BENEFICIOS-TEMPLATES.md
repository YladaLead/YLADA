# 📋 Como Usar Benefícios nos Templates

## 🎯 Objetivo

Este documento explica como garantir que **todos os templates** mostrem a página de apresentação inicial (landing page) com as seções "O que você vai descobrir" e "Por que usar esta ferramenta", replicando exatamente o que aparece na área demo.

---

## ✅ O Que Foi Implementado

### 1. **Arquivo Centralizado de Benefícios**
- **Localização:** `src/lib/template-benefits.ts`
- **Função:** `getTemplateBenefits(templateSlug)`
- **Retorna:** Objeto com `discover` (O que você vai descobrir) e `whyUse` (Por que usar esta ferramenta)

### 2. **Componente WellnessLanding Atualizado**
- **Localização:** `src/components/wellness/WellnessLanding.tsx`
- **Novas Props:**
  - `discover?: string[]` - Array de benefícios "O que você vai descobrir"
  - `benefits?: string[]` - Array de benefícios "Por que usar esta ferramenta"
- **Renderização:** Ambas as seções aparecem automaticamente quando os arrays são fornecidos

### 3. **Introdução Opcional na Página de Criação**
- **Localização:** `src/app/pt/wellness/ferramentas/nova/page.tsx`
- **Funcionalidade:**
  - Introdução didática explicando como funciona
  - Opção de "Não mostrar novamente" (salva no localStorage)
  - Botão "Criar Meu Link" para pular e ir direto

---

## 🔧 Como Usar nos Templates

### **Passo 1: Importar a Função**

```typescript
import { getTemplateBenefits } from '@/lib/template-benefits'
```

### **Passo 2: Obter Benefícios na Landing Page**

```typescript
{etapa === 'landing' && (() => {
  // Obter benefícios automaticamente baseado no template
  const templateBenefits = getTemplateBenefits('calc-imc') // Use o slug do seu template
  
  return (
    <WellnessLanding
      config={config}
      defaultEmoji="📊"
      defaultTitle="Calculadora de IMC"
      defaultDescription="Descubra seu Índice de Massa Corporal"
      discover={templateBenefits.discover || []}  // ✅ Adicionar esta prop
      benefits={templateBenefits.whyUse || []}    // ✅ Adicionar esta prop
      onStart={iniciarCalculo}
      buttonText="▶️ Calcular Agora - É Grátis"
    />
  )
})()}
```

### **Passo 3: Usar o Slug Correto**

O slug deve corresponder ao `template_slug` usado no banco de dados. Exemplos:
- `'calc-imc'` para Calculadora de IMC
- `'calc-calorias'` para Calculadora de Calorias
- `'calc-proteina'` para Calculadora de Proteína
- `'quiz-ganhos'` para Quiz Ganhos e Prosperidade
- etc.

---

## 📝 Exemplo Completo

### **Antes (sem benefícios):**

```typescript
{etapa === 'landing' && (
  <WellnessLanding
    config={config}
    defaultEmoji="📊"
    defaultTitle="Calculadora de IMC"
    defaultDescription="Descubra seu IMC"
    benefits={[]}  // ❌ Array vazio
    onStart={iniciarCalculo}
  />
)}
```

### **Depois (com benefícios automáticos):**

```typescript
{etapa === 'landing' && (() => {
  const templateBenefits = getTemplateBenefits('calc-imc')
  
  return (
    <WellnessLanding
      config={config}
      defaultEmoji="📊"
      defaultTitle="Calculadora de IMC"
      defaultDescription="Descubra seu IMC"
      discover={templateBenefits.discover || []}  // ✅ "O que você vai descobrir"
      benefits={templateBenefits.whyUse || []}    // ✅ "Por que usar esta ferramenta"
      onStart={iniciarCalculo}
      buttonText="▶️ Calcular Agora - É Grátis"
    />
  )
})()}
```

---

## 🎨 Resultado Visual

Quando implementado corretamente, a landing page mostrará:

1. **Título e Descrição** (personalizados)
2. **Seção "💡 O que você vai descobrir:"** (fundo verde)
   - Lista de 3-5 benefícios específicos
3. **Seção "💡 Por que usar esta ferramenta?"** (fundo azul/roxo)
   - Lista de 3-5 razões para usar
4. **Botão de Ação** (com cores personalizadas)

---

## ✅ Templates Atualizados

- [x] `src/app/pt/wellness/templates/imc/page.tsx`
- [x] `src/app/pt/wellness/templates/calorias/page.tsx`

### **Templates que Precisam Atualização:**

Todos os outros templates em `src/app/pt/wellness/templates/` precisam seguir o mesmo padrão:
- `proteina/page.tsx`
- `hidratacao/page.tsx`
- `composicao/page.tsx`
- `ganhos/page.tsx`
- `potencial/page.tsx`
- `proposito/page.tsx`
- `parasitas/page.tsx`
- E todos os outros...

---

## 🔄 Adicionar Novos Benefícios

Se você precisar adicionar benefícios para um novo template:

1. Abra `src/lib/template-benefits.ts`
2. Adicione um novo `if` com o slug do template:

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

## 🎯 Benefícios da Abordagem Centralizada

1. **✅ Um único código para todos:** Não precisa atualizar cada template individualmente
2. **✅ Fácil manutenção:** Benefícios ficam centralizados em um arquivo
3. **✅ Consistência:** Todos os templates seguem o mesmo padrão visual
4. **✅ Replicação automática:** O que aparece na demo aparece no link gerado

---

## 📚 Referências

- **Componente Landing:** `src/components/wellness/WellnessLanding.tsx`
- **Função de Benefícios:** `src/lib/template-benefits.ts`
- **Exemplo de Uso:** `src/app/pt/wellness/templates/imc/page.tsx`

---

## ⚠️ Importante

- **Sempre use `getTemplateBenefits()`** ao invés de hardcodar benefícios
- **Use o slug correto** do template (mesmo usado no banco de dados)
- **Mantenha os arrays com 3-5 itens** para melhor visualização
- **Teste visualmente** após implementar para garantir que está correto

