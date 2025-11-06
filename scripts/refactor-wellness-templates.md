# Script de Refatoração - Templates Wellness

## Templates Refatorados ✅
1. ✅ IMC - `src/app/pt/wellness/templates/imc/page.tsx`
2. ✅ Proteína - `src/app/pt/wellness/templates/proteina/page.tsx`
3. ✅ Hidratação - `src/app/pt/wellness/templates/hidratacao/page.tsx`
4. ✅ Composição Corporal - `src/app/pt/wellness/templates/composicao/page.tsx`
5. ✅ Ganhos e Prosperidade - `src/app/pt/wellness/templates/ganhos/page.tsx`
6. ✅ Potencial e Crescimento - `src/app/pt/wellness/templates/potencial/page.tsx`
7. ✅ Propósito e Equilíbrio - `src/app/pt/wellness/templates/proposito/page.tsx`
8. ✅ Parasitas - `src/app/pt/wellness/templates/parasitas/page.tsx`
9. ✅ Alimentação Saudável - `src/app/pt/wellness/templates/healthy-eating/page.tsx`
10. ✅ Perfil de Bem-Estar - `src/app/pt/wellness/templates/wellness-profile/page.tsx`
11. ✅ Avaliação Nutricional - `src/app/pt/wellness/templates/nutrition-assessment/page.tsx`
12. ✅ Bem-Estar Diário - `src/app/pt/wellness/templates/daily-wellness/page.tsx`
13. ✅ Planejador de Refeições - `src/app/pt/wellness/templates/meal-planner/page.tsx`

## ✅ Status: Todos os Templates Refatorados!

Todos os templates listados foram verificados e já estão usando os componentes padronizados:
- `WellnessHeader` para cabeçalho
- `WellnessLanding` para página inicial (quando aplicável)
- `WellnessCTAButton` para call-to-action nos resultados
- Suporte a `config?.custom_colors` para personalização de cores

## Padrão de Refatoração

### 1. Importações
```typescript
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
```

### 2. Props do Componente
```typescript
export default function NomeTemplate({ config }: TemplateBaseProps) {
```

### 3. Header
```typescript
<WellnessHeader
  title={config?.title}
  description={config?.description}
  defaultTitle="Título Padrão"
  defaultDescription="Descrição Padrão"
/>
```

### 4. Landing
```typescript
<WellnessLanding
  config={config}
  defaultEmoji="🎯"
  defaultTitle="Título"
  defaultDescription={<JSX>}
  benefits={['benefício 1', 'benefício 2']}
  onStart={funcaoIniciar}
  buttonText="▶️ Começar"
/>
```

### 5. Botões do Formulário
```typescript
style={config?.custom_colors
  ? {
      background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
    }
  : {
      background: 'linear-gradient(135deg, #cor1 0%, #cor2 100%)'
    }}
```

### 6. CTA no Resultado
```typescript
<WellnessCTAButton
  config={config}
  resultadoTexto="Texto formatado do resultado"
/>
```











