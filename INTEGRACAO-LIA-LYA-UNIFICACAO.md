# 🔄 INTEGRAÇÃO LIA → LYA - UNIFICAÇÃO COMPLETA

**Data:** 2025-01-27  
**Status:** ✅ Concluído

---

## 🎯 ENTENDIMENTO CORRETO

**Existe apenas UMA assistente: LYA (com Y)**

- "LIA" foi um erro de escrita/confusão
- A LYA precisa fazer **DOIS papéis completos**:
  1. **Mentora de Negócios** (posicionamento, captação, estratégia empresarial)
  2. **Assistente de Comunicação** (organizar vida, conteúdo, CTAs, roteiros, links virais)

---

## ✅ O QUE FOI FEITO

### 1. Prompt Unificado Criado
- **Arquivo:** `docs/LYA-PROMPT-COMPLETO-UNIFICADO.md`
- **Conteúdo:** Integra capacidades de comunicação + mentoria de negócios
- **Formato:** Pronto para copiar e colar na OpenAI Platform

### 2. Código Atualizado
- **Arquivo:** `src/app/api/nutri/lya/route.ts`
- **Mudanças:**
  - Busca links virais reais das ferramentas do usuário
  - Passa `links_virais` como variável para o prompt
  - Instruções claras para usar links reais (não inventar)
  - Proibição explícita de mencionar Linktree/Lnk.Bio

### 3. Treinamento de Comunicação Integrado
- Todas as capacidades do arquivo `TREINAMENTO-LIA-ORGANIZAR-VIDA-NUTRI.md` foram integradas ao prompt da LYA
- A LYA agora sabe:
  - Criar conteúdo pronto
  - Criar CTAs prontos
  - Criar roteiros para direct
  - Organizar links virais YLADA
  - Rotina mínima de comunicação

---

## 📋 PRÓXIMOS PASSOS (MANUAL)

### 1. Atualizar Prompt na OpenAI Platform

**Se usar Assistants API:**
1. Acesse: https://platform.openai.com/assistants
2. Encontre o Assistant da LYA (`OPENAI_ASSISTANT_LYA_ID`)
3. Clique em **Edit**
4. Abra o arquivo: `docs/LYA-PROMPT-COMPLETO-UNIFICADO.md`
5. Copie TODO o conteúdo após a linha "---" (dentro das ```)
6. Cole no campo **Instructions**
7. Salve

**Se usar Responses API (Prompt Object):**
1. Acesse: https://platform.openai.com/prompts
2. Encontre o Prompt Object da LYA (`LYA_PROMPT_ID`)
3. Clique em **Edit**
4. Abra o arquivo: `docs/LYA-PROMPT-COMPLETO-UNIFICADO.md`
5. Copie TODO o conteúdo após a linha "---" (dentro das ```)
6. Cole no campo de conteúdo
7. Adicione a variável `{{links_virais}}` se ainda não estiver configurada
8. Salve

---

## 🎯 CAPACIDADES DA LYA AGORA

### ✅ Mentora de Negócios
- Posicionamento estratégico
- Rotina mínima de negócios
- Captação de clientes
- Conversão em planos
- Acompanhamento profissional
- Crescimento sustentável

### ✅ Assistente de Comunicação
- Criar conteúdo pronto (o que falar)
- Criar CTAs prontos (como convidar)
- Criar roteiros para direct (o que falar na conversa)
- Organizar links virais YLADA (estruturação de caminhos)
- Rotina mínima de comunicação (15 min/dia)

---

## 🔗 LINKS VIRAIS YLADA

**Regras críticas:**
- ✅ SEMPRE usar links reais fornecidos na variável `links_virais`
- ✅ NUNCA inventar links genéricos
- ✅ NUNCA mencionar Linktree, Lnk.Bio ou ferramentas externas
- ✅ SEMPRE fornecer links completos diretamente na resposta
- ✅ Organizar em estrutura clara (3-4 botões máximo)

---

## 📊 DETECÇÃO AUTOMÁTICA

A LYA agora detecta automaticamente o tipo de pergunta:

- **Comunicação** → Usa formato de solução completa (conteúdo, CTA, roteiro)
- **Negócios** → Usa formato fixo de análise (4 blocos)

---

## ✅ RESULTADO FINAL

A LYA agora é uma **mentora completa** que:
1. Orienta estratégia de negócios (formato fixo)
2. Organiza comunicação (soluções prontas)
3. Fornece links virais reais (não genéricos)
4. Mantém separação clara (não é NOEL, não é outra área)
5. Foca exclusivamente em nutricionistas

---

**Status:** ✅ Pronto para atualizar na OpenAI Platform
