# 📋 DEFINITIONS COMPLETAS - Functions OpenAI Dashboard

**Data:** 2025-01-27  
**Status:** ✅ Pronto para copiar e colar

---

## 🎯 FUNÇÃO 1: getFluxoInfo

### **COLE ESTA DEFINIÇÃO COMPLETA:**

```json
{
  "name": "getFluxoInfo",
  "description": "Busca informações completas de um fluxo (processo passo a passo) do Sistema Wellness. Retorna título, descrição, scripts, link direto e quando usar.\n\nIMPORTANTE - Mapeamento obrigatório de palavras-chave:\n- Se o usuário mencionar 'reativar', 'cliente que sumiu', 'reativação', 'reativar cliente' → use fluxo_codigo: 'reativacao'\n- Se o usuário mencionar 'pós-venda', 'após venda', 'depois da venda', 'acompanhamento' → use fluxo_codigo: 'pos-venda'\n- Se o usuário mencionar 'convite', 'convidar', 'oportunidade', 'negócio' → use fluxo_codigo: 'convite-leve'\n- Se o usuário mencionar '2-5-10', 'rotina', 'método 2-5-10' → use fluxo_codigo: '2-5-10'\n\nNUNCA chame esta function sem fluxo_codigo. Sempre identifique qual fluxo o usuário precisa baseado nas palavras-chave da mensagem.",
  "parameters": {
    "type": "object",
    "properties": {
      "fluxo_codigo": {
        "type": "string",
        "description": "Código do fluxo. OBRIGATÓRIO. Identifique baseado na mensagem do usuário usando este mapeamento:\n- 'reativar' / 'cliente que sumiu' / 'reativação' → 'reativacao'\n- 'pós-venda' / 'após venda' / 'depois da venda' → 'pos-venda'\n- 'convite' / 'oportunidade' / 'convidar' → 'convite-leve'\n- '2-5-10' / 'rotina' / 'método 2-5-10' → '2-5-10'\n\nSempre use um destes códigos baseado no contexto da mensagem do usuário."
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
  "description": "Busca informações de ferramentas e calculadoras do Sistema Wellness. Retorna título, descrição, link personalizado, script e quando usar.\n\nIMPORTANTE - Mapeamento obrigatório de palavras-chave:\n- Se o usuário mencionar 'calculadora de água', 'água', 'hidratação', 'calcular água' → use ferramenta_slug: 'calculadora-agua'\n- Se o usuário mencionar 'calculadora de proteína', 'proteína' → use ferramenta_slug: 'calculadora-proteina'\n- Se o usuário mencionar 'calculadora de hidratação', 'calc hidratação' → use ferramenta_slug: 'calc-hidratacao'\n\nSempre converta a descrição do usuário para o slug correspondente (ex: 'calculadora de água' → 'calculadora-agua').",
  "parameters": {
    "type": "object",
    "properties": {
      "ferramenta_slug": {
        "type": "string",
        "description": "Slug da ferramenta. OBRIGATÓRIO. Identifique baseado na mensagem do usuário usando este mapeamento:\n- 'calculadora de água' / 'água' / 'hidratação' → 'calculadora-agua'\n- 'calculadora de proteína' / 'proteína' → 'calculadora-proteina'\n- 'calculadora de hidratação' / 'calc hidratação' → 'calc-hidratacao'\n\nSempre converta a descrição natural do usuário para o slug correspondente."
      }
    },
    "required": ["ferramenta_slug"]
  }
}
```

---

## 🚀 COMO USAR

### **OPÇÃO 1: Copiar JSON Completo (Recomendado)**

1. **Para getFluxoInfo:**
   - Abra a function `getFluxoInfo` no OpenAI Dashboard
   - Clique em "Edit"
   - Se houver opção "Generate" ou "Import JSON", use-a
   - Cole o JSON completo acima (primeira função)
   - Clique em "Save"

2. **Para getFerramentaInfo:**
   - Abra a function `getFerramentaInfo` no OpenAI Dashboard
   - Clique em "Edit"
   - Se houver opção "Generate" ou "Import JSON", use-a
   - Cole o JSON completo acima (segunda função)
   - Clique em "Save"

### **OPÇÃO 2: Preencher Campos Manualmente**

Se não houver opção de importar JSON, preencha manualmente:

#### **getFluxoInfo:**

1. **Name:** `getFluxoInfo`

2. **Description:** Cole este texto:
```
Busca informações completas de um fluxo (processo passo a passo) do Sistema Wellness. Retorna título, descrição, scripts, link direto e quando usar.

IMPORTANTE - Mapeamento obrigatório de palavras-chave:
- Se o usuário mencionar 'reativar', 'cliente que sumiu', 'reativação', 'reativar cliente' → use fluxo_codigo: 'reativacao'
- Se o usuário mencionar 'pós-venda', 'após venda', 'depois da venda', 'acompanhamento' → use fluxo_codigo: 'pos-venda'
- Se o usuário mencionar 'convite', 'convidar', 'oportunidade', 'negócio' → use fluxo_codigo: 'convite-leve'
- Se o usuário mencionar '2-5-10', 'rotina', 'método 2-5-10' → use fluxo_codigo: '2-5-10'

NUNCA chame esta function sem fluxo_codigo. Sempre identifique qual fluxo o usuário precisa baseado nas palavras-chave da mensagem.
```

3. **Parameters:**
   - Adicione parâmetro `fluxo_codigo`:
     - Type: `string`
     - Description: Cole este texto:
     ```
     Código do fluxo. OBRIGATÓRIO. Identifique baseado na mensagem do usuário usando este mapeamento:
     - 'reativar' / 'cliente que sumiu' / 'reativação' → 'reativacao'
     - 'pós-venda' / 'após venda' / 'depois da venda' → 'pos-venda'
     - 'convite' / 'oportunidade' / 'convidar' → 'convite-leve'
     - '2-5-10' / 'rotina' / 'método 2-5-10' → '2-5-10'
     
     Sempre use um destes códigos baseado no contexto da mensagem do usuário.
     ```
     - ✅ Marque como **Required** (obrigatório)
   
   - Adicione parâmetro `fluxo_id`:
     - Type: `string`
     - Description: `ID UUID do fluxo (alternativa ao código, use apenas se souber o ID exato)`
     - ❌ NÃO marque como Required

4. **Required:** Marque apenas `fluxo_codigo` como obrigatório

#### **getFerramentaInfo:**

1. **Name:** `getFerramentaInfo`

2. **Description:** Cole este texto:
```
Busca informações de ferramentas e calculadoras do Sistema Wellness. Retorna título, descrição, link personalizado, script e quando usar.

IMPORTANTE - Mapeamento obrigatório de palavras-chave:
- Se o usuário mencionar 'calculadora de água', 'água', 'hidratação', 'calcular água' → use ferramenta_slug: 'calculadora-agua'
- Se o usuário mencionar 'calculadora de proteína', 'proteína' → use ferramenta_slug: 'calculadora-proteina'
- Se o usuário mencionar 'calculadora de hidratação', 'calc hidratação' → use ferramenta_slug: 'calc-hidratacao'

Sempre converta a descrição do usuário para o slug correspondente (ex: 'calculadora de água' → 'calculadora-agua').
```

3. **Parameters:**
   - Adicione parâmetro `ferramenta_slug`:
     - Type: `string`
     - Description: Cole este texto:
     ```
     Slug da ferramenta. OBRIGATÓRIO. Identifique baseado na mensagem do usuário usando este mapeamento:
     - 'calculadora de água' / 'água' / 'hidratação' → 'calculadora-agua'
     - 'calculadora de proteína' / 'proteína' → 'calculadora-proteina'
     - 'calculadora de hidratação' / 'calc hidratação' → 'calc-hidratacao'
     
     Sempre converta a descrição natural do usuário para o slug correspondente.
     ```
     - ✅ Marque como **Required** (obrigatório)

4. **Required:** Marque `ferramenta_slug` como obrigatório

---

## ✅ CHECKLIST FINAL

- [ ] Editei `getFluxoInfo` com a nova definição completa
- [ ] Marquei `fluxo_codigo` como **Required** em `getFluxoInfo`
- [ ] Editei `getFerramentaInfo` com a nova definição completa
- [ ] Confirmei que `ferramenta_slug` está como **Required** em `getFerramentaInfo`
- [ ] Salvei todas as alterações
- [ ] Testei novamente as perguntas que falharam

---

## 🧪 TESTES APÓS APLICAR

1. **"Preciso reativar um cliente que sumiu"**
   - ✅ Deve chamar `getFluxoInfo({ fluxo_codigo: "reativacao" })`
   - ✅ Deve retornar fluxo completo

2. **"Quero enviar a calculadora de água para um cliente"**
   - ✅ Deve chamar `getFerramentaInfo({ ferramenta_slug: "calculadora-agua" })`
   - ✅ Deve retornar link e script

---

**✅ Pronto! Cole essas definições completas no OpenAI Dashboard!**















