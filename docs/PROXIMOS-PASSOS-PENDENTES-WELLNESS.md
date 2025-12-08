# 📋 PRÓXIMOS PASSOS PENDENTES - WELLNESS SYSTEM

**Data:** Janeiro 2025  
**Status Atual:** ✅ Core implementado, seeds executados, duplicatas removidas

---

## ✅ O QUE JÁ FOI FEITO

1. ✅ **Banco de Dados**
   - Tabelas criadas e migradas
   - Seeds de scripts (368 únicos) e objeções (40) executados
   - Duplicatas removidas
   - Índices e constraints configurados

2. ✅ **Motor NOEL**
   - Core completo (persona, missão, regras, raciocínio)
   - Modos de operação (10 modos)
   - Motor de scripts
   - Handler de objeções
   - Construtor de resposta

3. ✅ **APIs**
   - `/api/wellness/noel` - Endpoint principal (integrado com novo motor)
   - `/api/wellness/noel/v2` - Nova API completa
   - `/api/wellness/noel/scripts` - Buscar scripts
   - `/api/wellness/noel/objections` - Buscar objeções

4. ✅ **Sistema de Learning Suggestions**
   - Tabela `wellness_learning_suggestions` criada
   - Código que detecta queries novas e cria sugestões (já implementado)
   - ⚠️ **FALTA:** Notificação para admin quando nova sugestão é criada
   - ⚠️ **FALTA:** Área admin para gerenciar sugestões

---

## 🚧 O QUE AINDA FALTA FAZER

### 1. ⏭️ Sistema de Notificações para Admin (Learning Suggestions)

**Status:** ⚠️ Parcialmente implementado

**O que já existe:**
- ✅ Tabela `wellness_learning_suggestions` criada
- ✅ Código que detecta queries novas e cria sugestões (em `src/app/api/wellness/noel/route.ts`)

**O que falta:**
- ⏭️ **Notificação por email** quando nova sugestão é criada
- ⏭️ **Função de notificação** similar a `notifyAgentsNewTicket` (usar como referência)

**Arquivos a criar/modificar:**
- `src/lib/wellness-learning-notifications.ts` (novo)
- Modificar `src/app/api/wellness/noel/route.ts` para chamar notificação

**Referência:**
- Ver `src/lib/support-notifications.ts` como exemplo
- Usar Resend para enviar emails
- Notificar admin quando `frequency >= 3` (sugestão recorrente)

---

### 2. ⏭️ Área Administrativa para Gerenciar Learning Suggestions

**Status:** ❌ Não implementado

**O que precisa ser criado:**

#### 2.1. API Endpoints

**a) Listar sugestões pendentes:**
```
GET /api/admin/wellness/learning-suggestions
Query params:
  - status: 'pending' | 'approved' | 'rejected'
  - min_frequency: number (default: 3)
  - limit: number
  - offset: number
```

**b) Aprovar sugestão:**
```
POST /api/admin/wellness/learning-suggestions/:id/approve
Body:
  {
    action: 'add_to_scripts' | 'add_to_objections' | 'add_to_knowledge',
    category?: string,
    subcategory?: string,
    tags?: string[]
  }
```

**c) Rejeitar sugestão:**
```
POST /api/admin/wellness/learning-suggestions/:id/reject
Body:
  {
    reason?: string
  }
```

**d) Adicionar ao banco de conhecimento:**
```
POST /api/admin/wellness/learning-suggestions/:id/add-to-knowledge
Body:
  {
    category: 'scripts' | 'objections' | 'knowledge',
    data: { ... } // Dados específicos conforme categoria
  }
```

**Arquivos a criar:**
- `src/app/api/admin/wellness/learning-suggestions/route.ts` (GET - listar)
- `src/app/api/admin/wellness/learning-suggestions/[id]/approve/route.ts` (POST)
- `src/app/api/admin/wellness/learning-suggestions/[id]/reject/route.ts` (POST)
- `src/app/api/admin/wellness/learning-suggestions/[id]/add-to-knowledge/route.ts` (POST)

#### 2.2. Interface Admin

**Página:** `/pt/admin/wellness/learning-suggestions`

**Funcionalidades:**
- [ ] Listar sugestões pendentes (com filtros)
- [ ] Ver detalhes da sugestão (query, resposta sugerida, frequência)
- [ ] Aprovar e adicionar ao banco (scripts/objeções/knowledge)
- [ ] Rejeitar sugestão
- [ ] Ver histórico de sugestões aprovadas/rejeitadas
- [ ] Buscar sugestões por query ou categoria

**Arquivos a criar:**
- `src/app/pt/admin/wellness/learning-suggestions/page.tsx`
- `src/components/admin/wellness/LearningSuggestionsList.tsx`
- `src/components/admin/wellness/LearningSuggestionCard.tsx`
- `src/components/admin/wellness/LearningSuggestionModal.tsx`

**Design:**
- Usar padrão similar a outras páginas admin
- Cards com informações da sugestão
- Modal para aprovar/rejeitar com opções
- Badge de frequência (quanto mais frequente, mais importante)

---

### 3. ⏭️ Testes do Fluxo Completo

**Status:** ⏭️ Aguardando (usuário disse que vai fazer depois)

**O que precisa ser testado:**
- [ ] Objeções são detectadas corretamente
- [ ] Scripts são buscados do banco
- [ ] Regra fundamental (não mencionar PV) funciona
- [ ] Respostas seguem Premium Light Copy
- [ ] Learning suggestions são criadas quando apropriado

**Guia:** `docs/GUIA-TESTES-NOEL-WELLNESS.md`

---

## 📊 PRIORIDADE

### 🔴 Alta Prioridade (Fazer Agora)

1. **Sistema de Notificações para Admin** ⏭️
   - Importante para que admin saiba quando há novas sugestões
   - Permite revisar e aprovar rapidamente
   - **Tempo estimado:** 2-3 horas

2. **Área Admin Básica** ⏭️
   - Pelo menos listar sugestões pendentes
   - Aprovar/rejeitar sugestões
   - **Tempo estimado:** 4-6 horas

### 🟡 Média Prioridade (Fazer Depois)

3. **Melhorias na Área Admin**
   - Filtros avançados
   - Busca por query
   - Histórico completo
   - Estatísticas

4. **Automação**
   - Auto-aprovar sugestões com frequência muito alta
   - Sugerir categoria automaticamente

### 🟢 Baixa Prioridade (Futuro)

5. **Dashboard de Métricas**
   - Gráficos de sugestões por categoria
   - Taxa de aprovação
   - Queries mais frequentes

---

## 🎯 PLANO DE IMPLEMENTAÇÃO

### Fase 1: Notificações (2-3 horas)
1. Criar `src/lib/wellness-learning-notifications.ts`
2. Implementar função `notifyAdminNewLearningSuggestion()`
3. Integrar no endpoint `/api/wellness/noel`
4. Testar envio de email

### Fase 2: API Endpoints (2-3 horas)
1. Criar endpoint GET para listar sugestões
2. Criar endpoint POST para aprovar
3. Criar endpoint POST para rejeitar
4. Criar endpoint POST para adicionar ao banco
5. Testar todos os endpoints

### Fase 3: Interface Admin (4-6 horas)
1. Criar página `/pt/admin/wellness/learning-suggestions`
2. Criar componente de lista
3. Criar componente de card
4. Criar modal de aprovação/rejeição
5. Integrar com APIs
6. Testar fluxo completo

---

## 📝 CHECKLIST FINAL

### Notificações
- [ ] Função de notificação criada
- [ ] Integrada no endpoint NOEL
- [ ] Email enviado quando sugestão é criada
- [ ] Email enviado apenas para sugestões com `frequency >= 3`
- [ ] Testado envio de email

### API Endpoints
- [ ] GET `/api/admin/wellness/learning-suggestions` (listar)
- [ ] POST `/api/admin/wellness/learning-suggestions/:id/approve`
- [ ] POST `/api/admin/wellness/learning-suggestions/:id/reject`
- [ ] POST `/api/admin/wellness/learning-suggestions/:id/add-to-knowledge`
- [ ] Autenticação admin verificada
- [ ] Testes realizados

### Interface Admin
- [ ] Página criada
- [ ] Lista de sugestões funcionando
- [ ] Filtros funcionando
- [ ] Modal de aprovação/rejeição funcionando
- [ ] Integração com APIs funcionando
- [ ] Design responsivo

---

## 🚀 PRÓXIMA AÇÃO

**Começar pela Fase 1: Sistema de Notificações**

1. Criar arquivo `src/lib/wellness-learning-notifications.ts`
2. Implementar função de notificação
3. Integrar no endpoint NOEL
4. Testar

**Tempo estimado:** 2-3 horas

---

## 📚 REFERÊNCIAS

- **Notificações de Suporte:** `src/lib/support-notifications.ts`
- **Tabela Learning Suggestions:** `migrations/001-create-wellness-system-tables.sql` (linha ~260)
- **Código que cria sugestões:** `src/app/api/wellness/noel/route.ts` (linha ~527)
- **Resend config:** `src/lib/resend.ts`





