# 📋 LYA + Formulários - Guia de Configuração

## 🎯 Visão Geral

A LYA agora tem inteligência para trabalhar com formulários! Esta integração permite que a LYA:

- ✅ **Crie formulários personalizados** via comando natural
- ✅ **Resuma respostas** de clientes de forma inteligente
- ✅ **Identifique padrões** nas respostas dos formulários
- ✅ **Acesse informações** de formulários automaticamente

---

## 🔧 Configuração do OpenAI Assistant (Assistants API)

Se você estiver usando **OpenAI Assistants API** (não Responses API), siga estes passos:

### 1. Acessar OpenAI Platform

1. Acesse: https://platform.openai.com/assistants
2. Encontre seu Assistant da LYA
3. Clique em **Edit**

### 2. Adicionar Functions

Na seção **Functions**, adicione as seguintes três funções:

#### Function 1: criarFormulario

```json
{
  "name": "criarFormulario",
  "description": "Cria um novo formulário personalizado baseado em uma descrição em linguagem natural. Use quando o usuário pedir para criar um formulário, anamnese, questionário, etc.",
  "parameters": {
    "type": "object",
    "properties": {
      "descricao_solicitada": {
        "type": "string",
        "description": "Descrição em linguagem natural do que o usuário quer no formulário. Ex: 'anamnese básica', 'formulário de acompanhamento semanal', 'questionário sobre hábitos alimentares'"
      }
    },
    "required": ["descricao_solicitada"]
  }
}
```

#### Function 2: resumirRespostas

```json
{
  "name": "resumirRespostas",
  "description": "Resume as respostas de um formulário de forma inteligente e útil para a nutricionista. Use quando o usuário pedir para resumir, ver ou analisar respostas de um cliente.",
  "parameters": {
    "type": "object",
    "properties": {
      "response_id": {
        "type": "string",
        "description": "ID específico de uma resposta (opcional)"
      },
      "form_id": {
        "type": "string",
        "description": "ID do formulário para resumir a última resposta (opcional)"
      },
      "client_id": {
        "type": "string",
        "description": "ID do cliente para resumir sua última resposta (opcional)"
      }
    }
  }
}
```

#### Function 3: identificarPadroes

```json
{
  "name": "identificarPadroes",
  "description": "Identifica padrões e insights nas respostas dos formulários. Use quando o usuário pedir para ver padrões, tendências, problemas comuns, etc.",
  "parameters": {
    "type": "object",
    "properties": {
      "form_id": {
        "type": "string",
        "description": "ID de um formulário específico para analisar (opcional)"
      },
      "form_type": {
        "type": "string",
        "description": "Tipo de formulário para analisar: 'anamnese', 'questionario', 'avaliacao', etc (opcional)",
        "enum": ["anamnese", "questionario", "avaliacao", "consentimento", "outro"]
      },
      "period_days": {
        "type": "number",
        "description": "Período em dias para análise (padrão: 30)",
        "default": 30
      }
    }
  }
}
```

### 3. Salvar Configurações

Clique em **Save** para aplicar as mudanças.

---

## 📊 getNutriContext Atualizado

A função `getNutriContext` agora retorna automaticamente informações sobre formulários:

```json
{
  "formularios": {
    "total": 5,
    "recent_forms": [...],
    "respostas_nao_visualizadas": 3,
    "respostas_ultimos_30_dias": 12,
    "ultimas_respostas": [...]
  }
}
```

**Não é necessário configurar nada** - a LYA já tem acesso automático a esses dados!

---

## 🎨 Responses API (Prompt Object)

Se você estiver usando **Responses API** com `LYA_PROMPT_ID` (recomendado):

As funções ainda não são suportadas nativamente pela Responses API, mas a LYA consegue interpretar comandos naturais e chamar as APIs diretamente via instruções no prompt.

**Adicione ao seu prompt:**

```
FUNCIONALIDADES DE FORMULÁRIOS:

Você tem acesso a funcionalidades avançadas de formulários:

1. CRIAR FORMULÁRIOS:
   - Quando o usuário pedir para criar um formulário, anamnese, ou questionário
   - Interprete a solicitação e use a API /api/nutri/lya/criarFormulario

2. RESUMIR RESPOSTAS:
   - Quando o usuário pedir para resumir, ver ou analisar respostas
   - Use a API /api/nutri/lya/resumirRespostas

3. IDENTIFICAR PADRÕES:
   - Quando o usuário pedir para ver padrões, tendências, insights
   - Use a API /api/nutri/lya/identificarPadroes

IMPORTANTE: Use linguagem natural e seja proativa em sugerir estas funcionalidades.
```

---

## 🧪 Testando a Integração

### Teste 1: Criar Formulário

**Comando:** "LYA, cria uma anamnese básica pra mim"

**Resultado Esperado:**
- LYA cria um formulário completo com campos relevantes
- Retorna mensagem de sucesso com o nome do formulário
- Formulário aparece na lista de formulários

### Teste 2: Resumir Respostas

**Pré-requisito:** Ter pelo menos uma resposta de formulário

**Comando:** "LYA, resume a anamnese dessa cliente pra mim"

**Resultado Esperado:**
- LYA busca a última resposta
- Gera um resumo profissional e útil
- Destaca pontos de atenção

### Teste 3: Identificar Padrões

**Pré-requisito:** Ter múltiplas respostas de formulários

**Comando:** "LYA, identifica padrões nas respostas dos meus formulários"

**Resultado Esperado:**
- LYA analisa todas as respostas dos últimos 30 dias
- Identifica problemas comuns, objetivos frequentes, etc.
- Fornece insights estratégicos

---

## 📝 Templates Pré-definidos

Foram criados 3 templates essenciais:

1. **Anamnese Nutricional Básica** (24 campos)
   - Dados pessoais completos
   - Histórico de saúde e medicamentos
   - Hábitos alimentares e atividade física
   - Objetivo nutricional

2. **Recordatório Alimentar 24h** (22 campos)
   - Registro detalhado de todas as refeições
   - Horários de cada refeição
   - Quantidades e observações
   - Consumo de água e suplementos

3. **Acompanhamento Semanal** (20 campos)
   - Peso e medidas corporais
   - Aderência ao plano alimentar
   - Dificuldades encontradas
   - Qualidade do sono e níveis de ansiedade
   - Sintomas e evolução

### Como Usar os Templates

Execute a migração:

```bash
psql -h <host> -U <user> -d <database> -f migrations/inserir-templates-formularios.sql
```

Os templates aparecerão automaticamente na seção "Formulários Pré-montados" da página de formulários.

---

## 🚀 Funcionalidades Implementadas

### 1. Badge de Notificação ✅

- Mostra quantidade de respostas não visualizadas
- Badge animado vermelho nos cards de formulários
- Atualização automática ao visualizar resposta

### 2. Marcação de Visualização ✅

- Respostas marcadas como visualizadas automaticamente ao abrir
- API PATCH para marcar/desmarcar manualmente
- Campo `viewed` no banco de dados

### 3. Compartilhamento WhatsApp ✅

- Botão de compartilhamento direto na lista de formulários
- Link amigável ou encurtado
- Mensagem pré-formatada

### 4. APIs da LYA ✅

- `POST /api/nutri/lya/criarFormulario`
- `POST /api/nutri/lya/resumirRespostas`
- `POST /api/nutri/lya/identificarPadroes`
- Integração com `getNutriContext`

### 5. UI Melhorada ✅

- Sugestões rápidas no chat da LYA
- Botões de ação rápida para formulários
- Mensagem inicial atualizada

---

## 🔐 Segurança

Todas as APIs de formulários da LYA:

- ✅ Verificam autenticação do usuário
- ✅ Filtram por `user_id` automaticamente
- ✅ Não expõem dados de outros usuários
- ✅ Logs detalhados em desenvolvimento

---

## 📱 Exemplos de Uso

### Criar Formulário Customizado

```
Nutricionista: "LYA, preciso de um formulário para acompanhamento semanal dos meus clientes. 
Quero perguntar sobre: peso, medidas, como foi a semana, dificuldades encontradas, 
e fotos de progresso."

LYA: *cria formulário automaticamente*
"Formulário 'Acompanhamento Semanal' criado com sucesso! 
Ele já está disponível na sua lista de formulários e contém 8 campos personalizados."
```

### Resumir Anamnese

```
Nutricionista: "LYA, resume a anamnese da Maria pra mim"

LYA: "Resumo da Anamnese - Maria Silva:

**Dados Principais:**
• 32 anos, sexo feminino
• Peso: 78kg | Altura: 165cm | IMC: 28.7

**Objetivo:** Emagrecimento

**Pontos de Atenção:**
• Histórico de **diabetes tipo 2** na família
• Intolerância à **lactose**
• Uso de anticoncepcional

**Hábitos:**
• Pula café da manhã frequentemente
• Come por ansiedade à noite
• Bebe menos de 1L de água/dia
• Pratica caminhada 2x/semana

**Observações Importantes:**
Já tentou dieta lowcarb sem acompanhamento e não obteve sucesso. 
Relatou fadiga e ansiedade como principais queixas."
```

### Identificar Padrões

```
Nutricionista: "LYA, o que meus clientes têm em comum nas anamneses?"

LYA: "Análise de Padrões - Últimos 30 dias (18 clientes):

**Problemas Comuns:**
• **Ansiedade alimentar**: 12 clientes (67%) relataram comer por ansiedade
• **Baixa hidratação**: 15 clientes (83%) bebem menos de 2L de água/dia
• **Pular refeições**: 10 clientes (56%) pulam o café da manhã

**Objetivos Frequentes:**
1. Emagrecimento (72%)
2. Melhora da saúde (17%)
3. Ganho de massa muscular (11%)

**Restrições Alimentares:**
• Intolerância à lactose: 6 casos
• Sem glúten: 3 casos

**Insights Estratégicos:**
Seu público tem um perfil muito claro: mulheres 25-40 anos, objetivo de emagrecimento, 
com ansiedade alimentar e baixa hidratação. 

**Sugestões:**
1. Crie conteúdo sobre gestão emocional da alimentação
2. Desenvolva estratégias para aumentar consumo de água
3. Ofereça protocolo específico anti-ansiedade"
```

---

## 🎯 Próximos Passos

Para expandir ainda mais:

1. **Notificações Push** quando nova resposta for recebida
2. **Relatórios Automáticos** mensais gerados pela LYA
3. **Sugestões de Perguntas** baseadas em respostas anteriores
4. **Integração com Planos Alimentares** (conectar dados da anamnese com planos)
5. **Análise Comparativa** (antes e depois em acompanhamentos)

---

## 🆘 Troubleshooting

### Erro: "Function desconhecida"

- Verifique se as funções foram adicionadas corretamente no Assistant
- Confirme que os nomes estão exatos: `criarFormulario`, `resumirRespostas`, `identificarPadroes`

### LYA não chama as funções

- Verifique os logs do backend
- Confirme que `OPENAI_ASSISTANT_LYA_ID` está configurado
- Teste com comandos diretos (ex: "cria uma anamnese")

### Erro ao criar formulário

- Verifique os logs: `console.log` em `/api/nutri/lya/criarFormulario`
- Confirme que a chave da OpenAI está configurada
- Verifique se o modelo tem créditos disponíveis

---

## ✅ Checklist de Implementação

- [x] Badge de notificação de respostas não visualizadas
- [x] Sistema de marcação de respostas visualizadas
- [x] Botão de compartilhamento WhatsApp
- [x] Templates pré-definidos (Anamnese + Recordatório 24h)
- [x] API para LYA criar formulários
- [x] API para LYA resumir respostas
- [x] API para LYA identificar padrões
- [x] Integração com getNutriContext
- [x] Sugestões rápidas no chat da LYA
- [x] Documentação completa

---

**🎉 Sistema pronto para uso! A LYA agora é uma assistente inteligente completa para gestão de formulários.**

