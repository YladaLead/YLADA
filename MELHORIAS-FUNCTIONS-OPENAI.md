# 🔧 MELHORIAS NAS FUNCTIONS - OpenAI Dashboard

**Data:** 2025-01-27  
**Status:** ⚠️ Ações necessárias

---

## 🔍 PROBLEMA IDENTIFICADO

As functions estão configuradas, mas as **descrições não estão claras o suficiente** para o Assistants API inferir corretamente os parâmetros da mensagem do usuário.

---

## 📝 FUNÇÃO 1: getFluxoInfo

### **❌ Problema Atual:**
- `required: []` - Nenhum parâmetro obrigatório
- Descrição não menciona claramente QUANDO usar cada código
- Assistants API pode chamar sem parâmetros

### **✅ Descrição Melhorada (Cole no OpenAI Dashboard):**

```json
{
  "name": "getFluxoInfo",
  "description": "Busca informações completas de um fluxo (processo passo a passo) do Sistema Wellness. Retorna título, descrição, scripts, link direto e quando usar. IMPORTANTE: Você DEVE sempre identificar qual fluxo o usuário precisa baseado nas palavras-chave da mensagem. Mapeamento obrigatório: se o usuário mencionar 'reativar', 'cliente que sumiu', 'reativação' → use fluxo_codigo: 'reativacao'. Se mencionar 'pós-venda', 'após venda', 'depois da venda' → use fluxo_codigo: 'pos-venda'. Se mencionar 'convite', 'convidar', 'oportunidade' → use fluxo_codigo: 'convite-leve'. Se mencionar '2-5-10', 'rotina', 'método' → use fluxo_codigo: '2-5-10'. NUNCA chame esta function sem fluxo_codigo ou fluxo_id.",
  "parameters": {
    "type": "object",
    "properties": {
      "fluxo_codigo": {
        "type": "string",
        "description": "Código do fluxo. OBRIGATÓRIO identificar baseado na mensagem do usuário. Valores possíveis: 'reativacao' (para reativar clientes), 'pos-venda' (para acompanhamento pós-venda), 'convite-leve' (para convites de negócio), '2-5-10' (para rotina diária). SEMPRE inclua este parâmetro baseado no contexto da mensagem."
      },
      "fluxo_id": {
        "type": "string",
        "description": "ID UUID do fluxo (alternativa ao código, use apenas se souber o ID exato)"
      }
    },
    "required": ["fluxo_codigo"]
  }
}
```

**Mudanças principais:**
1. ✅ `required: ["fluxo_codigo"]` - Agora é obrigatório
2. ✅ Descrição mais detalhada com mapeamento claro de palavras-chave
3. ✅ Instruções explícitas sobre quando usar cada código

---

## 📝 FUNÇÃO 2: getFerramentaInfo

### **❌ Problema Atual:**
- Descrição não menciona claramente como inferir o slug
- Pode não estar mapeando corretamente "calculadora de água" → "calculadora-agua"

### **✅ Descrição Melhorada (Cole no OpenAI Dashboard):**

```json
{
  "name": "getFerramentaInfo",
  "description": "Busca informações de ferramentas e calculadoras do Sistema Wellness. Retorna título, descrição, link personalizado, script e quando usar. IMPORTANTE: Você DEVE sempre identificar qual ferramenta o usuário precisa baseado nas palavras-chave da mensagem. Mapeamento obrigatório: se o usuário mencionar 'calculadora de água', 'água', 'hidratação', 'calcular água' → use ferramenta_slug: 'calculadora-agua'. Se mencionar 'calculadora de proteína', 'proteína' → use ferramenta_slug: 'calculadora-proteina'. Se mencionar 'calculadora de hidratação', 'calc hidratação' → use ferramenta_slug: 'calc-hidratacao'. NUNCA chame esta function sem ferramenta_slug.",
  "parameters": {
    "type": "object",
    "properties": {
      "ferramenta_slug": {
        "type": "string",
        "description": "Slug da ferramenta. OBRIGATÓRIO identificar baseado na mensagem do usuário. Valores comuns: 'calculadora-agua' (para calculadora de água/hidratação), 'calculadora-proteina' (para calculadora de proteína), 'calc-hidratacao' (para calculadora de hidratação). SEMPRE converta a descrição do usuário para o slug correspondente (ex: 'calculadora de água' → 'calculadora-agua')."
      }
    },
    "required": ["ferramenta_slug"]
  }
}
```

**Mudanças principais:**
1. ✅ Descrição mais detalhada com mapeamento claro de palavras-chave
2. ✅ Instruções explícitas sobre como converter descrição do usuário para slug
3. ✅ Exemplos claros de mapeamento

---

## 🚀 COMO APLICAR AS MELHORIAS

### **Passo 1: Acessar OpenAI Dashboard**
1. Acesse: https://platform.openai.com/assistants
2. Faça login
3. Abra o Assistant do NOEL

### **Passo 2: Editar getFluxoInfo**
1. Encontre a function `getFluxoInfo`
2. Clique em "Edit" (ou editar)
3. **Substitua a descrição** pela versão melhorada acima
4. **Altere `required: []` para `required: ["fluxo_codigo"]`**
5. Clique em "Save"

### **Passo 3: Editar getFerramentaInfo**
1. Encontre a function `getFerramentaInfo`
2. Clique em "Edit" (ou editar)
3. **Substitua a descrição** pela versão melhorada acima
4. **Mantenha `required: ["ferramenta_slug"]`** (já está correto)
5. Clique em "Save"

### **Passo 4: Testar Novamente**
Após salvar, teste:
- "Preciso reativar um cliente que sumiu"
- "Quero enviar a calculadora de água para um cliente"

---

## ✅ RESULTADO ESPERADO

Após essas melhorias:

1. ✅ **getFluxoInfo** será chamada SEMPRE com `fluxo_codigo` correto
2. ✅ **getFerramentaInfo** será chamada SEMPRE com `ferramenta_slug` correto
3. ✅ Assistants API vai mapear corretamente palavras-chave → parâmetros
4. ✅ Erros "Erro no servidor" devem desaparecer

---

## 📋 CHECKLIST

- [ ] Editei a descrição de `getFluxoInfo` no OpenAI Dashboard
- [ ] Alterei `required: []` para `required: ["fluxo_codigo"]` em `getFluxoInfo`
- [ ] Editei a descrição de `getFerramentaInfo` no OpenAI Dashboard
- [ ] Salvei as alterações
- [ ] Testei novamente as perguntas que falharam

---

**✅ Aplique essas melhorias e teste novamente!**


















