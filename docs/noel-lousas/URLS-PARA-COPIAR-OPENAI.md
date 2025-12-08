# 📋 URLs Prontas para Copiar - OpenAI Assistant

**Domínio:** `https://www.ylada.com`

---

## 🔗 URLs das Functions

### **1. getUserProfile**
```
https://www.ylada.com/api/noel/getUserProfile
```

### **2. saveInteraction**
```
https://www.ylada.com/api/noel/saveInteraction
```

### **3. getPlanDay**
```
https://www.ylada.com/api/noel/getPlanDay
```

### **4. updatePlanDay**
```
https://www.ylada.com/api/noel/updatePlanDay
```

### **5. registerLead**
```
https://www.ylada.com/api/noel/registerLead
```

### **6. getClientData**
```
https://www.ylada.com/api/noel/getClientData
```

---

## 🔐 Header de Autenticação

**Para TODAS as functions, adicione:**

- **Header Name:** `Authorization`
- **Header Value:** `Bearer SEU_SECRET_AQUI`

**⚠️ IMPORTANTE:**
1. Substitua `SEU_SECRET_AQUI` pelo valor de `OPENAI_FUNCTION_SECRET`
2. Use o mesmo secret que configurou nas variáveis de ambiente
3. O secret deve ser o mesmo no `.env.local` (local) e Vercel (produção)

---

## 📝 Exemplo de Configuração no OpenAI

**Para cada function:**

```
Function: getUserProfile
URL: https://www.ylada.com/api/noel/getUserProfile
Method: POST
Headers:
  Authorization: Bearer noel-functions-secret-2025-abc123xyz789
  Content-Type: application/json
```

**Repita para todas as 6 functions.**

---

**Status:** ✅ **PRONTO PARA CONFIGURAR**
