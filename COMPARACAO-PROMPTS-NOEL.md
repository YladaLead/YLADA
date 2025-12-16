# 🔍 COMPARAÇÃO: Prompt Dashboard vs Código

**Data:** 2025-01-27  
**Problema:** Noel não está direcionando e dialogando como antes

---

## 📊 RESUMO DA DIFERENÇA

O prompt do **dashboard** é uma versão **simplificada** (11 seções básicas).  
O prompt do **código** é uma versão **completa e detalhada** (com Arquitetura Mental, 12 Aprimoramentos, Árvore de Decisão).

---

## ❌ O QUE ESTÁ FALTANDO NO PROMPT DO DASHBOARD

### 1. **ARQUITETURA MENTAL DO NOEL (5 PASSOS)** ⚠️ CRÍTICO

**Faltando:**
```
Sempre siga esta sequência ao processar qualquer mensagem:

1. ENTENDER
   - Leia a mensagem completamente
   - Identifique a intenção real (não apenas o que foi dito)
   - Capture o contexto emocional
   - Identifique palavras-chave importantes

2. CLASSIFICAR
   - Tipo de lead: frio, morno, quente
   - Estágio: captação, diagnóstico, venda, recrutamento, retenção
   - Temperatura: baixa, média, alta
   - Perfil do distribuidor: iniciante, intermediário, líder

3. DECIDIR
   - Qual é o melhor próximo passo?
   - Qual Link Wellness sugerir?
   - Qual script usar?
   - Qual fluxo seguir?

4. EXECUTAR
   - Entregue resposta clara e objetiva
   - Sugira ação específica
   - Forneça script ou link quando apropriado
   - Seja direto e prático

5. GUIAR
   - Sugira próximo passo claro
   - Mantenha o momentum
   - Não deixe a conversa morrer
```

**Impacto:** Sem isso, o Noel não segue um processo estruturado de pensamento, resultando em respostas menos direcionadas.

---

### 2. **12 APRIMORAMENTOS ESTRATÉGICOS** ⚠️ CRÍTICO

**Faltando instruções sobre:**

1. **SUGESTÃO INTELIGENTE**
   - Sempre sugira um Link Wellness antes de conversa longa
   - Explique PORQUÊ está sugerindo aquele link
   - Use o script curto do link para apresentar

2. **EXPLICAÇÃO ESTRATÉGICA DO PORQUÊ**
   - Sempre explique por que está sugerindo algo
   - Conecte a sugestão com a necessidade identificada
   - Mostre o valor antes de pedir ação

3. **SISTEMA DE TEMPERATURA AUTOMÁTICA**
   - Identifique temperatura do lead automaticamente
   - Ajuste abordagem baseado na temperatura
   - Leads frios = links leves
   - Leads mornos = diagnósticos
   - Leads quentes = desafios ou negócio

4. **LEITURA EMOCIONAL**
   - Identifique emoções na mensagem
   - Ajuste tom e abordagem
   - Use empatia quando necessário

5. **BOTÃO "MELHOR AÇÃO AGORA"**
   - Sempre sugira a melhor ação imediata
   - Seja específico e claro
   - Facilite a decisão

**Impacto:** Sem essas instruções, o Noel não explica o "porquê" das sugestões, não adapta a abordagem à temperatura do lead, e não direciona ativamente a conversa.

---

### 3. **ÁRVORE DE DECISÃO COMPLETA** ⚠️ IMPORTANTE

**Faltando:**
- Sistema completo de decisão baseado em 9 camadas do perfil estratégico
- Lógica de ativação de planos (Vendas Rápidas, Duplicação, Híbrido, Presidente)
- Interpretação e resposta após perfil completo
- Ciclo de ação contínua (tarefa → concluído → próxima tarefa)

**Impacto:** Respostas menos personalizadas e menos estruturadas.

---

### 4. **HEURÍSTICAS E MODELOS MENTAIS** ⚠️ IMPORTANTE

**Faltando:**
- Heurísticas de venda leve
- Heurísticas de recrutamento ético
- Previsão comportamental
- Sistema de nudges (sutis e diretos)
- Detecção de micro-sinais
- Fechamento por sinais

**Impacto:** Menos capacidade de ler o contexto e adaptar a abordagem.

---

### 5. **ESTRUTURA DE RESPOSTA MAIS DETALHADA**

**Dashboard atual:**
```
1) Mensagem principal curta  
2) Ação prática imediata  
3) Script sugerido (se existir)  
4) Frase de reforço emocional  
5) Oferta de ajuda adicional  
```

**Código (mais detalhado):**
```
1. Reconhecimento — validar o que o usuário disse
2. Direção clara — explicar rapidamente qual é o passo
3. Ação prática — entregar o mínimo necessário (script ou passo)
4. CTA leve — terminar com uma pergunta simples
```

**Além disso, o código tem:**
- Explicação estratégica do porquê
- Conexão com necessidade identificada
- Mostrar valor antes de pedir ação
- Sugerir próximo passo claro
- Manter momentum

**Impacto:** Respostas menos estruturadas e menos direcionadas.

---

## ✅ O QUE O PROMPT DO DASHBOARD TEM (mas pode melhorar)

✅ Regras básicas de funcionamento  
✅ Uso da Base de Conhecimento  
✅ Formato de resposta (simplificado)  
✅ Regras para usar Functions  
✅ Estilo do Noel  
✅ Casos especiais  

**Mas falta:**
- Processo mental estruturado
- Instruções de direcionamento ativo
- Sistema de temperatura e adaptação
- Explicação estratégica do porquê

---

## 🎯 SOLUÇÃO RECOMENDADA

### **Opção 1: Atualizar Prompt do Dashboard (RÁPIDA)**

Substituir o prompt atual do dashboard pelo prompt completo de:
- `src/lib/noel-wellness/system-prompt-lousa7.ts` (NOEL_SYSTEM_PROMPT_WITH_SECURITY)

**Vantagens:**
- ✅ Inclui Arquitetura Mental (5 passos)
- ✅ Inclui 12 Aprimoramentos Estratégicos
- ✅ Inclui Árvore de Decisão Completa
- ✅ Inclui todas as heurísticas e modelos mentais
- ✅ Instruções detalhadas de direcionamento e diálogo

**Como fazer:**
1. Acesse: https://platform.openai.com/assistants
2. Encontre o Assistant com ID = `OPENAI_ASSISTANT_NOEL_ID`
3. Edite o campo "Instructions"
4. Cole o conteúdo completo de `NOEL_SYSTEM_PROMPT_WITH_SECURITY`

---

### **Opção 2: Passar Instructions Dinamicamente (DEFINITIVA)**

Modificar o código para passar o prompt dinâmico construído em `buildSystemPrompt()` para o Assistants API.

**Vantagens:**
- ✅ Prompt personalizado por usuário/perfil/contexto
- ✅ Sempre atualizado com o código
- ✅ Inclui contexto dinâmico (perfil estratégico, histórico, etc.)

**Requer:**
- Modificar `noel-assistant-handler.ts` para aceitar `instructions` como parâmetro
- Passar `instructions` no `runs.create()`

---

## 📋 CHECKLIST: O que adicionar ao prompt do dashboard

- [ ] Arquitetura Mental do Noel (5 passos)
- [ ] 12 Aprimoramentos Estratégicos
- [ ] Árvore de Decisão Completa
- [ ] Heurísticas e Modelos Mentais
- [ ] Sistema de Temperatura Automática
- [ ] Leitura Emocional
- [ ] Explicação Estratégica do Porquê
- [ ] Sistema de Nudges
- [ ] Detecção de Micro-sinais
- [ ] Fechamento por Sinais
- [ ] Regras de Roteamento (perguntas institucionais vs scripts vs emocional)
- [ ] Formato obrigatório de resposta mais detalhado

---

## 🔍 CONCLUSÃO

O prompt do dashboard está **funcional mas incompleto**. Ele tem as regras básicas, mas **faltam as instruções detalhadas** que fazem o Noel:

1. **Direcionar ativamente** a conversa (explicar porquê, sugerir ações, manter momentum)
2. **Dialogar de forma estruturada** (seguir processo mental de 5 passos)
3. **Adaptar a abordagem** (temperatura do lead, leitura emocional, nudges)

**A solução imediata é atualizar o prompt do dashboard com a versão completa do código.**











