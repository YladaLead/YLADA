# 📊 GUIA CONSOLIDADO: Coleta de Dados e Duplicação de Áreas

**Objetivo:** Guia prático para duplicar templates da Wellness para outras áreas (Nutri, Nutra, Coach) com foco em COLETA DE DADOS  
**Base:** Área Wellness (completa e funcional)  
**Foco Principal:** Captura de leads e informações do usuário  
**Status:** ✅ Wellness completo | ⏳ Próximas: Nutri, Nutra, Coach

---

## 📋 ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Princípio Fundamental: Coleta de Dados](#2-princípio-fundamental-coleta-de-dados)
3. [Duplicação de Templates](#3-duplicação-de-templates)
4. [Adaptação de Diagnósticos](#4-adaptação-de-diagnósticos)
5. [Sistema de Coleta de Dados](#5-sistema-de-coleta-de-dados)
6. [Checklist Rápido de Duplicação](#6-checklist-rápido-de-duplicação)
7. [Exemplos Práticos](#7-exemplos-práticos)

---

## 1. VISÃO GERAL

### **1.1. Estratégia de Duplicação**

**Base:** Área Wellness (completa e funcional)

**Processo:**
1. ✅ **Templates:** Usar os mesmos templates da Wellness
2. ✅ **Diagnósticos:** Adaptar diagnósticos existentes por área
3. ✅ **Coleta de Dados:** Foco principal em capturar leads e informações

**Resultado:**
- Mesmas ferramentas disponíveis em todas as áreas
- Diagnósticos personalizados por profissão
- Sistema unificado de coleta de dados

---

## 2. PRINCÍPIO FUNDAMENTAL: COLETA DE DADOS

### **2.1. Objetivo Principal**

**Em TODAS as áreas (Wellness, Nutri, Nutra, Coach), o foco é:**

✅ **COLETAR DADOS** para fornecer aos usuários:
- Nome completo
- E-mail
- Telefone/WhatsApp
- Dados adicionais do formulário (respostas do quiz, calculadora, etc.)
- IP e User Agent (para analytics)
- Origem (qual template/ferramenta gerou o lead)

### **2.2. Fluxo de Coleta**

```
1. Usuário preenche template/ferramenta
   ↓
2. Sistema coleta dados do formulário
   ↓
3. Dados são salvos na tabela `leads`
   ↓
4. Lead é associado ao usuário (profissional)
   ↓
5. Profissional acessa seus leads no dashboard
```

### **2.3. Estrutura de Dados Coletados**

**Tabela `leads`:**
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  link_id UUID REFERENCES generated_links(id),
  user_id UUID REFERENCES users(id),  -- Profissional que criou o link
  name VARCHAR(255) NOT NULL,          -- Nome do lead
  email VARCHAR(255),                  -- E-mail do lead
  phone VARCHAR(20),                   -- Telefone do lead
  additional_data JSONB,               -- Dados extras (respostas, etc.)
  source VARCHAR(50),                 -- Origem (template, quiz, etc.)
  ip_address INET,                    -- IP do lead
  user_agent TEXT,                    -- Navegador do lead
  created_at TIMESTAMP
);
```

**Campo `additional_data` (JSONB):**
```json
{
  "respostas": {
    "pergunta1": "resposta1",
    "pergunta2": "resposta2"
  },
  "resultado": "resultado_calculado",
  "pontuacao": 15,
  "categoria": "alto_risco"
}
```

---

## 3. DUPLICAÇÃO DE TEMPLATES

### **3.1. Processo Simplificado**

**Passo 1: Duplicar Templates no Banco**

```sql
-- Duplicar templates Wellness → Nutri
INSERT INTO templates_nutrition (
  name, 
  type, 
  profession,      -- ← Mudar para 'nutri'
  language, 
  description,
  content,          -- ← Mesmo conteúdo JSONB
  slug,
  is_active
)
SELECT 
  name,
  type,
  'nutri' as profession,  -- ← NOVA ÁREA
  language,
  description,
  content,                -- ← MESMO CONTEÚDO
  slug,
  is_active
FROM templates_nutrition
WHERE profession = 'wellness'
AND language = 'pt'
AND NOT EXISTS (
  SELECT 1 
  FROM templates_nutrition t2 
  WHERE t2.name = templates_nutrition.name 
  AND t2.profession = 'nutri'
);
```

**Resultado:**
- ✅ Templates duplicados com `profession='nutri'`
- ✅ Mesmo `content` JSONB (estrutura idêntica)
- ✅ Mesmo `slug` (pode ser usado em todas as áreas)

---

### **3.2. O Que NÃO Precisa Duplicar**

**✅ Já Funciona Globalmente:**
- Sistema de coleta de dados (`/api/leads`)
- APIs de templates (`/api/[area]/templates`)
- Sistema de pagamento (Mercado Pago/Stripe)
- Autenticação e proteção de rotas
- Preview dinâmico de templates

**❌ O Que Precisa Adaptar:**
- Diagnósticos (textos específicos por área)
- Cores e branding (visual por área)
- NavBar e componentes visuais

---

### **3.3. Templates Compartilhados**

**Estrutura:**
```
Templates no Banco:
├── Template "Quiz Interativo"
│   ├── profession='wellness' → Diagnóstico Wellness
│   ├── profession='nutri'     → Diagnóstico Nutri
│   ├── profession='nutra'     → Diagnóstico Nutra
│   └── profession='coach'    → Diagnóstico Coach
│
└── Mesmo content JSONB para todas as áreas
```

**Vantagem:**
- ✅ Um único template serve todas as áreas
- ✅ Apenas diagnósticos mudam por área
- ✅ Coleta de dados funciona igual em todas

---

## 4. ADAPTAÇÃO DE DIAGNÓSTICOS

### **4.1. Estrutura de Diagnósticos**

**Localização:**
```
src/lib/diagnostics/
├── wellness/              # ← BASE (REFERÊNCIA)
│   ├── quiz-interativo.ts
│   ├── checklist-alimentar.ts
│   └── ...
├── nutri/                 # ← ADAPTAR DE WELLNESS
│   ├── quiz-interativo.ts
│   ├── checklist-alimentar.ts
│   └── ...
├── nutra/                 # ← ADAPTAR DE WELLNESS
│   └── ...
└── coach/                 # ← ADAPTAR DE WELLNESS
    └── ...
```

### **4.2. Processo de Adaptação**

**Passo 1: Copiar Diagnóstico de Wellness**

```typescript
// src/lib/diagnostics/wellness/quiz-interativo.ts
export const quizInterativoDiagnosticos = {
  wellness: {
    resultado1: {
      diagnostico: "Diagnóstico Wellness...",
      causaRaiz: "Causa raiz Wellness...",
      acaoImediata: "Ação Wellness...",
      // ...
    }
  }
}
```

**Passo 2: Adaptar para Nutri**

```typescript
// src/lib/diagnostics/nutri/quiz-interativo.ts
export const quizInterativoDiagnosticos = {
  nutri: {
    resultado1: {
      diagnostico: "Diagnóstico Nutri...",  // ← Adaptar texto
      causaRaiz: "Causa raiz Nutri...",     // ← Adaptar texto
      acaoImediata: "Ação Nutri...",         // ← Adaptar texto
      // ...
    }
  }
}
```

**⚠️ IMPORTANTE:**
- ✅ Manter mesma estrutura (6 dicas essenciais)
- ✅ Adaptar textos para linguagem da profissão
- ✅ Manter lógica de pontuação/cálculo idêntica

---

### **4.3. Função de Busca Automática**

**Localização:** `src/lib/diagnostics/index.ts`

```typescript
export function getDiagnostico(
  templateSlug: string,
  profession: 'wellness' | 'nutri' | 'nutra' | 'coach'
) {
  // Busca diagnóstico específico da área
  const diagnosticos = require(`./${profession}/${templateSlug}`)
  return diagnosticos[`${templateSlug}Diagnosticos`][profession]
}
```

**Uso:**
```typescript
import { getDiagnostico } from '@/lib/diagnostics'

// Busca automaticamente diagnóstico da área correta
const diagnostico = getDiagnostico('quiz-interativo', 'nutri')
```

---

## 5. SISTEMA DE COLETA DE DADOS

### **5.1. API de Coleta**

**Endpoint:** `POST /api/leads`

**Request:**
```json
{
  "slug": "link-slug-do-usuario",
  "name": "Nome do Lead",
  "email": "lead@email.com",
  "phone": "+5511999999999",
  "additionalData": {
    "respostas": {
      "pergunta1": "resposta1",
      "pergunta2": "resposta2"
    },
    "resultado": "alto_risco",
    "pontuacao": 15
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leadId": "uuid",
    "message": "Lead capturado com sucesso!"
  }
}
```

---

### **5.2. Integração nos Templates**

**Exemplo: Quiz Interativo**

```typescript
// Ao finalizar quiz, coletar dados
const handleFinalizar = async () => {
  // 1. Calcular resultado
  const resultado = calcularResultado(respostas)
  
  // 2. Coletar dados do usuário
  const dadosLead = {
    slug: linkSlug,  // Slug do link gerado
    name: nomeUsuario,
    email: emailUsuario,
    phone: telefoneUsuario,
    additionalData: {
      respostas: respostas,
      resultado: resultado,
      pontuacao: pontuacaoTotal
    }
  }
  
  // 3. Enviar para API
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosLead)
  })
  
  // 4. Mostrar resultado
  setEtapa('resultado')
}
```

---

### **5.3. Formulário de Coleta**

**Componente Reutilizável:**

```typescript
// src/components/shared/LeadCaptureForm.tsx
export function LeadCaptureForm({ 
  onCapture, 
  requiredFields = ['name', 'email'] 
}: {
  onCapture: (data: LeadData) => void
  requiredFields?: string[]
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onCapture(formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome completo"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required={requiredFields.includes('name')}
      />
      <input
        type="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required={requiredFields.includes('email')}
      />
      <input
        type="tel"
        placeholder="Telefone/WhatsApp"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required={requiredFields.includes('phone')}
      />
      <button type="submit">Ver Resultado</button>
    </form>
  )
}
```

**Uso:**
```typescript
<LeadCaptureForm
  onCapture={async (data) => {
    await capturarLead({
      ...data,
      slug: linkSlug,
      additionalData: { respostas, resultado }
    })
    setEtapa('resultado')
  }}
  requiredFields={['name', 'email']}
/>
```

---

### **5.4. Visualização de Leads**

**Dashboard do Profissional:**

```typescript
// src/app/pt/[area]/leads/page.tsx
export default function LeadsPage() {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  
  useEffect(() => {
    // Buscar leads do usuário
    fetch(`/api/leads?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => setLeads(data.leads))
  }, [user])
  
  return (
    <div>
      <h1>Meus Leads</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Data</th>
            <th>Origem</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{new Date(lead.created_at).toLocaleDateString()}</td>
              <td>{lead.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## 6. CHECKLIST RÁPIDO DE DUPLICAÇÃO

### **6.1. Para Área Nutri (Exemplo)**

#### **Fase 1: Banco de Dados (5 minutos)**
- [ ] Executar SQL para duplicar templates (`profession='nutri'`)
- [ ] Verificar templates criados
- [ ] Ativar templates (`is_active = true`)

#### **Fase 2: Diagnósticos (30 minutos)**
- [ ] Copiar diagnósticos de `wellness/` para `nutri/`
- [ ] Adaptar textos para linguagem de nutricionista
- [ ] Manter estrutura (6 dicas essenciais)
- [ ] Testar busca de diagnósticos

#### **Fase 3: Componentes Visuais (20 minutos)**
- [ ] Criar `NutriNavBar.tsx` (copiar de Wellness)
- [ ] Ajustar cores (verde → azul)
- [ ] Ajustar logo
- [ ] Ajustar rotas (`/pt/nutri/`)

#### **Fase 4: Coleta de Dados (Já Funciona!)**
- [x] API `/api/leads` já funciona para todas as áreas
- [x] Sistema de coleta já integrado
- [x] Dashboard de leads já funciona

#### **Fase 5: Testes (15 minutos)**
- [ ] Testar templates carregando
- [ ] Testar diagnósticos aparecendo
- [ ] Testar coleta de dados funcionando
- [ ] Testar leads aparecendo no dashboard

**Tempo Total Estimado: ~70 minutos**

---

### **6.2. Para Áreas Nutra e Coach**

**Mesmo processo, apenas:**
- Mudar `profession='nutra'` ou `profession='coach'`
- Adaptar cores (laranja para Nutra, roxo para Coach)
- Adaptar textos de diagnósticos

---

## 7. EXEMPLOS PRÁTICOS

### **7.1. Exemplo 1: Duplicar Quiz Interativo para Nutri**

**Passo 1: Duplicar no Banco**
```sql
INSERT INTO templates_nutrition (
  name, type, profession, language, description, content, slug, is_active
)
SELECT 
  name, type, 'nutri', language, description, content, slug, is_active
FROM templates_nutrition
WHERE slug = 'quiz-interativo' AND profession = 'wellness';
```

**Passo 2: Copiar Diagnóstico**
```bash
# Copiar arquivo
cp src/lib/diagnostics/wellness/quiz-interativo.ts \
   src/lib/diagnostics/nutri/quiz-interativo.ts
```

**Passo 3: Adaptar Textos**
```typescript
// src/lib/diagnostics/nutri/quiz-interativo.ts
export const quizInterativoDiagnosticos = {
  nutri: {
    resultado1: {
      diagnostico: "Como nutricionista, identifiquei que você precisa de atenção especial...",
      causaRaiz: "A causa raiz nutricional é...",
      acaoImediata: "Como profissional de nutrição, recomendo...",
      // ...
    }
  }
}
```

**Resultado:**
- ✅ Template disponível em Nutri
- ✅ Diagnóstico específico de nutricionista
- ✅ Coleta de dados funcionando automaticamente

---

### **7.2. Exemplo 2: Coleta de Dados em Calculadora**

**Template:** Calculadora de IMC

```typescript
const handleCalcular = async () => {
  // 1. Calcular IMC
  const imc = peso / (altura / 100) ** 2
  const categoria = categorizarIMC(imc)
  
  // 2. Coletar dados
  const dadosLead = {
    slug: linkSlug,
    name: nomeUsuario,
    email: emailUsuario,
    phone: telefoneUsuario,
    additionalData: {
      peso: peso,
      altura: altura,
      imc: imc,
      categoria: categoria
    }
  }
  
  // 3. Enviar para API
  await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosLead)
  })
  
  // 4. Mostrar resultado
  setResultado({ imc, categoria })
}
```

**Resultado:**
- ✅ Lead capturado com dados completos
- ✅ Profissional vê peso, altura, IMC e categoria
- ✅ Pode fazer follow-up personalizado

---

### **7.3. Exemplo 3: Dashboard de Leads**

**Visualização:**
```
┌─────────────────────────────────────────────────┐
│ Meus Leads (Nutri)                               │
├─────────────────────────────────────────────────┤
│ Nome          │ E-mail        │ IMC  │ Data     │
├─────────────────────────────────────────────────┤
│ João Silva    │ joao@...      │ 28.5 │ 01/01/24 │
│ Maria Santos  │ maria@...      │ 22.3 │ 02/01/24 │
└─────────────────────────────────────────────────┘
```

**Detalhes do Lead:**
```
┌─────────────────────────────────────────────────┐
│ Lead: João Silva                                │
├─────────────────────────────────────────────────┤
│ E-mail: joao@email.com                          │
│ Telefone: +5511999999999                        │
│ Origem: Calculadora de IMC                      │
│                                                 │
│ Dados Adicionais:                               │
│ - Peso: 85 kg                                   │
│ - Altura: 175 cm                                │
│ - IMC: 28.5                                     │
│ - Categoria: Sobrepeso                          │
└─────────────────────────────────────────────────┘
```

---

## 📚 REFERÊNCIAS

### **Documentos Relacionados:**
- `docs/GUIA-DUPLICACAO-AREAS-CONSOLIDADO.md` ⭐
- `docs/GUIA-TEMPLATES-COMPLETO-CONSOLIDADO.md` ⭐
- `docs/GUIA-API-WEBHOOKS-COMPLETO-CONSOLIDADO.md` ⭐

### **Arquivos de Código:**
- `src/app/api/leads/route.ts` - API de coleta de dados
- `src/lib/diagnostics/` - Diagnósticos por área
- `src/components/shared/LeadCaptureForm.tsx` - Formulário de coleta (criar se não existir)

---

## ✅ CONCLUSÃO

**Resumo:**
- ✅ Templates da Wellness podem ser usados em todas as áreas
- ✅ Diagnósticos são adaptados por área (textos específicos)
- ✅ **Foco principal: COLETA DE DADOS** (leads, informações)
- ✅ Sistema de coleta já funciona globalmente
- ✅ Duplicação rápida (~70 minutos por área)

**Próximos Passos:**
1. ⏳ Duplicar templates para Nutri
2. ⏳ Adaptar diagnósticos Nutri
3. ⏳ Testar coleta de dados
4. ⏳ Repetir para Nutra e Coach

**Lembre-se:**
- ⚠️ **Foco em COLETA DE DADOS** em todas as áreas
- ⚠️ Diagnósticos adaptados, mas estrutura idêntica
- ⚠️ Templates compartilhados, apenas `profession` muda
- ⚠️ Sistema de coleta funciona automaticamente

---

**Última atualização:** Hoje  
**Versão:** 1.0.0  
**Mantido por:** Equipe YLADA

