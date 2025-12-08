# 🔗 GUIA: Como Configurar URLs no OpenAI Assistant

**Passo a passo visual para adicionar as funções**

---

## 🌐 QUAL URL USAR?

### **Para PRODUÇÃO (Vercel):**
```
https://ylada.app
```

### **Para DESENVOLVIMENTO (Local):**
```
http://localhost:3000
```

**⚠️ IMPORTANTE:** Use a URL de **PRODUÇÃO** se o app já está no ar. Use **localhost** apenas para testes locais.

---

## 📋 URLs COMPLETAS DAS FUNÇÕES

### **FUNÇÃO 1: recomendarLinkWellness**

**URL de PRODUÇÃO:**
```
https://ylada.app/api/noel/recomendarLinkWellness
```

**URL de DESENVOLVIMENTO:**
```
http://localhost:3000/api/noel/recomendarLinkWellness
```

---

### **FUNÇÃO 2: buscarTreino**

**URL de PRODUÇÃO:**
```
https://ylada.app/api/noel/buscarTreino
```

**URL de DESENVOLVIMENTO:**
```
http://localhost:3000/api/noel/buscarTreino
```

---

## 🎯 PASSO A PASSO NO OPENAI

### **1. Acesse o OpenAI Assistant**
- Vá em: https://platform.openai.com/assistants
- Abra o Assistant do NOEL

### **2. Vá em "Functions" ou "Tools"**
- No menu lateral, clique em **"Functions"** ou **"Tools"**
- Ou procure por **"Function calling"**

### **3. Adicionar Primeira Função (recomendarLinkWellness)**

**a) Clique em "Add Function" ou "Create Function"**

**b) Você verá campos como:**
- **Name** (ou Function Name)
- **Description** (ou Function Description)
- **Parameters** (ou Schema)
- **Server URL** (ou Endpoint URL)

**c) Preencha assim:**

**Campo "Name" ou "Function Name":**
```
recomendarLinkWellness
```

**Campo "Description":**
```
Recomenda um Link Wellness (calculadora, quiz, diagnóstico, desafio ou oportunidade de negócio) baseado no contexto da conversa, tipo de lead, necessidade identificada ou palavras-chave mencionadas.
```

**Campo "Parameters" ou "Schema":**
Cole este JSON:
```json
{
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
```

**Campo "Server URL" ou "Endpoint URL":**
```
https://ylada.app/api/noel/recomendarLinkWellness
```
(ou `http://localhost:3000/api/noel/recomendarLinkWellness` se for desenvolvimento)

**d) Clique em "Save" ou "Create"**

---

### **4. Adicionar Segunda Função (buscarTreino)**

Repita o processo acima com:

**Name:**
```
buscarTreino
```

**Description:**
```
Busca um treino micro (1, 3 ou 5 minutos) baseado no tipo ou gatilho. Treinos são conteúdos rápidos para motivar, ensinar ou orientar distribuidores.
```

**Parameters:**
```json
{
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
```

**Server URL:**
```
https://ylada.app/api/noel/buscarTreino
```
(ou `http://localhost:3000/api/noel/buscarTreino` se for desenvolvimento)

---

## ✅ VERIFICAÇÃO FINAL

Após adicionar as duas funções, verifique:

1. ✅ Ambas aparecem na lista de Functions
2. ✅ Os nomes estão corretos: `recomendarLinkWellness` e `buscarTreino`
3. ✅ As URLs estão corretas (começam com `https://ylada.app/api/noel/...`)
4. ✅ Os schemas estão completos

---

## 🧪 TESTAR

Após configurar, teste no chat do NOEL:

**Teste 1:**
```
Usuário: "Estou muito cansado"
```
NOEL deve chamar `recomendarLinkWellness` e sugerir um link.

**Teste 2:**
```
Usuário: "Estou desanimado"
```
NOEL deve chamar `buscarTreino` e sugerir um treino.

---

## 📝 NOTAS

- Se usar **localhost**, só funciona em desenvolvimento local
- Para produção, use sempre `https://ylada.app`
- As URLs devem terminar sem barra `/` no final
- O campo "name" no schema já está correto, não precisa adicionar separadamente

