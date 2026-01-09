# 🚀 RESUMO EXECUTIVO: IMPLEMENTAÇÃO DE RETENÇÃO

## 📋 O QUE VAMOS FAZER

Sistema inteligente que **tenta reter usuários antes do cancelamento** através de ofertas contextualizadas baseadas no motivo.

---

## 🎯 FLUXO COMPLETO

```
Usuário clica "Cancelar Assinatura"
         ↓
   [MODAL PASSO 1]
   Pergunta: "Por que está cancelando?"
   Opções: Não tive tempo | Não entendi | Não vi valor | Esqueci | Outro
         ↓
   [MODAL PASSO 2]
   Mostra oferta baseada no motivo:
   - "Não tive tempo" → Estender trial 7 dias
   - "Não entendi" → Tour guiado pela LYA
   - "Não vi valor" → Mostrar feature-chave
   - "Esqueci" → Adiar cobrança + estender
         ↓
   Usuário escolhe:
   ├─ Aceita oferta → Retido ✅
   └─ Rejeita → Cancela definitivamente ❌
         ↓
   Se cancelou:
   - Cancela no banco
   - Cancela no Mercado Pago (automático)
   - Registra motivo para analytics
```

---

## 📊 ESTRUTURA DE BANCO

### Tabelas novas:

1. **`cancel_attempts`** - Registra tentativas e retenções
2. **`trial_extensions`** - Registra extensões de trial
3. **Campos em `subscriptions`** - Rastreamento de retenção

### Script SQL:
```bash
scripts/migrations/create-cancel-retention-tables.sql
```

---

## 🎨 COMPONENTES FRONTEND

### Novo componente:
- `src/components/nutri/CancelRetentionModal.tsx`

### Modificar:
- `src/app/pt/nutri/(protected)/configuracao/page.tsx`

---

## 🔌 APIs NOVAS

1. **`POST /api/nutri/subscription/cancel-attempt`**
   - Registra motivo do cancelamento
   - Retorna oferta de retenção

2. **`POST /api/nutri/subscription/accept-retention`**
   - Processa aceitação da oferta
   - Executa ação (estender trial, tour, etc)

3. **`POST /api/nutri/subscription/confirm-cancel`**
   - Cancela definitivamente
   - Cancela no Mercado Pago automaticamente

4. **`POST /api/nutri/subscription/extend-trial`**
   - Estende trial por X dias
   - Atualiza data de expiração

---

## 💳 INTEGRAÇÃO MERCADO PAGO

### Nova função:
- `src/lib/mercado-pago-helpers.ts`
  - `cancelMercadoPagoSubscription()`

### Como funciona:
1. Busca `mercado_pago_subscription_id` da subscription
2. Chama API do Mercado Pago para cancelar
3. Se falhar, cancela no banco mesmo assim (com log de erro)

---

## 🧩 LÓGICA DE RETENÇÃO

### Mapeamento Motivo → Oferta:

| Motivo | Oferta | Ação |
|--------|--------|------|
| Não tive tempo | Estender trial | +7 dias grátis |
| Não entendi | Tour guiado | LYA guia em 5min |
| Não vi valor | Mostrar feature | Demo de feature-chave |
| Esqueci trial | Adiar + estender | +7 dias + aviso |
| Muito caro | Pausar | 30 dias pausado |
| Outro | Sem oferta | Cancelar direto |

---

## ✅ CHECKLIST RÁPIDO

### Fase 1: Banco de Dados
- [ ] Executar script SQL
- [ ] Verificar tabelas criadas
- [ ] Testar RLS

### Fase 2: Frontend
- [ ] Criar `CancelRetentionModal.tsx`
- [ ] Integrar na página de configurações
- [ ] Testar fluxo visual

### Fase 3: Backend
- [ ] Criar 4 novas APIs
- [ ] Implementar lógica de retenção
- [ ] Integrar Mercado Pago

### Fase 4: Testes
- [ ] Testar cada motivo → oferta
- [ ] Testar aceitação de retenção
- [ ] Testar cancelamento definitivo
- [ ] Testar integração Mercado Pago

---

## 📈 MÉTRICAS ESPERADAS

- **Taxa de retenção:** 15-30% dos que tentam cancelar
- **Redução de cancelamentos:** 20-40%
- **Dados coletados:** Motivos mais comuns para melhorar produto

---

## ⚠️ PONTOS CRÍTICOS

1. **Botão "Cancelar agora" sempre visível** - Não dificultar saída
2. **Máximo 1 oferta por subscription** - Não ser invasivo
3. **Se Mercado Pago falhar, ainda cancelar no banco** - Não travar usuário
4. **Logs detalhados** - Para revisão manual quando necessário

---

## 🚀 ORDEM DE IMPLEMENTAÇÃO

1. ✅ Banco de dados (SQL)
2. ✅ Componente modal (frontend)
3. ✅ APIs básicas (backend)
4. ✅ Lógica de retenção
5. ✅ Integração Mercado Pago
6. ✅ Testes finais

---

## 📝 PRÓXIMOS PASSOS

1. Executar script SQL no Supabase
2. Criar componente modal
3. Criar primeira API (`cancel-attempt`)
4. Testar fluxo básico
5. Adicionar integração Mercado Pago

---

**Tempo estimado:** 2-3 dias de desenvolvimento
**Complexidade:** Média
**Impacto:** Alto (redução significativa de churn)

