# 🚀 PRÓXIMOS PASSOS - FICHA PADRÃO COACH

## ✅ O QUE JÁ FOI FEITO

1. ✅ **Migrations executadas:**
   - Migration 169: Campos de objetivo em `coach_clients`
   - Migration 170: Tabela `coach_client_professional`
   - Migration 171: Tabela `coach_client_health`
   - Migration 172: Tabela `coach_client_food_habits`

2. ✅ **Backend implementado:**
   - Base handler criado
   - Coach handler com suporte JSON completo
   - JSON formatter
   - API unificada `/api/import/process`

## 📋 PRÓXIMOS PASSOS

### 1. ATUALIZAR COMPONENTE DE IMPORTAÇÃO (PRIORIDADE ALTA)
**Arquivo:** `src/components/coach/ImportClientsModal.tsx`

**O que fazer:**
- Adicionar opção de upload de arquivo JSON
- Adicionar opção de colar JSON diretamente
- Detectar automaticamente formato JSON
- Mostrar preview dos dados JSON
- Usar nova API `/api/import/process` com `format: 'json'`

**Tempo estimado:** 2-3 horas

---

### 2. CRIAR INTERFACE PARA NOVOS CAMPOS (PRIORIDADE ALTA)
**Arquivo:** `src/app/pt/coach/clientes/[id]/page.tsx`

**O que fazer:**
- Adicionar seção "Dados Profissionais" na aba Informações Básicas
- Adicionar seção "Saúde Geral" na aba Informações Básicas
- Adicionar seção "Intestino e Digestão" na aba Informações Básicas
- Adicionar seção "Hábitos Alimentares" na aba Informações Básicas
- Expandir seção "Objetivo" com novos campos (peso atual, meta, prazo)

**Tempo estimado:** 4-5 horas

---

### 3. TESTAR IMPORTAÇÃO JSON (PRIORIDADE MÉDIA)
**O que fazer:**
- Testar importação com JSON do ChatGPT
- Validar que todos os dados são salvos corretamente
- Verificar dados nas tabelas relacionadas
- Corrigir bugs se necessário

**Tempo estimado:** 1-2 horas

---

### 4. CRIAR COMPONENTES REUTILIZÁVEIS (PRIORIDADE MÉDIA)
**Arquivos:**
- `src/components/coach/ProfessionalDataSection.tsx`
- `src/components/coach/HealthDataSection.tsx`
- `src/components/coach/DigestionDataSection.tsx`
- `src/components/coach/FoodHabitsSection.tsx`
- `src/components/coach/GoalExpandedSection.tsx`

**Tempo estimado:** 3-4 horas

---

### 5. ATUALIZAR API DE CLIENTES (PRIORIDADE MÉDIA)
**Arquivo:** `src/app/api/coach/clientes/[id]/route.ts`

**O que fazer:**
- Adicionar suporte para salvar dados profissionais
- Adicionar suporte para salvar dados de saúde
- Adicionar suporte para salvar hábitos alimentares
- Atualizar GET para retornar dados relacionados

**Tempo estimado:** 2-3 horas

---

## 🎯 ORDEM RECOMENDADA DE IMPLEMENTAÇÃO

### Fase 1: Importação JSON (RÁPIDO - 2-3h)
1. Atualizar `ImportClientsModal` para aceitar JSON
2. Testar importação com JSON do ChatGPT
3. Validar dados salvos

**Resultado:** Já pode importar clientes via JSON! ✅

### Fase 2: Interface de Cadastro (MÉDIO - 4-5h)
4. Criar componentes para novos campos
5. Adicionar seções na página do cliente
6. Atualizar API para salvar novos dados

**Resultado:** Pode cadastrar/editar todos os campos! ✅

### Fase 3: Melhorias (LONGO - 3-4h)
7. Refatorar componentes
8. Melhorar UX
9. Adicionar validações

**Resultado:** Sistema completo e polido! ✅

---

## 🧪 COMO TESTAR IMPORTAÇÃO JSON AGORA

Mesmo sem atualizar o componente, você pode testar a API diretamente:

```bash
# Exemplo de requisição
curl -X POST http://localhost:3000/api/import/process \
  -H "Content-Type: application/json" \
  -H "Cookie: [seu cookie de sessão]" \
  -d '{
    "format": "json",
    "data": {
      "identification": {
        "name": "Luiza Cunha Souza",
        "birth_date": "1987-09-16",
        ...
      }
    },
    "mappings": null
  }'
```

Ou use o Postman/Insomnia com o JSON completo do ChatGPT.

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Importação JSON
- [ ] Adicionar botão "Importar JSON" no modal
- [ ] Adicionar área para colar JSON
- [ ] Validar JSON antes de processar
- [ ] Mostrar preview dos dados
- [ ] Usar API `/api/import/process` com format: 'json'
- [ ] Tratar erros de validação
- [ ] Mostrar sucesso/erro

### Interface de Campos
- [ ] Componente ProfessionalDataSection
- [ ] Componente HealthDataSection
- [ ] Componente DigestionDataSection
- [ ] Componente FoodHabitsSection
- [ ] Componente GoalExpandedSection
- [ ] Integrar na página do cliente
- [ ] Atualizar API PUT para salvar novos dados

### Testes
- [ ] Testar importação JSON
- [ ] Testar salvamento de novos campos
- [ ] Testar edição de campos existentes
- [ ] Validar dados nas tabelas

---

## 🚀 COMECE AGORA

**Recomendação:** Comece pela **Fase 1 (Importação JSON)** porque:
1. É mais rápido (2-3 horas)
2. Já tem valor imediato (pode importar clientes)
3. Valida toda a estrutura backend
4. Depois pode fazer a interface com calma

Quer que eu comece atualizando o componente `ImportClientsModal` para suportar JSON?
