# 🔔 Sistema de Notificações para Administrador

## 📋 Visão Geral

Sistema completo para notificar o administrador quando o NOEL detecta situações que requerem intervenção manual ou aprovação.

---

## 🎯 Quando o Admin é Notificado

### Situações que Geram Notificação

1. **Escalação de Suporte**
   - Usuário solicita algo que a IA não pode resolver automaticamente
   - Exemplo: "Quero cancelar e ter reembolso"

2. **Ações Sensíveis**
   - Reset de senha realizado (para auditoria)
   - Correção de assinatura realizada
   - Criação de conta após pagamento

3. **Problemas Críticos**
   - Erro ao processar pagamento
   - Falha ao criar conta
   - Problema de sistema detectado

4. **Solicitações Especiais**
   - Mudança de plano customizado
   - Solicitação de recursos extras
   - Problemas não resolvidos automaticamente

5. **Tentativas Suspeitas**
   - Múltiplas tentativas de reset de senha
   - Tentativas de acesso não autorizado
   - Padrões de comportamento suspeito

---

## 📊 Tipos de Notificações

### 1. Por Prioridade

```typescript
'baixa'    - Informações gerais, ações rotineiras
'media'    - Requer atenção, mas não urgente
'alta'     - Requer ação rápida
'urgente'  - Requer ação imediata
```

### 2. Por Tipo

```typescript
'suporte_escalado'      - Usuário precisa de ajuda humana
'acao_sensivel'         - Ação administrativa foi realizada
'erro_sistema'          - Erro técnico detectado
'tentativa_suspeita'    - Comportamento suspeito
'pagamento_problema'    - Problema com pagamento
'conta_criada'          - Nova conta criada automaticamente
'reembolso_solicitado'  - Solicitação de reembolso
'cancelamento'          - Solicitação de cancelamento
```

---

## 🗄️ Estrutura no Banco de Dados

### Tabela: `admin_notificacoes`

```sql
CREATE TABLE admin_notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Tipo e prioridade
  tipo TEXT NOT NULL,
  prioridade TEXT DEFAULT 'media',
  
  -- Conteúdo
  titulo TEXT NOT NULL,
  descricao TEXT,
  dados_extras JSONB, -- Informações adicionais
  
  -- Relacionamentos
  user_id UUID REFERENCES auth.users(id),
  conversa_id UUID REFERENCES suporte_conversas(id),
  
  -- Status
  lida BOOLEAN DEFAULT false,
  resolvida BOOLEAN DEFAULT false,
  resolvida_por UUID REFERENCES auth.users(id),
  resolvida_em TIMESTAMPTZ,
  resolucao TEXT, -- Notas sobre a resolução
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_admin_notificacoes_lida ON admin_notificacoes(lida, prioridade);
CREATE INDEX idx_admin_notificacoes_tipo ON admin_notificacoes(tipo);
CREATE INDEX idx_admin_notificacoes_user ON admin_notificacoes(user_id);
CREATE INDEX idx_admin_notificacoes_created ON admin_notificacoes(created_at DESC);
```

---

## 🎨 Interface do Administrador

### 1. Dashboard de Notificações

**Localização:** `/admin/notificacoes` ou `/admin/suporte`

**Componentes:**

```
┌─────────────────────────────────────────────────────┐
│  🔔 Notificações de Suporte                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Filtros:                                           │
│  [Todas] [Não Lidas] [Urgentes] [Resolvidas]       │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔴 URGENTE - Reembolso Solicitado          │   │
│  │ Usuário: joao@email.com                     │   │
│  │ Valor: R$ 574,80                            │   │
│  │ [Ver Detalhes] [Resolver]                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🟡 MÉDIA - Conta Criada Automaticamente     │   │
│  │ Usuário: maria@email.com                    │   │
│  │ Pagamento: Mercado Pago #123456            │   │
│  │ [Ver Detalhes] [Marcar como Lida]           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🟢 BAIXA - Reset de Senha Realizado        │   │
│  │ Usuário: pedro@email.com                    │   │
│  │ Ação: Senha temporária enviada              │   │
│  │ [Ver Detalhes] [Marcar como Lida]           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. Badge de Notificações (Header)

**Localização:** No header do admin, ao lado do nome

```
┌─────────────────────────────────────┐
│  Admin  🔔 3  [Logout]              │
└─────────────────────────────────────┘
         ↑
    Badge com contador de não lidas
```

### 3. Modal de Detalhes

Ao clicar em uma notificação:

```
┌─────────────────────────────────────────────────────┐
│  Reembolso Solicitado                    [X]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Prioridade: 🔴 URGENTE                            │
│  Tipo: Reembolso                                   │
│  Data: 15/01/2025 14:30                            │
│                                                     │
│  Usuário:                                          │
│  • Nome: João Silva                                │
│  • Email: joao@email.com                           │
│  • Telefone: (11) 99999-9999                       │
│                                                     │
│  Detalhes:                                         │
│  Usuário solicitou reembolso do plano anual.      │
│  Valor: R$ 574,80                                  │
│  Assinatura: #abc123                               │
│                                                     │
│  Conversa Original:                                │
│  "Quero cancelar e ter reembolso"                 │
│                                                     │
│  [Ver Conversa Completa]                           │
│                                                     │
│  Ações:                                            │
│  [Aprovar Reembolso] [Rejeitar] [Solicitar Info]  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔔 Canais de Notificação

### 1. Dashboard (Tempo Real)

**Como funciona:**
- Notificações aparecem automaticamente no dashboard
- Atualização em tempo real (WebSocket ou polling)
- Badge mostra contador de não lidas
- Cores indicam prioridade

**Implementação:**
- Supabase Realtime para atualizações instantâneas
- Ou polling a cada 30 segundos

### 2. Push Notifications (Mobile/Desktop)

**Como funciona:**
- Notificação push quando nova notificação urgente/alta
- Clique na notificação abre o dashboard
- Disponível mesmo quando não está no app

**Implementação:**
- Usar sistema de push já existente
- Filtrar apenas notificações de alta/urgente prioridade

### 3. Email (Opcional)

**Como funciona:**
- Email para notificações urgentes
- Resumo diário de notificações não resolvidas
- Configurável nas preferências do admin

**Quando enviar:**
- Notificações marcadas como 'urgente'
- Múltiplas notificações não lidas (> 5)
- Resumo diário às 9h (se configurado)

---

## 🔧 API de Notificações

### Criar Notificação

```typescript
// POST /api/admin/notificacoes
{
  tipo: 'reembolso_solicitado',
  prioridade: 'urgente',
  titulo: 'Reembolso Solicitado',
  descricao: 'Usuário solicitou reembolso...',
  user_id: 'uuid-do-usuario',
  conversa_id: 'uuid-da-conversa',
  dados_extras: {
    valor: 574.80,
    assinatura_id: 'abc123',
    motivo: 'Solicitação do usuário'
  }
}
```

### Listar Notificações

```typescript
// GET /api/admin/notificacoes
// Query params:
// - lida: boolean (filtrar por lida/não lida)
// - prioridade: string (filtrar por prioridade)
// - tipo: string (filtrar por tipo)
// - limit: number (limite de resultados)
// - offset: number (paginação)

Response:
{
  notificacoes: [...],
  total: 50,
  nao_lidas: 12,
  urgentes: 3
}
```

### Marcar como Lida

```typescript
// PATCH /api/admin/notificacoes/[id]
{
  lida: true
}
```

### Resolver Notificação

```typescript
// PATCH /api/admin/notificacoes/[id]/resolver
{
  resolvida: true,
  resolucao: 'Reembolso aprovado e processado',
  acao_tomada: 'reembolso_aprovado'
}
```

---

## 📱 Exemplo de Notificação Push

```
┌─────────────────────────────────────┐
│  🔴 NOEL Suporte                     │
│                                     │
│  Reembolso Solicitado               │
│  Usuário: joao@email.com            │
│  Valor: R$ 574,80                    │
│                                     │
│  [Abrir] [Mais Tarde]              │
└─────────────────────────────────────┘
```

---

## 🔄 Fluxo Completo

### 1. NOEL Detecta Necessidade de Admin

```
Usuário: "Quero cancelar e ter reembolso"
    ↓
NOEL detecta: Requer aprovação de admin
    ↓
NOEL chama função: notificarAdmin()
    ↓
Sistema cria notificação no banco
    ↓
┌─────────────────────────────────────┐
│  Notificação Criada                 │
│  • Tipo: reembolso_solicitado       │
│  • Prioridade: urgente              │
│  • Status: não lida                 │
└─────────────────────────────────────┘
    ↓
Sistema envia notificações:
├── Dashboard atualiza (tempo real)
├── Push notification (se urgente)
└── Email (se configurado)
    ↓
Admin vê notificação
    ↓
Admin resolve no dashboard
    ↓
Sistema atualiza status: resolvida
    ↓
NOEL informa usuário: "Sua solicitação foi aprovada"
```

---

## ⚙️ Configurações do Admin

### Preferências de Notificação

```typescript
interface AdminPreferences {
  // Canais
  receber_push: boolean
  receber_email: boolean
  receber_dashboard: boolean // sempre true
  
  // Filtros
  apenas_urgentes_push: boolean
  apenas_urgentes_email: boolean
  
  // Resumo
  resumo_diario_email: boolean
  horario_resumo: string // ex: "09:00"
  
  // Auto-resolução
  auto_marcar_lida_apos_resolver: boolean
}
```

---

## 📊 Métricas e Relatórios

### Dashboard de Métricas

```
┌─────────────────────────────────────┐
│  Métricas de Suporte                │
├─────────────────────────────────────┤
│                                     │
│  Notificações Hoje: 15              │
│  Não Resolvidas: 3                  │
│  Urgentes: 1                         │
│                                     │
│  Tempo Médio de Resolução: 2h 30m  │
│  Taxa de Resolução: 80%             │
│                                     │
│  Tipos Mais Comuns:                 │
│  • Reembolsos: 40%                  │
│  • Problemas de Pagamento: 30%       │
│  • Cancelamentos: 20%               │
│  • Outros: 10%                       │
│                                     │
└─────────────────────────────────────┘
```

---

## 🚀 Implementação

### Fase 1: Banco e API
1. Criar tabela `admin_notificacoes`
2. Criar API de notificações
3. Integrar com função `notificarAdmin()`

### Fase 2: Dashboard
1. Criar página `/admin/notificacoes`
2. Listar notificações
3. Filtros e busca
4. Marcar como lida/resolvida

### Fase 3: Notificações em Tempo Real
1. Integrar Supabase Realtime
2. Badge de contador
3. Atualizações automáticas

### Fase 4: Push e Email
1. Push notifications para admin
2. Emails opcionais
3. Configurações de preferências

---

## ✅ Checklist de Implementação

### Backend
- [ ] Criar tabela `admin_notificacoes`
- [ ] Criar API `/api/admin/notificacoes`
- [ ] Implementar função `notificarAdmin()`
- [ ] Integrar com NOEL

### Frontend
- [ ] Criar página `/admin/notificacoes`
- [ ] Componente de lista de notificações
- [ ] Modal de detalhes
- [ ] Badge de contador no header
- [ ] Filtros e busca

### Notificações
- [ ] Supabase Realtime para atualizações
- [ ] Push notifications
- [ ] Emails (opcional)
- [ ] Configurações de preferências

### Métricas
- [ ] Dashboard de métricas
- [ ] Relatórios
- [ ] Analytics

---

**Status:** 📋 Plano completo - Sistema de notificações para admin
