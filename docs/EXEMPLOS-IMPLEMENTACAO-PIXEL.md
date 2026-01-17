# 💻 Exemplos Práticos de Implementação do Pixel

Este documento contém exemplos práticos de como implementar os eventos do Pixel em diferentes partes do código.

---

## 📦 Instalação Inicial

### 1. Adicionar o Componente do Pixel no Layout Principal

Edite `src/app/layout.tsx`:

```typescript
import FacebookPixel from '@/components/analytics/FacebookPixel'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || ''
  
  return (
    <html lang="pt">
      <head>
        {/* ... outros meta tags ... */}
      </head>
      <body>
        <FacebookPixel pixelId={pixelId} />
        {/* ... resto do conteúdo ... */}
      </body>
    </html>
  )
}
```

### 2. Adicionar Variável de Ambiente

No arquivo `.env.local` (desenvolvimento) e na Vercel (produção):

```env
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=seu_pixel_id_aqui
```

---

## 📄 Exemplo 1: Página de Descoberta

### Arquivo: `src/app/pt/nutri/page.tsx` (ou sua página de descoberta)

```typescript
'use client'

import { useEffect } from 'react'
import { trackViewContent, trackPageScroll } from '@/lib/facebook-pixel'

export default function NutriDiscoveryPage() {
  useEffect(() => {
    // Rastrear visualização de conteúdo
    trackViewContent({
      content_name: 'Página de Descoberta - Área Nutri',
      content_category: 'Nutrição',
      content_ids: ['nutri-discovery'],
    })

    // Rastrear scroll de 50%
    let scroll50Tracked = false
    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100

      if (scrollPercent >= 50 && !scroll50Tracked) {
        scroll50Tracked = true
        trackPageScroll({
          page_name: 'Página de Descoberta - Área Nutri',
          scroll_percentage: 50,
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      {/* Conteúdo da página */}
    </div>
  )
}
```

---

## 📝 Exemplo 2: Formulário de Captura de Lead

### Arquivo: `src/components/wellness/LeadCapturePostResult.tsx`

```typescript
import { trackLead, trackLeadCaptured } from '@/lib/facebook-pixel'

// No handler de envio do formulário
const handleEnviarContato = async (e: React.FormEvent) => {
  e.preventDefault()

  // ... validação do formulário ...

  try {
    const response = await fetch('/api/wellness/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosEnvio),
    })

    const data = await response.json()

    if (data.success) {
      // Rastrear Lead (evento padrão)
      trackLead({
        content_name: 'Formulário de Captura - Quiz Nutricional',
        content_category: 'Lead Generation',
        lead_type: 'form_submission',
      })

      // Rastrear Lead Capturado (evento customizado)
      trackLeadCaptured({
        lead_source: 'discovery_page',
        form_type: 'quiz',
        template_id: config?.id,
      })

      setSucesso(true)
    }
  } catch (error) {
    console.error('Erro:', error)
  }
}
```

---

## 📱 Exemplo 3: Botão WhatsApp

### Arquivo: `src/components/wellness/WellnessCTAButton.tsx`

```typescript
import { trackContact, trackWhatsAppClick } from '@/lib/facebook-pixel'

// Função que rastreia conversão
const rastrearConversao = () => {
  // Evento padrão Contact
  trackContact({
    content_name: 'WhatsApp Click - Área Nutri',
    content_category: 'Direct Contact',
    contact_method: 'whatsapp',
  })

  // Evento customizado WhatsAppClick
  trackWhatsAppClick({
    page_location: 'discovery_page',
    has_lead: !!lead_id, // true se já capturou lead
    lead_source: 'form_submission',
  })
}

// No botão WhatsApp
<a
  href={`https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`}
  target="_blank"
  rel="noopener noreferrer"
  onClick={rastrearConversao} // Adicionar aqui
  className="..."
>
  📱 Falar no WhatsApp
</a>
```

---

## 🎬 Exemplo 4: Quiz Completo

### Arquivo: `src/components/wellness-system/FluxoDiagnostico.tsx`

```typescript
import { trackQuizCompleted } from '@/lib/facebook-pixel'
import { useEffect, useRef } from 'react'

export default function FluxoDiagnostico({ fluxo }: Props) {
  const startTimeRef = useRef<number>(Date.now())

  // Quando quiz for completado
  const handleQuizComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)

    trackQuizCompleted({
      quiz_name: fluxo.nome,
      quiz_type: 'diagnostic',
      time_spent: timeSpent,
    })
  }

  // ... resto do componente ...
}
```

---

## 🛒 Exemplo 5: Página de Checkout/Assinatura

### Arquivo: `src/app/pt/wellness/checkout/page.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import {
  trackViewContent,
  trackInitiateCheckout,
  trackCompleteRegistration,
} from '@/lib/facebook-pixel'

export default function CheckoutPage() {
  useEffect(() => {
    // Rastrear visualização da página de checkout
    trackViewContent({
      content_name: 'Página de Checkout - Teste Grátis',
      content_category: 'Sales',
    })
  }, [])

  // Ao clicar em "Teste Grátis" ou "Assinar Agora"
  const handleStartTrial = () => {
    trackInitiateCheckout({
      content_name: 'Teste Grátis - YLADA',
      content_category: 'Subscription',
      value: 0, // Teste grátis = 0
    })
  }

  // Após registro completo
  const handleRegistrationComplete = async () => {
    try {
      // ... lógica de registro ...

      // Rastrear registro completo
      trackCompleteRegistration({
        content_name: 'Registro Completo - YLADA',
        content_category: 'Account Creation',
        status: true,
      })
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  return (
    <div>
      <button onClick={handleStartTrial}>Teste Grátis</button>
      {/* ... resto do componente ... */}
    </div>
  )
}
```

---

## 💰 Exemplo 6: Compra/Assinatura Paga

### Arquivo: Webhook ou API de pagamento

```typescript
import { trackPurchase } from '@/lib/facebook-pixel'

// No webhook do Stripe/Mercado Pago após pagamento confirmado
export async function handlePaymentSuccess(paymentData: PaymentData) {
  // ... lógica de processamento ...

  // Rastrear compra (se for possível chamar do servidor)
  // NOTA: Normalmente Purchase é rastreado no cliente após redirecionamento
  // Mas você pode usar Conversions API para rastrear do servidor

  trackPurchase({
    content_name: 'Assinatura Mensal - YLADA',
    content_ids: ['plano-mensal'],
    value: paymentData.amount,
    currency: 'BRL',
    num_items: 1,
  })
}
```

**OU no cliente após redirecionamento:**

```typescript
// src/app/pt/wellness/success/page.tsx
'use client'

import { useEffect } from 'react'
import { trackPurchase } from '@/lib/facebook-pixel'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const amount = searchParams.get('amount')
    const plan = searchParams.get('plan')

    if (amount && plan) {
      trackPurchase({
        content_name: `Assinatura ${plan} - YLADA`,
        content_ids: [`plano-${plan}`],
        value: parseFloat(amount),
        currency: 'BRL',
        num_items: 1,
      })
    }
  }, [searchParams])

  return <div>Obrigado pela sua compra!</div>
}
```

---

## 🎥 Exemplo 7: Vídeo Assistido

### Arquivo: Componente de vídeo

```typescript
'use client'

import { trackVideoWatched } from '@/lib/facebook-pixel'
import { useRef, useEffect } from 'react'

export default function VideoPlayer({ videoName, videoDuration }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const watchPercentage = useRef(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const currentPercentage = Math.floor(
        (video.currentTime / video.duration) * 100
      )

      // Rastrear quando assistir 50% do vídeo
      if (currentPercentage >= 50 && watchPercentage.current < 50) {
        watchPercentage.current = 50
        trackVideoWatched({
          video_name: videoName,
          video_duration: videoDuration,
          watch_percentage: 50,
        })
      }

      // Rastrear quando assistir 75% do vídeo
      if (currentPercentage >= 75 && watchPercentage.current < 75) {
        watchPercentage.current = 75
        trackVideoWatched({
          video_name: videoName,
          video_duration: videoDuration,
          watch_percentage: 75,
        })
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [videoName, videoDuration])

  return <video ref={videoRef} src="..." />
}
```

---

## 🔄 Exemplo 8: Hook Customizado para Scroll

### Arquivo: `src/hooks/usePageScroll.ts`

```typescript
import { useEffect, useState } from 'react'
import { trackPageScroll } from '@/lib/facebook-pixel'

export function usePageScroll(pageName: string) {
  const [trackedPercentages, setTrackedPercentages] = useState<Set<number>>(
    new Set()
  )

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.floor(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      )

      // Rastrear marcos de 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100]
      milestones.forEach((milestone) => {
        if (
          scrollPercent >= milestone &&
          !trackedPercentages.has(milestone)
        ) {
          setTrackedPercentages((prev) => new Set([...prev, milestone]))
          trackPageScroll({
            page_name: pageName,
            scroll_percentage: milestone,
          })
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pageName, trackedPercentages])

  return trackedPercentages
}
```

**Uso:**

```typescript
import { usePageScroll } from '@/hooks/usePageScroll'

export default function MyPage() {
  usePageScroll('Página de Descoberta - Área Nutri')
  
  return <div>...</div>
}
```

---

## 🧮 Exemplo 9: Calculadora Usada

### Arquivo: `src/components/wellness/CalculatorResult.tsx`

```typescript
import { trackCalculatorUsed } from '@/lib/facebook-pixel'
import { useEffect } from 'react'

export default function CalculatorResult({ calculatorName }: Props) {
  useEffect(() => {
    // Rastrear quando calculadora é usada (resultado exibido)
    trackCalculatorUsed({
      calculator_name: calculatorName,
      calculator_type: 'health',
    })
  }, [calculatorName])

  return <div>Resultado da calculadora...</div>
}
```

---

## ✅ Checklist de Implementação

### Páginas
- [ ] Página de descoberta (ViewContent + PageScroll)
- [ ] Página de vendas (ViewContent + InitiateCheckout)
- [ ] Página de sucesso (CompleteRegistration ou Purchase)

### Formulários
- [ ] Formulário de captura de lead (Lead + LeadCaptured)
- [ ] Formulário de registro (CompleteRegistration)

### Botões/Ações
- [ ] Botão WhatsApp (Contact + WhatsAppClick)
- [ ] Botão "Teste Grátis" (InitiateCheckout)
- [ ] Botão de assinatura (InitiateCheckout)

### Ferramentas
- [ ] Quiz (QuizCompleted)
- [ ] Calculadora (CalculatorUsed)

### Opcional
- [ ] Vídeos (VideoWatched)
- [ ] Scroll tracking (PageScroll)

---

## 🧪 Como Testar

### 1. Instalar Facebook Pixel Helper

Instale a extensão do Chrome: [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

### 2. Verificar Eventos

1. Abra o site em modo de desenvolvimento
2. Abra o DevTools (F12)
3. Clique na extensão "Facebook Pixel Helper"
4. Execute ações no site (preencher formulário, clicar WhatsApp, etc.)
5. Verifique se os eventos aparecem na extensão

### 3. Verificar no Facebook Events Manager

1. Acesse: https://business.facebook.com/events_manager2
2. Selecione seu Pixel
3. Vá em "Test Events"
4. Execute ações no site
5. Verifique se os eventos aparecem em tempo real

---

## 🚨 Troubleshooting

### Pixel não está disparando?

1. Verifique se o Pixel ID está correto na variável de ambiente
2. Verifique se o componente FacebookPixel está no layout
3. Verifique o console do navegador para erros
4. Use o Facebook Pixel Helper para diagnosticar

### Eventos não aparecem no Events Manager?

1. Aguarde alguns minutos (pode haver delay)
2. Verifique se está no modo de teste (Test Events)
3. Verifique se o Pixel está ativo no Events Manager
4. Verifique se não há bloqueadores de anúncios ativos

### Eventos duplicados?

1. Verifique se não está chamando a função duas vezes
2. Verifique se não há múltiplas instâncias do Pixel
3. Use `useEffect` com dependências corretas para evitar múltiplas chamadas

---

**💡 Dica:** Comece implementando os eventos mais importantes (Lead, Contact, ViewContent) e depois adicione os outros gradualmente.

