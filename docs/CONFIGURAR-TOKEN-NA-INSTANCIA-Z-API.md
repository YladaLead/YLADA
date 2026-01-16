# 🔧 Como Configurar Token na Instância Z-API

## 🐛 PROBLEMA

Mesmo com token correto no banco, a Z-API retorna:
```
Error: your client-token is not configured
```

**Causa:** O token precisa ser **configurado na própria instância Z-API**, não apenas no banco.

---

## ✅ SOLUÇÃO: Configurar Token na Dashboard Z-API

### **Passo 1: Acessar Dashboard Z-API**

1. Acesse: https://developer.z-api.com.br/
2. Faça login
3. Vá em **"Instâncias Web"**
4. Clique na sua instância: `3ED484E8415CF126D6009EBD599F8B90`

### **Passo 2: Verificar/Configurar Token**

Na página da instância, procure por:

1. **Seção "Token" ou "Configurações"**
   - Verifique se o token está configurado
   - Se não estiver, clique em **"Gerar novo token"** ou **"Configurar token"**

2. **Se houver campo "Token da Instância"**
   - Cole o token: `6633B5CACF7FC081FCAC3611`
   - Clique em **"Salvar"** ou **"Atualizar"**

3. **Se houver botão "Gerar novo token"**
   - Clique para gerar um novo token
   - **Copie o novo token gerado**
   - **Atualize no banco** (script abaixo)

### **Passo 3: Verificar Status da Instância**

Certifique-se de que:
- ✅ Instância está **conectada** (status verde)
- ✅ WhatsApp está **online** (celular ligado)
- ✅ Token está **ativo** (não expirado)

---

## 🔄 SE GERAR NOVO TOKEN

Se você gerar um novo token na Z-API, atualize no banco:

```sql
-- Atualizar com novo token
UPDATE z_api_instances
SET 
  token = 'NOVO_TOKEN_AQUI',
  updated_at = NOW()
WHERE instance_id = '3ED484E8415CF126D6009EBD599F8B90';
```

---

## 🧪 TESTAR TOKEN MANUALMENTE

Após configurar, teste via cURL:

```bash
curl -X POST https://api.z-api.io/instances/3ED484E8415CF126D6009EBD599F8B90/token/6633B5CACF7FC081FCAC3611/send-text \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5519996049800",
    "message": "Teste token configurado"
  }'
```

**Se funcionar:** Token está configurado ✅  
**Se der erro:** Token ainda não está configurado na instância ❌

---

## ⚠️ POSSÍVEIS PROBLEMAS

### **1. Token Expirado**
- Tokens podem expirar após certo tempo
- Gerar novo token na dashboard Z-API
- Atualizar no banco

### **2. Instância Desconectada**
- Verificar se instância está conectada
- Reconectar se necessário (escanear QR Code)

### **3. Token Não Configurado na Instância**
- O token precisa estar configurado na própria instância Z-API
- Não basta ter no banco de dados
- Configurar na dashboard Z-API

---

## 📋 CHECKLIST

- [ ] Acessar dashboard Z-API
- [ ] Ir em "Instâncias Web" → Sua instância
- [ ] Verificar se token está configurado
- [ ] Se não estiver, configurar ou gerar novo token
- [ ] Se gerar novo, atualizar no banco
- [ ] Verificar se instância está conectada
- [ ] Testar via cURL
- [ ] Testar enviar mensagem na interface

---

**O token precisa estar configurado na própria instância Z-API, não apenas no banco!**
