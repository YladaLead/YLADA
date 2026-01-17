# 📊 Como Configurar o Evento NutriPurchase no Facebook

## ✅ PÁGINA CRIADA

A página `/pt/nutri/pagamento-sucesso` foi criada e está pronta para uso!

---

## 🎯 CONFIGURAR EVENTO NO FACEBOOK

### **Passo 1: Criar Conversão Personalizada**

1. No Facebook Events Manager, vá em **"Conversões personalizadas"**
2. Clique em **"Criar conversão personalizada"**

### **Passo 2: Preencher Campos**

#### **Campo 1: Nome**
- Digite: `NutriPurchase`

#### **Campo 2: Descrição**
- Digite: `Compra confirmada - Nutricionista`

#### **Campo 3: Fonte de dados**
- Selecione: `YLADA NUTRI`

#### **Campo 4: Fonte da ação**
- Selecione: `Site`

#### **Campo 5: Evento**
- Selecione: `Purchase` (se aparecer)
- OU use: `Todo o tráfego da URL` (temporariamente)

#### **Campo 6: Regras (OBRIGATÓRIO)**

**Regra 1:**
- Dropdown 1: `URL`
- Dropdown 2: `contém`
- Campo texto: `/pt/nutri/pagamento-sucesso`

**Regra 2 (OPCIONAL - para diferenciar planos):**
- Clique no botão **"+"** para adicionar segunda regra
- Dropdown 1: `URL`
- Dropdown 2: `contém`
- Campo texto: `gateway=mercadopago` (ou `gateway=stripe`)

**OU criar 2 eventos separados:**

### **Opção A: Evento Único (Recomendado para começar)**

**Regra única:**
- URL contém: `/pt/nutri/pagamento-sucesso`

**Valor de conversão:**
- ✅ Marque a checkbox "Inserir um valor de conversão"
- ⚠️ **Problema:** Não dá para diferenciar valor mensal (R$ 297) vs anual (R$ 2.364)
- **Solução temporária:** Use valor médio ou deixe sem valor

---

### **Opção B: 2 Eventos Separados (Recomendado para otimização)**

#### **Evento 1: NutriPurchase_Monthly**

**Regras:**
1. URL contém: `/pt/nutri/pagamento-sucesso`
2. URL contém: `plan=monthly` (se tiver na URL)

**Valor:**
- ✅ Marque checkbox
- Valor: `297`

#### **Evento 2: NutriPurchase_Annual**

**Regras:**
1. URL contém: `/pt/nutri/pagamento-sucesso`
2. URL contém: `plan=annual` (se tiver na URL)

**Valor:**
- ✅ Marque checkbox
- Valor: `2364`

---

## ⚠️ IMPORTANTE: Query Params

**Problema:** A URL atual é:
```
/pt/nutri/pagamento-sucesso?gateway=mercadopago&payment_id=123
```

**Não tem `plan=monthly` ou `plan=annual` na URL!**

### **Soluções:**

#### **Solução 1: Usar evento único (mais simples)**
- Regra: URL contém `/pt/nutri/pagamento-sucesso`
- Valor: Não configurar (ou usar valor médio)
- **Vantagem:** Funciona imediatamente
- **Desvantagem:** Não diferencia planos

#### **Solução 2: Adicionar parâmetro na URL (recomendado)**
- Modificar webhook/checkout para incluir `plan=monthly` ou `plan=annual` na URL de retorno
- Depois criar 2 eventos separados
- **Vantagem:** Rastreamento preciso por plano
- **Desvantagem:** Requer mudança no código

---

## ✅ RECOMENDAÇÃO FINAL

**Para começar AGORA:**

1. **Criar evento único:**
   - Nome: `NutriPurchase`
   - Regra: URL contém `/pt/nutri/pagamento-sucesso`
   - Valor: **NÃO marcar** (ou usar `297` como padrão)

2. **Depois otimizar:**
   - Adicionar parâmetro `plan` na URL de retorno
   - Criar 2 eventos separados (Monthly e Annual)

---

## 📋 CHECKLIST

- [ ] Página `/pt/nutri/pagamento-sucesso` criada ✅
- [ ] Evento `NutriPurchase` criado no Facebook
- [ ] Regra configurada: URL contém `/pt/nutri/pagamento-sucesso`
- [ ] Testar disparo do evento (fazer pagamento de teste)
- [ ] Verificar no "Eventos de teste" do Facebook

---

**🎯 Pronto! A página está criada e você já pode configurar o evento no Facebook.**

