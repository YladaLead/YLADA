# 📝 NOEL Assistants - Nomenclatura e Organização

## ✅ Resposta Rápida

**NÃO faz diferença o nome que você coloca na plataforma OpenAI!**

O que importa é apenas o **ID do Assistant** (`asst_...`). O nome é apenas para **organização visual** na plataforma.

---

## 🎯 Como Funciona

### **Na Plataforma OpenAI:**
- **Nome:** Qualquer nome que você quiser (ex: "Wellness Mentor", "NOEL Mentor", "Mentor YLADA")
- **ID:** O que realmente importa (ex: `asst_pu4Tpeox9tIdP0s2i6UhX6Em`)
- **System Instructions:** O prompt completo que define o comportamento

### **No Código (.env.local):**
- Usamos apenas o **ID**, não o nome
- Exemplo:
  ```env
  OPENAI_ASSISTANT_NOEL_MENTOR_ID=asst_pu4Tpeox9tIdP0s2i6UhX6Em
  ```

### **No Código (TypeScript):**
- Buscamos o Assistant pelo **ID** via API
- O nome na plataforma não é usado no código

---

## 📋 Sugestão de Nomenclatura (Opcional)

Para **organização**, você pode usar:

### **Na Plataforma OpenAI:**
- ✅ "Wellness Mentor" (ou "NOEL Mentor")
- ✅ "Wellness Suporte" (ou "NOEL Suporte")
- ✅ "Wellness Técnico" (ou "NOEL Técnico")

### **No .env.local:**
```env
# NOEL Wellness Assistants
OPENAI_ASSISTANT_NOEL_MENTOR_ID=asst_pu4Tpeox9tIdP0s2i6UhX6Em
OPENAI_ASSISTANT_NOEL_SUPORTE_ID=asst_xxxxxxxxxxxxx
OPENAI_ASSISTANT_NOEL_TECNICO_ID=asst_xxxxxxxxxxxxx
```

### **No Código:**
- Usamos constantes para referenciar:
  ```typescript
  const MENTOR_ID = process.env.OPENAI_ASSISTANT_NOEL_MENTOR_ID
  const SUPORTE_ID = process.env.OPENAI_ASSISTANT_NOEL_SUPORTE_ID
  const TECNICO_ID = process.env.OPENAI_ASSISTANT_NOEL_TECNICO_ID
  ```

---

## 🔍 Exemplo Prático

### **Cenário 1: Nome diferente**
- **Na OpenAI:** "Wellness Mentor"
- **No .env:** `OPENAI_ASSISTANT_NOEL_MENTOR_ID=asst_pu4Tpeox9tIdP0s2i6UhX6Em`
- **Resultado:** ✅ Funciona perfeitamente!

### **Cenário 2: Nome igual**
- **Na OpenAI:** "NOEL Mentor"
- **No .env:** `OPENAI_ASSISTANT_NOEL_MENTOR_ID=asst_pu4Tpeox9tIdP0s2i6UhX6Em`
- **Resultado:** ✅ Funciona perfeitamente!

**Conclusão:** O nome não importa, apenas o ID!

---

## ⚠️ O Que REALMENTE Importa

1. ✅ **ID do Assistant** (obrigatório)
2. ✅ **System Instructions** (o prompt completo)
3. ✅ **Modelo configurado** (gpt-4o ou gpt-4o-mini)
4. ❌ **Nome na plataforma** (apenas visual)

---

## 📝 Resumo

- **Nome na OpenAI:** Pode ser qualquer coisa (ex: "Wellness Mentor")
- **ID:** É o que usamos no código (ex: `asst_pu4Tpeox9tIdP0s2i6UhX6Em`)
- **System Instructions:** O prompt completo que define o comportamento
- **Resultado:** Nome não afeta funcionamento, apenas organização visual

---

**Status:** ✅ Entendido - Nome é apenas visual, ID é o que importa!

