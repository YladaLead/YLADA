# 📋 PLANEJAMENTO: NOTIFICAÇÕES DE FORMULÁRIOS PREENCHIDOS

## 🎯 OBJETIVO
Implementar sistema de notificações na página inicial do coach para avisar quando há novos formulários preenchidos, permitindo que o coach decida o que fazer com cada resposta.

---

## 📊 ANÁLISE DA ESTRUTURA ATUAL

### 1. Estrutura de Respostas
**Tabela:** `form_responses`
- `id` (UUID)
- `form_id` (UUID)
- `user_id` (UUID) - Coach dono
- `client_id` (UUID) - Pode ser NULL (coach vincula depois)
- `responses` (JSONB)
- `completed_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `ip_address` (INET)
- `user_agent` (TEXT)

**Status atual:** Não há campo `viewed` ou `is_read`

---

## 🔄 FLUXO PROPOSTO

### **FLUXO SIMPLIFICADO:**

```
1. Cliente preenche formulário público
   ↓
2. POST /api/public/formularios/[formId]/respostas
   ↓
3. Salvar resposta em form_responses (client_id = NULL)
   ↓
4. Resposta fica disponível para o coach ver
   ↓
5. Coach vê notificação na home: "X novos formulários"
   ↓
6. Coach clica e vai para página de respostas
   ↓
7. Coach decide: criar cliente, vincular a cliente existente, ou apenas visualizar
```

---

## ⚙️ IMPLEMENTAÇÃO

### **ETAPA 1: Adicionar campo `viewed` no banco**

**Migration:** `migrations/008-adicionar-viewed-form-responses.sql`

```sql
-- Adicionar campo viewed
ALTER TABLE form_responses
ADD COLUMN IF NOT EXISTS viewed BOOLEAN DEFAULT false;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_form_responses_viewed 
ON form_responses(user_id, viewed, created_at DESC);

-- Marcar todas as respostas antigas como visualizadas
UPDATE form_responses
SET viewed = true
WHERE viewed IS NULL OR viewed = false;
```

### **ETAPA 2: API para contar respostas não visualizadas**

**Arquivo:** `src/app/api/coach/formularios/respostas/novas/route.ts` (NOVO)

**Endpoint:** `GET /api/coach/formularios/respostas/novas`

**Funcionalidade:**
- Contar respostas com `viewed = false` do coach autenticado
- Retornar contagem total e por formulário
- Opcional: últimas 5 respostas não visualizadas

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "por_formulario": [
      {
        "form_id": "uuid",
        "form_name": "Avaliação de Sono",
        "count": 3
      }
    ],
    "ultimas_respostas": [...]
  }
}
```

### **ETAPA 3: API para marcar como visualizada**

**Arquivo:** `src/app/api/coach/formularios/respostas/[responseId]/viewed/route.ts` (NOVO)

**Endpoint:** `PATCH /api/coach/formularios/respostas/[responseId]/viewed`

**Funcionalidade:**
- Marcar resposta específica como `viewed = true`
- Verificar se resposta pertence ao coach

### **ETAPA 4: Modificar API de listagem para marcar como visualizada**

**Arquivo:** `src/app/api/coach/formularios/[id]/respostas/route.ts`

**Mudança:**
- Ao listar respostas, marcar automaticamente como `viewed = true`
- Ou adicionar parâmetro `?mark_as_viewed=true` (opcional)

### **ETAPA 5: Notificação na Home**

**Arquivo:** `src/app/pt/coach/home/page.tsx`

**Implementação:**
1. **Badge/Contador no topo:**
   - Tarja destacada: "🔔 Você tem X novos formulários preenchidos"
   - Cor: Amarelo/Laranja para chamar atenção
   - Link direto para página de formulários

2. **Card de Resumo:**
   - Card destacado mostrando:
     - Total de novos formulários
     - Últimos formulários preenchidos (3-5)
     - Botão "Ver todos"

3. **Atualização em tempo real:**
   - Polling a cada 30-60 segundos
   - Ou WebSocket (futuro)

### **ETAPA 6: Melhorar página de respostas**

**Arquivo:** `src/app/pt/coach/formularios/[id]/respostas/page.tsx`

**Melhorias:**
- Badge "NOVO" em respostas não visualizadas
- Filtro: "Todos", "Novos", "Visualizados"
- Botão "Marcar todos como visualizados"
- Ao abrir resposta, marcar como visualizada automaticamente

---

## 🎨 DESIGN DA NOTIFICAÇÃO

### **Opção 1: Tarja no Topo (Recomendada)**
```
┌─────────────────────────────────────────────────────────┐
│ 🔔 Você tem 5 novos formulários preenchidos             │
│    [Ver Formulários]                                    │
└─────────────────────────────────────────────────────────┘
```

### **Opção 2: Card Destacado**
```
┌─────────────────────────────────────────────────────────┐
│ 📋 Novos Formulários                                    │
│                                                          │
│ Você tem 5 novos formulários preenchidos:              │
│ • Avaliação de Sono (3 novos)                          │
│ • Histórico de Dietas (2 novos)                         │
│                                                          │
│ [Ver Todos os Formulários]                             │
└─────────────────────────────────────────────────────────┘
```

### **Opção 3: Badge no Menu**
- Badge vermelho com número no item "Formulários" do menu lateral

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Banco de Dados**
- [ ] Criar migration para adicionar campo `viewed`
- [ ] Criar índice para performance
- [ ] Marcar respostas antigas como visualizadas
- [ ] Testar migration

### **Fase 2: APIs**
- [ ] Criar `/api/coach/formularios/respostas/novas` (GET)
- [ ] Criar `/api/coach/formularios/respostas/[id]/viewed` (PATCH)
- [ ] Modificar API de listagem para marcar como visualizada
- [ ] Testes das APIs

### **Fase 3: Frontend - Notificação**
- [ ] Adicionar componente de notificação na home
- [ ] Integrar com API de contagem
- [ ] Adicionar polling/atualização automática
- [ ] Estilizar notificação (tarja/card)
- [ ] Link para página de formulários

### **Fase 4: Frontend - Página de Respostas**
- [ ] Adicionar badge "NOVO" em respostas não visualizadas
- [ ] Adicionar filtro por status (novos/visualizados)
- [ ] Marcar como visualizada ao abrir
- [ ] Botão "Marcar todos como visualizados"

### **Fase 5: Testes**
- [ ] Testar contagem de novas respostas
- [ ] Testar marcação como visualizada
- [ ] Testar notificação na home
- [ ] Testar atualização em tempo real
- [ ] Testar em diferentes navegadores

---

## ⚠️ PONTOS DE ATENÇÃO

### **1. Performance**
- Índice em `(user_id, viewed, created_at)` para queries rápidas
- Cache da contagem (opcional, 30 segundos)

### **2. UX**
- Notificação não intrusiva mas visível
- Fácil de ignorar se não quiser ver agora
- Link direto para ação

### **3. Escalabilidade**
- Se muitos formulários, considerar paginação
- Limitar contagem a últimos 30 dias (opcional)

---

## 🚀 ORDEM DE IMPLEMENTAÇÃO

1. **Banco de Dados** (Migration)
2. **APIs** (Contagem e marcação)
3. **Frontend - Notificação** (Home)
4. **Frontend - Página de Respostas** (Melhorias)
5. **Testes e Ajustes**

---

**Data de criação:** 2025-01-06
**Versão:** 1.0
**Status:** 📋 Planejamento Simplificado - Foco em Notificações


