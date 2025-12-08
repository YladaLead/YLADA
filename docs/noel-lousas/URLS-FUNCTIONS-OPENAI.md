# 🔗 URLs das Functions para Configurar no OpenAI

**Data:** 2025-01-27  
**Objetivo:** URLs corretas para configurar as functions no OpenAI Assistant

---

## 🌐 AMBIENTE LOCAL (Desenvolvimento)

Se você está testando localmente com `npm run dev`:

### **Base URL:**
```
http://localhost:3000
```

### **URLs Completas:**

1. **getUserProfile:**
   ```
   http://localhost:3000/api/noel/getUserProfile
   ```

2. **saveInteraction:**
   ```
   http://localhost:3000/api/noel/saveInteraction
   ```

3. **getPlanDay:**
   ```
   http://localhost:3000/api/noel/getPlanDay
   ```

4. **updatePlanDay:**
   ```
   http://localhost:3000/api/noel/updatePlanDay
   ```

5. **registerLead:**
   ```
   http://localhost:3000/api/noel/registerLead
   ```

6. **getClientData:**
   ```
   http://localhost:3000/api/noel/getClientData
   ```

---

## 🚀 AMBIENTE PRODUÇÃO (Vercel)

**Domínio Customizado (Recomendado):**
```
https://www.ylada.com
```

### **URLs Completas para Configurar no OpenAI:**

1. **getUserProfile:**
   ```
   https://www.ylada.com/api/noel/getUserProfile
   ```

2. **saveInteraction:**
   ```
   https://www.ylada.com/api/noel/saveInteraction
   ```

3. **getPlanDay:**
   ```
   https://www.ylada.com/api/noel/getPlanDay
   ```

4. **updatePlanDay:**
   ```
   https://www.ylada.com/api/noel/updatePlanDay
   ```

5. **registerLead:**
   ```
   https://www.ylada.com/api/noel/registerLead
   ```

6. **getClientData:**
   ```
   https://www.ylada.com/api/noel/getClientData
   ```

---

## 🔍 Como Descobrir Seu Domínio Vercel

### **Opção 1: Verificar no Dashboard da Vercel**
1. Acesse [vercel.com](https://vercel.com)
2. Entre no seu projeto
3. Vá em "Settings" → "Domains"
4. Copie o domínio (ex: `ylada-app.vercel.app`)

### **Opção 2: Verificar no Terminal**
Se você já fez deploy, o domínio aparece após o deploy:
```
Deploying to production...
✅ https://ylada-app.vercel.app
```

### **Opção 3: Verificar no package.json**
Alguns projetos têm o domínio configurado no `package.json` ou `.env`

---

## ✅ AUTENTICAÇÃO IMPLEMENTADA

**Solução:** Autenticação via **Bearer Token** já implementada em todas as rotas.

### **Como Configurar:**

1. **Criar um Secret:**
   - Gere um token seguro (ex: `noel-functions-secret-2025-abc123xyz789`)
   - Ou use: `openssl rand -hex 32` no terminal

2. **Adicionar nas Variáveis de Ambiente:**
   - **Local (.env.local):** `OPENAI_FUNCTION_SECRET=seu-secret-aqui`
   - **Vercel:** Settings → Environment Variables → Adicionar `OPENAI_FUNCTION_SECRET`

3. **Configurar no OpenAI Assistant:**
   - Para cada function, adicione header:
   - **Header Name:** `Authorization`
   - **Header Value:** `Bearer seu-secret-aqui`

**📖 Documentação completa:** `docs/noel-lousas/CONFIGURACAO-AUTENTICACAO-OPENAI.md`

---

## 📝 Checklist de Configuração

### **No OpenAI Assistant:**

- [ ] Adicionar function `getUserProfile`
- [ ] Configurar URL: `http://localhost:3000/api/noel/getUserProfile` (ou produção)
- [ ] Adicionar function `saveInteraction`
- [ ] Configurar URL: `http://localhost:3000/api/noel/saveInteraction`
- [ ] Adicionar function `getPlanDay`
- [ ] Configurar URL: `http://localhost:3000/api/noel/getPlanDay`
- [ ] Adicionar function `updatePlanDay`
- [ ] Configurar URL: `http://localhost:3000/api/noel/updatePlanDay`
- [ ] Adicionar function `registerLead`
- [ ] Configurar URL: `http://localhost:3000/api/noel/registerLead`
- [ ] Adicionar function `getClientData`
- [ ] Configurar URL: `http://localhost:3000/api/noel/getClientData`

### **Testar:**

- [ ] Testar cada function no modo "Evaluate"
- [ ] Verificar se as respostas estão corretas
- [ ] Validar formato JSON de resposta

---

## 🧪 Exemplo de Teste

**No OpenAI Assistant (Evaluate):**

```
Usuário: "NOEL, qual é o meu dia atual do plano?"
```

**O que deve acontecer:**

1. NOEL detecta que precisa chamar `getPlanDay`
2. Chama: `POST http://localhost:3000/api/noel/getPlanDay`
3. Body: `{ "user_id": "uuid-do-usuario" }`
4. Resposta: `{ "success": true, "data": { "current_day": 1 } }`
5. NOEL incorpora na resposta: "Seu dia atual é o dia 1..."

---

## 🔧 Troubleshooting

### **Erro 401 (Unauthorized)**
- Verificar se adicionou autenticação nas rotas
- Verificar se configurou header no OpenAI

### **Erro 404 (Not Found)**
- Verificar se a URL está correta
- Verificar se o servidor está rodando (local) ou deployado (produção)

### **Erro 500 (Internal Server Error)**
- Verificar logs do servidor
- Verificar se as tabelas foram criadas no Supabase
- Verificar variáveis de ambiente

---

**Status:** ✅ **URLs PRONTAS PARA CONFIGURAR**

**Próximo passo:** Configurar as URLs no OpenAI Assistant e testar!
