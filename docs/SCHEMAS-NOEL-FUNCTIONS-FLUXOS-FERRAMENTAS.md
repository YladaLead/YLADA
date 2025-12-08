# 📋 Schemas OpenAI Functions - NOEL (Fluxos, Ferramentas, Quizzes, Links)

**Data:** Agora  
**Objetivo:** Schemas prontos para adicionar no OpenAI Assistant

---

## 🎯 Como Adicionar no OpenAI

1. Acesse: https://platform.openai.com/assistants
2. Abra o Assistant do NOEL (ID: `asst_pu4Tpeox9tIdP0s2i6UhX6Em`)
3. Vá em **"Functions"** ou **"Tools"**
4. Clique em **"Add Function"** ou **"Create Function"**
5. Cole cada schema JSON abaixo
6. **NÃO configure URL** - o backend já gerencia isso automaticamente

---

## 📦 FUNCTION 1: getFluxoInfo

```json
{
  "type": "function",
  "function": {
    "name": "getFluxoInfo",
    "description": "Busca informações completas de um fluxo (processo passo a passo) do sistema Wellness. Retorna título, descrição, scripts, link direto e quando usar. Use quando o usuário mencionar fluxos, processos, ou precisar de um guia passo a passo.",
    "parameters": {
      "type": "object",
      "properties": {
        "fluxo_codigo": {
          "type": "string",
          "description": "Código do fluxo (ex: 'pos-venda', 'reativacao', 'convite-leve', '2-5-10')"
        },
        "fluxo_id": {
          "type": "string",
          "description": "ID UUID do fluxo (alternativa ao código)"
        }
      },
      "required": []
    }
  }
}
```

**Quando usar:**
- Usuário menciona "Fluxo 10", "Fluxo 12", "fluxo de pós-venda", "fluxo de reativação"
- Usuário precisa de um guia passo a passo
- Situação detectada: "já consumiu o kit", "não responde", "fez venda"

---

## 📦 FUNCTION 2: getFerramentaInfo

```json
{
  "type": "function",
  "function": {
    "name": "getFerramentaInfo",
    "description": "Busca informações de ferramentas/calculadoras do sistema Wellness. Retorna título, descrição, link personalizado do usuário, script de apresentação e quando usar. Use quando o usuário mencionar calculadoras, ferramentas ou precisar de um link para enviar.",
    "parameters": {
      "type": "object",
      "properties": {
        "ferramenta_slug": {
          "type": "string",
          "description": "Slug da ferramenta (ex: 'calculadora-agua', 'calculadora-proteina', 'calc-hidratacao')"
        }
      },
      "required": ["ferramenta_slug"]
    }
  }
}
```

**Quando usar:**
- Usuário menciona "calculadora de água", "calculadora de proteína"
- Usuário precisa de um link para enviar
- Contexto: pessoa cansada, precisa hidratação, etc.

---

## 📦 FUNCTION 3: getQuizInfo

```json
{
  "type": "function",
  "function": {
    "name": "getQuizInfo",
    "description": "Busca informações de quizzes do sistema Wellness. Retorna título, descrição, link personalizado do usuário, script de apresentação e quando usar. Use quando o usuário mencionar quizzes ou precisar engajar leads.",
    "parameters": {
      "type": "object",
      "properties": {
        "quiz_slug": {
          "type": "string",
          "description": "Slug do quiz (ex: 'quiz-energetico', 'quiz-ganhos', 'quiz-potencial')"
        }
      },
      "required": ["quiz_slug"]
    }
  }
}
```

**Quando usar:**
- Usuário menciona "quiz de energia", "quiz de metabolismo"
- Usuário precisa engajar um lead
- Contexto: captação, diagnóstico, engajamento

---

## 📦 FUNCTION 4: getLinkInfo

```json
{
  "type": "function",
  "function": {
    "name": "getLinkInfo",
    "description": "Busca informações de links Wellness oficiais. Retorna título, descrição, link, script de apresentação e quando usar. Use quando o usuário precisar de links oficiais do sistema.",
    "parameters": {
      "type": "object",
      "properties": {
        "link_codigo": {
          "type": "string",
          "description": "Código do link wellness (ex: 'calculadora-agua', 'quiz-energetico')"
        }
      },
      "required": ["link_codigo"]
    }
  }
}
```

**Quando usar:**
- Usuário pergunta "qual é o link?", "onde acho?"
- Usuário precisa de link oficial do sistema

---

## 📋 FORMATO OBRIGATÓRIO DE RESPOSTA

Quando o NOEL usar essas funções, ele DEVE responder no formato:

```
🎯 Use o [Título do Fluxo/Ferramenta/Quiz]

📋 O que é:
[Descrição clara e direta]

🔗 Acesse:
[Link direto formatado]

📝 Script sugerido:
[Script real do banco de dados]

💡 Quando usar:
[Orientação prática]
```

**Regras:**
- SEMPRE incluir link direto
- SEMPRE usar scripts reais do banco (não inventar)
- SEMPRE explicar o que é de forma clara
- SEMPRE orientar quando usar

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [x] Endpoints API criados (`/api/noel/getFluxoInfo`, etc.)
- [x] Funções integradas no `noel-assistant-handler.ts`
- [ ] Schemas adicionados no OpenAI Assistant
- [ ] System Prompt atualizado com formato obrigatório
- [ ] Testado localmente
- [ ] Deploy realizado

---

## 🧪 TESTES

Após adicionar os schemas, teste com:

1. **Fluxo:** "Qual é o fluxo de pós-venda?"
2. **Ferramenta:** "Preciso do link da calculadora de água"
3. **Quiz:** "Qual quiz usar para engajar leads?"
4. **Link:** "Me passa o link do quiz energético"

O NOEL deve:
- ✅ Chamar a função correta
- ✅ Retornar link direto
- ✅ Usar script real do banco
- ✅ Explicar o que é
- ✅ Orientar quando usar
