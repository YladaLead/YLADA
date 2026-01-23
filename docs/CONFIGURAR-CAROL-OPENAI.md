# 🔧 Passo-a-Passo: Configurar Carol na OpenAI

## 📋 PRÉ-REQUISITOS

- Conta na OpenAI (se não tiver, criar em: https://platform.openai.com)
- Acesso ao arquivo `.env.local` do projeto
- Acesso ao painel administrativo da Vercel (se já estiver em produção)

---

## 🚀 PASSO 1: Criar/Verificar Conta OpenAI

1. Acesse: https://platform.openai.com
2. Faça login ou crie uma conta
3. Verifique se tem créditos disponíveis (necessário para usar a API)

---

## 🔑 PASSO 2: Gerar API Key

1. No painel da OpenAI, vá em: **API Keys** (menu lateral)
2. Clique em: **"Create new secret key"**
3. Dê um nome (ex: "Carol WhatsApp YLADA")
4. **Copie a chave imediatamente** (ela só aparece uma vez!)
   - Formato: `sk-proj-...` ou `sk-...`

⚠️ **IMPORTANTE:** Guarde essa chave em local seguro. Você não conseguirá vê-la novamente.

---

## 💻 PASSO 3: Adicionar no Projeto Local

1. Abra o arquivo `.env.local` na raiz do projeto
2. Adicione ou atualize a linha:

```bash
OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

**Exemplo:**
```bash
OPENAI_API_KEY=sk-proj-abc123xyz789...
```

3. Salve o arquivo

---

## 🌐 PASSO 4: Adicionar na Vercel (Produção)

1. Acesse: https://vercel.com
2. Entre no seu projeto
3. Vá em: **Settings** → **Environment Variables**
4. Clique em: **"Add New"**
5. Preencha:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Cole a chave que você copiou
   - **Environment:** Selecione **Production**, **Preview** e **Development**
6. Clique em: **"Save"**

---

## ✅ PASSO 5: Verificar se Está Funcionando

### **Teste Local:**

1. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse: `http://localhost:3000/admin/whatsapp`
3. Envie uma mensagem de teste do WhatsApp para o número
4. Verifique se a Carol responde automaticamente

### **Teste em Produção:**

1. Faça deploy (se ainda não fez):
```bash
git add .
git commit -m "Integração Carol IA"
git push
```

2. Aguarde o deploy terminar na Vercel
3. Acesse: `https://seu-dominio.com/admin/whatsapp`
4. Envie uma mensagem de teste
5. Verifique se a Carol responde

---

## 🔍 PASSO 6: Verificar Logs (Se Não Funcionar)

### **Logs Locais:**
- Veja o console do terminal onde está rodando `npm run dev`
- Procure por: `[Carol AI]` ou `[Z-API Webhook]`

### **Logs Vercel:**
1. Acesse: https://vercel.com
2. Vá em: **Deployments** → Clique no último deploy
3. Vá em: **Functions** → Clique em `/api/webhooks/z-api`
4. Veja os logs em tempo real

### **Erros Comuns:**

**Erro: "OPENAI_API_KEY is not configured"**
- ✅ Verifique se adicionou no `.env.local`
- ✅ Reinicie o servidor após adicionar

**Erro: "Incorrect API key provided"**
- ✅ Verifique se copiou a chave completa
- ✅ Verifique se não tem espaços extras

**Erro: "You exceeded your current quota"**
- ✅ Adicione créditos na OpenAI
- ✅ Verifique o plano da sua conta

---

## 💰 PASSO 7: Configurar Limites de Uso (Opcional)

Para controlar custos:

1. Acesse: https://platform.openai.com/account/billing/limits
2. Configure:
   - **Hard limit:** Valor máximo por mês
   - **Soft limit:** Aviso quando atingir

**Custo estimado da Carol:**
- Modelo usado: `gpt-4o-mini`
- Custo aproximado: ~$0.15 por 1 milhão de tokens de entrada
- Respostas curtas: ~300 tokens por mensagem
- **Custo por 1000 mensagens: ~$0.05**

---

## 🎯 PASSO 8: Testar Disparos Manuais

1. Acesse: `/admin/whatsapp/carol`
2. Clique em: **"Disparar Boas-vindas"**
3. Verifique se processa corretamente
4. Verifique se mensagens são enviadas

---

## ✅ CHECKLIST FINAL

- [ ] Conta OpenAI criada/verificada
- [ ] API Key gerada e copiada
- [ ] Adicionada no `.env.local`
- [ ] Adicionada na Vercel (Environment Variables)
- [ ] Servidor reiniciado (local)
- [ ] Deploy feito (produção)
- [ ] Teste de mensagem funcionando
- [ ] Carol respondendo automaticamente

---

## 🆘 PROBLEMAS COMUNS

### **Carol não responde:**
1. Verifique se `OPENAI_API_KEY` está configurada
2. Verifique logs para erros
3. Teste se a API Key está válida (pode testar em: https://platform.openai.com/playground)

### **Respostas muito lentas:**
- Normal: pode levar 2-5 segundos
- Se demorar muito: verifique conexão com OpenAI

### **Respostas genéricas:**
- Verifique se o prompt está correto em `src/lib/whatsapp-carol-ai.ts`
- Ajuste o `CAROL_SYSTEM_PROMPT` se necessário

---

## 📞 SUPORTE

Se tiver problemas:
1. Verifique os logs primeiro
2. Teste a API Key no playground da OpenAI
3. Verifique se tem créditos disponíveis

---

## ✅ PRONTO!

Com esses passos, a Carol estará configurada e funcionando! 🚀
