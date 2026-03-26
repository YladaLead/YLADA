/** Rótulos da jornada (dias 1–30) para UI — sem acoplamento a prompts legados. */

export type JornadaPhase = 1 | 2 | 3

const PHASE_LABELS: Record<JornadaPhase, string> = {
  1: 'Fundamentos',
  2: 'Captação & Posicionamento',
  3: 'Gestão & Escala',
}

export function getJornadaPhaseFromDay(currentDay: number | null): JornadaPhase {
  if (!currentDay || currentDay <= 0) return 1
  if (currentDay <= 7) return 1
  if (currentDay <= 15) return 2
  return 3
}

export function getJornadaPhaseLabel(phase: JornadaPhase): string {
  return PHASE_LABELS[phase]
}
