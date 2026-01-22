# 📋 COMO ADICIONAR A VARIÁVEL `links_virais` NA OPENAI

## 🎯 PASSO A PASSO SIMPLES

### 1. Encontre a seção "Variables"

Na interface da OpenAI Platform (onde você está editando o Prompt Mestre da LYA), procure pela seção **"Variables"** que fica acima do campo de texto do prompt.

Você já deve ver 5 variáveis:
- `diagnostico`
- `perfil`
- `sistema`
- `rag`
- `task`

### 2. Clique no botão "+ Add"

Ao lado das variáveis existentes, você verá um botão **"+ Add"** (ou **"+ Add variable"**).

**Clique nesse botão.**

### 3. Digite o nome da variável

Quando clicar em "+ Add", aparecerá um campo de texto.

**Digite exatamente:** `links_virais`

(Use underscore `_`, não hífen `-`)

### 4. Confirme

Pressione Enter ou clique fora do campo para confirmar.

### 5. Pronto!

Agora você deve ver 6 variáveis:
- `diagnostico`
- `perfil`
- `sistema`
- `rag`
- `task`
- `links_virais` ← **NOVA!**

---

## ✅ VERIFICAÇÃO

Depois de adicionar, verifique se:

1. ✅ A variável `links_virais` aparece na lista de variáveis
2. ✅ No campo de texto do prompt, você menciona `{{links_virais}}` na seção "DADOS DE ENTRADA (VARIÁVEIS)"
3. ✅ No lado direito da tela, aparece um campo para testar: `links_virais : enter value...`

---

## 📝 ONDE A VARIÁVEL É USADA NO PROMPT

No prompt, você deve ter uma seção assim:

```
## 📥 DADOS DE ENTRADA (VARIÁVEIS)

Você receberá os seguintes dados como variáveis:

- {{diagnostico}} - Dados do diagnóstico da nutricionista
- {{perfil}} - Perfil estratégico gerado automaticamente
- {{sistema}} - Status do sistema (jornada, GSAL, ferramentas)
- {{rag}} - Memória recente e conhecimento institucional
- {{task}} - Tarefa específica para esta análise
- {{links_virais}} - Links virais reais das ferramentas que a nutricionista criou
```

Se não tiver essa última linha, adicione no prompt também!

---

## 🎯 RESUMO RÁPIDO

1. Encontre "Variables" (já tem 5 variáveis)
2. Clique em **"+ Add"**
3. Digite: `links_virais`
4. Confirme
5. Salve o prompt

**Pronto!** 🎉
