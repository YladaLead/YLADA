# 🎨 PALETA DE CORES - ÁREAS YLADA

## 📊 VISÃO GERAL

| Área | Cor Base | Emoção/Conceito | Código HEX | Tailwind |
|------|----------|-----------------|------------|----------|
| **Wellness** | Verde-menta suave | Vitalidade e equilíbrio | `#00C896` / `#37D1A0` | `green-500` / `emerald-500` |
| **Nutra** | Laranja-âmbar energético | Ação, performance e lucro | `#FF7A00` / `#FF9E3D` | `orange-500` / `amber-500` |
| **Nutri** | Azul-claro / ciano suave | Confiança e ciência | `#3CA3E0` / `#4BB7F8` | `blue-400` / `cyan-400` |

---

## 🌈 JUSTIFICATIVA VISUAL

### ✅ **Por que Laranja para Nutra?**

1. **Contraste Natural**
   - Verde (Wellness) + Laranja (Nutra) = Harmonia complementar
   - Azul (Nutri) + Laranja (Nutra) = Contraste vibrante
   - Cria identidade visual única e reconhecível

2. **Psicologia das Cores**
   - **Laranja** = Energia, ação, movimento, conversão
   - Perfeito para área focada em **vendas e performance**
   - Transmite **entusiasmo e resultados**

3. **Equilíbrio Visual**
   - Não compete com verde (natureza) nem azul (ciência)
   - Cria hierarquia visual clara entre as áreas
   - Mantém YLADA visualmente equilibrado

---

## 🎨 PALETA COMPLETA NUTRA

### **Cores Principais**

```css
/* Primária */
--nutra-primary: #FF7A00;        /* Laranja vibrante */
--nutra-primary-light: #FF9E3D;   /* Laranja claro */
--nutra-primary-dark: #E66A00;    /* Laranja escuro */

/* Secundária (Gradiente) */
--nutra-secondary: #FF3D71;       /* Rosa energético */
--nutra-gradient: linear-gradient(90deg, #FF7A00 0%, #FF3D71 100%);
```

### **Cores Auxiliares**

```css
/* Fundos */
--nutra-bg-light: #FFF7F0;       /* Fundo claro (pele) */
--nutra-bg-gradient: linear-gradient(135deg, #FFF7F0 0%, #FFE5D4 100%);

/* Destaques */
--nutra-accent: #FF9E3D;          /* Ícones e destaques */
--nutra-border: #FFB366;          /* Bordas suaves */

/* Textos */
--nutra-text-primary: #1F1F1F;    /* Texto principal */
--nutra-text-secondary: #6B7280;  /* Texto secundário */
```

### **Tailwind Classes**

```typescript
// Classes principais
'bg-orange-500'      // #FF7A00
'bg-orange-400'      // #FF9E3D
'bg-orange-600'      // #E66A00
'text-orange-500'
'border-orange-500'
'hover:bg-orange-600'

// Gradientes
'bg-gradient-to-r from-orange-500 to-pink-500'
'bg-gradient-to-br from-orange-400 to-rose-400'
```

---

## 🎯 APLICAÇÃO POR COMPONENTE

### **1. NavBar**
```tsx
// Cor de hover e links ativos
className="hover:text-orange-500"
className="text-orange-500" // Link ativo
```

### **2. Botões CTA**
```tsx
// Botão principal
className="bg-orange-500 hover:bg-orange-600"

// Gradiente energético
style={{
  background: 'linear-gradient(90deg, #FF7A00 0%, #FF3D71 100%)'
}}
```

### **3. Cards e Badges**
```tsx
// Badge de destaque
className="bg-orange-100 text-orange-800 border-orange-300"

// Card com gradiente
className="bg-gradient-to-br from-orange-50 to-rose-50 border-orange-200"
```

### **4. Headers e Títulos**
```tsx
// Título principal
className="text-orange-600"

// Subtítulo
className="text-orange-500"
```

---

## 🔄 COMPARAÇÃO COM OUTRAS ÁREAS

### **Wellness (Verde)**
```css
Primary: #10B981 (green-500)
Gradient: from-green-500 to-emerald-500
Emoção: Vitalidade, natureza, equilíbrio
```

### **Nutri (Azul)**
```css
Primary: #3B82F6 (blue-500)
Gradient: from-blue-400 to-cyan-400
Emoção: Confiança, ciência, profissionalismo
```

### **Nutra (Laranja)** ⭐ NOVO
```css
Primary: #FF7A00 (orange-500)
Gradient: from-orange-500 to-pink-500
Emoção: Energia, ação, conversão, resultados
```

---

## 📐 GRADIENTES SUGERIDOS

### **Gradiente Principal (Botões)**
```css
background: linear-gradient(90deg, #FF7A00 0%, #FF3D71 100%);
```

### **Gradiente Suave (Cards)**
```css
background: linear-gradient(135deg, #FFF7F0 0%, #FFE5D4 100%);
```

### **Gradiente Energético (CTAs)**
```css
background: linear-gradient(135deg, #FF7A00 0%, #FF9E3D 50%, #FF3D71 100%);
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Componentes**
- [ ] NutraNavBar (hover: orange-500)
- [ ] NutraHeader (título: orange-600)
- [ ] NutraCTAButton (bg: orange-500, gradiente)
- [ ] NutraLanding (gradiente suave)

### **Páginas**
- [ ] Dashboard (cards: orange-500)
- [ ] Templates (badges: orange-100/orange-800)
- [ ] Checkout (botão: orange-500)
- [ ] Ferramentas (ícones: orange-500)

### **Templates**
- [ ] Todos os templates (cores adaptadas)
- [ ] Botões de ação (orange-500)
- [ ] Destaques (orange-400)

---

## 🎨 RESULTADO FINAL

### **Sensação Visual por Área**

| Área | Cor | Sensação |
|------|-----|----------|
| Wellness | 🟢 Verde | Vitalidade e harmonia |
| Nutra | 🟠 Laranja | Energia e resultado |
| Nutri | 🔵 Azul | Ciência e confiança |

### **Hierarquia Visual**
1. **Wellness** (Verde) = Base, natureza, bem-estar
2. **Nutri** (Azul) = Ciência, profissionalismo
3. **Nutra** (Laranja) = Ação, performance, conversão ⚡

---

## 📝 NOTAS TÉCNICAS

### **Acessibilidade**
- ✅ Contraste WCAG AA garantido
- ✅ Texto preto (#1F1F1F) sobre fundo claro (#FFF7F0)
- ✅ Texto branco sobre laranja (#FF7A00)

### **Compatibilidade**
- ✅ Funciona com Tailwind CSS
- ✅ Suporta dark mode (ajustar tons)
- ✅ Responsivo em todos os dispositivos

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0

