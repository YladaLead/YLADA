'use client'

/**
 * Landing YLADA para Psicologia — mesma estrutura da home (dor em destaque, quiz, carrossel, seções).
 * Fluxo por área: /pt/psi → diagnóstico com area=1 (sem perguntar área) → /pt/psi/login ou /pt/psi/home se logado.
 */
import PsiInstitutionalContent from './PsiInstitutionalContent'

export default function PsiLandingPage() {
  return <PsiInstitutionalContent />
}
