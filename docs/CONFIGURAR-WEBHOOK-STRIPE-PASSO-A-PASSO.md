# 🔗 CONFIGURAR WEBHOOK STRIPE - PASSO A PASSO

## 🎯 O QUE É WEBHOOK?

O webhook é uma URL que o Stripe chama automaticamente quando algo acontece (pagamento aprovado, assinatura cancelada, etc.). É essencial para atualizar o status no seu banco de dados.

---

## 📋 PRÉ-REQUISITOS

Antes de começar, você precisa ter:
- [ ] Conta Stripe criada (BR e/ou US)
- [ ] Aplicação deployada (Vercel, por exemplo)
- [ ] URL de produção: `https://ylada.app` (ou seu domínio)

---

## 🔴 PASSO 1: ACESSAR CONFIGURAÇÕES DE WEBHOOK

### Para Conta Stripe Brasil:

1. **Acesse:** https://dashboard.stripe.com
2. **Certifique-se** de estar na **conta BR** (verifique no canto superior direito)
3. **Clique em:** `Developers` (no menu lateral esquerdo)
4. **Clique em:** `Webhooks` (no submenu)
5. **Você verá:** Lista de webhooks (pode estar vazia se for a primeira vez)

### Para Conta Stripe EUA:

1. **Repita o processo** na conta US
2. **Ou acesse diretamente:** https://dashboard.stripe.com/test/webhooks (modo teste) ou https://dashboard.stripe.com/webhooks (modo produção)

---

## 🔴 PASSO 2: CRIAR NOVO WEBHOOK

### Opção A: Interface Nova (Event Destinations)

1. **Clique no botão:** `Add endpoint` ou "Criar destino de evento" (Create event destination)

2. **Você verá um fluxo de 3 etapas:**
   - Etapa 1: "Selecionar eventos" (Select events) ← **Você está aqui**
   - Etapa 2: "Escolher tipo de destino" (Choose destination type)
   - Etapa 3: "Configure o destino" (Configure destination)

3. **Na etapa 1 - Selecionar eventos:**
   - **Escolha:** "Sua conta" (Your account) - card da esquerda com borda roxa
   - **Versão da API:** Deixe como está (ex: "2025-10-29.clover")
   - **Na aba "Todos os eventos":** Use a busca para encontrar os eventos

### Opção B: Interface Antiga (Webhooks Diretos)

1. **Clique no botão:** `Add endpoint` (ou "Adicionar endpoint" em português)

2. **Você verá um formulário com:**
   - Campo "Endpoint URL"
   - Seção "Events to send"

---

## 🔴 PASSO 3: CONFIGURAR URL DO WEBHOOK

### Para Conta Stripe Brasil:

**URL de Produção:**
```
https://ylada.app/api/webhooks/stripe-br
```

**URL de Teste (se estiver testando localmente):**
```
https://seu-dominio.ngrok.io/api/webhooks/stripe-br
```
*(Use ngrok ou similar para testes locais)*

### Para Conta Stripe EUA:

**URL de Produção:**
```
https://ylada.app/api/webhooks/stripe-us
```

**URL de Teste:**
```
https://seu-dominio.ngrok.io/api/webhooks/stripe-us
```

### ⚠️ IMPORTANTE:

- Use **HTTPS** (não HTTP)
- Use a URL **completa** (com `https://`)
- Não adicione barra no final (`/api/webhooks/stripe-br` ✅, não `/api/webhooks/stripe-br/` ❌)

---

## 🔴 PASSO 4: SELECIONAR EVENTOS

Você precisa selecionar quais eventos o Stripe vai enviar. **Selecione os seguintes:**

### Eventos Obrigatórios:

1. ✅ `checkout.session.completed` - Quando checkout é concluído
2. ✅ `customer.subscription.created` - Quando assinatura é criada
3. ✅ `customer.subscription.updated` - Quando assinatura é atualizada
4. ✅ `customer.subscription.deleted` - Quando assinatura é cancelada
5. ✅ `invoice.payment_succeeded` - Quando pagamento é aprovado
6. ✅ `invoice.payment_failed` - Quando pagamento falha

### Eventos Opcionais (Recomendados):

7. ✅ `payment_intent.succeeded` - Confirmação de pagamento
8. ✅ `payment_intent.payment_failed` - Falha no pagamento

### Como Selecionar (Interface Nova):

1. **Na busca:** Digite o nome do evento (ex: "checkout.session")
2. **Marque cada evento** clicando na checkbox ao lado
3. **Repita para todos os 8 eventos** listados acima
4. **Verifique na aba:** "Eventos selecionados" deve mostrar 8 eventos
5. **Clique em:** "Continuar →" (Continue →) no canto inferior direito

### Como Selecionar (Interface Antiga):

1. **Clique em:** "Select events" ou "Selecionar eventos"
2. **Escolha:** "Select events to listen to" (não use "Send all events")
3. **Marque os eventos** listados acima
4. **Clique em:** "Add events" ou "Adicionar eventos"

---

## 🔴 PASSO 5: CONFIGURAR TIPO DE DESTINO E URL

### Se estiver na Interface Nova (Event Destinations):

1. **Após selecionar eventos, clique em:** "Continuar →"

2. **Na etapa 2 - Escolher tipo de destino:**
   - **Selecione:** "Webhook endpoint" ou "Endpoint de webhook"
   - **Clique em:** "Continuar →"

3. **Na etapa 3 - Configure o destino:**
   - **Endpoint URL:** Cole a URL do webhook:
     - BR: `https://ylada.app/api/webhooks/stripe-br`
     - US: `https://ylada.app/api/webhooks/stripe-us`
   - **Descrição (opcional):** "Webhook YLADA [BR/US]"
   - **Clique em:** "Criar destino" ou "Create destination"

4. **Aguarde alguns segundos** - O Stripe vai criar o webhook

### Se estiver na Interface Antiga:

1. **Cole a URL** no campo "Endpoint URL"
2. **Clique em:** `Add endpoint` (ou "Adicionar endpoint")

---

## 🔴 PASSO 6: COPIAR SIGNING SECRET

1. **Após criar o webhook, você verá a página do webhook criado** com:
   - Status: "Enabled" (habilitado)
   - URL do endpoint
   - Lista de eventos
   - **⚠️ IMPORTANTE: "Signing secret"**

2. **Clique em:** "Reveal" ou "Revelar" ao lado de "Signing secret"

3. **Copie o Signing Secret:**
   - Formato: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **⚠️ COPIE AGORA!** Você só vê uma vez (ou precisa gerar novo)

4. **Salve em local seguro:**
   - Planilha
   - Arquivo de texto
   - Variáveis de ambiente (próximo passo)

---

## 🔴 PASSO 7: ADICIONAR SECRET NAS VARIÁVEIS DE AMBIENTE

### No Vercel (Produção):

1. **Acesse:** https://vercel.com/seu-projeto/settings/environment-variables

2. **Adicione as variáveis:**

   **Para Conta BR:**
   ```
   STRIPE_WEBHOOK_SECRET_BR = whsec_xxxxxxxxxxxxx
   ```

   **Para Conta US:**
   ```
   STRIPE_WEBHOOK_SECRET_US = whsec_xxxxxxxxxxxxx
   ```

3. **Clique em:** "Save"

4. **⚠️ IMPORTANTE:** Faça redeploy da aplicação para as variáveis terem efeito

### No Arquivo Local (.env.local):

Se estiver testando localmente:

```env
# Webhook Secrets
STRIPE_WEBHOOK_SECRET_BR=whsec_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET_US=whsec_xxxxxxxxxxxxx
```

---

## 🔴 PASSO 8: TESTAR WEBHOOK

### Opção A: Testar com Stripe CLI (Recomendado para Desenvolvimento)

1. **Instalar Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Linux
   # Baixar de https://stripe.com/docs/stripe-cli
   ```

2. **Login no Stripe:**
   ```bash
   stripe login
   ```

3. **Testar webhook localmente:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe-br
   ```

4. **Em outro terminal, disparar evento de teste:**
   ```bash
   stripe trigger checkout.session.completed
   ```

### Opção B: Testar com Evento Real

1. **Criar checkout de teste** na sua aplicação
2. **Completar pagamento** com cartão de teste: `4242 4242 4242 4242`
3. **Verificar logs** no Stripe Dashboard → Webhooks → Seu webhook → "Recent deliveries"
4. **Verificar se status é:** `200 OK` (sucesso)

---

## 🔴 PASSO 9: VERIFICAR SE ESTÁ FUNCIONANDO

### No Stripe Dashboard:

1. **Acesse:** Developers → Webhooks → Seu webhook
2. **Clique em:** "Recent deliveries" ou "Entregas recentes"
3. **Você deve ver:**
   - Eventos sendo enviados
   - Status: `200 OK` (verde) = funcionando
   - Status: `500` ou `400` (vermelho) = erro

### Na Sua Aplicação:

1. **Verifique logs** no Vercel ou servidor
2. **Procure por:** Mensagens de webhook processado
3. **Verifique banco de dados:** Assinaturas devem ser criadas automaticamente

---

## ✅ CHECKLIST COMPLETO

### Configuração Inicial:

- [ ] Webhook BR criado com URL correta
- [ ] Webhook US criado com URL correta (se tiver conta US)
- [ ] Eventos selecionados (6 obrigatórios + 2 opcionais)
- [ ] Signing Secret BR copiado
- [ ] Signing Secret US copiado (se aplicável)
- [ ] Secrets adicionados nas variáveis de ambiente
- [ ] Aplicação redeployada (se necessário)

### Testes:

- [ ] Webhook testado com Stripe CLI (desenvolvimento)
- [ ] Webhook testado com checkout real (produção)
- [ ] Status 200 OK nos logs do Stripe
- [ ] Assinatura criada no banco de dados após pagamento
- [ ] Logs da aplicação mostrando webhook processado

---

## 🚨 TROUBLESHOOTING

### Webhook retorna erro 404:

**Problema:** URL do webhook está errada ou rota não existe

**Solução:**
- Verifique se a URL está correta
- Verifique se a rota `/api/webhooks/stripe-br` existe no código
- Verifique se a aplicação está deployada

### Webhook retorna erro 401/403:

**Problema:** Signing secret está errado ou não configurado

**Solução:**
- Verifique se o secret está correto nas variáveis de ambiente
- Verifique se o nome da variável está correto
- Faça redeploy da aplicação

### Webhook retorna erro 500:

**Problema:** Erro no código que processa o webhook

**Solução:**
- Verifique logs da aplicação
- Verifique se o banco de dados está acessível
- Verifique se as variáveis de ambiente estão configuradas

### Eventos não estão chegando:

**Problema:** Eventos não selecionados ou webhook desabilitado

**Solução:**
- Verifique se os eventos estão selecionados
- Verifique se o webhook está "Enabled"
- Teste com Stripe CLI primeiro

---

## 📝 RESUMO RÁPIDO

1. **Acesse:** Stripe Dashboard → Developers → Webhooks
2. **Clique:** "Add endpoint"
3. **Cole URL:** `https://ylada.app/api/webhooks/stripe-br`
4. **Selecione eventos:** 6 obrigatórios + 2 opcionais
5. **Salve e copie:** Signing Secret (`whsec_...`)
6. **Adicione nas variáveis de ambiente:** `STRIPE_WEBHOOK_SECRET_BR`
7. **Teste:** Com Stripe CLI ou checkout real
8. **Verifique:** Logs e banco de dados

---

## 🔗 LINKS ÚTEIS

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Webhooks BR:** https://dashboard.stripe.com/webhooks
- **Webhooks US:** https://dashboard.stripe.com/webhooks
- **Documentação Stripe:** https://stripe.com/docs/webhooks
- **Stripe CLI:** https://stripe.com/docs/stripe-cli

---

**Última atualização:** {{ data atual }}

**Próximos passos:** Após configurar webhook, configure domínio customizado e teste Pix

