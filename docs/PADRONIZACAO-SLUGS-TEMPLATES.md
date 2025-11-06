# ✅ Solução: Padronização de Slugs de Templates

## 🎯 Problema Identificado

O `template_slug` estava sendo gerado dinamicamente do `name` do template no banco. Isso causava:
- **Múltiplas variações**: "calculadora-de-agua", "calculadora-de-hidratacao", "hidratacao" → todos apontavam para o mesmo template
- **Inconsistência**: Se o nome mudasse no banco, o slug mudava também
- **Switch cases duplicados**: Precisava adicionar vários cases para cada variação
- **Manutenção difícil**: Cada novo nome criava uma nova variação

## ✅ Solução Implementada

### 1. **Coluna `slug` Fixa no Banco**
- Adicionada coluna `slug` na tabela `templates_nutrition`
- Slug é **fixo e padronizado**, não depende do nome
- Índice único garante slugs únicos

### 2. **Script SQL de Padronização**
Arquivo: `padronizar-slugs-templates.sql`
- Adiciona coluna `slug` se não existir
- Popula slugs baseado em regras padronizadas:
  - `calc-hidratacao` para todas as calculadoras de água/hidratação
  - `calc-imc` para calculadoras IMC
  - `calc-proteina` para calculadoras de proteína
  - etc.
- Para templates não mapeados, gera slug do nome como fallback

### 3. **Código Atualizado**
- **API de Templates**: Usa `slug` do banco se existir, senão gera do nome (fallback)
- **Validação**: `validateTemplateBeforeCreate()` retorna o slug canônico do banco
- **Criação de Ferramenta**: Salva sempre o slug canônico do banco
- **Renderização**: Usa `normalizeTemplateSlug()` para garantir consistência

### 4. **Mapeamento de Fallback**
Arquivo: `src/lib/template-slug-map.ts`
- Mapeia variações antigas para slugs canônicos
- Garante compatibilidade com ferramentas criadas antes da padronização

## 📋 Como Funciona Agora

### **Fluxo Completo:**

1. **Template no Banco:**
   ```sql
   name: "Calculadora de Hidratação"
   slug: "calc-hidratacao"  ← FIXO, não muda mesmo se o nome mudar
   ```

2. **Ao Criar Ferramenta:**
   - Busca template pelo `slug` do banco
   - Salva `template_slug: "calc-hidratacao"` em `user_templates`
   - Sempre usa o slug canônico

3. **Ao Renderizar:**
   - Lê `template_slug: "calc-hidratacao"` de `user_templates`
   - Switch case simples: `case 'calc-hidratacao':`
   - Sempre funciona, mesmo se o nome do template mudar

## 🔧 Próximos Passos

1. **Execute o script SQL** `padronizar-slugs-templates.sql` no Supabase
2. **Verifique os slugs** gerados (última query do script mostra todos)
3. **Ajuste manualmente** se algum template não foi mapeado corretamente
4. **Teste criação de ferramentas** - devem usar slugs canônicos

## ✅ Benefícios

- ✅ **Consistência**: Sempre o mesmo slug, mesmo se o nome mudar
- ✅ **Manutenção fácil**: Um único case no switch por template
- ✅ **Busca rápida**: Pode fazer query direta por slug
- ✅ **Compatibilidade**: Mapeamento de fallback para variações antigas
- ✅ **Escalável**: Fácil adicionar novos templates com slugs padronizados

## 📝 Exemplo de Uso

```typescript
// Antes (gerava do nome):
template.name = "Calculadora de Água"
template_slug = "calculadora-de-agua"  // Gerado dinamicamente

// Depois (slug fixo):
template.name = "Calculadora de Hidratação"  // Pode mudar
template.slug = "calc-hidratacao"  // FIXO, sempre o mesmo
template_slug = "calc-hidratacao"  // Usa do banco
```

## 🎯 Padrão de Nomenclatura

- **Calculadoras**: `calc-{nome}` (ex: `calc-imc`, `calc-hidratacao`)
- **Quizzes**: `quiz-{nome}` (ex: `quiz-ganhos`, `quiz-potencial`)
- **Planilhas**: `planilha-{nome}` (ex: `planilha-meal-planner`)

Sempre em **minúsculas** e **hífens** ao invés de espaços.

