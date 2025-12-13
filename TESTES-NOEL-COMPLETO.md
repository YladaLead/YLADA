# 🧪 SEQUÊNCIA DE TESTES - NOEL

**Data:** 2025-01-27  
**Status:** ✅ Pronto para testar

---

## 📋 CHECKLIST PRÉ-TESTE

Antes de começar, confirme:

- [ ] `OPENAI_FUNCTION_SECRET` adicionado na **Vercel** (Production, Preview, Development)
- [ ] `OPENAI_FUNCTION_SECRET` adicionado no **`.env.local`**
- [ ] Deploy realizado na Vercel (ou servidor local rodando)
- [ ] Você está logado no sistema
- [ ] Chat do NOEL acessível

---

## 🎯 TESTE 1: Verificação Básica (Sem Functions)

**Objetivo:** Verificar se o NOEL responde normalmente sem chamar functions.

**Pergunta:**
```
Olá, quem é você?
```

**Resultado Esperado:**
- ✅ NOEL responde diretamente
- ✅ Resposta institucional sobre quem é o NOEL
- ✅ NÃO chama nenhuma function
- ✅ NÃO retorna erro de servidor

**Status:** ⬜ Aguardando teste

---

## 🎯 TESTE 2: Function getUserProfile

**Objetivo:** Verificar se a function `getUserProfile` funciona corretamente.

**Pergunta:**
```
Qual é o meu perfil?
```

**Resultado Esperado:**
- ✅ NOEL chama a function `getUserProfile`
- ✅ Retorna dados do seu perfil (objetivo, tempo, experiência, etc.)
- ✅ NÃO retorna "Erro no servidor"
- ✅ Resposta personalizada baseada no perfil

**Status:** ⬜ Aguardando teste

---

## 🎯 TESTE 3: Function getFluxoInfo (Reativação)

**Objetivo:** Verificar se a function `getFluxoInfo` funciona para reativação.

**Pergunta:**
```
Preciso reativar um cliente que sumiu
```

**Resultado Esperado:**
- ✅ NOEL chama a function `getFluxoInfo` com parâmetro "reativacao"
- ✅ Retorna fluxo completo de reativação
- ✅ Inclui link e script sugerido
- ✅ NÃO retorna "Erro no servidor"

**Status:** ⬜ Aguardando teste

---

## 🎯 TESTE 4: Function getFerramentaInfo (Calculadora)

**Objetivo:** Verificar se a function `getFerramentaInfo` funciona.

**Pergunta:**
```
Quero enviar a calculadora de água para um cliente
```

**Resultado Esperado:**
- ✅ NOEL chama a function `getFerramentaInfo` com parâmetro relacionado a água
- ✅ Retorna link da calculadora de água
- ✅ Sugere script para enviar
- ✅ NÃO retorna "Erro no servidor"

**Status:** ⬜ Aguardando teste

---

## 🎯 TESTE 5: Function getLinkInfo

**Objetivo:** Verificar se a function `getLinkInfo` funciona.

**Pergunta:**
```
Me mostra o link da HOM gravada
```

**Resultado Esperado:**
- ✅ NOEL chama a function `getLinkInfo` com parâmetro "hom" ou "hom gravada"
- ✅ Retorna link da HOM gravada
- ✅ Sugere script para enviar
- ✅ NÃO retorna "Erro no servidor"

**Status:** ⬜ Aguardando teste

---

## 🎯 TESTE 6: Redirecionamento Suave (Assunto Não Relacionado)

**Objetivo:** Verificar se o NOEL redireciona suavemente assuntos não relacionados.

**Pergunta:**
```
Como está o tempo hoje?
```

**Resultado Esperado:**
- ✅ NOEL redireciona de forma suave
- ✅ NÃO retorna "Erro no servidor"
- ✅ Conecta ao contexto de crescimento/sucesso de forma natural
- ✅ Oferece alternativa relacionada ao negócio

**Status:** ⬜ Aguardando teste

---

## 🎯 TESTE 7: Script de Vendas

**Objetivo:** Verificar se o NOEL consegue acessar scripts oficiais.

**Pergunta:**
```
Preciso de um script para vender bebidas funcionais
```

**Resultado Esperado:**
- ✅ NOEL tenta buscar script oficial (pode chamar function ou usar KB)
- ✅ Retorna script prático e duplicável
- ✅ NÃO retorna "Não consegui acessar o script oficial"
- ✅ Script está formatado e pronto para usar

**Status:** ⬜ Aguardando teste

---

## 🎯 TESTE 8: Acolhimento Emocional

**Objetivo:** Verificar se o NOEL acolhe adequadamente dificuldades emocionais.

**Pergunta:**
```
Estou desanimado, nada está dando certo
```

**Resultado Esperado:**
- ✅ NOEL acolhe de forma firme e acolhedora
- ✅ Valida a emoção
- ✅ Oferece um passo simples
- ✅ Reforça consistência
- ✅ NÃO retorna erro

**Status:** ⬜ Aguardando teste

---

## 🎯 TESTE 9: Pergunta Inicial (Perfil)

**Objetivo:** Verificar se o NOEL faz perguntas iniciais quando necessário.

**Pergunta:**
```
Acabei de começar no negócio
```

**Resultado Esperado:**
- ✅ NOEL faz as 5 perguntas iniciais do perfil
- ✅ Formato claro com opções
- ✅ NÃO retorna erro

**Status:** ⬜ Aguardando teste

---

## 🎯 TESTE 10: Múltiplas Functions em Sequência

**Objetivo:** Verificar se múltiplas functions funcionam em sequência.

**Sequência de Perguntas:**
1. "Qual é o meu perfil?"
2. "Agora me mostra um fluxo de reativação"
3. "E a calculadora de água?"

**Resultado Esperado:**
- ✅ Todas as functions funcionam
- ✅ Nenhuma retorna erro
- ✅ Respostas são coerentes e úteis

**Status:** ⬜ Aguardando teste

---

## 📊 RESULTADO GERAL

**Total de Testes:** 10  
**Passou:** ⬜  
**Falhou:** ⬜  
**Taxa de Sucesso:** ⬜%

---

## 🐛 SE ALGO FALHAR

### **Erro: "Erro no servidor"**
- ✅ Verificar se `OPENAI_FUNCTION_SECRET` está configurado na Vercel
- ✅ Verificar se `OPENAI_FUNCTION_SECRET` está no `.env.local`
- ✅ Verificar logs da Vercel para mais detalhes

### **Erro: "Authorization header é obrigatório"**
- ✅ Verificar se o `noel-assistant-handler.ts` está enviando o Bearer token
- ✅ Verificar se `OPENAI_FUNCTION_SECRET` está configurado

### **Erro: "Token de autorização inválido"**
- ✅ Verificar se o secret na Vercel é o mesmo do `.env.local`
- ✅ Verificar se o secret está correto (sem espaços extras)

### **Function não é chamada**
- ✅ Verificar se o Assistant no OpenAI tem as functions configuradas
- ✅ Verificar se o prompt do Assistant menciona as functions

---

## ✅ APÓS OS TESTES

1. **Anotar resultados** de cada teste
2. **Reportar falhas** (se houver)
3. **Verificar logs** se necessário
4. **Fazer ajustes** se algo não funcionar

---

**🚀 Vamos começar os testes!**







