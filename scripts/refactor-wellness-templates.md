# Script de Refatoração - Templates Wellness

## Templates Refatorados ✅
1. ✅ IMC - `src/app/pt/wellness/templates/imc/page.tsx`
2. ✅ Proteína - `src/app/pt/wellness/templates/proteina/page.tsx`

## Templates Pendentes ⏳

### Calculadoras (3)
- [ ] Hidratação
- [ ] Composição Corporal

### Quizzes (7)
- [ ] Ganhos e Prosperidade
- [ ] Potencial e Crescimento
- [ ] Propósito e Equilíbrio
- [ ] Parasitas
- [ ] Alimentação Saudável
- [ ] Perfil de Bem-Estar
- [ ] Avaliação Nutricional

### Planilhas (2)
- [ ] Bem-Estar Diário
- [ ] Planejador de Refeições

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



