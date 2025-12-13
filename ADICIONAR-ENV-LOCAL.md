# 📝 Adicionar OPENAI_FUNCTION_SECRET no .env.local

**Data:** 2025-01-27  
**Status:** ✅ Instruções

---

## ✅ SIM, precisa adicionar no `.env.local` também!

A variável `OPENAI_FUNCTION_SECRET` é necessária tanto para:
- ✅ **Produção** (Vercel) - já configurado
- ✅ **Desenvolvimento Local** (`.env.local`) - precisa adicionar

---

## 📋 COMO ADICIONAR NO `.env.local`

### **1. Abra o arquivo `.env.local`**
- Localização: `/Users/air/ylada-app/.env.local`
- Se não existir, crie um novo arquivo

### **2. Adicione esta linha:**

```env
OPENAI_FUNCTION_SECRET=a7694b36214a9bccb4bcf2a31d00a55ac1696f6396af5f365ea24d2da78c7094
```

### **3. Verifique se também tem estas variáveis do NOEL:**

```env
# NOEL Assistant
OPENAI_ASSISTANT_NOEL_ID=asst_xxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_FUNCTION_SECRET=a7694b36214a9bccb4bcf2a31d00a55ac1696f6396af5f365ea24d2da78c7094
```

---

## 🔍 ONDE ADICIONAR NO ARQUIVO

Adicione após as outras variáveis do OpenAI, por exemplo:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
OPENAI_ASSISTANT_CHAT_ID=asst_xxxxxxxxxxxxx
OPENAI_ASSISTANT_CREATOR_ID=asst_xxxxxxxxxxxxx
OPENAI_ASSISTANT_EXPERT_ID=asst_xxxxxxxxxxxxx

# NOEL Assistant (Wellness System)
OPENAI_ASSISTANT_NOEL_ID=asst_xxxxxxxxxxxxx
OPENAI_FUNCTION_SECRET=a7694b36214a9bccb4bcf2a31d00a55ac1696f6396af5f365ea24d2da78c7094
```

---

## ✅ CHECKLIST

- [ ] Adicionei `OPENAI_FUNCTION_SECRET` no `.env.local`
- [ ] Usei o mesmo secret da Vercel: `a7694b36214a9bccb4bcf2a31d00a55ac1696f6396af5f365ea24d2da78c7094`
- [ ] Reiniciei o servidor de desenvolvimento (`npm run dev`)

---

## 🚀 APÓS ADICIONAR

1. **Salve o arquivo** `.env.local`
2. **Reinicie o servidor** (se estiver rodando):
   ```bash
   # Pare o servidor (Ctrl+C)
   # Inicie novamente
   npm run dev
   ```
3. **Teste localmente:**
   - Acesse: `http://localhost:3000/pt/wellness/noel`
   - Pergunte: "Qual é o meu perfil?"
   - Deve funcionar sem erro!

---

## ⚠️ IMPORTANTE

- ✅ Use o **mesmo secret** no `.env.local` e na Vercel
- ✅ O arquivo `.env.local` **NÃO** deve ser commitado no Git (já está no `.gitignore`)
- ✅ O secret é o mesmo para todos os ambientes

---

## 📝 RESUMO

**Você precisa adicionar em 2 lugares:**

1. ✅ **Vercel** (Produção) - já configurado
2. ✅ **`.env.local`** (Desenvolvimento) - adicione agora

**Secret a usar (mesmo em ambos):**
```
a7694b36214a9bccb4bcf2a31d00a55ac1696f6396af5f365ea24d2da78c7094
```

---

**✅ Adicione no `.env.local` e reinicie o servidor!**







