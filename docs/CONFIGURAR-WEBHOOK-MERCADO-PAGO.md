# 🔧 Como Configurar Webhook do Mercado Pago Corretamente

## ⚠️ PROBLEMA IDENTIFICADO

O webhook estava configurado com a **mesma URL** tanto em **modo de teste** quanto em **modo de produção**, causando conflito.

---

## ✅ SOLUÇÃO

### **Para Modo de Produção (O que você está usando agora):**

1. **Acesse:** https://www.mercadopago.com.br/developers/panel
2. **Vá em "Webhooks" ou "Notificações"**
3. **Selecione "Modo de produção"**
4. **Configure:**
   - ✅ **URL de produção:** `https://www.ylada.com/api/webhooks/mercado-pago`
   - ✅ **Eventos:** Pagamentos, Planos e assinaturas, etc.

---

### **Para Modo de Teste (O que fazer):**

**OPÇÃO 1: Deixar vazio (Recomendado)**
- Deixe o campo "URL para teste" **VAZIO**
- Não configure nada em modo de teste
- Como você está em produção, não precisa de URL de teste

**OPÇÃO 2: Usar URL diferente (Se quiser testar)**
- Se quiser testar localmente, use: `http://localhost:3000/api/webhooks/mercado-pago`
- Mas isso só funciona se você estiver rodando localmente com ngrok ou similar
- **Recomendação:** Deixe vazio mesmo

**OPÇÃO 3: Desabilitar modo de teste**
- Se possível, desabilite completamente o modo de teste
- Use apenas modo de produção

---

## 🎯 CONFIGURAÇÃO RECOMENDADA

### **Modo de Produção:**
```
URL de produção: https://www.ylada.com/api/webhooks/mercado-pago
Eventos:
  ✅ Pagamentos
  ✅ Alertas de fraude
  ✅ Order (Mercado Pago)
  ✅ Reclamações
  ✅ Contestações
  ✅ Envios (Mercado Pago)
  ✅ Planos e assinaturas
```

### **Modo de Teste:**
```
URL para teste: (DEIXAR VAZIO)
Eventos: (Não precisa configurar)
```

---

## 🔍 POR QUE ISSO CAUSA CONFLITO?

Quando você tem a mesma URL configurada em ambos os modos:
- Mercado Pago pode enviar notificações de teste e produção para a mesma URL
- O sistema pode processar pagamentos de teste como se fossem reais
- Pode causar confusão nos logs
- Pode criar usuários/subscriptions duplicados

---

## ✅ CHECKLIST

- [ ] Modo de produção configurado com URL correta
- [ ] Modo de teste com URL **VAZIA** (ou removida)
- [ ] Eventos selecionados corretamente
- [ ] Webhook está ativo em modo de produção
- [ ] Verificado que não há conflito entre teste e produção

---

## 📝 NOTA IMPORTANTE

O código do webhook já detecta automaticamente se é teste ou produção usando o campo `live_mode` do webhook:

```typescript
const isTest = body.live_mode === false || body.live_mode === 'false'
```

Então, mesmo que uma notificação de teste chegue na URL de produção, o sistema vai detectar e processar corretamente. Mas é melhor evitar isso deixando a URL de teste vazia.

---

**Última atualização:** 11/11/2025

