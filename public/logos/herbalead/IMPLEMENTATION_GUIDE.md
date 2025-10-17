# HerbaLead - Guia de Implementação dos Logotipos

## ✅ Organização Concluída

Todos os logotipos foram organizados e renomeados com sucesso! 

### 📁 Estrutura Criada
```
public/logos/herbalead/
├── README.md                    # Documentação completa
├── BRAND_GUIDELINES.md          # Diretrizes da marca
├── config.ts                    # Configuração TypeScript
├── HerbaLeadLogo.tsx            # Componente React
├── herbalead-logo-horizontal.png    # Logo principal horizontal
├── herbalead-logo-vertical.png     # Logo vertical
├── herbalead-logo-minimal.png      # Versão minimalista
├── herbalead-logo-light.png        # Para fundos claros
├── herbalead-logo-dark.png         # Para fundos escuros
├── herbalead-logo-reverse.png      # Versão invertida
├── herbalead-logo-monochrome.png   # Monocromático
├── herbalead-icon-only.png         # Apenas ícone
├── herbalead-icon-square.png       # Ícone quadrado
└── herbalead-favicon.png           # Favicon
```

## 🚀 Como Usar

### 1. Importar o Componente
```tsx
import { HerbaLeadLogo, HerbaLeadIcon } from '/logos/herbalead/HerbaLeadLogo';
```

### 2. Usar em Componentes
```tsx
// Logo horizontal padrão
<HerbaLeadLogo variant="horizontal" className="h-12" />

// Ícone apenas
<HerbaLeadIcon className="w-8 h-8" />

// Logo responsivo (horizontal no desktop, ícone no mobile)
<ResponsiveHerbaLeadLogo className="h-10" />

// Logo para fundo escuro
<HerbaLeadLogo variant="light" className="h-8" />
```

### 3. Usar Cores do Tailwind
```tsx
// Verde principal
<div className="bg-herbalead-green-primary text-white">

// Azul principal  
<div className="bg-herbalead-blue-primary text-white">

// Verde claro
<div className="bg-herbalead-green-light text-herbalead-gray-900">
```

## 🔄 Próximos Passos

### 1. Atualizar Componentes Existentes
Substituir referências antigas pelos novos componentes:

```tsx
// Antes
<img src="/logos/old-logo.png" alt="Logo" />

// Depois  
<HerbaLeadLogo variant="horizontal" className="h-8" />
```

### 2. Implementar Favicon
Atualizar o favicon do site:
```html
<link rel="icon" href="/logos/herbalead/herbalead-favicon.png" />
```

### 3. Testar Responsividade
Verificar se os logos ficam bem em diferentes tamanhos de tela.

## 📋 Checklist de Implementação

- [x] ✅ Organizar arquivos de logo
- [x] ✅ Renomear com padrão consistente  
- [x] ✅ Criar documentação completa
- [x] ✅ Configurar Tailwind com cores da marca
- [x] ✅ Criar componente React reutilizável
- [x] ✅ Configuração TypeScript
- [ ] 🔄 Atualizar componentes existentes
- [ ] 🔄 Implementar favicon
- [ ] 🔄 Testar em diferentes telas
- [ ] 🔄 Validar acessibilidade

## 🎨 Cores Disponíveis no Tailwind

```css
/* Verdes */
bg-herbalead-green-primary    /* #10B981 */
bg-herbalead-green-light      /* #34D399 */
bg-herbalead-green-dark       /* #059669 */
bg-herbalead-green-lighter    /* #D1FAE5 */

/* Azuis */
bg-herbalead-blue-primary     /* #1E40AF */
bg-herbalead-blue-light      /* #3B82F6 */
bg-herbalead-blue-dark        /* #1E3A8A */

/* Cinzas */
bg-herbalead-gray-50          /* #F9FAFB */
bg-herbalead-gray-100         /* #F3F4F6 */
bg-herbalead-gray-500         /* #6B7280 */
bg-herbalead-gray-900         /* #111827 */
```

---

**Status**: ✅ Concluído  
**Próximo**: Implementar nos componentes existentes  
**Data**: $(date)












