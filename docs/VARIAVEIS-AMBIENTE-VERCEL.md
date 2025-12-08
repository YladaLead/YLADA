# 🔧 VARIÁVEIS DE AMBIENTE - VERCEL

**Status:** ⚠️ **VERIFICAR ANTES DO DEPLOY**

---

## 📋 VARIÁVEIS NECESSÁRIAS

### **1. OPENAI_ASSISTANT_NOEL_ID** (CRÍTICO)
```
Valor: asst_pu4Tpeox9tIdP0s2i6UhX6Em
Ambiente: Production, Preview, Development
```

**Como verificar:**
1. Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. Procurar por `OPENAI_ASSISTANT_NOEL_ID`
3. Se não existir, adicionar com o valor acima

---

### **2. OPENAI_API_KEY** (CRÍTICO)
```
Valor: sk-... (sua chave da OpenAI)
Ambiente: Production, Preview, Development
```

**Como verificar:**
1. Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. Procurar por `OPENAI_API_KEY`
3. Se não existir, adicionar com sua chave

---

### **3. NEXT_PUBLIC_APP_URL** (RECOMENDADO)
```
Valor: https://www.ylada.com
Ambiente: Production
```

**Como verificar:**
1. Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. Procurar por `NEXT_PUBLIC_APP_URL`
3. Se não existir, adicionar com o valor acima

---

## ✅ CHECKLIST RÁPIDO

- [ ] `OPENAI_ASSISTANT_NOEL_ID` configurado na Vercel
- [ ] `OPENAI_API_KEY` configurado na Vercel
- [ ] `NEXT_PUBLIC_APP_URL` configurado na Vercel (opcional mas recomendado)

---

## 🚨 SE NÃO ESTIVEREM CONFIGURADAS

O NOEL **NÃO FUNCIONARÁ** em produção e retornará erro:
```
OPENAI_ASSISTANT_NOEL_ID não configurado
```

**Solução:** Adicionar as variáveis e fazer novo deploy.

---

**Última atualização:** 2025-01-27
