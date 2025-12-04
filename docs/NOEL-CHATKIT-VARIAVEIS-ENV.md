# 🔑 NOEL ChatKit - Variáveis de Ambiente

## 📋 Variáveis Necessárias para .env.local

```env
# OpenAI API Key (se ainda não tiver)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# ChatKit Workflow ID (obrigatório)
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa

# ChatKit Domain Public Key (obrigatório)
NEXT_PUBLIC_CHATKIT_DOMAIN_PK=domain_pk_693160512e7481948351882cd60488950e01b17d570e9d19

# ChatKit Version (opcional - omitir para sempre usar a mais recente)
# NEXT_PUBLIC_CHATKIT_VERSION=1
```

---

## ✅ Checklist Rápido

- [ ] `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` - ID do workflow
- [ ] `NEXT_PUBLIC_CHATKIT_DOMAIN_PK` - Chave pública do domínio
- [ ] `NEXT_PUBLIC_CHATKIT_VERSION` - (Opcional) Versão do workflow

---

## 📝 Explicação das Variáveis

### **1. NEXT_PUBLIC_CHATKIT_WORKFLOW_ID**
- **O que é:** ID do workflow/agent criado no Agent Builder
- **Valor:** `wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa`
- **Obrigatório:** ✅ Sim

### **2. NEXT_PUBLIC_CHATKIT_DOMAIN_PK**
- **O que é:** Chave pública do domínio (gerada quando você adiciona um domínio)
- **Valor:** `domain_pk_693160512e7481948351882cd60488950e01b17d570e9d19`
- **Obrigatório:** ✅ Sim

### **3. NEXT_PUBLIC_CHATKIT_VERSION**
- **O que é:** Versão específica do workflow (opcional)
- **Valor:** `1` (ou omitir para sempre usar a mais recente)
- **Obrigatório:** ❌ Não

---

## 🚀 Pronto para Usar

Copie e cole essas variáveis no seu `.env.local` e você estará pronto para integrar o ChatKit!

---

**Status:** ✅ Todas as variáveis documentadas

