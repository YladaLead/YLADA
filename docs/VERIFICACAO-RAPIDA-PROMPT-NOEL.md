# ✅ Verificação Rápida: Prompt NOEL Atualizado

## 🎯 OBJETIVO

Confirmar se o prompt `NOEL-MASTER-v3-FINAL-PRONTO.md` foi corretamente aplicado no Assistant da OpenAI.

---

## 📋 CHECKLIST DE 5 MINUTOS

### **1. Verificar Prompt no Assistant**

**Passo a passo:**
1. Acesse: https://platform.openai.com/assistants
2. Encontre o Assistant do NOEL (use o `OPENAI_ASSISTANT_NOEL_ID`)
3. Clique em **"Edit"**
4. Role até o campo **"Instructions"**
5. **Procure por estas palavras no INÍCIO do prompt:**

**✅ DEVE TER (linhas 42-63):**
```
🚨 REGRA CRÍTICA #1 - FUNCTIONS (PRIORIDADE MÁXIMA)
====================================================

**NUNCA INVENTE INFORMAÇÕES. SEMPRE USE FUNCTIONS.**
```

**✅ DEVE TER (linhas 63-104):**
```
🚨 REGRA CRÍTICA #2 - PLANOS E ESTRATÉGIAS (DEVE AJUDAR)
====================================================

**PERGUNTAS SOBRE PLANOS, ESTRATÉGIAS E METAS SÃO LEGÍTIMAS E DEVE AJUDAR.**
```

**❌ SE NÃO TIVER:**
- O prompt NÃO foi atualizado
- **AÇÃO:** Delete todo o conteúdo antigo e cole o novo prompt completo

---

### **2. Verificar se Salvou**

**Após colar o prompt:**
1. Role até o final da página
2. Clique em **"Save"** (botão azul)
3. Aguarde confirmação: "Saved" ou "Changes saved"
4. **NÃO apenas feche a página sem salvar**

**❌ SE NÃO SALVOU:**
- As mudanças não foram aplicadas
- **AÇÃO:** Cole novamente e salve corretamente

---

### **3. Verificar Modelo**

**No Assistant, campo "Model":**
- ✅ **DEVE SER:** `gpt-4.1-mini-2025-04-14` (ou `gpt-4o-mini` se não tiver a versão 4.1)
- ❌ **NÃO DEVE SER:** `gpt-4-turbo`, `gpt-4.1` (completo), ou versões antigas

**Se estiver errado:**
1. Altere para `gpt-4.1-mini-2025-04-14`
2. Salve

---

### **4. Verificar Functions**

**No Assistant, seção "Functions":**
- ✅ Deve ter: `getFluxoInfo`, `getFerramentaInfo`, `getQuizInfo`, `getLinkInfo`, `getUserProfile`, etc.
- ❌ Se faltar alguma, adicione

---

### **5. Testar em Nova Conversa**

**IMPORTANTE:** Não teste em conversa antiga!

**Como testar:**
1. Abra uma **nova aba anônima/incógnito**
2. Acesse o NOEL no sistema
3. Faça uma pergunta **NOVA** (não continue conversa antiga)

**Teste 1 - Verificar Functions:**
```
Como funciona o Fluxo 2-5-10?
```

**✅ RESPOSTA ESPERADA:**
- Deve chamar `getFluxoInfo("fluxo-2-5-10")`
- Deve retornar link REAL do banco (não inventado)
- Link deve funcionar

**❌ RESPOSTA ERRADA:**
- Inventa link: `https://www.ylada.com/pt/wellness/system/vender/fluxos`
- Não chama function
- Link não funciona

**Teste 2 - Verificar Planos:**
```
Quero aumentar minha receita em 50% nos próximos 3 meses. Me dê um plano completo passo a passo.
```

**✅ RESPOSTA ESPERADA:**
- Deve ajudar com plano passo a passo
- Deve chamar `getUserProfile()` para personalizar
- Deve dar ações concretas

**❌ RESPOSTA ERRADA:**
- "Por motivos de ética e proteção do sistema, não compartilho conteúdos internos."
- Bloqueia ou recusa ajudar

---

## 🔍 DIAGNÓSTICO RÁPIDO

### **Se o Teste 1 falhar (inventa links):**
- ❌ Prompt não foi atualizado OU não foi salvo
- **Solução:** Verificar passos 1 e 2

### **Se o Teste 2 falhar (bloqueia planos):**
- ❌ Prompt não foi atualizado OU não foi salvo
- **Solução:** Verificar passos 1 e 2

### **Se ambos os testes falharem:**
- ❌ Prompt definitivamente não foi atualizado
- **Solução:** Refazer passos 1, 2 e 3

### **Se ambos os testes passarem:**
- ✅ Prompt está correto e funcionando!
- **Solução:** Nenhuma ação necessária

---

## 📝 SCRIPT DE ATUALIZAÇÃO (SE PRECISAR)

**Se o prompt não estiver atualizado, siga estes passos:**

1. **Abrir o arquivo:** `NOEL-MASTER-v3-FINAL-PRONTO.md`
2. **Copiar TUDO** a partir da linha 25 ("Você é NOEL...") até o final
3. **Acessar:** https://platform.openai.com/assistants
4. **Encontrar** o Assistant do NOEL
5. **Clicar em "Edit"**
6. **DELETAR** todo o conteúdo antigo do campo "Instructions"
7. **COLAR** o novo prompt completo
8. **Verificar** se tem "REGRA CRÍTICA #1" no início
9. **Clicar em "Save"**
10. **Aguardar** confirmação
11. **Verificar** modelo: `gpt-4.1-mini-2025-04-14`
12. **Testar** em nova conversa

---

## ⚠️ ERROS COMUNS

### **Erro 1: Colou mas não salvou**
- **Sintoma:** Prompt parece atualizado mas comportamento não muda
- **Solução:** Salvar explicitamente

### **Erro 2: Testou em conversa antiga**
- **Sintoma:** Prompt está correto mas ainda inventa links
- **Solução:** Começar nova conversa

### **Erro 3: Modelo errado**
- **Sintoma:** Prompt correto mas respostas ruins
- **Solução:** Usar `gpt-4.1-mini-2025-04-14`

### **Erro 4: Functions não configuradas**
- **Sintoma:** Prompt correto mas não chama functions
- **Solução:** Verificar se todas as functions estão no Assistant

---

## ✅ CHECKLIST FINAL

Antes de considerar que está tudo certo, confirme:

- [ ] Prompt tem "REGRA CRÍTICA #1" no início
- [ ] Prompt tem "REGRA CRÍTICA #2" logo após
- [ ] Prompt foi salvo (apareceu "Saved")
- [ ] Modelo é `gpt-4.1-mini-2025-04-14`
- [ ] Functions estão configuradas
- [ ] Teste 1 passou (não inventa links)
- [ ] Teste 2 passou (ajuda com planos)

**Se todos os itens estiverem ✅, o prompt está funcionando corretamente!**

---

## 🆘 SE AINDA NÃO FUNCIONAR

**Após fazer todas as verificações acima:**

1. **Verificar logs do sistema:**
   - Ver se as functions estão sendo chamadas
   - Ver se há erros no console

2. **Verificar variáveis de ambiente:**
   - `OPENAI_ASSISTANT_NOEL_ID` está correto?
   - `OPENAI_API_KEY` está válida?

3. **Verificar código:**
   - O código está usando o Assistant correto?
   - Há algum cache ou fallback que pode estar interferindo?

4. **Contatar suporte:**
   - Se tudo estiver correto mas não funcionar, pode ser bug da OpenAI
   - Pode ser necessário criar um novo Assistant

---

**Última atualização:** 2025-01-27










