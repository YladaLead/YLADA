# 🎯 GESTÃO DE CLIENTES - FORMULÁRIOS + LYA

## ✅ **STATUS: PRONTO PARA TESTES**

**Data:** 18/12/2024  
**Área:** Gestão de Clientes - Sistema de Formulários com Integração LYA  
**Git Status:** ✅ Limpo, sincronizado, sem commits pendentes

---

## 📦 **O QUE FOI IMPLEMENTADO**

### ✅ **10 Funcionalidades Completas**

1. **Badge de Notificação** - Contador de respostas não visualizadas
2. **Sistema de Visualização** - Marcação automática ao abrir resposta
3. **Compartilhamento WhatsApp** - Botão direto em cada formulário
4. **Templates Prontos** - Anamnese + Recordatório 24h
5. **LYA Criar Formulários** - Via comando natural
6. **LYA Resumir Respostas** - Resumo inteligente e seguro
7. **LYA Identificar Padrões** - Insights de negócio
8. **Integração getNutriContext** - LYA acessa dados de formulários
9. **UI LyaChatWidget** - Botões de sugestão + disclaimers
10. **Navegação** - Item no sidebar "Gestão de Clientes"

---

## 🚀 **ANTES DE COMEÇAR OS TESTES**

### 1️⃣ **Executar Migration no Banco**

**Arquivo:** `migrations/inserir-templates-formularios.sql`

**Como executar:**
1. Acesse: [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Menu lateral: **SQL Editor**
4. Clique em: **New Query**
5. Abra o arquivo: `migrations/inserir-templates-formularios.sql`
6. Copie TODO o conteúdo
7. Cole no editor
8. Clique em: **Run**
9. ✅ Confirme: "Success. No rows returned"

**O que isso faz:**
- Cria template: **Anamnese Nutricional Básica** (25 campos)
- Cria template: **Recordatório Alimentar 24h** (22 campos)

---

### 2️⃣ **Configurar OpenAI Assistant**

**Arquivo de referência:** `docs/LYA-FORMULARIOS-SETUP.md`

#### **A) Atualizar Modelo**
1. Acesse: [OpenAI Platform](https://platform.openai.com/assistants)
2. Selecione seu Assistant (LYA)
3. **Model:** Alterar de `gpt-4` para `gpt-4o-mini`
4. **Salvar**

**Por quê?**
- 85% mais barato
- Suficiente para todas as funções da LYA
- Respostas mais rápidas

#### **B) Adicionar 3 Novas Funções**

Copie e cole cada JSON no campo "Functions":

**Função 1: criarFormulario**
```json
{
  "name": "criarFormulario",
  "description": "Cria um novo formulário customizado baseado em descrição em linguagem natural",
  "parameters": {
    "type": "object",
    "properties": {
      "descricao": {
        "type": "string",
        "description": "Descrição em linguagem natural do formulário desejado"
      }
    },
    "required": ["descricao"]
  }
}
```

**Função 2: resumirRespostas**
```json
{
  "name": "resumirRespostas",
  "description": "Resume respostas de formulários de forma descritiva (não clínica)",
  "parameters": {
    "type": "object",
    "properties": {
      "formId": {
        "type": "string",
        "description": "ID do formulário (opcional)"
      },
      "responseId": {
        "type": "string",
        "description": "ID da resposta específica (opcional)"
      }
    }
  }
}
```

**Função 3: identificarPadroes**
```json
{
  "name": "identificarPadroes",
  "description": "Identifica padrões descritivos nas respostas (não faz análise clínica)",
  "parameters": {
    "type": "object",
    "properties": {
      "formType": {
        "type": "string",
        "description": "Tipo de formulário para filtrar (opcional)"
      }
    }
  }
}
```

#### **C) Atualizar System Message (Prompt)**

**Arquivo completo:** `docs/LYA-PROMPT-PRINCIPAL-ATUALIZADO.md`

**Adicionar ao final do System Message atual:**

```
## 🚨 LIMITES CRÍTICOS - FORMULÁRIOS

### ❌ O QUE VOCÊ NÃO PODE FAZER:
1. **Análise Clínica**: Nunca interpretar clinicamente dados de formulários
2. **Diagnósticos**: Nunca sugerir ou insinuar diagnósticos
3. **Protocolos**: Nunca prescrever condutas, planos ou protocolos
4. **Correlações Clínicas**: Nunca correlacionar sintomas com deficiências/doenças

### ✅ O QUE VOCÊ PODE FAZER:
1. **Resumir Descritivamente**: "Cliente relatou X, Y, Z"
2. **Identificar Padrões Comportamentais**: "3 de 5 clientes mencionaram pular café"
3. **Insights de Negócio**: "Maioria busca emagrecimento"
4. **Organização**: Estruturar informações de forma clara

### 📊 Ao Resumir Formulários:
- Use verbos neutros: "relatou", "mencionou", "informou"
- Nunca: "apresenta deficiência", "indica", "sugere que tem"
- Sempre termine com: "Cabe ao nutricionista fazer a avaliação clínica."

### 🔍 Ao Identificar Padrões:
- Foque em dados demográficos e comportamentais
- Nunca faça correlações de causa-efeito clínicas
- Sugira estratégias de NEGÓCIO, não de TRATAMENTO

**Você é mentora de NEGÓCIOS, não de NUTRIÇÃO CLÍNICA.**
```

**Salvar alterações no Assistant.**

---

### 3️⃣ **Verificar Variáveis de Ambiente**

**Produção (Vercel):**
```env
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_ASSISTANT_ID=asst_...
```

**Local (.env.local):**
```env
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_ASSISTANT_ID=asst_...
```

---

## 🧪 **INICIAR TESTES**

### **Checklist Completo:**

Abra o arquivo: **`CHECKLIST-TESTES-FORMULARIOS-LYA.md`**

**Estrutura:**
- ✅ 10 áreas de teste
- ✅ 50+ casos de teste
- ✅ Testes de segurança
- ✅ Testes de erro
- ✅ Testes mobile
- ✅ Critérios de aceitação

### **Ordem Recomendada de Testes:**

1. **PRÉ-REQUISITOS** (15 min)
   - [ ] Executar migration
   - [ ] Configurar OpenAI Assistant
   - [ ] Verificar env vars

2. **NAVEGAÇÃO E INTERFACE** (10 min)
   - [ ] Acesso à seção
   - [ ] Visualização de templates

3. **BADGE DE NOTIFICAÇÃO** (15 min)
   - [ ] Criar formulário de teste
   - [ ] Responder formulário
   - [ ] Verificar badge
   - [ ] Marcar como visualizada

4. **COMPARTILHAMENTO WHATSAPP** (10 min)
   - [ ] Testar botão
   - [ ] Verificar link

5. **LYA - CRIAR FORMULÁRIOS** (20 min)
   - [ ] Comando anamnese
   - [ ] Comando recordatório
   - [ ] Comando personalizado

6. **LYA - RESUMIR RESPOSTAS** (20 min)
   - [ ] Resumo de anamnese
   - [ ] Resumo de recordatório
   - [ ] Verificar que NÃO faz análise clínica

7. **LYA - IDENTIFICAR PADRÕES** (20 min)
   - [ ] Padrões alimentares
   - [ ] Padrões demográficos
   - [ ] Verificar que NÃO faz correlação clínica

8. **LIMITES E SEGURANÇA DA LYA** (15 min)
   - [ ] Tentar análise clínica (deve recusar)
   - [ ] Tentar diagnóstico (deve recusar)
   - [ ] Verificar disclaimers

9. **BOTÕES DE SUGESTÃO** (10 min)
   - [ ] Ver botões no chat
   - [ ] Clicar em cada um
   - [ ] Verificar funcionamento

10. **TESTES DE SEGURANÇA** (15 min)
    - [ ] Acesso não autorizado
    - [ ] Tentativa de XSS
    - [ ] Isolamento de dados

**Tempo total estimado: ~2h30min**

---

## 📊 **CRITÉRIOS DE APROVAÇÃO**

### ✅ **Mínimo para Produção:**
- 90%+ dos testes funcionais passam
- 100% dos testes de segurança passam
- LYA não faz análise clínica em nenhum caso
- Disclaimer sempre visível
- Custos OpenAI monitorados

### ⚠️ **Bloqueadores (NÃO pode ir pra produção se falhar):**
- LYA fazer qualquer análise clínica
- LYA sugerir diagnósticos/protocolos
- Vulnerabilidades de segurança (XSS, acesso não autorizado)
- Templates não criados no banco
- Badge de notificação não funciona

---

## 🐛 **SE ENCONTRAR BUGS**

### **Bugs Críticos** (travam funcionalidade)
→ Reportar imediatamente

### **Bugs Não-Críticos** (não bloqueiam)
→ Anotar no checklist, corrigir depois

### **Template de Bug Report:**
```
## Bug #X
- **Descrição:** [O que aconteceu]
- **Reproduzir:** [Passo a passo]
- **Esperado:** [O que deveria acontecer]
- **Atual:** [O que acontece]
- **Prioridade:** Alta/Média/Baixa
- **Screenshot:** [Se aplicável]
```

---

## 📚 **DOCUMENTAÇÃO DISPONÍVEL**

1. **RESUMO-MELHORIAS-FORMULARIOS.md** - Overview completo
2. **CHECKLIST-TESTES-FORMULARIOS-LYA.md** - Casos de teste detalhados
3. **docs/LYA-FORMULARIOS-SETUP.md** - Setup técnico OpenAI
4. **docs/LYA-LIMITES-E-RESPONSABILIDADES.md** - Limites legais
5. **docs/LYA-PROMPT-PRINCIPAL-ATUALIZADO.md** - Prompt completo
6. **ANALISE-FORMULARIOS-LOCALIZACAO-CUSTOS.md** - Análise de custos
7. **ANALISE-GPT4-VS-GPT4O-MINI-LYA.md** - Comparação de modelos

---

## 💰 **MONITORAMENTO DE CUSTOS**

### **GPT-4o-mini (Recomendado)**
- **Input:** $0.15 / 1M tokens (~R$ 0,80)
- **Output:** $0.60 / 1M tokens (~R$ 3,20)

### **Estimativa de Uso:**
- Criar formulário: ~500 tokens = R$ 0,002
- Resumir resposta: ~1.000 tokens = R$ 0,005
- Identificar padrões: ~2.000 tokens = R$ 0,010

### **Exemplo Mensal (100 nutricionistas ativos):**
- 500 criações de formulários = R$ 1,00
- 2.000 resumos = R$ 10,00
- 500 identificações de padrões = R$ 5,00
- **Total estimado: ~R$ 20/mês**

**Muito mais barato que contratar templates prontos!**

---

## 🚀 **APÓS APROVAÇÃO DOS TESTES**

### **Deploy em Produção:**
1. [ ] Executar migration no Supabase de produção
2. [ ] Atualizar OpenAI Assistant de produção
3. [ ] Verificar env vars Vercel
4. [ ] Deploy (já está no main, só precisa confirmar)
5. [ ] Smoke test em produção
6. [ ] Monitorar logs primeiras 24h

### **Comunicação:**
1. [ ] Treinar nutricionistas sobre limites da LYA
2. [ ] Enviar email/tutorial sobre novos recursos
3. [ ] Atualizar Termos de Uso (mencionar uso de IA)
4. [ ] Criar tutorial em vídeo (opcional)

---

## 📞 **SUPORTE**

**Dúvidas técnicas?**
- Consulte a documentação em `/docs`
- Verifique logs do Vercel
- Monitore OpenAI Usage Dashboard

**Problemas urgentes?**
- GitGuardian (segurança de senhas)
- Vercel build failures
- OpenAI rate limits

---

## ✅ **APROVAÇÃO FINAL**

- [ ] Todos os testes críticos passaram
- [ ] Documentação revisada
- [ ] Custos validados
- [ ] Equipe treinada

**Assinado por:** _____________________  
**Data:** _____/_____/_____

---

**Próximo passo:** Abra `CHECKLIST-TESTES-FORMULARIOS-LYA.md` e comece os testes! 🚀
