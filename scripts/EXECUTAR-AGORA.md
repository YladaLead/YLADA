# 🚀 EXECUTAR AGORA - Setup Contas de Teste

## ⚡ **PASSO A PASSO RÁPIDO**

### **1️⃣ Criar Conta Completa (nutri1@ylada.com)**

```bash
# 1. Abra: https://supabase.com/dashboard
# 2. Selecione seu projeto YLADA
# 3. Menu lateral: SQL Editor
# 4. Clique: + New Query
# 5. Copie TUDO do arquivo abaixo e cole:
```

📄 **Arquivo:** `scripts/SETUP-NUTRI1-COMPLETO.sql`

```bash
# 6. Clique: RUN (botão verde)
# 7. Aguarde: "Success. No rows returned"
# 8. ✅ PRONTO!
```

**O que foi criado:**
```
✅ nutri1@ylada.com (senha: Ylada2025!)
✅ Perfil: Dra. Mariana Silva
✅ 3 clientes cadastrados
✅ 3 formulários criados
✅ 7 respostas (3 não visualizadas)
✅ Badge aparecerá com número "3"
```

---

### **2️⃣ Criar Conta Dia 1 (demo.nutri@ylada.com)**

```bash
# 1. Mesma página do Supabase
# 2. SQL Editor → + New Query
# 3. Copie TUDO do arquivo abaixo e cole:
```

📄 **Arquivo:** `scripts/SETUP-DEMO-NUTRI-DIA1.sql`

```bash
# 4. Clique: RUN
# 5. Aguarde: "Success"
# 6. ✅ PRONTO!
```

**O que foi criado:**
```
✅ demo.nutri@ylada.com (senha: Ylada2025!)
✅ Perfil básico
❌ ZERO formulários
❌ ZERO respostas
❌ ZERO clientes
🎬 Perfeito para gravação!
```

---

## 🧪 **TESTAR AS CONTAS**

### **Teste 1: Conta Completa**

1. Acesse: https://ylada-eosin.vercel.app (ou seu domínio)
2. Login:
   - Email: `nutri1@ylada.com`
   - Senha: `Ylada2025!`
3. Ir para: **Gestão de Clientes** → **Formulários** 📝
4. ✅ Deve ver 3 formulários
5. ✅ Badge vermelho com "3" no botão "Respostas"

### **Teste 2: Conta Dia 1**

1. Abrir aba anônima (Ctrl+Shift+N ou Cmd+Shift+N)
2. Acesse: https://ylada-eosin.vercel.app
3. Login:
   - Email: `demo.nutri@ylada.com`
   - Senha: `Ylada2025!`
4. Ir para: **Formulários**
5. ✅ Tela vazia (zero formulários)
6. ✅ Ver seção "Templates Prontos"

---

## 🎬 **PREPARAR GRAVAÇÃO**

### **Abrir 2 Navegadores:**

**Navegador 1 (Chrome)** → `nutri1@ylada.com`
- Para mostrar ambiente completo
- Badge funcionando
- Respostas existentes

**Navegador 2 (Firefox/Edge)** → `demo.nutri@ylada.com`
- Para gravar do zero
- Criar formulários
- Usar templates
- Compartilhar WhatsApp

---

## 📋 **ROTEIRO DE GRAVAÇÃO (5 min)**

### **Cena 1: Mostrar Badge (30s)**
- Navegador 1 (nutri1@ylada.com)
- Página de formulários
- Apontar badge vermelho "3"
- "Olha só, tenho 3 respostas não visualizadas!"

### **Cena 2: Abrir Resposta (30s)**
- Clicar em "Respostas"
- Abrir resposta da Júlia
- Badge diminui para "2"
- "Viu? Marcou como visualizada automaticamente!"

### **Cena 3: Templates (1 min)**
- Navegador 2 (demo.nutri@ylada.com)
- Tela limpa, primeira vez
- Seção "Templates Prontos"
- Clicar "Usar Template" em Anamnese
- "Pronto, já tenho uma anamnese completa!"

### **Cena 4: Compartilhar WhatsApp (1 min)**
- Botão verde "💬 Compartilhar"
- Abre WhatsApp
- Mensagem pré-formatada
- Enviar para si mesmo
- Abrir link no celular

### **Cena 5: LYA Criar Formulário (2 min)**
- Abrir chat da LYA
- Botões de sugestão aparecem
- Clicar "📝 Criar formulário de anamnese"
- LYA cria automaticamente
- "LYA, resume a última resposta"
- LYA resume (sem análise clínica)
- Disclaimer: "Análises clínicas são sua responsabilidade"

---

## ✅ **CHECKLIST PRÉ-GRAVAÇÃO**

- [ ] Executei `SETUP-NUTRI1-COMPLETO.sql` no Supabase
- [ ] Executei `SETUP-DEMO-NUTRI-DIA1.sql` no Supabase
- [ ] Testei login em `nutri1@ylada.com` → ✅ Funcionou
- [ ] Testei login em `demo.nutri@ylada.com` → ✅ Funcionou
- [ ] Badge "3" aparece em nutri1 → ✅ Sim
- [ ] Tela zerada em demo.nutri → ✅ Sim
- [ ] Templates aparecem → ✅ Sim
- [ ] Abri 2 navegadores diferentes
- [ ] Testei microfone/câmera
- [ ] Limpei notificações/abas desnecessárias

---

## 🔧 **TROUBLESHOOTING**

### **Problema: Conta não funciona**

```sql
-- Execute novamente o script SQL
-- Ele vai recriar tudo do zero
```

### **Problema: Badge não aparece**

```sql
-- Verifique se as respostas foram criadas como "viewed = false"
-- Execute novamente SETUP-NUTRI1-COMPLETO.sql
```

### **Problema: Templates não aparecem**

```sql
-- Execute a migration de templates primeiro:
-- migrations/inserir-templates-formularios.sql
```

---

## 📞 **CONTATOS ÚTEIS**

**Supabase Dashboard:**
https://supabase.com/dashboard

**Aplicação:**
https://ylada-eosin.vercel.app

**Documentação Completa:**
- `scripts/README-CONTAS-TESTE.md`
- `PRONTO-PARA-TESTAR.md`
- `CHECKLIST-TESTES-FORMULARIOS-LYA.md`

---

## 🎯 **ORDEM DE EXECUÇÃO**

```
1. ✅ Executar SETUP-NUTRI1-COMPLETO.sql      (5 seg)
2. ✅ Executar SETUP-DEMO-NUTRI-DIA1.sql      (2 seg)
3. ✅ Testar login em ambas as contas         (1 min)
4. ✅ Verificar badge em nutri1               (10 seg)
5. ✅ Verificar tela zerada em demo.nutri     (10 seg)
6. 🎬 GRAVAR!
```

**Tempo total de setup: ~2 minutos**

---

**Última atualização:** 18/12/2024  
**Versão:** 1.0

✅ **TUDO PRONTO PARA GRAVAR!** 🎬
