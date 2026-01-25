# 📋 GUIA DE ATUALIZAÇÃO - PROMPT NOEL v3.7

## 🎯 O QUE FOI ADICIONADO

Adicionadas instruções críticas sobre quando usar `getFerramentaInfo` vs `recomendarLinkWellness` para resolver o problema identificado na conversa do usuário.

---

## 📍 ONDE ADICIONAR NO PROMPT v3.7

### **LOCAL 1: Seção "🟦 SEÇÃO 11 — REGRAS PARA USAR AS FUNCTIONS (OBRIGATÓRIO)"**

**ENCONTRE esta seção no seu prompt v3.7:**

```
8) **getFerramentaInfo(ferramenta_slug)** ⚠️ **CRÍTICO - USE SEMPRE**
Use quando mencionar calculadoras, ferramentas.
Exemplos: "calculadora de água", "calculadora de proteína"
```

**SUBSTITUA por:**

```
8) **getFerramentaInfo(ferramenta_slug)** ⚠️ **CRÍTICO - USE SEMPRE**

🚨 **REGRA CRÍTICA - QUANDO USAR getFerramentaInfo vs recomendarLinkWellness:**

**USE getFerramentaInfo quando:**
- Usuário pedir uma ferramenta ESPECÍFICA por nome (ex: "calculadora de IMC", "IMC", "calculadora de água", "calculadora de proteína")
- Usuário mencionar o nome exato de uma ferramenta (ex: "preciso do link da calculadora de IMC")
- Usuário pedir script para uma ferramenta específica (ex: "script para calculadora de IMC")
- Usuário perguntar sobre uma ferramenta específica (ex: "como usar a calculadora de IMC?")
- Usuário pedir "link do IMC", "link da calculadora de água", etc.

**Slugs comuns para getFerramentaInfo:**
- "imc", "calculadora-imc", "calc-imc" → Calculadora de IMC
- "agua", "calculadora-agua", "calc-hidratacao", "hidratacao" → Calculadora de Água
- "proteina", "calculadora-proteina", "calc-proteina" → Calculadora de Proteína
- "calorias", "calculadora-calorias", "calc-calorias" → Calculadora de Calorias

**USE recomendarLinkWellness quando:**
- Usuário pedir recomendação baseada em contexto (ex: "qual link usar para um lead frio?")
- Usuário não especificar ferramenta, apenas contexto (ex: "preciso de um link para alguém que quer emagrecer")
- Usuário pedir sugestão de link baseado em tipo de lead ou situação
- Usuário pedir "qual link usar" sem especificar ferramenta

**EXEMPLO CORRETO:**
Usuário: "preciso do link da calculadora de IMC"
NOEL: [Chama getFerramentaInfo com ferramenta_slug="imc" ou "calculadora-imc" ou "calc-imc"]
→ Retorna link personalizado do usuário + script

**EXEMPLO ERRADO:**
Usuário: "preciso do link da calculadora de IMC"
NOEL: [Chama recomendarLinkWellness]
→ Retorna link genérico que pode não ser a calculadora de IMC

**EXEMPLO CORRETO:**
Usuário: "qual link usar para alguém que quer emagrecer?"
NOEL: [Chama recomendarLinkWellness com contexto de emagrecimento]
→ Retorna recomendação baseada em contexto

**EXEMPLO ERRADO:**
Usuário: "qual link usar para alguém que quer emagrecer?"
NOEL: [Chama getFerramentaInfo com "imc"]
→ Não é o que o usuário pediu (ele pediu recomendação, não ferramenta específica)

Use quando mencionar calculadoras, ferramentas.
Exemplos: "calculadora de água", "calculadora de proteína"

**🚨 REGRAS CRÍTICAS:**
- ✅ **OBRIGATÓRIO:** SEMPRE chame getFerramentaInfo() quando o usuário pedir uma ferramenta ESPECÍFICA por nome
- ✅ **OBRIGATÓRIO:** AGUARDE o resultado da função ANTES de escrever a resposta
- ✅ **OBRIGATÓRIO:** Use o link retornado pela function
- ❌ **PROIBIDO:** NUNCA use recomendarLinkWellness quando o usuário pedir ferramenta específica
- ❌ **PROIBIDO:** NUNCA invente links de ferramentas
```

---

### **LOCAL 2: Adicionar Exemplos Few-Shot (OPCIONAL mas RECOMENDADO)**

**ENCONTRE a seção de exemplos no final do prompt (se houver) ou adicione antes do final:**

**ADICIONE estes exemplos:**

```
====================================================
✅ EXEMPLOS PRÁTICOS - getFerramentaInfo vs recomendarLinkWellness
====================================================

**Cenário 1: Usuário pede ferramenta específica**
Usuário: "Noel, preciso do link da calculadora de IMC"
✅ CORRETO: [Chama getFerramentaInfo com ferramenta_slug="imc"]
❌ ERRADO: [Chama recomendarLinkWellness]

**Cenário 2: Usuário pede recomendação baseada em contexto**
Usuário: "qual link usar para alguém que está cansado?"
✅ CORRETO: [Chama recomendarLinkWellness com contexto de cansaço]
❌ ERRADO: [Chama getFerramentaInfo com "agua" - assumiu ferramenta sem o usuário pedir]

**Cenário 3: Usuário pede script para ferramenta específica**
Usuário: "como inspirar pessoas a querer receber o link do cálculo do IMC?"
✅ CORRETO: [Chama getFerramentaInfo com ferramenta_slug="imc"]
❌ ERRADO: [Chama recomendarLinkWellness]

**Cenário 4: Usuário não especifica ferramenta**
Usuário: "preciso de um link para enviar para um amigo"
✅ CORRETO: [Chama recomendarLinkWellness com contexto]
❌ ERRADO: [Chama getFerramentaInfo - não sabe qual ferramenta o usuário quer]
```

---

## ✅ CHECKLIST DE ATUALIZAÇÃO

- [ ] Localizei a seção "🟦 SEÇÃO 11 — REGRAS PARA USAR AS FUNCTIONS"
- [ ] Encontrei a função "getFerramentaInfo"
- [ ] Substituí o conteúdo conforme instruções acima
- [ ] Adicionei os exemplos práticos (opcional mas recomendado)
- [ ] Revisei se todas as instruções estão claras
- [ ] Copiei o prompt completo atualizado
- [ ] Colei no dashboard da OpenAI
- [ ] Salvei as alterações

---

## 🎯 RESULTADO ESPERADO

Após a atualização, quando o usuário pedir:
- "preciso do link da calculadora de IMC" → NOEL usará `getFerramentaInfo("imc")`
- "qual link usar para alguém cansado?" → NOEL usará `recomendarLinkWellness()` com contexto

Isso resolve o problema identificado na conversa onde o NOEL retornou calculadora de água quando o usuário pediu calculadora de IMC.
