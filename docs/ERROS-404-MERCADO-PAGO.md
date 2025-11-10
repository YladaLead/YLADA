# 🔍 ERROS 404 NO CONSOLE DO MERCADO PAGO

## ❓ O que são esses erros?

Os erros 404 que aparecem no console do navegador quando você está na página de checkout do Mercado Pago são **normais** e **não afetam o funcionamento** do pagamento.

### Erros comuns:

1. **`/favicon.ico`** - Ícone da aba do navegador
2. **Recursos do Mercado Pago** (scripts, assets) - Arquivos que o Mercado Pago tenta carregar mas não estão disponíveis no sandbox

---

## ✅ Por que isso acontece?

### **1. Ambiente Sandbox (Teste)**

No ambiente de **sandbox** (teste) do Mercado Pago, alguns recursos podem não estar disponíveis:
- Scripts de segurança
- Assets de background
- Favicon personalizado

Isso é **normal** e **esperado** no ambiente de teste.

### **2. Recursos Secundários**

Esses recursos são **secundários** e não são essenciais para o funcionamento do checkout:
- Não afetam o processamento de pagamento
- Não afetam a segurança
- Não afetam a experiência do usuário

---

## 🔧 O que fazer?

### **Opção 1: Ignorar (Recomendado)**

Esses erros são **normais** e podem ser ignorados. Eles não afetam:
- ✅ Processamento de pagamento
- ✅ Segurança da transação
- ✅ Experiência do usuário
- ✅ Funcionalidade do checkout

### **Opção 2: Filtrar no Console**

Se quiser limpar o console, você pode:
1. Abrir o console (F12)
2. Clicar no ícone de filtro
3. Filtrar por "404" para ocultar esses erros

### **Opção 3: Verificar em Produção**

Em **produção** (com credenciais reais), esses erros geralmente **não aparecem** porque todos os recursos estão disponíveis.

---

## 🚨 Quando se preocupar?

Você **deve** se preocupar apenas se:

1. ❌ O pagamento **não está funcionando**
2. ❌ A página **não está carregando**
3. ❌ Há erros de **JavaScript** (não 404)
4. ❌ O checkout **não redireciona** após o pagamento

Se o pagamento está funcionando normalmente, os erros 404 podem ser **ignorados**.

---

## 📝 Exemplos de Erros 404 Normais

```
Failed to load resource: the server responded with a status of 404 ()
- /favicon.ico
- /jms/lgz/background/...
- /armor.ald0904a0575d8...
```

Esses são **normais** e **não afetam** o funcionamento.

---

## ✅ Checklist

- [ ] Pagamento está funcionando? ✅
- [ ] Página carrega corretamente? ✅
- [ ] Redirecionamento funciona? ✅
- [ ] Webhook está processando? ✅

Se todas as respostas forem **SIM**, os erros 404 podem ser **ignorados**.

---

**Última atualização:** Janeiro 2025

