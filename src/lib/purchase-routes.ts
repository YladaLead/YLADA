/**
 * Rotas de compra/assinatura que NÃO podem aparecer dentro do app iOS
 * (guideline 3.1.1 da Apple — nada de preço, plano ou pagamento fora do IAP).
 *
 * Módulo puro (sem React / sem 'use client') para poder ser usado tanto no
 * guard do cliente quanto no middleware do servidor.
 *
 * Casa por segmento, independente do prefixo de idioma/área:
 * /pt/precos, /pt/{area}/checkout, /pt/wellness/renovar, /pt/wellness/assinar,
 * /pt/nutri/oferta, /pro-lideres/acesso-expirado, /pro-estetica painel assinatura,
 * /cursos/[slug]/venda, /promo/...
 */
const PURCHASE_ROUTE_PATTERNS: RegExp[] = [
  /\/precos(\/|$)/,
  /\/checkout(\/|$)/,
  /\/renovar(\/|$)/,
  /\/assinar(\/|$)/,
  /\/assinatura(-equipe)?(\/|$)/,
  /\/oferta(\/|$)/,
  /\/acesso-expirado(\/|$)/,
  /\/cursos\/[^/]+\/venda(\/|$)/,
  /\/promo\//,
]

export function isPurchasePageRoute(pathname: string): boolean {
  if (!pathname) return false
  return PURCHASE_ROUTE_PATTERNS.some((re) => re.test(pathname))
}

/**
 * É uma requisição vinda do nosso app iOS nativo (WKWebView/Capacitor "puro")?
 * Detecção por user-agent no servidor, com denylist dos navegadores embutidos
 * conhecidos (Instagram, Facebook, etc.) para NÃO bloquear tráfego de anúncios.
 *
 * O WKWebView padrão do Capacitor (sem appendUserAgent) não traz "Safari/";
 * o Safari real e os in-app browsers conhecidos são deixados passar.
 */
export function isIOSNativeAppUserAgent(ua: string): boolean {
  if (!ua) return false
  if (!/(iPhone|iPad|iPod)/.test(ua)) return false
  if (/Safari\//.test(ua)) return false
  // Navegadores embutidos de terceiros — deixar passar (não é o nosso app).
  if (/(Instagram|FBAN|FBAV|FBIOS|FB_IAB|Line\/|MicroMessenger|Twitter|TikTok|musical_ly|Snapchat|Pinterest|LinkedInApp|GSA\/|CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|YaBrowser)/i.test(ua)) return false
  return true
}
