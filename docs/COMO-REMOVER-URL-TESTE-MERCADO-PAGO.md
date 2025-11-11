# 🗑️ Como Remover URL de Teste no Mercado Pago

## ⚠️ PROBLEMA

Não conseguiu apagar a URL de teste no Mercado Pago Dashboard.

---

## 🔧 SOLUÇÕES

### **SOLUÇÃO 1: Deixar o Campo Vazio (Mais Simples)**

1. **Acesse:** https://www.mercadopago.com.br/developers/panel
2. **Vá em "Webhooks" ou "Notificações"**
3. **Selecione "Modo de teste"**
4. **No campo "URL para teste":**
   - Selecione todo o texto da URL
   - Delete o texto (deixe completamente vazio)
   - **NÃO** coloque espaços, apenas deixe vazio
5. **Clique em "Salvar" ou "Guardar"**

**Se o campo não permitir deixar vazio:**
- Tente colocar apenas um espaço: ` ` (um espaço)
- Ou coloque: `http://localhost` (URL inválida que não será usada)

---

### **SOLUÇÃO 2: Usar URL Inválida (Se não permitir vazio)**

Se o Mercado Pago não permitir deixar o campo vazio:

1. **No campo "URL para teste", coloque:**
   ```
   http://localhost:3000/api/webhooks/mercado-pago
   ```
   Ou:
   ```
   https://example.com/webhook-test
   ```

2. **Por quê isso funciona:**
   - Essas URLs não existem ou não estão acessíveis
   - O Mercado Pago vai tentar enviar, mas vai falhar
   - Como você está em produção, não vai afetar nada
   - O importante é que seja **diferente** da URL de produção

---

### **SOLUÇÃO 3: Desabilitar Eventos em Modo de Teste**

Se não conseguir remover a URL:

1. **Selecione "Modo de teste"**
2. **Desmarque TODOS os eventos:**
   - ❌ Pagamentos
   - ❌ Alertas de fraude
   - ❌ Order (Mercado Pago)
   - ❌ Reclamações
   - ❌ Contestações
   - ❌ Envios (Mercado Pago)
   - ❌ Planos e assinaturas
3. **Clique em "Salvar"**

**Por quê isso funciona:**
- Se não houver eventos selecionados, o Mercado Pago não vai enviar notificações
- Mesmo que a URL esteja configurada, não vai ser usada

---

### **SOLUÇÃO 4: Ignorar no Código (Já Implementado)**

**Boa notícia:** O código já detecta automaticamente se é teste ou produção!

```typescript
const isTest = body.live_mode === false || body.live_mode === 'false'
```

**O que isso significa:**
- Se uma notificação de teste chegar na URL de produção, o sistema vai detectar
- O sistema vai processar, mas vai marcar como teste
- Não vai criar usuários/subscriptions reais se for teste

**Mas ainda é melhor remover a URL de teste para evitar confusão!**

---

## 🎯 RECOMENDAÇÃO FINAL

**Tente nesta ordem:**

1. ✅ **Primeiro:** Tente deixar o campo vazio (SOLUÇÃO 1)
2. ✅ **Se não funcionar:** Coloque uma URL inválida (SOLUÇÃO 2)
3. ✅ **Se ainda não funcionar:** Desabilite os eventos (SOLUÇÃO 3)
4. ✅ **Como último recurso:** Deixe como está - o código já trata isso (SOLUÇÃO 4)

---

## 📝 CHECKLIST

- [ ] Tentei deixar o campo vazio
- [ ] Se não funcionou, coloquei URL inválida
- [ ] Se ainda não funcionou, desabilitei os eventos
- [ ] Verifiquei que modo de produção está configurado corretamente
- [ ] Salvei as alterações

---

## 🔍 VERIFICAÇÃO

**Para verificar se funcionou:**

1. **Faça um pagamento de teste** (se possível)
2. **Verifique os logs do webhook** no Vercel
3. **Procure por:** `live_mode: false` (teste) ou `live_mode: true` (produção)
4. **Se aparecer `live_mode: false`, o sistema detectou como teste**

---

**Última atualização:** 11/11/2025

