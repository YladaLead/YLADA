# 🔧 ATUALIZAR FUNCTIONS NO OPENAI - Códigos Reais

**Data:** 2025-01-27  
**Status:** ✅ Códigos identificados

---

## 📋 CÓDIGOS REAIS DOS FLUXOS

### **Fluxos Disponíveis:**
1. `fluxo-2-5-10` - Fluxo 2-5-10
2. `fluxo-convite-leve` - Fluxo de Convite Leve
3. `fluxo-onboarding-cliente` - Fluxo de Onboarding - Cliente
4. `fluxo-recrutamento-inicial` - Fluxo de Recrutamento Inicial
5. `fluxo-retencao-cliente` - Fluxo de Retenção - Cliente
6. `fluxo-venda-energia` - Fluxo de Venda - Energia

---

## 🔄 MAPEAMENTO: Códigos Esperados → Códigos Reais

| Código Esperado | Código Real | Descrição |
|----------------|-------------|-----------|
| `reativacao` | `fluxo-retencao-cliente` | Reativação/Retenção de cliente |
| `pos-venda` | `fluxo-onboarding-cliente` | Pós-venda/Onboarding |
| `convite-leve` | `fluxo-convite-leve` | Convite leve |
| `2-5-10` | `fluxo-2-5-10` | Rotina 2-5-10 |
| `recrutamento` | `fluxo-recrutamento-inicial` | Recrutamento |
| `venda` | `fluxo-venda-energia` | Venda de energia |

---

## ✅ ATUALIZAÇÃO DA FUNCTION getFluxoInfo

### **Nova Descrição (Cole no OpenAI Dashboard):**

```
Busca informações completas de um fluxo (processo passo a passo) do Sistema Wellness. Retorna título, descrição, scripts, link direto e quando usar.

IMPORTANTE - Mapeamento de palavras-chave para códigos reais:
- Se o usuário mencionar "reativar", "cliente que sumiu", "reativação", "retenção" → use fluxo_codigo: "fluxo-retencao-cliente"
- Se o usuário mencionar "pós-venda", "após venda", "onboarding", "acompanhamento" → use fluxo_codigo: "fluxo-onboarding-cliente"
- Se o usuário mencionar "convite", "convidar", "oportunidade" → use fluxo_codigo: "fluxo-convite-leve"
- Se o usuário mencionar "2-5-10", "rotina", "método 2-5-10" → use fluxo_codigo: "fluxo-2-5-10"
- Se o usuário mencionar "recrutamento", "recrutar" → use fluxo_codigo: "fluxo-recrutamento-inicial"
- Se o usuário mencionar "venda", "energia" → use fluxo_codigo: "fluxo-venda-energia"

Códigos disponíveis: fluxo-2-5-10, fluxo-convite-leve, fluxo-onboarding-cliente, fluxo-recrutamento-inicial, fluxo-retencao-cliente, fluxo-venda-energia

NUNCA chame esta function sem fluxo_codigo. Sempre identifique qual fluxo o usuário precisa baseado nas palavras-chave da mensagem e use o código real correspondente.
```

### **Nova Descrição do Parâmetro `fluxo_codigo`:**

```
Código do fluxo. OBRIGATÓRIO. Use um dos códigos reais disponíveis baseado na mensagem do usuário:

Códigos disponíveis:
- "fluxo-retencao-cliente" (para reativar/reter clientes)
- "fluxo-onboarding-cliente" (para pós-venda/onboarding)
- "fluxo-convite-leve" (para convites de negócio)
- "fluxo-2-5-10" (para rotina diária)
- "fluxo-recrutamento-inicial" (para recrutamento)
- "fluxo-venda-energia" (para vendas de energia)

Mapeamento de palavras-chave:
- "reativar"/"retenção" → "fluxo-retencao-cliente"
- "pós-venda"/"onboarding" → "fluxo-onboarding-cliente"
- "convite" → "fluxo-convite-leve"
- "2-5-10"/"rotina" → "fluxo-2-5-10"
- "recrutamento" → "fluxo-recrutamento-inicial"
- "venda"/"energia" → "fluxo-venda-energia"
```

---

## 🚀 COMO APLICAR

### **1. Acessar OpenAI Dashboard**
1. Acesse: https://platform.openai.com/assistants
2. Abra o Assistant do NOEL
3. Vá em "Functions" ou "Tools"
4. Encontre a function `getFluxoInfo`
5. Clique em "Edit"

### **2. Atualizar Descrição**
1. Cole a nova descrição completa (acima)
2. Atualize a descrição do parâmetro `fluxo_codigo` (acima)
3. **Mantenha `required: ["fluxo_codigo"]`**
4. Clique em "Save"

---

## ✅ CORREÇÃO NO CÓDIGO

A function `getFluxoInfo` já foi atualizada para:
1. ✅ Mapear automaticamente códigos esperados para códigos reais
2. ✅ Fazer busca flexível se o código não existir
3. ✅ Retornar lista de fluxos disponíveis se não encontrar

**Exemplo:**
- Assistants API chama: `getFluxoInfo({ fluxo_codigo: "reativacao" })`
- Código mapeia para: `"fluxo-retencao-cliente"`
- Busca no banco: ✅ Encontra!

---

## 🧪 TESTE APÓS ATUALIZAR

**Teste estas perguntas:**
1. "Preciso reativar um cliente que sumiu"
   - ✅ Deve chamar com `fluxo_codigo: "fluxo-retencao-cliente"` (ou mapear de "reativacao")
2. "Quero enviar a calculadora de água para um cliente"
   - ✅ Deve funcionar (slug existe)

---

## 📋 CHECKLIST

- [x] Códigos reais identificados
- [x] Mapeamento criado no código
- [x] Function `getFluxoInfo` atualizada
- [ ] Descrição atualizada no OpenAI Dashboard
- [ ] Testado "Preciso reativar um cliente que sumiu"
- [ ] Testado "Quero enviar a calculadora de água"

---

**✅ Atualize a descrição no OpenAI Dashboard e teste!**



