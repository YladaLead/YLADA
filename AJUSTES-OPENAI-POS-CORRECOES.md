# 🔧 AJUSTES NECESSÁRIOS NA OPENAI APÓS CORREÇÕES

**Data:** 2025-01-21
**Status:** ⚠️ Ajustes recomendados (mas não obrigatórios)

---

## 📋 RESUMO

Após as correções que adicionaram **todos os campos do diagnóstico** para a LYA, você pode (opcionalmente) atualizar as configurações na OpenAI para melhorar a documentação e clareza. **Mas não é obrigatório** - o código já funciona com as configurações atuais.

---

## 🎯 SISTEMAS QUE A LYA USA

A LYA pode usar 3 sistemas diferentes (em ordem de prioridade):

1. **Responses API com Prompt Object** (LYA_PROMPT_ID) - ✅ Recomendado
2. **Assistants API** (OPENAI_ASSISTANT_LYA_ID) - ⚠️ Será deprecado em 2026
3. **Chat Completions** (fallback) - ✅ Sempre funciona

---

## ✅ O QUE NÃO PRECISA MUDAR

### 1. Assistants API (OPENAI_ASSISTANT_LYA_ID)
**Status:** ✅ **NÃO precisa atualizar**

**Por quê:**
- O código já passa todos os dados do diagnóstico na mensagem
- As Instructions do Assistant não precisam mencionar campos específicos
- O Assistant recebe o contexto completo via mensagem

**O que acontece:**
- O código busca diagnóstico e perfil estratégico
- Monta uma mensagem com todos os dados
- Envia essa mensagem para o Assistant
- O Assistant usa os dados automaticamente

**Conclusão:** Pode deixar como está. ✅

---

### 2. Chat Completions (Fallback)
**Status:** ✅ **NÃO precisa atualizar**

**Por quê:**
- É um fallback que usa system prompt inline no código
- Não depende de configuração na OpenAI
- Já foi atualizado no código

**Conclusão:** Já está funcionando. ✅

---

## ⚠️ O QUE PODE SER ATUALIZADO (OPCIONAL)

### 1. Prompt Object (Responses API) - LYA_PROMPT_ID

**Status:** ⚠️ **Pode atualizar (opcional)**

**Por quê atualizar:**
- Documentar as novas variáveis que estão sendo enviadas
- Deixar claro no prompt quais dados estão disponíveis
- Melhorar a clareza para futuras manutenções

**O que mudou no código:**
- Agora envia `diagnostico_completo` (texto formatado) em vez de apenas `diagnostico` (JSON)
- Agora envia `perfil_estrategico` (texto formatado) em vez de apenas `perfil` (JSON)
- Adicionadas variáveis: `mensagem_usuario`, `dia_atual`, `semana_atual`, `reflexoes_recentes`, `historico_conversa`, `branding_info`

**Variáveis que o código envia agora:**
```typescript
{
  mensagem_usuario: string,
  dia_atual: string,
  semana_atual: string,
  reflexoes_recentes: string,
  historico_conversa: string,
  diagnostico_completo: string,  // ← NOVO: texto formatado com todos os campos
  perfil_estrategico: string,    // ← NOVO: texto formatado
  branding_info: string
}
```

**Como atualizar (opcional):**

1. Acesse: https://platform.openai.com/prompts
2. Encontre o Prompt Object: `LYA — Prompt Mestre (Nutri YLADA)`
3. Edite o prompt
4. Na seção "DADOS DE ENTRADA (VARIÁVEIS)", atualize para:

```
DADOS DE ENTRADA (VARIÁVEIS)

Você receberá os seguintes dados como variáveis:

{{mensagem_usuario}} - Mensagem atual da nutricionista
{{dia_atual}} - Dia atual da jornada (ou "Jornada não iniciada")
{{semana_atual}} - Semana atual da jornada
{{reflexoes_recentes}} - Reflexões e anotações recentes da jornada
{{historico_conversa}} - Histórico de conversas anteriores
{{diagnostico_completo}} - Diagnóstico completo da nutricionista (todos os 13 campos):
  - Tipo de Atuação
  - Tempo de Atuação
  - Autoavaliação
  - Situação Atual
  - Processos Existentes (Captação, Avaliação, Fechamento, Acompanhamento)
  - Objetivo Principal
  - Meta Financeira
  - Travas
  - Tempo Disponível
  - Preferência (Guiado/Autônomo)
  - Campo Aberto
{{perfil_estrategico}} - Perfil estratégico gerado automaticamente:
  - Tipo de Nutri
  - Nível Empresarial
  - Foco Prioritário
  - Tom LYA
  - Ritmo de Condução
{{branding_info}} - Informações de marca profissional (logo, cor, nome, credencial)

Use esses dados para gerar respostas personalizadas e relevantes.
```

5. Salve e publique

**Importante:**
- ⚠️ Isso é **opcional** - o código já funciona sem essa atualização
- ✅ O Prompt Object vai receber as variáveis mesmo sem documentá-las
- ✅ A atualização é apenas para documentação e clareza

---

## 📊 COMPARAÇÃO: ANTES vs DEPOIS

### Antes das Correções:

**Variáveis enviadas (Prompt Object):**
- `diagnostico` (JSON com 4 campos)
- `perfil` (JSON com 3 campos)
- `sistema` (JSON)
- `rag` (JSON)
- `task` (string)

**Dados disponíveis:** 30.7% do diagnóstico

---

### Depois das Correções:

**Variáveis enviadas (Prompt Object - Chat Principal):**
- `mensagem_usuario` (string)
- `dia_atual` (string)
- `semana_atual` (string)
- `reflexoes_recentes` (string)
- `historico_conversa` (string)
- `diagnostico_completo` (string formatado com **todos os 13 campos**)
- `perfil_estrategico` (string formatado com **todos os 5 campos**)
- `branding_info` (string)

**Variáveis enviadas (Prompt Object - Análise v2):**
- `diagnostico` (JSON com **todos os 13 campos**)
- `perfil` (JSON com **todos os 5 campos**)
- `sistema` (JSON)
- `rag` (JSON)
- `task` (string)

**Dados disponíveis:** 100% do diagnóstico ✅

---

## 🎯 RECOMENDAÇÃO FINAL

### ✅ O que fazer AGORA:
**NADA** - O código já funciona perfeitamente com as configurações atuais.

### ⚠️ O que fazer DEPOIS (opcional):
1. Atualizar a documentação do Prompt Object (se quiser deixar mais claro)
2. Testar as respostas da LYA para verificar se estão mais personalizadas
3. Coletar feedback das nutricionistas

### ❌ O que NÃO fazer:
- Não precisa criar novo Prompt Object
- Não precisa criar novo Assistant
- Não precisa mudar variáveis de ambiente
- Não precisa reiniciar nada

---

## 📝 RESUMO EXECUTIVO

| Sistema | Precisa Atualizar? | Por quê? |
|---------|-------------------|----------|
| **Responses API (Prompt Object)** | ⚠️ Opcional | Apenas para documentar novas variáveis |
| **Assistants API** | ✅ Não | Código já passa dados na mensagem |
| **Chat Completions** | ✅ Não | System prompt inline no código |

**Conclusão:** 
- ✅ **Código já funciona** com configurações atuais
- ⚠️ **Atualização é opcional** (apenas documentação)
- ✅ **Pode testar imediatamente** sem fazer nada na OpenAI

---

**Status:** ✅ Pronto para usar - Ajustes na OpenAI são opcionais
**Próximo passo:** Testar com nutricionistas reais
