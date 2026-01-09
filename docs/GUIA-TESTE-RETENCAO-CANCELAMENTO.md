# 🧪 GUIA DE TESTE: SISTEMA DE RETENÇÃO DE CANCELAMENTO

## 📋 PRÉ-REQUISITOS

### 1. Executar Script SQL no Supabase

1. Acesse o **Supabase Dashboard**: https://app.supabase.com
2. Vá em **SQL Editor**
3. Abra o arquivo: `scripts/migrations/create-cancel-retention-tables.sql`
4. Copie e cole todo o conteúdo
5. Clique em **Run** (ou pressione `Ctrl+Enter`)

**✅ Verificar se as tabelas foram criadas:**
```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('cancel_attempts', 'trial_extensions');

-- Verificar estrutura
\d cancel_attempts
\d trial_extensions
```

---

## 🧪 CENÁRIOS DE TESTE

### **TESTE 1: Fluxo Completo - Usuário Aceita Retenção**

**Objetivo:** Verificar se o sistema oferece retenção e usuário aceita

**Passos:**
1. Faça login como usuário com assinatura ativa
2. Vá em **Configurações** → **Minha Assinatura**
3. Clique em **"Cancelar Assinatura"**
4. **Passo 1:** Selecione **"Não tive tempo de usar"**
5. **Passo 2:** Deve aparecer oferta: *"Estender trial por 7 dias"*
6. Clique em **"Estender trial por 7 dias"**
7. ✅ **Resultado esperado:**
   - Modal fecha
   - Mensagem de sucesso
   - Assinatura continua ativa
   - Data de expiração estendida em 7 dias

**Verificar no banco:**
```sql
-- Verificar cancel_attempt criado
SELECT * FROM cancel_attempts 
ORDER BY created_at DESC LIMIT 1;

-- Verificar trial_extension criado
SELECT * FROM trial_extensions 
ORDER BY created_at DESC LIMIT 1;

-- Verificar subscription atualizada
SELECT id, current_period_end, status 
FROM subscriptions 
WHERE user_id = 'SEU_USER_ID'
ORDER BY created_at DESC LIMIT 1;
```

---

### **TESTE 2: Fluxo Completo - Usuário Rejeita Retenção**

**Objetivo:** Verificar se o cancelamento funciona quando usuário rejeita

**Passos:**
1. Faça login como usuário com assinatura ativa
2. Vá em **Configurações** → **Minha Assinatura**
3. Clique em **"Cancelar Assinatura"**
4. **Passo 1:** Selecione **"Não tive tempo de usar"**
5. **Passo 2:** Clique em **"Cancelar agora"** (rejeitar oferta)
6. **Passo 3:** Clique em **"Confirmar Cancelamento"**
7. ✅ **Resultado esperado:**
   - Modal fecha
   - Mensagem de sucesso
   - Assinatura cancelada no banco
   - Se tiver Mercado Pago, cancelado lá também
   - Redirecionamento para home

**Verificar no banco:**
```sql
-- Verificar cancel_attempt finalizado
SELECT 
  id,
  cancel_reason,
  retention_offered,
  retention_accepted,
  final_action,
  canceled_at
FROM cancel_attempts 
ORDER BY created_at DESC LIMIT 1;

-- Verificar subscription cancelada
SELECT id, status, canceled_at 
FROM subscriptions 
WHERE user_id = 'SEU_USER_ID'
ORDER BY created_at DESC LIMIT 1;
```

---

### **TESTE 3: Diferentes Motivos → Ofertas Diferentes**

**Objetivo:** Verificar se cada motivo retorna oferta correta

| Motivo | Oferta Esperada |
|--------|----------------|
| Não tive tempo | Estender trial 7 dias |
| Não entendi | Tour guiado pela LYA |
| Não vi valor | Mostrar feature |
| Esqueci trial | Adiar + estender trial |
| Muito caro | Pausar 30 dias |
| Encontrei alternativa | Sem oferta (cancelar direto) |
| Outro | Sem oferta (cancelar direto) |

**Testar cada um:**
1. Clicar em "Cancelar Assinatura"
2. Selecionar cada motivo
3. Verificar se oferta aparece correta
4. Não precisa completar o cancelamento (pode fechar modal)

---

### **TESTE 4: Cancelamento com Garantia (7 dias)**

**Objetivo:** Verificar se reembolso é oferecido dentro da garantia

**Passos:**
1. Criar assinatura nova (ou usar uma com menos de 7 dias)
2. Ir em **Configurações** → **Cancelar Assinatura**
3. Selecionar qualquer motivo
4. Na confirmação final, verificar:
   - ✅ Mensagem sobre garantia de 7 dias
   - ✅ Informação sobre reembolso de 100%
   - ✅ Checkbox para solicitar reembolso (se dentro da garantia)

**Verificar no banco:**
```sql
SELECT 
  id,
  within_guarantee,
  request_refund,
  days_since_purchase
FROM cancel_attempts 
WHERE within_guarantee = true
ORDER BY created_at DESC LIMIT 1;
```

---

### **TESTE 5: Cancelamento Automático no Mercado Pago**

**Objetivo:** Verificar se cancela automaticamente no Mercado Pago

**Pré-requisito:** Ter assinatura ativa com `gateway = 'mercadopago'`

**Passos:**
1. Cancelar assinatura (qualquer motivo)
2. Confirmar cancelamento
3. ✅ **Verificar logs do servidor:**
   - Deve aparecer: `🔄 Tentando cancelar no Mercado Pago: [ID]`
   - Se sucesso: `✅ Cancelado no Mercado Pago com sucesso`
   - Se erro: `⚠️ Erro ao cancelar no Mercado Pago: [erro]`

**Verificar no Mercado Pago:**
1. Acesse painel do Mercado Pago
2. Vá em **Assinaturas** ou **Preapprovals**
3. Busque pelo ID da assinatura
4. Status deve estar como **"cancelled"**

**Nota:** Se Mercado Pago falhar, a assinatura ainda deve ser cancelada no banco.

---

### **TESTE 6: Limite de Retenção (1 vez apenas)**

**Objetivo:** Verificar se retenção só é oferecida 1 vez

**Passos:**
1. Tentar cancelar pela primeira vez
2. Aceitar ou rejeitar oferta
3. Tentar cancelar novamente
4. ✅ **Resultado esperado:**
   - Modal aparece normalmente
   - Mas **não oferece retenção novamente**
   - Vai direto para confirmação

**Verificar no banco:**
```sql
-- Verificar quantas vezes retenção foi oferecida
SELECT 
  subscription_id,
  COUNT(*) as tentativas,
  COUNT(CASE WHEN retention_offered IS NOT NULL THEN 1 END) as ofertas_feitas
FROM cancel_attempts
WHERE subscription_id = 'ID_DA_SUBSCRIPTION'
GROUP BY subscription_id;
```

---

## 🔍 VERIFICAÇÕES TÉCNICAS

### **1. Verificar Estrutura das Tabelas**

```sql
-- Verificar cancel_attempts
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'cancel_attempts'
ORDER BY ordinal_position;

-- Verificar trial_extensions
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'trial_extensions'
ORDER BY ordinal_position;
```

### **2. Verificar RLS (Row Level Security)**

```sql
-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('cancel_attempts', 'trial_extensions');
```

### **3. Verificar Índices**

```sql
-- Verificar índices criados
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('cancel_attempts', 'trial_extensions')
ORDER BY tablename, indexname;
```

---

## 🐛 TROUBLESHOOTING

### **Erro: "Tabela cancel_attempts não existe"**
- ✅ Execute o script SQL no Supabase
- ✅ Verifique se está no schema correto (`public`)

### **Erro: "Permission denied"**
- ✅ Verifique RLS (Row Level Security)
- ✅ Verifique se usuário está autenticado
- ✅ Verifique políticas de acesso

### **Erro: "Mercado Pago Access Token não configurado"**
- ✅ Configure variável de ambiente:
  - `MERCADOPAGO_ACCESS_TOKEN` (teste)
  - `MERCADOPAGO_ACCESS_TOKEN_LIVE` (produção)

### **Modal não aparece**
- ✅ Verifique console do navegador (F12)
- ✅ Verifique se `showCancelModal` está `true`
- ✅ Verifique se `subscription` existe

### **Oferta não aparece**
- ✅ Verifique se motivo é válido
- ✅ Verifique se já teve retenção oferecida antes
- ✅ Verifique logs do servidor

---

## 📊 ANALYTICS E MÉTRICAS

### **Ver Taxa de Retenção**

```sql
-- Taxa de retenção geral
SELECT 
  COUNT(*) as total_tentativas,
  COUNT(CASE WHEN retention_accepted THEN 1 END) as retidos,
  ROUND(
    COUNT(CASE WHEN retention_accepted THEN 1 END)::numeric / 
    COUNT(*)::numeric * 100, 
    2
  ) as taxa_retencao_percent
FROM cancel_attempts
WHERE final_action != 'pending';
```

### **Ver Motivos Mais Comuns**

```sql
-- Top 5 motivos de cancelamento
SELECT 
  cancel_reason,
  COUNT(*) as total,
  COUNT(CASE WHEN retention_accepted THEN 1 END) as retidos
FROM cancel_attempts
GROUP BY cancel_reason
ORDER BY total DESC
LIMIT 5;
```

### **Ver Eficácia de Cada Oferta**

```sql
-- Eficácia por tipo de oferta
SELECT 
  retention_offered,
  COUNT(*) as total_ofertas,
  COUNT(CASE WHEN retention_accepted THEN 1 END) as aceitas,
  ROUND(
    COUNT(CASE WHEN retention_accepted THEN 1 END)::numeric / 
    COUNT(*)::numeric * 100, 
    2
  ) as taxa_aceitacao_percent
FROM cancel_attempts
WHERE retention_offered IS NOT NULL
GROUP BY retention_offered
ORDER BY total_ofertas DESC;
```

---

## ✅ CHECKLIST DE TESTE

- [ ] Script SQL executado com sucesso
- [ ] Tabelas `cancel_attempts` e `trial_extensions` criadas
- [ ] RLS configurado corretamente
- [ ] Teste 1: Aceitar retenção ✅
- [ ] Teste 2: Rejeitar retenção ✅
- [ ] Teste 3: Todos os motivos testados ✅
- [ ] Teste 4: Garantia de 7 dias ✅
- [ ] Teste 5: Cancelamento Mercado Pago ✅
- [ ] Teste 6: Limite de retenção ✅
- [ ] Console sem erros
- [ ] Logs do servidor OK
- [ ] Analytics funcionando

---

## 🚀 PRÓXIMOS PASSOS APÓS TESTE

1. **Monitorar métricas** de retenção
2. **Ajustar ofertas** baseado nos dados
3. **Melhorar mensagens** se necessário
4. **Adicionar mais tipos de retenção** se fizer sentido

---

**Dúvidas?** Verifique os logs do servidor e console do navegador (F12).

