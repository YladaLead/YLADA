'use client'

/**
 * Landing YLADA para Odontologia — mesma estrutura da home (dor em destaque, quiz, carrossel, seções).
 * Fluxo: /pt/odonto → diagnóstico com area=6&fromArea=odonto (sem perguntar área, tipo=0) → /pt/odonto/login ou /pt/odonto/home se logado.
 */
import OdontoInstitutionalContent from './OdontoInstitutionalContent'

export default function OdontoLandingPage() {
  return <OdontoInstitutionalContent />
}
