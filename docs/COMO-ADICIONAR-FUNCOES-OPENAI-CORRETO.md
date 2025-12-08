# ✅ COMO ADICIONAR FUNÇÕES NO OPENAI - FORMA CORRETA

**Baseado na explicação do ChatGPT**

---

## 🎯 IMPORTANTE: VOCÊ NÃO PRECISA CONFIGURAR URL!

No nosso caso, o **backend Next.js** é que chama a URL quando recebe a function_call.

**A URL já está configurada no código:** `src/lib/noel-assistant-handler.ts`

---

## 📋 O QUE VOCÊ PRECISA FAZER

### **Apenas adicionar o SCHEMA no OpenAI Assistant**

1. Acesse: https://platform.openai.com/assistants
2. Abra o Assistant do NOEL
3. Vá em **"Functions"** ou **"Tools"**
4. Clique em **"Add Function"** ou **"Create Function"**
5. Cole apenas o **SCHEMA JSON** (sem URL!)

---

## 🔧 FUNÇÃO 1: recomendarLinkWellness

**Cole este JSON no campo "Function" ou "Schema":**

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

**✅ Pronto! Salve e pronto! Não precisa configurar URL!**

---

## 🔧 FUNÇÃO 2: buscarTreino

**Cole este JSON no campo "Function" ou "Schema":**

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

**✅ Pronto! Salve e pronto! Não precisa configurar URL!**

---

## 🔄 COMO FUNCIONA

```
1. Usuário: "Estou cansado"
   ↓
2. OpenAI Assistant detecta: "Preciso chamar recomendarLinkWellness"
   ↓
3. OpenAI retorna: function_call { name: "recomendarLinkWellness", arguments: {...} }
   ↓
4. Seu backend (noel-assistant-handler.ts) recebe a function_call
   ↓
5. Backend automaticamente chama: POST https://ylada.app/api/noel/recomendarLinkWellness
   ↓
6. Backend retorna resultado para o OpenAI
   ↓
7. OpenAI continua a resposta com o resultado
```

**A URL já está configurada no código!** ✅

---

## ✅ VERIFICAÇÃO

Após adicionar os schemas:

1. ✅ As funções aparecem na lista de Functions
2. ✅ Os nomes estão corretos: `recomendarLinkWellness` e `buscarTreino`
3. ✅ Os schemas estão completos
4. ✅ **Não precisa configurar URL** - seu backend já faz isso automaticamente!

---

## 🧪 TESTAR

Teste no chat do NOEL:

```
Usuário: "Estou muito cansado"
```

O NOEL deve:
1. Detectar necessidade
2. Chamar `recomendarLinkWellness` automaticamente
3. Seu backend chama o endpoint (já configurado)
4. NOEL retorna com o link recomendado

---

## 📝 RESUMO

**O que fazer:**
- ✅ Adicionar apenas os schemas JSON no OpenAI
- ✅ Não precisa configurar URL
- ✅ Seu backend já está configurado para chamar os endpoints automaticamente

**Onde está a URL:**
- No código: `src/lib/noel-assistant-handler.ts` (linhas 95-108)
- Já configurada e funcionando! ✅

