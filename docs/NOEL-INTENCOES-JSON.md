# 🎯 JSON DE INTENÇÕES DO NOEL

**Versão:** 1.0.0  
**Data:** 2025-01-06  
**Uso:** Backend / Detecção de Intenção

---

## JSON Completo de Intenções

```json
{
  "intencoes": {
    "duplicacao": {
      "keywords": [
        "convidar",
        "convite",
        "apresentação",
        "duplicação",
        "kit",
        "distribuidor",
        "novo distribuidor",
        "seguir",
        "o que faço",
        "passo",
        "ensinar",
        "módulo",
        "equipe",
        "plano presidente"
      ],
      "acao": "orientar_treinamento",
      "cta": "Quer que eu te diga exatamente o próximo passo agora?",
      "modulo": "duplicacao",
      "prioridade": 1
    },
    "sac": {
      "keywords": [
        "erro",
        "bug",
        "não abre",
        "não funciona",
        "não carrega",
        "não consigo",
        "assinatura",
        "login",
        "pagar",
        "pagamento",
        "checkout",
        "acesso",
        "link",
        "travou",
        "problema",
        "falha"
      ],
      "acao": "diagnostico_tecnico",
      "cta": "Me confirma isso para eu resolver agora.",
      "modulo": "sac",
      "prioridade": 2
    },
    "comercial": {
      "keywords": [
        "quanto custa",
        "preço",
        "quero comprar",
        "quero testar",
        "kit",
        "protocolo",
        "programa",
        "entrega",
        "funciona",
        "valor",
        "como compro",
        "quero experimentar",
        "90 dias"
      ],
      "acao": "fechamento_venda",
      "cta": "Posso te enviar o vídeo de 30 segundos?",
      "modulo": "comercial",
      "prioridade": 3
    },
    "emocional": {
      "keywords": [
        "ansioso",
        "ansiosa",
        "desanimado",
        "triste",
        "cansado",
        "não consigo",
        "com medo",
        "desistir",
        "frustrado",
        "inseguro",
        "estou mal",
        "perdi o ritmo",
        "vou desistir"
      ],
      "acao": "acolhimento_direcionamento",
      "cta": "Qual foi a parte mais difícil do seu dia hoje?",
      "modulo": "emocional",
      "prioridade": 4
    }
  },
  "fallback": {
    "mensagem": "Perfeito! Para eu te ajudar melhor, você quer orientação, suporte técnico ou saber sobre produtos?",
    "opcoes": [
      "orientação",
      "suporte técnico",
      "produtos"
    ]
  }
}
```

---

## Estrutura TypeScript

```typescript
interface Intention {
  type: 'duplicacao' | 'sac' | 'comercial' | 'emocional' | 'unknown'
  confidence: number
  keywords: string[]
  action: string
  cta: string
  module: string
  priority: number
}

interface IntentionConfig {
  intencoes: {
    [key: string]: {
      keywords: string[]
      acao: string
      cta: string
      modulo: string
      prioridade: number
    }
  }
  fallback: {
    mensagem: string
    opcoes: string[]
  }
}
```

---

## Função de Detecção (Exemplo)

```typescript
import intentions from './noel-intencoes.json'

function detectIntention(message: string): Intention {
  const lowerMessage = message.toLowerCase()
  let bestMatch: Intention | null = null
  let bestScore = 0

  for (const [type, config] of Object.entries(intentions.intencoes)) {
    let score = 0
    const matchedKeywords: string[] = []

    for (const keyword of config.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        score++
        matchedKeywords.push(keyword)
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = {
        type: type as any,
        confidence: score / config.keywords.length,
        keywords: matchedKeywords,
        action: config.acao,
        cta: config.cta,
        module: config.modulo,
        priority: config.prioridade
      }
    }
  }

  if (bestMatch && bestMatch.confidence > 0.3) {
    return bestMatch
  }

  return {
    type: 'unknown',
    confidence: 0,
    keywords: [],
    action: 'fallback',
    cta: intentions.fallback.mensagem,
    module: 'fallback',
    priority: 0
  }
}
```

---

## Uso no Backend

```typescript
// Exemplo de uso na API
export async function POST(request: NextRequest) {
  const { message } = await request.json()
  
  // Detectar intenção
  const intention = detectIntention(message)
  
  // Passar contexto para a IA
  const systemPrompt = getSystemPromptForModule(intention.module)
  
  // Chamar Assistants API com contexto correto
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ]
  })
  
  // Garantir que CTA está presente
  const finalResponse = ensureCTA(response.choices[0].message.content, intention.cta)
  
  return NextResponse.json({ response: finalResponse, intention })
}
```

---

## Prioridades

As prioridades definem qual intenção deve ser escolhida quando há sobreposição:

1. **Duplicação** (prioridade 1) - Mais específica
2. **SAC** (prioridade 2) - Problemas técnicos
3. **Comercial** (prioridade 3) - Interesse de compra
4. **Emocional** (prioridade 4) - Estados emocionais

**Nota:** Em caso de empate, a intenção com maior confiança vence.

---

## Expansão Futura

Para adicionar novas intenções:

1. Adicionar entrada em `intencoes`
2. Definir keywords relevantes
3. Definir ação e CTA
4. Atualizar função de detecção
5. Testar com exemplos reais

---

**FIM DO DOCUMENTO**

