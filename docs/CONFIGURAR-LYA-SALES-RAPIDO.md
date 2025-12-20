# ⚡ Configurar LYA Sales - Guia Rápido

## 🚨 Problema Atual

O chat da LYA na página de vendas está dando erro: **"LYA Sales não configurado"**

Isso acontece porque falta configurar um **Assistant ID** no OpenAI.

---

## ✅ Solução Rápida (5 minutos)

### **Passo 1: Criar Assistant no OpenAI**

1. Acesse: https://platform.openai.com/assistants
2. Clique em **"Create Assistant"** (ou **"+ Create"**)
3. Preencha:
   - **Name:** `LYA Sales - YLADA Nutri`
   - **Model:** `gpt-4o-mini` (mais barato) ou `gpt-4-turbo` (melhor qualidade)
   - **Instructions:** Cole o conteúdo do arquivo `docs/LYA-SALES-PROMPT.md` (linhas 18-144)

4. Clique em **"Save"**

### **Passo 2: Copiar Assistant ID**

1. Após criar, você verá o **Assistant ID** (começa com `asst_`)
2. Copie esse ID completo

### **Passo 3: Adicionar no .env.local**

1. Abra o arquivo `.env.local` na raiz do projeto
2. Adicione a linha:
   ```env
   OPENAI_ASSISTANT_LYA_SALES_ID=asst_seu_id_aqui
   ```
3. Substitua `asst_seu_id_aqui` pelo ID que você copiou

### **Passo 4: Reiniciar o Servidor**

```bash
# Pare o servidor (Ctrl+C) e inicie novamente
npm run dev
```

---

## 🎯 Exemplo Completo

Seu `.env.local` deve ter algo assim:

```env
# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# LYA Sales (página de vendas)
OPENAI_ASSISTANT_LYA_SALES_ID=asst_xxxxxxxxxxxxx

# Outras configurações...
```

---

## ✅ Como Verificar se Funcionou

1. Acesse: `http://localhost:3000/pt/nutri`
2. Clique no botão "💬 Fale Conosco"
3. Envie uma mensagem (ex: "Tenho dúvidas sobre a Formação")
4. A LYA deve responder normalmente (sem erro)

---

## 🔄 Alternativa: Usar Assistant Geral

Se você já tem um Assistant ID da LYA configurado (não específico de vendas), pode usar como fallback:

```env
OPENAI_ASSISTANT_LYA_ID=asst_xxxxxxxxxxxxx
```

Mas é **recomendado** criar um Assistant específico para vendas com o prompt correto.

---

## 📝 Onde Está o Prompt?

O prompt para o Assistant está em:
- **Arquivo:** `docs/LYA-SALES-PROMPT.md`
- **Linhas:** 18-144 (cole todo o conteúdo entre as linhas 18 e 144)

---

## ❓ Dúvidas?

- Verifique se o `OPENAI_API_KEY` está configurado
- Verifique se o Assistant ID está correto (deve começar com `asst_`)
- Verifique os logs do servidor para ver erros específicos
- Veja o guia completo: `docs/COMO-TESTAR-LYA-SALES.md`

---

**Última atualização:** 2024-12-16

