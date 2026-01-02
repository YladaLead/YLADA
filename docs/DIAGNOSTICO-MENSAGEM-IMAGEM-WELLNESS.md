# 🔍 Diagnóstico: Mensagem e Imagem Indesejadas nas Ferramentas Wellness

## 📋 Problema Identificado

Quando os links das ferramentas da Wellness são compartilhados (WhatsApp, redes sociais, etc.), estão aparecendo:

1. **Mensagem indesejada**: "Transforme como você conversa: fale com 10x mais pessoas, de forma simples e leve"
2. **Imagem indesejada**: `/images/wellness-hero.png` ou `/images/wellness-hero-com-logo.png`

Esses elementos aparecem tanto na página quando acessada quanto no preview do link quando compartilhado (Open Graph).

---

## 🔎 Análise Completa

### 1. **Página da Ferramenta** (`src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx`)

**Localização**: Linhas 481-508

**Código problemático**:
```tsx
{/* Seção Hero com Imagem e Texto - NÃO exibir para fluxos de recrutamento */}
{!isFluxoRecrutamento && (
  <section className="bg-gradient-to-br from-purple-50 via-green-50 to-emerald-50 py-8 sm:py-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        {/* Imagem Hero */}
        <div className="mb-6 sm:mb-8">
          <Image
            src="/images/wellness-hero.png"
            alt="Pessoas conversando sobre Bem Estar de forma simples e leve"
            width={1200}
            height={675}
            className="w-full h-auto rounded-xl shadow-lg mx-auto"
            priority
          />
        </div>

        {/* Título Principal */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
          Transforme como você conversa: fale com 10x mais pessoas, de forma simples e leve.
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 font-medium">
          Com inteligência artificial integrada.
        </p>
      </div>
    </div>
  </section>
)}
```

**Problema**: Esta seção Hero aparece em TODAS as ferramentas, exceto fluxos de recrutamento. Ela exibe:
- A imagem `/images/wellness-hero.png`
- A mensagem "Transforme como você conversa: fale com 10x mais pessoas..."

**Status**: ❌ **PRECISA SER REMOVIDA**

---

### 2. **Layout da Ferramenta - Open Graph Metadata** (`src/app/pt/wellness/[user-slug]/[tool-slug]/layout.tsx`)

**Localização**: Linhas 160, 236, 241-243

**Código problemático**:

**a) Fallback quando ferramenta não é encontrada** (Linha 160):
```typescript
fallbackTitle = 'Transforme como você conversa: fale com 10x mais pessoas, de forma simples e leve'
inferredImage = `${baseUrl}/images/wellness-hero-com-logo.png`
```

**b) Metadata Open Graph para ferramentas normais** (Linhas 236, 241-243):
```typescript
// Para outras ferramentas: usar imagem padrão e texto genérico
ogImageUrl = `${baseUrl}/images/wellness-hero-com-logo.png`

// Usar texto padrão para WhatsApp: "Transforme como você conversa: fale com 10x mais pessoas"
ogTitle = 'Transforme como você conversa: fale com 10x mais pessoas, de forma simples e leve'
ogDescription = 'Com inteligência artificial integrada.'
```

**Problema**: Quando os links são compartilhados, o Open Graph está usando:
- Título genérico da plataforma em vez do título da ferramenta específica
- Imagem genérica da plataforma em vez de uma imagem específica da ferramenta

**Status**: ❌ **PRECISA SER CORRIGIDO** - Deve usar título e descrição da ferramenta específica

---

### 3. **Layout Geral do Wellness** (`src/app/pt/wellness/layout.tsx`)

**Localização**: Linhas 16-19, 37

**Código problemático**:
```typescript
title: 'WELLNESS - Transforme como você conversa: fale com 10x mais pessoas',
description: 'Transforme como você conversa: fale com 10x mais pessoas, de forma simples e leve. Com inteligência artificial integrada.',
openGraph: {
  title: 'Transforme como você conversa: fale com 10x mais pessoas, de forma simples e leve',
  description: 'Com inteligência artificial integrada.',
  images: [{
    url: ogImageUrl, // wellness-hero-com-logo.png
    ...
  }],
}
```

**Problema**: Este é o metadata padrão para todas as páginas Wellness que não têm metadata específico. Pode estar sendo usado como fallback.

**Status**: ⚠️ **PODE SER MANTIDO** - Este é apenas para a página geral `/pt/wellness`, não para ferramentas específicas

---

## 📊 Resumo dos Problemas

| Localização | Tipo | Problema | Impacto |
|------------|------|----------|---------|
| `page.tsx` (linhas 481-508) | Seção Hero | Imagem e mensagem aparecem na página | ❌ Alto - Usuário vê ao acessar |
| `layout.tsx` (linha 160) | OG Fallback | Mensagem genérica quando ferramenta não encontrada | ⚠️ Médio - Apenas em erro |
| `layout.tsx` (linhas 236, 241-243) | OG Metadata | Mensagem e imagem genéricas no preview do link | ❌ **CRÍTICO** - Aparece ao compartilhar |
| `layout.tsx` (geral) | Metadata padrão | Metadata para página geral | ✅ OK - Não afeta ferramentas |

---

## ✅ Soluções Necessárias

### 1. **Remover Seção Hero da Página da Ferramenta**

**Arquivo**: `src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx`

**Ação**: Remover completamente as linhas 481-508 (seção Hero inteira)

**Resultado**: A página da ferramenta começará diretamente com o conteúdo da ferramenta, sem a seção de marketing da plataforma.

---

### 2. **Corrigir Open Graph Metadata para Usar Dados da Ferramenta**

**Arquivo**: `src/app/pt/wellness/[user-slug]/[tool-slug]/layout.tsx`

**Ação**: Modificar as linhas 234-250 para usar:
- `ogTitle = tool.title` (título da ferramenta específica)
- `ogDescription = tool.description` (descrição da ferramenta específica)
- `ogImageUrl` = Imagem específica da ferramenta (se disponível) ou imagem genérica do template

**Resultado**: Quando o link for compartilhado, mostrará o título e descrição da ferramenta específica, não a mensagem genérica da plataforma.

---

### 3. **Verificar Fallback**

**Arquivo**: `src/app/pt/wellness/[user-slug]/[tool-slug]/layout.tsx`

**Ação**: Modificar o fallback (linha 160) para usar um título mais genérico sem a mensagem de marketing:
- `fallbackTitle = toolSlug` ou `'Ferramenta de Bem-Estar'`

**Resultado**: Mesmo em caso de erro, não mostrará a mensagem de marketing.

---

## 🎯 Impacto Esperado Após Correção

### Antes:
- ❌ Link compartilhado mostra: "Transforme como você conversa: fale com 10x mais pessoas..."
- ❌ Imagem genérica da plataforma
- ❌ Página mostra seção Hero com marketing da plataforma

### Depois:
- ✅ Link compartilhado mostra: Título específico da ferramenta (ex: "Calculadora de Água")
- ✅ Descrição específica da ferramenta
- ✅ Página começa diretamente com a ferramenta, sem seção de marketing

---

## 📝 Observações

1. **Fluxos de Recrutamento**: Já estão corretos - não exibem a seção Hero (linha 476 verifica `isFluxoRecrutamento`)

2. **Imagens OG**: Pode ser necessário criar imagens específicas para cada tipo de ferramenta ou usar uma imagem genérica mais apropriada

3. **Compatibilidade**: As mudanças não devem afetar outras funcionalidades, apenas remover elementos indesejados

---

## 🔗 Arquivos Envolvidos

1. `src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx` - Remover seção Hero
2. `src/app/pt/wellness/[user-slug]/[tool-slug]/layout.tsx` - Corrigir OG Metadata
3. `src/app/pt/wellness/layout.tsx` - Verificar se não está sendo usado como fallback

---

**Data do Diagnóstico**: 16 de Dezembro de 2025
**Status**: ⏳ Aguardando correção
















