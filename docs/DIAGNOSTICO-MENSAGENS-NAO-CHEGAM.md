# 🔍 Diagnóstico: Mensagens Não Chegam no Banco

## ✅ O QUE ESTÁ CORRETO

1. ✅ **Variáveis de Ambiente:**
   - `Z_API_NOTIFICATION_PHONE = 5519981868000` ✅
   - `Z_API_INSTANCE_ID` configurado ✅
   - `Z_API_TOKEN` configurado ✅
   - `Z_API_BASE_URL` configurado ✅

2. ✅ **Webhook na Z-API:**
   - URL: `https://www.ylada.com/api/webhooks/z-api` ✅
   - Campo "Ao receber" preenchido ✅

3. ✅ **Banco de Dados:**
   - Tabelas criadas ✅
   - Modo PRODUCTION ✅

---

## ❌ PROBLEMA IDENTIFICADO

**Nenhuma mensagem no banco de dados!**

Query retorna: `No rows returned`

Isso significa que o webhook **não está recebendo** mensagens da Z-API.

---

## 🔧 SOLUÇÕES

### **Solução 1: Habilitar Toggle "Notificar as enviadas por mim também"**

Na configuração do webhook da Z-API, há um toggle:
- **"Notificar as enviadas por mim também"** está **DESABILITADO**

**Ação:** Habilitar este toggle e **SALVAR** as configurações.

**Por quê?** Mesmo que você envie mensagens de teste da própria instância, elas podem não estar sendo notificadas.

---

### **Solução 2: Testar Webhook Manualmente**

Execute no terminal:

```bash
curl -X POST https://www.ylada.com/api/webhooks/z-api \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste manual do webhook",
    "name": "Teste Manual",
    "instanceId": "3ED484E8415CF126D6009EBD599F8B90",
    "type": "text"
  }'
```

**Resultado esperado:**
```json
{
  "received": true,
  "conversationId": "...",
  "area": "nutri"
}
```

**Depois verificar no banco:**
```sql
SELECT * FROM whatsapp_messages 
WHERE message LIKE '%Teste manual%'
ORDER BY created_at DESC 
LIMIT 1;
```

**Se aparecer:** Webhook funciona! ✅  
**Se não aparecer:** Verificar logs da Vercel

---

### **Solução 3: Verificar Logs da Vercel**

1. Acesse: https://vercel.com → Seu projeto → Logs
2. Filtre por: `[Z-API Webhook]`
3. Procure por:
   - `📥 Mensagem recebida`
   - `✅ Mensagem salva no banco`
   - `❌ Erro`

**Se não aparecer nada:**
- Webhook não está sendo chamado pela Z-API
- Verificar configuração do webhook na Z-API novamente

---

### **Solução 4: Enviar Mensagem Real**

1. **De outro número de WhatsApp**, envie mensagem para: `5519997230912`
2. Mensagem: `"Olá, teste"`
3. Aguarde 5-10 segundos
4. Verifique no banco:

```sql
SELECT 
  id,
  message,
  sender_phone,
  sender_name,
  created_at
FROM whatsapp_messages
ORDER BY created_at DESC
LIMIT 5;
```

**Se aparecer:** Sistema funciona! ✅  
**Se não aparecer:** Webhook não está recebendo da Z-API

---

### **Solução 5: Verificar Status da Instância Z-API**

1. Acesse: https://developer.z-api.com.br/
2. Vá em **"Instâncias Web"**
3. Verifique se sua instância está:
   - ✅ **Conectada** (status verde)
   - ✅ **Ativa**

**Se estiver desconectada:**
- Reconectar a instância
- Escanear QR Code novamente

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] **Toggle "Notificar as enviadas por mim também" HABILITADO** na Z-API
- [ ] **SALVAR** configurações do webhook na Z-API
- [ ] Instância Z-API está **CONECTADA**
- [ ] Testar webhook manualmente (curl)
- [ ] Verificar logs da Vercel
- [ ] Enviar mensagem real de outro número
- [ ] Verificar se mensagem aparece no banco

---

## 🎯 PRÓXIMOS PASSOS (ORDEM)

1. **PRIMEIRO:** Habilitar toggle "Notificar as enviadas por mim também" e SALVAR
2. **SEGUNDO:** Verificar se instância está conectada na Z-API
3. **TERCEIRO:** Testar webhook manualmente (curl)
4. **QUARTO:** Enviar mensagem real de outro número
5. **QUINTO:** Verificar logs da Vercel se ainda não funcionar

---

## 🐛 TROUBLESHOOTING

### **Webhook não recebe:**
- Verificar URL na Z-API (deve ser exatamente: `https://www.ylada.com/api/webhooks/z-api`)
- Verificar se há HTTPS (não HTTP)
- Verificar se não há espaços ou caracteres especiais
- Verificar logs da Vercel para erros

### **Mensagem chega mas não salva:**
- Verificar logs da Vercel
- Verificar se tabelas existem no banco
- Verificar se `instanceId` está correto

### **Tudo configurado mas não funciona:**
- Fazer redeploy na Vercel (às vezes variáveis de ambiente precisam de redeploy)
- Verificar se código está deployado (último commit)
- Aguardar alguns minutos após configurar webhook

---

**Execute os passos acima na ordem e me diga o resultado de cada um!**
