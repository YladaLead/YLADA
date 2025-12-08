# 📋 Schemas OpenAI Functions - Versão Simplificada

**Para colar diretamente no OpenAI Assistant**

---

## 🎯 FUNCTION 1: recomendarLinkWellness

**Cole apenas este JSON no campo "Function":**

```json
{
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
```

**URL do Endpoint:** `https://seu-dominio.com/api/noel/recomendarLinkWellness`

---

## 🎯 FUNCTION 2: buscarTreino

**Cole apenas este JSON no campo "Function":**

```json
{
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
```

**URL do Endpoint:** `https://seu-dominio.com/api/noel/buscarTreino`

---

## 📝 INSTRUÇÕES

1. No OpenAI Assistant, vá em **"Functions"** ou **"Tools"**
2. Clique em **"Add Function"** ou **"Create Function"**
3. No campo **"Function"**, cole APENAS o objeto JSON (sem o wrapper `{"type": "function", "function": {...}}`)
4. Configure a **URL** do endpoint
5. Salve

**Importante:** O campo `name` já está dentro do objeto, então não precisa adicionar separadamente.

---

## ✅ VERIFICAÇÃO

Após adicionar, verifique se:
- ✅ O campo `name` aparece preenchido
- ✅ O campo `description` aparece preenchido
- ✅ Os `parameters` estão configurados
- ✅ A URL do endpoint está correta

