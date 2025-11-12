# 🚀 GUIA CONSOLIDADO: Duplicação de Áreas (Wellness → Nutra, Nutri, Coach)

**Objetivo:** Documentar o processo completo de duplicação da área Wellness para outras áreas (Nutra, Nutri, Coach)  
**Base:** Área Wellness (completa e funcional)  
**Status:** ✅ Wellness completo | ⏳ Próximas: Nutra, Nutri, Coach

---

## 📋 SUMÁRIO EXECUTIVO

### **O que é Duplicação de Áreas?**
Criar uma nova área (Nutra, Nutri, Coach) baseada na estrutura completa da área Wellness, incluindo:
- ✅ Estrutura de pastas e arquivos
- ✅ Componentes específicos (NavBar, templates, etc.)
- ✅ Rotas e páginas
- ✅ Configurações de pagamento (Mercado Pago)
- ✅ Templates e diagnósticos
- ✅ Cores e branding

### **Princípio Fundamental:**
**Cada área é COMPLETAMENTE INDEPENDENTE:**
- ✅ Mesmas ferramentas disponíveis
- ✅ Diagnósticos separados por área
- ✅ Cores e personalizações por área
- ✅ Adicionar/remover ferramenta em uma área NÃO afeta outras
- ✅ Editar diagnóstico em uma área NÃO afeta outras

---

## 🏗️ 1. ESTRUTURA DE ARQUIVOS

### **1.1. Estrutura Base (Wellness como Referência)**

```
src/
├── app/
│   └── pt/
│       └── wellness/                    # ← ÁREA BASE (REFERÊNCIA)
│           ├── dashboard/
│           │   └── page.tsx
│           ├── checkout/
│           │   └── page.tsx
│           ├── login/
│           │   └── page.tsx
│           ├── ferramentas/
│           │   ├── page.tsx
│           │   ├── nova/
│           │   │   └── page.tsx
│           │   └── [id]/
│           │       └── editar/
│           │           └── page.tsx
│           ├── templates/
│           │   └── page.tsx
│           ├── portals/
│           │   ├── page.tsx
│           │   ├── novo/
│           │   │   └── page.tsx
│           │   └── [id]/
│           │       └── editar/
│           │           └── page.tsx
│           ├── cursos/
│           │   ├── page.tsx
│           │   └── [slug]/
│           │       └── page.tsx
│           ├── configuracao/
│           │   └── page.tsx
│           └── ...
│
├── components/
│   └── wellness/                        # ← COMPONENTES ESPECÍFICOS
│       ├── WellnessNavBar.tsx
│       ├── WellnessCTAButton.tsx
│       ├── WellnessHeader.tsx
│       └── WellnessLanding.tsx
│
├── lib/
│   └── diagnostics/
│       └── wellness/                     # ← DIAGNÓSTICOS ESPECÍFICOS
│           ├── checklist-alimentar.ts
│           ├── checklist-detox.ts
│           ├── calculadora-imc.ts
│           ├── calculadora-proteina.ts
│           └── ... (todos os templates)
│
└── app/api/
    └── wellness/                        # ← APIs ESPECÍFICAS
        ├── templates/
        │   └── route.ts
        ├── ferramentas/
        │   └── route.ts
        ├── checkout/
        │   └── route.ts
        └── subscription/
            └── route.ts
```

### **1.2. O que Duplicar para Nova Área (ex: Nutra)**

#### **Passo 1: Criar Estrutura de Pastas**
```bash
# Duplicar estrutura de pastas
src/app/pt/nutra/          # ← Nova área
src/components/nutra/       # ← Componentes específicos
src/lib/diagnostics/nutra/ # ← Diagnósticos específicos
src/app/api/nutra/         # ← APIs específicas
```

#### **Passo 2: Duplicar Arquivos**
- Copiar todos os arquivos de `wellness/` para `nutra/`
- Substituir referências:
  - `wellness` → `nutra`
  - `Wellness` → `Nutra`
  - `WELLNESS` → `NUTRA`
  - Cores: verde → laranja (ou cor específica da área)

---

## 🎨 2. PERSONALIZAÇÃO POR ÁREA

### **2.1. Cores e Branding**

```typescript
// src/lib/config/professions.ts (criar se não existir)
export const professionConfig = {
  nutri: {
    primaryColor: 'blue',
    secondaryColor: 'blue-600',
    accentColor: 'blue-400',
    gradient: 'from-blue-50 to-blue-100',
    logo: '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png'
  },
  wellness: {
    primaryColor: 'green',
    secondaryColor: 'green-600',
    accentColor: 'green-400',
    gradient: 'from-green-50 to-emerald-50',
    logo: '/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png'
  },
  coach: {
    primaryColor: 'purple',
    secondaryColor: 'purple-600',
    accentColor: 'purple-400',
    gradient: 'from-purple-50 to-pink-50',
    logo: '/images/logo/ylada/horizontal/roxo/ylada-horizontal-roxo.png' // (criar)
  },
  nutra: {
    primaryColor: 'orange',
    secondaryColor: 'orange-600',
    accentColor: 'orange-400',
    gradient: 'from-orange-50 to-amber-50',
    logo: '/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja.png' // (criar)
  }
}
```

### **2.2. NavBar por Área**

**Estrutura Base:**
```typescript
// src/components/nutra/NutraNavBar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function NutraNavBar({ 
  userName, 
  userBio 
}: { 
  userName?: string
  userBio?: string 
}) {
  const router = useRouter()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.push('/pt')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Nutra (laranja) */}
        <Link href="/pt/nutra/dashboard">
          <Image
            src="/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja.png"
            alt="YLADA Nutra"
            width={200}
            height={60}
            className="h-12"
          />
        </Link>

        {/* Links de navegação */}
        <nav className="flex items-center gap-6">
          <Link href="/pt/nutra/dashboard" className="text-gray-700 hover:text-orange-600">
            Nutra
          </Link>
          <Link href="/pt/nutra/configuracao" className="text-gray-700 hover:text-orange-600">
            Perfil
          </Link>
        </nav>

        {/* Usuário e Logout */}
        <div className="flex items-center gap-4">
          {userName && (
            <span className="text-sm text-gray-700">{userName}</span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
```

**Checklist NavBar:**
- [ ] Criar componente `[Area]NavBar.tsx`
- [ ] Ajustar logo (cor específica da área)
- [ ] Ajustar rotas (`/pt/[area]/*`)
- [ ] Ajustar cores de hover (cor específica da área)
- [ ] Ajustar links de navegação (dashboard e configurações da área)

---

## 💳 3. CONFIGURAÇÃO DE PAGAMENTO (MERCADO PAGO)

### **3.1. Planos por Área**

**Wellness (Referência):**
- Plano Mensal: R$ 59,90/mês
- Plano Anual: R$ 47,50/mês (R$ 570/ano)

**Para Duplicar:**
1. Acessar Mercado Pago Dashboard
2. Criar novos produtos para a nova área
3. Configurar preços específicos (se diferentes)
4. Atualizar variáveis de ambiente (se necessário)

### **3.2. Webhook**

**URL Base:**
```
https://ylada.com/api/webhooks/mercado-pago
```

**O webhook já está configurado para processar todas as áreas:**
- O código detecta a área via `external_reference` ou `metadata`
- Formato: `{area}_{planType}_{userId}`

**Não precisa configurar webhook separado por área!**

### **3.3. Variáveis de Ambiente**

**Já configuradas globalmente:**
```env
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_PUBLIC_KEY=...
MERCADOPAGO_WEBHOOK_SECRET=...
```

**Não precisa criar variáveis específicas por área!**

---

## 🗄️ 4. BANCO DE DADOS

### **4.1. Templates por Área**

**Estrutura da Tabela:**
```sql
templates_nutrition
├── id (UUID)
├── name (VARCHAR)              # Ex: "Checklist Alimentar"
├── type (VARCHAR)              # 'calculadora' | 'quiz' | 'planilha'
├── profession (VARCHAR)        # 'nutri' | 'wellness' | 'coach' | 'nutra'
├── language (VARCHAR)          # 'pt' | 'en' | 'es'
├── description (TEXT)
├── content (JSONB)
├── is_active (BOOLEAN)
└── ...
```

### **4.2. Duplicar Templates**

**Script SQL para Duplicar:**
```sql
-- Duplicar templates Wellness → Nutra
INSERT INTO templates_nutrition (
  name, 
  type, 
  profession, 
  language, 
  description,
  content,
  slug,
  is_active
)
SELECT 
  name,
  type,
  'nutra' as profession,  -- ← Nova área
  language,
  description,
  content,
  slug,
  is_active
FROM templates_nutrition
WHERE profession = 'wellness'
AND language = 'pt'
AND NOT EXISTS (
  SELECT 1 
  FROM templates_nutrition t2 
  WHERE t2.name = templates_nutrition.name 
  AND t2.profession = 'nutra'
  AND t2.language = templates_nutrition.language
);
```

**Resultado:**
- ✅ Cria registros com `profession='nutra'`
- ✅ Copia todos os campos
- ✅ Evita duplicatas (NOT EXISTS)
- ✅ Mantém `is_active` do original

### **4.3. Diagnósticos**

**Estrutura de Arquivos:**
```
src/lib/diagnostics/
├── nutri/
│   ├── checklist-alimentar.ts
│   ├── checklist-detox.ts
│   └── ...
├── wellness/                    # ← BASE (REFERÊNCIA)
│   ├── checklist-alimentar.ts
│   ├── checklist-detox.ts
│   └── ...
├── coach/
│   └── ... (copiar de wellness)
└── nutra/                       # ← NOVA ÁREA
    ├── checklist-alimentar.ts   # ← Copiar de wellness
    ├── checklist-detox.ts       # ← Copiar de wellness
    └── ... (copiar todos)
```

**Processo:**
1. Copiar todos os arquivos de `wellness/` para `nutra/`
2. Ajustar textos se necessário (personalização por área)
3. Manter estrutura e lógica idêntica

---

## 📝 5. CHECKLIST COMPLETO DE DUPLICAÇÃO

### **Fase 1: Estrutura de Pastas e Arquivos**
- [ ] Criar `src/app/pt/[area]/`
- [ ] Duplicar todas as pastas de `wellness/` para `[area]/`
- [ ] Criar `src/components/[area]/`
- [ ] Duplicar componentes de `wellness/` para `[area]/`
- [ ] Criar `src/lib/diagnostics/[area]/`
- [ ] Duplicar diagnósticos de `wellness/` para `[area]/`
- [ ] Criar `src/app/api/[area]/`
- [ ] Duplicar APIs de `wellness/` para `[area]/`

### **Fase 2: Substituições em Arquivos**
- [ ] Substituir `wellness` → `[area]` em todos os arquivos
- [ ] Substituir `Wellness` → `[Area]` em todos os arquivos
- [ ] Substituir `WELLNESS` → `[AREA]` em todos os arquivos
- [ ] Ajustar rotas (`/pt/wellness/` → `/pt/[area]/`)
- [ ] Ajustar imports (`@/components/wellness/` → `@/components/[area]/`)

### **Fase 3: Personalização Visual**
- [ ] Criar/ajustar NavBar com cores da área
- [ ] Ajustar logo (cor específica)
- [ ] Ajustar cores em todos os componentes
- [ ] Ajustar gradientes e temas
- [ ] Atualizar `professionConfig` (se existir)

### **Fase 4: Banco de Dados**
- [ ] Executar script SQL para duplicar templates
- [ ] Verificar templates criados
- [ ] Ativar templates (`is_active = true`)
- [ ] Testar carregamento de templates

### **Fase 5: Configuração de Pagamento**
- [ ] Criar produtos no Mercado Pago (se preços diferentes)
- [ ] Configurar planos mensal e anual
- [ ] Testar checkout
- [ ] Verificar webhook (já configurado globalmente)

### **Fase 6: Autenticação e Proteção**
- [ ] Verificar `ProtectedRoute` (já funciona para todas as áreas)
- [ ] Verificar `RequireSubscription` (já funciona para todas as áreas)
- [ ] Testar login e acesso ao dashboard
- [ ] Testar proteção de rotas

### **Fase 7: Testes**
- [ ] Testar dashboard
- [ ] Testar criação de ferramentas
- [ ] Testar templates
- [ ] Testar checkout
- [ ] Testar webhook de pagamento
- [ ] Testar em produção

---

## 🔄 6. PROCESSO PASSO A PASSO (NUTRA COMO EXEMPLO)

### **Passo 1: Preparação**
```bash
# 1. Criar estrutura de pastas
mkdir -p src/app/pt/nutra/{dashboard,checkout,login,ferramentas,templates,portals,cursos,configuracao}
mkdir -p src/components/nutra
mkdir -p src/lib/diagnostics/nutra
mkdir -p src/app/api/nutra/{templates,ferramentas,checkout,subscription}
```

### **Passo 2: Duplicar Arquivos**
```bash
# 2. Duplicar arquivos (exemplo com find e sed)
find src/app/pt/wellness -type f -exec cp {} src/app/pt/nutra/ \;
find src/components/wellness -type f -exec cp {} src/components/nutra/ \;
find src/lib/diagnostics/wellness -type f -exec cp {} src/lib/diagnostics/nutra/ \;
find src/app/api/wellness -type f -exec cp {} src/app/api/nutra/ \;
```

### **Passo 3: Substituir Referências**
```bash
# 3. Substituir referências (exemplo com sed)
find src/app/pt/nutra -type f -exec sed -i '' 's/wellness/nutra/g' {} \;
find src/app/pt/nutra -type f -exec sed -i '' 's/Wellness/Nutra/g' {} \;
find src/components/nutra -type f -exec sed -i '' 's/wellness/nutra/g' {} \;
find src/components/nutra -type f -exec sed -i '' 's/Wellness/Nutra/g' {} \;
```

### **Passo 4: Ajustar Cores**
- Abrir cada arquivo
- Substituir `green` → `orange`
- Substituir `green-600` → `orange-600`
- Substituir `emerald` → `amber`

### **Passo 5: Banco de Dados**
```sql
-- Executar script SQL de duplicação
-- (ver seção 4.2)
```

### **Passo 6: Testar**
- Testar localhost
- Testar produção
- Verificar todos os fluxos

---

## 📊 7. MATRIZ DE ISOLAMENTO

| Operação | Wellness | Nutri | Coach | Nutra |
|----------|----------|-------|-------|-------|
| Adicionar ferramenta | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |
| Remover ferramenta | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |
| Editar diagnóstico | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |
| Mudar cores | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |
| Desativar template | ✅ Só Wellness | ✅ Só Nutri | ✅ Só Coach | ✅ Só Nutra |

**Resultado:** ✅ **ZERO interferência entre áreas**

---

## 🎯 8. VANTAGENS DESTA ESTRUTURA

### **1. Isolamento Total**
- ✅ Mudança em Wellness = Zero impacto em outras áreas
- ✅ Teste em uma área não afeta produção em outras
- ✅ Rollback em uma área não afeta outras

### **2. Personalização Independente**
- ✅ Cores diferentes por área
- ✅ Textos adaptados por profissão
- ✅ Diagnósticos específicos por área
- ✅ Fluxos personalizados por área

### **3. Escalabilidade**
- ✅ Adicionar área = Copiar estrutura + Personalizar
- ✅ Adicionar ferramenta = Adicionar em todas as áreas (mas versões independentes)
- ✅ Adicionar idioma = Roteamento automático `[lang]/`

### **4. Manutenção Simples**
- ✅ Mudança em Wellness = Editar apenas arquivos Wellness
- ✅ Não precisa testar em outras áreas
- ✅ Fácil identificar onde está cada coisa

---

## 📚 9. REFERÊNCIAS

### **Documentos Relacionados:**
- `ESTRUTURA-DETALHADA-AREAS-INDEPENDENTES.md` ⭐ **PRINCIPAL**
- `DOCUMENTACAO-NAVBARS-POR-AREA.md`
- `ESTRUTURA-COMPLETA-SISTEMA.md`
- `REVIEW-ULTIMOS-2-DIAS-CONSOLIDADO.md`

### **Área Base (Referência):**
- **Wellness:** Completo e funcional
- **Localização:** `src/app/pt/wellness/`
- **Componentes:** `src/components/wellness/`
- **Diagnósticos:** `src/lib/diagnostics/wellness/`

---

## ✅ CONCLUSÃO

**Estrutura Proposta:**
- ✅ 4 áreas completamente independentes
- ✅ Mesmas ferramentas, versões separadas
- ✅ Diagnósticos separados por área
- ✅ Componentes independentes por área
- ✅ APIs filtradas por profissão
- ✅ Banco com registros separados por área

**Próximas Áreas:**
1. ⏳ **Nutra** (próxima)
2. ⏳ **Nutri** (depois)
3. ⏳ **Coach** (depois)

**Pronto para duplicação!** 🚀

---

**Última atualização:** Hoje  
**Versão:** 1.0.0

