# 📍 LOCAIS ONDE SUBSTITUIR O LOGOTIPO NUTRI

## 🎯 **LOGO HORIZONTAL (NavBar e Páginas)**

### **Arquivo atual usado:**
`/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png`

### **Locais para substituir:**

#### **1. Componente NavBar (Principal)**
📁 `src/components/nutri/NutriNavBar.tsx`
- **Linha 30**: Logo horizontal na barra de navegação
- **Substituir por**: Seu novo logo horizontal PNG

#### **2. Páginas da Área Nutri**
📁 `src/app/pt/nutri/ferramentas/templates/page.tsx`
- **Linha 236**: Logo na página de templates

📁 `src/app/pt/nutri/ferramentas/nova/page.tsx`
- **Linha 1027**: Logo na página de criar ferramenta

📁 `src/app/pt/nutri/relatorios/page.tsx`
- **Linha 84**: Logo na página de relatórios

📁 `src/app/pt/nutri/suporte/page.tsx`
- **Linha 130**: Logo na página de suporte

📁 `src/app/pt/nutri/quiz-personalizado/page.tsx`
- **Linha 442**: Logo na página de quiz personalizado

📁 `src/app/pt/nutri/cursos/page.tsx`
- **Linha 95**: Logo na página de cursos

---

## 🎯 **LOGO QUADRADO (PWA - Ícone do App)**

### **Arquivo atual usado:**
`/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png`

### **Locais para substituir:**

#### **1. Layout da Área Nutri (PWA)**
📁 `src/app/pt/nutri/layout.tsx`
- **Linha 7**: `icon` - Ícone do navegador
- **Linha 8**: `apple` - Ícone para iOS (Apple Touch Icon)
- **Substituir por**: Seu novo logo quadrado PNG

#### **2. Manifest PWA (Add to Home Screen)**
📁 `public/manifest-nutri.json`
- **Linha 11**: Ícone 192x192
- **Linha 16**: Ícone 512x512
- **Substituir por**: Seu novo logo quadrado PNG

---

## 📝 **INSTRUÇÕES PARA SUBSTITUIÇÃO**

### **Opção 1: Substituir os arquivos existentes**
1. Substitua os arquivos PNG diretamente em:
   - `public/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png`
   - `public/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png`

### **Opção 2: Usar novos nomes de arquivo**
1. Coloque seus novos logos em `public/images/logo/ylada/`
2. Me informe os novos nomes dos arquivos
3. Eu atualizo todos os caminhos no código

---

## ✅ **CHECKLIST DE SUBSTITUIÇÃO**

- [ ] Logo horizontal na NavBar (`NutriNavBar.tsx`)
- [ ] Logo horizontal em 6 páginas Nutri
- [ ] Logo quadrado no Layout (`layout.tsx`)
- [ ] Logo quadrado no Manifest (`manifest-nutri.json`)

---

## 🔍 **OBSERVAÇÕES**

- **Logo Horizontal**: Usado na navegação e cabeçalhos das páginas
- **Logo Quadrado**: Usado como ícone do app quando adicionado à tela inicial (PWA)
- Todos os arquivos são PNG
- Mantenha os mesmos nomes ou me informe os novos para atualizar os caminhos



