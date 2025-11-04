# Estrutura de Templates Wellness - YLADA

## 📐 Arquitetura Escalável

Esta estrutura foi projetada para **escalar facilmente** de 13 para 100+ templates sem perder manutenibilidade.

## 📁 Estrutura de Pastas

```
src/
├── types/
│   └── wellness.ts           # Tipos compartilhados (ToolConfig, etc)
│
├── components/
│   └── wellness/
│       ├── WellnessHeader.tsx       # Header reutilizável
│       ├── WellnessLanding.tsx       # Landing page reutilizável
│       └── WellnessCTAButton.tsx    # Botão CTA reutilizável
│
├── hooks/
│   └── useWellnessConfig.ts  # Hook para gerenciar configurações
│
└── app/
    └── pt/wellness/
        ├── templates/
        │   ├── imc/
        │   │   └── page.tsx          # Template IMC (usa componentes)
        │   ├── proteina/
        │   │   └── page.tsx          # Template Proteína (usa componentes)
        │   └── ...
        └── [user-slug]/
            └── [tool-slug]/
                └── page.tsx          # Rota dinâmica (renderiza templates)
```

## 🎯 Princípios de Design

### 1. **DRY (Don't Repeat Yourself)**
- Componentes compartilhados para partes comuns
- Types/interfaces centralizadas
- Hooks para lógica reutilizável

### 2. **Separation of Concerns**
- **Componentes compartilhados**: UI genérica (Header, Landing, CTA)
- **Templates individuais**: Lógica específica (cálculos, perguntas, resultados)
- **Hooks**: Lógica de negócio reutilizável

### 3. **Manutenibilidade**
- Mudar cores? Apenas no componente `WellnessCTAButton`
- Mudar header? Apenas no componente `WellnessHeader`
- Adicionar novo template? Copiar estrutura básica + lógica específica

## 📝 Como Criar um Novo Template

### Passo 1: Criar arquivo do template
```typescript
// src/app/pt/wellness/templates/novo-template/page.tsx
'use client'

import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'

export default function NovoTemplate({ config }: TemplateBaseProps) {
  // Lógica específica do template aqui
  
  return (
    <div>
      <WellnessHeader 
        title={config?.title}
        description={config?.description}
        defaultTitle="Meu Template"
      />
      
      <main>
        <WellnessLanding
          config={config}
          defaultEmoji="🎯"
          defaultTitle="Meu Template"
          onStart={() => {/* ... */}}
        />
        
        {/* Seu conteúdo específico */}
        
        <WellnessCTAButton
          config={config}
          resultadoTexto="Resultado aqui"
        />
      </main>
    </div>
  )
}
```

### Passo 2: Adicionar no switch da rota dinâmica
```typescript
// src/app/pt/wellness/[user-slug]/[tool-slug]/page.tsx
case 'novo-template-slug':
  return <TemplateNovo config={config} />
```

## 🔄 Fluxo de Configuração

1. **Usuário cria link** → `/pt/wellness/ferramentas/nova`
2. **Configura tudo** → Emoji, título, cores, CTA
3. **Salva no banco** → API `/api/wellness/ferramentas`
4. **Link gerado** → `/wellness/[user-slug]/[tool-slug]`
5. **Template renderiza** → Usa componentes compartilhados com `config`

## ✨ Vantagens desta Estrutura

### Escalabilidade
- ✅ Adicionar 50 templates? Mesma estrutura
- ✅ Mudar design? Apenas componentes compartilhados
- ✅ Adicionar funcionalidade? Hook compartilhado

### Manutenibilidade
- ✅ Bug no CTA? Corrige em 1 lugar
- ✅ Mudar header? Corrige em 1 lugar
- ✅ Novo tipo de config? Adiciona no type e propaga

### Consistência
- ✅ Todos templates têm mesmo header
- ✅ Todos templates têm mesmo CTA
- ✅ Todos templates seguem mesmo padrão

### Performance
- ✅ Componentes otimizados e reutilizáveis
- ✅ Code splitting automático (Next.js)
- ✅ Lazy loading de templates

## 🚀 Próximos Passos

1. ✅ Componentes compartilhados criados
2. ✅ Types/interfaces criados
3. ⏳ Refatorar templates existentes (13)
4. ⏳ Documentar padrões de cada tipo (Calculadora, Quiz, Planilha)







