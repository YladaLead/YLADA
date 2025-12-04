# 🚀 NOEL - Configurar Variáveis na Vercel

## 📋 RESUMO

Você precisa adicionar as mesmas variáveis do NOEL que estão no `.env.local` também na **Vercel** para que funcione em produção.

---

## ✅ VARIÁVEIS OBRIGATÓRIAS DO NOEL

Adicione estas variáveis na Vercel:

### **1. OPENAI_WORKFLOW_ID** (Agents SDK - Backend)
- **Key:** `OPENAI_WORKFLOW_ID`
- **Value:** `wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

### **2. NEXT_PUBLIC_CHATKIT_WORKFLOW_ID** (ChatKit - Frontend)
- **Key:** `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`
- **Value:** `wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

### **3. NEXT_PUBLIC_CHATKIT_DOMAIN_PK** (ChatKit - Frontend)
- **Key:** `NEXT_PUBLIC_CHATKIT_DOMAIN_PK`
- **Value:** `domain_pk_693160512e7481948351882cd60488950e01b17d570e9d19`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

### **4. OPENAI_API_KEY** (Já deve existir, mas verifique)
- **Key:** `OPENAI_API_KEY`
- **Value:** `sua_chave_openai_aqui` (use a mesma chave do `.env.local`)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

---

## 🎯 PASSO A PASSO NA VERCEL

### **1. Acessar Vercel**
1. Acesse: https://vercel.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto **ylada-app** (ou o nome do seu projeto)

### **2. Ir para Environment Variables**
1. Clique em **Settings** (Configurações)
2. No menu lateral, clique em **Environment Variables**

### **3. Verificar Variáveis Existentes**
Procure por estas variáveis na lista:
- `OPENAI_API_KEY` (já deve existir)
- `OPENAI_WORKFLOW_ID` (pode não existir)
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` (pode não existir)
- `NEXT_PUBLIC_CHATKIT_DOMAIN_PK` (pode não existir)

### **4. Adicionar/Atualizar Variáveis**

Para cada variável que **NÃO existir** ou estiver **diferente**:

1. Clique em **"Add New"** (se não existir) ou nos **3 pontinhos** → **Edit** (se existir)
2. Preencha:
   - **Key:** Nome da variável (ex: `OPENAI_WORKFLOW_ID`)
   - **Value:** Valor da variável (ex: `wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa`)
   - **Environment:** Selecione:
     - ✅ **Production** (obrigatório)
     - ✅ **Preview** (recomendado)
     - ✅ **Development** (opcional)
3. Clique em **Save**

### **5. Repetir para Todas as Variáveis**
Adicione todas as 4 variáveis listadas acima.

---

## ⚠️ IMPORTANTE: Fazer Novo Deploy

**Após adicionar/atualizar as variáveis, você PRECISA fazer um novo deploy!**

### **Opção 1: Redeploy Manual (Recomendado)**
1. Vercel → **Deployments**
2. Clique nos **3 pontinhos** do último deploy
3. Clique em **Redeploy**
4. Aguarde o deploy terminar (2-3 minutos)

### **Opção 2: Deploy via Git**
```bash
git commit --allow-empty -m "Redeploy: Adicionar variáveis NOEL na Vercel"
git push origin main
```

---

## ✅ VERIFICAR SE FUNCIONOU

### **1. Verificar Logs do Deploy**
1. Vercel → **Deployments** → Último deploy
2. Clique em **Functions** → `/api/wellness/noel`
3. Procure por logs que mostrem:
   - `🤖 NOEL - Tentando Agent Builder com Workflow ID: wf_693116...`
   - `✅ NOEL - Agent Builder retornou resposta.`

### **2. Testar NOEL em Produção**
1. Acesse: `https://ylada.app/pt/wellness/noel` (ou seu domínio)
2. Envie uma mensagem para o NOEL
3. Verifique se a resposta vem do Agent Builder (deve mostrar `source: 'agent_builder'` nos metadados)

---

## 🔍 TROUBLESHOOTING

### **Problema: NOEL ainda não está usando Agent Builder**

**Solução:**
1. Verifique se `OPENAI_WORKFLOW_ID` está configurado na Vercel
2. Verifique se fez o **redeploy** após adicionar a variável
3. Verifique os logs do Vercel para ver se há erros
4. Confirme que o Workflow ID está correto: `wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa`

### **Problema: Variável não encontrada**

**Solução:**
- Certifique-se de que o nome da variável está **exatamente** igual (case-sensitive)
- `OPENAI_WORKFLOW_ID` (não `openai_workflow_id` ou `OpenAI_Workflow_ID`)

### **Problema: Deploy não aplicou as variáveis**

**Solução:**
- Variáveis só são aplicadas em **novos deploys**
- Se você adicionou a variável mas não fez redeploy, ela não estará disponível
- **Sempre faça redeploy após adicionar/atualizar variáveis**

---

## 📋 CHECKLIST COMPLETO

### **Na Vercel:**
- [ ] `OPENAI_API_KEY` configurada (já deve existir)
- [ ] `OPENAI_WORKFLOW_ID` adicionada com valor `wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa`
- [ ] `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` adicionada com valor `wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa`
- [ ] `NEXT_PUBLIC_CHATKIT_DOMAIN_PK` adicionada com valor `domain_pk_693160512e7481948351882cd60488950e01b17d570e9d19`
- [ ] Todas as variáveis configuradas para **Production**, **Preview** e **Development**
- [ ] **Redeploy** feito após adicionar as variáveis
- [ ] Testado em produção (`https://ylada.app/pt/wellness/noel`)

---

## 🎯 RESUMO RÁPIDO

| Variável | Valor | Onde Usar |
|----------|-------|-----------|
| `OPENAI_WORKFLOW_ID` | `wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa` | Backend (Agents SDK) |
| `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` | `wf_693116d1017c8190a20e9ff74f72bb4a0e61b0fdaa` | Frontend (ChatKit) |
| `NEXT_PUBLIC_CHATKIT_DOMAIN_PK` | `domain_pk_693160512e7481948351882cd60488950e01b17d570e9d19` | Frontend (ChatKit) |

---

**Status:** ✅ Guia completo para configurar NOEL na Vercel

