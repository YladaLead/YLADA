/**
 * Facebook Pixel Helper
 * Funções utilitárias para rastrear eventos do Facebook Pixel
 */

declare global {
  interface Window {
    fbq: (
      action: 'track' | 'trackCustom' | 'init',
      eventName: string,
      params?: Record<string, any>
    ) => void;
  }
}

/**
 * Verifica se o Pixel está carregado
 */
export const isPixelLoaded = (): boolean => {
  const loaded = typeof window !== 'undefined' && typeof window.fbq === 'function';
  if (!loaded && typeof window !== 'undefined') {
    console.warn('[Facebook Pixel] Pixel não está carregado. window.fbq:', typeof window.fbq);
  }
  return loaded;
};

/**
 * Rastreia evento padrão do Facebook Pixel
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
): void => {
  if (isPixelLoaded()) {
    try {
      window.fbq('track', eventName, params || {});
      console.log(`[Facebook Pixel] Evento rastreado: ${eventName}`, params);
    } catch (error) {
      console.error(`[Facebook Pixel] Erro ao rastrear ${eventName}:`, error);
    }
  } else {
    console.warn('[Facebook Pixel] Pixel não está carregado');
  }
};

/**
 * Rastreia evento customizado do Facebook Pixel
 */
export const trackCustomEvent = (
  eventName: string,
  params?: Record<string, any>
): void => {
  if (isPixelLoaded()) {
    try {
      window.fbq('trackCustom', eventName, params || {});
      console.log(`[Facebook Pixel] Evento customizado: ${eventName}`, params);
    } catch (error) {
      console.error(
        `[Facebook Pixel] Erro ao rastrear evento customizado ${eventName}:`,
        error
      );
    }
  } else {
    console.warn('[Facebook Pixel] Pixel não está carregado');
  }
};

/**
 * Eventos padrão do Facebook Pixel
 */

// ViewContent - Visualização de conteúdo
export const trackViewContent = (params?: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
}) => {
  trackEvent('ViewContent', {
    content_name: params?.content_name || 'Conteúdo Visualizado',
    content_category: params?.content_category || 'Geral',
    content_ids: params?.content_ids || [],
    value: params?.value || 0,
    currency: params?.currency || 'BRL',
    ...params,
  });
};

// Lead - Captura de lead
export const trackLead = (params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  lead_type?: string;
}) => {
  trackEvent('Lead', {
    content_name: params?.content_name || 'Lead Capturado',
    content_category: params?.content_category || 'Lead Generation',
    value: params?.value || 0,
    currency: params?.currency || 'BRL',
    lead_type: params?.lead_type || 'form_submission',
    ...params,
  });
};

// Contact - Contato via WhatsApp
export const trackContact = (params?: {
  content_name?: string;
  content_category?: string;
  contact_method?: string;
  value?: number;
  currency?: string;
}) => {
  trackEvent('Contact', {
    content_name: params?.content_name || 'Contato via WhatsApp',
    content_category: params?.content_category || 'Direct Contact',
    contact_method: params?.contact_method || 'whatsapp',
    value: params?.value || 0,
    currency: params?.currency || 'BRL',
    ...params,
  });
};

// InitiateCheckout - Início de checkout
export const trackInitiateCheckout = (params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) => {
  trackEvent('InitiateCheckout', {
    content_name: params?.content_name || 'Início de Checkout',
    content_category: params?.content_category || 'Subscription',
    value: params?.value || 0,
    currency: params?.currency || 'BRL',
    ...params,
  });
};

// CompleteRegistration - Registro completo
export const trackCompleteRegistration = (params?: {
  content_name?: string;
  content_category?: string;
  status?: boolean;
  value?: number;
  currency?: string;
}) => {
  trackEvent('CompleteRegistration', {
    content_name: params?.content_name || 'Registro Completo',
    content_category: params?.content_category || 'Account Creation',
    status: params?.status !== undefined ? params.status : true,
    value: params?.value || 0,
    currency: params?.currency || 'BRL',
    ...params,
  });
};

// Purchase - Compra/Assinatura
export const trackPurchase = (params?: {
  content_name?: string;
  content_ids?: string[];
  value: number;
  currency?: string;
  num_items?: number;
  content_category?: string;
}) => {
  trackEvent('Purchase', {
    content_name: params?.content_name || 'Compra Realizada',
    content_ids: params?.content_ids || [],
    value: params.value,
    currency: params?.currency || 'BRL',
    num_items: params?.num_items || 1,
    content_category: params?.content_category,
    ...params,
  });
};

/**
 * Eventos customizados específicos para YLADA
 */

// QuizCompleted - Quiz completo
export const trackQuizCompleted = (params: {
  quiz_name: string;
  quiz_type?: string;
  time_spent?: number; // em segundos
}) => {
  trackCustomEvent('QuizCompleted', {
    quiz_name: params.quiz_name,
    quiz_type: params.quiz_type || 'diagnostic',
    time_spent: params.time_spent || 0,
  });
};

// CalculatorUsed - Calculadora usada
export const trackCalculatorUsed = (params: {
  calculator_name: string;
  calculator_type?: string;
}) => {
  trackCustomEvent('CalculatorUsed', {
    calculator_name: params.calculator_name,
    calculator_type: params.calculator_type || 'health',
  });
};

// WhatsAppClick - Clique no WhatsApp
export const trackWhatsAppClick = (params?: {
  page_location?: string;
  has_lead?: boolean;
  lead_source?: string;
}) => {
  trackCustomEvent('WhatsAppClick', {
    page_location: params?.page_location || 'unknown',
    has_lead: params?.has_lead || false,
    lead_source: params?.lead_source || 'direct',
  });
};

// PageScroll - Rolagem de página
export const trackPageScroll = (params: {
  page_name: string;
  scroll_percentage: number;
}) => {
  trackCustomEvent('PageScroll', {
    page_name: params.page_name,
    scroll_percentage: params.scroll_percentage,
  });
};

// VideoWatched - Vídeo assistido
export const trackVideoWatched = (params: {
  video_name: string;
  video_duration?: number;
  watch_percentage?: number;
}) => {
  trackCustomEvent('VideoWatched', {
    video_name: params.video_name,
    video_duration: params.video_duration || 0,
    watch_percentage: params.watch_percentage || 0,
  });
};

// LeadCaptured - Lead capturado (evento customizado adicional)
export const trackLeadCaptured = (params: {
  lead_source: string;
  form_type?: string;
  template_id?: string;
}) => {
  trackCustomEvent('LeadCaptured', {
    lead_source: params.lead_source,
    form_type: params.form_type || 'form',
    template_id: params.template_id,
  });
};

/**
 * Eventos customizados específicos para área NUTRI
 */

// NutriDiscoveryView - Visualização da página de descoberta
export const trackNutriDiscoveryView = () => {
  console.log('[Facebook Pixel] Tentando rastrear NutriDiscoveryView...');
  
  // Aguardar Pixel carregar antes de disparar
  let attempts = 0;
  const maxAttempts = 10; // 5 segundos no total
  
  const tryTrack = () => {
    attempts++;
    console.log(`[Facebook Pixel] Tentativa ${attempts} de rastrear NutriDiscoveryView...`);
    
    if (isPixelLoaded()) {
      console.log('[Facebook Pixel] ✅ Pixel carregado! Disparando NutriDiscoveryView...');
      trackCustomEvent('NutriDiscoveryView', {
        content_category: 'NUTRI',
        page_location: '/pt/nutri/descobrir',
      });
    } else if (attempts < maxAttempts) {
      // Tentar novamente após 500ms se Pixel ainda não carregou
      setTimeout(tryTrack, 500);
    } else {
      console.error('[Facebook Pixel] ❌ Pixel não carregou após 5 segundos. Verifique se o componente FacebookPixel está no layout.');
    }
  };
  
  // Aguardar um pouco para o Pixel ter tempo de carregar
  setTimeout(tryTrack, 100);
};

// NutriSalesView - Visualização da página de vendas
export const trackNutriSalesView = () => {
  console.log('[Facebook Pixel] Tentando rastrear NutriSalesView...');
  
  // Aguardar Pixel carregar antes de disparar
  let attempts = 0;
  const maxAttempts = 10; // 5 segundos no total
  
  const tryTrack = () => {
    attempts++;
    console.log(`[Facebook Pixel] Tentativa ${attempts} de rastrear NutriSalesView...`);
    
    if (isPixelLoaded()) {
      console.log('[Facebook Pixel] ✅ Pixel carregado! Disparando NutriSalesView...');
      trackCustomEvent('NutriSalesView', {
        content_category: 'NUTRI',
        page_location: '/pt/nutri',
      });
    } else if (attempts < maxAttempts) {
      // Tentar novamente após 500ms se Pixel ainda não carregou
      setTimeout(tryTrack, 500);
    } else {
      console.error('[Facebook Pixel] ❌ Pixel não carregou após 5 segundos. Verifique se o componente FacebookPixel está no layout.');
    }
  };
  
  // Aguardar um pouco para o Pixel ter tempo de carregar
  setTimeout(tryTrack, 100);
};

// NutriCheckout_Monthly - Início de checkout mensal
export const trackNutriCheckoutMonthly = () => {
  console.log('[Facebook Pixel] Tentando rastrear NutriCheckout_Monthly...');
  
  // Aguardar Pixel carregar antes de disparar
  let attempts = 0;
  const maxAttempts = 10; // 5 segundos no total
  
  const tryTrack = () => {
    attempts++;
    console.log(`[Facebook Pixel] Tentativa ${attempts} de rastrear NutriCheckout_Monthly...`);
    
    if (isPixelLoaded()) {
      console.log('[Facebook Pixel] ✅ Pixel carregado! Disparando NutriCheckout_Monthly...');
      trackCustomEvent('NutriCheckout_Monthly', {
        content_category: 'NUTRI',
        content_name: 'Checkout Plano Mensal',
        value: 197,
        currency: 'BRL',
        page_location: '/pt/nutri/checkout?plan=monthly',
      });
    } else if (attempts < maxAttempts) {
      // Tentar novamente após 500ms se Pixel ainda não carregou
      setTimeout(tryTrack, 500);
    } else {
      console.error('[Facebook Pixel] ❌ Pixel não carregou após 5 segundos. Verifique se o componente FacebookPixel está no layout.');
    }
  };
  
  // Aguardar um pouco para o Pixel ter tempo de carregar
  setTimeout(tryTrack, 100);
};

// NutriCheckout_Annual - Início de checkout anual
export const trackNutriCheckoutAnnual = () => {
  console.log('[Facebook Pixel] Tentando rastrear NutriCheckout_Annual...');
  
  // Aguardar Pixel carregar antes de disparar
  let attempts = 0;
  const maxAttempts = 10; // 5 segundos no total
  
  const tryTrack = () => {
    attempts++;
    console.log(`[Facebook Pixel] Tentativa ${attempts} de rastrear NutriCheckout_Annual...`);
    
    if (isPixelLoaded()) {
      console.log('[Facebook Pixel] ✅ Pixel carregado! Disparando NutriCheckout_Annual...');
      trackCustomEvent('NutriCheckout_Annual', {
        content_category: 'NUTRI',
        content_name: 'Checkout Plano Anual',
        value: 1164,
        currency: 'BRL',
        page_location: '/pt/nutri/checkout?plan=annual',
      });
    } else if (attempts < maxAttempts) {
      // Tentar novamente após 500ms se Pixel ainda não carregou
      setTimeout(tryTrack, 500);
    } else {
      console.error('[Facebook Pixel] ❌ Pixel não carregou após 5 segundos. Verifique se o componente FacebookPixel está no layout.');
    }
  };
  
  // Aguardar um pouco para o Pixel ter tempo de carregar
  setTimeout(tryTrack, 100);
};

// NutriPurchase - Compra confirmada (já existe trackPurchase, mas vamos criar específico)
export const trackNutriPurchase = (params: {
  plan_type: 'monthly' | 'annual';
  value: number;
}) => {
  trackCustomEvent('NutriPurchase', {
    content_category: 'NUTRI',
    content_name: params.plan_type === 'annual' ? 'Assinatura Anual' : 'Assinatura Mensal',
    content_ids: params.plan_type === 'annual' ? ['plano-anual-nutri'] : ['plano-mensal-nutri'],
    value: params.value,
    currency: 'BRL',
    num_items: 1,
  });
};

// NutriWorkshopView - Visualização da página de workshop
export const trackNutriWorkshopView = () => {
  console.log('[Facebook Pixel] Tentando rastrear NutriWorkshopView...');
  
  let attempts = 0;
  const maxAttempts = 10;
  
  const tryTrack = () => {
    attempts++;
    console.log(`[Facebook Pixel] Tentativa ${attempts} de rastrear NutriWorkshopView...`);
    
    if (isPixelLoaded()) {
      console.log('[Facebook Pixel] ✅ Pixel carregado! Disparando NutriWorkshopView...');
      trackCustomEvent('NutriWorkshopView', {
        content_category: 'NUTRI',
        page_location: '/pt/nutri/workshop',
      });
    } else if (attempts < maxAttempts) {
      setTimeout(tryTrack, 500);
    } else {
      console.error('[Facebook Pixel] ❌ Pixel não carregou após 5 segundos.');
    }
  };
  
  setTimeout(tryTrack, 100);
};

// NutriWorkshopLead - Inscrição no workshop
export const trackNutriWorkshopLead = () => {
  console.log('[Facebook Pixel] Rastreando NutriWorkshopLead...');
  
  if (isPixelLoaded()) {
    // Evento padrão Lead
    trackLead({
      content_name: 'Inscrição Workshop Nutri',
      content_category: 'NUTRI',
      lead_type: 'workshop_inscricao',
      value: 0,
      currency: 'BRL',
    });
    
    // Evento customizado
    trackCustomEvent('NutriWorkshopLead', {
      content_category: 'NUTRI',
      content_name: 'Inscrição Workshop',
      page_location: '/pt/nutri/workshop',
    });
  } else {
    console.warn('[Facebook Pixel] Pixel não carregado para rastrear NutriWorkshopLead');
  }
};

