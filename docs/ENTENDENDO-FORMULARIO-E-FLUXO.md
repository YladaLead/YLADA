# 📋 Entendendo o Formulário e Seu Fluxo de Campanha

## 🎯 SEU FLUXO DE CAMPANHA

Você vai direcionar tráfego para **3 destinos diferentes**:

1. **Página de Descoberta** → Mostra o problema/solução, gera interesse
2. **Página de Vendas** → Apresenta a solução completa, convence a comprar
3. **WhatsApp Direto** → Contato imediato, conversa direta

---

## 📝 O QUE É O "FORMULÁRIO" QUE EU MENCIONEI?

O formulário é aquele que aparece nas **ferramentas** (quizzes, calculadoras) que você oferece.

### **Exemplo Prático:**

Quando alguém acessa uma ferramenta como:
- "Descubra seu Biotipo Nutricional" (quiz)
- "Calculadora de IMC" (calculadora)

**O que acontece:**

1. Pessoa usa a ferramenta (responde quiz ou preenche dados)
2. Sistema calcula o resultado
3. **ANTES de mostrar o resultado**, aparece um formulário pedindo:
   - Nome
   - Email  
   - WhatsApp

4. Pessoa preenche e clica em "Ver Meu Resultado"
5. Sistema salva esses dados (isso é o "Lead")
6. Mostra o resultado
7. Aparece botão "Falar no WhatsApp"

### **Por que esse formulário existe?**

- Para capturar dados de quem está interessado
- Para você ter contato da pessoa depois
- Para o sistema salvar como "lead" no seu dashboard

---

## 🔄 COMO FUNCIONA NO SEU FLUXO

### **CENÁRIO 1: Tráfego para Página de Descoberta**

```
Anúncio no Instagram/Facebook
    ↓
Pessoa clica no anúncio
    ↓
Vai para Página de Descoberta
    ↓
Lê sobre o problema/solução
    ↓
[OPÇÃO A] Clica em botão WhatsApp → Contato direto
[OPÇÃO B] Clica em "Saiba Mais" → Vai para Página de Vendas
[OPÇÃO C] Usa uma ferramenta (quiz) → Preenche formulário → Vê resultado → Clica WhatsApp
```

**Eventos do Pixel aqui:**
- `ViewContent` - Quando visualiza a página
- `Contact` - Quando clica no WhatsApp
- `Lead` - Quando preenche formulário (se usar ferramenta)

---

### **CENÁRIO 2: Tráfego para Página de Vendas**

```
Anúncio no Instagram/Facebook
    ↓
Pessoa clica no anúncio
    ↓
Vai direto para Página de Vendas
    ↓
Lê sobre a solução completa, preços, benefícios
    ↓
[OPÇÃO A] Clica em botão WhatsApp → Contato direto
[OPÇÃO B] Clica em "Assinar Agora" → Processo de compra
```

**Eventos do Pixel aqui:**
- `ViewContent` - Quando visualiza a página
- `Contact` - Quando clica no WhatsApp
- `InitiateCheckout` - Quando clica em "Assinar Agora" (se tiver)

---

### **CENÁRIO 3: Tráfego Direto para WhatsApp**

```
Anúncio no Instagram/Facebook
    ↓
Pessoa clica no anúncio
    ↓
Abre WhatsApp direto (link direto)
    ↓
Conversa com você
```

**Eventos do Pixel aqui:**
- `Contact` - Quando clica no link do WhatsApp

**Nota:** Como é link direto, pode não ter rastreamento do Pixel (depende de como configurar)

---

## 📊 RESUMO: QUAIS EVENTOS VOCÊ PRECISA

### **Eventos Essenciais para Você:**

1. **ViewContent** ⭐⭐⭐⭐⭐
   - Quando alguém visualiza sua página de descoberta OU página de vendas
   - **Por quê:** Para criar audiências de remarketing (pessoas que visitaram mas não compraram)

2. **Contact** ⭐⭐⭐⭐⭐
   - Quando alguém clica no botão WhatsApp
   - **Por quê:** É sua conversão principal! Você quer otimizar campanhas para gerar cliques no WhatsApp

3. **Lead** ⭐⭐⭐⭐
   - Quando alguém preenche o formulário nas ferramentas (quizzes/calculadoras)
   - **Por quê:** Para saber quem demonstrou interesse mas ainda não entrou em contato

### **Eventos Opcionais:**

4. **InitiateCheckout** ⭐⭐⭐
   - Quando alguém clica em "Assinar Agora" ou botão de compra
   - **Por quê:** Para reengajar quem começou mas não completou

5. **Purchase** ⭐⭐⭐
   - Quando alguém completa uma compra/assinatura
   - **Por quê:** Para otimizar campanhas para vendas reais

---

## 🎯 ESTRATÉGIA SIMPLIFICADA PARA VOCÊ

### **Campanha 1: Descoberta (40% do orçamento)**
- **Objetivo:** Gerar interesse
- **Destino:** Página de Descoberta
- **Otimizar para:** ViewContent
- **Ação esperada:** Visualizar página, usar ferramenta, ou clicar WhatsApp

### **Campanha 2: Vendas (30% do orçamento)**
- **Objetivo:** Converter em compra
- **Destino:** Página de Vendas
- **Otimizar para:** Contact (WhatsApp) ou InitiateCheckout
- **Ação esperada:** Clicar WhatsApp ou começar compra

### **Campanha 3: Conversão (30% do orçamento)**
- **Objetivo:** Gerar contatos diretos
- **Destino:** WhatsApp direto OU página com botão WhatsApp
- **Otimizar para:** Contact
- **Ação esperada:** Clicar no WhatsApp

---

## ❓ PERGUNTAS FREQUENTES

### **O formulário é obrigatório?**

Não necessariamente. Depende de como você configurar suas ferramentas. Mas se você quiser capturar leads (dados das pessoas), o formulário ajuda.

### **E se a pessoa não preencher o formulário?**

Ela ainda pode clicar no WhatsApp direto. O formulário é só uma forma de capturar dados antes.

### **O formulário aparece em todas as páginas?**

Não. Só aparece nas **ferramentas** (quizzes, calculadoras) quando a pessoa quer ver o resultado.

### **Posso ter campanha só para WhatsApp direto?**

Sim! Você pode criar anúncio que leva direto para WhatsApp. Nesse caso, o evento `Contact` será disparado quando clicarem.

---

## ✅ RESUMO FINAL

**Seu fluxo:**
- Página Descoberta → Página Vendas → WhatsApp
- OU WhatsApp direto

**Eventos que você precisa rastrear:**
1. **ViewContent** - Visualização de páginas
2. **Contact** - Clique no WhatsApp (MAIS IMPORTANTE)
3. **Lead** - Formulário preenchido (se usar ferramentas)

**Não precisa:**
- ❌ Teste grátis (você não tem)
- ❌ CompleteRegistration (se não tiver cadastro)
- ❌ Purchase (se não vender direto pelo site)

---

**🎯 Foco principal:** Rastrear cliques no WhatsApp (`Contact`) porque essa é sua conversão final!

