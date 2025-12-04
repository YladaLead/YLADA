# 🤖 NOEL ChatKit - Análise e Configuração

## ✅ Análise das Informações Recebidas

### **1. Add Domain (Domínios Permitidos)**

**✅ CORRETO**

Você precisa adicionar os domínios onde o ChatKit vai funcionar:

**Para Desenvolvimento:**
```
http://localhost:3000
```

**Para Produção (quando publicar):**
```
https://ylada.com
```
ou
```
https://wellness.ylada.com
```
ou
```
https://seu-dominio.vercel.app
```

**Importante:**
- ✅ Você pode adicionar **múltiplos domínios**
- ✅ ChatKit **só funciona** em domínios autorizados
- ✅ Adicione **localhost** para testar localmente
- ✅ Adicione o **domínio de produção** quando publicar

---

### **2. Workflow ID**

**✅ CORRETO**

**ID do seu Workflow:**
```
wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa
```

**O que fazer:**
- ✅ **NÃO modifique** esse ID
- ✅ **Copie** esse ID para usar no frontend
- ✅ Esse ID identifica o fluxo específico do seu Agent

**Onde usar:**
- No `.env.local` (desenvolvimento)
- No Vercel Environment Variables (produção)
- No componente ChatKit do Next.js

---

### **3. Current Version**

**✅ CORRETO**

**Versão atual:** `version="1"`

**O que significa:**
- ✅ Você está usando a **primeira versão publicada**
- ✅ Se atualizar e publicar novamente, vira "2", "3", etc.
- ✅ Você pode escolher qual versão usar no frontend

**Opções:**

**Opção 1: Sempre usar a versão mais recente (recomendado)**
```env
# Deixe em branco ou não defina
# NEXT_PUBLIC_CHATKIT_VERSION=
```

**Opção 2: Travar em uma versão específica**
```env
NEXT_PUBLIC_CHATKIT_VERSION=1
```

---

## 📝 Variáveis de Ambiente Necessárias

### **Para o Frontend (.env.local):**

```env
# OpenAI API Key (se ainda não tiver)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# ChatKit Workflow ID (obrigatório)
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa

# ChatKit Domain Public Key (obrigatório)
NEXT_PUBLIC_CHATKIT_DOMAIN_PK=domain_pk_693160512e7481948351882cd60488950e01b17d570e9d19

# ChatKit Version (opcional - deixe em branco para sempre usar a mais recente)
NEXT_PUBLIC_CHATKIT_VERSION=1
```

**OU** (para sempre usar a versão mais recente):

```env
# OpenAI API Key
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# ChatKit Workflow ID
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa

# Version (omitir = sempre usar produção/mais recente)
# NEXT_PUBLIC_CHATKIT_VERSION=
```

---

## 🔧 Como Usar no Código Next.js

### **Exemplo de Componente ChatKit:**

```tsx
import { Chat } from '@openai/chatkit-react'

export default function NoelChat() {
  return (
    <Chat
      workflow={{
        id: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID!,
        version: process.env.NEXT_PUBLIC_CHATKIT_VERSION || undefined, // undefined = sempre mais recente
      }}
    />
  )
}
```

**OU** (se quiser sempre usar a versão mais recente):

```tsx
import { Chat } from '@openai/chatkit-react'

export default function NoelChat() {
  return (
    <Chat
      workflow={{
        id: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID!,
        // Sem version = sempre usa a versão mais recente
      }}
    />
  )
}
```

---

## ✅ Checklist de Configuração

### **1. No Agent Builder (OpenAI Platform):**
- [ ] Adicionar domínio `http://localhost:3000` (para desenvolvimento)
- [ ] Adicionar domínio de produção quando publicar (ex: `https://ylada.com`)
- [ ] Copiar Workflow ID: `wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa`
- [ ] Anotar versão atual: `1`

### **2. No .env.local (Desenvolvimento):**
- [ ] Adicionar `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa`
- [ ] Adicionar `NEXT_PUBLIC_CHATKIT_DOMAIN_PK=domain_pk_693160512e7481948351882cd60488950e01b17d570e9d19`
- [ ] (Opcional) Adicionar `NEXT_PUBLIC_CHATKIT_VERSION=1` se quiser travar versão
- [ ] Ou deixar version em branco para sempre usar a mais recente

### **3. No Vercel (Produção):**
- [ ] Adicionar `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` nas Environment Variables
- [ ] Adicionar `NEXT_PUBLIC_CHATKIT_DOMAIN_PK` nas Environment Variables
- [ ] (Opcional) Adicionar `NEXT_PUBLIC_CHATKIT_VERSION` se quiser travar versão
- [ ] Adicionar domínio de produção no Agent Builder

### **4. No Código:**
- [ ] Instalar `@openai/chatkit-react` (se ainda não tiver)
- [ ] Criar componente usando o Workflow ID
- [ ] Integrar na página do NOEL

---

## 🎯 Resumo Rápido

| Campo | O que fazer |
|-------|-------------|
| **Add Domain** | Adicionar `localhost:3000` (dev) + domínio de produção |
| **Workflow ID** | Copiar para `.env.local` como `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` |
| **Domain Public Key** | Copiar para `.env.local` como `NEXT_PUBLIC_CHATKIT_DOMAIN_PK` |
| **Version** | Opcional - deixar em branco = sempre mais recente, ou fixar com `NEXT_PUBLIC_CHATKIT_VERSION=1` |

---

## ✅ Confirmação

**Todas as informações estão CORRETAS!**

1. ✅ **Add Domain**: Correto - adicione localhost e domínio de produção
2. ✅ **Workflow ID**: Correto - copie para o .env
3. ✅ **Version**: Correto - opcional, pode omitir para sempre usar a mais recente

**Próximos passos:**
1. Adicionar domínios no Agent Builder
2. Adicionar variáveis no `.env.local`
3. Instalar `@openai/chatkit-react` (se necessário)
4. Criar componente ChatKit
5. Integrar na página do NOEL

---

**Status:** ✅ Informações validadas e prontas para implementação

