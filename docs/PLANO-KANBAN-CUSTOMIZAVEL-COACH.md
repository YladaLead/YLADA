# 📋 Plano: Kanban Customizável para Coach

## 🎯 Objetivo
Replicar exatamente as mesmas funcionalidades de customização do Kanban da área Nutri para a área Coach.

---

## ✅ O que já existe

- ✅ Página Kanban do Coach: `/pt/coach/clientes/kanban`
- ✅ Tabela `kanban_config` (suporta área 'coach')
- ✅ Componente `KanbanConfigModal.tsx` (pode ser reutilizado)

---

## 📋 Passo a Passo

### 1️⃣ Criar API para Coach
- **Arquivo:** `src/app/api/coach/kanban/config/route.ts`
- **Endpoints:** GET e PUT (idênticos aos de Nutri, mas com `area: 'coach'`)

### 2️⃣ Atualizar Migration SQL
- Adicionar configuração padrão para usuários Coach existentes
- Usar cores roxas (padrão Coach) nas colunas

### 3️⃣ Adaptar Componente (se necessário)
- O `KanbanConfigModal.tsx` já é genérico, mas verificar se precisa de ajustes
- Ou criar wrapper específico para Coach

### 4️⃣ Atualizar Página Kanban do Coach
- Importar `KanbanConfigModal`
- Carregar configuração do usuário
- Renderizar colunas dinamicamente
- Renderizar campos do card baseado na config
- Adicionar botão "⚙️ Customizar"

### 5️⃣ Atualizar ClienteCard do Coach
- Adicionar suporte a campos customizáveis
- Adicionar suporte a ações rápidas customizáveis

---

## 🔄 Diferenças entre Nutri e Coach

- **Cores padrão:** Coach usa roxo (`purple`), Nutri usa azul (`blue`)
- **API route:** `/api/coach/kanban/config` vs `/api/nutri/kanban/config`
- **Área:** `'coach'` vs `'nutri'`
- **Sidebar:** `CoachSidebar` vs `NutriSidebar`

---

## ⏱️ Estimativa
- **Tempo:** 30-45 minutos
- **Arquivos:** 2 novos (API), 2 atualizados (migration, página)

