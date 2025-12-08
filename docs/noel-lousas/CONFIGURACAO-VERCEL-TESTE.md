# 🚀 Configuração Vercel + Teste NOEL

**Data:** 2025-01-27  
**Status:** ✅ **GUIA COMPLETO**

---

## 📋 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

### **1. Configurar na Vercel**

Acesse: **Vercel Dashboard → Seu Projeto → Settings → Environment Variables**

Adicione estas variáveis:

```env
# Assistants API
OPENAI_ASSISTANT_NOEL_ID=asst_... (ID do seu Assistant no OpenAI)

# Autenticação Functions (opcional, mas recomendado)
OPENAI_FUNCTION_SECRET=noel-functions-secret-2025-abc123xyz789

# URL da aplicação (produção)
NEXT_PUBLIC_APP_URL=https://www.ylada.com

# OpenAI API Key (já deve existir)
OPENAI_API_KEY=sk-...
```

---

## 🔑 GERAR SECRET PARA FUNCTIONS

Se ainda não tem o `OPENAI_FUNCTION_SECRET`, gere um:

```bash
# No terminal
openssl rand -hex 32
```

Ou use um gerador online: https://randomkeygen.com/

**Exemplo de secret:**
```
noel-functions-secret-2025-abc123xyz789def456ghi012jkl345mno678pqr901stu234vwx567yz890
```

---

## ✅ CHECKLIST PRÉ-TESTE

Antes de testar, confirme:

- [ ] `OPENAI_ASSISTANT_NOEL_ID` configurado na Vercel
- [ ] `OPENAI_API_KEY` configurado na Vercel
- [ ] `NEXT_PUBLIC_APP_URL=https://www.ylada.com` na Vercel
- [ ] `OPENAI_FUNCTION_SECRET` configurado (opcional, mas recomendado)
- [ ] Assistant criado no OpenAI com as 6 functions
- [ ] Migration `010-criar-tabelas-noel-functions.sql` executada no Supabase
- [ ] Deploy na Vercel concluído

---

## 🧪 COMO TESTAR O NOEL

### **1. Acessar o Chat do NOEL**

URL: `https://www.ylada.com/pt/wellness/noel`

Ou local: `http://localhost:3000/pt/wellness/noel`

### **2. Perguntas para Testar**

#### **Teste 1: Pergunta Simples (sem function)**
```
"Olá, quem é você?"
```

**O que deve acontecer:**
- ✅ NOEL responde diretamente (sem chamar functions)
- ✅ Resposta institucional sobre quem é o NOEL

---

#### **Teste 2: Pergunta que precisa de Perfil (getUserProfile)**
```
"Qual é meu objetivo principal?"
```

**O que deve acontecer:**
- ✅ Assistants API detecta: precisa chamar `getUserProfile`
- ✅ Backend executa: `POST /api/noel/getUserProfile`
- ✅ Retorna dados do perfil do Supabase
- ✅ NOEL responde personalizado com os dados

**Logs esperados:**
```
🤖 [NOEL] Iniciando fluxo Assistants API...
🔧 Executando function: getUserProfile
✅ Function getUserProfile executada com sucesso
📤 Enviando resultado(s) para Assistants API
✅ [NOEL] Assistants API retornou resposta
```

---

#### **Teste 3: Pergunta sobre Plano (getPlanDay)**
```
"Em qual dia do plano de 90 dias eu estou?"
```

**O que deve acontecer:**
- ✅ Assistants API chama `getPlanDay`
- ✅ Backend busca no Supabase
- ✅ NOEL responde com o dia atual

---

#### **Teste 4: Registrar Lead (registerLead)**
```
"Registra um novo cliente: João Silva, telefone 11999999999"
```

**O que deve acontecer:**
- ✅ Assistants API chama `registerLead`
- ✅ Backend salva no Supabase (`noel_leads`)
- ✅ NOEL confirma o registro

---

#### **Teste 5: Atualizar Plano (updatePlanDay)**
```
"Avance meu plano para o dia 5"
```

**O que deve acontecer:**
- ✅ Assistants API chama `updatePlanDay`
- ✅ Backend atualiza no Supabase
- ✅ NOEL confirma a atualização

---

#### **Teste 6: Salvar Interação (saveInteraction)**
```
"Preciso de um script para fazer uma oferta"
```

**O que deve acontecer:**
- ✅ NOEL responde com script
- ✅ Interação salva automaticamente em `noel_interactions`
- ✅ Log: `💾 [NOEL] Interação salva no Supabase`

---

## 🔍 VERIFICAR LOGS

### **No Console do Navegador (F12)**
- Verificar se `threadId` está sendo salvo
- Verificar se `functionCalls` aparecem na resposta

### **No Terminal (local) ou Vercel Logs (produção)**
- Procurar por: `🤖 [NOEL]`
- Procurar por: `🔧 Executando function:`
- Procurar por: `✅ Function ... executada com sucesso`

---

## ❌ PROBLEMAS COMUNS

### **Erro: "OPENAI_ASSISTANT_NOEL_ID não configurado"**
**Solução:** Adicionar variável na Vercel e fazer novo deploy

---

### **Erro: "Run falhou com status: failed"**
**Possíveis causas:**
- Assistant ID incorreto
- Functions não configuradas no Assistant
- Erro nas rotas `/api/noel/*`

**Solução:**
1. Verificar Assistant ID no OpenAI
2. Verificar se as 6 functions estão no Assistant
3. Testar rotas manualmente: `POST /api/noel/getUserProfile`

---

### **Erro: "Function desconhecida: xxx"**
**Solução:** Verificar se o nome da function no Assistant corresponde ao switch case em `noel-assistant-handler.ts`

---

### **Erro: "401 Unauthorized" nas functions**
**Solução:** 
- Verificar se `OPENAI_FUNCTION_SECRET` está configurado
- Verificar se o secret está correto

---

### **Functions não são chamadas**
**Possíveis causas:**
- System prompt do Assistant não instrui o uso de functions
- Assistant não tem as functions configuradas
- Pergunta não requer function

**Solução:**
1. Verificar System Prompt do Assistant
2. Adicionar instruções para usar functions quando necessário
3. Testar com perguntas que claramente precisam de dados (ex: "Qual é meu dia atual?")

---

## 📊 VERIFICAR DADOS NO SUPABASE

### **Verificar Interações Salvas:**
```sql
SELECT * FROM noel_interactions 
ORDER BY created_at DESC 
LIMIT 10;
```

### **Verificar Perfil:**
```sql
SELECT * FROM noel_users_profile 
WHERE user_id = 'seu-user-id';
```

### **Verificar Plano:**
```sql
SELECT * FROM noel_plan_progress 
WHERE user_id = 'seu-user-id';
```

### **Verificar Leads:**
```sql
SELECT * FROM noel_leads 
WHERE user_id = 'seu-user-id';
```

---

## ✅ TESTE COMPLETO - FLUXO END-TO-END

### **Sequência de Testes:**

1. **Pergunta simples** → Verificar resposta direta
2. **Pergunta sobre perfil** → Verificar `getUserProfile` executado
3. **Pergunta sobre plano** → Verificar `getPlanDay` executado
4. **Registrar lead** → Verificar `registerLead` executado e salvo no Supabase
5. **Atualizar plano** → Verificar `updatePlanDay` executado e atualizado no Supabase
6. **Verificar interações** → Confirmar que todas foram salvas em `noel_interactions`

---

## 🎯 RESULTADO ESPERADO

Após todos os testes, você deve ter:

- ✅ NOEL respondendo corretamente
- ✅ Functions sendo executadas quando necessário
- ✅ Dados sendo salvos no Supabase
- ✅ Thread sendo mantido entre mensagens
- ✅ Logs claros e informativos
- ✅ Tratamento de erros funcionando

---

## 📝 PRÓXIMOS PASSOS APÓS TESTE

1. **Ajustar System Prompt** (se necessário)
   - Adicionar mais instruções sobre quando usar cada function
   - Melhorar personalização das respostas

2. **Otimizar Performance**
   - Reduzir tempo de resposta
   - Cache de dados quando apropriado

3. **Adicionar Mais Functions** (se necessário)
   - Funções específicas do seu negócio
   - Integrações adicionais

---

**Status:** ✅ **PRONTO PARA TESTAR**
