# Relatório: Exposição de Informações do Usuário em Fluxos Públicos

## 📋 Resumo Executivo

Este relatório identifica onde informações destinadas ao **usuário da plataforma** (coach/recrutador) estão sendo exibidas para **quem preenche os formulários/fluxos públicos**, violando a privacidade e expondo estratégias internas.

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **FLUXOS DE RECRUTAMENTO (Wellness System)**

#### 1.1. Campo `objetivo` do Fluxo Exposto
**Localização:** 
- `src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx` (linha 206)
- `src/app/pt/wellness/[user-slug]/fluxos/[tipo]/[id]/page.tsx` (linha 82)

**Problema:**
```tsx
<p className="text-lg text-gray-600 max-w-2xl mx-auto">
  {fluxo.objetivo}
</p>
```

**Exemplo de conteúdo exposto:**
- "Identificar pessoas que querem renda extra imediata e direcioná-las para apresentação de negócio."
- "Conectar com pessoas que já consomem produtos saudáveis e podem trabalhar com o que gostam."
- "Alcançar pessoas desempregadas, vivendo instabilidade financeira..."

**Impacto:** ⚠️ **CRÍTICO** - Expõe a estratégia de recrutamento e objetivos internos do usuário da plataforma.

**Arquivos afetados:**
- Todos os 13 fluxos de recrutamento em `src/lib/wellness-system/fluxos-recrutamento.ts`
- Cada fluxo tem um campo `objetivo` que é claramente informação interna

---

#### 1.2. Seção Hero com Marketing da Plataforma
**Localização:** 
- `src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx` (linhas 424-449)

**Problema:**
```tsx
<section className="bg-gradient-to-br from-purple-50 via-green-50 to-emerald-50 py-8 sm:py-12">
  <div className="text-center max-w-4xl mx-auto">
    {/* Imagem Hero */}
    <Image
      src="/images/wellness-hero.png"
      alt="Pessoas conversando sobre Bem Estar de forma simples e leve"
      ...
    />
    
    {/* Título Principal */}
    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
      Transforme como você conversa: fale com 10x mais pessoas, de forma simples e leve.
    </h1>
    
    <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 font-medium">
      Com inteligência artificial integrada.
    </p>
  </div>
</section>
```

**Impacto:** ⚠️ **ALTO** - Esta seção aparece em TODAS as ferramentas públicas, incluindo fluxos de recrutamento. É marketing da plataforma, não conteúdo para quem preenche.

**Observação:** A imagem `/images/wellness-hero.png` também pode não estar carregando (conforme mencionado pelo usuário).

---

### 2. **FORMULÁRIOS (Coach/Nutri)**

#### 2.1. Campo `description` do Formulário
**Localização:**
- `src/app/pt/c/[user-slug]/formulario/[slug]/page.tsx` (linha 191-193)
- `src/app/pt/nutri/[user-slug]/formulario/[slug]/page.tsx` (linha 462-464)
- `src/app/f/[formId]/page.tsx` (linha 493-495)

**Código:**
```tsx
{formulario.description && (
  <p className="text-gray-600">{formulario.description}</p>
)}
```

**Status:** ⚠️ **REQUER ANÁLISE** - O campo `description` pode conter:
- ✅ Descrição legítima para o usuário final (OK)
- ❌ Instruções internas ou objetivos do usuário da plataforma (PROBLEMA)

**Recomendação:** Verificar no banco de dados se há formulários com `description` contendo informações internas.

---

### 3. **PORTALS (Wellness/Coach/Nutri)**

#### 3.1. Campo `description` do Portal
**Localização:**
- `src/app/pt/wellness/portal/[slug]/page.tsx` (linha 324-326)
- `src/app/pt/wellness/[user-slug]/portal/[slug]/page.tsx` (linha 325-327)
- `src/app/pt/c/portal/[slug]/page.tsx` (linha 324-326)
- `src/app/pt/coach/portal/[slug]/page.tsx` (linha 324-326)
- `src/app/pt/nutri/portal/[slug]/page.tsx` (linha 324-326)

**Código:**
```tsx
{portal.description && (
  <p className="text-lg text-gray-600 max-w-2xl mx-auto">{portal.description}</p>
)}
```

**Status:** ⚠️ **REQUER ANÁLISE** - Similar aos formulários, pode conter informações internas.

---

## 📊 RESUMO POR FERRAMENTA

### ✅ Ferramentas de Recrutamento (Wellness)
| Ferramenta | Problema | Severidade | Status |
|------------|----------|------------|--------|
| Fluxos de Recrutamento | Campo `objetivo` exposto | 🔴 CRÍTICO | **CORRIGIR** |
| Todas as ferramentas | Seção Hero com marketing | 🟡 ALTO | **CORRIGIR** |
| Imagem hero | Imagem não carrega | 🟡 MÉDIO | **VERIFICAR** |

### ⚠️ Formulários (Coach/Nutri)
| Tipo | Campo | Severidade | Status |
|------|-------|------------|--------|
| Formulários públicos | `description` | 🟡 REQUER ANÁLISE | **VERIFICAR** |

### ⚠️ Portals
| Tipo | Campo | Severidade | Status |
|------|-------|------------|--------|
| Portals públicos | `description` | 🟡 REQUER ANÁLISE | **VERIFICAR** |

---

## 🎯 RECOMENDAÇÕES DE CORREÇÃO

### Prioridade 1: CRÍTICO (Corrigir Imediatamente)

1. **Remover `fluxo.objetivo` dos fluxos públicos de recrutamento**
   - Remover a exibição do campo `objetivo` nas páginas públicas
   - Manter apenas o `nome` do fluxo (que é público)

2. **Remover ou condicionar seção Hero em fluxos de recrutamento**
   - A seção Hero com marketing da plataforma não deve aparecer em fluxos públicos
   - Pode ser mantida apenas em ferramentas de vendas (se aplicável)

### Prioridade 2: ALTO (Corrigir em Breve)

3. **Verificar campo `description` em formulários**
   - Criar query para identificar formulários com `description` contendo palavras-chave suspeitas:
     - "identificar", "direcionar", "objetivo", "estratégia", "recrutar", etc.
   - Se encontrar, criar campo separado: `public_description` vs `internal_notes`

4. **Verificar campo `description` em portals**
   - Similar ao item 3

### Prioridade 3: MÉDIO (Verificar)

5. **Corrigir imagem hero que não carrega**
   - Verificar se `/images/wellness-hero.png` existe
   - Se não existir, remover ou substituir

---

## 📝 FLUXOS DE RECRUTAMENTO AFETADOS

Todos os 13 fluxos em `src/lib/wellness-system/fluxos-recrutamento.ts`:

1. `renda-extra-imediata` - "Identificar pessoas que querem renda extra imediata..."
2. `maes-trabalhar-casa` - "Identificar mães que querem flexibilidade..."
3. `ja-consome-bem-estar` - "Identificar pessoas que já consomem produtos saudáveis..."
4. `trabalhar-apenas-links` - "Identificar pessoas que querem trabalhar pelo celular..."
5. `ja-usa-energia-acelera` - "Identificar pessoas que já consomem Energia..."
6. `cansadas-trabalho-atual` - "Conectar com pessoas insatisfeitas no emprego..."
7. `ja-tentaram-outros-negocios` - "Conectar com pessoas que já tentaram empreender..."
8. `querem-trabalhar-digital` - "Conectar com pessoas que não querem vender presencialmente..."
9. `ja-empreendem` - "Conectar com pessoas que já empreendem..."
10. `querem-emagrecer-renda` - "Conectar com pessoas que estão buscando emagrecer..."
11. `boas-venda-comercial` - "Conectar com pessoas que sabem vender..."
12. `perderam-emprego-transicao` - "Alcançar pessoas desempregadas..."
13. `transformar-consumo-renda` - "Conectar com pessoas que já consomem produtos saudáveis..."
14. `jovens-empreendedores` - "Alcançar jovens (18-30 anos) que querem independência..."

---

## 🔧 ARQUIVOS QUE PRECISAM SER CORRIGIDOS

1. `src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx`
   - Remover seção Hero para fluxos de recrutamento
   - Remover exibição de `fluxo.objetivo`

2. `src/app/pt/wellness/[user-slug]/fluxos/[tipo]/[id]/page.tsx`
   - Remover exibição de `fluxo.objetivo`

3. `src/components/wellness-system/FluxoDiagnostico.tsx`
   - Verificar se há outras informações internas sendo expostas

---

## ✅ PRÓXIMOS PASSOS

1. ✅ Criar este relatório
2. ✅ **CORRIGIDO** - Remover exibição de `fluxo.objetivo` em fluxos públicos
3. ✅ **CORRIGIDO** - Remover/condicionar seção Hero em fluxos de recrutamento
4. ⏳ Verificar e corrigir campo `description` em formulários (requer análise manual)
5. ⏳ Verificar e corrigir campo `description` em portals (requer análise manual)
6. ⏳ Corrigir imagem hero que não carrega

---

## 🔧 CORREÇÕES REALIZADAS

### ✅ 1. Remoção do campo `objetivo` em fluxos públicos

**Arquivos corrigidos:**
- `src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx` (linha 206)
- `src/app/pt/wellness/[user-slug]/fluxos/[tipo]/[id]/page.tsx` (linha 82)

**Mudança:** Removida a exibição de `{fluxo.objetivo}` que continha informações internas como:
- "Identificar pessoas que querem renda extra imediata e direcioná-las para apresentação de negócio."
- "Conectar com pessoas que já consomem produtos saudáveis..."

**Resultado:** Agora apenas o nome do fluxo (`fluxo.nome`) é exibido, que é apropriado para público.

---

### ✅ 2. Remoção da seção Hero em fluxos de recrutamento

**Arquivo corrigido:**
- `src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx` (linhas 424-449)

**Mudança:** A seção Hero com marketing da plataforma ("Transforme como você conversa: fale com 10x mais pessoas...") agora só aparece para ferramentas que NÃO são fluxos de recrutamento.

**Lógica implementada:**
```tsx
const isFluxoRecrutamento = tool.is_fluxo && tool.content?.fluxo && 
  (tool.content.tipo === 'recrutamento' || tool.fluxo_tipo === 'recrutamento')

{!isFluxoRecrutamento && (
  // Seção Hero apenas para não-recrutamento
)}
```

**Resultado:** Fluxos de recrutamento não exibem mais o marketing da plataforma, apenas o conteúdo do fluxo.

---

## ⚠️ PENDÊNCIAS (Requerem Análise Manual)

### Campo `description` em Formulários e Portals

**Status:** O campo `description` pode conter tanto informações públicas quanto internas. O placeholder sugere uso interno ("Descreva o objetivo deste formulário..."), mas não há separação clara.

**Recomendação:**
1. Executar query no banco para identificar formulários/portals com `description` contendo palavras-chave suspeitas:
   ```sql
   SELECT id, name, description 
   FROM custom_forms 
   WHERE description ILIKE '%identificar%' 
      OR description ILIKE '%direcionar%' 
      OR description ILIKE '%objetivo%'
      OR description ILIKE '%estratégia%'
      OR description ILIKE '%recrutar%';
   ```

2. Se encontrar casos problemáticos, considerar:
   - Criar campo separado: `public_description` vs `internal_notes`
   - Ou adicionar flag: `description_is_public` (boolean)

**Arquivos afetados (apenas exibem, não modificam):**
- `src/app/pt/c/[user-slug]/formulario/[slug]/page.tsx`
- `src/app/pt/nutri/[user-slug]/formulario/[slug]/page.tsx`
- `src/app/f/[formId]/page.tsx`
- Todos os arquivos de portals públicos

---

**Data do Relatório:** 15/12/2025  
**Analisado por:** AI Assistant  
**Status:** 🟡 CORREÇÕES CRÍTICAS CONCLUÍDAS - PENDÊNCIAS REQUEREM ANÁLISE MANUAL
