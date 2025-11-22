# 🤖 Guia: Sistema de Perguntas e Respostas do ChatIA

## 📋 O QUE É

Sistema que permite armazenar perguntas frequentes e suas respostas no Supabase, permitindo que o ChatIA aprenda e melhore ao longo do tempo **sem custos de IA externa**.

---

## 🚀 COMO FUNCIONA

### 1. **Fluxo de Resposta**

```
Usuário faz pergunta
    ↓
ChatIA busca no banco de dados (Supabase)
    ↓
Encontrou? → Retorna resposta do banco ✅
    ↓
Não encontrou? → Usa respostas pré-definidas (fallback) ✅
```

### 2. **Busca Inteligente**

O sistema usa **full-text search** do PostgreSQL para encontrar respostas relevantes:
- Normaliza texto (remove acentos, lowercase)
- Calcula relevância baseada em:
  - Similaridade de texto (50%)
  - Prioridade da resposta (30%)
  - Estatísticas de uso (20%)

### 3. **Estatísticas Automáticas**

O sistema rastreia automaticamente:
- Quantas vezes cada resposta foi usada
- Quantas vezes ajudou (feedback positivo)
- Quantas vezes não ajudou (feedback negativo)

---

## 📊 ESTRUTURA DO BANCO

### Tabela: `chat_qa`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único |
| `pergunta` | TEXT | Pergunta original |
| `pergunta_normalizada` | TEXT | Versão normalizada para busca |
| `resposta` | TEXT | Resposta completa |
| `area` | TEXT | 'coach', 'nutri', 'wellness', ou NULL (todas) |
| `tags` | TEXT[] | Array de tags para categorização |
| `vezes_usada` | INTEGER | Contador de uso |
| `vezes_ajudou` | INTEGER | Feedback positivo |
| `vezes_nao_ajudou` | INTEGER | Feedback negativo |
| `ativa` | BOOLEAN | Se está ativa |
| `prioridade` | INTEGER | 0-100 (maior = aparece primeiro) |

---

## 🛠️ COMO USAR

### 1. **Executar Migração**

No Supabase SQL Editor, execute:
```sql
-- Arquivo: migrations/criar-tabela-chat-qa.sql
```

Isso criará:
- Tabela `chat_qa`
- Funções de busca e normalização
- Índices para performance
- Respostas iniciais de exemplo

### 2. **Acessar Painel Admin**

1. Acesse: `/admin/chat-qa`
2. Você verá todas as respostas cadastradas
3. Pode filtrar por área e buscar

### 3. **Adicionar Nova Resposta**

1. Clique em **"+ Nova Resposta"**
2. Preencha:
   - **Pergunta:** Como o usuário pode perguntar
   - **Resposta:** Resposta completa
   - **Área:** Coach, Nutri, Wellness, ou Todas
   - **Tags:** Separadas por vírgula (ex: "clientes, cadastro")
   - **Prioridade:** 0-100 (maior = aparece primeiro)
3. Clique em **"Criar"**

### 4. **Editar/Deletar**

- **Editar:** Clique em "Editar" na linha da resposta
- **Deletar:** Clique em "Deletar" (confirmação necessária)

---

## 💡 DICAS DE USO

### **Perguntas Eficazes**

✅ **BOM:**
- "Como cadastrar um cliente?"
- "Como usar o Kanban?"
- "Como agendar uma consulta?"

❌ **RUIM:**
- "cliente" (muito genérico)
- "ajuda" (muito vago)

### **Respostas Eficazes**

✅ **BOM:**
- Respostas completas e detalhadas
- Passo a passo claro
- Exemplos práticos
- Links para páginas específicas

❌ **RUIM:**
- Respostas muito curtas
- Sem contexto
- Sem exemplos

### **Tags Úteis**

Use tags para categorizar:
- `clientes`, `cadastro`, `kanban`
- `agenda`, `consulta`
- `formulários`, `leads`
- `relatórios`, `estatísticas`

### **Prioridade**

- **100:** Respostas essenciais (ex: "Como cadastrar cliente")
- **50:** Respostas importantes
- **0:** Respostas gerais

---

## 📈 ESTATÍSTICAS

O sistema rastreia automaticamente:

- **vezes_usada:** Quantas vezes foi usada
- **vezes_ajudou:** Feedback positivo
- **vezes_nao_ajudou:** Feedback negativo

**Use essas estatísticas para:**
- Identificar respostas mais úteis
- Melhorar respostas que não ajudam
- Remover respostas não utilizadas

---

## 🔧 API ENDPOINTS

### **GET `/api/chat/qa?pergunta=...&area=...`**
Busca resposta para uma pergunta.

**Resposta:**
```json
{
  "encontrada": true,
  "resposta": "Para cadastrar...",
  "id": "uuid",
  "relevancia": 0.85
}
```

### **POST `/api/chat/qa`** (Admin)
Cria ou atualiza resposta.

**Body:**
```json
{
  "pergunta": "Como cadastrar?",
  "resposta": "Para cadastrar...",
  "area": "coach",
  "tags": ["clientes", "cadastro"],
  "prioridade": 10
}
```

### **GET `/api/admin/chat-qa`** (Admin)
Lista todas as respostas.

---

## ✅ VANTAGENS

1. **Sem Custos:** Não usa APIs externas
2. **Aprendizado Contínuo:** Melhora com o tempo
3. **Personalizável:** Você controla todas as respostas
4. **Estatísticas:** Vê o que funciona melhor
5. **Performance:** Busca rápida com índices otimizados

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Executar migração SQL
2. ✅ Adicionar respostas iniciais
3. ✅ Monitorar estatísticas
4. ✅ Melhorar respostas baseado em uso
5. ✅ Adicionar mais respostas conforme necessário

---

**Documento criado em:** 2025-01-21

