# 📝 Preencher Webhooks Z-API - URLs Corretas

## 🌐 URL Base do Site
```
https://www.ylada.com
```

---

## ✅ CAMPOS PARA PREENCHER

### **1. Ao receber (On receive)** ⭐ **OBRIGATÓRIO**
```
https://www.ylada.com/api/webhooks/z-api
```
**O que faz:** Recebe mensagens quando alguém envia para seu WhatsApp  
**Status:** ✅ Implementado e funcionando

---

### **2. Receber status da mensagem (Receive message status)** ⭐ **RECOMENDADO**
```
https://www.ylada.com/api/webhooks/z-api/message-status
```
**O que faz:** Recebe atualizações de status (enviada, entregue, lida)  
**Status:** ⚠️ Endpoint ainda não criado (pode deixar vazio por enquanto)

---

### **3. Ao enviar (On send)** ⚠️ **OPCIONAL**
```
https://www.ylada.com/api/webhooks/z-api/sent
```
**O que faz:** Notifica quando você envia uma mensagem  
**Status:** ⚠️ Endpoint ainda não criado (pode deixar vazio por enquanto)

---

### **4. Ao conectar (On connect)** ⚠️ **OPCIONAL**
```
https://www.ylada.com/api/webhooks/z-api/connected
```
**O que faz:** Notifica quando instância conecta ao WhatsApp  
**Status:** ⚠️ Endpoint ainda não criado (pode deixar vazio por enquanto)

---

### **5. Ao desconectar (On disconnect)** ⚠️ **OPCIONAL**
```
https://www.ylada.com/api/webhooks/z-api/disconnected
```
**O que faz:** Notifica quando instância desconecta do WhatsApp  
**Status:** ⚠️ Endpoint ainda não criado (pode deixar vazio por enquanto)

---

### **6. Presença do chat (Chat presence)** ⚠️ **OPCIONAL**
```
https://www.ylada.com/api/webhooks/z-api/chat-presence
```
**O que faz:** Notifica quando alguém está digitando  
**Status:** ⚠️ Endpoint ainda não criado (pode deixar vazio por enquanto)

---

## 🎯 RESUMO: O QUE PREENCHER AGORA

### **Mínimo Necessário:**
Preencha apenas este campo:

**Ao receber (On receive):**
```
https://www.ylada.com/api/webhooks/z-api
```

### **Os outros campos:**
- Pode deixar **vazios** por enquanto
- Ou preencher com as URLs acima (mas os endpoints ainda não existem)

---

## ⚙️ CONFIGURAÇÕES ADICIONAIS

### **"Notificar as enviadas por mim também"**
- **Recomendado:** Deixar **DESLIGADO** (Off)
- **Por quê:** Evita notificações desnecessárias quando você mesmo envia mensagens

### **"Ler mensagens automático"**
- **Recomendado:** Deixar **DESLIGADO** (Off)
- **Por quê:** Você quer controlar quando marcar como lida pela interface

### **"Ler status automaticamente"**
- **Recomendado:** Deixar **DESLIGADO** (Off)
- **Por quê:** Não é necessário para o funcionamento básico

### **"Rejeitar chamadas automático"**
- **Recomendado:** Deixar **LIGADO** (On)
- **Por quê:** Evita receber chamadas no número de atendimento

---

## ✅ CHECKLIST

- [ ] Campo "Ao receber" preenchido: `https://www.ylada.com/api/webhooks/z-api`
- [ ] "Notificar as enviadas por mim também" = **OFF**
- [ ] "Ler mensagens automático" = **OFF**
- [ ] "Rejeitar chamadas automático" = **ON** (recomendado)
- [ ] Clicar em **"Salvar"**

---

## 🧪 TESTAR

Após salvar:

1. Envie uma mensagem de teste do seu WhatsApp para o número conectado
2. A mensagem deve aparecer na interface `/admin/whatsapp` em alguns segundos
3. Se não aparecer, verifique os logs do servidor

---

**Pronto! Configuração básica completa! 🎉**
