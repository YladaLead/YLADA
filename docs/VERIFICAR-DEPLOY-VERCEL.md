# 🔍 Verificar e Forçar Deploy na Vercel

## ❌ Problema: Commits com "X 0/1" no GitHub

Quando os commits mostram "X 0/1", significa que as verificações (checks) do GitHub não estão passando, mesmo que o build local funcione.

---

## ✅ SOLUÇÃO: Deploy Manual na Vercel

### **Passo 1: Acessar Vercel Dashboard**

1. Acesse: https://vercel.com/dashboard
2. Faça login
3. Selecione o projeto **YLADA**

### **Passo 2: Verificar Status Atual**

1. Vá em **Deployments** (no menu lateral)
2. Verifique o último deploy:
   - ✅ **"Ready"** (verde) = Deploy bem-sucedido
   - ⏳ **"Building"** = Deploy em andamento
   - ❌ **"Error"** = Deploy falhou (clique para ver logs)

### **Passo 3: Fazer Redeploy Manual**

**Opção A: Redeploy do Último Commit (Recomendado)**

1. Na lista de **Deployments**, encontre o último deploy
2. Clique nos **3 pontinhos** (⋯) à direita
3. Selecione **"Redeploy"**
4. Aguarde 2-5 minutos

**Opção B: Deploy de um Commit Específico**

1. Vá em **Deployments**
2. Clique em **"..."** no topo direito
3. Selecione **"Deploy"**
4. Escolha o branch: `main`
5. Escolha o commit: `d9d9593` (ou o mais recente)
6. Clique em **"Deploy"**

---

## 🔍 Verificar Logs do Deploy

Se o deploy falhar:

1. Clique no deploy que falhou
2. Vá em **"Build Logs"** ou **"Functions"**
3. Procure por erros em vermelho
4. Copie a mensagem de erro

**Erros comuns:**
- `Module not found` → Dependência faltando
- `Syntax error` → Erro de código
- `Environment variable missing` → Variável não configurada

---

## ⚙️ Verificar Integração GitHub-Vercel

Se os deploys não estão iniciando automaticamente:

1. Vercel → **Settings** → **Git**
2. Verifique se o repositório está conectado
3. Verifique se o branch `main` está configurado para **"Auto-deploy"**
4. Se não estiver conectado:
   - Clique em **"Connect Git Repository"**
   - Selecione o repositório `YladaLead/YLADA`
   - Autorize a conexão

---

## ✅ Após o Deploy

1. Aguarde o status mudar para **"Ready"** (verde)
2. Acesse: `https://www.ylada.com` (ou seu domínio)
3. Teste a funcionalidade alterada
4. Verifique se as mudanças estão aplicadas

---

## 📝 Status Atual

**Último commit:** `d9d9593` - "fix: Corrige imports de autenticação nos endpoints de Carol"

**Build local:** ✅ Funcionando

**Próximo passo:** Fazer redeploy manual na Vercel

---

**Última atualização:** Janeiro 2025
