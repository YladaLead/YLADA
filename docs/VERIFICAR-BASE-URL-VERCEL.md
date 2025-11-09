# 🔍 VERIFICAR BASE URL NA VERCEL

## ❌ Erro: "auto_return invalid. back_url.success must be defined"

Este erro indica que o **baseUrl** não está sendo detectado corretamente, resultando em URLs de retorno inválidas.

---

## ✅ PASSO A PASSO: Configurar Base URL

### **1. Verificar Variáveis de Ambiente na Vercel**

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **YLADA**
3. Vá em **Settings** → **Environment Variables**
4. Verifique se existe:
   - `NEXT_PUBLIC_APP_URL` = `https://www.ylada.com` (ou `https://ylada.com`)
   - OU `NEXT_PUBLIC_APP_URL_PRODUCTION` = `https://www.ylada.com`

### **2. Adicionar Variável (se não existir)**

1. Clique em **"Add New"**
2. **Key:** `NEXT_PUBLIC_APP_URL`
3. **Value:** `https://www.ylada.com` (sem trailing slash)
4. **Environment:** Selecione **Production**, **Preview** e **Development**
5. Clique em **Save**

### **3. Fazer Redeploy**

Após adicionar/atualizar a variável:

1. Vá em **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Selecione **Redeploy**
4. Aguarde o deploy completar

---

## 🔧 SOLUÇÃO ALTERNATIVA

Se o erro persistir, o sistema agora tenta detectar automaticamente o domínio do request. Mas é **recomendado** configurar a variável de ambiente para garantir consistência.

---

## 📝 Verificar Logs

Após o deploy, verifique os logs do Vercel:

1. Vá em **Deployments** → Último deploy
2. Clique em **Functions** → `/api/wellness/checkout`
3. Procure por: `🌐 Base URL detectada:`
4. Deve mostrar: `🌐 Base URL detectada: https://www.ylada.com`

Se mostrar `http://localhost:3000`, significa que a variável não está configurada.

---

**Última atualização:** Janeiro 2025

