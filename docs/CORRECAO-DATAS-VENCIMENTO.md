# 🔧 CORREÇÃO: Datas de Vencimento de Assinaturas

## 📋 Problema Identificado

As assinaturas estão com datas de vencimento **muito no futuro**, indicando erro no cálculo:

- **Coach**: 1774 dias médios (quase 5 anos) ❌
- **Nutra**: 3652 dias (10 anos) ❌
- **Nutri**: 3652 dias (10 anos) ❌
- **Wellness**: 2940 dias (8 anos) ❌

**Valores esperados**:
- Mensal: ~30 dias
- Anual: ~365 dias
- Gratuito: ~365 dias (se configurado para 1 ano)

---

## 🔍 Causa Raiz

### Problema 1: Migrações com Datas Incorretas
Quando subscriptions são migradas, as datas podem estar sendo inseridas incorretamente no formato ou cálculo.

### Problema 2: Cálculo Baseado em Data Errada
O código pode estar calculando a partir de uma data base incorreta (ex: data muito antiga ou futura).

### Problema 3: Falta de Validação
Não há validação para garantir que datas de vencimento sejam razoáveis para o tipo de plano.

---

## ✅ Solução Implementada

### Script SQL de Correção

Criado script `scripts/corrigir-datas-vencimento-assinaturas.sql` que:

1. **Identifica** subscriptions com datas incorretas
2. **Calcula** datas corretas baseadas no tipo de plano
3. **Corrige** as datas automaticamente
4. **Valida** se as correções foram aplicadas

### Regras de Correção

#### Para Planos Mensais
- **Data correta**: `created_at` ou `current_period_start` + 1 mês
- **Validação**: Não deve ter mais de 60 dias de validade

#### Para Planos Anuais
- **Data correta**: `created_at` ou `current_period_start` + 1 ano
- **Validação**: Não deve ter mais de 400 dias de validade

#### Para Planos Gratuitos
- **Data correta**: `created_at` ou `current_period_start` + 1 ano (padrão)
- **Validação**: Não deve ter mais de 400 dias de validade

---

## 🚀 Como Executar a Correção

### Passo 1: Revisar o que será corrigido

Execute no Supabase SQL Editor:

```sql
-- Query 1 do script: Identificar subscriptions com problemas
```

**Revise os resultados** para garantir que são realmente incorretos.

### Passo 2: Ver as novas datas

Execute:

```sql
-- Query 2 do script: Ver datas corrigidas
```

**Confirme** que as novas datas fazem sentido.

### Passo 3: Aplicar correções

Execute:

```sql
-- Query 3 do script: Aplicar UPDATEs
```

**Atenção**: Isso modifica dados reais!

### Passo 4: Verificar correções

Execute:

```sql
-- Query 4 do script: Validar correções
```

**Confirme** que os dias médios estão corretos agora.

---

## 📊 Resultados Esperados Após Correção

### Antes
- Coach: 1774 dias ❌
- Nutra: 3652 dias ❌
- Nutri: 3652 dias ❌
- Wellness: 2940 dias ❌

### Depois (Esperado)
- Mensais: ~30 dias ✅
- Anuais: ~365 dias ✅
- Gratuitos: ~365 dias ✅

---

## 🛡️ Prevenção Futura

### Correções no Código

#### 1. Adicionar Validação na API de Migração

```typescript
// Validar que data de vencimento é razoável
const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

if (plan_type === 'monthly' && daysUntilExpiry > 60) {
  return NextResponse.json(
    { error: 'Data de vencimento inválida para plano mensal (máximo 60 dias)' },
    { status: 400 }
  )
}

if (plan_type === 'annual' && daysUntilExpiry > 400) {
  return NextResponse.json(
    { error: 'Data de vencimento inválida para plano anual (máximo 400 dias)' },
    { status: 400 }
  )
}
```

#### 2. Adicionar Validação na API de Plano Gratuito

```typescript
// Validar expires_in_days
if (expires_in_days && expires_in_days > 400) {
  return NextResponse.json(
    { error: 'Plano gratuito não pode ter mais de 400 dias de validade' },
    { status: 400 }
  )
}
```

#### 3. Adicionar Validação no Webhook do Mercado Pago

```typescript
// Após calcular expiresAt, validar
const daysUntilExpiry = Math.floor((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

if (planType === 'monthly' && daysUntilExpiry > 60) {
  console.error('⚠️ Data de vencimento inválida para mensal:', daysUntilExpiry)
  // Recalcular corretamente
  expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)
}
```

---

## 📝 Checklist de Execução

- [ ] Executar query 1 (identificar problemas)
- [ ] Revisar resultados
- [ ] Executar query 2 (ver novas datas)
- [ ] Confirmar que fazem sentido
- [ ] **Fazer backup do banco** (importante!)
- [ ] Executar query 3 (aplicar correções)
- [ ] Executar query 4 (validar)
- [ ] Verificar na área admin se está correto
- [ ] Implementar validações no código
- [ ] Testar criação de novas subscriptions

---

## ⚠️ Avisos Importantes

1. **Faça backup** antes de executar os UPDATEs
2. **Teste em ambiente de desenvolvimento** primeiro
3. **Revise cuidadosamente** os resultados das queries 1 e 2
4. **Execute em horário de baixo tráfego** se possível
5. **Monitore** após aplicar correções

---

## 🔄 Rollback (Se Necessário)

Se algo der errado, você pode reverter usando:

```sql
-- Restaurar do backup
-- Ou, se tiver guardado as datas antigas:
UPDATE subscriptions
SET current_period_end = [data_antiga],
    updated_at = NOW()
WHERE id = '[subscription_id]';
```

---

## 📞 Suporte

Se tiver dúvidas ou problemas durante a correção, consulte a equipe de desenvolvimento.

---

**Documento criado em**: [Data]
**Status**: ✅ Scripts Prontos - Aguardando Execução

