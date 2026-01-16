# 🔍 Diagnóstico Completo: Notificação Não Chega

## ✅ VARIÁVEL CONFIGURADA

A variável `Z_API_NOTIFICATION_PHONE = 5519981868000` **já está configurada** na Vercel desde ontem.

O problema está em **outro lugar**.

---

## 🔍 POSSÍVEIS CAUSAS

### **1. Instância Z-API Não Encontrada**

O código busca uma instância com:
- `area = 'nutri'`
- `status = 'connected'`

**Verificar no Supabase:**

```sql
SELECT 
  id,
  instance_id,
  name,
  area,
  status,
  token
FROM z_api_instances
WHERE area = 'nutri';
```

**Se não retornar nada ou status não for 'connected':**
- A instância pode não estar cadastrada
- O status pode estar diferente de 'connected'

**Solução:** Atualizar status ou criar instância:

```sql
UPDATE z_api_instances
SET status = 'connected'
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';

-- Ou verificar se existe:
SELECT * FROM z_api_instances 
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
```

---

### **2. Função notifyAdmins Não Está Sendo Chamada**

**Verificar nos logs da Vercel:**

Após enviar mensagem, procure por:
```
[Z-API Webhook] 🔔 INÍCIO: Função notifyAdmins chamada
```

**Se NÃO aparecer:**
- A função não está sendo chamada
- Pode haver erro antes de chegar nela

**Se aparecer:**
- A função está sendo chamada
- O problema está dentro da função

---

### **3. Erro ao Enviar via Z-API**

**Verificar nos logs:**

Procure por:
```
[Z-API Webhook] ❌ Erro ao enviar notificação:
```

**Se aparecer erro:**
- Verificar qual é o erro específico
- Pode ser problema com token, formato do número, ou restrição da Z-API

---

### **4. Número Bloqueado ou com Restrição**

A Z-API pode ter restrições para enviar para certos números.

**Teste manual:**

```bash
curl -X POST https://api.z-api.io/instances/3ED484E8415CF126D6009EBD599F8B90/token/6633B5CACF7FC081FCAC3611/send-text \
  -H "Content-Type: application/json" \
  -H "Client-Token: F25db4f38d3bd46bb8810946b9497020aS" \
  -d '{
    "phone": "5519981868000",
    "message": "Teste de notificação manual"
  }'
```

**Se retornar erro:**
- Número pode estar bloqueado
- Pode haver restrição na conta Z-API
- Verificar resposta da API

**Se funcionar:**
- Z-API consegue enviar
- O problema está no código

---

## 📋 CHECKLIST DE DIAGNÓSTICO

### **Passo 1: Verificar Instância no Banco**

```sql
SELECT * FROM z_api_instances 
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
```

**Deve mostrar:**
- ✅ `instance_id = '3ED484E8415CF126D6009EBD599F8B90'`
- ✅ `token = '6633B5CACF7FC081FCAC3611'`
- ✅ `area = 'nutri'`
- ✅ `status = 'connected'` (ou pelo menos não NULL)

---

### **Passo 2: Enviar Mensagem de Teste**

1. Envie mensagem de aparelho externo para `5519997230912`
2. Aguarde 5-10 segundos

---

### **Passo 3: Verificar Logs da Vercel**

Acesse: https://vercel.com → Seu projeto → Logs

**Procure por (na ordem):**

1. `[Z-API Webhook] 📥 Payload completo recebido` → Webhook recebeu
2. `[Z-API Webhook] 🔔 INÍCIO: Função notifyAdmins chamada` → Função foi chamada
3. `[Z-API Webhook] 🔔 Verificando notificação:` → Verificando variável
4. `[Z-API Webhook] 🔍 Buscando instância Z-API` → Buscando instância
5. `[Z-API Webhook] 📱 Enviando notificação para:` → Tentando enviar
6. `[Z-API Webhook] ✅ Notificação enviada com sucesso` → Sucesso
   OU
   `[Z-API Webhook] ❌ Erro ao enviar notificação:` → Erro

---

### **Passo 4: Verificar Cada Log**

**Se log 1 não aparecer:**
- Webhook não está sendo chamado pela Z-API
- Verificar configuração do webhook na Z-API

**Se log 2 não aparecer:**
- Erro antes de chamar notifyAdmins
- Verificar logs anteriores

**Se log 3 mostrar "NÃO CONFIGURADO":**
- Variável não está na Vercel (mas você disse que está)
- Pode precisar de redeploy

**Se log 4 mostrar "Instância não encontrada":**
- Instância não está no banco ou status errado
- Verificar Passo 1

**Se log 5 não aparecer:**
- Instância não foi encontrada
- Verificar Passo 1

**Se log 6 mostrar erro:**
- Verificar qual é o erro específico
- Pode ser problema com Z-API ou número

---

## 🧪 TESTE MANUAL COMPLETO

Execute este teste para verificar se a Z-API consegue enviar:

```bash
curl -X POST https://api.z-api.io/instances/3ED484E8415CF126D6009EBD599F8B90/token/6633B5CACF7FC081FCAC3611/send-text \
  -H "Content-Type: application/json" \
  -H "Client-Token: F25db4f38d3bd46bb8810946b9497020aS" \
  -d '{
    "phone": "5519981868000",
    "message": "Teste de notificação - se receber, a Z-API funciona"
  }'
```

**Resposta esperada:**
```json
{
  "id": "...",
  "phone": "5519981868000",
  "message": "Teste de notificação - se receber, a Z-API funciona"
}
```

**Se receber no WhatsApp:** ✅ Z-API funciona  
**Se não receber:** Verificar se número está correto ou se há restrição

---

## 🎯 PRÓXIMOS PASSOS

1. **Fazer commit e deploy** das mudanças (logs mais detalhados)
2. **Enviar mensagem de teste** de aparelho externo
3. **Verificar logs da Vercel** seguindo o checklist acima
4. **Me mostrar os logs** que aparecerem com `🔔`, `📱`, `🔍`, `✅` ou `❌`

Com esses logs, conseguiremos identificar exatamente onde está o problema!
