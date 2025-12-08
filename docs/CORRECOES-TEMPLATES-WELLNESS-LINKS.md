# ✅ CORREÇÕES: Templates Wellness - Diagnósticos e Links

## 📋 PROBLEMAS IDENTIFICADOS E CORRIGIDOS

### 1. ❌ Diagnósticos Faltando no Preview
**Problema**: Alguns templates não mostravam diagnósticos no preview, mostrando apenas a mensagem "Diagnósticos não encontrados".

**Correções Aplicadas**:
- ✅ Melhorada a função `buildSlugCandidates` para gerar mais variações de slugs
- ✅ Melhorada a função `slugMatches` para fazer buscas mais inteligentes
- ✅ Adicionadas variações específicas para quizzes de recrutamento:
  - `ganhos-prosperidade` → `quiz-ganhos`, `quiz-ganhos-prosperidade`, `ganhos-e-prosperidade`
  - `potencial-crescimento` → `quiz-potencial`, `quiz-potencial-crescimento`, `potencial-e-crescimento`
  - `proposito-equilibrio` → `quiz-proposito`, `quiz-proposito-equilibrio`, `proposito-e-equilibrio`
- ✅ Adicionadas variações para fome emocional:
  - `tipo-fome`, `quiz-fome-emocional`, `fome-emocional`, `hunger-type`
- ✅ Remoção automática de prefixos comuns (`template-`, `quiz-`, `calc-`, `calculadora-`)
- ✅ Normalização de preposições (`-de-`, `-da-`, `-do-`, `-e-`)

### 2. ❌ Links Predeterminados Não Funcionando
**Problema**: Links gerados com o slug do template base não funcionavam quando a ferramenta tinha slug personalizado.

**Correções Aplicadas**:
- ✅ Página de links agora busca ferramentas criadas pelo usuário e usa o slug correto
- ✅ API `by-url` agora tem fallback para buscar por `template_slug` quando não encontra pelo `slug`
- ✅ Links funcionam mesmo quando são predeterminados (usando slug do template)

### 3. ❌ Templates Sem Content/Fluxo
**Problema**: Alguns templates não tinham `content` configurado, impedindo o preview de funcionar.

**Solução**:
- ✅ Criado script de verificação (`scripts/verificar-templates-wellness-completo.ts`)
- ✅ Preview agora valida se template tem content antes de renderizar
- ✅ Mensagem clara quando template não tem content configurado

## 🔍 COMO VERIFICAR TEMPLATES COM PROBLEMAS

### Script de Verificação
Execute o script para identificar templates com problemas:
```bash
npx tsx scripts/verificar-templates-wellness-completo.ts
```

O script verifica:
- ✅ Templates sem diagnóstico mapeado
- ✅ Templates sem content/fluxo configurado
- ✅ Quizzes sem perguntas configuradas

### Verificação Manual no Preview
Quando abrir o preview de um template:
1. Se aparecer mensagem amarela "Diagnósticos não encontrados", copie o slug exato
2. Verifique se existe arquivo em `src/lib/diagnostics/wellness/[slug].ts`
3. Adicione mapeamento no `wellnessDiagnosticsMap` em `DynamicTemplatePreview.tsx`

## 📊 MAPEAMENTO DE DIAGNÓSTICOS

### Templates com Diagnóstico Mapeado (50+)
- ✅ Todos os quizzes principais
- ✅ Todas as calculadoras
- ✅ Todos os checklists
- ✅ Todos os guias
- ✅ Todos os desafios
- ✅ Quizzes de recrutamento (3)
- ✅ Quizzes de vendas (todos os outros)

### Como Adicionar Novo Diagnóstico
1. Criar arquivo em `src/lib/diagnostics/wellness/[slug].ts`
2. Exportar objeto `DiagnosticosPorFerramenta`
3. Adicionar ao `wellnessDiagnosticsMap` em `DynamicTemplatePreview.tsx`
4. Adicionar export em `src/lib/diagnostics/index.ts`

## 🔗 FUNCIONAMENTO DOS LINKS

### Geração de Links
1. **Template Base**: Usa `slug` do template
2. **Ferramenta Criada**: Se usuário já criou ferramenta, usa `slug` da ferramenta
3. **Fallback**: Se não encontrar ferramenta, usa `slug` do template

### Busca na API
A API `by-url` busca na seguinte ordem:
1. Por `slug` exato na tabela `user_templates`
2. Por `template_slug` (fallback)
3. Por fluxo (se for fluxo de recrutamento/vendas)

## ✅ CHECKLIST DE VALIDAÇÃO

Para cada template, verificar:
- [ ] Tem diagnóstico mapeado no `wellnessDiagnosticsMap`
- [ ] Tem `content` configurado no banco de dados
- [ ] Preview mostra diagnósticos corretamente
- [ ] Link funciona (mesmo se predeterminado)
- [ ] Fluxo completo está visível no preview

## 🎯 PRÓXIMOS PASSOS

1. **Executar script de verificação** para identificar templates faltantes
2. **Adicionar diagnósticos faltantes** ao mapeamento
3. **Configurar content** para templates sem content
4. **Testar todos os links** para garantir funcionamento

## 📝 NOTAS IMPORTANTES

- Links predeterminados agora funcionam graças ao fallback na API
- Diagnósticos são encontrados mesmo com variações de slug
- Preview valida content antes de renderizar
- Script de verificação ajuda a identificar problemas rapidamente
