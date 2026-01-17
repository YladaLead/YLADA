# 📊 Configuração Completa do Pixel do Facebook - Área NUTRI

## 🎯 Objetivo

Configurar o Pixel do Facebook/Instagram para rastrear todos os eventos importantes do funil de conversão na **área NUTRI**, desde a descoberta até a conversão final (WhatsApp ou página de vendas).

## ⚠️ IMPORTANTE: CONTEXTO

- **Clientes da YLADA:** Nutricionistas (não clientes finais)
- **Área:** NUTRI (separado de NUTRA e COACH)
- **Objetivo:** Captar nutricionistas interessadas em se tornar Nutri-Empresárias
- **Eventos devem ser específicos para área NUTRI** (usar parâmetros `content_category: 'NUTRI'`)

---

## 📋 EVENTOS ESSENCIAIS DO PIXEL

### 🔴 **PRIORIDADE MÁXIMA** (Implementar Primeiro)

#### 1. **PageView** (Automático)
- **O que rastreia:** Visualização de qualquer página
- **Quando disparar:** Automaticamente em todas as páginas
- **Importância:** ⭐⭐⭐⭐⭐
- **Uso:** Base para todos os outros eventos, ajuda o algoritmo a entender o tráfego

#### 2. **ViewContent** (Visualização de Conteúdo)
- **O que rastreia:** Visualização de conteúdo específico (página de descoberta, landing page)
- **Quando disparar:** Quando usuário visualiza página de descoberta ou landing page
- **Importância:** ⭐⭐⭐⭐⭐
- **Uso:** Identifica pessoas interessadas no conteúdo, permite criar audiências de remarketing
- **Parâmetros recomendados:**
```javascript
fbq('track', 'ViewContent', {
  content_name: 'Página de Descoberta - Área NUTRI',
  content_category: 'NUTRI', // ⚠️ Específico para área NUTRI
  content_ids: ['nutri-discovery'],
  value: 0,
  currency: 'BRL'
});
```

#### 3. **Lead** (Captura de Lead)
- **O que rastreia:** Quando alguém preenche um formulário
- **Quando disparar:** Após envio bem-sucedido do formulário de captura
- **Importância:** ⭐⭐⭐⭐⭐
- **Uso:** Evento de conversão principal, permite otimizar campanhas para gerar leads
- **Parâmetros recomendados:**
```javascript
fbq('track', 'Lead', {
  content_name: 'Formulário de Captura - Nutricionista Interessada',
  content_category: 'NUTRI', // ⚠️ Específico para área NUTRI
  value: 0,
  currency: 'BRL',
  lead_type: 'nutricionista_interessada' // Lead de nutricionista, não cliente final
});
```

#### 4. **Contact** (Contato via WhatsApp)
- **O que rastreia:** Clique no botão do WhatsApp
- **Quando disparar:** Quando usuário clica no botão WhatsApp (com ou sem formulário)
- **Importância:** ⭐⭐⭐⭐⭐
- **Uso:** Evento de conversão mais valioso, permite otimizar campanhas para gerar contatos diretos
- **Parâmetros recomendados:**
```javascript
fbq('track', 'Contact', {
  content_name: 'WhatsApp Click - Nutricionista Interessada',
  content_category: 'NUTRI', // ⚠️ Específico para área NUTRI
  value: 0,
  currency: 'BRL',
  contact_method: 'whatsapp',
  lead_type: 'nutricionista' // Especifica que é contato de nutricionista
});
```

---

### 🟡 **PRIORIDADE ALTA** (Implementar em Seguida)

#### 5. **InitiateCheckout** (Início de Checkout)
- **O que rastreia:** Quando usuário inicia processo de checkout/assinatura
- **Quando disparar:** Ao clicar em "Assinar Agora" ou botão de compra
- **Importância:** ⭐⭐⭐⭐
- **Uso:** Identifica pessoas no final do funil, permite criar campanhas de remarketing para quem não completou
- **Parâmetros recomendados:**
```javascript
fbq('track', 'InitiateCheckout', {
  content_name: 'Checkout - Assinatura',
  content_category: 'Subscription',
  value: 59.90, // Valor do plano
  currency: 'BRL'
});
```

#### 6. **CompleteRegistration** (Registro Completo)
- **O que rastreia:** Quando usuário completa cadastro/registro
- **Quando disparar:** Após cadastro bem-sucedido na plataforma
- **Importância:** ⭐⭐⭐⭐
- **Uso:** Identifica conversões completas, permite criar audiências de clientes ativos
- **Parâmetros recomendados:**
```javascript
fbq('track', 'CompleteRegistration', {
  content_name: 'Registro Completo - YLADA',
  content_category: 'Account Creation',
  status: true,
  value: 0,
  currency: 'BRL'
});
```

#### 7. **AddToCart** (Adicionar ao Carrinho)
- **O que rastreia:** Quando usuário adiciona algo ao "carrinho" (se aplicável)
- **Quando disparar:** Se tiver processo de seleção de planos/templates
- **Importância:** ⭐⭐⭐
- **Uso:** Identifica interesse em produtos específicos
- **Parâmetros recomendados:**
```javascript
fbq('track', 'AddToCart', {
  content_name: 'Plano Mensal - YLADA',
  content_ids: ['plano-mensal'],
  content_type: 'product',
  value: 59.90,
  currency: 'BRL'
});
```

---

### 🟢 **PRIORIDADE MÉDIA** (Opcional mas Recomendado)

#### 8. **Search** (Busca)
- **O que rastreia:** Quando usuário faz busca no site
- **Quando disparar:** Se tiver funcionalidade de busca
- **Importância:** ⭐⭐⭐
- **Uso:** Entende o que pessoas estão procurando

#### 9. **AddPaymentInfo** (Adicionar Informação de Pagamento)
- **O que rastreia:** Quando usuário adiciona dados de pagamento
- **Quando disparar:** No formulário de pagamento (se tiver)
- **Importância:** ⭐⭐⭐
- **Uso:** Identifica pessoas muito próximas de converter

#### 10. **Purchase** (Compra)
- **O que rastreia:** Quando usuário completa uma compra/assinatura paga
- **Quando disparar:** Após pagamento confirmado
- **Importância:** ⭐⭐⭐⭐
- **Uso:** Evento de conversão final, permite otimizar para vendas reais
- **Parâmetros recomendados:**
```javascript
fbq('track', 'Purchase', {
  content_name: 'Assinatura Mensal - YLADA',
  content_ids: ['plano-mensal'],
  value: 59.90,
  currency: 'BRL',
  num_items: 1
});
```

---

## 🎯 EVENTOS CUSTOMIZADOS RECOMENDADOS

Além dos eventos padrão, crie eventos customizados para rastrear ações específicas:

### 1. **QuizCompleted** (Quiz Completo)
```javascript
fbq('trackCustom', 'QuizCompleted', {
  quiz_name: 'Descubra seu Biotipo Nutricional',
  quiz_type: 'diagnostic',
  time_spent: 120 // segundos
});
```

### 2. **CalculatorUsed** (Calculadora Usada)
```javascript
fbq('trackCustom', 'CalculatorUsed', {
  calculator_name: 'Calculadora de IMC',
  calculator_type: 'health'
});
```

### 3. **VideoWatched** (Vídeo Assistido)
```javascript
fbq('trackCustom', 'VideoWatched', {
  video_name: 'Como a Dra. Ana conseguiu 291 leads',
  video_duration: 20,
  watch_percentage: 75
});
```

### 4. **PageScroll** (Rolagem de Página)
```javascript
fbq('trackCustom', 'PageScroll', {
  page_name: 'Página de Descoberta',
  scroll_percentage: 50
});
```

---

## 📍 ONDE IMPLEMENTAR CADA EVENTO

### **Página de Descoberta (Landing Page)**

```javascript
// No carregamento da página
fbq('track', 'PageView');
fbq('track', 'ViewContent', {
  content_name: 'Página de Descoberta - Área NUTRI',
  content_category: 'NUTRI' // ⚠️ Específico para área NUTRI
});

// Quando usuário rola 50% da página
window.addEventListener('scroll', function() {
  const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  if (scrollPercent >= 50 && !window.scroll50Tracked) {
    window.scroll50Tracked = true;
    fbq('trackCustom', 'PageScroll', {
      page_name: 'Página de Descoberta',
      scroll_percentage: 50
    });
  }
});
```

### **Formulário de Captura de Lead**

```javascript
// Após envio bem-sucedido do formulário
async function handleFormSubmit(formData) {
  try {
    const response = await fetch('/api/wellness/leads', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Rastrear Lead (Nutricionista interessada)
      fbq('track', 'Lead', {
        content_name: 'Formulário de Captura - Nutricionista',
        content_category: 'NUTRI', // ⚠️ Específico para área NUTRI
        value: 0,
        currency: 'BRL',
        lead_type: 'nutricionista_interessada'
      });
      
      // Rastrear evento customizado
      fbq('trackCustom', 'LeadCaptured', {
        lead_source: 'discovery_page',
        form_type: 'quiz'
      });
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

### **Botão WhatsApp**

```javascript
// No componente WellnessCTAButton ou similar
function handleWhatsAppClick() {
  // Rastrear Contact (Nutricionista interessada)
  fbq('track', 'Contact', {
    content_name: 'WhatsApp Click - Nutricionista',
    content_category: 'NUTRI', // ⚠️ Específico para área NUTRI
    contact_method: 'whatsapp',
    lead_type: 'nutricionista'
  });
  
  // Rastrear evento customizado
  fbq('trackCustom', 'WhatsAppClick', {
    page_location: 'discovery_page',
    has_lead: true // se já capturou lead antes
  });
  
  // Abrir WhatsApp
  window.open(whatsappUrl, '_blank');
}
```

### **Página de Vendas/Checkout**

```javascript
// No carregamento
fbq('track', 'PageView');
fbq('track', 'ViewContent', {
  content_name: 'Página de Vendas - YLADA NUTRI',
  content_category: 'NUTRI' // ⚠️ Específico para área NUTRI
});

// Ao clicar em "Assinar Agora" ou botão de compra
function handleStartPurchase() {
  fbq('track', 'InitiateCheckout', {
    content_name: 'Assinatura - YLADA',
    content_category: 'Subscription',
    value: 59.90, // Valor do plano
    currency: 'BRL'
  });
}

// Após registro completo (se tiver processo de cadastro)
function handleRegistrationComplete() {
  fbq('track', 'CompleteRegistration', {
    content_name: 'Registro Completo',
    content_category: 'Account Creation',
    status: true
  });
}
```

---

## 🚀 ESTRATÉGIAS DE OTIMIZAÇÃO DE CAMPANHAS

### 1. **Estrutura de Campanhas Recomendada**

#### **Campanha 1: Descoberta (Awareness)**
- **Objetivo:** Tráfego ou Alcance
- **Evento de otimização:** ViewContent
- **Destino:** Página de Descoberta
- **Público:** Interesse em nutrição, saúde, bem-estar
- **Orçamento:** 40% do total
- **Objetivo:** Gerar visualizações e interesse inicial

#### **Campanha 2: Vendas (Consideration)**
- **Objetivo:** Conversões
- **Evento de otimização:** Contact (WhatsApp) ou InitiateCheckout
- **Destino:** Página de Vendas
- **Público:** Pessoas que visualizaram conteúdo (remarketing) OU interesse direto
- **Orçamento:** 30% do total
- **Objetivo:** Gerar cliques no WhatsApp ou início de compra

#### **Campanha 3: Conversão Direta (Conversion)**
- **Objetivo:** Conversões
- **Evento de otimização:** Contact (WhatsApp)
- **Destino:** WhatsApp direto OU página com botão WhatsApp
- **Público:** Pessoas que preencheram formulário mas não clicaram no WhatsApp (remarketing)
- **Orçamento:** 30% do total
- **Objetivo:** Gerar contatos diretos via WhatsApp

---

### 2. **Audiências Personalizadas para Remarketing**

#### **Audiência 1: Visualizadores de Conteúdo NUTRI (180 dias)**
- Pessoas que dispararam `ViewContent` com `content_category: 'NUTRI'`
- Tamanho mínimo: 1.000 pessoas
- Uso: Campanhas de remarketing para gerar leads de nutricionistas

#### **Audiência 2: Nutricionistas Interessadas Não Convertidas (30 dias)**
- Pessoas que dispararam `ViewContent` com `content_category: 'NUTRI'` mas NÃO dispararam `Contact`
- Tamanho mínimo: 100 pessoas
- Uso: Campanhas específicas para converter nutricionistas visitantes em contatos via WhatsApp

#### **Audiência 3: Visitantes Recentes (30 dias)**
- Pessoas que visitaram o site mas não preencheram formulário
- Tamanho mínimo: 1.000 pessoas
- Uso: Reengajar visitantes que não converteram

#### **Audiência 4: Nutricionistas que Clicaram WhatsApp NUTRI (90 dias)**
- Pessoas que dispararam `Contact` com `content_category: 'NUTRI'`
- Tamanho mínimo: 100 pessoas
- Uso: Criar audiência lookalike para encontrar nutricionistas similares interessadas

---

### 3. **Lookalike Audiences (Audiências Similares)**

#### **Lookalike 1: Baseado em Contact NUTRI (WhatsApp)**
- **Audiência fonte:** Nutricionistas que clicaram no WhatsApp (área NUTRI)
- **Tamanho:** 1% do país (Brasil)
- **Uso:** Encontrar novas nutricionistas com perfil similar às que já converteram

#### **Lookalike 2: Baseado em Lead NUTRI**
- **Audiência fonte:** Nutricionistas que preencheram formulário (área NUTRI)
- **Tamanho:** 1-3% do país
- **Uso:** Expandir alcance mantendo qualidade (encontrar mais nutricionistas interessadas)

---

### 4. **Otimização de Anúncios**

#### **Testes A/B Recomendados:**

1. **Criativos:**
   - Vídeo vs. Carrossel vs. Imagem única
   - Teste diferentes hooks e CTAs

2. **Copy (Texto):**
   - Foco em problema vs. solução
   - Estatísticas vs. benefícios
   - Urgência vs. valor

3. **Públicos:**
   - Interesses amplos vs. específicos
   - Idades diferentes
   - Gêneros diferentes

4. **Horários:**
   - Manhã vs. Tarde vs. Noite
   - Dias da semana vs. Finais de semana

---

### 5. **Estratégia de Lances (Bidding)**

#### **Para Campanha de Descoberta:**
- **Estratégia:** Custo por Impressão (CPM) ou Custo por Clique (CPC)
- **Objetivo:** Maximizar alcance com menor custo

#### **Para Campanha de Consideração:**
- **Estratégia:** Custo por Lead (CPL)
- **Objetivo:** Gerar leads com melhor custo-benefício

#### **Para Campanha de Conversão:**
- **Estratégia:** Custo por Conversão (CPA) - otimizar para Contact
- **Objetivo:** Maximizar contatos diretos (WhatsApp)

---

### 6. **Placements (Onde Mostrar Anúncios)**

#### **Recomendação Inicial:**
- ✅ **Feed do Instagram** (prioridade)
- ✅ **Stories do Instagram** (prioridade)
- ✅ **Feed do Facebook** (secundário)
- ⚠️ **Reels** (testar)
- ❌ **Audience Network** (desabilitar inicialmente)

#### **Ajuste por Campanha:**
- **Descoberta:** Feed + Stories (maior alcance)
- **Consideração:** Feed (melhor para formulários)
- **Conversão:** Stories (maior engajamento)

---

## 📊 MÉTRICAS PARA ACOMPANHAR

### **Métricas Principais:**

1. **CPM (Custo por 1.000 Impressões)**
   - Meta: < R$ 15,00
   - Ajustar criativos se muito alto

2. **CTR (Taxa de Clique)**
   - Meta: > 2%
   - Ajustar copy/criativo se muito baixo

3. **CPC (Custo por Clique)**
   - Meta: < R$ 1,50
   - Otimizar público se muito alto

4. **CPA (Custo por Contato - WhatsApp)** ⭐ **MAIS IMPORTANTE**
   - Meta: < R$ 25,00
   - Evento mais importante para ROI
   - Mede quantos reais você gasta para cada clique no WhatsApp

5. **Taxa de Conversão (Visualização → WhatsApp)**
   - Meta: > 5-10%
   - Melhorar experiência/CTA se muito baixo
   - Calcula: (Cliques WhatsApp / Visualizações) × 100

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### **Passo 1: Instalar Pixel Base**

Adicione o código do Pixel no `<head>` de todas as páginas:

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'SEU_PIXEL_ID_AQUI');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=SEU_PIXEL_ID_AQUI&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->
```

### **Passo 2: Criar Função Helper**

Crie um arquivo `lib/facebook-pixel.ts`:

```typescript
// lib/facebook-pixel.ts

declare global {
  interface Window {
    fbq: any;
  }
}

export const trackEvent = (eventName: string, params?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

export const trackCustomEvent = (eventName: string, params?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params);
  }
};
```

### **Passo 3: Implementar em Componentes**

Exemplo no componente de formulário:

```typescript
import { trackEvent } from '@/lib/facebook-pixel';

async function handleSubmit(formData) {
  const response = await fetch('/api/wellness/leads', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
  
  if (response.ok) {
    trackEvent('Lead', {
      content_name: 'Formulário de Captura',
      content_category: 'Lead Generation'
    });
  }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Configuração Básica**
- [ ] Instalar Pixel base em todas as páginas
- [ ] Configurar PageView automático
- [ ] Testar se Pixel está disparando (usar Facebook Pixel Helper)

### **Fase 2: Eventos Principais**
- [ ] Implementar ViewContent na página de descoberta
- [ ] Implementar Lead no formulário de captura
- [ ] Implementar Contact no botão WhatsApp
- [ ] Testar todos os eventos

### **Fase 3: Eventos Secundários**
- [ ] Implementar InitiateCheckout
- [ ] Implementar CompleteRegistration
- [ ] Implementar Purchase (se aplicável)

### **Fase 4: Eventos Customizados**
- [ ] Criar eventos customizados (QuizCompleted, etc.)
- [ ] Implementar rastreamento de scroll
- [ ] Implementar rastreamento de tempo na página

### **Fase 5: Otimização**
- [ ] Criar audiências de remarketing
- [ ] Criar lookalike audiences
- [ ] Configurar campanhas otimizadas para eventos
- [ ] Acompanhar métricas e ajustar

---

## 🎯 RESUMO EXECUTIVO

### **Eventos Mais Importantes:**
1. **Contact** (WhatsApp) - ⭐⭐⭐⭐⭐
2. **Lead** (Formulário) - ⭐⭐⭐⭐⭐
3. **ViewContent** (Visualização) - ⭐⭐⭐⭐⭐
4. **InitiateCheckout** - ⭐⭐⭐⭐
5. **CompleteRegistration** - ⭐⭐⭐⭐

### **Estratégia de Campanhas:**
- **40%** Descoberta (ViewContent)
- **30%** Consideração (Lead)
- **30%** Conversão (Contact)

### **Prioridade de Implementação:**
1. Pixel base + PageView
2. ViewContent + Lead + Contact
3. Audiências de remarketing
4. Campanhas otimizadas
5. Lookalike audiences

---

**🚀 Com essa configuração, você terá rastreamento completo do funil e poderá otimizar suas campanhas para gerar mais leads e conversões!**

