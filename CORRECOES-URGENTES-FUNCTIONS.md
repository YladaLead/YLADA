# 🚨 CORREÇÕES URGENTES - Functions OpenAI Dashboard

**Data:** 2025-01-27  
**Status:** ⚠️ **AÇÃO IMEDIATA NECESSÁRIA**

---

## 🔴 PROBLEMA CRÍTICO IDENTIFICADO

### **getFluxoInfo:**
- ❌ `required: []` - **NENHUM parâmetro obrigatório**
- ❌ Assistants API pode chamar sem `fluxo_codigo`
- ❌ Resultado: Erro 400 → "Erro no servidor"

### **getFerramentaInfo:**
- ✅ `required: ["ferramenta_slug"]` - Correto
- ⚠️ Mas descrição pode não estar clara o suficiente

---

## ✅ CORREÇÃO 1: getFluxoInfo

### **O QUE MUDAR:**

1. **Alterar `required` de `[]` para `["fluxo_codigo"]`**
2. **Melhorar a descrição** para mapear palavras-chave → código

### **NOVA DESCRIÇÃO (Cole no campo "Description"):**

```
Busca informações completas de um fluxo (processo passo a passo) do Sistema Wellness. Retorna título, descrição, scripts, link direto e quando usar.

IMPORTANTE - Mapeamento obrigatório de palavras-chave:
- Se o usuário mencionar "reativar", "cliente que sumiu", "reativação", "reativar cliente" → use fluxo_codigo: "reativacao"
- Se o usuário mencionar "pós-venda", "após venda", "depois da venda", "acompanhamento" → use fluxo_codigo: "pos-venda"
- Se o usuário mencionar "convite", "convidar", "oportunidade", "negócio" → use fluxo_codigo: "convite-leve"
- Se o usuário mencionar "2-5-10", "rotina", "método 2-5-10" → use fluxo_codigo: "2-5-10"

NUNCA chame esta function sem fluxo_codigo. Sempre identifique qual fluxo o usuário precisa baseado nas palavras-chave da mensagem.
```

### **NOVA DESCRIÇÃO DO PARÂMETRO `fluxo_codigo` (Cole no campo "description" do parâmetro):**

```
Código do fluxo. OBRIGATÓRIO. Identifique baseado na mensagem do usuário usando este mapeamento:
- "reativar" / "cliente que sumiu" → "reativacao"
- "pós-venda" / "após venda" → "pos-venda"
- "convite" / "oportunidade" → "convite-leve"
- "2-5-10" / "rotina" → "2-5-10"
```

### **ALTERAR `required`:**

No campo "required" (ou na seção de parâmetros), adicione:
```json
["fluxo_codigo"]
```

Ou marque `fluxo_codigo` como obrigatório na interface.

---

## ✅ CORREÇÃO 2: getFerramentaInfo

### **O QUE MUDAR:**

1. **Melhorar a descrição** para mapear palavras-chave → slug

### **NOVA DESCRIÇÃO (Cole no campo "Description"):**

```
Busca informações de ferramentas e calculadoras do Sistema Wellness. Retorna título, descrição, link personalizado, script e quando usar.

IMPORTANTE - Mapeamento obrigatório de palavras-chave:
- Se o usuário mencionar "calculadora de água", "água", "hidratação", "calcular água" → use ferramenta_slug: "calculadora-agua"
- Se o usuário mencionar "calculadora de proteína", "proteína" → use ferramenta_slug: "calculadora-proteina"
- Se o usuário mencionar "calculadora de hidratação", "calc hidratação" → use ferramenta_slug: "calc-hidratacao"

Sempre converta a descrição do usuário para o slug correspondente (ex: "calculadora de água" → "calculadora-agua").
```

### **NOVA DESCRIÇÃO DO PARÂMETRO `ferramenta_slug` (Cole no campo "description" do parâmetro):**

```
Slug da ferramenta. OBRIGATÓRIO. Identifique baseado na mensagem do usuário usando este mapeamento:
- "calculadora de água" / "água" / "hidratação" → "calculadora-agua"
- "calculadora de proteína" / "proteína" → "calculadora-proteina"
- "calculadora de hidratação" → "calc-hidratacao"

Sempre converta a descrição natural do usuário para o slug correspondente.
```

---

## 🚀 PASSO A PASSO PARA APLICAR

### **1. Editar getFluxoInfo:**
1. Clique em "Edit" na function `getFluxoInfo`
2. **Cole a nova descrição** no campo "Description"
3. **Edite a descrição do parâmetro `fluxo_codigo`** (cole a nova descrição)
4. **Altere `required: []` para `required: ["fluxo_codigo"]`**
   - Procure a seção "required" ou marque `fluxo_codigo` como obrigatório
5. Clique em "Save"

### **2. Editar getFerramentaInfo:**
1. Clique em "Edit" na function `getFerramentaInfo`
2. **Cole a nova descrição** no campo "Description"
3. **Edite a descrição do parâmetro `ferramenta_slug`** (cole a nova descrição)
4. **Mantenha `required: ["ferramenta_slug"]`** (já está correto)
5. Clique em "Save"

---

## ✅ APÓS APLICAR

Teste novamente:
1. "Preciso reativar um cliente que sumiu"
   - ✅ Deve chamar `getFluxoInfo({ fluxo_codigo: "reativacao" })`
   - ✅ Deve retornar fluxo de reativação

2. "Quero enviar a calculadora de água para um cliente"
   - ✅ Deve chamar `getFerramentaInfo({ ferramenta_slug: "calculadora-agua" })`
   - ✅ Deve retornar link e script da calculadora

---

## 📋 CHECKLIST

- [ ] Editei a descrição de `getFluxoInfo`
- [ ] Editei a descrição do parâmetro `fluxo_codigo`
- [ ] Alterei `required: []` para `required: ["fluxo_codigo"]` em `getFluxoInfo`
- [ ] Editei a descrição de `getFerramentaInfo`
- [ ] Editei a descrição do parâmetro `ferramenta_slug`
- [ ] Salvei todas as alterações
- [ ] Testei novamente as perguntas que falharam

---

**🚨 AÇÃO URGENTE: Aplique essas correções AGORA para resolver os erros!**















