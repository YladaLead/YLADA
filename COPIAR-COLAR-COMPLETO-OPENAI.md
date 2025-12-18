# 📋 COPIAR E COLAR - Functions OpenAI Dashboard

**Data:** 2025-01-27  
**Status:** ✅ Pronto para copiar e colar

---

## 🎯 FUNÇÃO 1: getFluxoInfo

### **COLE ESTA DEFINIÇÃO COMPLETA:**

```json
{
  "name": "getFluxoInfo",
  "description": "Busca informações completas de um fluxo (processo passo a passo) do Sistema Wellness. Retorna título, descrição, scripts, link direto e quando usar.\n\nIMPORTANTE - Mapeamento de palavras-chave para códigos reais:\n- Se o usuário mencionar \"reativar\", \"cliente que sumiu\", \"reativação\", \"retenção\" → use fluxo_codigo: \"fluxo-retencao-cliente\"\n- Se o usuário mencionar \"pós-venda\", \"após venda\", \"onboarding\", \"acompanhamento\" → use fluxo_codigo: \"fluxo-onboarding-cliente\"\n- Se o usuário mencionar \"convite\", \"convidar\", \"oportunidade\" → use fluxo_codigo: \"fluxo-convite-leve\"\n- Se o usuário mencionar \"2-5-10\", \"rotina\", \"método 2-5-10\" → use fluxo_codigo: \"fluxo-2-5-10\"\n- Se o usuário mencionar \"recrutamento\", \"recrutar\" → use fluxo_codigo: \"fluxo-recrutamento-inicial\"\n- Se o usuário mencionar \"venda\", \"energia\" → use fluxo_codigo: \"fluxo-venda-energia\"\n\nCódigos disponíveis: fluxo-2-5-10, fluxo-convite-leve, fluxo-onboarding-cliente, fluxo-recrutamento-inicial, fluxo-retencao-cliente, fluxo-venda-energia\n\nNUNCA chame esta function sem fluxo_codigo. Sempre identifique qual fluxo o usuário precisa baseado nas palavras-chave da mensagem e use o código real correspondente.",
  "parameters": {
    "type": "object",
    "properties": {
      "fluxo_codigo": {
        "type": "string",
        "description": "Código do fluxo. OBRIGATÓRIO. Use um dos códigos reais disponíveis baseado na mensagem do usuário:\n\nCódigos disponíveis:\n- \"fluxo-retencao-cliente\" (para reativar/reter clientes)\n- \"fluxo-onboarding-cliente\" (para pós-venda/onboarding)\n- \"fluxo-convite-leve\" (para convites de negócio)\n- \"fluxo-2-5-10\" (para rotina diária)\n- \"fluxo-recrutamento-inicial\" (para recrutamento)\n- \"fluxo-venda-energia\" (para vendas de energia)\n\nMapeamento de palavras-chave:\n- \"reativar\"/\"retenção\" → \"fluxo-retencao-cliente\"\n- \"pós-venda\"/\"onboarding\" → \"fluxo-onboarding-cliente\"\n- \"convite\" → \"fluxo-convite-leve\"\n- \"2-5-10\"/\"rotina\" → \"fluxo-2-5-10\"\n- \"recrutamento\" → \"fluxo-recrutamento-inicial\"\n- \"venda\"/\"energia\" → \"fluxo-venda-energia\""
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

---

## 🎯 FUNÇÃO 2: getFerramentaInfo

### **COLE ESTA DEFINIÇÃO COMPLETA:**

```json
{
  "name": "getFerramentaInfo",
  "description": "Busca informações de ferramentas e calculadoras do Sistema Wellness. Retorna título, descrição, link personalizado, script e quando usar.\n\nIMPORTANTE - Mapeamento obrigatório de palavras-chave:\n- Se o usuário mencionar \"calculadora de água\", \"água\", \"hidratação\", \"calcular água\" → use ferramenta_slug: \"calculadora-agua\"\n- Se o usuário mencionar \"calculadora de proteína\", \"proteína\" → use ferramenta_slug: \"calculadora-proteina\"\n- Se o usuário mencionar \"calculadora de hidratação\", \"calc hidratação\" → use ferramenta_slug: \"calc-hidratacao\"\n\nSempre converta a descrição do usuário para o slug correspondente (ex: \"calculadora de água\" → \"calculadora-agua\").",
  "parameters": {
    "type": "object",
    "properties": {
      "ferramenta_slug": {
        "type": "string",
        "description": "Slug da ferramenta. OBRIGATÓRIO. Identifique baseado na mensagem do usuário usando este mapeamento:\n- \"calculadora de água\" / \"água\" / \"hidratação\" → \"calculadora-agua\"\n- \"calculadora de proteína\" / \"proteína\" → \"calculadora-proteina\"\n- \"calculadora de hidratação\" / \"calc hidratação\" → \"calc-hidratacao\"\n\nSempre converta a descrição natural do usuário para o slug correspondente."
      }
    },
    "required": ["ferramenta_slug"]
  }
}
```

---

## 🚀 COMO USAR NO OPENAI DASHBOARD

### **PASSO A PASSO:**

1. **Acesse:** https://platform.openai.com/assistants
2. **Abra o Assistant do NOEL**
3. **Vá em "Functions" ou "Tools"**

### **Para getFluxoInfo:**

4. **Encontre a function `getFluxoInfo`**
5. **Clique em "Edit"** (ou editar)
6. **Se houver campo "Definition" ou "Schema":**
   - Selecione todo o conteúdo atual
   - **Cole o JSON completo acima** (primeira função)
   - Clique em "Save"

7. **Se NÃO houver campo "Definition":**
   - **Name:** `getFluxoInfo`
   - **Description:** Cole o texto dentro de `"description"` do JSON
   - **Parameters:** Cole o conteúdo de `"parameters"` do JSON
   - **Required:** Marque `fluxo_codigo` como obrigatório
   - Clique em "Save"

### **Para getFerramentaInfo:**

8. **Encontre a function `getFerramentaInfo`**
9. **Clique em "Edit"** (ou editar)
10. **Repita os passos 6 ou 7 acima** usando o segundo JSON

---

## ✅ CHECKLIST

- [ ] Editei `getFluxoInfo` com o JSON completo
- [ ] Marquei `fluxo_codigo` como **Required** em `getFluxoInfo`
- [ ] Editei `getFerramentaInfo` com o JSON completo
- [ ] Confirmei que `ferramenta_slug` está como **Required** em `getFerramentaInfo`
- [ ] Verifiquei que ambas estão **ativadas/enabled**
- [ ] Salvei todas as alterações

---

## 🧪 TESTE APÓS ATUALIZAR

1. **"Preciso reativar um cliente que sumiu"**
   - ✅ Deve chamar `getFluxoInfo({ fluxo_codigo: "fluxo-retencao-cliente" })`
   - ✅ Deve retornar fluxo completo

2. **"Quero enviar a calculadora de água para um cliente"**
   - ✅ Deve chamar `getFerramentaInfo({ ferramenta_slug: "calculadora-agua" })`
   - ✅ Deve retornar link e script

---

**✅ Pronto! Copie e cole os JSONs acima no OpenAI Dashboard!**

















