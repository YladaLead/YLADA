# 🚀 Como Fazer Deploy Manual na Vercel

## 📋 Situação

Os commits foram feitos e enviados para o GitHub, mas o deploy automático pode não ter sido acionado.

---

## ✅ SOLUÇÃO RÁPIDA: Deploy Manual

### **Opção 1: Via Dashboard da Vercel (Recomendado)**

1. **Acesse:** https://vercel.com/dashboard
2. **Selecione o projeto:** YLADA (ou o nome do seu projeto)
3. **Vá em "Deployments"** (no menu lateral)
4. **Clique nos 3 pontinhos** (⋯) do último deploy
5. **Selecione "Redeploy"**
6. **Aguarde** o deploy completar (2-5 minutos)

### **Opção 2: Via Git (Forçar Novo Deploy)**

```bash
git commit --allow-empty -m "trigger: Forçar novo deploy"
git push origin main
```

Isso cria um commit vazio que força a Vercel a fazer um novo deploy.

---

## 🔍 Verificar Status do Deploy

### **1. Verificar se há deploy em andamento:**
- Vercel Dashboard → Deployments
- Procure por status: "Building", "Ready", ou "Error"

### **2. Verificar logs de erro:**
- Clique no deploy
- Vá em "Functions" ou "Build Logs"
- Procure por erros em vermelho

### **3. Verificar integração GitHub:**
- Vercel Dashboard → Settings → Git
- Verifique se o repositório está conectado
- Verifique se o branch `main` está configurado para deploy automático

---

## ⚠️ Problemas Comuns

### **Deploy não inicia automaticamente:**
- **Causa:** Integração GitHub-Vercel pode estar desconectada
- **Solução:** Vercel → Settings → Git → Reconectar repositório

### **Deploy falha:**
- **Causa:** Erro de build ou variáveis de ambiente faltando
- **Solução:** Verificar logs do deploy e corrigir erros

### **Deploy demora muito:**
- **Causa:** Build grande ou muitos arquivos
- **Solução:** Normal, aguarde. Deploys podem levar até 10 minutos.

---

## ✅ Após o Deploy

1. **Aguarde** o status mudar para "Ready" (verde)
2. **Acesse** o site: `https://ylada-eosin.vercel.app` (ou seu domínio)
3. **Teste** a funcionalidade que foi alterada
4. **Verifique** se as mudanças estão aplicadas

---

## 📝 Links Úteis

- **Dashboard Vercel:** https://vercel.com/dashboard
- **Documentação Vercel:** https://vercel.com/docs
- **Status do Deploy:** Vercel Dashboard → Deployments
