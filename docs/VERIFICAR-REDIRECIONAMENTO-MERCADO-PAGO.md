# 🔍 VERIFICAR REDIRECIONAMENTO APÓS PAGAMENTO MERCADO PAGO

## ❌ Problema: Não redireciona para página de sucesso

Após o pagamento no Mercado Pago, o usuário não está sendo redirecionado de volta para a página de sucesso.

---

## ✅ SOLUÇÃO APLICADA

### **1. Página de Sucesso Atualizada**

A página `/pt/wellness/pagamento-sucesso` agora aceita:
- ✅ `session_id` (Stripe)
- ✅ `payment_id` (Mercado Pago)
- ✅ `gateway` (mercadopago ou stripe)
- ✅ `status` (pending para pagamentos pendentes)

### **2. URLs de Retorno Configuradas**

```typescript
back_urls: {
  success: `${baseUrl}/pt/wellness/pagamento-sucesso?payment_id={payment_id}&gateway=mercadopago`,
  failure: `${baseUrl}/pt/wellness/checkout?canceled=true`,
  pending: `${baseUrl}/pt/wellness/pagamento-sucesso?payment_id={payment_id}&gateway=mercadopago&status=pending`
}
```

---

## 🔍 COMO VERIFICAR

### **1. Verificar se o Redirecionamento Está Funcionando**

1. Faça um pagamento de teste no Mercado Pago
2. Após o pagamento, verifique a URL:
   - Deve ser: `https://www.ylada.com/pt/wellness/pagamento-sucesso?payment_id=XXXXX&gateway=mercadopago`
   - Se não tiver `payment_id`, o Mercado Pago pode não estar substituindo o placeholder

### **2. Verificar Logs do Mercado Pago**

No painel do Mercado Pago:
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Suas integrações"** → **"Webhooks e notificações"**
3. Verifique os logs de pagamento
4. Veja se o `payment_id` está sendo gerado corretamente

### **3. Verificar Console do Navegador**

Após o pagamento, abra o console do navegador (F12) e verifique:
- Se há erros de JavaScript
- Se a página está carregando corretamente
- Se o `payment_id` está presente na URL

---

## 🔧 TROUBLESHOOTING

### **Problema 1: URL não tem payment_id**

**Sintoma:** URL é `https://www.ylada.com/pt/wellness/pagamento-sucesso?gateway=mercadopago` (sem `payment_id`)

**Causa:** O Mercado Pago pode não estar substituindo o placeholder `{payment_id}`

**Solução:** 
- O Mercado Pago pode enviar o `payment_id` como query parameter diferente
- Verifique se vem como `preference_id` ou outro nome
- A página de sucesso já aceita qualquer ID na URL

### **Problema 2: Página não carrega**

**Sintoma:** Página fica em branco ou mostra erro

**Causa:** Erro de JavaScript ou problema de autenticação

**Solução:**
1. Verifique o console do navegador (F12)
2. Verifique os logs do Vercel
3. Verifique se o usuário está autenticado

### **Problema 3: Redireciona mas mostra erro**

**Sintoma:** Página carrega mas mostra "Sessão de pagamento não encontrada"

**Causa:** O `payment_id` não está sendo capturado corretamente

**Solução:**
1. Verifique a URL completa no navegador
2. Verifique se o `payment_id` está presente
3. Se não estiver, o Mercado Pago pode estar usando outro nome de parâmetro

---

## 📝 NOTAS IMPORTANTES

1. **Placeholder {payment_id}**: O Mercado Pago pode ou não substituir automaticamente. Se não substituir, precisamos capturar de outra forma.

2. **Webhook é Primário**: O webhook do Mercado Pago é a forma mais confiável de processar pagamentos. O redirecionamento é apenas para UX.

3. **Pagamentos Pendentes**: Pagamentos via Boleto ou PIX podem ficar pendentes. A página de sucesso já trata isso.

---

## 🧪 TESTE COMPLETO

1. **Fazer pagamento de teste** no Mercado Pago
2. **Verificar URL** após redirecionamento
3. **Verificar console** do navegador
4. **Verificar logs** do Vercel
5. **Verificar webhook** foi processado
6. **Verificar banco** se assinatura foi criada

---

**Última atualização:** Janeiro 2025

