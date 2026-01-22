# 📋 GUIA PASSO A PASSO - ATUALIZAR LYA NA OPENAI PLATFORM

**Data:** 2025-01-27  
**Objetivo:** Atualizar o prompt da LYA para incluir capacidades de comunicação + mentoria de negócios

---

## 🔍 PRIMEIRO: DESCUBRA QUAL SISTEMA VOCÊ ESTÁ USANDO

O código da LYA pode usar 3 sistemas diferentes. Você precisa descobrir qual está configurado:

### Opção 1: Verificar arquivo `.env.local`

Abra o arquivo `.env.local` na raiz do projeto e procure por:

- **Se encontrar `LYA_PROMPT_ID=pmpt_...`** → Você usa **Responses API (Prompt Object)**
- **Se encontrar `OPENAI_ASSISTANT_LYA_ID=asst_...`** → Você usa **Assistants API**
- **Se não encontrar nenhum dos dois** → Você usa **Chat Completions (fallback)**

---

## 📝 OPÇÃO 1: SE VOCÊ USA RESPONSES API (Prompt Object)

**Quando:** Você tem `LYA_PROMPT_ID=pmpt_...` no `.env.local`

### PASSO 1: Acessar OpenAI Platform

1. Abra seu navegador
2. Acesse: **https://platform.openai.com**
3. Faça login na sua conta
4. No menu lateral esquerdo, procure por **"Prompts"** (ou vá direto: **https://platform.openai.com/prompts**)

### PASSO 2: Encontrar o Prompt Object da LYA

1. Na lista de prompts, procure por um prompt com nome tipo:
   - "LYA"
   - "LYA — Prompt Mestre"
   - "LYA Nutri"
   - Ou qualquer nome que você tenha dado

2. **Se NÃO encontrar nenhum prompt:**
   - Clique no botão **"+ New"** ou **"Create prompt"** (canto superior direito)
   - Pule para o PASSO 3

3. **Se encontrar o prompt:**
   - Clique no nome do prompt para abrir
   - Clique no botão **"Edit"** (canto superior direito)

### PASSO 3: Copiar o Conteúdo Novo

1. Abra o arquivo: **`docs/LYA-PROMPT-COMPLETO-UNIFICADO.md`**
2. Role até a linha que diz: **"---"** (linha 7)
3. Depois dessa linha, você verá três crases: **```**
4. **Copie TODO o conteúdo** que está entre as três crases (deve começar com "Você é LYA..." e terminar com "Seja essa presença...")
5. **IMPORTANTE:** Copie APENAS o conteúdo entre as crases, NÃO copie as crases nem o texto antes/depois

### PASSO 4: Colar no Campo "Content" ou "System/Instructions"

1. No Prompt Object da OpenAI, você verá um campo grande de texto
2. Pode ter o nome:
   - **"Content"**
   - **"System"**
   - **"Instructions"**
   - Ou apenas um campo grande de texto

3. **Selecione TODO o conteúdo antigo** (Ctrl+A ou Cmd+A)
4. **Delete** (Delete ou Backspace)
5. **Cole o conteúdo novo** que você copiou (Ctrl+V ou Cmd+V)

### PASSO 5: Configurar Variáveis (Se Necessário)

1. Procure por uma seção chamada **"Variables"** ou **"Variáveis"** ou **"Input variables"**
2. Você deve ver variáveis como:
   - `{{diagnostico}}`
   - `{{perfil}}`
   - `{{sistema}}`
   - `{{rag}}`
   - `{{task}}`
   - `{{links_virais}}` ← **Esta é nova!**

3. **Se NÃO tiver a variável `{{links_virais}}`:**
   - Clique em **"+ Add variable"** ou **"Add input"**
   - Digite: `links_virais`
   - Salve

4. **Se já tiver todas as variáveis:** Não precisa fazer nada

### PASSO 6: Salvar

1. Role até o final da página
2. Clique no botão **"Save"** ou **"Publish"** ou **"Update"**
3. Aguarde a confirmação de que foi salvo

### PASSO 7: Verificar o Prompt ID

1. Depois de salvar, você verá o **Prompt ID** (formato: `pmpt_...`)
2. **Copie esse ID**
3. Abra o arquivo `.env.local` na raiz do projeto
4. Procure por `LYA_PROMPT_ID=`
5. **Confirme que o ID está correto** (deve ser igual ao que você viu na OpenAI)
6. Se estiver diferente, atualize: `LYA_PROMPT_ID=pmpt_...` (cole o ID correto)

### ✅ PRONTO!

Agora a LYA está atualizada com as novas capacidades de comunicação.

---

## 📝 OPÇÃO 2: SE VOCÊ USA ASSISTANTS API

**Quando:** Você tem `OPENAI_ASSISTANT_LYA_ID=asst_...` no `.env.local`

### PASSO 1: Acessar OpenAI Platform

1. Abra seu navegador
2. Acesse: **https://platform.openai.com**
3. Faça login na sua conta
4. No menu lateral esquerdo, procure por **"Assistants"** (ou vá direto: **https://platform.openai.com/assistants**)

### PASSO 2: Encontrar o Assistant da LYA

1. Na lista de assistants, procure por um assistant com nome tipo:
   - "LYA"
   - "LYA Nutri"
   - "LYA Mentora"
   - Ou qualquer nome que você tenha dado

2. **Se NÃO encontrar nenhum assistant:**
   - Clique no botão **"+ New"** ou **"Create assistant"** (canto superior direito)
   - Pule para o PASSO 3

3. **Se encontrar o assistant:**
   - Clique no nome do assistant para abrir
   - Clique no botão **"Edit"** (canto superior direito)

### PASSO 3: Copiar o Conteúdo Novo

1. Abra o arquivo: **`docs/LYA-PROMPT-COMPLETO-UNIFICADO.md`**
2. Role até a linha que diz: **"---"** (linha 7)
3. Depois dessa linha, você verá três crases: **```**
4. **Copie TODO o conteúdo** que está entre as três crases (deve começar com "Você é LYA..." e terminar com "Seja essa presença...")
5. **IMPORTANTE:** Copie APENAS o conteúdo entre as crases, NÃO copie as crases nem o texto antes/depois

### PASSO 4: Colar no Campo "Instructions"

1. No Assistant da OpenAI, você verá um campo grande de texto chamado **"Instructions"**
2. **Selecione TODO o conteúdo antigo** (Ctrl+A ou Cmd+A)
3. **Delete** (Delete ou Backspace)
4. **Cole o conteúdo novo** que você copiou (Ctrl+V ou Cmd+V)

### PASSO 5: Configurar Outros Campos (Se Necessário)

1. **Name:** Deixe como está (ou atualize se quiser)
2. **Model:** Deve estar como `gpt-4o-mini` (ou outro modelo que você usa)
3. **Temperature:** Pode deixar como está (geralmente 0.5 a 0.7)
4. **Max tokens:** Pode deixar como está (geralmente 700 a 1000)

### PASSO 6: Salvar

1. Role até o final da página
2. Clique no botão **"Save"** ou **"Update"**
3. Aguarde a confirmação de que foi salvo

### PASSO 7: Verificar o Assistant ID

1. Depois de salvar, você verá o **Assistant ID** (formato: `asst_...`)
2. **Copie esse ID**
3. Abra o arquivo `.env.local` na raiz do projeto
4. Procure por `OPENAI_ASSISTANT_LYA_ID=`
5. **Confirme que o ID está correto** (deve ser igual ao que você viu na OpenAI)
6. Se estiver diferente, atualize: `OPENAI_ASSISTANT_LYA_ID=asst_...` (cole o ID correto)

### ✅ PRONTO!

Agora a LYA está atualizada com as novas capacidades de comunicação.

---

## 📝 OPÇÃO 3: SE VOCÊ USA CHAT COMPLETIONS (Fallback)

**Quando:** Você NÃO tem `LYA_PROMPT_ID` nem `OPENAI_ASSISTANT_LYA_ID` no `.env.local`

### ⚠️ ATENÇÃO

Se você está usando Chat Completions (fallback), o prompt está **dentro do código** e não precisa atualizar nada na OpenAI Platform.

**MAS:** É recomendado migrar para Responses API (Prompt Object) ou Assistants API para ter melhor controle.

### O QUE FAZER AGORA

1. **Opção A (Recomendado):** Criar um Prompt Object na OpenAI (seguir OPÇÃO 1 acima)
2. **Opção B:** Criar um Assistant na OpenAI (seguir OPÇÃO 2 acima)
3. **Opção C:** Deixar como está (o código já funciona, mas sem as novas capacidades de comunicação)

---

## 🎯 RESUMO RÁPIDO

### Se você tem `LYA_PROMPT_ID`:
1. Acesse: https://platform.openai.com/prompts
2. Encontre o prompt da LYA
3. Copie conteúdo de `docs/LYA-PROMPT-COMPLETO-UNIFICADO.md` (entre as ```)
4. Cole no campo "Content" ou "Instructions"
5. Adicione variável `{{links_virais}}` se não tiver
6. Salve

### Se você tem `OPENAI_ASSISTANT_LYA_ID`:
1. Acesse: https://platform.openai.com/assistants
2. Encontre o assistant da LYA
3. Copie conteúdo de `docs/LYA-PROMPT-COMPLETO-UNIFICADO.md` (entre as ```)
4. Cole no campo "Instructions"
5. Salve

### Se você não tem nenhum dos dois:
- O código já funciona, mas sem as novas capacidades
- Recomendo criar um Prompt Object (OPÇÃO 1)

---

## ❓ DÚVIDAS?

**Pergunta:** "Não encontro o prompt/assistant na lista"
- **Resposta:** Crie um novo seguindo os passos acima

**Pergunta:** "O campo não se chama 'Instructions' ou 'Content'"
- **Resposta:** Procure pelo campo maior de texto onde está o prompt atual

**Pergunta:** "Não sei qual sistema estou usando"
- **Resposta:** Abra `.env.local` e procure por `LYA_PROMPT_ID` ou `OPENAI_ASSISTANT_LYA_ID`

**Pergunta:** "O prompt é muito grande, não cabe"
- **Resposta:** O campo aceita textos grandes. Se der erro, tente colar em partes ou verifique se não há caracteres especiais

---

**Status:** ✅ Guia completo e detalhado
