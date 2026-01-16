# 🔑 Como Obter e Configurar Client-Token Z-API

## 🐛 PROBLEMA

Erro: `your client-token is not configured`

**Causa:** A Z-API requer um **Client-Token** (Account Security Token) no header das requisições.

---

## ✅ SOLUÇÃO: Obter Client-Token na Dashboard Z-API

### **Passo 1: Acessar Dashboard Z-API**

1. Acesse: https://developer.z-api.com.br/
2. Faça login
3. Vá em **"Segurança"** (Security) no menu lateral

### **Passo 2: Configurar Account Security Token**

1. Na seção **"Account Security Token"** ou **"Client-Token"**
2. Clique em **"Configurar agora"** ou **"Generate Token"**
3. **Copie o token gerado** (será algo como: `ABC123DEF456...`)

**IMPORTANTE:**
- O token começa **desabilitado** por padrão
- Você pode configurar sem interromper o sistema
- Depois de configurar no código, **ative o token** na dashboard

---

## 🔧 CONFIGURAR NO CÓDIGO

### **1. Adicionar na Vercel**

1. Acesse: https://vercel.com → Seu projeto
2. Vá em **Settings** → **Environment Variables**
3. Adicione:

```
Z_API_CLIENT_TOKEN=seu-client-token-aqui
```

4. Selecione **Production**, **Preview** e **Development**
5. Clique em **Save**
6. **Fazer redeploy**

### **2. Adicionar no .env.local**

Edite o arquivo `.env.local`:

```env
Z_API_CLIENT_TOKEN=seu-client-token-aqui
```

---

## ⚠️ IMPORTANTE: Ativar Token na Z-API

**DEPOIS** de configurar no código e testar:

1. Volte na dashboard Z-API → **Segurança**
2. **Ative o Client-Token**
3. Após ativar, requisições sem o header serão rejeitadas

**Ordem correta:**
1. ✅ Configurar token na dashboard (desabilitado)
2. ✅ Adicionar `Z_API_CLIENT_TOKEN` na Vercel e .env.local
3. ✅ Fazer deploy
4. ✅ Testar se funciona
5. ✅ **Só então ativar** o token na dashboard

---

## 🧪 TESTAR

Após configurar, teste enviar mensagem:

1. Acesse: `/admin/whatsapp`
2. Selecione conversa
3. Digite mensagem
4. Clique em "Enviar"

**Se funcionar:** ✅ Token configurado corretamente  
**Se ainda der erro:** Verificar se token foi copiado corretamente

---

## 📋 CHECKLIST

- [ ] Acessar dashboard Z-API → Segurança
- [ ] Gerar/Configurar Account Security Token
- [ ] Copiar token gerado
- [ ] Adicionar `Z_API_CLIENT_TOKEN` na Vercel
- [ ] Adicionar `Z_API_CLIENT_TOKEN` no .env.local
- [ ] Fazer redeploy na Vercel
- [ ] Testar enviar mensagem
- [ ] Se funcionar, ativar token na dashboard Z-API

---

## 🔍 ONDE ENCONTRAR NA DASHBOARD

O Client-Token geralmente está em:
- **Menu:** Segurança → Account Security Token
- **Ou:** Configurações → Security → Client-Token
- **Ou:** Instâncias → Sua Instância → Configurações → Security

---

**Obtenha o Client-Token na dashboard Z-API e adicione nas variáveis de ambiente!**
