# 🎨 YLADA LOGOS - INSTRUÇÕES DE USO

## ⚠️ **ATUALIZAÇÃO: ESTRUTURA REORGANIZADA**

Os logos foram **organizados automaticamente** e movidos para uma nova estrutura:

### 📁 **NOVA ESTRUTURA:**
```
public/images/logo/ylada/
├── quadrado/
│   ├── verde/           # 2 logos (cor principal)
│   ├── laranja/         # 4 logos
│   ├── vermelho/        # 2 logos
│   ├── roxo/           # 8 logos
│   └── azul-claro/     # 4 logos
├── logos-config.js      # Configuração atualizada
└── README.md           # Documentação completa
```

## 🎯 **LOGS IDENTIFICADOS E ORGANIZADOS:**

### ✅ **Status Atual:**
- [x] **20 logos organizados** por cor
- [x] **Formato:** Quadrado (1080x1080px)
- [x] **Cores disponíveis:** Verde, Laranja, Vermelho, Roxo, Azul Claro
- [x] **Formatos:** PNG e JPG de cada logo

### 🎨 **Detalhamento por Cor:**

#### 1. **Verde** (Cor Principal - 2 variações)
- `ylada-quadrado-verde-2.png` / `.jpg`
- `ylada-quadrado-verde-3.png` / `.jpg`
- **Uso:** Logo principal, favicon, ícones padrão

#### 2. **Laranja/Ouro** (4 variações)
- `ylada-quadrado-laranja-12.png` até `15.png`
- **Uso:** CTAs especiais, destaques

#### 3. **Vermelho** (2 variações)
- `ylada-quadrado-vermelho-16.png`, `17.png`
- **Uso:** Alertas, ações importantes

#### 4. **Roxo** (8 variações)
- `ylada-quadrado-roxo-18.png` até `25.png`
- **Uso:** Variações temáticas, fundos claros

#### 5. **Azul Claro** (4 variações)
- `ylada-quadrado-azul-claro-28.png` até `31.png`
- **Uso:** Dark mode, fundos escuros

## 🚀 **COMO USAR AGORA:**

### **Opção 1: Componente React (Recomendado)**
```jsx
import Logo from '@/components/Logo'

// Logo principal (verde)
<Logo cor="verde" tamanho="medio" />

// Logo roxo
<Logo cor="roxo" tamanho="grande" />

// Logo azul para dark mode
<Logo cor="azul-claro" tamanho="pequeno" />
```

### **Opção 2: Importar do Config**
```jsx
import { logos, getLogoPorCor } from '/images/logo/ylada/logos-config'

// Logo principal
<img src={logos.principal} alt="YLADA" />

// Logo por cor
<img src={getLogoPorCor('roxo')} alt="YLADA Roxo" />
```

### **Opção 3: Caminho Direto**
```jsx
import Image from 'next/image'

<Image 
  src="/images/logo/ylada/quadrado/verde/ylada-quadrado-verde-2.png"
  alt="YLADA Logo"
  width={128}
  height={128}
/>
```

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO:**

### ✅ **CONCLUÍDO:**
- [x] Logos organizados automaticamente
- [x] Estrutura de pastas criada
- [x] Configuração JavaScript atualizada
- [x] Componente React criado
- [x] Documentação completa atualizada

### 🔄 **PRÓXIMOS PASSOS:**
- [ ] Implementar logo principal no header do site
- [ ] Configurar favicon (usar logo verde)
- [ ] Adicionar logo em páginas institucionais
- [ ] Criar versão horizontal (se necessário no futuro)

## 🎨 **CORES OFICIAIS:**

### **Cores Identificadas nos Logos:**
- 🟢 **Verde Principal:** #10B981 (cor oficial da marca)
- 🟠 **Laranja:** #F97316
- 🔴 **Vermelho:** #EF4444
- 🟣 **Roxo:** #A855F7
- 🔵 **Azul Claro:** #60A5FA

### **Cores Complementares:**
- **Verde Escuro:** #059669  
- **Verde Claro:** #6EE7B7
- **Cinza Escuro:** #374151
- **Cinza Médio:** #6B7280
- **Branco:** #FFFFFF

## ⚠️ **IMPORTANTE:**

1. **Use o componente `<Logo />`** para facilitar a troca de cores
2. **Logo verde** é o padrão principal da marca
3. **Todos os logos são quadrados** (1080x1080px originais)
4. **PNG recomendado** para transparência
5. **Arquivos originais preservados** em `/public/logos/` (backup)

## 📖 **DOCUMENTAÇÃO COMPLETA:**

Consulte: `/public/images/logo/ylada/README.md`

---

**Status**: ✅ Logos organizados e prontos para uso  
**Última atualização**: Dezembro 2024
