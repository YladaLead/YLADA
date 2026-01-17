# 📋 COMO COLAR O PROMPT NO ASSISTANT DA OPENAI

## 🎯 PASSO A PASSO SIMPLES

### **1. Abrir o arquivo do prompt:**
- Arquivo: `docs/PROMPT-NOEL-V3.5-AJUSTADO.md`
- Este arquivo contém o prompt completo (versão 3.6)

### **2. O que copiar:**

**⚠️ IMPORTANTE:** Copie APENAS o conteúdo que está ENTRE as linhas de separação:

**INÍCIO:** A partir da linha que diz:
```
# ============================================
# CAMADA 1 — CONSTITUIÇÃO OFICIAL DO NOEL
# (ESSA CAMADA SEMPRE PREVALECE SOBRE QUALQUER OUTRA)
# ============================================
```

**FIM:** Até o final do arquivo (última linha)

---

## 📝 INSTRUÇÕES DETALHADAS:

### **Opção 1: Copiar manualmente**

1. Abra o arquivo: `docs/PROMPT-NOEL-V3.5-AJUSTADO.md`
2. Encontre a linha que começa com: `# ============================================`
3. Selecione TUDO a partir dessa linha até o final do arquivo
4. Copie (Ctrl+C ou Cmd+C)
5. Vá para: https://platform.openai.com/assistants
6. Encontre o Assistant do NOEL
7. Clique em "Edit"
8. Cole no campo "Instructions" (System Instructions)
9. Salve

### **Opção 2: Usar comando (mais fácil)**

Execute este comando no terminal para copiar apenas o conteúdo necessário:

```bash
cd /Users/air/ylada-app
sed -n '/^# ============================================/,$p' docs/PROMPT-NOEL-V3.5-AJUSTADO.md | pbcopy
```

Isso vai copiar automaticamente tudo a partir da linha de separação até o final.

---

## ✅ O QUE NÃO COPIAR:

**NÃO copie:**
- ❌ O cabeçalho com "NOEL MASTER v3.6"
- ❌ As instruções de uso (linhas 1-23)
- ❌ A linha de separação "---" antes do prompt

**COPIE APENAS:**
- ✅ Tudo a partir de `# ============================================` até o final

---

## 🎯 RESUMO RÁPIDO:

1. Abra: `docs/PROMPT-NOEL-V3.5-AJUSTADO.md`
2. Procure: `# ============================================` (linha ~26)
3. Selecione: Tudo a partir dessa linha até o final
4. Copie: Ctrl+C (Windows) ou Cmd+C (Mac)
5. Cole: No campo "Instructions" do Assistant da OpenAI
6. Salve: Clique em "Save"

---

## ⚠️ ATENÇÃO:

- O prompt tem aproximadamente **1440 linhas**
- Certifique-se de copiar TUDO até o final
- Não deixe nada para trás
- Após colar, verifique se o conteúdo está completo

---

**Pronto!** Agora você sabe exatamente o que copiar! 🚀
