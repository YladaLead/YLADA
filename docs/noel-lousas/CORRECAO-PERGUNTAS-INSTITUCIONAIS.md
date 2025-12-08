# 🔧 Correção - Perguntas Institucionais

**Data:** 2025-01-27  
**Problema:** NOEL estava respondendo perguntas institucionais com scripts emocionais genéricos

---

## ❌ PROBLEMA IDENTIFICADO

### **Sintomas:**
- Pergunta: "Quem é você?" → Resposta: "Essa preocupação é comum... O importante é fazer sentido pra você..."
- Pergunta: "O que você faz?" → Resposta: "Essa preocupação é comum... O importante é fazer sentido pra você..."
- Pergunta: "Explique o sistema" → Resposta: "Essa preocupação é comum... O importante é fazer sentido pra você..."

### **Causa Raiz:**
1. **Base de Conhecimento mal organizada** - Scripts emocionais tinham alta similaridade (90%) mesmo para perguntas técnicas
2. **Falta de roteamento** - Não diferenciava perguntas institucionais de pedidos por scripts
3. **System prompt genérico** - Não tinha regras claras de prioridade

---

## ✅ CORREÇÕES IMPLEMENTADAS

### **1. Função de Detecção de Perguntas Institucionais**

**Arquivo:** `src/app/api/wellness/noel/route.ts`

**Função:** `detectInstitutionalQuery(message: string)`

**Detecta:**
- "Quem é você?" / "O que você faz?" / "Como você funciona?"
- "O que é o Sistema Wellness?" / "Como funciona o sistema?"
- "Explique o sistema" / "Como usar a plataforma?"
- Dúvidas técnicas sobre funcionalidades

**Código:**
```typescript
function detectInstitutionalQuery(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  
  const institutionalPatterns = [
    /quem (é|são|sou)/i,
    /o que (você|noel|sistema|wellness) (faz|é|fazem)/i,
    /como (você|noel|sistema|wellness) (funciona|funcionam)/i,
    /explique (o|a) (sistema|wellness|noel|plataforma)/i,
    // ... mais padrões
  ]
  
  const institutionalKeywords = [
    'quem é você',
    'o que você faz',
    'o que é o noel',
    // ... mais palavras-chave
  ]
  
  return matchesPattern || matchesKeywords
}
```

---

### **2. Roteamento Inteligente**

**Arquivo:** `src/app/api/wellness/noel/route.ts`

**Lógica:**
- Se for pergunta institucional → **NÃO busca na Base de Conhecimento**
- Responde **diretamente** com explicação técnica
- Ignora scripts emocionais completamente

**Código:**
```typescript
// Detectar se é pergunta institucional
const isInstitutionalQuery = detectInstitutionalQuery(message)

// Só buscar na base se NÃO for pergunta institucional
if (!isInstitutionalQuery) {
  knowledgeResult = await searchKnowledgeBase(message, module)
} else {
  // Pergunta institucional → não buscar scripts
  knowledgeResult = { items: [], bestMatch: null, similarityScore: 0 }
}

// Decidir estratégia
if (isInstitutionalQuery) {
  // Responder diretamente, sem usar Base de Conhecimento
  const aiResult = await generateAIResponse(
    message,
    module,
    null, // Não passar Base de Conhecimento
    conversationHistory,
    personalizedContext
  )
  response = aiResult.response
  source = 'ia_generated'
}
```

---

### **3. System Prompt Melhorado**

**Arquivo:** `src/app/api/wellness/noel/route.ts` - função `buildSystemPrompt`

**Adicionado:**
- ✅ Seção **"PRIORIDADE ABSOLUTA - REGRAS DE ROTEAMENTO"**
- ✅ Regras claras para perguntas institucionais
- ✅ Respostas pré-definidas para perguntas comuns
- ✅ Instruções explícitas: "NUNCA use scripts emocionais para perguntas técnicas"

**Código:**
```typescript
🚨 PRIORIDADE ABSOLUTA - REGRAS DE ROTEAMENTO:

1. **PERGUNTAS INSTITUCIONAIS/TÉCNICAS** (responder DIRETAMENTE, sem scripts):
   Quando o usuário perguntar sobre:
   - "Quem é você?" / "O que você faz?" / "Como você funciona?"
   - "O que é o Sistema Wellness?" / "Como funciona o sistema?"
   
   ✅ RESPOSTA: Responda OBJETIVAMENTE e DIRETAMENTE
   
   ❌ NUNCA use scripts emocionais como:
   - "Essa preocupação é comum..."
   - "O importante é fazer sentido pra você..."
```

---

### **4. Respostas Pré-Definidas**

**Adicionado no system prompt (módulo 'suporte'):**

```
RESPOSTAS INSTITUCIONAIS:
- "Quem é você?": "Eu sou o NOEL, seu mentor estratégico da área Wellness..."
- "O que você faz?": "O Noel é o assistente oficial do Wellness System..."
- "O que é o Sistema Wellness?": "O Sistema Wellness é um método simples..."
```

---

## 📊 RESULTADO ESPERADO

### **Antes:**
```
Pergunta: "Quem é você?"
Resposta: "Essa preocupação é comum... O importante é fazer sentido pra você..."
Similaridade: 90% (script emocional errado)
```

### **Depois:**
```
Pergunta: "Quem é você?"
Resposta: "Eu sou o NOEL, seu mentor estratégico da área Wellness. 
Te ajudo com estratégias de crescimento, metas diárias, scripts prontos..."
Source: ia_generated (resposta direta, sem scripts)
```

---

## 🧪 TESTES NECESSÁRIOS

Testar as seguintes perguntas:

1. ✅ "Quem é você?"
2. ✅ "O que você faz?"
3. ✅ "O que é o Sistema Wellness?"
4. ✅ "Explique o sistema"
5. ✅ "Como funciona o Wellness System?"

**Resultado esperado:** Respostas diretas e técnicas, sem scripts emocionais

---

## 📝 ARQUIVOS MODIFICADOS

1. ✅ `src/app/api/wellness/noel/route.ts`
   - Função `detectInstitutionalQuery()` adicionada
   - Roteamento inteligente implementado
   - System prompt melhorado com regras de prioridade

---

**Status:** ✅ **CORREÇÕES IMPLEMENTADAS - AGUARDANDO TESTES**
