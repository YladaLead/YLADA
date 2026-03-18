'use client'

/**
 * Landing YLADA para Vendedores — mesma estrutura da home (dor em destaque, quiz, carrossel, seções).
 * Fluxo: /pt/seller → diagnóstico com area=5 (sem perguntar área) → /pt/seller/login ou /pt/seller/home se logado.
 */
import SellerInstitutionalContent from './SellerInstitutionalContent'

export default function SellerLandingPage() {
  return <SellerInstitutionalContent />
}
