# 🎨 Logos YLADA - Arquivos Oficiais

Este diretório contém todos os arquivos de logo da marca YLADA, criados e organizados para uso em diferentes contextos.

## 📁 Arquivos Disponíveis

### 🖼️ Logos Principais
- **`ylada-logo-horizontal.png`** - Logo principal com gráfico verde (400x120px)
- **`ylada-logo-horizontal.svg`** - Versão SVG do logo principal
- **`ylada-logo-text-only.png`** - Logo apenas com texto (300x80px)
- **`ylada-logo-text-only.svg`** - Versão SVG do logo texto

### 🎯 Ícones
- **`ylada-icon.png`** - Ícone isolado para fundos claros (80x80px)
- **`ylada-icon-dark.png`** - Ícone para fundos escuros com brilho (80x80px)
- **`ylada-icon.svg`** - Versão SVG do ícone

### 🔖 Favicons
- **`ylada-favicon-16.png`** - Favicon 16x16px
- **`ylada-favicon-32.png`** - Favicon 32x32px
- **`favicon.ico`** - Favicon principal do site

## 🎨 Características do Design

### Elementos Visuais
- **Gráfico Verde**: Representa crescimento e dados
- **Silhueta de Pessoa**: Representa o usuário/profissional
- **Gráfico de Barras**: Representa métricas e performance
- **Linha Ascendente**: Representa crescimento e sucesso
- **Seta para Cima**: Representa progresso e melhoria

### Cores
- **Verde Principal**: #10B981 (emerald-500)
- **Texto Escuro**: #374151 (gray-700)
- **Texto Claro**: #6B7280 (gray-500)

## 💻 Como Usar

### Importação
```javascript
import { logos } from './logos-config'

// Logo principal
<img src={logos.horizontal} alt="YLADA" />

// Logo texto apenas
<img src={logos.textOnly} alt="YLADA" />

// Ícone
<img src={logos.icon} alt="YLADA Icon" />
```

### Contextos Recomendados
- **Header/Cabeçalho**: `horizontal` ou `textOnly`
- **Mobile**: `icon`
- **Fundo Escuro**: `iconDark`
- **Favicon**: `favicon32`

## 📐 Especificações Técnicas

### Formatos
- **PNG**: Para uso geral (otimizado)
- **SVG**: Para escalabilidade perfeita
- **ICO**: Para favicons

### Tamanhos
- **Logo Horizontal**: 400x120px (proporção 3.33:1)
- **Logo Texto**: 300x80px (proporção 3.75:1)
- **Ícone**: 80x80px (quadrado)
- **Favicon**: 16x16px, 32x32px

## 🔧 Manutenção

### Atualizações
- Os arquivos SVG são a fonte principal
- PNGs são gerados automaticamente via script
- Favicons são criados a partir do ícone principal

### Script de Conversão
```bash
node scripts/convert-logos.js
```

## 📋 Checklist de Uso

- [ ] Logo principal no cabeçalho
- [ ] Favicon configurado
- [ ] Ícone para mobile
- [ ] Versão escura para fundos escuros
- [ ] Alt text configurado
- [ ] Lazy loading implementado

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0  
**Status**: ✅ Produção