# ✅ Implementação dos Eventos do Facebook Pixel - Área NUTRI

## 📋 Eventos Implementados

Todos os eventos customizados criados no Facebook Events Manager foram implementados no código:

### 1. **NutriDiscoveryView** ✅
- **Página:** `/pt/nutri/descobrir`
- **Quando dispara:** Ao carregar a página de descoberta
- **Arquivo:** `src/app/pt/nutri/descobrir/page.tsx`
- **Função:** `trackNutriDiscoveryView()`

### 2. **NutriSalesView** ✅
- **Página:** `/pt/nutri`
- **Quando dispara:** Ao carregar a página principal de vendas
- **Arquivo:** `src/app/pt/nutri/page.tsx`
- **Função:** `trackNutriSalesView()`

### 3. **NutriCheckout_Monthly** ✅
- **Página:** `/pt/nutri/checkout?plan=monthly`
- **Quando dispara:** Ao carregar a página de checkout com plano mensal
- **Arquivo:** `src/app/pt/nutri/checkout/page.tsx`
- **Função:** `trackNutriCheckoutMonthly()`
- **Valor:** R$ 297,00

### 4. **NutriCheckout_Annual** ✅
- **Página:** `/pt/nutri/checkout?plan=annual`
- **Quando dispara:** Ao carregar a página de checkout com plano anual
- **Arquivo:** `src/app/pt/nutri/checkout/page.tsx`
- **Função:** `trackNutriCheckoutAnnual()`
- **Valor:** R$ 2.364,00

### 5. **NutriPurchase** ✅
- **Página:** `/pt/nutri/pagamento-sucesso`
- **Quando dispara:** Após confirmação de pagamento (3 segundos após carregar)
- **Arquivo:** `src/app/pt/nutri/pagamento-sucesso/page.tsx`
- **Função:** `trackNutriPurchase()`
- **Valores:**
  - Mensal: R$ 297,00
  - Anual: R$ 2.364,00

---

## 🔧 Arquivos Modificados

1. **`src/lib/facebook-pixel.ts`**
   - Adicionadas funções específicas para eventos NUTRI:
     - `trackNutriDiscoveryView()`
     - `trackNutriSalesView()`
     - `trackNutriCheckoutMonthly()`
     - `trackNutriCheckoutAnnual()`
     - `trackNutriPurchase()`

2. **`src/app/pt/nutri/descobrir/page.tsx`**
   - Adicionado `useEffect` para rastrear visualização

3. **`src/app/pt/nutri/page.tsx`**
   - Adicionado `useEffect` para rastrear visualização

4. **`src/app/pt/nutri/checkout/page.tsx`**
   - Adicionado rastreamento baseado no parâmetro `plan` da URL

5. **`src/app/pt/nutri/pagamento-sucesso/page.tsx`**
   - Adicionado rastreamento de `NutriPurchase` além do evento padrão `Purchase`

---

## 🧪 Como Testar

### 1. **Instalar Facebook Pixel Helper**
- Extensão do Chrome: [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

### 2. **Testar Cada Evento**

#### **NutriDiscoveryView**
1. Acesse: `http://localhost:3000/pt/nutri/descobrir`
2. Abra o console do navegador (F12)
3. Verifique se aparece: `[Facebook Pixel] Evento customizado: NutriDiscoveryView`
4. No Pixel Helper, deve aparecer o evento `NutriDiscoveryView`

#### **NutriSalesView**
1. Acesse: `http://localhost:3000/pt/nutri`
2. Abra o console do navegador (F12)
3. Verifique se aparece: `[Facebook Pixel] Evento customizado: NutriSalesView`
4. No Pixel Helper, deve aparecer o evento `NutriSalesView`

#### **NutriCheckout_Monthly**
1. Acesse: `http://localhost:3000/pt/nutri/checkout?plan=monthly`
2. Abra o console do navegador (F12)
3. Verifique se aparece: `[Facebook Pixel] Evento customizado: NutriCheckout_Monthly`
4. No Pixel Helper, deve aparecer o evento `NutriCheckout_Monthly`

#### **NutriCheckout_Annual**
1. Acesse: `http://localhost:3000/pt/nutri/checkout?plan=annual`
2. Abra o console do navegador (F12)
3. Verifique se aparece: `[Facebook Pixel] Evento customizado: NutriCheckout_Annual`
4. No Pixel Helper, deve aparecer o evento `NutriCheckout_Annual`

#### **NutriPurchase**
1. Acesse: `http://localhost:3000/pt/nutri/pagamento-sucesso?gateway=mercadopago&payment_id=123456&plan=monthly`
2. Aguarde 3 segundos
3. Abra o console do navegador (F12)
4. Verifique se aparecem:
   - `[Facebook Pixel] Evento rastreado: Purchase`
   - `[Facebook Pixel] Evento customizado: NutriPurchase`
5. No Pixel Helper, devem aparecer ambos os eventos

---

## 📊 Verificar no Facebook Events Manager

Após testar, aguarde alguns minutos e verifique no Facebook Events Manager:

1. Acesse: [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Vá em **Conversões personalizadas**
3. Verifique se os eventos estão recebendo dados:
   - Status deve mudar de "Inativo" para "Ativo" (quando receber primeiro evento)
   - "Total de conversões personalizadas" deve aumentar

---

## ⚠️ Importante

- Os eventos só funcionam se o **Facebook Pixel estiver instalado** na aplicação
- Verifique se o componente `FacebookPixel` está incluído no layout
- Os eventos aparecem no console do navegador para debug
- No ambiente de produção, os eventos serão enviados automaticamente para o Facebook

---

## 🚀 Próximos Passos

1. ✅ Testar todos os eventos localmente
2. ✅ Verificar se estão disparando corretamente
3. ✅ Aguardar eventos aparecerem no Facebook Events Manager
4. ✅ Ativar os eventos no Events Manager (quando começarem a receber dados)
5. ✅ Configurar campanhas otimizadas para esses eventos

---

**Data de implementação:** Janeiro 2025
**Status:** ✅ Implementado e pronto para testes

