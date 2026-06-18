'use client'

/**
 * Cliente RevenueCat para o app iOS (Capacitor / StoreKit).
 *
 * Tudo aqui é carregado por IMPORT DINÂMICO do plugin nativo, então o bundle
 * web/SSR nunca precisa do `@revenuecat/purchases-capacitor`. Só roda dentro do
 * app iOS (guardado por isIOSNativeApp pelos chamadores).
 *
 * Requer: `npm install @revenuecat/purchases-capacitor` + `npx cap sync ios`.
 * Variável: NEXT_PUBLIC_RC_IOS_API_KEY (chave PÚBLICA "appl_..." do RevenueCat).
 */

import { isIOSNativeApp } from '@/lib/native-app'
import { RC_ENTITLEMENT_PRO } from '@/lib/revenuecat'

// Chave PÚBLICA do RevenueCat (Apple). É feita pra ir embutida no app, então
// pode ficar no código; env sobrescreve se um dia precisar rotacionar.
export const RC_IOS_API_KEY =
  process.env.NEXT_PUBLIC_RC_IOS_API_KEY || 'appl_AAEkysWQRKtOlQVwMqhkZtNBPhl'

let _configured = false
let _purchasesPromise: Promise<any> | null = null

/** Carrega o plugin nativo só quando necessário (import dinâmico). */
async function loadPurchases(): Promise<any | null> {
  if (!isIOSNativeApp()) return null
  if (!_purchasesPromise) {
    _purchasesPromise = import('@revenuecat/purchases-capacitor')
      .then((m: any) => m.Purchases)
      .catch((err) => {
        console.error('RevenueCat: falha ao carregar plugin', err)
        _purchasesPromise = null
        return null
      })
  }
  return _purchasesPromise
}

/**
 * Configura o SDK (idempotente). Opcionalmente já entra logado no userId.
 * Deve ser chamado cedo no app, antes de buscar ofertas ou comprar.
 */
export async function configureRevenueCat(appUserId?: string): Promise<boolean> {
  const Purchases = await loadPurchases()
  if (!Purchases) return false
  if (!RC_IOS_API_KEY) {
    console.error('RevenueCat: NEXT_PUBLIC_RC_IOS_API_KEY ausente')
    return false
  }
  try {
    if (!_configured) {
      await Purchases.configure({
        apiKey: RC_IOS_API_KEY,
        ...(appUserId ? { appUserID: appUserId } : {}),
      })
      _configured = true
    } else if (appUserId) {
      await Purchases.logIn({ appUserID: appUserId })
    }
    return true
  } catch (err) {
    console.error('RevenueCat: erro no configure', err)
    return false
  }
}

/** Vincula o comprador da Apple ao user_id do Supabase (app_user_id = user.id). */
export async function logInRevenueCat(userId: string): Promise<void> {
  const Purchases = await loadPurchases()
  if (!Purchases || !userId) return
  try {
    if (!_configured) {
      await configureRevenueCat(userId)
      return
    }
    await Purchases.logIn({ appUserID: userId })
  } catch (err) {
    console.error('RevenueCat: erro no logIn', err)
  }
}

/** Retorna a oferta padrão (current) com seus pacotes (mensal/anual). */
export async function getCurrentOffering(): Promise<any | null> {
  const Purchases = await loadPurchases()
  if (!Purchases) return null
  try {
    const offerings = await Purchases.getOfferings()
    return offerings?.current ?? null
  } catch (err) {
    console.error('RevenueCat: erro ao buscar offerings', err)
    return null
  }
}

/** Compra um pacote. Retorna true se o entitlement "pro" ficou ativo. */
export async function purchasePackage(pkg: any): Promise<{ ok: boolean; cancelled?: boolean; error?: string }> {
  const Purchases = await loadPurchases()
  if (!Purchases) return { ok: false, error: 'plugin indisponível' }
  try {
    const result = await Purchases.purchasePackage({ aPackage: pkg })
    const active = result?.customerInfo?.entitlements?.active?.[RC_ENTITLEMENT_PRO]
    return { ok: !!active }
  } catch (err: any) {
    const code = String(err?.code ?? '')
    const msg = String(err?.message ?? '').toLowerCase()
    if (
      err?.userCancelled === true ||
      code === '1' ||
      /cancel/i.test(code) ||
      msg.includes('cancel')
    ) {
      return { ok: false, cancelled: true }
    }
    console.error('RevenueCat: erro na compra', err)
    return { ok: false, error: err?.message || 'erro na compra' }
  }
}

/** Restaura compras anteriores (ex.: troca de aparelho). Retorna true se "pro" ativo. */
export async function restorePurchases(): Promise<boolean> {
  const Purchases = await loadPurchases()
  if (!Purchases) return false
  try {
    const info = await Purchases.restorePurchases()
    return !!info?.customerInfo?.entitlements?.active?.[RC_ENTITLEMENT_PRO]
  } catch (err) {
    console.error('RevenueCat: erro ao restaurar', err)
    return false
  }
}

/** Checa, no cliente, se o entitlement "pro" está ativo agora. */
export async function hasProEntitlement(): Promise<boolean> {
  const Purchases = await loadPurchases()
  if (!Purchases) return false
  try {
    const info = await Purchases.getCustomerInfo()
    return !!info?.customerInfo?.entitlements?.active?.[RC_ENTITLEMENT_PRO]
  } catch {
    return false
  }
}
