# 📋 DOCUMENTAÇÃO: NAVBARS POR ÁREA - YLADA

## 🎯 **OBJETIVO**
Manter componentes de navegação independentes por área para evitar conflitos futuros e facilitar manutenção.

---

## 📊 **ESTRUTURA ATUAL**

### **1. NUTRI NAVBAR**
- **Localização:** `src/components/nutri/NutriNavBar.tsx`
- **Responsabilidade:** Barra de navegação para área do Nutricionista
- **Funcionalidades:**
  - Logo YLADA (azul-claro) com link para `/pt/nutri/dashboard`
  - Título opcional (configurável)
  - Links de navegação: "Nutri" → Dashboard, "Perfil" → Configurações
  - Botão "Sair" com logout
  - Cor de hover: `hover:text-blue-600`
- **Usado em:**
  - `/pt/nutri/dashboard`
  - `/pt/nutri/configuracoes`
  - `/pt/nutri/leads`

### **2. WELLNESS NAVBAR**
- **Localização:** `src/components/wellness/WellnessNavBar.tsx`
- **Responsabilidade:** Barra de navegação para área do Distribuidor Wellness
- **Funcionalidades:**
  - Logo YLADA (verde) com link para `/pt/wellness/dashboard`
  - Título opcional (configurável)
  - Links de navegação: "Wellness" → Dashboard, "Perfil" → Configurações
  - Botão "Sair" com logout
  - Cor de hover: `hover:text-green-600`
- **Usado em:**
  - `/pt/wellness/dashboard`
  - `/pt/wellness/configuracao`
  - (Outras páginas Wellness conforme necessário)

### **3. NUTRI COACH NAVBAR** (FUTURO)
- **Localização:** `src/components/nutri-coach/NutriCoachNavBar.tsx` (a criar)
- **Responsabilidade:** Barra de navegação para área do Nutri Coach
- **Status:** ⏳ Pendente - Será criado quando área Nutri Coach for implementada

---

## 🎨 **DIFERENÇAS VISUAIS**

### **Cores por Área:**
- **Nutri:** Azul (`blue-600`) - Logo azul-claro
- **Wellness:** Verde (`green-600`) - Logo verde
- **Nutri Coach:** (A definir quando implementar)

### **Rotas por Área:**
- **Nutri:** `/pt/nutri/*`
- **Wellness:** `/pt/wellness/*`
- **Nutri Coach:** `/pt/nutri-coach/*` (a definir)

---

## 📝 **PADRÃO DE IMPLEMENTAÇÃO**

### **1. Estrutura do Componente:**
```typescript
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface [Area]NavBarProps {
  showTitle?: boolean
  title?: string
}

export default function [Area]NavBar({ showTitle = false, title }: [Area]NavBarProps) {
  const router = useRouter()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.push('/pt')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Conteúdo específico da área */}
    </header>
  )
}
```

### **2. Importação:**
```typescript
import [Area]NavBar from '@/components/[area]/[Area]NavBar'
```

### **3. Uso:**
```typescript
<[Area]NavBar showTitle={true} title="Título da Página" />
```

---

## ✅ **CHECKLIST PARA NOVA ÁREA**

Quando criar uma nova área (ex: Nutri Coach):

- [ ] Criar componente `[Area]NavBar.tsx` em `src/components/[area]/`
- [ ] Ajustar logo (cor específica da área)
- [ ] Ajustar rotas (`/pt/[area]/*`)
- [ ] Ajustar cores de hover (cor específica da área)
- [ ] Ajustar links de navegação (dashboard e configurações da área)
- [ ] Documentar neste arquivo
- [ ] Atualizar todas as páginas da área para usar o novo componente

---

## 🔄 **MIGRAÇÃO REALIZADA**

### **Wellness (2024-12-XX):**
- ✅ Criado `WellnessNavBar.tsx` independente
- ✅ Atualizado para usar logo verde
- ✅ Rotas ajustadas para `/pt/wellness/*`
- ✅ Cores ajustadas para verde (`green-600`)
- ⏳ Pendente: Atualizar páginas Wellness que ainda usam NutriNavBar

### **Páginas a Atualizar:**
- [ ] Verificar se há páginas Wellness usando `NutriNavBar`
- [ ] Substituir por `WellnessNavBar` onde necessário

---

## 📚 **REFERÊNCIAS**

- **NutriNavBar:** `src/components/nutri/NutriNavBar.tsx`
- **WellnessNavBar:** `src/components/wellness/WellnessNavBar.tsx`
- **Nutri Coach NavBar:** (A criar)

---

**Última atualização:** 2024-12-XX
**Versão:** 1.0.0

