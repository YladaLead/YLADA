# 🎨 YLADA LOGOS - INSTRUÇÕES DE USO

## 📁 ESTRUTURA CRIADA:

```
public/logos/
├── 📄 README.md                           # Documentação completa
├── ⚙️ logos-config.js                     # Configuração para importar
├── 🖼️ ylada-logo-horizontal.png          # Logo principal horizontal
├── 🖼️ ylada-logo-horizontal-white.png     # Logo horizontal (fundo escuro)
├── 🖼️ ylada-logo-vertical.png            # Logo vertical
├── 🖼️ ylada-icon.png                     # Apenas ícone
├── 🖼️ ylada-favicon-16.png               # Favicon 16x16px
└── 🖼️ ylada-favicon-32.png               # Favicon 32x32px
```

## 🚀 COMO USAR:

### 1. **SUBSTITUIR OS PLACEHOLDERS:**
- **Extraia os logos** das imagens que você forneceu
- **Salve com os nomes exatos** listados acima
- **Substitua os arquivos placeholder** na pasta `public/logos/`

### 2. **USAR NO SITE:**

#### **HTML Direto:**
```html
<img src="/logos/ylada-logo-horizontal.png" alt="YLADA Logo" />
```

#### **React/Next.js:**
```jsx
import Image from 'next/image'

<Image 
  src="/logos/ylada-logo-horizontal.png" 
  alt="YLADA Logo" 
  width={400} 
  height={120} 
/>
```

#### **Usando o Config:**
```jsx
import { logos } from '/public/logos/logos-config.js'

<img src={logos.horizontal} alt="YLADA Logo" />
```

### 3. **FAVICON:**
- **Já configurado:** `public/favicon.ico`
- **Adicione no HTML:**
```html
<link rel="icon" type="image/png" sizes="32x32" href="/logos/ylada-favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/logos/ylada-favicon-16.png">
```

## 📋 CHECKLIST DE IMPLEMENTAÇÃO:

### ✅ **ARQUIVOS CRIADOS:**
- [x] Estrutura de pastas
- [x] Arquivos placeholder
- [x] Configuração JavaScript
- [x] Documentação completa
- [x] Favicon configurado

### 🔄 **PRÓXIMOS PASSOS:**
- [ ] **Extrair logos reais** das imagens fornecidas
- [ ] **Substituir placeholders** pelos logos reais
- [ ] **Testar em diferentes tamanhos**
- [ ] **Verificar qualidade** em diferentes resoluções
- [ ] **Implementar no site** usando os caminhos corretos

## 🎯 **LOGS IDENTIFICADOS NAS IMAGENS:**

### **1. Logo Horizontal Completo:**
- **Ícone verde** (pessoa + gráfico de crescimento)
- **Texto "YLADA"** em cinza escuro
- **Tagline "Your Lead Accelerated Data App"**

### **2. Ícone Simples:**
- **Apenas o ícone verde** (pessoa + gráfico)
- **Sem texto**
- **Ideal para favicons e ícones**

### **3. Logo Vertical:**
- **Ícone em cima**
- **Texto embaixo**
- **Ideal para mobile e cards**

## ⚠️ **IMPORTANTE:**

1. **Mantenha os nomes exatos** dos arquivos
2. **Use PNG com transparência** para web
3. **Teste em diferentes tamanhos** antes de usar
4. **Verifique a qualidade** em alta resolução
5. **Backup dos originais** antes de redimensionar

## 🎨 **CORES OFICIAIS:**
- **Verde Principal:** #10B981
- **Verde Escuro:** #059669  
- **Verde Claro:** #6EE7B7
- **Cinza Escuro:** #374151
- **Cinza Médio:** #6B7280
- **Branco:** #FFFFFF

**Tudo pronto para você substituir pelos logos reais!** 🚀✨
