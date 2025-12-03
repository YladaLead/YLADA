# 🤖 Como Funciona OpenAI com Múltiplos Robôs

## ❓ Pergunta Principal

**"OpenAI vai consultar conhecimento da plataforma ou eu preciso ensinar?"**

**Resposta:** Você precisa **ENSINAR** a OpenAI sobre sua plataforma através de **PROMPTS** (instruções).

---

## 🧠 Como OpenAI Funciona

### **1. OpenAI NÃO Sabe Nada Sobre Sua Plataforma**

OpenAI (GPT) é como um assistente muito inteligente, mas que:
- ❌ **NÃO conhece** sua plataforma YLADA
- ❌ **NÃO sabe** seus preços, funcionalidades, processos
- ❌ **NÃO tem acesso** ao seu banco de dados
- ✅ **MAS** pode aprender rapidamente se você **ensinar**

### **2. Como "Ensinar" a OpenAI**

Você ensina através de **PROMPTS** (instruções) que enviamos junto com cada pergunta.

**Exemplo:**
```typescript
const systemPrompt = `
Você é um assistente de suporte da plataforma YLADA Wellness.

INFORMAÇÕES SOBRE A PLATAFORMA:
- YLADA Wellness é uma plataforma para profissionais de bem-estar
- Oferece: Gestão de Clientes, Ferramentas de Captação, Relatórios
- Preço: R$ 297/mês ou R$ 1.970/ano
- Áreas: Wellness, Nutri, Coach

COMO FUNCIONA:
- Clientes são cadastrados no sistema
- Kanban organiza clientes por status
- Quizzes e Portais captam leads
- Relatórios mostram estatísticas

SEU PAPEL:
- Responder dúvidas sobre a plataforma
- Ajudar usuários a usar as ferramentas
- Ser educado e profissional
`
```

**O que acontece:**
1. Você envia o prompt acima + pergunta do usuário
2. OpenAI lê tudo e "entende" o contexto
3. OpenAI responde baseado no que você ensinou
4. Resposta é personalizada e contextualizada

---

## 🎯 Múltiplos Robôs com Diferentes Propósitos

### **Arquitetura:**

```
┌─────────────────────────────────────┐
│  ROBÔ 1: VENDAS                     │
│  /api/chat/vendas                    │
│  Prompt: Focado em converter        │
│  Objetivo: Vender planos             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ROBÔ 2: SUPORTE                    │
│  /api/wellness/support/chat         │
│  Prompt: Focado em ajudar           │
│  Objetivo: Resolver problemas       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ROBÔ 3: ONBOARDING                 │
│  /api/wellness/onboarding/chat       │
│  Prompt: Focado em ensinar           │
│  Objetivo: Guiar novos usuários      │
└─────────────────────────────────────┘
```

### **Cada Robô Tem:**

1. **API Route Separada** (`/api/chat/vendas`, `/api/chat/suporte`, etc)
2. **Prompt Específico** (instruções diferentes)
3. **Objetivo Diferente** (vender, ajudar, ensinar)
4. **Mesma OpenAI** (mesma API, prompts diferentes)

---

## 📝 Exemplo Prático: 3 Robôs Diferentes

### **ROBÔ 1: Vendas (Página de Vendas)**

**Arquivo:** `src/app/api/chat/vendas/route.ts`

**Prompt:**
```typescript
const systemPrompt = `
Você é a Ana, atendente de VENDAS da YLADA Nutri.

SEU OBJETIVO: Converter visitantes em clientes

INFORMAÇÕES DE VENDAS:
- Plano Anual: R$ 1.970 (12x de R$ 197)
- Plano Mensal: R$ 297/mês
- Garantia: 7 dias
- Formação Empresarial incluída no anual

ESTRATÉGIA:
- Identificar dores do visitante
- Apresentar soluções relevantes
- Remover objeções
- Conduzir para checkout

TOM: Empático, persuasivo, mas não agressivo
`
```

**Uso:** Página `/pt/nutri` (landing page)

---

### **ROBÔ 2: Suporte (Área Logada)**

**Arquivo:** `src/app/api/wellness/support/chat/route.ts`

**Prompt:**
```typescript
const systemPrompt = `
Você é um assistente de SUPORTE da YLADA Wellness.

SEU OBJETIVO: Resolver problemas e dúvidas técnicas

CONHECIMENTO DA PLATAFORMA:
- Como cadastrar clientes: Menu Clientes > Novo Cliente
- Como usar Kanban: Arraste cards entre colunas
- Como criar quiz: Menu Ferramentas > Criar Quiz
- Como ver relatórios: Menu Relatórios

PROCESSO:
1. Entender o problema
2. Explicar solução passo a passo
3. Se não souber, criar ticket para humano

TOM: Técnico, claro, educado
`
```

**Uso:** Área logada `/pt/wellness/*`

---

### **ROBÔ 3: Onboarding (Novos Usuários)**

**Arquivo:** `src/app/api/wellness/onboarding/chat/route.ts`

**Prompt:**
```typescript
const systemPrompt = `
Você é um guia de ONBOARDING da YLADA Wellness.

SEU OBJETIVO: Ensinar novos usuários a usar a plataforma

JORNADA DO USUÁRIO:
1. Primeiro acesso: Configurar perfil
2. Segundo passo: Cadastrar primeiro cliente
3. Terceiro passo: Criar primeira ferramenta
4. Quarto passo: Ver relatórios

ESTILO:
- Explicar de forma simples
- Dar exemplos práticos
- Celebrar conquistas
- Não sobrecarregar com informações

TOM: Motivador, didático, paciente
`
```

**Uso:** Primeiros 7 dias após cadastro

---

## 🔧 Como Implementar

### **Estrutura de Arquivos:**

```
src/app/api/
├── chat/
│   ├── vendas/
│   │   └── route.ts          # Robô de Vendas
│   ├── suporte/
│   │   └── route.ts          # Robô de Suporte
│   └── onboarding/
│       └── route.ts          # Robô de Onboarding
└── wellness/
    └── support/
        └── chat/
            └── route.ts      # Robô Suporte Wellness
```

### **Código Base (Todos os Robôs):**

```typescript
// src/app/api/chat/[tipo]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// PROMPTS POR TIPO DE ROBÔ
const PROMPTS = {
  vendas: `
    Você é a Ana, atendente de VENDAS...
    [Prompt de vendas]
  `,
  suporte: `
    Você é assistente de SUPORTE...
    [Prompt de suporte]
  `,
  onboarding: `
    Você é guia de ONBOARDING...
    [Prompt de onboarding]
  `
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tipo: string } }
) {
  const { message, sessionId } = await request.json()
  
  // Pegar prompt específico para este tipo de robô
  const systemPrompt = PROMPTS[params.tipo] || PROMPTS.suporte
  
  // Criar thread (conversa)
  const thread = await openai.beta.threads.create()
  
  // Adicionar mensagem do usuário
  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: message
  })
  
  // Criar run com prompt do sistema
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID,
    instructions: systemPrompt // ← AQUI você "ensina" a IA
  })
  
  // Aguardar resposta
  // ... código de aguardar ...
  
  // Retornar resposta
  return NextResponse.json({ message: resposta })
}
```

---

## 📚 Como "Ensinar" Conhecimento da Plataforma

### **Opção 1: Prompt Estático (Simples)**

**Vantagens:**
- ✅ Fácil de implementar
- ✅ Controle total sobre o que a IA sabe
- ✅ Sem custos adicionais

**Desvantagens:**
- ⚠️ Precisa atualizar prompt manualmente
- ⚠️ Prompt pode ficar muito longo

**Exemplo:**
```typescript
const systemPrompt = `
INFORMAÇÕES DA PLATAFORMA YLADA WELLNESS:

PREÇOS:
- Plano Mensal: R$ 297/mês
- Plano Anual: R$ 1.970/ano (12x de R$ 197)

FUNCIONALIDADES:
1. Gestão de Clientes
   - Cadastro completo
   - Kanban organizacional
   - Histórico de evolução

2. Ferramentas de Captação
   - Quizzes personalizados
   - Portais de captação
   - Links inteligentes

3. Relatórios
   - Estatísticas de clientes
   - Conversão de leads
   - Performance de ferramentas

COMO USAR:
- Para cadastrar cliente: Menu > Clientes > Novo
- Para criar quiz: Menu > Ferramentas > Criar Quiz
- Para ver relatórios: Menu > Relatórios
`
```

---

### **Opção 2: Prompt Dinâmico (Avançado)**

**Buscar informações do banco e adicionar ao prompt:**

**Vantagens:**
- ✅ Sempre atualizado
- ✅ Informações dinâmicas
- ✅ Pode incluir dados do usuário

**Desvantagens:**
- ⚠️ Mais complexo
- ⚠️ Pode aumentar custo (mais tokens)

**Exemplo:**
```typescript
export async function POST(request: NextRequest) {
  // 1. Buscar informações do banco
  const { data: planos } = await supabase
    .from('planos')
    .select('*')
    .eq('area', 'wellness')
  
  const { data: funcionalidades } = await supabase
    .from('funcionalidades')
    .select('*')
    .eq('area', 'wellness')
  
  // 2. Construir prompt dinâmico
  const systemPrompt = `
    Você é assistente da YLADA Wellness.
    
    PLANOS DISPONÍVEIS:
    ${planos.map(p => `- ${p.nome}: ${p.preco}`).join('\n')}
    
    FUNCIONALIDADES:
    ${funcionalidades.map(f => `- ${f.nome}: ${f.descricao}`).join('\n')}
  `
  
  // 3. Usar prompt dinâmico
  // ... resto do código ...
}
```

---

### **Opção 3: Knowledge Base (Mais Avançado)**

**Criar "base de conhecimento" e enviar para OpenAI:**

**Vantagens:**
- ✅ Muito completo
- ✅ Pode incluir documentos
- ✅ OpenAI "lê" tudo automaticamente

**Desvantagens:**
- ⚠️ Mais caro (mais tokens)
- ⚠️ Mais complexo de configurar

**Como funciona:**
1. Criar arquivos de documentação
2. Fazer upload para OpenAI (File API)
3. Associar ao Assistente
4. OpenAI lê automaticamente quando necessário

---

## 💰 Custos

### **Por Robô:**

**Custo por mensagem:**
- GPT-4o-mini: ~$0.001-0.003 (R$ 0,005-0,015)
- GPT-4: ~$0.01-0.03 (R$ 0,05-0,15)

**Custo mensal estimado (1000 mensagens/robô):**
- 3 robôs × 1000 mensagens = 3000 mensagens
- Custo: ~$3-9 (R$ 15-45)

**Com aprendizado automático:**
- Mês 1: R$ 45
- Mês 2: R$ 25 (50% no banco)
- Mês 3: R$ 10 (80% no banco)
- Mês 6+: R$ 5 (95% no banco)

---

## 🎯 Resumo

### **Como Funciona:**

1. **Você cria PROMPT** com informações da plataforma
2. **OpenAI lê o prompt** + pergunta do usuário
3. **OpenAI responde** baseado no que você ensinou
4. **Cada robô tem prompt diferente** (vendas, suporte, etc)

### **Não Precisa:**

- ❌ Criar respostas pré-programadas
- ❌ Ensinar manualmente cada pergunta
- ❌ Manter banco de FAQ manual

### **Precisa:**

- ✅ Criar prompts bem escritos
- ✅ Atualizar prompts quando plataforma muda
- ✅ Monitorar respostas e ajustar prompts

---

## ✅ Próximos Passos

1. **Criar estrutura** de múltiplos robôs
2. **Escrever prompts** para cada robô
3. **Implementar sistema** de aprendizado
4. **Testar e ajustar** prompts
5. **Monitorar custos** e otimizar

**Quer que eu comece a implementar?** 🚀

