# 🔧 Configurar Instance ID na Vercel

## 📋 ONDE CONFIGURAR

### **1. Vercel (Produção) - OBRIGATÓRIO**

1. Acesse: https://vercel.com → Seu projeto
2. Vá em **Settings** → **Environment Variables**
3. Adicione/Edite:

```
Z_API_INSTANCE_ID=3ED484E8415CF126D6009EBD599F8B90
Z_API_TOKEN=6633B5CACF7FC081FCAC3611
Z_API_BASE_URL=https://api.z-api.io
Z_API_CLIENT_TOKEN=seu-client-token-aqui (se configurado na Z-API)
```

4. **IMPORTANTE:** Selecione **"Production"**, **"Preview"** e **"Development"**
5. Clique em **"Save"**
6. **Fazer redeploy** (ou aguardar próximo deploy automático)

---

### **2. .env.local (Local) - OPCIONAL**

Crie/edite o arquivo `.env.local` na raiz do projeto:

```env
# Z-API Configuração
Z_API_INSTANCE_ID=3ED484E8415CF126D6009EBD599F8B90
Z_API_TOKEN=6633B5CACF7FC081FCAC3611
Z_API_BASE_URL=https://api.z-api.io
Z_API_CLIENT_TOKEN=seu-client-token-aqui (se configurado na Z-API)

# Número para notificações
Z_API_NOTIFICATION_PHONE=5519981868000
```

---

## ✅ VERIFICAR SE ESTÁ CONFIGURADO

### **Na Vercel:**
1. Settings → Environment Variables
2. Procure por `Z_API_INSTANCE_ID`
3. Deve mostrar: `3ED484E8415CF126D6009EBD599F8B90`

### **No .env.local:**
```bash
# No terminal, na raiz do projeto
cat .env.local | grep Z_API_INSTANCE_ID
```

Deve mostrar: `Z_API_INSTANCE_ID=3ED484E8415CF126D6009EBD599F8B90`

---

## 🔄 APÓS CONFIGURAR

### **1. Redeploy na Vercel**
- Após adicionar variáveis, fazer redeploy
- Ou aguardar próximo commit (deploy automático)

### **2. Reiniciar servidor local**
```bash
# Parar servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

---

## 📋 CHECKLIST

- [ ] Adicionar `Z_API_INSTANCE_ID` na Vercel
- [ ] Adicionar `Z_API_TOKEN` na Vercel
- [ ] Adicionar `Z_API_CLIENT_TOKEN` na Vercel (se configurado)
- [ ] Selecionar ambientes (Production, Preview, Development)
- [ ] Salvar variáveis
- [ ] Fazer redeploy ou aguardar deploy automático
- [ ] Verificar se variáveis aparecem na Vercel
- [ ] Testar enviar mensagem

---

**Configure na Vercel primeiro (produção) e depois no .env.local (local)!**
