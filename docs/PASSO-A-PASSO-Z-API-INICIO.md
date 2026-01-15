# 📱 Passo a Passo: Começando na Z-API

## 🎯 OBJETIVO
Criar sua primeira instância e conectar seu WhatsApp para começar a enviar mensagens.

---

## ✅ PASSO 1: Criar sua Primeira Instância

### **1.1. No menu lateral esquerdo:**
- Clique em **"Instâncias Web"** (está no MENU PRINCIPAL)

### **1.2. Na página de Instâncias:**
- Procure o botão **"Criar Nova Instância"** ou **"Adicionar Instância"**
- Clique nele

### **1.3. Preencher dados da instância:**
- **Nome da Instância:** Escolha um nome (ex: "Meu WhatsApp Principal")
- **Descrição:** (opcional) Ex: "WhatsApp para envios em massa"
- Clique em **"Criar"** ou **"Salvar"**

### **1.4. Após criar:**
- Você verá a instância na lista
- Status: **"Desconectada"** (ainda não conectou o WhatsApp)
- Anote o **Instance ID** e **Token** que aparecem (você vai precisar depois)

---

## ✅ PASSO 2: Conectar seu WhatsApp

### **2.1. Na lista de instâncias:**
- Clique na instância que você criou
- Ou clique no botão **"Conectar"** / **"QR Code"**

### **2.2. Aparecerá um QR Code:**
- Um QR Code grande aparecerá na tela
- **Mantenha essa tela aberta!**

### **2.3. No seu celular:**
1. Abra o **WhatsApp** no celular do número que você quer conectar
2. Toque nos **3 pontinhos** (menu) no canto superior direito
3. Vá em **"Dispositivos conectados"** ou **"Aparelhos conectados"**
4. Toque em **"Conectar um dispositivo"**
5. Escaneie o **QR Code** que está na tela do Z-API

### **2.4. Aguardar conexão:**
- Após escanear, aguarde alguns segundos
- O status mudará de **"Desconectada"** para **"Conectada"** ✅
- Você verá o número do WhatsApp conectado

---

## ✅ PASSO 3: Copiar Credenciais (IMPORTANTE!)

### **3.1. Na página da instância:**
- Procure por **"Instance ID"** ou **"ID da Instância"**
- Copie esse ID (algo como: `3C8F2A1B...`)

### **3.2. Procure por "Token":**
- Copie o **Token** também (algo como: `ABC123XYZ...`)

### **3.3. Guarde essas informações:**
- Você vai precisar delas para integrar no código
- **NÃO compartilhe** essas credenciais com ninguém!

---

## ✅ PASSO 4: Testar Envio de Mensagem

### **4.1. Na página da instância:**
- Procure por **"Enviar Mensagem"** ou **"Testar"**
- Ou vá em **"Mensagens"** → **"Enviar"**

### **4.2. Preencher dados:**
- **Para:** Seu próprio número (ex: `5511999999999`)
- **Mensagem:** "Teste da Z-API"
- Clique em **"Enviar"**

### **4.3. Verificar:**
- Você deve receber a mensagem no seu WhatsApp
- Se recebeu, está funcionando! ✅

---

## ✅ PASSO 5: Configurar Webhook (Opcional - para receber mensagens)

### **5.1. Na página da instância:**
- Procure por **"Webhooks"** ou **"Callbacks"**
- Clique em **"Configurar Webhook"**

### **5.2. Preencher URL:**
- **URL do Webhook:** `https://seu-site.com/api/webhooks/z-api`
- (Você vai criar esse endpoint depois no código)

### **5.3. Selecionar eventos:**
- ✅ **Mensagens recebidas**
- ✅ **Mensagens entregues**
- ✅ **Mensagens lidas**
- Clique em **"Salvar"**

---

## 📋 RESUMO DO QUE VOCÊ FEZ

1. ✅ Criou uma instância
2. ✅ Conectou seu WhatsApp (escaneou QR Code)
3. ✅ Copiou Instance ID e Token
4. ✅ Testou envio de mensagem
5. ✅ Configurou webhook (opcional)

---

## 🔑 INFORMAÇÕES QUE VOCÊ PRECISA GUARDAR

Anote essas informações em um lugar seguro:

```
Instance ID: [cole aqui o ID que você copiou]
Token: [cole aqui o token que você copiou]
Número conectado: [seu número de WhatsApp]
Status: Conectado ✅
```

---

## 🎯 PRÓXIMOS PASSOS

Agora que você tem a instância conectada, você pode:

1. **Integrar no código** (eu posso fazer isso)
2. **Enviar mensagens em massa** via API
3. **Receber mensagens** via webhook
4. **Fazer upload de planilhas** para envio automático

---

## ❓ PROBLEMAS COMUNS

### **QR Code não aparece:**
- Atualize a página
- Tente criar outra instância

### **QR Code expira:**
- Gere um novo QR Code
- Clique em "Gerar QR Code" novamente

### **Não consegue escanear:**
- Certifique-se que está no WhatsApp correto
- Tente fechar e abrir o WhatsApp no celular
- Verifique se o celular tem internet

### **Status não muda para "Conectado":**
- Aguarde alguns segundos
- Atualize a página
- Tente escanear o QR Code novamente

### **Mensagem de teste não chega:**
- Verifique se o número está correto (com DDD e código do país)
- Formato: `5511999999999` (sem espaços, parênteses ou hífens)
- Verifique se o WhatsApp está conectado (status: Conectado)

---

## 💡 DICA

**Enquanto você faz isso, me avise:**
- Quando criar a instância
- Quando conectar o WhatsApp
- Quando copiar o Instance ID e Token

**Aí eu posso:**
- Criar o código de integração
- Configurar envio em massa
- Configurar upload de planilhas
- Tudo funcionando automaticamente!

---

## 📞 PRECISA DE AJUDA?

Se tiver dúvida em algum passo, me avise qual passo você está e qual é a dúvida. Te ajudo a resolver!
