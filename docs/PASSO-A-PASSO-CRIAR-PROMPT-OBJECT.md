# 📋 PASSO A PASSO - Criar Prompt Object LYA na OpenAI Platform

**Guia completo do que você precisa fazer manualmente**

---

## ✅ O QUE JÁ FOI FEITO (AUTOMÁTICO)

- ✅ Template do Prompt Object criado (`docs/TEMPLATE-PROMPT-OBJECT-LYA.md`)
- ✅ Endpoint `/api/nutri/lya/analise-v2` criado (preparado para Responses API)
- ✅ Código com fallback para chat completions

---

## 🎯 O QUE VOCÊ PRECISA FAZER (MANUAL)

### **PASSO 1: Acessar OpenAI Platform**

1. Acesse: https://platform.openai.com
2. Faça login na sua conta
3. No menu lateral, clique em **"Prompts"** (ou vá direto: https://platform.openai.com/prompts)

---

### **PASSO 2: Criar Novo Prompt**

1. Clique no botão **"Create prompt"** (ou **"+ New"**)
2. Você verá um formulário para criar o prompt

---

### **PASSO 3: Preencher Informações**

1. **Name (Nome):**
   ```
   LYA — Prompt Mestre (Nutri YLADA)
   ```

2. **Description (Descrição - opcional):**
   ```
   Prompt mestre da mentora LYA para nutricionistas. Inclui identidade, missão, regras, formato fixo de resposta e lógica de decisão.
   ```

3. **Content (Conteúdo):**
   - Abra o arquivo: `docs/TEMPLATE-PROMPT-OBJECT-LYA.md`
   - Copie TODO o conteúdo da seção "📝 CONTEÚDO DO PROMPT OBJECT"
   - Cole no campo "Content" ou "System/Instructions"

---

### **PASSO 4: Configurar Variáveis (Opcional mas Recomendado)**

Se o Dashboard permitir definir variáveis, adicione:

- `{{diagnostico}}`
- `{{perfil}}`
- `{{sistema}}`
- `{{rag}}`
- `{{task}}`

**Nota:** Se não houver campo específico para variáveis, não se preocupe. As variáveis podem ser enviadas no código mesmo.

---

### **PASSO 5: Configurações Avançadas (Opcional)**

Se disponível, configure:

- **Model:** `gpt-4o-mini` (ou deixe padrão)
- **Temperature:** `0.5` (ou deixe padrão)
- **Max tokens:** `700` (ou deixe padrão)

**Nota:** Essas configurações podem ser sobrescritas no código, então não é crítico.

---

### **PASSO 6: Salvar e Publicar**

1. Clique em **"Save"** ou **"Publish"**
2. O Dashboard vai gerar um `prompt_id`
3. **COPIE O `prompt_id`** (formato: `pmpt_...`)
   - Exemplo: `pmpt_abc123xyz...`

---

### **PASSO 7: Adicionar no .env**

1. Abra o arquivo `.env` (ou `.env.local`)
2. Adicione a linha:
   ```
   LYA_PROMPT_ID=pmpt_...
   ```
   (Substitua `pmpt_...` pelo ID real que você copiou)

3. Salve o arquivo
4. Reinicie o servidor (`npm run dev`)

---

### **PASSO 8: Testar**

1. O endpoint `/api/nutri/lya/analise-v2` já está pronto
2. Por enquanto, ele usa **fallback** (chat completions)
3. Quando Responses API estiver disponível, ele tentará usar o Prompt Object automaticamente

**Para testar:**
- Faça login na área Nutri
- A análise da LYA será gerada normalmente
- Verifique os logs do servidor para ver se está usando o `prompt_id`

---

## 🔍 VERIFICAÇÃO

### **Como saber se funcionou:**

1. **No terminal do servidor**, você deve ver:
   ```
   🤖 [LYA v2] Tentando usar Responses API com prompt_id: pmpt_...
   ```
   ou
   ```
   ⚠️ [LYA v2] Responses API não disponível, usando fallback
   ```

2. **No console do navegador**, a análise deve aparecer normalmente

3. **No Supabase**, verifique a tabela `ai_memory_events`:
   ```sql
   SELECT * FROM ai_memory_events 
   WHERE user_id = 'seu-user-id'
   ORDER BY created_at DESC
   LIMIT 1;
   ```
   
   Deve mostrar `prompt_id` no campo `conteudo`.

---

## ⚠️ IMPORTANTE

- **Por enquanto:** O sistema usa **fallback** (chat completions) porque Responses API ainda não está totalmente disponível
- **Quando Responses API estiver disponível:** O código tentará usar automaticamente
- **Não quebra nada:** Se Responses API não funcionar, volta para chat completions

---

## 📝 PRÓXIMOS PASSOS (DEPOIS DE CRIAR)

1. ✅ Prompt Object criado
2. ✅ `prompt_id` adicionado no `.env`
3. ⏳ Aguardar Responses API estar disponível
4. ⏳ Testar com Responses API quando disponível
5. ⏳ Migrar gradualmente (5% → 25% → 100%)

---

## 🆘 SE DER ERRO

**Erro: "Responses API não disponível"**
- ✅ Normal! Por enquanto usa fallback
- ✅ Sistema continua funcionando normalmente

**Erro: "prompt_id não encontrado"**
- Verifique se o `prompt_id` está correto no `.env`
- Verifique se o Prompt Object foi publicado no Dashboard

**Erro: "Variáveis não encontradas"**
- Normal, variáveis são enviadas no código
- Não precisa configurar no Dashboard

---

## ✅ RESUMO

1. ✅ Acessar OpenAI Platform → Prompts
2. ✅ Criar novo prompt
3. ✅ Colar template do `TEMPLATE-PROMPT-OBJECT-LYA.md`
4. ✅ Salvar e copiar `prompt_id`
5. ✅ Adicionar `LYA_PROMPT_ID=pmpt_...` no `.env`
6. ✅ Reiniciar servidor
7. ✅ Testar (vai usar fallback por enquanto)

**Pronto! O sistema está preparado para Responses API quando estiver disponível.**

