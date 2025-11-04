# 📋 Estrutura de Previews Wellness - Para Adicionar Novas Ferramentas

## 🎯 Estrutura Recomendada (Após Refatoração)

```
src/
  components/
    wellness-previews/
      calculadoras/
        CalculadoraIMC.tsx
        CalculadoraProteina.tsx
        CalculadoraAgua.tsx
        CalculadoraCalorias.tsx
        ComposicaoCorporal.tsx
        PlanejadorRefeicoes.tsx
      quizzes/
        QuizBemEstar.tsx
        QuizInterativo.tsx
        QuizEnergetico.tsx
        QuizDetox.tsx
        QuizAvaliacaoNutricional.tsx
        QuizParasitas.tsx
        QuizGanhos.tsx
        // ... outros quizzes
      planilhas/
        ChecklistAlimentar.tsx
        ChecklistDetox.tsx
        GuiaNutraceutico.tsx
        GuiaProteico.tsx
        TabelaBemEstarDiario.tsx
  lib/
    wellness-previews/
      preview-map.ts        // Mapeia template ID → componente
      preview-types.ts      // Tipos TypeScript
      preview-utils.ts       // Funções utilitárias
```

## 📝 Como Adicionar Nova Ferramenta

### Passo 1: Criar Componente de Preview
```typescript
// src/components/wellness-previews/quizzes/QuizNovaFerramenta.tsx
export function QuizNovaFerramentaPreview({ template, etapa, setEtapa }) {
  // Landing (etapa 0)
  if (etapa === 0) return <LandingPage />
  
  // Perguntas (etapas 1-5)
  if (etapa >= 1 && etapa <= 5) return <Pergunta etapa={etapa} />
  
  // Resultados (etapa 6)
  if (etapa === 6) return <Resultados />
  
  return null
}
```

### Passo 2: Adicionar ao Preview Map
```typescript
// src/lib/wellness-previews/preview-map.ts
import { QuizNovaFerramentaPreview } from '@/components/wellness-previews/quizzes/QuizNovaFerramenta'

export const previewMap = {
  'nova-ferramenta': QuizNovaFerramentaPreview,
  // ... outros
}
```

### Passo 3: Adicionar ao Fallback
```typescript
// src/app/pt/wellness/templates/page.tsx
{
  id: 'nova-ferramenta',
  name: 'Nova Ferramenta',
  description: 'Descrição',
  icon: Icon,
  type: 'quiz',
  category: 'Categoria',
  link: '/pt/wellness/templates/nova-ferramenta',
  color: 'bg-blue-500'
}
```

## ✅ Benefícios desta Estrutura

1. **Escalável**: Fácil adicionar novas ferramentas
2. **Organizado**: Cada preview em seu próprio arquivo
3. **Manutenível**: Mudanças isoladas não afetam outras ferramentas
4. **Reutilizável**: Componentes podem ser compartilhados
5. **Performance**: Code splitting automático

## 🚀 Próximos Passos

1. ✅ Commit e deploy do estado atual
2. 🔄 Refatorar para estrutura modular
3. 📝 Documentar padrão de previews
4. ➕ Adicionar novas ferramentas usando o padrão

