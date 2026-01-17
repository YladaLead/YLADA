# 🔧 Como Instalar e Usar o Facebook Pixel Helper

## 📥 Instalação da Extensão

### **Passo 1: Acessar Chrome Web Store**
1. Abra o Chrome
2. Acesse: https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc
3. Ou pesquise no Google: "Facebook Pixel Helper Chrome"

### **Passo 2: Instalar**
1. Clique no botão **"Adicionar ao Chrome"**
2. Confirme clicando em **"Adicionar extensão"**
3. A extensão será instalada automaticamente

### **Passo 3: Verificar Instalação**
- Você verá um ícone do Facebook na barra de ferramentas do Chrome
- Se não aparecer, clique no ícone de quebra-cabeça (extensões) no canto superior direito

---

## 🧪 Como Usar para Testar os Eventos

### **1. Abrir a Página**
- Acesse: `http://localhost:3000/pt/nutri`

### **2. Verificar o Pixel Helper**
- O ícone do Facebook na barra de ferramentas deve mostrar um número (quantidade de eventos)
- Clique no ícone para ver detalhes

### **3. Verificar no Console**
- Abra o Console (F12 ou Cmd+Option+I)
- Procure por mensagens como:
  - `[Facebook Pixel] Evento customizado: NutriSalesView`
  - `[Facebook Pixel] Pixel não está carregado` (se houver problema)

---

## 🔍 O que Você Deve Ver

### **No Pixel Helper (ícone do Facebook):**
- ✅ **Verde**: Pixel instalado corretamente
- ⚠️ **Amarelo**: Pixel encontrado mas com avisos
- ❌ **Vermelho**: Erro no Pixel

### **No Console do Navegador:**
```
[Facebook Pixel] Evento customizado: NutriSalesView
{
  content_category: "NUTRI",
  page_location: "/pt/nutri"
}
```

---

## ⚠️ Se Não Aparecer Nada

### **Verificar se o Pixel está carregando:**
1. Abra o Console (F12)
2. Digite: `window.fbq`
3. Deve aparecer uma função (não `undefined`)

### **Se aparecer `undefined`:**
- O Pixel não está carregando
- Verifique se o componente `FacebookPixel` está no layout
- Verifique se o Pixel ID está correto

---

## 📱 Alternativa: Verificar no Network Tab

1. Abra o DevTools (F12)
2. Vá na aba **Network** (Rede)
3. Filtre por: `facebook` ou `fbevents`
4. Recarregue a página
5. Deve aparecer uma requisição para `connect.facebook.net`

---

## 🎯 Eventos que Devem Aparecer

### **Página Principal (`/pt/nutri`):**
- `NutriSalesView`

### **Página Descobrir (`/pt/nutri/descobrir`):**
- `NutriDiscoveryView`

### **Checkout Mensal (`/pt/nutri/checkout?plan=monthly`):**
- `NutriCheckout_Monthly`

### **Checkout Anual (`/pt/nutri/checkout?plan=annual`):**
- `NutriCheckout_Annual`

### **Pagamento Sucesso (`/pt/nutri/pagamento-sucesso`):**
- `Purchase` (evento padrão)
- `NutriPurchase` (evento customizado)

---

**Dica:** Se não conseguir instalar a extensão, você ainda pode verificar os eventos no console do navegador!

