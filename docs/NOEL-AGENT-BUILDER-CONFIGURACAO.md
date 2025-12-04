# 🤖 NOEL com Agent Builder - Configuração

## 📋 O Que é Agent Builder?

O **Agent Builder** da OpenAI é uma interface visual para criar e gerenciar agentes de IA. Ele permite:
- Criar agentes com interface visual
- Configurar instruções, ferramentas e conhecimento
- Gerenciar múltiplos agentes em um projeto
- Usar a mesma API de Assistants por baixo dos panos

## 🔑 Variáveis de Ambiente Necessárias

### **Básico (Obrigatório):**

```env
# OpenAI API Key (obrigatório)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

### **Agent IDs (quando criar os agents):**

```env
# NOEL Wellness Agents (Agent Builder)
OPENAI_AGENT_NOEL_MENTOR_ID=agent_xxxxxxxxxxxxx
OPENAI_AGENT_NOEL_SUPORTE_ID=agent_xxxxxxxxxxxxx
OPENAI_AGENT_NOEL_TECNICO_ID=agent_xxxxxxxxxxxxx
```

**OU** (se usar o mesmo formato de Assistants):

```env
# NOEL Wellness Agents (Agent Builder - formato Assistant)
OPENAI_AGENT_NOEL_MENTOR_ID=asst_xxxxxxxxxxxxx
OPENAI_AGENT_NOEL_SUPORTE_ID=asst_xxxxxxxxxxxxx
OPENAI_AGENT_NOEL_TECNICO_ID=asst_xxxxxxxxxxxxx
```

---

## 🎯 Como Funciona

### **Diferença entre Assistants e Agent Builder:**

1. **Assistants (tradicional):**
   - Criado via API ou interface web
   - ID começa com `asst_`
   - Usa `openai.beta.assistants.*`

2. **Agent Builder:**
   - Criado via interface visual (platform.openai.com/agent-builder)
   - Pode gerar IDs `agent_` ou `asst_` (depende da versão)
   - Usa a mesma API de Assistants por baixo

### **Na Prática:**
- Agent Builder é uma **interface visual** para criar Assistants
- Por baixo, ainda usa a API de Assistants
- O código pode ser o mesmo ou similar

---

## 📝 Passo a Passo

### **1. Criar Agents no Agent Builder:**

1. Acesse: https://platform.openai.com/agent-builder
2. Clique em **"Create Agent"**
3. Configure:
   - **Name:** NOEL Mentor (ou Wellness Mentor)
   - **Instructions:** Cole o prompt completo de `docs/PROMPT-NOEL-MENTOR-COMPLETO-COM-FEW-SHOTS.md`
   - **Model:** `gpt-4o` (para Mentor) ou `gpt-4o-mini` (para Suporte/Técnico)
   - **Tools:** (opcional) Adicione se necessário
4. **Salve** e copie o **Agent ID**

### **2. Repetir para os 3 Agents:**

- **NOEL Mentor** → Estratégias, vendas, motivação
- **NOEL Suporte** → Instruções técnicas
- **NOEL Técnico** → Bebidas, campanhas, scripts

### **3. Adicionar no .env.local:**

```env
# OpenAI API Key
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# NOEL Wellness Agents (Agent Builder)
OPENAI_AGENT_NOEL_MENTOR_ID=agent_xxxxxxxxxxxxx
OPENAI_AGENT_NOEL_SUPORTE_ID=agent_xxxxxxxxxxxxx
OPENAI_AGENT_NOEL_TECNICO_ID=agent_xxxxxxxxxxxxx
```

---

## 🔧 Adaptação do Código

O código atual usa `openai.beta.assistants.*` que funciona tanto para Assistants quanto para Agents criados no Agent Builder.

**Se os IDs começarem com `agent_`**, pode ser necessário adaptar, mas geralmente a API aceita ambos os formatos.

### **Verificação no Código:**

O código em `src/app/api/wellness/noel/route.ts` já está preparado para usar Assistants. Se os Agents do Agent Builder usarem IDs `asst_`, funcionará direto.

**Se usar IDs `agent_`**, pode ser necessário verificar se a API aceita ou adaptar.

---

## ✅ Checklist

- [ ] Criar 3 Agents no Agent Builder (Mentor, Suporte, Técnico)
- [ ] Copiar os 3 Agent IDs
- [ ] Adicionar `OPENAI_API_KEY` no `.env.local`
- [ ] Adicionar os 3 Agent IDs no `.env.local`
- [ ] Testar se os IDs funcionam com a API atual
- [ ] Se não funcionar, adaptar código para suportar formato `agent_`

---

## 🚨 Importante

1. **Agent Builder pode gerar IDs diferentes:**
   - Alguns geram `agent_xxxxxxxxxxxxx`
   - Outros geram `asst_xxxxxxxxxxxxx` (mesmo formato de Assistants)

2. **API pode ser a mesma:**
   - Agent Builder geralmente usa a API de Assistants
   - O código pode funcionar sem mudanças

3. **Teste primeiro:**
   - Crie um Agent de teste
   - Tente usar o ID no código atual
   - Se funcionar, ótimo! Se não, adapte

---

## 📞 Próximos Passos

1. **Você:** Criar os 3 Agents no Agent Builder e me enviar os IDs
2. **Eu:** Verificar se o código atual funciona ou se precisa adaptação
3. **Teste:** Validar funcionamento completo

---

**Status:** Aguardando IDs dos Agents criados no Agent Builder

