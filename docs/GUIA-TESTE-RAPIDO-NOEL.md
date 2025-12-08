# 🧪 GUIA DE TESTE RÁPIDO - NOEL

**Tempo estimado:** 10 minutos

---

## ✅ PRÉ-REQUISITOS

Antes de testar, confirme:

- [x] Migração SQL executada ✅
- [ ] Prompt Mestre atualizado no Assistants API
- [x] Variáveis de ambiente configuradas localmente ✅
- [ ] Servidor rodando localmente

---

## 🚀 PASSO 1: Iniciar Servidor

```bash
# No terminal, na pasta do projeto
npm run dev
```

**Aguardar:** Servidor iniciar em `http://localhost:3000`

**Verificar:** Console sem erros críticos

---

## 🧪 PASSO 2: Acessar Chat do NOEL

1. Abra o navegador
2. Acesse: `http://localhost:3000/pt/wellness/noel`
3. Faça login (se necessário)

---

## 📋 PASSO 3: Executar 3 Testes Essenciais

**📖 Lista completa de perguntas:** Ver `docs/PERGUNTAS-TESTE-NOEL.md`

### **Teste 1: Detecção de Perfil (Bebidas)**

**Pergunta:**
```
Me dá um convite leve para vender kit de energia.
```

**O que verificar:**
- ✅ NOEL responde com convite curto e leve
- ✅ Resposta tem CTA (pergunta final)
- ✅ Linguagem simples e direta
- ✅ Nos logs do terminal, verificar:
  - `👤 [NOEL] Perfil detectado: beverage_distributor`
  - `🎯 [NOEL] Intenção detectada: mentor`

**Resultado esperado:**
```
Oi [Nome], tudo bem? 😊 

Estou participando de um projeto de bem-estar e queria te mandar um presente: um kit de energia/renovação para testar nos próximos dias. Sem compromisso. Posso te enviar aqui mesmo?

Quer que eu te mande mais opções de convite leve?
```

---

### **Teste 2: Venda de Produto (Shake)**

**Pergunta:**
```
Como vendo shake para um cliente?
```

**O que verificar:**
- ✅ NOEL responde com script de venda
- ✅ Resposta adaptada para produto fechado
- ✅ Explicação técnica leve
- ✅ Nos logs do terminal, verificar:
  - `👤 [NOEL] Perfil detectado: product_distributor` (ou null se primeira vez)
  - `🎯 [NOEL] Intenção detectada: mentor` ou `tecnico`

**Resultado esperado:**
```
O shake substitui uma refeição completa com proteínas e nutrientes.

💬 Mensagem pronta:

"Oi [Nome], posso te ajudar a substituir uma refeição por algo prático, nutritivo e que reduz calorias sem perder energia. Quer conhecer os sabores?"

Quer que eu adapte essa mensagem para seu estilo?
```

---

### **Teste 3: Explicar Fluxo 2-5-10**

**Pergunta:**
```
O que é 2-5-10?
```

**O que verificar:**
- ✅ NOEL explica o fluxo claramente
- ✅ Resposta tem ação prática
- ✅ CTA final
- ✅ Nos logs do terminal, verificar:
  - `🎯 [NOEL] Intenção detectada: mentor`
  - `💾 [NOEL] Interação salva no Supabase`

**Resultado esperado:**
```
O 2-5-10 é sua rotina mínima:

- 2 convites
- 5 follow-ups  
- 10 contatos leves

Se fizer isso 5× por semana, você cria movimento, clientes e equipe. É o hábito principal da duplicação.

Quer que eu te monte um checklist de hoje com essas ações?
```

---

## 🔍 PASSO 4: Verificar Logs no Terminal

Após cada teste, verificar no terminal:

### **Logs Esperados (Sucesso):**

```
🚀 [NOEL] ==========================================
🚀 [NOEL] ENDPOINT /api/wellness/noel CHAMADO
🚀 [NOEL] ==========================================
✅ [NOEL] Autenticação OK - User ID: xxx
🔍 [NOEL] Verificando configuração Assistants API...
🔍 [NOEL] OPENAI_ASSISTANT_NOEL_ID: ✅ Configurado
🤖 [NOEL] INICIANDO ASSISTANTS API
👤 [NOEL] Perfil detectado: beverage_distributor
🎯 [NOEL] Intenção detectada: mentor (confiança: 0.85)
✅ [NOEL] ASSISTANTS API RETORNOU RESPOSTA
💾 [NOEL] Interação salva no Supabase
```

### **Logs de Erro (Se houver problema):**

```
❌ [NOEL] OPENAI_ASSISTANT_NOEL_ID NÃO CONFIGURADO
```

**Solução:** Verificar variável no `.env.local`

```
❌ [NOEL] ASSISTANTS API FALHOU
❌ [NOEL] Erro: ...
```

**Solução:** Verificar se Prompt Mestre foi atualizado

---

## ✅ PASSO 5: Verificar Banco de Dados (Opcional)

Se quiser verificar se os dados estão sendo salvos:

1. Acessar Supabase Dashboard
2. Ir em Table Editor
3. Verificar tabela `noel_interactions`:
   - Deve ter registros novos
   - Coluna `profile_detected` deve ter valor
   - Coluna `category_detected` deve ter valor
   - Coluna `thread_id` deve ter valor

4. Verificar tabela `noel_user_settings`:
   - Deve ter registro do seu usuário
   - Coluna `profile_type` deve ter valor (se detectado)

---

## 🎯 CHECKLIST DE VALIDAÇÃO

Após os 3 testes, confirme:

- [ ] ✅ Teste 1 passou (convite leve)
- [ ] ✅ Teste 2 passou (venda shake)
- [ ] ✅ Teste 3 passou (2-5-10)
- [ ] ✅ Logs mostram perfil sendo detectado
- [ ] ✅ Logs mostram intenção sendo detectada
- [ ] ✅ Interações sendo salvas no BD
- [ ] ✅ Sem erros críticos no console

---

## ⚠️ PROBLEMAS COMUNS

### **Problema 1: "OPENAI_ASSISTANT_NOEL_ID não configurado"**

**Solução:**
```bash
# Verificar .env.local
cat .env.local | grep OPENAI_ASSISTANT_NOEL_ID

# Se não existir, adicionar:
echo "OPENAI_ASSISTANT_NOEL_ID=asst_pu4Tpeox9tIdP0s2i6UhX6Em" >> .env.local

# Reiniciar servidor
npm run dev
```

---

### **Problema 2: "Assistants API falhou"**

**Possíveis causas:**
- Prompt Mestre não foi atualizado
- Assistant ID incorreto
- API Key inválida

**Solução:**
1. Verificar se Prompt Mestre foi atualizado no OpenAI Platform
2. Verificar Assistant ID no `.env.local`
3. Verificar API Key no `.env.local`

---

### **Problema 3: "Perfil não detectado"**

**Normal se:**
- É a primeira interação do usuário
- Mensagem não tem palavras-chave claras

**Solução:**
- NOEL deve perguntar: "Para te ajudar melhor: você trabalha mais com bebidas, produtos fechados ou acompanhamento?"
- Responder e testar novamente

---

## 🚀 PRÓXIMOS PASSOS

Após validar os 3 testes:

1. ✅ **Commit + Deploy**
   ```bash
   git add .
   git commit -m "feat: implementar detecção de perfil NOEL"
   git push
   ```

2. ✅ **Verificar na Vercel**
   - Confirmar que variáveis de ambiente estão configuradas
   - Aguardar deploy completar
   - Testar em produção

---

## 📝 NOTAS

- **Primeira vez:** Pode demorar alguns segundos para responder (cold start)
- **Perfil não detectado:** Normal na primeira interação, será salvo automaticamente
- **Logs detalhados:** Todos os logs estão no terminal, não no navegador

---

**Boa sorte com os testes! 🚀**
