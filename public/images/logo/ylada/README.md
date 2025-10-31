# 🎨 Logos YLADA - Organização Completa

Este diretório contém todos os arquivos de logo da marca YLADA, organizados por formato e cor.

## 📁 Estrutura de Pastas

```
public/images/logo/ylada/
├── quadrado/
│   ├── verde/           # Logo principal (cor oficial)
│   ├── laranja/         # Variação laranja/ouro
│   ├── vermelho/        # Variação vermelha
│   ├── roxo/           # Variação roxa
│   └── azul-claro/     # Variação azul claro
├── horizontal/          # (Reservado para logos horizontais futuros)
├── logos-config.js      # Configuração para importar
└── README.md           # Esta documentação
```

## 🖼️ Logos Disponíveis

### ✅ Formatos Disponíveis
- **PNG**: Qualidade otimizada para web (recomendado)
- **JPG**: Versão alternativa (maior compressão)

### 🎨 Cores Disponíveis

#### 1. **Verde** (Cor Principal da Marca)
- Arquivos: `ylada-quadrado-verde-2.png`, `ylada-quadrado-verde-3.png`
- Uso: Logo principal, favicon, ícones padrão
- Código cor: `#10B981`

#### 2. **Laranja/Ouro**
- Arquivos: `ylada-quadrado-laranja-12.png` até `15.png` (4 variações)
- Uso: Destaques, CTAs especiais, variações temáticas
- Código cor: `#F97316`

#### 3. **Vermelho**
- Arquivos: `ylada-quadrado-vermelho-16.png`, `17.png` (2 variações)
- Uso: Alertas, ações importantes, variações temáticas
- Código cor: `#EF4444`

#### 4. **Roxo**
- Arquivos: `ylada-quadrado-roxo-18.png` até `25.png` (8 variações)
- Uso: Variações temáticas, fundos escuros
- Código cor: `#A855F7`

#### 5. **Azul Claro**
- Arquivos: `ylada-quadrado-azul-claro-28.png` até `31.png` (4 variações)
- Uso: Dark mode, fundos escuros, variações temáticas
- Código cor: `#60A5FA`

## 💻 Como Usar

### Importação Simples

```jsx
import Image from 'next/image'
import { logos } from '/images/logo/ylada/logos-config'

// Logo principal (verde)
<Image 
  src={logos.principal} 
  alt="YLADA Logo" 
  width={128} 
  height={128}
/>
```

### Por Cor

```jsx
import { getLogoPorCor } from '/images/logo/ylada/logos-config'

// Logo roxo
<Image 
  src={getLogoPorCor('roxo')} 
  alt="YLADA Roxo" 
  width={128} 
  height={128}
/>

// Logo azul claro (para dark mode)
<Image 
  src={getLogoPorCor('azul-claro')} 
  alt="YLADA Azul" 
  width={128} 
  height={128}
/>
```

### Acesso Direto

```jsx
// Logo verde variação 2
<img src="/images/logo/ylada/quadrado/verde/ylada-quadrado-verde-2.png" alt="YLADA" />

// Logo roxo variação 20
<img src="/images/logo/ylada/quadrado/roxo/ylada-quadrado-roxo-20.png" alt="YLADA Roxo" />
```

## 🎯 Contextos de Uso Recomendados

### Logo Principal (Verde)
- ✅ Header/Cabeçalho principal
- ✅ Favicon (favicon.ico)
- ✅ Ícone de app (PWA)
- ✅ Assinatura de emails
- ✅ Documentos oficiais

### Outras Cores
- 🟠 **Laranja**: CTAs especiais, destaques
- 🔴 **Vermelho**: Ações importantes, alertas
- 🟣 **Roxo**: Variações temáticas, fundos claros
- 🔵 **Azul Claro**: Dark mode, fundos escuros

## 📐 Especificações Técnicas

### Dimensões
- **Tamanho Original**: 1080 x 1080px (quadrado)
- **Formato**: PNG (transparente) e JPG
- **Proporção**: 1:1 (quadrado)

### Tamanhos Recomendados
- **Favicon**: 32x32px ou 64x64px
- **Ícone App**: 128x128px ou 256x256px
- **Logo Header**: 64x64px a 128x128px
- **Logo Grande**: 256x256px

## 🔧 Manutenção

### Adicionar Novos Logos
1. Adicione o arquivo na pasta da cor correspondente
2. Siga o padrão de nomenclatura: `ylada-quadrado-[cor]-[numero].png`
3. Atualize o `logos-config.js` se necessário

### Atualizar Configuração
- Edite `logos-config.js` para adicionar novos caminhos
- Mantenha a estrutura organizada por cor e formato

## 📋 Checklist de Implementação

- [x] Logos organizados por cor
- [x] Estrutura de pastas criada
- [x] Configuração JavaScript atualizada
- [x] Documentação completa
- [ ] Logo principal implementado no header
- [ ] Favicon configurado
- [ ] Componente React criado

---

**Última atualização**: Dezembro 2024  
**Versão**: 2.0  
**Status**: ✅ Organizado e Pronto para Uso

