'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface FacebookPixelProps {
  pixelId: string
}

/**
 * Componente Facebook Pixel
 * Instala e inicializa o Pixel do Facebook em todas as páginas
 * 
 * Uso:
 * <FacebookPixel pixelId="SEU_PIXEL_ID" />
 */
export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  useEffect(() => {
    console.log('[Facebook Pixel] Componente montado com Pixel ID:', pixelId);
    
    // Verificar se o Pixel carregou após um tempo
    const checkPixel = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        console.log('[Facebook Pixel] ✅ Pixel carregado com sucesso!');
      } else {
        console.warn('[Facebook Pixel] ⚠️ Pixel ainda não carregou após 2 segundos');
      }
    }, 2000);
    
    return () => clearTimeout(checkPixel);
  }, [pixelId])

  if (!pixelId) {
    console.warn('[Facebook Pixel] Pixel ID não fornecido')
    return null
  }

  return (
    <>
      {/* Facebook Pixel Code */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* Noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

