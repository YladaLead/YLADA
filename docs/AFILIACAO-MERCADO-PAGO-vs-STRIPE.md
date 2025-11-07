# 💰 PROGRAMA DE AFILIAÇÃO: MERCADO PAGO vs STRIPE

## 🎯 RESUMO EXECUTIVO

### Mercado Pago
- ❌ **NÃO tem programa de afiliação nativo** (como Stripe Connect)
- ✅ **Pode ser implementado de forma customizada**
- ✅ Oferece APIs para criar sistema próprio
- ⚠️ Requer desenvolvimento customizado

### Stripe
- ✅ **Tem Stripe Connect nativo** (programa de afiliação pronto)
- ✅ Divisão automática de pagamentos
- ✅ Onboarding de afiliados integrado
- ✅ Dashboard para afiliados

---

## 📊 COMPARAÇÃO DETALHADA

| Recurso | Mercado Pago | Stripe Connect |
|---------|--------------|----------------|
| **Programa Nativo** | ❌ Não | ✅ Sim |
| **Divisão Automática** | ⚠️ Customizado | ✅ Automático |
| **Onboarding Afiliados** | ⚠️ Você faz | ✅ Integrado |
| **Dashboard Afiliado** | ⚠️ Você cria | ✅ Pronto |
| **Comissões Automáticas** | ⚠️ Você implementa | ✅ Automático |
| **Complexidade** | 🔴 Alta | 🟢 Baixa |
| **Tempo de Desenvolvimento** | 🔴 2-4 semanas | 🟢 1 semana |

---

## 🔧 COMO IMPLEMENTAR COM MERCADO PAGO

### Opção 1: Sistema Customizado (Recomendado)

#### Como Funciona:
1. **Criar sistema próprio de afiliados**
   - Tabela de afiliados no seu banco
   - Códigos de referência
   - Rastreamento de conversões

2. **Processar pagamentos normalmente**
   - Cliente paga via Mercado Pago
   - Você recebe o pagamento completo

3. **Calcular e pagar comissões manualmente**
   - Identificar qual afiliado trouxe o cliente
   - Calcular comissão (ex: 20%)
   - Fazer transferência para o afiliado

#### Vantagens:
- ✅ Controle total sobre o sistema
- ✅ Flexibilidade nas regras
- ✅ Sem taxas adicionais do gateway

#### Desvantagens:
- ❌ Você precisa desenvolver tudo
- ❌ Processo manual de pagamento de comissões
- ❌ Mais complexo de manter

---

### Opção 2: Usar Mercado Pago + Stripe Connect (Híbrido)

#### Como Funciona:
1. **Brasil**: Mercado Pago para pagamentos
2. **Internacional**: Stripe para pagamentos
3. **Afiliados**: Stripe Connect para gerenciar comissões

#### Vantagens:
- ✅ Melhor dos dois mundos
- ✅ Afiliação nativa (Stripe Connect)
- ✅ Pagamentos otimizados por região

#### Desvantagens:
- ⚠️ Mais complexo (dois gateways)
- ⚠️ Afiliados precisam conta Stripe (mesmo para BR)

---

## 💡 RECOMENDAÇÃO

### Para Brasil (Mercado Pago):
**Implementar sistema customizado de afiliação**

#### Estrutura Necessária:

```sql
-- Tabela de afiliados
CREATE TABLE affiliates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  referral_code VARCHAR(50) UNIQUE,
  commission_rate DECIMAL(5,2) DEFAULT 20.00,
  status VARCHAR(20) DEFAULT 'active',
  total_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP
);

-- Tabela de conversões
CREATE TABLE affiliate_conversions (
  id UUID PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  commission_amount DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP
);
```

#### Fluxo de Implementação:

1. **Cliente usa código de referência**
   ```
   https://ylada.app/wellness/checkout?ref=CODIGO123
   ```

2. **Sistema rastreia o código**
   ```typescript
   const referralCode = searchParams.get('ref')
   // Salvar no cookie/localStorage
   // Associar ao pagamento quando completar
   ```

3. **Após pagamento confirmado**
   ```typescript
   // Calcular comissão
   const commission = paymentAmount * 0.20 // 20%
   
   // Criar registro de conversão
   await createAffiliateConversion({
     affiliateId: affiliate.id,
     userId: newUser.id,
     subscriptionId: subscription.id,
     commissionAmount: commission,
     status: 'pending'
   })
   ```

4. **Pagar comissão (manual ou automático)**
   ```typescript
   // Opção 1: Transferência manual via Mercado Pago
   // Opção 2: PIX direto para afiliado
   // Opção 3: Crédito na conta do afiliado (sistema interno)
   ```

---

## 🚀 IMPLEMENTAÇÃO SUGERIDA

### Fase 1: Sistema Básico (1-2 semanas)
- [ ] Criar tabelas de afiliados
- [ ] Sistema de códigos de referência
- [ ] Rastreamento de conversões
- [ ] Dashboard básico para afiliados

### Fase 2: Automação (1 semana)
- [ ] Cálculo automático de comissões
- [ ] Notificações para afiliados
- [ ] Relatórios de performance

### Fase 3: Pagamentos (1 semana)
- [ ] Integração com Mercado Pago para transferências
- [ ] Ou sistema de crédito interno
- [ ] Histórico de pagamentos

---

## 📋 ALTERNATIVA: STRIPE CONNECT (Para Internacional)

Se você quiser afiliação nativa para clientes internacionais:

### Como Funciona:
1. **Cliente internacional paga via Stripe**
2. **Stripe Connect divide automaticamente**
   - Você recebe sua parte
   - Afiliado recebe comissão automaticamente
3. **Dashboard nativo do Stripe para afiliados**

### Vantagens:
- ✅ Zero desenvolvimento
- ✅ Pagamentos automáticos
- ✅ Dashboard pronto
- ✅ Compliance automático

### Desvantagens:
- ⚠️ Só funciona para pagamentos Stripe (internacional)
- ⚠️ Afiliados BR precisariam conta Stripe também

---

## 🎯 DECISÃO RECOMENDADA

### Para Brasil (Mercado Pago):
✅ **Sistema customizado de afiliação**
- Desenvolver sistema próprio
- Usar Mercado Pago apenas para receber pagamentos
- Gerenciar comissões internamente

### Para Internacional (Stripe):
✅ **Stripe Connect**
- Usar afiliação nativa do Stripe
- Divisão automática de pagamentos
- Dashboard pronto

---

## 💰 CUSTOS

### Mercado Pago (Customizado):
- Taxa de pagamento: ~4.99%
- Taxa de transferência para afiliado: ~1.99% (se usar PIX)
- **Sem custos adicionais de afiliação**

### Stripe Connect:
- Taxa de pagamento: ~5.99%
- Taxa adicional Connect: 0% (gratuito)
- **Sem custos adicionais de afiliação**

---

## ✅ CONCLUSÃO

**Sim, você consegue fazer programa de afiliação com Mercado Pago**, mas:

1. **Não é nativo** - Precisa desenvolver sistema próprio
2. **É viável** - Mercado Pago oferece APIs para isso
3. **Requer trabalho** - Mais desenvolvimento que Stripe Connect

**Recomendação:**
- **Brasil**: Sistema customizado com Mercado Pago
- **Internacional**: Stripe Connect (nativo)
- **Ou**: Sistema customizado unificado (mais trabalho, mas mais controle)

---

## 📞 PRÓXIMOS PASSOS

Se quiser implementar afiliação com Mercado Pago:

1. **Definir regras de comissão**
   - Percentual fixo ou variável?
   - Por nível de afiliado?
   - Por tipo de plano?

2. **Criar estrutura no banco**
   - Tabelas de afiliados
   - Tabelas de conversões
   - Histórico de pagamentos

3. **Desenvolver sistema**
   - Códigos de referência
   - Rastreamento
   - Dashboard
   - Pagamento de comissões

**Quer que eu comece a implementar o sistema de afiliação customizado?**

