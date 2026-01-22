# 📋 GUIA VISUAL - COPIAR E COLAR O PROMPT DA LYA

**Data:** 2025-01-27  
**Objetivo:** Mostrar EXATAMENTE o que copiar e onde colar

---

## 🎯 PASSO 1: ABRIR O ARQUIVO COM O PROMPT

1. Abra o arquivo: **`docs/LYA-PROMPT-COMPLETO-UNIFICADO.md`**
2. Você verá algo assim:

```
# 🤖 LYA - Prompt Completo Unificado...

---

```

3. **IMPORTANTE:** Você precisa copiar o conteúdo que está DENTRO das três crases (```)

---

## 📝 PASSO 2: ENCONTRAR ONDE COMEÇA E TERMINA

No arquivo `docs/LYA-PROMPT-COMPLETO-UNIFICADO.md`:

1. **Procure pela linha 9** que diz: **`---`**
2. **Depois dessa linha**, você verá: **````** (três crases)
3. **Depois das três crases**, começa o texto que você precisa copiar
4. O texto começa com: **"Você é LYA, mentora estratégica oficial..."**
5. O texto termina com: **"...Seja essa presença de clareza, direção, ação e organização."**
6. **Depois do texto**, você verá novamente: **````** (três crases)

### ✅ O QUE COPIAR:

Copie **TUDO** que está entre as três crases, desde:
- **Começo:** "Você é LYA, mentora estratégica oficial da plataforma Nutri YLADA."
- **Fim:** "...Seja essa presença de clareza, direção, ação e organização."

### ❌ O QUE NÃO COPIAR:

- ❌ NÃO copie as três crases (```)
- ❌ NÃO copie o texto antes do "---"
- ❌ NÃO copie o texto depois das três crases finais

---

## 🖥️ PASSO 3: ONDE COLAR (DEPENDENDO DO SEU SISTEMA)

### OPÇÃO A: Se você usa Prompt Object (Responses API)

1. Acesse: **https://platform.openai.com/prompts**
2. Encontre o prompt da LYA e clique nele
3. Clique em **"Edit"**
4. Você verá um campo grande de texto (pode se chamar "Content", "System" ou "Instructions")
5. **Selecione TODO o conteúdo antigo** (Ctrl+A ou Cmd+A)
6. **Delete tudo**
7. **Cole o conteúdo novo** que você copiou (Ctrl+V ou Cmd+V)
8. Clique em **"Save"**

### OPÇÃO B: Se você usa Assistant (Assistants API)

1. Acesse: **https://platform.openai.com/assistants**
2. Encontre o assistant da LYA e clique nele
3. Clique em **"Edit"**
4. Você verá um campo chamado **"Instructions"**
5. **Selecione TODO o conteúdo antigo** (Ctrl+A ou Cmd+A)
6. **Delete tudo**
7. **Cole o conteúdo novo** que você copiou (Ctrl+V ou Cmd+V)
8. Clique em **"Save"**

---

## 📋 EXEMPLO VISUAL DO QUE COPIAR

```
---  ← NÃO copie esta linha

```  ← NÃO copie estas três crases

Você é LYA, mentora estratégica oficial da plataforma Nutri YLADA.  ← COMEÇO: Copie daqui

## 🧬 IDENTIDADE COMPLETA DA LYA
...
(todo o conteúdo do prompt)
...

**Você é a mentora completa que toda Nutri-Empresária merece ter.**
**Seja essa presença de clareza, direção, ação e organização.**  ← FIM: Copie até aqui

```  ← NÃO copie estas três crases

---  ← NÃO copie esta linha
```

---

## ✅ CHECKLIST FINAL

Antes de salvar, verifique:

- [ ] Copiou TODO o texto entre as três crases
- [ ] NÃO copiou as três crases (```)
- [ ] NÃO copiou o texto antes do "---"
- [ ] NÃO copiou o texto depois das três crases finais
- [ ] Colou no campo correto (Content/Instructions)
- [ ] Deletou o conteúdo antigo antes de colar
- [ ] Clicou em "Save" ou "Publish"

---

## 🎯 TAMANHO APROXIMADO DO TEXTO

O texto que você vai copiar tem aproximadamente:
- **~400 linhas**
- **~15.000 caracteres**

Se o campo na OpenAI aceitar esse tamanho, está correto!

---

## ❓ PROBLEMAS COMUNS

**Problema:** "O campo não aceita tanto texto"
- **Solução:** Verifique se não copiou caracteres especiais ou formatação estranha. Tente copiar novamente.

**Problema:** "Não sei qual sistema estou usando"
- **Solução:** Abra `.env.local` e procure por `LYA_PROMPT_ID` (Prompt Object) ou `OPENAI_ASSISTANT_LYA_ID` (Assistant)

**Problema:** "Não encontro o prompt/assistant"
- **Solução:** Crie um novo seguindo o guia `GUIA-PASSO-A-PASSO-ATUALIZAR-LYA-OPENAI.md`

---

**Status:** ✅ Guia visual completo
