# 📦 O QUE É O CAMPO `content` (JSONB)?

## 🎯 DEFINIÇÃO

O campo `content` é um campo **JSONB** (JSON Binary) no banco de dados que armazena a **estrutura completa do template** - ou seja, **COMO o template funciona**.

---

## 🔍 O QUE ELE ARMAZENA?

O `content` contém a **estrutura técnica** do template:

### **Para QUIZ:**
```json
{
  "template_type": "quiz",
  "questions": 7,
  "items": [
    {
      "id": 1,
      "question": "Qual seu principal objetivo?",
      "options": ["Emagrecer", "Ganhar massa", "Manter peso"]
    },
    {
      "id": 2,
      "question": "Com que frequência você consome vegetais?",
      "options": ["Diariamente", "Algumas vezes/semana", "Raramente"]
    }
  ]
}
```

### **Para CALCULADORA:**
```json
{
  "template_type": "calculator",
  "fields": ["idade", "genero", "peso", "altura"],
  "formula": "peso/(altura*altura)"
}
```

### **Para PLANILHA/CHECKLIST:**
```json
{
  "template_type": "challenge",
  "items": [
    {
      "id": 1,
      "question": "Você precisa de resultados rápidos?",
      "options": ["Sim", "Não", "Talvez"]
    }
  ],
  "sections": ["cafe-da-manha", "almoco", "jantar"]
}
```

---

## 🎯 PARA QUE SERVE?

### **1. Estrutura do Template**
- Define **quantas perguntas** tem o quiz
- Define **quais campos** a calculadora precisa
- Define **quais seções** a planilha tem

### **2. Renderização no Frontend**
- O frontend lê o `content` e **renderiza** o template
- Exemplo: Se `content.questions = 7`, renderiza 7 perguntas
- Exemplo: Se `content.fields = ["peso", "altura"]`, renderiza campos de peso e altura

### **3. Funcionalidade**
- Define **como o template funciona**
- Define **quais dados coletar**
- Define **como processar as respostas**

---

## 📊 COMPARAÇÃO

| Campo | O que armazena | Exemplo |
|-------|----------------|---------|
| **`name`** | Nome do template | "Quiz Interativo" |
| **`description`** | Descrição do template | "Quiz com perguntas estratégicas..." |
| **`content`** | **Estrutura técnica** | `{"template_type": "quiz", "questions": 7}` |
| **Diagnósticos** | Textos de resultado | Está no código TypeScript (não no banco) |

---

## 🔄 FLUXO COMPLETO

```
1. Template no banco:
   - name: "Quiz Interativo"
   - description: "Quiz com perguntas estratégicas"
   - content: {"template_type": "quiz", "questions": 7, "items": [...]}
   ↓
2. Frontend carrega template
   ↓
3. Lê o content para saber:
   - É um quiz? → Renderiza perguntas
   - Tem 7 perguntas? → Renderiza 7 perguntas
   - Quais são as perguntas? → Lê items[]
   ↓
4. Usuário responde
   ↓
5. Sistema calcula resultado
   ↓
6. Busca diagnóstico no código TypeScript
   - getDiagnostico('quiz-interativo', 'nutri', 'resultado')
   ↓
7. Mostra diagnóstico para o usuário
```

---

## ⚠️ IMPORTANTE

### **O que NÃO está no `content`:**
- ❌ **Textos de diagnóstico** (estão no código TypeScript)
- ❌ **Textos de resultado** (estão no código TypeScript)
- ❌ **Mensagens personalizadas** (estão em outros campos)

### **O que ESTÁ no `content`:**
- ✅ **Estrutura do template** (perguntas, campos, seções)
- ✅ **Opções de resposta** (para quizzes)
- ✅ **Campos de entrada** (para calculadoras)
- ✅ **Configurações técnicas** (quantas perguntas, tipo, etc.)

---

## 🎯 POR QUE É IMPORTANTE?

### **Sem `content`:**
- ❌ Template não sabe quantas perguntas tem
- ❌ Template não sabe quais campos mostrar
- ❌ Template não funciona

### **Com `content`:**
- ✅ Template sabe exatamente como funcionar
- ✅ Frontend pode renderizar corretamente
- ✅ Sistema pode processar respostas
- ✅ Tudo funciona automaticamente

---

## 📝 EXEMPLO PRÁTICO

### **Template: "Calculadora de IMC"**

**No banco:**
```sql
name: "Calculadora de IMC"
description: "Calcule o Índice de Massa Corporal"
content: {
  "template_type": "calculator",
  "fields": ["idade", "genero", "peso", "altura"]
}
```

**O que o frontend faz:**
1. Lê `content.template_type` → "calculator"
2. Lê `content.fields` → ["idade", "genero", "peso", "altura"]
3. Renderiza 4 campos de entrada
4. Usuário preenche
5. Sistema calcula IMC
6. Busca diagnóstico no código TypeScript
7. Mostra resultado + diagnóstico

---

## ✅ RESUMO

**`content` = Estrutura técnica do template**

- Define **COMO** o template funciona
- Define **O QUE** coletar
- Define **COMO** processar

**Diagnósticos = Textos de resultado**

- Estão no código TypeScript
- Não estão no banco
- São buscados pela função `getDiagnostico()`

