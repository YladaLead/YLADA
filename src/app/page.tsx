import { redirect } from 'next/navigation'

/** Raiz: hub PT para escolher segmento. */
export default function HomePage() {
  redirect('/pt/segmentos')
}
