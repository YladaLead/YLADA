'use client'

/**
 * Landing YLADA para Fitness — mesma estrutura da home (dor em destaque, quiz, carrossel, seções).
 * Fluxo: /pt/fitness → diagnóstico com area=4 (sem perguntar área) → /pt/fitness/login ou /pt/fitness/home se logado.
 */
import FitnessInstitutionalContent from './FitnessInstitutionalContent'

export default function FitnessLandingPage() {
  return <FitnessInstitutionalContent />
}
