# ✅ SERVIDOR RODANDO - Como Acessar

## 🚀 STATUS

**Servidor:** ✅ **RODANDO**  
**Porta:** `3000`  
**URL:** `http://localhost:3000`

---

## 📍 COMO ACESSAR

### **1. Abrir no Navegador**
```
http://localhost:3000
```

### **2. Acessar Área Nutri Diretamente**
```
http://localhost:3000/pt/nutri/login
```

### **3. Acessar Onboarding (se sem diagnóstico)**
```
http://localhost:3000/pt/nutri/onboarding
```

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

### **Teste Rápido:**
1. Abrir navegador
2. Acessar `http://localhost:3000`
3. **Esperado:** Ver página inicial do YLADA

### **Se não abrir:**
1. Verificar se porta 3000 está livre:
   ```bash
   lsof -ti:3000
   ```
2. Se houver conflito, matar processo:
   ```bash
   kill -9 $(lsof -ti:3000)
   ```
3. Reiniciar servidor:
   ```bash
   cd /Users/air/ylada-app
   npm run dev
   ```

---

## 🧪 TESTAR FLUXO NUTRI

### **Passo 1: Login**
```
http://localhost:3000/pt/nutri/login
```

### **Passo 2: Onboarding (se sem diagnóstico)**
Após login, deve redirecionar para:
```
http://localhost:3000/pt/nutri/onboarding
```

### **Passo 3: Diagnóstico**
Clicar em "Começar Diagnóstico" → vai para:
```
http://localhost:3000/pt/nutri/diagnostico
```

### **Passo 4: Home**
Após completar diagnóstico → vai para:
```
http://localhost:3000/pt/nutri/home
```

---

## 🐛 PROBLEMAS COMUNS

### **Erro: "Port already in use"**
```bash
# Matar processo na porta 3000
kill -9 $(lsof -ti:3000)

# Reiniciar
npm run dev
```

### **Erro: "Cannot find module"**
```bash
# Reinstalar dependências
npm install

# Reiniciar
npm run dev
```

### **Página em branco**
1. Verificar console do navegador (F12)
2. Verificar logs do terminal
3. Verificar variáveis de ambiente

---

## 📝 LOGS DO SERVIDOR

Os logs do servidor estão sendo escritos em:
```
~/.cursor/projects/Users-air-ylada-app/terminals/944269.txt
```

Para ver logs em tempo real, verifique o terminal onde o servidor está rodando.

---

**Status:** ✅ Servidor rodando  
**Próxima ação:** Acessar `http://localhost:3000` no navegador


