# 📋 INSTRUÇÕES: Atualizar Prompt Mestre no Assistants API

**Tempo estimado:** 5 minutos

---

## 🎯 PASSO A PASSO

### 1. Acessar OpenAI Platform

1. Abra: https://platform.openai.com/assistants
2. Faça login na sua conta OpenAI

### 2. Encontrar o Assistant do NOEL

1. Na lista de Assistants, procure pelo Assistant configurado em `OPENAI_ASSISTANT_NOEL_ID`
2. Se não souber qual é, verifique no `.env.local` ou na Vercel:
   - Variável: `OPENAI_ASSISTANT_NOEL_ID`
   - Valor: `asst_xxxxxxxxxxxxx`

### 3. Editar o Assistant

1. Clique no Assistant para abrir
2. Clique no botão **"Edit"** (canto superior direito)

### 4. Colar o Prompt Mestre

1. No campo **"Instructions"** (ou "System Instructions")
2. **Apague** o conteúdo atual
3. **Cole** o conteúdo completo do arquivo: `docs/PROMPT-MESTRE-NOEL-PARA-COPIAR.txt`
   
   **OU** use a versão consolidada mais completa: `docs/PROMPT-NOEL-VERSAO-CONSOLIDADA-LIMPA.txt`

**OU copie diretamente:**

**⚠️ IMPORTANTE:** Use a versão consolidada completa!

O prompt completo está em: `docs/PROMPT-NOEL-VERSAO-CONSOLIDADA-LIMPA.txt`

**Por que usar a versão consolidada?**
- ✅ Mais completo (inclui onboarding, functions detalhadas, casos especiais)
- ✅ Integrado com detecção de perfil que implementamos
- ✅ Instruções claras para não mostrar títulos numerados
- ✅ Todas as regras e comportamentos detalhados

**Abra o arquivo e copie todo o conteúdo.**

### 5. Salvar

1. Role até o final da página
2. Clique em **"Save"** (ou "Save Changes")
3. Aguarde confirmação de salvamento

---

## ✅ VERIFICAÇÃO

Após salvar, verifique:

- [ ] Prompt foi salvo sem erros
- [ ] Assistant ainda está ativo
- [ ] ID do Assistant não mudou (deve ser o mesmo `asst_...`)

---

## ⚠️ IMPORTANTE

- **NÃO** altere o ID do Assistant
- **NÃO** altere as Functions configuradas
- **APENAS** atualize o campo "Instructions"

---

**Pronto!** Agora o NOEL terá o comportamento esperado.
