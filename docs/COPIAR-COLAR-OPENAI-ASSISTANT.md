# 📋 SCHEMAS COMPLETOS PARA COPIAR NO OPENAI ASSISTANT

**Link:** https://platform.openai.com/assistants

---

## 🎯 COMO USAR (PASSO A PASSO DETALHADO)

1. Acesse: https://platform.openai.com/assistants
2. Abra o Assistant do NOEL
3. Vá em **"Functions"** ou **"Tools"**
4. Clique em **"Add Function"** ou **"Create Function"**
5. **IMPORTANTE:** O OpenAI pede campos separados. Preencha assim:

   **Campo "Function Name" ou "Name":**
   - Cole apenas o nome: `getFluxoInfo` (sem aspas, sem JSON)
   
   **Campo "Description":**
   - Cole a descrição completa (veja abaixo)
   
   **Campo "Parameters" ou "Schema":**
   - Cole apenas a parte `parameters` do JSON (veja abaixo)
   
6. **NÃO configure URL** - deixe esse campo em branco ou ignore
7. Clique em **"Save"** ou **"Add"**
8. Repita para as outras 3 funções

---

## 📦 FUNCTION 1: getFluxoInfo

### Campo 1: Function Name (ou Name)
```
getFluxoInfo
```

### Campo 2: Description
```
Busca informações completas de um fluxo (processo passo a passo) do sistema Wellness. Retorna título, descrição, scripts, link direto e quando usar. Use quando o usuário mencionar fluxos, processos, ou precisar de um guia passo a passo.
```

### Campo 3: Parameters (ou Schema) - COPIE ESTE JSON COMPLETO:
```json
{
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
```

---

## 📦 FUNCTION 2: getFerramentaInfo

### Campo 1: Function Name (ou Name)
```
getFerramentaInfo
```

### Campo 2: Description
```
Busca informações de ferramentas/calculadoras do sistema Wellness. Retorna título, descrição, link personalizado do usuário, script de apresentação e quando usar. Use quando o usuário mencionar calculadoras, ferramentas ou precisar de um link para enviar.
```

### Campo 3: Parameters (ou Schema) - COPIE ESTE JSON COMPLETO:
```json
{
  "type": "object",
  "properties": {
    "ferramenta_slug": {
      "type": "string",
      "description": "Slug da ferramenta (ex: 'calculadora-agua', 'calculadora-proteina', 'calc-hidratacao')"
    }
  },
  "required": ["ferramenta_slug"]
}
```

---

## 📦 FUNCTION 3: getQuizInfo

### Campo 1: Function Name (ou Name)
```
getQuizInfo
```

### Campo 2: Description
```
Busca informações de quizzes do sistema Wellness. Retorna título, descrição, link personalizado do usuário, script de apresentação e quando usar. Use quando o usuário mencionar quizzes ou precisar engajar leads.
```

### Campo 3: Parameters (ou Schema) - COPIE ESTE JSON COMPLETO:
```json
{
  "type": "object",
  "properties": {
    "quiz_slug": {
      "type": "string",
      "description": "Slug do quiz (ex: 'quiz-energetico', 'quiz-ganhos', 'quiz-potencial')"
    }
  },
  "required": ["quiz_slug"]
}
```

---

## 📦 FUNCTION 4: getLinkInfo

### Campo 1: Function Name (ou Name)
```
getLinkInfo
```

### Campo 2: Description
```
Busca informações de links Wellness oficiais. Retorna título, descrição, link, script de apresentação e quando usar. Use quando o usuário precisar de links oficiais do sistema.
```

### Campo 3: Parameters (ou Schema) - COPIE ESTE JSON COMPLETO:
```json
{
  "type": "object",
  "properties": {
    "link_codigo": {
      "type": "string",
      "description": "Código do link wellness (ex: 'calculadora-agua', 'quiz-energetico')"
    }
  },
  "required": ["link_codigo"]
}
```

---

## ⚠️ IMPORTANTE

- **NÃO configure URL** - deixe esse campo em branco ou ignore
- O backend já gerencia as URLs automaticamente
- Adicione as 4 funções separadamente (uma de cada vez)
- Salve cada função antes de adicionar a próxima

---

## 📍 ONDE ESTÁ O ARQUIVO

Todos os schemas estão salvos em:
- `docs/COPIAR-COLAR-OPENAI-ASSISTANT.md` (este arquivo)
- `docs/SCHEMAS-NOEL-FUNCTIONS-FLUXOS-FERRAMENTAS.md`
