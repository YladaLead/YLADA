# 📋 Schemas OpenAI Functions - NOEL (Lousas)

**Data:** Agora  
**Objetivo:** Schemas para adicionar no OpenAI Assistant

---

## 🎯 FUNÇÕES NOVAS ADICIONADAS

### FUNCTION 1: recomendarLinkWellness

```json
{
  "type": "function",
  "function": {
    "name": "recomendarLinkWellness",
    "description": "Recomenda um Link Wellness (calculadora, quiz, diagnóstico, desafio ou oportunidade de negócio) baseado no contexto da conversa, tipo de lead, necessidade identificada ou palavras-chave mencionadas.",
    "parameters": {
      "type": "object",
      "properties": {
        "tipo_lead": {
          "type": "string",
          "enum": ["frio", "morno", "quente"],
          "description": "Tipo de lead: frio (nunca foi abordado), morno (já foi abordado), quente (demonstrou interesse claro)"
        },
        "necessidade": {
          "type": "string",
          "description": "Necessidade identificada na conversa (ex: 'energia', 'emagrecer', 'renda extra', 'intestino')"
        },
        "palavras_chave": {
          "type": "string",
          "description": "Palavras-chave mencionadas separadas por vírgula (ex: 'cansado,energia,metabolismo')"
        },
        "objetivo": {
          "type": "string",
          "enum": ["captacao", "diagnostico", "engajamento", "recrutamento"],
          "description": "Objetivo do link: captacao (iniciar conversa), diagnostico (aprofundar), engajamento (manter interesse), recrutamento (oportunidade de negócio)"
        }
      },
      "required": []
    }
  }
}
```

**Endpoint:** `POST /api/noel/recomendarLinkWellness`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "codigo": "calculadora-agua",
    "nome": "Calculadora de Água",
    "categoria": "saude-bem-estar",
    "objetivo": "captacao",
    "script_curto": "Olha, tenho uma calculadora que mostra exatamente quanta água você precisa por dia. Quer testar?",
    "quando_usar": "Para leads frios ou mornos que mencionam cansaço, pele seca, ou praticam exercícios",
    "publico_alvo": "Pessoas que querem melhorar hidratação, praticantes de atividade física..."
  }
}
```

**Quando usar:**
- Quando o usuário menciona necessidade que pode ser resolvida com um link
- Quando precisa sugerir um link para iniciar conversa
- Quando quer recomendar link baseado em palavras-chave
- Quando precisa de link para lead específico (frio/morno/quente)

---

### FUNCTION 2: buscarTreino

```json
{
  "type": "function",
  "function": {
    "name": "buscarTreino",
    "description": "Busca um treino micro (1, 3 ou 5 minutos) baseado no tipo ou gatilho. Treinos são conteúdos rápidos para motivar, ensinar ou orientar distribuidores.",
    "parameters": {
      "type": "object",
      "properties": {
        "tipo": {
          "type": "string",
          "enum": ["1min", "3min", "5min"],
          "description": "Tipo de treino: 1min (impulso diário), 3min (técnico/comportamental), 5min (mindset/estratégia)"
        },
        "gatilho": {
          "type": "string",
          "description": "Gatilho/situação para sugerir treino (ex: 'desanimado', 'procrastinando', 'travado', 'sem vontade', 'precisa motivação')"
        }
      },
      "required": []
    }
  }
}
```

**Endpoint:** `POST /api/noel/buscarTreino`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "codigo": "treino-1min-01",
    "tipo": "1min",
    "titulo": "O Poder do Primeiro Passo",
    "conceito": "O primeiro passo é sempre o mais difícil, mas também o mais importante. Não precisa ser perfeito, só precisa ser dado.",
    "exemplo_pratico": "Em vez de pensar em 'preciso fazer 10 convites', pense 'vou fazer 1 convite agora'.",
    "acao_diaria": "Faça 1 ação agora, mesmo que pequena. Pode ser 1 mensagem, 1 link enviado, 1 contato."
  }
}
```

**Quando usar:**
- Quando distribuidor está desanimado ou travado
- Quando precisa de motivação rápida
- Quando quer ensinar algo rápido (1-5 minutos)
- Quando detecta gatilho específico (procrastinação, desânimo, etc)

---

## 📋 FUNÇÕES EXISTENTES (Já Configuradas)

As seguintes funções já estão configuradas:
- `getUserProfile` - Obter perfil do distribuidor
- `saveInteraction` - Salvar interação
- `getPlanDay` - Obter plano do dia
- `updatePlanDay` - Atualizar plano do dia
- `registerLead` - Registrar lead
- `getClientData` - Obter dados de cliente
- `buscarBiblioteca` - Buscar na biblioteca
- `recomendarFluxo` - Recomendar fluxo

---

## 🚀 COMO ADICIONAR NO OPENAI

1. Acesse o OpenAI Assistant Builder
2. Vá em "Functions" ou "Tools"
3. Clique em "Add Function"
4. Cole o schema JSON de cada função
5. Configure a URL do endpoint (ex: `https://seu-dominio.com/api/noel/recomendarLinkWellness`)
6. Salve

---

## 🎯 EXEMPLOS DE USO

### Exemplo 1: Usuário menciona cansaço
```
Usuário: "Estou muito cansado"
NOEL: [chama recomendarLinkWellness com palavras_chave="cansado"]
NOEL: "Tenho uma calculadora de água que pode te ajudar. Quer testar?"
```

### Exemplo 2: Distribuidor desanimado
```
Usuário: "Não estou conseguindo fazer nada hoje"
NOEL: [chama buscarTreino com gatilho="desanimado"]
NOEL: "Entendo. Que tal um treino rápido de 1 minuto? O Poder do Primeiro Passo..."
```

### Exemplo 3: Lead quer renda extra
```
Usuário: "Preciso de uma renda extra"
NOEL: [chama recomendarLinkWellness com objetivo="recrutamento", tipo_lead="quente"]
NOEL: "Tenho uma oportunidade que pode te interessar. Quer conhecer?"
```

---

## ✅ STATUS

- ✅ Funções criadas no código
- ✅ Endpoints criados
- ✅ Integração com handler do NOEL
- ⏳ **PRÓXIMO:** Adicionar schemas no OpenAI Assistant

