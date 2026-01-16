# 🔧 Variáveis de Ambiente Z-API - Configuração Completa

## 📋 DADOS PARA CONFIGURAR

### **Instance ID:**
```
3ED484E8415CF126D6009EBD599F8B90
```

### **Token (Instance Token):**
```
6633B5CACF7FC081FCAC3611
```

### **Client-Token (Account Security Token):**
```
F25db4f38d3bd46bb8810946b9497020aS
```

### **Base URL:**
```
https://api.z-api.io
```

### **Notification Phone:**
```
5519981868000
```

---

## ✅ CONFIGURAR NA VERCEL

1. Acesse: https://vercel.com → Seu projeto
2. Vá em **Settings** → **Environment Variables**
3. Adicione/Edite estas variáveis:

```
Z_API_INSTANCE_ID=3ED484E8415CF126D6009EBD599F8B90
Z_API_TOKEN=6633B5CACF7FC081FCAC3611
Z_API_CLIENT_TOKEN=F25db4f38d3bd46bb8810946b9497020aS
Z_API_BASE_URL=https://api.z-api.io
Z_API_NOTIFICATION_PHONE=5519981868000
```

4. **IMPORTANTE:** Selecione **Production**, **Preview** e **Development**
5. Clique em **Save**
6. **Fazer redeploy** (ou aguardar próximo deploy automático)

---

## ✅ CONFIGURAR NO .env.local

Crie/edite o arquivo `.env.local` na raiz do projeto:

```env
# Z-API Configuração
Z_API_INSTANCE_ID=3ED484E8415CF126D6009EBD599F8B90
Z_API_TOKEN=6633B5CACF7FC081FCAC3611
Z_API_CLIENT_TOKEN=F25db4f38d3bd46bb8810946b9497020aS
Z_API_BASE_URL=https://api.z-api.io
Z_API_NOTIFICATION_PHONE=5519981868000
```

---

## ✅ VERIFICAR NO BANCO

Execute no Supabase para garantir que está correto:

```sql
SELECT 
  instance_id,
  token,
  status
FROM z_api_instances
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
```

**Deve mostrar:**
- `instance_id = '3ED484E8415CF126D6009EBD599F8B90'`
- `token = '6633B5CACF7FC081FCAC3611'`
- `status = 'connected'`

---

## 🧪 TESTAR APÓS CONFIGURAR

1. **Aguardar redeploy** na Vercel (1-2 minutos)
2. **Acessar:** `/admin/whatsapp`
3. **Selecionar conversa**
4. **Digite mensagem** (ex: "Teste")
5. **Clique em "Enviar"**

**Resultado esperado:**
- ✅ Mensagem enviada com sucesso
- ✅ Sem erro "client-token is not configured"
- ✅ Mensagem aparece no chat

---

## 📋 CHECKLIST

- [ ] Adicionar todas as variáveis na Vercel
- [ ] Selecionar ambientes (Production, Preview, Development)
- [ ] Salvar variáveis na Vercel
- [ ] Adicionar todas as variáveis no .env.local
- [ ] Fazer redeploy na Vercel
- [ ] Verificar token no banco (SQL acima)
- [ ] Testar enviar mensagem

---

**Configure todas as variáveis acima na Vercel e no .env.local!**
